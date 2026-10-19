/* Règles de conformité ATS, score, correspondance avec une offre. */
import { cvText } from './cv.js';
import { clone, wc } from './utils.js';

export const STRONG = [
  'conçu',
  'développé',
  'réduit',
  'créé',
  'migré',
  'piloté',
  'mis',
  'automatisé',
  'amélioré',
  'formé',
  'encadré',
  'dirigé',
  'optimisé',
  'livré',
  'lancé',
  'déployé',
  'implémenté',
  'refondu',
  'construit',
  'industrialisé',
  'architecturé',
  'coordonné',
  'négocié',
  'augmenté',
  'accéléré',
  'structuré',
  'obtenu',
  'géré',
  'analysé',
  'conduit',
  'défini',
  'animé',
  'réalisé',
  'accompagné',
  'supervisé',
  'sécurisé',
  'modernisé',
  'divisé',
  'généré',
  'dépassé',
  'rédigé',
  'mené',
  'assuré',
];
export const DATE_RE = /^((0[1-9]|1[0-2])\/\d{4}|Présent|Present)$/;
export const firstWord = (b) => (b.trim().split(/\s+/)[0] || '').toLowerCase().replace(/[^\p{L}]/gu, '');
export const isWeak = (b) => !STRONG.includes(firstWord(b));
export const hasNum = (b) => /\d/.test(b);
export function analyze(cv, T) {
  const fontName = (T && T.fontName) || 'Arial',
    atsLv = (T && T.ats) || 'ok',
    atsNote = (T && T.atsNote) || 'Garanti par le modèle';
  const c = cv.contact,
    bullets = cv.experiences.flatMap((e) => e.bullets.filter((b) => b.trim()));
  const words = wc(cvText(cv)),
    sumW = wc(cv.summary);
  const ds = [...cv.experiences.flatMap((e) => [e.start, e.end]), ...cv.education.flatMap((e) => [e.start, e.end])].filter(
    (d) => d && d.trim(),
  );
  const bad = ds.filter((d) => !DATE_RE.test(d.trim()));
  const strong = bullets.filter((b) => !isWeak(b)).length,
    quant = bullets.filter(hasNum).length;
  const pr = bullets.length ? strong / bullets.length : 0,
    pq = bullets.length ? quant / bullets.length : 0;
  const je = /(^|[\s(])(je\s|j['’])/i.test([cv.summary, ...bullets].join(' '));
  const st = (ok, w) => (ok ? 'ok' : w ? 'warn' : 'fail');
  const miss = [
    ['name', 'nom'],
    ['email', 'e-mail'],
    ['phone', 'téléphone'],
    ['city', 'ville'],
  ]
    .filter(([k]) => !(c[k] || '').trim())
    .map((x) => x[1]);
  const rules = [
    {
      label: 'Coordonnées complètes en haut',
      w: 10,
      s: st(!miss.length, miss.length <= 2 && c.name),
      d: miss.length ? 'Manque : ' + miss.join(', ') : 'Nom, e-mail, téléphone et ville présents',
      fix: 'contact',
    },
    {
      label: 'Intitulé de poste visé',
      w: 6,
      s: st(!!c.title.trim()),
      d: c.title.trim() ? '« ' + c.title + ' »' : 'Ajoutez un titre clair sous votre nom',
      fix: 'contact',
    },
    {
      label: 'Résumé de 35 à 90 mots',
      w: 10,
      s: st(sumW >= 35 && sumW <= 90, sumW >= 15 && sumW <= 130),
      d: sumW + ' mots',
      fix: 'summary',
    },
    {
      label: 'Style impersonnel (sans « je »)',
      w: 4,
      s: st(!je),
      d: je ? 'Commencez vos phrases par un nom ou un verbe' : 'Aucun pronom personnel détecté',
      fix: 'summary',
    },
    {
      label: "Réalisations introduites par un verbe d'action",
      w: 10,
      s: st(bullets.length && pr >= 0.8, pr >= 0.5),
      d: strong + '/' + bullets.length + ' lignes',
      fix: 'experience',
    },
    {
      label: 'Résultats chiffrés',
      w: 10,
      s: st(bullets.length && pq >= 0.5, pq >= 0.25),
      d: quant + '/' + bullets.length + ' lignes contiennent un chiffre',
      fix: 'experience',
    },
    {
      label: 'Dates au format MM/AAAA',
      w: 8,
      s: st(!bad.length, bad.length === 1),
      d: bad.length
        ? 'À corriger : ' +
          bad
            .slice(0, 2)
            .map((x) => '« ' + x + ' »')
            .join(', ')
        : 'Format cohérent partout',
      fix: 'experience',
    },
    {
      label: 'Au moins 8 compétences',
      w: 8,
      s: st(cv.skills.length >= 8, cv.skills.length >= 4),
      d: cv.skills.length + ' compétences',
      fix: 'skills',
    },
    {
      label: 'Longueur adaptée (250 à 800 mots)',
      w: 8,
      s: st(words >= 250 && words <= 800, words >= 150 && words <= 1000),
      d: words + ' mots',
      fix: 'experience',
    },
    { label: 'Titres de sections standards', w: 8, s: 'ok', d: 'Libellés reconnus par les ATS', fix: null },
    { label: 'Une colonne, sans tableau, image ni icône', w: 12, s: atsLv, d: atsNote, fix: atsLv === 'ok' ? null : 'template' },
    { label: 'Police standard', w: 6, s: 'ok', d: fontName || 'Arial', fix: null },
  ];
  const score = Math.round(rules.reduce((a, r) => a + r.w * (r.s === 'ok' ? 1 : r.s === 'warn' ? 0.5 : 0), 0));
  return { score, rules, okCount: rules.filter((r) => r.s === 'ok').length, fails: rules.filter((r) => r.s === 'fail').length };
}
export function matchKw(cv, kws) {
  const t = cvText(cv).toLowerCase();
  const list = (kws || []).map((k) => ({ ...k, found: (k.a || [k.k.toLowerCase()]).some((a) => a && t.includes(a)) }));
  const tot = list.reduce((s, k) => s + k.w, 0),
    got = list.filter((k) => k.found).reduce((s, k) => s + k.w, 0);
  return { list, score: tot ? Math.round((got / tot) * 100) : 0, found: list.filter((k) => k.found).length };
}
export function applyAdapt(cv, acc, sk, rws) {
  const c = clone(cv);
  (rws || []).forEach((s) => {
    if (!acc[s.id]) return;
    const e = c.experiences[s.exp];
    if (s.kind === 'summary') c.summary = s.after;
    else if (e && s.kind === 'bullet') {
      if (e.bullets.length > s.b) e.bullets[s.b] = s.after;
      else e.bullets.push(s.after);
    } else if (e && s.kind === 'add' && !e.bullets.includes(s.after)) e.bullets.push(s.after);
  });
  Object.keys(sk).forEach((k) => {
    if (sk[k] && !c.skills.includes(k)) c.skills.push(k);
  });
  return c;
}
