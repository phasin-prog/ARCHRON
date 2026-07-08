# Design System Gap Completion — ARCHRON

Version: 1.0
Date: 2026-07-08
Status: Draft — pending user review
Approach: A (Gap-driven completion)

---

## Context

ARCHRON ปัจจุบันถูกพอร์ต design system จาก "Archron Humanizer" monorepo ไปแล้วเป็นส่วนใหญ่ — สี light mode, knowledge category colors, custom SVG icons, Playfair/Cinzel/Inter/Noto Serif Thai fonts ล้วนมีแล้ว — แต่ AGENTS.md ล้าสมัยและ design docs ของ Humanizer มีรายละเอียดที่ยังไม่ถูก implement ครบ

เอกสารฉบับนี้ครอบคลุม gap ทั้งหมดที่ต้องปิด แบ่งเป็น 5 phases ตามลำดับ dependency

### Scope decisions (ตัดสินใจแล้วกับผู้ใช้)

| หัวข้อ | ตัดสินใจ |
|---|---|
| โครงสร้างโปรเจกต์ | Next.js app เดี่ยว (คงไว้) |
| เนื้อหา | ไทย (คง Thai-first ไว้) |
| Routes | คง routes เดิม — ไม่เพิ่ม/ไม่เปลี่ยนชื่อ |
| สี | ระบบสีเดียว (light mode) ตาม docs ใหม่ — Primary Blue `#5F8DCE`, Premium Gold `#B89A63` |
| Typography | Playfair (อังกฤษ/ชื่อเฉพาะ) + Noto Serif Thai (หัวข้อไทย) + Inter (UI) + Lora (body ภาษาไทย/อังกฤษ) |
| Icons | คง custom SVG ปัจจุบัน (45 ตัว) — เติมที่ขาด + ถอด Material Symbols |
| MDX | เฉพาะหน้า static (ไม่ใช่ DB-backed) |
| Academic Seals | UI เท่านั้น — ไม่แตะ DB schema |
| UI labels | แปลไทย (Thai-first ยังอำ้ง) |

---

## Phase 1: Color + Typography + Icons (รากฐาน)

### 1a. เปลี่ยน Primary Accent

**สถานะปัจจุบัน:** `--color-accent: #8B5E3C` (warm brown) ใน `app/globals.css`
**เป้าหมาย:** `--color-accent: #5F8DCE` (Blue primary) ตาม homepage-implementation.md

**ไฟล์ที่แก้:**
- `app/globals.css` — เปลี่ยนค่า `--color-accent`, `--color-accent-hover`, `--color-accent-subtle`

```css
/* Before */
--color-accent: #8B5E3C;
--color-accent-hover: #7A4E2E;
--color-accent-subtle: #F5EDE5;

/* After */
--color-accent: #5F8DCE;
--color-accent-hover: #4F7DBE;
--color-accent-subtle: #EEF2F8;
```

**เพิ่ม Premium Gold token** (สำหรับ featured/premium เท่านั้น ตาม homepage-rule.md):
```css
--color-premium: #B89A63;
--color-premium-hover: #A88A53;
--color-premium-subtle: #F5EFE5;
```

**ผลกระทบ:** ทุก component ที่ใช้ `text-accent`, `border-accent`, `bg-accent` จะเปลี่ยนสีอัตโนมัติ — ไม่ต้องแก้ component files

**ตรวจสอบหลังแก้:**
- `npm run build` เขียว
- สี link/active/hover เป็นน้ำเงินแทนน้ำตาล
- ความสว่าง (contrast) ยังผ่าน WCAG AA (4.5:1) — `#5F8DCE` บน `#FAF8F5` = 3.2:1 (ต้องเช็ค — อาจต้องเข้มขึ้นเป็น `#4A7AB8` สำหรับ body text links)

### 1b. เพิ่ม Lora Font + เปลี่ยน Body เป็น Serif

**สถานะปัจจุบัน:** Body ใช้ `--font-body: var(--font-inter), var(--font-noto-sans-thai)` (sans-serif)
**เป้าหมาย:** Body ใช้ Lora (serif) สำหรับเนื้อหา, Inter เฉพาะ UI/labels

**ไฟล์ที่แก้:**

