# Frontend Guide

## Hiện trạng frontend

Frontend web hiện tại chạy bằng:
- React
- Vite
- Tailwind CSS v3
- React Router

Entry point hiện tại:
- `frontend/web_app/src/main.jsx`

Route tree hiện tại:
- `frontend/web_app/src/app/App.jsx`

## Public và authenticated app

Frontend được chia thành 2 nhánh chính:

### Public
- `/`
- `/login`
- `/register`

Layout:
- `frontend/web_app/src/layouts/PublicLayout.jsx`

### Authenticated app
- `/dashboard`
- `/learning`
- `/dictation`
- `/vocabulary`
- `/dictionary`
- `/leaderboard`
- `/statistics`
- `/shadowing`

Layout:
- `frontend/web_app/src/layouts/AppShell.jsx`

## Cấu trúc chính

```text
frontend/web_app/
├── archive/
│   └── legacy-vanilla/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   │   ├── app/
│   │   ├── common/
│   │   └── providers/
│   ├── data/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   │   ├── app/
│   │   ├── auth/
│   │   └── public/
│   ├── repositories/
│   └── styles/
└── tailwind.config.js
```

## Nguyên tắc tổ chức

- `layouts/` giữ khung điều hướng và vùng cuộn lớn.
- `pages/app/` chỉ render nội dung page bên trong app shell.
- `components/app/` giữ các module chrome dùng chung cho phần sau đăng nhập.
- `components/common/` giữ brand, toggle ngôn ngữ, state panels và primitive dùng lại.
- `repositories/` là lớp đọc dữ liệu; hiện tại phần lớn vẫn mock-backed.

## Legacy cũ

Frontend Vanilla cũ đã được chuyển sang:
- `frontend/web_app/archive/legacy-vanilla/`

Tài liệu frontend cũ theo luồng Vanilla được lưu tại:
- `docs/archive/FRONTEND_GUIDE.vanilla.md`
