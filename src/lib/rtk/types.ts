// RTK Phase 2 — shared types

// Document-level metadata (mirrors public.library row, camelCase)
export type LibraryMeta = {
  id: string;
  entryId: string;
  title: string;
  slug: string;
  summary: string | null;
  category: string | null;
  tags: string[];
  language: string;
  author: string | null;
  tokenCount: number;
  hash: string | null;
  r2Key: string | null;
  updatedAt: string;
  indexedAt: string;
};

// Chunk-level metadata (mirrors public.chunks row, camelCase)
export type ChunkMeta = {
  id: string;
  libraryId: string;
  chunkNo: number;
  heading: string | null;
  summary: string | null;
  tokenCount: number;
  r2Key: string;
};

// A chunk with its markdown content (loaded from R2)
export type ChunkWithContent = ChunkMeta & {
  content: string | null; // null if R2 read failed
  error?: "content_unavailable";
};

// Output of chunkByHeading() — pure, before persistence
export type RawChunk = {
  chunkNo: number;
  heading: string | null;
  headingLevel: number | null; // 2 | 3 | null
  markdown: string; // includes heading line
};

// Result of refreshLibrary()
export type RefreshResult = {
  reindexed: number;
  chunks: number;
  errors: { slug: string; reason: string }[];
};

// DB row shapes (snake_case, for mapping)
export type LibraryRow = {
  id: string;
  entry_id: string;
  title: string;
  slug: string;
  summary: string | null;
  category: string | null;
  tags: string[] | null;
  language: string;
  author: string | null;
  token_count: number;
  hash: string | null;
  r2_key: string | null;
  updated_at: string;
  indexed_at: string;
};

export type ChunkRow = {
  id: string;
  library_id: string;
  chunk_no: number;
  heading: string | null;
  summary: string | null;
  token_count: number;
  r2_key: string;
  created_at: string;
};
