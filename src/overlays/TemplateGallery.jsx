import React from 'react';
import { ps } from '../lib/pseudo.js';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function TemplateGallery({ v }) {
  return (
    <>
      {v.galleryOpen ? (
        <>
          {' '}
          <div
            onClick={v.closeGallery}
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
                maxWidth: '980px',
                maxHeight: 'calc(100vh - 40px)',
                overflow: 'auto',
                background: 'var(--bg)',
                color: 'var(--tx)',
                borderRadius: '24px',
                boxShadow: '0 30px 80px rgba(0,0,0,.3)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
              }}
            >
              {' '}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span
                    style={{
                      fontFamily: "'Bricolage Grotesque',sans-serif",
                      fontSize: '24px',
                      fontWeight: '700',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {'Choisir un modèle'}
                  </span>
                  <span style={{ color: 'var(--mu)' }}>{'Le contenu est conservé à l’identique : seule la mise en forme change.'}</span>
                </div>{' '}
                <button
                  onClick={v.closeGallery}
                  style={{
                    width: '36px',
                    height: '36px',
                    border: '0',
                    borderRadius: '50%',
                    background: 'var(--panel)',
                    color: 'var(--tx)',
                    fontSize: '18px',
                    cursor: 'pointer',
                  }}
                >
                  {'×'}
                </button>{' '}
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {' '}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '700' }}>{'ATS strict'}</span>
                  <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>
                    {'Une colonne, sans photo : idéal pour les candidatures en ligne.'}
                  </span>
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,200px),1fr))', gap: '12px' }}>
                  {' '}
                  {(v.galleryAts || []).map((g, i73) => (
                    <React.Fragment key={i73}>
                      <button
                        onClick={g?.pick}
                        style={{
                          textAlign: 'left',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          padding: '10px 10px 12px',
                          border: `2px solid ${g?.bd ?? ''}`,
                          borderRadius: '18px',
                          background: 'var(--panel)',
                          color: 'var(--tx)',
                          font: 'inherit',
                          cursor: 'pointer',
                          transition: 'transform .18s',
                        }}
                        className={ps('hover', 'transform:translateY(-3px)')}
                      >
                        {' '}
                        <div
                          style={{
                            aspectRatio: '3/3.7',
                            borderRadius: '10px',
                            background: '#ffffff',
                            border: '1px solid #e8e3da',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {' '}
                          {g?.isText ? (
                            <>
                              {' '}
                              <div
                                style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '5px', alignItems: g?.alignItems }}
                              >
                                {' '}
                                <div style={{ width: '56%', height: '9px', borderRadius: '2px', background: '#1c1915' }}></div>{' '}
                                <div style={{ width: '36%', height: '5px', borderRadius: '2px', background: g?.titleC }}></div>{' '}
                                <div
                                  style={{ width: '72%', height: '3px', borderRadius: '2px', background: '#d6cfc2', marginBottom: '5px' }}
                                ></div>{' '}
                                <div style={{ width: '100%', height: '5px', borderRadius: '1px', background: g?.headC }}></div>{' '}
                                <div style={{ width: '100%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '92%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '96%', height: '3px', background: '#e4ded3', marginBottom: '5px' }}></div>{' '}
                                <div style={{ width: '100%', height: '5px', borderRadius: '1px', background: g?.headC }}></div>{' '}
                                <div style={{ width: '88%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '94%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '80%', height: '3px', background: '#e4ded3' }}></div>{' '}
                              </div>{' '}
                            </>
                          ) : null}{' '}
                          {g?.isBand ? (
                            <>
                              {' '}
                              <div style={{ background: g?.accent, padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div
                                  style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,.45)' }}
                                ></div>
                                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ width: '70%', height: '7px', borderRadius: '2px', background: '#ffffff' }}></div>
                                  <div
                                    style={{ width: '45%', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,.7)' }}
                                  ></div>
                                </div>
                              </div>{' '}
                              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {' '}
                                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '1px', background: g?.accent }}></div>
                                  <div style={{ width: '40%', height: '4px', background: g?.accent }}></div>
                                </div>{' '}
                                <div style={{ width: '100%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '90%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '95%', height: '3px', background: '#e4ded3', marginBottom: '4px' }}></div>{' '}
                                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '1px', background: g?.accent }}></div>
                                  <div style={{ width: '46%', height: '4px', background: g?.accent }}></div>
                                </div>{' '}
                                <div style={{ width: '86%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '92%', height: '3px', background: '#e4ded3' }}></div>{' '}
                              </div>{' '}
                            </>
                          ) : null}{' '}
                          {g?.isTwo ? (
                            <>
                              {' '}
                              <div style={{ flex: '1', display: 'grid', gridTemplateColumns: '36% 1fr' }}>
                                {' '}
                                <div
                                  style={{
                                    background: g?.tint,
                                    padding: '12px 8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ffffff' }}></div>
                                  <div style={{ width: '80%', height: '3px', background: g?.accent, marginTop: '4px' }}></div>
                                  <div style={{ width: '70%', height: '3px', background: 'rgba(0,0,0,.12)' }}></div>
                                  <div style={{ width: '76%', height: '3px', background: 'rgba(0,0,0,.12)' }}></div>
                                  <div style={{ width: '80%', height: '3px', background: g?.accent, marginTop: '6px' }}></div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center' }}>
                                    <div style={{ width: '16px', height: '6px', borderRadius: '3px', background: '#ffffff' }}></div>
                                    <div style={{ width: '12px', height: '6px', borderRadius: '3px', background: '#ffffff' }}></div>
                                    <div style={{ width: '18px', height: '6px', borderRadius: '3px', background: '#ffffff' }}></div>
                                  </div>
                                </div>{' '}
                                <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                  <div style={{ width: '80%', height: '8px', borderRadius: '2px', background: '#1c1915' }}></div>
                                  <div style={{ width: '50%', height: '4px', background: g?.accent, marginBottom: '5px' }}></div>
                                  <div style={{ width: '50%', height: '4px', background: '#1c1915' }}></div>
                                  <div style={{ width: '100%', height: '3px', background: '#e4ded3' }}></div>
                                  <div style={{ width: '90%', height: '3px', background: '#e4ded3' }}></div>
                                  <div style={{ width: '94%', height: '3px', background: '#e4ded3', marginBottom: '4px' }}></div>
                                  <div style={{ width: '46%', height: '4px', background: '#1c1915' }}></div>
                                  <div style={{ width: '88%', height: '3px', background: '#e4ded3' }}></div>
                                </div>{' '}
                              </div>{' '}
                            </>
                          ) : null}{' '}
                          {g?.isSig ? (
                            <>
                              {' '}
                              <div
                                style={{
                                  padding: '14px 12px 8px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-end',
                                  borderBottom: '1px solid #ece7de',
                                }}
                              >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '64%' }}>
                                  <div style={{ width: '100%', height: '11px', borderRadius: '2px', background: '#1c1915' }}></div>
                                  <div style={{ width: '60%', height: '4px', background: g?.accent }}></div>
                                </div>
                                <div style={{ width: '24px', height: '30px', borderRadius: '3px', background: '#efe9df' }}></div>
                              </div>{' '}
                              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                {' '}
                                <div style={{ width: '40%', height: '5px', background: '#1c1915' }}></div>{' '}
                                <div style={{ display: 'grid', gridTemplateColumns: '24% 1fr', gap: '6px' }}>
                                  <div style={{ height: '3px', background: g?.accent }}></div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    <div style={{ height: '3px', background: '#e4ded3' }}></div>
                                    <div style={{ width: '90%', height: '3px', background: '#e4ded3' }}></div>
                                  </div>
                                </div>{' '}
                                <div style={{ display: 'grid', gridTemplateColumns: '24% 1fr', gap: '6px' }}>
                                  <div style={{ height: '3px', background: g?.accent }}></div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    <div style={{ height: '3px', background: '#e4ded3' }}></div>
                                    <div style={{ width: '84%', height: '3px', background: '#e4ded3' }}></div>
                                  </div>
                                </div>{' '}
                              </div>{' '}
                            </>
                          ) : null}{' '}
                        </div>{' '}
                        <div
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', padding: '0 4px' }}
                        >
                          <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '15px' }}>
                            {g?.label}
                          </span>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: '700',
                              padding: '3px 8px',
                              borderRadius: '999px',
                              background: g?.atsBg,
                              color: g?.atsFg,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {g?.atsLabel}
                          </span>
                        </div>{' '}
                        <span style={{ padding: '0 4px', fontSize: '12px', color: 'var(--mu)', lineHeight: '1.4' }}>{g?.tag}</span>{' '}
                      </button>
                    </React.Fragment>
                  ))}{' '}
                </div>{' '}
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {' '}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '700' }}>{'Design · avec photo'}</span>
                  <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>
                    {'Pour les envois directs, salons et réseaux. Version ATS générée en parallèle à l’export.'}
                  </span>
                </div>{' '}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,200px),1fr))', gap: '12px' }}>
                  {' '}
                  {(v.galleryDesign || []).map((g, i74) => (
                    <React.Fragment key={i74}>
                      <button
                        onClick={g?.pick}
                        style={{
                          textAlign: 'left',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          padding: '10px 10px 12px',
                          border: `2px solid ${g?.bd ?? ''}`,
                          borderRadius: '18px',
                          background: 'var(--panel)',
                          color: 'var(--tx)',
                          font: 'inherit',
                          cursor: 'pointer',
                          transition: 'transform .18s',
                        }}
                        className={ps('hover', 'transform:translateY(-3px)')}
                      >
                        {' '}
                        <div
                          style={{
                            aspectRatio: '3/3.7',
                            borderRadius: '10px',
                            background: '#ffffff',
                            border: '1px solid #e8e3da',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {' '}
                          {g?.isText ? (
                            <>
                              {' '}
                              <div
                                style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '5px', alignItems: g?.alignItems }}
                              >
                                {' '}
                                <div style={{ width: '56%', height: '9px', borderRadius: '2px', background: '#1c1915' }}></div>{' '}
                                <div style={{ width: '36%', height: '5px', borderRadius: '2px', background: g?.titleC }}></div>{' '}
                                <div
                                  style={{ width: '72%', height: '3px', borderRadius: '2px', background: '#d6cfc2', marginBottom: '5px' }}
                                ></div>{' '}
                                <div style={{ width: '100%', height: '5px', borderRadius: '1px', background: g?.headC }}></div>{' '}
                                <div style={{ width: '100%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '92%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '96%', height: '3px', background: '#e4ded3', marginBottom: '5px' }}></div>{' '}
                                <div style={{ width: '100%', height: '5px', borderRadius: '1px', background: g?.headC }}></div>{' '}
                                <div style={{ width: '88%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '94%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '80%', height: '3px', background: '#e4ded3' }}></div>{' '}
                              </div>{' '}
                            </>
                          ) : null}{' '}
                          {g?.isBand ? (
                            <>
                              {' '}
                              <div style={{ background: g?.accent, padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div
                                  style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,.45)' }}
                                ></div>
                                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ width: '70%', height: '7px', borderRadius: '2px', background: '#ffffff' }}></div>
                                  <div
                                    style={{ width: '45%', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,.7)' }}
                                  ></div>
                                </div>
                              </div>{' '}
                              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {' '}
                                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '1px', background: g?.accent }}></div>
                                  <div style={{ width: '40%', height: '4px', background: g?.accent }}></div>
                                </div>{' '}
                                <div style={{ width: '100%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '90%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '95%', height: '3px', background: '#e4ded3', marginBottom: '4px' }}></div>{' '}
                                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                  <div style={{ width: '6px', height: '6px', borderRadius: '1px', background: g?.accent }}></div>
                                  <div style={{ width: '46%', height: '4px', background: g?.accent }}></div>
                                </div>{' '}
                                <div style={{ width: '86%', height: '3px', background: '#e4ded3' }}></div>
                                <div style={{ width: '92%', height: '3px', background: '#e4ded3' }}></div>{' '}
                              </div>{' '}
                            </>
                          ) : null}{' '}
                          {g?.isTwo ? (
                            <>
                              {' '}
                              <div style={{ flex: '1', display: 'grid', gridTemplateColumns: '36% 1fr' }}>
                                {' '}
                                <div
                                  style={{
                                    background: g?.tint,
                                    padding: '12px 8px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#ffffff' }}></div>
                                  <div style={{ width: '80%', height: '3px', background: g?.accent, marginTop: '4px' }}></div>
                                  <div style={{ width: '70%', height: '3px', background: 'rgba(0,0,0,.12)' }}></div>
                                  <div style={{ width: '76%', height: '3px', background: 'rgba(0,0,0,.12)' }}></div>
                                  <div style={{ width: '80%', height: '3px', background: g?.accent, marginTop: '6px' }}></div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center' }}>
                                    <div style={{ width: '16px', height: '6px', borderRadius: '3px', background: '#ffffff' }}></div>
                                    <div style={{ width: '12px', height: '6px', borderRadius: '3px', background: '#ffffff' }}></div>
                                    <div style={{ width: '18px', height: '6px', borderRadius: '3px', background: '#ffffff' }}></div>
                                  </div>
                                </div>{' '}
                                <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                  <div style={{ width: '80%', height: '8px', borderRadius: '2px', background: '#1c1915' }}></div>
                                  <div style={{ width: '50%', height: '4px', background: g?.accent, marginBottom: '5px' }}></div>
                                  <div style={{ width: '50%', height: '4px', background: '#1c1915' }}></div>
                                  <div style={{ width: '100%', height: '3px', background: '#e4ded3' }}></div>
                                  <div style={{ width: '90%', height: '3px', background: '#e4ded3' }}></div>
                                  <div style={{ width: '94%', height: '3px', background: '#e4ded3', marginBottom: '4px' }}></div>
                                  <div style={{ width: '46%', height: '4px', background: '#1c1915' }}></div>
                                  <div style={{ width: '88%', height: '3px', background: '#e4ded3' }}></div>
                                </div>{' '}
                              </div>{' '}
                            </>
                          ) : null}{' '}
                          {g?.isSig ? (
                            <>
                              {' '}
                              <div
                                style={{
                                  padding: '14px 12px 8px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-end',
                                  borderBottom: '1px solid #ece7de',
                                }}
                              >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '64%' }}>
                                  <div style={{ width: '100%', height: '11px', borderRadius: '2px', background: '#1c1915' }}></div>
                                  <div style={{ width: '60%', height: '4px', background: g?.accent }}></div>
                                </div>
                                <div style={{ width: '24px', height: '30px', borderRadius: '3px', background: '#efe9df' }}></div>
                              </div>{' '}
                              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                {' '}
                                <div style={{ width: '40%', height: '5px', background: '#1c1915' }}></div>{' '}
                                <div style={{ display: 'grid', gridTemplateColumns: '24% 1fr', gap: '6px' }}>
                                  <div style={{ height: '3px', background: g?.accent }}></div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    <div style={{ height: '3px', background: '#e4ded3' }}></div>
                                    <div style={{ width: '90%', height: '3px', background: '#e4ded3' }}></div>
                                  </div>
                                </div>{' '}
                                <div style={{ display: 'grid', gridTemplateColumns: '24% 1fr', gap: '6px' }}>
                                  <div style={{ height: '3px', background: g?.accent }}></div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                    <div style={{ height: '3px', background: '#e4ded3' }}></div>
                                    <div style={{ width: '84%', height: '3px', background: '#e4ded3' }}></div>
                                  </div>
                                </div>{' '}
                              </div>{' '}
                            </>
                          ) : null}{' '}
                        </div>{' '}
                        <div
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', padding: '0 4px' }}
                        >
                          <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '15px' }}>
                            {g?.label}
                          </span>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: '700',
                              padding: '3px 8px',
                              borderRadius: '999px',
                              background: g?.atsBg,
                              color: g?.atsFg,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {g?.atsLabel}
                          </span>
                        </div>{' '}
                        <span style={{ padding: '0 4px', fontSize: '12px', color: 'var(--mu)', lineHeight: '1.4' }}>{g?.tag}</span>{' '}
                      </button>
                    </React.Fragment>
                  ))}{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>
        </>
      ) : null}
    </>
  );
}
