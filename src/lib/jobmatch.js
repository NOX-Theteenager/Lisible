/* Correspondance entre une offre et le CV, calculée sur l'appareil, sans IA (donc sans coût).
   Trois signaux : l'intitulé du poste (proche du titre ou des postes du CV), les compétences du CV
   présentes dans l'offre, et les compétences demandées par l'offre présentes dans le CV. */
import { cvText } from './cv.js';

const STOP = new Set('les des une pour avec dans sur par aux est son ses vos nos the and for with from your our job emploi poste offre h/f f/h hf (h/f) cdi cdd temps plein partiel senior junior confirme confirmee'.split(' '));
const plain = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const tokens = (s) => plain(s).split(/[^a-z0-9+#]+/).filter((w) => w.length >= 3 && !STOP.has(w));
const has = (text, term) => {
  const t = plain(term).trim();
  if (t.length < 2) return false;
  return new RegExp('(^|[^a-z0-9])' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)').test(text);
};

/* Termes du CV utiles au rapprochement : titre, postes, compétences. */
export function cvProfile(cv) {
  const roles = [cv.contact.title, ...cv.experiences.map((e) => e.role)].filter(Boolean);
  return {
    roleWords: new Set(roles.flatMap(tokens)),
    titleWords: tokens(cv.contact.title || roles[0] || ''),
    skills: [...new Set((cv.skills || []).map((s) => String(s).trim()).filter((s) => s.length >= 2))],
    text: plain(cvText(cv)),
  };
}

export function matchOffer(prof, offer) {
  const offerText = plain([offer.title, offer.description, (offer.skills || []).join(' ')].join(' '));
  const titleWords = tokens(offer.title);
  const titleHit = titleWords.filter((w) => prof.roleWords.has(w));
  // Dans les deux sens : « Comptable » correspond pleinement à « Comptable général H/F ».
  const offerSide = titleWords.length ? titleHit.length / titleWords.length : 0;
  const cvSide = prof.titleWords.length ? prof.titleWords.filter((w) => titleWords.includes(w)).length / prof.titleWords.length : 0;
  const title = Math.max(offerSide, cvSide);
  const skillHits = prof.skills.filter((s) => has(offerText, s));
  const skills = prof.skills.length ? Math.min(1, skillHits.length / Math.min(5, prof.skills.length)) : 0;
  const asked = offer.skills || [];
  const askedHit = asked.filter((s) => tokens(s).some((w) => prof.text.includes(w)));
  const req = asked.length ? askedHit.length / asked.length : skills;
  // Sans compétences dans le CV, le titre et les compétences demandées portent tout le score.
  const score = Math.round(100 * (prof.skills.length ? 0.45 * title + 0.35 * skills + 0.2 * req : 0.7 * title + 0.3 * req));
  return { score, hits: [...new Set([...titleHit, ...skillHits])].slice(0, 6) };
}
