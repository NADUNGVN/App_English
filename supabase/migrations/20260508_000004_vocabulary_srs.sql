create table if not exists public.vocabulary_collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category text not null check (category in ('IELTS', 'TOEIC', 'ACADEMIC', 'OXFORD', 'GENERAL')),
  level text check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  title_vi text not null,
  title_en text not null,
  description_vi text not null,
  description_en text not null,
  cover_image_url text,
  is_premium boolean not null default false,
  sort_order integer not null default 0,
  status text not null default 'PUBLISHED' check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vocabulary_sets (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.vocabulary_collections (id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title_vi text not null,
  title_en text not null,
  description_vi text,
  description_en text,
  sort_order integer not null default 0,
  status text not null default 'PUBLISHED' check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (collection_id, slug)
);

create table if not exists public.vocabulary_words (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.vocabulary_collections (id) on delete cascade,
  set_id uuid not null references public.vocabulary_sets (id) on delete cascade,
  word text not null,
  normalized text not null,
  ipa_us text,
  ipa_uk text,
  part_of_speech text,
  meaning_vi text not null,
  definition_en text not null,
  example_en text,
  example_vi text,
  synonyms text[] not null default '{}',
  collocations text[] not null default '{}',
  tags text[] not null default '{}',
  audio_url text,
  sort_order integer not null default 0,
  status text not null default 'PUBLISHED' check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (set_id, normalized)
);

create table if not exists public.vocabulary_user_word_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  word_id uuid not null references public.vocabulary_words (id) on delete cascade,
  status text not null default 'NEW' check (status in ('NEW', 'LEARNING', 'REVIEW', 'MASTERED')),
  ease_factor numeric(4,2) not null default 2.50 check (ease_factor between 1.30 and 3.50),
  interval_days integer not null default 0 check (interval_days >= 0),
  repetitions integer not null default 0 check (repetitions >= 0),
  lapses integer not null default 0 check (lapses >= 0),
  due_at timestamptz not null default timezone('utc', now()),
  last_quality text check (last_quality in ('AGAIN', 'HARD', 'GOOD', 'EASY')),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, word_id)
);

create table if not exists public.vocabulary_review_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  word_id uuid not null references public.vocabulary_words (id) on delete cascade,
  quality text not null check (quality in ('AGAIN', 'HARD', 'GOOD', 'EASY')),
  previous_status text not null check (previous_status in ('NEW', 'LEARNING', 'REVIEW', 'MASTERED')),
  next_status text not null check (next_status in ('NEW', 'LEARNING', 'REVIEW', 'MASTERED')),
  response_ms integer check (response_ms is null or response_ms >= 0),
  reviewed_at timestamptz not null default timezone('utc', now())
);

create index if not exists vocabulary_collections_category_idx
on public.vocabulary_collections (category, status, sort_order);

create index if not exists vocabulary_sets_collection_idx
on public.vocabulary_sets (collection_id, status, sort_order);

create index if not exists vocabulary_words_set_idx
on public.vocabulary_words (set_id, status, sort_order);

create index if not exists vocabulary_words_collection_idx
on public.vocabulary_words (collection_id, status, sort_order);

create index if not exists vocabulary_progress_user_due_idx
on public.vocabulary_user_word_progress (user_id, due_at, status);

create index if not exists vocabulary_review_events_user_idx
on public.vocabulary_review_events (user_id, reviewed_at desc);

drop trigger if exists set_vocabulary_collections_updated_at on public.vocabulary_collections;
create trigger set_vocabulary_collections_updated_at
before update on public.vocabulary_collections
for each row
execute function public.set_updated_at();

drop trigger if exists set_vocabulary_sets_updated_at on public.vocabulary_sets;
create trigger set_vocabulary_sets_updated_at
before update on public.vocabulary_sets
for each row
execute function public.set_updated_at();

drop trigger if exists set_vocabulary_words_updated_at on public.vocabulary_words;
create trigger set_vocabulary_words_updated_at
before update on public.vocabulary_words
for each row
execute function public.set_updated_at();

drop trigger if exists set_vocabulary_progress_updated_at on public.vocabulary_user_word_progress;
create trigger set_vocabulary_progress_updated_at
before update on public.vocabulary_user_word_progress
for each row
execute function public.set_updated_at();

