# Code Quality · SEO · Studio — Major Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul ARCHRON across Code Quality (type system, module consolidation, editor decomposition), SEO (metadata, structured data, sitemap), and Studio/Backend (editor state machine, data flow, caching) via 6 sequential vertical slices.

**Architecture:** Discriminated union types per contentType (Slice 1) → module consolidation (Slice 2) → Studio editor state machine + per-section components (Slice 3) → SEO pipeline with unified metadata/JSON-LD/sitemap (Slice 4) → layered data flow with caching (Slice 5) → test pyramid + CI (Slice 6).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5.8, Tailwind v4, Supabase, Clerk, Zod, Vitest, Playwright

## Global Constraints

- ห้ามแตะ global chrome (`site-header.tsx`, `site-footer.tsx`, `app/layout.tsx`, `app/template.tsx`) ยกเว้น Slice 4 SEO metadata
- ห้ามเปลี่ยน DB schema — เปลี่ยนแค่ mapper layer
- ห้ามเปลี่ยน brand identity, color palette, Thai-first policy
- ทุก commit ต้องผ่าน `npm run lint` + `npm run build`
- Studio draft ของผู้เขียนต้องไม่หลุด public (RLS เดิมต้องยังทำงาน)

---

## Slice 1: Type System Foundation

### Task 1.1: Define new discriminated union types + Zod schemas

**Files:**
- Modify: `src/types/content.ts`
- Create: `src/types/content-schemas.ts`

**Interfaces:**
- Produces: `BaseEntry`, `ConceptEntry`, `PersonEntry`, `BookEntry`, `SchoolEntry`, `ArticleEntry`, `SymbolEntry`, `TermEntry`, `ReadingSetEntry`, `SourceNoteEntry` types
- Produces: `ContentEntry = ConceptEntry | PersonEntry | BookEntry | SchoolEntry | ArticleEntry | SymbolEntry | TermEntry | ReadingSetEntry | SourceNoteEntry`
- Produces: `conceptSchema`, `personSchema`, `bookSchema`, `schoolSchema`, `articleSchema`, `entrySchema` (Zod)

- [ ] **Step 1: Write the Zod schemas in `src/types/content-schemas.ts`**

```ts
// src/types/content-schemas.ts
import { z } from "zod";

export const relationTypeEnum = z.enum([
  "prerequisite", "related", "contrasts-with", "part-of", "source-of", "used-in", "influenced-by",
]);
export const sourceTypeEnum = z.enum([
  "primary-source", "secondary-source", "commentary", "editorial-interpretation",
  "website", "dictionary-lexicon", "other",
]);
export const difficultyEnum = z.enum(["beginner", "intermediate", "advanced", "source-note"]);
export const articleStatusEnum = z.enum([
  "draft", "needs-source-check", "ready-to-publish", "published", "archived",
]);

export const relatedConceptSchema = z.object({
  conceptSlug: z.string(),
  relationType: relationTypeEnum,
  reason: z.string().optional(),
});

export const sourceItemSchema = z.object({
  sourceType: sourceTypeEnum,
  author: z.string().optional(),
  title: z.string(),
  year: z.string().optional(),
  pageOrSection: z.string().optional(),
  citationNote: z.string().optional(),
  relatedClaim: z.string().optional(),
});

export const rootsSchema = z.object({
  etymology: z.string().optional(),
  historicalUsage: z.string().optional(),
  meaningShift: z.string().optional(),
  caution: z.string().optional(),
});

export const relatedCtaSchema = z.object({
  articleSlugs: z.array(z.string()).optional(),
  conceptSlugs: z.array(z.string()).optional(),
  readingSetSlugs: z.array(z.string()).optional(),
  sourceNoteSlugs: z.array(z.string()).optional(),
  showConstellationMap: z.boolean().optional(),
});

export const baseEntryFields = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  status: articleStatusEnum,
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  relatedConcepts: z.array(relatedConceptSchema),
  references: z.array(sourceItemSchema),
  relatedCTA: relatedCtaSchema.optional(),
  bodyMarkdown: z.string().optional(),
  coverImage: z.string().optional(),
  r2ContentKey: z.string().optional(),
  r2ContentUrl: z.string().optional(),
  rowId: z.string().optional(),
  rowI: z.number().optional(),
  rowCode: z.string().optional(),
  rowName: z.string().optional(),
});

export const conceptSchema = baseEntryFields.extend({
  contentType: z.literal("concept"),
  mainTerm: z.string(),
  thaiName: z.string(),
  originalTerm: z.string().optional(),
  partOfSpeech: z.string().optional(),
  languageRoot: z.string().optional(),
  ipa: z.string().optional(),
  shortDescription: z.string(),
  framework: z.string().optional(),
  mainThinkers: z.array(z.string()).optional(),
  school: z.string().optional(),
  difficulty: difficultyEnum.optional(),
  subtitle: z.string().optional(),
  series: z.string().optional(),
  volume: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  visualExplanation: z.string().optional(),
  technicalMeaning: z.string().optional(),
  realWorldExamples: z.string().optional(),
  roots: rootsSchema.optional(),
});

export const personSchema = baseEntryFields.extend({
  contentType: z.literal("person"),
  mainTerm: z.string(),
  thaiName: z.string().optional(),
  bornYear: z.string().optional(),
  diedYear: z.string().optional(),
  nationality: z.string().optional(),
  keyIdeas: z.array(z.string()).optional(),
  notableWorks: z.array(z.string()).optional(),
  framework: z.string().optional(),
  mainThinkers: z.array(z.string()).optional(),
  school: z.string().optional(),
  difficulty: difficultyEnum.optional(),
  shortDescription: z.string().optional(),
  visualExplanation: z.string().optional(),
  technicalMeaning: z.string().optional(),
});

export const bookSchema = baseEntryFields.extend({
  contentType: z.literal("book"),
  mainTerm: z.string().optional(),
  thaiName: z.string().optional(),
  publicationYear: z.string().optional(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  framework: z.string().optional(),
  mainThinkers: z.array(z.string()).optional(),
  difficulty: difficultyEnum.optional(),
  shortDescription: z.string().optional(),
  author: z.string().optional(),
});

export const schoolSchema = baseEntryFields.extend({
  contentType: z.literal("school"),
  mainTerm: z.string().optional(),
  thaiName: z.string().optional(),
  founder: z.string().optional(),
  period: z.string().optional(),
  keyIdeas: z.array(z.string()).optional(),
  framework: z.string().optional(),
  school: z.string().optional(),
  difficulty: difficultyEnum.optional(),
  shortDescription: z.string().optional(),
});

export const articleSchema = baseEntryFields.extend({
  contentType: z.literal("article"),
  subtitle: z.string().optional(),
  series: z.string().optional(),
  volume: z.string().optional(),
  framework: z.string().optional(),
  mainThinkers: z.array(z.string()).optional(),
  school: z.string().optional(),
  difficulty: difficultyEnum.optional(),
  shortDescription: z.string().optional(),
  visualExplanation: z.string().optional(),
  technicalMeaning: z.string().optional(),
});

export const symbolSchema = baseEntryFields.extend({
  contentType: z.literal("symbol"),
  mainTerm: z.string().optional(),
  thaiName: z.string().optional(),
  shortDescription: z.string().optional(),
  difficulty: difficultyEnum.optional(),
});

export const termSchema = baseEntryFields.extend({
  contentType: z.literal("term"),
  mainTerm: z.string(),
  thaiName: z.string().optional(),
  originalTerm: z.string().optional(),
  languageRoot: z.string().optional(),
  partOfSpeech: z.string().optional(),
  shortDescription: z.string().optional(),
  difficulty: difficultyEnum.optional(),
});

export const readingSetSchema = baseEntryFields.extend({
  contentType: z.literal("reading-set"),
  subtitle: z.string().optional(),
  shortDescription: z.string().optional(),
  difficulty: difficultyEnum.optional(),
});

export const sourceNoteSchema = baseEntryFields.extend({
  contentType: z.literal("source-note"),
  shortDescription: z.string().optional(),
  difficulty: difficultyEnum.optional(),
});

export const entrySchema = z.discriminatedUnion("contentType", [
  conceptSchema, personSchema, bookSchema, schoolSchema, articleSchema,
  symbolSchema, termSchema, readingSetSchema, sourceNoteSchema,
]);
```

- [ ] **Step 2: Run lint to verify no import/export issues**

```bash
npm run lint
```
Expected: PASS (green, no errors)

- [ ] **Step 3: Update `src/types/content.ts` — add discriminated union types derived from Zod**

Keep existing types (ArticleStatus, ContentType, Difficulty, RelationType, SourceType, RelatedConcept, SourceItem, Roots, RelatedCTA) and add the new discriminated union types derived from Zod schemas:

