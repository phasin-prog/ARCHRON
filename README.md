# ARCHRON — สำนักศึกษามนุษย์ ข้ามผ่านห้วงเวลาและศาสตร์วิชา

> คลังความรู้ภาษาไทยสำหรับ **ศึกษาจิตใจมนุษย์อย่างมีบริบท** ผ่านจิตวิทยา จิตวิเคราะห์
> ปรัชญา ประสาทวิทยาศาสตร์ สัญลักษณ์ ภาษา และทฤษฎีความรู้ — โดยแยก
> **แหล่งที่มา · ข้อเท็จจริง · การตีความ** ออกจากกันอย่างชัดเจน

## ที่มาของชื่อ — Archron

**Archron** มาจากการรวมคำกรีกโบราณสองคำเข้าด้วยกัน:

| รากศัพท์ | กรีก | ความหมาย |
|---|---|---|
| **Arche** (ἀρχή) | จุดเริ่มต้น · หลักการ · สิ่งแรกเริ่ม · รากฐานของสรรพสิ่ง | ที่มีอยู่ตั้งแต่ต้น ก่อนที่สิ่งใดจะเป็นสิ่งใด |
| **Cronos** (Χρόνος) | เวลา · กาลเวลา · ความยืนยาว | กระแสเวลาที่ไหลผ่านและพัฒนา |

> **Arche + Cronos = Archron** — "หลักการแรกเริ่มที่เดินทางผ่านกาลเวลา"

ชื่อนี้สะท้อนจุดยืนของโครงการ: ศึกษา **รากฐานดั้งเดิม (Arche)** ของจิตใจและความคิดมนุษย์
แล้วติดตามว่าแนวคิดเหล่านั้น **เปลี่ยนแปลงและพัฒนาผ่านกาลเวลา (Cronos)** อย่างไร —
ทั้งในประวัติศาสตร์ศาสตร์วิชา และในชีวิตจิตใจของแต่ละคน

สแตก: **Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase · Clerk**
ดีไซน์: **Material & Color Cosmology v2.0 · DARK (Observatory / Night)** + **Dynamic Accent**

> 📖 **เริ่มอ่านโค้ดที่นี่ → [สารบัญโค้ด (Code Index / Library)](docs/code-index.md)** — รวมทุกไฟล์สำคัญพร้อมหน้าที่ จัดกลุ่มตามระบบ

---

## จุดยืนของโครงการ

ARCHRON เป็น **ระบบความรู้แบบเชื่อมโยง (Wiki / Knowledge Graph)** ในแนว Obsidian
ที่วางแนวคิดไว้ในบริบทเดิม แล้วพาผู้อ่านเดินจากแนวคิดหนึ่งไปอีกแนวคิดอย่างมีเหตุผล

**สิ่งที่โครงการนี้เป็น**
- คลังความรู้เชิงวิชาการ อ่านได้ ตรวจสอบที่มาได้ เชื่อมโยงข้ามศาสตร์ได้
- ภาษาไทยเป็นหลัก (Thai-first) — ทั้งเว็บไม่มี language switcher / EN routes

**สิ่งที่โครงการนี้ไม่เป็น**
- ❌ สายมู / ทำนายดวง ❌ self-help / สูตรสำเร็จ ❌ คลินิก / วินิจฉัยทางการแพทย์
- ❌ เกม/แฟนตาซี ❌ เว็บการตลาด ❌ เว็บบทความทั่วไป

> “เราไม่รีบทำให้ความซับซ้อนกลายเป็นคำตอบง่าย ๆ — แต่ทำให้ความซับซ้อนนั้นอ่านได้ ตรวจสอบได้ และเชื่อมโยงกันได้มากขึ้น”

---

## ระบบดีไซน์ — Material & Color Cosmology v2.0 (DARK)

> “Color is memory. Material is civilization.”

โหมด **มืดเป็นหลัก** (Observatory / Night) — Prima Materia (หินค่ำคืน) เป็นพื้น ตัวอักษรสว่าง
แสงนุ่มแบบหอดูดาว/ห้องสมุด/แสงเทียน ไม่จัด ไม่เงา · `color-scheme: dark`

### สีแกน (Material Cosmology core)

