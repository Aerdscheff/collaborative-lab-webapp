-- Transition Lab V0.3.1 baseline schema
-- Private-by-default model with invitation auth (Supabase Auth users only)

create extension if not exists pgcrypto;

create type app_role as enum ('student', 'referent', 'facilitator', 'admin');
create type workflow_status as enum (
  'draft',
  'in_progress',
  'ready_for_review',
  'needs_revision',
  'validated_local',
  'validated_global',
  'published',
  'archived'
);
create type idea_decision as enum (
  'pending',
  'test',
  'modify',
  'abandon',
  'escalated',
  'published_summary'
);

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  kind text not null default 'lycee',
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role app_role not null default 'student',
  active boolean not null default true,
  invited_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  role app_role not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique(profile_id, organization_id)
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  summary text,
  status workflow_status not null default 'draft',
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  author_id uuid not null references profiles(id),
  entry_type text not null check (entry_type in ('observation', 'test', 'learning')),
  content text not null,
  status workflow_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists idea_discussions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  author_id uuid not null references profiles(id),
  title text not null,
  description text,
  decision idea_decision not null default 'pending',
  status workflow_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists idea_reactions (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references idea_discussions(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  reaction text not null,
  created_at timestamptz not null default now(),
  unique(idea_id, profile_id, reaction)
);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  journal_entry_id uuid references journal_entries(id) on delete cascade,
  idea_id uuid references idea_discussions(id) on delete cascade,
  owner_id uuid not null references profiles(id),
  storage_path text not null,
  visibility text not null default 'private' check (visibility in ('private', 'published')),
  created_at timestamptz not null default now()
);

