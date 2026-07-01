# RTK Phase 2 — Metadata Retrieval Architecture (Design Spec)

- **Date:** 2026-07-01
- **Scope:** Full spec + implementation (overrides `AGENTS.md` Rule 7 for this work — explicit user authorization given)
- **Status:** Approved (all 5 design sections), pending implementation

---

## 0. Context & Decisions

The RTK Phase 2 spec (provided in the task prompt) defines a metadata retrieval architecture for minimizing retrieval latency while maximizing relevant context. It describes Cloudflare R2 (storage), Supabase PostgreSQL (metadata), and Upstash Redis (cache) as the three systems, with MCP as the only entry point.

This codebase (Archron) **already has** all three infrastructural primitives:
- Cloudflare R2 — `lib/storage/` (`r2-client.ts`, `upload.ts`, `delete.ts`, `read.ts`), env `R2_*` present
- Upstash Redis — `lib/cache/` (`redis.ts`, `cache.ts` with `cached<T>()` helper), env `UPSTASH_REDIS_REST_*` present
- Supabase — `lib/supabase/`, schema has `entries` / `entry_revisions` / `profiles` / `comments` / `page_views`

**Missing (greenfield) for RTK Phase 2:**
- `library` / `chunks` tables in Supabase (no schema, no migrations)
- MCP server + `@modelcontextprotocol/sdk` dependency + 8 MCP tools
- Ingestion pipeline (chunking + indexing)

### Decisions (from brainstorming session)

| Topic | Decision |
|---|---|
| Deliverable | Spec + full implementation |
| MCP transport | HTTP on Next.js/Vercel (`/api/mcp/*`, Streamable HTTP transport) |
| Document source | Published entries from `entries` table (body markdown) only |
| Chunk strategy | Heading-based (`##` / `###`) |
| Ranking | Postgres FTS (`tsvector` + `ts_rank` + GIN, `simple` config) |
| Auth | Clerk session (same as app) |
| Implementation scope | All 8 tools + ingestion + cache in one pass |
| Architecture approach | **Approach A — Derived Chunk Table** (chunks = derived index of entries; entries remain source of truth) |

---

## 1. Architecture & Data Model

### Architecture Overview

RTK Phase 2 is a metadata index layer sitting on top of the existing Archron app. The `entries` table (Studio Editor) remains the source of truth for content; RTK adds `library` + `chunks` tables as a **derived index**, plus an MCP server as the single entry point.

```
┌─────────────────────────────────────────────────────────┐
│  MCP Client (ZCode / Claude Code / agent)                │
│  calls via Streamable HTTP + Clerk session token         │
└────────────────────────┬────────────────────────────────┘
                         │ POST /api/mcp (JSON-RPC)
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Next.js API Route: app/api/mcp/route.ts                 │
│  - Streamable HTTP transport (@modelcontextprotocol/sdk) │
│  - Clerk auth (auth() → sub)                             │
│  - Exposes 8 tools                                       │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┼─────────────────┐
        ▼                ▼                 ▼
   Upstash Redis    Supabase PG        Cloudflare R2
   (cache first)    (library/chunks    (chunk content
    HIT → return     metadata +        markdown,
    MISS → PG)       FTS index)         r2_key pointer)
                         ▲
                         │ refreshLibrary()
                         │
              ┌──────────┴───────────┐
              │ lib/rtk/ingest.ts     │
              │ - chunkByHeading()    │
              │ - upsertLibrary()     │
              │ - write chunk→R2      │
              │ - recompute FTS       │
              └──────────┬───────────┘
                         │ triggered by
                         ▼
              publishEntry / upsertEntryRow
              (hook in lib/content/draft-db.ts)
```

### Data Model

#### Table `library` — document-level metadata

Maps 1:1 to `entries` where `status='published'`, via `entry_id` FK.

| Column | Type | Note |
|---|---|---|
| `id` | uuid PK | |
| `entry_id` | uuid FK→entries, unique | |
| `title` | text | from entries.title |
| `slug` | text | from entries.slug (unique) |
| `summary` | text | entries.short_description or first paragraph |
| `category` | text | = entries.content_type |
| `tags` | text[] | from entries.tags |
| `language` | text | `'th'` (Thai-first) |
| `author` | text | entries.author_name |
| `token_count` | int | total tokens across all chunks |
| `hash` | text | sha256(body_markdown) — change detection |
| `r2_key` | text | key of full doc in R2 (optional, used by getLibrary) |
| `fts` | tsvector | generated column: title+slug+tags+summary (weighted) |
| `updated_at` | timestamptz | |
| `indexed_at` | timestamptz | last refresh |

