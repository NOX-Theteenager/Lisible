-- ─── Historique des simulations d'entretien ──────────────────
-- À exécuter une fois dans Supabase (SQL Editor), après schema.sql et 002_rgpd.sql.
-- Chaque séance (écrite ou vocale) : questions, réponses, retours STAR, bilan et analyse de l'oral.
-- Aucun audio n'est stocké : uniquement la transcription écrite et les indicateurs calculés.
create table if not exists public.interview_sessions (
  user_id uuid not null references auth.users (id) on delete cascade,
  id text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.interview_sessions enable row level security;
drop policy if exists "entretiens : propriétaire" on public.interview_sessions;
create policy "entretiens : propriétaire" on public.interview_sessions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create index if not exists interview_sessions_user_date on public.interview_sessions (user_id, created_at desc);

-- Conservation : les séances de plus de 2 ans sont supprimées (la tâche purge_inactive_accounts
-- de 002_rgpd.sql supprime déjà les comptes inactifs et leurs données en cascade).
create or replace function public.purge_old_interviews()
returns integer language sql security definer set search_path = public as $$
  with d as (delete from public.interview_sessions where created_at < now() - interval '2 years' returning 1)
  select count(*)::int from d;
$$;
revoke all on function public.purge_old_interviews() from public, anon, authenticated;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.unschedule(jobid) from cron.job where jobname = 'lisible-purge-interviews';
    perform cron.schedule('lisible-purge-interviews', '30 3 * * *', 'select public.purge_old_interviews()');
  end if;
end $$;
