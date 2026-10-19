/* Recherche de formations en France à partir des données ouvertes du ministère de l'Enseignement
   supérieur (data.enseignementsup-recherche.gouv.fr, licence ouverte) :
   - Parcoursup (première année : licences, BUT, BTS, écoles, classes préparatoires…) ;
   - Mon Master (masters, première année).
   Chaque formation vient avec ses places, le nombre de candidatures et le taux d'accès de la dernière
   session publiée. Aucune clé ni IA : gratuit. Réponses gardées une heure en mémoire. */
import { bad } from './gemini.js';

const API = 'https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets';
const cache = new Map();
const clean = (s, n) => String(s || '').replace(/["\\*]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);

async function records(dataset, params) {
  const url = `${API}/${dataset}/records?${new URLSearchParams(params)}`;
  const hit = cache.get(url);
  if (hit && hit.exp > Date.now()) return hit.value;
  const r = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(20_000) });
  if (!r.ok) {
    console.error('[formations]', dataset, r.status, (await r.text()).slice(0, 200));
    throw Object.assign(new Error('Le service de données de l’enseignement supérieur ne répond pas. Réessayez plus tard.'), { status: 502, expose: true });
  }
  const value = await r.json();
  cache.set(url, { value, exp: Date.now() + 3600_000 });
  if (cache.size > 300) cache.delete(cache.keys().next().value);
  return value;
}

/* Dernière session publiée de Mon Master (les données des sessions précédentes restent dans le jeu). */
let mmSession = null;
async function latestMasterSession() {
  if (mmSession && mmSession.exp > Date.now()) return mmSession.value;
  const j = await records('fr-esr-mon_master', { select: 'session', group_by: 'session', order_by: 'session desc', limit: '1' });
  const value = String((j.results && j.results[0] && j.results[0].session) || new Date().getFullYear() - 1);
  mmSession = { value, exp: Date.now() + 6 * 3600_000 };
  return value;
}

const pct = (a, b) => (b > 0 ? Math.max(0, Math.min(100, Math.round((100 * a) / b))) : null);

export async function searchPrograms({ level, q, place, page }) {
  if (level === 'ingenieur') return searchEngineering({ q, page });
  const query = clean(q, 100);
  if (query.length < 2) throw bad('Indiquez un domaine ou un intitulé de formation (ex. finance, informatique, droit).');
  const where = clean(place, 60);
  const offset = String(Math.max(0, Math.min(10, Number(page) || 0)) * 30);

  if (level === 'master') {
    const session = await latestMasterSession();
    const w = [`session="${session}"`, `search("${query}")`];
    if (where) w.push(`(lieux like "*${where}*" or acad_lib like "${where}*" or lieu_reg_acad_lib like "${where}*")`);
    const j = await records('fr-esr-mon_master', {
      where: w.join(' and '),
      select: 'ifc,eta_nom,mention,parcours,lieux,alternance,modalite_enseignement,col,n_can_pp,n_prop_total,disci_lib',
      order_by: 'n_can_pp desc',
      limit: '30',
      offset,
    });
    return {
      level: 'master',
      session,
      total: j.total_count || 0,
      items: (j.results || []).map((r) => ({
        id: 'mm' + r.ifc,
        school: r.eta_nom || '',
        // Le parcours n'est ajouté que s'il diffère de la mention (« Master Finance · Audit financier »).
        program: ['Master ' + String(r.mention || '').toLowerCase().replace(/^\w/, (c) => c.toUpperCase()), String(r.parcours || '').toLowerCase() === String(r.mention || '').toLowerCase() ? '' : r.parcours].filter(Boolean).join(' · '),
        city: String(r.lieux || '').split('|')[0].replace(/^.* - /, '').trim(),
        kind: r.disci_lib || '',
        alternance: String(r.alternance) === '1',
        places: Number(r.col) || null,
        applicants: Number(r.n_can_pp) || null,
        rate: pct(Number(r.n_prop_total) || 0, Number(r.n_can_pp) || 0),
        rateLabel: 'propositions / candidatures',
        url: 'https://www.monmaster.gouv.fr/',
        platform: 'monmaster',
      })),
    };
  }

  const w = [`search("${query}")`];
  if (where) w.push(`(ville_etab like "${where}*" or dep_lib like "${where}*" or region_etab_aff like "${where}*")`);
  const j = await records('fr-esr-parcoursup', {
    where: w.join(' and '),
    select: 'cod_aff_form,session,g_ea_lib_vx,lib_for_voe_ins,ville_etab,dep,fili,contrat_etab,select_form,capa_fin,voe_tot,taux_acces_ens,lien_form_psup',
    order_by: 'voe_tot desc',
    limit: '30',
    offset,
  });
  return {
    level: 'licence',
    session: (j.results && j.results[0] && j.results[0].session) || '',
    total: j.total_count || 0,
    items: (j.results || []).map((r) => ({
      id: 'ps' + r.cod_aff_form,
      school: r.g_ea_lib_vx || '',
      program: r.lib_for_voe_ins || r.fili || '',
      city: [r.ville_etab, r.dep ? '(' + r.dep + ')' : ''].filter(Boolean).join(' '),
      kind: [r.fili, r.contrat_etab, r.select_form].filter(Boolean).join(' · '),
      alternance: false,
      places: Number(r.capa_fin) || null,
      applicants: Number(r.voe_tot) || null,
      rate: r.taux_acces_ens == null ? null : Number(r.taux_acces_ens),
      rateLabel: 'taux d’accès',
      url: r.lien_form_psup || 'https://www.parcoursup.gouv.fr/',
      platform: 'parcoursup',
    })),
  };
}

