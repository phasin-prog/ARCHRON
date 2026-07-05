-- 20260702_enable_pgvector_and_search_index.sql
-- เปิด pgvector + เพิ่มคอลัมน์ embedding + index (FTS/HNSW) + hybrid search RPC
-- หมายเหตุ: migration นี้ถูก apply เข้า production แล้วผ่าน Supabase (apply_migration ชื่อเดียวกัน)
-- ไฟล์นี้เก็บไว้ใน repo เพื่อเป็น source of record / ให้ environment อื่นใช้ซ้ำได้

create extension if not exists vector with schema extensions;

-- embedding: 1536 มิติ (Gemini gemini-embedding-001 outputDimensionality=1536 + L2-normalize)
alter table public.library add column if not exists embedding extensions.vector(1536);
alter table public.chunks  add column if not exists embedding extensions.vector(1536);

-- Full-text (tsvector มีอยู่แล้ว) + vector index (HNSW, cosine)
create index if not exists library_fts_idx on public.library using gin (fts);
create index if not exists chunks_fts_idx  on public.chunks  using gin (fts);
create index if not exists library_embedding_idx on public.library using hnsw (embedding extensions.vector_cosine_ops);
create index if not exists chunks_embedding_idx  on public.chunks  using hnsw (embedding extensions.vector_cosine_ops);

-- Hybrid search: FTS rank + cosine similarity (รองรับกรณี embedding ยังว่าง → FTS อย่างเดียว)
create or replace function public.match_library(
  query_text text default null,
  query_embedding extensions.vector(1536) default null,
  match_count int default 20
)
returns table (entry_id uuid, slug text, title text, summary text, category text, tags text[], score double precision)
language sql stable
set search_path = public, extensions
as $$
  select l.entry_id, l.slug, l.title, l.summary, l.category, l.tags,
    (case when query_embedding is not null and l.embedding is not null
          then 1 - (l.embedding <=> query_embedding) else 0 end)
    + (case when query_text is not null and query_text <> ''
          then ts_rank(l.fts, plainto_tsquery('simple', query_text)) else 0 end) as score
  from public.library l
  where (query_text is not null and query_text <> '' and l.fts @@ plainto_tsquery('simple', query_text))
     or (query_embedding is not null and l.embedding is not null)
  order by score desc
  limit coalesce(match_count, 20);
$$;

grant execute on function public.match_library(text, extensions.vector, int) to anon, authenticated;

-- Backfill library จาก entries (published) — data migration (idempotent)
insert into public.library (entry_id, title, slug, summary, category, tags, language, author, hash, r2_key, fts, updated_at, indexed_at)
select e.id, e.title, e.slug, e.short_description, e.content_type, e.tags, 'th', e.author_id,
  md5(coalesce(e.body_markdown,'')), e.r2_content_key,
  to_tsvector('simple',
    coalesce(e.title,'')||' '||coalesce(e.original_term,'')||' '||coalesce(e.main_term,'')||' '||
    coalesce(e.short_description,'')||' '||coalesce(array_to_string(e.tags,' '),'')||' '||
    coalesce(array_to_string(e.main_thinkers,' '),'')),
  e.updated_at, now()
from public.entries e
where e.status='published'
  and not exists (select 1 from public.library l where l.entry_id = e.id);
