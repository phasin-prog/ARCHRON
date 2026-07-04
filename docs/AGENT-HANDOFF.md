# 🧭 AGENT-HANDOFF.md — รัฐธรรมนูญปฏิบัติการและแผนที่เส้นทางงานสำหรับ AI (ARCHRON Master Operational Constitution)

> **สถานะ:** รัฐธรรมนูญปฏิบัติการสูงสุด (Master Operational Constitution & Task-Oriented Index Library)  
> **เป้าหมาย:** ชี้แนะแนวทางสำหรับ AI และนักพัฒนาทุกระบบ (Claude, ChatGPT, Gemini, DeepSeek, Cursor, Windsurf, Codex) ให้เข้าใจโครงสร้างสถาปัตยกรรม ลำดับการทำงาน และข้อบังคับทางปรัชญาของโครงการ ARCHRON ได้อย่างแม่นยำ ไร้รอยต่อ และยั่งยืนเหนือกาลเวลา
>
> **ลำดับการอ่านก่อนเริ่มงานทุกครั้ง:**  
> 1. `AGENTS.md` (กฎเหล็กและขอบเขตงานห้ามทำเกิน)  
> 2. **`docs/AGENT-HANDOFF.md` (ไฟล์นี้ — เส้นทางงานและข้อบังคับสถาปัตยกรรมรวม)**  
> 3. รัฐธรรมนูญเฉพาะด้านใน Root/Docs (`PRD.md`, `Sitemap.md`, `VOS.md`, `SYMBOLS.md`, `AES.md`, `EDS.md`)  
> 4. `docs/code-index.md` (รายการไฟล์ฉบับละเอียดเชิงลึก)

สแตกเทคโนโลยีหลัก: **Next.js 16 (App Router/RSC/ISR) · React 19 · Tailwind v4 · Supabase (RLS) · Clerk · Cloudflare R2 · Upstash Redis · TypeScript**

---

## 0) โครงสร้างรัฐธรรมนูญและสารานุกรมคำจำกัดความ (Constitutional Architecture & Canonical Terminology)

เพื่อป้องกันความสับสนและลดความซ้ำซ้อนของข้อมูลในระบบ (Hallucination & Duplication Prevention) โครงการ ARCHRON ได้แยกโครงสร้างรัฐธรรมนูญออกเป็นโมดูลเฉพาะด้านที่เชื่อมโยงถึงกันอย่างเป็นระบบ:

### 📐 แผนผังรัฐธรรมนูญความรู้ (Hierarchy of Sources of Truth)
| รัฐธรรมนูญเฉพาะด้าน | ตำแหน่งไฟล์ | ขอบเขตความรับผิดชอบหลัก |
|---|---|---|
| **Product Requirements Document** | `/PRD.md` · `/docs/PRD.md` | วิสัยทัศน์โครงการ, กลุ่มเป้าหมาย Personas, ขอบเขตฟีเจอร์ MVP/V1/V2 |
| **Dynamic Route Architecture** | `/Sitemap.md` · `/docs/Sitemap.md` | โครงสร้างเส้นทาง Dynamic Routes v3.0 ครบทั้ง 6 แกนระบบ |
| **Visual Operating System** | `/VOS.md` · `/docs/VOS.md` | ปรัชญาดีไซน์ AVOS, ระบบสี Colour Cosmology, โทเค็น, ระบบฟอนต์ |
| **Symbol Dictionary** | `/SYMBOLS.md` · `/docs/SYMBOLS.md` | ไวยากรณ์สัญลักษณ์ 17 วัตถุความรู้ และสัญลักษณ์ปฏิสัมพันธ์สากล |
| **Editorial Experience System** | `/AES.md` · `/docs/AES.md` | ประสบการณ์การอ่าน, ลำดับชั้นข้อมูล, ต้นแบบการ์ด 5 หมวด, ความกว้างเลย์เอาต์ |
| **Editorial DNA System** | `/EDS.md` · `/docs/EDS.md` | รหัสพันธุกรรมงานบรรณาธิการ 6 ลำดับชั้น (Identity → Navigation) |
| **Context Engineering Roadmap** | `/ROADMAP.md` · `/docs/ROADMAP.md` | แผนที่ยุทธศาสตร์วิศวกรรมบริบท 70 เฟส ครอบคลุม 7 เลเยอร์สถาปัตยกรรม |

### 📚 สารานุกรมคำจำกัดความมาตรฐาน (Canonical Terminology Dictionary)
AI ทุกตัวต้องใช้คำศัพท์เหล่านี้ในความหมายเดียวอย่างเคร่งครัด ห้ามปะปนกัน:
* **Entry (`ContentEntry`):** ระเบียนข้อมูลดิบที่เป็นบรรทัดฐานในฐานข้อมูล Supabase ตาราง `entries` ครอบคลุมเนื้อหาทุกประเภท
* **Article:** บทความยาวเชิงวิเคราะห์ การตีความ หรือบทความเชิงลึกที่เรนเดอร์ผ่านระบบ `ReadingPage`
* **Concept (`ConceptNode`):** มโนทัศน์หรือแนวคิดหลักทางจิตวิทยาและปรัชญาที่ลงทะเบียนใน `concept-registry.ts` (เช่น Unconscious, Shadow, Ego)
* **Thinker:** นักคิด นักปราชญ์ หรือนักจิตวิทยาผู้เป็นเจ้าของทฤษฎี (เช่น Carl Jung, Sigmund Freud)
* **School:** สำนักคิดหรือประเพณีทางปัญญาที่รวบรวมนักคิดและแนวคิดไว้ด้วยกัน (เรนเดอร์ผ่าน `SchoolsHub`)
* **Reference:** หลักฐานอ้างอิง หนังสือ หรือข้อความปฐมภูมิ/ทุติยภูมิที่รับรองความถูกต้องของเนื้อหา
* **Theme:** แก่นเรื่องข้ามศาสตร์ (Cross-discipline cluster) ที่เชื่อมโยงแนวคิดและบทความหลายหมวดเข้าด้วยกัน (`themes.ts`)

