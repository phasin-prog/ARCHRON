# The Soul's Compass — คลังความรู้จิตใจมนุษย์

> คลังความรู้ภาษาไทยสำหรับ **ศึกษาจิตใจมนุษย์อย่างมีบริบท** ผ่านจิตวิทยา จิตวิเคราะห์
> ปรัชญา ประสาทวิทยาศาสตร์ สัญลักษณ์ ภาษา และทฤษฎีความรู้ — โดยแยก
> **แหล่งที่มา · ข้อเท็จจริง · การตีความ** ออกจากกันอย่างชัดเจน

สถานะ: **Editor v1 (ฝั่งโค้ด) เสร็จครบ** · build / lint เขียว · deploy บน Vercel
สแตก: **Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase · Clerk**

---

## จุดยืนของโครงการ

The Soul's Compass เป็น **ระบบความรู้แบบเชื่อมโยง (Wiki / Knowledge Graph)** ในแนว Obsidian
ที่วางแนวคิดไว้ในบริบทเดิม แล้วพาผู้อ่านเดินจากแนวคิดหนึ่งไปอีกแนวคิดอย่างมีเหตุผล

**สิ่งที่โครงการนี้เป็น**
- คลังความรู้เชิงวิชาการ อ่านได้ ตรวจสอบที่มาได้ เชื่อมโยงข้ามศาสตร์ได้
- ภาษาไทยเป็นหลัก (Thai-first) — ทั้งเว็บไม่มี language switcher / EN routes

**สิ่งที่โครงการนี้ไม่เป็น**
- ❌ สายมู / ทำนายดวง ❌ self-help / สูตรสำเร็จ ❌ คลินิก / วินิจฉัยทางการแพทย์
- ❌ เกม/แฟนตาซี ❌ เว็บการตลาด ❌ เว็บบทความทั่วไป

> “เราไม่รีบทำให้ความซับซ้อนกลายเป็นคำตอบง่าย ๆ — แต่ทำให้ความซับซ้อนนั้นอ่านได้ ตรวจสอบได้ และเชื่อมโยงกันได้มากขึ้น”

---

## สิ่งที่สร้างไปแล้ว (ภาพรวมระบบ)

### เว็บสาธารณะ (Public)
- **หน้าแรก** — hero, เสาหลักของแนวทาง, แผนที่ความรู้ 6 หมวด, คำประกาศ (Manifesto), ทางลัด
- **บทความ** (`/articles`) และ **คลังแนวคิด/Wiki** (`/concepts`) + หน้า node รายตัว
- **หน้าอ่าน Unified** (ใช้ร่วมทั้ง Article/Concept): breadcrumb → header → meta-grid 4 ช่อง
  (กรอบทฤษฎี · นักคิดหลัก · ระดับการอ่าน · เวลาอ่านโดยประมาณ) → เนื้อหา → ที่มาของคำ →
  การ์ดแนวคิดที่เกี่ยวข้อง (พร้อมป้ายความสัมพันธ์) → เอกสารอ้างอิง → กล่องบริการ
- **ลิงก์ภายในแบบ `[[wikilink]]`** — แปลงเป็นลิงก์จริงไปยัง node, ลิงก์เสียถูกตรวจจับได้
- **Backlinks** — node แต่ละตัวแสดงบทความที่อ้างถึงมัน
- หน้า **ซีรีส์การอ่าน** (`/reading-sets`), **แหล่งอ้างอิง** (`/sources`),
  **Manifesto** (`/manifesto`), **สนับสนุน** (`/support`)
- หน้าสาธารณะดึงข้อมูลจาก **Supabase (เฉพาะ published)** และ **fallback ไป seed static**
  ถ้า DB ว่าง พร้อม **ISR** (revalidate 5 นาที + on-demand เมื่อเผยแพร่)

### Studio — ระบบเขียน/แก้เนื้อหา (`/studio/editor`)
- ป้องกันด้วย **Clerk** (ต้อง login) · เขียนลง **Supabase** ผ่าน **RLS** (เห็น/แก้ได้เฉพาะของตน)
- **Autosave** ทุก 2.5 วินาที + ปุ่ม “บันทึก + เวอร์ชัน”
- **ประวัติเวอร์ชัน (version history)** — กู้คืน snapshot ได้
- ฟิลด์เนื้อหาแบบ **Markdown** (react-markdown + remark-gfm, render แบบ sanitize)
- ตัวช่วย **internal link** + **Related Concept Picker** จาก Concept Registry
- **เผยแพร่จริง (Publish)** — ตรวจ Publish Checklist + ลิงก์เสีย → ตั้ง `published`,
  `published_at`, เก็บ snapshot, แล้ว `revalidatePath` หน้าสาธารณะ

### บริการ (`/guide`)
- **Jungian Type Analysis** — บริการอ่านโครงสร้าง Ego ตามกรอบ *Psychological Types* ของ Jung
  (อ่าน “แนวโน้ม” ไม่ใช่ตัดสินด้วยป้ายสำเร็จรูป — ไม่วินิจฉัย/ไม่ทำนาย/ไม่ทายโชค)

---

## สแตกเทคโนโลยี

| ส่วน | เทคโนโลยี |
|---|---|
| Framework | Next.js `^16` (App Router, RSC, ISR) |
| UI | React `^19`, Tailwind CSS `^4` (CSS-first `@theme`) |
| เนื้อหา Markdown | `react-markdown` `^9` + `remark-gfm` `^4` |
| ฐานข้อมูล | Supabase (Postgres + Row Level Security) |
| Auth | Clerk (+ Supabase Third-Party Auth) |
| ฟอนต์ | Noto Serif Thai (หัวข้อ) · IBM Plex Sans Thai (เนื้อหา) · Material Symbols (ไอคอน) |
| Lint | ESLint 9 (flat config) + `eslint-config-next` |

