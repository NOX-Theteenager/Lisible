import { genJSON, S, STYLE, CV_SCHEMA, LEVELS, cvForPrompt, bad, contextPrompt, offerInsights, toneOf, interviewerRole } from './gemini.js';
import { companyBrief, briefPrompt } from './research.js';
import { isStudy } from './context.js';

/* Ce que l'on sait du poste et de l'entreprise, ajouté aux consignes d'entretien. */
const jobContext = (analysis, brief) => [offerInsights(analysis), briefPrompt(brief)].filter(Boolean).join('\n\n');

const MAX_TEXT = 60_000;
const txt = (v, max = MAX_TEXT) => String(v || '').slice(0, max);
const b64 = v => (typeof v === 'string' ? v.replace(/^data:[^,]+,/, '') : '');
const fileParts = f => (f && f.data ? [{ inlineData: { mimeType: f.mimeType || 'application/octet-stream', data: b64(f.data) } }] : []);

const ATS_RULES = `Règles ATS de référence : une seule colonne ; titres de sections standards (Résumé professionnel, Expérience professionnelle, Formation, Compétences, Langues, Projets, Certifications) ; aucune information dans l'en-tête ou le pied de page ; pas de tableau, zone de texte, image, icône, jauge ou graphique ; police standard (Arial, Calibri, Times New Roman, Helvetica…) ; dates au format MM/AAAA ; coordonnées complètes en haut du corps ; réalisations commençant par un verbe d'action et chiffrées.`;

/* ─── Réécriture sans tics ─────────────────────────────────── */
async function humanize({ text, context, lang, market }) {
  if (!String(text || '').trim()) throw bad('Texte vide');
  return genJSON({
    system: `Tu es correcteur·rice éditorial·e spécialisé·e en candidatures. ${STYLE}
Réécris le texte pour qu'il sonne humain et précis, sans changer les faits. Conserve la langue d'origine${lang === 'en' ? ' (anglais)' : ''}. Contexte : ${context || 'texte libre'}.
${contextPrompt({ market, lang })}
Pour un résumé de CV : 3 à 4 phrases, sans « je ». Pour une lettre : conserve l'en-tête, la formule d'appel et la signature.
"notes" : 2 à 4 remarques courtes sur ce que tu as changé.`,
    parts: [{ text: txt(text) }],
    schema: S.obj({ text: S.str, notes: S.arr(S.str) }),
    temperature: 0.6,
  });
}

async function integrateMetric({ bullet, answer }) {
  if (!String(answer || '').trim()) throw bad('Réponse vide');
  return genJSON({
    system: `Tu reformules une ligne de réalisation de CV en y intégrant le résultat chiffré fourni par la personne. ${STYLE}
Une seule phrase, commençant par un verbe d'action au participe passé (ex. « Migré », « Réduit »), sans pronom personnel, terminée par un point. N'ajoute aucun chiffre absent de la réponse.`,
    parts: [{ text: `Réalisation : ${txt(bullet, 600)}\nRésultat réel : ${txt(answer, 400)}` }],
    schema: S.obj({ text: S.str }),
  });
}

async function suggestBullet({ bullet, role, company, title, lang, market }) {
  if (!String(bullet || '').trim()) return { alts: [] };
  return genJSON({
    system: `Tu proposes deux reformulations d'une réalisation de CV pour les ATS. ${STYLE}
Chaque proposition : une phrase, commence par un verbe d'action fort au participe passé, décrit l'action et son résultat. Si le résultat chiffré manque, laisse un repère entre crochets ([X %], [N] utilisateurs…) au lieu d'inventer.
Si la ligne est déjà excellente (verbe d'action + résultat chiffré), renvoie une liste vide. Langue : ${lang === 'en' ? 'anglais' : 'français'}.
${contextPrompt({ market })}`,
    parts: [{ text: `Poste : ${txt(role, 200)} chez ${txt(company, 200)} (titre visé : ${txt(title, 200)})\nRéalisation : ${txt(bullet, 800)}` }],
    schema: S.obj({ alts: S.arr(S.str) }),
    temperature: 0.7,
  });
}

