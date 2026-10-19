import { GoogleGenAI } from '@google/genai';
import { isStudy } from './context.js';

let client = null;
const MODEL = () => process.env.GEMINI_MODEL || 'gemini-3.6-flash';

function ai() {
  if (!process.env.GEMINI_API_KEY) { const e = new Error('Clé GEMINI_API_KEY non configurée sur le serveur.'); e.status = 503; e.expose = true; throw e; }
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

/* Consigne commune à toutes les réécritures (reprise du prototype). */
export const STYLE = `Écris en français naturel (ou dans la langue demandée), voix active, phrases de longueur variée.
Aucun cliché ni formule creuse (« passionné », « dynamique », « force de proposition », « valeur ajoutée », « dans un monde en constante évolution », « il est important de noter », etc.).
Aucun tiret cadratin (—) ni demi-cadratin (–) dans le texte, pas de question rhétorique, pas d'énumération systématique par trois.
N'invente JAMAIS un chiffre, une entreprise, un outil ou un résultat : utilise uniquement les faits fournis. Si une donnée manque, laisse un repère entre crochets comme [X %] ou [nombre d'utilisateurs].`;

/* Délai maximal accordé à Gemini avant de basculer sur Claude. */
const GEMINI_TIMEOUT = () => Number(process.env.GEMINI_TIMEOUT_MS || 45_000);

function parseJSON(txt) {
  try { return JSON.parse(txt); } catch {
    const m = /\{[\s\S]*\}/.exec(txt || '');
    if (m) return JSON.parse(m[0]);
    throw new Error('Réponse JSON illisible');
  }
}

/**
 * Sortie JSON contrainte. Gemini d'abord (une seule tentative) ; au moindre problème
 * (quota, saturation, délai dépassé, réponse illisible, clé absente), bascule directe sur Claude.
 * parts : tableau de { text } ou { inlineData: { mimeType, data } }.
 */
export async function genJSON({ system, parts, schema, temperature = 0.4 }) {
  let geminiError = null;
  // RGPD : sur le palier gratuit, Google peut utiliser les contenus pour entraîner ses modèles.
  // Gemini n'est donc utilisé que si la facturation est déclarée active (GEMINI_PAID_TIER=true).
  // AI_PROVIDER=claude force Claude ; AI_PROVIDER=gemini force Gemini sans repli (utile pour l'évaluation).
  const forced = process.env.AI_PROVIDER;
  if (forced !== 'claude' && process.env.GEMINI_API_KEY && (process.env.GEMINI_PAID_TIER === 'true' || forced === 'gemini')) {
    try {
      const res = await Promise.race([
        ai().models.generateContent({
          model: MODEL(),
          contents: [{ role: 'user', parts }],
          config: { systemInstruction: system, temperature, responseMimeType: 'application/json', responseJsonSchema: schema },
        }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('Délai Gemini dépassé')), GEMINI_TIMEOUT())),
      ]);
      return parseJSON(res.text || '');
    } catch (e) {
      if (forced === 'gemini') throw e;
      geminiError = e;
    }
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    const e = new Error(geminiError ? 'Le service d’IA est momentanément indisponible. Réessayez dans une minute.' : 'Aucune clé d’IA configurée sur le serveur.');
    e.status = 503; e.expose = true; throw e;
  }
  if (geminiError) console.warn('[ia] Gemini indisponible (' + String(geminiError.message).slice(0, 160) + ') : bascule sur Claude');
  const { claudeJSON } = await import('./claude.js');
  return claudeJSON({ system, parts, schema });
}

export const S = {
  str: { type: 'string' },
  int: { type: 'integer' },
  bool: { type: 'boolean' },
  arr: items => ({ type: 'array', items }),
  obj: (properties, required = Object.keys(properties)) => ({ type: 'object', properties, required }),
};

export const LEVELS = ['Langue maternelle', 'Bilingue (C2)', 'Courant (C1)', 'Avancé (B2)', 'Intermédiaire (B1)', 'Notions (A2)'];

