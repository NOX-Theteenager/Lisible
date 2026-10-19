/* Comparaison avant / après l'import : texte d'origine tel qu'un ATS le lit, à côté de la version
   conforme, avec un contrôle automatique des chiffres, e-mails et liens perdus ou ajoutés. */
import React, { useMemo } from 'react';
import { cvText } from '../../lib/cv.js';
import { facts, missing } from '../../lib/facts.js';
import { Card, H, Muted } from '../../components/ui.jsx';

export default function BeforeAfter({ v }) {
  const r = v.impRes;
  const data = useMemo(() => {
    if (!r || !r.cv) return null;
    const after = cvText(r.cv);
    return { after, lost: missing(r.rawText, after).slice(0, 20), added: missing(after, r.rawText).slice(0, 20) };
  }, [r]);
  if (!data || !v.impShowCompare) return null;
  const pre = { margin: 0, maxHeight: '420px', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: "'JetBrains Mono',monospace", fontSize: '11px', lineHeight: 1.55, padding: '12px', borderRadius: '10px', background: 'var(--sub)', color: 'var(--tx)' };
  const ok = !data.lost.length && !data.added.length;
  return (
    <Card style={{ padding: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
        <H size={16}>Avant / après</H>
        <span style={{ fontSize: '12px', fontWeight: 700, color: ok ? 'var(--ok)' : 'var(--wa)' }}>{ok ? '✓ Aucun chiffre, e-mail ni lien perdu ou ajouté' : 'Points à vérifier ci-dessous'}</span>
      </div>
      <Muted>Comparez le contenu d’origine et la version conforme. Le contrôle automatique repère les chiffres, e-mails, téléphones et liens présents d’un côté seulement.</Muted>
      {data.lost.length ? (
        <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--was)', fontSize: '12.5px' }}>
          <strong style={{ color: 'var(--wa)' }}>Présents dans l’original, absents de la version conforme : </strong>
          {data.lost.join(' · ')}
        </div>
      ) : null}
      {data.added.length ? (
        <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'var(--ers)', fontSize: '12.5px' }}>
          <strong style={{ color: 'var(--er)' }}>Absents de l’original, à vérifier : </strong>
          {data.added.join(' · ')}
          <span style={{ display: 'block', color: 'var(--mu)', marginTop: '2px' }}>Souvent une date reformatée ; sinon, corrigez-les dans l’éditeur.</span>
        </div>
      ) : null}
      <div data-no-i18n="1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Original (lu par un ATS)</span>
          <pre style={pre}>{r.rawText}</pre>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--ok)', textTransform: 'uppercase', letterSpacing: '.05em' }}>Version conforme</span>
          <pre style={pre}>{data.after}</pre>
        </div>
      </div>
    </Card>
  );
}
