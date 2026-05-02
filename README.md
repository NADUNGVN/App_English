# App English

QuackUp English is now a **Next.js full-stack** web app.

## Stack

- Frontend: React + Next.js App Router + TypeScript + Tailwind CSS
- Backend: Next.js Route Handlers under `/api/*`
- Auth/database: Supabase remote
- Mobile app: React Native/Expo remains under `frontend/mobile_app`

## Run Local

```powershell
cd D:\work\web_app\App_English
Copy-Item .env.example .env
```

Fill real Supabase values in `.env`, then:

```powershell
npm install --prefix frontend/web_app
npm run web:dev
```

Open:

- App: `http://localhost:3000`
- Health: `http://localhost:3000/api/health`

## Important Env

```env
CLIENT_URL=http://localhost:3000
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_EMAIL_REDIRECT_URL=http://localhost:3000/login?confirmed=1
SUPABASE_GOOGLE_REDIRECT_URL=http://localhost:3000/api/auth/google/callback
COOKIE_SAME_SITE=lax
COOKIE_SECURE=false
```

`VITE_API_URL` is no longer used.

## Structure

```text
frontend/web_app/
├── src/app/          # Next routes, layouts, API route handlers
├── src/components/   # Shared UI
├── src/layouts/      # Marketing/auth/app shells
├── src/views/        # React page components rendered by App Router
├── src/server/       # Server-side auth/user/Supabase logic
├── src/repositories/ # Client API/mock repositories
├── src/data/
├── src/navigation/
└── src/styles/
```

## Checks

```powershell
npm run web:typecheck
npm run web:build
```

Express backend files remain in `backend/` as legacy reference, but the supported runtime is the Next app in `frontend/web_app`.
