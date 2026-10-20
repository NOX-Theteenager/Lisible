/* Modèle de CV : structure vide, anonymisation, texte ATS, export Word. */
import { clone, esc, uid, wc } from './utils.js';

export const LABELS = {
  contact: 'Coordonnées',
  summary: 'Résumé professionnel',
  experience: 'Expérience professionnelle',
  education: 'Formation',
  skills: 'Compétences',
  languages: 'Langues',
  projects: 'Projets',
  certifications: 'Certifications',
};
export const LABELS_EN = {
  contact: 'Contact',
  summary: 'Professional Summary',
  experience: 'Professional Experience',
  education: 'Education',
  skills: 'Skills',
  languages: 'Languages',
  projects: 'Projects',
  certifications: 'Certifications',
};
/* CV académique (mode Études) : mêmes sections, intitulés adaptés aux candidatures à une formation. */
export const LABELS_AC = { ...LABELS, summary: 'Projet d’études', experience: 'Stages et expériences', projects: 'Projets et travaux académiques', certifications: 'Distinctions et certifications' };
export const LABELS_AC_EN = { ...LABELS_EN, summary: 'Academic Profile', experience: 'Internships and Experience', projects: 'Academic Projects and Research', certifications: 'Honours and Certifications' };
/* Le format du CV suit l'objectif : académique en mode Études, professionnel en mode Emploi. */
export const ORDER_AC = ['summary', 'education', 'projects', 'experience', 'skills', 'languages', 'certifications'];
export const ORDER_JOB = ['summary', 'experience', 'education', 'skills', 'languages', 'projects', 'certifications'];
export const withTrack = (cv, track) => ({ ...cv, kind: track === 'study' ? 'academic' : '' });
export function reorderFor(cv, track) {
  const want = track === 'study' ? ORDER_AC : ORDER_JOB, cur = cv.order || want;
  return { ...cv, kind: track === 'study' ? 'academic' : '', order: [...want.filter((k) => cur.includes(k)), ...cur.filter((k) => !want.includes(k))] };
}
export const labOf = (cv, k) => (cv && cv.kind === 'academic' ? (cv.lang === 'en' ? LABELS_AC_EN : LABELS_AC) : cv && cv.lang === 'en' ? LABELS_EN : LABELS)[k];
export function docModel(cv, font, size) {
  return {
    size: size || 10.5,
    name: cv.contact.name,
    title: cv.contact.title,
    contactLine: contactLine(cv),
    font,
    sections: cv.order
      .filter((k) => secText(cv, k).length)
      .map((k) => ({
        label: labOf(cv, k),
        items:
          k === 'experience'
            ? cv.experiences
                .filter((e) => e.role || e.company || (e.bullets || []).some((b) => b.trim()))
                .flatMap((e) => [
                  { type: 'bold', text: e.role + (e.company ? ', ' + e.company : '') },
                  { type: 'p', text: [e.city, dates(e)].filter(Boolean).join(' | ') },
                  ...e.bullets.filter((b) => b.trim()).map((b) => ({ type: 'bullet', text: b.trim() })),
                ])
            : k === 'education'
              ? cv.education
                  .filter((e) => e.degree)
                  .flatMap((e) => [
                    { type: 'bold', text: e.degree },
                    { type: 'p', text: [e.school, e.city, dates(e)].filter(Boolean).join(' | ') },
                    ...(e.details ? [{ type: 'p', text: e.details }] : []),
                  ])
              : secText(cv, k).map((t) => ({ type: 'p', text: t })),
      })),
  };
}
export const ORDER = ['summary', 'experience', 'education', 'skills', 'languages', 'projects', 'certifications'];
export function emptyCv() {
  return {
    order: [...ORDER],
    contact: { name: '', title: '', email: '', phone: '', city: '', linkedin: '', github: '' },
    summary: '',
    experiences: [{ id: uid(), role: '', company: '', sector: '', city: '', start: '', end: '', bullets: [''] }],
    education: [{ id: uid(), degree: '', school: '', city: '', start: '', end: '', details: '' }],
    skills: [],
    languages: [{ id: uid(), name: 'Français', level: 'Langue maternelle' }],
    projects: [],
    certifications: [],
  };
}
export function anonCv(cv) {
  const c = clone(cv);
  c.contact = {
    ...c.contact,
    name: 'Candidat·e réf. A-' + (100 + wc(cv.contact.name) * 37 + cv.contact.name.length),
    email: '[e-mail masqué]',
    phone: '[téléphone masqué]',
    linkedin: '',
    github: '',
  };
  c.experiences.forEach((e) => {
    e.company = e.sector || 'Entreprise confidentielle';
  });
  c.education.forEach((e) => {
    e.school = 'Établissement d’enseignement supérieur';
  });
  c.projects.forEach((p) => {
    p.link = '';
  });
  c.contact.photo = '';
  return c;
}
export const contactLine = (cv) => {
  const c = cv.contact;
  return [c.city, c.phone, c.email, c.linkedin, c.github].filter((x) => x && x.trim()).join(' | ');
};
export const dates = (e) => [e.start, e.end].filter(Boolean).join(' - ');
/* Aucun tiret cadratin dans le CV : entre deux dates ou nombres il devient un trait d'union,
   entre deux mots une virgule ; en début de ligne il disparaît. */