---

## 0.1) วิธีอ่านและใช้งานเส้นทางงาน (Operational Pathways Navigation)

แต่ละ "เส้นทางงาน" (§2 เป็นต้นไป) ถูกออกแบบเชิงระบบ (Systems Thinking) ประกอบด้วย:
* **เปิด (Open):** ไฟล์เป้าหมายที่ต้องแก้ไขหรือตรวจสอบเป็นหลัก + ป้ายกำกับสถาปัตยกรรม (`🔵 server`, `🟢 client`, `🔷 data`, `🟣 infra`)
* **เชื่อม (Wires):** โมดูลภายนอกที่เชื่อมโยงและส่งผลกระทบถึงกัน
* **ไหล (Flow):** กระแสการไหลของข้อมูล (Data Flow) ตั้งแต่ต้นน้ำถึงปลายน้ำ
* **ระวัง (Gotchas):** กฎเหล็กและข้อพึงระวังตามรัฐธรรมนูญ

---

## 1) แผนที่โค้ดรวม (Comprehensive Code Map & Cross References)

### ราก (Root Infrastructure)
| ไฟล์ | โหมด | หน้าที่ |
|---|---|---|
| `proxy.ts` | 🟣 | **Clerk middleware** (ป้องกัน `/studio/editor·users·comments(.*)` ต้อง login · `/th/login·register` auth route · ปล่อยผ่านถ้าไม่มีคีย์ Clerk) — ⚠️ ชื่อไฟล์คือ `proxy.ts` **ไม่ใช่** `middleware.ts` |
| `next.config.mjs` | 🟣 | Next config (ตั้ง `turbopack.root` เลี่ยงสแกน parent lockfile) |
| `eslint.config.mjs` · `postcss.config.mjs` | 🟣 | ESLint flat config · PostCSS (Tailwind v4) |

### `app/` — หน้าสาธารณะ (Public Pages)
| Route | ไฟล์ | โหมด | หน้าที่ |
|---|---|---|---|
| `/` | `app/page.tsx` | 🔵 | หน้าแรก (hero, pillars, ATLAS, manifesto, quick links) |
| `/knowledge` | `app/knowledge/page.tsx` | 🔵 | สารบัญคลังความรู้ (การ์ดนำทางตามหลัก EDS) |
| `/articles` | `app/articles/page.tsx` + `loading.tsx` | 🔵 (ISR 5m) | รายการบทความ (DB published → fallback seed) |
| `/articles/[slug]` | `app/articles/[slug]/page.tsx` | 🔵 (SSG+ISR) | หน้าอ่านบทความ (`ReadingPage`, section="articles" ตามหลัก AES) |
| `/concepts` | `app/concepts/page.tsx` | 🔵 | รายการแนวคิด (จาก concept-registry) |
| `/concepts/[slug]` | `app/concepts/[slug]/page.tsx` | 🔵 (SSG+ISR) | หน้าอ่านแนวคิด (entry→`ReadingPage`+Backlinks; ไม่มี entry→stub registry) |
| `/constellation` | `app/constellation/page.tsx` | 🔵 (dynamic) | Radial focus-map + no-JS fallback |
| `/themes` · `/themes/[slug]` | `app/themes/page.tsx` · `app/themes/[slug]/page.tsx` | 🔵 | แก่นเรื่องข้ามศาสตร์ (B1) |
| `/external-links` | `app/external-links/page.tsx` | 🔵 | ทรัพยากรภายนอก (6 หมวด) |
| `/schools` | `app/schools/page.tsx` | 🔵 | สำนักคิด/นักปราชญ์ (เรียก `SchoolsHub`) |
| `/faq` | `app/faq/page.tsx` | 🔵 | คำถามที่พบบ่อย (`Accordion`) |
| `/guide` | `app/guide/page.tsx` | 🔵 | บริการ Jungian Type Analysis |
| `/manifesto` | `app/manifesto/page.tsx` | 🔵 | ปฏิญญาโครงการ |
| `/reading-sets` | `app/reading-sets/page.tsx` | 🔵 | เส้นทางการอ่าน/ซีรีส์ (placeholder) |
| `/search` | `app/search/page.tsx` + `loading.tsx` | 🔵 | ค้นหากลาง (`SearchClient`) |
| `/sources` | `app/sources/page.tsx` | 🔵 | แหล่งอ้างอิงภายใน |
| `/support` | `app/support/page.tsx` | 🔵 | สนับสนุนโครงการ |

