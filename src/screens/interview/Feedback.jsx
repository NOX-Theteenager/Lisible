/* Retour STAR sur une réponse d'entretien et bilan global, communs aux modes écrit et vocal. */
import React, { useState } from 'react';
import { AIBadge, H } from '../../components/ui.jsx';

const STAR = [['s', 'Situation'], ['t', 'Tâche'], ['a', 'Action'], ['r', 'Résultat']];
export const bubble = mine => ({ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '88%', padding: '10px 14px', borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: mine ? 'var(--btn)' : 'var(--sub)', color: mine ? 'var(--btnfg)' : 'var(--tx)', lineHeight: 1.55, whiteSpace: 'pre-wrap' });

export function Feedback({ f }) {
  const [show, setShow] = useState(false);
  if (!f) return null;
  const col = f.score >= 8 ? 'var(--ok)' : f.score >= 5 ? 'var(--wa)' : 'var(--er)';
  return (
    <div style={{ alignSelf: 'stretch', border: '1px solid var(--ai)', borderRadius: '14px', background: 'var(--ais)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <AIBadge />
        <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: '18px', color: col }}>{f.score}/10</span>
        {STAR.map(([k, l]) => (
          <span key={k} style={{ fontSize: '11.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '999px', background: f.star && f.star[k] ? 'var(--oks)' : 'var(--ers)', color: f.star && f.star[k] ? 'var(--ok)' : 'var(--er)' }}>
            {f.star && f.star[k] ? '✓' : '✕'} {l}
          </span>
        ))}
      </div>
      {f.strengths && f.strengths.length ? <div style={{ fontSize: '12.5px' }}><strong>Points forts : </strong>{f.strengths.join(' · ')}</div> : null}
      {f.improve && f.improve.length ? <div style={{ fontSize: '12.5px' }}><strong>À améliorer : </strong>{f.improve.join(' · ')}</div> : null}
      {f.betterAnswer ? (
        <div>
          <button type="button" onClick={() => setShow(!show)} style={{ border: 0, background: 'transparent', padding: 0, color: 'var(--ai)', font: 'inherit', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>
            {show ? 'Masquer la réponse améliorée' : 'Voir une réponse améliorée'}
          </button>
          {show ? <p style={{ margin: '6px 0 0', fontSize: '12.5px', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{f.betterAnswer}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export function Summary({ s }) {
  if (!s) return null;
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--sub)' }}>
      <H size={16}>Bilan : {s.score}/10</H>
      {s.strengths && s.strengths.length ? <div style={{ fontSize: '13px' }}><strong>Vos points forts : </strong>{s.strengths.join(' · ')}</div> : null}
      {s.priorities && s.priorities.length ? <div style={{ fontSize: '13px' }}><strong>À travailler en priorité : </strong>{s.priorities.join(' · ')}</div> : null}
    </div>
  );
}
