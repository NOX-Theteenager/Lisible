import React from 'react';
import { ps } from '../../lib/pseudo.js';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function ScorePanel({ v }) {
  return (
    <aside
      style={{
        flex: '1 1 290px',
        maxWidth: '100%',
        minWidth: 'min(100%,270px)',
        display: v.ed?.score,
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {' '}
      <div
        style={{
          background: 'var(--ink)',
          color: 'var(--inkfg)',
          borderRadius: '20px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {' '}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {' '}
          <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '16px' }}>{'Score ATS'}</span>{' '}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '10.5px',
              fontWeight: '700',
              letterSpacing: '.06em',
              opacity: '.8',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#5fd39a' }}></span>
            {'EN DIRECT'}
          </span>{' '}
        </div>{' '}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {' '}
          <div
            style={{
              width: '100px',
              height: '100px',
              flex: '0 0 100px',
              borderRadius: '50%',
              background: `conic-gradient(${v.gauge?.color ?? ''} ${v.gauge?.deg ?? ''}deg, rgba(255,255,255,.12) 0)`,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {' '}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--ink)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {' '}
              <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '30px', fontWeight: '700', lineHeight: '1' }}>
                {v.score}
              </span>{' '}
              <span style={{ fontSize: '10px', opacity: '.55' }}>{'/100'}</span>{' '}
            </div>{' '}
          </div>{' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {' '}
            <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '18px', fontWeight: '700', color: v.gauge?.color }}>
              {v.gauge?.label}
            </span>{' '}
            <span style={{ opacity: '.7', fontSize: '12.5px' }}>
              {v.okCount}
              {'/12 règles respectées'}
            </span>{' '}
            <span style={{ fontSize: '12px', fontWeight: '600', color: v.delta?.color }}>{v.delta?.text}</span>{' '}
          </div>{' '}
        </div>{' '}
      </div>{' '}
      {v.cm?.has ? (
        <>
          {' '}
          <div
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: '20px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {' '}
            <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '15px' }}>
              {'Commentaires de relecture ('}
              {v.cm?.count}
              {')'}
            </span>{' '}
            {(v.cm?.items || []).map((c, i38) => (
              <React.Fragment key={i38}>
                {' '}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: 'var(--sub)',
                    opacity: c?.op,
                  }}
                >
                  {' '}
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '11.5px', color: 'var(--mu)' }}>
                    <strong style={{ color: 'var(--tx)' }}>{c?.author}</strong>
                    <span>{c?.where}</span>
                  </span>{' '}
                  <span style={{ fontSize: '12.5px', lineHeight: '1.45', textDecoration: c?.deco }}>{c?.text}</span>{' '}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={c?.go}
                      style={{
                        height: '30px',
                        padding: '0 12px',
                        border: '1px solid var(--line2)',
                        borderRadius: '999px',
                        background: 'var(--panel)',
                        color: 'var(--tx)',
                        font: 'inherit',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {'Voir'}
                    </button>
                    <button
                      onClick={c?.toggle}
                      style={{
                        height: '30px',
                        padding: '0 12px',
                        border: '1px solid var(--line2)',
                        borderRadius: '999px',
                        background: 'var(--panel)',
                        color: 'var(--tx)',
                        font: 'inherit',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c?.btn}
                    </button>
                  </div>{' '}
                </div>{' '}
              </React.Fragment>
            ))}{' '}
          </div>{' '}
        </>
      ) : null}{' '}
      {v.coh?.has ? (
        <>
          {' '}
          <div
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: '20px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {' '}
            <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '15px' }}>
              {'Cohérence du parcours'}
            </span>{' '}
            {(v.coh?.items || []).map((c, i39) => (
              <React.Fragment key={i39}>
                <button
                  onClick={c?.go}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                    padding: '10px 12px',
                    border: '0',
                    borderRadius: '12px',
                    background: 'var(--sub)',
                    color: 'var(--tx)',
                    font: 'inherit',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{ width: '6px', height: '6px', marginTop: '6px', borderRadius: '50%', background: c?.color, flex: '0 0 6px' }}
                  ></span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: '600', fontSize: '12.5px' }}>{c?.title}</span>
                    <span style={{ fontSize: '11.5px', color: 'var(--mu)', lineHeight: '1.4' }}>{c?.detail}</span>
                  </span>
                </button>
              </React.Fragment>
            ))}{' '}
          </div>{' '}
        </>
      ) : null}{' '}
      {v.hasPriorities ? (
        <>
          {' '}
          <div
            style={{
              background: 'var(--panel)',
              border: '1px solid var(--line)',
              borderRadius: '20px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {' '}
            <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '15px' }}>
              {'À corriger en priorité'}
            </span>{' '}
            {(v.priorities || []).map((p, i40) => (
              <React.Fragment key={i40}>
                {' '}
                <button
                  onClick={p?.go}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    padding: '10px 12px',
                    border: '0',
                    borderRadius: '12px',
                    background: p?.bg,
                    color: 'var(--tx)',
                    font: 'inherit',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'transform .15s',
                  }}
                  className={ps('hover', 'transform:translateX(2px)')}
                >
                  {' '}
                  <span style={{ fontWeight: '600', fontSize: '12.5px' }}>{p?.label}</span>{' '}
                  <span style={{ fontSize: '11.5px', color: 'var(--mu)' }}>
                    {p?.detail}
                    {' · '}
                    <span style={{ color: 'var(--act)', fontWeight: '600' }}>{p?.gain}</span>
                  </span>{' '}
                </button>{' '}
              </React.Fragment>
            ))}{' '}
          </div>{' '}
        </>
      ) : null}{' '}
      <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '20px', overflow: 'hidden' }}>
        {' '}
        <button
          onClick={v.toggleRules}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '13px 16px',
            border: '0',
            background: 'transparent',
            color: 'var(--tx)',
            font: 'inherit',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '15px' }}>
            {'Toutes les règles (12)'}
          </span>
          <span style={{ color: 'var(--fa)' }}>{v.rulesChev}</span>
        </button>{' '}
        {v.rulesOpen ? (
          <>
            {' '}
            {(v.rules || []).map((r, i41) => (
              <React.Fragment key={i41}>
                {' '}
                <button
                  onClick={r?.go}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                    width: '100%',
                    padding: '10px 16px',
                    border: '0',
                    borderTop: '1px solid var(--line)',
                    background: 'transparent',
                    color: 'var(--tx)',
                    font: 'inherit',
                    textAlign: 'left',
                    cursor: r?.cursor,
                  }}
                  className={ps('hover', 'background:var(--sub)')}
                >
                  {' '}
                  <span
                    style={{
                      flex: '0 0 20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: r?.bg,
                      color: r?.color,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '11px',
                      fontWeight: '700',
                    }}
                  >
                    {r?.mark}
                  </span>{' '}
                  <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: '600', lineHeight: '1.35', fontSize: '12.5px' }}>{r?.label}</span>
                    <span style={{ fontSize: '11.5px', color: 'var(--mu)', lineHeight: '1.4' }}>{r?.detail}</span>
                  </span>{' '}
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10.5px', color: 'var(--fa)' }}>{r?.pts}</span>{' '}
                </button>{' '}
              </React.Fragment>
            ))}{' '}
          </>
        ) : null}{' '}
      </div>{' '}
    </aside>
  );
}