### `app/studio/` — เครื่องมือนักเขียนและผู้ดูแล (Authed Studio)
| Route | ไฟล์ | โหมด | หน้าที่ |
|---|---|---|---|
| `/studio` | `app/studio/page.tsx` · `layout.tsx` | 🟢/🔵 | Landing/Login นักเขียน + chrome เฉพาะ studio (ซ่อน header/footer สาธารณะ, force-dynamic) |
| `/studio/editor` | `app/studio/editor/page.tsx` · `actions.ts` | 🟢 page · 🔵 actions | ตัวแก้เนื้อหา (autosave, version, publish, markdown, my-content-search) |
| `/studio/profile` | `app/studio/profile/page.tsx` · `actions.ts` | 🟢 page · 🔵 actions | โปรไฟล์ตนเอง + ขอเป็นนักเขียน |
| `/studio/users` | `app/studio/users/page.tsx` · `actions.ts` | 🟢 page · 🔵 actions | จัดการผู้ใช้ (admin) ตั้งบทบาทผ่าน clerkClient |
| `/studio/comments` | `app/studio/comments/page.tsx` · `actions.ts` | 🟢 page · 🔵 actions | โมเดอเรชันคอมเมนต์ (admin) ซ่อน/แสดง/ลบ |

### `app/th/` — บัญชีนักอ่าน (Reader Accounts)
| Route | ไฟล์ | โหมด | หน้าที่ |
|---|---|---|---|
| `/th/login` | `app/th/login/[[...login]]/page.tsx` · `app/th/layout.tsx` | 🟢 | เข้าสู่ระบบบัญชีนักอ่าน |
| `/th/register` | `app/th/register/[[...register]]/page.tsx` | 🟢 | สมัครบัญชีนักอ่าน |

### `app/api/` — API Routes
| Endpoint | ไฟล์ | โหมด | หน้าที่ |
|---|---|---|---|
| `POST /api/upload` | `app/api/upload/route.ts` | 🔵 | อัปโหลดรูปขึ้น R2 (ต้อง login + `canWrite`) |
| `GET /api/media/[...key]` | `app/api/media/[...key]/route.ts` | 🔵 | proxy ดึงไฟล์จาก R2 (private bucket) |

### `lib/content/` — Data Layer & Core Logic (🔷)
| ไฟล์ | exports หลัก |
|---|---|
| `entries.ts` | seed entries (static) + `getEntryBySlug`, `allEntrySlugs` |
| `concept-registry.ts` | `conceptRegistry`, `NodeType`, `getConceptBySlug`, `resolveConcept`, `conceptTitle` |
| `public-source.ts` | `getPublicEntries`, `getPublicEntryBySlug` (DB published → fallback seed) |
| `entries-db.ts` | `getPublishedEntries/BySlug/Slugs`, `listMyEntries`, `getMyEntryBySlug`, `upsertEntryRow`, `deleteEntry`, `addRevision`, `getRevisions` |
| `draft-db.ts` | `saveDraft` (มี ownership guard), `loadDraftBySlug`, `listMyDrafts`, `publishEntry` (มี ownership guard) |
| `draft-mapper.ts` · `entry-mapper.ts` | `draftToRow`/`entryToDraft` · `rowToEntry` |
| `publish-validation.ts` | `EditorDraft`, `EMPTY_DRAFT`, `getPublishChecklist`, `canPublish`, `slugify` |
| `internal-links.ts` | `parseInternalLinks`, `findDeadLinks`, `findLinkSuggestions` |
| `related.ts` | `getBacklinksForConcept` |
| `graph.ts` | `buildGraph` + `NODE_TYPE_LABEL/COLOR`, `RELATION_LABEL` |
| `external-links.ts` · `faq.ts` · `schools.ts` | ข้อมูล static (ทรัพยากร/FAQ/สำนักคิด) |
| `search-index.ts` | `buildSearchIndex` + `SEARCH_TYPE_LABEL` |
| `cosmology.ts` | `Cosmology`, `COSMOLOGY_ACCENT`, `routeCosmology`, `routeAccent`, `contentTypeMeta`, `statusMeta`, `difficultyMeta`, `sourceTypeMeta`, `frameworkMeta`, `nodeTypeAccent` |
| `roles.ts` | `Role` (`admin`/`writer`/`user`), `ROLE_LABEL`, `ROLE_META`, `roleFromMetadata`, `canWrite`, `isAdmin` |
| `profile-db.ts` | `Profile`, `ProfileInput`, `getMyProfile`, `upsertMyProfile`, `requestWriter` |
| `comments-db.ts` | `Comment`, `CommentInput`, `listComments`, `addComment`, `deleteComment` |
| `comments-actions.ts` | 🔵 server actions: `listCommentsAction`, `addCommentAction`, `deleteCommentAction` |
| `views-db.ts` | `incrementPageView`, `getPageView`, `getTotalPageViews` (RPC) |
| `themes.ts` | `Theme`, `THEMES`, `THEME_TAG_SUGGESTIONS` (แก่นเรื่องข้ามศาสตร์ B1) |
| `server-auth.ts` | 🔵 `getAuthedSupabase()` — **service-role client + ตรวจ ownership เอง** |

### `lib/supabase/` · `lib/storage/` · `lib/cache/`
| ไฟล์ | โหมด | หน้าที่ |
|---|---|---|
| `lib/supabase/client.ts` | 🔷 | `createClerkSupabaseClient(getToken)` — browser, แนบ Clerk token |
| `lib/supabase/server.ts` | 🔵 | `createServerSupabase` (anon, อ่าน published) + `createServiceSupabase` (service-role, ข้าม RLS) |
| `lib/r2.ts` | 🔷 | `r2Client` (S3Client, lazy — null ถ้าไม่มี env) |
| `lib/storage/r2-client.ts` | 🔷 | `getR2Client`, `getR2Bucket`, `getR2PublicUrl` |
| `lib/storage/upload.ts` | 🔵 | `uploadToR2` (ตรวจ MIME/size, prefix `uploads/`) |
| `lib/storage/delete.ts` | 🔵 | `deleteFromR2` (จำกัด `uploads/` เท่านั้น), `keyFromUrl` |
| `lib/storage/index.ts` | 🔷 | barrel export |
| `lib/cache/redis.ts` | 🔵 | Upstash Redis REST (`hasRedis`, `redisGet/Set/Del/DelPattern`) |
| `lib/cache/cache.ts` | 🔵 | `KEYS`, `getCached`/`setCached`/`invalidateEntry` (TTL 300s, fallback ถ้าไม่มี Redis) |
| `lib/cache/index.ts` | 🔷 | barrel export |
| `lib/hooks/use-isomorphic-layout-effect.ts` | 🟢 | hook ฝั่ง client |

