/* Options de rédaction : langue de la lettre, nombre de versions (1 ou 3 angles différents)
   et fiche entreprise (recherche web) utilisée pour le lien avec l'entreprise. */
import React from 'react';
import { Seg, Btn } from './ui.jsx';

export default function LetterOptions({ v }) {
  const L = v.letterOpts || {};
  const b = v.brief || {};
  const d = b.data;
  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mu)' }}>Langue</span>
        <Seg value={L.lang} options={[['fr', 'Français'], ['en', 'English']]} onChange={L.setLang} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mu)' }}>Versions</span>
        <Seg value={L.multi ? 'multi' : 'one'} options={[['one', 'Une lettre'], ['multi', '3 variantes']]} onChange={k => L.setMulti(k === 'multi')} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 220px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mu)' }}>Lien avec l’entreprise</span>
        {d && d.found ? (
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ok)', minHeight: '30px', display: 'flex', alignItems: 'center' }}>✓ Fiche entreprise utilisée ({d.name || b.company})</span>
        ) : (
          <Btn kind="ai" onClick={b.gen} disabled={b.busy || !b.company} style={{ alignSelf: 'flex-start' }}>
            {b.busy ? 'Recherche en cours…' : d ? 'Peu d’infos trouvées : relancer' : 'Se renseigner sur l’entreprise'}
          </Btn>
        )}
      </div>
    </div>
  );
}
