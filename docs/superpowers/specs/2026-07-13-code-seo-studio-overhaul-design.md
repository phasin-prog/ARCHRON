# ARCHRON Major Overhaul — Code Quality, SEO, Studio

Date: 2026-07-13 | Status: Design Approved | Scope: Major Overhaul

## Overview

ปรับปรุง ARCHRON แบบ Major Overhaul ใน 3 ด้านไปพร้อมกัน: Code Quality, Content/SEO, Studio/Backend
โดยใช้ **Domain-Driven Vertical Slices** — แต่ละ slice เชื่อมทั้ง 3 ด้านเข้าด้วยกัน
เริ่มจาก foundation (type system) → surface (SEO metadata)

6 Slices (ทำตามลำดับ 1→6):

## Slice 1: Type System Foundation

### Problem
`ContentEntry` มี ~35 optional fields ใน type เดียว — field เช่น `mainTerm`, `thaiName` ใช้กับ concept เท่านั้น
แต่ `founder`, `period` ใช้กับ school — ทั้งหมดถูก flatten ลง type เดียว ทำให้ไม่มี type safety,
Studio form ต้องใช้ `show.xxx` boolean map, SEO metadata ต้องเช็ค `contentType` ด้วย if/else ยาว

### Solution
ใช้ **discriminated union** แยกเป็น type ตาม `contentType`:

- `BaseEntry` — fields ที่ใช้ร่วมกัน (id, title, slug, status, bodyMarkdown, coverImage, relatedConcepts, references, ...)
- `ConceptEntry` — mainTerm, thaiName, originalTerm, partOfSpeech, languageRoot, ipa, shortDescription, roots, framework
- `PersonEntry` — bornYear, diedYear, nationality, keyIdeas, notableWorks
- `BookEntry` — publicationYear, publisher, isbn
- `SchoolEntry` — founder, period
- `ArticleEntry` — subtitle, series, volume

เติม **Zod schemas** สำหรับ runtime validation ทุก type

### Impact Surface
| Layer | Files | Change |
|---|---|---|
| Types | `src/types/content.ts` | Discriminated union + Zod |
| Entries | `src/lib/content/entries.ts` | Cast per-type |
| DB Mapper | `src/lib/content/entry-mapper.ts` | Discriminated parsing |
| Draft Mapper | `src/lib/content/draft-mapper.ts` | EditorDraft per type |
| Studio Form | `src/components/studio/editor-form.tsx` | Render per type (no show.* booleans) |
| Editor Page | `src/app/studio/editor/page.tsx` | Remove `show` object, type narrowing |
| All Readers | `ReadingPage`, pages | Type-safe access |

### Constraints
- ไม่แตะ DB schema ใน slice นี้ — เปลี่ยนแค่ mapper layer ก่อน
- Backward compat: ทุกที่ที่ใช้ `ContentEntry` ต้อง migrate (แต่ type-safe ขึ้น)

---

## Slice 2: Content Library Consolidation

### Problem
`src/lib/content/` มี 43 ไฟล์ใน flat directory — ทุกไฟล์ import ข้ามกันได้, หายาก, มีทั้ง data/logic/utility ปนกัน

### Solution
จัดกลุ่มเป็น 6 modules:

```
lib/content/
├── core/                     # Foundation — type-specific data + registry
│   ├── registry.ts           # merged concept-registry
│   ├── seeds/                # entries, schools, disciplines, reading-sets, themes, theories
│   └── cosmology.ts          # ontology + taxonomy รวมกัน
│
├── publishing/               # Draft → Publish flow
│   ├── draft-db.ts, draft-mapper.ts
│   ├── entries-db.ts, entry-mapper.ts
│   ├── public-source.ts, publish-validation.ts
│   └── internal-links.ts
│
├── reading/                  # Reader-facing data
│   ├── related.ts, graph.ts, recommendations.ts
│   └── reading-db.ts, reading-actions.ts
│
├── seo/                      # SEO-specific logic
│   ├── metadata.ts           # unified metadata generator
│   ├── structured-data.ts    # JSON-LD generators
│   └── search-index.ts
│
├── community/                # User features
│   ├── seals.ts, achievements.ts, levels.ts
│   ├── profile-db.ts, comments-db.ts, comments-actions.ts
│   └── views-db.ts
│
└── utils/                    # Shared utilities
    ├── roles.ts, assets.ts, colors.ts
    ├── translations.ts, sources.ts, faq.ts, timeline.ts
    └── external-links.ts
```

### Rules
- Import direction: `core` → `publishing` → `reading` → `seo` → `community` (one-way)
- No circular imports
- Each module has `index.ts` barrel export
- `seo/` uses data from `core/` and `reading/` — no reverse dependency

---

## Slice 3: Studio Editor Decomposition

### Problem
`src/app/studio/editor/page.tsx` — 466 บรรทัด, 23 `useState`, concerns ปนกัน: auth, CRUD, validation, auto-save, preview, UI

### Solution
แยกเป็น 3 layers:

**1. State Machine** (`features/editor/hooks/useEditorMachine.ts`)
- `useReducer` — ลด 23 useState → 1 reducer
- States: `dashboard | editing | previewing | publishing | saved`
- Actions: `LOAD_DRAFT`, `UPDATE_FIELD`, `AUTO_SAVE_START/DONE`, `PREVIEW`, `EDIT`, `PUBLISH_START/DONE`

