# How to run

## Tổng quan hiện tại

Repo hiện chạy theo mô hình **Next.js full-stack**:

- Web frontend: `React + Next.js App Router + TypeScript + Tailwind`
- Backend API: Next.js Route Handlers dưới `/api/*`
- Auth + Database: Supabase remote

Nguồn dữ liệu thật vẫn là **Supabase remote**. Không dùng PostgreSQL local hay Prisma local để chạy app hiện tại.

## 1. Chuẩn bị env

Từ thư mục gốc:

```powershell
cd D:\work\web_app\App_English
Copy-Item .env.example .env
```

Điền giá trị Supabase thật:

```env
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Các URL local chuẩn:

```env
CLIENT_URL=http://localhost:3000
SUPABASE_EMAIL_REDIRECT_URL=http://localhost:3000/login?confirmed=1
SUPABASE_GOOGLE_REDIRECT_URL=http://localhost:3000/api/auth/google/callback
COOKIE_SAME_SITE=lax
COOKIE_SECURE=false
```

Không dùng `VITE_API_URL` nữa vì frontend và API cùng origin `/api`.

## 2. Cài dependencies

```powershell
cd D:\work\web_app\App_English\frontend\web_app
npm install
```

## 3. Chạy app

Từ thư mục gốc:

```powershell
cd D:\work\web_app\App_English
npm run web:dev
```

App chạy tại:

- Web: `http://localhost:3000`
- Health check: `http://localhost:3000/api/health`

## 4. Kiểm tra nhanh

```powershell
start http://localhost:3000
start http://localhost:3000/api/health
```

Kỳ vọng:

- `/` mở landing page.
- `/api/health` trả JSON health của Supabase.
- Khi chưa đăng nhập, `/dashboard` sẽ chuyển về `/register`.
- Google login mở `/api/auth/google/start`, callback về `/api/auth/google/callback`, backend set HttpOnly cookie rồi redirect `/dashboard`.

## Cấu hình Supabase local

Trong Supabase Dashboard, cấu hình:

- Site URL: `http://localhost:3000`
- Email confirm redirect: `http://localhost:3000/login?confirmed=1`
- Google callback redirect: `http://localhost:3000/api/auth/google/callback`

Google provider chỉ hoạt động khi Supabase project đã bật provider và Google Cloud Console có redirect URL đúng.

## Lệnh kiểm tra

```powershell
npm run web:typecheck
npm run web:build
```

## Docker Compose

Docker Compose hiện chỉ chạy một service Next.js:

```powershell
docker compose -f .\infra\docker-compose.yml up --build
```

Service mở tại `http://localhost:3000` và vẫn dùng Supabase remote từ `.env`.
