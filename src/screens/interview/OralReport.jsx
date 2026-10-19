/* Analyse de l'oral : débit, mots de remplissage et durée des réponses, avec des conseils concrets. */
import React from 'react';
import { H } from '../../components/ui.jsx';
import { oralTips } from '../../lib/oral.js';

const LEVEL = { ok: 'var(--ok)', few: 'var(--ok)', some: 'var(--wa)', slow: 'var(--wa)', fast: 'var(--wa)', short: 'var(--wa)', long: 'var(--wa)', many: 'var(--er)' };

function Metric({ label, value, unit, state, hint }) {
  return (
    <div style={{ flex: '1 1 150px', padding: '10px 12px', borderRadius: '12px', background: 'var(--panel)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</span>
      <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '22px', fontWeight: 700, color: LEVEL[state] || 'var(--tx)' }}>
        {value}<span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mu)', marginLeft: '4px' }}>{unit}</span>
      </span>
      <span style={{ fontSize: '11.5px', color: 'var(--fa)' }}>{hint}</span>
    </div>
  );
}

export default function OralReport({ o, ui }) {
  if (!o) return null;
  // Unités dans la langue de l'interface (les libellés fixes sont traduits par i18n).
  const en = ui === 'en';
  const top = Object.entries(o.fillers || {}).sort((a, b) => b[1] - a[1]).slice(0, 4);
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--sub)' }}>
      <H size={16}>Votre oral</H>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Metric label="Débit" value={o.wpm} unit={en ? 'words/min' : 'mots/min'} state={o.pace} hint="Zone confortable : 110 à 170" />
        <Metric label="Mots de remplissage" value={o.per100} unit={en ? '/ 100 words' : '/ 100 mots'} state={o.fill} hint={top.length ? top.map(([k, n]) => k + ' ×' + n).join(', ') : 'Aucun repéré'} />
        <Metric label="Durée moyenne" value={o.avg} unit={en ? 's / answer' : 's / réponse'} state={o.length} hint={en ? 'Ideal: 45 s to 2 min · longest: ' + o.longest + ' s' : 'Idéal : 45 s à 2 min · plus longue : ' + o.longest + ' s'} />
      </div>
      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', lineHeight: 1.55, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {oralTips(o, ui).map((t, i) => <li key={i}>{t}</li>)}
      </ul>
      <span style={{ fontSize: '11.5px', color: 'var(--fa)' }}>Mesures approximatives, calculées sur votre appareil à partir du micro et de la transcription automatique, qui peut omettre certaines hésitations.</span>
    </div>
  );
}