async function suggestSummary({ cv, offer, market, lang, profile }) {
  return genJSON({
    system: `Tu rédiges le résumé professionnel d'un CV conforme ATS. ${STYLE}
3 à 4 phrases, 40 à 80 mots, sans « je », les 3 compétences clés dans la première phrase, uniquement à partir des faits du CV.${offer ? ' Oriente le résumé vers l’offre fournie sans inventer de compétence.' : ''} Langue du CV.
${contextPrompt({ market, lang, profile })}`,
    parts: [{ text: `CV : ${cvForPrompt(cv)}${offer ? '\n\nOffre : ' + txt(offer, 8000) : ''}` }],
    schema: S.obj({ text: S.str }),
    temperature: 0.6,
  });
}

async function suggestSkills({ title, skills, summary }) {
  return genJSON({
    system: `Tu suggères des compétences techniques fréquemment demandées dans les offres pour un intitulé de poste donné, orthographiées comme dans les offres (ex. « Next.js », « CI/CD »). Renvoie 6 à 8 compétences absentes de la liste existante, de la plus fréquente à la moins fréquente.`,
    parts: [{ text: `Intitulé : ${txt(title, 200)}\nRésumé : ${txt(summary, 1500)}\nCompétences existantes : ${(skills || []).join(', ')}` }],
    schema: S.obj({ skills: S.arr(S.str) }),
  });
}

/* ─── Import et analyse de conformité d'un CV ───────────────── */
async function parseCv({ fileName, mimeType, data, text, html, mode, source }) {
  const parts = [];
  if (data && /^(application\/pdf|image\/)/.test(mimeType || '')) parts.push(...fileParts({ mimeType, data }));
  const ctx = [`Fichier : ${txt(fileName, 200)} (${mimeType || 'inconnu'})${source === 'linkedin' ? ' — export PDF d’un profil LinkedIn' : ''}`];
  if (text) ctx.push('Texte extrait du fichier (ordre de lecture brut d’un ATS) :\n' + txt(text));
  if (html) ctx.push('Structure HTML du document Word (révèle tableaux et images) :\n' + txt(html, 30_000));
  if (!parts.length && !text) throw bad('Aucun contenu lisible dans ce fichier.');
  parts.push({ text: ctx.join('\n\n') });
  const out = await genJSON({
    system: `Tu es un analyseur de CV et un auditeur de conformité ATS.
${ATS_RULES}
1. Extrais fidèlement TOUT le contenu dans la structure demandée. ${mode === 'simple' ? 'Mode « conformité seule » : recopie les formulations mot pour mot, sans reformuler ni corriger le style.' : 'Ne reformule pas encore les réalisations : recopie-les telles quelles (une puce = un élément de "bullets").'}
   - Dates converties au format MM/AAAA ; poste en cours : « Présent ». Si seul l'an est connu, utilise 01/AAAA.
   - Niveaux de langue : choisis parmi ${LEVELS.join(' ; ')}.
   - Champs inconnus : chaîne vide. N'invente rien.
   - Expériences en ordre antichronologique.
2. "issues" : liste des problèmes de conformité RÉELLEMENT observés dans ce document (mise en page, en-têtes, tableaux, icônes, photo, police, dates, titres de sections non standards, longueur, etc.). Sévérité : « Bloquant », « Important » ou « Mineur ». "t" titre court, "d" explication factuelle citant le document, "fix" correction appliquée à la conversion.
3. "mapping" : pour chaque section du document, son libellé d'origine ("from") et la section standard correspondante ("to"), avec une confiance 0-100.
4. "score" : note de conformité ATS du document d'origine sur 100 (100 = parfait ; retire des points selon la gravité des problèmes).
5. "headline" : une phrase de diagnostic.
6. "rawText" : le texte tel qu'un ATS le lirait, dans l'ordre de lecture du fichier (si un texte extrait est fourni, reprends-le ; sinon transcris le document, en signalant entre crochets les éléments non textuels : [IMAGE], [TABLEAU], [EN-TÊTE]).
7. "visualZones" : nombre de zones image/graphique nécessitant une lecture visuelle (0 si aucune).`,
    parts,
    schema: S.obj({
      cv: CV_SCHEMA,
      issues: S.arr(S.obj({ sev: { type: 'string', enum: ['Bloquant', 'Important', 'Mineur'] }, t: S.str, d: S.str, fix: S.str })),
      mapping: S.arr(S.obj({ from: S.str, to: S.str, conf: S.int })),
      score: S.int,
      headline: S.str,
      rawText: S.str,
      visualZones: S.int,
    }),
    temperature: 0.1,
  });
  out.score = Math.max(0, Math.min(100, out.score | 0));
  return out;
}