```ts
// Add at bottom of src/types/content.ts
import { z } from "zod";
import type {
  conceptSchema, personSchema, bookSchema, schoolSchema, articleSchema,
  symbolSchema, termSchema, readingSetSchema, sourceNoteSchema,
} from "@/types/content-schemas";

// Keep existing ContentEntry (flat) for backward compat during migration
// — will be removed after all consumers migrate

// New discriminated union types
export type ConceptEntry = z.infer<typeof conceptSchema>;
export type PersonEntry = z.infer<typeof personSchema>;
export type BookEntry = z.infer<typeof bookSchema>;
export type SchoolEntry = z.infer<typeof schoolSchema>;
export type ArticleEntry = z.infer<typeof articleSchema>;
export type SymbolEntry = z.infer<typeof symbolSchema>;
export type TermEntry = z.infer<typeof termSchema>;
export type ReadingSetEntry = z.infer<typeof readingSetSchema>;
export type SourceNoteEntry = z.infer<typeof sourceNoteSchema>;

// Union type for all entries
export type DiscriminatedEntry =
  | ConceptEntry
  | PersonEntry
  | BookEntry
  | SchoolEntry
  | ArticleEntry
  | SymbolEntry
  | TermEntry
  | ReadingSetEntry
  | SourceNoteEntry;

// Type guard helpers
export function isConcept(e: DiscriminatedEntry): e is ConceptEntry { return e.contentType === "concept"; }
export function isPerson(e: DiscriminatedEntry): e is PersonEntry { return e.contentType === "person"; }
export function isBook(e: DiscriminatedEntry): e is BookEntry { return e.contentType === "book"; }
export function isSchool(e: DiscriminatedEntry): e is SchoolEntry { return e.contentType === "school"; }
export function isArticle(e: DiscriminatedEntry): e is ArticleEntry { return e.contentType === "article"; }
```

- [ ] **Step 4: Run lint + build to verify**

```bash
npm run lint
npm run build
```
Expected: both PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/content.ts src/types/content-schemas.ts
git commit -m "feat(types): add discriminated union + Zod schemas per contentType"
```

### Task 1.2: Update `EntryRow` + `rowToEntry` for discriminated output

**Files:**
- Modify: `src/lib/content/entry-mapper.ts`

**Interfaces:**
- Consumes: `DiscriminatedEntry`, type guards from `@/types/content`
- Produces: `rowToEntry` returns `DiscriminatedEntry` (not flat `ContentEntry`)

- [ ] **Step 1: Rewrite `EntryRow` to include all needed DB columns**

```ts
// src/lib/content/entry-mapper.ts
import type {
  DiscriminatedEntry,
  ArticleStatus, ContentType, Difficulty, RelatedConcept, SourceItem, Roots, RelatedCTA,
} from "@/types/content";

export type EntryRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  content_type: string;
  author_id: string;
  author_name: string | null;
  main_term: string | null;
  thai_name: string | null;
  original_term: string | null;
  part_of_speech: string | null;
  language_root: string | null;
  ipa: string | null;
  short_description: string | null;
  subtitle: string | null;
  series: string | null;
  volume: string | null;
  aliases: string[] | null;
  born_year: string | null;
  died_year: string | null;
  nationality: string | null;
  key_ideas: string[] | null;
  notable_works: string[] | null;
  publication_year: string | null;
  publisher: string | null;
  isbn: string | null;
  founder: string | null;
  period: string | null;
  framework: string | null;
  main_thinkers: string[] | null;
  school: string | null;
  difficulty: string | null;
  tags: string[] | null;
  visual_explanation: string | null;
  technical_meaning: string | null;
  real_world_examples: string | null;
  body_markdown: string | null;
  roots: Roots | null;
  related_concepts: RelatedConcept[] | null;
  source_refs: SourceItem[] | null;
  related_cta: RelatedCTA | null;
  cover_image: string | null;
  r2_content_key: string | null;
  r2_content_url: string | null;
  row_id: string | null;
  row_i: number | null;
  row_code: string | null;
  row_name: string | null;
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
};

function buildBase(r: EntryRow) {
  return {
    id: r.id, title: r.title, slug: r.slug,
    status: r.status as ArticleStatus,
    author: r.author_name ?? undefined,
    publishedAt: r.published_at ?? undefined,
    updatedAt: r.updated_at ?? undefined,
    tags: r.tags ?? undefined,
    relatedConcepts: r.related_concepts ?? [],
    references: r.source_refs ?? [],
    relatedCTA: r.related_cta ?? undefined,
    bodyMarkdown: r.body_markdown ?? undefined,
    coverImage: r.cover_image ?? undefined,
    r2ContentKey: r.r2_content_key ?? undefined,
    r2ContentUrl: r.r2_content_url ?? undefined,
    rowId: r.row_id ?? undefined, rowI: r.row_i ?? undefined,
    rowCode: r.row_code ?? undefined, rowName: r.row_name ?? undefined,
  };
}

export function rowToEntry(r: EntryRow): DiscriminatedEntry {
  const ct = r.content_type as ContentType;
  const base = buildBase(r);

  switch (ct) {
    case "concept":
      return {
        ...base,
        contentType: "concept",
        mainTerm: r.main_term ?? "",
        thaiName: r.thai_name ?? "",
        originalTerm: r.original_term ?? undefined,
        partOfSpeech: r.part_of_speech ?? undefined,
        languageRoot: r.language_root ?? undefined,
        ipa: r.ipa ?? undefined,
        shortDescription: r.short_description ?? "",
        framework: r.framework ?? undefined,
        mainThinkers: r.main_thinkers ?? undefined,
        school: r.school ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
        subtitle: r.subtitle ?? undefined,
        series: r.series ?? undefined,
        volume: r.volume ?? undefined,
        aliases: r.aliases ?? undefined,
        visualExplanation: r.visual_explanation ?? undefined,
        technicalMeaning: r.technical_meaning ?? undefined,
        realWorldExamples: r.real_world_examples ?? undefined,
        roots: r.roots ?? undefined,
      };
    case "person":
      return {
        ...base,
        contentType: "person",
        mainTerm: r.main_term ?? "",
        thaiName: r.thai_name ?? undefined,
        bornYear: r.born_year ?? undefined,
        diedYear: r.died_year ?? undefined,
        nationality: r.nationality ?? undefined,
        keyIdeas: r.key_ideas ?? undefined,
        notableWorks: r.notable_works ?? undefined,
        framework: r.framework ?? undefined,
        mainThinkers: r.main_thinkers ?? undefined,
        school: r.school ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
        shortDescription: r.short_description ?? undefined,
        visualExplanation: r.visual_explanation ?? undefined,
        technicalMeaning: r.technical_meaning ?? undefined,
      };
    case "book":
      return {
        ...base,
        contentType: "book",
        mainTerm: r.main_term ?? undefined,
        thaiName: r.thai_name ?? undefined,
        publicationYear: r.publication_year ?? undefined,
        publisher: r.publisher ?? undefined,
        isbn: r.isbn ?? undefined,
        framework: r.framework ?? undefined,
        mainThinkers: r.main_thinkers ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
        shortDescription: r.short_description ?? undefined,
        author: (r.author_name && ct === "book") ? r.author_name : undefined,
      };
    case "school":
      return {
        ...base,
        contentType: "school",
        mainTerm: r.main_term ?? undefined,
        thaiName: r.thai_name ?? undefined,
        founder: r.founder ?? undefined,
        period: r.period ?? undefined,
        keyIdeas: r.key_ideas ?? undefined,
        framework: r.framework ?? undefined,
        school: r.school ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
        shortDescription: r.short_description ?? undefined,
      };
    case "article":
      return {
        ...base,
        contentType: "article",
        subtitle: r.subtitle ?? undefined,
        series: r.series ?? undefined,
        volume: r.volume ?? undefined,
        framework: r.framework ?? undefined,
        mainThinkers: r.main_thinkers ?? undefined,
        school: r.school ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
        shortDescription: r.short_description ?? undefined,
        visualExplanation: r.visual_explanation ?? undefined,
        technicalMeaning: r.technical_meaning ?? undefined,
      };
    case "symbol":
      return {
        ...base,
        contentType: "symbol",
        mainTerm: r.main_term ?? undefined,
        thaiName: r.thai_name ?? undefined,
        shortDescription: r.short_description ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
      };
    case "term":
      return {
        ...base,
        contentType: "term",
        mainTerm: r.main_term ?? "",
        thaiName: r.thai_name ?? undefined,
        originalTerm: r.original_term ?? undefined,
        languageRoot: r.language_root ?? undefined,
        partOfSpeech: r.part_of_speech ?? undefined,
        shortDescription: r.short_description ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
      };
    default:
      return {
        ...base,
        contentType: "article",
        shortDescription: r.short_description ?? undefined,
      } as DiscriminatedEntry;
  }
}
```

- [ ] **Step 2: Run lint + build**

```bash
npm run lint
npm run build
```
Expected: both PASS — `rowToEntry` now returns `DiscriminatedEntry`

- [ ] **Step 3: Commit**

```bash
git add src/lib/content/entry-mapper.ts
git commit -m "feat(mapper): rowToEntry returns discriminated union per contentType"
```

### Task 1.3: Update seed entries to use discriminated types

**Files:**
- Modify: `src/lib/content/entries.ts`

**Interfaces:**
- Consumes: `ConceptEntry`, `PersonEntry`, `ArticleEntry` etc. from `@/types/content`
- Produces: `entries: DiscriminatedEntry[]`, `allEntrySlugs()` unchanged

- [ ] **Step 1: Rewrite seed entries with type annotations**

Replace the flat `entries: ContentEntry[]` with discriminated entries. Each entry gets its correct type literal:

```ts
// src/lib/content/entries.ts — partial rewrite (example for first 2 entries)
import type { ConceptEntry, DiscriminatedEntry } from "@/types/content";

