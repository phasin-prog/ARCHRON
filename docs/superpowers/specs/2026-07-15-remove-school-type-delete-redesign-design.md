# Remove `school` Content Type + Dashboard Delete Redesign — Design

- **Date:** 2026-07-15
- **Routes affected:** `/studio/dashboard` (primary); type system / SEO / reading-stats (secondary)
- **Status:** Approved (pending implementation plan)
- **Scope:** (A) Sweep the `school` **content type** from the codebase while preserving the `school` **node type** and `SCHOOLS` seed that feed `/thinkers`, `/concepts`, `/constellation`; (B) extend bulk-delete to all three dashboard sections; (C) upgrade the delete confirmation to a strong negative-feedback (red) treatment.

## 1. Goal & Context

The `/schools` route was already removed; only `/thinkers` remains and it reads from the static `SCHOOLS` seed (DB has no `school`-type entries anymore — `getPublicSchools` already falls back to `staticSchools`). Meanwhile the Studio Dashboard still carries a dead "เนื้อหา School" section, `"school"` is still a selectable content type in the editor, and the `school` content-type plumbing (schema, mappers, SEO, reading-stats) lingers across ~12 files.

Separately, the dashboard's delete system (shipped 2026-07-14) only covers the "บทความของฉัน" tab. Drafts and the admin "บทความทั้งหมด" tab have no delete affordance, and the delete confirmation uses `severity="warning"` (yellow) — not a strong negative signal.

This spec delivers three things the user asked for:
1. **Remove every trace of the `school` content type** (entries with `content_type='school'`) — keep the `SCHOOLS` seed + concept-registry `nodeType:"school"` nodes that power live routes.
2. **Make every piece of content deletable** — bulk-select mode in all three dashboard sections (Drafts, ของฉัน, ทั้งหมด).
3. **Strong negative feedback on delete** — red/error confirmation with dominant destructive button and muted cancel.

## 2. Decisions (from brainstorm)

| Decision | Choice |
|---|---|
| "School removal" scope | Sweep the `school` **content type** only — schema, editor option, dashboard section, mappers, SEO, reading-stats. **Keep** `SCHOOLS` seed (`seeds/schools.ts`), concept-registry `nodeType:"school"` nodes (`registry.ts`), node-type labels/colors, the editor's "สำนักคิดที่สังกัด" field, and the `"school"` Material Symbol icon name used elsewhere. |
| Delete reach | **Bulk-select in all 3 sections**: ฉบับร่าง (drafts), บทความของฉัน (my), บทความทั้งหมด (admin). Reuse the existing select-mode + sticky bulk bar pattern. |
| Negative feedback style | **Red prominent + button ordering** — `severity="error"` for delete confirm; "ลบถาวร" solid red dominant, "ยกเลิก" muted outline; outside-click/ESC blocked on delete. Archive stays `severity="warning"` (reversible). |
| `distinctSchools` reading stat | **Remove** — the stat (and the "cross-schools-5" achievement + profile display) is permanently 0 with no school entries and the achievement is unobtainable. |
| Architecture | Inline in `dashboard/page.tsx` for the UI; server actions already exist (`deleteEntriesAction`, `archiveEntriesAction`) and are reused unchanged. No new components, no global chrome, no schema/RLS/migration changes. |

## 3. Architecture

No new routes, no new components, no global chrome, no schema/RLS changes. Three independent slices that can be implemented/verified in order.

### Slice A — Remove `school` content type (15 file edits + 1 file delete)

Two `school` concepts coexist in the repo; this slice touches **only the content-type** track and leaves the **node-type** track intact.