export const noDash = (t) =>
  String(t)
    .replace(/(\d)\s*[—–]\s*(?=\d|aujourd|présent|present|now|today)/gi, '$1 - ')
    .replace(/^\s*[—–]\s*/gm, '')
    .replace(/\s+[—–]\s+/g, ', ')
    .replace(/\s*—\s*/g, ', ');
export function dashFree(x) {
  if (typeof x === 'string') return /[—–]/.test(x) && !x.startsWith('data:') ? noDash(x) : x;
  if (Array.isArray(x)) return x.map(dashFree);
  if (x && typeof x === 'object') { const o = {}; for (const k in x) o[k] = dashFree(x[k]); return o; }
  return x;
}
export function secText(cv, k) {
  switch (k) {
    case 'summary':
      return cv.summary.trim() ? [cv.summary.trim()] : [];
    case 'experience':
      return cv.experiences
        .filter((e) => e.role || e.company || (e.bullets || []).some((b) => b.trim()))
        .flatMap((e) => [
          e.role + (e.company ? ', ' + e.company : ''),
          [e.city, dates(e)].filter(Boolean).join(' | '),
          ...e.bullets.filter((b) => b.trim()).map((b) => '- ' + b.trim()),
        ]);
    case 'education':
      return cv.education
        .filter((e) => e.degree)
        .flatMap((e) => [e.degree, [e.school, e.city, dates(e)].filter(Boolean).join(' | '), ...(e.details ? [e.details] : [])]);
    case 'skills':
      return cv.skills.length ? [cv.skills.join(', ')] : [];
    case 'languages':
      return cv.languages.filter((l) => l.name).length
        ? [
            cv.languages
              .filter((l) => l.name)
              .map((l) => l.name + ' : ' + l.level)
              .join(' ; '),
          ]
        : [];
    case 'projects':
      return cv.projects.filter((p) => p.name).map((p) => p.name + (p.desc ? ' : ' + p.desc : '') + (p.link ? ' (' + p.link + ')' : ''));
    case 'certifications':
      return cv.certifications.filter((c) => c.name).map((c) => [c.name, c.issuer, c.date].filter(Boolean).join(', '));
  }
  return [];
}
export function cvText(cv) {
  const c = cv.contact,
    L = [(c.name || '').toUpperCase()];
  if (c.title) L.push(c.title);
  L.push(contactLine(cv));
  cv.order.forEach((k) => {
    const b = secText(cv, k);
    if (b.length) {
      L.push('', labOf(cv, k).toUpperCase(), ...b);
    }
  });
  return L.join('\n');
}
export function docHtml(cv, tpl) {
  const c = cv.contact;
  let h = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(c.name)}</title><style>body{font-family:${tpl.font};font-size:11pt;line-height:1.35;color:#000;margin:2cm}h1{font-size:18pt;margin:0}h2{font-size:12pt;margin:14pt 0 4pt;border-bottom:1px solid #000;text-transform:uppercase}p{margin:0 0 4pt}ul{margin:2pt 0 6pt 16pt;padding:0}</style></head><body><h1>${esc(c.name)}</h1><p>${esc(c.title)}</p><p>${esc(contactLine(cv))}</p>`;
  cv.order.forEach((k) => {
    if (!secText(cv, k).length) return;
    h += `<h2>${labOf(cv, k)}</h2>`;
    if (k === 'experience')
      cv.experiences
        .filter((e) => e.role || e.company || (e.bullets || []).some((b) => b.trim()))
        .forEach((e) => {
          h += `<p><b>${esc(e.role)}${e.company ? ', ' + esc(e.company) : ''}</b></p><p>${esc([e.city, dates(e)].filter(Boolean).join(' | '))}</p><ul>${e.bullets
            .filter((b) => b.trim())
            .map((b) => '<li>' + esc(b) + '</li>')
            .join('')}</ul>`;
        });
    else if (k === 'education')
      cv.education
        .filter((e) => e.degree)
        .forEach((e) => {
          h += `<p><b>${esc(e.degree)}</b></p><p>${esc([e.school, e.city, dates(e)].filter(Boolean).join(' | '))}</p>${e.details ? '<p>' + esc(e.details) + '</p>' : ''}`;
        });
    else
      secText(cv, k).forEach((l) => {
        h += '<p>' + esc(l) + '</p>';
      });
  });
  return h + '</body></html>';
}
export function findPh(cv) {
  const re = /\[[^\]\n]{1,40}\]/g,
    out = [];
  const scan = (t, where, key) => {
    ((t || '').match(re) || []).forEach((m) => out.push({ where, text: m, key }));
  };
  scan(cv.summary, 'Résumé', 'summary');
  cv.experiences.forEach((e, i) => e.bullets.forEach((b) => scan(b, e.company || 'Expérience ' + (i + 1), 'experience')));
  cv.projects.forEach((p) => scan(p.desc, 'Projets', 'projects'));
  return out;
}
export function blankVersion(name) {
  const t = Date.now(),
    cv = emptyCv();
  return {
    id: uid(),
    name: name || 'Mon CV',
    tag: 'Général',
    updated: t,
    cv,
    history: [{ id: uid(), t, label: 'Création', cv: clone(cv) }],
  };
}