export const entries: DiscriminatedEntry[] = [
  {
    id: "concept-concept",
    title: "Psyche",
    slug: "concept",
    status: "published",
    contentType: "concept",
    author: "ARCHRON",
    publishedAt: "2026-06-24",
    updatedAt: "2026-06-28",
    mainTerm: "Psyche",
    thaiName: "ไซคี",
    originalTerm: "psukhē (Greek)",
    partOfSpeech: "noun",
    languageRoot: "Greek",
    ipa: "/ˈsaɪ.kiː/",
    shortDescription:
      "ระบบชีวิตทางจิตทั้งหมด ทั้งส่วนที่รู้ตัวและส่วนที่ยังทำงานอยู่ใต้ระดับการรู้ตัว",
    framework: "Analytical Psychology",
    mainThinkers: ["Carl Jung"],
    difficulty: "intermediate",
    tags: ["concept", "depth-psychology", "jung"],
    visualExplanation:
      "Psyche ไม่ได้หมายถึงจิตใจในความหมายแคบแบบความคิดประจำวัน...",
    technicalMeaning:
      "ในกรอบจิตวิทยาวิเคราะห์ Psyche หมายถึงระบบชีวิตทางจิตทั้งหมด...",
    relatedConcepts: [
      { conceptSlug: "ego", relationType: "part-of", reason: "Ego เป็นศูนย์กลางของจิตสำนึกภายใน Psyche" },
      { conceptSlug: "unconscious", relationType: "part-of", reason: "จิตไร้สำนึกเป็นส่วนสำคัญของ Psyche" },
      { conceptSlug: "self", relationType: "related", reason: "Self คือศูนย์รวมและภาพรวมของ Psyche" },
    ],
    references: [
      { sourceType: "primary-source", author: "C. G. Jung", title: "Collected Works", relatedClaim: "นิยาม Psyche" },
    ],
    roots: {
      etymology: "concept มาจากภาษากรีก psukhē...",
      meaningShift: "เมื่อเข้าสู่จิตวิทยาสมัยใหม่...",
      caution: "รากศัพท์ช่วยให้เห็นประวัติของคำ...",
    },
    relatedCTA: { conceptSlugs: ["ego", "unconscious", "self"], showConstellationMap: false },
  } satisfies ConceptEntry,
  // ... continue for all seed entries
];

export function allEntrySlugs(): string[] {
  return entries.map((e) => e.slug);
}
```

- [ ] **Step 2: Run lint + build**

```bash
npm run lint; if ($?) { npm run build }
```
Expected: both PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/content/entries.ts
git commit -m "feat(seeds): type seed entries as discriminated union"
```

### Task 1.4: Update `public-source.ts` to return discriminated types

**Files:**
- Modify: `src/lib/content/public-source.ts`

**Interfaces:**
- Consumes: `DiscriminatedEntry` from `@/types/content`, `rowToEntry` from `./entry-mapper`
- Produces: `getPublicEntryBySlug`, `getPublicEntries` return `DiscriminatedEntry` / `DiscriminatedEntry[]`

- [ ] **Step 1: Update return types in `public-source.ts`**

```ts
// src/lib/content/public-source.ts
// Change return type of getPublicEntryBySlug and getPublicEntries
import type { DiscriminatedEntry } from "@/types/content";

export async function getPublicEntryBySlug(slug: string): Promise<DiscriminatedEntry | null> {
  // ... (existing logic, rowToEntry now returns DiscriminatedEntry)
}

export async function getPublicEntries(opts?: { ... }): Promise<DiscriminatedEntry[]> {
  // ... (existing logic)
}
```

- [ ] **Step 2: Run lint + build**

```bash
npm run lint; if ($?) { npm run build }
```
Expected: both PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/content/public-source.ts
git commit -m "feat(public-source): return discriminated union types"
```

### Task 1.5: Update `draft-mapper.ts` with per-type draft support

**Files:**
- Modify: `src/lib/content/publish-validation.ts`
- Modify: `src/lib/content/draft-mapper.ts`

**Interfaces:**
- Consumes: `DiscriminatedEntry`, `ConceptEntry`, `PersonEntry` from `@/types/content`
- Produces: `EditorDraft` with type-specific fields, `draftToRow` handles per-type mapping, `entryToDraft` handles per-type

- [ ] **Step 1: Add type-specific fields to `EditorDraft` in `publish-validation.ts`**

```ts
// src/lib/content/publish-validation.ts — extend EditorDraft
export type EditorDraft = {
  id: string;
  title: string;
  slug: string;
  status: string;
  contentType: string;

  // Common fields
  framework: string;
  difficulty: string;
  tags: string[];
  bodyMarkdown: string;
  relatedConcepts: EditorRelatedConcept[];
  references: EditorReference[];
  coverImage: string;
  shortDescription: string;
  school: string;
  rowName: string;
  rowCode: string;

  // Concept-specific
  mainTerm: string;
  thaiName: string;
  originalTerm: string;
  partOfSpeech: string;
  languageRoot: string;
  ipa: string;
  visualExplanation: string;
  technicalMeaning: string;
  rootsEtymology: string;
  rootsMeaningShift: string;
  rootsCaution: string;

  // Person-specific
  mainThinker: string;
  bornYear: string;
  diedYear: string;
  nationality: string;
  keyIdeas: string;
  notableWorks: string;

  // Book-specific
  publicationYear: string;
  publisher: string;
  isbn: string;

  // School-specific
  founder: string;
  period: string;
};
```

- [ ] **Step 2: Update `EMPTY_DRAFT` in `publish-validation.ts` with new fields**

```ts
export const EMPTY_DRAFT: EditorDraft = {
  id: "", title: "", slug: "", status: "draft", contentType: "article",
  framework: "", difficulty: "beginner", tags: [], bodyMarkdown: "",
  relatedConcepts: [], references: [], coverImage: "", shortDescription: "",
  school: "", rowName: "", rowCode: "",
  mainTerm: "", thaiName: "", originalTerm: "", partOfSpeech: "",
  languageRoot: "", ipa: "", visualExplanation: "", technicalMeaning: "",
  rootsEtymology: "", rootsMeaningShift: "", rootsCaution: "",
  mainThinker: "", bornYear: "", diedYear: "", nationality: "",
  keyIdeas: "", notableWorks: "",
  publicationYear: "", publisher: "", isbn: "",
  founder: "", period: "",
};
```

- [ ] **Step 3: Update `draftToRow` in `draft-mapper.ts` to include all new fields**

```ts
// src/lib/content/draft-mapper.ts — update draftToRow return
return {
  id: d.id || undefined,
  slug: d.slug, title: d.title,
  author_id: authorId, author_name: authorName ?? null,
  status: d.status, content_type: d.contentType,
  framework: d.framework || null,
  difficulty: d.difficulty || null,
  tags: d.tags.length > 0 ? d.tags : null,
  body_markdown: d.bodyMarkdown || null,
  related_concepts: d.relatedConcepts as unknown as EntryRow["related_concepts"],
  source_refs: d.references as unknown as EntryRow["source_refs"],
  roots: roots as EntryRow["roots"],
  cover_image: d.coverImage || null,
  short_description: d.shortDescription || null,
  school: d.school || null,
  row_name: d.rowName || null,
  // New fields
  main_term: d.mainTerm || null,
  thai_name: d.thaiName || null,
  original_term: d.originalTerm || null,
  part_of_speech: d.partOfSpeech || null,
  language_root: d.languageRoot || null,
  ipa: d.ipa || null,
  visual_explanation: d.visualExplanation || null,
  technical_meaning: d.technicalMeaning || null,
  main_thinkers: d.mainThinker ? [d.mainThinker] : null,
  born_year: d.bornYear || null,
  died_year: d.diedYear || null,
  nationality: d.nationality || null,
  key_ideas: d.keyIdeas ? [d.keyIdeas] : null,
  notable_works: d.notableWorks ? [d.notableWorks] : null,
  publication_year: d.publicationYear || null,
  publisher: d.publisher || null,
  isbn: d.isbn || null,
  founder: d.founder || null,
  period: d.period || null,
};
```

- [ ] **Step 4: Update `entryToDraft` in `draft-mapper.ts` for full field mapping**

```ts
// src/lib/content/draft-mapper.ts — update entryToDraft
export function entryToDraft(entry: DiscriminatedEntry): EditorDraft {
  const base = {
    id: entry.id ?? "", title: entry.title ?? "", slug: entry.slug ?? "",
    status: entry.status ?? "draft", contentType: entry.contentType ?? "article",
    framework: entry.framework ?? "", school: entry.school ?? "",
    difficulty: entry.difficulty ?? "beginner",
    tags: entry.tags ?? [], bodyMarkdown: entry.bodyMarkdown ?? "",
    relatedConcepts: (entry.relatedConcepts ?? []).map((r) => ({
      conceptSlug: r.conceptSlug, relationType: r.relationType, reason: r.reason ?? "",
    })),
    references: (entry.references ?? []).map((r) => ({
      sourceType: r.sourceType, title: r.title, relatedClaim: r.relatedClaim ?? "",
    })),
    coverImage: entry.coverImage ?? "", shortDescription: entry.shortDescription ?? "",
    rowName: entry.rowName ?? "", rowCode: entry.rowCode ?? "",
  };

  if (entry.contentType === "concept") {
    return {
      ...base, mainTerm: entry.mainTerm, thaiName: entry.thaiName,
      originalTerm: entry.originalTerm ?? "",
      partOfSpeech: entry.partOfSpeech ?? "", languageRoot: entry.languageRoot ?? "",
      ipa: entry.ipa ?? "",
      visualExplanation: entry.visualExplanation ?? "",
      technicalMeaning: entry.technicalMeaning ?? "",
      rootsEtymology: entry.roots?.etymology ?? "",
      rootsMeaningShift: entry.roots?.meaningShift ?? "",
      rootsCaution: entry.roots?.caution ?? "",
      mainThinker: entry.mainThinkers?.[0] ?? "",
      bornYear: "", diedYear: "", nationality: "",
      keyIdeas: "", notableWorks: "",
      publicationYear: "", publisher: "", isbn: "",
      founder: "", period: "",
    };
  }
  if (entry.contentType === "person") {
    return {
      ...base, mainTerm: entry.mainTerm,
      thaiName: entry.thaiName ?? "",
      mainThinker: entry.mainTerm,
      bornYear: entry.bornYear ?? "", diedYear: entry.diedYear ?? "",
      nationality: entry.nationality ?? "",
      keyIdeas: entry.keyIdeas?.join(", ") ?? "",
      notableWorks: entry.notableWorks?.join(", ") ?? "",
      originalTerm: "", partOfSpeech: "", languageRoot: "", ipa: "",
      visualExplanation: entry.visualExplanation ?? "",
      technicalMeaning: entry.technicalMeaning ?? "",
      rootsEtymology: "", rootsMeaningShift: "", rootsCaution: "",
      publicationYear: "", publisher: "", isbn: "",
      founder: "", period: "",
    };
  }
  // ... similar for book, school, article, etc.
  return {
    ...base, mainTerm: "", thaiName: "", originalTerm: "", partOfSpeech: "",
    languageRoot: "", ipa: "", visualExplanation: "", technicalMeaning: "",
    rootsEtymology: "", rootsMeaningShift: "", rootsCaution: "",
    mainThinker: "", bornYear: "", diedYear: "", nationality: "",
    keyIdeas: "", notableWorks: "",
    publicationYear: "", publisher: "", isbn: "",
    founder: "", period: "",
  };
}
```

- [ ] **Step 5: Run lint + build**

```bash
npm run lint; if ($?) { npm run build }
```
Expected: both PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/content/publish-validation.ts src/lib/content/draft-mapper.ts
git commit -m "feat(draft): add per-type fields to EditorDraft + full mapper support"
```

