# Remove `school` Content Type + Dashboard Delete Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sweep the `school` content type from the codebase (preserving `SCHOOLS` seed + `nodeType:"school"` concept nodes), extend bulk-delete to all three dashboard sections, and upgrade delete confirmation to strong red negative feedback.

**Architecture:** Three independent slices executed in order. Slice A is pure deletion/editing across 15 files + 1 file delete. Slice B adds `selectScope` state and wires the existing select-mode pattern into the drafts section and the admin "บทความทั้งหมด" tab. Slice C swaps the delete confirm modal's `severity` prop from `"warning"` to `"error"`. No new components, no new routes, no schema/RLS/migration changes, no global chrome touched.

**Tech Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase · Clerk · TypeScript · Vitest · ESLint flat config

## Global Constraints

- **Thai-first:** UI text in Thai; English only for proper nouns (ARCHRON, Manifesto) and academic terms. No i18n switcher.
- **Design tokens:** Use `--color-error`, `--color-warning`, `--color-accent`, `--color-text-*`, `--color-border` from `app/globals.css`. No hardcoded hex.
- **No `any`:** ESLint flat config rejects stray `any`. Use proper types or `unknown` casts.
- **Preserved (DO NOT TOUCH):** `src/lib/content/core/seeds/schools.ts`, `src/lib/content/core/registry.ts` (node-type:"school" entries), `src/lib/content/reading/graph.ts` NODE_TYPE_ORDER, `src/lib/content/utils/colors.ts` `school` color, `src/components/content-card.tsx`/`concept-card.tsx`/`concepts-browser.tsx`/`discover-grid.tsx` node-type "school" labels, `src/components/timeline/timeline-browser.tsx` `school` field, `src/lib/content/core/seeds/theories.ts` icon name "school", `src/lib/content/utils/external-links.ts` icon name "school", `editor-form.tsx` `show.school`/`schoolMeta`/`SCHOOL_OPTIONS`.
- **Build/Lint green before commit:** `npm run lint` and `npm run build` must both pass.
- **No commits unless explicitly instructed.** Each task ends with a `git add` + `git commit` step as a checkpoint — the implementer runs it only when the user has authorized commits.
- **Run commands from the repo root** `C:\Users\User\Desktop\Archron\Archon`.

---

## Slice A — Remove `school` content type

### Task A1: Remove `schoolSchema` from `content-schemas.ts`

**Files:**
- Modify: `src/types/content-schemas.ts:126-137` (remove `schoolSchema` block), `:185-188` (remove from `entrySchema` discriminated union)

**Interfaces:**
- Produces: `entrySchema` no longer includes `schoolSchema`; downstream `content.ts` will drop `SchoolEntry`/`isSchool` in Task A2.

- [ ] **Step 1: Remove the `schoolSchema` declaration**

Open `src/types/content-schemas.ts`. Delete lines 126-137 (the `export const schoolSchema = baseEntryFields.extend({ ... });` block). The block is:

```ts
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
```

- [ ] **Step 2: Remove `schoolSchema` from the `entrySchema` discriminated union**

In the same file, find the `entrySchema` declaration at the bottom and remove the `schoolSchema` token. The union becomes:

```ts
export const entrySchema = z.discriminatedUnion("contentType", [
  conceptSchema, personSchema, bookSchema, articleSchema,
  symbolSchema, termSchema, readingSetSchema, sourceNoteSchema,
]);
```

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no new errors — `schoolSchema` was only consumed by `content.ts` which still imports it, so errors will surface there; this task's own file is clean. If `tsc` complains about `content.ts`, continue to Task A2 which fixes that file.)

- [ ] **Step 4: Commit**

```bash
git add src/types/content-schemas.ts
git commit -m "refactor(types): drop schoolSchema from content schemas"
```

---

### Task A2: Drop `school` from `content.ts` types

**Files:**
- Modify: `src/types/content.ts:12-21` (ContentType union), `:143-161` (imports + union + helpers)

**Interfaces:**
- Produces: `ContentType` no longer includes `"school"`; `SchoolEntry`, `isSchool` removed; `DiscriminatedEntry` no longer includes `SchoolEntry`. Downstream files that imported `isSchool`/`SchoolEntry` (structured-data.ts, entry-mapper.ts, draft-mapper.ts) will be fixed in later tasks.

- [ ] **Step 1: Remove `"school"` from the `ContentType` union**

In `src/types/content.ts`, the union at lines 12-21 becomes:

```ts
export type ContentType =
  | "article"
  | "concept"
  | "reading-set"
  | "source-note"
  | "person"
  | "book"
  | "symbol"
  | "term";
```

- [ ] **Step 2: Remove `schoolSchema` from the type-only import**

Find the `import type { ... } from "@/types/content-schemas";` line and remove the `schoolSchema` token. It becomes:

```ts
import type {
  conceptSchema, personSchema, bookSchema, articleSchema,
  symbolSchema, termSchema, readingSetSchema, sourceNoteSchema,
} from "@/types/content-schemas";
```

- [ ] **Step 3: Remove `SchoolEntry` type alias**

Delete the line `export type SchoolEntry = z.infer<typeof schoolSchema>;`.

- [ ] **Step 4: Remove `SchoolEntry` from the `DiscriminatedEntry` union**

The union becomes:

```ts
export type DiscriminatedEntry =
  | ConceptEntry | PersonEntry | BookEntry | ArticleEntry
  | SymbolEntry | TermEntry | ReadingSetEntry | SourceNoteEntry;
```

- [ ] **Step 5: Remove `isSchool` function**

Delete the line `export function isSchool(e: DiscriminatedEntry): e is SchoolEntry { return e.contentType === "school"; }`.

- [ ] **Step 6: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: Errors in `src/lib/content/seo/structured-data.ts` (imports `isSchool`) — these will be fixed in Task A7. Other errors should reference `isSchool`/`SchoolEntry`/`schoolSchema` which will all be resolved by the end of Slice A. Continue.

