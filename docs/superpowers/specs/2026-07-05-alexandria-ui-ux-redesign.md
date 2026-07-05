# Alexandria UI/UX Redesign — ARCHRON

**Date:** 2026-07-05
**Status:** Spec · Pending review
**Goal:** ลด visual noise, สร้าง identity ที่แตกต่างในแต่ละหน้า, ยึดกลิ่นอาย Library of Alexandria

---

## 1. Z-index Scale (รวมใน `globals.css`)

```css
:root {
  --z-base:    0;   /* พื้นหลัง atmosphere */
  --z-surface: 10;  /* content, cards, sections */
  --z-sticky:  30;  /* sticky headers */
  --z-nav:     40;  /* navbar, site-header */
  --z-drawer:  50;  /* mobile menu, drawer */
  --z-overlay: 60;  /* modal, popover, dialog */
  --z-toast:   70;  /* toast, snackbar */
}
```

- เปลี่ยน magic numbers ทั้งหมดใน `overlays.css`, `navigation.css`, `globals.css` ให้อิง `var(--z-*)`
- ทุกหน้าจะมีแค่ 3 layer: base → surface → nav/overlay

---

## 2. Atmosphere System (1 ระบบต่อหน้า)

ตัด `accent-aura` + `atmo-base` + `ambient-observatory` + `hero-grid-3d` + multiple textures → **1 atmosphere per page**

### Common base
```css
.atmo {
  position: fixed; inset: 0; z-index: var(--z-base);
  pointer-events: none;
  background: var(--color-prima);
}
```

### 4 Variants

| หน้า | Atmosphere | รายละเอียด |
|------|-----------|-----------|
| `/` (Home) | Grand Reading Hall | พื้น prima + 1 radial warm gold pulse กลาง (sapientia fade to dark) + papyrus scroll motifs (SVG opacity 5% สองข้าง) + discipline symbols ลอยที่ margin |
| `/articles` | Scriptorium | พื้น prima + psyche wash + dot pattern กระจาย papyrus feel + scroll motifs ขอบบน/ล่าง |
| `/concepts` | Catalog Hall | พื้น prima + cooler slate wash + vertical line "library aisle" effect + warm light ที่ปลายทาง |
| `/articles/[slug]` / `/concepts/[slug]` | Private Reading Chamber | พื้น prima + 1 จุด warm เล็กที่ content area (ตะเกียง) + vignette 70% ขอบ |

---

## 3. Layout Templates (ลดจาก 10+ → 3)

- **`.tpl-reading`** — 760px สำหรับหน้าอ่าน (article/concept)
- **`.tpl-reference`** — 980px สำหรับหน้าสารบัญ (article list, concept list, search)
- **`.tpl-dashboard`** — 1280px สำหรับ studio, timeline

### สิ่งที่ลบ
- `.layout-*`, `.template-*`, `.zone-*`, `.grid-container`, `.container` (Tailwind ครอบคลุม)
- `.reading-column`, `.content-reading`, `.reading-rhythm`, `.prose`
- unused zone CSS

---

## 4. Card System (ลดจาก 7 → 2)

- **`.card-content`** — สำหรับการ์ดเนื้อหา (hover lift → border + translateY)
- **`.card-panel`** — สำหรับ container เปล่า (ไม่มี hover lift)

### สิ่งที่ลบ
- `::before` gradient mask, `::after` corner brackets
- `.archron-card--prima/psyche/lumen/sapientia/mercurius/humanitas` (6 cosmology variants)
- `.archron-card--link`, `.archron-card--lite`, `.archron-panel`
- `.icon-tile`, `.tag-pill`

---

## 5. Typography

- คงฟอนต์เดิม (`--font-heading`/`--font-body`)
- ย้าย `h1-h3` base styles ไป `typography.css`
- `.md-body` เป็นระบบ prose หลัก ไม่มี `.prose`/`.reading-rhythm` ซ้อน

---

## 6. Texture Cleanup

### คงไว้
- `.texture-grain` (ใช้ sparingly)
- `.texture-vignette` (สำหรับ Reading Chamber)

### ลบ
- `.texture-parchment`, `.texture-paper`, `.texture-noise`
- `.texture-glow-gold`, `.texture-glow-psyche`
- `.gradient-fade-bottom`, `.gradient-fade-top`, `.gradient-fade-edges`
- `.surface-elevated`, `.surface-sunken`, `.surface-glass`
- `.border-subtle`, `.border-glow`

---

## 7. Overlays

- เปลี่ยน z-index magic numbers → `var(--z-*)`
- คง `.archron-modal`, `.archron-drawer`, `.archron-toast`
- ลบ `.archron-popover`, `.archron-tooltip` component CSS (มี component แยก)

---

## 8. Navigation

- `.glass-nav` ใช้ `var(--z-nav)`, `.glass-nav-panel` → ใช้ `var(--z-drawer)`
- ลบ `.desktop-only`, `.mobile-only`, `.sidebar-collapsed`

---

## 9. ไฟล์ที่เปลี่ยนแปลง

| ไฟล์ | การเปลี่ยนแปลง |
|------|---------------|
| `globals.css` | เพิ่ม `--z-*` scale · ตัด accent-aura / hero-grid-3d · ลด body gradient · เก็บ atmo base |
| `layout.css` | ลดเหลือ 3 templates |
| `containers.css` | ตัด `.container-*` variant, `.prose` |
| `rhythm.css` | ตัด `.reading-rhythm` |
| `texture.css` | เหลือแค่ grain + vignette |
| `overlays.css` | z-index → `var(--z-*)` |
| `typography.css` | รวม h1-h3, prose base |
| `cards.css` | เหลือ 2 variants, ตัด pseudo-elements |
| `navigation.css` | z-index cleanup, ลบ unused |
| `grid.css` | คงไว้ |

---

## 10. Scope & Non-goals

### In scope
- CSS refactor ตาม 10 ไฟล์ข้างบน
- Layout consistency ทุก public route
- Visual identity แตกต่างใน 4 กลุ่มหน้า
- Performance: ลด paint layer, backdrop-filter, `::before`/`::after` effects

### Out of scope (ไม่ทำในรอบนี้)
- เปลี่ยนฟอนต์, เปลี่ยน brand color palette
- ย้ายหรือเขียน component ใหม่ (site-header, site-footer)
- เพิ่มเนื้อหา หน้า หรือ route ใหม่
- เปลี่ยน Studio/staff-only area
- Any React component logic changes

---

## 11. ไม่มี TBD, TODO, หรือ placeholder