alter table public.vocabulary_collections enable row level security;
alter table public.vocabulary_sets enable row level security;
alter table public.vocabulary_words enable row level security;
alter table public.vocabulary_user_word_progress enable row level security;
alter table public.vocabulary_review_events enable row level security;

drop policy if exists "Authenticated users can read published vocabulary collections" on public.vocabulary_collections;
create policy "Authenticated users can read published vocabulary collections"
on public.vocabulary_collections
for select
to authenticated
using (status = 'PUBLISHED');

drop policy if exists "Authenticated users can read published vocabulary sets" on public.vocabulary_sets;
create policy "Authenticated users can read published vocabulary sets"
on public.vocabulary_sets
for select
to authenticated
using (status = 'PUBLISHED');

drop policy if exists "Authenticated users can read published vocabulary words" on public.vocabulary_words;
create policy "Authenticated users can read published vocabulary words"
on public.vocabulary_words
for select
to authenticated
using (status = 'PUBLISHED');

drop policy if exists "Users can view own vocabulary progress" on public.vocabulary_user_word_progress;
create policy "Users can view own vocabulary progress"
on public.vocabulary_user_word_progress
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own vocabulary progress" on public.vocabulary_user_word_progress;
create policy "Users can insert own vocabulary progress"
on public.vocabulary_user_word_progress
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own vocabulary progress" on public.vocabulary_user_word_progress;
create policy "Users can update own vocabulary progress"
on public.vocabulary_user_word_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view own vocabulary review events" on public.vocabulary_review_events;
create policy "Users can view own vocabulary review events"
on public.vocabulary_review_events
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own vocabulary review events" on public.vocabulary_review_events;
create policy "Users can insert own vocabulary review events"
on public.vocabulary_review_events
for insert
to authenticated
with check (auth.uid() = user_id);

revoke all on public.vocabulary_collections from anon;
revoke all on public.vocabulary_sets from anon;
revoke all on public.vocabulary_words from anon;
revoke all on public.vocabulary_user_word_progress from anon;
revoke all on public.vocabulary_review_events from anon;

grant select on public.vocabulary_collections to authenticated;
grant select on public.vocabulary_sets to authenticated;
grant select on public.vocabulary_words to authenticated;
grant select, insert, update on public.vocabulary_user_word_progress to authenticated;
grant select, insert on public.vocabulary_review_events to authenticated;