> **สัญลักษณ์:** `🔵 server` = Server Component/Action/API route · `🟢 client` = `"use client"` · `🔷 data` = pure data logic · `🟣 infra` = config/middleware/schema

---

## 2) เส้นทางงาน: แก้/เพิ่มหน้าสาธารณะ (Static & Dynamic Pages)

**เปิด (Open)**
* `app/<route>/page.tsx` 🔵 — หน้าที่จะเพิ่ม/แก้ (Server Component เริ่มต้น)
* `components/page-header.tsx` · `components/section-heading.tsx` · `components/empty-state.tsx`
* `app/globals.css` 🟣 — เรียก design tokens (`--color-*`, `--accent`)

**เชื่อม (Wires)**
* `lib/content/cosmology.ts` → `routeCosmology(pathname)` เป็น single source ของ accent ตามเส้นทาง
* `components/accent-controller.tsx` 🟢 — ตั้ง `--accent` + `data-cosmology` บน `<html>`
* `app/template.tsx` — route-fade + เปิด `.scroll-reveal`→`.visible`

**ไหล (Flow)**
```text
request → app/<route>/page.tsx (server)
       → accent-controller อ่าน pathname → routeCosmology() → ตั้ง --accent
       → เพจใช้ tokens (var(--color-on-surface), var(--accent)…)
       → .scroll-reveal ถูกเปิดทีละบล็อกโดย ScrollReveal ใน template.tsx
```

**ระวัง (Gotchas)**
* **Thai-first:** ภาษาไทยเป็นหลัก `lang="th"` ห้ามเพิ่ม EN route/switcher
* **Token Compliance:** ต้องใช้ design tokens เสมอ อ้างอิง `VOS.md` ห้าม hardcode สี
* **Global Chrome:** อย่าแตะ global chrome (`site-header`/`site-footer`/`layout`/`template`) โดยไม่ได้สั่ง

---

## 3) เส้นทางงาน: แสดงเนื้อหา Published บนหน้าสาธารณะ (DB → Cache → Seed)

**เปิด (Open)**
* `lib/content/public-source.ts` 🔷 — `getPublicEntries()`, `getPublicEntryBySlug(slug)`
* `app/articles/page.tsx` 🔵 — รายการบทความ
* `app/articles/[slug]/page.tsx` 🔵 — อ่านบทความเดี่ยว

**เชื่อม (Wires)**
* `lib/content/entries-db.ts` → ดึงจาก Supabase (anon client, เฉพาะ `status='published'`)
* `lib/cache/cache.ts` → `cached()` หุ้ม DB call (TTL 300s)
* `lib/content/entries.ts` → seed data เป็น fallback ถ้า DB ว่างหรือ error

**ไหล (Flow)**
```text
หน้าสาธารณะ → getPublicEntries()
           → cached(KEYS.entries, () => getPublishedEntries())
           → Hit Redis? คืนทันที
           → Miss? ดึง Supabase → ถ้ามีข้อมูลเก็บ Redis → ถ้าว่าง/error ใช้ seed entries
```

**ระวัง (Gotchas)**
* หน้าที่ใช้ `public-source` ต้องใส่ `export const revalidate = 300;` เพื่อให้ Next.js ISR สอดคล้องกับ Redis TTL
* ห้ามดึง draft ในหน้านี้เด็ดขาด

---

## 4) เส้นทางงาน: แก้หน้าอ่าน / ระบบ Reading (TOC · Cited · Links)

**เปิด (Open)**
* `components/reading/reading-page.tsx` 🔵 — หน้าอ่านหลัก (ใช้ร่วมทั้ง article และ concept ตามหลัก `AES.md`)
* `components/reading/internal-link-text.tsx` 🔵 — แปลง `[[wikilink]]` เป็นลิงก์
* `components/reading/table-of-contents.tsx` 🟢 — สารบัญตาม H2/H3
* `components/reading/citation-block.tsx` 🟢 — กล่องคัดลอกอ้างอิงบรรณานุกรม

**เชื่อม (Wires)**
* `lib/content/internal-links.ts` → `parseInternalLinks`
* `lib/content/concept-registry.ts` → เช็กว่าคำใน `[[ ]]` เป็นแนวคิดหรือไม่
* `lib/content/cosmology.ts` → อ่านสีประจำสาขาวิชา

**ไหล (Flow)**
```text
ReadingPage รับ ContentEntry
  → แยกลำดับชั้น Identity Block → Metadata Card ตามรัฐธรรมนูญ AES.md
  → Render Markdown content ผ่าน InternalLinkText
  → แสดง Knowledge Connections (สูงสุด 6 การ์ด)
```

**ระวัง (Gotchas)**
* ต้องปฏิบัติตาม **Editorial Experience System (`AES.md`)** และ **Editorial DNA (`EDS.md`)** อย่างเคร่งครัด
* ความกว้างหน้าอ่านต้องจำกัดที่ `760px` เพื่อไม่ให้สายตาล้า

