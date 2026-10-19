import React from 'react';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function ShareDialog({ v }) {
  return (
    <>
      {v.sh?.open ? (
        <>
          {' '}
          <div
            onClick={v.closeShare}
            style={{
              position: 'fixed',
              inset: '0',
              zIndex: '55',
              background: 'rgba(18,16,13,.5)',
              display: 'grid',
              placeItems: 'center',
              padding: '16px',
            }}
          >
            {' '}
            <div
              onClick={v.stop}
              style={{
                width: '100%',
                maxWidth: '480px',
                maxHeight: 'calc(100vh - 32px)',
                overflow: 'auto',
                background: 'var(--panel)',
                color: 'var(--tx)',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0,0,0,.25)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {' '}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '20px', fontWeight: '700' }}>
                    {'Partager pour relecture'}
                  </span>
                  <span style={{ color: 'var(--mu)', fontSize: '12.5px' }}>
                    {'Un proche ou un mentor lit « '}
                    {v.versionName}
                    {' » sans créer de compte.'}
                  </span>
                </div>
                <button
                  onClick={v.closeShare}
                  aria-label="Fermer"
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '0',
                    borderRadius: '50%',
                    background: 'var(--sub)',
                    color: 'var(--tx)',
                    fontSize: '18px',
                    cursor: 'pointer',
                  }}
                >
                  {'×'}
                </button>
              </div>{' '}
              {v.sh?.noLink ? (
                <>
                  {' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Droits du relecteur'}</span>
                    <div style={{ display: 'flex', padding: '3px', borderRadius: '999px', background: 'var(--sub)', gap: '2px' }}>
                      {(v.sh?.perms || []).map((p, i75) => (
                        <React.Fragment key={i75}>
                          <button
                            onClick={p?.go}
                            style={{
                              flex: '1',
                              height: '32px',
                              border: '0',
                              borderRadius: '999px',
                              background: p?.bg,
                              color: p?.fg,
                              font: 'inherit',
                              fontSize: '12.5px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {p?.label}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Expiration du lien'}</span>
                    <div style={{ display: 'flex', padding: '3px', borderRadius: '999px', background: 'var(--sub)', gap: '2px' }}>
                      {(v.sh?.exps || []).map((p, i76) => (
                        <React.Fragment key={i76}>
                          <button
                            onClick={p?.go}
                            style={{
                              flex: '1',
                              height: '32px',
                              border: '0',
                              borderRadius: '999px',
                              background: p?.bg,
                              color: p?.fg,
                              font: 'inherit',
                              fontSize: '12.5px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {p?.label}
                          </button>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>{' '}
                  <button
                    onClick={v.sh?.toggleAnon}
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
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '5px',
                        border: `1px solid ${v.sh?.anonBd ?? ''}`,
                        background: v.sh?.anonBg,
                        color: '#ffffff',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '11px',
                      }}
                    >
                      {v.sh?.anonCheck}
                    </span>
                    <span>{'Masquer mes coordonnées et mes employeurs'}</span>
                  </button>{' '}
                  <button
                    onClick={v.sh?.create}
                    style={{
                      height: '40px',
                      border: '0',
                      borderRadius: '999px',
                      background: 'var(--btn)',
                      color: 'var(--btnfg)',
                      font: 'inherit',
                      fontSize: '13.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {'Créer le lien'}
                  </button>{' '}
                </>
              ) : null}{' '}
              {v.sh?.hasLink ? (
                <>
                  {' '}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 4px 4px 14px',
                      border: '1px solid var(--line2)',
                      borderRadius: '999px',
                    }}
                  >
                    <span
                      style={{
                        flex: '1',
                        minWidth: '0',
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {v.sh?.link}
                    </span>
                    <button
                      onClick={v.sh?.copy}
                      style={{
                        height: '34px',
                        padding: '0 14px',
                        border: '0',
                        borderRadius: '999px',
                        background: 'var(--ac)',
                        color: '#ffffff',
                        font: 'inherit',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {'Copier'}
                    </button>
                  </div>{' '}
                  <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>{v.sh?.meta}</span>{' '}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={v.sh?.revoke}
                      style={{
                        height: '30px',
                        padding: '0 12px',
                        border: '1px solid var(--line2)',
                        borderRadius: '999px',
                        background: 'var(--panel)',
                        font: 'inherit',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        color: 'var(--er)',
                        borderColor: 'var(--er)',
                      }}
                    >
                      {'Révoquer le lien'}
                    </button>
                  </div>{' '}
                </>
              ) : null}{' '}
            </div>{' '}
          </div>
        </>
      ) : null}
    </>
  );
}
