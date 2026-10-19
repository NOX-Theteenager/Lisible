/* Options de rédaction : langue de la lettre et nombre de versions (1 ou 3 angles différents). */
import React from 'react';
import { Seg } from './ui.jsx';

export default function LetterOptions({ v }) {
  const L = v.letterOpts || {};
  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mu)' }}>Langue</span>
        <Seg value={L.lang} options={[['fr', 'Français'], ['en', 'English']]} onChange={L.setLang} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mu)' }}>Versions</span>
        <Seg value={L.multi ? 'multi' : 'one'} options={[['one', 'Une lettre'], ['multi', '3 variantes']]} onChange={k => L.setMulti(k === 'multi')} />
      </div>
    </div>
  );
}
