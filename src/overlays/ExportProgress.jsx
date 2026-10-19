/* Progression d'un export (PDF, Word) : barre animée pendant la génération, puis confirmation. */
import React from 'react';

export default function ExportProgress({ v }) {
  const x = v.exporting;
  if (!x) return null;
  const done = x.state === 'done', err = x.state === 'error';
  const col = err ? 'var(--er)' : done ? 'var(--ok)' : 'var(--ai)';
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: `calc(${v.lay?.toastB || '24px'} + ${v.hasToast ? '56px' : '0px'})`,
        transform: 'translateX(-50%)',
        zIndex: 81,
        width: 'min(360px, calc(100vw - 32px))',
        background: 'var(--panel)',
        color: 'var(--tx)',
        border: '1px solid var(--line)',
        borderRadius: '16px',
        boxShadow: '0 12px 32px -12px rgba(0,0,0,.35)',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          aria-hidden="true"
          style={{
            width: '22px',
            height: '22px',
            flex: '0 0 22px',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            fontSize: '12px',
            fontWeight: 800,
            color: '#fff',
            background: done || err ? col : 'transparent',
            border: done || err ? '0' : '2.5px solid var(--ais)',
            borderTopColor: done || err ? undefined : 'var(--ai)',
            animation: done || err ? 'none' : 'lisible-spin .8s linear infinite',
          }}
        >
          {done ? '✓' : err ? '!' : ''}
        </span>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <strong style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.label}</strong>
          {x.detail ? <span style={{ fontSize: '11.5px', color: 'var(--mu)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.detail}</span> : null}
        </div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11.5px', color: 'var(--mu)' }}>{Math.round(x.pct)} %</span>
      </div>
      <div style={{ height: '6px', borderRadius: '999px', background: 'var(--sub)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: x.pct + '%', borderRadius: '999px', background: col, transition: 'width .25s ease-out' }} />
      </div>
    </div>
  );
}
