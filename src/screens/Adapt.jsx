import React from 'react';
import { ps } from '../lib/pseudo.js';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Adapt({ v }) {
  return (
    <>
      {v.isAdapt ? (
        <>
          {' '}
          <div
            data-screen-label="Adapter à une offre"
            style={{
              padding: '20px clamp(12px,3.5vw,24px) 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '1240px',
              width: '100%',
            }}
          >
            {' '}
            {v.ad?.input ? (
              <>
                {' '}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))',
                    gap: '18px',
                    alignItems: 'start',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      background: 'var(--panel)',
                      border: '1px solid var(--line)',
                      borderRadius: '20px',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    {' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '19px' }}>
                        {'D’où vient l’offre ?'}
                      </span>
                      <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>
                        {'Collez le texte, un lien, une capture ou le PDF : l’IA en extrait le contenu.'}
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
                      {(v.adSrc?.tabs || []).map((t, i46) => (
                        <React.Fragment key={i46}>
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
                    {v.adSrc?.isLink ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {' '}
                          <input
                            value={v.adSrc?.url ?? ''}
                            onChange={v.adH?.onUrl}
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
                            onClick={v.adH?.runLink}
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
                    {v.adSrc?.isImage ? (
                      <>
                        {' '}
                        <label
                          onDragOver={v.adH?.over}
                          onDrop={v.adH?.dropImg}
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
                          <input type="file" accept="image/*" onChange={v.adH?.onImg} style={{ display: 'none' }} />{' '}
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
                            {v.adSrc?.hasImg ? (
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
                                    backgroundImage: v.adSrc?.imgBg,
                                  }}
                                ></div>
                              </>
                            ) : null}{' '}
                            {v.adSrc?.noImg ? (
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
                    {v.adSrc?.isPdf ? (
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
                          <input type="file" accept=".pdf,.docx" onChange={v.adH?.onPdf} style={{ display: 'none' }} />{' '}
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
                    {v.adSrc?.busy ? (
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
                          <span style={{ flex: '1', fontWeight: '600' }}>{v.adSrc?.busyText}</span>{' '}
                          <span
                            style={{
                              width: '80px',
                              height: '4px',
                              borderRadius: '2px',
                              background: 'rgba(106,76,255,.2)',
                              overflow: 'hidden',
                            }}
                          >
                            <span
                              style={{
                                display: 'block',
                                height: '100%',
                                width: `${v.adSrc?.busyPct ?? ''}%`,
                                background: 'var(--ai)',
                                transition: 'width .3s',
                              }}
                            ></span>
                          </span>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.adSrc?.done ? (
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
                            <span style={{ fontWeight: '700' }}>{v.adSrc?.infoTitle}</span>
                            <span style={{ fontSize: '12px', color: 'var(--mu)' }}>{v.adSrc?.infoDetail}</span>
                          </span>{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    {v.adSrc?.showText ? (
                      <>
                        {' '}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {' '}
                          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{v.adSrc?.textLabel}</span>{' '}
                          <textarea
                            value={v.offer ?? ''}
                            onChange={v.onOffer}
                            rows="16"
                            placeholder="Collez ici le texte complet de l'annonce…"
                            style={{
                              width: '100%',
                              padding: '12px 14px',
                              border: '1px solid var(--line2)',
                              borderRadius: '14px',
                              background: 'var(--panel)',
                              color: 'var(--tx)',
                              font: 'inherit',
                              fontSize: '12.5px',
                              lineHeight: '1.6',
                              outline: 'none',
                            }}
                            className={ps('focus', 'border-color:var(--ac);box-shadow:0 0 0 4px var(--acs)')}
                          />{' '}
                        </div>{' '}
                      </>
                    ) : null}{' '}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {' '}
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'var(--fa)' }}>
                        {v.offerMeta}
                      </span>{' '}
                      <button
                        onClick={v.analyzeOffer}
                        style={{
                          height: '40px',
                          padding: '0 20px',
                          border: '0',
                          borderRadius: '999px',
                          background: 'var(--ac)',
                          color: '#ffffff',
                          font: 'inherit',
                          fontSize: '13.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: '0',
                        }}
                      >
                        {v.ad?.btn}
                      </button>{' '}
                    </div>{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {' '}
                    <div
                      style={{
                        background: 'var(--ink)',
                        color: 'var(--inkfg)',
                        borderRadius: '20px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {' '}
                      <span
                        style={{ fontSize: '11px', fontWeight: '700', opacity: '.55', textTransform: 'uppercase', letterSpacing: '.06em' }}
                      >
                        {'Version de départ'}
                      </span>{' '}
                      <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '20px', fontWeight: '700' }}>
                        {v.versionName}
                      </span>{' '}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {' '}
                        <span
                          style={{ padding: '6px 12px', borderRadius: '999px', background: 'rgba(255,255,255,.08)', fontSize: '12.5px' }}
                        >
                          {'Score ATS '}
                          <strong>{v.score}</strong>
                        </span>{' '}
                        <span
                          style={{ padding: '6px 12px', borderRadius: '999px', background: 'rgba(255,255,255,.08)', fontSize: '12.5px' }}
                        >
                          {'Correspondance actuelle '}
                          <strong>
                            {v.ad?.before}
                            {' %'}
                          </strong>
                        </span>{' '}
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
                        gap: '12px',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            flex: '0 0 28px',
                            borderRadius: '9px',
                            background: 'var(--t1)',
                            display: 'grid',
                            placeItems: 'center',
                            fontWeight: '700',
                            fontSize: '12px',
                          }}
                        >
                          {'1'}
                        </span>
                        <span style={{ color: 'var(--mu)', lineHeight: '1.5' }}>
                          <strong style={{ color: 'var(--tx)' }}>{'Extraction'}</strong>
                          {' des compétences, mots-clés et exigences.'}
                        </span>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            flex: '0 0 28px',
                            borderRadius: '9px',
                            background: 'var(--t2)',
                            display: 'grid',
                            placeItems: 'center',
                            fontWeight: '700',
                            fontSize: '12px',
                          }}
                        >
                          {'2'}
                        </span>
                        <span style={{ color: 'var(--mu)', lineHeight: '1.5' }}>
                          <strong style={{ color: 'var(--tx)' }}>{'Comparaison'}</strong>
                          {' avec votre CV, pondérée par importance.'}
                        </span>
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span
                          style={{
                            width: '28px',
                            height: '28px',
                            flex: '0 0 28px',
                            borderRadius: '9px',
                            background: 'var(--t3)',
                            display: 'grid',
                            placeItems: 'center',
                            fontWeight: '700',
                            fontSize: '12px',
                          }}
                        >
                          {'3'}
                        </span>
                        <span style={{ color: 'var(--mu)', lineHeight: '1.5' }}>
                          <strong style={{ color: 'var(--tx)' }}>{'Réécritures ciblées'}</strong>
                          {', à accepter une par une.'}
                        </span>
                      </div>{' '}
                      <div
                        style={{
                          padding: '10px 12px',
                          borderRadius: '12px',
                          background: 'var(--sub)',
                          color: 'var(--mu)',
                          fontSize: '12.5px',
                          lineHeight: '1.5',
                        }}
                      >
                        {'Aucune compétence n’est ajoutée sans votre accord.'}
                      </div>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </>
            ) : null}{' '}
            {v.ad?.result ? (
              <>
                {' '}
                <div
                  style={{
                    background: 'var(--panel)',
                    border: '1px solid var(--line)',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '22px',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--mu)' }}>{'Correspondance avant'}</span>
                    <span style={{ fontSize: '30px', fontWeight: '600', color: 'var(--mu)' }}>
                      {v.ad?.before}
                      {' %'}
                    </span>
                  </div>{' '}
                  <span style={{ fontSize: '20px', color: 'var(--fa)' }}>{'→'}</span>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--mu)' }}>{'Après adaptation'}</span>
                    <span style={{ fontSize: '30px', fontWeight: '600', color: 'var(--ac)' }}>
                      {v.ad?.after}
                      {' %'}
                    </span>
                  </div>{' '}
                  <div style={{ flex: '1', minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {' '}
                    <div style={{ height: '6px', borderRadius: '3px', background: 'var(--line)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${v.ad?.before ?? ''}%`, background: 'var(--fa)' }}></div>
                    </div>{' '}
                    <div style={{ height: '6px', borderRadius: '3px', background: 'var(--line)', overflow: 'hidden' }}>
                      <div
                        style={{ height: '100%', width: `${v.ad?.after ?? ''}%`, background: 'var(--ac)', transition: 'width .35s ease' }}
                      ></div>
                    </div>{' '}
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'var(--fa)' }}>
                      {v.ad?.kwLine}
                    </span>{' '}
                  </div>{' '}
                  <button
                    onClick={v.editOffer}
                    style={{
                      height: '30px',
                      padding: '0 12px',
                      border: '1px solid var(--line2)',
                      borderRadius: '999px',
                      background: 'var(--panel)',
                      color: 'var(--tx)',
                      font: 'inherit',
                      fontSize: '12.5px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: '0',
                    }}
                  >
                    {"Modifier l'offre"}
                  </button>{' '}
                </div>{' '}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))',
                    gap: '16px',
                    alignItems: 'start',
                    paddingBottom: '72px',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {' '}
                    <div
                      style={{
                        background: 'var(--panel)',
                        border: '1px solid var(--line)',
                        borderRadius: '16px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {' '}
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '600', fontSize: '15px' }}>
                          {'Mots-clés extraits'}
                        </span>{' '}
                        <span style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--mu)' }}>
                          <span style={{ color: 'var(--ok)' }}>{'✓ présent'}</span>
                          <span style={{ color: 'var(--ac)' }}>{'+ ajouté'}</span>
                          <span style={{ color: 'var(--er)' }}>{'✕ manquant'}</span>
                        </span>
                      </div>{' '}
                      {(v.kwGroups || []).map((g, i47) => (
                        <React.Fragment key={i47}>
                          {' '}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {' '}
                            <span
                              style={{
                                fontSize: '11.5px',
                                fontWeight: '600',
                                color: 'var(--mu)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {g?.title}
                            </span>{' '}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                              {' '}
                              {(g?.items || []).map((k, i48) => (
                                <React.Fragment key={i48}>
                                  {' '}
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      height: '24px',
                                      padding: '0 9px',
                                      border: `1px solid ${k?.bd ?? ''}`,
                                      borderRadius: '12px',
                                      background: k?.bg,
                                      color: k?.fg,
                                      fontSize: '12px',
                                      fontWeight: '500',
                                      whiteSpace: 'nowrap',
                                      flexShrink: '0',
                                    }}
                                  >
                                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10.5px' }}>{k?.mark}</span>
                                    {k?.label}
                                  </span>{' '}
                                </React.Fragment>
                              ))}{' '}
                            </div>{' '}
                          </div>{' '}
                        </React.Fragment>
                      ))}{' '}
                    </div>{' '}
                    <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '16px' }}>
                      {' '}
                      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', fontWeight: '600' }}>
                        {'Exigences du poste'}
                      </div>{' '}
                      {(v.reqs || []).map((q, i49) => (
                        <React.Fragment key={i49}>
                          {' '}
                          <div style={{ display: 'flex', gap: '10px', padding: '9px 14px', borderBottom: '1px solid var(--line)' }}>
                            {' '}
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: q?.color }}>{q?.mark}</span>{' '}
                            <span style={{ flex: '1' }}>{q?.label}</span>{' '}
                            <span style={{ fontSize: '12px', color: 'var(--mu)' }}>{q?.detail}</span>{' '}
                          </div>{' '}
                        </React.Fragment>
                      ))}{' '}
                    </div>{' '}
                    <div
                      style={{
                        background: 'var(--panel)',
                        border: '1px solid var(--line)',
                        borderRadius: '16px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {' '}
                      <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '600', fontSize: '15px' }}>
                        {'Compétences manquantes'}
                      </span>{' '}
                      <span style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.45' }}>
                        {'Cochez uniquement celles que vous maîtrisez réellement : elles seront ajoutées à la section Compétences.'}
                      </span>{' '}
                      {(v.skillAdds || []).map((k, i50) => (
                        <React.Fragment key={i50}>
                          {' '}
                          <button
                            onClick={k?.toggle}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '6px 0',
                              border: '0',
                              background: 'transparent',
                              color: 'var(--tx)',
                              font: 'inherit',
                              cursor: 'pointer',
                              textAlign: 'left',
                            }}
                          >
                            {' '}
                            <span
                              style={{
                                width: '16px',
                                height: '16px',
                                borderRadius: '4px',
                                border: `1px solid ${k?.bd ?? ''}`,
                                background: k?.bg,
                                color: 'var(--acfg)',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: '11px',
                              }}
                            >
                              {k?.box}
                            </span>{' '}
                            <span>{k?.label}</span>{' '}
                          </button>{' '}
                        </React.Fragment>
                      ))}{' '}
                    </div>{' '}
                  </div>{' '}
                  <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '16px' }}>
                    {' '}
                    <div
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid var(--line)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '600', fontSize: '15px' }}>
                        {'Réécritures proposées'}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11.5px', color: 'var(--mu)' }}>
                        {v.ad?.accLine}
                      </span>
                    </div>{' '}
                    {(v.adaptSugs || []).map((x, i51) => (
                      <React.Fragment key={i51}>
                        {' '}
                        <div
                          style={{
                            padding: '12px 14px',
                            borderBottom: '1px solid var(--line)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            background: x?.rowBg,
                          }}
                        >
                          {' '}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                            {' '}
                            <span
                              style={{
                                fontSize: '11.5px',
                                fontWeight: '600',
                                color: 'var(--mu)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {x?.where}
                            </span>{' '}
                            <button
                              onClick={x?.toggle}
                              style={{
                                height: '26px',
                                padding: '0 10px',
                                border: `1px solid ${x?.bd ?? ''}`,
                                borderRadius: '999px',
                                background: x?.bg,
                                color: x?.fg,
                                font: 'inherit',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: '0',
                              }}
                            >
                              {x?.btn}
                            </button>{' '}
                          </div>{' '}
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'var(--mu)',
                              lineHeight: '1.45',
                              textDecoration: 'line-through',
                              textDecorationColor: 'var(--line2)',
                            }}
                          >
                            {x?.before}
                          </div>{' '}
                          <div style={{ lineHeight: '1.5' }}>{x?.after}</div>{' '}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                            {' '}
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'var(--ac)' }}>
                              {'+ '}
                              {x?.adds}
                            </span>{' '}
                            {x?.hasNote ? (
                              <>
                                <span style={{ fontSize: '11.5px', color: 'var(--wa)' }}>{x?.note}</span>
                              </>
                            ) : null}{' '}
                          </div>{' '}
                        </div>{' '}
                      </React.Fragment>
                    ))}{' '}
                  </div>{' '}
                </div>{' '}
                <div
                  style={{
                    position: 'sticky',
                    bottom: v.lay?.stickyB,
                    zIndex: '5',
                    marginTop: '8px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding: '12px 14px',
                    border: '1px solid var(--line)',
                    borderRadius: '10px',
                    background: 'var(--panel)',
                    boxShadow: '0 8px 24px rgba(0,0,0,.08)',
                  }}
                >
                  {' '}
                  <span style={{ color: 'var(--mu)' }}>
                    {'Score ATS après adaptation : '}
                    <strong style={{ color: 'var(--tx)' }}>{v.ad?.ats}</strong>
                    {' · la structure reste conforme.'}
                  </span>{' '}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {' '}
                    <button
                      onClick={v.applyCurrent}
                      style={{
                        height: '32px',
                        padding: '0 12px',
                        border: '1px solid var(--line2)',
                        borderRadius: '999px',
                        background: 'var(--panel)',
                        color: 'var(--tx)',
                        font: 'inherit',
                        fontSize: '12.5px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: '0',
                      }}
                    >
                      {'Appliquer à la version actuelle'}
                    </button>{' '}
                    <button
                      onClick={v.applyNew}
                      style={{
                        height: '32px',
                        padding: '0 14px',
                        border: '1px solid var(--btn)',
                        borderRadius: '999px',
                        background: 'var(--btn)',
                        color: 'var(--btnfg)',
                        font: 'inherit',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: '0',
                      }}
                    >
                      {'Créer la version ciblée'}
                    </button>{' '}
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
