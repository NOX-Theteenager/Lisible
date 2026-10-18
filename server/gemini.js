import { GoogleGenAI } from '@google/genai';

let client = null;
const MODEL = () => process.env.GEMINI_MODEL || 'gemini-2.5-flash';

function ai() {
  if (!process.env.GEMINI_API_KEY) { const e = new Error('Clé GEMINI_API_KEY non configurée sur le serveur.'); e.status = 503; e.expose = true; throw e; }
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

/* Consigne commune à toutes les réécritures (reprise du prototype). */
export const STYLE = `Écris en français naturel (ou dans la langue demandée), voix active, phrases de longueur variée.
Aucun cliché ni formule creuse (« passionné », « dynamique », « force de proposition », « valeur ajoutée », « dans un monde en constante évolution », « il est important de noter », etc.).
Aucun tiret cadratin pour rythmer, pas de question rhétorique, pas d'énumération systématique par trois.
N'invente JAMAIS un chiffre, une entreprise, un outil ou un résultat : utilise uniquement les faits fournis. Si une donnée manque, laisse un repère entre crochets comme [X %] ou [nombre d'utilisateurs].`;

/**
 * Appel Gemini avec sortie JSON contrainte.
 * parts : tableau de { text } ou { inlineData: { mimeType, data } }.
 */
export async function genJSON({ system, parts, schema, temperature = 0.4 }) {
  const res = await ai().models.generateContent({
    model: MODEL(),
    contents: [{ role: 'user', parts }],
    config: {
      systemInstruction: system,
      temperature,
      responseMimeType: 'application/json',
      responseJsonSchema: schema,
    },
  });
  const txt = res.text || '';
  try { return JSON.parse(txt); } catch {
    const m = /\{[\s\S]*\}/.exec(txt);
    if (m) return JSON.parse(m[0]);
    const e = new Error('Réponse IA illisible'); e.status = 502; throw e;
  }
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