#### Table `chunks` — chunk-level metadata

Split by heading in `body_markdown`.

| Column | Type | Note |
|---|---|---|
| `id` | uuid PK | |
| `library_id` | uuid FK→library, on delete cascade | |
| `chunk_no` | int | chunk order (0,1,2…) |
| `heading` | text | heading text or null (preamble) |
| `summary` | text | first sentence or first N chars |
| `token_count` | int | |
| `r2_key` | text | key of chunk content in R2 |
| `fts` | tsvector | generated: heading+summary |
| `created_at` | timestamptz | |

### RLS

- `library` + `chunks`: **read public** (anon + authenticated) — these mirror published entries, consistent with the existing `entries_select` policy that exposes published rows.
- **Write only via service role** (server-side ingestion) — no insert/update/delete policies for client roles.
- `library.entry_id` FK with `on delete cascade`: entry deleted → library + chunks removed automatically.

### FTS configuration

- Use `simple` configuration (not `thai`) — Supabase typically lacks a thai dictionary; `simple` splits on whitespace/punctuation, which works reasonably for Thai.
- GIN index on `library.fts` and `chunks.fts`.
- `searchLibrary()` query: `WHERE fts @@ plainto_tsquery('simple', $q) ORDER BY ts_rank(fts, q) DESC`.

#### FTS weight mapping (RTK SEARCH STRATEGY priority)

```sql
-- library.fts (generated column)
setweight(to_tsvector('simple', coalesce(title,'')), 'A') ||
setweight(to_tsvector('simple', coalesce(slug,'')),  'B') ||
setweight(to_tsvector('simple', coalesce(array_to_string(tags,' '),'')), 'B') ||
setweight(to_tsvector('simple', coalesce(summary,'')), 'C')
```

Weight A (title) > B (slug/tags) > C (summary) → `ts_rank` scores by priority naturally. This satisfies the RTK SEARCH STRATEGY ordering: exact title → slug → tags → heading → summary → category (category is not indexed in FTS; it is used as a filter in `getRelated`).

---

## 2. MCP Tools & Retrieval Flow

### MCP Server Setup

**File:** `app/api/mcp/route.ts` (single endpoint, Streamable HTTP transport)

**Dependencies:** `@modelcontextprotocol/sdk` + `zod` (added to package.json)

**Auth flow:**
1. MCP client sends Clerk session token in `Authorization: Bearer <session-token>` header.
2. Route handler calls Clerk `auth()` → obtains `userId` (sub).
3. Creates Supabase client with Clerk token attached (follows the existing `lib/supabase/client.ts` pattern) → RLS applies normally.
4. No session → HTTP 401.

**MCP tool registry:** Each tool registered in the server with a Zod input schema + handler.

### 8 MCP Tools

#### Read tools (cache-first)

| Tool | Input | Output | Cache key | TTL |
|---|---|---|---|---|
| `searchLibrary(q, limit?)` | query string, default limit 5 | `LibraryMeta[]` (id,title,slug,summary,category,tags,token_count) | `rtk:search:lib:{q}:{limit}` | 300s |
| `searchChunks(q, limit?)` | query string, default limit 5 | `ChunkMeta[]` (id,library_id,chunk_no,heading,summary,token_count,r2_key) | `rtk:search:chunk:{q}:{limit}` | 300s |
| `getLibrary(slug)` | slug | `LibraryMeta` + `r2_key` | `rtk:lib:{slug}` | 300s |
| `getChunk(id)` | chunk id | chunk meta + **content from R2** | `rtk:chunk:{id}` | 600s |
| `getRecent(limit?)` | default 5 | `LibraryMeta[]` ORDER BY `indexed_at DESC` | `rtk:recent:{limit}` | 120s |
| `getRelated(slug, limit?)` | library slug | `LibraryMeta[]` sharing tags/category | `rtk:related:{slug}:{limit}` | 300s |

#### Mutation tools (no cache read; invalidate after)