/* ─── Offres d'emploi ───────────────────────────────────────── */
async function extractOffer({ text, url, image, pdf }) {
  const parts = [];
  if (image) parts.push(...fileParts(image));
  if (pdf) parts.push(...fileParts({ mimeType: 'application/pdf', data: pdf.data }));
  if (text) parts.push({ text: (url ? `Page : ${url}\n\n` : '') + txt(text) });
  if (!parts.length) throw bad('Aucune offre à analyser.');
  const out = await genJSON({
    system: `Tu extrais une offre d'emploi à partir d'une page web, d'un document ou d'une image (lis le texte de l'image si besoin).
"text" : le texte complet et propre de l'annonce, dans sa langue d'origine, sans menus, cookies ni offres similaires ; garde les titres de parties (Missions, Profil…) et les listes à puces avec « - ».
"sections" : titres de parties détectés. "keywords" : 8 à 14 mots-clés importants de l'offre en minuscules (outils, compétences, domaine).
Si le contenu ne contient aucune offre d'emploi, renvoie found=false et laisse les autres champs vides.`,
    parts,
    schema: S.obj({ found: S.bool, company: S.str, role: S.str, location: S.str, contract: S.str, text: S.str, sections: S.arr(S.str), keywords: S.arr(S.str) }),
    temperature: 0.1,
  });
  if (!out.found) throw bad('Aucune offre d’emploi détectée dans ce contenu.');
  out.wordCount = (out.text.match(/\S+/g) || []).length;
  return out;
}

async function analyzeOffer({ cv, offer, market, lang }) {
  if (!String(offer || '').trim()) throw bad('Collez d’abord le texte de l’offre.');
  const out = await genJSON({
    system: `${isStudy() ? "Tu compares la présentation d'une formation (ou un appel à candidatures) à un CV pour adapter le CV à cette candidature : « company » est l'établissement, « role » la formation, les « requirements » sont les attendus et prérequis de la formation" : "Tu compares une offre d'emploi à un CV pour l'adapter aux ATS"}, sans jamais inventer d'expérience.
- "company", "role" : entreprise et intitulé exact du poste de l'offre.
- "keywords" : 12 à 20 mots-clés de l'offre. "k" libellé tel qu'écrit dans l'offre, "g" groupe (tech = outils et compétences techniques, soft = compétences transverses, domain = secteur/réglementation), "w" importance 1 à 3, "a" variantes en minuscules qui prouvent sa présence dans un CV (au moins le libellé en minuscules).
- "requirements" : 3 à 6 exigences explicites (années d'expérience, langue, localisation, diplôme…), "met" si le CV y répond, "detail" ce que le CV indique.
- "missingSkills" : compétences demandées absentes de la section Compétences du CV.
- "rewrites" : 3 à 6 réécritures ciblées. kind = "summary" (nouveau résumé, exp=-1, b=-1), "bullet" (remplace la réalisation b de l'expérience exp, indices à partir de 0 dans le CV fourni) ou "add" (nouvelle réalisation dans l'expérience exp, b=-1). "where" : lieu lisible (« Résumé professionnel », « Entreprise · réalisation 2 »). "after" : texte proposé. "adds" : mots-clés de l'offre ajoutés. "check" : ce que la personne doit vérifier avant d'accepter (ex. un chiffre ou un outil à confirmer) ; chaîne vide sinon.
  ${STYLE}
  Ne réutilise que les faits du CV ; un outil absent du CV ne peut apparaître que dans une réécriture dont "check" demande de le confirmer.
${contextPrompt({ market, lang })}`,
    parts: [{ text: `OFFRE :\n${txt(offer, 20_000)}\n\nCV (JSON) :\n${cvForPrompt(cv)}\n\n${slotMap(cv)}` }],
    schema: S.obj({
      company: S.str,
      role: S.str,
      keywords: S.arr(S.obj({ k: S.str, g: { type: 'string', enum: ['tech', 'soft', 'domain'] }, w: S.int, a: S.arr(S.str) })),
      requirements: S.arr(S.obj({ label: S.str, met: S.bool, detail: S.str })),
      missingSkills: S.arr(S.str),
      rewrites: S.arr(S.obj({ where: S.str, kind: { type: 'string', enum: ['summary', 'bullet', 'add'] }, exp: S.int, b: S.int, after: S.str, adds: S.arr(S.str), check: S.str })),
    }),
    temperature: 0.3,
  });
  out.keywords = out.keywords.map(k => ({ ...k, w: Math.max(1, Math.min(3, k.w | 0)), a: [...new Set([k.k.toLowerCase(), ...(k.a || []).map(x => String(x).toLowerCase())])].filter(Boolean) }));
  out.rewrites = placeRewrites(cv, out.rewrites).map((r, i) => ({ ...r, id: 'r' + (i + 1) }));
  return out;
}

