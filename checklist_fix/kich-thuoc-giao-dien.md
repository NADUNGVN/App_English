# Tài liệu điều chỉnh kích thước giao diện

Tài liệu này ghi lại các kích thước hiện tại của giao diện để dùng làm mốc khi tinh chỉnh layout, typography, khoảng cách và nhịp khối.

- Nguồn số liệu: lấy từ code hiện tại trong `frontend/web_app/src`
- Đơn vị gốc trong code: `rem`, `px`, `fr`, `dvh`
- Quy đổi trong tài liệu:
  - `1rem = 16px`
  - Chỉ ghi các kích thước chính ảnh hưởng trực tiếp đến bố cục

---

## 1. Trước đăng nhập

### 1.1. Bảng tree

```text
PublicLayout
├── Header công khai
│   ├── page-shell (max-width 1360px, padding ngang responsive)
│   ├── BrandMark compact
│   ├── Navigation desktop
│   ├── LanguageToggle
│   ├── CTA đăng nhập / vào ứng dụng / đăng ký
│   └── Mobile menu button (44x44)
├── Nội dung công khai
│   ├── LandingPage
│   ├── LoginPage
│   │   ├── Cột trái hero desktop
│   │   └── Cột phải form đăng nhập
│   └── RegisterPage
│       ├── Khối intro trái
│       └── Form đăng ký phải
└── Footer công khai
    ├── BrandMark thường
    ├── Cột Product
    └── Cột Contact
```

### 1.2. Bảng khối

| Khối | Vị trí / vai trò | Kích thước hiện tại | Ghi chú điều chỉnh |
|---|---|---:|---|
| `page-shell` | Container dùng chung trước đăng nhập | `max-width: 1360px`; padding ngang `16 / 24 / 32px` theo breakpoint | Là khung biên lớn nhất để canh lề trái phải |
| Header công khai | Thanh điều hướng trên cùng | `py-4 = 16px`; sticky top | Chiều cao thực tế thay đổi theo nội dung |
| BrandMark compact | Logo ở header | icon vỏ `44x44px`; ảnh trong `36x36px`; gap `12px`; wordmark `1.35rem = 21.6px` | Dùng ở header công khai và sidebar sau đăng nhập |
| Nav desktop | Menu `Practice / Library / Results` | gap `8 = 32px`; text `14px` | Chỉ hiện từ `lg` |
| LanguageToggle | Chuyển ngữ trước đăng nhập | outer `p-1 = 4px`; button `px-3 py-1.5 = 12x6px`; text `12px` | Kiểu pill gọn |
| Button chính / phụ | CTA trước đăng nhập | `px-5 py-3 = 20x12px`; text `14px`; bo tròn full | Dùng chung cho login/register/dashboard CTA |
| Mobile menu button | Nút mở menu trên mobile | `44x44px` | Chỉ hiện dưới `lg` |
| Login section | Khung tổng trang đăng nhập | `min-height: calc(100dvh - 81px)`; `py-8 = 32px` | `81px` đang là mốc header công khai cũ |
| Login grid desktop | Bố cục 2 cột đăng nhập | `0.95fr / 1.05fr`; gap `10 = 40px` | Cột trái chỉ hiện từ `lg` |
| Login hero outer | Thẻ lớn cột trái | `min-height: 520px`; `p-8 = 32px` | Bên trong có thêm 1 lớp nền hero |
| Login hero inner | Nền hero cột trái | `rounded 1.8rem = 28.8px`; `p-8 = 32px` | Chứa eyebrow, title, body, mascot |
| Login title desktop | Tiêu đề lớn cột trái | `3.65rem = 58.4px` | Là text lớn nhất của cụm auth |
| Login mascot | Ảnh vịt cột trái | `288x288px` | `h-72 w-72` |
| Login form panel | Khối form bên phải | `max-width: xl = 576px`; padding `24 / 32px` | Đây là khối đọc-form chính |
| Login form stack | Khoảng cách trong form | `space-y-5 = 20px` | Các field đi theo nhịp này |
| Login title mobile/form | Tiêu đề trong form | `2rem = 32px` | Là title chính ở mobile |
| Field input | Input dùng chung auth | padding `16x12px`; bo `1rem = 16px`; text `14px` | Dùng cho login và register |
| Register page shell | Khung tổng trang đăng ký | `py-10 = 40px`; `max-width: 4xl = 896px` | Gọn hơn login nhưng có card lớn giữa |
| Register outer card | Card tổng đăng ký | `gap-8 = 32px`; `p-6 / p-8 = 24 / 32px`; grid `0.86fr / 1.14fr` ở desktop | Là wrapper chính của trang register |
| Register intro card | Khối giới thiệu bên trái | `p-6 = 24px` | Nằm trong `surface-panel-soft` |
| Register title | Tiêu đề lớn register | `3.25rem = 52px` | Nhỏ hơn login hero |
| Register mascot | Ảnh vịt register | `256x256px` | `h-64 w-64` |
| Footer công khai | Chân trang | `py-14 = 56px`; grid `1.1fr / 0.8fr / 0.8fr` | Dùng page-shell cùng lề trên |

