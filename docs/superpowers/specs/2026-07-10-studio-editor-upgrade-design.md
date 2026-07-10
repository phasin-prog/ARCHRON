# Studio Editor Upgrade — ICON + Rendering + Color

## 1. ปัญหา

1. **ICON ล้าหลัง**: Editor และ studio pages ใช้ emoji (`◆`, `✓`, `🔒`, `✍`, `🛡`) แทน custom SVG icons จาก `components/icons.tsx` ที่มี 60+ ตัว
2. **Validation เข้มงวดเกิน**: `getPublishChecklist` บังคับทุกฟิลด์เท่ากันทุก content type (เช่น roots ไม่จำเป็นสำหรับ `book`)
3. **สีอ่านยาก**: input/textarea contrast ต่ำ, placeholder จาง, border บาง, label ขาด emphasis

## 2. แนวทาง: Full Redesign (Approach 3)

### 2.1 EditorIcon Component (ใหม่)

**ไฟล์**: `src/components/studio/editor-icon.tsx`

Component ที่ map Material Symbols name (จาก `cosmology.ts`) → SVG icon components จริง

```tsx
type Props = {
  name: string;        // "psychology" | "person" | "menu_book" | …
  accent?: string;     // สี (optional, fallback currentColor)
  className?: string;  // Tailwind class ปรับขนาด
};
```

**Mapping ตาราง**:

| Material Symbols name | SVG Component |
|---|---|
| `psychology` | ConceptIcon |
| `person` | PersonIcon |
| `menu_book` | BookIcon |
| `groups_2` | SchoolIcon |
| `category` | SymbolIcon |
| `tag` | TermIcon |
| `newspaper` / `article` | SourceIcon |
| `format_quote` | QuoteIcon |
| `edit_note` | EditIcon |
| `check_circle` | CheckIcon |
| `eco` | LeafIcon (ถ้ามี) / fallback |
| `verified` | CheckIcon |
| `language` | GlobeIcon / fallback |
| `layers` | StackIcon / fallback |
| `schedule`, `report`, `inventory_2` | ClockIcon / fallback |
| `more_horiz`, `circle` | fallback ◆ |
| unknown | ◆ diamond fallback |

ใช้ใน:
- `SearchableSelect` แทน ◆ (lines 100, 154)
- `page.tsx` แทน emoji ทุกจุด
- `content-type-selector.tsx` แทน emoji
- `dashboard/page.tsx`, `users/page.tsx`, `profile/page.tsx` แทน emoji

### 2.2 Component Decomposition

แยก `app/studio/editor/page.tsx` (726 บรรทัด) เป็น 4 components + 1 orchestrator:

#### EditorHeader (`components/studio/editor-header.tsx`)
- Sticky top bar: กลับห้องเขียน, status badge, บันทึก+เวอร์ชัน, พรีวิว, เผยแพร่, UserButton
- Autosave indicator (saving/saved)
- Admin edit notice (ถ้าแก้ของคนอื่น)
- Props: `draft, autoState, savedAt, loadingDraft, publishing, preview, canPreview, onSave, onPublish, onTogglePreview`

#### EditorForm (`components/studio/editor-form.tsx`)
- All form sections รายการตาม content type
- Basic info → Framework → Content → Cover → Related Concepts → References → Roots
- Props: `draft, onChange, show`, callbacks for ref add/remove
- ใช้ `EditorIcon` แทน ◆ และ `inputClass`/`textareaClass` constants

#### EditorSidebar (`components/studio/editor-sidebar.tsx`)
- MyContentSearch + คำแนะนำ + PublishChecklist + RevisionPanel + InternalLinkSuggestionPanel
- Props: `checklist, deadLinks, publishTried, entryId, reloadKey, onRestore, userId`

#### PublishChecklist (`components/studio/publish-checklist.tsx`)
- แสดง checklist items + dead links
- Props: `items, deadLinks, publishTried`

#### page.tsx (เหลือ orchestrator)
- draft state, effects, server actions, `show` object
- เรียก `<EditorHeader>`, `<EditorForm>`, `<EditorSidebar>`, `<PublishChecklist>`
- Loading skeleton, role gate, content type selector, mobile bar

### 2.3 Publish Validation — Content-Type-Aware

**ไฟล์**: `src/lib/content/publish-validation.ts`

`getPublishChecklist(d, contentType)`:

| Checklist Item | บังคับเมื่อ |
|---|---|
| Title, Slug, ContentType | ทุก type |
| Framework | article, concept, person, book |
| VisualExplanation | article, concept, symbol, term |
| TechnicalMeaning | article, concept, person |
| RelatedConcepts ≥ 1 | article, concept, person, school (ไม่บังคับ term, symbol) |
| References / NeedsCheck | ทุก type |
| Roots | article, concept (ไม่บังคับ book, reading-set, source-note) |
| BodyMarkdown | เฉพาะ article |

### 2.4 Color/Contrast ปรับปรุง

| Element | เดิม | ใหม่ |
|---|---|---|
| input border | `border-text-heading/10` | `border-text-heading/20` |
| input bg | `bg-text-heading/40` | `bg-text-heading/25` |
| focus ring | `focus:ring-accent/20` | `focus:ring-accent/30` |
| placeholder | `text-text-secondary/50` | `text-text-secondary/60` |
| label | `text-text-body` `text-sm` | เพิ่ม `font-medium` |
| textarea bg | `bg-text-heading/40` | `bg-text-heading/25` |

