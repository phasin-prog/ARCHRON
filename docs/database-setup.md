# Archron — Database Setup Guide

> รันทั้งหมดนี้ใน **Supabase Dashboard → SQL Editor → New Query → Run**
> ปลอดภัยที่จะรันซ้ำ (uses IF NOT EXISTS / DROP ... IF EXISTS)

---

## 1. Extensions

```sql
create extension if not exists "pgcrypto";
```

---

## 2. Tables

### entries — เนื้อหาหลัก (articles, concepts, etc.)

```sql
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  status text not null default 'draft',
  content_type text not null default 'article',
  author_id text not null,

  -- identity block
  main_term text,
  thai_name text,
  original_term text,
  part_of_speech text,
  language_root text,
  ipa text,
  short_description text,

  -- framework / theory
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
  source_refs jsonb not null default '[]'::jsonb,
  related_cta jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
```

### entry_revisions — version history

```sql
create table if not exists public.entry_revisions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  snapshot jsonb not null,
  created_by text not null,
  note text,
  created_at timestamptz not null default now()
);
```

### profiles — reader/writer profile

```sql
create table if not exists public.profiles (
  clerk_user_id text primary key,
  username text unique,
  display_name text,
  title text,
  writer_request boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### comments

```sql
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  slug text not null,
  clerk_user_id text not null,
  author_name text,
  body text not null,
  status text not null default 'visible',
  created_at timestamptz not null default now()
);
```

### page_views

```sql
create table if not exists public.page_views (
  slug text primary key,
  views bigint not null default 0,
  updated_at timestamptz not null default now()
);
```

---

## 3. Indexes

```sql
create index if not exists entries_author_idx on public.entries (author_id);
create index if not exists entries_status_idx on public.entries (status);
create index if not exists entries_slug_idx on public.entries (slug);
create index if not exists rev_entry_idx on public.entry_revisions (entry_id);
create index if not exists profiles_username_idx on public.profiles (username);
create index if not exists comments_target_idx on public.comments (section, slug, created_at);
create index if not exists comments_user_idx on public.comments (clerk_user_id);
```

---

## 4. updated_at Triggers

```sql
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

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
```

---

## 5. RLS Policies

### entries

```sql
alter table public.entries enable row level security;
alter table public.entry_revisions enable row level security;

-- อ่าน
drop policy if exists entries_select on public.entries;
create policy entries_select on public.entries
  for select using (
    status = 'published' or author_id = (auth.jwt()->>'sub')
  );

-- สร้าง
drop policy if exists entries_insert on public.entries;
create policy entries_insert on public.entries
  for insert with check (author_id = (auth.jwt()->>'sub'));

-- แก้
drop policy if exists entries_update on public.entries;
create policy entries_update on public.entries
  for update using (author_id = (auth.jwt()->>'sub'))
  with check (author_id = (auth.jwt()->>'sub'));

-- ลบ
drop policy if exists entries_delete on public.entries;
create policy entries_delete on public.entries
  for delete using (author_id = (auth.jwt()->>'sub'));
```

### entry_revisions

```sql
drop policy if exists rev_all_own on public.entry_revisions;
create policy rev_all_own on public.entry_revisions
  for all using (
    exists (
      select 1 from public.entries e
      where e.id = entry_id and e.author_id = (auth.jwt()->>'sub')
    )
  )
  with check (created_by = (auth.jwt()->>'sub'));
```

### profiles

```sql
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
```

### comments

```sql
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
```

### page_views

```sql
alter table public.page_views enable row level security;

drop policy if exists page_views_select on public.page_views;
create policy page_views_select on public.page_views
  for select using (true);
