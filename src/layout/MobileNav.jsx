import React from 'react';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function MobileNav({ v }) {
  return (
    <>
      {v.lay?.mobile ? (
        <>
          {' '}
          <nav
            aria-label="Navigation principale"
            style={{
              position: 'fixed',
              left: '0',
              right: '0',
              bottom: '0',
              zIndex: '40',
              display: 'grid',
              gridTemplateColumns: 'repeat(5,1fr)',
              background: 'var(--panel)',
              borderTop: '1px solid var(--line)',
              padding: '4px 4px calc(4px + env(safe-area-inset-bottom))',
              boxShadow: '0 -8px 24px -18px rgba(0,0,0,.3)',
            }}
          >
            {' '}
            {(v.bottomNav || []).map((b, i80) => (
              <React.Fragment key={i80}>
                <button
                  onClick={b?.go}
                  style={{
                    height: '54px',
                    border: '0',
                    background: 'transparent',
                    color: b?.fg,
                    font: 'inherit',
                    fontSize: '11.5px',
                    fontWeight: b?.fw,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ width: '20px', height: '3px', borderRadius: '2px', background: b?.dot }}></span>
                  {b?.label}
                </button>
              </React.Fragment>
            ))}{' '}
            <button
              onClick={v.openNav}
              style={{
                height: '54px',
                border: '0',
                background: 'transparent',
                color: v.more?.fg,
                font: 'inherit',
                fontSize: '11.5px',
                fontWeight: v.more?.fw,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <span style={{ width: '20px', height: '3px', borderRadius: '2px', background: v.more?.dot }}></span>
              {'Plus'}
            </button>{' '}
          </nav>
        </>
      ) : null}
    </>
  );
}