### Task 1.6: Migrate all page consumers to use discriminated types

**Files:**
- Modify: `src/components/reading/reading-page.tsx`
- Modify: `src/app/articles/[slug]/page.tsx`
- Modify: `src/app/concepts/[slug]/page.tsx`
- Modify: `src/app/books/[slug]/page.tsx`
- Modify: `src/app/schools/[slug]/page.tsx`
- Modify: `src/app/thinkers/[slug]/page.tsx`
- Modify: `src/app/themes/[slug]/page.tsx`
- Modify: `src/app/reading-sets/[slug]/page.tsx`
- Modify: `src/app/search/page.tsx` (and search-client)
- Modify: `src/components/content-card.tsx`
- Modify: `src/app/constellation/page.tsx`
- Modify: All list pages that iterate entries

**Interfaces:**
- Every consumer that used `ContentEntry` now uses `DiscriminatedEntry` with type narrowing

- [ ] **Step 1: Update `ReadingPage` component**

Replace all `ContentEntry` with `DiscriminatedEntry`. Where type-specific fields are accessed, use type narrowing:

```tsx
// src/components/reading/reading-page.tsx — add type import
import type { DiscriminatedEntry, isConcept, isPerson } from "@/types/content";

export function ReadingPage({ entry, section, atmosphere }: {
  entry: DiscriminatedEntry;
  section: "articles" | "concepts" | "books";
  atmosphere?: string;
}) {
  // Use type guards instead of checking entry.contentType === "..."
  const mainTerm = isConcept(entry) ? entry.mainTerm : undefined;
  const thaiName = (isConcept(entry) || isPerson(entry)) ? entry.thaiName : undefined;
  // ... etc
}
```

- [ ] **Step 2: Update all `[slug]/page.tsx` files — change import and type annotation**

```tsx
// src/app/articles/[slug]/page.tsx
import type { DiscriminatedEntry } from "@/types/content";
// ... rest same, getPublicEntryBySlug now returns DiscriminatedEntry | null
```

- [ ] **Step 3: Update all list pages — change iteration type**

```tsx
// Example: components that render ContentCard with entry
import type { DiscriminatedEntry } from "@/types/content";
// Replace ContentEntry[] with DiscriminatedEntry[]
```

- [ ] **Step 4: Run lint + build**

```bash
npm run lint; if ($?) { npm run build }
```
Expected: both PASS. Fix any type errors from migrated consumers.

- [ ] **Step 5: Commit**

```bash
git add src/components/reading/reading-page.tsx src/app/articles/ src/app/concepts/ src/app/books/ src/app/schools/ src/app/thinkers/ src/app/themes/ src/app/reading-sets/ src/app/search/ src/components/content-card.tsx src/app/constellation/
git commit -m "feat(pages): migrate all consumers to DiscriminatedEntry"
```

---

## Slice 2: Content Library Consolidation

### Task 2.1: Create new directory structure

**Files:**
- Create: `src/lib/content/core/`
- Create: `src/lib/content/publishing/`
- Create: `src/lib/content/reading/`
- Create: `src/lib/content/seo/`
- Create: `src/lib/content/community/`
- Create: `src/lib/content/utils/`
- Create: `src/lib/content/core/seeds/`

- [ ] **Step 1: Create directories**

```bash
New-Item -ItemType Directory -Force -Path "src\lib\content\core\seeds"
New-Item -ItemType Directory -Force -Path "src\lib\content\publishing"
New-Item -ItemType Directory -Force -Path "src\lib\content\reading"
New-Item -ItemType Directory -Force -Path "src\lib\content\seo"
New-Item -ItemType Directory -Force -Path "src\lib\content\community"
New-Item -ItemType Directory -Force -Path "src\lib\content\utils"
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/content/core/ src/lib/content/publishing/ src/lib/content/reading/ src/lib/content/seo/ src/lib/content/community/ src/lib/content/utils/
git commit -m "feat(lib): create content library module directories"
```

### Task 2.2: Move files into modules

**Files:**
- Move 43 files into target directories (no code changes — pure file moves with import path updates)

| Source | Target |
|---|---|
| `concept-registry.ts` | `core/registry.ts` |
| `entries.ts` | `core/seeds/entries.ts` |
| `schools.ts` | `core/seeds/schools.ts` |
| `disciplines.ts` | `core/seeds/disciplines.ts` |
| `reading-sets.ts` | `core/seeds/reading-sets.ts` |
| `themes.ts` | `core/seeds/themes.ts` |
| `theories.ts` | `core/seeds/theories.ts` |
| `cosmology.ts`, `ontology.ts`, `taxonomy.ts` | `core/cosmology.ts` (merge) |
| `entries-db.ts`, `entry-mapper.ts` | `publishing/entries-db.ts`, `publishing/entry-mapper.ts` |
| `draft-db.ts`, `draft-mapper.ts` | `publishing/draft-db.ts`, `publishing/draft-mapper.ts` |
| `public-source.ts` | `publishing/public-source.ts` |
| `publish-validation.ts` | `publishing/publish-validation.ts` |
| `internal-links.ts` | `publishing/internal-links.ts` |
| `related.ts`, `graph.ts` | `reading/related.ts`, `reading/graph.ts` |
| `recommendations.ts` | `reading/recommendations.ts` |
| `reading-db.ts`, `reading-actions.ts` | `reading/reading-db.ts`, `reading/reading-actions.ts` |
| `relationships.ts` | `reading/relationships.ts` |
| `metadata.ts` | `seo/metadata.ts` |
| `search-index.ts` (from `lib/rtk/search.ts` if applicable) | `seo/search-index.ts` |
| `seals.ts`, `achievements.ts`, `levels.ts` | `community/seals.ts`, `community/achievements.ts`, `community/levels.ts` |
| `profile-db.ts` | `community/profile-db.ts` |
| `comments-db.ts`, `comments-actions.ts` | `community/comments-db.ts`, `community/comments-actions.ts` |
| `views-db.ts` | `community/views-db.ts` |
| `roles.ts`, `server-auth.ts` | `utils/roles.ts`, `utils/server-auth.ts` |
| `assets.ts`, `colors.ts` | `utils/assets.ts`, `utils/colors.ts` |
| `translations.ts`, `sources.ts` | `utils/translations.ts`, `utils/sources.ts` |
| `faq.ts`, `timeline.ts` | `utils/faq.ts`, `utils/timeline.ts` |
| `external-links.ts` | `utils/external-links.ts` |
| `prompt-library.ts` | `utils/prompt-library.ts` |
| `import-schools.ts` | `utils/import-schools.ts` |

- [ ] **Step 1: Move files using git mv to preserve history**

```bash
git mv src/lib/content/concept-registry.ts src/lib/content/core/registry.ts
git mv src/lib/content/entries.ts src/lib/content/core/seeds/entries.ts
git mv src/lib/content/schools.ts src/lib/content/core/seeds/schools.ts
# ... (all files from table above)
```

- [ ] **Step 2: Update all import paths across the codebase**

Search for `@/lib/content/<filename>` imports and update to new paths:

```bash
# Use grep to find all imports, then update:
rg "@/lib/content/entries" --files-with-matches | ForEach-Object { ... }
rg "@/lib/content/entry-mapper" --files-with-matches | ForEach-Object { ... }
# ... for all moved files
```

Update import statements from:
```ts
import { entries } from "@/lib/content/entries";
import { rowToEntry } from "@/lib/content/entry-mapper";
```
to:
```ts
import { entries } from "@/lib/content/core/seeds/entries";
import { rowToEntry } from "@/lib/content/publishing/entry-mapper";
```

- [ ] **Step 3: Create barrel `index.ts` files in each module**

