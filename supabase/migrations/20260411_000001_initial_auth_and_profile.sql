create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text not null check (char_length(trim(display_name)) between 2 and 80),
  preferred_language text not null default 'vi' check (preferred_language in ('vi', 'en')),
  daily_goal_minutes integer not null default 15 check (daily_goal_minutes between 5 and 120),
  avatar_url text,
  role text not null default 'LEARNER' check (role in ('LEARNER', 'ADMIN')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  kind text not null check (kind in ('DICTATION', 'SHADOWING', 'REVIEW')),
  status text not null default 'PLANNED' check (status in ('PLANNED', 'ACTIVE', 'COMPLETED')),
  duration_minutes integer not null check (duration_minutes > 0),
  notes text,
  scheduled_for timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_practice_sessions_updated_at on public.practice_sessions;
create trigger set_practice_sessions_updated_at
before update on public.practice_sessions
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.practice_sessions enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can view own practice sessions" on public.practice_sessions;
create policy "Users can view own practice sessions"
on public.practice_sessions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own practice sessions" on public.practice_sessions;
create policy "Users can insert own practice sessions"
on public.practice_sessions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own practice sessions" on public.practice_sessions;
create policy "Users can update own practice sessions"
on public.practice_sessions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own practice sessions" on public.practice_sessions;
create policy "Users can delete own practice sessions"
on public.practice_sessions
for delete
to authenticated
using (auth.uid() = user_id);
