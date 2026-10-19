import React from 'react';
import { ps } from '../lib/pseudo.js';
import StudyHome from './home/StudyHome.jsx';

/* Généré depuis le design Claude Design « CV ATS Pro v3 ». */
export default function Home({ v }) {
  return (
    <>
      {v.isHome ? (
        <>
          {' '}
          <div
            data-screen-label="Accueil"
            style={{
              padding: '28px clamp(12px,3.5vw,28px) 56px',
              maxWidth: '1220px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
          >
            {v.study ? <StudyHome v={v} /> : null}
            {' '}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'stretch' }}>
              {' '}
              <div
                style={{
                  flex: '1 1 460px',
                  minWidth: '0',
                  padding: 'clamp(20px,5vw,32px)',
                  borderRadius: '24px',
                  background: 'var(--ink)',
                  color: 'var(--inkfg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {' '}
                <span
                  style={{
                    alignSelf: 'flex-start',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    background: 'var(--ac)',
                    color: '#ffffff',
                    letterSpacing: '.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  {'Conformité ATS garantie'}
                </span>{' '}
                <h2
                  style={{
                    margin: '0',
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                    fontSize: 'clamp(27px,6.4vw,38px)',
                    lineHeight: '1.06',
                    fontWeight: '700',
                    letterSpacing: '-0.03em',
                    maxWidth: '560px',
                    textWrap: 'balance',
                  }}
                >
                  {'Un CV lisible par les robots, et qui donne envie aux humains.'}
                </h2>{' '}
                <p style={{ margin: '0', opacity: '.7', fontSize: '14.5px', lineHeight: '1.55', maxWidth: '520px', textWrap: 'pretty' }}>
                  {'Créez, importez ou adaptez votre CV à une offre. Le score ATS se met à jour à chaque frappe.'}
                </p>{' '}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {' '}
                  <button
                    onClick={v.goCreate}
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
                      transition: 'transform .15s',
                    }}
                    className={ps('hover', 'transform:translateY(-1px)')}
                  >
                    {'Créer mon CV'}
                  </button>{' '}
                  <button
                    onClick={v.goImport}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      border: '1px solid rgba(255,255,255,.22)',
                      borderRadius: '999px',
                      background: 'transparent',
                      color: 'var(--inkfg)',
                      font: 'inherit',
                      fontSize: '13.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    className={ps('hover', 'background:rgba(255,255,255,.08)')}
                  >
                    {'Importer un CV existant'}
                  </button>{' '}
                </div>{' '}
              </div>{' '}
              <div
                style={{
                  flex: '0 1 330px',
                  minWidth: 'min(100%,280px)',
                  padding: '22px',
                  borderRadius: '24px',
                  background: 'var(--panel)',
                  border: '1px solid var(--line)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                {' '}
                <span
                  style={{ fontSize: '11px', fontWeight: '700', color: 'var(--fa)', textTransform: 'uppercase', letterSpacing: '.06em' }}
                >
                  {'Votre version active'}
                </span>{' '}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {' '}
                  <div
                    style={{
                      width: '92px',
                      height: '92px',
                      flex: '0 0 92px',
                      borderRadius: '50%',
                      background: `conic-gradient(${v.gauge?.color ?? ''} ${v.gauge?.deg ?? ''}deg, var(--line) 0)`,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {' '}
                    <div
                      style={{
                        width: '74px',
                        height: '74px',
                        borderRadius: '50%',
                        background: 'var(--panel)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '28px', fontWeight: '700', lineHeight: '1' }}
                      >
                        {v.score}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--fa)' }}>{'/100'}</span>
                    </div>{' '}
                  </div>{' '}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '0' }}>
                    <span style={{ fontWeight: '700', lineHeight: '1.3' }}>{v.versionName}</span>
                    <span style={{ color: v.gauge?.color, fontWeight: '600' }}>{v.gauge?.label}</span>
                    <span style={{ fontSize: '12px', color: 'var(--mu)' }}>
                      {v.okCount}
                      {'/12 règles respectées'}
                    </span>
                  </div>{' '}
                </div>{' '}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {' '}
                  {(v.priorities || []).map((p, i3) => (
                    <React.Fragment key={i3}>
                      {' '}
                      <button
                        onClick={p?.go}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          border: '0',
                          borderRadius: '10px',
                          background: 'var(--sub)',
                          color: 'var(--tx)',
                          font: 'inherit',
                          fontSize: '12.5px',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                        className={ps('hover', 'background:var(--acs)')}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p?.color, flex: '0 0 6px' }}></span>
                        <span style={{ flex: '1' }}>{p?.label}</span>
                        <span style={{ color: 'var(--fa)' }}>{'→'}</span>
                      </button>{' '}
                    </React.Fragment>
                  ))}{' '}
                </div>{' '}
                <button
                  onClick={v.goEditor}
                  style={{
                    marginTop: 'auto',
                    height: '36px',
                    border: '0',
                    borderRadius: '999px',
                    background: 'var(--btn)',
                    color: 'var(--btnfg)',
                    font: 'inherit',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {"Ouvrir dans l'éditeur"}
                </button>{' '}
              </div>{' '}
            </div>{' '}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '14px' }}>
              {' '}
              <button
                onClick={v.goCreate}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '20px',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  background: 'var(--panel)',
                  color: 'var(--tx)',
                  font: 'inherit',
                  cursor: 'pointer',
                  minHeight: '200px',
                  transition: 'transform .18s, box-shadow .18s, border-color .18s',
                }}
                className={ps(
                  'hover',
                  'transform:translateY(-3px);box-shadow:0 14px 30px -18px rgba(28,25,21,.45);border-color:var(--line2)',
                )}
              >
                {' '}
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'var(--t1)',
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: "'Bricolage Grotesque',sans-serif",
                      fontSize: '17px',
                      fontWeight: '700',
                    }}
                  >
                    {'01'}
                  </span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: 'var(--ais)',
                      color: 'var(--ai)',
                      letterSpacing: '.04em',
                    }}
                  >
                    {'IA'}
                  </span>
                </span>{' '}
                <span
                  style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '18px', fontWeight: '700', letterSpacing: '-0.01em' }}
                >
                  {'Créer depuis zéro'}
                </span>{' '}
                <span style={{ color: 'var(--mu)', lineHeight: '1.5', textWrap: 'pretty' }}>
                  {'Un parcours guidé en 8 étapes, avec des suggestions de formulation et un score en direct.'}
                </span>{' '}
                <span style={{ marginTop: 'auto', color: 'var(--act)', fontWeight: '600' }}>{'Commencer →'}</span>{' '}
              </button>{' '}
              <button
                onClick={v.goImport}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '20px',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  background: 'var(--panel)',
                  color: 'var(--tx)',
                  font: 'inherit',
                  cursor: 'pointer',
                  minHeight: '200px',
                  transition: 'transform .18s, box-shadow .18s, border-color .18s',
                }}
                className={ps(
                  'hover',
                  'transform:translateY(-3px);box-shadow:0 14px 30px -18px rgba(28,25,21,.45);border-color:var(--line2)',
                )}
              >
                {' '}
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'var(--t2)',
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: "'Bricolage Grotesque',sans-serif",
                      fontSize: '17px',
                      fontWeight: '700',
                    }}
                  >
                    {'02'}
                  </span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: 'var(--ais)',
                      color: 'var(--ai)',
                      letterSpacing: '.04em',
                    }}
                  >
                    {'IA'}
                  </span>
                </span>{' '}
                <span
                  style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '18px', fontWeight: '700', letterSpacing: '-0.01em' }}
                >
                  {'Importer et optimiser'}
                </span>{' '}
                <span style={{ color: 'var(--mu)', lineHeight: '1.5', textWrap: 'pretty' }}>
                  {'PDF, DOCX ou photo de votre CV : extraction, rapport de conformité puis conversion.'}
                </span>{' '}
                <span style={{ marginTop: 'auto', color: 'var(--act)', fontWeight: '600' }}>{'Importer un fichier →'}</span>{' '}
              </button>{' '}
              <button
                onClick={v.goAdapt}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '20px',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  background: 'var(--panel)',
                  color: 'var(--tx)',
                  font: 'inherit',
                  cursor: 'pointer',
                  minHeight: '200px',
                  transition: 'transform .18s, box-shadow .18s, border-color .18s',
                }}
                className={ps(
                  'hover',
                  'transform:translateY(-3px);box-shadow:0 14px 30px -18px rgba(28,25,21,.45);border-color:var(--line2)',
                )}
              >
                {' '}
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'var(--t3)',
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: "'Bricolage Grotesque',sans-serif",
                      fontSize: '17px',
                      fontWeight: '700',
                    }}
                  >
                    {'03'}
                  </span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      background: 'var(--ais)',
                      color: 'var(--ai)',
                      letterSpacing: '.04em',
                    }}
                  >
                    {'IA'}
                  </span>
                </span>{' '}
                <span
                  style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '18px', fontWeight: '700', letterSpacing: '-0.01em' }}
                >
                  {'Adapter à une offre'}
                </span>{' '}
                <span style={{ color: 'var(--mu)', lineHeight: '1.5', textWrap: 'pretty' }}>
                  {'Texte, lien ou capture d’annonce : mots-clés, réécritures ciblées, score avant/après.'}
                </span>{' '}
                <span style={{ marginTop: 'auto', color: 'var(--act)', fontWeight: '600' }}>{'Analyser une offre →'}</span>{' '}
              </button>{' '}
              <button
                onClick={v.goSimple}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '20px',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  background: 'var(--panel)',
                  color: 'var(--tx)',
                  font: 'inherit',
                  cursor: 'pointer',
                  minHeight: '200px',
                  transition: 'transform .18s, box-shadow .18s, border-color .18s',
                }}
                className={ps(
                  'hover',
                  'transform:translateY(-3px);box-shadow:0 14px 30px -18px rgba(28,25,21,.45);border-color:var(--line2)',
                )}
              >
                {' '}
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'var(--t4)',
                      display: 'grid',
                      placeItems: 'center',
                      fontFamily: "'Bricolage Grotesque',sans-serif",
                      fontSize: '17px',
                      fontWeight: '700',
                    }}
                  >
                    {'04'}
                  </span>
                </span>{' '}
                <span
                  style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: '18px', fontWeight: '700', letterSpacing: '-0.01em' }}
                >
                  {'Rendre conforme, sans plus'}
                </span>{' '}
                <span style={{ color: 'var(--mu)', lineHeight: '1.5', textWrap: 'pretty' }}>
                  {'Structure, titres, police et dates corrigés. Vos formulations restent intactes.'}
                </span>{' '}
                <span style={{ marginTop: 'auto', color: 'var(--act)', fontWeight: '600' }}>{'Convertir mon CV →'}</span>{' '}
              </button>{' '}
            </div>{' '}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))',
                gap: '16px',
                alignItems: 'start',
              }}
            >
              {' '}
              <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '20px', overflow: 'hidden' }}>
                {' '}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px' }}>
                  {' '}
                  <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '16px' }}>
                    {'Versions récentes'}
                  </span>{' '}
                  <button
                    onClick={v.goVersions}
                    style={{
                      height: '28px',
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
                    className={ps('hover', 'background:var(--acs)')}
                  >
                    {'Tout voir'}
                  </button>{' '}
                </div>{' '}
                {(v.recent || []).map((r, i4) => (
                  <React.Fragment key={i4}>
                    {' '}
                    <button
                      onClick={r?.open}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '12px 18px',
                        border: '0',
                        borderTop: '1px solid var(--line)',
                        background: 'transparent',
                        color: 'var(--tx)',
                        font: 'inherit',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                      className={ps('hover', 'background:var(--sub)')}
                    >
                      {' '}
                      <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: '600' }}>{r?.name}</span>
                        <span style={{ fontSize: '11.5px', color: 'var(--fa)' }}>
                          {r?.tag}
                          {' · modifiée '}
                          {r?.updated}
                        </span>
                      </span>{' '}
                      <span
                        style={{
                          minWidth: '40px',
                          textAlign: 'center',
                          padding: '4px 8px',
                          borderRadius: '999px',
                          background: r?.bg,
                          color: r?.color,
                          fontFamily: "'Bricolage Grotesque',sans-serif",
                          fontSize: '13px',
                          fontWeight: '700',
                        }}
                      >
                        {r?.score}
                      </span>{' '}
                    </button>{' '}
                  </React.Fragment>
                ))}{' '}
              </div>{' '}
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
                <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: '700', fontSize: '16px' }}>
                  {'Ce que nous garantissons à l’export ATS'}
                </span>{' '}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {' '}
                  <span style={{ padding: '6px 11px', borderRadius: '999px', background: 'var(--sub)', fontSize: '12.5px' }}>
                    {'Une seule colonne'}
                  </span>{' '}
                  <span style={{ padding: '6px 11px', borderRadius: '999px', background: 'var(--sub)', fontSize: '12.5px' }}>
                    {'Titres de sections standards'}
                  </span>{' '}
                  <span style={{ padding: '6px 11px', borderRadius: '999px', background: 'var(--sub)', fontSize: '12.5px' }}>
                    {'Arial, Calibri, Times, Helvetica'}
                  </span>{' '}
                  <span style={{ padding: '6px 11px', borderRadius: '999px', background: 'var(--sub)', fontSize: '12.5px' }}>
                    {'Aucun tableau ni zone de texte'}
                  </span>{' '}
                  <span style={{ padding: '6px 11px', borderRadius: '999px', background: 'var(--sub)', fontSize: '12.5px' }}>
                    {'Aucune image ni icône'}
                  </span>{' '}
                  <span style={{ padding: '6px 11px', borderRadius: '999px', background: 'var(--sub)', fontSize: '12.5px' }}>
                    {'Pas d’en-tête ni de pied de page'}
                  </span>{' '}
                  <span style={{ padding: '6px 11px', borderRadius: '999px', background: 'var(--sub)', fontSize: '12.5px' }}>
                    {'Dates MM/AAAA'}
                  </span>{' '}
                  <span style={{ padding: '6px 11px', borderRadius: '999px', background: 'var(--sub)', fontSize: '12.5px' }}>
                    {'Coordonnées en haut'}
                  </span>{' '}
                </div>{' '}
                <span style={{ fontSize: '12.5px', color: 'var(--mu)', lineHeight: '1.5' }}>
                  {
                    'Les modèles « Design » (photo, couleurs, colonnes) servent aux envois directs. Le DOCX et le TXT sont toujours générés en version ATS stricte.'
                  }
                </span>{' '}
              </div>{' '}
            </div>{' '}
          </div>{' '}
        </>
      ) : null}
    </>
  );
}
