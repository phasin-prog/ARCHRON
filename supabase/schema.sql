-- The Soul's Compass — Editor v1 / E0
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