```
src/types/content.ts                          (drop "school" from ContentType, SchoolEntry, isSchool, union, import)
src/types/content-schemas.ts                  (remove schoolSchema + export)
src/components/studio/editor-form.tsx         (remove "school" from CONTENT_TYPES; KEEP schoolMeta, SCHOOL_OPTIONS, show.school field)
src/app/studio/dashboard/page.tsx             (delete "เนื้อหา School" section, schoolEntries state, listEntriesByTypeAction call, "school" in typeLabel/typeAccent)
src/features/studio/actions/dashboard-actions.ts  (remove listEntriesByTypeAction)
src/lib/content/publishing/entry-mapper.ts    (remove case "school")
src/lib/content/publishing/draft-mapper.ts    (remove case "school")
src/lib/content/publishing/public-source.ts   (simplify getPublicSchools → return staticSchools; drop getDbPublishedEntries("school") branch)
src/lib/content/seo/structured-data.ts        (remove schoolLd + isSchool import — schoolLd is already dead code, never called)
src/lib/content/seo/metadata.ts               (remove contentType === "school" branch)
src/lib/content/core/cosmology.ts             (remove "school" from CONTENT_TYPE_META + KnowledgeObjectClass + classifyKnowledgeObject; KEEP nodeTypeAccent/nodeTypeCosmology "school" cases)
src/lib/content/reading/reading-db.ts         (remove distinctSchools from stats computation + return)
src/lib/content/community/achievements.ts     (remove distinctSchools from ReadingStats + "cross-schools-5" achievement + evaluateAchievements line)
src/app/profile/page.tsx                      (remove distinctSchools from ReadingTab inline stats type; no JSX change — never rendered)
src/lib/content/utils/index.ts                (remove `export * from "./import-schools"` barrel export)
src/lib/content/utils/import-schools.ts       (DELETE file)
```

**Preserved (node-type / seed — DO NOT TOUCH):**
- `src/lib/content/core/seeds/schools.ts` — `SCHOOLS` array; feeds `/thinkers`, `/thinkers/[slug]`, editor `SCHOOL_OPTIONS` + `THINKER_OPTIONS`.
- `src/lib/content/core/registry.ts` — 60+ `nodeType:"school"` concept nodes; feeds `/concepts`, `/constellation`, backlinks, internal-link suggestions.
- `src/lib/content/reading/graph.ts` — `"school"` in `NODE_TYPE_ORDER` (node-type ordering for the graph; concept-registry nodes use it).
- `src/lib/content/utils/colors.ts` — `school: "#7AACAC"` (used for node-type accent).
- `src/components/content-card.tsx`, `concept-card.tsx`, `concepts-browser.tsx`, `discover-grid.tsx` — `"school"` labels/icons for node-type display.
- `src/components/timeline/timeline-browser.tsx` — `school` field on timeline events (reference data, not content type).
- `src/lib/content/core/seeds/theories.ts` — `philosophy: "school"` is a Material Symbol **icon name**, not a content type.
- `src/lib/content/utils/external-links.ts` — `icon: "school"` is an icon name.
- `editor-form.tsx` `show.school` section + `schoolMeta` + `SCHOOL_OPTIONS` — the "สำนักคิดที่สังกัด" field tags other content types with a school affiliation; this is seed data, not the school content type.

#### A.1 Type system edits

**`src/types/content.ts`:**
- `ContentType` union: remove `| "school"`.
- Remove the `schoolSchema` token from the `import type { ... } from "@/types/content-schemas"` line.
- Remove `export type SchoolEntry = z.infer<typeof schoolSchema>;`.
- Remove `SchoolEntry` from the `DiscriminatedEntry` union.
- Remove `export function isSchool(...)`.

**`src/types/content-schemas.ts`:**
- Remove the `export const schoolSchema = baseEntryFields.extend({ contentType: z.literal("school"), ... })` block.
- Remove `schoolSchema` from the barrel `export { ... }` at the end of the file.

**`src/lib/content/core/cosmology.ts`:**
- `CONTENT_TYPE_META`: remove the `school: { icon: "groups_2", ... label: "สำนักคิด" }` entry.
- `KnowledgeObjectClass`: remove `| "school"` from the union (it is only used via `classifyKnowledgeObject(entry.contentType)` — a content-type path — and `validateOntologyEntry` never checks `objectClass === "school"`).
- `classifyKnowledgeObject`: remove the `case "school": return "school";` branch.
- **Keep** `nodeTypeAccent` `case "school"` and `nodeTypeCosmology` `case "school"` — these serve concept-registry nodes (`buildGraph` casts `entry.contentType as NodeType`, and the concept registry itself has `nodeType:"school"` items).