create table if not exists publication_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  reviewer_id uuid not null references profiles(id),
  decision workflow_status not null check (decision in ('needs_revision', 'validated_local', 'validated_global', 'published', 'archived')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists consent_records (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  consent_type text not null,
  granted boolean not null,
  captured_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  table_name text not null,
  record_id uuid,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    'student'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create index if not exists idx_memberships_profile on memberships(profile_id);
create index if not exists idx_memberships_org on memberships(organization_id);
create index if not exists idx_projects_org on projects(organization_id);
create index if not exists idx_projects_status on projects(status);
create index if not exists idx_journal_project on journal_entries(project_id);
create index if not exists idx_idea_project on idea_discussions(project_id);

-- helper functions
create or replace function current_role() returns app_role
language sql stable as $$
  select coalesce((select role from profiles where id = auth.uid()), 'student'::app_role)
$$;

create or replace function is_member_of_org(org_id uuid) returns boolean
language sql stable as $$
  select exists(
    select 1
    from memberships m
    where m.organization_id = org_id
      and m.profile_id = auth.uid()
  )
$$;

create or replace function can_validate() returns boolean
language sql stable as $$
  select current_role() in ('facilitator', 'admin')
$$;

alter table profiles enable row level security;
alter table organizations enable row level security;
alter table memberships enable row level security;
alter table projects enable row level security;
alter table journal_entries enable row level security;
alter table idea_discussions enable row level security;
alter table idea_reactions enable row level security;
alter table media enable row level security;
alter table publication_reviews enable row level security;
alter table consent_records enable row level security;
alter table audit_logs enable row level security;

-- Profiles: self-read/update; admin full access
create policy "profiles self read" on profiles
for select using (id = auth.uid() or current_role() = 'admin');

create policy "profiles self update" on profiles
for update using (id = auth.uid() or current_role() = 'admin')
with check (id = auth.uid() or current_role() = 'admin');

-- Organizations only visible to members or admin
create policy "organizations private read" on organizations
for select using (is_member_of_org(id) or current_role() = 'admin');

create policy "organizations managed by validators" on organizations
for all using (current_role() in ('facilitator', 'admin'))
with check (current_role() in ('facilitator', 'admin'));

-- Membership visibility limited to own orgs
create policy "memberships private read" on memberships
for select using (
  profile_id = auth.uid()
  or is_member_of_org(organization_id)
  or current_role() in ('facilitator', 'admin')
);

create policy "memberships managed by validators" on memberships
for all using (current_role() in ('facilitator', 'admin'))
with check (current_role() in ('facilitator', 'admin'));

-- Projects private by default; published are public
create policy "projects read private or published" on projects
for select using (
  status = 'published'
  or is_member_of_org(organization_id)
  or current_role() in ('facilitator', 'admin')
);

create policy "projects insert members" on projects
for insert with check (
  created_by = auth.uid() and is_member_of_org(organization_id)
);

create policy "projects update validator or owner" on projects
for update using (
  created_by = auth.uid() or can_validate() or is_member_of_org(organization_id)
)
with check (
  can_validate()
  or (
    is_member_of_org(organization_id)
    and status in ('draft', 'in_progress', 'ready_for_review', 'needs_revision')
  )
);

-- Journal and ideas inherit project visibility
create policy "journal private read" on journal_entries
for select using (
  exists (
    select 1 from projects p
    where p.id = journal_entries.project_id
      and (p.status = 'published' or is_member_of_org(p.organization_id) or current_role() in ('facilitator', 'admin'))
  )
);

create policy "journal write members" on journal_entries
for all using (
  exists (
    select 1 from projects p
    where p.id = journal_entries.project_id
      and (is_member_of_org(p.organization_id) or current_role() in ('facilitator', 'admin'))
  )
) with check (
  exists (
    select 1 from projects p
    where p.id = journal_entries.project_id
      and (is_member_of_org(p.organization_id) or current_role() in ('facilitator', 'admin'))
  )
);

create policy "ideas private read" on idea_discussions
for select using (
  exists (
    select 1 from projects p
    where p.id = idea_discussions.project_id
      and (p.status = 'published' or is_member_of_org(p.organization_id) or current_role() in ('facilitator', 'admin'))
  )
);

create policy "ideas write members" on idea_discussions
for all using (
  exists (
    select 1 from projects p
    where p.id = idea_discussions.project_id
      and (is_member_of_org(p.organization_id) or current_role() in ('facilitator', 'admin'))
  )
) with check (
  exists (
    select 1 from projects p
    where p.id = idea_discussions.project_id
      and (is_member_of_org(p.organization_id) or current_role() in ('facilitator', 'admin'))
  )
);

create policy "reactions by participants" on idea_reactions
for all using (
  profile_id = auth.uid() and exists (
    select 1 from idea_discussions i
    join projects p on p.id = i.project_id
    where i.id = idea_reactions.idea_id
      and (is_member_of_org(p.organization_id) or current_role() in ('facilitator', 'admin'))
  )
) with check (
  profile_id = auth.uid() and exists (
    select 1 from idea_discussions i
    join projects p on p.id = i.project_id
    where i.id = idea_reactions.idea_id
      and (is_member_of_org(p.organization_id) or current_role() in ('facilitator', 'admin'))
  )
);

create policy "media private read" on media
for select using (
  visibility = 'published' or owner_id = auth.uid() or current_role() in ('facilitator', 'admin')
);

create policy "media owner write" on media
for all using (owner_id = auth.uid() or current_role() in ('facilitator', 'admin'))
with check (owner_id = auth.uid() or current_role() in ('facilitator', 'admin'));

create policy "reviews validator only" on publication_reviews
for all using (can_validate()) with check (can_validate());

create policy "consent self" on consent_records
for all using (profile_id = auth.uid() or current_role() in ('facilitator', 'admin'))
with check (profile_id = auth.uid() or current_role() in ('facilitator', 'admin'));

create policy "audit admin read" on audit_logs
for select using (current_role() = 'admin');

create policy "audit system insert" on audit_logs
for insert with check (current_role() in ('facilitator', 'admin'));
