-- ============================================================================
-- NumidAI · Client Acquisition Backend — Supabase (PostgreSQL) schema
-- Run this in the Supabase SQL editor (or `supabase db push` via CLI).
-- Idempotent-ish: guarded creates where possible.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1 · Project workflow status (the pipeline)
-- ---------------------------------------------------------------------------
do $$ begin
  create type project_status as enum (
    'new_request',
    'ai_review',
    'concept_generation',
    'architect_review',
    'engineering_review',
    'client_approval',
    'construction_documents',
    'completed'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 2 · Tables
-- ---------------------------------------------------------------------------
create table if not exists clients (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  email       text not null unique,
  phone       text,
  created_at  timestamptz not null default now()
);

create sequence if not exists project_code_seq;

create table if not exists projects (
  id                        uuid primary key default gen_random_uuid(),
  project_code              text unique,                       -- NUM-2026-0001 (auto)
  client_id                 uuid not null references clients(id) on delete cascade,
  -- form answers (mirrors the Green Building Design Request form)
  project_type              text,                              -- residential | commercial | public | other
  project_type_other        text,
  project_stage             text,                              -- idea | design | construction | retrofit | other
  project_stage_other       text,
  location                  text,                              -- "City, Country"
  surface_area_m2           numeric,
  floors                    integer,
  priorities                text[] default '{}',               -- carbon, energy, water, costs, comfort, other
  priorities_other          text,
  budget_range              text,                              -- low | medium | high
  timeline                  text,                              -- optional addition (not in original form)
  sustainability_prefs      text[] default '{}',               -- solar, insulation, local_materials, water, green_roofs, smart, other
  sustainability_other      text,
  additional_comments       text,
  -- workflow
  status                    project_status not null default 'new_request',
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create table if not exists project_status_history (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  status      project_status not null,
  note        text,
  changed_by  text,                                            -- team member / 'system' / future ai agent id
  created_at  timestamptz not null default now()
);

create table if not exists project_files (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id) on delete cascade,
  file_name     text not null,
  storage_path  text not null,                                 -- Supabase Storage object path
  kind          text,                                          -- concept | drawing | report | reference
  uploaded_by   text,
  created_at    timestamptz not null default now()
);

create table if not exists project_notes (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  author      text,
  body        text not null,
  created_at  timestamptz not null default now()
);

create table if not exists messages (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete cascade,
  sender_role  text not null check (sender_role in ('client','team','ai_agent')),
  body         text not null,
  created_at   timestamptz not null default now()
);

create index if not exists idx_projects_status     on projects(status);
create index if not exists idx_projects_created    on projects(created_at desc);
create index if not exists idx_status_hist_project on project_status_history(project_id);
create index if not exists idx_notes_project       on project_notes(project_id);
create index if not exists idx_messages_project    on messages(project_id);

-- ---------------------------------------------------------------------------
-- 3 · Triggers — project code + updated_at + status history on change
-- ---------------------------------------------------------------------------
create or replace function set_project_code() returns trigger
language plpgsql as $$
begin
  if new.project_code is null then
    new.project_code := 'NUM-' || to_char(now(), 'YYYY') || '-' ||
                        lpad(nextval('project_code_seq')::text, 4, '0');
  end if;
  return new;
end $$;

drop trigger if exists trg_project_code on projects;
create trigger trg_project_code before insert on projects
for each row execute function set_project_code();

create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists trg_projects_touch on projects;
create trigger trg_projects_touch before update on projects
for each row execute function touch_updated_at();

-- keep an audit row every time status changes (admin dashboard edits)
create or replace function log_status_change() returns trigger
language plpgsql as $$
begin
  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    insert into project_status_history (project_id, status, changed_by, note)
    values (new.id, new.status, coalesce(auth.jwt() ->> 'email', 'system'), 'Status updated');
  end if;
  return new;
end $$;

drop trigger if exists trg_projects_status_log on projects;
create trigger trg_projects_status_log after update on projects
for each row execute function log_status_change();

-- ---------------------------------------------------------------------------
-- 4 · Row Level Security
--     Public (anon) can do exactly ONE thing: call submit_project().
--     The NumidAI team (authenticated) can read and manage everything.
-- ---------------------------------------------------------------------------
alter table clients                 enable row level security;
alter table projects                enable row level security;
alter table project_status_history  enable row level security;
alter table project_files           enable row level security;
alter table project_notes           enable row level security;
alter table messages                enable row level security;

-- team (any authenticated user) — tighten later with roles/claims if needed
do $$ begin
  create policy team_all_clients  on clients  for all to authenticated using (true) with check (true);
  create policy team_all_projects on projects for all to authenticated using (true) with check (true);
  create policy team_all_hist     on project_status_history for all to authenticated using (true) with check (true);
  create policy team_all_files    on project_files for all to authenticated using (true) with check (true);
  create policy team_all_notes    on project_notes for all to authenticated using (true) with check (true);
  create policy team_all_msgs     on messages for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
-- (no anon policies: anon cannot touch tables directly)

-- ---------------------------------------------------------------------------
-- 5 · Public submission RPC — atomic client + project + initial workflow state
--     SECURITY DEFINER bypasses RLS inside a controlled, validated function.
-- ---------------------------------------------------------------------------
create or replace function submit_project(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client_id uuid;
  v_project   projects;
begin
  -- minimal server-side validation (mirror of client-side rules)
  if coalesce(trim(payload->>'full_name'), '') = ''
     or payload->>'email' !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
     or coalesce(trim(payload->>'location'), '') = '' then
    raise exception 'invalid_submission';
  end if;

  -- upsert client by email
  insert into clients (full_name, email, phone)
  values (trim(payload->>'full_name'), lower(trim(payload->>'email')), payload->>'phone')
  on conflict (email) do update set full_name = excluded.full_name
  returning id into v_client_id;

  insert into projects (
    client_id, project_type, project_type_other, project_stage, project_stage_other,
    location, surface_area_m2, floors,
    priorities, priorities_other, budget_range, timeline,
    sustainability_prefs, sustainability_other, additional_comments
  ) values (
    v_client_id,
    payload->>'project_type',  payload->>'project_type_other',
    payload->>'project_stage', payload->>'project_stage_other',
    trim(payload->>'location'),
    nullif(payload->>'surface_area_m2','')::numeric,
    nullif(payload->>'floors','')::integer,
    coalesce((select array_agg(x) from jsonb_array_elements_text(payload->'priorities') x), '{}'),
    payload->>'priorities_other',
    payload->>'budget_range',
    payload->>'timeline',
    coalesce((select array_agg(x) from jsonb_array_elements_text(payload->'sustainability_prefs') x), '{}'),
    payload->>'sustainability_other',
    payload->>'additional_comments'
  ) returning * into v_project;

  insert into project_status_history (project_id, status, changed_by, note)
  values (v_project.id, 'new_request', 'system', 'Submitted via website form');

  return jsonb_build_object('project_id', v_project.id, 'project_code', v_project.project_code);
end $$;

revoke all on function submit_project(jsonb) from public;
grant execute on function submit_project(jsonb) to anon, authenticated;
