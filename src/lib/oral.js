/* Analyse de l'oral d'un entretien vocal : débit, mots de remplissage (« euh », « du coup »…) et durée
   des réponses. Calculée sur l'appareil à partir de la transcription et des temps de parole mesurés
   au micro ; aucun audio n'est conservé.
   entries : [{ role: 'recruiter' | 'candidate', text }]
   turns   : [{ speechMs, durMs }] une entrée par prise de parole (durMs : du premier au dernier son). */

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

export function oralStats(entries, turns, lang = 'fr') {
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
  const top = Object.entries(fillers).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => '« ' + k + ' »');
  const tips = [];
  if (pace === 'fast') tips.push('Vous parlez vite (' + wpm + ' mots/min) : marquez une pause après chaque idée clé, surtout avant un chiffre.');
  if (pace === 'slow') tips.push('Débit lent (' + wpm + ' mots/min) : préparez vos exemples pour les raconter d’un trait, sans chercher vos mots.');
  if (fill !== 'few') tips.push('Mots de remplissage fréquents (' + top.join(', ') + ') : remplacez-les par un court silence, il passe mieux qu’un « euh ».');
  if (length === 'short') tips.push('Réponses courtes (' + avg + ' s en moyenne) : développez avec le contexte, votre action et le résultat (45 s à 2 min).');
  if (length === 'long') tips.push('Une réponse a duré ' + Math.floor(longest / 60) + ' min ' + (longest % 60) + ' s : au-delà de 2 min, concluez par le résultat et laissez le recruteur relancer.');
  if (!tips.length) tips.push('Rythme, concision et fluidité dans la bonne zone : gardez ce niveau.');
  return { words: nWords, sec: Math.round(sec), wpm, pace, fillers, nFill, per100, fill, answers: lens, avg, longest, length, tips };
}
