import React from 'react';
import BeforeAfter from './import/BeforeAfter.jsx';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Import({ v }) {
  return (
    <>
      {v.isImport ? (
        <>
          {' '}
          <div
            data-screen-label="Import"
            style={{
              padding: '20px clamp(12px,3.5vw,24px) 48px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '1240px',
              width: '100%',
            }}
          >
            {' '}
            {v.impSimple ? (
              <>
                {' '}
                <div
                  style={{
                    padding: '10px 14px',
                    border: '1px solid var(--line)',
                    borderRadius: '16px',
                    background: 'var(--panel)',
                    color: 'var(--mu)',
                  }}
                >
                  <strong style={{ color: 'var(--tx)' }}>{'Mode conformité seule.'}</strong>
                  {' Seuls la structure, les titres, la police et les dates sont corrigés ; vos formulations restent inchangées.'}
                </div>{' '}
              </>
            ) : null}{' '}
            {v.imp?.idle ? (
              <>
                {' '}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
                    gap: '16px',
                    alignItems: 'start',
                  }}
                >
                  {' '}
                  <label
                    onDragOver={v.onDragOver}
                    onDragLeave={v.onDragLeave}
                    onDrop={v.onDrop}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      minHeight: '300px',
                      border: `1.5px dashed ${v.drop?.bd ?? ''}`,
                      borderRadius: '10px',
                      background: v.drop?.bg,
                      cursor: 'pointer',
                      textAlign: 'center',
                      padding: '24px',
                    }}
                  >
                    {' '}
                    <input type="file" accept=".pdf,.docx,.png,.jpg,.jpeg" onChange={v.onImpFile} style={{ display: 'none' }} />{' '}
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'var(--fa)' }}>
                      {'PDF · DOCX · PNG · JPG — 10 Mo max'}
                    </span>{' '}
                    <span style={{ fontSize: '16px', fontWeight: '600' }}>{'Déposez votre CV ici'}</span>{' '}
                    <span style={{ color: 'var(--mu)' }}>{'ou cliquez pour choisir un fichier'}</span>{' '}
                  </label>{' '}
                  <div
                    style={{
                      background: 'var(--panel)',
                      border: '1px solid var(--line)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {' '}
                    <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '600', fontSize: '15px' }}>
                      {'Ce qui se passe ensuite'}
                    </span>{' '}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--fa)' }}>{'01'}</span>
                      <span style={{ color: 'var(--mu)', lineHeight: '1.45' }}>
                        {'Extraction du texte (pdf.js pour les PDF, mammoth.js pour les DOCX, OCR pour les images).'}
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--fa)' }}>{'02'}</span>
                      <span style={{ color: 'var(--mu)', lineHeight: '1.45' }}>
                        {'Détection des sections, même mal nommées, et des éléments bloquants.'}
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--fa)' }}>{'03'}</span>
                      <span style={{ color: 'var(--mu)', lineHeight: '1.45' }}>
                        {'Rapport de conformité avec score sur 100 et liste des problèmes.'}
                      </span>
                    </div>{' '}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--fa)' }}>{'04'}</span>
                      <span style={{ color: 'var(--mu)', lineHeight: '1.45' }}>
                        {'Conversion en version ATS, enregistrée comme nouvelle version.'}
                      </span>
                    </div>{' '}
                    <label
                      style={{
                        alignSelf: 'flex-start',
                        display: 'flex',
                        alignItems: 'center',
                        height: '34px',
                        padding: '0 16px',
                        border: '0',
                        borderRadius: '999px',
                        background: 'var(--btn)',
                        color: 'var(--btnfg)',
                        fontSize: '12.5px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <input type="file" accept=".pdf" onChange={v.onLinkedin} style={{ display: 'none' }} />
                      {'Importer mon profil LinkedIn (PDF)'}
                    </label>{' '}
                    <span style={{ fontSize: '11.5px', color: 'var(--mu)', lineHeight: '1.45', marginTop: '-4px' }}>
                      {'Sur LinkedIn : votre profil → « Plus » → « Enregistrer au format PDF ».'}
                    </span>{' '}
                  </div>{' '}
                </div>{' '}
              </>
            ) : null}{' '}
            {v.imp?.parsing ? (
              <>
                {' '}
                <div
                  style={{
                    maxWidth: '640px',
                    background: 'var(--panel)',
                    border: '1px solid var(--line)',
                    borderRadius: '16px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    {' '}
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12.5px' }}>{v.imp?.fileName}</span>{' '}
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '12px', color: 'var(--fa)' }}>
                      {v.imp?.fileMeta}
                    </span>{' '}
                  </div>{' '}
                  <div style={{ height: '4px', borderRadius: '2px', background: 'var(--line)', overflow: 'hidden' }}>
                    <div
                      style={{ height: '100%', width: `${v.imp?.pct ?? ''}%`, background: 'var(--ac)', transition: 'width .45s ease' }}
                    ></div>
                  </div>{' '}
                  {(v.impSteps || []).map((st, i42) => (
                    <React.Fragment key={i42}>
                      {' '}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
                        {' '}
                        <span style={{ width: '16px', fontFamily: "'JetBrains Mono',monospace", color: st?.color }}>{st?.mark}</span>{' '}
                        <span style={{ flex: '1', color: st?.fg }}>{st?.label}</span>{' '}
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11.5px', color: 'var(--fa)' }}>
                          {st?.detail}
                        </span>{' '}
                      </div>{' '}
                    </React.Fragment>
                  ))}{' '}
                </div>{' '}
              </>
            ) : null}{' '}
            {v.imp?.report ? (
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
                    gap: '18px',
                  }}
                >
                  {' '}
                  <div
                    style={{
                      width: '96px',
                      height: '96px',
                      flex: '0 0 96px',
                      borderRadius: '50%',
                      background: `conic-gradient(${v.imp?.color ?? ''} ${v.imp?.deg ?? ''}deg, var(--line) 0)`,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        width: '78px',
                        height: '78px',
                        borderRadius: '50%',
                        background: 'var(--panel)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '26px', fontWeight: '600', lineHeight: '1' }}>{v.imp?.score}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10.5px', color: 'var(--fa)' }}>{'/100'}</span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ flex: '1', minWidth: 'min(100%,240px)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {' '}
                    <span style={{ fontSize: '15px', fontWeight: '600' }}>{v.imp?.headline}</span>{' '}
                    <span style={{ color: 'var(--mu)' }}>
                      {v.imp?.fileName}
                      {' · '}
                      {v.imp?.sevLine}
                    </span>{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {' '}
                    <button
                      onClick={v.resetImport}
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
                      {'Changer de fichier'}
                    </button>{' '}
                    <button
                      onClick={v.convertImport}
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
                      {'Générer la version conforme'}
                    </button>{' '}
                  </div>{' '}
                </div>{' '}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))',
                    gap: '16px',
                    alignItems: 'start',
                  }}
                >
                  {' '}
                  <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '16px' }}>
                    {' '}
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', fontWeight: '600' }}>
                      {'Problèmes détectés ('}
                      {v.imp?.issueCount}
                      {')'}
                    </div>{' '}
                    {(v.issues || []).map((i, i43) => (
                      <React.Fragment key={i43}>
                        {' '}
                        <div style={{ display: 'flex', gap: '10px', padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
                          {' '}
                          <span
                            style={{
                              flex: '0 0 74px',
                              alignSelf: 'flex-start',
                              textAlign: 'center',
                              fontSize: '10.5px',
                              fontWeight: '600',
                              padding: '2px 0',
                              borderRadius: '4px',
                              background: i?.bg,
                              color: i?.fg,
                            }}
                          >
                            {i?.sev}
                          </span>{' '}
                          <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {' '}
                            <span style={{ fontWeight: '500' }}>{i?.t}</span>{' '}
                            <span style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.4' }}>{i?.d}</span>{' '}
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'var(--ac)' }}>
                              {'→ '}
                              {i?.fix}
                            </span>{' '}
                          </span>{' '}
                        </div>{' '}
                      </React.Fragment>
                    ))}{' '}
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
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '600', fontSize: '15px' }}>
                        {'Contenu extrait'}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'var(--fa)' }}>
                        {v.imp?.extractMeta}
                      </span>
                    </div>{' '}
                    {(v.mapping || []).map((m, i44) => (
                      <React.Fragment key={i44}>
                        {' '}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 14px',
                            borderBottom: '1px solid var(--line)',
                          }}
                        >
                          {' '}
                          <span style={{ flex: '1', color: 'var(--mu)' }}>
                            {'« '}
                            {m?.from}
                            {' »'}
                          </span>{' '}
                          <span style={{ color: 'var(--fa)' }}>{'→'}</span> <span style={{ flex: '1', fontWeight: '500' }}>{m?.to}</span>{' '}
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'var(--fa)' }}>
                            {m?.conf}
                            {' %'}
                          </span>{' '}
                        </div>{' '}
                      </React.Fragment>
                    ))}{' '}
                    <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                        {'Texte brut tel que lu par un ATS'}
                      </span>{' '}
                      <pre
                        style={{
                          margin: '0',
                          maxHeight: '220px',
                          overflow: 'auto',
                          whiteSpace: 'pre-wrap',
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: '11px',
                          lineHeight: '1.55',
                          padding: '10px',
                          borderRadius: '6px',
                          background: 'var(--sub)',
                          color: 'var(--tx)',
                        }}
                      >
                        {v.rawExtract}
                      </pre>{' '}
                    </div>{' '}
                  </div>{' '}
                </div>{' '}
              </>
            ) : null}{' '}
            {v.imp?.done ? (
              <>
                {' '}
                <div
                  style={{
                    maxWidth: '780px',
                    background: 'var(--panel)',
                    border: '1px solid var(--line)',
                    borderRadius: '16px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {' '}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    {' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--mu)' }}>{'Avant'}</span>
                      <span style={{ fontSize: '32px', fontWeight: '600', color: 'var(--er)' }}>{v.imp?.score}</span>
                    </div>{' '}
                    <span style={{ fontSize: '20px', color: 'var(--fa)' }}>{'→'}</span>{' '}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--mu)' }}>{'Après conversion'}</span>
                      <span style={{ fontSize: '32px', fontWeight: '600', color: 'var(--ok)' }}>{v.impAfter}</span>
                    </div>{' '}
                    <span style={{ flex: '1', minWidth: '220px', color: 'var(--mu)', lineHeight: '1.45' }}>{v.impKept}</span>{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {' '}
                    {(v.issues || []).map((i, i45) => (
                      <React.Fragment key={i45}>
                        {' '}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ color: 'var(--ok)', fontFamily: "'JetBrains Mono',monospace" }}>{'✓'}</span>
                          <span>{i?.fix}</span>
                        </div>{' '}
                      </React.Fragment>
                    ))}{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {' '}
                    <button
                      onClick={v.openImported}
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
                      {"Ouvrir dans l'éditeur"}
                    </button>{' '}
                    <button
                      onClick={v.exportImported}
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
                      {'Exporter directement'}
                    </button>{' '}
                    <button
                      onClick={v.resetImport}
                      style={{
                        height: '32px',
                        padding: '0 12px',
                        border: '0',
                        borderRadius: '999px',
                        background: 'transparent',
                        color: 'var(--mu)',
                        font: 'inherit',
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: '0',
                      }}
                    >
                      {'Importer un autre fichier'}
                    </button>{' '}
                  </div>{' '}
                </div>{' '}
              </>
            ) : null}{' '}
            <BeforeAfter v={v} />
      </div>{' '}
        </>
      ) : null}
    </>
  );
}
