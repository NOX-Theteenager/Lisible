/* Lettres de motivation : diagnostic, découpage en-tête / corps, e-mail de relance. */
import { wc } from './utils.js';

export function letterDiag(t, company) {
  const l = (t || '').toLowerCase();
  const cl = ['dynamique', 'motivé', 'rigoureu', 'sens du travail en équipe', 'je me permets', 'leader', 'passionné'].filter((x) =>
    l.includes(x),
  );
  const nums = /\d/.test(t || ''),
    comp = company && l.includes(company.toLowerCase().split(' ')[0]),
    w = wc(t),
    je = (l.match(/(^|[.!?]\s+)je\s/g) || []).length;
  const d = [
    {
      ok: cl.length === 0,
      title: cl.length ? 'Formules creuses (' + cl.length + ')' : 'Aucune formule creuse',
      fix: cl.length ? '« ' + cl.slice(0, 3).join(' », « ') + ' » remplacées par des faits vérifiables.' : 'Le ton reste factuel.',
    },
    {
      ok: nums,
      title: nums ? 'Résultats chiffrés présents' : 'Aucun résultat chiffré',
      fix: nums ? 'Les preuves sont concrètes.' : 'Ajout de 2 réalisations chiffrées tirées de votre CV.',
    },
    {
      ok: !!comp,
      title: comp ? 'Lien explicite avec l’entreprise' : 'Aucun lien avec l’offre',
      fix: comp ? 'L’entreprise est citée.' : 'Mention de la mission et des enjeux de ' + (company || 'l’entreprise') + '.',
    },
    {
      ok: w >= 220 && w <= 380,
      title: 'Longueur : ' + w + ' mots',
      fix: w < 220 ? 'Trop courte : viser 250 à 350 mots.' : w > 380 ? 'Trop longue : viser 250 à 350 mots.' : 'Longueur idéale.',
    },
    {
      ok: je <= 3,
      title: je > 3 ? je + ' phrases commencent par « Je »' : 'Rythme des phrases varié',
      fix: je > 3 ? 'Phrases reformulées pour varier les attaques.' : 'Bonne alternance.',
    },
  ];
  const score = Math.max(18, Math.min(96, 100 - d.filter((x) => !x.ok).length * 16 - cl.length * 3));
  return { d, score };
}
export const relanceMail = (a, name) =>
  `Objet : Candidature au poste de ${a.role}\n\nBonjour,\n\nJe vous ai envoyé ma candidature au poste de ${a.role} le ${a.date}. Le poste m’intéresse toujours, en particulier [un élément précis de l’offre].\n\nOù en est le recrutement ? Je peux vous transmettre des exemples de projets si cela vous aide à décider.\n\nBien cordialement,\n${name}`;
export function splitLetter(t) {
  t = t || '';
  const k = t.search(/^(Objet|Subject)\s*:/m);
  if (k <= 0) return { head: '', body: t, sender: [], recipient: [] };
  const head = t.slice(0, k),
    blocks = head
      .trim()
      .split(/\n\s*\n/)
      .map((b) =>
        b
          .split('\n')
          .map((x) => x.trim())
          .filter(Boolean),
      );
  return { head, body: t.slice(k), sender: blocks[0] || [], recipient: blocks.slice(1).flat() };
}