/* Plan numéroté des emplacements du CV, pour que le modèle n'ait pas à compter les expériences. */
export function slotMap(cv) {
  const ex = (cv && Array.isArray(cv.experiences) ? cv.experiences : []);
  if (!ex.length) return 'EMPLACEMENTS : aucune expérience ; seules les réécritures « summary » sont possibles.';
  return 'EMPLACEMENTS (valeurs exactes à utiliser pour "exp" et "b") :\n' + ex.map((e, i) => {
    const bl = (e.bullets || []).map((b, j) => `    b=${j} : ${txt(b, 140)}`).join('\n');
    return `  exp=${i} : ${[e.role, e.company].filter(Boolean).join(' · ') || '(sans intitulé)'}${bl ? '\n' + bl : '\n    (aucune réalisation)'}`;
  }).join('\n');
}

/* Vérifie la place de chaque réécriture : l'indice doit exister et désigner l'expérience nommée dans
   "where". Sinon on la retrouve par l'entreprise ou le poste ; si c'est impossible, on l'écarte plutôt
   que de l'ajouter au mauvais endroit. */
export function placeRewrites(cv, rewrites) {
  const ex = (cv && Array.isArray(cv.experiences) ? cv.experiences : []);
  const norm = t => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const named = where => {
    const w = norm(where);
    const hits = ex.map((e, i) => ({ i, score: [e.company, e.role].filter(x => x && String(x).trim().length > 1 && w.includes(norm(x))).length })).filter(h => h.score);
    hits.sort((a, b) => b.score - a.score);
    return hits.length && (hits.length === 1 || hits[0].score > hits[1].score) ? hits[0].i : -1;
  };
  return (rewrites || []).flatMap(r => {
    if (r.kind === 'summary') return [{ ...r, exp: -1, b: -1 }];
    let exp = Number.isInteger(r.exp) && r.exp >= 0 && r.exp < ex.length ? r.exp : -1;
    const byName = named(r.where);
    if (byName >= 0 && byName !== exp) exp = byName; // l'intitulé lisible fait foi
    if (exp < 0) return [];
    const n = (ex[exp].bullets || []).length;
    if (r.kind === 'bullet') return Number.isInteger(r.b) && r.b >= 0 && r.b < n ? [{ ...r, exp }] : [{ ...r, exp, kind: 'add', b: -1 }];
    return [{ ...r, exp, b: -1 }];
  });
}

/* ─── Entretien ─────────────────────────────────────────────── */
async function interview({ cv, offer, market, lang, profile, analysis, brief }) {
  const o = offer || {};
  return genJSON({
    system: `Tu prépares un·e candidat·e à un entretien à partir de son CV et de l'offre. ${STYLE}
- "questions" : 7 à 9 questions probables, groupe « Motivation », « Technique » ou « Comportement ». "hint" : un conseil concret pour y répondre. "star" : trame STAR pré-remplie UNIQUEMENT avec des faits du CV quand une expérience s'y prête ; sinon chaînes vides. Pour un résultat inconnu, mets un repère [à compléter].
- "pitch" : pitch oral de 70 à 80 mots, à la première personne, ton parlé, avec un fait chiffré du CV et un lien explicite avec l'entreprise.
- "linkedin" : "headline" (moins de 220 caractères) et "about" (3 à 5 courts paragraphes, première personne, faits du CV, se termine par ce que la personne recherche).
Langue : celle du CV.
${contextPrompt({ market, lang, profile })}
${jobContext(analysis, brief)}
Si des informations sur l'entreprise sont fournies, au moins une question et le pitch s'y réfèrent ; une question porte sur une exigence non démontrée par le CV.`,
    parts: [{ text: `Entreprise : ${txt(o.company, 200)}\nPoste : ${txt(o.role, 200)}\nOffre :\n${txt(o.text, 15_000) || '(non fournie)'}\n\nCV :\n${cvForPrompt(cv)}` }],
    schema: S.obj({
      questions: S.arr(S.obj({ group: { type: 'string', enum: ['Motivation', 'Technique', 'Comportement'] }, q: S.str, hint: S.str, star: S.obj({ s: S.str, t: S.str, a: S.str, r: S.str }) })),
      pitch: S.str,
      linkedin: S.obj({ headline: S.str, about: S.str }),
    }),
    temperature: 0.6,
  });
}