- [ ] **Step 7: Commit**

```bash
git add src/types/content.ts
git commit -m "refactor(types): drop school content type from ContentType union"
```

---

### Task A3: Remove `school` from `cosmology.ts` content-type meta + ontology

**Files:**
- Modify: `src/lib/content/core/cosmology.ts:46` (CONTENT_TYPE_META), `:162-170` (KnowledgeObjectClass), `:180-201` (classifyKnowledgeObject)

**Interfaces:**
- Produces: `contentTypeMeta("school")` returns the fallback `{ icon: "article", accent: COSMOLOGY_ACCENT.psyche, label: "school" }` (acceptable — no new school entries are created). `classifyKnowledgeObject("school")` returns `"article"` (the default). `nodeTypeAccent("school")` and `nodeTypeCosmology("school")` still return school-node colors (preserved for concept-registry nodes).

- [ ] **Step 1: Remove the `school` entry from `CONTENT_TYPE_META`**

Delete line 46:

```ts
  school: { icon: "groups_2", accent: colors.forestGreen, label: "สำนักคิด" },
```

- [ ] **Step 2: Remove `| "school"` from `KnowledgeObjectClass`**

The union at lines 162-170 becomes:

```ts
export type KnowledgeObjectClass =
  | "concept"
  | "thinker"
  | "article"
  | "source"
  | "symbol"
  | "term"
  | "collection";
```

- [ ] **Step 3: Remove the `case "school":` branch from `classifyKnowledgeObject`**

Delete these lines from the switch:

```ts
    case "school":
      return "school";
```

- [ ] **Step 4: Verify `nodeTypeAccent` and `nodeTypeCosmology` still have their `case "school"` branches**

Read `src/lib/content/core/cosmology.ts:110-148` and confirm both functions still contain `case "school": return colors.forestGreen;` and `case "school": return "mercurius";` respectively. DO NOT remove these — they serve concept-registry `nodeType:"school"` nodes.

- [ ] **Step 5: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors from this file. (Existing errors from Tasks A1/A2 in other files remain; continue.)

- [ ] **Step 6: Commit**

```bash
git add src/lib/content/core/cosmology.ts
git commit -m "refactor(cosmology): remove school content-type meta and ontology class"
```

---

### Task A4: Remove `case "school"` from `entry-mapper.ts` and `draft-mapper.ts`

**Files:**
- Modify: `src/lib/content/publishing/entry-mapper.ts:155-168` (remove `case "school"` block)
- Modify: `src/lib/content/publishing/draft-mapper.ts:132-145` (remove `if (entry.contentType === "school")` block)

**Interfaces:**
- Produces: `rowToEntry` no longer returns a `school` entry; a DB row with `content_type='school'` would fall through to the default case (acceptable — no new school rows are created). `entryToDraft` no longer has a school branch; a school entry would fall through to the final fallback return (acceptable for the same reason).

- [ ] **Step 1: Remove the `case "school":` block from `entry-mapper.ts`**

Open `src/lib/content/publishing/entry-mapper.ts`. Find the `case "school":` block (lines 155-168) and delete it entirely:

```ts
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
```

Leave `case "article":` (which follows it) and the `school: r.school ?? undefined,` field inside `case "article"` — that is the affiliation field, not the content type.

- [ ] **Step 2: Remove the `if (entry.contentType === "school")` block from `draft-mapper.ts`**

Open `src/lib/content/publishing/draft-mapper.ts`. Find the block at lines 132-145 and delete it entirely:

```ts
  if (entry.contentType === "school") {
    return {
      ...base, framework: entry.framework ?? "", school: entry.school ?? "",
      mainTerm: entry.mainTerm ?? "", thaiName: entry.thaiName ?? "",
      founder: entry.founder ?? "", period: entry.period ?? "",
      keyIdeas: entry.keyIdeas?.join(", ") ?? "",
      originalTerm: "", partOfSpeech: "", languageRoot: "", ipa: "",
      visualExplanation: "", technicalMeaning: "",
      rootsEtymology: "", rootsMeaningShift: "", rootsCaution: "",
      mainThinker: "", bornYear: "", diedYear: "", nationality: "",
      notableWorks: "",
      publicationYear: "", publisher: "", isbn: "",
    };
  }
```

Leave `if (entry.contentType === "article")` (which follows) intact.

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors from these two files. The mapper `switch` is exhaustive on the remaining content types; TypeScript may warn about non-exhaustive if it can prove the union — if so, the `default`/fallback return at the end of each function covers it.

- [ ] **Step 4: Commit**

```bash
git add src/lib/content/publishing/entry-mapper.ts src/lib/content/publishing/draft-mapper.ts
git commit -m "refactor(mappers): remove school content-type branches"
```

---

### Task A5: Simplify `getPublicSchools` in `public-source.ts`

**Files:**
- Modify: `src/lib/content/publishing/public-source.ts:74-131` (collapse DB-reading body to `return staticSchools;`)

**Interfaces:**
- Produces: `getPublicSchools()` returns the cached `staticSchools` seed directly. `/thinkers` and `/thinkers/[slug]` continue to work. `School` type import and `staticSchools` import remain in use; `DiscriminatedEntry` import stays (used by other functions in the file).

- [ ] **Step 1: Replace the `getPublicSchools` body**

Open `src/lib/content/publishing/public-source.ts`. Find the `getPublicSchools` export (lines 74-131) and replace its entire body with a direct return of the seed. The new shape:

```ts
// ดึงข้อมูลสำนักคิดและนักปราชญ์จาก static SCHOOLS seed
// (school content type ถูกปลดออกแล้ว — /thinkers ใช้ seed เท่านั้น)
export const getPublicSchools = cache(
  unstable_cache(
    async (): Promise<School[]> => {
      return staticSchools;
    },
    ["public-schools"],
    { revalidate: 300, tags: ["schools"] },
  ),
);
```

