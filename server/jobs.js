/* Offres d'emploi : API officielle « Offres d'emploi v2 » de France Travail (francetravail.io).
   Identifiants : FRANCE_TRAVAIL_CLIENT_ID et FRANCE_TRAVAIL_CLIENT_SECRET (application déclarée sur
   francetravail.io et abonnée à l'API « Offres d'emploi v2 »). Aucune IA ici : la recherche et le
   classement par rapport au CV ne consomment aucun crédit. */
import fs from 'node:fs';
import { bad } from './gemini.js';

const TOKEN_URL = 'https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire';
const API = 'https://api.francetravail.io/partenaire/offresdemploi/v2';
const ID = () => process.env.FRANCE_TRAVAIL_CLIENT_ID || '';
const SECRET = () => process.env.FRANCE_TRAVAIL_CLIENT_SECRET || '';
// Jeu de réponses enregistrées pour le développement local uniquement (jamais sur Vercel).
const MOCK = () => (!process.env.VERCEL && process.env.FRANCE_TRAVAIL_MOCK) || '';

export const jobsEnabled = () => !!((ID() && SECRET()) || MOCK());

let tok = null; // { value, exp }
async function token() {
  if (tok && tok.exp > Date.now() + 30_000) return tok.value;
  const body = new URLSearchParams({ grant_type: 'client_credentials', client_id: ID(), client_secret: SECRET(), scope: 'api_offresdemploiv2 o2dsoffre' });
  const r = await fetch(TOKEN_URL, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body, signal: AbortSignal.timeout(15_000) });
  if (!r.ok) {
    console.error('[offres] jeton refusé', r.status, (await r.text()).slice(0, 200));
    throw Object.assign(new Error('Connexion à France Travail impossible. Vérifiez les identifiants de l’application.'), { status: 502, expose: true });
  }
  const j = await r.json();
  tok = { value: j.access_token, exp: Date.now() + (Number(j.expires_in) || 1200) * 1000 };
  return tok.value;
}

async function get(path, params) {
  const url = API + path + (params ? '?' + new URLSearchParams(params) : '');
  for (let attempt = 0; attempt < 2; attempt++) {
    const r = await fetch(url, { headers: { authorization: 'Bearer ' + (await token()), accept: 'application/json' }, signal: AbortSignal.timeout(20_000) });
    if (r.status === 401 && !attempt) { tok = null; continue; }
    if (r.status === 204) return null; // aucune offre
    if (r.status === 429) throw Object.assign(new Error('France Travail limite le nombre de recherches : réessayez dans quelques secondes.'), { status: 429, expose: true });
    if (!r.ok && r.status !== 206) {
      let msg = '';
      try { msg = (await r.json()).message || ''; } catch { /* corps vide */ }
      console.error('[offres]', r.status, msg.slice(0, 200));
      throw Object.assign(new Error(r.status === 400 ? 'Recherche refusée par France Travail : ' + (msg || 'paramètres invalides') : 'France Travail ne répond pas. Réessayez plus tard.'), { status: r.status === 400 ? 400 : 502, expose: true });
    }
    return { json: await r.json(), range: r.headers.get('content-range') || '' };
  }
}

/* Référentiel des communes, gardé en mémoire : permet de chercher par nom de ville. */
let communes = null;
const plain = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
async function communesList() {
  if (!communes) communes = ((await get('/referentiel/communes')) || { json: [] }).json;
  return communes;
}
/* Lieu saisi → paramètres France Travail : département (« 69 », « 2A »), ville ou toute la France. */
async function where(text) {
  const t = String(text || '').trim();
  if (!t || /^(france|toute la france|partout)$/i.test(t)) return {};
  if (/^(\d{2,3}|2a|2b)$/i.test(t)) return { departement: t.toUpperCase() };
  // Paris, Lyon et Marseille n'existent qu'en arrondissements dans le référentiel : on cherche dans le département.
  const big = { paris: '75', lyon: '69', marseille: '13' }[plain(t)];
  if (big) return { departement: big };
  const cp = t.match(/\b(\d{5})\b/);
  const list = await communesList();
  const name = plain(t.replace(/\b\d{5}\b/, ''));
  const hit = list.find(c => (cp && c.codePostal === cp[1]) || plain(c.libelle) === name) || list.find(c => plain(c.libelle).startsWith(name));
  if (!hit) throw bad('Lieu introuvable : saisissez une ville, un code postal ou un numéro de département.');
  return { commune: hit.code, distance: '20' };
}

const CONTRACTS = ['CDI', 'CDD', 'MIS', 'SAI', 'LIB', 'FRA', 'CCE', 'DIN', 'DDI', 'TTI'];

function shape(o) {
  const lt = o.lieuTravail || {};
  return {
    id: String(o.id || ''),
    title: String(o.intitule || ''),
    company: (o.entreprise && o.entreprise.nom) || '',
    city: lt.libelle || '',
    contract: o.typeContratLibelle || o.typeContrat || '',
    contractCode: o.typeContrat || '',
    duration: o.dureeTravailLibelle || '',
    salary: (o.salaire && o.salaire.libelle) || '',
    experience: o.experienceLibelle || '',
    alternance: !!o.alternance,
    date: o.dateCreation || '',
    skills: (o.competences || []).map(c => c.libelle).filter(Boolean).slice(0, 12),
    description: String(o.description || '').slice(0, 6000),
    url: (o.origineOffre && o.origineOffre.urlOrigine) || `https://candidat.francetravail.fr/offres/recherche/detail/${encodeURIComponent(o.id || '')}`,
  };
}

export async function searchJobs({ q, place, contract, since, page }) {
  const motsCles = String(q || '').replace(/[^\p{L}\p{N}+#.,' -]/gu, ' ').trim().slice(0, 120);
  if (!motsCles) throw bad('Indiquez un métier ou des mots-clés.');
  if (MOCK()) return mockSearch(motsCles);
  if (!jobsEnabled()) throw Object.assign(new Error('La recherche d’offres n’est pas encore activée sur ce serveur.'), { status: 503, expose: true });
  const p = Math.max(0, Math.min(19, Number(page) || 0));
  const params = { motsCles, range: `${p * 50}-${p * 50 + 49}`, sort: '1', ...(await where(place)) };
  if (CONTRACTS.includes(contract)) params.typeContrat = contract;
  if ([1, 3, 7, 14, 31].includes(Number(since))) params.publieeDepuis = String(since);
  const r = await get('/offres/search', params);
  if (!r) return { total: 0, offers: [] };
  const total = Number((r.range.match(/\/(\d+)/) || [])[1]) || (r.json.resultats || []).length;
  return { total, offers: (r.json.resultats || []).map(shape) };
}

function mockSearch(q) {
  const data = JSON.parse(fs.readFileSync(MOCK(), 'utf8'));
  const offers = (data.resultats || []).map(shape);
  return { total: offers.length, offers, mock: true, q };
}
