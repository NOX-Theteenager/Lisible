/* Génération de PDF texte (sélectionnable, lisible par les ATS) avec Chromium sans interface.
   Sécurité : JavaScript désactivé, aucune requête réseau autorisée (seules les polices locales
   et les images intégrées en data: sont servies), taille du document limitée. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { bad } from './gemini.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const FONT_DIR = path.join(here, 'pdf-fonts');
const FONT_CSS = fs.readFileSync(path.join(FONT_DIR, 'fonts.css'), 'utf8');
const FONT_HOST = 'https://fonts.lisible.invalid/';
const MAX_HTML = 3_500_000;

let browserP = null;
async function browser() {
  if (browserP) {
    const b = await browserP.catch(() => null);
    if (b && b.connected) return b;
  }
  browserP = (async () => {
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      const { default: chromium } = await import('@sparticuz/chromium');
      return puppeteer.launch({ args: await puppeteer.defaultArgs({ args: chromium.args, headless: 'shell' }), executablePath: await chromium.executablePath(), headless: 'shell' });
    }
    const exe = process.env.CHROME_PATH || ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(p => fs.existsSync(p));
    if (!exe) { const e = new Error('Chrome introuvable : définissez CHROME_PATH pour générer les PDF en local.'); e.status = 503; e.expose = true; throw e; }
    return puppeteer.launch({ executablePath: exe, headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  })();
  return browserP;
}

/* html : document complet ou fragment ; renvoie un Buffer PDF A4. */
export async function renderPdf({ html, margin }) {
  const doc = String(html || '');
  if (!doc.trim()) throw bad('Document vide');
  if (doc.length > MAX_HTML) throw bad('Document trop volumineux pour le PDF.');
  const full = /<html[\s>]/i.test(doc) ? doc : `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${doc}</body></html>`;
  const withFonts = full.replace(/<head([^>]*)>/i, `<head$1><style>${FONT_CSS}</style>`);
  const b = await browser();
  const page = await b.newPage();
  try {
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on('request', req => {
      const url = req.url();
      if (url.startsWith(FONT_HOST)) {
        const file = path.basename(new URL(url).pathname);
        const p = path.join(FONT_DIR, file);
        if (/^[\w.-]+\.woff2$/.test(file) && fs.existsSync(p)) return req.respond({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(p) });
        return req.abort();
      }
      if (url.startsWith('data:') || url === 'about:blank') return req.continue();
      return req.abort();
    });
    await page.setContent(withFonts, { waitUntil: 'networkidle0', timeout: 20_000 });
    await page.evaluateHandle('document.fonts.ready').catch(() => {});
    return Buffer.from(await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true, margin: margin || { top: '0', right: '0', bottom: '0', left: '0' } }));
  } finally {
    await page.close().catch(() => {});
  }
}
