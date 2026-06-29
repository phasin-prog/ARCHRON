-- Archron — Editor v1 / E0
-- รันใน Supabase SQL Editor (Project > SQL Editor > New query)
-- สิทธิ์: ผู้ใช้สร้าง/แก้/ลบได้เฉพาะเนื้อหาของตน (author_id = Clerk user id), published อ่านได้ทุกคน

create extension if not exists "pgcrypto";

-- =========================================================
-- ตารางเนื้อหา
-- =========================================================
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  status text not null default 'draft',          -- draft | needs-source-check | ready-to-publish | published | archived
  content_type text not null default 'article',
  author_id text not null,                       -- Clerk user id (JWT sub)

  -- identity block
  main_term text,
  thai_name text,
  original_term text,
  part_of_speech text,
  language_root text,
  ipa text,
  short_description text,

  -- framework
  framework text,
  main_thinkers text[],
  school text,
  difficulty text,
  tags text[],

  -- content
  visual_explanation text,
  technical_meaning text,
  body_markdown text,
  cover_image text,

  -- structured (jsonb)
  roots jsonb,
  related_concepts jsonb not null default '[]'::jsonb,
  source_refs jsonb not null default '[]'::jsonb,   -- เลี่ยงคำสงวน references
  related_cta jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

-- =========================================================
-- ประวัติเวอร์ชัน
-- =========================================================
create table if not exists public.entry_revisions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  snapshot jsonb not null,
  created_by text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists entries_author_idx on public.entries (author_id);
create index if not exists entries_status_idx on public.entries (status);
create index if not exists entries_slug_idx on public.entries (slug);
create index if not exists rev_entry_idx on public.entry_revisions (entry_id);

-- =========================================================
-- updated_at trigger
-- =========================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists entries_set_updated_at on public.entries;
create trigger entries_set_updated_at
  before update on public.entries
  for each row execute function public.set_updated_at();

-- =========================================================
-- Row Level Security
-- auth.jwt()->>'sub' = Clerk user id (ผ่าน Supabase Third-Party Auth / Clerk)
-- =========================================================
alter table public.entries enable row level security;
alter table public.entry_revisions enable row level security;

-- อ่าน: published เปิดทุกคน, ฉบับร่างเห็นเฉพาะเจ้าของ
drop policy if exists entries_select on public.entries;
create policy entries_select on public.entries
  for select using (
    status = 'published' or author_id = (auth.jwt()->>'sub')
  );

-- สร้าง: author_id ต้องเป็นตัวเอง
drop policy if exists entries_insert on public.entries;
create policy entries_insert on public.entries
  for insert with check (author_id = (auth.jwt()->>'sub'));

-- แก้: เฉพาะของตัวเอง
drop policy if exists entries_update on public.entries;
create policy entries_update on public.entries
  for update using (author_id = (auth.jwt()->>'sub'))
  with check (author_id = (auth.jwt()->>'sub'));

-- ลบ: เฉพาะของตัวเอง
drop policy if exists entries_delete on public.entries;
create policy entries_delete on public.entries
  for delete using (author_id = (auth.jwt()->>'sub'));

-- revisions: จัดการได้เฉพาะ entry ของตัวเอง
drop policy if exists rev_all_own on public.entry_revisions;
create policy rev_all_own on public.entry_revisions
  for all using (
    exists (
      select 1 from public.entries e
      where e.id = entry_id and e.author_id = (auth.jwt()->>'sub')
    )
  )
  with check (created_by = (auth.jwt()->>'sub'));

-- =========================================================
-- โปรไฟล์ผู้ใช้ (ARCHRON) — username/ยศเฉพาะของเว็บ
-- role (admin/writer/user) เก็บใน Clerk publicMetadata (แหล่งความจริง) ไม่ใช่ที่นี่
-- ตารางนี้เก็บ username, ชื่อแสดง, ยศ (เช่น ผู้สนับสนุน) และคำขอเป็นนักเขียน
-- =========================================================
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

-- อ่าน: เปิดสาธารณะ (username/ยศ ใช้แสดงผลได้ทั่วไป — ไม่เก็บข้อมูลอ่อนไหว)
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (true);

-- สร้าง/แก้: เฉพาะโปรไฟล์ของตัวเอง
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles
  for insert with check (clerk_user_id = (auth.jwt()->>'sub'));

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (clerk_user_id = (auth.jwt()->>'sub'))
  with check (clerk_user_id = (auth.jwt()->>'sub'));

-- =========================================================
-- ความคิดเห็น (Comments) — ท้ายบทความ/แนวคิด · ต้องเข้าสู่ระบบจึงคอมเมนต์ได้
-- section = 'articles' | 'concepts' · slug = slug ของ entry
-- =========================================================
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

-- อ่าน: คอมเมนต์ที่ visible เปิดสาธารณะ (เจ้าของเห็นของตนเองทุกสถานะ)
drop policy if exists comments_select on public.comments;
create policy comments_select on public.comments
  for select using (status = 'visible' or clerk_user_id = (auth.jwt()->>'sub'));

-- สร้าง: ต้องเป็นผู้ใช้ที่ล็อกอิน และเป็นตัวเอง
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments
  for insert with check (clerk_user_id = (auth.jwt()->>'sub'));

-- แก้/ลบ: เฉพาะของตัวเอง (โมเดอเรชันของแอดมินทำผ่าน service role แยกภายหลัง)
drop policy if exists comments_update on public.comments;
create policy comments_update on public.comments
  for update using (clerk_user_id = (auth.jwt()->>'sub'))
  with check (clerk_user_id = (auth.jwt()->>'sub'));

drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments
  for delete using (clerk_user_id = (auth.jwt()->>'sub'));

-- =========================================================
-- ตัวนับผู้เยี่ยมชม (Page Views) — ต่อ slug + ยอดรวม
-- เพิ่มค่าได้เฉพาะผ่านฟังก์ชัน SECURITY DEFINER (anon เพิ่มได้ แต่เขียนตรงไม่ได้)
-- =========================================================
create table if not exists public.page_views (
  slug text primary key,
  views bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.page_views enable row level security;

-- อ่าน: เปิดสาธารณะ (ใช้แสดงจำนวน)
drop policy if exists page_views_select on public.page_views;
create policy page_views_select on public.page_views
  for select using (true);

-- เพิ่มยอดเข้าชม +1 (upsert) — คืนค่ายอดล่าสุด
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

-- ยอดผู้เยี่ยมชมรวมทั้งเว็บ
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
