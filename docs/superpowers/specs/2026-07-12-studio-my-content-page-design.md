# Studio My Content Page — Design

## Summary

Add a dedicated page at `/studio/my-content` that shows all content authored by the current user in a card-grid layout. Clicking a card navigates to `/studio/editor?slug=<slug>` for editing.

## Route

- **Path:** `app/studio/my-content/page.tsx` (client component, `"use client"`)
- **Link placement:** Accessible by typing URL, or link from `/studio/dashboard` nav, `/studio/editor` header, and `/studio` landing

## Data

- Fetch from existing `listMyEntriesAction()` in `features/editor/actions.ts` — returns `{ entries: ContentEntry[] }`
- Merge all statuses (draft, published, archived, etc.) into one list
- Filter on client by type and status; search by title/slug

## Layout

```
Header: "เนื้อหาของฉัน" + count + "เขียนใหม่" button → /studio/editor

Filters: Search input | Type dropdown | Status dropdown

Card grid: responsive grid (1 col mobile → 2 col tablet → 3 col desktop)
  Each card:
    - Type badge (color-coded: article=gold, concept=purple, person=blue, book=amber, etc.)
    - Title (truncate if long)
    - Short description line (optional, if available)
    - Status badge (draft = neutral, published = green, archived = slate)
    - Updated date
    - Entire card is a Link → /studio/editor?slug=<slug>
```

## Components

- One file: `app/studio/my-content/page.tsx`
- No new components needed — uses existing patterns from `/studio/dashboard`
- Reuses `colors.ts` for type/status color mapping and `contentTypeMeta` if available

## States

- **Loading:** skeleton grid (pulse cards)
- **Empty:** "ยังไม่มีเนื้อหา" message + "เริ่มเขียน" CTA
- **Error:** handled by parent error boundary (studio/layout.tsx or error.tsx)
- **Filtered empty:** "ไม่พบรายการที่ตรงกับตัวกรอง" message

## Data Flow

```
page.tsx
  → useAuth() + useUser() for userId/role
  → useEffect → listMyEntriesAction()
  → setState: entries[]
  → client-side filter: search query, type, status
  → render grid
  → onClick card → <Link href="/studio/editor?slug=...">
```

## Guardrails

- Writer-only: if `!canWrite(role)`, show restricted message (same pattern as editor page)
- No direct DB access — only server actions
