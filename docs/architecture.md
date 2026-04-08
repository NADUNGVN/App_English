Bạn là một senior fullstack architect và staff engineer.

Hãy thiết kế và sinh ra bộ khung ban đầu cho một **web application** theo kiến trúc:

* **Client** : frontend web app cho người dùng
* **Server** : application server xử lý business logic và API
* **Database** : hệ quản trị dữ liệu lưu trữ lâu dài
* **Auth** : xác thực và phân quyền người dùng
* **Infra** : môi trường local development và deployment cơ bản

## Mục tiêu kiến trúc

Tôi muốn hệ thống đi theo mô hình:

**Client → Server → Database**

Trong đó:

* Frontend chỉ xử lý UI, state, gọi API
* Backend xử lý business logic, validation, authentication/authorization, và truy cập database
* Database chỉ lưu trữ dữ liệu
* Auth là module riêng về mặt kiến trúc, nhưng có thể được implement xuyên suốt giữa frontend và backend
* Dễ mở rộng sau này lên production

## Công nghệ mong muốn

Hãy dùng stack sau nếu phù hợp:

* **Frontend** : React + Vite + HTML + CSS
* **Backend** : Node.js + Express
* **Auth** : JWT hoặc Auth0 (ưu tiên JWT local trước để dễ chạy)
* **Database** : PostgreSQL
* **ORM / DB access** : Prisma
* **Infra** : Docker + Docker Compose
* **Deployment-ready structure** : có thư mục infra và file env mẫu

## Yêu cầu đầu ra

Hãy trả lời theo đúng thứ tự sau:

### 1. Giải thích kiến trúc tổng thể

* Giải thích rõ vai trò của Client, Server, Database, Auth
* Mô tả luồng request/response từ người dùng đến database và ngược lại
* Giải thích tại sao kiến trúc này phù hợp cho web app fullstack

### 2. Đề xuất cấu trúc thư mục project

Tạo cấu trúc thư mục rõ ràng theo kiểu monorepo như sau, nhưng tối ưu hơn nếu cần:

project-root/

* frontend/
* backend/
* auth/ hoặc auth module nếu không cần tách thư mục riêng
* database/
* infra/
* docs/

Hãy đưa ra cây thư mục hoàn chỉnh thực tế, có giải thích ngắn cho từng thư mục.

### 3. Sinh toàn bộ skeleton code ban đầu

Tạo code khởi tạo cho:

* frontend React
* backend Express
* route health check
* route auth cơ bản: register, login, profile
* kết nối PostgreSQL qua Prisma
* middleware auth bằng JWT
* file Docker Compose để chạy:
  * frontend
  * backend
  * postgres
* file `.env.example`
* README để chạy local

### 4. Thiết kế dữ liệu ban đầu

Tạo schema database tối thiểu cho:

* User
* Role hoặc permission tối giản
* một entity mẫu, ví dụ `Project` hoặc `Task`

### 5. Chuẩn coding và best practices

Áp dụng:

* chia layer rõ ràng: routes, controllers, services, repositories, middlewares
* validation input
* error handling chuẩn
* config env tách riêng
* code dễ mở rộng
* đặt tên nhất quán

### 6. Luồng phát triển từng giai đoạn

Đưa roadmap phát triển theo các giai đoạn:

* Phase 1: setup nền tảng
* Phase 2: auth + user
* Phase 3: business module đầu tiên
* Phase 4: deployment + monitoring

## Ràng buộc

* Không làm mọi thứ quá phức tạp như microservices ở giai đoạn đầu
* Ưu tiên clean architecture đơn giản, dễ hiểu, dễ chạy local
* Code phải chạy được ở local trước
* Chỉ tách service khi thực sự cần
* Nếu có nhiều lựa chọn kỹ thuật, hãy chọn phương án thực dụng nhất cho MVP

## Kỳ vọng rất cụ thể

Tôi không muốn chỉ có mô tả lý thuyết. Tôi muốn:

* cây thư mục cụ thể
* nội dung file mẫu quan trọng
* command để chạy
* giải thích ngắn tại sao chọn cấu trúc đó

Bắt đầu bằng:

1. sơ đồ kiến trúc dạng text
2. cây thư mục
3. code skeleton quan trọng nhất