| Tool | Input | Output | Side effect |
|---|---|---|---|
| `warmCache(slugs?)` | optional slugs to warm; empty = warm recent 10 | `{warmed: number}` | pre-populate Redis with getChunk/getLibrary results |
| `refreshLibrary(slug?)` | optional slug (empty = reindex all) | `{reindexed: number, chunks: number, errors?: [{slug, reason}]}` | re-chunk + upsert library/chunks + write R2 + invalidate cache |

### Retrieval Flow (RTK spec compliance)

Every read tool follows this order — never reversed:

```
searchLibrary(q)
  │
  ▼
Step 1: Redis Cache (rtk:search:lib:{q}:{limit})
  │ HIT → return immediately ✅
  │ MISS ↓
  ▼
Step 2: Supabase — searchLibrary query
  SELECT id,title,slug,summary,category,tags,token_count
  FROM library
  WHERE fts @@ plainto_tsquery('simple', $q)
  ORDER BY ts_rank(fts, q) DESC
  LIMIT $limit
  │
  ▼
Step 3-4: rank (ts_rank in DB) + select chunk IDs (in searchChunks)
  │
  ▼
Step 5: (getChunk only) Load markdown from R2 via r2_key
  │
  ▼
Step 6: Return Context + write cache (fire-and-forget)
```

### Context limits enforcement

- `limit` default 5, hard max 8 (tool rejects `limit > 8` with `InvalidParams`).
- `getChunk` returns exactly 1 chunk — to get more, call again (incremental retrieval).
- No tool returns an entire library.

---

## 3. Ingestion Pipeline

### File Structure

All new files live under `lib/rtk/`:

```
lib/rtk/
├── ingest.ts          — chunking + upsert library/chunks + R2 writes
├── chunker.ts         — pure function: markdown → Chunk[]
├── tokens.ts          — token estimation (no heavy tokenizer)
├── search.ts          — query helpers (searchLibrary/searchChunks/searchRelated)
├── cache.ts           — RTK cache keys + warm/invalidate
├── mcp/
│   ├── server.ts      — create McpServer + register 8 tools
│   ├── tools/
│   │   ├── search-library.ts
│   │   ├── search-chunks.ts
│   │   ├── get-library.ts
│   │   ├── get-chunk.ts
│   │   ├── get-recent.ts
│   │   ├── get-related.ts
│   │   ├── warm-cache.ts
│   │   └── refresh-library.ts
│   └── auth.ts        — Clerk session → Supabase RLS client
└── types.ts           — LibraryMeta, ChunkMeta, Chunk, etc.
```

### Chunking Algorithm (heading-based)

`chunker.ts` — pure function, no side effects, independently testable:

```typescript
type RawChunk = {
  chunkNo: number;
  heading: string | null;      // null = preamble (before first heading)
  markdown: string;            // includes heading line
  headingLevel: number | null; // 2 | 3 | null
};

export function chunkByHeading(markdown: string): RawChunk[]
```

**Logic:**
1. Split into lines; scan for `^#{2,3}\s` (`##` or `###` — single `#` is treated as title, not a section).
2. Each heading starts a new chunk; content before the first heading = preamble chunk (`heading=null`).
3. Each chunk stores heading text (stripped of `#`) + content under the heading until the next heading.
4. **Merge rule:** a chunk shorter than 150 tokens is merged into the previous chunk (unless it is the first chunk).
5. **Split rule:** a chunk exceeding 800 tokens is split further at paragraph breaks (`\n\n`) — sub-chunks keep the same heading + increment `chunk_no`.

### Token Estimation

`tokens.ts` — does not use tiktoken (heavy + inaccurate for Thai):

```typescript
// Thai: ~1 token ≈ 1.5 characters (heuristic)
// English: ~1 token ≈ 4 characters
// Mixed: count Thai vs non-Thai separately
export function estimateTokens(text: string): number
```

Accuracy ±15% — sufficient for metadata + limit checks (not used for billing).

### refreshLibrary(slug?) flow

