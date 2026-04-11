# Legacy Vanilla Archive

Thư mục này lưu lại frontend Vanilla SPA cũ của dự án trước khi chuyển hẳn sang React + Vite + Tailwind.

Mục đích:
- giữ lịch sử tham chiếu nếu cần đối chiếu lại layout/mock cũ
- dọn `src/` hiện tại để không còn hai kiến trúc frontend song song
- tránh lẫn lộn giữa luồng React app đang chạy và luồng render bằng HTML string trước đây

Các file đã được chuyển vào archive:
- `src/main.js`
- `src/router.js`
- `src/styles/main.css`
- `src/components/Sidebar.js`
- `src/pages/landing.js`
- `src/pages/login.js`
- `src/pages/register.js`
- `src/pages/dashboard.js`
- `src/pages/learning.js`
- `src/pages/dictionary.js`
- `src/pages/dictation.js`
- `src/pages/leaderboard.js`
- `src/pages/statistics.js`
- `src/pages/vocabulary.js`

Lưu ý:
- Các file này không còn là entrypoint của app hiện tại.
- App hiện tại chạy từ `src/main.jsx` và route tree React trong `src/app/App.jsx`.
