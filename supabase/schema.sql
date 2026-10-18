-- Lisible : schéma Supabase. À exécuter une fois dans Supabase → SQL Editor.
-- Idempotent : peut être relancé sans perte de données.

-- ─── Profil et préférences ────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  settings jsonb not null default '{}'::jsonb,   -- thème, modèle, police, langue, préférences, lettre en cours…
  updated_at timestamptz not null default now()
);

-- ─── Versions de CV (avec historique d'instantanés) ──────────
create table if not exists public.cv_versions (
  user_id uuid not null references auth.users (id) on delete cascade,
  id text not null,
  name text not null default '',
  tag text not null default 'Général',
  cv jsonb not null,
  history jsonb not null default '[]'::jsonb,
  updated_at bigint not null,                    -- horodatage en millisecondes (côté client)
  primary key (user_id, id)
);

-- ─── Suivi des candidatures ──────────────────────────────────
create table if not exists public.applications (
  user_id uuid not null references auth.users (id) on delete cascade,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- ─── Liens de relecture et commentaires ──────────────────────
create table if not exists public.share_links (
  token text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  version_id text not null,
  version_name text not null default '',
  snapshot jsonb not null,                       -- copie du CV au moment du partage (éventuellement anonymisée)
  perm text not null check (perm in ('read', 'comment')),
  expires_at timestamptz not null,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists share_links_user_idx on public.share_links (user_id);

create table if not exists public.share_comments (
  id uuid primary key default gen_random_uuid(),
  token text not null references public.share_links (token) on delete cascade,
  author text not null,
  section text not null,
  body text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists share_comments_token_idx on public.share_comments (token);

-- ─── Sécurité : chaque utilisateur ne voit que ses données ───
alter table public.profiles enable row level security;
alter table public.cv_versions enable row level security;
alter table public.applications enable row level security;
alter table public.share_links enable row level security;
alter table public.share_comments enable row level security;

drop policy if exists "profil : propriétaire" on public.profiles;
create policy "profil : propriétaire" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "versions : propriétaire" on public.cv_versions;
create policy "versions : propriétaire" on public.cv_versions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "candidatures : propriétaire" on public.applications;
create policy "candidatures : propriétaire" on public.applications for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "liens : propriétaire" on public.share_links;
create policy "liens : propriétaire" on public.share_links for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "commentaires : propriétaire du lien" on public.share_comments;
create policy "commentaires : propriétaire du lien" on public.share_comments for all
  using (exists (select 1 from public.share_links l where l.token = share_comments.token and l.user_id = auth.uid()))
  with check (exists (select 1 from public.share_links l where l.token = share_comments.token and l.user_id = auth.uid()));

-- ─── Accès public contrôlé pour les relecteurs (sans compte) ─
create or replace function public.get_shared_cv(p_token text)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'versionName', l.version_name,
    'cv', l.snapshot,
    'perm', l.perm,
    'expiresAt', l.expires_at,
    'comments', coalesce((select jsonb_agg(jsonb_build_object('author', c.author, 'section', c.section, 'body', c.body, 'createdAt', c.created_at) order by c.created_at)
                          from public.share_comments c where c.token = l.token), '[]'::jsonb))
  from public.share_links l
  where l.token = p_token and not l.revoked and l.expires_at > now();
$$;

create or replace function public.add_share_comment(p_token text, p_author text, p_section text, p_body text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.share_links where token = p_token and not revoked and expires_at > now() and perm = 'comment') then
    raise exception 'Lien expiré, révoqué ou en lecture seule';
  end if;
  if length(trim(coalesce(p_author, ''))) = 0 or length(trim(coalesce(p_body, ''))) = 0 then
    raise exception 'Nom et commentaire obligatoires';
  end if;
  if p_section not in ('contact', 'summary', 'experience', 'education', 'skills', 'languages', 'projects', 'certifications') then
    raise exception 'Section inconnue';
  end if;
  if (select count(*) from public.share_comments where token = p_token) >= 200 then
    raise exception 'Nombre maximal de commentaires atteint';
  end if;
  insert into public.share_comments (token, author, section, body)
  values (p_token, left(trim(p_author), 80), p_section, left(trim(p_body), 2000));
end;
$$;

revoke all on function public.get_shared_cv(text) from public;
revoke all on function public.add_share_comment(text, text, text, text) from public;
grant execute on function public.get_shared_cv(text) to anon, authenticated;
grant execute on function public.add_share_comment(text, text, text, text) to anon, authenticated;

-- ─── Création automatique du profil à l'inscription ──────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
