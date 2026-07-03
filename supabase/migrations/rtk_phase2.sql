-- =========================================================
-- RTK Phase 2 — library + chunks (Supabase Compatible)
-- Trigger-based FTS (No Generated Columns)
-- =========================================================

create extension if not exists pgcrypto;

------------------------------------------------------------
-- library
------------------------------------------------------------

create table if not exists public.library (
    id uuid primary key default gen_random_uuid(),

    entry_id uuid unique not null
        references public.entries(id)
        on delete cascade,

    title text not null,
    slug text unique not null,

    summary text,

    category text,

    tags text[] default '{}',

    language text not null default 'th',

    author text,

    token_count integer not null default 0,

    hash text,

    r2_key text,

    fts tsvector,

    updated_at timestamptz not null default now(),

    indexed_at timestamptz not null default now()
);

------------------------------------------------------------
-- chunks
------------------------------------------------------------

create table if not exists public.chunks (

    id uuid primary key default gen_random_uuid(),

    library_id uuid not null
        references public.library(id)
        on delete cascade,

    chunk_no integer not null,

    heading text,

    summary text,

    token_count integer not null default 0,

    r2_key text not null,

    fts tsvector,

    created_at timestamptz not null default now(),

    unique(library_id, chunk_no)
);

------------------------------------------------------------
-- FTS Trigger : library
------------------------------------------------------------

create or replace function public.library_fts_trigger()
returns trigger
language plpgsql
as
$$
begin

    new.fts :=
          setweight(to_tsvector('simple', coalesce(new.title,'')), 'A')
       || setweight(to_tsvector('simple', coalesce(new.slug,'')), 'B')
       || setweight(to_tsvector('simple', coalesce(array_to_string(new.tags,' '),'')), 'B')
       || setweight(to_tsvector('simple', coalesce(new.summary,'')), 'C');

    return new;

end;
$$;

drop trigger if exists trg_library_fts on public.library;

create trigger trg_library_fts
before insert or update
on public.library
for each row
execute function public.library_fts_trigger();

------------------------------------------------------------
-- FTS Trigger : chunks
------------------------------------------------------------

create or replace function public.chunks_fts_trigger()
returns trigger
language plpgsql
as
$$
begin

    new.fts :=
          setweight(to_tsvector('simple', coalesce(new.heading,'')), 'B')
       || setweight(to_tsvector('simple', coalesce(new.summary,'')), 'C');

    return new;

end;
$$;

drop trigger if exists trg_chunks_fts on public.chunks;

create trigger trg_chunks_fts
before insert or update
on public.chunks
for each row
execute function public.chunks_fts_trigger();

------------------------------------------------------------
-- updated_at Trigger
------------------------------------------------------------

drop trigger if exists library_set_updated_at
on public.library;

create trigger library_set_updated_at
before update
on public.library
for each row
execute function public.set_updated_at();

------------------------------------------------------------
-- Indexes
------------------------------------------------------------

create index if not exists library_fts_idx
on public.library
using gin (fts);

create index if not exists library_slug_idx
on public.library(slug);

create index if not exists library_category_idx
on public.library(category);

create index if not exists library_indexed_at_idx
on public.library(indexed_at desc);

create index if not exists chunks_fts_idx
on public.chunks
using gin (fts);

create index if not exists chunks_library_idx
on public.chunks(library_id);

------------------------------------------------------------
-- RLS
------------------------------------------------------------

alter table public.library enable row level security;

alter table public.chunks enable row level security;

drop policy if exists library_select
on public.library;

create policy library_select
on public.library
for select
using (true);

drop policy if exists chunks_select
on public.chunks;

create policy chunks_select
on public.chunks
for select
using (true);

------------------------------------------------------------
-- Grants
------------------------------------------------------------

grant select on public.library
to anon, authenticated;

grant select on public.chunks
to anon, authenticated;

------------------------------------------------------------
-- Search RPC
------------------------------------------------------------

create or replace function public.search_library_fts(
    p_q text,
    p_limit integer default 5
)
returns setof public.library
language sql
stable
set search_path = public
as
$$
select *
from public.library
where fts @@ plainto_tsquery('simple', p_q)
order by ts_rank(fts, plainto_tsquery('simple', p_q)) desc
limit p_limit;
$$;

create or replace function public.search_chunks_fts(
    p_q text,
    p_limit integer default 5
)
returns setof public.chunks
language sql
stable
set search_path = public
as
$$
select *
from public.chunks
where fts @@ plainto_tsquery('simple', p_q)
order by ts_rank(fts, plainto_tsquery('simple', p_q)) desc
limit p_limit;
$$;

grant execute on function public.search_library_fts(text, integer)
to anon, authenticated;

grant execute on function public.search_chunks_fts(text, integer)
to anon, authenticated;