export const CV_SCHEMA = S.obj({
  contact: S.obj({ name: S.str, title: S.str, email: S.str, phone: S.str, city: S.str, linkedin: S.str, github: S.str }),
  summary: S.str,
  experiences: S.arr(S.obj({ role: S.str, company: S.str, sector: S.str, city: S.str, start: S.str, end: S.str, bullets: S.arr(S.str) })),
  education: S.arr(S.obj({ degree: S.str, school: S.str, city: S.str, start: S.str, end: S.str, details: S.str })),
  skills: S.arr(S.str),
  languages: S.arr(S.obj({ name: S.str, level: S.str })),
  projects: S.arr(S.obj({ name: S.str, link: S.str, desc: S.str })),
  certifications: S.arr(S.obj({ name: S.str, issuer: S.str, date: S.str })),
});

/* Version compacte du CV envoyée aux modèles (sans photo ni identifiants). */
export function cvForPrompt(cv) {
  if (!cv || typeof cv !== 'object') return '{}';
  const c = JSON.parse(JSON.stringify(cv));
  if (c.contact) delete c.contact.photo;
  const strip = a => (Array.isArray(a) ? a.map(x => { if (x && typeof x === 'object') delete x.id; return x; }) : a);
  ['experiences', 'education', 'languages', 'projects', 'certifications'].forEach(k => { c[k] = strip(c[k]); });
  delete c.order;
  return JSON.stringify(c);
}

export function bad(msg) { const e = new Error(msg); e.status = 400; e.expose = true; return e; }

/* ─── Contexte transmis à chaque demande : marché visé, langue, mémoire du profil ─── */
const MARKETS = {
  fr: `Marché visé : France. Conventions françaises : CV d'une à deux pages, photo facultative, ni âge ni situation familiale ; lettre ouverte par « Madame, Monsieur, ».`,
  cm: `Marché visé : Cameroun. Les recruteurs y attendent souvent un CV complet et formel ; le bilinguisme français-anglais est un atout majeur à mettre en avant ; la disponibilité et la mobilité entre villes (Douala, Yaoundé, Garoua, Bafoussam…) comptent ; les organismes cités (entreprises, ministères, ONG, projets financés) doivent être nommés précisément. Les lettres restent formelles : « Madame, Monsieur, » ou « Monsieur le Directeur des Ressources Humaines, », formule de politesse complète.`,
  afr: `Marché visé : Afrique francophone (Côte d'Ivoire, Sénégal, Maroc, Bénin, Gabon, RDC…). Conventions proches du français, ton formel ; la mobilité régionale, les langues (français, anglais, langues locales) et l'expérience terrain sont valorisées.`,
  intl: `Marché visé : international ou anglophone. CV de type « resume » sans photo ni informations personnelles, réalisations quantifiées, lettre concise et directe.`,
};

const MARKETS_STUDY = {
  fr: `Contexte : candidature à une formation en France (Parcoursup, Mon Master, écoles, admissions parallèles). Les jurys attendent un projet clair et argumenté, sans formules toutes faites.`,
  cm: `Contexte : personne basée au Cameroun, qui candidate au Cameroun ou à l'étranger (souvent la France via Campus France « Études en France », mais aussi le Canada, la Belgique ou l'Allemagne). Pour une mobilité, le jury et le conseiller Campus France vérifient la cohérence du projet, le choix du pays, la maîtrise de la langue, le financement et le projet après les études. Le bilinguisme français-anglais est un atout.`,
  afr: `Contexte : personne basée en Afrique francophone, qui candidate localement ou à l'étranger (Campus France, Canada, Maroc, Sénégal…). Le jury vérifie la cohérence du projet, le choix du pays et de l'établissement, la langue, le financement et le projet après les études.`,
  intl: `Contexte : candidature à un programme international ou anglophone (graduate admissions). Les comités attendent un texte personnel et précis : expérience académique, intérêts, adéquation avec le programme et objectifs.`,
};

/* Mode Études : mêmes outils, mais pour une candidature à une formation. */
const STUDY = `Objectif de la personne : candidater à une FORMATION (licence, master, école, doctorat, échange, bourse), pas à un emploi. Dans les données, « offre » désigne la présentation de la formation ou l'appel à candidatures, « entreprise » l'établissement, « poste » la formation visée, et « recruteur » le jury d'admission.
Ce qui compte pour un jury : la cohérence du parcours et du projet d'études, les raisons précises du choix de cette formation et de cet établissement, les résultats et travaux académiques (mémoire, projets, stages, engagements), le projet professionnel qui suit la formation, et pour une mobilité internationale le choix du pays et la faisabilité (langue, financement). N'invente ni note, ni classement, ni mention : laisse un repère entre crochets s'il manque une information.`;

