# 🗺️ Redesign Rollout — ธีม "แผ่นจารดาราศาสตร์" ทีละหน้า

> แผนงานต่อเนื่องสำหรับ AI/นักพัฒนา — อ่านคู่กับ `AGENT-HANDOFF.md` (§12 ระบบดีไซน์) เสมอ
> อัปเดตสถานะทุกครั้งที่ทำหน้าเสร็จ · อ้างอิง audit เต็มจากเธรดออกแบบ (Hyperagent, 2026-07-02)

## ชุดเครื่องมือกลาง (Foundation Kit — พร้อมใช้แล้ว)

| ชิ้นส่วน | ไฟล์ | ใช้ทำอะไร |
|---|---|---|
| `.kicker` / `.kicker-en` | `app/globals.css` | ป้ายนำสายตา — **ไทยห้าม letterspace/uppercase** · ละตินเท่านั้นที่ tracking ได้ |
| `.btn` `.btn-primary` `.btn-ghost` | `app/globals.css` | ปุ่มระบบเดียวทั้งเว็บ (แทนปุ่ม ad-hoc ทุกสูตร) |
| `.card-plate` + `.plate-tick` | `app/globals.css` | การ์ดหน้ากระดาษ + ขีดมุม — **hover เอฟเฟกต์เดียว** |
| `.plate-frame` | `app/globals.css` | กรอบเพลทคู่ (hero/ส่วนพิเศษ) |
| `<PageHeader>` | `components/page-header.tsx` | เทมเพลตหัวหน้า: breadcrumb + kickerEn/kicker + title (fluid-h1) + lead 62ch + emblem slot + เส้นฐานพิกัด |
| `<PlateBackdrop>` | `components/plate/plate-backdrop.tsx` | ฉากหลังกริดจาร — `subtle` (หน้าเนื้อหา) / `section` (ส่วนคั่น มีขีดพิกัด+ดาว) |
| `<PlateEmblem>` | `components/plate/plate-emblem.tsx` | "ตราสลัก" ครอบไอคอนใดก็ได้ — **แทน icon-tile เดิมทุกจุด** |
| ไอคอน 44 ตัว | `components/icons.tsx` | ครอบคลุมทุกหน้าแล้ว (KnowledgeHub/Person/AuthorPen/Book/Concept/School/Source/ExternalLink/Heart/Path ฯลฯ) — ไม่ต้องวาดเพิ่ม ใช้ผ่าน PlateEmblem |

### กติกาที่ใช้ทุกหน้า (จาก HANDOFF §12 + audit)
1. สีทุกจุดผ่าน token: `var(--color-*)` / `var(--cos-*)` / `var(--mix-*)` — **ห้าม hex ตรง ห้าม `${accent}40` string-concat** (ใช้ `color-mix()`)
2. ตัด anti-patterns: icon-tile · side-stripe · glow blob · hover ซ้อนหลายเอฟเฟกต์ · rounded-2xl การ์ดสูตรเดียว
3. ไทยไม่ letterspace/uppercase/font-mono — ป้ายละตินใช้ `.kicker-en`
4. ปุ่ม/CTA ทุกจุดผ่าน `.btn*` · empty state ใช้ `<EmptyState>` กลาง
5. Bridge tokens (`--mix-*`) ใช้เฉพาะ edge/gradient/hover เท่านั้น
6. ห้ามแตะ global chrome (`site-header`/`site-footer`/`layout`/`template`) จนกว่าจะถึงเฟสของมันและได้รับคำสั่ง
7. ทุกหน้า: `npm run build` + `npm run lint` เขียวก่อน commit

## สถานะรายหน้า (เรียงตามลำดับที่จะทำ)

### 0. ✅ หน้าแรก `/` — เสร็จ (PR #9)
### 1. ✅ คลังความรู้ `/knowledge` — เสร็จ (PR #10 นำร่อง Foundation Kit)
hex 6 จุด→tokens · การ์ด rounded-2xl+icon-tile+glow+hover 4 ชั้น→card-plate · badge "ใหม่" เลิก mono/uppercase · header→PageHeader+PlateEmblem+PlateBackdrop

### 2. ⬜ Profile `/profile` — ง่าย
- ใช้ PageHeader อยู่แล้ว → ได้ kicker ใหม่อัตโนมัติ ตรวจผลแล้วพอ
- unify badge/pill ad-hoc (บรรทัด ~132/213/309/371) เป็น `.tag-pill` เดียว
- เหรียญตราวงกลม tint → `PlateEmblem` ขนาดเล็ก
- คง EmptyState ที่มีอยู่ (ดีแล้ว)

### 3. ⬜ Studio `/studio` (landing) — ยาก
- glow blob 2 จุด (`blur-[130px] animate-pulse`) → ตัด/แทน PlateBackdrop `section`
- ปุ่ม 3 สูตร ad-hoc → `.btn-primary`/`.btn-ghost`
- tracking บนไทย: "Studio · ห้องเขียนของนักเขียน" / "ผู้ดูแลระบบ/นักเขียน" → `.kicker`
- กล่อง rounded-lg/md/sm ปนกัน → `.card-plate`
- Clerk `appearance.variables` (hex 5 ค่า — จำเป็นเพราะ third-party) → อัปเดตให้ตรง palette ปัจจุบัน และคอมเมนต์กำกับว่า mirror มาจาก token ใด

