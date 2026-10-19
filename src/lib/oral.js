/* Analyse de l'oral d'un entretien vocal : débit, mots de remplissage (« euh », « du coup »…) et durée
   des réponses. Calculée sur l'appareil à partir de la transcription et des temps de parole mesurés
   au micro ; aucun audio n'est conservé.
   entries : [{ role: 'recruiter' | 'candidate', text }]
   turns   : [{ speechMs, durMs }] une entrée par prise de parole (durMs : du premier au dernier son).
   lang    : langue de l'entretien (pour reconnaître les mots de remplissage) ;
   ui      : langue de l'interface, dans laquelle les conseils sont rédigés. */

const FILLERS = {
  fr: ['euh', 'heu', 'hum', 'bah', 'ben', 'du coup', 'en fait', 'voilà', 'genre', 'en gros', 'vous voyez', 'tu vois', 'disons', 'quoi'],
  en: ['um', 'uh', 'erm', 'hmm', 'you know', 'basically', 'actually', 'i mean', 'sort of', 'kind of', 'like'],
};

const words = (t) => (String(t || '').match(/[\p{L}\p{N}’']+/gu) || []).length;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function countFillers(text, lang = 'fr') {
  const t = ' ' + String(text || '').toLowerCase().replace(/[’]/g, "'") + ' ';
  const out = {};
  for (const f of FILLERS[lang === 'en' ? 'en' : 'fr']) {
    // « quoi » et « like » ne comptent qu'en fin de groupe ou entre virgules (« c'était bien, quoi. »).
    const re = f === 'quoi' || f === 'like'
      ? new RegExp(`[,]\\s*${f}\\s*[,.!?]`, 'g')
      : new RegExp(`(^|[^\\p{L}])${esc(f)}(?=[^\\p{L}]|$)`, 'gu');
    const n = (t.match(re) || []).length;
    if (n) out[f] = n;
  }
  return out;
}

const TIPS = {
  fr: {
    fast: (w) => `Vous parlez vite (${w} mots/min) : marquez une pause après chaque idée clé, surtout avant un chiffre.`,
    slow: (w) => `Débit lent (${w} mots/min) : préparez vos exemples pour les raconter d’un trait, sans chercher vos mots.`,
    fill: (t) => `Mots de remplissage fréquents (${t}) : remplacez-les par un court silence, il passe mieux qu’un « euh ».`,
    short: (a) => `Réponses courtes (${a} s en moyenne) : développez avec le contexte, votre action et le résultat (45 s à 2 min).`,
    long: (m, s) => `Une réponse a duré ${m} min ${s} s : au-delà de 2 min, concluez par le résultat et laissez l’interlocuteur relancer.`,
    ok: 'Rythme, concision et fluidité dans la bonne zone : gardez ce niveau.',
    q: (k) => '« ' + k + ' »',
  },
  en: {
    fast: (w) => `You speak fast (${w} words/min): pause after each key idea, especially before a figure.`,
    slow: (w) => `Slow pace (${w} words/min): rehearse your examples so you can tell them in one go, without searching for words.`,
    fill: (t) => `Frequent filler words (${t}): replace them with a short silence, which sounds better than an "um".`,
    short: (a) => `Short answers (${a} s on average): add the context, your action and the result (45 s to 2 min).`,
    long: (m, s) => `One answer lasted ${m} min ${s} s: beyond 2 min, finish with the result and let the interviewer follow up.`,
    ok: 'Pace, concision and fluency are in the right range: keep it up.',
    q: (k) => '"' + k + '"',
  },
};

export function oralStats(entries, turns, lang = 'fr', ui = 'fr') {
  const said = (entries || []).filter((e) => e.role === 'candidate').map((e) => e.text).join(' ');
  const nWords = words(said);
  const answers = (turns || []).filter((t) => t && t.durMs >= 1500);
  if (!nWords || !answers.length) return null;
  const sec = answers.reduce((a, t) => a + t.durMs, 0) / 1000;
  const wpm = Math.round(nWords / (sec / 60));
  const fillers = countFillers(said, lang);
  const nFill = Object.values(fillers).reduce((a, b) => a + b, 0);
  const per100 = Math.round((nFill / nWords) * 1000) / 10;
  const lens = answers.map((t) => Math.round(t.durMs / 1000));
  const avg = Math.round(lens.reduce((a, b) => a + b, 0) / lens.length);
  const longest = Math.max(...lens);

  const pace = wpm < 100 ? 'slow' : wpm > 175 ? 'fast' : 'ok';
  const fill = per100 >= 5 ? 'many' : per100 >= 2 ? 'some' : 'few';
  const length = avg < 20 ? 'short' : longest > 150 ? 'long' : 'ok';
  const o = { words: nWords, sec: Math.round(sec), wpm, pace, fillers, nFill, per100, fill, answers: lens, avg, longest, length };
  return { ...o, tips: oralTips(o, ui) };
}

/* Conseils dans la langue de l'interface, recalculés à l'affichage à partir des mesures
   (les séances de l'historique suivent donc la langue choisie au moment où on les relit). */
export function oralTips(o, ui = 'fr') {
  const T = TIPS[ui === 'en' ? 'en' : 'fr'];
  const top = Object.entries(o.fillers || {}).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => T.q(k));
  const tips = [];
  if (o.pace === 'fast') tips.push(T.fast(o.wpm));
  if (o.pace === 'slow') tips.push(T.slow(o.wpm));
  if (o.fill !== 'few') tips.push(T.fill(top.join(', ')));
  if (o.length === 'short') tips.push(T.short(o.avg));
  if (o.length === 'long') tips.push(T.long(Math.floor(o.longest / 60), o.longest % 60));
  if (!tips.length) tips.push(T.ok);
  return tips;
}