with upsert_collections as (
  insert into public.vocabulary_collections (
    slug,
    category,
    level,
    title_vi,
    title_en,
    description_vi,
    description_en,
    is_premium,
    sort_order,
    status
  )
  values
    (
      'destination-b2',
      'ACADEMIC',
      'B2',
      'Destination B2',
      'Destination B2',
      'Vocabulary and phrasal verbs from Destination B2, organized by topic.',
      'Vocabulary and phrasal verbs from Destination B2, organized by topic.',
      false,
      10,
      'PUBLISHED'
    ),
    (
      'destination-b1',
      'ACADEMIC',
      'B1',
      'Destination B1',
      'Destination B1',
      'Vocabulary and phrasal verbs from Destination B1, organized by topic.',
      'Vocabulary and phrasal verbs from Destination B1, organized by topic.',
      false,
      20,
      'PUBLISHED'
    ),
    (
      'oxford-5000',
      'OXFORD',
      'B2',
      'Oxford 5000',
      'Oxford 5000',
      'An expanded core word list for advanced learners of English.',
      'An expanded core word list for advanced learners of English.',
      false,
      30,
      'PUBLISHED'
    ),
    (
      'toeic-essential-600',
      'TOEIC',
      'B1',
      '600 Essential Words for the TOEIC',
      '600 Essential Words for the TOEIC',
      'Workplace and test vocabulary for TOEIC practice.',
      'Workplace and test vocabulary for TOEIC practice.',
      false,
      40,
      'PUBLISHED'
    ),
    (
      'cambridge-ielts-20',
      'IELTS',
      'B2',
      'Cambridge IELTS 20',
      'Cambridge IELTS 20',
      'Academic vocabulary grouped for IELTS reading and writing contexts.',
      'Academic vocabulary grouped for IELTS reading and writing contexts.',
      true,
      50,
      'PUBLISHED'
    )
  on conflict (slug) do update set
    category = excluded.category,
    level = excluded.level,
    title_vi = excluded.title_vi,
    title_en = excluded.title_en,
    description_vi = excluded.description_vi,
    description_en = excluded.description_en,
    is_premium = excluded.is_premium,
    sort_order = excluded.sort_order,
    status = excluded.status
  returning id, slug
),
collection_ids as (
  select id, slug from upsert_collections
  union
  select id, slug
  from public.vocabulary_collections
  where slug in (
    'destination-b2',
    'destination-b1',
    'oxford-5000',
    'toeic-essential-600',
    'cambridge-ielts-20'
  )
),
upsert_sets as (
  insert into public.vocabulary_sets (
    collection_id,
    slug,
    title_vi,
    title_en,
    description_vi,
    description_en,
    sort_order,
    status
  )
  select
    c.id,
    seed.slug,
    seed.title_vi,
    seed.title_en,
    seed.description_vi,
    seed.description_en,
    seed.sort_order,
    'PUBLISHED'
  from (
    values
      ('destination-b2', 'topic-01-work-and-study', 'Topic 1: Work and study', 'Topic 1: Work and study', 'Core B2 words for work, study, and planning.', 'Core B2 words for work, study, and planning.', 10),
      ('destination-b1', 'topic-01-daily-life', 'Topic 1: Daily life', 'Topic 1: Daily life', 'Useful B1 words for everyday communication.', 'Useful B1 words for everyday communication.', 10),
      ('oxford-5000', 'core-01-foundation', 'Core 1: Foundation', 'Core 1: Foundation', 'High-value words for broad English use.', 'High-value words for broad English use.', 10),
      ('toeic-essential-600', 'unit-01-office-flow', 'Unit 1: Office flow', 'Unit 1: Office flow', 'Business words for meetings, planning, and reporting.', 'Business words for meetings, planning, and reporting.', 10),
      ('cambridge-ielts-20', 'unit-01-academic-trends', 'Unit 1: Academic trends', 'Unit 1: Academic trends', 'Words for academic analysis and explanation.', 'Words for academic analysis and explanation.', 10)
  ) as seed(collection_slug, slug, title_vi, title_en, description_vi, description_en, sort_order)
  join collection_ids c on c.slug = seed.collection_slug
  on conflict (collection_id, slug) do update set
    title_vi = excluded.title_vi,
    title_en = excluded.title_en,
    description_vi = excluded.description_vi,
    description_en = excluded.description_en,
    sort_order = excluded.sort_order,
    status = excluded.status
  returning id, collection_id, slug
),
set_ids as (
  select s.id, s.collection_id, s.slug, c.slug as collection_slug
  from public.vocabulary_sets s
  join public.vocabulary_collections c on c.id = s.collection_id
  where c.slug in (
    'destination-b2',
    'destination-b1',
    'oxford-5000',
    'toeic-essential-600',
    'cambridge-ielts-20'
  )
)
insert into public.vocabulary_words (
  collection_id,
  set_id,
  word,
  normalized,
  ipa_us,
  ipa_uk,
  part_of_speech,
  meaning_vi,
  definition_en,
  example_en,
  example_vi,
  synonyms,
  collocations,
  tags,
  sort_order,
  status
)
select
  s.collection_id,
  s.id,
  seed.word,
  lower(seed.word),
  seed.ipa_us,
  seed.ipa_uk,
  seed.part_of_speech,
  seed.meaning_vi,
  seed.definition_en,
  seed.example_en,
  seed.example_vi,
  seed.synonyms,
  seed.collocations,
  seed.tags,
  seed.sort_order,
  'PUBLISHED'