```ts
// src/lib/content/core/index.ts
export * from "./registry";
export * from "./cosmology";

// src/lib/content/publishing/index.ts
export * from "./entries-db";
export * from "./entry-mapper";
export * from "./draft-db";
export * from "./draft-mapper";
export * from "./public-source";
export * from "./publish-validation";
export * from "./internal-links";

// src/lib/content/reading/index.ts
export * from "./related";
export * from "./graph";
export * from "./recommendations";
export * from "./reading-db";
export * from "./reading-actions";
export * from "./relationships";

// src/lib/content/seo/index.ts
export * from "./metadata";
export * from "./search-index";

// src/lib/content/community/index.ts
export * from "./seals";
export * from "./achievements";
export * from "./levels";
export * from "./profile-db";
export * from "./comments-db";
export * from "./comments-actions";
export * from "./views-db";

// src/lib/content/utils/index.ts
export * from "./roles";
export * from "./server-auth";
export * from "./assets";
export * from "./colors";
export * from "./translations";
export * from "./sources";
export * from "./faq";
export * from "./timeline";
export * from "./external-links";
export * from "./prompt-library";
export * from "./import-schools";
```

- [ ] **Step 4: Merge `cosmology.ts`, `ontology.ts`, `taxonomy.ts` into `core/cosmology.ts`**

Read the content of all 3 files, merge into single file, deduplicate overlapping definitions.

- [ ] **Step 5: Run lint + build**

```bash
npm run lint; if ($?) { npm run build }
```
Expected: both PASS. Fix any broken imports.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor(lib): consolidate 43 content files into 6 modules"
```

---

## Slice 3: Studio Editor Decomposition

### Task 3.1: Create editor state machine hook

**Files:**
- Create: `src/features/editor/hooks/useEditorMachine.ts`
- Create: `src/features/editor/hooks/index.ts`

**Interfaces:**
- Produces: `EditorMachineState`, `EditorAction`, `editorReducer`, `useEditorMachine()` hook
- Produces: types for downstream components to consume

- [ ] **Step 1: Write the reducer and hook**

```ts
// src/features/editor/hooks/useEditorMachine.ts
"use client";

import { useReducer, useCallback } from "react";
import type { EditorDraft, EditorReference } from "@/lib/content/publishing/publish-validation";

export type EditorMode = "dashboard" | "editing" | "preview";
export type AutoSaveState = "idle" | "saving" | "saved";

export interface EditorMachineState {
  mode: EditorMode;
  draft: EditorDraft;
  entryId: string | null;
  savedAt: string | null;
  autoState: AutoSaveState;
  feedback: EditorFeedbackData | null;
  publishTried: boolean;
  publishing: boolean;
  loadingDraft: boolean;
  displayName: string | null;
  activeSection: string;
  originalAuthorId: string | null;
  originalAuthorName: string | null;

  // Dashboard
  showDashboard: boolean;
  entries: EntryItem[];
  drafts: DraftItem[];
  loadingEntries: boolean;
  typeFilter: string;
}

export type EditorAction =
  | { type: "SET_MODE"; payload: EditorMode }
  | { type: "LOAD_DRAFT"; draft: EditorDraft; entryId?: string | null }
  | { type: "UPDATE_FIELD"; field: keyof EditorDraft; value: unknown }
  | { type: "AUTO_SAVE_START" }
  | { type: "AUTO_SAVE_DONE" }
  | { type: "SET_FEEDBACK"; feedback: EditorFeedbackData | null }
  | { type: "PUBLISH_TRIED" }
  | { type: "PUBLISH_START" }
  | { type: "PUBLISH_DONE" }
  | { type: "SET_DISPLAY_NAME"; name: string | null }
  | { type: "SET_ACTIVE_SECTION"; section: string }
  | { type: "SET_ORIGINAL_AUTHOR"; id: string | null; name: string | null }
  | { type: "TOGGLE_DASHBOARD" }
  | { type: "SET_ENTRIES"; entries: EntryItem[] }
  | { type: "SET_DRAFTS"; drafts: DraftItem[] }
  | { type: "SET_LOADING_ENTRIES"; loading: boolean }
  | { type: "SET_TYPE_FILTER"; filter: string }
  | { type: "RESET" };

export interface EditorFeedbackData {
  missingFields: string[];
  deadLinks: string[];
  suggestions: string[];
}

interface EntryItem {
  id: string; slug: string; title: string; status: string;
  content_type: string; published_at: string | null; author_name?: string | null;
}

interface DraftItem {
  id: string; slug: string; title: string; status: string;
  updated_at: string | null;
}

function initialEditorState(draft: EditorDraft): EditorMachineState {
  return {
    mode: "dashboard",
    draft,
    entryId: null, savedAt: null, autoState: "idle",
    feedback: null, publishTried: false, publishing: false,
    loadingDraft: false, displayName: null, activeSection: "basic",
    originalAuthorId: null, originalAuthorName: null,
    showDashboard: true,
    entries: [], drafts: [], loadingEntries: true, typeFilter: "all",
  };
}

function editorReducer(state: EditorMachineState, action: EditorAction): EditorMachineState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "LOAD_DRAFT":
      return {
        ...state,
        draft: action.draft,
        entryId: action.entryId ?? state.entryId,
        mode: "editing",
        loadingDraft: false,
      };
    case "UPDATE_FIELD":
      return { ...state, draft: { ...state.draft, [action.field]: action.value } };
    case "AUTO_SAVE_START":
      return { ...state, autoState: "saving" };
    case "AUTO_SAVE_DONE":
      return { ...state, autoState: "saved", savedAt: new Date().toISOString() };
    case "SET_FEEDBACK":
      return { ...state, feedback: action.feedback };
    case "PUBLISH_TRIED":
      return { ...state, publishTried: true };
    case "PUBLISH_START":
      return { ...state, publishing: true };
    case "PUBLISH_DONE":
      return { ...state, publishing: false, publishTried: false };
    case "SET_DISPLAY_NAME":
      return { ...state, displayName: action.name };
    case "SET_ACTIVE_SECTION":
      return { ...state, activeSection: action.section };
    case "TOGGLE_DASHBOARD":
      return { ...state, showDashboard: !state.showDashboard };
    case "SET_ENTRIES":
      return { ...state, entries: action.entries, loadingEntries: false };
    case "SET_DRAFTS":
      return { ...state, drafts: action.drafts };
    case "SET_LOADING_ENTRIES":
      return { ...state, loadingEntries: action.loading };
    case "SET_TYPE_FILTER":
      return { ...state, typeFilter: action.filter };
    case "SET_ORIGINAL_AUTHOR":
      return { ...state, originalAuthorId: action.id, originalAuthorName: action.name };
    case "RESET":
      return initialEditorState(state.draft);
    default:
      return state;
  }
}

export function useEditorMachine(initialDraft: EditorDraft) {
  const [state, dispatch] = useReducer(editorReducer, initialDraft, initialEditorState);

  const updateField = useCallback(
    (field: keyof EditorDraft, value: unknown) => dispatch({ type: "UPDATE_FIELD", field, value }),
    [],
  );

  return { state, dispatch, updateField };
}
```

- [ ] **Step 2: Run lint to verify**

```bash
npm run lint
```
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/features/editor/hooks/
git commit -m "feat(editor): add useEditorMachine state reducer hook"
```

### Task 3.2: Create per-section editor components

**Files:**
- Create: `src/components/studio/editor/editor-dashboard.tsx`
- Create: `src/components/studio/editor/editor-basic-info.tsx`
- Create: `src/components/studio/editor/editor-concept-fields.tsx`
- Create: `src/components/studio/editor/editor-person-fields.tsx`
- Create: `src/components/studio/editor/editor-book-fields.tsx`
- Create: `src/components/studio/editor/editor-school-fields.tsx`
- Create: `src/components/studio/editor/editor-body.tsx`
- Create: `src/components/studio/editor/editor-relations.tsx`
- Create: `src/components/studio/editor/editor-cta.tsx`
- Create: `src/components/studio/editor/editor-publish-panel.tsx`
- Create: `src/components/studio/editor/index.ts`

**Interfaces:**
- Each component receives sliced state (only the fields it needs) + `updateField` callback
- Produces: focused UI components for each section

- [ ] **Step 1: Create `editor-basic-info.tsx`**

