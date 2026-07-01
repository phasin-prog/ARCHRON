-- =========================================================
-- RTK Phase 2 — library + chunks (derived metadata index)
-- Run in Supabase SQL Editor. Idempotent.
-- Source of truth = public.entries (status='published').
-- This is a DERIVED index; refreshLibrary() populates it.
-- =========================================================

-- 1) library — document-level metadata (1:1 with published entries)
create table if not exists public.library (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid unique not null references public.entries(id) on delete cascade,
  title text not null,
  slug text unique not null,
  summary text,
  category text,                       -- = entries.content_type
  tags text[] default '{}',
  language text not null default 'th',
  author text,
  token_count integer not null default 0,
  hash text,                           -- sha256(body_markdown) change detection
  r2_key text,                         -- full-doc R2 key (optional)
  fts tsvector
    generated always as (
      setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
      setweight(to_tsvector('simple', coalesce(slug, '')),  'B') ||
      setweight(to_tsvector('simple', coalesce(array_to_string(tags, ' '), '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(summary, '')), 'C')
    ) stored,
  updated_at timestamptz not null default now(),
  indexed_at timestamptz not null default now()
);

-- 2) chunks — chunk-level metadata (split by heading)
create table if not exists public.chunks (
  id uuid primary key default gen_random_uuid(),
  library_id uuid not null references public.library(id) on delete cascade,
  chunk_no integer not null,
  heading text,                        -- null = preamble (before first heading)
  summary text,
  token_count integer not null default 0,
  r2_key text not null,                -- chunk markdown content in R2
  fts tsvector
    generated always as (
      setweight(to_tsvector('simple', coalesce(heading, '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(summary, '')), 'C')
    ) stored,
  created_at timestamptz not null default now(),
  unique (library_id, chunk_no)
);

-- 3) Indexes
create index if not exists library_fts_idx on public.library using gin (fts);
create index if not exists library_slug_idx on public.library (slug);
create index if not exists library_category_idx on public.library (category);
create index if not exists library_indexed_at_idx on public.library (indexed_at desc);
create index if not exists chunks_fts_idx on public.chunks using gin (fts);
create index if not exists chunks_library_idx on public.chunks (library_id);

-- 4) updated_at trigger (reuse existing function)
drop trigger if exists library_set_updated_at on public.library;
create trigger library_set_updated_at
  before update on public.library
  for each row execute function public.set_updated_at();

-- 5) RLS — read public (mirrors published entries), write service-role only
alter table public.library enable row level security;
alter table public.chunks enable row level security;

drop policy if exists library_select on public.library;
create policy library_select on public.library
  for select using (true);

drop policy if exists chunks_select on public.chunks;
create policy chunks_select on public.chunks
  for select using (true);
-- No insert/update/delete policies → only service role (which bypasses RLS) can write.

-- 6) Grants
grant select on public.library to anon, authenticated;
grant select on public.chunks to anon, authenticated;
