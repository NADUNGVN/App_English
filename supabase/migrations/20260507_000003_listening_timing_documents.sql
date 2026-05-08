create table if not exists public.listening_timing_documents (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null,
  category_id text not null,
  youtube_video_id text not null,
  stage text not null check (stage in ('DRAFT', 'APPROVED')),
  status text not null check (status in ('NEEDS_TIMING', 'DRAFT', 'APPROVED')),
  document jsonb not null,
  updated_by text not null,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (lesson_id, stage)
);

create index if not exists listening_timing_documents_stage_idx
on public.listening_timing_documents (stage, status);

create index if not exists listening_timing_documents_lesson_idx
on public.listening_timing_documents (lesson_id);

drop trigger if exists set_listening_timing_documents_updated_at
on public.listening_timing_documents;

create trigger set_listening_timing_documents_updated_at
before update on public.listening_timing_documents
for each row
execute function public.set_updated_at();

alter table public.listening_timing_documents enable row level security;

revoke all on public.listening_timing_documents from anon;
revoke all on public.listening_timing_documents from authenticated;
