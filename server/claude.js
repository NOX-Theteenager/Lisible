import Anthropic from '@anthropic-ai/sdk';
import { cvForPrompt, bad, contextPrompt } from './gemini.js';
import { briefPrompt } from './research.js';
import { isStudy } from './context.js';

let client = null;
const MODEL = () => process.env.CLAUDE_MODEL || 'claude-sonnet-5-5';

function anthropic() {
  if (!process.env.ANTHROPIC_API_KEY) { const e = new Error('Clé ANTHROPIC_API_KEY non configurée sur le serveur.'); e.status = 503; e.expose = true; throw e; }
  if (!client) client = new Anthropic();
  return client;
}

/* Les sorties structurées de Claude exigent additionalProperties:false sur chaque objet. */
function strictSchema(node) {
  if (Array.isArray(node)) return node.map(strictSchema);
  if (!node || typeof node !== 'object') return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) out[k] = strictSchema(v);
  if (out.type === 'object') out.additionalProperties = false;
  return out;
}

/* Convertit les « parts » Gemini (texte, image, PDF) en blocs de contenu Claude. */
function toContent(parts) {
  const blocks = [];
  for (const p of parts || []) {
    if (p.text) blocks.push({ type: 'text', text: p.text });
    else if (p.inlineData) {
      const { mimeType, data } = p.inlineData;
      if (mimeType === 'application/pdf') blocks.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data } });
      else if (/^image\/(jpeg|png|gif|webp)$/.test(mimeType)) blocks.push({ type: 'image', source: { type: 'base64', media_type: mimeType, data } });
    }
  }
  // Les fichiers passent avant le texte, comme le recommande l'API.
  return blocks.sort((a, b) => (a.type === 'text') - (b.type === 'text'));
}

/* Remplaçant de Gemini : mêmes consignes, mêmes entrées, même schéma JSON. */
export async function claudeJSON({ system, parts, schema }) {
  const res = await anthropic().beta.messages.create({
    model: MODEL(),
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: strictSchema(schema) } },
    system,
    messages: [{ role: 'user', content: toContent(parts) }],
  });
  if (res.stop_reason === 'refusal') { const e = new Error('La demande a été refusée par le modèle.'); e.status = 422; e.expose = true; throw e; }
  if (res.stop_reason === 'max_tokens') { const e = new Error('Réponse trop longue : réessayez avec un document plus court.'); e.status = 502; e.expose = true; throw e; }
  const txt = res.content.filter(b => b.type === 'text').map(b => b.text).join('');
  try { return JSON.parse(txt); } catch { const e = new Error('Réponse IA illisible'); e.status = 502; throw e; }
}

const TONES = {
  Sobre: 'sobre et posé : phrases nettes, pas d’exclamation, chaleur discrète',
  Enthousiaste: 'chaleureux et engagé, sans emphase ni superlatifs : l’envie se lit dans les détails choisis',
  Direct: 'direct et concret : va droit à ce que la personne apporte, phrases courtes',
};

const SYSTEM = `Tu écris des lettres de motivation qui sonnent comme si la personne les avait écrites elle-même, un soir, en pensant vraiment à ce poste.

Ce qui rend une lettre humaine et personnelle :
- Elle part d'un lien précis entre le parcours de la personne et ce que l'entreprise fait ou cherche (un élément concret de l'offre : une mission, un enjeu, un public, un produit).
- Elle raconte une ou deux réalisations réelles du CV avec leur contexte et leur résultat, plutôt que de lister des qualités.
- Elle a une voix : phrases de longueurs variées, vocabulaire simple, une ou deux tournures personnelles, aucune formule administrative toute faite.
- Elle est courte : 220 à 330 mots pour le corps.

Interdits absolus :
- Inventer un fait, un chiffre, un outil, une motivation ou un lien avec l'entreprise qui n'est ni dans le CV, ni dans l'offre, ni dans la fiche entreprise fournie. Si un élément personnel manque (par exemple pourquoi cette entreprise en particulier), écris un repère entre crochets que la personne complétera, comme [ce qui vous attire dans leur produit].
- Clichés : « je me permets », « c'est avec un grand intérêt », « passionné·e », « dynamique », « motivé·e », « rigoureux·se », « force de proposition », « esprit d'équipe », « valeur ajoutée », « relever de nouveaux défis », « leader dans son domaine », « dans l'attente de votre réponse ».
- Tirets cadratins, questions rhétoriques, énumérations systématiques par trois, phrases toutes construites pareil, plus de trois phrases commençant par « Je ».

Format de sortie : uniquement le corps de la lettre, de la formule d'appel (« Madame, Monsieur, » ou le nom du contact s'il figure dans l'offre) jusqu'à la formule de politesse finale incluse, paragraphes séparés par une ligne vide. Pas d'en-tête, pas d'objet, pas de signature, pas de commentaire avant ou après.`;

