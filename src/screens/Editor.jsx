import React from 'react';
import EditorForm from './editor/EditorForm.jsx';
import Preview from './editor/Preview.jsx';
import ScorePanel from './editor/ScorePanel.jsx';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Editor({ v }) {
  return (
    <>
      {v.isEditor ? (
        <>
          {' '}
          <div
            data-screen-label="Éditeur"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              gap: '18px',
              padding: '18px clamp(12px,3.5vw,22px) 40px',
            }}
          >
            {' '}
            {v.lay?.mobile ? (
              <>
                <div
                  style={{
                    position: 'sticky',
                    top: '61px',
                    zIndex: '6',
                    flex: '1 1 100%',
                    display: 'flex',
                    gap: '2px',
                    padding: '4px',
                    borderRadius: '999px',
                    background: 'var(--panel)',
                    border: '1px solid var(--line)',
                    boxShadow: '0 8px 20px -14px rgba(0,0,0,.35)',
                  }}
                >
                  {(v.mTabs || []).map((t, i5) => (
                    <React.Fragment key={i5}>
                      <button
                        onClick={t?.go}
                        style={{
                          flex: '1',
                          height: '38px',
                          border: '0',
                          borderRadius: '999px',
                          background: t?.bg,
                          color: t?.fg,
                          font: 'inherit',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t?.label}
                      </button>
                    </React.Fragment>
                  ))}
                  <button
                    onClick={v.undo}
                    aria-label="Annuler"
                    style={{
                      width: '38px',
                      height: '38px',
                      flex: '0 0 38px',
                      border: '0',
                      borderRadius: '50%',
                      background: 'var(--sub)',
                      color: 'var(--tx)',
                      fontSize: '16px',
                      cursor: 'pointer',
                      opacity: v.undoOp,
                    }}
                  >
                    {'↶'}
                  </button>
                </div>
              </>
            ) : null}{' '}
            <EditorForm v={v} /> <Preview v={v} /> <ScorePanel v={v} />{' '}
          </div>{' '}
        </>
      ) : null}
    </>
  );
}