| โทเคน | ค่า | ความหมาย / บทบาท |
|---|---|---|
| `prima` | `#181B24` | Prima Materia — พื้นมืด/ค่ำคืน/สิ่งที่ยังไม่รู้ |
| `psyche` | `#3D6177` | Psyche — น้ำลึก/โลกภายใน (แสงเรืองหลัง) |
| `lumen` | `#E7D7A6` | Lumen — แสงแรกของความเข้าใจ (ลิงก์/ไฮไลต์) |
| `sapientia` | `#B58D4A` | Sapientia — ทองโบราณ (brand / heading accent) |
| `mercurius` | `#607565` | Mercurius — สนิมทองแดง/การแปรเปลี่ยน |
| `humanitas` | `#F3EEE5` | Humanitas — กระดาษ/ตัวอักษรสว่าง |
| `ink-neutral` `dust` `ash` `mist` | `#2A2A2A` `#CFC8BC` `#8A857D` `#F8F7F3` | โทนกลาง/เนื้อ/เถ้า/หมอก |

ทองในที่นี้คือ “แสงของความรู้ (Sapientia)” ไม่ใช่โทนลึกลับเชิงไสยศาสตร์

### พื้นผิว & สถานะ (semantic)

- **Surface (มืด):** `paper #1C1F29` · `paper-raised #232735` · `paper-sunken #121319` ·
  `surface-container(-low/-lowest) #20232E / #1A1D27 / #15161F`
- **ตัวอักษร/เส้น:** `on-surface #F3EEE5` · `on-surface-variant #C9C2B4` · `slate-boundary #343A47`
- **Signal:** `success #7FB08A` · `warning #D8B56A` · `danger #C9776A` · `info #6E93A8`

> โทเคนทั้งหมดประกาศแบบ Tailwind v4 CSS-first ใน [`app/globals.css`](app/globals.css) (`@theme { --color-* }`)
> จึงกลายเป็น utility อัตโนมัติ เช่น `bg-prima`, `text-lumen`, `border-slate-boundary`

### Dynamic Accent — สีที่เปลี่ยนตามบริบท + ไล่สีนุ่ม

ใช้ CSS `@property --accent { syntax:"<color>" }` เพื่อให้ **transition ของสี** ทำงานได้
(`--accent` morph ช้า ๆ ~1.2s เมื่อเปลี่ยนหน้า) และ map เป็น utility ผ่าน `--color-accent: var(--accent)`
→ ใช้ได้เป็น `text-accent` / `bg-accent` / `border-accent`

แม็ปเส้นทาง → สีประจำบริบท ([`lib/content/cosmology.ts`](lib/content/cosmology.ts) · `routeAccent()`):

| บริบท / เส้นทาง | Accent |
|---|---|
| `/concepts` (จิตวิทยา/วิเคราะห์) | Psyche `#6E93A8` |
| `/schools`, `/guide`, `/external-links` (สำนักคิด/ภาษา/แปรเปลี่ยน) | Mercurius `#8AA395` |
| `/constellation` (กราฟ/ตำนาน/สัญลักษณ์) | Prima `#B9C2CE` |
| `/manifesto` (ปฏิญญา/แสงแห่งความเข้าใจ) | Lumen `#E7D7A6` |
| `/reading-sets` (เส้นทางการอ่าน) | Sapientia เข้ม `#C9A24A` |
| `/articles`, `/sources`, `/knowledge` | Sapientia `#CBA45A` |
| ทั่วไป / `/studio` | Sapientia `#B58D4A` (ดีฟอลต์) |

ฟังก์ชันประกอบ: `nodeTypeAccent()` (สีตามชนิด node), `contentTypeMeta()` (ไอคอน+สี+ป้าย 9 ชนิด),
`statusMeta / difficultyMeta / sourceTypeMeta / frameworkMeta`

### ICON LANGUAGE — ชุดไอคอนประจำศาสตร์

ไอคอนเส้นมินิมัลเชิงเรขาคณิต (24×24, `stroke="currentColor"`) ออกแบบเองตาม brand board
แทน Material Symbols สำหรับ “ศาสตร์” — อยู่ใน [`components/icons.tsx`](components/icons.tsx)

- **แบรนด์:** `ArchronLogomark` (vesica — จุดตัดของศาสตร์), `ArchronMark` (วงเปิด + จุดศูนย์กลาง)
- **ศาสตร์ (12):** Psychology · Philosophy · Anthropology · History · Language · Mythology ·
  Religion · Science · Symbolism · Art · AIFuture · Civilization
- รับสี accent ผ่าน `currentColor` (คุมด้วย `style/color` หรือ `text-*`) — หน้าแรก ATLAS ใช้ไอคอนชุดนี้แล้ว

### Typography — Dynamic Typography (fluid `clamp()`)

ฟอนต์สองภาษา (อังกฤษขึ้นก่อน → ไทย) + สเกลลื่นไหลตามจอด้วย `clamp()` ใน [`app/globals.css`](app/globals.css)