---

## 5) เส้นทางงาน: เขียน / บันทึก / เผยแพร่ใน Studio (Editor Flow)

**เปิด (Open)**
* `app/studio/editor/page.tsx` 🟢 — UI Editor
* `app/studio/editor/actions.ts` 🔵 — Server actions (`saveDraftAction`, `publishAction`)
* `lib/content/draft-db.ts` 🔵 — `saveDraft`, `publishEntry`

**เชื่อม (Wires)**
* `lib/content/server-auth.ts` → `getAuthedSupabase()` ตรวจสอบความเป็นเจ้าของ (Ownership guard)
* `lib/cache/cache.ts` → `invalidateEntry(slug)` ล้างแคชเมื่อ publish

**ไหล (Flow)**
```text
Editor (Autosave) → saveDraftAction() → ตรวจ ownership → upsert ลงตาราง entries (status='draft')
Publish         → publishAction()   → ตรวจ checklist → อัปเดต status='published' → addRevision() → invalidateEntry()
```

**ระวัง (Gotchas)**
* ตรวจสอบสิทธิ์ด้วย `server-auth.ts` เสมอ ห้ามให้ผู้เขียนคนอื่นแก้ draft ที่ตนไม่ได้เป็นเจ้าของ
* หลัง publish ต้องเรียก `invalidateEntry(slug)` ทุกครั้ง ไม่เช่นนั้นหน้าสาธารณะจะแสดงข้อมูลเก่า

---

## 6) เส้นทางงาน: Auth / Roles / การป้องกันเส้นทาง (Clerk + Supabase)

**เปิด (Open)**
* `proxy.ts` 🟣 — Clerk middleware ป้องกันเส้นทาง `/studio/*` และ `/th/*`
* `lib/content/roles.ts` 🔷 — `Role` (`admin`/`writer`/`user`), `canWrite`, `isAdmin`
* `lib/content/server-auth.ts` 🔵 — `getAuthedSupabase()` สำหรับ Server Actions

**เชื่อม (Wires)**
* `@clerk/nextjs/server` → `auth()`, `currentUser()`
* Supabase Service Role Key (ใช้งานเฉพาะฝั่งเซิร์ฟเวอร์เพื่อข้าม RLS ในงาน Admin)

**ระวัง (Gotchas)**
* **ห้ามเปิดเผย `SUPABASE_SERVICE_ROLE_KEY` สู่หน้า Browser หรือใส่ prefix `NEXT_PUBLIC_` เด็ดขาด**
* การตรวจสอบสิทธิ์ Admin ต้องทำที่ Server Action/API Route เสมอ ไม่ใช่แค่ซ่อน UI

---

## 7) เส้นทางงาน: กราฟความรู้ Constellation & Wikilinks

**เปิด (Open)**
* `app/constellation/page.tsx` 🔵 — หน้าแผนผังเรดาร์
* `components/constellation/constellation-mindmap.tsx` 🟢 — เรนเดอร์ SVG เส้นโยงและชิปโหนด
* `lib/content/graph.ts` 🔷 — `buildGraph()` คำนวณความสัมพันธ์

**เชื่อม (Wires)**
* `lib/content/concept-registry.ts` → ฐานข้อมูลแนวคิดหลัก
* `lib/content/public-source.ts` → บทความที่เชื่อมโยง

**ระวัง (Gotchas)**
* รองรับ No-JS fallback สำหรับโหมดที่ปิด JavaScript
* เส้นเชื่อมระหว่างศาสตร์ต้องใช้สีผสม Bridge Colors ตามสเปก Cosmology

---

## 8) เส้นทางงาน: ระบบคอมเมนต์ (Comments System)

**เปิด (Open)**
* `components/comments/comments-section.tsx` 🟢 — UI รายการและฟอร์มส่งคอมเมนต์
* `lib/content/comments-actions.ts` 🔵 — `listCommentsAction`, `addCommentAction`, `deleteCommentAction`
* `lib/content/comments-db.ts` 🔷 — ลอจิกติดต่อตาราง `comments`

**ระวัง (Gotchas)**
* คอมเมนต์ใหม่จะแสดงทันทีหรือผ่านการกรองตามสถานะ `visible`
* ผู้ใช้ทั่วไปลบได้เฉพาะคอมเมนต์ของตนเอง ส่วน Admin ลบได้ทั้งหมดผ่าน Studio

---

## 9) เส้นทางงาน: ตัวนับผู้เยี่ยมชม (Page Views Counter)

**เปิด (Open)**
* `lib/content/views-db.ts` 🔵 — `incrementPageView(slug)`, `getPageView(slug)`
* `components/reading/page-view-counter.tsx` 🟢 — UI แสดงยอดอ่านบนหน้าบทความ

**ระวัง (Gotchas)**
* ทำงานแบบ Fire-and-forget ไม่บล็อกการ render หน้าเว็บ
* หาก RPC หรือฐานข้อมูล error ให้คืนค่า `null` และซ่อน UI ทันที (ห้ามแสดงเลข 0 ปลอม)

---

## 10) เส้นทางงาน: อัปโหลดและจัดการสื่อ (Cloudflare R2)

**เปิด (Open)**
* `app/api/upload/route.ts` 🔵 — รับไฟล์และตรวจสอบสิทธิ์ `canWrite`
* `app/api/media/[...key]/route.ts` 🔵 — Proxy ดึงไฟล์จาก Private Bucket
* `lib/storage/upload.ts` 🔵 — `uploadToR2()` บีบอัดและตั้ง prefix `uploads/`