Keep the `cache` and `unstable_cache` wrappers (same tags/revalidate). Remove the `getDbPublishedEntries`/`getDbPublishedEntries("person")` calls, the `hasSupabaseEnv()` branch, and the merge logic.

- [ ] **Step 2: Verify imports still used**

Check that `School` (from `@/lib/content/core/seeds/schools`) and `staticSchools` (same import) are still imported — they are still used by the new body. `DiscriminatedEntry` is still imported and used by `getPublicEntries`/`getPublicEntryBySlug` in the same file — do not remove it.

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors from this file.

- [ ] **Step 4: Commit**

```bash
git add src/lib/content/publishing/public-source.ts
git commit -m "refactor(public-source): simplify getPublicSchools to seed-only"
```

---

### Task A6: Remove `schoolLd` and `isSchool` import from `structured-data.ts`

**Files:**
- Modify: `src/lib/content/seo/structured-data.ts:1-4` (import), `:77-87` (schoolLd function)

**Interfaces:**
- Produces: `structured-data.ts` no longer exports `schoolLd` (already dead code — zero call sites). `isSchool` no longer imported.

- [ ] **Step 1: Remove `isSchool` from the import**

Open `src/lib/content/seo/structured-data.ts`. Change lines 2-4 from:

```ts
import {
  isArticle, isPerson, isBook, isSchool,
} from "@/types/content";
```

to:

```ts
import {
  isArticle, isPerson, isBook,
} from "@/types/content";
```

- [ ] **Step 2: Delete the `schoolLd` function**

Delete the entire function at lines 77-87:

```ts
export function schoolLd(entry: DiscriminatedEntry) {
  if (!isSchool(entry)) return null;
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

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors from this file. (If `DiscriminatedEntry` becomes unused, leave the import — it is used by `articleLd`/`personLd`/`bookLd` signatures.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/content/seo/structured-data.ts
git commit -m "refactor(seo): remove dead schoolLd structured-data function"
```

---

### Task A7: Remove `school` branch from `metadata.ts`

**Files:**
- Modify: `src/lib/content/seo/metadata.ts:17-19` (descriptionFor school branch)

**Interfaces:**
- Produces: `descriptionFor` no longer special-cases `contentType === "school"`; a school entry (if any lingered in DB) would fall through to the default `"${entry.title}" ในคลังความรู้...` description (acceptable).

- [ ] **Step 1: Delete the `school` branch**

Open `src/lib/content/seo/metadata.ts`. Find lines 17-19 and delete:

```ts
  if (entry.contentType === "school") {
    return (entry as any).shortDescription ?? `สำนักคิด ${entry.title} — ARCHRON`;
  }
```

- [ ] **Step 2: Run existing metadata tests**

Run: `npx vitest run tests/unit/lib/content/seo/metadata.test.ts`
Expected: PASS (the existing test uses a `concept` entry, unaffected).

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors from this file.

- [ ] **Step 4: Commit**

```bash
git add src/lib/content/seo/metadata.ts
git commit -m "refactor(seo): remove school branch from descriptionFor"
```

---

### Task A8: Remove `distinctSchools` from reading-stats + achievements + profile

**Files:**
- Modify: `src/lib/content/reading/reading-db.ts:109, 116-122, 128` (stats computation + return)
- Modify: `src/lib/content/community/achievements.ts:6-12` (AchievementKey union), `:35-39` (cross-schools-5 definition), `:61-66` (ReadingStats type), `:76` (evaluateAchievements line)
- Modify: `src/app/profile/page.tsx:180` (inline stats type)

**Interfaces:**
- Produces: `ReadingStats` is `{ completed: number; streakDays: number; readManifesto: boolean }`. `AchievementKey` no longer includes `"cross-schools-5"`. `ACHIEVEMENTS` no longer includes the cross-schools-5 entry. `evaluateAchievements` no longer references `distinctSchools`. The profile `ReadingTab` inline type drops `distinctSchools`.

- [ ] **Step 1: Update `getReadingStats` in `reading-db.ts`**

Open `src/lib/content/reading/reading-db.ts`. In `getReadingStats`:

- Change the early-return fallback (line 109) from `{ completed: 0, distinctSchools: 0, streakDays: 0, readManifesto: false }` to `{ completed: 0, streakDays: 0, readManifesto: false }`.
- Delete the `distinctSchools` computation block (lines 116-122):

```ts
  // distinctSchools (การประมาณ): นับ distinct slug ของเนื้อหาที่ content_type='school'
  // ที่อ่านจบ — schools ถูกแทนด้วย entry content_type='school' (ดู entries/public-source)
  // ถ้าภายหลังต้องการนับ "สำนักคิดที่เกี่ยวข้องกับบทความ" ให้ปรับ mapping ตรงนี้
  const schoolSlugs = new Set(
    rows.filter((r) => r.content_type === "school").map((r) => r.slug),
  );
  const distinctSchools = schoolSlugs.size;
```

- Change the final return (line 128) from `{ completed, distinctSchools, streakDays, readManifesto }` to `{ completed, streakDays, readManifesto }`.

- [ ] **Step 2: Update `achievements.ts`**

Open `src/lib/content/community/achievements.ts`:

- In `AchievementKey` (lines 6-12), remove `| "cross-schools-5"`. The union becomes:

```ts
export type AchievementKey =
  | "first-read"
  | "explorer-10"
  | "streak-7"
  | "deep-50"
  | "manifesto";
```

- In `ACHIEVEMENTS` (lines 21-58), delete the `cross-schools-5` entry:

```ts
  {
    key: "cross-schools-5",
    title: "ข้ามสำนักคิด",
    description: "อ่านเนื้อหาครบ 5 สำนักคิด",
    icon: "hub",
  },
```

- In `ReadingStats` (lines 61-66), remove the `distinctSchools` field:

```ts
export type ReadingStats = {
  completed: number; // จำนวนชิ้นความรู้ (ทุกชนิด) ที่อ่านจบ
  streakDays: number; // จำนวนวันอ่านต่อเนื่องล่าสุด
  readManifesto: boolean; // อ่านปฏิญญาก่อตั้ง (slug=manifesto) จบแล้วหรือไม่
};
```

- In `evaluateAchievements` (line 76), delete `if (stats.distinctSchools >= 5) unlocked.push("cross-schools-5");`.

- [ ] **Step 3: Update `profile/page.tsx` inline stats type**

Open `src/app/profile/page.tsx`. Find line 180 and remove `distinctSchools: number;` from the inline type. It becomes:

```ts
  stats: { completed: number; streakDays: number; readManifesto: boolean };
```

`stats.distinctSchools` is never read in JSX (verify with `rg "stats\.distinctSchools" src/app/profile/page.tsx` — should return zero hits), so no JSX change is needed.

- [ ] **Step 4: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors. All three files agree on the new `ReadingStats` shape.

- [ ] **Step 5: Run unit tests**

Run: `npx vitest run`
Expected: PASS (no existing test references `distinctSchools` or `cross-schools-5`).

- [ ] **Step 6: Commit**

```bash
git add src/lib/content/reading/reading-db.ts src/lib/content/community/achievements.ts src/app/profile/page.tsx
git commit -m "refactor(reading): remove distinctSchools stat and cross-schools-5 achievement"
```

---

### Task A9: Delete `import-schools.ts` and its barrel export

**Files:**
- Delete: `src/lib/content/utils/import-schools.ts`
- Modify: `src/lib/content/utils/index.ts:11` (remove barrel export)

**Interfaces:**
- Produces: `@/lib/content/utils` no longer re-exports `import-schools`. The one-off import script is gone.

- [ ] **Step 1: Delete the import script file**

Run: `Remove-Item -LiteralPath "src\lib\content\utils\import-schools.ts"`
Expected: file removed.

- [ ] **Step 2: Remove the barrel export line**

Open `src/lib/content/utils/index.ts` and delete line 11:

```ts
export * from "./import-schools";
```

- [ ] **Step 3: Verify no dangling references**

Run: `rg "import-schools" src/`
Expected: zero hits.

- [ ] **Step 4: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors.

- [ ] **Step 5: Commit**

```bash
git add -A src/lib/content/utils/
git commit -m "chore: delete one-off school import script and barrel export"
```

---

### Task A10: Remove `school` from editor `CONTENT_TYPES` and dashboard `typeLabel`/`typeAccent`

**Files:**
- Modify: `src/components/studio/editor-form.tsx:18-21` (CONTENT_TYPES array)
- Modify: `src/app/studio/dashboard/page.tsx:55, 147, 153, 285, 297` (schoolEntries state + load + section + typeLabel + typeAccent)
- Modify: `src/features/studio/actions/dashboard-actions.ts:48-59` (remove `listEntriesByTypeAction`)

**Interfaces:**
- Produces: The editor no longer offers "สำนักคิด" as a content type. The dashboard no longer renders the "เนื้อหา School" section or loads school entries. `listEntriesByTypeAction` is gone. `typeLabel("school")`/`typeAccent("school")` return the fallbacks.

- [ ] **Step 1: Remove `"school"` from `CONTENT_TYPES` in `editor-form.tsx`**

Open `src/components/studio/editor-form.tsx`. Find the `CONTENT_TYPES` array (lines 18-21) and remove the `"school"` string:

```ts
const CONTENT_TYPES = [
  "article", "concept", "reading-set", "source-note",
  "person", "book", "symbol", "term",
];
```

**Do NOT** remove `schoolMeta`, `SCHOOL_OPTIONS`, `THINKER_OPTIONS`, or the `{show.school && (...)}` section — those are the affiliated-school field for other content types and depend on `SCHOOLS` seed.

- [ ] **Step 2: Remove `listEntriesByTypeAction` from `dashboard-actions.ts`**

Open `src/features/studio/actions/dashboard-actions.ts`. Delete the entire `listEntriesByTypeAction` function (lines 48-59):

```ts
export async function listEntriesByTypeAction(contentType: string) {
  const { supabase } = await getAuthedSupabase();

  const { data } = await supabase
    .from("entries")
    .select("id, slug, title, status, content_type, author_id, author_name, published_at, updated_at")
    .eq("content_type", contentType)
    .order("updated_at", { ascending: false })
    .limit(100);

  return data ?? [];
}
```

- [ ] **Step 3: Remove `schoolEntries` state and load from `dashboard/page.tsx`**

Open `src/app/studio/dashboard/page.tsx`:

- Remove the `schoolEntries` state declaration: `const [schoolEntries, setSchoolEntries] = useState<AllEntryItem[]>([]);`
- Remove `listEntriesByTypeAction` from the import list at the top of the file.
- In the `useEffect` `Promise.all`, remove the `listEntriesByTypeAction("school")` call. Change `const [d, e, a, s] = await Promise.all([...])` to `const [d, e, a] = await Promise.all([...])` and remove `setSchoolEntries(s)` from the setter block.

- [ ] **Step 4: Delete the "เนื้อหา School" section JSX**

In `src/app/studio/dashboard/page.tsx`, delete the entire `{schoolEntries.length > 0 && (...)}` section (the "เนื้อหา School" block, ~lines 429-467).

- [ ] **Step 5: Remove `school` from `typeLabel` and `typeAccent` maps**

In the same file, find the `typeLabel` map and remove `school: "สำนักคิด",`. Find the `typeAccent` map and remove `school: colors.school,`.

- [ ] **Step 6: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: No new errors. `colors` import may still be used by other `typeAccent` entries — leave it.

- [ ] **Step 7: Verify lint**

Run: `npm run lint`
Expected: PASS (no unused imports — confirm `listEntriesByTypeAction` is not imported anywhere else with `rg "listEntriesByTypeAction" src/`).