1. `app/layout.tsx` — เพิ่ม Lora font loader:
```typescript
import { Lora } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});
```

2. `app/globals.css` — เปลี่ยน `--font-body`:
```css
/* Before */
--font-body: var(--font-inter), var(--font-noto-sans-thai), ...;

/* After — Body = serif (Lora + Noto Serif Thai สำรองไทย) */
--font-body: var(--font-lora), var(--font-noto-serif-thai), "Lora",
  "Noto Serif Thai", Georgia, serif;

/* UI/Labels = sans (Inter + Noto Sans Thai) */
--font-ui: var(--font-inter), var(--font-noto-sans-thai), "Inter",
  "Noto Sans Thai", system-ui, sans-serif;
```

3. `app/globals.css` — เปลี่ยน `body` ให้ใช้ `--font-body` (serif) และเพิ่ม class `.font-ui` สำหรับ UI elements:
```css
body {
  font-family: var(--font-body); /* serif — เนื้อหา */
}

/* UI elements ใช้ sans */
nav, button, input, select, textarea, .badge, .chip, .tag, label {
  font-family: var(--font-ui);
}
```

**ผลกระทบ:** เนื้อหาบทความ/แนวคิดจะเป็น serif (Lora) สวยขึ้นสำหรับการอ่านยาว ส่วน nav/button/badge ยังเป็น sans (Inter)

### 1c. ถอด Material Symbols ออก

**สถานะปัจจุบัน:** `app/layout.tsx` บรรทัด 103-106 โหลด Material Symbols Outlined จาก Google Fonts
**เป้าหมาย:** ถอดออก — ใช้ custom SVG icons เท่านั้น

**ไฟล์ที่แก้:**
- `app/layout.tsx` — ลบ `<link rel="stylesheet" href="...Material+Symbols...">`
- ค้นหา `material-symbols` หรือ `class="material-symbols"` ใน codebase และแทนที่ด้วย custom icon components

### 1d. ไอคอนที่ขาด + IconBox

**สถานะปัจจุบัน:** 45 custom SVG icons ใน `components/icons.tsx` — ขาด 2 ตัวเทียบกับ Humanizer 47 + ไม่มี `IconBox` container

**ไอคอนที่ขาด (เทียบ Humanizer):**
- `CollectionIcon` — 4-square grid (สำหรับ Collection object type)
- `NotificationIcon` — bell (สำหรับ notifications)

**ไอคอนที่มีเกิน (เฉพาะ Archon — คงไว้):**
- `ArchronMark`, `ArchronLogomark`, `KnowledgeHubIcon`, `ManifestoIcon`, `ScholarIcon`, `SynthesisIcon`, `RealExampleIcon`, `SourceRefIcon`, `RootIcon`, `AuthorPenIcon`, `VisualMeaningIcon`, `GridIcon`, `PathIcon`, `TermIcon`, `SourceIcon`, `ExternalLinkIcon`, `HelpIcon`, `HeartIcon`, `LoginIcon`, `LogoutIcon`, `CalendarIcon`, `ClockIcon`, `ViewBadgeIcon` — คงไว้ทั้งหมด (ใช้ใน routes จริง)

**สร้าง `IconBox` component:**
```typescript
// components/icon-box.tsx
interface IconBoxProps {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "knowledge" | "featured" | "success";
  onClick?: () => void;
}
```
ใช้ CSS classes จาก icon-system.md (`.archron-icon-box` + size/variant modifiers)

### 1e. Icon Preview Page

**สถานะปัจจุบัน:** มี `/preview-cards` route อยู่แล้ว
**เป้าหมาย:** อัปเดตหรือสร้างใหม่ที่ `/icons` สำหรับดูไอคอนทั้งหมด

**สร้าง:** `app/icons/page.tsx` — แสดงไอคอนทั้งหมด พร้อม search, size selector, variant selector

---

## Phase 2: Navigation + Homepage

### 2a. Navigation Restructure

**สถานะปัจจุบัน:** `site-header.tsx` มี 8 รายการใน 4 tiers (primary, standard, utility, support)
**เป้าหมาย:** navigation-rule.md บอก max 5 items

**รายการนำทางใหม่ (5 รายการ):**

