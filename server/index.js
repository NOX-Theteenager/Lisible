import 'dotenv/config';
import express from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { TASKS } from './tasks.js';
import { writeLetter, streamLetter } from './claude.js';
import { fetchOfferPage } from './fetch-offer.js';
import { securityHeaders } from './security.js';
import { reqCtx } from './context.js';
import { createLiveSession, liveEnabled } from './live.js';
import { searchJobs, jobsEnabled } from './jobs.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const PORT = Number(process.env.PORT || 3000);

const SUPABASE_URL = (() => { try { return new URL(process.env.SUPABASE_URL).origin; } catch { return ''; } })();
const SUPABASE_ANON_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supa = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } }) : null;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(securityHeaders);
app.use(express.json({ limit: '4mb' }));
// Objectif de la personne (emploi ou études), transmis avec chaque demande d'IA.
app.use((req, _res, next) => reqCtx.run({ track: req.body && req.body.track === 'study' ? 'study' : 'job' }, next));

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
    ai: { gemini: !!process.env.GEMINI_API_KEY, claude: !!process.env.ANTHROPIC_API_KEY, live: liveEnabled(), jobs: jobsEnabled() },
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

app.post('/api/letter/stream', identify, limiter, (req, res) => streamLetter(req.body || {}, res));

/* Jeton éphémère pour l'entretien vocal : limité à 5 par minute et par personne. */
const liveLimiter = rateLimit({ windowMs: 60_000, limit: 5, keyGenerator: req => (req.user ? 'u:' + req.user.id : 'ip:' + ipKeyGenerator(req.ip)), standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Trop de simulations lancées. Réessayez dans une minute.' } });
app.post('/api/live/session', identify, liveLimiter, async (req, res) => {
  try { res.set('Cache-Control', 'no-store').json(await createLiveSession(req.body || {})); } catch (e) { fail(res, e); }
});

/* Offres d'emploi France Travail (sans IA). */
app.post('/api/jobs/search', identify, limiter, async (req, res) => {
  try { res.set('Cache-Control', 'no-store').json(await searchJobs(req.body || {})); } catch (e) { fail(res, e); }
});

app.post('/api/pdf', identify, limiter, async (req, res) => {
  try {
    const { renderPdf } = await import('./pdf.js');
    const pdf = await renderPdf({ html: req.body && req.body.html, margin: req.body && req.body.margin });
    const name = String((req.body && req.body.name) || 'document').replace(/[^\w.-]+/g, '_').slice(0, 80) || 'document';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${name}.pdf"`);
    res.send(pdf);
  } catch (e) { fail(res, e); }
});

app.post('/api/offer/fetch', identify, limiter, async (req, res) => {
  try {
    const page = await fetchOfferPage(String(req.body && req.body.url || ''));
    const offer = await TASKS.extractOffer({ text: page.text, url: page.url });
    res.json({ ...offer, host: page.host });
  } catch (e) { fail(res, e); }
});

/* Fichiers de l'application. En développement : Vite (rechargement à chaud) ; en production : dist/.
   Sur Vercel, dist/ est servi directement par le CDN et seule l'API passe par ce serveur. */
const DEV = !process.env.VERCEL && process.env.NODE_ENV !== 'production';
const web = path.join(root, DEV ? 'public' : 'dist');
for (const page of ['confidentialite', 'conditions', 'mentions-legales']) app.get('/' + page, (_q, r) => r.sendFile(path.join(web, page + '.html')));
app.get('/r/:token', (_q, r) => r.sendFile(path.join(web, 'review.html')));
if (DEV) {
  const { createServer } = await import('vite');
  const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
} else {
  app.use(express.static(web, { extensions: ['html'] }));
  app.get(/^\/(?!api\/).*/, (_q, r) => r.sendFile(path.join(web, 'index.html')));
}

export default app;

if (!process.env.VERCEL) app.listen(PORT, () => {
  console.log(`Lisible sur http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) console.warn('⚠ GEMINI_API_KEY manquante : les fonctions IA (Gemini) renverront une erreur.');
  if (!process.env.ANTHROPIC_API_KEY) console.warn('⚠ ANTHROPIC_API_KEY manquante : la rédaction de lettre (Claude) renverra une erreur.');
  if (!supa) console.warn('⚠ SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY manquantes : comptes et synchronisation désactivés.');
});