### 1.3. Capture màn hình

<table>
  <tr>
    <td>
      <strong>Capture trước đăng nhập</strong><br />
      Chèn ảnh màn hình Landing / Login / Register tại đây khi review.<br />
      Gợi ý: chụp ở `1440x900` và `390x844`.
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>
      <strong>Thông tin có khung</strong><br />
      1. Kiểm tra logo có bị nhỏ hoặc lọt thỏm so với header không.<br />
      2. Kiểm tra title auth có đang quá lớn so với chiều cao viewport không.<br />
      3. Kiểm tra form có bị giãn dọc quá nhiều ở desktop không.<br />
      4. Kiểm tra CTA trước đăng nhập có cùng nhịp chiều cao và bo góc.
    </td>
  </tr>
</table>

---

## 2. Sau đăng nhập

### 2.1. Bảng tree

```text
AppShell
├── Grid chính
│   ├── Sidebar desktop
│   │   ├── Header sidebar
│   │   │   ├── BrandMark compact
│   │   │   └── Nút collapse
│   │   ├── Nav body cuộn nội bộ
│   │   │   ├── Main
│   │   │   ├── Bạn (accordion)
│   │   │   └── Cộng đồng (accordion)
│   │   └── Footer sidebar
│   │       ├── SidebarLocalePicker
│   │       └── Khối tài khoản
│   └── Main workspace
│       ├── Topbar
│       │   ├── Nút menu mobile
│       │   ├── Tiêu đề trang
│       │   └── Role pill
│       └── Main content
│           ├── WorkspaceCanvas
│           ├── WorkspaceSection
│           └── Page content (Dashboard, Learning, Dictation...)
└── Mobile drawer
    ├── Overlay
    ├── Nút đóng
    └── AppSidebar full height
```

### 2.2. Bảng khối

| Khối | Vị trí / vai trò | Kích thước hiện tại | Ghi chú điều chỉnh |
|---|---|---:|---|
| App shell | Khung tổng sau đăng nhập | `min-height: 100dvh`; desktop `h: 100dvh` | Toàn bộ app sau đăng nhập chạy trong khung này |
| Grid app | Chia `sidebar / content` | `grid-cols: 292px + auto` khi mở; `76px + auto` khi thu gọn | `18.25rem = 292px`; `4.75rem = 76px` |
| Sidebar desktop | Thanh bên trái | cao `100dvh`; nền riêng; border phải | Không dùng scroll toàn trang cho menu |
| Sidebar padding | Nhịp lề trong sidebar | mobile `p-4 = 16px`; desktop mở `px-4 pb-4`; desktop thu gọn `px-2.5 pb-4` | `pt` desktop bằng `0` vì header sidebar tự ăn chiều cao |
| Header sidebar | Hàng logo + nút collapse | `min-height: 5.25rem = 84px`; border bottom | Đây là mốc ngang bằng với topbar |
| BrandMark compact trong sidebar | Logo sau đăng nhập | icon `44x44px`; ảnh `36x36px`; wordmark `21.6px`; gap `12px` | Đang giống vùng logo trong ảnh bạn gửi |
| Nút collapse sidebar | Nút ô vuông bên phải logo | `48x48px`; bo `1rem = 16px` | Dùng cho mở rộng / thu gọn sidebar |
| Nav body sidebar | Khu menu giữa | `flex-1`; `overflow-y-auto`; scrollbar ẩn | Đây là vùng cuộn nội bộ kiểu ChatGPT |
| Item menu mở | Dòng điều hướng khi sidebar mở | `px-3.5 py-2.5 = 14x10px`; text `15px`; icon `18px`; radius `1.2rem = 19.2px` | Nhịp hiện tại là “gọn vừa” |
| Item menu thu gọn | Icon-only nav | `40x40px` | Không hiện text |
| Gap item | Khoảng cách dọc giữa item | `gap-1 = 4px` | Giữ menu chặt hơn trước |
| Section label | `Bạn`, `Cộng đồng` | text `11px`; uppercase; tracking `0.18em`; margin-top `20px`; padding-top `16px` | Có divider phía trên |
| Accordion body | Nội dung section thu gọn/mở ra | `mt-2.5 = 10px` khi mở | Có animation bằng `grid-template-rows` |
| Sidebar footer | Khối dưới cùng của sidebar | `mt-4`; `pt-4`; border top | Chứa ngôn ngữ + tài khoản |
| Locale picker mở | Nút ngôn ngữ trong sidebar | `px-3 py-2.5 = 12x10px`; icon nền `32x32px`; text `15px` | Nhỏ hơn bản cũ |
| Locale picker thu gọn | Khi sidebar collapse | `40x40px` | Chỉ còn icon |
| Account card mở | Khối tài khoản desktop mở | radius `1.5rem = 24px`; `p-3.5 = 14px` | Chứa label, tên, email, nút logout |
| Avatar/nút logout thu gọn | Footer khi sidebar collapse | avatar `40x40px`; logout `36x36px` | Giữ đủ target click |
| Workspace viewport | Khu cuộn nội dung chính | `overflow-y-auto`; `h:100dvh` desktop | Scroll chính tách khỏi sidebar |
| Topbar | Thanh trên của nội dung | `min-height: 84px` desktop; `px 16 / 20 / 24 / 32`; `py 10 / 12px` | Sticky top |
| Topbar title | Tiêu đề trang | `1.5rem = 24px`; `sm: 1.625rem = 26px` | Ví dụ `Home / Trang chủ` |
| Topbar mobile menu | Nút menu mobile | `40x40px` | Chỉ hiện dưới `lg` |
| Role pill | Nhãn vai trò bên phải | `px-3 py-1.5 = 12x6px`; text `11px` | Dùng trong topbar desktop |
| Main content padding | Padding nội dung chính | `px 16 / 20 / 24 / 32`; `pt 12 / 16`; `pb 20 / 24` | Áp dụng ngoài `WorkspaceCanvas` |
| Workspace section token | Padding section dùng chung | X: `16 / 20 / 24 / 28px`; Y: `16 / 18 / 20px` | Điều chỉnh bằng CSS vars trong `.app-shell` |
| Workspace canvas | Card nền lớn trong nội dung | bo `2rem = 32px`; border; shadow | Khung nội dung chính |
| Dashboard hero title | Tiêu đề lớn ở Trang chủ | `2.55rem = 40.8px`; `sm: 2.9rem = 46.4px` | Đây là title lớn nhất sau đăng nhập |
| Dashboard target card | Card mục tiêu ngày | radius `1.55rem = 24.8px`; `px-4 py-4 = 16px` | Card phụ ở góc phải |
| Dashboard stat block | Các ô chỉ số hàng đầu | `px-4 py-4 = 16px`; số lớn `2.15rem = 34.4px` | Đã nén lại để tiết kiệm chiều cao |
| Lesson card row | Dòng bài học trong Dashboard | `px-4 py-4 = 16px`; title `1.75rem = 28px` | Nhóm `Tiếp tục luyện` |
| Learning / Dictation / Dictionary cards | Card con trong các page app | phần lớn `p-5 = 20px`; radius khoảng `1.55rem` | Đang dùng cùng nhịp compact mới |
| Mobile drawer | Sidebar mobile nổi | `max-width: sm`; overlay full screen | Sidebar mobile vẫn dùng chung component |