**CSS Variables ใหม่ใน globals.css**:
```css
--editor-input-bg: color-mix(in srgb, var(--color-text-heading) 25%, transparent);
--editor-input-border: color-mix(in srgb, var(--color-text-heading) 20%, transparent);
--editor-input-focus: var(--color-accent);
--editor-label: var(--color-text-body);
```

### 2.5 Feedback System — Editor Feedback Center

**ปัญหา**: `FeedbackToast` เดิมเป็น modal กลางจอทึบ บัง content, ใช้ emoji, แสดงผลไม่งาม, ไม่มี indicator ว่าอยู่ section ไหน

**แนวทาง**: แบ่ง feedback เป็น 3 ชั้น

#### Status Bar (ใน EditorHeader) — ถาวร, ไม่หาย
```
[Saved 12:34]         ← success/green
[Saving...]           ← accent/animate pulse
[Unsa ved changes]    ← warning/gold
```
- รวม `autoState` + `savedAt` ไว้ใน status bar แบบ persistent
- ใช้ EditorIcon component (check_circle / edit_note / schedule)
- อยู่มุมขวาของ EditorHeader ถัดจากปุ่ม action

#### Editor Feedback Center (Modal กลางจอ) — สำหรับ action สำคัญ
- **ตำแหน่ง**: fixed center, glass-effect (bg-bg/80 backdrop-blur)
- **กรณีใช้**: publish success, publish error (รุนแรง), save error, dead link error
- **ดีไซน์**:
  - ไอคอนใหญ่ (EditorIcon, 48px — success=check_circle / error=error)
  - หัวข้อ (16px bold)
  - รายละเอียด/ข้อความ
  - ปุ่ม action (optional เช่น "ดูรายละเอียด")
- **Animation**: scale 0.9→1 + fade, backdrop dim/blur
- **ไม่บัง editor**: ใช้ glass-effect ใส เห็น content ด้านหลัง, คลิกนอก modal → ปิด

#### Section Indicator (แถบนำทาง section)
- **ตำแหน่ง**: ระหว่าง EditorHeader กับ form content
- **ลักษณะ**: breadcrumb-style row
  ```
  ข้อมูลพื้นฐาน › กรอบทฤษฎี › เนื้อหา › แนวคิดที่เกี่ยวข้อง › เอกสารอ้างอิง › Roots
  ```
- แต่ละ section เป็น tag ที่กด scroll ไปหาได้
- Section ปัจจุบัน highlighted (bg-accent/10, text-accent)
- Section ที่ยังไม่ได้กรอก dimmed
- ไม่แสดง section ที่ถูกซ่อนตาม content type (show object)

#### ไฟล์ใหม่
- `src/components/studio/editor-feedback.tsx` — Feedback Center modal + logic
- `src/components/studio/editor-status-bar.tsx` — Status bar component (ใช้ใน EditorHeader)
- `src/components/studio/section-indicator.tsx` — Section indicator breadcrumb

#### ไฟล์แก้ไข
- `src/components/studio/editor-header.tsx` — ใส่ StatusBar
- `src/components/studio/editor-form.tsx` — ใส่ SectionIndicator
- `src/app/studio/editor/page.tsx` — ใช้ EditorFeedback แทน FeedbackToast

## 3. ไฟล์ที่เกี่ยวข้อง

### ไฟล์ใหม่ (8)
- `src/components/studio/editor-icon.tsx`
- `src/components/studio/editor-header.tsx`
- `src/components/studio/editor-form.tsx`
- `src/components/studio/editor-sidebar.tsx`
- `src/components/studio/publish-checklist.tsx`
- `src/components/studio/editor-feedback.tsx`
- `src/components/studio/editor-status-bar.tsx`
- `src/components/studio/section-indicator.tsx`

### ไฟล์แก้ไข (7)
- `src/app/studio/editor/page.tsx` — orchestrator
- `src/components/studio/searchable-select.tsx` — ใช้ EditorIcon
- `src/components/studio/searchable-multi-select.tsx` — ✕ → EditorIcon
- `src/components/studio/content-type-selector.tsx` — emoji → EditorIcon
- `src/lib/content/publish-validation.ts` — content-type-aware
- `src/app/globals.css` — editor CSS variables
- `src/app/studio/dashboard/page.tsx` — emoji → EditorIcon แก้เฉพาะ ✎
- `src/app/studio/users/page.tsx` — emoji → EditorIcon
- `src/app/studio/profile/page.tsx` — emoji → EditorIcon
- `src/app/studio/page.tsx` — emoji → EditorIcon

## 4. ข้อควรระวัง

- EditorIcon fallback สำหรับชื่อที่ไม่มี mapping → ◆ diamond (รักษา backward compat)
- Component decomposition ต้องไม่เปลี่ยน behavior — props interface เดียวกัน
- Server actions, draft state, URL params logic ยังอยู่ที่ page.tsx เหมือนเดิม
- ไม่แตะ global chrome (site-header, footer, layout, template) — ยึดตาม Guardrails
