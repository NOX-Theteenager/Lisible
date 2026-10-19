import dns from 'node:dns/promises';
import net from 'node:net';
import { bad } from './gemini.js';

/* Refuse les adresses internes (protection SSRF). */
function isPrivate(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  const l = ip.toLowerCase();
  if (l.startsWith('::ffff:')) return isPrivate(l.slice(7));
  return l === '::1' || l === '::' || l.startsWith('fc') || l.startsWith('fd') || l.startsWith('fe80');
}

async function assertPublic(u) {
  if (!/^https?:$/.test(u.protocol)) throw bad('Lien invalide : utilisez une adresse http(s).');
  const addrs = await dns.lookup(u.hostname, { all: true }).catch(() => { throw bad('Site introuvable : vérifiez le lien.'); });
  if (!addrs.length || addrs.some(a => isPrivate(a.address))) throw bad('Ce lien n’est pas accessible publiquement.');
}

const decode = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

/* Les sites d'emploi publient presque tous un JSON-LD « JobPosting » : c'est la source la plus fiable. */
function jobPosting(html) {
  const re = /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const data = JSON.parse(m[1].trim());
      const list = [].concat(data['@graph'] || data);
      const jp = list.find(x => x && (x['@type'] === 'JobPosting' || (Array.isArray(x['@type']) && x['@type'].includes('JobPosting'))));
      if (jp) {
        const org = jp.hiringOrganization && (jp.hiringOrganization.name || jp.hiringOrganization);
        const loc = [].concat(jp.jobLocation || []).map(l => l && l.address && [l.address.addressLocality, l.address.addressCountry].filter(Boolean).join(', ')).filter(Boolean).join(' ; ');
        return [`Poste : ${jp.title || ''}`, org ? `Entreprise : ${typeof org === 'string' ? org : ''}` : '', loc ? `Lieu : ${loc}` : '', jp.employmentType ? `Contrat : ${[].concat(jp.employmentType).join(', ')}` : '', '', htmlToText(decode(String(jp.description || '')))].filter(x => x !== null).join('\n');
      }
    } catch { /* JSON-LD invalide : on ignore */ }
  }
  return '';
}

function htmlToText(html) {
  return decode(html
    .replace(/<(script|style|noscript|svg|nav|footer|header|form|iframe)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/(p|div|h[1-6]|li|ul|ol|section|article|br|tr)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' '))
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

export async function fetchOfferPage(raw) {
  let u;
  try { u = new URL(/^https?:\/\//i.test(raw) ? raw : 'https://' + raw); } catch { throw bad('Lien invalide.'); }
  let html = '', finalUrl = u;
  for (let hop = 0; hop < 5; hop++) {
    await assertPublic(finalUrl);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15_000);
    let res;
    try {
      res = await fetch(finalUrl, { redirect: 'manual', signal: ctrl.signal, headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36', 'accept-language': 'fr-FR,fr;q=0.9,en;q=0.8', accept: 'text/html,application/xhtml+xml' } });
    } catch { throw bad('Impossible de joindre cette page.'); } finally { clearTimeout(timer); }
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) { finalUrl = new URL(res.headers.get('location'), finalUrl); continue; }
    if (!res.ok) throw bad(res.status === 403 || res.status === 999 ? 'Ce site bloque la lecture automatique : copiez le texte de l’annonce ou faites une capture.' : 'La page a répondu ' + res.status + '.');
    const type = res.headers.get('content-type') || '';
    if (type && !/text\/html|application\/xhtml|text\/plain/i.test(type)) throw bad(/pdf/i.test(type) ? 'Ce lien mène à un PDF : téléchargez-le puis utilisez l’onglet « PDF ».' : 'Ce lien ne mène pas à une page d’offre lisible.');
    const len = Number(res.headers.get('content-length') || 0);
    if (len > 5_000_000) throw bad('Page trop volumineuse.');
    html = (await res.text()).slice(0, 3_000_000);
    break;
  }
  if (!html) throw bad('Trop de redirections.');
  const title = (/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html) || [])[1] || '';
  const text = jobPosting(html) || htmlToText(html);
  if (text.length < 200) throw bad('La page ne contient pas de texte lisible (site chargé en JavaScript ou connexion requise) : copiez le texte de l’annonce ou faites une capture.');
  return { url: finalUrl.href, host: finalUrl.hostname.replace(/^www\./, ''), text: (title ? decode(title.trim()) + '\n\n' : '') + text.slice(0, 50_000) };
}
