/* Onglets des variantes de lettre (réalisation phare, motivation, parcours). */
import React from 'react';

export default function LetterVariants({ v }) {
  const list = v.letterVariants || [];
  if (!list.length) return null;
  return (
    <div role="tablist" aria-label="Variantes de la lettre" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {list.map(x => (
        <button
          key={x.angle}
          role="tab"
          aria-selected={x.on}
          type="button"
          onClick={x.pick}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', minWidth: '150px', padding: '9px 14px', borderRadius: '14px', border: '1px solid ' + (x.on ? 'var(--ai)' : 'var(--line2)'), background: x.on ? 'var(--ais)' : 'var(--panel)', color: 'var(--tx)', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '12.5px', fontWeight: 700 }}>{x.label}</span>
          <span style={{ fontSize: '11.5px', color: x.error ? 'var(--er)' : 'var(--mu)' }}>{x.status}</span>
        </button>
      ))}
    </div>
  );
}