#### A.2 Editor & dashboard edits

**`src/components/studio/editor-form.tsx`:**
- `CONTENT_TYPES` array: remove the `"school"` string. The array becomes `["article", "concept", "reading-set", "source-note", "person", "book", "symbol", "term"]`.
- **Keep** `schoolMeta`, `SCHOOL_OPTIONS`, `THINKER_OPTIONS`, and the `{show.school && (...)}` section — these are the "affiliated school" field on other content types and depend on `SCHOOLS` seed, not the school content type.

**`src/app/studio/dashboard/page.tsx`:**
- Remove `schoolEntries` state (`useState<AllEntryItem[]>([])`).
- Remove `listEntriesByTypeAction` from the import list.
- Remove `listEntriesByTypeAction("school")` from the `Promise.all` in `useEffect` (the destructure `const [d, e, a, s] = ...` becomes `const [d, e, a] = ...`).
- Remove `setSchoolEntries(s)` from the setter block.
- Delete the entire `{schoolEntries.length > 0 && (...)}` section (the "เนื้อหา School" block).
- `typeLabel` map: remove `school: "สำนักคิด"`.
- `typeAccent` map: remove `school: colors.school`.

**`src/features/studio/actions/dashboard-actions.ts`:**
- Remove the `listEntriesByTypeAction` export entirely (it was only ever called with `"school"`).

#### A.3 Mapper / publishing edits

