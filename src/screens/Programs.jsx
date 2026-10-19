/* Mode Études : trouver une formation et un financement.
   - France : données ouvertes Parcoursup (après le bac), ONISEP (diplômes d'ingénieur) et Mon Master ;
   - Étranger : catalogues officiels ;
   - Bourses : principales bourses accessibles depuis l'Afrique francophone, avec liens officiels.
   Aucune IA : recherche gratuite. */
import React, { useState } from 'react';
import { Card, H, Muted, Btn, Seg } from '../components/ui.jsx';
import { SCHOLARSHIPS, CATALOGS } from '../lib/scholarships.js';

const LEVELS = [['licence', 'Après le bac (Parcoursup)'], ['ingenieur', 'Écoles d’ingénieurs'], ['master', 'Master (Mon Master)']];
const field = { height: '40px', padding: '0 14px', border: '1px solid var(--line2)', borderRadius: '999px', background: 'var(--panel)', color: 'var(--tx)', font: 'inherit', fontSize: '13px', outline: 'none', minWidth: 0 };
const label = { fontSize: '12px', fontWeight: 600, color: 'var(--mu)' };
const n = (x) => (x == null ? '' : Number(x).toLocaleString('fr-FR'));
const link = { alignSelf: 'center', fontSize: '12.5px', fontWeight: 600, color: 'var(--ai)', padding: '0 6px' };

function Program({ it, P }) {
  const stats = [it.places ? n(it.places) + ' places' : '', it.applicants ? n(it.applicants) + (it.platform === 'parcoursup' ? ' vœux' : ' candidatures') : ''].filter(Boolean).join(' · ');
  const rateCol = it.rate == null ? 'var(--fa)' : it.rate < 20 ? 'var(--er)' : it.rate < 50 ? 'var(--wa)' : 'var(--ok)';
  return (
    <div style={{ borderTop: '1px solid var(--line)', padding: '14px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        {it.rate != null ? (
          <div title={'Session précédente : ' + it.rateLabel} style={{ flex: '0 0 58px', height: '52px', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--sub)' }}>
            <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: '17px', color: rateCol }}>{it.rate}%</span>
            <span style={{ fontSize: '9.5px', color: 'var(--fa)' }}>d’accès</span>
          </div>
        ) : null}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <strong style={{ fontSize: '14px' }}>{it.program}</strong>
          <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>{[it.school, it.city].filter(Boolean).join(' · ')}</span>
          {it.kind ? <span style={{ fontSize: '12px', color: 'var(--fa)' }}>{it.kind}</span> : null}
          {stats ? <span style={{ fontSize: '12px', color: 'var(--fa)' }}>{stats}{it.alternance ? ' · alternance possible' : ''}</span> : null}
          {it.domains && it.domains.length ? <span style={{ fontSize: '12px', color: 'var(--mu)' }}>Domaines : {it.domains.join(', ')}</span> : null}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <Btn kind="ai" onClick={() => P.toLetter(it)}>Préparer la lettre</Btn>
        <Btn onClick={() => P.follow(it)}>Suivre</Btn>
        <a href={it.url} target="_blank" rel="noopener noreferrer nofollow" style={link}>Fiche officielle ↗</a>
      </div>
    </div>
  );
}