```
refreshLibrary(slug?)
  │
  ├─ if slug given → load 1 entry; else → load all published entries
  │
  ├─ for each entry:
  │   ├─ hash = sha256(body_markdown)
  │   ├─ if library.hash == hash and not forced → skip (no change)
  │   ├─ chunks = chunkByHeading(body_markdown) + estimateTokens
  │   ├─ upsert library row (title,slug,summary,category,tags,hash,...)
  │   ├─ delete old chunks WHERE library_id = ...
  │   ├─ for each chunk:
  │   │   ├─ r2_key = `rtk/chunks/{library_id}/{chunk_no}.md`
  │   │   ├─ write chunk.markdown → R2 (overwrite)
  │   │   └─ insert chunk row
  │   └─ recompute library.token_count = sum(chunk token_counts)
  │
  ├─ invalidate cache (rtk:lib:{slug}, rtk:search:*, rtk:recent:*, rtk:related:*)
  └─ return {reindexed, chunks, errors?}
```

### Trigger Points

Ingestion is hooked into the points where entries change — no cron needed:

| Hook location | Event | Action |
|---|---|---|
| `publishEntry()` in `lib/content/draft-db.ts` | entry → published | `refreshLibrary(slug)` |
| `upsertEntryRow()` in `lib/content/entries-db.ts` | published entry edited | `refreshLibrary(slug)` (if status='published') |
| `deleteEntry()` in `lib/content/entries-db.ts` | entry deleted | FK cascade removes library+chunks + `invalidateRTK(slug)` |

**Non-blocking:** refresh runs fire-and-forget — does not block the user response (entry saved successfully → refresh runs in the background; if it fails, only log, does not affect the user).

### R2 layout

```
rtk/                          ← new prefix, does not collide with media/uploads
├── chunks/
│   ├── {library_id}/
│   │   ├── 0.md
│   │   ├── 1.md
│   │   └── ...
│   └── ...
└── docs/                     ← (optional, for getLibrary full doc)
    └── {slug}.md
```

Uses the existing `lib/storage/upload.ts` (S3-compatible putObject).

**`library.r2_key` semantics:** This field holds the R2 key for the entry's **full document markdown** (used by `getLibrary()` when a caller wants the whole doc rather than chunks). It is populated as follows:
- If the entry already has a non-null `r2_content_key` (e.g. schools/thinkers imported via `import-schools.ts`), `library.r2_key` reuses that same key — no duplicate storage.
- Otherwise, ingestion writes the full `body_markdown` to `rtk/docs/{slug}.md` and stores that key. Chunk content is always written separately under `rtk/chunks/{library_id}/{chunk_no}.md`, independent of `library.r2_key`.

---

## 4. Cache Layer & Error Handling

### Cache Strategy

RTK cache uses the existing Upstash Redis (`lib/cache/redis.ts`) but with a **separate namespace** from the existing cache (`archron:cache:`) for isolation:

```
rtk:                          ← new namespace
├── search:lib:{q}:{limit}    TTL 300s
├── search:chunk:{q}:{limit}  TTL 300s
├── lib:{slug}                TTL 300s
├── chunk:{id}                TTL 600s  (content stable by hash)
├── recent:{limit}            TTL 120s
└── related:{slug}:{limit}    TTL 300s
```

**File:** `lib/rtk/cache.ts` — wraps `redisGet`/`redisSet`/`redisDel`/`redisDelPattern` with the `rtk:` prefix.

### Cache rules

| Operation | Cache behavior |
|---|---|
| Read tools (search/get) | Check cache → HIT return / MISS query DB → write cache fire-and-forget |
| `refreshLibrary` | **Invalidate** all `rtk:*` keys for affected slug + pattern delete `rtk:search:*` + `rtk:recent:*` |
| `warmCache` | Pre-populate: run getChunk/getLibrary for target slugs → write results to cache |
| Redis unavailable | **Graceful fallback** — skip cache, query DB directly (mirrors the existing `cache.ts` that checks `hasRedis()`) |

### Cache invalidation matrix

| Event | Keys to delete |
|---|---|
| Single entry refresh | `rtk:lib:{slug}`, `rtk:related:{slug}`, `rtk:search:*` (pattern), `rtk:recent:*` (pattern) |
| Full reindex | `rtk:*` (pattern delete all) |
| Entry deleted | `rtk:lib:{slug}`, `rtk:related:{slug}`, `rtk:search:*`, `rtk:recent:*` (FK cascade handles DB) |

