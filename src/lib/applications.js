/* Suivi des candidatures : dates et relances. */

export const parseFr = (d) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(d || '');
  return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null;
};
export const dueOf = (a) => {
  if (a.status !== 'sent' || a.relanced) return 0;
  const d = parseFr(a.date);
  if (!d) return 0;
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  return days >= 7 ? days : 0;
};

/* Mode Études : jours restants avant la date limite d'une candidature (null si aucune date). */
export const daysLeft = (d) => {
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(d + 'T00:00:00').getTime() - today.getTime()) / 86400000);
};
