/* Fiche entreprise : recherche web sur la structure qui recrute, avec sources. Elle nourrit la
   préparation et la simulation d'entretien (questions sur l'actualité, liens à faire avec le poste). */
import React, { useState } from 'react';
import { Card, H, Muted, Btn, AIBadge } from '../../components/ui.jsx';

const List = ({ title, items }) =>
  items && items.length ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <strong style={{ fontSize: '12px', color: 'var(--mu)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{title}</strong>
      <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '13px', lineHeight: 1.5 }}>
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  ) : null;

const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };

export default function CompanyBrief({ v }) {
  const b = v.brief || {};
  const d = b.data;
  const [open, setOpen] = useState(true);
  return (
    <Card style={{ padding: '18px 20px', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: '1 1 280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AIBadge /><H size={16}>Fiche entreprise{d && d.name ? ' : ' + d.name : b.company ? ' : ' + b.company : ''}</H></div>
          <Muted>
            {d
              ? 'Recherche web du ' + new Date(d.date).toLocaleDateString('fr-FR') + '. Le recruteur simulé et la préparation s’en servent. Vérifiez les informations avant l’entretien.'
              : 'Activité, actualité et valeurs de la structure, trouvées sur le web et sourcées. Seuls le nom de l’entreprise, le poste et l’offre sont utilisés pour la recherche.'}
          </Muted>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {d ? <Btn onClick={() => setOpen(!open)}>{open ? 'Replier' : 'Afficher'}</Btn> : null}
          <Btn kind={d ? 'line' : 'ai'} onClick={b.gen} disabled={b.busy || !b.company}>
            {b.busy ? 'Recherche en cours…' : d ? 'Mettre à jour' : 'Se renseigner sur l’entreprise'}
          </Btn>
        </div>
      </div>
      {!b.company ? <Muted>Renseignez l’entreprise dans l’onglet « Adapter » ou « Lettre » pour lancer la recherche.</Muted> : null}
      {d && open ? (
        d.found ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.6 }}>{d.summary}{d.sector ? <span style={{ color: 'var(--mu)' }}> · {d.sector}</span> : null}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: '14px' }}>
              <List title="Activités" items={d.activities} />
              <List title="Valeurs et engagements" items={d.values} />
              <List title="Actualité" items={d.recent} />
              <List title="Liens à faire en entretien" items={d.interviewAngles} />
              <List title="Questions à poser au recruteur" items={d.questionsToAsk} />
            </div>
            {d.sources && d.sources.length ? (
              <div style={{ fontSize: '12px', color: 'var(--mu)', display: 'flex', flexWrap: 'wrap', gap: '6px 10px' }}>
                <strong>Sources :</strong>
                {d.sources.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer nofollow" title={s.title} style={{ color: 'var(--ai)' }}>{s.title && s.title.length < 40 ? s.title : host(s.url)}</a>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <Muted>Peu d’informations publiques fiables ont été trouvées sur cette structure. L’entretien s’appuiera sur l’offre et votre profil.</Muted>
        )
      ) : null}
    </Card>
  );
}
