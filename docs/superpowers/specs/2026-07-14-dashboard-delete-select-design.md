# Dashboard Delete & Select-Content System — Design

- **Date:** 2026-07-14
- **Route:** `/studio/dashboard`
- **Status:** Approved (pending implementation plan)
- **Scope:** Add a delete system (single-item) and a select-content-to-delete system (bulk) to the existing Studio Dashboard, scoped to the "บทความของฉัน" tab.

## 1. Goal

The Studio Dashboard at `src/app/studio/dashboard/page.tsx` currently lists a writer's drafts and entries but offers no way to delete or archive content. The data layer already has `deleteEntry(sb, id)` in `src/lib/content/publishing/entries-db.ts`, but it is not exposed as a server action and has no UI.

This spec adds:
1. A **delete button** per row (single-item destructive action).
2. A **select-content mode** (toggle) that lets the writer check multiple rows and apply a bulk delete or archive.
3. A **designed confirmation modal** before any destructive action.
4. An **archive action** (status → `archived`) as the reversible alternative to hard delete, offered on published content.

## 2. Decisions (from brainstorm)

| Decision | Choice |
|---|---|
| Delete semantics | **Both**: "เก็บถาวร" (archive, reversible) for published content + "ลบถาวร" (hard delete) for drafts/own content |
| Writer permission | Writer can hard-delete **all their own** content (drafts + published); Admin can delete any (but UI is only in "my" tab this scope) |
| Which dashboard sections | **Only "บทความของฉัน" tab** (not Quick Drafts, not School, not "บทความทั้งหมด" admin tab) |
| Multi-select interaction | **Select-mode toggle** ("เลือกเพื่อลบ" button) — checkboxes + bulk bar appear only while active; prevents accidental ticking |
| Confirmation UX | **Designed modal** — reuse existing `FeedbackModal` with `severity="warning"` |
| Architecture | **Inline in `dashboard/page.tsx`** (Approach A) — no new component file; new server actions in `dashboard-actions.ts` |
| Restore (un-archive) | **Out of scope** — not part of the request |

## 3. Architecture

Two files changed. No new routes, no global chrome, no schema/RLS changes.

```
src/features/studio/actions/dashboard-actions.ts   (+2 server actions)
src/app/studio/dashboard/page.tsx                  (+state, +UI, +handlers, +modals)
  └── reuses src/components/feedback-modal.tsx      (unchanged)
```

### 3.1 Server actions (`dashboard-actions.ts`)

Two new `"use server"` functions, bulk-capable (a single-item action is an array of one id).

**`deleteEntriesAction(ids: string[]): Promise<{ ok: boolean; count: number; error?: string }>`**
- `const { userId, supabase } = await getAuthedSupabase();` (service-role client, bypasses RLS — ownership checked manually).
- `const role = await getUserRole();`
- Build the delete query: `supabase.from("entries").delete()`. Apply `.in("id", ids)`. For non-admin, also apply `.eq("author_id", userId)` so Supabase only deletes rows matching id **AND** ownership. Admin omits the author filter.
- `await invalidateRTK();` (fire-and-forget, same as `deleteEntry`).
- Return `{ ok: true, count }` on success; `{ ok: false, count: 0, error: message }` on error.
- Guard: if `ids.length === 0` return `{ ok: true, count: 0 }` (no-op).

**`archiveEntriesAction(ids: string[]): Promise<{ ok: boolean; count: number; error?: string }>`**
- Same auth + role + ownership filter pattern.
- `supabase.from("entries").update({ status: "archived" }).in("id", ids)` (+ `.eq("author_id", userId)` for non-admin).
- `await invalidateRTK();` (entry leaves public search/RTK index).
- Return shape identical.
- Guard: empty `ids` → no-op.

Rationale for ownership filter on the query (not a pre-fetch): Supabase's `delete`/`update` accept `.eq()` filters, so a single query both scopes and acts. This is secure because the service-role client is the only caller and the filter is applied server-side. Admin is determined by `getUserRole()` (reads Clerk `publicMetadata.role`).

### 3.2 Dashboard page state (`page.tsx`)

New `useState` added to `StudioDashboardPage`:

| State | Type | Purpose |
|---|---|---|
| `selectMode` | `boolean` | Whether select mode is on (checkboxes + bulk bar) |
| `selectedIds` | `Set<string>` | Checked entry ids |
| `confirm` | `null \| { kind: "delete" \| "archive"; ids: string[]; titles: string[] }` | Drives the confirmation `FeedbackModal` |
| `result` | `null \| { severity: "success" \| "error"; message: string }` | Drives the result `FeedbackModal` |
| `acting` | `boolean` | In-flight disable for all action buttons |

A `useCallback` handler `runAction(kind, ids, titles)`:
1. Sets `confirm` to open the modal (does not execute yet).
2. On confirm, sets `acting=true`, calls the action, then:
   - **delete success**: `setEntries(prev => prev.filter(e => !ids.includes(e.id)))` and `setDrafts(prev => prev.filter(d => !ids.includes(d.id)))` (drafts appear in both lists).
   - **archive success**: `setEntries(prev => prev.map(e => ids.includes(e.id) ? { ...e, status: "archived" } : e))` and `setDrafts(prev => prev.filter(d => !ids.includes(d.id)))`.
   - Set `result` (success count or error message).
   - Clear `selectedIds`, set `selectMode=false`, set `acting=false`, clear `confirm`.

### 3.3 UI — "บทความของฉัน" tab only

All changes are inside the existing `tab === "my"` branch (the entry list section).