**2. Action Layer** (`features/editor/actions.ts`)
- Pure functions: saveDraft, loadDraft, publish, validateDeadLinks, generateFeedback
- Not tied to React — testable independently

**3. Per-Section Components** (`components/studio/editor/`)
- `editor-dashboard.tsx` — My Work dashboard (entry/draft lists)
- `editor-basic-info.tsx` — Title, slug, contentType, status
- `editor-concept-fields.tsx` — concept-only fields (conditional render)
- `editor-person-fields.tsx` — person-only fields
- `editor-book-fields.tsx` — book-only fields
- `editor-school-fields.tsx` — school-only fields
- `editor-body.tsx` — Markdown editor + preview toggle
- `editor-relations.tsx` — Related concepts + references
- `editor-cta.tsx` — Related CTA section
- `editor-publish-panel.tsx` — Publish checklist + feedback

**4. Thin Orchestrator** (`page.tsx` → ~80 lines)
- Renders layout + conditionally mounts section components
- Passes sliced state (not full draft) to each component

---

## Slice 4: SEO Pipeline

### Problem
- Sitemap ครอบคลุมแค่ concepts, schools, thinkers, reading-sets — ขาด articles, books, themes, etc.
- ไม่มี `generateMetadata` ใน dynamic pages ส่วนใหญ่
- ไม่มี JSON-LD structured data
- ไม่มี OG images
- ไม่มี canonical URLs

### Solution

**1. Unified Metadata Generator** (`lib/content/seo/metadata.ts`)
```ts
generatePageMetadata(entry: ContentEntry): Metadata
// Produces: title, description, openGraph (with OG image), alternates.canonical
// Type-safe via discriminated union from Slice 1
```

**2. JSON-LD Structured Data** (`lib/content/seo/structured-data.ts`)
- `articleLd()` → JSON-LD Article
- `conceptLd()` → JSON-LD Article + mentions
- `personLd()` → JSON-LD Person
- `bookLd()` → JSON-LD Book
- `schoolLd()` → JSON-LD Organization
- `breadcrumbLd()` → JSON-LD BreadcrumbList
- `organizationLd()` → JSON-LD Organization (ARCHRON)

**3. Complete Sitemap** — iterate ALL entry types from registry, use canonical slug function

**4. Per-Page `generateMetadata`** — added to every `[slug]/page.tsx`

**5. OG Image API Route** (`app/api/og/route.tsx`) — Satori-based, renders title + type icon, cached via ISR

---

## Slice 5: Data Flow Architecture

### Problem
- Dual-source ambiguity (DB → fallback seed) — trace ยาก
- No caching layer outside ISR
- No single source of truth — 3 separate seed arrays
- No consistent error handling / Suspense / streaming

### Solution

**1. Layered Data Access**
```
Registry (static seed) → Repository (abstraction) → Cache → API/Page
```

**2. Single Source of Truth** — merge all registries into `ALL_ENTRIES`

**3. Error Boundaries + Suspense** — ทุก dynamic route wraps content in `<Suspense>` + calls `notFound()`

**4. Standardized Cache Strategy**
| Page | Strategy | Reason |
|---|---|---|
| `/` | ISR 60s | Featured content changes often |
| List pages (`/articles`, `/concepts`) | ISR 300s | Moderate change |
| Detail pages (`/articles/[slug]`) | ISR 3600s + on-demand | Rare change, instant on publish |
| Static (`/faq`, `/manifesto`) | force-static | Never changes |
| Studio (`/studio/*`) | force-dynamic | Authenticated |

---

## Slice 6: Testing & Quality Gates

### Problem
- Vitest configured but no unit tests in `src/`
- No CI pipeline visible
- No pre-commit hooks

### Solution

**Test Pyramid:**
- **Unit (Vitest):** Reducers, mappers, validators, slugify, metadata generators
- **Integration (Vitest + RTL):** Component composition, form interactions, search filtering, SEO metadata output
- **E2E (Playwright):** Reader journey, studio publish flow, SEO checks, a11y

**Test Priority:**
| P0 | Reducer, mapper, validator unit tests |
| P1 | SEO output integration tests |
| P2 | Editor form integration tests |
| P3 | E2E critical journeys |

**CI Pipeline** (`.github/workflows/ci.yml`):
- `lint` — eslint .
- `types` — tsc --noEmit
- `unit` — vitest run
- `e2e` — playwright test (main branch only)
- `build` — next build

**Pre-commit** (optional): husky + lint-staged for `.ts/.tsx`

---

## Execution Order

```
Slice 1 → Slice 2 → Slice 3 → Slice 4 → Slice 5 → Slice 6
  │         │         │         │         │         │
  Types     Modules   Studio    SEO       Data      Tests
```

แต่ละ slice: implement → verify (lint + build + tests) → commit

---

## Constraints

- ห้ามแตะ global chrome (site-header, site-footer, layout, template) นอก Slice 4 SEO metadata
- ห้ามเปลี่ยน DB schema — เปลี่ยนแค่ mapper layer ก่อน
- ห้ามเปลี่ยน brand identity, color palette, Thai-first policy
- ทุก commit ต้องผ่าน lint + build
- Studio draft ของผู้เขียนต้องไม่หลุด public (RLS เดิมยังอยู่)
