# How to run

## Tổng quan

Repo hiện chạy theo mô hình Next.js full-stack:

- Frontend: React + Next.js App Router + TypeScript + Tailwind.
- Backend API: Next.js Route Handlers dưới `/api/*`.
- Auth + Database: Supabase remote.
- Internal review workspace: khu vực quản trị riêng, dùng cookie admin riêng, không dùng tài khoản người học.

## Chuẩn bị env

Từ thư mục gốc:

```powershell
cd D:\work\web_app\App_English
Copy-Item .env.example .env
```

Điền Supabase thật:

```env
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

URL local chuẩn:

```env
CLIENT_URL=http://localhost:3000
SUPABASE_EMAIL_REDIRECT_URL=http://localhost:3000/login?confirmed=1
SUPABASE_GOOGLE_REDIRECT_URL=http://localhost:3000/api/auth/google/callback
COOKIE_SAME_SITE=lax
COOKIE_SECURE=false
```

Khi chạy local, internal admin có fallback sẵn. Nếu cần cấu hình riêng, thêm:

```env
INTERNAL_ADMIN_EMAIL=admin@quackup.local
INTERNAL_ADMIN_PASSWORD_HASH=...
INTERNAL_ADMIN_SESSION_SECRET=change-this-to-a-long-random-secret
```

## Cài dependencies

```powershell
cd D:\work\web_app\App_English\frontend\web_app
npm install
```

## Chạy app

Từ thư mục gốc:

```powershell
cd D:\work\web_app\App_English
npm run web:dev
```

Mở:

- App: `http://localhost:3000`
- Dictation: `http://localhost:3000/dictation`
- Vocabulary: `http://localhost:3000/vocabulary`
- Health check: `http://localhost:3000/api/health`

Nếu port `3000` đang bị chiếm, dừng process Next.js cũ rồi chạy lại.

## Database migrations

Apply migration lên Supabase trước khi dùng Listening/Vocabulary:

```powershell
supabase db push
```

Nếu không dùng Supabase CLI, copy nội dung migration trong `supabase/migrations` và chạy trong Supabase SQL Editor theo thứ tự.

## Vocabulary data workspace

Không gian nhập dữ liệu từ vựng nằm ở:

```text
data_workspace/vocabulary_sources
```

Các file chính:

- `collections.csv`: bộ lớn như `Destination B2`, `Oxford 5000`.
- `sets.csv`: nhóm nhỏ trong từng bộ.
- `words.csv`: từng từ, nghĩa, ví dụ, IPA, tags.

Import dữ liệu lên Supabase:

```powershell
cd D:\work\web_app\App_English\data_workspace\vocabulary_sources
node .\tools\import_vocabulary_sources.mjs
```

Script dùng `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY` từ `.env`. Chỉ đặt `status=PUBLISHED` cho dữ liệu đã sẵn sàng hiển thị trên sản phẩm.

## Không gian nội bộ kiểm duyệt listening

Khu vực này tách biệt khỏi đăng nhập người học. Tài khoản Google/Supabase của người học không đủ quyền vào workspace nội bộ.

Đường vào:

1. Mở `http://localhost:3000/internal/login`
2. Đăng nhập local dev:
   - Email: `admin@quackup.local`
   - Password: `Admin@123456`
3. Sau khi đăng nhập, hệ thống chuyển tới `http://localhost:3000/internal/listening-review`

Workspace này dùng để chỉnh sửa, kiểm duyệt và approve timing/subtitle trước khi dữ liệu được đưa vào sản phẩm.

### Local timing worker

Nút `Run timing` trong `http://localhost:3000/internal/listening-review` sẽ:

1. Tải/cache audio YouTube bằng `yt-dlp` vào `data_workspace/listening_card_sources/.tmp/audio`.
2. Chạy Faster Whisper để tạo word-level timing.
3. Lưu draft vào Supabase table `listening_timing_documents`.

Cần có sẵn:

```powershell
ffmpeg -version
yt-dlp --version
.\.venv\Scripts\pip install faster-whisper
```

Env liên quan:

```env
LISTENING_TIMING_PYTHON=.venv\Scripts\python.exe
LISTENING_TIMING_MODEL=large-v3
LISTENING_TIMING_DEVICE=cpu
```

Nếu máy có CUDA, đổi `LISTENING_TIMING_DEVICE=cuda` để chạy nhanh hơn.

## Lệnh kiểm tra

```powershell
npm run web:typecheck
npm run web:build
```

## Supabase Dashboard

Trong Supabase Dashboard, cấu hình:

- Site URL: `http://localhost:3000`
- Email confirm redirect: `http://localhost:3000/login?confirmed=1`
- Google callback redirect: `http://localhost:3000/api/auth/google/callback`

Google provider chỉ hoạt động khi Supabase project đã bật provider và Google Cloud Console có redirect URL đúng.

## Docker Compose

Docker Compose hiện chỉ chạy service Next.js:

```powershell
docker compose -f .\infra\docker-compose.yml up --build
```

Service mở tại `http://localhost:3000` và vẫn dùng Supabase remote từ `.env`.
