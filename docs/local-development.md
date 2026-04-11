# Local Development

## Frontend

```powershell
cd D:\work\web_app\App_English\frontend\web_app
Copy-Item .env.example .env
npm install
npm run dev
```

## Backend

```powershell
cd D:\work\web_app\App_English
Copy-Item .env.example .env
cd backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Docker Compose

```powershell
cd D:\work\web_app\App_English
Copy-Item .env.example .env
docker compose -f infra/docker-compose.yml up --build
```
