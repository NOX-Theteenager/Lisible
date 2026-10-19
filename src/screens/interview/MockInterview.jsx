/* Simulation d'entretien : l'IA joue le recruteur, pose une question à la fois et commente chaque
   réponse avec la méthode STAR (Situation, Tâche, Action, Résultat), puis dresse un bilan. */
import React, { useState, useRef, useEffect } from 'react';
import { Card, H, Muted, Btn, Seg, AIBadge } from '../../components/ui.jsx';

const STAR = [['s', 'Situation'], ['t', 'Tâche'], ['a', 'Action'], ['r', 'Résultat']];
const bubble = mine => ({ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '88%', padding: '10px 14px', borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: mine ? 'var(--btn)' : 'var(--sub)', color: mine ? 'var(--btnfg)' : 'var(--tx)', lineHeight: 1.55, whiteSpace: 'pre-wrap' });

function Feedback({ f }) {
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

export default function MockInterview({ v }) {
  const m = v.mock || {};
  const [total, setTotal] = useState(5);
  const [turns, setTurns] = useState([]); // { q, a, feedback }
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const end = useRef(null);
  useEffect(() => { end.current && end.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [turns.length, question, summary]);

  async function call(history) {
    setBusy(true); setError('');
    try {
      const r = await window.CVAI.mockInterview({ cv: m.cv, offer: m.offer, history: history.map(t => ({ q: t.q, a: t.a })), total });
      const next = history.slice();
      if (next.length) next[next.length - 1] = { ...next[next.length - 1], feedback: r.feedback };
      setTurns(next);
      if (r.done) { setQuestion(''); setSummary(r.summary); } else setQuestion(r.nextQuestion);
    } catch (e) { setError(e.message || 'La simulation a échoué. Réessayez.'); }
    setBusy(false);
  }
  const start = () => { setTurns([]); setSummary(null); setQuestion(''); setAnswer(''); call([]); };
  const send = () => { const a = answer.trim(); if (!a || busy) return; const h = [...turns, { q: question, a }]; setTurns(h); setAnswer(''); setQuestion(''); call(h); };
  const started = turns.length || question || summary;

  return (
    <Card style={{ padding: '20px', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <H>Simulation d’entretien</H>
          <Muted>{m.target}. Le recruteur pose une question à la fois ; chaque réponse est commentée avec la méthode STAR.</Muted>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {!started ? <Seg value={String(total)} options={[['3', '3 questions'], ['5', '5'], ['8', '8']]} onChange={k => setTotal(Number(k))} /> : null}
          <Btn kind={started ? 'line' : 'ai'} onClick={start} disabled={busy}>{started ? 'Recommencer' : 'Commencer la simulation'}</Btn>
        </div>
      </div>
      {started ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '560px', overflow: 'auto', padding: '2px' }}>
          {turns.map((t, i) => (
            <React.Fragment key={i}>
              <div style={bubble(false)}><strong style={{ display: 'block', fontSize: '11px', color: 'var(--mu)', marginBottom: '2px' }}>Recruteur · question {i + 1}/{total}</strong>{t.q}</div>
              <div style={bubble(true)}>{t.a}</div>
              <Feedback f={t.feedback} />
            </React.Fragment>
          ))}
          {question ? <div style={bubble(false)}><strong style={{ display: 'block', fontSize: '11px', color: 'var(--mu)', marginBottom: '2px' }}>Recruteur · question {turns.length + 1}/{total}</strong>{question}</div> : null}
          {busy ? <Muted>{turns.length ? 'Le recruteur analyse votre réponse…' : 'Le recruteur prépare sa première question…'}</Muted> : null}
          {summary ? (
            <div style={{ border: '1px solid var(--line)', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--sub)' }}>
              <H size={16}>Bilan : {summary.score}/10</H>
              {summary.strengths && summary.strengths.length ? <div style={{ fontSize: '13px' }}><strong>Vos points forts : </strong>{summary.strengths.join(' · ')}</div> : null}
              {summary.priorities && summary.priorities.length ? <div style={{ fontSize: '13px' }}><strong>À travailler en priorité : </strong>{summary.priorities.join(' · ')}</div> : null}
            </div>
          ) : null}
          <span ref={end} />
        </div>
      ) : null}
      {error ? <div role="alert" style={{ padding: '10px 12px', borderRadius: '10px', background: 'var(--ers)', color: 'var(--er)', fontSize: '13px', fontWeight: 600 }}>{error}</div> : null}
      {question && !busy ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send(); }}
            rows={4}
            placeholder="Répondez comme à l’oral : contexte, ce que vous deviez faire, ce que vous avez fait, le résultat."
            style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--line2)', borderRadius: '14px', background: 'var(--panel)', color: 'var(--tx)', font: 'inherit', fontSize: '13px', lineHeight: 1.55, outline: 'none', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--fa)' }}>Ctrl / ⌘ + Entrée pour envoyer</span>
            <Btn kind="ai" onClick={send} disabled={!answer.trim()}>Envoyer ma réponse</Btn>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