| # | Label (ไทย) | Route | Tier |
|---|---|---|---|
| 1 | คลังความรู้ | `/knowledge` | primary |
| 2 | สำรวจ | `/explore` | standard |
| 3 | ค้นหา | `/search` | standard |
| 4 | สนับสนุน | `/support` | support |
| 5 | เข้าสู่ระบบ/โปรไฟล์ | `/studio` or Clerk | auth |

**รายการที่ย้ายไป footer** (navigation-rule.md: "No dropdown menus in primary navigation"):
- ศาสตร์ (`/schools`) → footer
- ปฏิญญา (`/manifesto`) → footer
- แหล่งอ้างอิง (`/sources`) → footer
- คำถามที่พบบ่อย (`/faq`) → footer
- แผนที่ความสัมพันธ์ (`/constellation`) → footer หรือ /knowledge sub-page

**ไฟล์ที่แก้:**
- `components/site-header.tsx` — ลด NAV array เป็น 5 รายการ
- `components/site-footer.tsx` — เพิ่มลิงก์ที่ย้ายมา
- `components/tabbar.tsx` — ปรับ bottom nav ให้ตรง (4 items: ค้นหา, สำรวจ, สนับสนุน, โปรไฟล์)

### 2b. Homepage Restructure

**สถานะปัจจุบัน:** Hero ซับซ้อน (cosmology, colonnade, astrolabe, symbol parallax) + pillars + recently viewed + loop carousel + disciplines + timeline constellation
**เป้าหมาย:** homepage-rule.md กำหนดโครงตายตัว: Hero → Search → Continue Reading → Featured Guide → Latest Knowledge → Footer

**โครงใหม่:**

```
1. Hero
   - "ARCHRON" (font-display, text-display, font-bold)
   - "Understanding Humanity / Through Knowledge" → แปลไทย: "เข้าใจมนุษย์ / ผ่านความรู้"
   - radial gradient จาง ๆ จาก primary/0.06
   - constellation เส้นเฉียง opacity-[0.04]
   - ไม่มี astrolabe/colonnde/symbol parallax (ถอดออก)

2. Search Bar
   - คาบเกิน Hero เล็กน้อย (-mt-8)
   - max-w-reading (720px)
   - placeholder: "ค้นหาทุกสิ่ง..."
   - rounded-xl, border-border, bg-card, text-center, font-serif

3. Continue Reading (เฉพาะผู้ใช้ล็อกอิน + มีประวัติ)
   - Title: "อ่านต่อ"
   - 3-column grid
   - การ์ด: concept badge, progress, title, description

4. Featured Guide
   - Title: "คู่มือแนะนำ"
   - 2-column grid
   - การ์ด: Guide badge (primary), lesson count, title, description

5. Latest Knowledge
   - Title: "ความรู้ล่าสุด"
   - 4-column grid (desktop), 2 (tablet), 1 (mobile)
   - การ์ด: object type badge, title, domain label

6. Footer (มีอยู่แล้ว)
```

**สิ่งที่ถอดออกจาก homepage:**
- cosmology/colonnde/astrolabe visual layers
- symbol parallax (Ψ Φ Ω Α Χ)
- LayerBadge
- TimelineConstellation
- 3 pillars (เสาหลัก) — ย้ายไี่ยหรือถอด

**สิ่งที่คงไว้:**
- RecentlyViewed (ใช้เป็น "อ่านต่อ" สำหรับผู้ใช้ล็อกอิน)
- DisciplineCard (ใช้เป็น "ความรู้ล่าสุด" หรือ "คู่มือแนะนำ")
- LoopCarousel — ประเมินใหม่ว่าเข้าที่ในโครงใหม่หรือไม่

**ไฟล์ที่แก้:**
- `app/page.tsx` — เขียนใหม่ตามโครง homepage-rule
- `components/hero/vesica-pattern.tsx` — ประเมินใหม่ (อาจถอด)
- `components/layer-badge.tsx` — ประเมินใหม่ (อาจถอดจาก homepage)

---

## Phase 3: MDX for Static Pages

### 3a. ติดตั้ง @next/mdx

**เป้าหมาย:** ทำให้ `.mdx` files ทำงานใน App Router

