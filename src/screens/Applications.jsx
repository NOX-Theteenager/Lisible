import React from 'react';
import SchoolApps from './apps/SchoolApps.jsx';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Applications({ v }) {
  return (
    <>
      {v.isApps ? (
        <>
          {' '}
          <div
            data-screen-label="Candidatures"
            style={{
              padding: '22px clamp(12px,3.5vw,24px) 48px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              width: '100%',
              maxWidth: '1400px',
            }}
          >
            {v.study ? <SchoolApps v={v} /> : null}
            {' '}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              {' '}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(v.appStats || []).map((x, i61) => (
                  <React.Fragment key={i61}>
                    <span
                      style={{
                        padding: '8px 14px',
                        borderRadius: '999px',
                        background: 'var(--panel)',
                        border: '1px solid var(--line)',
                        fontSize: '12.5px',
                      }}
                    >
                      <strong style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '15px' }}>{x?.n}</strong> {x?.label}
                    </span>
                  </React.Fragment>
                ))}
              </div>{' '}
              <button
                onClick={v.openNewApp}
                style={{
                  height: '36px',
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
                }}
              >
                {'+ Nouvelle candidature'}
              </button>{' '}
            </div>{' '}
            {v.newApp?.open ? (
              <>
                {' '}
                <div
                  style={{
                    background: 'var(--panel)',
                    border: '1px solid var(--line)',
                    borderRadius: '20px',
                    padding: '16px 18px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    alignItems: 'flex-end',
                  }}
                >
                  {' '}
                  <label style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Entreprise'}</span>
                    <input
                      value={v.newApp?.company ?? ''}
                      onChange={v.newApp?.onCompany}
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        border: '1px solid var(--line2)',
                        borderRadius: '10px',
                        background: 'var(--panel)',
                        color: 'var(--tx)',
                        font: 'inherit',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  </label>{' '}
                  <label style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Poste'}</span>
                    <input
                      value={v.newApp?.role ?? ''}
                      onChange={v.newApp?.onRole}
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        border: '1px solid var(--line2)',
                        borderRadius: '10px',
                        background: 'var(--panel)',
                        color: 'var(--tx)',
                        font: 'inherit',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  </label>{' '}
                  <label style={{ flex: '2 1 260px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Lien de l’offre (optionnel)'}</span>
                    <input
                      value={v.newApp?.url ?? ''}
                      onChange={v.newApp?.onUrl}
                      placeholder="https://…"
                      style={{
                        width: '100%',
                        height: '38px',
                        padding: '0 12px',
                        border: '1px solid var(--line2)',
                        borderRadius: '10px',
                        background: 'var(--panel)',
                        color: 'var(--tx)',
                        font: 'inherit',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  </label>{' '}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={v.newApp?.cancel}
                      style={{
                        height: '38px',
                        padding: '0 14px',
                        border: '1px solid var(--line2)',
                        borderRadius: '999px',
                        background: 'var(--panel)',
                        color: 'var(--tx)',
                        font: 'inherit',
                        fontSize: '12.5px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      {'Annuler'}
                    </button>
                    <button
                      onClick={v.newApp?.add}
                      style={{
                        height: '38px',
                        padding: '0 16px',
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
                      {'Ajouter'}
                    </button>
                  </div>{' '}
                </div>{' '}
              </>
            ) : null}{' '}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5,minmax(min(80vw,220px),1fr))',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '6px',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {' '}
              {(v.appCols || []).map((col, i62) => (
                <React.Fragment key={i62}>
                  {' '}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '18px',
                      background: 'var(--sub)',
                      minHeight: '200px',
                      scrollSnapAlign: 'start',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col?.dot }}></span>
                      <span style={{ fontWeight: '700', flex: '1' }}>{col?.label}</span>
                      <span style={{ fontSize: '12px', color: 'var(--fa)' }}>{col?.count}</span>
                    </div>{' '}
                    {(col?.cards || []).map((c, i63) => (
                      <React.Fragment key={i63}>
                        {' '}
                        <div
                          style={{
                            background: 'var(--panel)',
                            border: '1px solid var(--line)',
                            borderRadius: '14px',
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                          }}
                        >
                          {' '}
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                              <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '15px' }}>
                                {c?.company}
                              </span>
                              <span style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.35' }}>{c?.role}</span>
                            </div>
                            <span
                              style={{
                                flex: '0 0 auto',
                                fontSize: '11.5px',
                                fontWeight: '700',
                                padding: '3px 8px',
                                borderRadius: '999px',
                                background: c?.mBg,
                                color: c?.mFg,
                              }}
                            >
                              {c?.match}
                              {' %'}
                            </span>
                          </div>{' '}
                          <span style={{ fontSize: '11.5px', color: 'var(--fa)' }}>{c?.meta}</span>{' '}
                          {c?.due ? (
                            <>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '6px',
                                  padding: '9px 10px',
                                  borderRadius: '10px',
                                  background: 'var(--acs)',
                                }}
                              >
                                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--act)' }}>{c?.dueLabel}</span>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                  <button
                                    onClick={c?.copyRelance}
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
                                    {'Copier l’e-mail de relance'}
                                  </button>
                                  <button
                                    onClick={c?.markRelanced}
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
                                    {'C’est fait'}
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : null}{' '}
                          {c?.notDue ? (
                            <>
                              <span style={{ fontSize: '12px', padding: '6px 9px', borderRadius: '8px', background: 'var(--sub)' }}>
                                {c?.next}
                              </span>
                            </>
                          ) : null}{' '}
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {' '}
                            <select
                              value={c?.status ?? ''}
                              onChange={c?.onStatus}
                              style={{
                                flex: '1',
                                minWidth: '0',
                                height: '30px',
                                padding: '0 8px',
                                border: '1px solid var(--line2)',
                                borderRadius: '999px',
                                background: 'var(--panel)',
                                color: 'var(--tx)',
                                fontFamily: "'Instrument Sans',system-ui,sans-serif",
                                fontSize: '12px',
                              }}
                            >
                              <option value={'todo'}>{'À envoyer'}</option>
                              <option value={'sent'}>{'Envoyée'}</option>
                              <option value={'interview'}>{'Entretien'}</option>
                              <option value={'offer'}>{'Offre'}</option>
                              <option value={'rejected'}>{'Refusée'}</option>
                            </select>{' '}
                            <button
                              onClick={c?.del}
                              title="Supprimer"
                              style={{
                                width: '30px',
                                height: '30px',
                                border: '1px solid var(--line)',
                                borderRadius: '50%',
                                background: 'var(--panel)',
                                color: 'var(--mu)',
                                cursor: 'pointer',
                              }}
                            >
                              {'×'}
                            </button>{' '}
                          </div>{' '}
                        </div>{' '}
                      </React.Fragment>
                    ))}{' '}
                  </div>{' '}
                </React.Fragment>
              ))}{' '}
            </div>{' '}
            <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '20px', overflow: 'hidden' }}>
              {' '}
              <div
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '18px' }}>
                  {'Correspondance de « '}
                  {v.versionName}
                  {' » avec chaque offre'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--fa)' }}>{'Mots-clés pondérés de chaque annonce'}</span>
              </div>{' '}
              {(v.appMatch || []).map((m, i64) => (
                <React.Fragment key={i64}>
                  {' '}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 18px',
                      borderTop: '1px solid var(--line)',
                    }}
                  >
                    {' '}
                    <div style={{ flex: '1 1 200px', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: '700' }}>{m?.company}</span>
                      <span style={{ fontSize: '12px', color: 'var(--mu)' }}>{m?.role}</span>
                    </div>{' '}
                    <div style={{ flex: '2 1 220px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ flex: '1', height: '8px', borderRadius: '4px', background: 'var(--sub)', overflow: 'hidden' }}>
                        <span
                          style={{
                            display: 'block',
                            height: '100%',
                            width: `${m?.match ?? ''}%`,
                            background: m?.color,
                            borderRadius: '4px',
                          }}
                        ></span>
                      </span>
                      <span style={{ width: '42px', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700' }}>
                        {m?.match}
                        {' %'}
                      </span>
                    </div>{' '}
                    <span style={{ flex: '1 1 200px', fontSize: '12px', color: 'var(--mu)' }}>
                      {'Manque : '}
                      {m?.missing}
                    </span>{' '}
                    <button
                      onClick={m?.adapt}
                      style={{
                        height: '32px',
                        padding: '0 14px',
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
                      {'Créer une version ciblée'}
                    </button>{' '}
                  </div>{' '}
                </React.Fragment>
              ))}{' '}
            </div>{' '}
          </div>{' '}
        </>
      ) : null}
    </>
  );
}
