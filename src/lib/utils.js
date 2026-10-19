/* Utilitaires génériques : identifiants, copies, dates relatives, texte. */
import { analyze } from './ats.js';

export const uid = () => Math.random().toString(36).slice(2, 9);
export const clone = (o) => JSON.parse(JSON.stringify(o));
export const NT = () =>
  window.NoTics || {
    analyze: () => ({
      hits: [],
      scores: { direction: 10, rythme: 10, confiance: 10, authenticite: 10, densite: 10 },
      total: 50,
      verdict: '—',
      metronome: false,
      sentences: 0,
      words: 0,
    }),
    autoFix: (t) => ({ text: t, changes: [] }),
    fixOne: (t) => t,
    segments: (t) => [{ text: t, hit: false }],
    CATS: {},
  };
export const toMonths = (d) => {
  if (!d) return null;
  if (/^présent|^present/i.test(d.trim())) {
    const n = new Date();
    return n.getFullYear() * 12 + n.getMonth() + 1;
  }
  const m = /^(\d{2})\/(\d{4})$/.exec(d.trim());
  return m ? +m[2] * 12 + +m[1] : null;
};
export function lineDiff(a, b) {
  const n = a.length,
    m = b.length,
    L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out = [];
  let i = 0,
    j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      out.push({ t: '=', s: a[i] });
      i++;
      j++;
    } else if (L[i + 1][j] >= L[i][j + 1]) {
      out.push({ t: '-', s: a[i] });
      i++;
    } else {
      out.push({ t: '+', s: b[j] });
      j++;
    }
  }
  while (i < n) out.push({ t: '-', s: a[i++] });
  while (j < m) out.push({ t: '+', s: b[j++] });
  return out;
}
export const wc = (t) => (t || '').split(/\s+/).filter(Boolean).length;
export function rel(t) {
  const d = Date.now() - t;
  if (d < 60000) return "à l'instant";
  if (d < 3600000) return 'il y a ' + Math.floor(d / 60000) + ' min';
  const D = new Date(t),
    N = new Date();
  const hm = D.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (D.toDateString() === N.toDateString()) return "aujourd'hui, " + hm;
  return D.toLocaleDateString('fr-FR') + ', ' + hm;
}
export const scoreColor = (s) => (s >= 85 ? 'var(--ok)' : s >= 65 ? 'var(--wa)' : 'var(--er)');
export const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
export const esc = (s) =>
  String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
export const whenReady = (test, cb, n = 0) => {
  if (test()) cb();
  else if (n < 80) setTimeout(() => whenReady(test, cb, n + 1), 100);
};
export const errMsg = (e) => (e && e.message) || 'Une erreur est survenue';