/* ─── Diplômes d'ingénieur : catalogue Idéo de l'ONISEP (données ouvertes, mis à jour ~10 fois par an) ───
   Parcoursup ne couvre que les écoles recrutant après le bac, et Mon Master que les masters : les écoles
   qui recrutent après un bac+2 ou bac+3 (concours, admissions sur titres) n'apparaissent que dans ce catalogue. */
const ONISEP_CSV = 'https://api.opendata.onisep.fr/downloads/5fa591127f501/5fa591127f501.csv';
let onisep = null; // { rows, exp }

/* Lecture CSV (séparateur « ; », champs entre guillemets). */
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ';') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const plain = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

async function engineeringRows() {
  if (onisep && onisep.exp > Date.now()) return onisep.rows;
  const r = await fetch(ONISEP_CSV, { signal: AbortSignal.timeout(30_000) });
  if (!r.ok) throw Object.assign(new Error('Le catalogue de l’ONISEP ne répond pas. Réessayez plus tard.'), { status: 502, expose: true });
  const [head, ...data] = parseCsv((await r.text()).replace(/^﻿/, ''));
  const col = (name) => head.findIndex((h) => plain(h).replace(/"/g, '') === plain(name));
  const C = { type: col('libellé type formation'), name: col('libellé formation principal'), sigle: col('sigle formation'), dur: col('durée'), url: col('URL et ID Onisep'), dom: col('domaine/sous-domaine') };
  const rows = data
    .filter((x) => /diplome d'ingenieur|cycle preparatoire integre/.test(plain(x[C.type])))
    .map((x) => ({ type: x[C.type], name: x[C.name], sigle: x[C.sigle], dur: x[C.dur], url: x[C.url], dom: x[C.dom], key: plain([x[C.name], x[C.sigle], x[C.dom]].join(' ')) }));
  onisep = { rows, exp: Date.now() + 24 * 3600_000 };
  return rows;
}

/* Niveau d'entrée déduit du type et de la durée de la formation. */
function entryOf(r) {
  const t = plain(r.type), years = parseInt(r.dur, 10);
  if (/cycle preparatoire integre/.test(t)) return 'Après le bac (Parcoursup), cycle préparatoire intégré de 2 ans';
  if (/specialise/.test(t)) return 'Après un diplôme d’ingénieur ou un master (année de spécialisation)';
  if (years >= 5) return 'Après le bac (Parcoursup)';
  if (years === 3) return 'Après un bac+2 ou bac+3 (prépa, BUT, licence) : concours ou admission sur titres';
  if (years === 2) return 'Après un bac+3 ou un M1 : admission sur titres';
  return r.dur ? 'Durée : ' + r.dur : '';
}

export async function searchEngineering({ q, page }) {
  const words = plain(clean(q, 100)).split(/[^a-z0-9]+/).filter((w) => w.length >= 2);
  if (!words.length) throw bad('Indiquez un domaine ou une école (ex. informatique, génie civil, INSA).');
  const rows = (await engineeringRows()).filter((r) => words.every((w) => r.key.includes(w)));
  const p = Math.max(0, Math.min(20, Number(page) || 0));
  return {
    level: 'ingenieur',
    session: '',
    total: rows.length,
    items: rows.slice(p * 30, p * 30 + 30).map((r) => ({
      id: 'on' + (r.url.match(/FOR\.\d+/) || [r.name])[0],
      school: r.sigle || '',
      program: r.name.replace(/^./, (c) => c.toUpperCase()),
      city: '',
      kind: [entryOf(r), r.dur].filter(Boolean).join(' · '),
      alternance: false,
      places: null,
      applicants: null,
      rate: null,
      rateLabel: '',
      domains: r.dom.split('|').map((d) => d.split('/').pop().trim()).filter(Boolean).slice(0, 4),
      url: r.url,
      platform: 'direct',
    })),
  };
}