```tsx
// src/components/studio/editor/editor-basic-info.tsx
"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import { slugify } from "@/lib/content/publishing/publish-validation";

export function EditorBasicInfo({
  draft, updateField, canSave,
}: {
  draft: EditorDraft;
  updateField: (field: keyof EditorDraft, value: unknown) => void;
  canSave: boolean;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-arch-text-body">Title</label>
        <input
          type="text"
          value={draft.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="mt-1 w-full rounded-lg border border-arch-border px-3 py-2 bg-white"
          placeholder="ชื่อบทความ / แนวคิด..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-arch-text-body">Slug</label>
        <input
          type="text"
          value={draft.slug}
          onChange={(e) => updateField("slug", slugify(e.target.value))}
          className="mt-1 w-full rounded-lg border border-arch-border px-3 py-2 bg-white"
          placeholder="article-slug"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-arch-text-body">Content Type</label>
          <select
            value={draft.contentType}
            onChange={(e) => updateField("contentType", e.target.value)}
            className="mt-1 w-full rounded-lg border border-arch-border px-3 py-2 bg-white"
          >
            <option value="article">Article</option>
            <option value="concept">Concept</option>
            <option value="person">Person</option>
            <option value="book">Book</option>
            <option value="school">School</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-arch-text-body">Status</label>
          <select
            value={draft.status}
            onChange={(e) => updateField("status", e.target.value)}
            className="mt-1 w-full rounded-lg border border-arch-border px-3 py-2 bg-white"
          >
            <option value="draft">Draft</option>
            <option value="needs-source-check">Needs Source Check</option>
            <option value="ready-to-publish">Ready to Publish</option>
          </select>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create remaining section components**

Create `editor-concept-fields.tsx`, `editor-person-fields.tsx`, `editor-book-fields.tsx`, `editor-school-fields.tsx`, `editor-body.tsx`, `editor-relations.tsx`, `editor-cta.tsx`, `editor-publish-panel.tsx`, `editor-dashboard.tsx` following the same pattern — each receives only the fields it needs.

- [ ] **Step 3: Create barrel export**

```ts
// src/components/studio/editor/index.ts
export { EditorBasicInfo } from "./editor-basic-info";
export { EditorConceptFields } from "./editor-concept-fields";
export { EditorPersonFields } from "./editor-person-fields";
export { EditorBookFields } from "./editor-book-fields";
export { EditorSchoolFields } from "./editor-school-fields";
export { EditorBody } from "./editor-body";
export { EditorRelations } from "./editor-relations";
export { EditorCta } from "./editor-cta";
export { EditorPublishPanel } from "./editor-publish-panel";
export { EditorDashboard } from "./editor-dashboard";
```

- [ ] **Step 4: Run lint**

```bash
npm run lint
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/studio/editor/
git commit -m "feat(editor): add per-section editor form components"
```

### Task 3.3: Rewrite editor page.tsx as thin orchestrator

**Files:**
- Modify: `src/app/studio/editor/page.tsx`

**Interfaces:**
- Consumes: `useEditorMachine` from `@/features/editor/hooks/useEditorMachine`
- Consumes: all section components from `@/components/studio/editor`

- [ ] **Step 1: Rewrite `page.tsx`**

```tsx
// src/app/studio/editor/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { roleFromMetadata, canWrite } from "@/lib/content/utils/roles";
import { EMPTY_DRAFT, getPublishChecklist, canPublish, type EditorReference } from "@/lib/content/publishing/publish-validation";
import { saveDraftAction, saveDraftWithRevisionAction, loadDraftAction, publishAction } from "@/features/editor/actions";
import { findDeadLinks } from "@/lib/content/publishing/internal-links";
import { EditorHeader } from "@/components/studio/editor-header";
import { EditorFeedback } from "@/components/studio/editor-feedback";
import { EditorIcon } from "@/components/studio/editor-icon";
import { useEditorMachine } from "@/features/editor/hooks/useEditorMachine";
import {
  EditorDashboard, EditorBasicInfo, EditorConceptFields,
  EditorPersonFields, EditorBookFields, EditorSchoolFields,
  EditorBody, EditorRelations, EditorCta, EditorPublishPanel,
} from "@/components/studio/editor";

export default function StudioEditorPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch, updateField } = useEditorMachine(EMPTY_DRAFT);
  const { draft, mode } = state;

  const role = roleFromMetadata(user?.publicMetadata);
  const canSave = draft.slug.trim() !== "" && draft.title.trim() !== "";
  const ct = draft.contentType;

  // Load entries/drafts on mount
  useEffect(() => { /* ... load entries, drafts ... */ }, [userId]);
  // Load draft from ?slug= param
  useEffect(() => { /* ... load specific draft ... */ }, [searchParams]);
  // Auto-save
  useEffect(() => { /* ... debounced auto-save ... */ }, [draft]);

  if (!userId) return <EditorIcon />;
  if (!canWrite(role)) return <EditorIcon message="คุณไม่มีสิทธิ์เขียนเนื้อหา" />;

  if (mode === "dashboard") {
    return (
      <EditorDashboard
        entries={state.entries}
        drafts={state.drafts}
        loading={state.loadingEntries}
        typeFilter={state.typeFilter}
        onNewDraft={() => { dispatch({ type: "RESET" }); dispatch({ type: "SET_MODE", payload: "editing" }); }}
        onLoadEntry={(slug) => { /* load entry by slug */ }}
        onTypeFilterChange={(f) => dispatch({ type: "SET_TYPE_FILTER", payload: f })}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <EditorHeader
        title={draft.title}
        autoState={state.autoState}
        savedAt={state.savedAt}
        preview={mode === "preview"}
        onTogglePreview={() => dispatch({ type: "SET_MODE", payload: mode === "preview" ? "editing" : "preview" })}
        onBackToDashboard={() => dispatch({ type: "SET_MODE", payload: "dashboard" })}
      />

      <EditorBasicInfo draft={draft} updateField={updateField} canSave={canSave} />

      {ct === "concept" && <EditorConceptFields draft={draft} updateField={updateField} />}
      {ct === "person" && <EditorPersonFields draft={draft} updateField={updateField} />}
      {ct === "book" && <EditorBookFields draft={draft} updateField={updateField} />}
      {ct === "school" && <EditorSchoolFields draft={draft} updateField={updateField} />}

      <EditorBody draft={draft} updateField={updateField} preview={mode === "preview"} />
      <EditorRelations draft={draft} updateField={updateField} />
      <EditorCta draft={draft} updateField={updateField} />

      <EditorPublishPanel
        checklist={getPublishChecklist(draft)}
        canPublish={canPublish(getPublishChecklist(draft))}
        publishTried={state.publishTried}
        publishing={state.publishing}
        onPublish={() => { /* publish logic */ }}
      />

      {state.feedback && <EditorFeedback feedback={state.feedback} />}
    </div>
  );
}
```

- [ ] **Step 2: Run lint + build**

```bash
npm run lint; if ($?) { npm run build }
```
Expected: both PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/studio/editor/page.tsx
git commit -m "refactor(editor): decompose 466-line page into thin orchestrator"
```

---

## Slice 4: SEO Pipeline

### Task 4.1: Create unified metadata generator

**Files:**
- Create: `src/lib/content/seo/metadata.ts`

**Interfaces:**
- Consumes: `DiscriminatedEntry`, `isConcept`, `isPerson`, etc. from `@/types/content`
- Produces: `generatePageMetadata(entry: DiscriminatedEntry): Metadata`

- [ ] **Step 1: Write metadata generator**

```ts
// src/lib/content/seo/metadata.ts
import type { Metadata } from "next";
import type { DiscriminatedEntry } from "@/types/content";
import { isConcept, isPerson, isBook, isSchool } from "@/types/content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://archron.org";
const SITE_NAME = "ARCHRON — คลังความรู้ภาษาไทยเรื่องจิตใจมนุษย์";

function descriptionFor(entry: DiscriminatedEntry): string {
  if (isConcept(entry)) return entry.shortDescription;
  if (isPerson(entry)) return entry.shortDescription ?? `${entry.mainTerm} — นักคิดในคลัง ARCHRON`;
  if (isBook(entry)) return entry.shortDescription ?? `${entry.title} — หนังสือในคลัง ARCHRON`;
  if (isSchool(entry)) return entry.shortDescription ?? `สำนักคิด ${entry.title} — ARCHRON`;
  return `"${entry.title}" ในคลังความรู้ภาษาไทยเรื่องจิตใจมนุษย์ — ARCHRON`;
}

function ogTypeFor(entry: DiscriminatedEntry): string {
  if (isBook(entry)) return "book";
  return "article";
}

function slugFor(entry: DiscriminatedEntry): string {
  const type = entry.contentType;
  if (type === "reading-set") return `reading-sets/${entry.slug}`;
  if (type === "source-note") return `sources/${entry.slug}`;
  return `${type}s/${entry.slug}`;
}

export function generatePageMetadata(entry: DiscriminatedEntry): Metadata {
  const title = `${entry.title} — ARCHRON`;
  const description = descriptionFor(entry);
  const slug = slugFor(entry);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: ogTypeFor(entry) as "article" | "book",
      siteName: SITE_NAME,
      locale: "th_TH",
      images: [{ url: `${BASE_URL}/api/og?title=${encodeURIComponent(entry.title)}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/api/og?title=${encodeURIComponent(entry.title)}`],
    },
    alternates: { canonical: `${BASE_URL}/${slug}` },
  };
}
```

- [ ] **Step 2: Run lint**

```bash
npm run lint
```
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/content/seo/metadata.ts
git commit -m "feat(seo): add unified metadata generator with OG/Twitter/canonical"
```

### Task 4.2: Create JSON-LD structured data generators

**Files:**
- Create: `src/lib/content/seo/structured-data.ts`

**Interfaces:**
- Produces: `articleLd()`, `conceptLd()`, `personLd()`, `bookLd()`, `schoolLd()`, `breadcrumbLd()`, `organizationLd()`

- [ ] **Step 1: Write structured data generators**

```ts
// src/lib/content/seo/structured-data.ts
import type { DiscriminatedEntry, PersonEntry, BookEntry, SchoolEntry } from "@/types/content";
import { isConcept, isPerson, isBook, isSchool } from "@/types/content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://archron.org";

interface BreadcrumbItem { name: string; href: string; }

export function breadcrumbLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ARCHRON",
    url: BASE_URL,
    description: "คลังความรู้ภาษาไทยเรื่องจิตใจมนุษย์",
    inLanguage: "th",
  };
}

export function articleLd(entry: DiscriminatedEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: isConcept(entry) ? entry.shortDescription : undefined,
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt,
    author: entry.author ? { "@type": "Person", name: entry.author } : undefined,
    inLanguage: "th",
    isAccessibleForFree: true,
  };
}

export function personLd(entry: PersonEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: entry.mainTerm,
    alternateName: entry.thaiName,
    birthDate: entry.bornYear,
    deathDate: entry.diedYear,
    nationality: entry.nationality,
    knowsAbout: entry.keyIdeas,
  };
}

