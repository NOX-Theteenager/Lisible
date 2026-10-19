/* Objectif : trouver un emploi ou candidater à une formation. Le mode Études adapte la lettre (projet
   d'études, statement of purpose…), l'entretien (jury d'admission, Campus France) et le CV (format académique). */
import React from 'react';
import { Card, H, Muted, Btn } from './ui.jsx';

const TRACKS = [
  ['job', 'Emploi', 'Postes, stages et alternances : CV pour les ATS, lettres, entretiens d’embauche.'],
  ['study', 'Études', 'Licence, master, école, Campus France, Parcoursup, programmes à l’étranger : lettres, projet d’études, entretiens d’admission.'],
];

export default function TrackCard({ v }) {
  return (
    <Card style={{ padding: '20px' }}>
      <H>Votre objectif</H>
      <Muted>Lisible adapte les documents, les conseils et les entretiens à ce que vous préparez.</Muted>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '8px' }}>
        {TRACKS.map(([k, label, desc]) => {
          const on = v.track === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => v.setTrack(k)}
              aria-pressed={on}
              style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '12px', borderRadius: '14px', border: '2px solid ' + (on ? 'var(--ac)' : 'var(--line)'), background: on ? 'var(--acs)' : 'var(--panel)', color: 'var(--tx)', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
            >
              <span style={{ fontWeight: 700 }}>{label}</span>
              <span style={{ fontSize: '11.5px', color: 'var(--mu)', lineHeight: 1.4 }}>{desc}</span>
            </button>
          );
        })}
      </div>
      {v.study ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', padding: '12px 14px', borderRadius: '12px', background: 'var(--sub)' }}>
          <span style={{ fontSize: '13px', flex: '1 1 260px' }}>
            <strong>CV académique</strong> : formation en tête, « Projet d’études », « Projets et travaux académiques », « Distinctions ». S’applique à la version active.
          </span>
          <Btn kind={v.academicCv ? 'line' : 'ai'} onClick={() => v.setAcademicCv(!v.academicCv)}>
            {v.academicCv ? 'Revenir au format professionnel' : 'Passer au format académique'}
          </Btn>
        </div>
      ) : null}
      {v.study ? (
        <Muted>
          Lisible vous aide à exprimer votre propre projet à partir de vos faits. Relisez et personnalisez chaque texte : les établissements attendent un travail personnel, et certains utilisent des outils de détection.
        </Muted>
      ) : null}
    </Card>
  );
}
