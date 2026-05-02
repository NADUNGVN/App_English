# Frontend Guide

> **React + Next.js App Router + TypeScript + Tailwind CSS**  
> Local development: **http://localhost:3000**

## Run

```powershell
cd D:\work\web_app\App_English
npm run web:dev
```

## Current Structure

```text
frontend/web_app/
├── src/
│   ├── app/              # Next routes, layouts, API route handlers
│   ├── components/       # Shared React components
│   ├── layouts/          # Marketing/auth/app shells
│   ├── views/            # Legacy UI page components rendered by App Router
│   ├── server/           # Server-only auth/user/Supabase modules
│   ├── repositories/     # Client-side API/mock repositories
│   ├── hooks/
│   ├── data/
│   ├── navigation/
│   └── styles/
├── public/
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Routing

- Marketing: `/`, `/english/speaking`, `/english/writing`, `/english/listening`, `/english/reading`, `/english/pricing`
- Auth: `/login`, `/register`
- Protected app: `/dashboard`, `/learning`, `/dictation`, `/vocabulary`, `/dictionary`, `/leaderboard`, `/statistics`, `/shadowing`
- API: `/api/health`, `/api/auth/*`, `/api/users/me`

`src/views` is intentionally not named `pages`, because Next would treat `src/pages` as the legacy Pages Router.