**`src/lib/content/publishing/entry-mapper.ts`:**
- Remove the `case "school": return { ...base, contentType: "school", ... }` block. The `switch` continues to fall through to the next case. (Note: the `school` **field** on other content types — e.g. `case "article"`'s `school: r.school ?? undefined` — stays; that is the affiliation field, not the content type.)

**`src/lib/content/publishing/draft-mapper.ts`:**
- Remove the `if (entry.contentType === "school") { ... }` branch.

**`src/lib/content/publishing/public-source.ts`:**
- `getPublicSchools`: replace the DB-reading body with `return staticSchools;` (drop the `hasSupabaseEnv()` + `getDbPublishedEntries("school")` + `getDbPublishedEntries("person")` + merge logic). The `cache(unstable_cache(...))` wrapper is kept so the seed is cached with the same tags. The `School` type (return type `Promise<School[]>`) and `staticSchools` imports remain in use; `DiscriminatedEntry` is still used by other functions in the file, so no import cleanup is needed.

#### A.4 SEO edits

**`src/lib/content/seo/structured-data.ts`:**
- Remove the `export function schoolLd(entry: DiscriminatedEntry) { if (!isSchool(entry)) return null; ... }` function (already dead code — `schoolLd(` has zero call sites).
- Remove `isSchool` from the `import { isArticle, isPerson, isBook, isSchool, ... }` line.

**`src/lib/content/seo/metadata.ts`:**
- Remove the `if (entry.contentType === "school") { return ... }` branch from `descriptionFor`.

#### A.5 Reading-stats cleanup

**`src/lib/content/reading/reading-db.ts`:**
- Remove the `distinctSchools` computation (the `schoolSlugs` set + `const distinctSchools = schoolSlugs.size;`).
- Remove `distinctSchools` from the return object (both the success return and the early-return fallback `{ completed: 0, distinctSchools: 0, streakDays: 0, readManifesto: false }`).
- The function returns `{ completed, streakDays, readManifesto }`.

**`src/lib/content/community/achievements.ts`:**
- Remove `distinctSchools: number;` from the stats type.
- Remove the `if (stats.distinctSchools >= 5) unlocked.push("cross-schools-5");` line.
- Remove the `"cross-schools-5"` achievement from the achievements definitions (find its definition in this file and delete the entry).

**`src/app/profile/page.tsx`:**
- Remove `distinctSchools` from the inline `stats` type annotation on the `ReadingTab` props (`{ completed: number; distinctSchools: number; streakDays: number; readManifesto: boolean }` → drop the `distinctSchools` field). `stats.distinctSchools` is never rendered in JSX (only `stats.completed` is displayed), so no grid/column change is needed — the field is a dead member of the inline type.

#### A.6 Import-script delete

**`src/lib/content/utils/import-schools.ts`** — delete the entire file (one-off script that inserted `content_type:'school'` rows; no longer needed).
**`src/lib/content/utils/index.ts`** — remove `export * from "./import-schools";` from the barrel.

### Slice B — Bulk-delete in all three dashboard sections

The existing "บทความของฉัน" select-mode is the reference pattern. The same state (`selectMode`, `selectedIds`, `confirm`, `result`, `acting`) and handlers (`toggleSelect`, `requestAction`, `executeAction`) are reused; the only addition is making select-mode reachable from the other two sections and wiring their rows.

#### B.1 Drafts section ("ฉบับร่าง")

- Add a "เลือกเพื่อลบ" toggle button in the drafts section header (next to the existing "ดูทั้งหมด" link). Toggling enters/exits drafts-select-mode.
- Because drafts and entries can overlap (a draft appears in both lists), use a **single shared `selectedIds` set and a single `selectMode` flag** that governs whichever section is active. To avoid ambiguity, when `selectMode` is on, only the **drafts section** shows checkbox rows if the user entered select mode from drafts, and only the **entries section** shows checkbox rows if entered from entries. Track which section is in select mode via a `selectScope: "drafts" | "my" | "all"` state.
- In drafts select-mode: each draft card becomes a `<button>` row with a checkbox (left), title, date, status badge. The sticky bulk bar shows "ลบถาวร (N)" only (no archive — drafts aren't published). On confirm + success, `setDrafts(prev => prev.filter(d => !ids.includes(d.id)))` and also `setEntries(prev => prev.filter(e => !ids.includes(e.id)))` (a deleted draft should leave both lists).

#### B.2 Admin "บทความทั้งหมด" tab

- Add the same "เลือกเพื่อลบ" toggle in the filter bar when `tab === "all"` (admin only — the tab is already admin-gated).
- In select-mode, `allFilteredEntries` rows become checkbox rows. The sticky bulk bar offers:
  - "เก็บถาวร (N)" — shown only when the selection includes `published` items (same logic as the "my" tab).
  - "ลบถาวร (N)" — always available when selection non-empty.
- `deleteEntriesAction` already handles admin (no `author_id` filter) vs non-admin (ownership filter), so no server-action change is needed.
- On success, mutate `allEntries` state (`setAllEntries(prev => prev.filter(...))` for delete; `setAllEntries(prev => prev.map(...))` for archive) **and** mirror into `entries`/`drafts` if the affected ids appear there (so the "my" tab stays consistent if the admin navigates back to it).

#### B.3 Unified `selectScope` state

Add `selectScope: "drafts" | "my" | "all" | null` to disambiguate which section is in select mode. Entering select mode from a section sets `selectScope` to that section; exiting resets it to `null`. The bulk bar and checkbox rows render only for the section matching `selectScope`. This prevents the three sections from competing for the same `selectedIds`.

### Slice C — Strong negative-feedback delete confirmation

Changes are in `src/app/studio/dashboard/page.tsx` (confirm modal props) only. `FeedbackModal` itself is unchanged — it already supports `severity="error"` with a red icon, red ring, and red primary button.

#### C.1 Severity by action kind

- **Delete** confirm: `severity="error"` (red). The icon is the existing `ErrorIcon`, the ring is `bg-error/15 border border-error/30`, the primary button is `bg-error text-text-inverse`.
- **Archive** confirm: keep `severity="warning"` (yellow) — archive is reversible, so a warning tone is appropriate.

#### C.2 Button ordering & visual weight

The existing `FeedbackModal` already renders the primary button first (right-side on desktop via `flex-row-reverse`) with `min-w-[120px]` and the secondary button as a muted outline (`border border-border ... text-text-secondary`). With `severity="error"`:
- "ลบถาวร" is solid red, full-weight, auto-focused (`primaryBtnRef`).
- "ยกเลิก" is the muted outline secondary.
No structural change needed — the severity swap carries the visual weight.

#### C.3 Copy (already present, keep)

- Delete: `กำลังลบถาวร ${N} รายการ — การลบไม่สามารถย้อนกลับได้` + first 3 titles + `และอีก X รายการ` when `N > 3`.
- The titles list makes the consequence concrete and is retained.

#### C.4 Interaction guard

- Delete confirm keeps `allowOutsideClick={false}` (already set) so a backdrop mis-click cannot confirm a destructive action.
- `allowEsc` remains `true` for delete (ESC = cancel, the safe direction). For archive it is also `true`.

#### C.5 Post-delete result modal

- Stays `severity="success"` with `ลบแล้ว ${N} รายการ` copy (already present). On error, `severity="error"` with the action's error string.

## 4. Permissions & Security

- `deleteEntriesAction` / `archiveEntriesAction` are unchanged: service-role client, ownership-scoped for non-admin (`.eq("author_id", userId)`), unscoped for admin. Extending the UI to the admin "ทั้งหมด" tab only exposes a capability the data layer already had — admin delete-of-others was already permitted by the action, just not reachable from the UI.
- Empty `ids` is a no-op.
- `getAuthedSupabase` throws if not signed in; the dashboard page already gates on `writer`/`admin` role.

## 5. Edge Cases

| Case | Behavior |
|---|---|
| Existing `school` rows in the DB | Untouched by this slice (no migration). They simply stop being creatable/editable-as-school from the UI; `getPublicSchools` ignores them and serves the seed. If a `school` row surfaces in the admin "ทั้งหมด" tab, the admin can delete it there. |
| `contentType === "school"` in `entry-mapper` after removal | The `case "school"` is removed; a row with `content_type='school'` would hit the mapper's default/fallback. This is acceptable since no new school rows are created and the admin can delete stragglers. |
| Draft deleted from drafts select-mode that also exists in entries | Removed from both `drafts` and `entries` state. |
| Admin deletes an entry in "ทั้งหมด" that is also the viewer's own | Mirrored out of `entries`/`drafts` so the "my" tab stays consistent. |
| Select mode + `tab` switch | `switchTab` already resets `selectMode`/`selectedIds`; extend it to reset `selectScope` too. |
| `getPublicSchools` after simplification | Returns the cached `staticSchools` directly; `/thinkers` and `/thinkers/[slug]` continue to work off the seed. |
| `distinctSchools` removed from stats type | Callers (`achievements.ts`, `profile/page.tsx`) are updated in the same slice so the type stays consistent. |

## 6. Out of Scope

- Database migration to delete existing `school`-type rows or drop the `content_type='school'` check constraint — no schema/RLS/migration changes (guardrail 7).
- Removing `SCHOOLS` seed data, concept-registry `nodeType:"school"` nodes, node-type labels/colors, the editor's "สำนักคิดที่สังกัด" field, or the `"school"` Material Symbol icon name — all preserved.
- Restore (un-archive) UI.
- Redesigning `FeedbackModal` itself — the component already supports `severity="error"`; only the calling prop changes.
- Global chrome (`site-header`, `site-footer`, `app/layout.tsx`, `app/template.tsx`) — untouched.

## 7. Verification

- `npm run lint` and `npm run build` must pass before commit (no `any`, no dangling imports, no unused `schoolSchema`/`isSchool`/`SchoolEntry` references).
- Grep audit: after the slice, `rg "schoolSchema|isSchool|SchoolEntry|listEntriesByTypeAction|schoolLd|distinctSchools|cross-schools-5" src/` returns zero hits; `rg "content_type.*school|contentType.*===.*\"school\"" src/` returns zero hits in content-type logic (node-type uses are expected and retained).
- Manual: `/thinkers` and `/thinkers/[slug]` still render (seed-fed); `/concepts` and `/constellation` still show school concept nodes; Studio editor no longer offers "สำนักคิด" as a content type but still shows the "สำนักคิดที่สังกัด" field on person/article; dashboard no longer shows the "เนื้อหา School" section; bulk delete works in drafts, my, and admin tabs; delete confirm is red with dominant destructive button; archive confirm stays yellow; profile page no longer shows a schools-read stat.
