import React from 'react';
import { ps } from '../../lib/pseudo.js';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Preview({ v }) {
  return (
    <section style={{ flex: '1.4 1 500px', minWidth: '0', display: v.ed?.pv, flexDirection: 'column', alignSelf: 'stretch' }}>
      {' '}
      <div
        ref={v.pvScrollRef}
        style={{
          position: v.lay?.pvPos,
          top: '78px',
          maxHeight: v.lay?.pvMax,
          overflow: v.lay?.pvOv,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          borderRadius: '12px',
          scrollbarWidth: 'thin',
        }}
      >
        {' '}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          {' '}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {' '}
            <button
              onClick={v.openGallery}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: '34px',
                padding: '0 14px 0 6px',
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
              className={ps('hover', 'border-color:var(--tx)')}
            >
              {' '}
              <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: v.tpl?.accent }}></span>
              {'Modèle : '}
              {v.tpl?.label}
              <span style={{ color: 'var(--fa)' }}>{'▾'}</span>{' '}
            </button>{' '}
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '4px 9px',
                borderRadius: '999px',
                background: v.tpl?.atsBg,
                color: v.tpl?.atsFg,
              }}
            >
              {v.tpl?.atsLabel}
            </span>{' '}
            {v.tpl?.colorable ? (
              <>
                {' '}
                <div style={{ display: 'flex', gap: '4px', padding: '3px', borderRadius: '999px', border: '1px solid var(--line)' }}>
                  {' '}
                  {(v.swatches || []).map((w, i23) => (
                    <React.Fragment key={i23}>
                      <button
                        onClick={w?.go}
                        title={w?.name}
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: `2px solid ${w?.ring ?? ''}`,
                          background: w?.hex,
                          cursor: 'pointer',
                          padding: '0',
                        }}
                      ></button>
                    </React.Fragment>
                  ))}{' '}
                </div>{' '}
              </>
            ) : null}{' '}
          </div>{' '}
          <div
            style={{ display: 'flex', padding: '3px', border: '1px solid var(--line2)', borderRadius: '999px', background: 'var(--panel)' }}
          >
            {' '}
            {(v.pvModes || []).map((m, i24) => (
              <React.Fragment key={i24}>
                {' '}
                <button
                  onClick={m?.go}
                  style={{
                    height: '28px',
                    padding: '0 12px',
                    border: '0',
                    borderRadius: '999px',
                    background: m?.bg,
                    color: m?.fg,
                    font: 'inherit',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {m?.label}
                </button>{' '}
              </React.Fragment>
            ))}{' '}
          </div>{' '}
        </div>{' '}
        {v.tpl?.isDesign ? (
          <>
            <span style={{ fontSize: '12px', color: 'var(--mu)' }}>
              {v.tpl?.atsNote}
              {' — le DOCX et le TXT seront générés en version ATS stricte.'}
            </span>
          </>
        ) : null}{' '}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '6px', alignItems: 'center' }}>
          <span
            style={{
              marginRight: 'auto',
              fontSize: '12px',
              fontWeight: '700',
              padding: '5px 11px',
              borderRadius: '999px',
              background: v.pages?.bg,
              color: v.pages?.fg,
            }}
          >
            {v.pages?.label}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: v.live?.fg }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: v.live?.dot,
                boxShadow: `0 0 0 ${v.live?.ring ?? ''} ${v.live?.halo ?? ''}`,
                transition: 'box-shadow .4s ease, background .4s',
              }}
            ></span>
            {v.live?.label}
          </span>{' '}
          <span style={{ fontSize: '12px', color: 'var(--mu)' }}>{'Police'}</span>
          <select
            value={v.fontSel ?? ''}
            onChange={v.onFont}
            style={{
              height: '30px',
              maxWidth: '170px',
              padding: '0 10px',
              border: '1px solid var(--line2)',
              borderRadius: '999px',
              background: 'var(--panel)',
              color: 'var(--tx)',
              fontFamily: "'Instrument Sans',system-ui,sans-serif",
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            {(v.fontOpts || []).map((o, i25) => (
              <React.Fragment key={i25}>
                <option value={o?.v ?? ''}>{o?.l}</option>
              </React.Fragment>
            ))}
          </select>{' '}
          <span style={{ fontSize: '12px', color: 'var(--mu)' }}>{'Taille'}</span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--line2)',
              borderRadius: '999px',
              background: 'var(--panel)',
            }}
          >
            <button
              onClick={v.sizeDown}
              aria-label="−"
              style={{
                width: '30px',
                height: '30px',
                border: '0',
                background: 'transparent',
                color: 'var(--tx)',
                cursor: 'pointer',
                fontSize: '15px',
                opacity: v.size?.downOp,
              }}
            >
              {'−'}
            </button>
            <span style={{ minWidth: '48px', textAlign: 'center', fontSize: '12px', fontWeight: '700' }}>{v.size?.label}</span>
            <button
              onClick={v.sizeUp}
              aria-label="+"
              style={{
                width: '30px',
                height: '30px',
                border: '0',
                background: 'transparent',
                color: 'var(--tx)',
                cursor: 'pointer',
                fontSize: '15px',
                opacity: v.size?.upOp,
              }}
            >
              {'+'}
            </button>
          </div>{' '}
          <span style={{ fontSize: '12px', color: 'var(--mu)' }}>{'Densité'}</span>
          <div
            style={{ display: 'flex', padding: '3px', border: '1px solid var(--line2)', borderRadius: '999px', background: 'var(--panel)' }}
          >
            {(v.densTabs || []).map((d, i26) => (
              <React.Fragment key={i26}>
                <button
                  onClick={d?.go}
                  style={{
                    height: '26px',
                    padding: '0 11px',
                    border: '0',
                    borderRadius: '999px',
                    background: d?.bg,
                    color: d?.fg,
                    font: 'inherit',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {d?.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>{' '}
        <div style={{ borderRadius: '10px', display: 'grid', gridTemplateColumns: v.pvGrid, gap: '12px', alignItems: 'start' }}>
          {' '}
          {v.pvVisual ? (
            <>
              {' '}
              <div ref={v.pvBoxRef} data-no-i18n="1" style={{ minWidth: '0', overflow: 'hidden' }}>
                <div
                  ref={v.paperRef}
                  style={{
                    position: 'relative',
                    width: '760px',
                    zoom: v.pvZoom,
                    background: '#ffffff',
                    color: '#1a1a1a',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                    boxShadow: '0 18px 40px -28px rgba(28,25,21,.5)',
                    fontFamily: v.tpl?.font,
                    fontSize: v.dens?.fs,
                    lineHeight: v.dens?.lh,
                    minHeight: '1075px',
                    overflow: 'hidden',
                  }}
                >
                  {' '}
                  {(v.pageBreaks || []).map((pb, i27) => (
                    <React.Fragment key={i27}>
                      <div
                        style={{
                          position: 'absolute',
                          left: '0',
                          right: '0',
                          top: `${pb?.top ?? ''}px`,
                          borderTop: `2px dashed ${pb?.color ?? ''}`,
                          zIndex: '3',
                          pointerEvents: 'none',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '-12px',
                            fontFamily: "'Instrument Sans',sans-serif",
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 9px',
                            borderRadius: '999px',
                            background: pb?.color,
                            color: '#ffffff',
                          }}
                        >
                          {pb?.label}
                        </span>
                      </div>
                    </React.Fragment>
                  ))}{' '}
                  {v.tpl?.isText ? (
                    <>
                      {' '}
                      <div style={{ padding: '44px 50px 4px', textAlign: v.tpl?.align }}>
                        {' '}
                        <div style={{ fontSize: v.tpl?.nameSize, fontWeight: '700', lineHeight: '1.1', color: '#111111' }}>
                          {v.pv?.name}
                        </div>{' '}
                        <div style={{ fontSize: '14px', marginTop: '4px', color: v.tpl?.titleColor, fontWeight: '600' }}>{v.pv?.title}</div>{' '}
                        <div style={{ fontSize: '11.5px', marginTop: '7px', color: '#444444' }}>{v.pv?.contactLine}</div>{' '}
                      </div>{' '}
                    </>
                  ) : null}{' '}
                  {v.tpl?.isBand ? (
                    <>
                      {' '}
                      <div
                        style={{
                          background: v.tpl?.accent,
                          color: '#ffffff',
                          padding: '30px 40px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '22px',
                        }}
                      >
                        {' '}
                        <div
                          style={{
                            width: '92px',
                            height: '92px',
                            flex: '0 0 92px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '3px solid rgba(255,255,255,.4)',
                            background: 'rgba(255,255,255,.15)',
                          }}
                        >
                          {' '}
                          {v.pv?.hasPhoto ? (
                            <>
                              <div
                                role="img"
                                aria-label="Photo"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  backgroundPosition: 'center',
                                  backgroundSize: 'cover',
                                  backgroundRepeat: 'no-repeat',
                                  backgroundImage: v.pv?.photoBg,
                                }}
                              ></div>
                            </>
                          ) : null}{' '}
                          {v.pv?.noPhoto ? (
                            <>
                              <label
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'grid',
                                  placeItems: 'center',
                                  textAlign: 'center',
                                  border: '1.5px dashed rgba(0,0,0,.22)',
                                  borderRadius: '50%',
                                  background: 'rgba(255,255,255,.55)',
                                  color: '#6b6459',
                                  fontFamily: "'Instrument Sans',sans-serif",
                                  fontSize: '10.5px',
                                  fontWeight: '600',
                                  lineHeight: '1.25',
                                  cursor: 'pointer',
                                  boxSizing: 'border-box',
                                  padding: '4px',
                                }}
                              >
                                <input type="file" accept="image/*" onChange={v.onPhoto} style={{ display: 'none' }} />
                                {v.pv?.photoLabel}
                              </label>
                            </>
                          ) : null}{' '}
                        </div>{' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0' }}>
                          {' '}
                          <div style={{ fontSize: '27px', fontWeight: '700', lineHeight: '1.1', letterSpacing: '-0.01em' }}>
                            {v.pv?.name}
                          </div>{' '}
                          <div style={{ fontSize: '14px', opacity: '.92' }}>{v.pv?.title}</div>{' '}
                          <div style={{ fontSize: '11.5px', opacity: '.85', marginTop: '4px' }}>{v.pv?.contactLine}</div>{' '}
                        </div>{' '}
                      </div>{' '}
                    </>
                  ) : null}{' '}
                  {v.tpl?.isSig ? (
                    <>
                      {' '}
                      <div
                        style={{
                          padding: '42px 46px 20px',
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                          gap: '22px',
                          borderBottom: '1px solid #e3ded5',
                        }}
                      >
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
                          {' '}
                          <div style={{ fontSize: '36px', lineHeight: '1.02', letterSpacing: '-0.015em', color: '#111111' }}>
                            {v.pv?.name}
                          </div>{' '}
                          <div style={{ fontStyle: 'italic', fontSize: '15px', color: v.tpl?.accent }}>{v.pv?.title}</div>{' '}
                          <div style={{ fontSize: '11.5px', color: '#4a4a4a', fontFamily: 'Helvetica, Arial, sans-serif' }}>
                            {v.pv?.contactLine}
                          </div>{' '}
                        </div>{' '}
                        <div
                          style={{
                            width: '86px',
                            height: '106px',
                            flex: '0 0 86px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            background: '#f2eee7',
                          }}
                        >
                          {' '}
                          {v.pv?.hasPhoto ? (
                            <>
                              <div
                                role="img"
                                aria-label="Photo"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  backgroundPosition: 'center',
                                  backgroundSize: 'cover',
                                  backgroundRepeat: 'no-repeat',
                                  backgroundImage: v.pv?.photoBg,
                                }}
                              ></div>
                            </>
                          ) : null}{' '}
                          {v.pv?.noPhoto ? (
                            <>
                              <label
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'grid',
                                  placeItems: 'center',
                                  textAlign: 'center',
                                  border: '1.5px dashed rgba(0,0,0,.22)',
                                  borderRadius: '6px',
                                  background: 'rgba(255,255,255,.55)',
                                  color: '#6b6459',
                                  fontFamily: "'Instrument Sans',sans-serif",
                                  fontSize: '10.5px',
                                  fontWeight: '600',
                                  lineHeight: '1.25',
                                  cursor: 'pointer',
                                  boxSizing: 'border-box',
                                  padding: '4px',
                                }}
                              >
                                <input type="file" accept="image/*" onChange={v.onPhoto} style={{ display: 'none' }} />
                                {v.pv?.photoLabel}
                              </label>
                            </>
                          ) : null}{' '}
                        </div>{' '}
                      </div>{' '}
                    </>
                  ) : null}{' '}
                  <div style={{ display: 'grid', gridTemplateColumns: v.tpl?.cols, minHeight: '900px' }}>
                    {' '}
                    {v.tpl?.twoCol ? (
                      <>
                        {' '}
                        <div
                          style={{ background: v.tpl?.tint, padding: '34px 22px', display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                          {' '}
                          <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div
                              style={{
                                width: '112px',
                                height: '112px',
                                flex: '0 0 112px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                background: '#ffffff',
                                border: '4px solid #ffffff',
                              }}
                            >
                              {' '}
                              {v.pv?.hasPhoto ? (
                                <>
                                  <div
                                    role="img"
                                    aria-label="Photo"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      backgroundPosition: 'center',
                                      backgroundSize: 'cover',
                                      backgroundRepeat: 'no-repeat',
                                      backgroundImage: v.pv?.photoBg,
                                    }}
                                  ></div>
                                </>
                              ) : null}{' '}
                              {v.pv?.noPhoto ? (
                                <>
                                  <label
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      display: 'grid',
                                      placeItems: 'center',
                                      textAlign: 'center',
                                      border: '1.5px dashed rgba(0,0,0,.22)',
                                      borderRadius: '50%',
                                      background: 'rgba(255,255,255,.55)',
                                      color: '#6b6459',
                                      fontFamily: "'Instrument Sans',sans-serif",
                                      fontSize: '10.5px',
                                      fontWeight: '600',
                                      lineHeight: '1.25',
                                      cursor: 'pointer',
                                      boxSizing: 'border-box',
                                      padding: '4px',
                                    }}
                                  >
                                    <input type="file" accept="image/*" onChange={v.onPhoto} style={{ display: 'none' }} />
                                    {v.pv?.photoLabel}
                                  </label>
                                </>
                              ) : null}{' '}
                            </div>
                          </div>{' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {' '}
                            <div
                              style={{
                                fontSize: '11.5px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '.08em',
                                color: v.tpl?.accent,
                              }}
                            >
                              {'Coordonnées'}
                            </div>{' '}
                            {(v.pv?.contactItems || []).map((ci, i28) => (
                              <React.Fragment key={i28}>
                                <div style={{ fontSize: '11.5px', wordBreak: 'break-word' }}>{ci?.text}</div>
                              </React.Fragment>
                            ))}{' '}
                          </div>{' '}
                          {v.pv?.hasSkills ? (
                            <>
                              {' '}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                {' '}
                                <div
                                  style={{
                                    fontSize: '11.5px',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '.08em',
                                    color: v.tpl?.accent,
                                  }}
                                >
                                  {'Compétences'}
                                </div>{' '}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  {(v.pv?.skillItems || []).map((sk, i29) => (
                                    <React.Fragment key={i29}>
                                      <span
                                        style={{
                                          fontSize: '11px',
                                          padding: '2px 8px',
                                          borderRadius: '999px',
                                          background: '#ffffff',
                                          border: '1px solid rgba(0,0,0,.08)',
                                        }}
                                      >
                                        {sk?.text}
                                      </span>
                                    </React.Fragment>
                                  ))}
                                </div>{' '}
                              </div>{' '}
                            </>
                          ) : null}{' '}
                          {v.pv?.hasLangs ? (
                            <>
                              {' '}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {' '}
                                <div
                                  style={{
                                    fontSize: '11.5px',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '.08em',
                                    color: v.tpl?.accent,
                                  }}
                                >
                                  {'Langues'}
                                </div>{' '}
                                {(v.pv?.langItems || []).map((li, i30) => (
                                  <React.Fragment key={i30}>
                                    <div style={{ fontSize: '11.5px' }}>
                                      <strong>{li?.name}</strong>
                                      {' — '}
                                      {li?.level}
                                    </div>
                                  </React.Fragment>
                                ))}{' '}
                              </div>{' '}
                            </>
                          ) : null}{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    <div style={{ padding: v.tpl?.bodyPad, minWidth: '0' }}>
                      {' '}
                      {v.tpl?.twoCol ? (
                        <>
                          {' '}
                          <div style={{ marginBottom: '10px' }}>
                            {' '}
                            <div
                              style={{
                                fontSize: '29px',
                                fontWeight: '700',
                                lineHeight: '1.08',
                                color: '#111111',
                                letterSpacing: '-0.01em',
                              }}
                            >
                              {v.pv?.name}
                            </div>{' '}
                            <div style={{ fontSize: '14.5px', marginTop: '4px', color: v.tpl?.accent, fontWeight: '600' }}>
                              {v.pv?.title}
                            </div>{' '}
                          </div>{' '}
                        </>
                      ) : null}{' '}
                      {(v.pvSections || []).map((ps, i31) => (
                        <React.Fragment key={i31}>
                          {' '}
                          <div
                            data-sec={ps?.key}
                            style={{
                              marginTop: '16px',
                              borderRadius: '4px',
                              background: ps?.hl,
                              boxShadow: `0 0 0 8px ${ps?.hl ?? ''}`,
                              transition: 'background .35s ease, box-shadow .35s ease',
                            }}
                          >
                            {' '}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: v.tpl?.headSize,
                                fontWeight: '700',
                                color: v.tpl?.headColor,
                                textTransform: v.tpl?.headCase,
                                letterSpacing: v.tpl?.headTrack,
                                fontVariant: v.tpl?.headVariant,
                                borderBottom: v.tpl?.headRule,
                                paddingBottom: '4px',
                                marginBottom: '8px',
                              }}
                            >
                              {v.tpl?.marker ? (
                                <>
                                  <span
                                    style={{ width: '9px', height: '9px', borderRadius: '2px', background: v.tpl?.accent, flex: '0 0 9px' }}
                                  ></span>
                                </>
                              ) : null}
                              {ps?.label}
                            </div>{' '}
                            {ps?.isSummary ? (
                              <>
                                <p style={{ margin: '0' }}>{v.pv?.summary}</p>
                              </>
                            ) : null}{' '}
                            {ps?.isExperience ? (
                              <>
                                {' '}
                                {(v.pv?.exps || []).map((x, i32) => (
                                  <React.Fragment key={i32}>
                                    {' '}
                                    {v.tpl?.dateLeft ? (
                                      <>
                                        {' '}
                                        <div
                                          style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: '14px', marginBottom: '11px' }}
                                        >
                                          {' '}
                                          <div
                                            style={{
                                              fontSize: '11px',
                                              color: v.tpl?.accent,
                                              fontFamily: 'Helvetica, Arial, sans-serif',
                                              paddingTop: '2px',
                                              borderRight: '1px solid #e3ded5',
                                              paddingRight: '10px',
                                            }}
                                          >
                                            {x?.dates}
                                          </div>{' '}
                                          <div>
                                            <div style={{ fontWeight: '700' }}>{x?.role}</div>
                                            <div style={{ fontStyle: 'italic', color: '#444444' }}>{x?.sub}</div>{' '}
                                            <ul style={{ margin: '3px 0 0', paddingLeft: '16px' }}>
                                              {(x?.bullets || []).map((t, i33) => (
                                                <React.Fragment key={i33}>
                                                  <li style={{ marginBottom: '1px' }}>{t?.text}</li>
                                                </React.Fragment>
                                              ))}
                                            </ul>
                                          </div>{' '}
                                        </div>{' '}
                                      </>
                                    ) : null}{' '}
                                    {v.tpl?.dateTop ? (
                                      <>
                                        {' '}
                                        <div style={{ marginBottom: '10px' }}>
                                          {' '}
                                          <div style={{ fontWeight: '700' }}>{x?.head}</div>{' '}
                                          <div style={{ color: '#444444' }}>{x?.meta}</div>{' '}
                                          <ul style={{ margin: '3px 0 0', paddingLeft: '18px' }}>
                                            {(x?.bullets || []).map((t, i34) => (
                                              <React.Fragment key={i34}>
                                                <li style={{ marginBottom: '1px' }}>{t?.text}</li>
                                              </React.Fragment>
                                            ))}
                                          </ul>{' '}
                                        </div>{' '}
                                      </>
                                    ) : null}{' '}
                                  </React.Fragment>
                                ))}{' '}
                              </>
                            ) : null}{' '}
                            {ps?.isEducation ? (
                              <>
                                {' '}
                                {(v.pv?.edus || []).map((x, i35) => (
                                  <React.Fragment key={i35}>
                                    {' '}
                                    <div style={{ marginBottom: '8px' }}>
                                      <div style={{ fontWeight: '700' }}>{x?.head}</div>
                                      <div style={{ color: '#444444' }}>{x?.meta}</div>
                                      {x?.hasDetails ? (
                                        <>
                                          <div>{x?.details}</div>
                                        </>
                                      ) : null}
                                    </div>{' '}
                                  </React.Fragment>
                                ))}{' '}
                              </>
                            ) : null}{' '}
                            {ps?.isSkills ? (
                              <>
                                <p style={{ margin: '0' }}>{v.pv?.skills}</p>
                              </>
                            ) : null}{' '}
                            {ps?.isLanguages ? (
                              <>
                                <p style={{ margin: '0' }}>{v.pv?.langs}</p>
                              </>
                            ) : null}{' '}
                            {ps?.isProjects ? (
                              <>
                                {(v.pv?.projs || []).map((x, i36) => (
                                  <React.Fragment key={i36}>
                                    <p style={{ margin: '0 0 4px' }}>
                                      <strong>{x?.name}</strong>
                                      {' — '}
                                      {x?.desc} {x?.link}
                                    </p>
                                  </React.Fragment>
                                ))}
                              </>
                            ) : null}{' '}
                            {ps?.isCertifications ? (
                              <>
                                {(v.pv?.certs || []).map((x, i37) => (
                                  <React.Fragment key={i37}>
                                    <p style={{ margin: '0 0 3px' }}>{x?.line}</p>
                                  </React.Fragment>
                                ))}
                              </>
                            ) : null}{' '}
                          </div>{' '}
                        </React.Fragment>
                      ))}{' '}
                    </div>{' '}
                  </div>{' '}
                </div>
              </div>{' '}
            </>
          ) : null}{' '}
          {v.pvText ? (
            <>
              {' '}
              <div
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {' '}
                <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>
                  {
                    "Ce qu'un ATS extrait de votre CV (version stricte). Si l'ordre ou un libellé paraît étrange ici, il le sera aussi pour le recruteur."
                  }
                </span>{' '}
                <pre
                  data-no-i18n="1"
                  style={{
                    margin: '0',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: '11.5px',
                    lineHeight: '1.6',
                    color: 'var(--tx)',
                  }}
                >
                  {v.plainText}
                </pre>{' '}
              </div>{' '}
            </>
          ) : null}{' '}
        </div>{' '}
      </div>{' '}
    </section>
  );
}