### 4. ⬜ บทความ `/articles` — กลาง
- PageHeader ได้ผลอัตโนมัติ · เพิ่ม emblem (BookIcon)
- ปุ่ม empty-state 2 ปุ่ม → `.btn` (โค้ดซ้ำกับ reading-sets — แยก helper ได้)
- ตรวจ `e.framework` เป็นไทยไหม → ถ้าไทย ตัด uppercase/tracking (ใช้ `.kicker`)
- hex fallback ในสตริง `var(--cosmology-accent,#CBA45A)` → เอา fallback ออก (token ประกาศแล้ว)

### 5. ⬜ แนวคิด `/concepts` — ง่าย (สะอาดสุดในกลุ่ม)
- PageHeader อัตโนมัติ + emblem (ConceptIcon)
- การ์ด archron-card ระบบกลางอยู่แล้ว → พิจารณา migrate เป็น "การ์ดโหนด" (ทรงเม็ด ตาม mockup B) ในจังหวะเดียวกับหน้า constellation เพื่อภาษาเดียวกัน

### 6. ⬜ นักคิด `/thinkers/[slug]` — กลาง
- header กล่อง custom + glow blob → กรอบเพลท + PlateBackdrop
- ป้ายไทย "นักปราชญ์ / ผู้สร้างสรรค์แนวคิด" tracking → `.kicker`
- related-list การ์ด custom → `.card-plate`
- material-symbols ปนไอคอนระบบ → ใช้ icons.tsx ให้สม่ำเสมอ
- empty state inline → `<EmptyState>`

### 7. ⬜ สำนักคิด `/schools` — ยาก (หนักสุด)
- side-stripe + icon-tile ในการ์ดเดียว → `.card-plate` + `PlateEmblem`
- `${meta.accent}40/14` string-concat → `color-mix(in srgb, ...)` (ตรวจ discipline-meta.tsx ให้ accent เป็น token)
- kicker หน้า → PageHeader ระบบใหม่
- empty state ค้นหา inline → EmptyState
- ระวัง: schools-hub เป็น client component ใหญ่ (search/A-Z/modal) — แตะเฉพาะชั้น presentation

### 8. ⬜ แหล่งอ้างอิง `/sources` — ยาก (hex หนาแน่นสุด)
- hex ใน data array (TIERS + SAMPLE_ENTRIES) + `${accent}55/1a/14` ทุกจุด → tokens + color-mix
- icon-tile + top accent bar → card-plate + PlateEmblem
- `SectionLabel` (เลข 01/02 + เส้น gradient) — เข้าข่าย numbered-section-marker: คงได้เพราะเป็น "ลำดับชั้นจริง" แต่ปรับโทนเป็นขีดพิกัดเพลท
- กล่อง "coming soon" → EmptyState

### 9. ⬜ ทรัพยากรภายนอก `/external-links` — ง่าย
- kicker ไทย tracking-[0.05em] → `.kicker` ผ่าน PageHeader
- การ์ดสะอาดอยู่แล้ว → เติม plate-tick พอ
- เพิ่ม empty state (ตอนนี้ category ว่าง = grid ว่างเงียบๆ)
- ตรวจ tag `font-mono` — ถ้า data มีไทย ตัด

### 10. ⬜ สนับสนุน `/support` — กลาง
- การ์ด 2 สูตรในหน้าเดียว (WAYS custom / ACTIONS icon-tile) → `.card-plate` เดียว
- icon-tile → PlateEmblem (HeartIcon)
- PageHeader อัตโนมัติ

### 11. ⬜ ซีรีส์การอ่าน `/reading-sets` — ง่าย
- **แก้บั๊กโครงสร้าง**: archron-card ผสม inline border/radius ที่ override กันเอง (บรรทัด ~59) — ลบ inline ออก
- ปุ่ม empty-state 3 ปุ่ม → `.btn` (รวม helper กับ articles)
- PageHeader อัตโนมัติ + emblem (PathIcon)

## เฟสถัดไป (นอกลิสต์นี้ — รอคำสั่ง)
- หน้าอ่าน (`reading-page.tsx`) · `/search` · `/faq` · `/guide` · `/manifesto` · `/disciplines`
- Global chrome: `site-header` / `site-footer` — ต้องได้รับคำสั่งชัดเจนก่อน (HANDOFF §2)

## โครงสร้างพื้นฐานที่เชื่อมแล้ว (สำหรับงานอนาคต)
- **Supabase**: project `archron` (ref `lmxubdkjbcnsiqvfmwnb`, ap-southeast-1, ACTIVE_HEALTHY) — ผ่าน MCP: query/migration/logs/advisors/edge functions
- **Cloudflare**: ผ่าน MCP (docs/search/execute) — R2 media bucket ใช้อยู่ใน `/api/media`
- **GitHub**: push + PR ผ่าน MCP — สาย PR: #8 (perf) → #9 (redesign เฟส 1+2) → #10 (foundation kit + คลังความรู้)