```

---

## 6. Functions

```sql
-- increment page view
create or replace function public.increment_page_view(p_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare new_views bigint;
begin
  insert into public.page_views (slug, views, updated_at)
  values (p_slug, 1, now())
  on conflict (slug)
  do update set views = public.page_views.views + 1, updated_at = now()
  returning views into new_views;
  return new_views;
end; $$;

-- total page views
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
```

---

## 7. Foreign Keys

### entries.author_id → **ไม่มี FK** (Clerk user id, ไม่ต้องอ้างอิง profiles)

```sql
-- FIX: drop FK ที่ขวางการ save (author_id ไม่ต้องมี profile row)
alter table public.entries
  drop constraint if exists entries_author_id_fkey;
```

### comments.slug → entries.slug

```sql
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'comments_slug_fkey' and table_name = 'comments'
  ) then
    alter table public.comments
    add constraint comments_slug_fkey
    foreign key (slug) references public.entries(slug)
    on delete cascade;
  end if;
end $$;
```

### page_views.slug → entries.slug

```sql
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'page_views_slug_fkey' and table_name = 'page_views'
  ) then
    alter table public.page_views
    add constraint page_views_slug_fkey
    foreign key (slug) references public.entries(slug)
    on delete cascade;
  end if;
end $$;
```

---

## 8. Grants

```sql
grant select on public.entries to anon, authenticated;
grant insert, update, delete on public.entries to authenticated;
grant select, insert, update, delete on public.entry_revisions to authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant select on public.comments to anon, authenticated;
grant insert, update, delete on public.comments to authenticated;
grant select on public.page_views to anon, authenticated;
```

---

## 9. Clerk JWT Setup (Supabase Dashboard)

### Step 1 — Clerk Dashboard

ไปที่ **Clerk Dashboard → Configure → JWT Templates → New**

```
Template name: supabase
Claims:
  "iss": "https://definite-bedbug-44.clerk.accounts.dev"
  "aud": "authenticated"
  "sub": "{{user.id}}"
  "role": "authenticated"
```

### Step 2 — Supabase Dashboard

ไปที่ **Supabase Dashboard → Authentication → Providers → Add Clerk**

```
Name: clerk
JWKS URL: https://definite-bedbug-44.clerk.accounts.dev/.well-known/jwks.json
```

---

## 10. Complete Schema (single file)

> Copy ทั้งหมดนี้ → Supabase SQL Editor → Run

```sql
-- =========================================================
-- Archron — Full Database Schema
-- =========================================================
create extension if not exists "pgcrypto";

-- entries
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  status text not null default 'draft',
  content_type text not null default 'article',
  author_id text not null,
  main_term text, thai_name text, original_term text,
  part_of_speech text, language_root text, ipa text, short_description text,
  framework text, main_thinkers text[], school text, difficulty text, tags text[],
  visual_explanation text, technical_meaning text, body_markdown text, cover_image text,
  roots jsonb, related_concepts jsonb not null default '[]'::jsonb,
  source_refs jsonb not null default '[]'::jsonb, related_cta jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

-- entry_revisions
create table if not exists public.entry_revisions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  snapshot jsonb not null, created_by text not null, note text,
  created_at timestamptz not null default now()
);

-- profiles
create table if not exists public.profiles (
  clerk_user_id text primary key, username text unique, display_name text,
  title text, writer_request boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- comments
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  section text not null, slug text not null, clerk_user_id text not null,
  author_name text, body text not null, status text not null default 'visible',
  created_at timestamptz not null default now()
);

