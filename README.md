# Transition Lab V0.3.1 (Prototype)

Institutional prototype for 4 pilot high schools, rebuilt from the previous Collaborative Lab codebase.

## 1) Repository audit summary

### What was found
- Existing backend API: **FastAPI** (`main.py`, `app/routes/*`) with legacy modules.
- Existing web frontend: **Vite + vanilla JS** under `web/`.
- Existing deploy target: **Netlify** (`netlify.toml`, `web/public/_redirects`).
- Existing Supabase dependency already present in frontend, but mixed with old product logic.

### What is intentionally kept
- Vite frontend tooling and Netlify SPA deployment pattern.
- Lightweight vanilla JS approach for fast prototyping.
- Supabase JS client usage pattern.

### What is intentionally replaced
- Legacy routing, views, and domain logic from Collaborative Lab.
- Old modules related to previous product structures.

## 2) Framework and dependencies (current V0.3.1)

Frontend (`web/`):
- Vite 5
- Vanilla JavaScript (ES modules)
- `@supabase/supabase-js` v2

Backend:
- Existing FastAPI code remains in repository but is not required for this V0.3.1 web prototype.

Database:
- Supabase PostgreSQL migration provided at:
  - `web/supabase/migrations/20260425_transition_lab_v031.sql`

## 3) Simplest rebuild plan used

1. Replace frontend entrypoint with clean SPA skeleton.
2. Implement required routes with placeholder institutional UX.
3. Add invitation-only login flow via Supabase Auth (magic link, no sign-up).
4. Add minimal role guards (`student`, `referent`, `facilitator`, `admin`).
5. Add SQL migration for required entities.
6. Add RLS with private-by-default access and controlled publication visibility.
7. Keep deployment simple for Netlify with SPA redirects.

## 4) Required routes implemented

- `/`
- `/login`
- `/dashboard`
- `/lycees`
- `/projects/[id]`
- `/projects/[id]/journal`
- `/projects/[id]/ideas`
- `/admin`
- `/publications/[slug]`

## 5) Auth and environment variables

Create env file from template:

```bash
cd web
cp .env.example .env.local
npm ci
npm run dev
```

Notes:
- No secret keys are committed.
- Service role key must **never** be put in frontend env vars.
- Required frontend vars:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### Invited-user setup (required because `shouldCreateUser: false`)

1. In Supabase Dashboard, create users in **Authentication → Users** (or invite them by email).
2. Confirm each invited user exists in `auth.users`.
3. Ensure each user has a corresponding row in `public.profiles` (the migration adds an `auth.users` trigger for this bootstrap).
4. Assign organizational access in `public.memberships` for one of the 4 pilot schools.
5. Set elevated roles (`referent`, `facilitator`, `admin`) only for staff users in `public.profiles.role`.

## 6) Database model included

Migration includes the required tables:
- `profiles`
- `organizations`
- `memberships`
- `projects`
- `journal_entries`
- `idea_discussions`
- `idea_reactions`
- `media`
- `publication_reviews`
- `consent_records`
- `audit_logs`

And required enums/statuses:
- Workflow: `draft`, `in_progress`, `ready_for_review`, `needs_revision`, `validated_local`, `validated_global`, `published`, `archived`
- Idea decisions: `pending`, `test`, `modify`, `abandon`, `escalated`, `published_summary`
- Roles: `student`, `referent`, `facilitator`, `admin`

## 7) RLS policy intent (private-by-default)

- Project/journal/idea content is private to organization members by default.
- Content is publicly readable only when status is `published`.
- Publication review actions restricted to `facilitator`/`admin`.
- Profile and consent access is scoped to self + elevated roles.
- Audit logs readable by admin only.

## 8) Local development

```bash
cd web
npm ci
npm run dev
```

Build test:

```bash
npm run build
```

## 9) Netlify deployment

Netlify setup:
- Base directory: `web`
- Build command: `npm ci && npm run build`
- Publish dir: `web/dist`
- Environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

If deploying from repo root in Netlify UI, use base directory `web` (recommended), or adapt `netlify.toml` to include base.

### Deployment checklist

- Add Netlify environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- Trigger deploy.
- Test student account login and dashboard access.
- Test referent account access.
- Test facilitator account access.

## 10) Scope exclusions (as requested)

Not implemented in this prototype:
- Full fund module.
- Full parliament module.
- Public self-registration.
- Google Sheets as app database.
