/* Accueil en mode Études : les étapes d'une candidature à une formation, chacune menant à son écran. */
import React from 'react';
import { Card, H, Muted } from '../../components/ui.jsx';

const STEPS = [
  ['programs', '1', 'Trouver une formation', 'Parcoursup, écoles d’ingénieurs, Mon Master, catalogues étrangers et bourses.'],
  ['editor', '2', 'Préparer un CV académique', 'Format académique automatique : formation en tête, projets et travaux académiques, distinctions.'],
  ['letter', '3', 'Rédiger la lettre ou le projet d’études', 'Lettre, projet d’études, statement of purpose, personal statement, avec la limite de la plateforme.'],
  ['interview', '4', 'S’entraîner à l’entretien d’admission', 'Jury bienveillant, exigeant ou entretien Campus France, à l’écrit ou à l’oral.'],
  ['apps', '5', 'Suivre les candidatures', 'Dates limites, pièces du dossier et statut de chaque formation.'],
];

export default function StudyHome({ v }) {
  const S = v.studyHome || {};
  return (
    <Card style={{ padding: '20px', gap: '12px', marginBottom: '20px' }}>
      <H>Mode Études</H>
      <Muted>Candidater à une formation, en France ou à l’étranger, étape par étape.</Muted>
      {S.urgent ? <span role="status" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--er)' }}>{S.urgent}</span> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,210px),1fr))', gap: '10px' }}>
        {STEPS.map(([k, n, t, d]) => (
          <button
            key={k}
            type="button"
            onClick={() => S.go(k)}
            style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '14px', borderRadius: '14px', border: '1px solid var(--line)', background: 'var(--panel)', color: 'var(--tx)', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
          >
            <span style={{ width: '24px', height: '24px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--acs)', color: 'var(--ac)', fontSize: '12px', fontWeight: 800 }}>{n}</span>
            <strong style={{ fontSize: '13.5px' }}>{t}</strong>
            <span style={{ fontSize: '12px', color: 'var(--mu)', lineHeight: 1.45 }}>{d}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
