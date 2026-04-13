# Local Development

## Recommended Local Flow

This project now uses **remote Supabase** as the source of truth for auth and database.
For local development, run the frontend and backend directly with npm.

Before starting:

```powershell
cd D:\work\web_app\App_English
Copy-Item .env.example .env
```

Then replace the Supabase placeholder values in `.env` with your real project values.
If placeholders are still present, the backend will fail fast on startup.

## Frontend

```powershell
cd D:\work\web_app\App_English
npm run web:dev
```

## Backend

```powershell
cd D:\work\web_app\App_English
npm run api:dev
```

## Health Checks

After both processes are running:

```powershell
start http://localhost:5173
start http://localhost:3001/api/health
```

Expected local ports:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

## Docker Compose Status

`infra/docker-compose.yml` is a **legacy Prisma/Postgres stack** and is not the supported path for the current Supabase runtime.
Do not use Docker Compose to debug auth until that stack is rewritten to match the Supabase architecture.
