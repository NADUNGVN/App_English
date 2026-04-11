# How to run

## Cách nhanh nhất: chạy full app bằng Docker

Chạy từ thư mục gốc `D:\work\web_app\App_English`:

```powershell
Copy-Item .env.example .env
docker compose -f .\infra\docker-compose.yml up --build
```

Mở:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001/api`

Tài khoản demo sau khi seed DB:
- Email: `demo@quackup.app`
- Password: `password123`

Tắt app:

```powershell
docker compose -f .\infra\docker-compose.yml down
```

## Chạy frontend riêng

```powershell
cd D:\work\web_app\App_English
npm --prefix frontend/web_app install
npm run web:dev
```

Mở `http://localhost:5173`

## Chạy backend thủ công

Yêu cầu:
- Node.js
- PostgreSQL chạy ở `localhost:5432`

```powershell
cd D:\work\web_app\App_English
Copy-Item .env.example .env
npm --prefix backend install
npm run api:generate
npm run api:push
npm run api:seed
npm run api:dev
```

Backend chạy tại `http://localhost:3001`
