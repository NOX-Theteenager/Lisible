/* Marché de l'emploi visé : adapte les conseils, les sites d'offres cités et les consignes données à l'IA. */
import React from 'react';
import { Card, H, Muted } from './ui.jsx';
import { MARKETS } from '../lib/markets.js';

export default function MarketCard({ v }) {
  return (
    <Card style={{ padding: '20px' }}>
      <H>Marché de l’emploi</H>
      <Muted>Les conseils, les exemples, les sites d’offres et la rédaction de l’IA (lettres, entretiens, adaptation) suivent les usages du marché choisi.</Muted>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '8px' }}>
        {Object.entries(MARKETS).map(([k, m]) => {
          const on = v.market === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => v.setMarket(k)}
              aria-pressed={on}
              style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '12px', borderRadius: '14px', border: '2px solid ' + (on ? 'var(--ac)' : 'var(--line)'), background: on ? 'var(--acs)' : 'var(--panel)', color: 'var(--tx)', font: 'inherit', textAlign: 'left', cursor: 'pointer' }}
            >
              <span style={{ fontWeight: 700 }}>{m.label}</span>
              <span style={{ fontSize: '11.5px', color: 'var(--mu)', lineHeight: 1.4 }}>{m.desc}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
