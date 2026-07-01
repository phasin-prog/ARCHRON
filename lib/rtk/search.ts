// RTK search helpers — Supabase queries against library + chunks
// All functions accept a SupabaseClient (service-role or anon) and return mapped types.

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  LibraryMeta,
  ChunkMeta,
  LibraryRow,
  ChunkRow,
} from "./types";

const MAX_LIMIT = 8;

function clampLimit(limit?: number, def = 5): number {
  if (limit === undefined || limit === null) return def;
  if (limit < 1) return 1;
  if (limit > MAX_LIMIT) return MAX_LIMIT;
  return limit;
}

function rowToLibraryMeta(r: LibraryRow): LibraryMeta {
  return {
    id: r.id,
    entryId: r.entry_id,
    title: r.title,
    slug: r.slug,
    summary: r.summary,
    category: r.category,
    tags: r.tags ?? [],
    language: r.language,
    author: r.author,
    tokenCount: r.token_count,
    hash: r.hash,
    r2Key: r.r2_key,
    updatedAt: r.updated_at,
    indexedAt: r.indexed_at,
  };
}

function rowToChunkMeta(r: ChunkRow): ChunkMeta {
  return {
    id: r.id,
    libraryId: r.library_id,
    chunkNo: r.chunk_no,
    heading: r.heading,
    summary: r.summary,
    tokenCount: r.token_count,
    r2Key: r.r2_key,
  };
}

// Search library metadata by FTS (title > slug/tags > summary via weights)
export async function searchLibrary(
  sb: SupabaseClient,
  q: string,
  limit?: number,
): Promise<LibraryMeta[]> {
  if (!q.trim()) return [];
  const lim = clampLimit(limit);

  const { data, error } = await sb.rpc("search_library_fts", {
    p_q: q,
    p_limit: lim,
  });

  if (error || !data) return [];
  return (data as LibraryRow[]).map(rowToLibraryMeta);
}

// Search chunk metadata by FTS (heading > summary)
export async function searchChunks(
  sb: SupabaseClient,
  q: string,
  limit?: number,
): Promise<ChunkMeta[]> {
  if (!q.trim()) return [];
  const lim = clampLimit(limit);

  const { data, error } = await sb.rpc("search_chunks_fts", {
    p_q: q,
    p_limit: lim,
  });

  if (error || !data) return [];
  return (data as ChunkRow[]).map(rowToChunkMeta);
}

// Get a single library entry by slug
export async function getLibraryMeta(
  sb: SupabaseClient,
  slug: string,
): Promise<LibraryMeta | null> {
  const { data, error } = await sb
    .from("library")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return rowToLibraryMeta(data as LibraryRow);
}

// Get a single chunk by id
export async function getChunkMeta(
  sb: SupabaseClient,
  id: string,
): Promise<ChunkMeta | null> {
  const { data, error } = await sb
    .from("chunks")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return rowToChunkMeta(data as ChunkRow);
}

// Recent libraries (by indexed_at desc)
export async function getRecentLibs(
  sb: SupabaseClient,
  limit?: number,
): Promise<LibraryMeta[]> {
  const lim = clampLimit(limit);

  const { data, error } = await sb
    .from("library")
    .select("*")
    .order("indexed_at", { ascending: false })
    .limit(lim);

  if (error || !data) return [];
  return (data as LibraryRow[]).map(rowToLibraryMeta);
}

// Related libraries — share at least one tag or same category
export async function getRelatedLibs(
  sb: SupabaseClient,
  slug: string,
  limit?: number,
): Promise<LibraryMeta[]> {
  const lim = clampLimit(limit);

  // First get the source library to find its tags + category
  const source = await getLibraryMeta(sb, slug);
  if (!source) return [];

  const { data, error } = await sb
    .from("library")
    .select("*")
    .neq("slug", slug)
    .or(
      `category.eq.${source.category}` +
        (source.tags.length > 0
          ? `,tags.cs.{${source.tags.map((t) => `"${t}"`).join(",")}}`
          : ""),
    )
    .limit(lim);

  if (error || !data) return [];
  return (data as LibraryRow[]).map(rowToLibraryMeta);
}

export { clampLimit, MAX_LIMIT };
