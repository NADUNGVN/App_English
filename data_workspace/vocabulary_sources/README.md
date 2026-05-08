# Vocabulary source workspace

Không gian này dùng để đội nội dung nhập dữ liệu luyện từ theo nhóm. Quy trình chuẩn:

1. Điền hoặc cập nhật `collections.csv`.
2. Điền các set trong `sets.csv`.
3. Điền từng từ trong `words.csv`.
4. Chạy import:

```powershell
cd D:\work\web_app\App_English\data_workspace\vocabulary_sources
node .\tools\import_vocabulary_sources.mjs
```

Script dùng biến môi trường ở repo root:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Quy tắc dữ liệu

- `slug` viết thường, dùng dấu `-`, không dùng khoảng trắng.
- `category`: `IELTS`, `TOEIC`, `ACADEMIC`, `OXFORD`, hoặc `GENERAL`.
- `level`: `A1`, `A2`, `B1`, `B2`, `C1`, `C2`, hoặc để trống.
- `is_premium`: `true` hoặc `false`.
- Các cột dạng danh sách như `synonyms`, `collocations`, `tags` dùng dấu `|`.
- `status`: dùng `PUBLISHED` để hiện trong sản phẩm, `DRAFT` để giữ nội bộ.

## Cấu trúc quan hệ

- Một `collection` là một bộ lớn, ví dụ `Destination B2`.
- Một `set` là nhóm nhỏ bên trong collection, ví dụ `topic-01-work-and-study`.
- Một `word` thuộc đúng một set và một collection.

Khi import lại, script upsert theo:

- Collection: `slug`
- Set: `collection_slug + slug`
- Word: `collection_slug + set_slug + normalized`
