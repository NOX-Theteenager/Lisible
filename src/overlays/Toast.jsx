import React from 'react';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Toast({ v }) {
  return (
    <>
      {v.hasToast ? (
        <>
          {' '}
          <div
            style={{
              position: 'fixed',
              left: '50%',
              bottom: v.lay?.toastB,
              transform: 'translateX(-50%)',
              zIndex: '80',
              maxWidth: 'calc(100vw - 24px)',
              textAlign: 'center',
              background: 'var(--tx)',
              color: 'var(--panel)',
              padding: '12px 18px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 8px 24px rgba(0,0,0,.2)',
            }}
          >
            {v.toast}
          </div>
        </>
      ) : null}
    </>
  );
}
