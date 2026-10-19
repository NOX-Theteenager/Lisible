/* Entretien vocal (Gemini Live) : conversation à voix haute avec le recruteur, transcription en direct,
   puis bilan STAR de chaque réponse à partir de la transcription. */
import React, { useState, useRef, useEffect } from 'react';
import { Muted, Btn } from '../../components/ui.jsx';
import { Feedback, Summary, bubble } from './Feedback.jsx';
import { LiveInterview } from '../../services/live.js';
import { oralStats } from '../../lib/oral.js';
import OralReport from './OralReport.jsx';

const STATES = {
  connecting: ['Connexion au recruteur…', 'var(--mu)'],
  speaking: ['Le recruteur parle…', 'var(--ai)'],
  listening: ['À vous : je vous écoute', 'var(--ok)'],
};

function Status({ state, level, muted }) {
  const [label, col] = muted && state === 'listening' ? ['Micro coupé', 'var(--wa)'] : STATES[state] || ['', 'var(--mu)'];
  const bars = [0.5, 0.8, 1, 0.8, 0.5];
  return (
    <div role="status" aria-live="polite" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '14px', background: 'var(--sub)' }}>
      <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '26px' }}>
        {bars.map((k, i) => {
          const h = state === 'listening' && !muted ? 6 + Math.min(1, level * 9) * 20 * k : state === 'speaking' ? 8 + 10 * k : 6;
          return <span key={i} style={{ width: '4px', height: h + 'px', borderRadius: '2px', background: col, transition: 'height .08s linear' }} />;
        })}
      </div>
      <span style={{ fontWeight: 700, fontSize: '13.5px', color: col }}>{label}</span>
    </div>
  );
}

export default function VoiceInterview({ m, opts, onLock, onSave }) {
  const { total, lang, tone, voice } = opts;
  const [oral, setOral] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | live | review | done
  const [state, setState] = useState('connecting');
  const [level, setLevel] = useState(0);
  const [muted, setMuted] = useState(false);
  const [entries, setEntries] = useState([]);
  const [review, setReview] = useState(null);
  const [error, setError] = useState('');
  const live = useRef(null);
  const end = useRef(null);
  useEffect(() => { onLock(phase !== 'idle'); }, [phase]);
  useEffect(() => { end.current && end.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [entries, phase, review]);
  useEffect(() => () => live.current && live.current.stop(), []);

  async function analyse(list, o) {
    setPhase('review'); setError('');
    try {
      const r = await window.CVAI.reviewInterview({ cv: m.cv, offer: m.offer, analysis: m.analysis, brief: m.brief, transcript: list, lang });
      setReview(r); setPhase('done');
      onSave({ mode: 'voice', voice, summary: r.summary, items: r.items, oral: o || null });
    } catch (e) { setError(e.message || 'Le bilan n’a pas pu être établi.'); setPhase('done'); }
  }

  async function start() {
    setEntries([]); setReview(null); setOral(null); setError(''); setMuted(false); setPhase('live'); setState('connecting');
    const s = new LiveInterview(ev => {
      if (ev.type === 'state') setState(ev.state);
      else if (ev.type === 'level') setLevel(ev.level);
      else if (ev.type === 'transcript') setEntries(ev.entries);
      else if (ev.type === 'end') {
        live.current = null;
        setEntries(ev.entries);
        if (ev.reason === 'lost') setError('La connexion au recruteur a été interrompue. Le bilan porte sur les réponses déjà données.');
        const o = oralStats(ev.entries, ev.turns, lang);
        setOral(o);
        if (ev.entries.some(e => e.role === 'candidate')) analyse(ev.entries, o);
        else { setPhase('idle'); if (ev.reason !== 'stopped') setError('Aucune réponse n’a été entendue. Vérifiez votre micro et réessayez.'); }
      }
    });
    live.current = s;
    try { await s.start({ cv: m.cv, offer: m.offer, analysis: m.analysis, brief: m.brief, total, lang, tone, voice }); }
    catch (e) { live.current = null; setPhase('idle'); setError(e.message || 'L’entretien vocal n’a pas pu démarrer.'); }
  }
  const toggleMute = () => { const v = !muted; setMuted(v); live.current && live.current.setMuted(v); };

  return (
    <>
      {phase === 'idle' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Muted>
            Parlez comme en vrai entretien : le recruteur pose ses questions à voix haute et vous laisse répondre. Des écouteurs donnent un meilleur résultat. Votre voix est transmise à Google (Gemini Live) le temps de la conversation ; elle n’est pas enregistrée.
          </Muted>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Btn kind="ai" onClick={start}>Démarrer l’entretien vocal</Btn>
          </div>
        </div>
      ) : null}

      {phase === 'live' ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px' }}><Status state={state} level={level} muted={muted} /></div>
          {state === 'speaking' ? <Btn onClick={() => live.current && live.current.interrupt()}>Prendre la parole</Btn> : null}
          <Btn onClick={toggleMute} disabled={state === 'connecting'}>{muted ? 'Réactiver le micro' : 'Couper le micro'}</Btn>
          <Btn kind="ai" onClick={() => live.current && live.current.stop()}>Terminer l’entretien</Btn>
        </div>
      ) : null}

      {entries.length && phase !== 'idle' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: review ? '220px' : '460px', overflow: 'auto', padding: '2px' }}>
          {review ? <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Transcription</span> : null}
          {entries.map((e, i) => (
            <div key={i} style={bubble(e.role === 'candidate')}>
              {e.role === 'recruiter' ? <strong style={{ display: 'block', fontSize: '11px', color: 'var(--mu)', marginBottom: '2px' }}>Recruteur</strong> : null}
              {e.text}
            </div>
          ))}
          <span ref={phase === 'live' ? end : null} />
        </div>
      ) : null}

      {phase === 'review' ? <Muted>Analyse de vos réponses avec la méthode STAR…</Muted> : null}
      {error ? <div role="alert" style={{ padding: '10px 12px', borderRadius: '10px', background: 'var(--ers)', color: 'var(--er)', fontSize: '13px', fontWeight: 600 }}>{error}</div> : null}

      {oral && phase !== 'live' ? <OralReport o={oral} /> : null}
      {review ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(review.items || []).map((it, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: i ? '10px' : 0, borderTop: i ? '1px solid var(--line)' : 0 }}>
              <div style={bubble(false)}><strong style={{ display: 'block', fontSize: '11px', color: 'var(--mu)', marginBottom: '2px' }}>Question {i + 1}</strong>{it.question}</div>
              {it.answer ? <div style={bubble(true)}>{it.answer}</div> : <Muted>Pas de réponse.</Muted>}
              <Feedback f={it.feedback} />
            </div>
          ))}
          <Summary s={review.summary} />
        </div>
      ) : null}
      <span ref={phase !== 'live' ? end : null} />

      {phase === 'done' ? (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {!review && entries.some(e => e.role === 'candidate') ? <Btn kind="ai" onClick={() => analyse(entries, oral)}>Relancer le bilan</Btn> : null}
          <Btn onClick={() => { setPhase('idle'); setEntries([]); setReview(null); setOral(null); setError(''); }}>Nouvel entretien</Btn>
        </div>
      ) : null}
    </>
  );
}
