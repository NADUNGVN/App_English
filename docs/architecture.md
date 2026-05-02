# Architecture

## Current Runtime

```text
Browser
  ↓
Next.js App Router
  ├─ React UI
  └─ /api route handlers
      ↓
Supabase Auth + Database + Storage
```

## Responsibilities

- `src/app`: Next routing, route groups, API route handlers.
- `src/views`: React page-level UI migrated from the previous SPA.
- `src/layouts`: Marketing, auth, and authenticated app shells.
- `src/server`: server-only modules for env validation, cookies, Supabase clients, auth, and user/profile logic.
- `supabase/migrations`: remote Supabase schema and storage policy history.

## Auth Flow

- Email/password register and login go through `/api/auth/register` and `/api/auth/login`.
- The server uses Supabase Auth, then stores session tokens in HttpOnly cookies.
- `/api/auth/me` restores the session and syncs the profile.
- Google OAuth starts at `/api/auth/google/start`, returns to `/api/auth/google/callback`, then redirects to `/dashboard`.

## Data Source

Supabase remote is the source of truth. The older Prisma/Postgres local stack is not part of the supported runtime.
