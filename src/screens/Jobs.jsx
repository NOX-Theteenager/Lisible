/* Offres pour vous : recherche dans les offres France Travail, classées selon leur correspondance avec
   le CV (calcul local, sans IA). Recherches enregistrées avec compteur de nouvelles offres. */
import React, { useState, useEffect, useMemo } from 'react';
import { Card, H, Muted, Btn, Seg } from '../components/ui.jsx';
import { cvProfile, matchOffer } from '../lib/jobmatch.js';

const CONTRACTS = [['', 'Tous'], ['CDI', 'CDI'], ['CDD', 'CDD'], ['MIS', 'Intérim'], ['SAI', 'Saisonnier']];
const SINCE = [['', 'Toutes'], ['1', '24 h'], ['7', '7 jours'], ['31', '1 mois']];
const field = { height: '40px', padding: '0 14px', border: '1px solid var(--line2)', borderRadius: '999px', background: 'var(--panel)', color: 'var(--tx)', font: 'inherit', fontSize: '13px', outline: 'none', minWidth: 0 };
const label = { fontSize: '12px', fontWeight: 600, color: 'var(--mu)' };
const ago = (d) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  return days <= 0 ? 'aujourd’hui' : days === 1 ? 'hier' : 'il y a ' + days + ' jours';
};
const col = (n) => (n >= 60 ? 'var(--ok)' : n >= 35 ? 'var(--wa)' : 'var(--fa)');

function Offer({ o, m, J }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop: '1px solid var(--line)', padding: '14px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div title="Correspondance avec votre CV" style={{ flex: '0 0 52px', height: '52px', borderRadius: '14px', display: 'grid', placeItems: 'center', background: 'var(--sub)', fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: '17px', color: col(m.score) }}>
          {m.score}%
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <strong style={{ fontSize: '14.5px' }}>{o.title}</strong>
          <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>
            {[o.company, o.city, o.contract, o.duration].filter(Boolean).join(' · ')}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--fa)' }}>
            {o.date ? 'Publiée ' + ago(o.date) : ''}{o.salary ? ' · ' + o.salary : ''}{o.experience ? ' · ' + o.experience : ''}
          </span>
          {m.hits.length ? <span style={{ fontSize: '12px', color: 'var(--ok)' }}>En commun avec votre CV : {m.hits.join(', ')}</span> : null}
        </div>
      </div>
      {open && o.excerpt ? <span style={{ fontSize: '11.5px', color: 'var(--fa)' }}>Extrait fourni par Adzuna : l’annonce complète est sur le site d’origine. Collez-la dans « Adapter à une offre » pour une analyse complète.</span> : null}
      {open ? <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap', background: 'var(--sub)', padding: '12px', borderRadius: '12px', maxHeight: '320px', overflow: 'auto' }}>{o.description}</p> : null}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <Btn onClick={() => setOpen(!open)}>{open ? 'Masquer l’annonce' : 'Lire l’annonce'}</Btn>
        <Btn kind="ai" onClick={() => J.toAdapt(o)}>Adapter mon CV</Btn>
        <Btn onClick={() => J.toLetter(o)}>Préparer la lettre</Btn>
        <Btn onClick={() => J.follow(o)}>Suivre</Btn>
        <a href={o.url} target="_blank" rel="noopener noreferrer nofollow" style={{ alignSelf: 'center', fontSize: '12.5px', fontWeight: 600, color: 'var(--ai)', padding: '0 6px' }}>{o.excerpt ? 'Voir l’annonce complète ↗' : 'Voir sur France Travail ↗'}</a>
      </div>
    </div>
  );
}

