import React from 'react';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function NavDrawer({ v }) {
  return (
    <>
      {v.navOpen ? (
        <>
          {' '}
          <div onClick={v.closeNav} style={{ position: 'fixed', inset: '0', zIndex: '70', background: 'rgba(18,16,13,.5)' }}>
            {' '}
            <div
              onClick={v.stop}
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                bottom: '0',
                width: 'min(86vw,310px)',
                background: 'var(--ink)',
                color: 'var(--inkfg)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                paddingBottom: 'env(safe-area-inset-bottom)',
                boxShadow: '20px 0 50px rgba(0,0,0,.3)',
              }}
            >
              {' '}
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '11px' }}>
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
                <span
                  style={{
                    flex: '1',
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                    fontWeight: '700',
                    fontSize: '20px',
                    letterSpacing: '-0.03em',
                  }}
                >
                  {'lisible'}
                  <span style={{ color: 'var(--ac)' }}>{'.'}</span>
                </span>{' '}
                <button
                  onClick={v.closeNav}
                  aria-label="Fermer le menu"
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '0',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,.08)',
                    color: 'var(--inkfg)',
                    fontSize: '18px',
                    cursor: 'pointer',
                  }}
                >
                  {'×'}
                </button>{' '}
              </div>{' '}
              <nav style={{ padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {' '}
                {(v.nav || []).map((n, i81) => (
                  <React.Fragment key={i81}>
                    <button
                      onClick={n?.go}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        width: '100%',
                        height: '46px',
                        padding: '0 12px',
                        border: '0',
                        borderRadius: '12px',
                        background: n?.bg,
                        color: 'var(--inkfg)',
                        opacity: n?.op,
                        font: 'inherit',
                        fontSize: '15px',
                        fontWeight: n?.fw,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: n?.dot, flex: '0 0 6px' }}></span>
                      <span style={{ flex: '1' }}>{n?.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', opacity: '.6' }}>{n?.meta}</span>
                    </button>
                  </React.Fragment>
                ))}{' '}
              </nav>{' '}
              <div style={{ marginTop: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {' '}
                <span style={{ fontSize: '11px', opacity: '.55', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  {'Version active · score '}
                  {v.score}
                </span>{' '}
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
                <select
                  value={v.currentId ?? ''}
                  onChange={v.pickVersion}
                  style={{
                    height: '44px',
                    padding: '0 12px',
                    border: '1px solid rgba(255,255,255,.18)',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,.06)',
                    color: 'var(--inkfg)',
                    fontFamily: "'Instrument Sans',system-ui,sans-serif",
                    fontSize: '16px',
                  }}
                >
                  {(v.verOptions || []).map((o, i82) => (
                    <React.Fragment key={i82}>
                      <option value={o?.id ?? ''}>{o?.name}</option>
                    </React.Fragment>
                  ))}
                </select>{' '}
                <div
                  style={{ display: 'flex', gap: '4px', padding: '3px', border: '1px solid rgba(255,255,255,.18)', borderRadius: '999px' }}
                >
                  {(v.langQuick || []).map((t, i83) => (
                    <React.Fragment key={i83}>
                      <button
                        onClick={t?.go}
                        style={{
                          flex: '1',
                          height: '38px',
                          border: '0',
                          borderRadius: '999px',
                          background: t?.dbg,
                          color: t?.dfg,
                          font: 'inherit',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        {t?.long}
                      </button>
                    </React.Fragment>
                  ))}
                </div>{' '}
                <button
                  onClick={v.openShare}
                  style={{
                    height: '44px',
                    border: '1px solid rgba(255,255,255,.18)',
                    borderRadius: '999px',
                    background: 'transparent',
                    color: 'var(--inkfg)',
                    font: 'inherit',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {'Partager pour relecture'}
                </button>{' '}
              </div>{' '}
            </div>{' '}
          </div>
        </>
      ) : null}
    </>
  );
}
