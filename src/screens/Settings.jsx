import React from 'react';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Settings({ v }) {
  return (
    <>
      {v.isSettings ? (
        <>
          {' '}
          <div
            data-screen-label="Paramètres"
            style={{
              padding: '22px clamp(12px,3.5vw,24px) 48px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,360px),1fr))',
              gap: '18px',
              alignItems: 'start',
              maxWidth: '1180px',
              width: '100%',
            }}
          >
            {' '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {' '}
              <div
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {' '}
                <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '18px' }}>{'Compte'}</span>{' '}
                {v.acct?.out ? (
                  <>
                    {' '}
                    <span style={{ fontSize: '13px', color: 'var(--mu)', lineHeight: '1.5' }}>
                      {'Connectez-vous pour retrouver vos CV sur tous vos appareils. Sans compte, tout reste dans ce navigateur.'}
                    </span>{' '}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={v.openAuthIn}
                        style={{
                          height: '40px',
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
                        {'Se connecter'}
                      </button>
                      <button
                        onClick={v.openAuthUp}
                        style={{
                          height: '40px',
                          padding: '0 18px',
                          border: '1px solid var(--line2)',
                          borderRadius: '999px',
                          background: 'var(--panel)',
                          color: 'var(--tx)',
                          font: 'inherit',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {'Créer un compte'}
                      </button>
                    </div>{' '}
                  </>
                ) : null}{' '}
                {v.acct?.in ? (
                  <>
                    {' '}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '14px',
                        background: 'var(--sub)',
                      }}
                    >
                      <span
                        style={{
                          width: '44px',
                          height: '44px',
                          flex: '0 0 44px',
                          borderRadius: '50%',
                          background: 'var(--ac)',
                          color: '#ffffff',
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: '800',
                          fontSize: '16px',
                        }}
                      >
                        {v.acct?.initial}
                      </span>
                      <span style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                        <span style={{ fontWeight: '700' }}>{v.acct?.name}</span>
                        <span style={{ fontSize: '12.5px', color: 'var(--mu)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {v.acct?.email}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--ok)', fontWeight: '600' }}>
                          {v.acct?.providerLabel}
                          {' · '}
                          {v.acct?.sync}
                        </span>
                      </span>
                      <button
                        onClick={v.acct?.logout}
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
                        {'Déconnexion'}
                      </button>
                    </div>{' '}
                    {v.acct?.isEmail ? (
                      <>
                        <button
                          onClick={v.acct?.reset}
                          style={{
                            alignSelf: 'flex-start',
                            height: '32px',
                            padding: '0 14px',
                            border: '0',
                            borderRadius: '999px',
                            background: 'transparent',
                            color: 'var(--act)',
                            font: 'inherit',
                            fontSize: '12.5px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          {'Changer de mot de passe'}
                        </button>
                      </>
                    ) : null}{' '}
                  </>
                ) : null}{' '}
              </div>{' '}
              <div
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {' '}
                <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '18px' }}>{'Langue'}</span>{' '}
                <div
                  style={{
                    display: 'flex',
                    padding: '4px',
                    borderRadius: '999px',
                    background: 'var(--sub)',
                    gap: '2px',
                    alignSelf: 'flex-start',
                  }}
                >
                  {(v.langTabs || []).map((t, i65) => (
                    <React.Fragment key={i65}>
                      <button
                        onClick={t?.go}
                        style={{
                          height: '32px',
                          padding: '0 16px',
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
                  ))}
                </div>{' '}
                <span style={{ fontSize: '12.5px', color: 'var(--mu)', lineHeight: '1.5' }}>
                  {
                    'Toute l’interface passe en anglais. Pour candidater à l’international, créez aussi une version anglaise de votre CV : titres de sections, dates et contenu traduits.'
                  }
                </span>{' '}
                <button
                  onClick={v.translateCv}
                  style={{
                    alignSelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '36px',
                    padding: '0 16px 0 8px',
                    border: '0',
                    borderRadius: '999px',
                    background: 'var(--ai)',
                    color: 'var(--aifg)',
                    font: 'inherit',
                    fontSize: '12.5px',
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
                  {v.translateLabel}
                </button>{' '}
              </div>{' '}
              <div
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {' '}
                <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '18px', marginBottom: '6px' }}>
                  {'Accessibilité'}
                </span>{' '}
                {(v.a11yPrefs || []).map((p, i66) => (
                  <React.Fragment key={i66}>
                    {' '}
                    <button
                      onClick={p?.toggle}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        width: '100%',
                        padding: '12px 0',
                        border: '0',
                        borderTop: '1px solid var(--line)',
                        background: 'transparent',
                        color: 'var(--tx)',
                        font: 'inherit',
                        textAlign: 'left',
                        cursor: p?.cursor,
                      }}
                    >
                      {' '}
                      <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: '600' }}>{p?.label}</span>
                        <span style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.45' }}>{p?.desc}</span>
                      </span>{' '}
                      <span
                        style={{
                          width: '36px',
                          height: '22px',
                          flex: '0 0 36px',
                          borderRadius: '11px',
                          background: p?.track,
                          position: 'relative',
                          transition: 'background .2s',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: '3px',
                            left: p?.knob,
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: '#ffffff',
                            transition: 'left .2s',
                            boxShadow: '0 1px 2px rgba(0,0,0,.25)',
                          }}
                        ></span>
                      </span>{' '}
                    </button>{' '}
                  </React.Fragment>
                ))}{' '}
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}
                >
                  {' '}
                  <span style={{ fontWeight: '600' }}>{'Taille du texte de l’interface'}</span>{' '}
                  <div
                    style={{
                      display: 'flex',
                      padding: '3px',
                      borderRadius: '999px',
                      background: 'var(--sub)',
                      gap: '2px',
                      alignSelf: 'flex-start',
                      marginBottom: '10px',
                    }}
                  >
                    {(v.uiSizes || []).map((t, i67) => (
                      <React.Fragment key={i67}>
                        <button
                          onClick={t?.go}
                          style={{
                            height: '30px',
                            minWidth: '44px',
                            padding: '0 12px',
                            border: '0',
                            borderRadius: '999px',
                            background: t?.bg,
                            color: t?.fg,
                            font: 'inherit',
                            fontSize: '12.5px',
                            fontWeight: '700',
                            cursor: 'pointer',
                          }}
                        >
                          {t?.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>{' '}
                  <span style={{ fontWeight: '600' }}>{'Raccourcis clavier'}</span>{' '}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--mu)' }}>
                    <span>{'Étape suivante / précédente (éditeur)'}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{'Alt + → / ←'}</span>
                  </div>{' '}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--mu)' }}>
                    <span>{'Annuler / rétablir'}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{'Ctrl / ⌘ + Z · Maj + Z'}</span>
                  </div>{' '}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--mu)' }}>
                    <span>{'Créer un instantané'}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{'Ctrl / ⌘ + S'}</span>
                  </div>{' '}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--mu)' }}>
                    <span>{'Exporter'}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{'Ctrl / ⌘ + E'}</span>
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {' '}
              <div
                style={{
                  background: 'var(--panel)',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {' '}
                <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '18px' }}>
                  {'Vos données (RGPD)'}
                </span>{' '}
                <span style={{ fontSize: '12.5px', color: 'var(--mu)', lineHeight: '1.5', marginBottom: '6px' }}>
                  {
                    'Vos CV vous appartiennent. Lisible ne les utilise pas pour entraîner de modèle et ne les vend ni ne les partage à des fins publicitaires. Vous pouvez tout récupérer ou tout effacer à tout moment.'
                  }
                </span>{' '}
                {(v.privacyPrefs || []).map((p, i68) => (
                  <React.Fragment key={i68}>
                    {' '}
                    <button
                      onClick={p?.toggle}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        width: '100%',
                        padding: '12px 0',
                        border: '0',
                        borderTop: '1px solid var(--line)',
                        background: 'transparent',
                        color: 'var(--tx)',
                        font: 'inherit',
                        textAlign: 'left',
                        cursor: p?.cursor,
                      }}
                    >
                      {' '}
                      <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: '600' }}>{p?.label}</span>
                        <span style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: '1.45' }}>{p?.desc}</span>
                      </span>{' '}
                      <span
                        style={{
                          width: '36px',
                          height: '22px',
                          flex: '0 0 36px',
                          borderRadius: '11px',
                          background: p?.track,
                          position: 'relative',
                          transition: 'background .2s',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: '3px',
                            left: p?.knob,
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: '#ffffff',
                            transition: 'left .2s',
                            boxShadow: '0 1px 2px rgba(0,0,0,.25)',
                          }}
                        ></span>
                      </span>{' '}
                    </button>{' '}
                  </React.Fragment>
                ))}{' '}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '14px', borderTop: '1px solid var(--line)' }}>
                  {' '}
                  <button
                    onClick={v.exportData}
                    style={{
                      height: '36px',
                      padding: '0 16px',
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
                    {'Télécharger mes données (JSON)'}
                  </button>{' '}
                  <button
                    onClick={v.deleteAll}
                    style={{
                      height: '36px',
                      padding: '0 16px',
                      border: '1px solid var(--er)',
                      borderRadius: '999px',
                      background: v.del?.bg,
                      color: v.del?.fg,
                      font: 'inherit',
                      fontSize: '12.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {v.del?.label}
                  </button>{' '}
                </div>{' '}
              </div>{' '}
              <div
                style={{
                  background: 'var(--sub)',
                  borderRadius: '20px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '12.5px',
                  color: 'var(--mu)',
                  lineHeight: '1.55',
                }}
              >
                {' '}
                <span style={{ fontWeight: '700', color: 'var(--tx)' }}>{'Où sont traitées vos données ?'}</span>{' '}
                <span>{'Lecture des fichiers, anonymisation, score ATS et détection des tics d’écriture : dans votre navigateur.'}</span>{' '}
                <span>
                  {
                    'Import, analyses, réécritures et lettres : le contenu concerné est envoyé à Google (Gemini) ou Anthropic (Claude) au moment de la demande. Lisible ne le conserve pas ; ces fournisseurs ne l’utilisent pas pour entraîner leurs modèles.'
                  }
                </span>{' '}
                <span>
                  {
                    'Sauvegarde : ce navigateur, ou votre compte si vous êtes connecté·e (base de données Supabase, à Francfort dans l’Union européenne).'
                  }
                </span>{' '}
                <span>
                  {'Détails, durées de conservation et droits : '}
                  <a href="/confidentialite">{'politique de confidentialité'}</a>
                  {'.'}
                </span>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </>
      ) : null}
    </>
  );
}