-- page_views
create table if not exists public.page_views (
  slug text primary key, views bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- indexes
create index if not exists entries_author_idx on public.entries (author_id);
create index if not exists entries_status_idx on public.entries (status);
create index if not exists entries_slug_idx on public.entries (slug);
create index if not exists rev_entry_idx on public.entry_revisions (entry_id);
create index if not exists profiles_username_idx on public.profiles (username);
create index if not exists comments_target_idx on public.comments (section, slug, created_at);
create index if not exists comments_user_idx on public.comments (clerk_user_id);

-- updated_at trigger
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists entries_set_updated_at on public.entries;
create trigger entries_set_updated_at before update on public.entries
  for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- RLS
alter table public.entries enable row level security;
alter table public.entry_revisions enable row level security;
alter table public.profiles enable row level security;
alter table public.comments enable row level security;
alter table public.page_views enable row level security;

-- entries policies
drop policy if exists entries_select on public.entries;
create policy entries_select on public.entries for select using (
  status = 'published' or author_id = (auth.jwt()->>'sub'));
drop policy if exists entries_insert on public.entries;
create policy entries_insert on public.entries for insert
  with check (author_id = (auth.jwt()->>'sub'));
drop policy if exists entries_update on public.entries;
create policy entries_update on public.entries for update
  using (author_id = (auth.jwt()->>'sub'))
  with check (author_id = (auth.jwt()->>'sub'));
drop policy if exists entries_delete on public.entries;
create policy entries_delete on public.entries for delete
  using (author_id = (auth.jwt()->>'sub'));

-- entry_revisions policies
drop policy if exists rev_all_own on public.entry_revisions;
create policy rev_all_own on public.entry_revisions for all using (
  exists (select 1 from public.entries e where e.id = entry_id and e.author_id = (auth.jwt()->>'sub'))
) with check (created_by = (auth.jwt()->>'sub'));

-- profiles policies
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select using (true);
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert
  with check (clerk_user_id = (auth.jwt()->>'sub'));
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (clerk_user_id = (auth.jwt()->>'sub'))
  with check (clerk_user_id = (auth.jwt()->>'sub'));

-- comments policies
drop policy if exists comments_select on public.comments;
create policy comments_select on public.comments for select
  using (status = 'visible' or clerk_user_id = (auth.jwt()->>'sub'));
drop policy if exists comments_insert on public.comments;
create policy comments_insert on public.comments for insert
  with check (clerk_user_id = (auth.jwt()->>'sub'));
drop policy if exists comments_update on public.comments;
create policy comments_update on public.comments for update
  using (clerk_user_id = (auth.jwt()->>'sub'))
  with check (clerk_user_id = (auth.jwt()->>'sub'));
drop policy if exists comments_delete on public.comments;
create policy comments_delete on public.comments for delete
  using (clerk_user_id = (auth.jwt()->>'sub'));

-- page_views policies
drop policy if exists page_views_select on public.page_views;
create policy page_views_select on public.page_views for select using (true);

-- functions
create or replace function public.increment_page_view(p_slug text) returns bigint
language plpgsql security definer set search_path = public as $$
declare new_views bigint; begin
  insert into public.page_views (slug, views, updated_at) values (p_slug, 1, now())
  on conflict (slug) do update set views = public.page_views.views + 1, updated_at = now()
  returning views into new_views; return new_views; end; $$;

create or replace function public.total_page_views() returns bigint
language sql security definer set search_path = public as $$
  select coalesce(sum(views), 0)::bigint from public.page_views; $$;

grant execute on function public.increment_page_view(text) to anon, authenticated;
grant execute on function public.total_page_views() to anon, authenticated;

-- FIX: drop FK ที่ขวางการ save
alter table public.entries drop constraint if exists entries_author_id_fkey;

-- FK: comments + page_views → entries
do $$ begin
  if not exists (select 1 from information_schema.table_constraints
    where constraint_name = 'comments_slug_fkey' and table_name = 'comments') then
    alter table public.comments add constraint comments_slug_fkey
      foreign key (slug) references public.entries(slug) on delete cascade;
  end if; end $$;

do $$ begin
  if not exists (select 1 from information_schema.table_constraints
    where constraint_name = 'page_views_slug_fkey' and table_name = 'page_views') then
    alter table public.page_views add constraint page_views_slug_fkey
      foreign key (slug) references public.entries(slug) on delete cascade;
  end if; end $$;

-- grants
grant select on public.entries to anon, authenticated;
grant insert, update, delete on public.entries to authenticated;
grant select, insert, update, delete on public.entry_revisions to authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;
grant select on public.comments to anon, authenticated;
grant insert, update, delete on public.comments to authenticated;
grant select on public.page_views to anon, authenticated;
```