/* ─── Traduction ────────────────────────────────────────────── */
async function translateCv({ cv, lang }) {
  const target = lang === 'en' ? 'anglais' : 'français';
  const out = await genJSON({
    system: `Tu traduis un CV en ${target} professionnel, naturel, adapté aux ATS du pays cible. Conserve exactement la même structure, le même nombre d'éléments et le même ordre. Ne traduis pas les noms propres (entreprises, écoles, outils, liens). Dates : format MM/YYYY ; « Présent » devient « Present ». Niveaux de langue : Native, Bilingual (C2), Fluent (C1), Advanced (B2), Intermediate (B1), Basic (A2). Réalisations : verbe d'action au passé en tête (Built, Led, Reduced…).`,
    parts: [{ text: cvForPrompt(cv) }],
    schema: S.obj({ cv: CV_SCHEMA }),
    temperature: 0.2,
  });
  return out;
}

/* ─── Lecture de texte (lettre existante en image ou PDF) ──── */
async function ocr({ image, pdf }) {
  const parts = image ? fileParts(image) : pdf ? fileParts({ mimeType: 'application/pdf', data: pdf.data }) : [];
  if (!parts.length) throw bad('Aucun fichier');
  parts.push({ text: 'Transcris fidèlement le texte de ce document, paragraphes séparés par une ligne vide.' });
  return genJSON({ system: 'Tu es un moteur OCR exact. Ne corrige ni ne résume rien.', parts, schema: S.obj({ text: S.str }), temperature: 0 });
}

/* ─── Simulation d'entretien : le modèle joue le recruteur ───── */
async function mockInterview({ cv, offer, history, total, market, lang, profile, analysis, brief, tone }) {
  const o = offer || {}, h = Array.isArray(history) ? history.slice(-12) : [], n = Math.min(Math.max(Number(total) || 5, 3), 10);
  const done = h.length >= n;
  const out = await genJSON({
    system: `Tu joues le rôle d'un·e ${interviewerRole()}, puis tu coaches la personne.
${contextPrompt({ market, lang, profile })}
${jobContext(analysis, brief)}
${toneOf(tone)} Le style ne change rien à l'évaluation : le retour STAR reste juste et constructif.
Déroulé : ${n} questions au total, une à la fois, variées (motivation, technique ou métier, comportement, mise en situation), adaptées au CV et à l'offre ; rebondis sur les réponses précédentes quand c'est pertinent. Creuse au moins une exigence non démontrée par le CV, et appuie-toi sur l'actualité ou les activités de l'entreprise si elles sont connues (sans jamais en inventer).
${h.length ? `Évalue la DERNIÈRE réponse ("feedback") avec la méthode STAR : "star" indique si la Situation, la Tâche, l'Action et le Résultat sont présents ; "score" sur 10 ; "strengths" et "improve" : 1 à 3 points concrets chacun, en citant la réponse ; "betterAnswer" : une version améliorée de la réponse, à la première personne, qui n'utilise QUE les faits donnés par la personne ou présents dans le CV (repère [à compléter] pour un chiffre manquant).` : 'Aucune réponse à évaluer : "feedback" a score 0 et des listes vides.'}
${done ? 'Toutes les questions ont été posées : "nextQuestion" vide, "done" vrai, et "summary" donne un bilan global (score moyen, 2-3 points forts, 2-3 priorités de travail).' : `"nextQuestion" : la question n°${h.length + 1}, formulée à l'oral, en une ou deux phrases. "done" faux, "summary" avec des champs vides.`}`,
    parts: [{ text: `Entreprise : ${txt(o.company, 200) || '(non précisée)'}\nPoste : ${txt(o.role, 200) || '(non précisé)'}\nOffre :\n${txt(o.text, 12_000) || '(non fournie)'}\n\nCV :\n${cvForPrompt(cv)}\n\nÉchanges précédents :\n${h.map((x, i) => `Q${i + 1} : ${txt(x.q, 600)}\nR${i + 1} : ${txt(x.a, 3000)}`).join('\n\n') || '(aucun)'}` }],
    schema: S.obj({
      feedback: S.obj({ score: S.int, star: S.obj({ s: S.bool, t: S.bool, a: S.bool, r: S.bool }), strengths: S.arr(S.str), improve: S.arr(S.str), betterAnswer: S.str }),
      nextQuestion: S.str,
      done: S.bool,
      summary: S.obj({ score: S.int, strengths: S.arr(S.str), priorities: S.arr(S.str) }),
    }),
    temperature: 0.6,
  });
  out.done = done;
  return out;
}

