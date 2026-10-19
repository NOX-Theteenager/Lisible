/* Historique des simulations d'entretien : courbe des notes, progression et détail de chaque séance
   (questions, réponses, retours STAR, bilan, analyse de l'oral). Synchronisé avec le compte. */
import React, { useState } from 'react';
import { Card, H, Muted, Btn } from '../../components/ui.jsx';
import { Feedback, Summary, bubble } from './Feedback.jsx';
import OralReport from './OralReport.jsx';

const TONES = { kind: 'Bienveillant', tough: 'Exigeant', panel: 'Panel' };
const col = (n) => (n >= 8 ? 'var(--ok)' : n >= 5 ? 'var(--wa)' : 'var(--er)');
const fmt = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

/* Courbe des notes, de la plus ancienne à la plus récente. */
function Curve({ list }) {
  const pts = list.slice().reverse().filter((x) => x.summary && Number.isFinite(x.summary.score));
  if (pts.length < 2) return null;
  const W = 320, Hh = 70, p = 8;
  const x = (i) => p + (i * (W - 2 * p)) / (pts.length - 1);
  const y = (s) => Hh - p - (Math.max(0, Math.min(10, s)) / 10) * (Hh - 2 * p);
  const d = pts.map((q, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(q.summary.score).toFixed(1)).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${Hh}`} role="img" aria-label="Évolution des notes" style={{ width: '100%', maxWidth: '420px', height: 'auto' }}>
      <line x1={p} x2={W - p} y1={y(5)} y2={y(5)} stroke="var(--line)" strokeDasharray="3 4" />
      <path d={d} fill="none" stroke="var(--ai)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((q, i) => <circle key={q.id} cx={x(i)} cy={y(q.summary.score)} r="3.4" fill="var(--panel)" stroke={col(q.summary.score)} strokeWidth="2" />)}
    </svg>
  );
}

function Detail({ s }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px' }}>
      {s.oral ? <OralReport o={s.oral} /> : null}
      {(s.items || []).map((it, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={bubble(false)}><strong style={{ display: 'block', fontSize: '11px', color: 'var(--mu)', marginBottom: '2px' }}>Question {i + 1}</strong>{it.question}</div>
          {it.answer ? <div style={bubble(true)}>{it.answer}</div> : <Muted>Pas de réponse.</Muted>}
          <Feedback f={it.feedback} />
        </div>
      ))}
      <Summary s={s.summary} />
    </div>
  );
}

export default function InterviewHistory({ v }) {
  const h = v.ivHist || {};
  const list = h.list || [];
  const [open, setOpen] = useState(null);
  if (!list.length) return null;
  const scored = list.filter((x) => x.summary && Number.isFinite(x.summary.score));
  const last = scored[0], first = scored[scored.length - 1];
  const delta = scored.length >= 2 ? last.summary.score - first.summary.score : null;
  return (
    <Card style={{ padding: '18px 20px', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <H size={16}>Historique des entretiens</H>
          <Muted>
            {list.length} séance{list.length > 1 ? 's' : ''}
            {delta != null ? ' · ' + (delta > 0 ? '+' : '') + delta + ' point' + (Math.abs(delta) > 1 ? 's' : '') + ' depuis la première' : ''}
          </Muted>
        </div>
        <Curve list={list} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {list.slice(0, 20).map((s) => (
          <div key={s.id} style={{ borderTop: '1px solid var(--line)', padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: '18px', minWidth: '48px', color: s.summary ? col(s.summary.score) : 'var(--fa)' }}>{s.summary ? s.summary.score + '/10' : '–'}</span>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column' }}>
                <strong style={{ fontSize: '13.5px' }}>{[s.role, s.company].filter(Boolean).join(' · ') || 'Entretien général'}</strong>
                <span style={{ fontSize: '12px', color: 'var(--mu)' }}>
                  {fmt(s.date)} · {s.mode === 'voice' ? '🎙 Vocal' : 'Écrit'} · {TONES[s.tone] || 'Bienveillant'} · {s.lang === 'en' ? 'English' : 'Français'}
                  {s.oral ? ' · ' + s.oral.wpm + ' mots/min' : ''}
                </span>
              </div>
              <Btn onClick={() => setOpen(open === s.id ? null : s.id)}>{open === s.id ? 'Replier' : 'Revoir'}</Btn>
              <Btn onClick={() => { if (open === s.id) setOpen(null); h.remove(s.id); }} style={{ color: 'var(--er)' }}>Supprimer</Btn>
            </div>
            {open === s.id ? <Detail s={s} /> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