export function bookLd(entry: BookEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: entry.title,
    author: entry.author ? { "@type": "Person", name: entry.author } : undefined,
    isbn: entry.isbn,
    publisher: entry.publisher,
    datePublished: entry.publicationYear,
    inLanguage: "th",
  };
}

export function schoolLd(entry: SchoolEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: entry.title,
    alternateName: entry.thaiName,
    foundingDate: entry.period,
    founder: entry.founder ? { "@type": "Person", name: entry.founder } : undefined,
  };
}
```

- [ ] **Step 2: Run lint**

```bash
npm run lint
```
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/content/seo/structured-data.ts
git commit -m "feat(seo): add JSON-LD structured data generators"
```

### Task 4.3: Add generateMetadata + JSON-LD to all dynamic pages

**Files:**
- Modify: `src/app/articles/[slug]/page.tsx`
- Modify: `src/app/concepts/[slug]/page.tsx`
- Modify: `src/app/books/[slug]/page.tsx`
- Modify: `src/app/schools/[slug]/page.tsx`
- Modify: `src/app/thinkers/[slug]/page.tsx`
- Modify: `src/app/themes/[slug]/page.tsx`
- Modify: `src/app/reading-sets/[slug]/page.tsx`

**Interfaces:**
- Each `[slug]/page.tsx` imports `generatePageMetadata` and `*Ld`; adds `<script type="application/ld+json">`

- [ ] **Step 1: Update `articles/[slug]/page.tsx` as exemplar**

```tsx
// src/app/articles/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingPage } from "@/components/reading/reading-page";
import { allEntrySlugs } from "@/lib/content/core/seeds/entries";
import { getPublicEntryBySlug } from "@/lib/content/publishing/public-source";
import { generatePageMetadata } from "@/lib/content/seo/metadata";
import { articleLd, breadcrumbLd, organizationLd } from "@/lib/content/seo/structured-data";

export const dynamicParams = true;
export const revalidate = 300;

export function generateStaticParams() {
  return allEntrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (!entry) return { title: "ไม่พบหน้า — ARCHRON" };
  return generatePageMetadata(entry);
}

export default async function ArticleEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (!entry) notFound();

  const ldJson = {
    "@context": "https://schema.org",
    "@graph": [
      organizationLd(),
      breadcrumbLd([
        { name: "หน้าแรก", href: "/" },
        { name: "บทความ", href: "/articles" },
        { name: entry.title, href: `/articles/${entry.slug}` },
      ]),
      articleLd(entry),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
      <ReadingPage entry={entry} section="articles" atmosphere="atmo-magazine" />
    </>
  );
}
```

- [ ] **Step 2: Apply same pattern to all 7 `[slug]/page.tsx` files**

Each page uses the corresponding `*Ld` function based on its contentType.

- [ ] **Step 3: Run lint + build**

