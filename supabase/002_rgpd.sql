-- Lisible : conformité RGPD (droit à l'effacement et durées de conservation).
-- À exécuter une fois dans Supabase → SQL Editor, après schema.sql. Idempotent.

-- ─── Droit à l'effacement : l'utilisateur supprime lui-même son compte ───
-- Toutes les tables liées (profil, CV, candidatures, liens et commentaires)
-- sont supprimées en cascade avec le compte.
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then
    raise exception 'Non connecté';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ─── Durées de conservation appliquées automatiquement ───────
-- Liens de relecture : supprimés 30 jours après leur expiration ou révocation
-- (leurs commentaires partent avec eux).
create or replace function public.purge_expired_shares()
returns integer language sql security definer set search_path = public as $$
  with d as (
    delete from public.share_links
    where expires_at < now() - interval '30 days'
       or (revoked and created_at < now() - interval '30 days')
    returning 1
  ) select count(*)::int from d;
$$;

-- Comptes inactifs : supprimés après 3 ans sans connexion (ou 3 ans après
-- l'inscription si l'adresse n'a jamais été confirmée).
create or replace function public.purge_inactive_accounts()
returns integer language sql security definer set search_path = public, auth as $$
  with d as (
    delete from auth.users
    where coalesce(last_sign_in_at, created_at) < now() - interval '3 years'
    returning 1
  ) select count(*)::int from d;
$$;

revoke all on function public.purge_expired_shares() from public, anon, authenticated;
revoke all on function public.purge_inactive_accounts() from public, anon, authenticated;

-- Planification quotidienne avec pg_cron (extension fournie par Supabase).
create extension if not exists pg_cron;

do $$
begin
  perform cron.unschedule(jobid) from cron.job where jobname in ('lisible-purge-shares', 'lisible-purge-inactive');
  perform cron.schedule('lisible-purge-shares', '17 3 * * *', 'select public.purge_expired_shares()');
  perform cron.schedule('lisible-purge-inactive', '27 3 * * *', 'select public.purge_inactive_accounts()');
end;
$$;