**Note on chunk cache:** Chunk IDs change on every refresh (chunk_no may shift), so per-id invalidation of `rtk:chunk:{id}` is not straightforward. For single-entry refresh we rely on `rtk:search:*` and `rtk:lib:{slug}` invalidation; stale `rtk:chunk:{id}` entries expire via the 600s TTL. For full reindex, a `rtk:chunk:*` pattern delete is used.

### Error Handling

#### Failure modes & responses

| Failure | Behavior | MCP error code |
|---|---|---|
| Clerk auth fails (no/invalid session) | 401 + tools not exposed | — (HTTP) |
| Supabase query error | Return MCP error, log to console | `Internal error` |
| R2 read error (getChunk) | Return chunk meta without content + `error: "content_unavailable"` field | Tool returns partial |
| Redis error | Skip cache, query DB (never block on cache) | — (transparent) |
| `refreshLibrary` partial fail (1 entry fails) | Continue the rest, return `{reindexed, chunks, errors: [{slug, reason}]}` | Tool returns partial |
| `limit > 8` | Reject before query | `InvalidParams` |
| Empty query `q` | Return `[]` (no error) | — |
| Slug not found | Return `null` | — |

### Non-blocking refresh safety

Because refresh runs fire-and-forget after publish — if it fails, the entry is still published normally, but library/chunks may be stale. Mitigations:
1. Wrap refresh in try/catch that logs errors without throwing.
2. Expose `refreshLibrary(slug)` as an MCP tool — users/admins can re-run on demand.
3. hash check (sha256) prevents redundant reindex when content is unchanged.

### Concurrency

- If refresh overlaps (user edits an entry twice in quick succession) — the hash check makes the second call a no-op if content is unchanged.
- If content differs — both run; the later write wins at upsert (last-write-wins) — acceptable because hash guarantees final consistency.

---

## 5. Testing, File Inventory & Rollout

### Testing Strategy

The project currently uses **Playwright** for e2e tests (`npm test` → `playwright test`). For RTK we add **Vitest** for unit tests of pure functions, since they are logic-focused and faster than browser e2e.

#### Unit tests (Vitest)

| File under test | Test cases |
|---|---|
| `lib/rtk/chunker.ts` | (1) markdown with no heading → 1 preamble chunk (2) `##` `###` present → split by heading (3) chunk shorter than 150 tokens → merge with previous (4) chunk longer than 800 tokens → split at paragraph (5) heading text stripped of `#` (6) empty markdown → `[]` |
| `lib/rtk/tokens.ts` | (1) pure Thai token count reasonable (2) pure English (3) mixed (4) empty → 0 |
| `lib/rtk/cache.ts` | (1) cache HIT returns cached (2) MISS queries + writes (3) Redis down → fallback DB (mock `hasRedis()=false`) (4) invalidate pattern |

#### Integration tests (Vitest, with mocked Supabase/R2)

| Scenario | How |
|---|---|
| refreshLibrary end-to-end | seed test entry → call refreshLibrary → assert library row + chunk rows + R2 keys written |
| searchLibrary FTS | seed 2 entries (matching/non-matching) → refresh → searchLibrary("freud") → assert order by ts_rank |
| getChunk loads from R2 | after refresh → getChunk(id) → assert content matches chunk markdown |
| Cache hit/miss | call searchLibrary twice → second call served from cache (mock redisGet) |

#### MCP tool tests

Manual smoke test with an MCP client (e.g. ZCode calling the tool live) after deploy — not automated in CI because it requires a Clerk session + live Supabase.

#### Existing Playwright suite

Unaffected — RTK touches no UI; everything is under `/api/mcp` + `lib/rtk/`. No page component changes.

### File Inventory

#### New files

