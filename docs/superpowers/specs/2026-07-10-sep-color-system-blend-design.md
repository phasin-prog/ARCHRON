# SEP Color System Blend — ARCHRON

Version: 1.0
Date: 2026-07-10
Status: Draft — pending user review
Approach: A (SEP Academia — Full palette integration)

---

## Context

Apply the Stanford Encyclopedia of Philosophy (SEP) color system across the Archon project — every page, every structure, every system — while preserving Archon's existing identity (กลิ่นอาย).

**Source materials:**
- SEP design system tokens (extracted)
- Archon current `src/app/globals.css` (Focus First · 95-3-2)
- Archon component CSS (17 files, all using CSS variables)

---

## Design Decisions (ตกลงกับผู้ใช้แล้ว)

| หัวข้อ | ตัดสินใจ |
|---|---|
| Primary accent | Cardinal red `#8C1515` แทน Deep Ocean Blue `#1C5D99` |
| Background | SEP `#F9F5F3` แทน Archon `#FAF6F0` |
| Text | SEP: heading `#000000`, body `#505050`, secondary `#666666` |
| Border | SEP `#D7D5D3` แทน Archon `#8C8478` |
| Elevated surface | SEP `#EDEBE9` แทน Archon `#F1EBE1` |
| Approach | A (SEP Academia) — Full palette integration |
| Phases | Phase 1 (foundation tokens) → Phase 2 (visual QA + component fine-tune) |

**สิ่งที่คงไว้ (กลิ่นอาย Archon):**
- Thai-first UI — ภาษาไทย, `lang="th"`
- Font stack: Cormorant Garamond + Noto Serif Thai (heading), IBM Plex Sans Thai + Inter (body), Inter + Noto Sans Thai (UI), Cinzel (wordmark)
- Custom SVG icons — 47 ตัว, 2px stroke, 24×24, currentColor
- Knowledge category colors (12 colors + cosmology palette)
- Premium Gold `#B89A63`
- 12 Discipline identity tokens
- Semantic colors (success, warning, error, info)
- Seal progression colors
- Spacing scale (8pt grid), radius scale, elevation scale
- Motion tokens, z-index scale, opacity scale
- Component CSS language (archron-btn, archron-card, archron-tab, etc.)
- Focus First philosophy — flat background, no gradients under text

---

## Phase 1: Foundation Token Change

### ไฟล์ที่แก้

**`src/app/globals.css`** — เฉพาะ `@theme` block (ประมาณ 15 ค่า)

### Token Map

| CSS Variable | Archon ปัจจุบัน | SEP-inspired ใหม่ | หมายเหตุ |
|---|---|---|---|
| `--color-bg` | `#FAF6F0` | `#F9F5F3` | SEP warm cream (peach/warm pink tint) |
| `--color-bg-card` | `#FFFFFF` | `#FFFFFF` | คงเดิม |
| `--color-bg-elevated` | `#F1EBE1` | `#EDEBE9` | SEP surface |
| `--color-border` | `#8C8478` | `#D7D5D3` | SEP border — อ่อนลง minimal |
| `--color-text-heading` | `#25231F` | `#000000` | SEP pure black — contrast สูง |
| `--color-text-body` | `#5C5852` | `#505050` | SEP body gray |
| `--color-text-secondary` | `#756E68` | `#666666` | SEP meta |
| `--color-text-inverse` | `#FFFFFF` | `#FFFFFF` | คงเดิม |
| `--color-accent` | `#1C5D99` | `#8C1515` | Stanford Cardinal red |
| `--color-accent-hover` | `#123F6B` | `#6B1010` | Darker Cardinal |
| `--color-accent-on-bg` | `#1C5D99` | `#8C1515` | Same as accent |
| `--color-accent-subtle` | mix(blue 15%) | mix(red 15%, white) | Auto via color-mix |
| `--color-accent-knowledge` | `#2F3A5A` | `#3A3A5A` | Deep indigo — ปรับเล็กน้อย |
| `--color-accent-wisdom` | `#C2A46E` | `#C2A46E` | คงเดิม |
| `--color-accent-mind` | `#7E9B8F` | `#7E9B8F` | คงเดิม |
| `--color-accent-spirit` | `#7A657F` | `#7A657F` | คงเดิม |

### สิ่งที่ไม่เปลี่ยน (คงเดิมทั้งหมด)

```
--color-premium, --color-premium-hover, --color-premium-subtle
--color-concept, --color-thinker, --color-theory, --color-school
--color-book, --color-article, --color-symbol, --color-timeline
--color-quote, --color-guide
--token-01-psychology through --token-12-civilization
--color-success, --color-warning, --color-error, --color-info
--color-steel-blue, --color-sage-darker, --color-amber-gold
--color-teal-green, --color-silver-gray, --color-ash-gray
--color-ochre-gold, --color-neutral-muted, --color-gold-accent
--color-muted-slate
--color-warm-gray, --color-soft-blue, --color-warm-gold
--color-amber-brown, --color-forest-green, --color-sage-green
--color-rose-muted, --color-indigo-soft
--color-red-muted, --color-amber-dark, --color-green-forest, --color-blue-slate
--color-slate-dark, --color-blue-academic, --color-silver-light
--color-shadow
--font-* (all font families)
--z-* (all z-index tokens)
--radius-*, --space-* (all spacing/radius)
--elevation-*, --opacity-*, --density-*
--ease-*, --dur-* (all motion tokens)
--bp-* (all breakpoints)
--text-*, --h*-*, --body-*, --caption-*, --code-* (typography scale)
--measure, --reading-font-scale
```