/* ─── Mode Études : documents de candidature à une formation ─── */
const SYSTEM_STUDY = `Tu aides une personne à écrire ses documents de candidature à une formation (lettre de motivation, projet d'études, statement of purpose, personal statement). Le texte doit sonner comme si elle l'avait écrit elle-même : un jury lit des centaines de dossiers et repère tout de suite les textes génériques.

Ce qui rend le texte convaincant pour un jury :
- Un lien précis entre le parcours de la personne et ce que la formation propose (un élément concret de la présentation fournie : cours, spécialisation, projet, stage, laboratoire, débouché).
- Un ou deux travaux réels tirés du CV (projet, mémoire, stage, engagement, emploi) racontés avec leur contexte et ce que la personne en a tiré, plutôt qu'une liste de qualités.
- Un projet professionnel clair après la formation, et pour une mobilité à l'étranger les raisons du choix du pays et de l'établissement.
- Une voix : phrases de longueurs variées, vocabulaire simple et précis, aucune formule toute faite.

Interdits absolus :
- Inventer une note, une mention, un classement, un cours, un professeur, un fait, un chiffre ou une motivation absents du CV, de la présentation de la formation, de la fiche établissement ou de ce que la personne a dit d'elle. S'il manque un élément personnel, écris un repère entre crochets que la personne complétera, comme [le cours du programme qui vous attire le plus].
- Clichés : « depuis mon plus jeune âge », « j'ai toujours été passionné·e », « votre prestigieux établissement », « c'est avec un grand intérêt », « je me permets », « motivé·e », « rigoureux·se », « dynamique », « relever de nouveaux défis », « dans l'attente de votre réponse ».
- Tirets cadratins et demi-cadratins, questions rhétoriques, énumérations systématiques par trois, plus de trois phrases commençant par « Je ».`;

const DOCS = {
  lettre: { what: 'une lettre de motivation pour cette formation', len: '250 à 380 mots pour le corps', letter: true },
  projet: { what: "un « projet d'études » ou « projet de formation motivé » à coller dans une plateforme de candidature (Campus France, Parcoursup, Mon Master…)", len: 'entre 1 200 et 1 500 caractères espaces compris' },
  sop: { what: 'un statement of purpose (parcours académique, intérêts, raisons du choix du programme, objectifs)', len: '600 à 900 mots' },
  ps: { what: 'un personal statement (motivation pour la discipline, ce que la personne a fait pour l’explorer, ce qu’elle apportera)', len: 'au plus 4 000 caractères espaces compris' },
};
export const DOC_KINDS = Object.keys(DOCS);

const ANGLES_STUDY = {
  realisation: 'Construis le texte autour du travail le plus marquant du parcours (projet, mémoire, stage ou engagement) et de ce qu’il a révélé de l’intérêt de la personne pour cette formation.',
  motivation: 'Construis le texte autour du choix de cette formation et de cet établissement précis (éléments concrets de la présentation, de la fiche établissement), en t’appuyant sur ce que la personne a dit de ses motivations.',
  parcours: 'Construis le texte autour de la cohérence du parcours et du projet professionnel : comment chaque étape mène à cette formation, et ce qu’elle permettra ensuite.',
};

