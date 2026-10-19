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
export const labOf = (cv, k) => (cv && cv.lang === 'en' ? LABELS_EN : LABELS)[k];
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
                .filter((e) => e.role || e.company)
                .flatMap((e) => [
                  { type: 'bold', text: e.role + (e.company ? ' — ' + e.company : '') },
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
export const dates = (e) => [e.start, e.end].filter(Boolean).join(' – ');
export function secText(cv, k) {
  switch (k) {
    case 'summary':
      return cv.summary.trim() ? [cv.summary.trim()] : [];
    case 'experience':
      return cv.experiences
        .filter((e) => e.role || e.company)
        .flatMap((e) => [
          e.role + (e.company ? ' — ' + e.company : ''),
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
      return cv.projects.filter((p) => p.name).map((p) => p.name + ' — ' + p.desc + (p.link ? ' (' + p.link + ')' : ''));
    case 'certifications':
      return cv.certifications.filter((c) => c.name).map((c) => [c.name, c.issuer, c.date].filter(Boolean).join(' — '));
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
        .filter((e) => e.role || e.company)
        .forEach((e) => {
          h += `<p><b>${esc(e.role)}${e.company ? ' — ' + esc(e.company) : ''}</b></p><p>${esc([e.city, dates(e)].filter(Boolean).join(' | '))}</p><ul>${e.bullets
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
