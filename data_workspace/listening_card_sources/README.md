# Listening Card Source Workspace

Muc dich: ban chi can cung cap nguon theo tung nhom. Moi file trong `groups/`
tuong ung voi mot `category_id` dang dung trong ung dung.

## Cach dien nhanh

1. Mo file trong `groups/` dung voi nhom noi dung.
2. Moi dong la mot nguon co the dung de tao card.
3. Chi bat buoc dien `source_url`. Cac cot con lai co the de trong neu chua biet.
4. Luu file CSV bang UTF-8.

## Cot trong file nguon

- `source_url`: link nguon bai nghe/video/trang tham khao.
- `source_title`: tieu de goi y neu ban co.
- `source_name`: ten nguon hien thi, vi du `BBC Learning English`, `TED-Ed`.
- `level_hint`: goi y cap do `A1`, `A2`, `B1`, `B2`, `C1`.
- `duration_minutes_hint`: goi y thoi luong theo phut.
- `youtube_video_id`: neu la YouTube va ban biet ID video.
- `thumbnail_url`: link anh thumbnail neu co.
- `notes`: ghi chu rieng cua ban.
- `priority`: `high`, `medium`, hoac `low`.
- `topic_bucket`: nhom chu de con de sap xep trong category.
- `import_batch`: ma dot nhap, vi du `bbc-6min-001`.
- `curation_status`: `candidate`, `approved`, hoac `skip`.
- `sort_priority`: so thu tu uu tien hien thi trong batch.

## Topic bucket goi y cho BBC 6 Minute English

- `health-wellbeing`: sleep, water, exercise, mental health, food and mood.
- `learning-memory`: memory, language learning, forgetting, reading.
- `lifestyle-growth`: dreams, happiness, doing nothing, money, habits.
- `society-culture`: loneliness, social media, body language, music, culture.
- `food-consumer`: coffee, apples, nutrition, daily consumption.
- `work-future`: work, AI, productivity, career-related topics.

## Nhom hien co

- `bbc-learning-english`
- `business`
- `health-medicine`
- `job-interview`
- `technology-science`
- `travel-culture`
- `daily-conversations`
- `ielts`
- `toeic`

## Dau ra sau khi xu ly

Sau khi ban dien nguon, minh se chuyen chung thanh card metadata theo schema day du
trong `card_metadata_template.csv`, roi dua vao module listening cua app.

## Script tao batch BBC 6 Minute English

Dung script nay khi can lay metadata playlist BBC theo batch:

```powershell
powershell -ExecutionPolicy Bypass -File data_workspace/listening_card_sources/tools/import_bbc_6min_playlist.ps1 `
  -PlaylistStart 1 `
  -PlaylistEnd 60 `
  -BatchCode bbc-6min-001
```

Script chi lay metadata flat-playlist: title, video id, duration, url, thumbnail.
Script khong tai video va khong lay transcript.

## Script crawl transcript BBC thanh segment CSV

Dung script nay de lay subtitle/caption YouTube va sinh segment CSV theo tung card:

```powershell
powershell -ExecutionPolicy Bypass -File data_workspace/listening_card_sources/tools/import_bbc_transcript_segments.ps1 `
  -MaxVideos 5 `
  -Status candidate
```

Mac dinh script:

- Doc cac dong `approved` trong `groups/bbc-learning-english.csv`.
- Uu tien subtitle `en-GB`, fallback `en`.
- Chi tai subtitle/caption, khong tai video/audio.
- Cat transcript thanh segment 4-10 giay, 5-18 tu neu co the.
- Ghi file vao `segments/bbc-learning-english/{lesson_id}.csv`.
- De `status=candidate` de review truoc khi convert vao app.

Khi da chap nhan batch pilot, co the sinh truc tiep segment approved:

```powershell
powershell -ExecutionPolicy Bypass -File data_workspace/listening_card_sources/tools/import_bbc_transcript_segments.ps1 `
  -MaxVideos 60 `
  -Status approved `
  -Overwrite
```

## Script convert approved sources vao app

Sau khi review xong, doi `curation_status` thanh `approved`, roi chay:

```powershell
powershell -ExecutionPolicy Bypass -File data_workspace/listening_card_sources/tools/convert_approved_sources.ps1
```

Script se doc cac file trong `groups/`, chi lay dong `approved`, validate du lieu,
va sinh `frontend/web_app/src/server/modules/listening/listening.generated.ts`.

## Workspace segment cho chi tiet card

Metadata chi tao card ngoai thu vien. De mot card mo duoc man hinh luyen dictation
that su, tao file CSV trong:

```text
data_workspace/listening_card_sources/segments/bbc-learning-english/{lesson_id}.csv
```

Lay `lesson_id` tu file generated hoac tu quy tac:
`bbc-6min-{slug-title}-{6-ky-tu-dau-youtube-id}`.

Cot trong file segment:

- `lesson_id`: id cua card can noi transcript.
- `segment_order`: thu tu doan, bat dau tu 1 va lien tuc.
- `start_seconds`, `end_seconds`: moc thoi gian trong video YouTube.
- `speaker`: ten nguoi noi, co the de trong de mac dinh `Speaker`.
- `transcript`: cau/cum nghe chuan de user go lai.
- `prompt_vi`, `prompt_en`: nhiem vu hien thi cho doan, co the de trong.
- `target_phrases`: cac cum trong tam, ngan cach bang `|`.
- `hint_phrase`, `hint_type`, `hint_vi`, `hint_en`: goi y loi nghe; dien ca 4 cot hoac de trong het.
- `vocabulary_terms`, `vocabulary_vi`, `vocabulary_en`: danh sach tu/cum, ngan cach bang `|`.
- `status`: chi dong `approved` moi duoc import vao app.

Quy tac cat doan v1:

- Uu tien 4-10 giay, 5-18 tu.
- Cat o dau cau, dau phay, menh de, hoac diem nghi tu nhien.
- Gop caption qua ngan; tach caption qua dai neu co diem ngat ro.
- Khong de timestamp overlap; `end_seconds` phai lon hon `start_seconds`.

Sau khi co segment approved, chay lai script convert. Card se tu chuyen
`contentStatus` thanh `READY`, co `segmentCount`, va detail page se mo workspace
player + input + check dap an.