export default function Jobs({ v }) {
  const J = v.jobs || {};
  const [q, setQ] = useState(J.defaults ? J.defaults.q : '');
  const [place, setPlace] = useState(J.defaults ? J.defaults.place : '');
  const [contract, setContract] = useState('');
  const [since, setSince] = useState('');
  const [sort, setSort] = useState('match');
  const [res, setRes] = useState(null); // { total, offers, page }
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fresh, setFresh] = useState({}); // id de recherche enregistrée → nombre de nouvelles offres
  const prof = useMemo(() => (J.cv ? cvProfile(J.cv) : null), [J.cv]);
  const [enabled, setEnabled] = useState(null);
  const [src, setSrc] = useState({ france: false, adzuna: false, countries: {} });
  const [source, setSource] = useState('france');
  const [country, setCountry] = useState(J.market === 'intl' ? 'gb' : J.market === 'fr' ? 'fr' : 'ca');
  useEffect(() => {
    window.LisibleAPI.config()
      .then((c) => {
        const j = c.jobs || {};
        setSrc({ france: !!j.france, adzuna: !!j.adzuna, countries: j.countries || {} });
        // France Travail pour le marché français, Adzuna (international) pour les autres.
        setSource(j.france && (J.market === 'fr' || !j.adzuna) ? 'france' : 'adzuna');
        setEnabled(!!(j.france || j.adzuna));
      })
      .catch(() => setEnabled(false));
  }, []);

  // Nouvelles offres des recherches enregistrées depuis la dernière consultation.
  useEffect(() => {
    if (!enabled || !(J.saved || []).length) return;
    let live = true;
    (async () => {
      for (const s of J.saved.slice(0, 5)) {
        try {
          const r = await window.LisibleAPI.jobs({ q: s.q, place: s.place, contract: s.contract, since: 31, source: s.source || 'france', country: s.country });
          if (!live) return;
          setFresh((f) => ({ ...f, [s.id]: r.offers.filter((o) => o.date && o.date > s.seen).length }));
        } catch (e) { /* compteur facultatif */ }
      }
    })();
    return () => { live = false; };
  }, [enabled, (J.saved || []).length]);

  async function run(p = 0, o = {}) {
    const query = { q: o.q ?? q, place: o.place ?? place, contract: o.contract ?? contract, since: o.since ?? since, page: p, source: o.source ?? source, country: o.country ?? country };
    if (!query.q.trim()) { setError('Indiquez un métier ou des mots-clés.'); return; }
    setBusy(true); setError('');
    try {
      const r = await window.LisibleAPI.jobs(query);
      setRes((prev) => ({ total: r.total, page: p, offers: p && prev ? [...prev.offers, ...r.offers] : r.offers }));
    } catch (e) { setError(e.message || 'Recherche impossible.'); }
    setBusy(false);
  }
  const openSaved = (s) => {
    setQ(s.q); setPlace(s.place); setContract(s.contract || ''); setSince('');
    if (s.source) setSource(s.source);
    if (s.country) setCountry(s.country);
    run(0, { q: s.q, place: s.place, contract: s.contract || '', since: '', source: s.source || 'france', country: s.country || country });
    J.markSeen(s.id);
    setFresh((f) => ({ ...f, [s.id]: 0 }));
  };

  const list = useMemo(() => {
    if (!res) return [];
    const rows = res.offers.map((o) => ({ o, m: prof ? matchOffer(prof, o) : { score: 0, hits: [] } }));
    return sort === 'match' ? rows.slice().sort((a, b) => b.m.score - a.m.score || (b.o.date > a.o.date ? 1 : -1)) : rows;
  }, [res, sort, prof]);

  if (enabled === null) return null;
  if (!enabled)
    return (
      <Card style={{ padding: '22px' }}>
        <H>Offres pour vous</H>
        <Muted>La recherche d’offres n’est pas encore activée. En attendant, cherchez sur les sites de votre marché, puis collez le lien ou le texte de l’annonce dans « Adapter à une offre ».</Muted>
        <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>{J.sites}</span>
      </Card>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <Card style={{ padding: '20px', gap: '12px' }}>
        <H>Offres pour vous</H>
        <Muted>Offres classées selon leur correspondance avec la version active de votre CV. Le classement est calculé sur votre appareil.</Muted>
        {src.france && src.adzuna ? (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><span style={label}>Source</span><Seg value={source} options={[['france', 'France (France Travail)'], ['adzuna', 'International (Adzuna)']]} onChange={(k) => { setSource(k); setRes(null); if (k === 'adzuna' && (contract === 'MIS' || contract === 'SAI')) setContract(''); }} /></div>
          </div>
        ) : null}
        {source === 'adzuna' ? (
          <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignSelf: 'flex-start' }}>
            <span style={label}>Pays</span>
            <select value={country} onChange={(e) => { setCountry(e.target.value); setRes(null); }} style={{ ...field, height: '36px' }}>
              {Object.entries(src.countries).sort((a, b) => a[1].localeCompare(b[1], 'fr')).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
        ) : null}
        {J.market === 'cm' || J.market === 'afr' ? <Muted>Les sources automatiques ne couvrent pas encore l’Afrique francophone (seule l’Afrique du Sud est chez Adzuna). Pour votre marché : {J.sites}</Muted> : null}
        <form onSubmit={(e) => { e.preventDefault(); run(0); }} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input aria-label="Métier ou mots-clés" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Métier ou mots-clés (ex. comptable)" style={{ ...field, flex: '2 1 220px' }} />
          <input aria-label="Lieu" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Ville, code postal ou département" style={{ ...field, flex: '1 1 180px' }} />
          <Btn kind="ai" type="submit" disabled={busy} style={{ height: '40px' }}>{busy ? 'Recherche…' : 'Rechercher'}</Btn>
        </form>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><span style={label}>Contrat</span><Seg value={contract} options={source === 'adzuna' ? CONTRACTS.slice(0, 3) : CONTRACTS} onChange={setContract} /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}><span style={label}>Publiées depuis</span><Seg value={since} options={SINCE} onChange={setSince} /></div>
        </div>
        {(J.saved || []).length ? (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={label}>Mes recherches :</span>
            {J.saved.map((s) => (
              <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '999px', border: '1px solid var(--line2)', background: 'var(--panel)' }}>
                <button type="button" onClick={() => openSaved(s)} style={{ border: 0, background: 'transparent', color: 'var(--tx)', font: 'inherit', fontSize: '12.5px', fontWeight: 600, padding: '5px 4px 5px 12px', cursor: 'pointer' }}>
                  {s.q}{s.place ? ' · ' + s.place : ''}{s.source === 'adzuna' && src.countries[s.country] ? ' · ' + src.countries[s.country] : ''}
                  {fresh[s.id] ? <span style={{ marginLeft: '6px', padding: '1px 7px', borderRadius: '999px', background: 'var(--ac)', color: '#fff', fontSize: '11px' }}>{fresh[s.id]} nouvelle{fresh[s.id] > 1 ? 's' : ''}</span> : null}
                </button>
                <button type="button" aria-label={'Supprimer la recherche ' + s.q} onClick={() => J.removeSearch(s.id)} style={{ border: 0, background: 'transparent', color: 'var(--fa)', font: 'inherit', fontSize: '14px', padding: '0 10px 0 4px', cursor: 'pointer' }}>×</button>
              </span>
            ))}
          </div>
        ) : null}
        {error ? <div role="alert" style={{ padding: '10px 12px', borderRadius: '10px', background: 'var(--ers)', color: 'var(--er)', fontSize: '13px', fontWeight: 600 }}>{error}</div> : null}
      </Card>

      {res ? (
        <Card style={{ padding: '6px 20px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', padding: '12px 0' }}>
            <strong style={{ fontSize: '13.5px' }}>{res.total ? res.total.toLocaleString('fr-FR') + ' offre' + (res.total > 1 ? 's' : '') : 'Aucune offre trouvée'}</strong>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Seg value={sort} options={[['match', 'Pertinence pour mon CV'], ['date', 'Plus récentes']]} onChange={setSort} />
              <Btn onClick={() => J.saveSearch({ q, place, contract, source, country: source === 'adzuna' ? country : '' })}>Enregistrer la recherche</Btn>
            </div>
          </div>
          {list.map(({ o, m }) => <Offer key={o.id} o={o} m={m} J={J} />)}
          {res.offers.length < res.total && res.offers.length < 1000 ? (
            <div style={{ paddingTop: '12px' }}><Btn onClick={() => run(res.page + 1)} disabled={busy}>{busy ? 'Chargement…' : 'Plus d’offres'}</Btn></div>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}