**ระวัง (Gotchas)**
* R2 ถูกตั้งเป็น **Private Bucket** เพื่อความปลอดภัย ห้ามเข้าถึงผ่าน Public URL โดยตรง ต้องผ่าน Proxy `/api/media/`
* อนุญาตเฉพาะผู้ใช้ที่มีสิทธิ์ `canWrite` (Writer/Admin) เท่านั้น

---

## 11) เส้นทางงาน: ระบบแคช (Upstash Redis)

**เปิด (Open)**
* `lib/cache/cache.ts` 🔵 — ตัวจัดการแคชหลัก (`cached`, `invalidateEntry`)
* `lib/cache/redis.ts` 🔵 — Wrapper สำหรับ Upstash Redis REST API

**ระวัง (Gotchas)**
* **Graceful Fallback:** หากไม่มีตัวแปรสภาพแวดล้อม Redis ระบบต้องทำงานต่อได้โดยดึงจาก Supabase โดยตรง ไม่ล่ม
* ห้ามแคชข้อมูล Draft หรือข้อมูลส่วนบุคคลของนักเขียนเด็ดขาด

---

## 12) เส้นทางงาน: ระบบดีไซน์และสีแต้ม (Cosmology & Tokens)

**เปิด (Open)**
* `app/globals.css` 🟣 — ศูนย์รวม Design Tokens, `@property --accent`, Fluid Typography `clamp()`
* `lib/content/cosmology.ts` 🔷 — ศาสตร์สีทั้ง 6 (Prima, Psyche, Lumen, Sapientia, Mercurius, Humanitas)
* `components/accent-controller.tsx` 🟢 — ควบคุมสีแต้มตาม URL Pathname

### 🎨 สเปกสีผสมข้ามศาสตร์ (Bridge Colors Spec)
ใช้สำหรับเส้นเชื่อมโยง (Edges) และเอฟเฟกต์การไล่สีเมื่อเชื่อม 2 ศาสตร์เข้าด้วยกัน:
| Token | คู่ผสมศาสตร์ | Hex Value | Contrast |
|---|---|---|---|
| `--mix-reflection` | Psyche × Sapientia | `#9C9C81` | 6.6 · AA |
| `--mix-threshold` | Prima × Psyche | `#94AABB` | 7.7 · AA |
| `--mix-illumination` | Lumen × Sapientia | `#D9BE80` | 10.2 · AA |
| `--mix-dialogue` | Psyche × Mercurius | `#7C9B9E` | 6.2 · AA |
| `--mix-praxis` | Sapientia × Mercurius | `#AAA478` | 7.3 · AA |
| `--mix-manuscript` | Prima × Sapientia | `#C2B394` | 8.9 · AA |

> **กฎเหล็กดีไซน์:** สีพื้นหลังหลักต้องคงความเป็นกลางที่ลุ่มลึก (`--color-deep-navy` / `#080B16`) เสมอ ห้ามเปลี่ยนสีพื้นหลังตามศาสตร์

---

## 13) เส้นทางงาน: แก่นเรื่องข้ามศาสตร์ (Themes / B1)

**เปิด (Open)**
* `lib/content/themes.ts` 🔷 — นิยามแก่นเรื่องข้ามศาสตร์ (`THEMES`)
* `app/themes/page.tsx` · `app/themes/[slug]/page.tsx` 🔵

**ระวัง (Gotchas)**
* แก่นเรื่องทำหน้าที่เป็นสะพานเชื่อมมโนทัศน์ที่ต่างสำนักกัน ห้ามสร้างข้อมูลแก่นเรื่องเท็จขึ้นเองโดยไม่มีอ้างอิง

---

## 14) เส้นทางงาน: Admin Studio (จัดการผู้ใช้และโมเดอเรชัน)

**เปิด (Open)**
* `app/studio/users/page.tsx` · `actions.ts` — ตั้งค่าบทบาทผู้ใช้ผ่าน Clerk Client
* `app/studio/comments/page.tsx` · `actions.ts` — จัดการและคัดกรองความคิดเห็น

**ระวัง (Gotchas)**
* ตรวจสอบสิทธิ์ `isAdmin` ใน Server Action ก่อนดำเนินการทุกครั้ง

---

## 15) เส้นทางงาน: ระบบค้นหากลาง (Global & Semantic Search)

**เปิด (Open)**
* `app/search/page.tsx` 🔵 — หน้าค้นหาหลัก
* `components/search/search-client.tsx` 🟢 — UI ค้นหาและกรองตามประเภท (`SEARCH_TYPE_LABEL`)
* `lib/content/search-index.ts` 🔷 — รวบรวมดัชนีการค้นหาจากข้อมูล Published

---

## 16) เส้นทางงาน: Env / Build / Lint Checklist

รายการตัวแปรสภาพแวดล้อมที่จำเป็นต้องตรวจสอบ:
```text
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY
SUPABASE_SERVICE_ROLE_KEY (Server-only ห้ามเปิดเผย)
R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
```

---

## 17) สารบัญด่วนเส้นทางงาน (Quick Route Index)

