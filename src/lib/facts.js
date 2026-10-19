/* Faits vérifiables d'un texte : nombres significatifs (années, montants, pourcentages), e-mails,
   liens et téléphones. Sert à repérer ce qui a été perdu ou ajouté entre deux versions d'un texte. */
export function facts(text) {
  const t = String(text || '');
  const out = new Set();
  (t.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || []).forEach(x => out.add(x.toLowerCase()));
  (t.match(/(?:https?:\/\/)?(?:www\.)?[\w-]+\.(?:com|net|org|fr|cm|io|dev|app)(?:\/[\w./-]*)?/gi) || []).forEach(x => out.add(x.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')));
  (t.match(/\+?\d[\d .]{7,}\d/g) || []).forEach(x => out.add(x.replace(/\D/g, '')));
  const plain = t.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, ' ').replace(/\+?\d[\d .]{7,}\d/g, ' ');
  (plain.match(/\d+(?:[ .,]\d{3})*(?:[.,]\d+)?\s?(?:%|k€|€|m€|fcfa|xaf)?/gi) || []).forEach(x => {
    const n = x.replace(/\s/g, '').toLowerCase();
    const digits = n.replace(/\D/g, '');
    if (digits.length >= 3 || /%|€|fcfa|xaf/.test(n)) out.add(n);
  });
  return out;
}


/* Faits présents dans « source » mais absents de « target ». */
export function missing(source, target) {
  const A = facts(source), B = facts(target);
  const has = x => B.has(x) || [...B].some(y => y.includes(x) || x.includes(y));
  return [...A].filter(x => !has(x));
}