| บทบาท | ฟอนต์ |
|---|---|
| หัวข้อ (heading, serif) | IBM Plex Serif (EN) + Noto Serif Thai (TH) |
| เนื้อหา (body) | Inter (EN) + Noto Sans Thai (TH) |
| Wordmark “ARCHRON” | Cinzel (`--font-wordmark`) |
| Display (เสริม) | Playfair Display |

Fluid tokens: `--text-base` (16→20px) · `--text-h1` (32→56px) · `--text-h2` (24→40px) · `--text-h3` (20→28px) — มี utility opt-in `.text-fluid-h1/h2/h3/base`

---

## ระบบบทบาทผู้ใช้ (Roles)

เก็บใน **Clerk `publicMetadata.role`** · นิยามใน [`lib/content/roles.ts`](lib/content/roles.ts)

| Role | ป้าย | สิทธิ์ |
|---|---|---|
| `admin` | ผู้ดูแล | ทำได้ทุกอย่าง + จัดการบทบาทผู้ใช้ |
| `writer` | นักเขียน | เขียน/แก้/เผยแพร่งานของตนเอง |
| `user` | ผู้ใช้ | อ่านอย่างเดียว (ขอเป็นนักเขียนได้) |

ตัวช่วย: `roleFromMetadata()` · `canWrite()` · `isAdmin()` — รองรับทั้ง `user.publicMetadata` และ `sessionClaims`

> **การตั้งค่าเริ่มต้น (ทำเอง):** เจ้าของระบบต้องตั้ง `publicMetadata.role = "admin"` ให้บัญชีตนเองใน Clerk Dashboard

---

## ระบบที่สร้างไปแล้ว (ภาพรวม)

### เว็บสาธารณะ (Public)
- **หน้าแรก** (`/`) — hero (Prima night-sea → Lumen → Humanitas), เสาหลัก, **ATLAS 6 หมวด** (ICON LANGUAGE + สี cosmology), คำประกาศ, ทางลัด
- **บทความ** (`/articles`) · **คลังแนวคิด/Wiki** (`/concepts`) + หน้า node รายตัว `[slug]`
- **หน้าอ่าน Unified** (Article/Concept ร่วมกัน): breadcrumb → header → meta-grid 4 ช่อง
  → เนื้อหา → ที่มาของคำ → การ์ดแนวคิดที่เกี่ยวข้อง (ป้ายความสัมพันธ์) → เอกสารอ้างอิง → **ความคิดเห็น**
- **สารบัญ + ความคืบหน้าการอ่าน (A3)** · **ระบบอ้างอิง `[[cite:N]]` (A1)** · **อภิธานศัพท์ hover (A2)**
- **ความคิดเห็น** (ท้ายบทความ/แนวคิด) — ต้องมีบัญชีนักอ่านจึงร่วมอภิปรายได้, แก้/ลบของตนเอง
- **ตัวนับผู้เยี่ยมชม** — ต่อบทความ (ท้ายหน้า) + บนการ์ดหน้า list + ยอดรวมทั้งเว็บใน footer
- **ลิงก์ภายใน `[[wikilink]]`** → ลิงก์จริงไป node, ตรวจจับลิงก์เสียได้ · **Backlinks** ต่อ node
- **Constellation** (`/constellation`) — กราฟความสัมพันธ์ของ node (mindmap)
- **คลังความรู้** (`/knowledge`) · **ซีรีส์การอ่าน** (`/reading-sets`) · **แหล่งอ้างอิง** (`/sources`)
- **ปฏิญญา** (`/manifesto`) · **ทรัพยากรภายนอก** (`/external-links`) · **FAQ** (`/faq`) · **สนับสนุน** (`/support`)
- **ค้นหา** (`/search`) · บริการ **Jungian Type Analysis** (`/guide`)
- ข้อมูลสาธารณะดึงจาก **Supabase (เฉพาะ published)** + **fallback seed static** ถ้า DB ว่าง · **ISR** (revalidate 5 นาที + on-demand เมื่อเผยแพร่)