| หากต้องการทำงานเกี่ยวกับ... | ไปที่หัวข้อ | รัฐธรรมนูญที่ต้องตรวจสอบควบคู่ |
|---|---|---|
| เพิ่ม/แก้หน้า Public Static | §2 | `VOS.md`, `Sitemap.md` |
| แสดงเนื้อหา Published / หน้าอ่าน | §3, §4 | `AES.md`, `EDS.md`, `SYMBOLS.md` |
| ระบบเขียน/เผยแพร่ Studio | §5 | `PRD.md`, `EDS.md` |
| ระบบ Auth / Roles / Guard | §6 | `AGENTS.md` |
| กราฟ Constellation / Wikilinks | §7 | `SYMBOLS.md`, `VOS.md` |
| คอมเมนต์ / ตัวนับวิว | §8, §9 | `EDS.md` |
| รูปภาพและสื่อ R2 | §10 | `VOS.md` |
| แคช Redis / Dynamic Accent | §11, §12 | `VOS.md` |
| Admin Studio / ค้นหา | §14, §15 | `PRD.md`, `Sitemap.md` |

---

## 18) รัฐธรรมนูญแม่บทแห่ง ARCHRON (Master Web Design Constitution & Psychology Pillars)

> **ศูนย์รวมปรัชญาและข้อบังคับสถาปัตยกรรม (Structured Constitutional Hub)**  
> AI และนักพัฒนาต้องทำความเข้าใจ 7 มิติยุทธศาสตร์ด้านล่าง ซึ่งจัดกลุ่มจากข้อกำหนด 70 เฟส เพื่อให้การพัฒนาระบบมีความสอดคล้อง ลุ่มลึก และเป็นหนึ่งเดียวกันทั่วทั้งจักรวาล ARCHRON

### 18.1 เสาหลักจิตวิทยาการรับรู้ 8 ประการ (Cognitive & Psychology Pillars)
1. **Interaction Psychology:** ทุกการตอบสนองต้องสม่ำเสมอ คาดเดาได้ และให้ความรู้สึกมั่นคงควบคุมได้
2. **Visual Psychology:** ใช้สัดส่วนที่สงบเงียบ โทนสีดาราศาสตร์ยามค่ำคืน เพื่อสมาธิสูงสุด
3. **Reading Psychology:** ออกแบบเพื่อ Long-form Reading โดยเฉพาะ ระยะบรรทัดสมดุล ช่องว่างพักสายตาโปร่งสบาย
4. **Knowledge Psychology:** จัดโครงสร้างให้เห็นความเชื่อมโยงข้ามสายใยปัญญา (Connectivity of Knowledge)
5. **Curiosity Psychology:** กระตุ้นความสงสัยใคร่รู้ เปิดช่องทางให้สืบค้นลึกลงไปทีละขั้น
6. **Decision Fatigue Reduction:** ลดความวุ่นวายทางสายตาและตัวเลือกที่มากเกินไปในหนึ่งหน้าจอ
7. **Progressive Disclosure:** เปิดเผยความซับซ้อนทีละระดับ (Layered Information) นำเสนอสิ่งสำคัญก่อนเสมอ
8. **Recognition over Recall:** อาศัยสัญลักษณ์ (`SYMBOLS.md`) และสีประจำศาสตร์ เพื่อให้รับรู้ความหมายได้ทันทีโดยไม่ต้องจำ

---

### 18.2 ห่วงโซ่บรรทัดฐานระบบความรู้ (Invariant Knowledge Chain Ontology)
ลำดับชั้นการสืบค้นข้อมูลในระบบ ARCHRON ต้องเรียงตามแกนความลึกนี้อย่างเคร่งครัด:
```text
Thinker (นักคิด) → School (สำนักคิด) → Concept (มโนทัศน์) → Theory (ทฤษฎี) → Article (บทความ) → Reference (อ้างอิง) → Book (ผลงาน) → Timeline (เส้นเวลา) → Related Concept (มโนทัศน์ขนาน) → Criticism (ข้อวิพากษ์) → Modern Research (วิจัยปัจจุบัน)
```

---

### 18.3 โครงสร้างรัฐธรรมนูญ 70 เฟส (7 Strategic Constitutional Dimensions)

#### 🌌 มิติที่ 1: อัตลักษณ์แบรนด์และปรัชญา (Dimension I: Brand Identity & Philosophy)
* **ครอบคลุม:** Phase 1 (Brand DNA), Phase 2 (Design Philosophy), Phase 40 (Master Constitution), Phase 70 (Final Constitution)
* **แกนหลัก:** ARCHRON คือคลังความรู้แห่งความเข้าใจมนุษย์อันยั่งยืน (Timeless Human Knowledge Library) ความงามต้องรับใช้ความเข้าใจ (Beauty serves understanding)

#### 🎨 มิติที่ 2: ระบบปฏิบัติการภาพและโทเค็น (Dimension II: Visual Operating System & Tokens)
* **ครอบคลุม:** Phase 3 (Visual Language), Phase 4 (Color Cosmology), Phase 5 (Typography), Phase 6-8 (Spacing/Grid/Layout), Phase 9 (Component Philosophy), Phase 10 (Motion), Phase 48-50 (Microinteraction/Illustration/Image), Phase 61 (Design Tokens)
* **อ้างอิงหลัก:** ดูรายละเอียดเต็มที่ `VOS.md` และ `SYMBOLS.md` ห้าม hardcode สีหรือขนาดเด็ดขาด

#### 🧭 มิติที่ 3: สถาปัตยกรรมความรู้และโครงข่าย (Dimension III: Knowledge Architecture & Ontology)
* **ครอบคลุม:** Phase 11 (Knowledge System), Phase 23 (Thinker System), Phase 24 (School System), Phase 25 (Concept System), Phase 39 (Knowledge Integrity), Phase 41 (Information Architecture), Phase 44-46 (Knowledge Graph/Relationship/Visualization)
* **อ้างอิงหลัก:** ดูรายละเอียดโครงสร้างที่ `PRD.md` และ `Sitemap.md` แยกระหว่างข้อเท็จจริงกับการตีความอย่างชัดเจน