function France({ P }) {
  const [level, setLevel] = useState(P.defaultLevel || 'master');
  const [q, setQ] = useState(P.defaults ? P.defaults.q : '');
  const [place, setPlace] = useState('');
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function run(p = 0, lv = level) {
    if (q.trim().length < 2) { setError('Indiquez un domaine ou un intitulé de formation.'); return; }
    setBusy(true); setError('');
    try {
      const r = await window.LisibleAPI.programs({ level: lv, q, place, page: p });
      setRes((prev) => ({ ...r, page: p, items: p && prev ? [...prev.items, ...r.items] : r.items }));
    } catch (e) { setError(e.message || 'Recherche impossible.'); }
    setBusy(false);
  }
  const src = { licence: 'Parcoursup, session ', master: 'Mon Master, session ', ingenieur: 'catalogue Idéo de l’ONISEP' };
  return (
    <>
      <Card style={{ padding: '20px', gap: '12px' }}>
        <H>Formations en France</H>
        <Muted>Données publiques du ministère de l’Enseignement supérieur et de l’ONISEP : places, candidatures et taux d’accès de la dernière session, avec le lien vers la fiche officielle.</Muted>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><span style={label}>Niveau</span><Seg value={level} options={LEVELS} onChange={(k) => { setLevel(k); setRes(null); }} /></div>
        <form onSubmit={(e) => { e.preventDefault(); run(0); }} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input aria-label="Domaine ou formation" value={q} onChange={(e) => setQ(e.target.value)} placeholder={level === 'ingenieur' ? 'Domaine ou école (ex. génie civil, INSA)' : 'Domaine ou formation (ex. finance, informatique)'} style={{ ...field, flex: '2 1 220px' }} />
          {level !== 'ingenieur' ? <input aria-label="Ville, département ou région" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Ville, département ou région" style={{ ...field, flex: '1 1 180px' }} /> : null}
          <Btn kind="ai" type="submit" disabled={busy} style={{ height: '40px' }}>{busy ? 'Recherche…' : 'Rechercher'}</Btn>
        </form>
        {level === 'ingenieur' ? <Muted>Les écoles qui recrutent après le bac apparaissent aussi dans « Après le bac (Parcoursup) » avec leurs taux d’accès. Ici, toutes les écoles, y compris celles qui recrutent après une prépa, un BUT ou une licence.</Muted> : null}
        {error ? <div role="alert" style={{ padding: '10px 12px', borderRadius: '10px', background: 'var(--ers)', color: 'var(--er)', fontSize: '13px', fontWeight: 600 }}>{error}</div> : null}
      </Card>
      {res ? (
        <Card style={{ padding: '6px 20px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', padding: '12px 0' }}>
            <strong style={{ fontSize: '13.5px' }}>{res.total ? n(res.total) + ' formation' + (res.total > 1 ? 's' : '') : 'Aucune formation trouvée'}</strong>
            <span style={{ fontSize: '12px', color: 'var(--fa)' }}>Source : {src[res.level]}{res.session}</span>
          </div>
          {res.items.map((it) => <Program key={it.id} it={it} P={P} />)}
          {res.items.length < res.total && res.items.length < 300 ? <div style={{ paddingTop: '12px' }}><Btn onClick={() => run(res.page + 1)} disabled={busy}>{busy ? 'Chargement…' : 'Plus de formations'}</Btn></div> : null}
        </Card>
      ) : null}
    </>
  );
}

function Abroad() {
  return (
    <Card style={{ padding: '20px', gap: '6px' }}>
      <H>Étudier à l’étranger</H>
      <Muted>Catalogues officiels pour trouver une formation. Une fois la formation choisie, renseignez-la dans l’onglet « Lettre » : la fiche établissement, la lettre et l’entretien d’admission s’appuieront dessus.</Muted>
      {CATALOGS.map((c) => (
        <div key={c.url} style={{ borderTop: '1px solid var(--line)', padding: '12px 0', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column' }}>
            <strong style={{ fontSize: '13.5px' }}>{c.name} <span style={{ fontWeight: 500, color: 'var(--mu)' }}>· {c.dest}</span></strong>
            <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>{c.note}</span>
          </div>
          <a href={c.url} target="_blank" rel="noopener noreferrer nofollow" style={link}>Ouvrir ↗</a>
        </div>
      ))}
    </Card>
  );
}

function Grants({ P }) {
  const [dest, setDest] = useState('');
  const [level, setLevel] = useState('');
  const dests = [...new Set(SCHOLARSHIPS.map((s) => s.dest))];
  const list = SCHOLARSHIPS.filter((s) => (!dest || s.dest === dest) && (!level || s.levels.includes(level)));
  return (
    <Card style={{ padding: '20px', gap: '10px' }}>
      <H>Bourses d’études</H>
      <Muted>Les principales bourses ouvertes aux candidat·e·s d’Afrique francophone. Dates et conditions changent chaque année : vérifiez toujours sur le site officiel. Pour une formation précise, la fiche établissement signale aussi les bourses qu’elle trouve.</Muted>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <select aria-label="Destination" value={dest} onChange={(e) => setDest(e.target.value)} style={{ ...field, height: '36px' }}>
          <option value="">Toutes les destinations</option>
          {dests.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <Seg value={level} options={[['', 'Tous niveaux'], ['licence', 'Licence'], ['master', 'Master'], ['doctorat', 'Doctorat']]} onChange={setLevel} />
      </div>
      {list.map((s) => (
        <div key={s.url} style={{ borderTop: '1px solid var(--line)', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <strong style={{ fontSize: '14px' }}>{s.name} <span style={{ fontWeight: 500, color: 'var(--mu)' }}>· {s.dest}</span></strong>
          <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>{s.by} · {s.levels.join(', ')}</span>
          <span style={{ fontSize: '13px', lineHeight: 1.5 }}>{s.what}</span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <Btn onClick={() => P.followGrant(s)}>Suivre</Btn>
            <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" style={link}>Site officiel ↗</a>
          </div>
        </div>
      ))}
    </Card>
  );
}

export default function Programs({ v }) {
  const P = v.programs || {};
  const [tab, setTab] = useState('france');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <Seg value={tab} options={[['france', 'Formations en France'], ['abroad', 'À l’étranger'], ['grants', 'Bourses']]} onChange={setTab} />
      {tab === 'france' ? <France P={P} /> : tab === 'abroad' ? <Abroad /> : <Grants P={P} />}
    </div>
  );
}