### Studio — พื้นที่นักเขียน (มี chrome ของตัวเอง, ซ่อน header/footer สาธารณะ)
- **`/studio`** — หน้า Landing/Login เฉพาะนักเขียน (Clerk SignIn ธีมมืด, บัญชีเดียวกับฝั่งอ่าน)
- **`/studio/editor`** — ตัวแก้ไขเนื้อหา (ป้องกันด้วย middleware)
  - เขียนลง Supabase ผ่าน **RLS** (เห็น/แก้เฉพาะของตน) · **Autosave** + ปุ่ม “บันทึก + เวอร์ชัน” · **ประวัติเวอร์ชัน** กู้คืนได้
  - **Markdown** (react-markdown + remark-gfm, sanitize) · ตัวช่วย internal link + Related Concept Picker
  - Dropdown แบบ **icon + สี** (Content Type / Status / Difficulty / Source type / Framework); **Framework สร้างค่าใหม่เองได้**
  - **Status signal colors:** draft (เทา) · needs-source-check (แดง) · ready-to-publish (เหลือง) · published (เขียว) · archived (เทาจาง)
  - **Mobile action bar** (บันทึก/พรีวิว/เผยแพร่ เข้าถึงได้ขณะเลื่อน) · **Pop-Up Feedback** (Positive/Negative toast)
  - **เผยแพร่จริง:** ตรวจ Publish Checklist + ลิงก์เสีย → ตั้ง `published` + `published_at` + snapshot → `revalidatePath`
- **`/studio/profile`** — โปรไฟล์ตนเอง (username / display name / title) + ป้ายบทบาท + ปุ่ม “ขอเป็นนักเขียน”
- **`/studio/users`** — จัดการผู้ใช้ (admin เท่านั้น) — server actions `listUsersAction` / `setRoleAction` ผ่าน `clerkClient`
- **`/studio/comments`** — โมเดอเรชันคอมเมนต์ (admin เท่านั้น) — ซ่อน/แสดง/ลบคอมเมนต์ของผู้ใช้ทุกคน ผ่าน server actions ที่ตรวจ role + service-role client (ข้าม RLS)

### บัญชีฝั่งอ่าน
- **`/th/login`**, **`/th/register`** — “บัญชีนักอ่าน” (Clerk, ธีมมืด, logomark + Cinzel)

---

## สแตกเทคโนโลยี

| ส่วน | เทคโนโลยี |
|---|---|
| Framework | Next.js `^16` (App Router, RSC, ISR) |
| UI | React `^19`, Tailwind CSS `^4` (CSS-first `@theme` + `@property --accent`) |
| เนื้อหา Markdown | `react-markdown` `^9` + `remark-gfm` `^4` |
| ฐานข้อมูล | Supabase (Postgres + Row Level Security) |
| Auth & Roles | Clerk (+ Supabase Third-Party Auth) · role ใน `publicMetadata` |
| ฟอนต์ | Noto Serif Thai · IBM Plex Sans Thai · Cinzel (wordmark) · Playfair · Material Symbols |
| Lint | ESLint 9 (flat config) + `eslint-config-next` |

---

## โครงสร้างโปรเจกต์

```
app/
  page.tsx                 หน้าแรก (ATLAS + ICON LANGUAGE)
  layout.tsx               root layout (ฟอนต์, SiteHeader/Footer, Material Symbols)
  globals.css              Tailwind v4 + Cosmology v2 tokens + @property --accent + component CSS
  articles/ concepts/      list + [slug] (DB → fallback static, ISR)
  knowledge/ constellation/ reading-sets/ sources/ external-links/ faq/ manifesto/ support/ search/
  guide/                   บริการ Jungian Type Analysis
  studio/
    layout.tsx             chrome ของ Studio
    page.tsx               Landing/Login นักเขียน
    editor/                ตัวแก้ไข + actions (server) revalidate
    profile/               โปรไฟล์ตนเอง
    users/                 จัดการผู้ใช้ (admin) + actions
    comments/              โมเดอเรชันคอมเมนต์ (admin) + actions (service-role)
  th/login · th/register   บัญชีนักอ่าน (Clerk)
components/
  site-header.tsx          glass-nav (sticky) + เมนูมือถือ (NAV แบนพร้อมไอคอน; ซ่อนใน /studio)
  site-footer.tsx · scroll-to-top · tabbar · fab   (ซ่อนใน /studio; footer แสดงยอดผู้เยี่ยมชมรวม)
  icons.tsx                ARCHRON logomark/mark + ICON LANGUAGE (12 ศาสตร์)
  view-badge.tsx           ป้ายจำนวนวิวบนการ์ด list (batch, แสดงอย่างเดียว)
  reading/                 ReadingPage (Unified) + toc/progress + view-counter + comment-section + InternalLinkText
  studio/                  Editor widgets — searchable-select (meta+allowCustom), feedback-toast, pickers, revision panel
  constellation/           constellation-mindmap
lib/
  content/                 cosmology · roles · profile-db · comments-db · views-db · entries(-db) · concept-registry ·
                           mappers · queries · publish-validation · internal-links · related ·
                           public-source · schools · graph · search-index · external-links · faq
  supabase/                client (Clerk token) + server (anon + service-role)
types/content.ts           โมเดลเนื้อหา (ContentEntry ฯลฯ)
supabase/schema.sql        entries + entry_revisions + profiles + comments + page_views + RLS + RPC
docs/                      code-index.md · orchestrator.md · supabase-clerk-setup.md · verify-build-checklist.md
```