```bash
npm run lint; if ($?) { npm run build }
```
Expected: both PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/articles/ src/app/concepts/ src/app/books/ src/app/schools/ src/app/thinkers/ src/app/themes/ src/app/reading-sets/
git commit -m "feat(seo): add generateMetadata + JSON-LD to all dynamic pages"
```

### Task 4.4: Complete sitemap with all routes

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Rewrite sitemap to include all content types**

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { conceptRegistry } from "@/lib/content/core/registry";
import { READING_SETS } from "@/lib/content/core/seeds/reading-sets";
import { SCHOOLS } from "@/lib/content/core/seeds/schools";
import { entries } from "@/lib/content/core/seeds/entries";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://archron.org";

  const staticRoutes = [
    { route: "", priority: 1.0, freq: "daily" as const },
    { route: "/articles", priority: 0.9, freq: "weekly" as const },
    { route: "/concepts", priority: 0.9, freq: "weekly" as const },
    { route: "/books", priority: 0.8, freq: "weekly" as const },
    { route: "/schools", priority: 0.8, freq: "weekly" as const },
    { route: "/thinkers", priority: 0.8, freq: "weekly" as const },
    { route: "/themes", priority: 0.8, freq: "weekly" as const },
    { route: "/disciplines", priority: 0.7, freq: "weekly" as const },
    { route: "/reading-sets", priority: 0.8, freq: "weekly" as const },
    { route: "/constellation", priority: 0.7, freq: "weekly" as const },
    { route: "/explore", priority: 0.7, freq: "weekly" as const },
    { route: "/discover", priority: 0.7, freq: "weekly" as const },
    { route: "/compare", priority: 0.6, freq: "monthly" as const },
    { route: "/search", priority: 0.6, freq: "monthly" as const },
    { route: "/sources", priority: 0.7, freq: "weekly" as const },
    { route: "/external-links", priority: 0.6, freq: "monthly" as const },
    { route: "/timeline", priority: 0.6, freq: "monthly" as const },
    { route: "/faq", priority: 0.5, freq: "monthly" as const },
    { route: "/guide", priority: 0.6, freq: "monthly" as const },
    { route: "/manifesto", priority: 0.5, freq: "monthly" as const },
    { route: "/support", priority: 0.4, freq: "monthly" as const },
    { route: "/knowledge", priority: 0.6, freq: "monthly" as const },
    { route: "/icons", priority: 0.1, freq: "monthly" as const },
    { route: "/profile", priority: 0.3, freq: "monthly" as const },
  ].map(({ route, priority, freq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));

  // Dynamic content: articles, concepts, books
  const entryRoutes = entries
    .filter((e) => e.status === "published")
    .map((e) => ({
      url: `${baseUrl}/${e.contentType === "reading-set" ? "reading-sets" : e.contentType === "source-note" ? "sources" : `${e.contentType}s`}/${e.slug}`,
      lastModified: new Date(e.updatedAt ?? e.publishedAt ?? ""),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const conceptRoutes = conceptRegistry.map((c) => ({
    url: `${baseUrl}/concepts/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const schoolRoutes = SCHOOLS.map((s) => ({
    url: `${baseUrl}/schools/${s.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const thinkerRoutes = SCHOOLS.flatMap((s) => s.thinkers ?? []).map((t: { nameEn: string }) => ({
    url: `${baseUrl}/thinkers/${t.nameEn.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const setRoutes = READING_SETS.map((r) => ({
    url: `${baseUrl}/reading-sets/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...entryRoutes, ...conceptRoutes, ...schoolRoutes, ...thinkerRoutes, ...setRoutes];
}
```

- [ ] **Step 2: Run lint + build**

```bash
npm run lint; if ($?) { npm run build }
```
Expected: both PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(seo): complete sitemap with all routes and content types"
```

### Task 4.5: Create OG image API route

**Files:**
- Create: `src/app/api/og/route.tsx`

- [ ] **Step 1: Write OG image route**

```tsx
// src/app/api/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-static";
export const revalidate = 86400; // 24h

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "ARCHRON";
  const decodedTitle = decodeURIComponent(title);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #1A1815 0%, #3A3835 100%)",
          fontFamily: "IBM Plex Sans Thai, Noto Serif Thai, serif",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 24, color: "#B89A63", marginBottom: 20, letterSpacing: 4 }}>
          ARCHRON
        </div>
        <div style={{ fontSize: 48, color: "#FAF8F5", textAlign: "center", lineHeight: 1.3, maxWidth: 900 }}>
          {decodedTitle}
        </div>
        <div style={{ fontSize: 20, color: "#8A8780", marginTop: 40 }}>
          คลังความรู้ภาษาไทยเรื่องจิตใจมนุษย์
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
```

- [ ] **Step 2: Run lint + build**

```bash
npm run lint; if ($?) { npm run build }
```
Expected: both PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/api/og/route.tsx
git commit -m "feat(seo): add OG image API route with ARCHRON branding"
```

---

## Slice 5: Data Flow Architecture

### Task 5.1: Create layered data access with caching

**Files:**
- Modify: `src/lib/content/publishing/public-source.ts`

**Interfaces:**
- Produces: unified `getPublicEntryBySlug`, `getPublicEntries` with cache → DB → seed fallback

- [ ] **Step 1: Add React cache + data cache to public-source**

```ts
// src/lib/content/publishing/public-source.ts
import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { DiscriminatedEntry, ContentType } from "@/types/content";
import { entries as seedEntries } from "@/lib/content/core/seeds/entries";
import { supabase } from "@/lib/supabase/server";
import { rowToEntry } from "./entry-mapper";
import type { EntryRow } from "./entry-mapper";

async function getEntryFromDb(slug: string): Promise<DiscriminatedEntry | null> {
  try {
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (!data) return null;
    return rowToEntry(data as EntryRow);
  } catch {
    return null;
  }
}

async function getEntriesFromDb(opts?: { contentType?: ContentType; limit?: number }): Promise<DiscriminatedEntry[]> {
  try {
    let query = supabase.from("entries").select("*").eq("status", "published");
    if (opts?.contentType) query = query.eq("content_type", opts.contentType);
    if (opts?.limit) query = query.limit(opts.limit);
    const { data } = await query.order("published_at", { ascending: false });
    return (data as EntryRow[] ?? []).map(rowToEntry);
  } catch {
    return [];
  }
}

// Per-request cache (deduplicates within a single render pass)
export const getPublicEntryBySlug = cache(
  unstable_cache(
    async (slug: string): Promise<DiscriminatedEntry | null> => {
      const dbEntry = await getEntryFromDb(slug);
      if (dbEntry) return dbEntry;
      return seedEntries.find((e) => e.slug === slug && e.status === "published") ?? null;
    },
    ["entry", "slug"],
    { revalidate: 300, tags: ["entries"] },
  ),
);

export const getPublicEntries = cache(
  unstable_cache(
    async (opts?: { contentType?: ContentType; limit?: number }): Promise<DiscriminatedEntry[]> => {
      const dbEntries = await getEntriesFromDb(opts);
      if (dbEntries.length > 0) return dbEntries;
      let filtered = seedEntries.filter((e) => e.status === "published");
      if (opts?.contentType) filtered = filtered.filter((e) => e.contentType === opts.contentType);
      if (opts?.limit) filtered = filtered.slice(0, opts.limit);
      return filtered;
    },
    ["entries", "list"],
    { revalidate: 300, tags: ["entries"] },
  ),
);

export async function revalidateEntry(slug: string) {
  // Revalidate cache tags on publish
  const { revalidateTag } = await import("next/cache");
  revalidateTag("entries");
}
```

- [ ] **Step 2: Run lint + build**

```bash
npm run lint; if ($?) { npm run build }
```
Expected: both PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/content/publishing/public-source.ts
git commit -m "feat(cache): add layered data access with React cache + unstable_cache"
```

### Task 5.2: Add Suspense + Error boundaries to all [slug] pages

**Files:**
- Modify: `src/app/articles/[slug]/page.tsx`
- Modify: `src/app/concepts/[slug]/page.tsx`
- Modify: `src/app/books/[slug]/page.tsx`
- Modify: `src/app/schools/[slug]/page.tsx`
- Modify: `src/app/thinkers/[slug]/page.tsx`
- Modify: `src/app/themes/[slug]/page.tsx`
- Modify: `src/app/reading-sets/[slug]/page.tsx`

- [ ] **Step 1: Add Suspense wrapper to `articles/[slug]/page.tsx`**

```tsx
// src/app/articles/[slug]/page.tsx — replace default export
import { Suspense } from "react";
import { ArticleSkeleton } from "@/components/skeleton";

// ... existing generateStaticParams, generateMetadata ...

export default function ArticleEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}

async function ArticleContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (!entry) notFound();
  // ... JSON-LD + ReadingPage as before ...
}
```

- [ ] **Step 2: Apply same pattern to all 7 [slug] pages**

- [ ] **Step 3: Run lint + build**

```bash
npm run lint; if ($?) { npm run build }
```
Expected: both PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/articles/ src/app/concepts/ src/app/books/ src/app/schools/ src/app/thinkers/ src/app/themes/ src/app/reading-sets/
git commit -m "feat(pages): add Suspense + error boundaries to all dynamic routes"
```

---

## Slice 6: Testing & Quality Gates

### Task 6.1: Add unit tests for core logic

**Files:**
- Create: `tests/unit/lib/content/publish-validation.test.ts`
- Create: `tests/unit/lib/content/entry-mapper.test.ts`
- Create: `tests/unit/lib/content/draft-mapper.test.ts`
- Create: `tests/unit/lib/content/internal-links.test.ts`
- Create: `tests/unit/features/editor/editor-reducer.test.ts`
- Create: `tests/unit/lib/content/seo/metadata.test.ts`
- Create: `tests/unit/lib/content/seo/structured-data.test.ts`

- [ ] **Step 1: Write publish-validation test**

```ts
// tests/unit/lib/content/publish-validation.test.ts
import { describe, it, expect } from "vitest";
import { slugify, getPublishChecklist, canPublish, EMPTY_DRAFT } from "@/lib/content/publishing/publish-validation";

describe("slugify", () => {
  it("converts title to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! World?")).toBe("hello-world");
  });

  it("handles Thai characters", () => {
    expect(slugify("สวัสดี")).toBe("สวสด");
  });

  it("collapses multiple dashes", () => {
    expect(slugify("a---b")).toBe("a-b");
  });
});

describe("getPublishChecklist", () => {
  it("requires title", () => {
    const items = getPublishChecklist({ ...EMPTY_DRAFT, title: "" });
    const titleItem = items.find((i) => i.label === "มี Title");
    expect(titleItem?.ok).toBe(false);
  });

  it("requires slug", () => {
    const items = getPublishChecklist({ ...EMPTY_DRAFT, slug: "" });
    const slugItem = items.find((i) => i.label === "มี Slug");
    expect(slugItem?.ok).toBe(false);
  });

  it("requires related concepts for articles", () => {
    const items = getPublishChecklist({ ...EMPTY_DRAFT, title: "Test", slug: "test", contentType: "article" });
    const rcItem = items.find((i) => i.label === "มี Related Concepts อย่างน้อย 1");
    expect(rcItem?.ok).toBe(false);
  });
});

describe("canPublish", () => {
  it("returns true when all items ok", () => {
    expect(canPublish([{ label: "a", ok: true }, { label: "b", ok: true }])).toBe(true);
  });

  it("returns false when any item fails", () => {
    expect(canPublish([{ label: "a", ok: true }, { label: "b", ok: false }])).toBe(false);
  });
});
```

- [ ] **Step 2: Write editor reducer test**

```ts
// tests/unit/features/editor/editor-reducer.test.ts
import { describe, it, expect } from "vitest";
import { editorReducer, initialEditorState, type EditorMachineState } from "@/features/editor/hooks/useEditorMachine";
import { EMPTY_DRAFT } from "@/lib/content/publishing/publish-validation";

describe("editorReducer", () => {
  const initial = initialEditorState(EMPTY_DRAFT);

  it("switches to editing mode on LOAD_DRAFT", () => {
    const next = editorReducer(initial, {
      type: "LOAD_DRAFT",
      draft: { ...EMPTY_DRAFT, title: "New Article", slug: "new-article" },
    });
    expect(next.mode).toBe("editing");
    expect(next.draft.title).toBe("New Article");
  });

  it("updates field on UPDATE_FIELD", () => {
    const next = editorReducer(initial, {
      type: "UPDATE_FIELD",
      field: "title",
      value: "Updated Title",
    });
    expect(next.draft.title).toBe("Updated Title");
  });

  it("sets autoState to saving on AUTO_SAVE_START", () => {
    const next = editorReducer(initial, { type: "AUTO_SAVE_START" });
    expect(next.autoState).toBe("saving");
  });

  it("resets to initial state", () => {
    const modified = editorReducer(initial, { type: "LOAD_DRAFT", draft: { ...EMPTY_DRAFT, title: "X" } });
    const reset = editorReducer(modified, { type: "RESET" });
    expect(reset.draft.title).toBe("");
    expect(reset.mode).toBe("dashboard");
  });
});
```

- [ ] **Step 3: Write entry-mapper test**

```ts
// tests/unit/lib/content/entry-mapper.test.ts
import { describe, it, expect } from "vitest";
import { rowToEntry, type EntryRow } from "@/lib/content/publishing/entry-mapper";

describe("rowToEntry", () => {
  const baseRow: EntryRow = {
    id: "test-1", slug: "test-concept", title: "Test Concept",
    status: "published", content_type: "concept",
    author_id: "auth-1", author_name: "Author",
    main_term: "TestTerm", thai_name: "เทสต์",
    original_term: null, part_of_speech: "noun",
    language_root: "English", ipa: "/tɛst/",
    short_description: "A test concept",
    subtitle: null, series: null, volume: null, aliases: null,
    born_year: null, died_year: null, nationality: null,
    key_ideas: null, notable_works: null,
    publication_year: null, publisher: null, isbn: null,
    founder: null, period: null,
    framework: "Test Framework", main_thinkers: ["Thinker"],
    school: "Test School", difficulty: "beginner",
    tags: ["test"], visual_explanation: "Visual",
    technical_meaning: "Technical", real_world_examples: null,
    body_markdown: "# Hello", roots: null,
    related_concepts: [], source_refs: [], related_cta: null,
    cover_image: null, r2_content_key: null, r2_content_url: null,
    row_id: null, row_i: null, row_code: null, row_name: null,
    created_at: "2026-01-01", updated_at: null, published_at: "2026-01-01",
  };

  it("maps concept row correctly", () => {
    const entry = rowToEntry(baseRow);
    expect(entry.contentType).toBe("concept");
    if (entry.contentType === "concept") {
      expect(entry.mainTerm).toBe("TestTerm");
      expect(entry.thaiName).toBe("เทสต์");
      expect(entry.shortDescription).toBe("A test concept");
    }
  });

  it("maps person row correctly", () => {
    const row: EntryRow = {
      ...baseRow, content_type: "person",
      main_term: "Sigmund Freud", born_year: "1856", died_year: "1939",
      nationality: "Austrian",
    };
    const entry = rowToEntry(row);
    expect(entry.contentType).toBe("person");
    if (entry.contentType === "person") {
      expect(entry.mainTerm).toBe("Sigmund Freud");
      expect(entry.bornYear).toBe("1856");
      expect(entry.nationality).toBe("Austrian");
    }
  });
});
```

- [ ] **Step 4: Run unit tests**

```bash
npx vitest run
```
Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add tests/unit/
git commit -m "test: add unit tests for publish-validation, entry-mapper, editor-reducer"
```

### Task 6.2: Create CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write CI workflow**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "24" }
      - run: npm ci
      - run: npm run lint

  types:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "24" }
      - run: npm ci
      - run: npx tsc --noEmit

  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "24" }
      - run: npm ci
      - run: npx vitest run

  build:
    runs-on: ubuntu-latest
    needs: [lint, types, unit]
    env:
      NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "24" }
      - run: npm ci
      - run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "feat(ci): add lint + types + unit + build workflow"
```

### Task 6.3: Final verification — lint, build, test all green

- [ ] **Step 1: Run full verification**

```bash
npm run lint
npx vitest run
npm run build
```

Expected: all three PASS with clean output

- [ ] **Step 2: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: final verification pass — lint, build, tests all green"
```