- [ ] **Step 8: Commit**

```bash
git add src/components/studio/editor-form.tsx src/features/studio/actions/dashboard-actions.ts src/app/studio/dashboard/page.tsx
git commit -m "refactor(studio): remove school content type from editor and dashboard"
```

---

### Task A11: Slice A verification gate

**Files:** None modified — verification only.

- [ ] **Step 1: Grep audit for removed identifiers**

Run: `rg "schoolSchema|isSchool|SchoolEntry|listEntriesByTypeAction|schoolLd|distinctSchools|cross-schools-5" src/`
Expected: zero hits.

- [ ] **Step 2: Grep audit for content-type `school` logic**

Run: `rg "contentType.*===.*\"school\"|content_type.*\"school\"|case \"school\"|z\.literal\(\"school\"\)" src/`
Expected: zero hits in content-type logic. (Node-type uses like `nodeType: "school"` in `registry.ts` and `NODE_TYPE_ORDER` in `graph.ts` are expected and retained — confirm they are the only remaining `school` references.)

- [ ] **Step 3: Full typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (zero errors).

- [ ] **Step 4: Lint**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 6: Manual smoke check (optional, if dev server available)**

Start `npm run dev`. Visit:
- `/thinkers` — should still render the thinkers index (seed-fed).
- `/thinkers/[any-slug]` — should still render a thinker page.
- `/concepts` — should still list school-type concept nodes (node-type, not content-type).
- `/studio/editor` — the content-type dropdown should no longer include "สำนักคิด" but the "สำนักคิดที่สังกัด" field should still appear on person/article.
- `/studio/dashboard` — the "เนื้อหา School" section should be gone.

- [ ] **Step 7: Commit (only if any cleanup was needed; otherwise skip)**

If Steps 1-5 all pass cleanly, no commit is needed for this task. If you had to fix a dangling reference, commit it with `git commit -m "fix: clean up residual school content-type reference"`.

---

## Slice B — Bulk-delete in all three dashboard sections

### Task B1: Add `selectScope` state and refactor the existing "my" tab select mode

**Files:**
- Modify: `src/app/studio/dashboard/page.tsx` — add `selectScope` state; refactor the existing `tab === "my"` select-mode UI to read from `selectScope === "my"`; update `switchTab` to reset `selectScope`.

**Interfaces:**
- Produces: `selectScope: "drafts" | "my" | "all" | null` state. The existing "my" tab select-mode continues to work but is now gated on `selectScope === "my"` instead of `tab === "my" && selectMode`. `switchTab` resets `selectScope` to `null`.

- [ ] **Step 1: Add the `selectScope` state**

In `src/app/studio/dashboard/page.tsx`, next to the existing `selectMode`/`selectedIds` state, add:

```ts
const [selectScope, setSelectScope] = useState<"drafts" | "my" | "all" | null>(null);
```

- [ ] **Step 2: Refactor `switchTab` to reset `selectScope`**

Update the `switchTab` function:

```ts
  const switchTab = (next: Tab) => {
    setTab(next);
    setSelectMode(false);
    setSelectedIds(new Set());
    setSelectScope(null);
  };
```

- [ ] **Step 3: Update the "เลือกเพื่อลบ" toggle for the "my" tab**

Find the existing "เลือกเพื่อลบ" toggle button (in the filter bar, gated on `tab === "my"`). Update its `onClick` to also set `selectScope`:

```ts
                onClick={() => {
                  if (selectMode) {
                    setSelectMode(false);
                    setSelectedIds(new Set());
                    setSelectScope(null);
                  } else {
                    setSelectMode(true);
                    setSelectScope("my");
                  }
                }}
```

- [ ] **Step 4: Gate the select-mode row rendering on `selectScope === "my"`**

Find the existing `tab === "my" && selectMode ? (` branch that renders the checkbox rows + bulk bar. Change the condition to `tab === "my" && selectScope === "my" ? (` so that the checkbox UI only renders when the user entered select mode from the "my" tab.

- [ ] **Step 5: Verify the existing "my" tab delete/archive still works**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/studio/dashboard/page.tsx
git commit -m "feat(dashboard): add selectScope state to disambiguate select mode"
```

---

### Task B2: Add select-mode to the "ฉบับร่าง" (drafts) section

**Files:**
- Modify: `src/app/studio/dashboard/page.tsx` — add "เลือกเพื่อลบ" toggle in the drafts section header; render checkbox rows + a drafts bulk bar when `selectScope === "drafts"`.

**Interfaces:**
- Produces: Drafts can be bulk-deleted via select mode. The drafts bulk bar only offers "ลบถาวร (N)" (no archive — drafts aren't published). On delete success, drafts are removed from both `drafts` and `entries` state.

- [ ] **Step 1: Add the "เลือกเพื่อลบ" toggle to the drafts section header**

Find the drafts section header (the `{drafts.length > 0 && (...)}` block, around line 384). The header currently has the "ฉบับร่าง — N รายการ" label and the "ดูทั้งหมด" link. Add a toggle button next to them:

```tsx
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium text-text-secondary/80">
                ฉบับร่าง — {filteredDrafts.length} รายการ
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (selectScope === "drafts") {
                      setSelectMode(false);
                      setSelectedIds(new Set());
                      setSelectScope(null);
                    } else {
                      setSelectMode(true);
                      setSelectScope("drafts");
                    }
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    selectScope === "drafts"
                      ? "bg-error/15 text-error"
                      : "border border-border/40 text-text-secondary hover:text-text-heading"
                  }`}
                >
                  {selectScope === "drafts" ? "เลิกเลือก" : "เลือกเพื่อลบ"}
                </button>
                {filteredDrafts.length > 5 && (
                  <button
                    onClick={() => setShowAllDrafts(!showAllDrafts)}
                    className="text-xs text-accent hover:underline"
                  >
                    {showAllDrafts ? "แสดงน้อยลง" : `ดูทั้งหมด (${filteredDrafts.length})`}
                  </button>
                )}
              </div>
            </div>
```