**ขั้นตอน:**
1. `npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx`
2. `next.config.mjs` — เพิ่ม MDX plugin:
```javascript
import createMDX from '@next/mdx'

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
```
3. `tsconfig.json` — เพิ่ม `".mdx"` ใน `allowExtensions` หรือเพิ่ม declaration file

### 3b. แปลงหน้า Static เป็น .mdx

**หน้าที่เหมาะกับ MDX** (เนื้อหาเป็นพยางค์ ไม่ใช่ DB-backed):

| หน้า | ปัจจุบัน | เป้าหมาย | เหตุ |
|---|---|---|---|
| `/manifesto` | DB-backed (getPublicEntryBySlug) | **ไม่แปลง** — เนื้อหาจาก DB ไม่ใช่ไฟล์ static |
| `/faq` | lib/content/faq.ts (structured Q&A) | **ไม่แปลง** — เป็น structured data ใช้ Accordion ไม่ใช่พยางค์ |
| `/guide` | page.tsx (service description) | **แปลง** — เป็นพยางค์อธิบายบริการ Jungian Type Analysis |
| `/support` | page.tsx (Covenant/Companion) | **แปลง** — เป็นพยางค์อธิบายการสนับสนุน |
| `/manifesto` (ถ้ามี static version) | — | พิจารณาสร้าง `.mdx` สำรองถ้า DB ไม่พร้อมใช้งาน |

**สร้างไฟล์:**
- `app/guide/page.mdx` — แทน `app/guide/page.tsx`
- `app/support/page.mdx` — แทน `app/support/page.tsx`

**โครงไฟล์ .mdx:**
```mdx
---
title: "บริการ Jungian Type Analysis"
description: "..."
---

import { PageScaffold } from "@/components/page-scaffold"

<PageScaffold
  breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "บริการ" }]}
  kicker="Guide"
  title="บริการ Jungian Type Analysis"
>

## บริการ

เนื้อหาพยางค์...

</PageScaffold>
```

---

## Phase 4: Academic Seals UI

### 4a. SVG Seals (15 ตรา)

**เป้าหมาย:** สร้าง SVG components สำหรับ 15 ตราตาม ACADEMIC-SEALS-DESIGN.md

**โครงสร้างไฟล์:**
```
components/seals/
├── seal-icon.tsx          (base SVG component — shape + symbol + color)
├── seal-data.ts           (seal definitions: id, name, description, shape, color, level, category)
├── seal-gallery.tsx       (grid view — earned + locked)
├── seal-detail-modal.tsx  (detail modal)
└── seal-notification.tsx  (silent notification)
```

**Seal data structure:**
```typescript
interface AcademicSeal {
  id: string;
  slug: string;
  name: string;          // "The Seeker"
  nameThai: string;      // "ผู้แสวงหา"
  description: string;   // ไทย
  shape: "circle" | "octagon" | "hexagon" | "diamond" | "compass";
  color: string;         // hex from level (Slate/Blue/Silver/Gold)
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
  category: "progression" | "domain" | "time" | "support";
  requirement: string;   // ไทย
  isLocked: boolean;     // UI เท่านั้น — ไม่มี DB
}
```

**15 ตรา:**
1. The Seeker (Slate, Circle) — ผู้แสวงหา
2. The Reader (Slate, Circle) — ผู้อ่าน
3. The Collector (Slate, Hexagon) — ผู้รวบรวม
4. The Scholar (Blue, Octagon) — นักวิชาการ
5. The Analyst (Blue, Diamond) — นักวิเคราะห์
6. The Explorer (Blue, Circle) — ผู้สำรวจ
7. The Archivist (Blue, Hexagon) — ผู้จัดเก็บ
8. The Cartographer (Blue, Hexagon) — ผู้ทำแผนที่
9. The Curator (Silver, Octagon) — ผู้ดูแล
10. The Sage (Silver, Diamond) — ผู้รอบรู้
11. The Navigator (Silver, Circle) — ผู้นำทาง
12. The Luminary (Silver, Circle) — ผู้ส่องสว่าง
13. The Architect (Gold, Octagon) — ผู้สร้างสรรค์
14. The Companion (Gold, Compass) — ผู้ร่วมเดินทาง
15. The Patron (Gold, Diamond) — ผู้อุปถัมภ์