---

## โครงสร้างโปรเจกต์

```
app/
  page.tsx                 หน้าแรก
  layout.tsx               root layout (ฟอนต์, SiteHeader/Footer, Material Symbols)
  globals.css              Tailwind v4 + design tokens + component CSS
  articles/ concepts/      หน้า list + [slug] (ดึง DB → fallback static, ISR)
  reading-sets/ sources/ manifesto/ support/
  guide/                   หน้าบริการ Jungian Type Analysis
  studio/editor/           ตัวแก้ไขเนื้อหา (Clerk-protected) + server action revalidate
components/
  site-header.tsx          glass-nav (sticky) + เมนูมือถือ
  site-footer.tsx          footer 3 คอลัมน์ + จดหมายข่าว
  reading/                 ReadingPage (หน้าอ่าน Unified) + InternalLinkText
  studio/                  Editor widgets (pickers, revision panel, link suggestions)
  scroll-reveal.tsx        IntersectionObserver (progressive enhancement)
lib/
  content/                 entries (seed), concept-registry, mappers, queries,
                           publish-validation, internal-links, related, public-source
  supabase/                client (Clerk token) + server (anon) clients
types/content.ts           โมเดลเนื้อหา (ContentEntry ฯลฯ)
supabase/schema.sql        ตาราง entries + entry_revisions + RLS policies
docs/                      orchestrator.md · supabase-clerk-setup.md · verify-build-checklist.md
```

---

## การติดตั้งและรัน

ต้องมี **Node.js ≥ 20.9**

```bash
npm install
npm run dev        # เปิด http://localhost:3000
npm run build      # production build
npm run lint       # ESLint (flat config)
```

### ตั้งค่า Environment (`.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

> หากยังไม่ใส่คีย์ Clerk เว็บสาธารณะยังเปิดได้ปกติ (middleware จะปล่อยผ่าน) — แต่ `/studio` จะยังใช้งานจริงไม่ได้
> และถ้ายังไม่ตั้ง Supabase หน้าสาธารณะจะ fallback ไปแสดง seed static อัตโนมัติ

### เปิดใช้ Studio / ฐานข้อมูล (ทำใน dashboard)
1. รัน `supabase/schema.sql` ใน Supabase SQL Editor (สร้างตาราง + RLS)
2. ตั้ง **Clerk เป็น Third-Party Auth** ใน Supabase ให้ `auth.jwt()->>'sub'` ตรงกับ Clerk user id
3. ทดสอบ RLS: ผู้ใช้ A แก้ของ B ไม่ได้ และ draft ไม่หลุดสู่ public

รายละเอียดดูที่ [`docs/supabase-clerk-setup.md`](docs/supabase-clerk-setup.md)

---

## ระบบดีไซน์

โทน: **“หอสมุดยามค่ำ + หอดูดาวของจิตใจ + สถาบันความรู้ร่วมสมัย”** — ลึก สงบ เป็นมืออาชีพ

| บทบาท | สี |
|---|---|
| พื้นหลังหลัก | Deep Midnight Navy `#0B1020` / Deep Navy `#080B16` |
| ตัวอักษร | Warm Ivory `#F5F0E6` / Soft Ivory `#E7DDCC` |
| แสงความรู้ (ทอง) | Antique Gold `#C8A85A` · Burnished Gold `#D4AF37` |
| โทนรอง | Knowledge Blue, Bronze, Soft Glow |

ทองในที่นี้คือ “แสงของความรู้” ไม่ใช่โทนลึกลับเชิงไสยศาสตร์

---

## โมเดลเนื้อหา

- **`entries`** — เนื้อหาหลัก: identity (term/thai/IPA/รากศัพท์), framework, นักคิด, difficulty,
  คำอธิบายให้เห็นภาพ, ความหมายเชิงเทคนิค, `body_markdown`, related concepts (jsonb),
  source refs (jsonb), roots (jsonb), status, `published_at`
- **`entry_revisions`** — snapshot ประวัติเวอร์ชัน (ผูก RLS กับเจ้าของ entry)
- **Content types**: article · concept · person · book · school · symbol · term · reading-set · source-note
- **Status flow**: `draft → needs-source-check → ready-to-publish → published → archived`
- **Concept Registry** — ฐานกลางของ node สำหรับ related links, backlinks และ internal `[[ ]]`

---

## สถานะการพัฒนา

**เสร็จแล้ว (P0 / Editor v1 — ฝั่งโค้ด)**
- ✅ เว็บสาธารณะครบทุกหน้า + typography + ไอคอน + ดีไซน์หน้าแรก/หน้าอ่านใหม่
- ✅ Editor v1: schema + RLS, data layer, Clerk, persistence, autosave, version history
- ✅ E5 Markdown · E7 Publish → Public · E8 หน้าสาธารณะอ่านจาก DB (+ fallback, ISR)
- ✅ หน้าบริการ `/guide` · E9 Full QA (lint/build เขียว, 0 ลิงก์เสีย, Thai-first)

**ลำดับถัดไป (P1)**
- ◻️ Constellation Map (กราฟความสัมพันธ์ของ node)
- ◻️ `/studio` dashboard (รายการเนื้อหาของฉัน)
- ◻️ ค้นหา (search) · เติม seed เนื้อหาให้กราฟแน่นขึ้น

ดูแผนเต็มและ Definition of Done ได้ที่เอกสาร *Next Steps Roadmap* และ [`docs/`](docs/)

---

*สร้างขึ้นเพื่อการศึกษา การอ่าน และการตีความอย่างมีบริบท — ไม่ใช่เพื่อการลดทอนความหมายของมนุษย์*
