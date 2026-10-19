import React from 'react';
import { ps } from '../lib/pseudo.js';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Sidebar({ v }) {
  return (
    <aside
      style={{
        width: '228px',
        flex: '0 0 228px',
        background: 'var(--ink)',
        color: 'var(--inkfg)',
        display: v.lay?.side,
        flexDirection: 'column',
        position: 'sticky',
        top: '0',
        height: '100vh',
      }}
    >
      {' '}
      <div style={{ padding: '20px 18px 18px', display: 'flex', alignItems: 'center', gap: '11px' }}>
        {' '}
        <div
          aria-hidden="true"
          style={{
            width: '34px',
            height: '34px',
            flex: '0 0 34px',
            borderRadius: '10px',
            background: 'var(--ac)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: '5px',
            gap: '1px',
          }}
        >
          <span style={{ width: '4px', height: '19px', borderRadius: '2px', background: '#ffffff' }}></span>
          <span style={{ width: '4px', height: '4px', borderRadius: '1px', background: '#1c1915' }}></span>
        </div>{' '}
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.15' }}>
          {' '}
          <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '20px', letterSpacing: '-0.03em' }}>
            {'lisible'}
            <span style={{ color: 'var(--ac)' }}>{'.'}</span>
          </span>{' '}
          <span style={{ fontSize: '11px', opacity: '.55' }}>{'Lu par les robots, choisi par les humains'}</span>{' '}
        </div>{' '}
      </div>{' '}
      <nav style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {' '}
        {(v.nav || []).map((n, i0) => (
          <React.Fragment key={i0}>
            {' '}
            <button
              onClick={n?.go}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                height: '38px',
                padding: '0 12px',
                border: '0',
                borderRadius: '10px',
                background: n?.bg,
                color: 'var(--inkfg)',
                opacity: n?.op,
                font: 'inherit',
                fontSize: '13.5px',
                fontWeight: n?.fw,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background .15s',
              }}
              className={ps('hover', 'background:rgba(255,255,255,.07);opacity:1')}
            >
              {' '}
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: n?.dot, flex: '0 0 6px' }}></span>{' '}
              <span style={{ flex: '1' }}>{n?.label}</span>{' '}
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10.5px', opacity: '.6' }}>{n?.meta}</span>{' '}
            </button>{' '}
          </React.Fragment>
        ))}{' '}
      </nav>{' '}
      <div style={{ marginTop: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {' '}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '14px',
            background: 'rgba(255,255,255,.06)',
          }}
        >
          {' '}
          <div
            style={{
              width: '44px',
              height: '44px',
              flex: '0 0 44px',
              borderRadius: '50%',
              background: `conic-gradient(${v.gauge?.color ?? ''} ${v.gauge?.deg ?? ''}deg, rgba(255,255,255,.12) 0)`,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {' '}
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--ink)',
                display: 'grid',
                placeItems: 'center',
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontSize: '13px',
                fontWeight: '700',
              }}
            >
              {v.score}
            </div>{' '}
          </div>{' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
            {' '}
            <span style={{ fontSize: '10.5px', opacity: '.55', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              {'Version active'}
            </span>{' '}
            <span style={{ fontWeight: '600', fontSize: '12.5px', lineHeight: '1.3' }}>{v.versionName}</span>{' '}
          </div>{' '}
        </div>{' '}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', padding: '0 4px', fontSize: '11px' }}>
          <a href="/confidentialite" style={{ color: 'var(--inkfg)', opacity: '.6' }}>
            {'Confidentialité'}
          </a>
          <a href="/conditions" style={{ color: 'var(--inkfg)', opacity: '.6' }}>
            {'Conditions'}
          </a>
          <a href="/mentions-legales" style={{ color: 'var(--inkfg)', opacity: '.6' }}>
            {'Mentions légales'}
          </a>
        </div>{' '}
      </div>
    </aside>
  );
}