---

## การติดตั้งและรัน

ต้องมี **Node.js ≥ 20.9**

```bash
npm install
npm run dev        # http://localhost:3000
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

# Supabase service role (server-only) — ใช้เฉพาะโมเดอเรชันคอมเมนต์ของแอดมิน (ข้าม RLS)
# ห้ามใส่ prefix NEXT_PUBLIC_ เด็ดขาด
SUPABASE_SERVICE_ROLE_KEY=...
```

> หากยังไม่ใส่คีย์ Clerk เว็บสาธารณะยังเปิดได้ปกติ (middleware ปล่อยผ่าน) — แต่ `/studio` ใช้งานจริงไม่ได้
> และถ้ายังไม่ตั้ง Supabase หน้าสาธารณะจะ fallback ไป seed static อัตโนมัติ
> ระบบคอมเมนต์/ตัวนับวิวต้องรัน `supabase/schema.sql` ก่อน · โมเดอเรชันแอดมินต้องตั้ง `SUPABASE_SERVICE_ROLE_KEY`

### เปิดใช้ Studio / ฐานข้อมูล (ทำใน dashboard)
1. รัน [`supabase/schema.sql`](supabase/schema.sql) ใน Supabase SQL Editor — สร้าง `entries`, `entry_revisions`, **`profiles`**, **`comments`**, **`page_views`** + RLS + RPC
2. ตั้ง **Clerk เป็น Third-Party Auth** ใน Supabase ให้ `auth.jwt()->>'sub'` ตรงกับ Clerk user id
3. ตั้ง `publicMetadata.role = "admin"` ให้บัญชีเจ้าของใน Clerk Dashboard
4. ตั้ง env `SUPABASE_SERVICE_ROLE_KEY` (สำหรับโมเดอเรชันคอมเมนต์ของแอดมิน)
5. ทดสอบ RLS: ผู้ใช้ A แก้ของ B ไม่ได้ และ draft ไม่หลุดสู่ public

รายละเอียด: [`docs/supabase-clerk-setup.md`](docs/supabase-clerk-setup.md)

---

## โมเดลเนื้อหา & ฐานข้อมูล

- **`entries`** — เนื้อหาหลัก: identity (term/thai/IPA/รากศัพท์), framework, นักคิด, difficulty,
  คำอธิบายให้เห็นภาพ, ความหมายเชิงเทคนิค, `body_markdown`, related concepts (jsonb),
  source refs (jsonb), roots (jsonb), status, `published_at`
- **`entry_revisions`** — snapshot ประวัติเวอร์ชัน (RLS ผูกกับเจ้าของ entry)
- **`profiles`** — `clerk_user_id` (PK), `username` (unique), `display_name`, `title`, `writer_request`
  · RLS: public select / self insert / self update
- **`comments`** — `section`, `slug`, `clerk_user_id`, `author_name`, `body`, `status` (visible/hidden)
  · RLS: อ่าน visible สาธารณะ · เขียน/แก้/ลบเฉพาะของตน · แอดมินจัดการผ่าน service-role
- **`page_views`** — `slug` (PK), `views` · เพิ่มยอดผ่าน RPC `increment_page_view` (SECURITY DEFINER) · ยอดรวม `total_page_views`
- **Content types (9):** article · concept · person · book · school · symbol · term · reading-set · source-note
- **Status flow:** `draft → needs-source-check → ready-to-publish → published → archived`
- **Concept Registry** — ฐานกลางของ node สำหรับ related links, backlinks และ internal `[[ ]]`

---

## หลักการทำงาน (Guardrails)

- **Thai-first เสมอ** — ไม่เพิ่ม EN page / language switcher / bilingual ถ้าไม่ได้สั่งชัดเจน
- **รักษาแกนแบรนด์** — จิตวิทยา/ปรัชญา/ความรู้ ไม่ใช่ self-help · สายมู · fantasy/game · marketing
- งานที่แตะ route / schema / auth / admin / deployment = **High Risk** ต้องขอคำสั่งเฉพาะก่อนลงมือ
- บทบาท Agent และกระบวนการแบ่งงานดูที่ [`docs/orchestrator.md`](docs/orchestrator.md)

---

*สร้างขึ้นเพื่อการศึกษา การอ่าน และการตีความอย่างมีบริบท — ไม่ใช่เพื่อการลดทอนความหมายของมนุษย์*
