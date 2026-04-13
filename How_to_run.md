# How to run

## Tổng quan

Repo hiện tại chạy theo kiến trúc:

- Frontend web: `Vite + React`
- Backend API: `Express`
- Auth + Database: `Supabase`

Nguồn dữ liệu thật là **Supabase remote**.
Không dùng PostgreSQL local hay Prisma local để chạy app nữa.

## Cách chạy chuẩn hiện tại

Chạy bằng `npm` ở 2 terminal riêng.

### 1. Chuẩn bị file môi trường

Chạy từ thư mục gốc:

```powershell
cd D:\work\web_app\App_English
Copy-Item .env.example .env
```

Sau đó mở file `.env` và thay toàn bộ giá trị placeholder bằng giá trị Supabase thật.

Các biến bắt buộc:

```env
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Các biến local thường dùng:

```env
CLIENT_URL=http://localhost:5173
SUPABASE_EMAIL_REDIRECT_URL=http://localhost:5173/login?confirmed=1
SUPABASE_GOOGLE_REDIRECT_URL=http://localhost:3001/api/auth/google/callback
COOKIE_SAME_SITE=lax
COOKIE_SECURE=false
VITE_API_URL=http://localhost:3001/api
```

Lưu ý:

- Backend sẽ báo lỗi ngay nếu `.env` vẫn còn placeholder từ `.env.example`
- Không cần tạo `backend/.env` hay `frontend/web_app/.env` nếu bạn đã dùng file `.env` ở thư mục gốc

### 2. Cài dependencies

Terminal 1:

```powershell
cd D:\work\web_app\App_English\backend
npm install
```

Terminal 2:

```powershell
cd D:\work\web_app\App_English\frontend\web_app
npm install
```

### 3. Chạy backend

```powershell
cd D:\work\web_app\App_English
npm run api:dev
```

Backend chạy tại:

- `http://localhost:3001`
- Health check: `http://localhost:3001/api/health`

### 4. Chạy frontend

```powershell
cd D:\work\web_app\App_English
npm run web:dev
```

Frontend chạy tại:

- `http://localhost:5173`

## Kiểm tra sau khi chạy

Mở lần lượt:

- `http://localhost:3001/api/health`
- `http://localhost:5173`

Kỳ vọng:

- `/api/health` trả JSON
- frontend mở được trang web
- bấm Google sẽ mở `http://localhost:3001/api/auth/google/start` rồi redirect tiếp sang flow đăng nhập

## Cách vận hành đăng nhập

### Đăng ký email/password

- Người dùng tạo tài khoản ở `/register`
- Hệ thống gửi email xác thực qua Supabase
- Người dùng phải xác thực email trước
- Sau đó quay về `/login` để đăng nhập

### Đăng nhập email/password

- Đăng nhập qua backend
- Backend set `HttpOnly cookie`
- Frontend dùng `/api/auth/me` để khôi phục phiên

### Đăng nhập Google

- Nút Google gọi `http://localhost:3001/api/auth/google/start`
- Backend mở flow OAuth của Supabase
- Callback quay về:
  - `http://localhost:3001/api/auth/google/callback`
- Thành công thì backend set cookie và redirect về `/dashboard`

## Cấu hình bắt buộc trên Supabase

Để email login và Google login hoạt động local, bạn cần cấu hình trong Supabase Dashboard:

### Auth URLs

Thêm đúng các URL sau:

- Site URL: `http://localhost:5173`
- Redirect URL cho email confirm: `http://localhost:5173/login?confirmed=1`
- Redirect URL cho Google callback: `http://localhost:3001/api/auth/google/callback`

### Google Provider

Google login chỉ hoạt động nếu:

- Google provider đã được bật trong Supabase
- Supabase project đã được điền `Client ID` và `Client Secret` của Google
- Redirect URL của Supabase/Google đã được cấu hình đúng trong Google Cloud Console

## Dừng app

Tắt từng terminal đang chạy:

- terminal backend: `Ctrl + C`
- terminal frontend: `Ctrl + C`

## Không dùng cách này

Hiện tại **không dùng** lệnh sau để debug auth:

```powershell
docker compose -f .\infra\docker-compose.yml up --build
```

Lý do:

- file `infra/docker-compose.yml` vẫn là stack Prisma/Postgres cũ
- không còn khớp với backend Supabase hiện tại
- có thể làm backend crash và dẫn tới lỗi như `localhost:3001 refused to connect`

## Khi gặp lỗi

### Trường hợp 1: `localhost:3001 refused to connect`

Nguyên nhân thường là backend chưa chạy hoặc backend crash khi start.

Kiểm tra:

```powershell
cd D:\work\web_app\App_English
npm run api:dev
```

Nếu crash ngay, đọc log terminal backend trước.

### Trường hợp 2: backend báo lỗi placeholder env

Bạn chưa thay giá trị thật trong `.env`.

### Trường hợp 3: bấm Google nhưng quay lại login

Kiểm tra:

- terminal backend có log lỗi gì không
- `SUPABASE_GOOGLE_REDIRECT_URL` trong `.env`
- Redirect URLs trong Supabase Dashboard
- Google provider đã bật chưa

### Trường hợp 4: đăng ký được nhưng không login được

Kiểm tra:

- đã xác thực email chưa
- email confirm có quay đúng về `/login?confirmed=1` không

## Lệnh nhanh

```powershell
cd D:\work\web_app\App_English
npm run api:dev
```

```powershell
cd D:\work\web_app\App_English
npm run web:dev
```