from (
  values
    ('destination-b2', 'topic-01-work-and-study', 'consistent', '/kənˈsɪs.tənt/', '/kənˈsɪs.tənt/', 'ADJ', 'nhất quán', 'always behaving or happening in a similar way', 'A consistent study routine makes review easier.', 'Một lịch học nhất quán giúp việc ôn tập dễ hơn.', array['steady', 'regular'], array['consistent effort', 'consistent results'], array['study'], 10),
    ('destination-b2', 'topic-01-work-and-study', 'deadline', '/ˈded.laɪn/', '/ˈded.laɪn/', 'N', 'hạn chót', 'the latest time something must be finished', 'The deadline for the project is Friday.', 'Hạn chót của dự án là thứ Sáu.', array['due date'], array['meet a deadline', 'tight deadline'], array['work'], 20),
    ('destination-b2', 'topic-01-work-and-study', 'priority', '/praɪˈɔːr.ə.ti/', '/praɪˈɒr.ə.ti/', 'N', 'sự ưu tiên', 'something that is more important than other things', 'Vocabulary review is my first priority today.', 'Ôn từ vựng là ưu tiên đầu tiên của tôi hôm nay.', array['main concern'], array['top priority', 'set priorities'], array['planning'], 30),
    ('destination-b1', 'topic-01-daily-life', 'routine', '/ruːˈtiːn/', '/ruːˈtiːn/', 'N', 'thói quen hằng ngày', 'the usual way you do things every day', 'Her morning routine starts with reading.', 'Thói quen buổi sáng của cô ấy bắt đầu bằng việc đọc.', array['habit'], array['daily routine', 'morning routine'], array['daily'], 10),
    ('destination-b1', 'topic-01-daily-life', 'reliable', '/rɪˈlaɪ.ə.bəl/', '/rɪˈlaɪ.ə.bəl/', 'ADJ', 'đáng tin cậy', 'able to be trusted', 'He is a reliable partner in group work.', 'Anh ấy là một người cộng sự đáng tin cậy khi làm nhóm.', array['dependable'], array['reliable source', 'reliable person'], array['people'], 20),
    ('oxford-5000', 'core-01-foundation', 'approach', '/əˈproʊtʃ/', '/əˈprəʊtʃ/', 'N', 'cách tiếp cận', 'a way of dealing with a situation or problem', 'This approach helps learners review at the right time.', 'Cách tiếp cận này giúp người học ôn đúng thời điểm.', array['method'], array['new approach', 'practical approach'], array['core'], 10),
    ('oxford-5000', 'core-01-foundation', 'evidence', '/ˈev.ə.dəns/', '/ˈev.ɪ.dəns/', 'N', 'bằng chứng', 'facts or information showing that something is true', 'The evidence supports a shorter review session.', 'Bằng chứng ủng hộ một buổi ôn tập ngắn hơn.', array['proof'], array['clear evidence', 'strong evidence'], array['academic'], 20),
    ('toeic-essential-600', 'unit-01-office-flow', 'invoice', '/ˈɪn.vɔɪs/', '/ˈɪn.vɔɪs/', 'N', 'hóa đơn', 'a list of goods or services and the amount to pay', 'Please send the invoice before the end of the day.', 'Vui lòng gửi hóa đơn trước cuối ngày.', array['bill'], array['issue an invoice', 'pay an invoice'], array['toeic'], 10),
    ('toeic-essential-600', 'unit-01-office-flow', 'schedule', '/ˈskedʒ.uːl/', '/ˈʃed.juːl/', 'N', 'lịch trình', 'a plan of activities and times', 'The meeting schedule changed this morning.', 'Lịch họp đã thay đổi sáng nay.', array['timetable'], array['tight schedule', 'adjust a schedule'], array['toeic'], 20),
    ('cambridge-ielts-20', 'unit-01-academic-trends', 'trend', '/trend/', '/trend/', 'N', 'xu hướng', 'a general direction in which something changes', 'The graph shows an upward trend in online learning.', 'Biểu đồ cho thấy xu hướng tăng trong học trực tuyến.', array['pattern'], array['upward trend', 'long-term trend'], array['ielts'], 10),
    ('cambridge-ielts-20', 'unit-01-academic-trends', 'significant', '/sɪɡˈnɪf.ə.kənt/', '/sɪɡˈnɪf.ɪ.kənt/', 'ADJ', 'đáng kể', 'large or important enough to notice', 'There was a significant increase in student participation.', 'Có sự gia tăng đáng kể trong mức độ tham gia của học sinh.', array['notable'], array['significant increase', 'significant difference'], array['ielts'], 20)
) as seed(collection_slug, set_slug, word, ipa_us, ipa_uk, part_of_speech, meaning_vi, definition_en, example_en, example_vi, synonyms, collocations, tags, sort_order)
join set_ids s on s.collection_slug = seed.collection_slug and s.slug = seed.set_slug
on conflict (set_id, normalized) do update set
  word = excluded.word,
  ipa_us = excluded.ipa_us,
  ipa_uk = excluded.ipa_uk,
  part_of_speech = excluded.part_of_speech,
  meaning_vi = excluded.meaning_vi,
  definition_en = excluded.definition_en,
  example_en = excluded.example_en,
  example_vi = excluded.example_vi,
  synonyms = excluded.synonyms,
  collocations = excluded.collocations,
  tags = excluded.tags,
  sort_order = excluded.sort_order,
  status = excluded.status;
