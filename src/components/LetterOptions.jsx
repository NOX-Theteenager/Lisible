/* Options de rédaction : langue de la lettre, nombre de versions (1 ou 3 angles différents)
   et fiche entreprise (recherche web) utilisée pour le lien avec l'entreprise. */
import React from 'react';
import { Seg, Btn } from './ui.jsx';

/* Mode Études : type de document. */
const DOCS = [['lettre', 'Lettre de motivation'], ['projet', 'Projet d’études'], ['sop', 'Statement of purpose'], ['ps', 'Personal statement']];

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
      {v.study ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexBasis: '100%' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mu)' }}>Document</span>
          <Seg value={L.doc} options={DOCS} onChange={L.setDoc} />
        </div>
      ) : null}
      {v.study ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mu)' }}>Limite de la plateforme</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="number"
              min="0"
              step="100"
              inputMode="numeric"
              aria-label="Nombre maximal de caractères (0 : sans limite)"
              value={L.limit || ''}
              placeholder="Aucune"
              onChange={(e) => L.setLimit(e.target.value)}
              style={{ width: '96px', height: '30px', padding: '0 10px', border: '1px solid var(--line2)', borderRadius: '999px', background: 'var(--panel)', color: 'var(--tx)', font: 'inherit', fontSize: '12.5px', outline: 'none' }}
            />
            <span style={{ fontSize: '12px', color: 'var(--mu)' }}>caractères</span>
          </div>
        </div>
      ) : null}
      {v.study && L.chars ? (
        <span role="status" style={{ alignSelf: 'flex-end', fontSize: '12px', fontWeight: 700, color: L.limit && L.chars > L.limit ? 'var(--er)' : 'var(--ok)', minHeight: '30px', display: 'flex', alignItems: 'center' }}>
          {L.chars} {L.limit ? '/ ' + L.limit + ' caractères' + (L.chars > L.limit ? ' : à raccourcir' : ' ✓') : 'caractères'}
        </span>
      ) : null}
      {v.study && L.limit && L.chars > L.limit ? (
        <Btn kind="ai" onClick={L.shorten} disabled={L.shortening} style={{ alignSelf: 'flex-end' }}>
          {L.shortening ? 'Raccourcissement…' : 'Raccourcir sous la limite'}
        </Btn>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1 1 220px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mu)' }}>{v.study ? 'Lien avec l’établissement' : 'Lien avec l’entreprise'}</span>
        {d && d.found ? (
          <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ok)', minHeight: '30px', display: 'flex', alignItems: 'center' }}>{v.study ? '✓ Fiche établissement utilisée' : '✓ Fiche entreprise utilisée'} ({d.name || b.company})</span>
        ) : (
          <Btn kind="ai" onClick={b.gen} disabled={b.busy || !b.company} style={{ alignSelf: 'flex-start' }}>
            {b.busy ? 'Recherche en cours…' : d ? 'Peu d’infos trouvées : relancer' : v.study ? 'Se renseigner sur l’établissement' : 'Se renseigner sur l’entreprise'}
          </Btn>
        )}
      </div>
    </div>
  );
}
