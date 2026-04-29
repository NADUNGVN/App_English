# Cấu trúc Web App - Dự án App_English

Dựa trên cấu trúc mã nguồn hiện tại của thư mục `frontend/web_app`, dưới đây là tổng quan về cấu trúc các trang (pages) của ứng dụng và cách tiếp cận thiết kế kỹ thuật.

## 1. Cấu trúc theo Page (Định tuyến)

Ứng dụng chia thành 3 phân khu logic chính (Marketing, Authentication, và Protected App), được định nghĩa tập trung trong luồng định tuyến tại `src/app/App.jsx` và mảng menu `src/app/appNavigation.js`.

```text
/
├── / (Marketing Landing Page - Trang chủ)
├── /english/ (Tính năng Marketing)
│   ├── /english/speaking
│   ├── /english/writing
│   ├── /english/listening
│   ├── /english/reading
│   └── /english/pricing (Bảng giá)
├── /login    (Đăng nhập)
├── /register (Đăng ký)
└── / (Hệ thống App - Yêu cầu xác thực đăng nhập)
    ├── /dashboard (Trang chủ nội bộ)
    ├── /vocabulary (Luyện từ vựng)
    ├── /dictation (Luyện nghe)
    ├── /shadowing (Luyện nói bước đầu)
    ├── /reading (Luyện đọc - Đang xây dựng)
    ├── /writing (Luyện viết - Đang xây dựng)
    ├── Quản lý cá nhân (You)
    │   ├── /review (Ôn tập)
    │   ├── /watch-history (Lịch sử xem)
    │   └── /saved-videos (Video đã lưu)
    ├── Tính năng cộng đồng
    │   ├── /community (Trang cộng đồng)
    │   ├── /leaderboard (Bảng xếp hạng chung)
    │   ├── /community/chat (Trò chuyện)
    │   └── /community/feedback (Phản hồi người dùng)
    ├── Thư viện và Tính năng khác (Ẩn khỏi Sidebar)
    │   ├── /learning (Thư viện chung)
    │   ├── /dictionary (Từ điển)
    │   └── /statistics (Thống kê)
```

## 2. Cách thức Hệ thống được Thiết kế (Architecture & Styling)

### Công nghệ cốt lõi
- **Framework nền**: `React` (Khởi tạo qua Vite thay vì Create React App).
- **Điều hướng (Router)**: Sử dụng `react-router-dom`, chia ứng dụng thành các Layout tách biệt: `<MarketingLayout>`, `<AuthLayout>` và `<AppShell>`.
- **Thiết kế giao diện (Styling)**: `TailwindCSS` dùng để style trực tiếp trên component. Tuy nhiên, dự án không viết "nát" Tailwind inline mà thiết kế **một Hệ Thống Định Dạng (Typography System)** và đóng gói chúng thành các class chuyên rẽ riêng trong file CSS.

### Làm thế nào để điều chỉnh các thuộc tính của Chữ (Font Properties)?

Dự án này sử dụng phông chữ **"Be Vietnam Pro"** thông qua TailwindCSS và được tuỳ biến tập trung rất tinh gọn. Vị trí chính xử lý UI/UX text là file: `src/styles/index.css`.

Hệ thống dùng các lớp tiện ích tự định nghĩa dưới layer components của Tailwind (như `.type-display-hero`, `.type-title-page`, `.type-body-md`...) để quy định tập trung. 

**Ví dụ một đoạn code ở file `index.css`:**
```css
.type-title-page {
  @apply font-semibold leading-[1.18] tracking-[-0.04em] text-ink-950 text-[clamp(1.75rem,3vw,2.1rem)];
  text-wrap: balance;
}
```

Dựa vào đây, nếu bạn muốn điều chỉnh hiển thị, có thể tác động đến từng yếu tố như sau:

1. **Độ dày/Mỏng của chữ (Font Weight / Thickness):**
   - Chú ý đến các tiện ích `@apply font-...` trong `index.css`.
   - Có thể đổi từ `font-semibold` (độ dày 600) thành:
     - `font-normal` (400 - chữ mảnh/ thường)
     - `font-medium` (500 - chữ trung bình)
     - `font-bold` (700 - chữ đậm)

