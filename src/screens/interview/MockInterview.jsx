/* Simulation d'entretien : l'IA joue le recruteur, à l'oral (Gemini Live, VoiceInterview.jsx) ou à l'écrit (une
   question à la fois), et commente chaque réponse avec la méthode STAR, puis dresse un bilan. */
import React, { useState, useRef, useEffect } from 'react';
import { Card, H, Muted, Btn, Seg } from '../../components/ui.jsx';
import { Feedback, Summary, bubble } from './Feedback.jsx';
import VoiceInterview from './VoiceInterview.jsx';
import { liveSupported } from '../../services/live.js';

export default function MockInterview({ v }) {
  const m = v.mock || {};
  const [live, setLive] = useState(false);
  const [mode, setMode] = useState('voice');
  useEffect(() => { window.LisibleAPI.config().then(c => setLive(!!(c.ai && c.ai.live) && liveSupported())).catch(() => {}); }, []);
  const voice = live && mode === 'voice';
  const [locked, setLocked] = useState(false);
  return (
    <Card style={{ padding: '20px', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <H>Simulation d’entretien</H>
          <Muted>{m.target}. {voice ? 'Le recruteur vous parle, vous répondez à voix haute ; vos réponses sont commentées avec la méthode STAR à la fin.' : 'Le recruteur pose une question à la fois ; chaque réponse est commentée avec la méthode STAR.'}</Muted>
        </div>
        {live && !locked ? <Seg value={mode} options={[['voice', '🎙 Vocal'], ['text', 'Écrit']]} onChange={setMode} /> : null}
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', fontSize: '11.5px', fontWeight: 600 }}>
        <span style={{ color: 'var(--mu)' }}>Le recruteur s’appuie sur :</span>
        {[['Votre CV', true], ['Votre profil', !!(m.profile && m.profile.use !== false && [m.profile.motivation, m.profile.achievements, m.profile.constraints, m.profile.values].some(x => x && x.trim()))], ['L’analyse de l’offre', !!m.analysis], ['La fiche entreprise', !!(m.brief && m.brief.found)]].map(([l, on]) => (
          <span key={l} style={{ padding: '2px 8px', borderRadius: '999px', background: on ? 'var(--oks)' : 'var(--sub)', color: on ? 'var(--ok)' : 'var(--fa)' }}>{on ? '✓' : '–'} {l}</span>
        ))}
      </div>
      {voice ? <VoiceInterview m={m} onLock={setLocked} /> : <TextInterview m={m} onLock={setLocked} />}
    </Card>
  );
}

function TextInterview({ m, onLock }) {
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
      const r = await window.CVAI.mockInterview({ cv: m.cv, offer: m.offer, analysis: m.analysis, brief: m.brief, history: history.map(t => ({ q: t.q, a: t.a })), total });
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
  useEffect(() => { onLock(!!started); }, [started]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
          <Summary s={summary} />
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
    </>
  );
}
