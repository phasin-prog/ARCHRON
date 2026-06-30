-- supabase/migrations/20260630_create_missing_tables.sql
-- Add cover_image column to entries table and create profiles, comments, and page_views tables.

-- 1. Add cover_image column to entries table if not exists
ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS cover_image text;

-- 2. Create profiles table and configurations
create table if not exists public.profiles (
  clerk_user_id text primary key,                -- Clerk user id (JWT sub)
  username text unique,                           -- ชื่อผู้ใช้เฉพาะของเว็บ
  display_name text,                              -- ชื่อที่แสดง
  title text,                                     -- ยศ/ตำแหน่ง เช่น ผู้สนับสนุน
  writer_request boolean not null default false, -- ผู้ใช้ขอเป็นนักเขียน (รออนุมัติ)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_username_idx on public.profiles (username);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (true);

drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check (clerk_user_id = (auth.jwt()->>'sub'));

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (clerk_user_id = (auth.jwt()->>'sub'))
  with check (clerk_user_id = (auth.jwt()->>'sub'));

-- 3. Create comments table and configurations
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  section text not null,                          -- articles | concepts
  slug text not null,                             -- entry slug
  clerk_user_id text not null,                    -- Clerk user id (JWT sub)
  author_name text,                              -- ชื่อที่แสดง ณ ตอนคอมเมนต์
  body text not null,
  status text not null default 'visible',         -- visible | hidden (สำหรับโมเดอเรชัน)
  created_at timestamptz not null default now()
);

create index if not exists comments_target_idx on public.comments (section, slug, created_at);
create index if not exists comments_user_idx on public.comments (clerk_user_id);

alter table public.comments enable row level security;

drop policy if exists comments_select on public.comments;
create policy comments_select on public.comments
  for select using (status = 'visible' or clerk_user_id = (auth.jwt()->>'sub'));

drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments
  for insert with check (clerk_user_id = (auth.jwt()->>'sub'));

drop policy if exists comments_update on public.comments;
create policy comments_update on public.comments
  for update using (clerk_user_id = (auth.jwt()->>'sub'))
  with check (clerk_user_id = (auth.jwt()->>'sub'));

drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments
  for delete using (clerk_user_id = (auth.jwt()->>'sub'));

-- 4. Create page_views table and configurations
create table if not exists public.page_views (
  slug text primary key,
  views bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.page_views enable row level security;

drop policy if exists page_views_select on public.page_views;
create policy page_views_select on public.page_views
  for select using (true);

create or replace function public.increment_page_view(p_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_views bigint;
begin
  insert into public.page_views (slug, views, updated_at)
  values (p_slug, 1, now())
  on conflict (slug)
  do update set views = public.page_views.views + 1, updated_at = now()
  returning views into new_views;
  return new_views;
end; $$;

create or replace function public.total_page_views()
returns bigint
language sql
security definer
set search_path = public
as $$
  select coalesce(sum(views), 0)::bigint from public.page_views;
$$;

grant execute on function public.increment_page_view(text) to anon, authenticated;
grant execute on function public.total_page_views() to anon, authenticated;