2. **Kích thước chữ / Độ to nhỏ (Font Size):**
   - Đối với các thẻ hiển thị chính, UI Text/Heading đang dùng kĩ thuật **Fluid Typography** (Hàm `clamp()` nội suy kích thước động theo màn hình thiết bị) tránh bị vỡ giao diện.
   - Ví dụ: `text-[clamp(1.75rem,3vw,2.1rem)]`.
   - *Cách chỉnh:* 
     - Số đầu tiên (`1.75rem`) là kích cỡ nhỏ nhất trên Mobile. 
     - Số cuối (`2.1rem`) là kích cỡ cao nhất trên PC. 
     - **Tăng / Giảm 2 con số này** để chữ thu hẹp hay rộng ra theo ý bạn muốn.
   - Đối với văn bản text thường, bạn đổi `@apply text-base` thành `@apply text-sm` (nhỏ) hay `@apply text-lg` (lớn).

3. **Chiều cao dòng (Line Height) & Khoảng cách ký tự:**
   - **Khoảng cách dòng (Độ giãn cách lên xuống):** Được quy định tại `@apply leading-[1.18]` hoặc `@apply leading-relaxed`. Nếu muốn dòng dãn rộng ra, hãy thay đổi thành số lớn hơn như `leading-[1.4]` (Line height).
   - **Độ kéo giãn giữa các text (Tracking / Letter Spacing):** Đang được quy định bởi đoạn `@apply tracking-[-0.04em]`. Tăng thông số này lên (vd `tracking-[0em]` hoặc dương) sẽ làm khoảng trống giữa các kí tự giãn xa hơn.

**Tóm lại:** Để sửa giao diện cho bất kì class chữ nào trong App, bạn không cần phải lục tung tất cả Component. Thay vào đó, hãy xem chữ đó đang dùng class gì (Vd: `<h1 className="type-title-page">`), sau đó mở `src/styles/index.css` và điều chỉnh các biến Tailwind dưới layer component. UI sẽ cập nhật đồng bộ.

## 3. Cấu trúc trang Xác thực (Authentication: /login & /register)

Gần đây thư mục phân vùng người dùng (`src/pages/auth/LoginPage.jsx` và `RegisterPage.jsx`) đã được thay đổi đáng kể với thiết kế cấu trúc UI hiện đại và rẽ nhánh rõ rệt:

*   **Kiến trúc Đa ngôn ngữ (i18n):** Ngành ngữ hiển thị được gắn cứng động lực thông qua Hook `useAppContext()` (phân giải `locale` en/vi dựa trên đối tượng `copy` config trong nội bộ file).
*   **Kiến trúc Bố Cục Đóng Gói (Wrapper Layout):** Cả 2 trang đều tái sử dụng Component `<AuthSplitShell>` nhưng truyền Props tạo ra 2 biến thể hiển thị hoàn toàn khác nhau:
    *   `/login`: Giao diện Center-focused (chính giữa màn hình), đơn giản và tinh gọn.
    *   `/register`: Truyền bộ prop `sidePanel={{...}}` và hiển thị chế độ viền toàn hình phân đôi `variant="split"`. Nó đi kèm cột Sidebar tối màu bên trái chứa các thông số định hướng ("15 MINUTES / DAY", "4 SKILL SPACES").
*   **Giảm tải Hiển thị (Progressive Disclosure):** Các ô form cấu hình rườm rà (Email/Password/Name) nay được **ẩn hoàn toàn ở trạng thái mặc định** nhờ state `emailFormOpen`. Thay vào đó, bộ mặt ban đầu chỉ hiển thị nút Đăng nhập qua Google (do component `GoogleAuthButton` quản lý độc lập) nhằm tăng tỉ lệ chuyển đổi người dùng. Nút "Sign up with email v" (`handleEmailToggle`) sẽ làm nhiệm vụ xổ form chi tiết.
*   **Luồng xử lý URL & Message Phản hồi:** UI tự động hứng và bắt các URL query (`useSearchParams`) để điều phối panel thông báo. Ví dụ: Nếu Backend trả về URL có `?confirmed=1`, `?registered=1`, hoặc bắt lỗi Google `?oauthError=google`, các Alert Panel (`.bg-emerald-50`, `.bg-rose-50`) sẽ hiển thị để thông báo tới người dùng rất hiệu quả.
