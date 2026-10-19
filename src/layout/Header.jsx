import React from 'react';
import { ps } from '../lib/pseudo.js';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Header({ v }) {
  return (
    <header
      style={{
        position: 'sticky',
        top: '0',
        zIndex: '20',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: v.lay?.hPad,
        backgroundColor: v.lay?.hBg,
        borderBottom: '1px solid var(--line)',
        isolation: 'isolate',
      }}
    >
      {' '}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '0', flex: '1 1 auto' }}>
        {' '}
        {v.lay?.mobile ? (
          <>
            <button
              onClick={v.openNav}
              aria-label="Ouvrir le menu"
              style={{
                width: '40px',
                height: '40px',
                flex: '0 0 40px',
                border: '1px solid var(--line2)',
                borderRadius: '12px',
                background: 'var(--panel)',
                color: 'var(--tx)',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                padding: '0',
              }}
            >
              <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ width: '16px', height: '2px', borderRadius: '1px', background: 'var(--tx)' }}></span>
                <span style={{ width: '16px', height: '2px', borderRadius: '1px', background: 'var(--tx)' }}></span>
                <span style={{ width: '10px', height: '2px', borderRadius: '1px', background: 'var(--tx)' }}></span>
              </span>
            </button>
          </>
        ) : null}{' '}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
          {' '}
          <h1
            style={{
              margin: '0',
              fontFamily: "'Bricolage Grotesque',sans-serif",
              fontSize: v.lay?.h1,
              fontWeight: '700',
              letterSpacing: '-0.015em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {v.screenTitle}
          </h1>{' '}
          <span style={{ display: v.lay?.deskBlock, color: 'var(--mu)', fontSize: '12.5px' }}>{v.screenSub}</span>{' '}
        </div>{' '}
      </div>{' '}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
        {' '}
        <span style={{ display: v.lay?.desk, alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--fa)' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ok)' }}></span>
          {v.savedLabel}
        </span>{' '}
        <select
          value={v.currentId ?? ''}
          onChange={v.pickVersion}
          style={{
            display: v.lay?.deskBlock,
            height: '34px',
            maxWidth: '250px',
            padding: '0 12px',
            border: '1px solid var(--line2)',
            borderRadius: '999px',
            background: 'var(--panel)',
            color: 'var(--tx)',
            fontFamily: "'Instrument Sans',system-ui,sans-serif",
            fontSize: '12.5px',
            fontWeight: '600',
          }}
        >
          {(v.verOptions || []).map((o, i1) => (
            <React.Fragment key={i1}>
              <option value={o?.id ?? ''}>{o?.name}</option>
            </React.Fragment>
          ))}
        </select>{' '}
        <div
          style={{
            display: v.lay?.desk,
            gap: '2px',
            padding: '2px',
            border: '1px solid var(--line2)',
            borderRadius: '999px',
            background: 'var(--panel)',
          }}
        >
          {' '}
          <button
            onClick={v.undo}
            title="Annuler (Ctrl/⌘ + Z)"
            aria-label="Annuler"
            style={{
              width: '30px',
              height: '30px',
              border: '0',
              borderRadius: '50%',
              background: 'transparent',
              color: 'var(--tx)',
              opacity: v.undoOp,
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            {'↶'}
          </button>{' '}
          <button
            onClick={v.redo}
            title="Rétablir (Ctrl/⌘ + Maj + Z)"
            aria-label="Rétablir"
            style={{
              width: '30px',
              height: '30px',
              border: '0',
              borderRadius: '50%',
              background: 'transparent',
              color: 'var(--tx)',
              opacity: v.redoOp,
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            {'↷'}
          </button>{' '}
        </div>{' '}
        {v.rem?.has ? (
          <>
            <button
              onClick={v.rem?.go}
              style={{
                height: v.lay?.btnH,
                padding: '0 12px',
                border: '0',
                borderRadius: '999px',
                background: 'var(--acs)',
                color: 'var(--act)',
                font: 'inherit',
                fontSize: '12.5px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: '0',
              }}
            >
              {v.rem?.label}
            </button>
          </>
        ) : null}{' '}
        <div
          style={{
            display: v.lay?.desk,
            padding: '2px',
            border: '1px solid var(--line2)',
            borderRadius: '999px',
            background: 'var(--panel)',
          }}
        >
          {(v.langQuick || []).map((t, i2) => (
            <React.Fragment key={i2}>
              <button
                onClick={t?.go}
                style={{
                  height: '30px',
                  minWidth: '34px',
                  padding: '0 9px',
                  border: '0',
                  borderRadius: '999px',
                  background: t?.bg,
                  color: t?.fg,
                  font: 'inherit',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {t?.label}
              </button>
            </React.Fragment>
          ))}
        </div>{' '}
        <button
          onClick={v.openShare}
          style={{
            display: v.lay?.deskBlock,
            height: '34px',
            padding: '0 14px',
            border: '1px solid var(--line2)',
            borderRadius: '999px',
            background: 'var(--panel)',
            color: 'var(--tx)',
            font: 'inherit',
            fontSize: '12.5px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: '0',
          }}
        >
          {'Partager'}
        </button>{' '}
        <button
          onClick={v.toggleAnon}
          title="Anonymiser"
          aria-label="Anonymiser"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: v.lay?.btnH,
            padding: v.lay?.anonPad,
            border: '1px solid var(--line2)',
            borderRadius: '999px',
            background: 'var(--panel)',
            color: 'var(--tx)',
            font: 'inherit',
            fontSize: '12.5px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: '0',
          }}
        >
          {' '}
          <span
            style={{
              width: '30px',
              height: '18px',
              borderRadius: '9px',
              background: v.anon?.track,
              position: 'relative',
              transition: 'background .2s',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '2px',
                left: v.anon?.knob,
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#ffffff',
                transition: 'left .2s',
                boxShadow: '0 1px 2px rgba(0,0,0,.25)',
              }}
            ></span>
          </span>{' '}
          <span style={{ display: v.lay?.deskIn }}>{'Anonymiser'}</span>{' '}
        </button>{' '}
        <button
          onClick={v.avatar?.go}
          title={v.avatar?.title}
          aria-label={v.avatar?.title}
          style={{
            width: v.lay?.btnH,
            height: v.lay?.btnH,
            flex: '0 0 auto',
            border: '0',
            borderRadius: '50%',
            background: v.avatar?.bg,
            color: v.avatar?.fg,
            font: 'inherit',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          {v.avatar?.initial}
        </button>{' '}
        <button
          onClick={v.openExport}
          style={{
            height: v.lay?.btnH,
            padding: '0 18px',
            border: '0',
            borderRadius: '999px',
            background: 'var(--btn)',
            color: 'var(--btnfg)',
            font: 'inherit',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: '0',
            transition: 'transform .15s',
          }}
          className={ps('hover', 'transform:translateY(-1px)')}
        >
          {'Exporter'}
        </button>{' '}
      </div>{' '}
    </header>
  );
}