- [ ] **Step 2: Render checkbox rows for drafts when `selectScope === "drafts"`**

Replace the existing drafts grid (`<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">...{displayDrafts.map((d) => (<Link ...>))}...</div>`) with a conditional: when `selectScope === "drafts"`, render checkbox rows instead of link cards.

After the header block, add:

```tsx
            {selectScope === "drafts" ? (
              <div className="space-y-3">
                {/* Drafts bulk action bar */}
                <div className="sticky top-2 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-border/50 bg-bg-card/95 p-2.5 shadow-sm backdrop-blur">
                  <button
                    onClick={() => {
                      const ids = filteredDrafts.map((d) => d.id);
                      if (ids.every((id) => selectedIds.has(id))) {
                        setSelectedIds(new Set());
                      } else {
                        setSelectedIds(new Set(ids));
                      }
                    }}
                    className="rounded-md px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-heading transition-colors"
                  >
                    {filteredDrafts.length > 0 &&
                    filteredDrafts.every((d) => selectedIds.has(d.id))
                      ? "ยกเลิกการเลือก"
                      : "เลือกทั้งหมด"}
                  </button>
                  <span className="text-xs text-text-secondary/60">
                    {selectedIds.size} รายการที่เลือก
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => {
                        const ids = [...selectedIds];
                        const titles = ids
                          .map((id) => drafts.find((d) => d.id === id)?.title ?? "")
                          .filter(Boolean);
                        requestAction("delete", ids, titles);
                      }}
                      disabled={acting || selectedIds.size === 0}
                      className="rounded-md bg-error px-3 py-1.5 text-xs font-semibold text-text-inverse hover:brightness-110 disabled:opacity-40 transition-all"
                    >
                      ลบถาวร ({selectedIds.size})
                    </button>
                    <button
                      onClick={() => {
                        setSelectMode(false);
                        setSelectedIds(new Set());
                        setSelectScope(null);
                      }}
                      className="rounded-md px-2.5 py-1 text-xs text-text-secondary hover:text-text-heading transition-colors"
                    >
                      เลิกเลือก
                    </button>
                  </div>
                </div>

                {/* Checkbox rows */}
                <div className="space-y-1.5">
                  {displayDrafts.map((d) => {
                    const checked = selectedIds.has(d.id);
                    return (
                      <button
                        key={d.id}
                        onClick={() => toggleSelect(d.id)}
                        className={`archron-card group flex w-full items-center gap-4 p-4 text-left transition-all ${
                          checked
                            ? "ring-2 ring-accent/40 bg-accent/5"
                            : "hover:border-accent/30"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                            checked
                              ? "border-accent bg-accent text-text-inverse"
                              : "border-border text-transparent"
                          }`}
                          aria-hidden="true"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-text-heading">
                            {d.title || d.slug}
                          </p>
                          <p className="mt-0.5 text-[11px] text-text-secondary/50">
                            {d.updated_at ? new Date(d.updated_at).toLocaleDateString("th-TH") : "—"}
                          </p>
                        </div>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${statusAccent(d.status)}15`,
                            color: statusAccent(d.status),
                          }}
                        >
                          {statusLabel(d.status)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {displayDrafts.map((d) => (
                  <Link
                    key={d.id}
                    href={`/studio/editor?slug=${d.slug}`}
                    className="archron-card archron-card--link group flex items-center justify-between p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-text-heading group-hover:text-accent transition-colors">
                        {d.title || d.slug}
                      </p>
                      <p className="mt-0.5 text-[11px] text-text-secondary/50">
                        {d.updated_at ? new Date(d.updated_at).toLocaleDateString("th-TH") : "—"}
                      </p>
                    </div>
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: `${statusAccent(d.status)}15`,
                        color: statusAccent(d.status),
                      }}
                    >
                      {statusLabel(d.status)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
```

- [ ] **Step 3: Update `executeAction` to mirror draft deletes into `entries`**

Find the `executeAction` function. In the `kind === "delete"` success branch, it already does `setEntries((prev) => prev.filter((e) => !ids.includes(e.id)))` and `setDrafts((prev) => prev.filter((d) => !ids.includes(d.id)))`. This is correct — a deleted draft leaves both lists. No change needed; verify the lines are present.

- [ ] **Step 4: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/studio/dashboard/page.tsx
git commit -m "feat(dashboard): add bulk-delete select mode to drafts section"
```

---

### Task B3: Add select-mode to the admin "บทความทั้งหมด" tab

**Files:**
- Modify: `src/app/studio/dashboard/page.tsx` — add "เลือกเพื่อลบ" toggle in the `tab === "all"` filter bar; render checkbox rows + bulk bar (with both archive and delete) when `selectScope === "all"`; mirror admin deletes/archives into `entries`/`drafts` state.

**Interfaces:**
- Produces: Admin can bulk-delete and bulk-archive any entry from the "ทั้งหมด" tab. `deleteEntriesAction`/`archiveEntriesAction` already handle admin (no author filter) — no server-action change. The "my" tab stays consistent because admin mutations mirror into `entries`/`drafts`.

- [ ] **Step 1: Add the "เลือกเพื่อลบ" toggle to the `tab === "all"` filter bar**

Find the filter bar. The existing "เลือกเพื่อลบ" toggle is gated on `tab === "my"`. Add a parallel toggle for `tab === "all"` (admin only — the tab is already admin-gated). Update the toggle block:

```tsx
            {(tab === "my" || (tab === "all" && admin)) && (
              <button
                onClick={() => {
                  if (selectMode) {
                    setSelectMode(false);
                    setSelectedIds(new Set());
                    setSelectScope(null);
                  } else {
                    setSelectMode(true);
                    setSelectScope(tab);
                  }
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectMode
                    ? "bg-error/15 text-error"
                    : "border border-border/40 text-text-secondary hover:text-text-heading"
                }`}
              >
                {selectMode ? "เลิกเลือก" : "เลือกเพื่อลบ"}
              </button>
            )}
