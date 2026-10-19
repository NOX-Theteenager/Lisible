/* Jeu d'évaluation de Lisible : vérifie la qualité des réponses de l'IA sur des CV et offres de référence.
   Usage :
     npm run eval                          → fournisseur actuel (Gemini si GEMINI_PAID_TIER=true, sinon Claude)
     npm run eval -- --provider=claude     → Claude uniquement
     npm run eval -- --provider=gemini     → Gemini uniquement, sans repli (les cas sont fictifs : aucune donnée réelle n'est envoyée)
     npm run eval -- --only=cm-comptable-douala,fr-comptable --tasks=parse,letter
     npm run eval -- --save-baseline       → enregistre ce passage comme référence
   Chaque passage coûte des appels d'API (6 par cas). Tâches : parse, analyze, bullet, letter, interview
   (première question + bilan d'un entretien avec une bonne et une mauvaise réponse), oral (sans IA). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : process.argv.includes('--' + k) ? true : d; };
const provider = arg('provider', 'auto');
if (provider === 'claude' || provider === 'gemini') process.env.AI_PROVIDER = provider;
const TASKS_ON = String(arg('tasks', 'parse,analyze,bullet,letter,interview,oral')).split(',');
const only = arg('only', '') ? String(arg('only')).split(',') : null;

const { TASKS } = await import('../server/tasks.js');
const { writeLetter } = await import('../server/claude.js');
const { cvText } = await import('../src/lib/cv.js');
const { missing } = await import('../src/lib/facts.js');
const { oralStats, countFillers } = await import('../src/lib/oral.js');
globalThis.window = globalThis;
await import('../src/services/no-tics.js');
const NT = globalThis.NoTics;
await import('../src/services/ai-adapter.js');
const normalizeCv = globalThis.CVAI.normalizeCv;

const cases = JSON.parse(fs.readFileSync(path.join(here, 'cases.json'), 'utf8')).filter(c => !only || only.includes(c.id));
const plain = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const words = s => (String(s || '').match(/\S+/g) || []).length;
/* Une entreprise est « citée » par son nom, son premier mot ou son sigle (MSF, CRBC…). */
const cites = (text, company) => {
  const t = plain(text), c = plain(company);
  const initials = c.split(/[\s'’-]+/).filter(w => w && !/^(and|of|the|de|du|des|la|le|les|et)$/.test(w)).map(w => w[0]).join('');
  return t.includes(c) || t.includes(c.split(/[\s']/)[0]) || (initials.length >= 3 && new RegExp('\\b' + initials + '\\b').test(t));
};
const letterBody = t => { const i = t.search(/^(Objet|Subject)\s*:/m); return i >= 0 ? t.slice(t.indexOf('\n', i) + 1) : t; };

async function runCase(c) {
  const checks = [], add = (task, name, ok, detail = '') => checks.push({ task, name, ok: !!ok, detail: String(detail).slice(0, 160) });
  const t0 = Date.now();
  let cv = null;
  const ctx = { market: c.market, lang: c.lang };
  const src = c.cvText + '\n' + c.offer;
  try {
    if (TASKS_ON.includes('parse') || TASKS_ON.some(t => t !== 'parse')) {
      const r = await TASKS.parseCv({ fileName: c.id + '.txt', mimeType: 'text/plain', text: c.cvText, mode: 'full' });
      cv = normalizeCv(r.cv);
      if (TASKS_ON.includes('parse')) {
        const out = cvText(cv);
        add('parse', 'nom extrait', plain(cv.contact.name).includes(plain(c.name).split(' ').pop()), cv.contact.name);
        const n = cv.experiences.filter(e => e.role || e.company).length;
        add('parse', `au moins ${c.minExperiences} expérience(s)`, n >= c.minExperiences, n + ' trouvée(s)');
        const lost = missing(c.cvText, out);
        add('parse', 'aucun fait perdu', !lost.length, lost.join(' · '));
        const added = missing(out, c.cvText);
        add('parse', 'aucun fait inventé', !added.length, added.join(' · '));
        add('parse', 'problèmes ATS signalés', r.issues.length > 0, r.issues.length + ' problème(s), score ' + r.score);
      }
    }
  } catch (e) { add('parse', 'appel réussi', false, e.message); }

  if (cv && TASKS_ON.includes('analyze')) {
    try {
      const a = await TASKS.analyzeOffer({ cv, offer: c.offer, ...ctx });
      add('analyze', 'entreprise reconnue', cites(a.company, c.company) || cites(c.company, a.company) || cites(c.offer, a.company), a.company);
      add('analyze', 'au moins 8 mots-clés', a.keywords.length >= 8, a.keywords.length);
      add('analyze', 'au moins 2 réécritures', a.rewrites.length >= 2, a.rewrites.length);
      const inv = missing(a.rewrites.map(r => r.after).join('\n'), src);
      add('analyze', 'réécritures sans chiffre inventé', !inv.length, inv.join(' · '));
    } catch (e) { add('analyze', 'appel réussi', false, e.message); }
  }

  if (cv && TASKS_ON.includes('bullet')) {
    const e = cv.experiences.find(x => x.bullets.some(b => b.trim()));
    if (e) {
      try {
        const alts = (await TASKS.suggestBullet({ bullet: e.bullets[0], role: e.role, company: e.company, title: cv.contact.title, lang: c.lang, market: c.market })).alts || [];
        add('bullet', 'au plus 2 propositions', alts.length <= 2, alts.length);
        const inv = missing(alts.join('\n'), c.cvText);
        add('bullet', 'propositions sans chiffre inventé', !inv.length, inv.join(' · '));
      } catch (er) { add('bullet', 'appel réussi', false, er.message); }
    }
  }

  if (cv && TASKS_ON.includes('letter')) {
    try {
      const { text } = await writeLetter({ cv, offer: { company: c.company, role: c.role, text: c.offer }, tone: 'Sobre', mode: 'new', ...ctx });
      const body = letterBody(text), w = words(body);
      add('letter', 'longueur 200 à 400 mots', w >= 200 && w <= 400, w + ' mots');
      add('letter', 'entreprise citée', cites(body, c.company), c.company);
      const inv = missing(body, src);
      add('letter', 'aucun chiffre inventé', !inv.length, inv.join(' · '));
      add('letter', c.lang === 'en' ? 'rédigée en anglais' : 'rédigée en français', c.lang === 'en' ? /\bDear\b/.test(body) : /Madame|Monsieur/.test(body), body.slice(0, 40));
      if (c.lang !== 'en') {
        const hits = NT.analyze(body).hits.filter(h => h.cat === 'creux' || h.cat === 'cliche');
        add('letter', 'aucun cliché ni formule creuse', !hits.length, hits.map(h => h.match).join(' · '));
      }
      const br = (body.match(/\[[^\]]+\]/g) || []).length;
      add('letter', 'au plus 3 repères à compléter', br <= 3, br + ' repère(s)');
    } catch (e) { add('letter', 'appel réussi', false, e.message); }
  }
  if (cv && TASKS_ON.includes('interview')) {
    const en = c.lang === 'en', offer = { company: c.company, role: c.role, text: c.offer };
    try {
      const r = await TASKS.mockInterview({ cv, offer, history: [], total: 3, ...ctx });
      const q = String(r.nextQuestion || '');
      add('interview', '1re question posée', q.trim().length > 10 && !r.done, q);
      add('interview', en ? 'question en anglais' : 'question en français', en ? /\b(you|your|tell|what|how|why)\b/i.test(q) : /\b(vous|votre|pourquoi|comment|quel|quelle)\b/i.test(q), q.slice(0, 80));
    } catch (e) { add('interview', 'question : appel réussi', false, e.message); }
    // Bilan d'un entretien oral : une réponse STAR solide (faits du CV) et une réponse creuse.
    const weak = en ? "Well, I am a hard worker and a team player, I always do my best." : "Euh, je suis quelqu'un de motivé, je travaille bien en équipe, voilà.";
    const transcript = [
      { role: 'recruiter', text: en ? 'Tell me about an achievement you are proud of.' : 'Parlez-moi d’une réalisation dont vous êtes fier ou fière.' },
      { role: 'candidate', text: c.strongAnswer },
      { role: 'recruiter', text: en ? 'Why should we hire you for this role?' : 'Pourquoi devrions-nous vous recruter pour ce poste ?' },
      { role: 'candidate', text: weak },
    ];
    try {
      const r = await TASKS.reviewInterview({ cv, offer, transcript, ...ctx });
      const it = r.items || [];
      add('interview', '2 questions évaluées', it.length === 2, it.length + ' élément(s)');
      if (it.length >= 2) {
        const [a, b] = it;
        add('interview', 'bonne réponse mieux notée (+3)', a.feedback.score >= b.feedback.score + 3, a.feedback.score + ' vs ' + b.feedback.score);
        add('interview', 'résultat repéré (STAR)', a.feedback.star.r && !b.feedback.star.r, JSON.stringify(a.feedback.star) + ' / ' + JSON.stringify(b.feedback.star));
        const inv = missing(it.map(x => x.feedback.betterAnswer).join('\n'), src + '\n' + c.strongAnswer);
        add('interview', 'réponses améliorées sans chiffre inventé', !inv.length, inv.join(' · '));
      }
      add('interview', 'bilan noté sur 10', r.summary && r.summary.score >= 0 && r.summary.score <= 10, r.summary && r.summary.score);
    } catch (e) { add('interview', 'bilan : appel réussi', false, e.message); }
  }

  if (TASKS_ON.includes('oral')) {
    // Analyse de l'oral, sans IA : mêmes entrées que l'appli (transcription + temps de parole).
    const en = c.lang === 'en';
    const said = en ? 'Um, so, you know, I basically built the service. Uh, it handles a lot of traffic.' : "Euh, du coup j'ai repris le projet. En fait, euh, on a tenu les délais, voilà.";
    const f = countFillers(said, c.lang);
    const n = Object.values(f).reduce((x, y) => x + y, 0);
    add('oral', 'mots de remplissage comptés', n === (en ? 4 : 5), JSON.stringify(f));
    const o = oralStats([{ role: 'candidate', text: c.strongAnswer }], [{ speechMs: 18000, durMs: 20000 }], c.lang);
    add('oral', 'débit calculé (20 s de parole)', o && o.words > 20 && o.wpm === Math.round(o.words * 3), o && o.wpm + ' mots/min');
  }
  return { id: c.id, ms: Date.now() - t0, checks, score: checks.length ? Math.round((checks.filter(x => x.ok).length / checks.length) * 100) : 0 };
}

console.log(`Évaluation : ${cases.length} cas · fournisseur ${provider} · tâches ${TASKS_ON.join(', ')}\n`);
const results = [];
const queue = [...cases];
await Promise.all(Array.from({ length: 3 }, async () => { while (queue.length) { const c = queue.shift(); const r = await runCase(c); results.push(r); console.log(`${String(r.score).padStart(3)} %  ${r.id.padEnd(28)} ${(r.ms / 1000).toFixed(0)} s${r.checks.filter(x => !x.ok).map(x => `\n        ✕ [${x.task}] ${x.name}${x.detail ? ' : ' + x.detail : ''}`).join('')}`); } }));
results.sort((a, b) => a.id.localeCompare(b.id));
const all = results.flatMap(r => r.checks), total = Math.round((all.filter(x => x.ok).length / (all.length || 1)) * 100);
const byTask = {};
for (const x of all) { byTask[x.task] = byTask[x.task] || [0, 0]; byTask[x.task][1]++; if (x.ok) byTask[x.task][0]++; }
console.log(`\nScore global : ${total} % (${all.filter(x => x.ok).length}/${all.length} vérifications)`);
for (const [t, [ok, n]] of Object.entries(byTask)) console.log(`  ${t.padEnd(8)} ${Math.round((ok / n) * 100)} % (${ok}/${n})`);

const report = { date: new Date().toISOString(), provider, models: { gemini: process.env.GEMINI_MODEL, claude: process.env.CLAUDE_MODEL }, total, byTask, results };
fs.mkdirSync(path.join(here, 'results'), { recursive: true });
const file = path.join(here, 'results', report.date.replace(/[:.]/g, '-') + '-' + provider + '.json');
fs.writeFileSync(file, JSON.stringify(report, null, 2));
console.log('\nRapport : ' + path.relative(process.cwd(), file));

const basePath = path.join(here, 'baseline.json');
if (fs.existsSync(basePath) && !arg('save-baseline')) {
  const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
  const prev = new Map(base.results.flatMap(r => r.checks.map(x => [r.id + '|' + x.task + '|' + x.name, x.ok])));
  const reg = results.flatMap(r => r.checks.filter(x => !x.ok && prev.get(r.id + '|' + x.task + '|' + x.name) === true).map(x => `${r.id} · [${x.task}] ${x.name}`));
  const fixed = results.flatMap(r => r.checks.filter(x => x.ok && prev.get(r.id + '|' + x.task + '|' + x.name) === false).map(x => `${r.id} · [${x.task}] ${x.name}`));
  console.log(`\nComparaison avec la référence (${base.date.slice(0, 10)}, ${base.provider}, ${base.total} %) : ${total - base.total >= 0 ? '+' : ''}${total - base.total} points`);
  if (reg.length) console.log('Régressions :\n  ' + reg.join('\n  '));
  if (fixed.length) console.log('Améliorations :\n  ' + fixed.join('\n  '));
  if (reg.length) process.exitCode = 1;
}
if (arg('save-baseline')) {
  // Avec --only ou --tasks, seuls les cas et les tâches relancés remplacent ceux de la référence existante.
  let out = report;
  if ((only || arg('tasks')) && fs.existsSync(basePath)) {
    const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
    const ran = new Set(TASKS_ON);
    const mergeCase = (old, neu) => ({ ...neu, checks: [...old.checks.filter(x => !ran.has(x.task)), ...neu.checks.filter(x => ran.has(x.task))] });
    const merged = [
      ...base.results.filter(r => !results.some(n => n.id === r.id)),
      ...results.map(n => { const o = base.results.find(r => r.id === n.id); return o ? mergeCase(o, n) : n; }),
    ].sort((a, b) => a.id.localeCompare(b.id));
    const ch = merged.flatMap(r => r.checks);
    const bt = {};
    for (const x of ch) { bt[x.task] = bt[x.task] || [0, 0]; bt[x.task][1]++; if (x.ok) bt[x.task][0]++; }
    out = { ...base, date: report.date, results: merged, byTask: bt, total: Math.round((ch.filter(x => x.ok).length / ch.length) * 100) };
  }
  fs.writeFileSync(basePath, JSON.stringify(out, null, 2));
  console.log('Référence enregistrée : evals/baseline.json (' + out.total + ' %)');
}
