/* Mode Études : suivi des candidatures aux formations, avec date limite, procédure, statut et
   pièces du dossier à cocher. Enregistré avec les préférences (appareil et compte). */
import React, { useState } from 'react';
import { Card, H, Muted, Btn } from '../../components/ui.jsx';
import { daysLeft } from '../../lib/applications.js';

export const PLATFORMS = {
  campus: ['Campus France (Études en France)', ['Test de langue (TCF, DELF, DALF ou IELTS)', 'Paiement des frais de dossier', 'Entretien Campus France', 'Justificatif de ressources (visa)']],
  parcoursup: ['Parcoursup', ['Projet de formation motivé', 'Bulletins scolaires']],
  monmaster: ['Mon Master', ['Attestation de réussite ou relevé de licence', 'Lettre de recommandation']],
  direct: ['Candidature directe (établissement)', ['Lettres de recommandation', 'Test de langue si demandé']],
  abroad: ['Établissement à l’étranger', ['Statement of purpose ou personal statement', 'Lettres de recommandation', 'Test de langue (IELTS, TOEFL…)', 'Traduction certifiée des diplômes']],
};
const BASE_DOCS = ['CV à jour', 'Lettre ou projet d’études', 'Relevés de notes', 'Diplômes', 'Pièce d’identité ou passeport'];
export const docsOf = (platform) => [...BASE_DOCS, ...((PLATFORMS[platform] || PLATFORMS.direct)[1])];
const STATUS = [['prepare', 'À préparer'], ['sent', 'Envoyée'], ['interview', 'Entretien'], ['admitted', 'Admis·e'], ['waitlist', 'Liste d’attente'], ['rejected', 'Refusée']];
const STATUS_COL = { prepare: 'var(--mu)', sent: 'var(--ai)', interview: 'var(--wa)', admitted: 'var(--ok)', waitlist: 'var(--wa)', rejected: 'var(--er)' };
const input = { height: '36px', padding: '0 12px', border: '1px solid var(--line2)', borderRadius: '10px', background: 'var(--panel)', color: 'var(--tx)', font: 'inherit', fontSize: '13px', outline: 'none', minWidth: 0 };


function Row({ a, S }) {
  const [open, setOpen] = useState(false);
  const docs = docsOf(a.platform);
  const done = docs.filter((d) => a.docs && a.docs[d]).length;
  const left = daysLeft(a.deadline);
  const closed = ['sent', 'interview', 'admitted', 'waitlist', 'rejected'].includes(a.status);
  const dl = left == null ? 'Date limite à renseigner' : left < 0 ? 'Date limite dépassée' : left === 0 ? 'Dernier jour' : 'J-' + left;
  const dlCol = left == null ? 'var(--fa)' : closed ? 'var(--fa)' : left <= 7 ? 'var(--er)' : left <= 21 ? 'var(--wa)' : 'var(--ok)';
  return (
    <div style={{ borderTop: '1px solid var(--line)', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <strong style={{ fontSize: '14px' }}>{a.program || 'Formation'}</strong>
          <span style={{ fontSize: '12.5px', color: 'var(--mu)' }}>{[a.school, (PLATFORMS[a.platform] || [''])[0]].filter(Boolean).join(' · ')}</span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: 700, color: dlCol }}>{dl}</span>
        <span style={{ fontSize: '12px', color: 'var(--mu)' }}>Dossier {done}/{docs.length}</span>
        <select aria-label="Statut" value={a.status} onChange={(e) => S.set(a.id, { status: e.target.value })} style={{ ...input, height: '32px', color: STATUS_COL[a.status], fontWeight: 600 }}>
          {STATUS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <Btn onClick={() => setOpen(!open)}>{open ? 'Replier' : 'Dossier'}</Btn>
      </div>
      {open ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', borderRadius: '12px', background: 'var(--sub)' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600, color: 'var(--mu)' }}>
              Date limite
              <input type="date" value={a.deadline || ''} onChange={(e) => S.set(a.id, { deadline: e.target.value })} style={input} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: 600, color: 'var(--mu)' }}>
              Procédure
              <select value={a.platform} onChange={(e) => S.set(a.id, { platform: e.target.value })} style={input}>
                {Object.entries(PLATFORMS).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap: '4px 12px' }}>
            {docs.map((d) => (
              <label key={d} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" checked={!!(a.docs && a.docs[d])} onChange={(e) => S.set(a.id, { docs: { ...(a.docs || {}), [d]: e.target.checked } })} />
                {d}
              </label>
            ))}
          </div>
          <textarea aria-label="Notes" value={a.note || ''} onChange={(e) => S.set(a.id, { note: e.target.value })} rows={2} placeholder="Notes : identifiant de candidature, contact, résultats attendus…" style={{ ...input, height: 'auto', padding: '8px 12px', resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <Btn kind="ai" onClick={() => S.toLetter(a)}>Préparer la lettre</Btn>
            <Btn onClick={() => S.toInterview(a)}>S’entraîner à l’entretien</Btn>
            <Btn onClick={() => S.remove(a.id)} style={{ color: 'var(--er)' }}>Supprimer</Btn>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function SchoolApps({ v }) {
  const S = v.schoolApps;
  const [school, setSchool] = useState('');
  const [program, setProgram] = useState('');
  const [platform, setPlatform] = useState('campus');
  const [deadline, setDeadline] = useState('');
  if (!S) return null;
  // Les dossiers en cours d'abord, par date limite la plus proche.
  const list = S.list.slice().sort((x, y) => {
    const fx = ['admitted', 'rejected'].includes(x.status), fy = ['admitted', 'rejected'].includes(y.status);
    if (fx !== fy) return fx ? 1 : -1;
    return (x.deadline || '9999') < (y.deadline || '9999') ? -1 : 1;
  });
  const add = (e) => {
    e.preventDefault();
    if (!school.trim() && !program.trim()) return;
    S.add({ school: school.trim(), program: program.trim(), platform, deadline });
    setSchool(''); setProgram(''); setDeadline('');
  };
  return (
    <Card style={{ padding: '20px', gap: '12px', marginBottom: '16px' }}>
      <H>Candidatures aux formations</H>
      <Muted>Dates limites, procédure et pièces du dossier pour chaque formation. Les dossiers les plus urgents apparaissent en premier.</Muted>
      <form onSubmit={add} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <input aria-label="Établissement" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Établissement" style={{ ...input, flex: '1 1 180px' }} />
        <input aria-label="Formation" value={program} onChange={(e) => setProgram(e.target.value)} placeholder="Formation (ex. Master Finance)" style={{ ...input, flex: '1 1 180px' }} />
        <select aria-label="Procédure" value={platform} onChange={(e) => setPlatform(e.target.value)} style={{ ...input, flex: '0 1 220px' }}>
          {Object.entries(PLATFORMS).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <input aria-label="Date limite" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={input} />
        <Btn kind="ai" type="submit">Ajouter</Btn>
        {S.fromLetter ? <Btn onClick={S.addFromLetter}>Ajouter : {S.fromLetter}</Btn> : null}
      </form>
      {list.map((a) => <Row key={a.id} a={a} S={S} />)}
      {!list.length ? <Muted>Aucune candidature pour l’instant.</Muted> : null}
    </Card>
  );
}