**Spec ตาม ACADEMIC-SEALS-DESIGN.md:**
- Flat SVG, outline only, 2px stroke
- Monochrome per level (Slate #465264, Blue #5F8DCE, Silver #C7D0DB, Gold #B89A63)
- Circle/Octagon/Hexagon/Diamond/Compass shapes
- Header "ARCHRON" เล็กบนสุด
- Title + divider + subtitle

### 4b. Seal Gallery + Modal

**Seal Gallery:**
- Grid 64×64px per seal
- Earned seals: full opacity
- Locked seals: opacity 0.3, grayscale
- Filter: All / Earned / Locked
- Sort: Recent / Level / Alphabetical
- Stagger animation (50ms per seal, 300ms total)

**Seal Detail Modal:**
- 120×120px seal
- Name (Thai + English)
- Level + color label
- Description (Thai)
- Earned date (ถ้ามี)
- Close button

### 4c. Seal Notification

- 40×40px seal icon
- "🎓 ได้รับตราวิชาการ" (เปลี่ยน emoji เป็น icon ที่ไม่ใช่ gaming)
- Seal name + requirement
- [ดูตรา] button
- Silent (priority: low)

### 4d. หน้า Profile/Gallery

**เพิ่มใน `app/profile/page.tsx`:**
- Section "ตราประทับวิชาการ"
- แสดง 5 ตราล่าสุด (32×32px)
- "ดูตราทั้งหมด" → seal gallery

---

## Phase 5: Error States + Motion/A11y Audit

### 5a. เพิ่ม error.tsx ในทุก route

**สถานะปัจจุบัน:** 0 error.tsx files
**เป้าหมาย:** ทุก route segment มี error boundary

**สร้าง:**
- `app/error.tsx` (root)
- `app/articles/error.tsx`
- `app/concepts/error.tsx`
- `app/knowledge/error.tsx`
- ... (ทุก route ที่มี page.tsx)

**Template:**
```typescript
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-reading px-6 py-24 text-center">
      <h2 className="font-heading text-2xl text-text-heading">
        เกิดข้อผิดพลาด
      </h2>
      <p className="mt-4 text-text-secondary">
        {error.message || "ไม่สามารถโหลดเนื้อหาได้ กรุณาลองใหม่"}
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg border border-border bg-card px-6 py-3 text-text-heading hover:border-accent hover:text-accent"
      >
        ลองใหม่
      </button>
    </div>
  );
}
```

### 5b. Motion/A11y Audit

**ตรวจสอบ:**

| รายการ | สถานะ | ที่ต้องทำ |
|---|---|---|
| `prefers-reduced-motion` | มีใน globals.css | ตรวจสอบว่าครบทุก animation |
| Focus indicators | มีบางส่วน | เพิ่ม outline ring ทุก interactive element |
| Skip-to-content | มี (`SkipToContent`) | ตรวจสอบว่าเป็น first focusable |
| `aria-live` regions | ไม่มี | เพิ่มใน notification, loading states |
| Touch targets 44×44 | ไม่แน่ใจ | ตรวจสอบ mobile |
| Color contrast | ต้องตรวจใหม่หลังเปลี่ยน primary | `#5F8DCE` บน `#FAF8F5` — ตรวจ 4.5:1 |

---

## File Impact Summary

### ไฟล์ที่แก้ (existing)

| ไฟล์ | Phase | การเปลี่ยน |
|---|---|---|
| `app/globals.css` | 1a, 1b | เปลี่ยน accent color, เพิ่ม Lora, เปลี่ยน body font |
| `app/layout.tsx` | 1b, 1c | เพิ่ม Lora loader, ถอด Material Symbols link |
| `components/site-header.tsx` | 2a | ลด nav เป็น 5 รายการ |
| `components/site-footer.tsx` | 2a | เพิ่มลิงก์ที่ย้ายจาก nav |
| `components/tabbar.tsx` | 2a | ปรับ bottom nav |
| `app/page.tsx` | 2b | เขียนใหม่ตาม homepage-rule |
| `app/profile/page.tsx` | 4d | เพิ่ม seal section |
| `next.config.mjs` | 3a | เพิ่ม MDX plugin |
| `tsconfig.json` | 3a | เพิ่ม .mdx support |
| `package.json` | 3a | เพิ่ม @next/mdx deps |

### ไฟล์ใหม่ (create)

| ไฟล์ | Phase |
|---|---|
| `components/icon-box.tsx` | 1d |
| `app/icons/page.tsx` | 1e |
| `components/seals/seal-icon.tsx` | 4a |
| `components/seals/seal-data.ts` | 4a |
| `components/seals/seal-gallery.tsx` | 4b |
| `components/seals/seal-detail-modal.tsx` | 4b |
| `components/seals/seal-notification.tsx` | 4c |
| `app/guide/page.mdx` | 3b |
| `app/support/page.mdx` | 3b |
| `app/error.tsx` + route-level error.tsx (×N) | 5a |

### ไฟล์ที่อาจถอด (evaluate per phase)

| ไฟล์ | Phase | เหตุ |
|---|---|---|
| `components/hero/vesica-pattern.tsx` | 2b | ถอดจาก homepage ถ้าไม่เข้าโครงใหม่ |
| `components/layer-badge.tsx` | 2b | ถอดจาก homepage |
| `components/timeline/timeline-constellation.tsx` | 2b | ถอดจาก homepage |

---

## Guardrail Considerations

| Guardrail | ผลกระทบ | แนวทาง |
|---|---|---|
| #1 ทำเฉพาะที่สั่ง | ผู้ใช้สั่ง "แก้โครงสร้างทั้งหมดตามนี้" | ทำตาม design docs เท่านั้น |
| #2 ห้ามแตะ global chrome | ต้องแก้ site-header, site-footer, layout.tsx | ผู้ใช้ยินยอมแล้ว (เป็นเนื้องาน) |
| #3 ห้ามแต่งข้อมมขึ้นเอง | Seal names/descriptions มาจาก ACADEMIC-SEALS-DESIGN.md | ใช้ข้อมูลจาก docs ไม่งอกแต่ง |
| #4 คง Thai-first | UI labels แปลไทย | เก็บ English เฉพาะชื่อเฉพาะ (ARCHRON, seal names) |
| #5 คง identity | เปลี่ยนสีจาก brown → blue | ผู้ใช้ยินยอม — เป็นการปรับตาม docs |
| #6 งานหลายขั้น | 5 phases, ~20 ไฟล์ | ผู้ใช้อนุมัติแผนแล้ว |
| #7 ห้ามแก้ schema | Academic Seals UI เท่านั้น — ไม่สร้าง DB table | ไม่แตะ supabase/schema.sql |
| #9 ห้าม commit ถ้า build/lint ไม่เขียว | ทุก phase ต้องผ่าน `npm run build` + `npm run lint` | ตรวจสอบก่อน commit |

---

## AGENTS.md Update

AGENTS.md ปัจจุบันล้าสมัยอย่างหนัก — อธิบาย deep-navy/gold/Material Symbols ที่ไม่ตรงจริง หลังจบงานทั้ง 5 phases ต้องอัปเดต:

- สี: deep-navy/gold → light mode + Blue primary + Premium Gold
- ฟอนต์: Noto Serif Thai/IBM Plex Sans Thai → Playfair/Lora/Inter/Noto Serif Thai/Noto Sans Thai/Cinzel
- Icons: Material Symbols → custom SVG (47 ตัว)
- Routes: เพิ่ม /thinkers, /books, /themes, /disciplines, /timeline, /compare, /explore, /discover, /knowledge, /profile
- Navigation: 8 items → 5 items
- Academic Seals: เพิ่ม section ใหม่

อัปเดต AGENTS.md เป็นขั้นสุดท้ายหลัง implementation ทั้งหมดเสร็จ

---

## Verification Plan

ทุก phase ต้องผ่าน:

```bash
npm run build    # ต้องเขียว
npm run lint     # ต้องเขียว
```

เพิ่มเติมตาม phase:
- Phase 1: ตรวจสีด้วยสายตาทุกหน้า + contrast checker
- Phase 2: ตรวจ navigation ทุก breakpoint (mobile/tablet/desktop)
- Phase 3: ตรวจ .mdx pages render ถูกต้อง
- Phase 4: ตรวจ seal SVG ทั้ง 15 ตัว + gallery + modal
- Phase 5: ตรวจ error.tsx ทุก route + reduced motion

---

End of Design Doc