### 2.3. Capture màn hình

<table>
  <tr>
    <td>
      <strong>Capture sau đăng nhập</strong><br />
      Chèn ảnh `Dashboard`, `Learning`, `Dictation`, `Sidebar expanded`, `Sidebar collapsed`.<br />
      Gợi ý: chụp ở `1440x900`, `1280x720`, `390x844`.
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>
      <strong>Thông tin có khung</strong><br />
      1. Mốc ngang quan trọng: đáy header sidebar phải bằng đáy topbar.<br />
      2. Sidebar cuộn nội bộ nhưng không hiện thanh scrollbar.<br />
      3. Khi sidebar mở: logo về `Trang chủ`.<br />
      4. Khi sidebar đóng: logo dùng để mở sidebar.<br />
      5. `Bạn` và `Cộng đồng` đang là accordion, trạng thái lưu localStorage.<br />
      6. Khi một route nằm trong section đang đóng, section đó phải tự mở ra.
    </td>
  </tr>
</table>

---

## 3. Mốc nhanh để canh theo ảnh bạn gửi

Áp dụng riêng cho vùng logo + nút ở đầu sidebar và tiêu đề đầu topbar:

| Hạng mục | Kích thước hiện tại |
|---|---:|
| Chiều cao hàng đầu sidebar | `84px` |
| Logo icon vỏ ngoài | `44x44px` |
| Logo ảnh trong | `36x36px` |
| Chữ `QuackUp` compact | `21.6px` |
| Khoảng cách icon ↔ chữ | `12px` |
| Nút ô vuông bên phải logo | `48x48px` |
| Chiều cao topbar desktop | tối thiểu `84px` |
| Tiêu đề topbar | `24px` đến `26px` |

Nếu bạn muốn chỉnh riêng đúng như ảnh `QuackUp | nút ô vuông | Home`, thì đây là 3 nhóm cần canh đầu tiên:

1. `Sidebar header min-height`
2. `BrandMark compact`
3. `Topbar title scale`

---

## 4. Gợi ý cập nhật tài liệu khi review vòng sau

Mỗi lần chụp màn hình và điều chỉnh tiếp, nên ghi thêm 4 dòng dưới ảnh:

```text
Màn hình:
Breakpoint:
Vấn đề nhìn thấy:
Kích thước cần đổi:
```

Ví dụ:

```text
Màn hình: Dashboard
Breakpoint: 1440x900
Vấn đề nhìn thấy: logo hơi nhỏ hơn tiêu đề topbar
Kích thước cần đổi: tăng wordmark compact từ 1.35rem lên 1.45rem
```