/* Angles proposés pour les variantes de lettre. */
export const ANGLES = {
  realisation: 'Construis la lettre autour de la réalisation la plus forte et la plus pertinente du CV pour ce poste : contexte, action, résultat, puis ce que cela apportera à l’entreprise.',
  motivation: 'Construis la lettre autour de la motivation pour cette entreprise et cette mission précises (éléments de l’offre, enjeux, public), en t’appuyant sur ce que la personne a dit de ses motivations.',
  parcours: 'Construis la lettre autour de la cohérence du parcours : comment chaque étape mène logiquement à ce poste, et la progression qu’il représente.',
};

export function buildLetter({ cv, offer, tone, mode, oldLetter, lang, market, profile, angle, brief: company, doc, limit }) {
  const o = offer || {};
  if (!cv || !cv.contact) throw bad('CV manquant');
  const study = isStudy();
  if (!String(o.company || '').trim() || !String(o.role || '').trim()) throw bad(study ? 'Indiquez l’établissement et la formation visée.' : 'Indiquez l’entreprise et le poste visé.');
  if (mode === 'improve' && !String(oldLetter || '').trim()) throw bad('Importez ou collez d’abord votre lettre.');
  const en = lang === 'en';
  const brief = [
    `Langue de la lettre : ${en ? 'anglais (formule d’appel « Dear Hiring Manager, », politesse « Kind regards, »)' : 'français'}.`,
    `Ton souhaité : ${TONES[tone] || TONES.Sobre}.`,
    contextPrompt({ market, lang, profile }),
    `Entreprise : ${o.company}\nPoste visé : ${o.role}`,
    `Offre d'emploi :\n${String(o.text || '').slice(0, 20_000) || '(texte de l’offre non fourni : appuie-toi sur l’intitulé du poste et laisse un repère pour le lien avec l’entreprise)'}`,
    `CV de la personne (JSON) :\n${cvForPrompt(cv)}`,
  ];
  const info = briefPrompt(company);
  if (info) brief.push(`${info}\nPour le lien avec l'entreprise, appuie-toi sur UN élément précis de cette fiche (une activité, une actualité, un engagement) relié à l'expérience de la personne, formulé simplement et sans flatterie. N'utilise que ce qui figure dans la fiche ; si la personne a donné ses propres motivations, elles priment.`);
  const D = study ? DOCS[doc] || DOCS.lettre : null;
  const max = Number(limit) >= 300 && Number(limit) <= 20_000 ? Math.round(Number(limit)) : 0;
  if (study) {
    brief[0] = `Langue du texte : ${en ? 'anglais' : 'français'}.`;
    brief[3] = `Établissement : ${o.company}\nFormation visée : ${o.role}`;
    brief[4] = `Présentation de la formation ou appel à candidatures :\n${String(o.text || '').slice(0, 20_000) || '(non fournie : appuie-toi sur l’intitulé de la formation et laisse un repère pour ce qui attire la personne dans le programme)'}`;
    // Les modèles comptent mal les caractères : on vise 85 % de la limite, exprimés aussi en mots (≈ 6,3 caractères par mot).
    const target = Math.floor(max * 0.85);
    brief.push(`Document à écrire : ${D.what}. Longueur : ${max ? `${target} caractères environ, soit à peu près ${Math.round(target / 6.3)} mots ; la plateforme refuse tout texte de plus de ${max} caractères espaces compris, donc reste nettement en dessous` : D.len}.`);
    brief.push(D.letter
      ? `Format de sortie : uniquement le corps de la lettre, de la formule d'appel (« Madame, Monsieur, » ou le nom du ou de la responsable de formation s'il est fourni${en ? ' ; en anglais « Dear Admissions Committee, »' : ''}) jusqu'à la formule de politesse finale incluse, paragraphes séparés par une ligne vide. Pas d'en-tête, pas d'objet, pas de signature, pas de commentaire.`
      : `Format de sortie : uniquement le texte, en paragraphes séparés par une ligne vide, sans titre, sans formule d'appel ni signature, sans commentaire.`);
  }
  const ANG = study ? ANGLES_STUDY : ANGLES;
  if (ANG[angle]) brief.push('Angle de cette version : ' + ANG[angle]);
  if (mode === 'improve') brief.push(`Lettre actuelle de la personne, à améliorer. Garde ce qui est vrai et personnel dans sa version (anecdotes, raisons, faits), retire les formules creuses, ajoute les preuves chiffrées du CV et le lien explicite avec l'offre :\n${String(oldLetter).slice(0, 12_000)}`);
  else brief.push(study ? 'Écris un nouveau texte.' : 'Écris une nouvelle lettre.');

  const c = cv.contact;
  const contactLine = [c.city, c.phone, c.email, c.linkedin, c.github].filter(x => x && String(x).trim()).join(' | ');
  const city = String(c.city || '').split(',')[0].trim();
  const today = new Date().toLocaleDateString(en ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const head = [c.name, contactLine].filter(Boolean).join('\n');
  const recipient = [o.company, en ? (city ? city + ', ' : '') + today : (city ? city + ', le ' : 'Le ') + today].join('\n');
  const object = study
    ? en ? `Subject: Application for ${o.role}` : `Objet : candidature à la formation ${o.role}`
    : en ? `Subject: Application for the ${o.role} position` : `Objet : candidature au poste de ${o.role}`;
  // Projet d'études, statement of purpose et personal statement se collent dans un formulaire : ni en-tête ni signature.
  const bare = study && !D.letter;
  return {
    request: { model: MODEL(), max_tokens: 16000, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default', output_config: { effort: 'high' }, system: study ? SYSTEM_STUDY : SYSTEM, messages: [{ role: 'user', content: brief.join('\n\n') }] },
    top: bare ? '' : `${head}\n\n${recipient}\n\n${object}\n\n`,
    signature: bare ? '' : `\n\n${c.name || ''}`,
  };
}

const refused = () => { const e = new Error('La rédaction a été refusée par le modèle. Reformulez l’offre ou réessayez.'); e.status = 422; e.expose = true; return e; };

export async function writeLetter(input) {
  const L = buildLetter(input);
  const res = await anthropic().beta.messages.create(L.request);
  if (res.stop_reason === 'refusal') throw refused();
  const body = res.content.filter(b => b.type === 'text').map(b => b.text).join('').trim();
  if (!body) { const e = new Error('Réponse vide du modèle'); e.status = 502; throw e; }
  return { text: (L.top + body + L.signature).trim(), model: res.model };
}

/* Version progressive : envoie des lignes JSON { type: 'delta' | 'done' | 'error' } au fil de la rédaction. */
export async function streamLetter(input, res) {
  const send = o => res.write(JSON.stringify(o) + '\n');
  let L;
  try { L = buildLetter(input); } catch (e) { res.status(e.status || 400).json({ error: e.message }); return; }
  res.status(200).setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Accel-Buffering', 'no');
  send({ type: 'delta', text: L.top });
  let body = '';
  try {
    const stream = anthropic().beta.messages.stream(L.request);
    res.on('close', () => { try { stream.abort(); } catch {} });
    for await (const ev of stream) {
      if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') { body += ev.delta.text; send({ type: 'delta', text: ev.delta.text }); }
    }
    const final = await stream.finalMessage();
    if (final.stop_reason === 'refusal') throw refused();
    send({ type: 'done', text: (L.top + body.trim() + L.signature).trim(), model: final.model });
  } catch (e) {
    console.error('[lettre]', e.message);
    send({ type: 'error', error: e.expose ? e.message : 'La rédaction a été interrompue. Réessayez.' });
  }
  res.end();
}