/* Raccourcit un texte de candidature sous une limite de caractères, sans rien perdre d'essentiel ni rien ajouter. */
async function shorten({ text, limit, lang }) {
  const max = Math.round(Number(limit) || 0);
  if (!String(text || '').trim() || max < 300) throw bad('Texte ou limite manquant');
  const target = Math.floor(max * 0.9);
  const out = await genJSON({
    system: `Tu raccourcis un texte de candidature pour qu'il tienne dans la limite d'une plateforme. ${STYLE}
Vise ${target} caractères environ (limite stricte : ${max} caractères espaces compris). Garde les faits, les exemples concrets et la voix de la personne ; supprime d'abord les répétitions et les phrases générales. N'ajoute rien. Conserve les repères entre crochets. Même langue que le texte${lang === 'en' ? ' (anglais)' : ''}, mêmes paragraphes.`,
    parts: [{ text: txt(text, 20_000) }],
    schema: S.obj({ text: S.str }),
    temperature: 0.3,
  });
  return { text: String(out.text || '').trim() };
}

/* Bilan d'un entretien vocal (Gemini Live) à partir de sa transcription. */
async function reviewInterview({ cv, offer, transcript, market, lang, profile, analysis, brief }) {
  const o = offer || {};
  const lines = (Array.isArray(transcript) ? transcript : []).slice(-80).map(t => `${t.role === 'candidate' ? 'Candidat·e' : 'Recruteur·se'} : ${txt(t.text, 3000)}`);
  if (!lines.some(l => l.startsWith('Candidat'))) throw bad('Aucune réponse à évaluer.');
  return genJSON({
    system: `Tu es coach en entretien d'embauche. Voici la transcription automatique d'un entretien ORAL simulé pour le poste ci-dessous ; elle peut contenir des erreurs de reconnaissance vocale : ne les reproche pas, juge le fond.
${contextPrompt({ market, lang, profile })}
${jobContext(analysis, brief)}
Quand c'est utile, signale dans "improve" ce que la personne aurait pu relier à l'entreprise (activités, actualité) ou à une exigence du poste.
Pour chaque question principale posée par le recruteur (regroupe les relances avec leur question ; ignore la présentation et la conclusion) : "question" reformulée proprement ; "answer" : la réponse de la personne, nettoyée des hésitations, sans rien ajouter (vide si elle n'a pas répondu) ; "feedback" avec la méthode STAR : "star" indique si la Situation, la Tâche, l'Action et le Résultat sont présents ; "score" sur 10 ; "strengths" et "improve" : 1 à 3 points concrets chacun, en citant la réponse, y compris sur l'oral si c'est visible (réponse trop longue, trop vague) ; "betterAnswer" : une version améliorée à dire à l'oral, à la première personne, qui n'utilise QUE les faits donnés par la personne ou présents dans le CV (repère [à compléter] pour un chiffre manquant).
"summary" : bilan global (score moyen sur 10, 2-3 points forts, 2-3 priorités de travail).`,
    parts: [{ text: `Entreprise : ${txt(o.company, 200) || '(non précisée)'}\nPoste : ${txt(o.role, 200) || '(non précisé)'}\nOffre :\n${txt(o.text, 8000) || '(non fournie)'}\n\nCV :\n${cvForPrompt(cv)}\n\nTranscription :\n${lines.join('\n')}` }],
    schema: S.obj({
      items: S.arr(S.obj({ question: S.str, answer: S.str, feedback: S.obj({ score: S.int, star: S.obj({ s: S.bool, t: S.bool, a: S.bool, r: S.bool }), strengths: S.arr(S.str), improve: S.arr(S.str), betterAnswer: S.str }) })),
      summary: S.obj({ score: S.int, strengths: S.arr(S.str), priorities: S.arr(S.str) }),
    }),
    temperature: 0.4,
  });
}

export const TASKS = { companyBrief, shorten, humanize, integrateMetric, suggestBullet, suggestSummary, suggestSkills, parseCv, extractOffer, analyzeOffer, interview, translateCv, ocr, mockInterview, reviewInterview };