#### 📖 มิติที่ 4: ประสบการณ์การอ่านและงานบรรณาธิการ (Dimension IV: Editorial Experience & UX)
* **ครอบคลุม:** Phase 13 (Editor Experience), Phase 14 (Library Experience), Phase 15 (Search Philosophy), Phase 27-28 (Editor/Search System), Phase 42-43 (Cognitive/Reading Psychology), Phase 47 (Interaction Language), Phase 51-53 (Card/Dashboard/Writing Psychology)
* **อ้างอิงหลัก:** ดูรายละเอียดเต็มที่ `AES.md` (จังหวะการอ่าน 10 ขั้น) และ `EDS.md` (ดีเอ็นเอการ์ด 6 ชั้น)

#### ⚙️ มิติที่ 5: วิศวกรรมระบบและประสิทธิภาพ (Dimension V: Full-Stack Engineering & Performance)
* **ครอบคลุม:** Phase 12, Phase 18-21, Phase 29-34, Phase 56-59, Phase 62-65 (Architecture, Database, Caching, SEO, Naming Conventions, API Constitution)
* **เป้าหมาย:** บรรทัดฐานสูง (Normalized DB), Lighthouse 95+, รองรับ Offline/Edge Cache

#### 🛠️ มิติที่ 6: การบริหารจัดการ Studio (Dimension VI: Studio Workflow & Administration)
* **ครอบคลุม:** Phase 16 (Profile), Phase 17 (Studio Dashboard), Phase 26 (Dashboard Psychology), Phase 54 (Research Workflow)

#### 🤝 มิติที่ 7: การประกันคุณภาพและ AI ร่วมพัฒนา (Dimension VII: Quality Assurance & AI Collaboration)
* **ครอบคลุม:** Phase 22 (Final UX Audit), Phase 35 (Design Audit), Phase 36 (AI Coding Constitution), Phase 37 (Production Checklist), Phase 38 (QA), Phase 55 (AI Integration), Phase 66-69 (Testing/Doc/Deployment/AI Collaboration)

---

### 18.4 กฎทองคำสูงสุด 18 ประการแห่ง ARCHRON (Invariant Golden Rules)
1. **Knowledge before decoration** — ความรู้อยู่เหนือการตกแต่ง
2. **Meaning before aesthetics** — ความหมายอยู่เหนือสุนทรียะ
3. **Consistency before creativity** — ความสม่ำเสมออยู่เหนือความคิดสร้างสรรค์เฉพาะตัว
4. **Structure before complexity** — โครงสร้างอยู่เหนือความซับซ้อน
5. **Curiosity before certainty** — ความอยากรู้ใคร่ครวญอยู่เหนือความยึดมั่นตายตัว
6. **Evidence before assumption** — ประจักษ์พยานอยู่เหนือสมมติฐาน
7. **Clarity before cleverness** — ความกระจ่างแจ้งอยู่เหนือลูกเล่นแพรวพราว
8. **Accessibility before preference** — การเข้าถึงได้ของคนทุกคนอยู่เหนือความชอบส่วนบุคคล
9. **Reuse before reinvention** — การใช้ซ้ำสิ่งที่มีอยู่เหนือการประดิษฐ์ซ้ำซ้อน
10. **Performance before visual excess** — ประสิทธิภาพความลื่นไหลอยู่เหนือความตระการตาที่ฟุ่มเฟือย
11. **Design with intention** — ออกแบบด้วยความตั้งใจและมีเป้าประสงค์
12. **Write with precision** — เขียนเรียบเรียงเนื้อหาและโค้ดด้วยความแม่นยำ
13. **Connect knowledge** — เชื่อมโยงโครงข่ายความรู้เข้าด้วยกันเสมอ
14. **Question assumptions** — ตั้งคำถามและตรวจสอบสมมติฐานเสมอ
15. **Respect history** — เคารพรากเหง้าทางประวัติศาสตร์และปัญญาชน
16. **Remain timeless** — ดำรงความยั่งยืนเหนือกาลเวลา ไม่ผันแปรตามกระแสฉาบฉวย
17. **Every decision must have a reason.** — ทุกการตัดสินใจต้องมีเหตุผลรองรับเสมอ
18. **Everything belongs to one coherent universe.** — ทุกสิ่งทุกอย่างหลอมรวมเป็นหนึ่งจักรวาลเดียวกัน

---

### 18.5 โปรโตคอลการส่งมอบงานร่วมกันระหว่าง AI (AI Collaboration & Governance Protocol)
* **Zero Architectural Regression:** AI ตัวถัดไปห้ามรื้อโครงสร้างหรือปรับเปลี่ยนพฤติกรรมระบบเดิมโดยไม่ได้รับคำสั่ง
* **Strict Token Inheritance:** UI ใหม่ทุกชิ้นต้องอ้างอิง Design Tokens ใน `app/globals.css` และปฏิบัติตามสเปก `VOS.md`, `AES.md`, `EDS.md`
* **Mandatory Green Verification:** ก่อนเสร็จสิ้นภารกิจ AI ต้องรันคำสั่ง `npm run lint` และตรวจสอบให้แน่ใจว่าผ่าน 100% โดยไม่มีข้อผิดพลาดใดๆ
