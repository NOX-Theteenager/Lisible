import React from 'react';
import { ps } from '../../lib/pseudo.js';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function EditorForm({ v }) {
  return (
    <section style={{ flex: '1 1 380px', minWidth: '0', maxWidth: '600px', display: v.ed?.form, flexDirection: 'column', gap: '14px' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
          {' '}
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--fa)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            {'Étape '}
            {v.stepNum}
            {' sur '}
            {v.stepTotal}
          </span>{' '}
          <span style={{ fontSize: '12px', color: 'var(--mu)' }}>{v.progress?.label}</span>{' '}
        </div>{' '}
        <div style={{ height: '6px', borderRadius: '3px', background: 'var(--sub)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${v.progress?.pct ?? ''}%`,
              background: 'var(--ac)',
              borderRadius: '3px',
              transition: 'width .35s ease',
            }}
          ></div>
        </div>{' '}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {' '}
          {(v.stepper || []).map((st, i6) => (
            <React.Fragment key={i6}>
              {' '}
              <button
                onClick={st?.go}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  height: '32px',
                  padding: '0 12px 0 6px',
                  border: `1px solid ${st?.bd ?? ''}`,
                  borderRadius: '999px',
                  background: st?.bg,
                  color: st?.fg,
                  font: 'inherit',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: '0',
                  transition: 'background .15s',
                }}
              >
                {' '}
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: st?.numBg,
                    color: st?.numFg,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '10.5px',
                    fontWeight: '700',
                  }}
                >
                  {st?.num}
                </span>
                {st?.label}{' '}
              </button>{' '}
            </React.Fragment>
          ))}{' '}
        </div>{' '}
      </div>{' '}
      {v.mini?.show ? (
        <>
          {' '}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {' '}
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', fontWeight: '700', color: v.live?.fg }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: v.live?.dot }}></span>
              {v.mini?.title}
            </span>{' '}
            <div
              data-no-i18n="1"
              style={{
                background: '#ffffff',
                color: '#1a1a1a',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '12px 14px',
                fontFamily: v.tpl?.font,
                fontSize: '12.5px',
                lineHeight: '1.45',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                maxHeight: '190px',
                overflow: 'auto',
              }}
            >
              {(v.mini?.lines || []).map((l, i7) => (
                <React.Fragment key={i7}>
                  <span style={{ fontWeight: l?.fw }}>{l?.text}</span>
                </React.Fragment>
              ))}
            </div>{' '}
          </div>{' '}
        </>
      ) : null}{' '}
      {(v.editorSections || []).map((s, i8) => (
        <React.Fragment key={i8}>
          {' '}
          <div style={{ border: '1px solid var(--line)', borderRadius: '20px', background: 'var(--panel)' }}>
            {' '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '20px 20px 0' }}>
              {' '}
              <span
                style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '24px', fontWeight: '700', letterSpacing: '-0.02em' }}
              >
                {s?.label}
              </span>{' '}
              <span style={{ fontSize: '13px', color: 'var(--mu)', lineHeight: '1.5' }}>{s?.hint}</span>{' '}
            </div>{' '}
            {s?.showBody ? (
              <>
                {' '}
                <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {' '}
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: 'var(--ais)',
                      color: 'var(--tx)',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        flex: '0 0 auto',
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '3px 7px',
                        borderRadius: '999px',
                        background: 'var(--ai)',
                        color: 'var(--aifg)',
                        letterSpacing: '.05em',
                      }}
                    >
                      {'IA'}
                    </span>{' '}
                    <span style={{ fontSize: '12.5px', lineHeight: '1.5' }}>{s?.tip}</span>{' '}
                  </div>{' '}
                  {s?.isContact ? (
                    <>
                      {' '}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '12px',
                          border: '1px dashed var(--line2)',
                          borderRadius: '14px',
                        }}
                      >
                        {' '}
                        <div
                          style={{
                            width: '64px',
                            height: '64px',
                            flex: '0 0 64px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            background: 'var(--sub)',
                            display: 'grid',
                            placeItems: 'center',
                            color: 'var(--fa)',
                            fontSize: '11px',
                          }}
                        >
                          {' '}
                          {v.photo?.has ? (
                            <>
                              <div
                                role="img"
                                aria-label="Photo de profil"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  backgroundPosition: 'center',
                                  backgroundSize: 'cover',
                                  backgroundRepeat: 'no-repeat',
                                  backgroundImage: v.photo?.bg,
                                }}
                              ></div>
                            </>
                          ) : null}{' '}
                          {v.photo?.none ? (
                            <>
                              <span>{'Photo'}</span>
                            </>
                          ) : null}{' '}
                        </div>{' '}
                        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {' '}
                          <span style={{ fontWeight: '600' }}>
                            {'Photo de profil '}
                            <span style={{ fontWeight: '400', color: 'var(--fa)' }}>{'· optionnelle'}</span>
                          </span>{' '}
                          <span style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.45' }}>
                            {'Affichée uniquement dans les modèles Design. Retirée automatiquement des exports ATS.'}
                          </span>{' '}
                        </div>{' '}
                        <label
                          style={{
                            height: '32px',
                            padding: '0 14px',
                            border: '1px solid var(--line2)',
                            borderRadius: '999px',
                            background: 'var(--panel)',
                            fontSize: '12.5px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            whiteSpace: 'nowrap',
                            flexShrink: '0',
                          }}
                        >
                          <input type="file" accept="image/*" onChange={v.onPhoto} style={{ display: 'none' }} />
                          {v.photo?.btn}
                        </label>{' '}
                        {v.photo?.has ? (
                          <>
                            <button
                              onClick={v.removePhoto}
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
                              }}
                              className={ps('hover', 'color:var(--er)')}
                            >
                              {'Retirer'}
                            </button>
                          </>
                        ) : null}{' '}
                      </div>{' '}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,190px),1fr))', gap: '12px' }}>
                        {' '}
                        {(v.contactFields || []).map((f, i9) => (
                          <React.Fragment key={i9}>
                            {' '}
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {' '}
                              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{f?.label}</span>{' '}
                              <input
                                value={f?.value ?? ''}
                                onChange={f?.onChange}
                                placeholder={f?.ph}
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
                                className={ps('focus', 'border-color:var(--ac);box-shadow:0 0 0 4px var(--acs)')}
                              />{' '}
                            </label>{' '}
                          </React.Fragment>
                        ))}{' '}
                      </div>{' '}
                    </>
                  ) : null}{' '}
                  {s?.isSummary ? (
                    <>
                      {' '}
                      <textarea
                        value={v.summary ?? ''}
                        onChange={v.onSummary}
                        onBlur={v.onSummaryBlur}
                        rows="5"
                        placeholder="Développeuse full-stack avec 6 ans d'expérience…"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid var(--line2)',
                          borderRadius: '10px',
                          background: 'var(--panel)',
                          color: 'var(--tx)',
                          font: 'inherit',
                          fontSize: '13px',
                          lineHeight: '1.5',
                          outline: 'none',
                        }}
                        className={ps('focus', 'border-color:var(--ac);box-shadow:0 0 0 4px var(--acs)')}
                      />{' '}
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        {' '}
                        <span style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11.5px', color: v.sumInfo?.color }}>
                            {v.sumInfo?.text}
                          </span>
                          <button
                            onClick={v.reviewSummary}
                            style={{
                              height: '26px',
                              padding: '0 10px',
                              border: '0',
                              borderRadius: '999px',
                              background: v.sumTics?.bg,
                              color: v.sumTics?.fg,
                              font: 'inherit',
                              fontSize: '11.5px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {v.sumTics?.label}
                          </button>
                        </span>{' '}
                        <button
                          onClick={v.toggleSumSug}
                          style={{
                            height: '28px',
                            padding: '0 10px',
                            border: '1px solid var(--line2)',
                            borderRadius: '999px',
                            background: 'var(--panel)',
                            color: 'var(--ac)',
                            font: 'inherit',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flexShrink: '0',
                          }}
                          className={ps('hover', 'background:var(--acs)')}
                        >
                          {'Suggérer une reformulation'}
                        </button>{' '}
                      </div>{' '}
                      {v.sumSugOpen ? (
                        <>
                          {' '}
                          <div
                            style={{
                              border: '1px solid var(--ac)',
                              borderRadius: '8px',
                              background: 'var(--acs)',
                              padding: '12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            {' '}
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: '600',
                                color: 'var(--ac)',
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                              }}
                            >
                              {'Proposition'}
                            </span>{' '}
                            <span style={{ lineHeight: '1.5' }}>{v.sumSugText}</span>{' '}
                            <div style={{ display: 'flex', gap: '6px' }}>
                              {' '}
                              <button
                                onClick={v.useSumSug}
                                style={{
                                  height: '28px',
                                  padding: '0 12px',
                                  border: '1px solid var(--btn)',
                                  borderRadius: '999px',
                                  background: 'var(--btn)',
                                  color: 'var(--btnfg)',
                                  font: 'inherit',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                  flexShrink: '0',
                                }}
                              >
                                {'Remplacer'}
                              </button>{' '}
                              <button
                                onClick={v.toggleSumSug}
                                style={{
                                  height: '28px',
                                  padding: '0 12px',
                                  border: '1px solid var(--line2)',
                                  borderRadius: '999px',
                                  background: 'var(--panel)',
                                  color: 'var(--tx)',
                                  font: 'inherit',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                  flexShrink: '0',
                                }}
                              >
                                {'Ignorer'}
                              </button>{' '}
                            </div>{' '}
                          </div>{' '}
                        </>
                      ) : null}{' '}
                    </>
                  ) : null}{' '}
                  {s?.isExperience ? (
                    <>
                      {' '}
                      {(v.exps || []).map((e, i10) => (
                        <React.Fragment key={i10}>
                          {' '}
                          <div
                            style={{
                              border: '1px solid var(--line)',
                              borderRadius: '16px',
                              padding: '12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                              background: 'var(--sub)',
                            }}
                          >
                            {' '}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                              {' '}
                              <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '600', fontSize: '15px' }}>
                                {e?.heading}
                              </span>{' '}
                              <button
                                onClick={e?.remove}
                                style={{
                                  height: '24px',
                                  padding: '0 8px',
                                  border: '0',
                                  borderRadius: '999px',
                                  background: 'transparent',
                                  color: 'var(--mu)',
                                  font: 'inherit',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                  flexShrink: '0',
                                }}
                                className={ps('hover', 'color:var(--er);background:var(--ers)')}
                              >
                                {'Supprimer'}
                              </button>{' '}
                            </div>{' '}
                            <div
                              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,150px),1fr))', gap: '8px' }}
                            >
                              {' '}
                              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Intitulé du poste'}</span>
                                <input
                                  value={e?.role ?? ''}
                                  onChange={e?.onRole}
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
                              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Entreprise'}</span>
                                <input
                                  value={e?.company ?? ''}
                                  onChange={e?.onCompany}
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
                              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Ville'}</span>
                                <input
                                  value={e?.city ?? ''}
                                  onChange={e?.onCity}
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
                              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Début (MM/AAAA)'}</span>
                                <input
                                  value={e?.start ?? ''}
                                  onChange={e?.onStart}
                                  style={{
                                    width: '100%',
                                    height: '32px',
                                    padding: '0 10px',
                                    border: `1px solid ${e?.startBd ?? ''}`,
                                    borderRadius: '6px',
                                    background: 'var(--panel)',
                                    color: 'var(--tx)',
                                    fontFamily: "'JetBrains Mono',monospace",
                                    fontSize: '12.5px',
                                    outline: 'none',
                                  }}
                                />
                              </label>{' '}
                              <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>
                                  {'Fin (MM/AAAA ou Présent)'}
                                </span>
                                <input
                                  value={e?.end ?? ''}
                                  onChange={e?.onEnd}
                                  style={{
                                    width: '100%',
                                    height: '32px',
                                    padding: '0 10px',
                                    border: `1px solid ${e?.endBd ?? ''}`,
                                    borderRadius: '6px',
                                    background: 'var(--panel)',
                                    color: 'var(--tx)',
                                    fontFamily: "'JetBrains Mono',monospace",
                                    fontSize: '12.5px',
                                    outline: 'none',
                                  }}
                                />
                              </label>{' '}
                            </div>{' '}
                            {e?.dateWarn ? (
                              <>
                                <span style={{ fontSize: '12px', color: 'var(--wa)' }}>
                                  {'Format de date non standard : utilisez MM/AAAA (ex. 09/2019).'}
                                </span>
                              </>
                            ) : null}{' '}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
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
                                {'Réalisations'}
                              </span>{' '}
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', color: 'var(--fa)' }}>
                                {"verbe d'action + action + résultat chiffré"}
                              </span>{' '}
                            </div>{' '}
                            {(e?.bullets || []).map((b, i11) => (
                              <React.Fragment key={i11}>
                                {' '}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {' '}
                                  <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                                    {' '}
                                    <textarea
                                      value={b?.text ?? ''}
                                      onChange={b?.onChange}
                                      onFocus={b?.onFocus}
                                      onBlur={b?.onBlur}
                                      rows="2"
                                      placeholder="Réduit le temps de chargement de 40 % en…"
                                      style={{
                                        flex: '1',
                                        minWidth: '0',
                                        padding: '10px 12px',
                                        border: '1px solid var(--line2)',
                                        borderRadius: '10px',
                                        background: 'var(--panel)',
                                        color: 'var(--tx)',
                                        font: 'inherit',
                                        fontSize: '12.5px',
                                        lineHeight: '1.45',
                                        outline: 'none',
                                      }}
                                      className={ps('focus', 'border-color:var(--ac);box-shadow:0 0 0 4px var(--acs)')}
                                    />{' '}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      {' '}
                                      <button
                                        onClick={b?.toggleSug}
                                        style={{
                                          height: '26px',
                                          padding: '0 8px',
                                          border: '1px solid var(--line2)',
                                          borderRadius: '999px',
                                          background: 'var(--panel)',
                                          color: 'var(--ac)',
                                          font: 'inherit',
                                          fontSize: '11.5px',
                                          fontWeight: '500',
                                          cursor: 'pointer',
                                          whiteSpace: 'nowrap',
                                          flexShrink: '0',
                                        }}
                                        className={ps('hover', 'background:var(--acs)')}
                                      >
                                        {'Suggérer'}
                                      </button>{' '}
                                      <button
                                        onClick={b?.remove}
                                        title="Supprimer la ligne"
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
                                        className={ps('hover', 'color:var(--er)')}
                                      >
                                        {'Retirer'}
                                      </button>{' '}
                                    </div>{' '}
                                  </div>{' '}
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {' '}
                                    {b?.weak ? (
                                      <>
                                        <span
                                          style={{
                                            fontSize: '11px',
                                            padding: '2px 7px',
                                            borderRadius: '4px',
                                            background: 'var(--was)',
                                            color: 'var(--wa)',
                                          }}
                                        >
                                          {"Verbe d'action faible"}
                                        </span>
                                      </>
                                    ) : null}{' '}
                                    {b?.noNum ? (
                                      <>
                                        <span
                                          style={{
                                            fontSize: '11px',
                                            padding: '2px 7px',
                                            borderRadius: '4px',
                                            background: 'var(--was)',
                                            color: 'var(--wa)',
                                          }}
                                        >
                                          {'Résultat non chiffré'}
                                        </span>
                                      </>
                                    ) : null}{' '}
                                    {b?.hasTic ? (
                                      <>
                                        <button
                                          onClick={b?.fixTic}
                                          style={{
                                            font: 'inherit',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            padding: '2px 8px',
                                            border: '0',
                                            borderRadius: '4px',
                                            background: 'var(--ais)',
                                            color: 'var(--ai)',
                                            cursor: 'pointer',
                                          }}
                                        >
                                          {'« '}
                                          {b?.tic}
                                          {' » · corriger'}
                                        </button>
                                      </>
                                    ) : null}{' '}
                                  </div>{' '}
                                  {b?.sugOpen ? (
                                    <>
                                      {' '}
                                      <div
                                        style={{
                                          border: '1px solid var(--ac)',
                                          borderRadius: '8px',
                                          background: 'var(--acs)',
                                          padding: '10px',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '8px',
                                        }}
                                      >
                                        {' '}
                                        {b?.noNum ? (
                                          <>
                                            {' '}
                                            <div
                                              style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px',
                                                padding: '10px',
                                                borderRadius: '10px',
                                                background: 'var(--panel)',
                                                border: '1px solid var(--ai)',
                                              }}
                                            >
                                              {' '}
                                              <span style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
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
                                                </span>
                                                <span style={{ fontWeight: '600', lineHeight: '1.45' }}>{b?.question}</span>
                                              </span>{' '}
                                              <div style={{ display: 'flex', gap: '6px' }}>
                                                <input
                                                  value={b?.mqVal ?? ''}
                                                  onChange={b?.onMq}
                                                  placeholder="ex. 14 services, coûts −30 %"
                                                  style={{
                                                    flex: '1',
                                                    minWidth: '0',
                                                    height: '34px',
                                                    padding: '0 12px',
                                                    border: '1px solid var(--line2)',
                                                    borderRadius: '999px',
                                                    background: 'var(--panel)',
                                                    color: 'var(--tx)',
                                                    font: 'inherit',
                                                    fontSize: '12.5px',
                                                    outline: 'none',
                                                  }}
                                                />
                                                <button
                                                  onClick={b?.useMq}
                                                  style={{
                                                    height: '34px',
                                                    padding: '0 14px',
                                                    border: '0',
                                                    borderRadius: '999px',
                                                    background: 'var(--ai)',
                                                    color: 'var(--aifg)',
                                                    font: 'inherit',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                  }}
                                                >
                                                  {'Intégrer'}
                                                </button>
                                              </div>{' '}
                                              <span style={{ fontSize: '11.5px', color: 'var(--mu)' }}>
                                                {'Aucun chiffre n’est inventé : l’IA reformule avec votre réponse.'}
                                              </span>{' '}
                                            </div>{' '}
                                          </>
                                        ) : null}{' '}
                                        {(b?.alts || []).map((a, i12) => (
                                          <React.Fragment key={i12}>
                                            {' '}
                                            <div
                                              style={{
                                                display: 'flex',
                                                gap: '10px',
                                                alignItems: 'flex-start',
                                                padding: '8px',
                                                borderRadius: '6px',
                                                background: 'var(--panel)',
                                              }}
                                            >
                                              {' '}
                                              <span style={{ flex: '1', lineHeight: '1.45' }}>{a?.text}</span>{' '}
                                              <button
                                                onClick={a?.use}
                                                style={{
                                                  height: '26px',
                                                  padding: '0 10px',
                                                  border: '1px solid var(--btn)',
                                                  borderRadius: '999px',
                                                  background: 'var(--btn)',
                                                  color: 'var(--btnfg)',
                                                  font: 'inherit',
                                                  fontSize: '11.5px',
                                                  fontWeight: '600',
                                                  cursor: 'pointer',
                                                  whiteSpace: 'nowrap',
                                                  flexShrink: '0',
                                                }}
                                              >
                                                {'Utiliser'}
                                              </button>{' '}
                                            </div>{' '}
                                          </React.Fragment>
                                        ))}{' '}
                                        {b?.sugLoading ? (
                                          <>
                                            <span style={{ color: 'var(--mu)' }}>{'L’IA prépare deux reformulations…'}</span>
                                          </>
                                        ) : null}{' '}
                                        {b?.noAlts ? (
                                          <>
                                            <span style={{ color: 'var(--mu)' }}>
                                              {"Formulation déjà conforme : verbe d'action et résultat chiffré."}
                                            </span>
                                          </>
                                        ) : null}{' '}
                                        <span style={{ fontSize: '11.5px', color: 'var(--mu)' }}>
                                          {
                                            'Vérifiez chaque chiffre : il doit refléter un résultat réel. Les crochets [X] sont à compléter.'
                                          }
                                        </span>{' '}
                                      </div>{' '}
                                    </>
                                  ) : null}{' '}
                                </div>{' '}
                              </React.Fragment>
                            ))}{' '}
                            <button
                              onClick={e?.addBullet}
                              style={{
                                alignSelf: 'flex-start',
                                height: '28px',
                                padding: '0 10px',
                                border: '1px dashed var(--line2)',
                                borderRadius: '999px',
                                background: 'transparent',
                                color: 'var(--mu)',
                                font: 'inherit',
                                fontSize: '12px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: '0',
                              }}
                              className={ps('hover', 'color:var(--tx);border-color:var(--mu)')}
                            >
                              {'+ Ajouter une réalisation'}
                            </button>{' '}
                          </div>{' '}
                        </React.Fragment>
                      ))}{' '}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {' '}
                        <button
                          onClick={v.addExp}
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
                          className={ps('hover', 'background:var(--sub)')}
                        >
                          {'+ Ajouter une expérience'}
                        </button>{' '}
                        <button
                          onClick={v.toggleLib}
                          style={{
                            height: '30px',
                            padding: '0 12px',
                            border: '1px solid var(--line2)',
                            borderRadius: '999px',
                            background: 'var(--panel)',
                            color: 'var(--ac)',
                            font: 'inherit',
                            fontSize: '12.5px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flexShrink: '0',
                          }}
                          className={ps('hover', 'background:var(--acs)')}
                        >
                          {v.libLabel}
                        </button>{' '}
                      </div>{' '}
                      {v.libOpen ? (
                        <>
                          {' '}
                          <div
                            style={{
                              border: '1px solid var(--line)',
                              borderRadius: '16px',
                              padding: '12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            {' '}
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                              }}
                            >
                              {' '}
                              <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '600', fontSize: '15px' }}>
                                {'Bibliothèque de formulations'}
                              </span>{' '}
                              <span style={{ fontSize: '11.5px', color: 'var(--fa)' }}>
                                {'Insertion dans : '}
                                {v.libTarget}
                              </span>{' '}
                            </div>{' '}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {' '}
                              {(v.sectors || []).map((sc, i13) => (
                                <React.Fragment key={i13}>
                                  {' '}
                                  <button
                                    onClick={sc?.go}
                                    style={{
                                      height: '26px',
                                      padding: '0 10px',
                                      border: `1px solid ${sc?.bd ?? ''}`,
                                      borderRadius: '13px',
                                      background: sc?.bg,
                                      color: sc?.fg,
                                      font: 'inherit',
                                      fontSize: '12px',
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      flexShrink: '0',
                                    }}
                                  >
                                    {sc?.label}
                                  </button>{' '}
                                </React.Fragment>
                              ))}{' '}
                            </div>{' '}
                            {(v.phrases || []).map((ph, i14) => (
                              <React.Fragment key={i14}>
                                {' '}
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: '10px',
                                    alignItems: 'flex-start',
                                    padding: '8px 10px',
                                    border: '1px solid var(--line)',
                                    borderRadius: '6px',
                                  }}
                                >
                                  {' '}
                                  <span style={{ flex: '1', lineHeight: '1.45' }}>{ph?.text}</span>{' '}
                                  <button
                                    onClick={ph?.insert}
                                    style={{
                                      height: '26px',
                                      padding: '0 10px',
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
                                    className={ps('hover', 'background:var(--sub)')}
                                  >
                                    {'Insérer'}
                                  </button>{' '}
                                </div>{' '}
                              </React.Fragment>
                            ))}{' '}
                            <span
                              style={{
                                fontSize: '11.5px',
                                fontWeight: '600',
                                color: 'var(--mu)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {"Verbes d'action — cliquer pour copier"}
                            </span>{' '}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {' '}
                              {(v.verbs || []).map((vb, i15) => (
                                <React.Fragment key={i15}>
                                  {' '}
                                  <button
                                    onClick={vb?.copy}
                                    style={{
                                      height: '24px',
                                      padding: '0 8px',
                                      border: '1px solid var(--line)',
                                      borderRadius: '4px',
                                      background: 'var(--sub)',
                                      color: 'var(--tx)',
                                      fontFamily: "'JetBrains Mono',monospace",
                                      fontSize: '11.5px',
                                      cursor: 'pointer',
                                      whiteSpace: 'nowrap',
                                      flexShrink: '0',
                                    }}
                                    className={ps('hover', 'border-color:var(--ac)')}
                                  >
                                    {vb?.label}
                                  </button>{' '}
                                </React.Fragment>
                              ))}{' '}
                            </div>{' '}
                          </div>{' '}
                        </>
                      ) : null}{' '}
                    </>
                  ) : null}{' '}
                  {s?.isEducation ? (
                    <>
                      {' '}
                      {(v.edus || []).map((d, i16) => (
                        <React.Fragment key={i16}>
                          {' '}
                          <div
                            style={{
                              border: '1px solid var(--line)',
                              borderRadius: '16px',
                              padding: '12px',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,150px),1fr))',
                              gap: '8px',
                              background: 'var(--sub)',
                            }}
                          >
                            {' '}
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: '1/-1' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Diplôme'}</span>
                              <input
                                value={d?.degree ?? ''}
                                onChange={d?.onDegree}
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
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Établissement'}</span>
                              <input
                                value={d?.school ?? ''}
                                onChange={d?.onSchool}
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
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Ville'}</span>
                              <input
                                value={d?.city ?? ''}
                                onChange={d?.onCity}
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
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Début'}</span>
                              <input
                                value={d?.start ?? ''}
                                onChange={d?.onStart}
                                style={{
                                  width: '100%',
                                  height: '38px',
                                  padding: '0 12px',
                                  border: '1px solid var(--line2)',
                                  borderRadius: '10px',
                                  background: 'var(--panel)',
                                  color: 'var(--tx)',
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: '12.5px',
                                  outline: 'none',
                                }}
                              />
                            </label>{' '}
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Fin'}</span>
                              <input
                                value={d?.end ?? ''}
                                onChange={d?.onEnd}
                                style={{
                                  width: '100%',
                                  height: '38px',
                                  padding: '0 12px',
                                  border: '1px solid var(--line2)',
                                  borderRadius: '10px',
                                  background: 'var(--panel)',
                                  color: 'var(--tx)',
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: '12.5px',
                                  outline: 'none',
                                }}
                              />
                            </label>{' '}
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: '1/-1' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Précisions (optionnel)'}</span>
                              <input
                                value={d?.details ?? ''}
                                onChange={d?.onDetails}
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
                            <button
                              onClick={d?.remove}
                              style={{
                                justifySelf: 'start',
                                height: '24px',
                                padding: '0 8px',
                                border: '0',
                                borderRadius: '999px',
                                background: 'transparent',
                                color: 'var(--mu)',
                                font: 'inherit',
                                fontSize: '12px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: '0',
                              }}
                              className={ps('hover', 'color:var(--er)')}
                            >
                              {'Supprimer cette formation'}
                            </button>{' '}
                          </div>{' '}
                        </React.Fragment>
                      ))}{' '}
                      <button
                        onClick={v.addEdu}
                        style={{
                          alignSelf: 'flex-start',
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
                        {'+ Ajouter une formation'}
                      </button>{' '}
                    </>
                  ) : null}{' '}
                  {s?.isSkills ? (
                    <>
                      {' '}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {' '}
                        {(v.skillChips || []).map((k, i17) => (
                          <React.Fragment key={i17}>
                            {' '}
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                height: '26px',
                                padding: '0 4px 0 10px',
                                border: '1px solid var(--line2)',
                                borderRadius: '13px',
                                background: 'var(--sub)',
                                fontSize: '12.5px',
                                whiteSpace: 'nowrap',
                                flexShrink: '0',
                              }}
                            >
                              {k?.label}
                              <button
                                onClick={k?.remove}
                                style={{
                                  width: '18px',
                                  height: '18px',
                                  border: '0',
                                  borderRadius: '50%',
                                  background: 'transparent',
                                  color: 'var(--fa)',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  lineHeight: '1',
                                }}
                                className={ps('hover', 'background:var(--ers);color:var(--er)')}
                              >
                                {'×'}
                              </button>
                            </span>{' '}
                          </React.Fragment>
                        ))}{' '}
                      </div>{' '}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {' '}
                        <input
                          value={v.skillDraft ?? ''}
                          onChange={v.onSkillDraft}
                          onKeyDown={v.onSkillKey}
                          placeholder="Ajouter une compétence puis Entrée"
                          style={{
                            flex: '1',
                            minWidth: '0',
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
                          className={ps('focus', 'border-color:var(--ac);box-shadow:0 0 0 4px var(--acs)')}
                        />{' '}
                        <button
                          onClick={v.addSkill}
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
                          {'Ajouter'}
                        </button>{' '}
                      </div>{' '}
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '11.5px', color: v.skillInfo?.color }}>
                        {v.skillInfo?.text}
                      </span>{' '}
                      {v.hasSkillSugs ? (
                        <>
                          {' '}
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                            {' '}
                            <span style={{ fontSize: '12px', color: 'var(--mu)' }}>{'Fréquentes pour votre poste :'}</span>{' '}
                            {(v.skillSugs || []).map((k, i18) => (
                              <React.Fragment key={i18}>
                                {' '}
                                <button
                                  onClick={k?.add}
                                  style={{
                                    height: '24px',
                                    padding: '0 9px',
                                    border: '1px dashed var(--line2)',
                                    borderRadius: '12px',
                                    background: 'transparent',
                                    color: 'var(--ac)',
                                    font: 'inherit',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    flexShrink: '0',
                                  }}
                                  className={ps('hover', 'background:var(--acs)')}
                                >
                                  {'+ '}
                                  {k?.label}
                                </button>{' '}
                              </React.Fragment>
                            ))}{' '}
                          </div>{' '}
                        </>
                      ) : null}{' '}
                    </>
                  ) : null}{' '}
                  {s?.isLanguages ? (
                    <>
                      {' '}
                      {(v.langs || []).map((l, i19) => (
                        <React.Fragment key={i19}>
                          {' '}
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {' '}
                            <input
                              value={l?.name ?? ''}
                              onChange={l?.onName}
                              placeholder="Langue"
                              style={{
                                flex: '1',
                                minWidth: '0',
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
                            />{' '}
                            <select
                              value={l?.level ?? ''}
                              onChange={l?.onLevel}
                              style={{
                                flex: '1',
                                minWidth: '0',
                                height: '32px',
                                padding: '0 8px',
                                border: '1px solid var(--line2)',
                                borderRadius: '6px',
                                background: 'var(--panel)',
                                color: 'var(--tx)',
                                fontFamily: "'Instrument Sans',system-ui,sans-serif",
                                fontSize: '13px',
                              }}
                            >
                              {(v.levelOpts || []).map((lv, i20) => (
                                <React.Fragment key={i20}>
                                  <option value={lv ?? ''}>{lv}</option>
                                </React.Fragment>
                              ))}
                            </select>{' '}
                            <button
                              onClick={l?.remove}
                              style={{
                                height: '32px',
                                padding: '0 10px',
                                border: '1px solid var(--line)',
                                borderRadius: '999px',
                                background: 'var(--panel)',
                                color: 'var(--mu)',
                                font: 'inherit',
                                fontSize: '12px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: '0',
                              }}
                              className={ps('hover', 'color:var(--er)')}
                            >
                              {'Retirer'}
                            </button>{' '}
                          </div>{' '}
                        </React.Fragment>
                      ))}{' '}
                      <button
                        onClick={v.addLang}
                        style={{
                          alignSelf: 'flex-start',
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
                        {'+ Ajouter une langue'}
                      </button>{' '}
                    </>
                  ) : null}{' '}
                  {s?.isProjects ? (
                    <>
                      {' '}
                      {(v.projs || []).map((p, i21) => (
                        <React.Fragment key={i21}>
                          {' '}
                          <div
                            style={{
                              border: '1px solid var(--line)',
                              borderRadius: '16px',
                              padding: '12px',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,180px),1fr))',
                              gap: '8px',
                              background: 'var(--sub)',
                            }}
                          >
                            {' '}
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Nom du projet'}</span>
                              <input
                                value={p?.name ?? ''}
                                onChange={p?.onName}
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
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Lien (texte brut)'}</span>
                              <input
                                value={p?.link ?? ''}
                                onChange={p?.onLink}
                                style={{
                                  width: '100%',
                                  height: '38px',
                                  padding: '0 12px',
                                  border: '1px solid var(--line2)',
                                  borderRadius: '10px',
                                  background: 'var(--panel)',
                                  color: 'var(--tx)',
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: '12px',
                                  outline: 'none',
                                }}
                              />
                            </label>{' '}
                            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', gridColumn: '1/-1' }}>
                              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--mu)' }}>{'Description'}</span>
                              <textarea
                                value={p?.desc ?? ''}
                                onChange={p?.onDesc}
                                rows="2"
                                style={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  border: '1px solid var(--line2)',
                                  borderRadius: '10px',
                                  background: 'var(--panel)',
                                  color: 'var(--tx)',
                                  font: 'inherit',
                                  fontSize: '12.5px',
                                  lineHeight: '1.45',
                                  outline: 'none',
                                }}
                              />
                            </label>{' '}
                            <button
                              onClick={p?.remove}
                              style={{
                                justifySelf: 'start',
                                height: '24px',
                                padding: '0 8px',
                                border: '0',
                                borderRadius: '999px',
                                background: 'transparent',
                                color: 'var(--mu)',
                                font: 'inherit',
                                fontSize: '12px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: '0',
                              }}
                              className={ps('hover', 'color:var(--er)')}
                            >
                              {'Supprimer ce projet'}
                            </button>{' '}
                          </div>{' '}
                        </React.Fragment>
                      ))}{' '}
                      <button
                        onClick={v.addProj}
                        style={{
                          alignSelf: 'flex-start',
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
                        {'+ Ajouter un projet'}
                      </button>{' '}
                    </>
                  ) : null}{' '}
                  {s?.isCertifications ? (
                    <>
                      {' '}
                      {(v.certs || []).map((c, i22) => (
                        <React.Fragment key={i22}>
                          {' '}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,130px),1fr))',
                              paddingBottom: '8px',
                              borderBottom: '1px solid var(--line)',
                              gap: '6px',
                              alignItems: 'center',
                            }}
                          >
                            {' '}
                            <input
                              value={c?.name ?? ''}
                              onChange={c?.onName}
                              placeholder="Intitulé exact"
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
                            />{' '}
                            <input
                              value={c?.issuer ?? ''}
                              onChange={c?.onIssuer}
                              placeholder="Organisme"
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
                            />{' '}
                            <input
                              value={c?.date ?? ''}
                              onChange={c?.onDate}
                              placeholder="MM/AAAA"
                              style={{
                                width: '100%',
                                height: '38px',
                                padding: '0 12px',
                                border: '1px solid var(--line2)',
                                borderRadius: '10px',
                                background: 'var(--panel)',
                                color: 'var(--tx)',
                                fontFamily: "'JetBrains Mono',monospace",
                                fontSize: '12.5px',
                                outline: 'none',
                              }}
                            />{' '}
                            <button
                              onClick={c?.remove}
                              style={{
                                height: '32px',
                                padding: '0 10px',
                                border: '1px solid var(--line)',
                                borderRadius: '999px',
                                background: 'var(--panel)',
                                color: 'var(--mu)',
                                font: 'inherit',
                                fontSize: '12px',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                flexShrink: '0',
                              }}
                              className={ps('hover', 'color:var(--er)')}
                            >
                              {'Retirer'}
                            </button>{' '}
                          </div>{' '}
                        </React.Fragment>
                      ))}{' '}
                      <button
                        onClick={v.addCert}
                        style={{
                          alignSelf: 'flex-start',
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
                        {'+ Ajouter une certification'}
                      </button>{' '}
                    </>
                  ) : null}{' '}
                </div>{' '}
              </>
            ) : null}{' '}
          </div>{' '}
        </React.Fragment>
      ))}{' '}
      {v.hasStepNav ? (
        <>
          {' '}
          <div
            style={{
              position: 'sticky',
              bottom: v.lay?.stickyB,
              zIndex: '4',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '8px',
              padding: '10px',
              border: '1px solid var(--line)',
              borderRadius: '999px',
              background: 'var(--panel)',
              boxShadow: '0 10px 30px -16px rgba(28,25,21,.35)',
            }}
          >
            {' '}
            <button
              onClick={v.prevStep}
              style={{
                height: '36px',
                padding: '0 16px',
                border: '1px solid var(--line2)',
                borderRadius: '999px',
                background: 'var(--panel)',
                color: 'var(--tx)',
                font: 'inherit',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                opacity: v.prevOp,
                whiteSpace: 'nowrap',
              }}
            >
              {'← Précédent'}
            </button>{' '}
            <span
              style={{
                fontSize: '12px',
                color: 'var(--fa)',
                textAlign: 'center',
                minWidth: '0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {v.stepNum}
              {' / '}
              {v.stepTotal}
            </span>{' '}
            <button
              onClick={v.nextStep}
              style={{
                minHeight: '36px',
                padding: '6px 18px',
                minWidth: 0,
                maxWidth: '100%',
                lineHeight: 1.25,
                border: '0',
                borderRadius: '999px',
                background: 'var(--ac)',
                color: '#ffffff',
                font: 'inherit',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'normal',
                textAlign: 'center',
                transition: 'transform .15s',
              }}
              className={ps('hover', 'transform:translateY(-1px)')}
            >
              {v.nextLabel}
            </button>{' '}
          </div>{' '}
        </>
      ) : null}{' '}
    </section>
  );
}
