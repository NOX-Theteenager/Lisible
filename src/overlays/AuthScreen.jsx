import React from 'react';
import { ps } from '../lib/pseudo.js';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function AuthScreen({ v }) {
  return (
    <>
      {v.au?.show ? (
        <>
          {' '}
          <div
            data-screen-label="Connexion"
            style={{
              position: 'fixed',
              inset: '0',
              zIndex: '90',
              background: 'var(--bg)',
              overflow: 'auto',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {' '}
            <div
              style={{
                flex: '1 1 420px',
                minHeight: v.au?.sideH,
                background: 'var(--ink)',
                color: 'var(--inkfg)',
                padding: 'clamp(24px,5vw,56px)',
                display: v.au?.side,
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '28px',
              }}
            >
              {' '}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: '40px',
                    height: '40px',
                    flex: '0 0 40px',
                    borderRadius: '12px',
                    background: 'var(--ac)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: '6px',
                    gap: '2px',
                  }}
                >
                  <span style={{ width: '5px', height: '22px', borderRadius: '2px', background: '#ffffff' }}></span>
                  <span style={{ width: '5px', height: '5px', borderRadius: '2px', background: '#1c1915' }}></span>
                </div>
                <span
                  style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '26px', letterSpacing: '-0.03em' }}
                >
                  {'lisible'}
                  <span style={{ color: 'var(--ac)' }}>{'.'}</span>
                </span>
              </div>{' '}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>
                {' '}
                <h2
                  style={{
                    margin: '0',
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                    fontSize: 'clamp(30px,4.4vw,46px)',
                    lineHeight: '1.02',
                    fontWeight: '700',
                    letterSpacing: '-0.035em',
                    textWrap: 'balance',
                  }}
                >
                  {'Lu par les robots, choisi par les humains.'}
                </h2>{' '}
                <p style={{ margin: '0', opacity: '.7', fontSize: '15px', lineHeight: '1.55', textWrap: 'pretty' }}>
                  {'Des CV conformes aux ATS, adaptés à chaque offre et écrits dans une langue naturelle.'}
                </p>{' '}
              </div>{' '}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {' '}
                <span style={{ padding: '7px 12px', borderRadius: '999px', background: 'rgba(255,255,255,.08)', fontSize: '12.5px' }}>
                  {'Score ATS en direct'}
                </span>{' '}
                <span style={{ padding: '7px 12px', borderRadius: '999px', background: 'rgba(255,255,255,.08)', fontSize: '12.5px' }}>
                  {'Adaptation à une offre'}
                </span>{' '}
                <span style={{ padding: '7px 12px', borderRadius: '999px', background: 'rgba(255,255,255,.08)', fontSize: '12.5px' }}>
                  {'Export Word, PDF, TXT'}
                </span>{' '}
              </div>{' '}
            </div>{' '}
            <div
              style={{
                flex: '1 1 420px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(20px,5vw,48px)',
              }}
            >
              {' '}
              <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {' '}
                <div style={{ display: v.au?.monoTop, alignItems: 'center', gap: '10px' }}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: '36px',
                      height: '36px',
                      flex: '0 0 36px',
                      borderRadius: '11px',
                      background: 'var(--ac)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      paddingBottom: '6px',
                      gap: '1px',
                    }}
                  >
                    <span style={{ width: '5px', height: '20px', borderRadius: '2px', background: '#ffffff' }}></span>
                    <span style={{ width: '5px', height: '5px', borderRadius: '1px', background: '#1c1915' }}></span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Bricolage Grotesque',sans-serif",
                      fontWeight: '700',
                      fontSize: '23px',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {'lisible'}
                    <span style={{ color: 'var(--ac)' }}>{'.'}</span>
                  </span>
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h1
                    style={{
                      margin: '0',
                      fontFamily: "'Bricolage Grotesque',sans-serif",
                      fontSize: '28px',
                      fontWeight: '700',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {v.au?.title}
                  </h1>
                  <span style={{ color: 'var(--mu)', fontSize: '14px' }}>{v.au?.sub}</span>
                </div>{' '}
                {v.au?.isForm ? (
                  <>
                    {' '}
                    <button
                      onClick={v.au?.google}
                      style={{
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        border: '1px solid var(--line2)',
                        borderRadius: '12px',
                        background: 'var(--panel)',
                        color: 'var(--tx)',
                        font: 'inherit',
                        fontSize: '14.5px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                      className={ps('hover', 'border-color:var(--tx)')}
                    >
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          border: '2px solid var(--tx)',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '12px',
                          fontWeight: '800',
                          lineHeight: '1',
                        }}
                      >
                        {'G'}
                      </span>
                      {'Continuer avec Google'}
                    </button>{' '}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--fa)', fontSize: '12px' }}>
                      <span style={{ flex: '1', height: '1px', background: 'var(--line)' }}></span>
                      {'ou avec votre e-mail'}
                      <span style={{ flex: '1', height: '1px', background: 'var(--line)' }}></span>
                    </div>{' '}
                    {v.au?.isUp ? (
                      <>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--mu)' }}>{'Prénom et nom'}</span>
                          <input
                            value={v.au?.name ?? ''}
                            onChange={v.au?.onName}
                            type="text"
                            placeholder="Camille Moreau"
                            autoComplete="name"
                            style={{
                              width: '100%',
                              height: '46px',
                              padding: '0 14px',
                              border: `1px solid ${v.au?.bd ?? ''}`,
                              borderRadius: '12px',
                              background: 'var(--panel)',
                              color: 'var(--tx)',
                              font: 'inherit',
                              fontSize: '15px',
                              outline: 'none',
                            }}
                            className={ps('focus', 'border-color:var(--ac);box-shadow:0 0 0 4px var(--acs)')}
                          />
                        </label>
                      </>
                    ) : null}{' '}
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--mu)' }}>{'Adresse e-mail'}</span>
                      <input
                        value={v.au?.email ?? ''}
                        onChange={v.au?.onEmail}
                        type="email"
                        placeholder="vous@email.fr"
                        autoComplete="email"
                        style={{
                          width: '100%',
                          height: '46px',
                          padding: '0 14px',
                          border: `1px solid ${v.au?.bd ?? ''}`,
                          borderRadius: '12px',
                          background: 'var(--panel)',
                          color: 'var(--tx)',
                          font: 'inherit',
                          fontSize: '15px',
                          outline: 'none',
                        }}
                        className={ps('focus', 'border-color:var(--ac);box-shadow:0 0 0 4px var(--acs)')}
                      />
                    </label>{' '}
                    {v.au?.needPw ? (
                      <>
                        {' '}
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {' '}
                          <span style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--mu)' }}>{'Mot de passe'}</span>
                            {v.au?.isIn ? (
                              <>
                                <button
                                  onClick={v.au?.toForgot}
                                  style={{
                                    border: '0',
                                    background: 'transparent',
                                    padding: '0',
                                    color: 'var(--act)',
                                    font: 'inherit',
                                    fontSize: '12.5px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {'Mot de passe oublié ?'}
                                </button>
                              </>
                            ) : null}
                          </span>{' '}
                          <span style={{ position: 'relative', display: 'block' }}>
                            <input
                              value={v.au?.pw ?? ''}
                              onChange={v.au?.onPw}
                              type={v.au?.pwType}
                              placeholder="••••••••"
                              autoComplete={v.au?.pwAc}
                              style={{
                                width: '100%',
                                height: '46px',
                                padding: '0 14px',
                                border: `1px solid ${v.au?.bd ?? ''}`,
                                borderRadius: '12px',
                                background: 'var(--panel)',
                                color: 'var(--tx)',
                                font: 'inherit',
                                fontSize: '15px',
                                outline: 'none',
                                paddingRight: '96px',
                              }}
                              className={ps('focus', 'border-color:var(--ac);box-shadow:0 0 0 4px var(--acs)')}
                            />
                            <button
                              onClick={v.au?.togglePw}
                              style={{
                                position: 'absolute',
                                right: '6px',
                                top: '7px',
                                height: '32px',
                                padding: '0 12px',
                                border: '0',
                                borderRadius: '8px',
                                background: 'var(--sub)',
                                color: 'var(--tx)',
                                font: 'inherit',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              {v.au?.pwBtn}
                            </button>
                          </span>{' '}
                        </label>{' '}
                        {v.au?.isUp ? (
                          <>
                            {' '}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '4px' }}>
                                {(v.au?.bars || []).map((b, i84) => (
                                  <React.Fragment key={i84}>
                                    <span
                                      style={{ height: '4px', borderRadius: '2px', background: b?.bg, transition: 'background .2s' }}
                                    ></span>
                                  </React.Fragment>
                                ))}
                              </div>
                              <span style={{ fontSize: '12px', color: v.au?.strColor }}>{v.au?.strLabel}</span>
                            </div>{' '}
                          </>
                        ) : null}{' '}
                      </>
                    ) : null}{' '}
                    {v.au?.hasErr ? (
                      <>
                        <div
                          role="alert"
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: 'var(--ers)',
                            color: 'var(--er)',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          {v.au?.err}
                        </div>
                      </>
                    ) : null}{' '}
                    {v.au?.hasInfo ? (
                      <>
                        <div
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: 'var(--oks)',
                            color: 'var(--ok)',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          {v.au?.info}
                        </div>
                      </>
                    ) : null}{' '}
                    <button
                      onClick={v.au?.submit}
                      style={{
                        height: '48px',
                        border: '0',
                        borderRadius: '12px',
                        background: 'var(--ac)',
                        color: '#ffffff',
                        font: 'inherit',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        opacity: v.au?.btnOp,
                      }}
                    >
                      {v.au?.btn}
                    </button>{' '}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '13.5px',
                        color: 'var(--mu)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span>{v.au?.switchTxt}</span>
                      <button
                        onClick={v.au?.switchGo}
                        style={{
                          border: '0',
                          background: 'transparent',
                          padding: '0',
                          color: 'var(--act)',
                          font: 'inherit',
                          fontSize: '13.5px',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                      >
                        {v.au?.switchBtn}
                      </button>
                    </div>{' '}
                  </>
                ) : null}{' '}
                {v.au?.isNewPw ? (
                  <>
                    {' '}
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--mu)' }}>{'Nouveau mot de passe'}</span>
                      <input
                        value={v.au?.pw ?? ''}
                        onChange={v.au?.onPw}
                        type={v.au?.pwType}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        style={{
                          width: '100%',
                          height: '46px',
                          padding: '0 14px',
                          border: `1px solid ${v.au?.bd ?? ''}`,
                          borderRadius: '12px',
                          background: 'var(--panel)',
                          color: 'var(--tx)',
                          font: 'inherit',
                          fontSize: '15px',
                          outline: 'none',
                        }}
                        className={ps('focus', 'border-color:var(--ac);box-shadow:0 0 0 4px var(--acs)')}
                      />
                    </label>{' '}
                    {v.au?.hasErr ? (
                      <>
                        <div
                          role="alert"
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: 'var(--ers)',
                            color: 'var(--er)',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          {v.au?.err}
                        </div>
                      </>
                    ) : null}{' '}
                    {v.au?.hasInfo ? (
                      <>
                        <div
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: 'var(--oks)',
                            color: 'var(--ok)',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          {v.au?.info}
                        </div>
                      </>
                    ) : null}{' '}
                    <button
                      onClick={v.au?.savePw}
                      style={{
                        height: '48px',
                        border: '0',
                        borderRadius: '12px',
                        background: 'var(--ac)',
                        color: '#ffffff',
                        font: 'inherit',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        opacity: v.au?.btnOp,
                      }}
                    >
                      {v.au?.savePwBtn}
                    </button>{' '}
                  </>
                ) : null}{' '}
                {v.au?.isForgot ? (
                  <>
                    {' '}
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--mu)' }}>{'Adresse e-mail du compte'}</span>
                      <input
                        value={v.au?.email ?? ''}
                        onChange={v.au?.onEmail}
                        type="email"
                        placeholder="vous@email.fr"
                        autoComplete="email"
                        style={{
                          width: '100%',
                          height: '46px',
                          padding: '0 14px',
                          border: `1px solid ${v.au?.bd ?? ''}`,
                          borderRadius: '12px',
                          background: 'var(--panel)',
                          color: 'var(--tx)',
                          font: 'inherit',
                          fontSize: '15px',
                          outline: 'none',
                        }}
                        className={ps('focus', 'border-color:var(--ac);box-shadow:0 0 0 4px var(--acs)')}
                      />
                    </label>{' '}
                    {v.au?.hasErr ? (
                      <>
                        <div
                          role="alert"
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: 'var(--ers)',
                            color: 'var(--er)',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          {v.au?.err}
                        </div>
                      </>
                    ) : null}{' '}
                    {v.au?.hasInfo ? (
                      <>
                        <div
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: 'var(--oks)',
                            color: 'var(--ok)',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          {v.au?.info}
                        </div>
                      </>
                    ) : null}{' '}
                    <button
                      onClick={v.au?.sendReset}
                      style={{
                        height: '48px',
                        border: '0',
                        borderRadius: '12px',
                        background: 'var(--ac)',
                        color: '#ffffff',
                        font: 'inherit',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        opacity: v.au?.btnOp,
                      }}
                    >
                      {v.au?.resetBtn}
                    </button>{' '}
                    <button
                      onClick={v.au?.back}
                      style={{
                        alignSelf: 'flex-start',
                        border: '0',
                        background: 'transparent',
                        padding: '0',
                        color: 'var(--mu)',
                        font: 'inherit',
                        fontSize: '13.5px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      {'← Retour à la connexion'}
                    </button>{' '}
                  </>
                ) : null}{' '}
                <button
                  onClick={v.au?.guest}
                  style={{
                    alignSelf: 'center',
                    marginTop: '6px',
                    border: '0',
                    background: 'transparent',
                    padding: '6px',
                    color: 'var(--mu)',
                    font: 'inherit',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  {'Continuer sans compte'}
                </button>{' '}
                <span style={{ textAlign: 'center', fontSize: '11.5px', color: 'var(--fa)', lineHeight: '1.5' }}>
                  {'Sans compte, vos CV restent dans ce navigateur. En vous inscrivant, vous acceptez les '}
                  <a href="/conditions" target="_blank" rel="noopener">
                    {'conditions d’utilisation'}
                  </a>
                  {' et la '}
                  <a href="/confidentialite" target="_blank" rel="noopener">
                    {'politique de confidentialité'}
                  </a>
                  {'. Service réservé aux personnes de 15 ans et plus.'}
                </span>{' '}
              </div>{' '}
            </div>{' '}
          </div>
        </>
      ) : null}
    </>
  );
}