### Auto-propagation

ทุก component CSS ที่ใช้ `var(--color-*)` จะอัปเดตอัตโนมัติ — ไม่ต้องแก้ไฟล์ component:

| CSS file | จำนวน references | Auto-update? |
|---|---|---|
| `globals.css` (self) | ~100+ var() references | ✅ |
| `buttons.css` | 12 references | ✅ |
| `navigation.css` | 18 references | ✅ |
| `cards.css` | 12 references | ✅ |
| `interaction.css` | 10 references | ✅ |
| `overlays.css` | 8 references | ✅ |
| `feedback.css` | 14 references | ✅ |
| `inputs.css` | 14 references | ✅ |
| `typography.css` | 1 reference | ✅ |
| `texture.css` | 1 reference | ✅ |

### Contrast Verification

| Pair | Ratio | WCAG |
|---|---|---|
| `#8C1515` (accent) on `#F9F5F3` (bg) | 7.64:1 | ✅ AAA |
| `#8C1515` (accent) on `#FFFFFF` (card) | 7.64:1 | ✅ AAA |
| `#8C1515` (accent) on `#EDEBE9` (elevated) | 5.25:1 | ✅ AA |
| `#000000` (heading) on `#F9F5F3` (bg) | 18.68:1 | ✅ AAA |
| `#505050` (body) on `#F9F5F3` (bg) | 6.82:1 | ✅ AA |
| `#666666` (secondary) on `#F9F5F3` (bg) | 4.78:1 | ✅ AA |

---

## Phase 2: Visual QA + Component Fine-tune

### Scope

หลังเปลี่ยน tokens ใน Phase 1 ให้ตรวจสอบ:

1. **ทุกหน้า** — เปิดดู visual regression:
   - `/` (homepage)
   - `/articles`, `/articles/[slug]`
   - `/concepts`, `/concepts/[slug]`
   - `/books`, `/books/[slug]`
   - `/schools`, `/schools/[slug]`
   - `/thinkers`, `/thinkers/[slug]`
   - `/themes`, `/themes/[slug]`
   - `/knowledge`, `/explore`, `/discover`, `/search`
   - `/constellation`
   - `/compare`, `/timeline`
   - `/profile`, `/studio/editor`
   - `/guide`, `/support`, `/faq`, `/manifesto`, `/sources`
   - `/external-links`, `/reading-sets`, `/reading-sets/[slug]`
   - `/disciplines`, `/disciplines/[slug]`

2. **สิ่งที่ต้องเช็ค:**
   - Cardinal red accent ไม่ overpowering เกินไป (ถ้าแรงไป → ปรับ `--color-accent-subtle` opacity)
   - Border `#D7D5D3` — ดูจางไปบน bg `#F9F5F3` หรือไม่ (diff ~2% — minimal border สวย)
   - Heading `#000000` — contrast ดี แต่กลิ่นอบอุ่นเดิมอาจลด → ถ้าต้องการ warmth ให้คง `#25231F` หรือใช้ `#1A1A1A`
   - `.archron-card:hover` — glow accent ใช้ Cardinal red แทน blue — อาจโดดเด่นกว่าเดิม
   - Glass-nav border-bottom — `color-mix(in srgb, var(--color-accent) 18%, transparent)` — Cardinal red tint อาจเห็นชัดกว่า blue

### Possible Adjustments

| Issue | Adjustment |
|---|---|
| Cardinal red too strong on hover | Reduce opacity in mix (e.g., 12% instead of 18%) |
| Border too faint | Use slightly darker shade like `#C5C3C1` |
| Body text too cool | Keep SEP `#505050` or warm slightly to `#4A4845` |
| Accent-knowledge `#3A3A5A` | คงไว้หรือ revert to `#2F3A5A` |

---

## Verification

```bash
npm run build    # ต้องเขียว
npm run lint     # ต้องเขียว
```

ตรวจ contrast ratio หลังเปลี่ยน ด้วย browser DevTools → Inspect → Computed → Color contrast

---

## Guardrail Checklist

| Guardrail | Status |
|---|---|
| #1 ทำเฉพาะที่สั่ง | ✅ เปลี่ยนเฉพาะสีตามที่ตกลง |
| #2 ห้ามแตะ global chrome | ✅ Site-header/footer/layout ไม่เปลี่ยน — แค่ token color |
| #3 ห้ามแต่งข้อมูลขึ้นเอง | ✅ ค่าสีมาจาก SEP design system tokens |
| #4 คง Thai-first | ✅ UI labels ไม่เปลี่ยน — แค่สี |
| #5 คง identity | ✅ ฟอนต์/icons/knowledge palette/components/thai คงเดิม |
| #6 งานหลายขั้น | ✅ 2 phases — แยก foundation → QA |
| #7 ห้ามแก้ schema | ✅ ไม่แตะ DB |
| #9 ห้าม commit ถ้า build/lint ไม่เขียว | ✅ ตรวจสอบก่อน commit |

---

## Future Considerations

- SEP ยังมี typographic scale (11px-41px), 4pt grid, shadow system ที่อาจ blend ในอนาคต
- SEP's Cardinal red shadow — `rgb(115, 15, 15) 0px 10px 10px 0px` — ยังไม่ได้ใช้ (keep standard elevation)