```

This replaces the previous `tab === "my"`-only toggle. The `setSelectScope(tab)` call sets the scope to `"my"` or `"all"` depending on which tab the user is in.

- [ ] **Step 2: Render checkbox rows for the "all" tab when `selectScope === "all"`**

Find the `tab === "my" ? (` ... `: (` branch that renders the "all" entries as link rows. Replace the "all" link-rows branch with a conditional that renders checkbox rows + a bulk bar when `selectScope === "all"`:

```tsx
          ) : tab === "all" && selectScope === "all" ? (
            <div className="space-y-3">
              {/* Admin bulk action bar */}
              <div className="sticky top-2 z-20 flex flex-wrap items-center gap-2 rounded-xl border border-border/50 bg-bg-card/95 p-2.5 shadow-sm backdrop-blur">
                <button
                  onClick={() => {
                    const ids = allFilteredEntries.map((e) => e.id);
                    if (ids.every((id) => selectedIds.has(id))) {
                      setSelectedIds(new Set());
                    } else {
                      setSelectedIds(new Set(ids));
                    }
                  }}
                  className="rounded-md px-2.5 py-1 text-xs font-medium text-text-secondary hover:text-text-heading transition-colors"
                >
                  {allFilteredEntries.length > 0 &&
                  allFilteredEntries.every((e) => selectedIds.has(e.id))
                    ? "ยกเลิกการเลือก"
                    : "เลือกทั้งหมด"}
                </button>
                <span className="text-xs text-text-secondary/60">
                  {selectedIds.size} รายการที่เลือก
                </span>
                <div className="ml-auto flex items-center gap-2">
                  {(() => {
                    const hasPublished = [...selectedIds].some((id) => {
                      const e = allEntries.find((en) => en.id === id);
                      return e?.status === "published";
                    });
                    if (!hasPublished) return null;
                    const pubIds = [...selectedIds].filter((id) => {
                      const e = allEntries.find((en) => en.id === id);
                      return e?.status === "published";
                    });
                    return (
                      <button
                        onClick={() =>
                          requestAction(
                            "archive",
                            pubIds,
                            pubIds
                              .map((id) => allEntries.find((e) => e.id === id)?.title ?? "")
                              .filter(Boolean),
                          )
                        }
                        disabled={acting || pubIds.length === 0}
                        className="rounded-md border border-text-heading/20 px-3 py-1.5 text-xs font-medium text-text-heading hover:border-warning hover:bg-warning/5 disabled:opacity-40 transition-colors"
                      >
                        เก็บถาวร ({pubIds.length})
                      </button>
                    );
                  })()}
                  <button
                    onClick={() => {
                      const ids = [...selectedIds];
                      const titles = ids
                        .map((id) => allEntries.find((e) => e.id === id)?.title ?? "")
                        .filter(Boolean);
                      requestAction("delete", ids, titles);
                    }}
                    disabled={acting || selectedIds.size === 0}
                    className="rounded-md bg-error px-3 py-1.5 text-xs font-semibold text-text-inverse hover:brightness-110 disabled:opacity-40 transition-all"
                  >
                    ลบถาวร ({selectedIds.size})
                  </button>
                  <button
                    onClick={() => {
                      setSelectMode(false);
                      setSelectedIds(new Set());
                      setSelectScope(null);
                    }}
                    className="rounded-md px-2.5 py-1 text-xs text-text-secondary hover:text-text-heading transition-colors"
                  >
                    เลิกเลือก
                  </button>
                </div>
              </div>

              {/* Checkbox rows */}
              <div className="space-y-1.5">
                {allFilteredEntries.map((e) => {
                  const checked = selectedIds.has(e.id);
                  return (
                    <button
                      key={e.id}
                      onClick={() => toggleSelect(e.id)}
                      className={`archron-card group flex w-full items-center gap-4 p-4 text-left transition-all ${
                        checked
                          ? "ring-2 ring-accent/40 bg-accent/5"
                          : "hover:border-accent/30"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                          checked
                            ? "border-accent bg-accent text-text-inverse"
                            : "border-border text-transparent"
                        }`}
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                      <span
                        className="inline-flex shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${typeAccent(e.content_type)}15`,
                          color: typeAccent(e.content_type),
                        }}
                      >
                        {typeLabel(e.content_type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text-heading">
                          {e.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-text-secondary/50">
                          {e.published_at ? new Date(e.published_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                          {e.author_name ? ` · ${e.author_name}` : ""}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${statusAccent(e.status)}15`,
                          color: statusAccent(e.status),
                        }}
                      >
                        {statusLabel(e.status)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : tab === "all" ? (
            <div className="space-y-1.5">
              {allFilteredEntries.map((e) => (
                <Link
                  key={e.id}
                  href={`/studio/editor?slug=${e.slug}`}
                  className="archron-card archron-card--link group flex items-center gap-4 p-4"
                >
                  <span
                    className="inline-flex shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-semibold"
                    style={{
                      backgroundColor: `${typeAccent(e.content_type)}15`,
                      color: typeAccent(e.content_type),
                    }}
                  >
                    {typeLabel(e.content_type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-heading group-hover:text-accent transition-colors">
                      {e.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-text-secondary/50">
                      {e.published_at ? new Date(e.published_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      {e.author_name ? ` · ${e.author_name}` : ""}
                    </p>
                  </div>
                  <EditorIcon name="edit_note" className="h-4 w-4 text-text-secondary group-hover:text-accent" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="archron-card p-12 text-center">
              <p className="text-sm text-text-secondary/60">ไม่พบรายการ</p>
            </div>
          )}
```

Insert this branch between the existing `tab === "my" && selectScope === "my" ? (...)` branch and the existing `tab === "all"` link-rows branch.

- [ ] **Step 3: Mirror admin mutations into `entries`/`drafts` in `executeAction`**

Find the `executeAction` function. After the existing `setEntries`/`setDrafts` mutations in both the `delete` and `archive` success branches, add `setAllEntries` mutations. The delete branch becomes:

```ts
        if (kind === "delete") {
          setEntries((prev) => prev.filter((e) => !ids.includes(e.id)));
          setDrafts((prev) => prev.filter((d) => !ids.includes(d.id)));
          setAllEntries((prev) => prev.filter((e) => !ids.includes(e.id)));
          setResult({ severity: "success", message: `ลบแล้ว ${res.count} รายการ` });
        } else {
          setEntries((prev) =>
            prev.map((e) =>
              ids.includes(e.id) ? { ...e, status: "archived" } : e,
            ),
          );
          setDrafts((prev) => prev.filter((d) => !ids.includes(d.id)));
          setAllEntries((prev) =>
            prev.map((e) =>
              ids.includes(e.id) ? { ...e, status: "archived" } : e,
            ),
          );
          setResult({
            severity: "success",
            message: `เก็บถาวรแล้ว ${res.count} รายการ`,
          });
        }
```

- [ ] **Step 4: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Verify lint**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/studio/dashboard/page.tsx
git commit -m "feat(dashboard): add bulk-delete select mode to admin all-entries tab"
```

---

## Slice C — Strong negative-feedback delete confirmation

### Task C1: Swap delete confirm `severity` to `"error"`

**Files:**
- Modify: `src/app/studio/dashboard/page.tsx` — the confirm `FeedbackModal` instance's `severity` prop.

**Interfaces:**
- Produces: Delete confirmation renders red (ErrorIcon, red ring, red primary button). Archive confirmation stays yellow (`severity="warning"`).

- [ ] **Step 1: Change the confirm modal `severity` to be dynamic**

Find the confirm `FeedbackModal` (near the bottom of the component, the one with `open={confirm !== null}`). Change its `severity="warning"` prop to a dynamic expression based on `confirm.kind`:

```tsx
      <FeedbackModal
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        severity={confirm?.kind === "delete" ? "error" : "warning"}
        title={confirm?.kind === "delete" ? "ยืนยันการลบถาวร" : "ยืนยันการเก็บถาวร"}
        message={
          confirm ? (
            <>
              {confirm.kind === "delete" ? (
                <p>
                  กำลังลบถาวร <strong>{confirm.ids.length}</strong> รายการ — การลบไม่สามารถย้อนกลับได้
                </p>
              ) : (
                <p>
                  เนื้อหา <strong>{confirm.ids.length}</strong> รายการจะไม่แสดงต่อสาธารณะ แต่ยังอยู่ในระบบ (ไม่ถูกลบถาวร)
                </p>
              )}
              {confirm.titles.length > 0 && (
                <span className="mt-2 block text-xs text-text-secondary/60">
                  {confirm.titles.slice(0, 3).join(" · ")}
                  {confirm.titles.length > 3 && ` และอีก ${confirm.titles.length - 3} รายการ`}
                </span>
              )}
            </>
          ) : ""
        }
        primaryActionText={confirm?.kind === "delete" ? "ลบถาวร" : "เก็บถาวร"}
        onPrimaryAction={executeAction}
        secondaryActionText="ยกเลิก"
        allowOutsideClick={false}
      />
```

The only change from the existing code is `severity="warning"` → `severity={confirm?.kind === "delete" ? "error" : "warning"}`. Everything else (title, message, primary/secondary text, `allowOutsideClick={false}`) stays the same.

- [ ] **Step 2: Verify the result modal is unchanged**

The result `FeedbackModal` (the one with `open={result !== null}`) keeps `severity={result?.severity ?? "info"}` — do not change it. Success results stay green; error results stay red.

- [ ] **Step 3: Verify typecheck**

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Verify lint**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/studio/dashboard/page.tsx
git commit -m "feat(dashboard): red negative-feedback for delete confirmation"
```

---

## Final Verification

### Task V1: Full build + lint + unit tests

- [ ] **Step 1: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (zero errors).

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Unit tests**

Run: `npx vitest run`
Expected: PASS (all existing tests green; no new tests required by spec).

- [ ] **Step 5: Grep audit (final)**

Run: `rg "schoolSchema|isSchool|SchoolEntry|listEntriesByTypeAction|schoolLd|distinctSchools|cross-schools-5" src/`
Expected: zero hits.

Run: `rg "severity=\"warning\"" src/app/studio/dashboard/page.tsx`
Expected: zero hits on the confirm modal (the archive confirm now uses the dynamic expression; the only `severity="warning"` literal should be gone — confirm there are no remaining `severity="warning"` literals on the confirm modal).

- [ ] **Step 6: Manual smoke check (optional)**

Start `npm run dev` and verify in the browser:
- `/studio/dashboard` — drafts section has a "เลือกเพื่อลบ" toggle; entering it shows checkboxes + a red "ลบถาวร (N)" bulk bar.
- "บทความของฉัน" tab — select mode still works; delete confirm modal is **red** (ErrorIcon, red ring, red "ลบถาวร" button dominant, "ยกเลิก" muted); archive confirm is still **yellow**.
- "บทความทั้งหมด" tab (admin) — has a "เลือกเพื่อลบ" toggle; bulk bar offers "เก็บถาวร (N)" (when published items selected) + "ลบถาวร (N)".
- `/thinkers` and `/thinkers/[slug]` still render (seed-fed).
- `/concepts` still shows school concept nodes (node-type).
- `/studio/editor` — content-type dropdown has no "สำนักคิด" option; "สำนักคิดที่สังกัด" field still appears on person/article.
- `/profile` — reading stats no longer show a schools-read count (if it ever did — `stats.distinctSchools` was never rendered).

- [ ] **Step 7: Final commit (only if cleanup was needed)**

If all steps pass, no commit. If you fixed anything, commit with a descriptive message.
