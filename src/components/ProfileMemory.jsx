/* Mémoire du profil : ce que la personne dit d'elle-même, réutilisé dans les lettres, le résumé,
   la préparation et la simulation d'entretien. Enregistré avec les préférences (et synchronisé). */
import React, { useState } from 'react';
import { Card, H, Muted, Field, Seg } from './ui.jsx';

const FIELDS = [
  ['motivation', 'Ce qui vous motive dans votre métier', 'Ex. voir un outil que j’ai construit utilisé chaque jour par des soignants.'],
  ['achievements', 'Les réussites dont vous êtes le plus fier ou la plus fière', 'Ex. j’ai repris un projet en retard et l’avons livré en 3 mois ; 2 000 utilisateurs dès le premier mois.'],
  ['constraints', 'Vos contraintes (lieu, disponibilité, contrat…)', 'Ex. basé·e à Douala, disponible sous un mois, ouvert·e au télétravail partiel.'],
  ['values', 'Ce que vous recherchez, vos valeurs', 'Ex. une équipe qui transmet, un secteur utile, des responsabilités de management.'],
];

export default function ProfileMemory({ v }) {
  const p = v.profile || {};
  const filled = FIELDS.filter(([k]) => (p[k] || '').trim()).length;
  const [open, setOpen] = useState(filled === 0);
  return (
    <Card>
      <button type="button" onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', padding: 0, border: 0, background: 'transparent', color: 'var(--tx)', font: 'inherit', cursor: 'pointer', textAlign: 'left' }}>
        <H>Votre profil (mémoire)</H>
        <span style={{ fontSize: '12px', color: filled ? 'var(--ok)' : 'var(--fa)', fontWeight: 600 }}>
          {filled}/4 renseigné{filled > 1 ? 's' : ''} {open ? '−' : '+'}
        </span>
      </button>
      <Muted>Quelques phrases sur vous, réutilisées dans chaque lettre et pour l’entretien. L’IA s’en sert telles quelles, sans les enjoliver : moins de repères [à compléter], des textes plus personnels.</Muted>
      {open ? (
        <>
          {FIELDS.map(([k, label, ph]) => (
            <Field key={k} label={label} placeholder={ph} value={p[k]} onChange={val => v.setProfile({ [k]: val })} rows={2} />
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--mu)' }}>Utiliser ces informations</span>
            <Seg value={p.use === false ? 'off' : 'on'} options={[['on', 'Oui'], ['off', 'Non']]} onChange={k => v.setProfile({ use: k === 'on' })} />
          </div>
        </>
      ) : null}
    </Card>
  );
}
