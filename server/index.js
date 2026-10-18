import 'dotenv/config';
import express from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { TASKS } from './tasks.js';
import { writeLetter } from './claude.js';
import { fetchOfferPage } from './fetch-offer.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const PORT = Number(process.env.PORT || 3000);

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const supa = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } }) : null;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '20mb' }));

/* Identifie l'utilisateur Supabase (facultatif : les invités peuvent utiliser l'IA avec une limite plus basse). */
async function identify(req, _res, next) {
  req.user = null;
  const h = req.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (token && supa) {
    try { const { data } = await supa.auth.getUser(token); req.user = data && data.user || null; } catch { /* invité */ }
  }
  next();
}

const limiter = rateLimit({
  windowMs: 60_000,
  limit: req => (req.user ? Number(process.env.RATE_LIMIT_USER || 60) : Number(process.env.RATE_LIMIT_GUEST || 15)),
  keyGenerator: req => (req.user ? 'u:' + req.user.id : 'ip:' + ipKeyGenerator(req.ip)),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Trop de requêtes. Réessayez dans une minute.' },
});

app.get('/api/config', (_req, res) => {
  res.json({
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
    ai: { gemini: !!process.env.GEMINI_API_KEY, claude: !!process.env.ANTHROPIC_API_KEY },
  });
});

const fail = (res, e) => {
  const status = e.status && e.status >= 400 && e.status < 600 ? e.status : 500;
  console.error('[api]', e.message);
  res.status(status).json({ error: e.expose ? e.message : status === 500 ? 'Le service d’IA n’a pas pu traiter la demande. Réessayez.' : e.message });
};

app.post('/api/ai/:task', identify, limiter, async (req, res) => {
  const fn = TASKS[req.params.task];
  if (!fn) return res.status(404).json({ error: 'Tâche inconnue' });
  try { res.json(await fn(req.body || {})); } catch (e) { fail(res, e); }
});

app.post('/api/letter', identify, limiter, async (req, res) => {
  try { res.json(await writeLetter(req.body || {})); } catch (e) { fail(res, e); }
});

app.post('/api/offer/fetch', identify, limiter, async (req, res) => {
  try {
    const page = await fetchOfferPage(String(req.body && req.body.url || ''));
    const offer = await TASKS.extractOffer({ text: page.text, url: page.url });
    res.json({ ...offer, host: page.host });
  } catch (e) { fail(res, e); }
});

/* Fichiers statiques : l'application et les bibliothèques navigateur servies localement. */
const nm = p => path.join(root, 'node_modules', p);
app.get('/vendor/pdf.min.mjs', (_q, r) => r.type('text/javascript').sendFile(nm('pdfjs-dist/build/pdf.min.mjs')));
app.get('/vendor/pdf.worker.min.mjs', (_q, r) => r.type('text/javascript').sendFile(nm('pdfjs-dist/build/pdf.worker.min.mjs')));
app.get('/vendor/mammoth.browser.min.js', (_q, r) => r.sendFile(nm('mammoth/mammoth.browser.min.js')));
app.get('/vendor/docx.js', (_q, r) => r.type('text/javascript').sendFile(nm('docx/dist/index.iife.js')));
app.get('/vendor/jszip.min.js', (_q, r) => r.sendFile(nm('jszip/dist/jszip.min.js')));
app.get('/vendor/supabase.js', (_q, r) => r.sendFile(nm('@supabase/supabase-js/dist/umd/supabase.js')));
app.get('/r/:token', (_q, r) => r.sendFile(path.join(root, 'public', 'review.html')));
app.use(express.static(path.join(root, 'public'), { extensions: ['html'] }));

app.listen(PORT, () => {
  console.log(`Lisible sur http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) console.warn('⚠ GEMINI_API_KEY manquante : les fonctions IA (Gemini) renverront une erreur.');
  if (!process.env.ANTHROPIC_API_KEY) console.warn('⚠ ANTHROPIC_API_KEY manquante : la rédaction de lettre (Claude) renverra une erreur.');
  if (!supa) console.warn('⚠ SUPABASE_URL / SUPABASE_ANON_KEY manquantes : comptes et synchronisation désactivés.');
});
