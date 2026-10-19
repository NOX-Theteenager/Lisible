import React from 'react';
import { ps } from '../lib/pseudo.js';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Letter({ v }) {
  return (
    <>
      {v.isLetter ? (
        <>
          {' '}
          <div
            data-screen-label="Lettre de motivation"
            style={{
              padding: '22px clamp(12px,3.5vw,24px) 48px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '18px',
              alignItems: 'flex-start',
              maxWidth: '1260px',
              width: '100%',
            }}
          >
            {' '}
            <div style={{ flex: '0 1 380px', minWidth: 'min(100%,300px)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {' '}
              <div
                style={{
                  display: 'flex',
                  padding: '4px',
                  borderRadius: '999px',
                  background: 'var(--panel)',
                  border: '1px solid var(--line)',
                  gap: '2px',
                }}
              >
                {' '}
                {(v.letModes || []).map((m, i52) => (
                  <React.Fragment key={i52}>
                    <button
                      onClick={m?.go}
                      style={{
                        flex: '1',
                        height: '34px',
                        padding: '0 12px',
                        border: '0',
                        borderRadius: '999px',
                        background: m?.bg,
                        color: m?.fg,
                        font: 'inherit',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {m?.label}
                    </button>
                  </React.Fragment>
                ))}{' '}
              </div>{' '}
              {v.letter?.isImprove ? (
                <>
                  {' '}
                  <div
                    style={{
                      background: 'var(--panel)',
                      border: '1px solid var(--line)',
                      borderRadius: '20px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '18px' }}>
                        {'Votre lettre actuelle'}
                      </span>
                      <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>
                        {'Importez-la ou collez-la : l’IA la diagnostique et propose une version améliorée.'}
                      </span>
                    </div>{' '}
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        border: '1.5px dashed var(--line2)',
                        borderRadius: '14px',
                        background: 'var(--sub)',
                        cursor: 'pointer',
                      }}
                    >
                      {' '}
                      <input
                        type="file"
                        accept=".txt,.docx,.pdf,.png,.jpg,.jpeg"
                        onChange={v.onOldLetter}
                        style={{ display: 'none' }}
                      />{' '}
                      <span
                        style={{
                          width: '40px',
                          height: '40px',
                          flex: '0 0 40px',
                          borderRadius: '11px',
                          background: 'var(--panel)',
                          border: '1px solid var(--line)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '16px',
                          color: 'var(--mu)',
                        }}
                      >
                        {'↑'}
                      </span>{' '}
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                        <span style={{ fontWeight: '600' }}>{v.letter?.oldLabel}</span>
                        <span style={{ fontSize: '11.5px', color: 'var(--mu)' }}>{'DOCX, PDF, TXT ou photo'}</span>
                      </span>{' '}
                    </label>{' '}
                    <textarea
                      value={v.letter?.old ?? ''}
                      onChange={v.onOldText}
                      rows="9"
                      placeholder="…ou collez le texte de votre lettre ici"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid var(--line2)',
                        borderRadius: '14px',
                        background: 'var(--panel)',
                        color: 'var(--tx)',
                        font: 'inherit',
                        fontSize: '12.5px',
                        lineHeight: '1.55',
                        outline: 'none',
                      }}
                      className={ps('focus', 'border-color:var(--ai);box-shadow:0 0 0 4px var(--ais)')}
                    />{' '}
                  </div>{' '}
                </>
              ) : null}{' '}
              <div
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '18px' }}>
                    {'Offre visée'}
                  </span>
                  <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>
                    {'La lettre s’appuie sur l’annonce : texte déjà analysé, lien ou image.'}
                  </span>
                </div>{' '}
                <div
                  style={{
                    display: 'flex',
                    padding: '4px',
                    borderRadius: '999px',
                    background: 'var(--sub)',
                    gap: '2px',
                    alignSelf: 'flex-start',
                    flexWrap: 'wrap',
                  }}
                >
                  {' '}
                  {(v.letSrc?.tabs || []).map((t, i53) => (
                    <React.Fragment key={i53}>
                      <button
                        onClick={t?.go}
                        style={{
                          height: '30px',
                          padding: '0 14px',
                          border: '0',
                          borderRadius: '999px',
                          background: t?.bg,
                          color: t?.fg,
                          boxShadow: t?.sh,
                          font: 'inherit',
                          fontSize: '12.5px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t?.label}
                      </button>
                    </React.Fragment>
                  ))}{' '}
                </div>{' '}
                {v.letSrc?.isLink ? (
                  <>
                    {' '}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {' '}
                      <input
                        value={v.letSrc?.url ?? ''}
                        onChange={v.letH?.onUrl}
                        placeholder="https://www.welcometothejungle.com/fr/companies/…"
                        style={{
                          flex: '1 1 260px',
                          minWidth: '0',
                          height: '40px',
                          padding: '0 14px',
                          border: '1px solid var(--line2)',
                          borderRadius: '999px',
                          background: 'var(--panel)',
                          color: 'var(--tx)',
                          font: 'inherit',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                        className={ps('focus', 'border-color:var(--ai);box-shadow:0 0 0 4px var(--ais)')}
                      />{' '}
                      <button
                        onClick={v.letH?.runLink}
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
                          flexShrink: '0',
                          transition: 'transform .15s',
                        }}
                        className={ps('hover', 'transform:translateY(-1px)')}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: '800',
                            padding: '3px 7px',
                            borderRadius: '999px',
                            background: 'rgba(255,255,255,.22)',
                            letterSpacing: '.05em',
                          }}
                        >
                          {'IA'}
                        </span>
                        {'Analyser la page'}
                      </button>{' '}
                    </div>{' '}
                    <span style={{ fontSize: '12px', color: 'var(--mu)' }}>
                      {'LinkedIn, Welcome to the Jungle, Indeed, France Travail, APEC ou site carrière d’entreprise.'}
                    </span>{' '}
                  </>
                ) : null}{' '}
                {v.letSrc?.isImage ? (
                  <>
                    {' '}
                    <label
                      onDragOver={v.letH?.over}
                      onDrop={v.letH?.dropImg}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px',
                        border: '1.5px dashed var(--line2)',
                        borderRadius: '16px',
                        background: 'var(--sub)',
                        cursor: 'pointer',
                      }}
                    >
                      {' '}
                      <input type="file" accept="image/*" onChange={v.letH?.onImg} style={{ display: 'none' }} />{' '}
                      <div
                        style={{
                          width: '72px',
                          height: '72px',
                          flex: '0 0 72px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          background: 'var(--panel)',
                          border: '1px solid var(--line)',
                          display: 'grid',
                          placeItems: 'center',
                          color: 'var(--fa)',
                          fontSize: '11px',
                        }}
                      >
                        {' '}
                        {v.letSrc?.hasImg ? (
                          <>
                            <div
                              role="img"
                              aria-label="Capture de l'offre"
                              style={{
                                width: '100%',
                                height: '100%',
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                backgroundImage: v.letSrc?.imgBg,
                              }}
                            ></div>
                          </>
                        ) : null}{' '}
                        {v.letSrc?.noImg ? (
                          <>
                            <span>{'PNG / JPG'}</span>
                          </>
                        ) : null}{' '}
                      </div>{' '}
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontWeight: '600' }}>{'Déposez une capture d’écran ou une photo de l’annonce'}</span>
                        <span style={{ fontSize: '12px', color: 'var(--mu)' }}>
                          {'L’IA lit l’image (vision + OCR), même une affiche ou une photo prise au téléphone.'}
                        </span>
                      </span>{' '}
                    </label>{' '}
                  </>
                ) : null}{' '}
                {v.letSrc?.isPdf ? (
                  <>
                    {' '}
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '16px',
                        border: '1.5px dashed var(--line2)',
                        borderRadius: '16px',
                        background: 'var(--sub)',
                        cursor: 'pointer',
                      }}
                    >
                      {' '}
                      <input type="file" accept=".pdf,.docx" onChange={v.letH?.onPdf} style={{ display: 'none' }} />{' '}
                      <span
                        style={{
                          width: '44px',
                          height: '44px',
                          flex: '0 0 44px',
                          borderRadius: '12px',
                          background: 'var(--panel)',
                          border: '1px solid var(--line)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '10.5px',
                          fontWeight: '700',
                          color: 'var(--mu)',
                        }}
                      >
                        {'PDF'}
                      </span>{' '}
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontWeight: '600' }}>{'Choisir le PDF ou DOCX de l’annonce'}</span>
                        <span style={{ fontSize: '12px', color: 'var(--mu)' }}>
                          {'Texte extrait avec pdf.js / mammoth.js, OCR en complément.'}
                        </span>
                      </span>{' '}
                    </label>{' '}
                  </>
                ) : null}{' '}
                {v.letSrc?.busy ? (
                  <>
                    {' '}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '14px',
                        background: 'var(--ais)',
                      }}
                    >
                      {' '}
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '3px 7px',
                          borderRadius: '999px',
                          background: 'var(--ai)',
                          color: 'var(--aifg)',
                        }}
                      >
                        {'IA'}
                      </span>{' '}
                      <span style={{ flex: '1', fontWeight: '600' }}>{v.letSrc?.busyText}</span>{' '}
                      <span
                        style={{ width: '80px', height: '4px', borderRadius: '2px', background: 'rgba(106,76,255,.2)', overflow: 'hidden' }}
                      >
                        <span
                          style={{
                            display: 'block',
                            height: '100%',
                            width: `${v.letSrc?.busyPct ?? ''}%`,
                            background: 'var(--ai)',
                            transition: 'width .3s',
                          }}
                        ></span>
                      </span>{' '}
                    </div>{' '}
                  </>
                ) : null}{' '}
                {v.letSrc?.done ? (
                  <>
                    {' '}
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        padding: '12px 14px',
                        borderRadius: '14px',
                        border: '1px solid var(--ai)',
                        background: 'var(--ais)',
                      }}
                    >
                      {' '}
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '3px 7px',
                          borderRadius: '999px',
                          background: 'var(--ai)',
                          color: 'var(--aifg)',
                        }}
                      >
                        {'IA'}
                      </span>{' '}
                      <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: '700' }}>{v.letSrc?.infoTitle}</span>
                        <span style={{ fontSize: '12px', color: 'var(--mu)' }}>{v.letSrc?.infoDetail}</span>
                      </span>{' '}
                    </div>{' '}
                  </>
                ) : null}{' '}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {' '}
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Entreprise'}</span>
                    <input
                      value={v.letter?.company ?? ''}
                      onChange={v.onLetCompany}
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
                      className={ps('focus', 'border-color:var(--ac)')}
                    />
                  </label>{' '}
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Poste visé'}</span>
                    <input
                      value={v.letter?.role ?? ''}
                      onChange={v.onLetRole}
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
                      className={ps('focus', 'border-color:var(--ac)')}
                    />
                  </label>{' '}
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {' '}
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Ton'}</span>{' '}
                  <div style={{ display: 'flex', padding: '3px', borderRadius: '999px', background: 'var(--sub)', gap: '2px' }}>
                    {' '}
                    {(v.tones || []).map((t, i54) => (
                      <React.Fragment key={i54}>
                        <button
                          onClick={t?.go}
                          style={{
                            flex: '1',
                            height: '30px',
                            border: '0',
                            borderRadius: '999px',
                            background: t?.bg,
                            color: t?.fg,
                            font: 'inherit',
                            fontSize: '12.5px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {t?.label}
                        </button>
                      </React.Fragment>
                    ))}{' '}
                  </div>{' '}
                </div>{' '}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {' '}
                  <span style={{ fontSize: '12px', color: 'var(--mu)' }}>
                    {'Basée sur '}
                    <strong style={{ color: 'var(--tx)' }}>{v.versionName}</strong>
                  </span>{' '}
                  <button
                    onClick={v.letterAction}
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
                      flexShrink: '0',
                      transition: 'transform .15s',
                    }}
                    className={ps('hover', 'transform:translateY(-1px)')}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '3px 7px',
                        borderRadius: '999px',
                        background: 'rgba(255,255,255,.22)',
                        letterSpacing: '.05em',
                      }}
                    >
                      {'IA'}
                    </span>
                    {v.letter?.btn}
                  </button>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
            <div style={{ flex: '1 1 520px', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {' '}
              {v.letter?.showDiag ? (
                <>
                  {' '}
                  <div
                    style={{
                      background: 'var(--panel)',
                      border: '1px solid var(--line)',
                      borderRadius: '20px',
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      {' '}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--mu)' }}>{'Lettre d’origine'}</span>
                        <span
                          style={{
                            fontFamily: "'Bricolage Grotesque',sans-serif",
                            fontSize: '28px',
                            fontWeight: '700',
                            color: 'var(--er)',
                          }}
                        >
                          {v.letter?.scoreBefore}
                        </span>
                      </div>{' '}
                      <span style={{ fontSize: '20px', color: 'var(--fa)' }}>{'→'}</span>{' '}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '11.5px', color: 'var(--mu)' }}>{'Version améliorée'}</span>
                        <span
                          style={{
                            fontFamily: "'Bricolage Grotesque',sans-serif",
                            fontSize: '28px',
                            fontWeight: '700',
                            color: 'var(--ok)',
                          }}
                        >
                          {v.letter?.scoreAfter}
                        </span>
                      </div>{' '}
                      <span style={{ flex: '1', minWidth: '200px', fontSize: '12.5px', color: 'var(--mu)', lineHeight: '1.5' }}>
                        {'Score d’impact : précision, lien avec l’offre, preuves chiffrées, concision.'}
                      </span>{' '}
                    </div>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {' '}
                      {(v.letter?.diag || []).map((d, i55) => (
                        <React.Fragment key={i55}>
                          {' '}
                          <div
                            style={{
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'flex-start',
                              padding: '9px 12px',
                              borderRadius: '12px',
                              background: 'var(--sub)',
                            }}
                          >
                            {' '}
                            <span
                              style={{
                                flex: '0 0 20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: d?.bg,
                                color: d?.fg,
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: '11px',
                                fontWeight: '700',
                              }}
                            >
                              {d?.mark}
                            </span>{' '}
                            <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontWeight: '600', fontSize: '12.5px' }}>{d?.title}</span>
                              <span style={{ fontSize: '12px', color: 'var(--mu)' }}>{d?.fix}</span>
                            </span>{' '}
                          </div>{' '}
                        </React.Fragment>
                      ))}{' '}
                    </div>{' '}
                  </div>{' '}
                </>
              ) : null}{' '}
              {v.letter?.done ? (
                <>
                  {' '}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {' '}
                    <span style={{ marginRight: 'auto', fontSize: '12px', color: 'var(--fa)' }}>{v.letter?.meta}</span>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 100%', flexWrap: 'wrap', order: '5' }}>
                      <span style={{ fontSize: '12px', color: 'var(--mu)' }}>{'Police'}</span>
                      <select
                        value={v.letFontSel ?? ''}
                        onChange={v.onLetFont}
                        style={{
                          height: '32px',
                          maxWidth: '180px',
                          padding: '0 10px',
                          border: '1px solid var(--line2)',
                          borderRadius: '999px',
                          background: 'var(--panel)',
                          color: 'var(--tx)',
                          fontFamily: "'Instrument Sans',system-ui,sans-serif",
                          fontSize: '12.5px',
                          fontWeight: '600',
                        }}
                      >
                        {(v.letFontOpts || []).map((o, i56) => (
                          <React.Fragment key={i56}>
                            <option value={o?.v ?? ''}>{o?.l}</option>
                          </React.Fragment>
                        ))}
                      </select>
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
                          onClick={v.letSize?.down}
                          aria-label="−"
                          style={{
                            width: '30px',
                            height: '30px',
                            border: '0',
                            background: 'transparent',
                            color: 'var(--tx)',
                            cursor: 'pointer',
                            fontSize: '15px',
                            opacity: v.letSize?.downOp,
                          }}
                        >
                          {'−'}
                        </button>
                        <span style={{ minWidth: '48px', textAlign: 'center', fontSize: '12px', fontWeight: '700' }}>
                          {v.letSize?.label}
                        </span>
                        <button
                          onClick={v.letSize?.up}
                          aria-label="+"
                          style={{
                            width: '30px',
                            height: '30px',
                            border: '0',
                            background: 'transparent',
                            color: 'var(--tx)',
                            cursor: 'pointer',
                            fontSize: '15px',
                            opacity: v.letSize?.upOp,
                          }}
                        >
                          {'+'}
                        </button>
                      </div>
                      <button
                        onClick={v.letSameAsCv}
                        style={{
                          height: '30px',
                          padding: '0 12px',
                          border: '0',
                          borderRadius: '999px',
                          background: 'var(--sub)',
                          color: 'var(--tx)',
                          font: 'inherit',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {'Comme le CV'}
                      </button>
                    </div>{' '}
                    <button
                      onClick={v.reviewLetter}
                      style={{
                        height: '34px',
                        padding: '0 14px',
                        border: '0',
                        borderRadius: '999px',
                        background: v.letTics?.bg,
                        color: v.letTics?.fg,
                        font: 'inherit',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {v.letTics?.label}
                    </button>{' '}
                    <button
                      onClick={v.copyLetter}
                      style={{
                        height: '34px',
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
                      {'Copier'}
                    </button>{' '}
                    <button
                      onClick={v.exportLetter}
                      style={{
                        height: '34px',
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
                      {'Exporter .txt'}
                    </button>{' '}
                    <button
                      onClick={v.exportLetterDoc}
                      style={{
                        height: '34px',
                        padding: '0 16px',
                        border: '0',
                        borderRadius: '999px',
                        background: 'var(--btn)',
                        color: 'var(--btnfg)',
                        font: 'inherit',
                        fontSize: '12.5px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {'Exporter Word'}
                    </button>{' '}
                  </div>{' '}
                  <div
                    data-no-i18n="1"
                    style={{
                      background: '#ffffff',
                      border: '1px solid var(--line)',
                      borderRadius: '6px',
                      padding: '48px 54px',
                      boxShadow: '0 18px 40px -28px rgba(28,25,21,.5)',
                      borderTop: '6px solid var(--ac)',
                    }}
                  >
                    {' '}
                    {v.letter?.hasHead ? (
                      <>
                        {' '}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '22px',
                            marginBottom: '26px',
                            fontFamily: v.letStyle?.font,
                            fontSize: v.letStyle?.fs,
                            lineHeight: '1.55',
                            color: '#1a1a1a',
                          }}
                        >
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-start', maxWidth: '60%' }}>
                            {' '}
                            {(v.letter?.sender || []).map((l, i57) => (
                              <React.Fragment key={i57}>
                                <span style={{ fontWeight: l?.fw }}>{l?.text}</span>
                              </React.Fragment>
                            ))}{' '}
                          </div>{' '}
                          <div
                            style={{ display: 'flex', flexDirection: 'column', alignSelf: 'flex-end', textAlign: 'right', maxWidth: '60%' }}
                          >
                            {' '}
                            {(v.letter?.recipient || []).map((l, i58) => (
                              <React.Fragment key={i58}>
                                <span style={{ fontWeight: l?.fw }}>{l?.text}</span>
                              </React.Fragment>
                            ))}{' '}
                          </div>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    <textarea
                      value={v.letter?.body ?? ''}
                      onChange={v.onLetBody}
                      onBlur={v.onLetBlur}
                      rows="28"
                      style={{
                        width: '100%',
                        border: '0',
                        outline: 'none',
                        background: 'transparent',
                        color: '#1a1a1a',
                        fontFamily: v.letStyle?.font,
                        fontSize: v.letStyle?.fs,
                        lineHeight: '1.6',
                        resize: 'vertical',
                      }}
                    />{' '}
                  </div>{' '}
                </>
              ) : null}{' '}
              {v.letter?.notDone ? (
                <>
                  {' '}
                  <div
                    style={{
                      minHeight: '460px',
                      border: '1.5px dashed var(--line2)',
                      borderRadius: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      color: 'var(--mu)',
                      textAlign: 'center',
                      padding: '28px',
                    }}
                  >
                    {' '}
                    <span
                      style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '20px', fontWeight: '700', color: 'var(--tx)' }}
                    >
                      {v.letter?.emptyTitle}
                    </span>{' '}
                    <span style={{ maxWidth: '380px', lineHeight: '1.5' }}>{v.letter?.empty}</span>{' '}
                  </div>{' '}
                </>
              ) : null}{' '}
            </div>{' '}
          </div>{' '}
        </>
      ) : null}
    </>
  );
}
