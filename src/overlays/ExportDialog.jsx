import React from 'react';
import { ps } from '../lib/pseudo.js';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function ExportDialog({ v }) {
  return (
    <>
      {v.exp?.open ? (
        <>
          {' '}
          <div
            onClick={v.closeExport}
            style={{
              position: 'fixed',
              inset: '0',
              zIndex: '50',
              background: 'rgba(18,16,13,.5)',
              display: 'grid',
              placeItems: 'center',
              padding: '20px',
            }}
          >
            {' '}
            <div
              onClick={v.stop}
              style={{
                width: '100%',
                maxWidth: '500px',
                background: 'var(--panel)',
                color: 'var(--tx)',
                border: '1px solid var(--line)',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0,0,0,.25)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {' '}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '16px',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600' }}>{'Exporter le CV'}</span>
                  <span style={{ color: 'var(--mu)' }}>{v.versionName}</span>
                </div>{' '}
                <button
                  onClick={v.closeExport}
                  style={{
                    width: '28px',
                    height: '28px',
                    border: '0',
                    borderRadius: '999px',
                    background: 'transparent',
                    color: 'var(--mu)',
                    fontSize: '16px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: '0',
                  }}
                  className={ps('hover', 'background:var(--sub)')}
                >
                  {'×'}
                </button>{' '}
              </div>{' '}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {' '}
                {(v.fmts || []).map((f, i77) => (
                  <React.Fragment key={i77}>
                    {' '}
                    <button
                      onClick={f?.pick}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start',
                        padding: '10px 12px',
                        border: `1px solid ${f?.bd ?? ''}`,
                        borderRadius: '8px',
                        background: f?.bg,
                        color: 'var(--tx)',
                        font: 'inherit',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      {' '}
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          marginTop: '2px',
                          borderRadius: '50%',
                          border: `1px solid ${f?.bd ?? ''}`,
                          boxShadow: 'inset 0 0 0 3px var(--panel)',
                          background: f?.dot,
                          flex: '0 0 14px',
                        }}
                      ></span>{' '}
                      <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {' '}
                        <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '600', fontSize: '15px' }}>
                            {f?.name}
                          </span>
                          {f?.rec ? (
                            <>
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: 'var(--oks)',
                                  color: 'var(--ok)',
                                  fontWeight: '600',
                                }}
                              >
                                {'Recommandé ATS'}
                              </span>
                            </>
                          ) : null}
                        </span>{' '}
                        <span style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.4' }}>{f?.desc}</span>{' '}
                      </span>{' '}
                    </button>{' '}
                  </React.Fragment>
                ))}{' '}
                <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {' '}
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Nom du fichier'}</span>{' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--line2)',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    {' '}
                    <input
                      value={v.exp?.name ?? ''}
                      onChange={v.onExpName}
                      style={{
                        flex: '1',
                        minWidth: '0',
                        height: '32px',
                        padding: '0 10px',
                        border: '0',
                        background: 'var(--panel)',
                        color: 'var(--tx)',
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: '12.5px',
                        outline: 'none',
                      }}
                    />{' '}
                    <span style={{ padding: '0 10px', fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: 'var(--fa)' }}>
                      {v.exp?.ext}
                    </span>{' '}
                  </div>{' '}
                </label>{' '}
                <button
                  onClick={v.toggleAnon}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '0',
                    border: '0',
                    background: 'transparent',
                    color: 'var(--tx)',
                    font: 'inherit',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {' '}
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      border: `1px solid ${v.anon?.bd ?? ''}`,
                      background: v.anon?.box,
                      color: 'var(--acfg)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '11px',
                    }}
                  >
                    {v.anon?.check}
                  </span>{' '}
                  <span>{'Anonymiser (nom, coordonnées, entreprises et établissements masqués)'}</span>{' '}
                </button>{' '}
                {v.ph?.has ? (
                  <>
                    <div
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'var(--ers)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <span style={{ fontWeight: '700', color: 'var(--er)' }}>{v.ph?.title}</span>
                      <span style={{ fontSize: '12px', color: 'var(--mu)' }}>
                        {'Ces repères doivent être remplacés par vos vrais chiffres avant l’envoi.'}
                      </span>
                      {(v.ph?.items || []).map((p, i78) => (
                        <React.Fragment key={i78}>
                          <button
                            onClick={p?.go}
                            style={{
                              textAlign: 'left',
                              border: '0',
                              background: 'transparent',
                              padding: '0',
                              font: 'inherit',
                              fontSize: '12px',
                              color: 'var(--tx)',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                          >
                            {p?.where}
                            {' : « '}
                            {p?.text}
                            {' »'}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                ) : null}{' '}
                {v.tpl?.isDesign ? (
                  <>
                    <div
                      style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        background: 'var(--ais)',
                        fontSize: '12.5px',
                        lineHeight: '1.5',
                      }}
                    >
                      {'Modèle Design « '}
                      {v.tpl?.label}
                      {' » : le PDF reprend le design et la photo ; le Word et le TXT sont générés en version ATS stricte.'}
                    </div>
                  </>
                ) : null}{' '}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: 'var(--sub)',
                  }}
                >
                  {' '}
                  {(v.expChecks || []).map((c, i79) => (
                    <React.Fragment key={i79}>
                      {' '}
                      <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", color: c?.color }}>{c?.mark}</span>
                        <span style={{ color: 'var(--mu)' }}>{c?.label}</span>
                      </div>{' '}
                    </React.Fragment>
                  ))}{' '}
                </div>{' '}
              </div>{' '}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  padding: '12px 16px',
                  borderTop: '1px solid var(--line)',
                }}
              >
                {' '}
                <button
                  onClick={v.closeExport}
                  style={{
                    height: '32px',
                    padding: '0 12px',
                    border: '1px solid var(--line2)',
                    borderRadius: '999px',
                    background: 'var(--panel)',
                    color: 'var(--tx)',
                    font: 'inherit',
                    fontSize: '12.5px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: '0',
                  }}
                >
                  {'Annuler'}
                </button>{' '}
                <button
                  onClick={v.exportPack}
                  style={{
                    marginRight: 'auto',
                    height: '32px',
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
                  }}
                >
                  {'Pack candidature (.zip)'}
                </button>{' '}
                <button
                  onClick={v.doExport}
                  style={{
                    height: '32px',
                    padding: '0 14px',
                    border: '1px solid var(--btn)',
                    borderRadius: '999px',
                    background: 'var(--btn)',
                    color: 'var(--btnfg)',
                    font: 'inherit',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: '0',
                  }}
                >
                  {'Télécharger'}
                </button>{' '}
              </div>{' '}
            </div>{' '}
          </div>
        </>
      ) : null}
    </>
  );
}
