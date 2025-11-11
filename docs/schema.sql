-- Showcase3D Schema (Supabase/Postgres) – GCE version
create extension if not exists pgcrypto;
create extension if not exists uuid-ossp;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'visibility_t') then
    create type visibility_t as enum ('public','unlisted','private');
  end if;
  if not exists (select 1 from pg_type where typname = 'showcase_status_t') then
    create type showcase_status_t as enum ('uploaded','processing','ready','failed');
  end if;
  if not exists (select 1 from pg_type where typname = 'job_status_t') then
    create type job_status_t as enum ('queued','running','complete','failed');
  end if;
end $$;

create table if not exists public.showcases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  slug text not null unique,
  visibility visibility_t not null default 'private',
  status showcase_status_t not null default 'uploaded',
  input_path text,
  output_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  showcase_id uuid not null references public.showcases(id) on delete cascade,
  input_path text not null,
  output_path text,
  status job_status_t not null default 'queued',
  attempt_count int not null default 0,
  started_at timestamptz,
  finished_at timestamptz,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.tg_set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists tr_showcases_set_updated on public.showcases;
create trigger tr_showcases_set_updated before update on public.showcases
for each row execute function public.tg_set_updated_at();

drop trigger if exists tr_jobs_set_updated on public.jobs;
create trigger tr_jobs_set_updated before update on public.jobs
for each row execute function public.tg_set_updated_at();

create index if not exists idx_showcases_user_id on public.showcases(user_id);
create index if not exists idx_jobs_showcase_id on public.jobs(showcase_id);
create index if not exists idx_jobs_status on public.jobs(status);

drop view if exists public.public_showcases cascade;
create view public.public_showcases as
select id, title, slug, visibility, status, output_path, created_at
from public.showcases
where visibility in ('public','unlisted');

alter table public.showcases enable row level security;
alter table public.jobs enable row level security;

do $$ begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='showcases' and policyname='owner_all_showcases') then
    drop policy owner_all_showcases on public.showcases;
  end if;
end $$;

create policy owner_all_showcases on public.showcases
  as permissive for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

do $$ begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='jobs' and policyname='owner_select_jobs') then
    drop policy owner_select_jobs on public.jobs;
  end if;
end $$;

create policy owner_select_jobs on public.jobs
  as permissive for select to authenticated
  using (exists (select 1 from public.showcases s where s.id = jobs.showcase_id and s.user_id = auth.uid()));

do $$ begin
  if exists (select 1 from pg_policies where schemaname='public' and tablename='jobs' and policyname='service_role_write_jobs') then
    drop policy service_role_write_jobs on public.jobs;
  end if;
end $$;

create policy service_role_write_jobs on public.jobs
  as permissive for all to service_role
  using (true) with check (true);

grant select on public.public_showcases to anon;
grant select, insert, update, delete on public.showcases to authenticated;
grant select on public.jobs to authenticated;
grant all privileges on public.jobs to service_role;

create or replace function public.ensure_unique_slug(base text) returns text
language plpgsql as $$
declare s text := lower(regexp_replace(base, '[^a-zA-Z0-9]+','-','g'));
        candidate text := s; n int := 1;
begin
  while exists (select 1 from public.showcases where slug = candidate) loop
    n := n + 1; candidate := s || '-' || n::text;
  end loop;
  return candidate;
end $$;
