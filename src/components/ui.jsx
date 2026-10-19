/* Petits composants d'interface reprenant les jetons du design (couleurs, rayons, typographie). */
import React from 'react';
import { ps } from '../lib/pseudo.js';

export const H = ({ children, size = 18 }) => (
  <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: size + 'px' }}>{children}</span>
);

export const Muted = ({ children, style }) => <span style={{ fontSize: '12.5px', color: 'var(--mu)', lineHeight: 1.5, ...style }}>{children}</span>;

export function Card({ children, style }) {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '20px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', ...style }}>
      {children}
    </div>
  );
}

export function AIBadge() {
  return (
    <span style={{ flex: '0 0 auto', fontSize: '10px', fontWeight: 800, padding: '3px 7px', borderRadius: '999px', background: 'var(--ai)', color: 'var(--aifg)', letterSpacing: '.05em' }}>
      IA
    </span>
  );
}

/* Sélecteur segmenté : options = [[valeur, libellé], …] */
export function Seg({ value, options, onChange, full }) {
  return (
    <div style={{ display: 'flex', padding: '3px', borderRadius: '999px', background: 'var(--sub)', gap: '2px', alignSelf: full ? 'stretch' : 'flex-start', flexWrap: 'wrap' }}>
      {options.map(([k, label]) => {
        const on = k === value;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            style={{ flex: full ? 1 : '0 0 auto', height: '30px', padding: '0 14px', border: 0, borderRadius: '999px', background: on ? 'var(--btn)' : 'transparent', color: on ? 'var(--btnfg)' : 'var(--mu)', font: 'inherit', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

const BTN = {
  dark: { background: 'var(--btn)', color: 'var(--btnfg)', border: 0 },
  ai: { background: 'var(--ai)', color: 'var(--aifg)', border: 0 },
  ac: { background: 'var(--ac)', color: '#ffffff', border: 0 },
  line: { background: 'var(--panel)', color: 'var(--tx)', border: '1px solid var(--line2)' },
};
export function Btn({ kind = 'line', children, onClick, disabled, style, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ height: '34px', padding: '0 14px', borderRadius: '999px', font: 'inherit', fontSize: '12.5px', fontWeight: 600, cursor: disabled ? 'default' : 'pointer', whiteSpace: 'nowrap', opacity: disabled ? 0.55 : 1, flexShrink: 0, ...BTN[kind], ...style }}
    >
      {children}
    </button>
  );
}

export function Field({ label, hint, value, onChange, rows = 3, placeholder }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--mu)' }}>{label}</span>
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line2)', borderRadius: '12px', background: 'var(--panel)', color: 'var(--tx)', font: 'inherit', fontSize: '13px', lineHeight: 1.5, outline: 'none', resize: 'vertical' }}
        className={ps('focus', 'border-color:var(--ai);box-shadow:0 0 0 4px var(--ais)')}
      />
      {hint ? <span style={{ fontSize: '11.5px', color: 'var(--fa)' }}>{hint}</span> : null}
    </label>
  );
}
