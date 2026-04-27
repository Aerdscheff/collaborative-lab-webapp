-- Suggested RLS additions for V0.3.2 role-based scoping.
-- Keep using anon/authenticated client keys (no service role in frontend).

-- Organizations: facilitators can read all, others only their own organization.
drop policy if exists "organizations_read_scoped" on public.organizations;
create policy "organizations_read_scoped"
on public.organizations
for select
using (
  exists (
    select 1
    from public.memberships m
    where m.user_id = auth.uid()
      and (
        m.role in ('facilitator', 'admin')
        or m.organization_id = organizations.id
      )
  )
);

-- Projects: facilitators can read all, others only projects tied to their organization.
drop policy if exists "projects_read_scoped" on public.projects;
create policy "projects_read_scoped"
on public.projects
for select
using (
  exists (
    select 1
    from public.memberships m
    where m.user_id = auth.uid()
      and (
        m.role in ('facilitator', 'admin')
        or m.organization_id = projects.organization_id
      )
  )
);

-- Memberships: users can read their own memberships.
drop policy if exists "memberships_read_own" on public.memberships;
create policy "memberships_read_own"
on public.memberships
for select
using (user_id = auth.uid());
