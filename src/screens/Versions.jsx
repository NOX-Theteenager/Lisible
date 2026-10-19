import React from 'react';
import { ps } from '../lib/pseudo.js';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Versions({ v }) {
  return (
    <>
      {v.isVersions ? (
        <>
          {' '}
          <div
            data-screen-label="Versions"
            style={{
              padding: '20px clamp(12px,3.5vw,24px) 40px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'flex-start',
              maxWidth: '1240px',
              width: '100%',
            }}
          >
            {' '}
            <div
              style={{
                flex: '1 1 560px',
                minWidth: '0',
                background: 'var(--panel)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
              }}
            >
              {' '}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                {' '}
                <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '600', fontSize: '15px' }}>
                  {'Mes versions ('}
                  {v.verCount}
                  {')'}
                </span>{' '}
                <button
                  onClick={v.goCreate}
                  style={{
                    height: '28px',
                    padding: '0 10px',
                    border: '1px solid var(--line2)',
                    borderRadius: '999px',
                    background: 'var(--panel)',
                    color: 'var(--tx)',
                    font: 'inherit',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: '0',
                  }}
                >
                  {'+ Nouvelle version vierge'}
                </button>{' '}
              </div>{' '}
              {(v.vers || []).map((v, i69) => (
                <React.Fragment key={i69}>
                  {' '}
                  <div
                    onClick={v?.select}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderBottom: '1px solid var(--line)',
                      background: v?.bg,
                      boxShadow: `inset 3px 0 0 ${v?.mark ?? ''}`,
                      cursor: 'pointer',
                    }}
                  >
                    {' '}
                    <div style={{ flex: '1 1 100%', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {' '}
                      {v?.renaming ? (
                        <>
                          {' '}
                          <input
                            value={v.renameText ?? ''}
                            onChange={v.onRenameText}
                            onKeyDown={v.onRenameKey}
                            onBlur={v.commitRename}
                            autoFocus
                            style={{
                              height: '28px',
                              padding: '0 8px',
                              border: '1px solid var(--ac)',
                              borderRadius: '5px',
                              background: 'var(--panel)',
                              color: 'var(--tx)',
                              font: 'inherit',
                              fontSize: '13px',
                              outline: 'none',
                            }}
                          />{' '}
                        </>
                      ) : null}{' '}
                      {v?.notRenaming ? (
                        <>
                          <span style={{ fontWeight: '500' }}>{v?.name}</span>
                        </>
                      ) : null}{' '}
                      <span style={{ fontSize: '11.5px', color: 'var(--fa)' }}>
                        {'modifiée '}
                        {v?.updated}
                        {' · '}
                        {v?.histCount}
                        {' instantanés'}
                      </span>{' '}
                    </div>{' '}
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '500',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: v?.tagBg,
                        color: v?.tagFg,
                      }}
                    >
                      {v?.tag}
                    </span>{' '}
                    <span
                      style={{
                        width: '48px',
                        textAlign: 'right',
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: '12.5px',
                        fontWeight: '500',
                        color: v?.color,
                      }}
                    >
                      {v?.score}
                    </span>{' '}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginLeft: 'auto' }}>
                      {' '}
                      <button
                        onClick={v?.open}
                        style={{
                          height: '26px',
                          padding: '0 8px',
                          border: '1px solid var(--line2)',
                          borderRadius: '999px',
                          background: 'var(--panel)',
                          color: 'var(--tx)',
                          font: 'inherit',
                          fontSize: '11.5px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: '0',
                        }}
                      >
                        {'Ouvrir'}
                      </button>{' '}
                      <button
                        onClick={v?.rename}
                        style={{
                          height: '26px',
                          padding: '0 8px',
                          border: '1px solid var(--line)',
                          borderRadius: '999px',
                          background: 'var(--panel)',
                          color: 'var(--mu)',
                          font: 'inherit',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: '0',
                        }}
                      >
                        {'Renommer'}
                      </button>{' '}
                      <button
                        onClick={v?.dup}
                        style={{
                          height: '26px',
                          padding: '0 8px',
                          border: '1px solid var(--line)',
                          borderRadius: '999px',
                          background: 'var(--panel)',
                          color: 'var(--mu)',
                          font: 'inherit',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: '0',
                        }}
                      >
                        {'Dupliquer'}
                      </button>{' '}
                      <button
                        onClick={v?.del}
                        style={{
                          height: '26px',
                          padding: '0 8px',
                          border: '1px solid var(--line)',
                          borderRadius: '999px',
                          background: 'var(--panel)',
                          color: 'var(--mu)',
                          font: 'inherit',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          flexShrink: '0',
                        }}
                        className={ps('hover', 'color:var(--er);border-color:var(--er)')}
                      >
                        {'Supprimer'}
                      </button>{' '}
                    </div>{' '}
                  </div>{' '}
                </React.Fragment>
              ))}{' '}
            </div>{' '}
            <div
              style={{
                flex: '0 1 360px',
                minWidth: 'min(100%,290px)',
                background: 'var(--panel)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
              }}
            >
              {' '}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                {' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '0' }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '600', fontSize: '15px' }}>
                    {'Historique'}
                  </span>
                  <span style={{ fontSize: '11.5px', color: 'var(--fa)' }}>{v.histName}</span>
                </div>{' '}
                <button
                  onClick={v.takeSnapshot}
                  style={{
                    height: '28px',
                    padding: '0 10px',
                    border: '1px solid var(--line2)',
                    borderRadius: '999px',
                    background: 'var(--panel)',
                    color: 'var(--tx)',
                    font: 'inherit',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: '0',
                  }}
                >
                  {'Créer un instantané'}
                </button>{' '}
              </div>{' '}
              {(v.hist || []).map((h, i70) => (
                <React.Fragment key={i70}>
                  {' '}
                  <div style={{ display: 'flex', gap: '10px', padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
                    {' '}
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        marginTop: '5px',
                        borderRadius: '50%',
                        background: 'var(--line2)',
                        flex: '0 0 8px',
                      }}
                    ></span>{' '}
                    <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {' '}
                      <span style={{ fontWeight: '500' }}>{h?.label}</span>{' '}
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'var(--fa)' }}>
                        {h?.when}
                        {' · score '}
                        {h?.score}
                      </span>{' '}
                    </div>{' '}
                    <button
                      onClick={h?.restore}
                      style={{
                        alignSelf: 'center',
                        height: '26px',
                        padding: '0 8px',
                        border: '1px solid var(--line2)',
                        borderRadius: '999px',
                        background: 'var(--panel)',
                        color: 'var(--tx)',
                        font: 'inherit',
                        fontSize: '11.5px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        flexShrink: '0',
                      }}
                    >
                      {'Restaurer'}
                    </button>{' '}
                  </div>{' '}
                </React.Fragment>
              ))}{' '}
            </div>{' '}
            <div
              style={{
                flex: '1 1 100%',
                background: 'var(--panel)',
                border: '1px solid var(--line)',
                borderRadius: '20px',
                overflow: 'hidden',
              }}
            >
              {' '}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 18px',
                  borderBottom: '1px solid var(--line)',
                }}
              >
                {' '}
                <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '17px' }}>
                  {'Comparer « '}
                  {v.versionName}
                  {' » avec'}
                </span>{' '}
                <select
                  value={v.diffWith ?? ''}
                  onChange={v.pickDiff}
                  style={{
                    height: '34px',
                    maxWidth: '280px',
                    padding: '0 12px',
                    border: '1px solid var(--line2)',
                    borderRadius: '999px',
                    background: 'var(--panel)',
                    color: 'var(--tx)',
                    fontFamily: "'Instrument Sans',system-ui,sans-serif",
                    fontSize: '12.5px',
                    fontWeight: '600',
                  }}
                >
                  <option value={''}>{'Choisir une version…'}</option>
                  {(v.diffOptions || []).map((o, i71) => (
                    <React.Fragment key={i71}>
                      <option value={o?.id ?? ''}>{o?.name}</option>
                    </React.Fragment>
                  ))}
                </select>{' '}
              </div>{' '}
              {v.diff?.has ? (
                <>
                  {' '}
                  <div
                    style={{ padding: '10px 18px', display: 'flex', gap: '12px', fontSize: '12px', borderBottom: '1px solid var(--line)' }}
                  >
                    <span style={{ color: 'var(--ok)', fontWeight: '700' }}>
                      {'+ '}
                      {v.diff?.add}
                      {' ajoutées'}
                    </span>
                    <span style={{ color: 'var(--er)', fontWeight: '700' }}>
                      {'− '}
                      {v.diff?.del}
                      {' retirées'}
                    </span>
                    <span style={{ color: 'var(--fa)' }}>
                      {v.diff?.same}
                      {' identiques'}
                    </span>
                  </div>{' '}
                  <div
                    style={{
                      maxHeight: '420px',
                      overflow: 'auto',
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: '11.5px',
                      lineHeight: '1.6',
                      padding: '8px 0',
                    }}
                  >
                    {' '}
                    {(v.diff?.lines || []).map((l, i72) => (
                      <React.Fragment key={i72}>
                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            padding: '1px 18px',
                            background: l?.bg,
                            color: l?.fg,
                            textDecoration: l?.deco,
                          }}
                        >
                          <span style={{ width: '12px', flex: '0 0 12px', opacity: '.7' }}>{l?.mark}</span>
                          <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{l?.text}</span>
                        </div>
                      </React.Fragment>
                    ))}{' '}
                  </div>{' '}
                </>
              ) : null}{' '}
              {v.diff?.none ? (
                <>
                  <div style={{ padding: '18px', color: 'var(--mu)' }}>
                    {'Choisissez une version pour voir les lignes ajoutées, retirées et inchangées.'}
                  </div>
                </>
              ) : null}{' '}
            </div>{' '}
          </div>{' '}
        </>
      ) : null}
    </>
  );
}