export function contextPrompt({ market, lang, profile } = {}) {
  const out = isStudy() ? [MARKETS_STUDY[market] || MARKETS_STUDY.fr, STUDY] : [MARKETS[market] || MARKETS.fr];
  if (lang === 'en') out.push("Langue de sortie : anglais professionnel (y compris pour le Cameroun anglophone), même si les consignes sont en français.");
  const p = profile || {};
  const lines = [['Ce qui la motive', p.motivation], ['Réussites dont elle est fière', p.achievements], ['Contraintes (lieu, disponibilité, contrat…)', p.constraints], ['Ce qu’elle recherche, ses valeurs', p.values]]
    .filter(([, v]) => v && String(v).trim()).map(([k, v]) => `- ${k} : ${String(v).trim().slice(0, 1200)}`);
  if (p.use !== false && lines.length) out.push("Informations personnelles données par la personne elle-même (faits utilisables tels quels, à ne pas extrapoler) :\n" + lines.join('\n'));
  return out.join('\n\n');
}

/* Résumé de l'analyse de l'offre (écran « Adapter ») pour l'entretien : exigences remplies ou non,
   compétences manquantes, mots-clés. Le recruteur peut ainsi creuser les écarts. */
export function offerInsights(an) {
  if (!an || typeof an !== 'object') return '';
  const t = (v, n) => String(v || '').slice(0, n);
  const req = (Array.isArray(an.requirements) ? an.requirements : []).slice(0, 12).map(r => `- ${r.met ? '✓' : '✗'} ${t(r.label, 200)}${r.detail ? ' (' + t(r.detail, 200) + ')' : ''}`);
  const miss = (Array.isArray(an.missingSkills) ? an.missingSkills : []).slice(0, 10).map(x => t(x, 80));
  const kw = (Array.isArray(an.keywords) ? an.keywords : []).slice().sort((a, b) => (b.w || 0) - (a.w || 0)).slice(0, 12).map(k => t(k.k, 60));
  if (!req.length && !miss.length && !kw.length) return '';
  return `Analyse de l'adéquation CV / offre :${req.length ? '\nExigences du poste (✓ couverte par le CV, ✗ non démontrée) :\n' + req.join('\n') : ''}${miss.length ? '\nCompétences demandées absentes du CV : ' + miss.join(', ') : ''}${kw.length ? '\nMots-clés importants : ' + kw.join(', ') : ''}`;
}

/* Style du recruteur simulé (écrit et vocal). */
export const INTERVIEW_TONES = {
  kind: "Style : bienveillant·e et encourageant·e. Tu mets la personne à l'aise ; relances douces quand une réponse est floue.",
  tough: "Style : exigeant·e et direct·e, comme un entretien difficile. Tu relances systématiquement une réponse vague (« Concrètement ? », « Quel résultat chiffré ? »), tu peux contredire poliment ou pointer une faiblesse du CV. Jamais agressif·ve ni humiliant·e.",
  campus: "Style : entretien pédagogique Campus France (« Études en France »), mené par un·e conseiller·ère. Ton neutre et vérificateur. Questions attendues : présentation et parcours (y compris les années de rupture ou de réorientation), projet d'études et cohérence avec le parcours, choix de la France, de la formation et de l'établissement, connaissance du programme, financement des études et du séjour, projet professionnel et retour éventuel. Tu demandes des précisions quand une réponse reste vague.",
  panel: "Style : entretien en panel avec deux personnes. Une responsable RH (motivation, comportement, adéquation avec l'entreprise) et un·e manager opérationnel·le (questions métier et mises en situation). Elles alternent ; à chaque question, la personne qui parle se nomme (« Ici [prénom], manager de l'équipe… »).",
};
export const toneOf = (t) => INTERVIEW_TONES[t] || INTERVIEW_TONES.kind;
/* Rôle de l'interlocuteur selon l'objectif (emploi ou études). */
export const interviewerRole = () =>
  isStudy()
    ? "membre d'un jury d'admission (ou conseiller·ère Campus France selon le style) qui mène un entretien d'admission pour la formation ci-dessous"
    : "recruteur·se exigeant·e mais bienveillant·e qui mène un entretien d'embauche pour le poste ci-dessous";