**Filter bar additions (when `tab === "my"`):**
- A "เลือกเพื่อลบ" toggle button next to the existing status/type filters. Clicking toggles `selectMode`. While active, label becomes "เลิกเลือก".
- On `tab` switch away from "my" (via the existing `setTab`), automatically `setSelectMode(false)` and `setSelectedIds(new Set())`.

**Default mode (`selectMode === false`):**
- Each entry row remains a `<Link>` (existing behavior) but gains per-row action buttons on the right, **before** the trailing arrow icon. Buttons use `onClick={e => { e.preventDefault(); e.stopPropagation(); ... }}` so the link does not navigate.
- **Draft / non-published rows**: a single "ลบ" (trash icon) button → opens confirm with `kind:"delete"`, `ids:[e.id]`, `titles:[e.title]`.
- **Published rows**: "เก็บถาวร" (archive icon) + "ลบ" (trash icon) buttons → respective confirm.
- Buttons disabled when `acting`.

**Select mode (`selectMode === true`):**
- The row's `<Link>` is replaced with a non-navigating row (`<div role="button">` or a `<button>` wrapper) so the whole row toggles membership in `selectedIds`.
- A checkbox renders at the left of each row (before the type badge). `aria-checked` reflects state.
- The per-row action buttons are hidden (bulk bar replaces them).
- A sticky **bulk action bar** renders above (or pinned to the bottom of) the list while `selectedIds.size > 0`:
  - "เลือกทั้งหมด" / "ยกเลิกการเลือก" (select-all / clear — operates on the currently filtered `myFilteredEntries`).
  - "{N} รายการที่เลือก".
  - "เก็บถาวร (N)" — shown only when the selection includes at least one `published` item. On click, the handler computes `ids = [...selectedIds].filter(id => entry.status === "published")` and passes **only those** to `archiveEntriesAction`, so non-published items in the selection are untouched.
  - "ลบถาวร (N)" — always available when selection non-empty; deletes all selected.
  - "เลิกเลือก" — exits select mode and clears selection.
- All bulk buttons disabled when `acting` or selection empty (except "เลิกเลือก").

### 3.4 Confirmation & result modal

Reuse `src/components/feedback-modal.tsx` (unchanged). Two modal instances:

**Confirm modal** (`confirm !== null`):
- `severity="warning"`
- `title`: `"ยืนยันการลบถาวร"` (delete) / `"ยืนยันการเก็บถาวร"` (archive)
- `message`:
  - delete: `กำลังลบถาวร ${N} รายการ — การลบไม่สามารถย้อนกลับได้` plus the first 3 titles and "และอีก X รายการ" when `N > 3`.
  - archive: `เนื้อหา ${N} รายการจะไม่แสดงต่อสาธารณะ แต่ยังอยู่ในระบบ (ไม่ถูกลบถาวร)`.
- `primaryActionText`: `"ลบถาวร"` / `"เก็บถาวร"`.
- `onPrimaryAction`: calls `runAction` execution path.
- `secondaryActionText`: `"ยกเลิก"`.
- `allowOutsideClick={false}` (prevent accidental dismiss); `allowEsc={true}`.

**Result modal** (`result !== null`):
- `severity` = `result.severity` (`"success"` or `"error"`).
- `message` = `result.message` (success: `"ลบแล้ว ${N} รายการ"` / `"เก็บถาวรแล้ว ${N} รายการ"`; error: the action's `error` string).
- `onClose` clears `result`.
- Only one modal is open at a time (`confirm` and `result` are never both set).

### 3.5 Stats derivation (unchanged logic)

The stats cards (ฉบับร่าง / เผยแพร่แล้ว / เก็บถาวร) derive from `entries` state (`published = entries.filter(...)`, `archived = entries.filter(...)`), and `drafts.length` from `drafts`. Because the after-action handlers mutate `entries`/`drafts` directly, the stats recount automatically with no refetch.

## 4. Permissions & Security

- Server actions use the service-role client (`getAuthedSupabase`), so RLS is bypassed — ownership is enforced in the query via `.eq("author_id", userId)` for non-admins.
- Admin (role from `getUserRole()` → Clerk `publicMetadata.role`) may act on any id (no author filter). This scope's UI only exposes the writer's own entries in the "my" tab, so admin-delete-of-others is not reachable from this UI (it remains available at the data layer for future admin tooling).
- Empty `ids` is a no-op (returns `ok: true, count: 0`).
- `userId` is required (`getAuthedSupabase` throws if not signed in).

## 5. Edge Cases

| Case | Behavior |
|---|---|
| Empty selection | Bulk buttons disabled (except "เลิกเลือก") |
| Action failure | Error result modal; selection preserved so the user can retry |
| `acting` in-flight | All action buttons disabled |
| Switch `tab` away from "my" | Auto-exit select mode, clear `selectedIds` |
| Delete a draft | Removed from both `entries` and `drafts` state (it appears in both lists) |
| Archive a draft | Not offered (archive button only on published rows / bulk archive only affects published selection) |
| Confirm dismissed (ESC / ยกเลิก) | `confirm` cleared, nothing executed, selection retained |
| Bulk archive with mixed statuses | Only `published` selected items are archived; non-published are left as-is |

## 6. Out of Scope

- Restore (un-archive) UI — not requested.
- Delete UI in Quick Drafts, School entries, or the admin "บทความทั้งหมด" tab.
- Soft-delete via a new status — reuses the existing `archived` status.
- Schema/RLS/migration changes.
- Optimistic UI / skeleton states during delete — the list updates from local state on success.

## 7. Verification

- `npm run lint` and `npm run build` must pass before commit.
- Manual: delete a draft (row button), delete a published entry (row button), archive a published entry (row button), enter select mode, select 3, bulk delete, bulk archive mixed selection, dismiss confirm via ESC, switch tab while in select mode, observe stats recount after each action.
