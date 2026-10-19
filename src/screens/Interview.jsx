import React from 'react';
import { ps } from '../lib/pseudo.js';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Interview({ v }) {
  return (
    <>
      {v.isInterview ? (
        <>
          {' '}
          <div
            data-screen-label="Entretien"
            style={{
              padding: '22px clamp(12px,3.5vw,24px) 48px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '1280px',
              width: '100%',
            }}
          >
            {' '}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '14px',
                padding: '18px 20px',
                borderRadius: '20px',
                background: 'var(--ink)',
                color: 'var(--inkfg)',
              }}
            >
              {' '}
              <div style={{ flex: '1', minWidth: 'min(100%,240px)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', opacity: '.55', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  {'Préparation pour'}
                </span>
                <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '20px', fontWeight: '700' }}>{v.iv?.target}</span>
                <span style={{ fontSize: '12.5px', opacity: '.7' }}>
                  {'À partir de '}
                  {v.versionName}
                  {' et de l’offre analysée'}
                </span>
              </div>{' '}
              <button
                onClick={v.ivGen}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '38px',
                  padding: '0 18px 0 8px',
                  border: '0',
                  borderRadius: '999px',
                  background: 'var(--ai)',
                  color: 'var(--aifg)',
                  font: 'inherit',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '3px 7px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,.22)',
                  }}
                >
                  {'IA'}
                </span>
                {v.iv?.btn}
              </button>{' '}
            </div>{' '}
            {v.iv?.idle ? (
              <>
                <div
                  style={{
                    minHeight: '280px',
                    border: '1.5px dashed var(--line2)',
                    borderRadius: '20px',
                    display: 'grid',
                    placeItems: 'center',
                    textAlign: 'center',
                    padding: '28px',
                    color: 'var(--mu)',
                  }}
                >
                  <span style={{ maxWidth: '420px', lineHeight: '1.55' }}>
                    <strong
                      style={{
                        display: 'block',
                        fontFamily: "'Bricolage Grotesque',sans-serif",
                        fontSize: '20px',
                        color: 'var(--tx)',
                        marginBottom: '6px',
                      }}
                    >
                      {'Questions, pitch et profil LinkedIn'}
                    </strong>
                    {
                      'L’IA croise votre CV et l’offre pour préparer les questions les plus probables, avec une trame STAR pour chaque réponse.'
                    }
                  </span>
                </div>
              </>
            ) : null}{' '}
            {v.iv?.ready ? (
              <>
                {' '}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))',
                    gap: '18px',
                    alignItems: 'start',
                  }}
                >
                  {' '}
                  <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '20px', overflow: 'hidden' }}>
                    {' '}
                    <div
                      style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}
                    >
                      <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '18px' }}>
                        {'Questions probables ('}
                        {v.iv?.count}
                        {')'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--fa)' }}>{'Situation · Tâche · Action · Résultat'}</span>
                    </div>{' '}
                    {(v.ivQs || []).map((q, i59) => (
                      <React.Fragment key={i59}>
                        {' '}
                        <div style={{ borderTop: '1px solid var(--line)' }}>
                          {' '}
                          <button
                            onClick={q?.toggle}
                            style={{
                              display: 'flex',
                              gap: '12px',
                              alignItems: 'flex-start',
                              width: '100%',
                              padding: '14px 18px',
                              border: '0',
                              background: q?.bg,
                              color: 'var(--tx)',
                              font: 'inherit',
                              textAlign: 'left',
                              cursor: 'pointer',
                            }}
                          >
                            {' '}
                            <span
                              style={{
                                flex: '0 0 auto',
                                fontSize: '10.5px',
                                fontWeight: '700',
                                padding: '3px 9px',
                                borderRadius: '999px',
                                background: q?.gBg,
                                color: 'var(--tx)',
                              }}
                            >
                              {q?.group}
                            </span>{' '}
                            <span style={{ flex: '1', fontWeight: '600', lineHeight: '1.45' }}>{q?.q}</span>{' '}
                            <span style={{ color: 'var(--fa)' }}>{q?.chev}</span>{' '}
                          </button>{' '}
                          {q?.open ? (
                            <>
                              {' '}
                              <div style={{ padding: '0 18px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {' '}
                                <span
                                  style={{
                                    fontSize: '12.5px',
                                    color: 'var(--mu)',
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    background: 'var(--sub)',
                                  }}
                                >
                                  {q?.hint}
                                </span>{' '}
                                {(q?.fields || []).map((x, i60) => (
                                  <React.Fragment key={i60}>
                                    {' '}
                                    <label style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: '10px', alignItems: 'start' }}>
                                      {' '}
                                      <span
                                        style={{
                                          width: '28px',
                                          height: '28px',
                                          borderRadius: '9px',
                                          background: 'var(--t2)',
                                          display: 'grid',
                                          placeItems: 'center',
                                          fontWeight: '800',
                                          fontSize: '12px',
                                        }}
                                      >
                                        {x?.k}
                                      </span>{' '}
                                      <textarea
                                        value={x?.v ?? ''}
                                        onChange={x?.on}
                                        rows="2"
                                        placeholder={x?.ph}
                                        style={{
                                          width: '100%',
                                          padding: '8px 12px',
                                          border: '1px solid var(--line2)',
                                          borderRadius: '10px',
                                          background: 'var(--panel)',
                                          color: 'var(--tx)',
                                          font: 'inherit',
                                          fontSize: '12.5px',
                                          lineHeight: '1.5',
                                          outline: 'none',
                                        }}
                                        className={ps('focus', 'border-color:var(--ai)')}
                                      />{' '}
                                    </label>{' '}
                                  </React.Fragment>
                                ))}{' '}
                              </div>{' '}
                            </>
                          ) : null}{' '}
                        </div>{' '}
                      </React.Fragment>
                    ))}{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {' '}
                    <div
                      style={{
                        background: 'var(--panel)',
                        border: '1px solid var(--line)',
                        borderRadius: '20px',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {' '}
                      <div
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}
                      >
                        <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '18px' }}>
                          {'Pitch de 30 secondes'}
                        </span>
                        <span style={{ fontSize: '12px', color: v.iv?.pitchColor, fontWeight: '600' }}>{v.iv?.pitchMeta}</span>
                      </div>{' '}
                      <textarea
                        value={v.iv?.pitch ?? ''}
                        onChange={v.onPitch}
                        rows="6"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: '1px solid var(--line2)',
                          borderRadius: '14px',
                          background: 'var(--panel)',
                          color: 'var(--tx)',
                          font: 'inherit',
                          fontSize: '13.5px',
                          lineHeight: '1.65',
                          outline: 'none',
                        }}
                        className={ps('focus', 'border-color:var(--ai)')}
                      />{' '}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: 'var(--mu)' }}>
                          {'Score humain '}
                          {v.iv?.pitchScore}
                          {'/50'}
                        </span>
                        <button
                          onClick={v.reviewPitch}
                          style={{
                            height: '30px',
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
                          {v.iv?.pitchFix}
                        </button>
                      </div>{' '}
                    </div>{' '}
                    <div
                      style={{
                        background: 'var(--panel)',
                        border: '1px solid var(--line)',
                        borderRadius: '20px',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      {' '}
                      <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '18px' }}>
                        {'Profil LinkedIn assorti'}
                      </span>{' '}
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Titre (220 caractères max)'}</span>
                        <input
                          value={v.iv?.headline ?? ''}
                          onChange={v.onHeadline}
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
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'À propos'}</span>
                        <textarea
                          value={v.iv?.about ?? ''}
                          onChange={v.onAbout}
                          rows="9"
                          style={{
                            width: '100%',
                            padding: '12px 14px',
                            border: '1px solid var(--line2)',
                            borderRadius: '14px',
                            background: 'var(--panel)',
                            color: 'var(--tx)',
                            font: 'inherit',
                            fontSize: '13px',
                            lineHeight: '1.6',
                            outline: 'none',
                          }}
                        />
                      </label>{' '}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: 'var(--mu)' }}>
                          {'Score humain '}
                          {v.iv?.liScore}
                          {'/50'}
                        </span>
                        <button
                          onClick={v.copyLinkedin}
                          style={{
                            height: '30px',
                            padding: '0 14px',
                            border: '0',
                            borderRadius: '999px',
                            background: 'var(--btn)',
                            color: 'var(--btnfg)',
                            font: 'inherit',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {'Copier'}
                        </button>
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </>
            ) : null}{' '}
          </div>{' '}
        </>
      ) : null}
    </>
  );
}
