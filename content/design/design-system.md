# The Soul's Compass — Design System v0.1

> Phase 2 — Design System · จัดทำโดย Orchestrator (draft) · อิง Brand Foundation v0.1
> ⚠️ draft จาก Orchestrator — Design System Agent เป็นเจ้าของจริง ให้ review + รับรองเป็น v1
> token ใน tailwind.config.ts และ base style ใน app/globals.css ถูกอัปเดตตามเอกสารนี้แล้ว (ยังไม่ verify build)

---

## Visual Mood
**ควรเป็น:** midnight archive · philosophical library · quiet observatory · symbolic knowledge map · refined study room
**ไม่ควรเป็น:** fantasy RPG · tarot/occult shop · luxury perfume brand · crypto dashboard · generic SaaS landing · self-help site · academic PDF ที่แห้งเกินไป

---

## Color Tokens

### Background
- midnight `#0B1020` (page bg หลัก)
- deep-navy `#101827`
- charcoal `#171717`

### Surface (ลำดับชั้นพื้นที่ — card/panel/nav/callout)
- surface-1 `#121A2A`
- surface-2 `#182234`
- surface-3 `#202B3D`

### Text
- ivory `#F5F0E6` (เนื้อหา/heading)
- soft-ivory `#E7DDCC`
- muted `#A8A29E`
- subtle `#78716C`

### Accent (ใช้จำกัด — แสงของความรู้)
- antique-gold `#C8A85A`
- bronze `#9B6B3D`
- soft-gold `#D8C58A`
> ห้ามใช้ทองเป็นพื้นใหญ่ หรือมากจนดู luxury fake / สายมู

### Semantic (นุ่ม ไม่ฉูดฉาด)
- success `#7A9B76` · warning `#C2A15A` · danger `#B46A5A` · info `#6F8FAF`

---

## Typography

**Mood:** อ่านง่าย · สงบ · มีน้ำหนัก · เหมาะบทความภาษาไทยยาว

- **Heading:** Noto Serif Thai (refined / literary / philosophical)
- **Body:** IBM Plex Sans Thai (อ่านได้นาน เน้น line-height)
- **Metadata/mono:** ใช้เท่าที่จำเป็น ไม่ให้ดูเป็น dev dashboard

> 🔧 **งาน Frontend:** โหลดฟอนต์จริงผ่าน `next/font/google` (Noto_Serif_Thai, IBM_Plex_Sans_Thai) แล้วผูกกับ `--font-serif` / `--font-sans` — ปัจจุบัน globals.css/tailwind ใช้ font-family fallback ไว้ก่อน

### Type Scale
xs .75 · sm .875 · base 1 · md 1.0625 · lg 1.25 · xl 1.5 · 2xl 2 · 3xl 2.5 · 4xl 3.25 (rem)

### Line Height
tight 1.2 · heading 1.35 · body 1.75 · reading 1.85
> บทความไทยใช้ line-height กว้างพอ อย่าบีบเหมือนเว็บข่าว

---

## Spacing Scale (rem)
1:.25 · 2:.5 · 3:.75 · 4:1 · 5:1.25 · 6:1.5 · 8:2 · 10:2.5 · 12:3 · 16:4 · 20:5 · 24:6
หลัก: section ใหญ่มีพื้นที่หายใจ · card grid ไม่แน่น · article มี paragraph rhythm · ไม่สุ่มทีละหน้า

---

## Radius / Border / Shadow
- **Radius:** sm .375 · md .75 · lg 1 · xl 1.5 · full 999px (อย่าโค้งจนดู playful/SaaS)
- **Border:** subtle `rgba(245,240,230,0.08)` · soft `rgba(200,168,90,0.18)` · accent `rgba(200,168,90,0.35)`
- **Shadow:** soft `0 18px 50px rgba(0,0,0,.24)` · card `0 12px 34px rgba(0,0,0,.20)` — ใช้น้อย เว็บนี้ดูนิ่ง

---

## Component Rules

### Button
- **Primary** (action สำคัญ): พื้น antique gold/bronze สงบ, text อ่านชัด, radius กลาง, hover เบา, ไม่ glow, ห้าม copy ขายฝัน
- **Secondary**: transparent/surface, border subtle, text ivory
- **Ghost**: ไม่มีพื้น, hover เบา, ไม่เด่นกว่า content

### Card
- **Article**: title เด่นกว่า excerpt, surface นุ่ม, border subtle
- **Concept**: ดูเป็น node, accent เล็กน้อย, ต่างจาก article card
- **Source**: archive-like, readable, ไม่ decorative
- **Series**: ให้ความรู้สึกเป็นเส้นทางการอ่าน ไม่ใช่กล่องโปรโมตคอร์ส

### Badge / Tag
บอก concept/school/thinker/type — เล็ก, contrast พอดี, ไม่ใช้สีเยอะ, ไม่ทำให้หน้าเหมือน dashboard

### Divider
เส้นบาง สี subtle อาจมี accent เล็กน้อย — ห้าม ornament เยอะ

### Callout
ประเภท: Note / Source / Caution / Interpretation / Related Concept — ห้ามสีจัดเหมือน docs tool

### Form field / Dropdown (สำหรับ Studio Editor)
Field อ่านง่าย, label ชัด, dropdown รายการเยอะต้องมี search, empty state สุภาพ — ไม่ทำให้ editor เหมือน SaaS

---

## Visual Hierarchy
- Heading บอกโครงสร้างความคิด ไม่ใช่แค่แต่งหน้า
- Accent ใช้เฉพาะจุดนำสายตา (active link, underline, section label, key node) ไม่กระจายทุกที่
- Empty space เป็นส่วนหนึ่งของระบบ — ให้ที่ผู้อ่านหยุดคิด

---

## Responsive
- **Desktop:** article body ไม่กว้างเกิน (≈ max-w reading), grid มี rhythm
- **Tablet:** ลด column, heading ไม่แตกบรรทัดแย่
- **Mobile:** body อ่านง่าย, button แตะง่าย, ลด ornament, ไม่มี horizontal scroll

---

## Style Risk Detection
- **Fantasy:** glow เยอะ / symbol เยอะ / gold+dark หนัก / card เหมือน RPG
- **Occult:** sacred geometry หนัก / moon-compass-ritual เยอะ / ทอง+ดำเหมือนร้านไพ่
- **SaaS:** card สะอาดแบบ startup / ปุ่มเหมือน landing ขายของ
- **Academic dryness:** สีแห้ง / ไม่มี rhythm / typography แข็ง

---

## Quality Gate
อ่านง่าย · ใช้ซ้ำได้ · ไม่สุ่ม · ไม่ fantasy · ไม่สายมู · ไม่ SaaS generic · ไม่ academic แห้ง · ไม่ marketing เกิน · รองรับ mobile + บทความยาว + Wiki nodes · ส่งต่อ Frontend implement ได้จริง