| File | Purpose | Lines (est.) |
|---|---|---|
| `supabase/migrations/rtk_phase2.sql` | library + chunks tables, FTS generated columns, GIN indexes, RLS, grants | ~120 |
| `lib/rtk/types.ts` | LibraryMeta, ChunkMeta, RawChunk types | ~40 |
| `lib/rtk/tokens.ts` | estimateTokens() | ~25 |
| `lib/rtk/chunker.ts` | chunkByHeading() pure function | ~80 |
| `lib/rtk/ingest.ts` | refreshLibrary(), upsertLibrary(), chunk R2 writes | ~150 |
| `lib/rtk/search.ts` | searchLibrary(), searchChunks(), getRelated() SQL helpers | ~120 |
| `lib/rtk/cache.ts` | RTK cache keys, warmCache(), invalidate() | ~70 |
| `lib/rtk/mcp/auth.ts` | Clerk session → Supabase RLS client | ~40 |
| `lib/rtk/mcp/server.ts` | createMcpServer + register all 8 tools | ~60 |
| `lib/rtk/mcp/tools/*.ts` | 8 tool files (1 per tool) | ~40 each = ~320 |
| `app/api/mcp/route.ts` | Streamable HTTP transport entry | ~50 |
| `lib/rtk/index.ts` | barrel export | ~15 |
| `tests/rtk/chunker.test.ts` | unit tests | ~100 |
| `tests/rtk/tokens.test.ts` | unit tests | ~50 |
| `tests/rtk/cache.test.ts` | unit tests | ~70 |

**Total: ~15 files, ~1310 lines**

#### Modified files (minimal)

| File | Change |
|---|---|
| `package.json` | add `@modelcontextprotocol/sdk`, `zod`, `vitest` (devDep) |
| `lib/content/draft-db.ts` | add `refreshLibrary(slug)` call after `publishEntry()` (fire-and-forget) |
| `lib/content/entries-db.ts` | add `refreshLibrary(slug)` call after `upsertEntryRow()` if published; `invalidateRTK()` after `deleteEntry()` |
| `.env.example` | (no new env — uses existing CLERK + SUPABASE + UPSTASH + R2) |

#### NOT touched (guardrail compliance)

- ❌ `site-header.tsx`, `site-footer.tsx`, `app/layout.tsx`, `app/template.tsx` (Rule 2)
- ❌ No new pages/routes outside `/api/mcp` (Rule 1)
- ❌ No brand/identity change (Rule 5)
- ❌ No existing schema change — only adds new tables (Rule 7, authorized)
- ❌ No secrets in code (Rule 8)

### Rollout Plan

| Step | Action | Verification |
|---|---|---|
| 1 | Add dependencies: `@modelcontextprotocol/sdk`, `zod`, `vitest` (dev) | `npm install` succeeds |
| 2 | Create migration `rtk_phase2.sql` — run in Supabase SQL Editor | tables + indexes + RLS created |
| 3 | Implement `lib/rtk/` (chunker → tokens → ingest → search → cache) | unit tests green |
| 4 | Wire hooks in `draft-db.ts` + `entries-db.ts` | build passes |
| 5 | Implement MCP server + 8 tools + `/api/mcp/route.ts` | build passes |
| 6 | Backfill: run `refreshLibrary()` (no slug = all) first time via MCP tool or script | library + chunks rows populated |
| 7 | `npm run lint && npm run build` | green (Rule 9) |
| 8 | Manual smoke test: ZCode calls searchLibrary + getChunk | results correct |
| 9 | Commit | only RTK files + hooks (Rule 9) |

---

## 6. RTK Spec Compliance Checklist

| RTK spec requirement | How this design satisfies it |
|---|---|
| R2 is storage only, never searched directly | Chunks content stored in R2 via `r2_key`; all access through `getChunk()` which reads R2 server-side |
| Supabase holds Library + Chunk metadata | `library` + `chunks` tables with all spec'd columns |
| Upstash Redis caches search/metadata/chunks | `rtk:` namespace with TTL'd keys |
| MCP is the only entry point, 8 allowed APIs | `/api/mcp` exposes exactly the 8 named tools |
| Retrieval order: Redis → Supabase → rank → select chunks → R2 → return | Enforced in every read tool's handler |
| Context limits: 1–5 chunks preferred, max 8 | `limit` default 5, hard max 8 |
| Search strategy priority: title → slug → tags → heading → summary | FTS weighted columns A/B/C + chunk heading FTS |
| Chunk policy: chunks have library_id, chunk_no, summary, token_count, r2_key | All present in `chunks` table |
| Cache policy: metadata, recent searches, chunk content, popular docs | `rtk:lib:*`, `rtk:search:*`, `rtk:chunk:*`, `rtk:recent:*` keys |
| Never cache entire project context | No tool returns all libraries; cache keys are per-query/per-slug/per-chunk |
| Code generation policy: retrieve only relevant docs | Tools return metadata + chunk content, not unrelated docs |
