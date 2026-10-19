/* Persistance : clés de stockage local et préférences synchronisées. */

export const LS_ACCT = 'lisible-account';
export const KEY = 'cvatspro-state-v3';
export const settingsOf = (s) => ({
  theme: s.theme,
  tpl: s.tpl,
  accent: s.accent,
  font: s.font,
  fsize: s.fsize,
  letFont: s.letFont,
  letSize: s.letSize,
  lang: s.lang,
  prefs: s.prefs,
  currentId: s.currentId,
  market: s.market,
  profile: s.profile,
  work: {
    ad: { offer: s.ad.offer, analysis: s.ad.analysis, acc: s.ad.acc, sk: s.ad.sk, result: s.ad.phase === 'result' },
    letter: {
      company: s.letter.company,
      role: s.letter.role,
      tone: s.letter.tone,
      mode: s.letter.mode,
      text: s.letter.text,
      offerText: s.letter.offerText,
      old: s.letter.old,
      lang: s.letter.lang,
      multi: s.letter.multi,
      variants: (s.letter.variants || []).map((x) => ({ angle: x.angle, label: x.label, text: x.text, status: x.status === 'busy' ? 'error' : x.status })),
      vi: s.letter.vi,
    },
    iv: s.iv.phase === 'ready' ? { phase: 'ready', qs: s.iv.qs, open: s.iv.open, pitch: s.iv.pitch, li: s.iv.li } : null,
  },
});
