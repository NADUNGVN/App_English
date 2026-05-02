# Local Development

## Runtime

App hiện dùng một runtime Next.js full-stack:

- UI React chạy qua Next App Router.
- API chạy trong `src/app/api/*/route.ts`.
- Supabase remote là nguồn auth/database.

## Start

```powershell
cd D:\work\web_app\App_English
Copy-Item .env.example .env
```

Điền Supabase env thật, sau đó:

```powershell
npm install --prefix frontend/web_app
npm run web:dev
```

Local URLs:

- App: `http://localhost:3000`
- Health: `http://localhost:3000/api/health`

## Useful Checks

```powershell
npm run web:typecheck
npm run web:build
```

## Notes

- Không chạy `npm run api:dev`; Express backend không còn là runtime chính.
- Không dùng `VITE_API_URL`; frontend gọi same-origin `/api`.
- Docker Compose legacy Prisma/Postgres đã được thay bằng một service Next dùng Supabase remote.
