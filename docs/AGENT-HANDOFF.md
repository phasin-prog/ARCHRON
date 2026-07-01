# 🧭 AGENT-HANDOFF.md — แผนที่เส้นทางงานสำหรับ AI ตัวถัดไป

> ไฟล์นี้คือ **"index library" แบบ task-oriented** — บอก AI/นักพัฒนาที่เข้ามาทำงานต่อได้เลยว่า
> **"จะทำงานประเภทนี้ ต้องเปิดไฟล์ไหน แบบไหน (server/client) และเชื่อมกับอะไรบ้าง"**
>
> อ่านลำดับนี้ก่อนเริ่มทุกครั้ง: `AGENTS.md` (กฎ/ขอบเขต) → ไฟล์นี้ (เส้นทางงาน) → `docs/code-index.md` (รายการไฟล์โดยละเอียด)
>
> สถานะ: อัปเดตให้ตรงกับโค้ดจริง (รวม R2/Redis/API routes/themes/studio comments·users·profile/server-auth refactor)
> ภาพรวมดีไซน์/ระบบดูที่ [`../README.md`](../README.md) · กฎการทำงานดูที่ [`../AGENTS.md`](../AGENTS.md)

สแตก: **Next.js 16 (App Router/RSC/ISR) · React 19 · Tailwind v4 · Supabase (RLS) · Clerk · Cloudflare R2 · Upstash Redis · TypeScript**

---

## 0) วิธีอ่านไฟล์นี้

แต่ละ "เส้นทางงาน" (§2 เป็นต้นไป) มีโครงสร้าง:
- **เปิด (Open):** ไฟล์ที่ต้องแก้/ดูเป็นหลัก + ป้าย `🔵 server`/`🟢 client`/`🔷 data`/`🟣 infra`
- **เชื่อม (Wires):** โมดูลที่ไฟล์หลัก import/เรียก ต้องเข้าใจด้วย
- **ไหล (Flow):** data flow สั้นๆ ของระบบนั้น
- **ระวัง (Gotchas):** กับดัก/รูปแบบบังคับ

---

## 1) แผนที่โค้ดรวม (รายการไฟล์ครบถ้วน · อ้างอิงไขว้)

### ราก (root)
| ไฟล์ | โหมด | หน้าที่ |
|---|---|---|
| `proxy.ts` | 🟣 | **Clerk middleware** (ป้องกัน `/studio/editor·users·comments(.*)` ต้อง login · `/th/login·register` auth route · ปล่อยผ่านถ้าไม่มีคีย์ Clerk) — ⚠️ ชื่อไฟล์คือ `proxy.ts` **ไม่ใช่** `middleware.ts` |
| `next.config.mjs` | 🟣 | Next config (ตั้ง `turbopack.root` เลี่ยงสแกน parent lockfile) |
| `eslint.config.mjs` · `postcss.config.mjs` | 🟣 | ESLint flat config · PostCSS (Tailwind v4) |
| `test-concurrent.js` · `test-fetch.js` | 🔷 | สคริปต์ทดสอบชั่วคราว (ไม่ใช้ใน build) |

### `app/` — หน้าสาธารณะ
| Route | ไฟล์ | โหมด | หน้าที่ |
|---|---|---|---|
| `/` | `app/page.tsx` | 🔵 | หน้าแรก (hero, pillars, ATLAS, manifesto, quick links) |
| `/knowledge` | `app/knowledge/page.tsx` | 🔵 | สารบัญคลังความรู้ (การ์ดนำทาง) |
| `/articles` | `app/articles/page.tsx` + `loading.tsx` | 🔵 (ISR 5m) | รายการบทความ (DB published → fallback seed) |
| `/articles/[slug]` | `app/articles/[slug]/page.tsx` | 🔵 (SSG+ISR) | หน้าอ่านบทความ (`ReadingPage`, section="articles") |
| `/concepts` | `app/concepts/page.tsx` | 🔵 | รายการแนวคิด (จาก concept-registry) |
| `/concepts/[slug]` | `app/concepts/[slug]/page.tsx` | 🔵 (SSG+ISR) | หน้าอ่านแนวคิด (entry→`ReadingPage`+Backlinks; ไม่มี entry→stub registry) |
| `/constellation` | `app/constellation/page.tsx` | 🔵 (dynamic) | Radial focus-map + no-JS fallback |
| `/themes` · `/themes/[slug]` | `app/themes/page.tsx` · `app/themes/[slug]/page.tsx` | 🔵 | แก่นเรื่องข้ามศาสตร์ (B1) |
| `/external-links` | `app/external-links/page.tsx` | 🔵 | ทรัพยากรภายนอก (6 หมวด) |

### `app/studio/` — เขียน/ดูแล (Clerk)
| Route | ไฟล์ | โหมด | หน้าที่ |
|---|---|---|---|
| `/studio` | `app/studio/page.tsx` · `layout.tsx` | 🟢/🔵 | Landing/Login นักเขียน + chrome เฉพาะ studio (ซ่อน header/footer สาธารณะ, force-dynamic) |
| `/studio/editor` | `app/studio/editor/page.tsx` · `actions.ts` | 🟢 page · 🔵 actions | ตัวแก้เนื้อหา (autosave, version, publish, markdown, my-content-search) |
| `/studio/profile` | `app/studio/profile/page.tsx` · `actions.ts` | 🟢 page · 🔵 actions | โปรไฟล์ตนเอง + ขอเป็นนักเขียน |
| `/studio/users` | `app/studio/users/page.tsx` · `actions.ts` | 🟢 page · 🔵 actions | จัดการผู้ใช้ (admin) ตั้งบทบาทผ่าน clerkClient |
| `/studio/comments` | `app/studio/comments/page.tsx` · `actions.ts` | 🟢 page · 🔵 actions | โมเดอเรชันคอมเมนต์ (admin) ซ่อน/แสดง/ลบ |

### `app/th/` — บัญชีนักอ่าน (Clerk)
| Route | ไฟล์ | โหมด | หน้าที่ |
|---|---|---|---|
| `/th/login` | `app/th/login/[[...login]]/page.tsx` · `app/th/layout.tsx` | 🟢 | เข้าสู่ระบบบัญชีนักอ่าน |
| `/th/register` | `app/th/register/[[...register]]/page.tsx` | 🟢 | สมัครบัญชีนักอ่าน |

### `app/api/` — API routes
| Endpoint | ไฟล์ | โหมด | หน้าที่ |
|---|---|---|---|
| `POST /api/upload` | `app/api/upload/route.ts` | 🔵 | อัปโหลดรูปขึ้น R2 (ต้อง login + `canWrite`) |

### `lib/content/` — data layer (🔷 data ส่วนใหญ่)
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

### `lib/supabase/` · `lib/storage/` · `lib/cache/`
| ไฟล์ | โหมด | หน้าที่ |
|---|---|---|
| `lib/supabase/client.ts` | 🔷 | `createClerkSupabaseClient(getToken)` — browser, แนบ Clerk token (ใช้ในหน้า client เก่าที่ยังไม่ refactor) |
| `lib/supabase/server.ts` | 🔵 | `createServerSupabase` (anon, อ่าน published) + `createServiceSupabase` (service-role, ข้าม RLS, admin actions) |
| `lib/r2.ts` | 🔷 | `r2Client` (S3Client, lazy — null ถ้าไม่มี env) |
| `lib/storage/r2-client.ts` | 🔷 | `getR2Client`, `getR2Bucket`, `getR2PublicUrl` |
| `lib/storage/upload.ts` | 🔵 | `uploadToR2` (ตรวจ MIME/size, prefix `uploads/`) |
| `lib/storage/delete.ts` | 🔵 | `deleteFromR2` (จำกัด `uploads/` เท่านั้น), `keyFromUrl` |
| `lib/storage/index.ts` | 🔷 | barrel export |
| `lib/cache/redis.ts` | 🔵 | Upstash Redis REST (`hasRedis`, `redisGet/Set/Del/DelPattern`) |
| `lib/cache/cache.ts` | 🔵 | `KEYS`, `getCached`/`setCached`/`invalidateEntry` (TTL 300s, fallback ถ้าไม่มี Redis) |
| `lib/cache/index.ts` | 🔷 | barrel export |
| `lib/hooks/use-isomorphic-layout-effect.ts` | 🟢 | hook ฝั่ง client |
| `themes.ts` | `Theme`, `THEMES`, `THEME_TAG_SUGGESTIONS` (แก่นเรื่องข้ามศาสตร์ B1) |
| `server-auth.ts` | 🔵 `getAuthedSupabase()` — **service-role client + ตรวจ ownership เอง** (ไม่ใช้ Clerk JWT template แล้ว) |
| `GET /api/media/[...key]` | `app/api/media/[...key]/route.ts` | 🔵 | proxy ดึงไฟล์จาก R2 (private bucket) |
| `/schools` | `app/schools/page.tsx` | 🔵 | สำนักคิด/นักปราชญ์ (เรียก `SchoolsHub`) |
| `/faq` | `app/faq/page.tsx` | 🔵 | คำถามที่พบบ่อย (`Accordion`) |
| `/guide` | `app/guide/page.tsx` | 🔵 | บริการ Jungian Type Analysis |
| `/manifesto` | `app/manifesto/page.tsx` | 🔵 | ปฏิญญาโครงการ |
| `/reading-sets` | `app/reading-sets/page.tsx` | 🔵 | เส้นทางการอ่าน/ซีรีส์ (placeholder) |
| `/search` | `app/search/page.tsx` + `loading.tsx` | 🔵 | ค้นหากลาง (`SearchClient`) |
| `/sources` | `app/sources/page.tsx` | 🔵 | แหล่งอ้างอิงภายใน |
| `/support` | `app/support/page.tsx` | 🔵 | สนับสนุนโครงการ |

> สัญลักษณ์: `🔵 server` = Server Component/Action/API route · `🟢 client` = `"use client"` · `🔷 data` = pure data logic · `🟣 infra` = config/middleware/schema

---

## 2) เส้นทางงาน: แก้/เพิ่มหน้าสาธารณะ (static page)

**เปิด (Open)**
- `app/<route>/page.tsx` 🔵 — หน้าที่จะเพิ่ม/แก้ (Server Component เริ่มต้น)
- `components/page-header.tsx` · `components/section-heading.tsx` · `components/empty-state.tsx` — ชิ้นส่วนหัว/ส่วนทั่วไป
- `app/globals.css` 🟣 — เรียก design tokens (`--color-*`, `--accent`)

**เชื่อม (Wires)**
- `lib/content/cosmology.ts` → `routeCosmology(pathname)` เป็น single source ของ accent ตามเส้นทาง
- `components/accent-controller.tsx` 🟢 — ตั้ง `--accent` + `data-cosmology` บน `<html>` (mount ใน `app/layout.tsx`)
- `app/template.tsx` — route-fade + เปิด `.scroll-reveal`→`.visible` (ScrollReveal กลาง)
- `components/site-header.tsx` — เมนูนำทาง (⚠️ global chrome — ห้ามแตะโดยไม่ได้รับคำสั่ง, กฎ §2 ใน AGENTS.md)

**ไหล (Flow)**
```
request → app/<route>/page.tsx (server)
       → accent-controller อ่าน pathname → routeCosmology() → ตั้ง --accent
       → เพจใช้ tokens (var(--color-on-surface), var(--accent)…)
       → .scroll-reveal ถูกเปิดทีละบล็อกโดย ScrollReveal ใน template.tsx
```

**ระวัง (Gotchas)**
- Thai-first: ภาษาไทยเป็นหลัก `lang="th"` (ตั้งใน layout) ห้ามเพิ่ม EN route/switcher
- ใช้ design tokens เสมอ ห้าม hardcode สี — brand palette/โทนต้องไม่เปลี่ยน (guardrail #5)
- ลิงก์ภายนอกใช้ `target="_blank" rel="noopener noreferrer"`
- หน้าที่ดึง DB ให้ `export const revalidate = 300` (ตรง cache TTL) และใช้ `getPublicEntries` (§3) ไม่ใช่ seed ตรงๆ
- อย่าแตะ global chrome (`site-header`/`site-footer`/`layout`/`template`) โดยไม่ได้สั่ง

---

## 3) เส้นทางงาน: แสดงเนื้อหา published บนหน้าสาธารณะ (DB → cache → seed)

**เปิด (Open)**
- `lib/content/public-source.ts` 🔷 — `getPublicEntries()` / `getPublicEntryBySlug(slug)` (แหล่งเดียวที่หน้า public ควรเรียก)
- `app/articles/page.tsx` · `app/articles/[slug]/page.tsx` · `app/concepts/[slug]/page.tsx` 🔵

**เชื่อม (Wires)**
- `lib/content/entries-db.ts` 🔷 → `getPublishedEntries` / `getPublishedEntryBySlug` / `getPublishedSlugs` (ใช้ `createServerSupabase` = anon, RLS อนุญาตอ่าน `status=published` ทุกคน)
- `lib/cache/cache.ts` 🔵 → `cached(key, fetchFresh, ttl=300)`, `KEYS.entries` / `KEYS.entryBySlug(slug)`, `invalidateEntry(slug)`
- `lib/content/entries.ts` 🔷 — seed static (fallback เมื่อไม่มี DB/env)
- `lib/content/entry-mapper.ts` 🔷 → `rowToEntry` (แปลง DB row → `ContentEntry`)
- `types/content.ts` — โมเดล `ContentEntry`

**ไหล (Flow)**
```
page (server) → getPublicEntries()
  → hasSupabaseEnv()? 
     ใช่ → cached(KEYS.entries, () => getPublishedEntries())  // Upstash 300s
           → DB anon เลือก status=published → rowToEntry ทุกแถว
           → ถ้า DB ว่าง/null → คืน null → cached ไม่จด → ตกไป seed
     ไม่ใช่ → staticPublished() (seed entries.ts ที่ status=published)
```

**ระวัง (Gotchas)**
- public-source อ่าน **เฉพาะ `status=published`** เท่านั้น — draft ส่วนตัวของนักเขียน **ห้ามหลุด** สู่ public (guardrail #7)
- `getPublishedEntries` ใช้ anon client (RLS อนุญาต) — ห้ามใช้ service-role ฝั่งอ่านสาธารณะ
- TTL 300s ตรงกับ `revalidate = 300` — เมื่อ publish ต้อง `invalidateEntry(slug)` + `revalidatePath` (ดู §5) ไม่งั้นสาธารณะเห็นของเก่า
- fallback seed ทำให้ build ผ่านแม้ยังไม่ตั้ง Supabase — อย่าลบชั้นนี้

---

## 4) เส้นทางงาน: หน้าอ่านบทความ/แนวคิด + Reading features (A1–A3)

**เปิด (Open)**
- `components/reading/reading-page.tsx` 🔵 — **หน้าอ่าน Unified** (ใช้ทั้ง article/concept) — breadcrumb, meta-grid, markdown, related, refs, CTA
- `app/articles/[slug]/page.tsx` · `app/concepts/[slug]/page.tsx` 🔵 — server-fetch แล้วส่ง `<ReadingPage entry={…} section="articles"|"concepts" />`

**เชื่อม (Wires)**
- ส่วนประกอบในโฟลเดอร์เดียวกัน:
  - `reading-toc.tsx` · `floating-toc.tsx` — สารบัญ + ลอย (A3)
  - `reading-progress.tsx` · `reading-dock.tsx` · `reading-mobile-bar.tsx` — ความคืบหน้าการอ่าน (A3)
  - `internal-link-text.tsx` — render `[[wikilink]]` ในเนื้อหา
  - `internal-concept-link.tsx` 🟢 — glossary hover (A2)
  - `comment-section.tsx` 🟢 — คอมเมนต์ (ดู §8)
  - `view-counter.tsx` 🟢 — นับวิว (ดู §9)
  - `local-graph.tsx` — กราฟความสัมพันธ์ใกล้ตัว
- `lib/content/related.ts` → `getBacklinksForConcept` (backlinks เฉพาะ concepts)
- `lib/content/themes.ts` → `themesForEntry` (แท็กแก่นเรื่อง)
- `lib/content/concept-registry.ts` → `conceptTitle` (ชื่อ node)
- Markdown: `react-markdown` + `remark-gfm` (mdComponents ฉีด `InternalLinkText`/`InternalConceptLink`/`Tooltip` + ฟังก์ชัน `citeify` สำหรับ `[[cite:N]]` → A1)

**ไหล (Flow)**
```
page (server) → getPublicEntryBySlug(slug)
  → ส่ง entry + section ให้ ReadingPage
  → ReadingPage วาด: breadcrumb · meta-grid · markdown(mdComponents)
     · related concepts · refs · TOC(headings) · ReadingProgress
     · CommentSection (client island, ห่อ ClerkProvider) · ViewCounter · LocalGraph
```

**ระวัง (Gotchas)**
- `ReadingPage` เป็น Server Component แต่ **ห่อ client islands** (`CommentSection`, `ViewCounter`) ใน `ClerkProvider` — อย่าดึง `auth()` ในตัวมันโดยตรง
- Reading systems: **A1** citation `[[cite:N]]` (ฟังก์ชัน `citeify` ใน reading-page) · **A2** glossary hover (`internal-concept-link`) · **A3** TOC/progress
- `section` ตั้งค่า label breadcrumb (`SECTION_LABEL`) และเปิด backlinks **เฉพาะ concepts**
- ห้ามดึง draft มาแสดงที่นี่ — ใช้ `getPublicEntryBySlug` (published เท่านั้น)

---

## 5) เส้นทางงาน: Studio Editor — เขียน / บันทึก / เผยแพร่เนื้อหา

**เปิด (Open)**
- `app/studio/editor/page.tsx` 🟢 — ตัวแก้เนื้อหา (client: autosave, markdown, dropdown, my-content-search)
- `app/studio/editor/actions.ts` 🔵 — server actions: `saveDraftAction`, `saveDraftWithRevisionAction`, `loadDraftAction`, `publishAction`, `revalidatePublic`
- `components/studio/*` — `my-content-search`, `related-concept-picker`, `internal-link-suggestion-panel`, `revision-panel`, `image-uploader`/`image-picker` (ดู §10), `searchable-select`/`searchable-multi-select`, `feedback-toast`

**เชื่อม (Wires)**
- `lib/content/server-auth.ts` 🔵 → `getAuthedSupabase()` — **service-role client + ตรวจ ownership เอง** (คืน `{ userId, supabase }`)
- `lib/content/draft-db.ts` 🔷 → `saveDraft` (ownership guard), `loadDraftBySlug`, `listMyDrafts`, `publishEntry` (ownership guard) — ทุก op ตรวจ `author_id === userId`
- `lib/content/entries-db.ts` 🔷 → `addRevision`, `getRevisions`, `listMyEntries`, `getMyEntryBySlug`, `upsertEntryRow`, `deleteEntry`
- `lib/content/publish-validation.ts` 🔷 → `EditorDraft`, `EMPTY_DRAFT`, `canPublish`, `getPublishChecklist`, `slugify`
- `lib/content/draft-mapper.ts` 🔷 → `draftToRow` / `entryToDraft`
- `lib/cache/cache.ts` → `invalidateEntry(slug)` (ล้าง Redis หลัง publish)
- `next/cache` → `revalidatePath`

**ไหล (Flow)**
```
page(client) → autosave/บันทึก
  → saveDraftAction(draft) → getAuthedSupabase() (service role)
  → saveDraftDb(supabase, userId, draft) → upsert entries (status=draft, ตรวจ ownership)
  → (บันทึกด้วยตนเอง) addRevision(snapshot, "บันทึกด้วยตนเอง")

publish → publishAction(draft)
  → getAuthedSupabase() → publishEntry (ownership) → status=published
  → addRevision({...draft, status:"published"}, "เผยแพร่")
  → invalidateEntry(slug)        // ล้าง Upstash
  → revalidatePublic(slug)       // revalidatePath /articles,/concepts,/[slug]
```

**ระวัง (Gotchas)**
- service-role **ข้าม RLS** → ownership ต้องตรวจใน data layer เสมอ (`draft-db.ts` ใช้ `getExistingAuthor`) — มิฉะนั้นผู้ใช้ A เขียนทับงาน B ได้
- **เลิกใช้ Clerk JWT template แล้ว** (เคยทำให้เกิด error "No suitable key or wrong key type") — ใช้ `getAuthedSupabase` แทน
- draft **ต้องไม่หลุด** สู่ public — `public-source` กรอง `status=published` เท่านั้น
- หลัง publish ต้อง `invalidateEntry` + `revalidatePublic` ทุกครั้ง (ไม่งั้นสาธารณะเห็นของเก่า)
- ตรวจ `canPublish(draft)` ก่อน publish และใช้ `slugify` สร้าง slug

---

## 6) เส้นทางงาน: Auth & Roles (Clerk + Supabase)

**เปิด (Open)**
- `proxy.ts` 🟣 — **Clerk middleware** (⚠️ ไฟล์ชื่อ `proxy.ts` **ไม่ใช่** `middleware.ts` — Next 16.3 convention)
- `lib/content/roles.ts` 🔷 — `Role` (`admin`/`writer`/`user`), `roleFromMetadata`, `canWrite`, `isAdmin`, `ROLE_META`
- `lib/content/server-auth.ts` 🔵 — `getAuthedSupabase()`, `getUserRole()`
- `lib/supabase/server.ts` 🔵 — `createServerSupabase` (anon, อ่าน published) + `createServiceSupabase` (service-role, admin)
- `app/studio/layout.tsx` — `ClerkProvider` + force-dynamic + ซ่อน chrome สาธารณะ
- `app/th/login` · `app/th/register` 🟢 — บัญชีนักอ่าน (Clerk)

**เชื่อม (Wires)**
- `@clerk/nextjs/server` → `auth()`, `clerkClient()` (set role ผ่าน `users.updateUserMetadata({ publicMetadata:{ role } })`)
- role เก็บใน **Clerk `publicMetadata.role`**

**ไหล (Flow)**
```
request → proxy.ts
  → hasClerk? (มี publishable+secret key)
     ไม่มี → NextResponse.next() (ปล่อยผ่าน เว็บไม่ 500)
     มี   → clerkMiddleware → isProtectedRoute(/studio/editor·users·comments)? → auth.protect()
            isAuthRoute(/th/login·register)? → ปล่อยไปหน้า Clerk

server action → getAuthedSupabase() → auth() เอา userId → createClient(service role) → ตรวจ ownership ใน data layer
admin action  → getUserRole() ต้องเป็น admin → createServiceSupabase() → ทำงาน
```

**ระวัง (Gotchas)**
- ชื่อไฟล์ **`proxy.ts`** — ห้ามสร้าง `middleware.ts` ซ้ำ
- ถ้าไม่มี Clerk env → proxy ปล่อยผ่าน (public site ไม่ล่ม) — `/studio` จะถูกป้องกันจริงเมื่อใส่คีย์ครบ
- route ที่ป้องกัน: `/studio/editor`, `/studio/users`, `/studio/comments` — `/studio` (landing) เปิดสาธารณะ
- `SUPABASE_SERVICE_ROLE_KEY` server-only **ห้าม** prefix `NEXT_PUBLIC_`
- role default `"user"`; `canWrite` = admin|writer; `isAdmin` = admin เท่านั้น

---

## 7) เส้นทางงาน: Wiki / Knowledge Graph (Concepts · Constellation · Internal links)

**เปิด (Open)**
- `lib/content/concept-registry.ts` 🔷 — `conceptRegistry`, `NodeType`, `getConceptBySlug`, `resolveConcept`, `conceptTitle` (single source ของ node)
- `app/concepts/page.tsx` · `app/concepts/[slug]/page.tsx` 🔵
- `app/constellation/page.tsx` 🔵 + `components/constellation/constellation-mindmap.tsx` 🟢

**เชื่อม (Wires)**
- `lib/content/graph.ts` 🔷 → `buildGraph`, `NODE_TYPE_LABEL/COLOR`, `RELATION_LABEL`
- `lib/content/internal-links.ts` 🔷 → `parseInternalLinks`, `findDeadLinks`, `findLinkSuggestions`
- `lib/content/related.ts` 🔷 → `getBacklinksForConcept` (backlinks เฉพาะ concepts)
- `components/reading/internal-link-text.tsx` — render `[[wikilink]]`
- `components/reading/local-graph.tsx` — กราฟใกล้ตัวบนหน้าอ่าน

**ไหล (Flow)**
```
/concepts        → รายการจาก conceptRegistry
/concepts/[slug] → resolveConcept(slug)
   มี entry (published) → ReadingPage(section="concepts") + getBacklinksForConcept
   ไม่มี entry          → stub จาก registry
/constellation   → buildGraph(registry) → constellation-mindmap (client)
   → SVG เส้นโยง + HTML node chips · คลิกย้ายศูนย์กลาง (?focus=) · no-JS fallback
เนื้อหา [[wikilink]] → parseInternalLinks → InternalLinkText render (link หรือ dead-link)
```

**ระวัง (Gotchas)**
- `concept-registry` เป็น canonical node list — **เพิ่ม node ที่นี่ก่อน** แล้วค่อยเขียน entry
- relation type ใช้ `RelationType` (prerequisite/related/contrasts-with/part-of/source-of/used-in/influenced-by)
- ใช้ `findDeadLinks` ตรวจลิงก์เสียก่อน publish
- `constellation-mindmap` เป็น client component และต้องมี **no-JS fallback**
- ห้ามแต่งเนื้อหาแนวคิดขึ้นเองโดยไม่มีข้อมูลจริง (guardrail #3 — ถามก่อน)


---

## 8) เส้นทางงาน: คอมเมนต์ (Comments)

**เปิด (Open)**
- `components/reading/comment-section.tsx` 🟢 — UI คอมเมนต์ท้ายหน้าอ่าน (client island ใน ReadingPage)
- `lib/content/comments-actions.ts` 🔵 — server actions: `listCommentsAction`, `addCommentAction`, `deleteCommentAction`
- `lib/content/comments-db.ts` 🔷 — `listComments`, `addComment`, `deleteComment`, `Comment`, `CommentInput`

**เชื่อม (Wires)**
- `lib/supabase/server.ts` → `createServerSupabase` (anon) สำหรับ **อ่าน** (RLS อนุญาตอ่าน `status=visible`)
- `lib/content/server-auth.ts` → `getAuthedSupabase()` (service role) สำหรับ **เขียน/ลบ** + ตรวจ ownership
- `@clerk/nextjs/server` → `auth()`, `clerkClient()` (ดึง `authorName` จาก Clerk)
- `supabase/schema.sql` — ตาราง `comments` + RLS

**ไหล (Flow)**
```
อ่าน → listCommentsAction(section, slug) → createServerSupabase (anon)
     → listComments (status=visible) → คืน null เมื่อผิดพลาด → UI ซ่อน
เขียน → addCommentAction(section, slug, body)
     → auth() → getAuthedSupabase() → clerkClient เอา authorName
     → addComment (insert clerk_user_id=userId)
ลบ   → deleteCommentAction → getAuthedSupabase() → ตรวจ clerk_user_id===userId ก่อนลบ
```

**ระวัง (Gotchas)**
- ต้องรัน `supabase/schema.sql` (สร้างตาราง `comments` + RLS) ก่อน — ไม่งั้น `listComments` คืน null → UI ซ่อนไปอย่างนุ่มนวล (ไม่ 500)
- RLS: ล็อกอินแล้วคอมเมนต์ได้; แก้/ลบเฉพาะของตน
- กรอง `status=visible` เสมอ (มีโหมด hidden สำหรับ moderation — ดู §14)
- เขียน/ลบใช้ service role → **ต้องตรวจ ownership ในโค้ด** (`clerk_user_id === userId`)

---

## 9) เส้นทางงาน: ตัวนับผู้เยี่ยมชม (Page Views)

**เปิด (Open)**
- `components/reading/view-counter.tsx` 🟢 — นับวิวรายชิ้น (บนหน้าอ่าน)
- `components/view-badge.tsx` — ป้ายวิวบนการ์ด
- `components/site-footer.tsx` — ยอดรวมทั้งเว็บ
- `lib/content/views-db.ts` 🔷 — `incrementPageView`, `getPageView`, `getTotalPageViews`

**เชื่อม (Wires)**
- ใช้ Supabase **RPC**: `increment_page_view` (SECURITY DEFINER), `total_page_views`
- `supabase/schema.sql` — ตาราง `page_views` + RPC `increment_page_view` / `total_page_views`
- รับ `SupabaseClient` เข้ามา (anon สำหรับอ่าน; increment ผ่าน RPC ที่ SECURITY DEFINER)

**ไหล (Flow)**
```
view-counter (mount) → incrementPageView(supabase, slug) → RPC increment_page_view(p_slug)
                     → คืนยอดใหม่ (fire-and-forget)
แสดงรายชิ้น → getPageView(supabase, slug)
ยอดรวม      → getTotalPageViews(supabase) → RPC total_page_views → site-footer
```

**ระวัง (Gotchas)**
- ต้องสร้างตาราง `page_views` + RPC ใน `supabase/schema.sql` ก่อน (รันใน Supabase SQL Editor)
- คืน `null` เมื่อผิดพลาด → UI **ซ่อน** ได้ (ไม่แสดง 0 ปลอม)
- increment เป็น fire-and-forget — ไม่บล็อกการ render

---

## 10) เส้นทางงาน: อัปโหลด / ลบ / แสดงรูป (Cloudflare R2)

**เปิด (Open)**
- `app/api/upload/route.ts` 🔵 — `POST /api/upload` (multipart `file`)
- `app/api/media/[...key]/route.ts` 🔵 — `GET /api/media/[...key]` proxy ดึงจาก private bucket
- `lib/storage/upload.ts` 🔵 → `uploadToR2` (ตรวจ MIME/size, prefix `uploads/`)
- `lib/storage/delete.ts` 🔵 → `deleteFromR2` (จำกัด `uploads/` เท่านั้น), `keyFromUrl`
- `lib/storage/r2-client.ts` 🔷 → `getR2Client`, `getR2Bucket`, `getR2PublicUrl`
- `lib/r2.ts` 🔷 → `r2Client` (lazy — `null` ถ้าไม่มี env)
- `components/studio/image-uploader.tsx` · `image-picker.tsx` — UI ใน editor

**เชื่อม (Wires)**
- `lib/content/roles.ts` → `canWrite` (ตรวจใน `/api/upload`)
- `@clerk/nextjs/server` → `auth()`, `clerkClient()` (role check)
- env: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`

**ไหล (Flow)**
```
image-uploader → POST /api/upload (multipart "file")
  → auth() + canWrite? (admin/writer เท่านั้น)
  → uploadToR2(buffer, {mime,size}) → key = uploads/… → คืน { url }
แสดง → GET /api/media/[...key] → GetObjectCommand(r2Client) → stream→Buffer → Response
ลบ   → deleteFromR2(keyFromUrl(url)) — จำกัด uploads/ เท่านั้น
```

**ระวัง (Gotchas)**
- R2 เป็น **private bucket** → รูปไม่เปิด public URL ตรงๆ ต้องผ่าน `/api/media` proxy
- `r2Client` lazy — เป็น `null` ถ้าไม่มี env (UI/route ต้องจัดการ)
- อัปโหลดได้เฉพาะ `canWrite` (admin/writer); key ต้องขึ้นต้น `uploads/`; ลบจำกัด `uploads/` เท่านั้น (ป้องกันลบผิดวัตถุ)

---

## 11) เส้นทางงาน: Cache (Upstash Redis)

**เปิด (Open)**
- `lib/cache/cache.ts` 🔵 — `cached(key, fetchFresh, ttl=300)`, `KEYS`, `invalidateEntry`
- `lib/cache/redis.ts` 🔵 — `hasRedis`, `redisGet/Set/Del/DelPattern`
- `lib/cache/index.ts` 🔷 — barrel export

**เชื่อม (Wires)**
- ผู้ใช้: `lib/content/public-source.ts` (`KEYS.entries`, `KEYS.entryBySlug`, `KEYS.schools`, `KEYS.searchIndex`)
- ผู้ล้าง: `app/studio/editor/actions.ts` → `invalidateEntry(slug)` หลัง publish (ดู §5)
- env: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

**ไหล (Flow)**
```
getPublicEntries → cached(KEYS.entries, () => getPublishedEntries())
  → hasRedis? 
     ใช่ → redisGet(key) → hit? คืนเลย
                miss → fetchFresh() → ถ้าไม่ null → redisSet fire-and-forget (TTL 300s)
     ไม่ใช่ → fetchFresh() ตรงๆ (ข้าม cache)
publish → invalidateEntry(slug) → redisDel(KEYS.entryBySlug(slug)) + redisDelPattern
```

**ระวัง (Gotchas)**
- TTL 300s ตรงกับ ISR `revalidate = 300`
- **Graceful fallback** — ไม่มี Redis env → ไม่ cache แต่ยังทำงานได้
- cache write เป็น fire-and-forget (ไม่บล็อก response)
- หลัง publish ต้อง `invalidateEntry` เสมอ ไม่งั้นสาธารณะเห็นของเก่า
- **ห้าม cache ข้อมูล authed/draft** — cache เฉพาะ published เท่านั้น


---

## 12) เส้นทางงาน: ระบบดีไซน์ — Cosmology · Dynamic Accent · Typography · Icons

**เปิด (Open)**
- `app/globals.css` 🟣 — Cosmology v2 tokens, `@property --accent` (Dynamic Accent), Dynamic Typography (fluid `clamp()`), `.md-body`, Citation/Glossary/footnote styles, motion tokens (`--ease-*`, `--dur-*`)
- `lib/content/cosmology.ts` 🔷 — `Cosmology` (prima/psyche/lumen/sapientia/mercurius/humanitas), `COSMOLOGY_ACCENT`, `routeCosmology`, `routeAccent`, `contentTypeMeta`, `statusMeta`, `difficultyMeta`, `sourceTypeMeta`, `frameworkMeta`, `nodeTypeAccent`
- `components/accent-controller.tsx` 🟢 — ตั้ง `--accent` + `data-cosmology` บน `<html>` (mount ใน layout)
- `components/icons.tsx` — ชุดไอคอน SVG ลายเส้น ARCHRON
- `components/discipline-meta.tsx` — ICON LANGUAGE (12 ศาสตร์)

**เชื่อม (Wires)**
- `app/layout.tsx` — โหลดฟอนต์ (Noto Serif Thai/IBM Plex Sans Thai + Material Symbols) + mount `AccentController`
- `app/page.tsx` — ATLAS ใช้สี cosmology
- globals.css อ่าน `--accent` ผ่าน `@property` → cascade ไปทุก component

**ไหล (Flow)**
```
pathname → accent-controller → routeCosmology(pathname)
  → ตั้ง documentElement.style.--accent = COSMOLOGY_ACCENT[cosmology]
  → ตั้ง data-cosmology attribute
  → CSS @property --accent cascade → components ใช้ var(--accent)
Typography → fluid clamp() (ขนาดปรับตาม viewport)
Icons     → Material Symbols (font) + SVG ใน icons.tsx
```

**ระวัง (Gotchas)**
- ใช้ tokens (`--color-*`, `--accent`) เสมอ — ห้าม hardcode สี
- brand palette/โทน **ต้องไม่เปลี่ยน** โดยไม่ขอ (guardrail #5)
- ฟอนต์ Thai-first: serif หัวข้อ, sans เนื้อหา
- motion: ใช้ `--ease-soft/--ease-out`, `--dur-fast/base/slow`; animate เฉพาะ `transform`/`opacity`; เคารพ `prefers-reduced-motion`
- `@property --accent` คือหัวใจของ Dynamic Accent — อย่าลบ

**Colour Mixing — Bridge Colors (สีผสมจาก Cosmology) · Design System handoff**

> เพิ่มโดย Design System Agent — เป็น *สเปก* ให้ Frontend Engineering นำไป implement ใน `app/globals.css`
> แนวคิด: สีผสมของสองศาสตร์ = สีของ **"เส้นเชื่อม/ความสัมพันธ์"** ระหว่าง node ในโครงข่ายความรู้ ทุกสีเกิดจาก 6 แกน Cosmology เท่านั้น (ไม่หลุด palette)

**Base (canonical — ตรงกับ `COSMOLOGY_ACCENT` ใน `lib/content/cosmology.ts`)**

| token | cosmology | hex |
|---|---|---|
| `--cos-prima` | prima | `#B9C2CE` |
| `--cos-psyche` | psyche | `#6E93A8` |
| `--cos-lumen` | lumen | `#E7D7A6` |
| `--cos-sapientia` | sapientia | `#CBA45A` |
| `--cos-mercurius` | mercurius | `#8AA395` |
| `--cos-humanitas` | humanitas | `#C9C2B4` |

**Bridge (สีผสม 50/50 — ใช้เฉพาะ edge/gradient/hover เท่านั้น ไม่ใช่สีพื้น/accent หลัก)**

| token | คู่ผสม | hex | contrast บน `#0E1420` |
|---|---|---|---|
| `--mix-reflection` | psyche × sapientia | `#9C9C81` | 6.6 · AA |
| `--mix-threshold` | prima × psyche | `#94AABB` | 7.7 · AA |
| `--mix-illumination` | lumen × sapientia | `#D9BE80` | 10.2 · AA |
| `--mix-dialogue` | psyche × mercurius | `#7C9B9E` | 6.2 · AA |
| `--mix-praxis` | sapientia × mercurius | `#AAA478` | 7.3 · AA |
| `--mix-manuscript` | prima × sapientia | `#C2B394` | 8.9 · AA |

```css
:root{
  /* Base Cosmology (canonical) */
  --cos-prima:#B9C2CE; --cos-psyche:#6E93A8; --cos-lumen:#E7D7A6;
  --cos-sapientia:#CBA45A; --cos-mercurius:#8AA395; --cos-humanitas:#C9C2B4;

  /* Bridge — edge/gradient/hover (สีผสม) */
  --mix-reflection:#9C9C81;   /* psyche × sapientia */
  --mix-threshold:#94AABB;    /* prima × psyche */
  --mix-illumination:#D9BE80; /* lumen × sapientia */
  --mix-dialogue:#7C9B9E;     /* psyche × mercurius */
  --mix-praxis:#AAA478;       /* sapientia × mercurius */
  --mix-manuscript:#C2B394;   /* prima × sapientia */
}
/* ทางเลือก: คำนวณจาก base เพื่อผูกที่มา (เนียนกว่าเวลาปรับสีฐาน) */
/* --mix-reflection: color-mix(in srgb, var(--cos-psyche) 50%, var(--cos-sapientia)); */

/* ตัวอย่าง edge ในกราฟความรู้ (ต้นทาง → ปลายทาง) */
.edge-psyche-sapientia{
  background:linear-gradient(90deg,var(--cos-psyche),var(--mix-reflection) 50%,var(--cos-sapientia));
}
```

**ระวัง (Gotchas)**
- Bridge ใช้เฉพาะ **edge/gradient/hover** — ห้ามใช้เป็นสีพื้นหรือ accent หลัก (กัน palette แตกทิศ)
- ยึด token เสมอ ห้าม hardcode สี · ห้ามประกาศ `@property --accent` ซ้ำ
- Bridge เป็นสีคงที่ของคู่ศาสตร์ (ไม่เปลี่ยนตาม `--accent`) — ต่างจาก Dynamic Accent
- การนำเข้า `app/globals.css` จริง = งาน Frontend Engineering (guardrail #5: ไม่เปลี่ยน brand palette เดิม เป็นการ *เพิ่ม* token)
- เอกสารอ้างอิงเต็ม: Hyperagent doc "Colour Cosmology — Handoff"

---

## 13) เส้นทางงาน: Themes — แก่นเรื่องข้ามศาสตร์ (B1)

**เปิด (Open)**
- `lib/content/themes.ts` 🔷 — `Theme`, `THEMES`, `THEME_TAG_SUGGESTIONS`, `themesForEntry`
- `app/themes/page.tsx` · `app/themes/[slug]/page.tsx` 🔵

**เชื่อม (Wires)**
- `components/reading/reading-page.tsx` → `themesForEntry(entry)` (แสดงแท็กแก่นเรื่องบนหน้าอ่าน)
- Studio editor ใช้ `THEME_TAG_SUGGESTIONS` แนะนำแท็กตอน tag entry

**ไหล (Flow)**
```
/themes        → รายการ THEMES
/themes/[slug] → รายละเอียด theme + entries ที่ tag แก่นเรื่องนั้น
หน้าอ่าน       → themesForEntry(entry) → แสดงแก่นเรื่องที่เกี่ยวข้อง
```

**ระวัง (Gotchas)**
- B1 = แก่นเรื่องข้ามศาสตร์ (cross-discipline)
- ห้ามแต่ง theme/ข้อมูลขึ้นเอง (guardrail #3)


---

## 14) เส้นทางงาน: Admin Studio — จัดการผู้ใช้ / โมเดเดอเรชันคอมเมนต์

**เปิด (Open)**
- `app/studio/users/page.tsx` 🟢 + `app/studio/users/actions.ts` 🔵 — จัดการผู้ใช้ (ตั้งบทบาทผ่าน `clerkClient`)
- `app/studio/comments/page.tsx` 🟢 + `app/studio/comments/actions.ts` 🔵 — โมเดอเรชัน (ซ่อน/แสดง/ลบ)
- `app/studio/profile/page.tsx` 🟢 + `app/studio/profile/actions.ts` 🔵 — โปรไฟล์ตนเอง + ขอเป็นนักเขียน (`requestWriter`)

**เชื่อม (Wires)**
- `lib/content/roles.ts` → `isAdmin`, `canWrite`, `roleFromMetadata`
- `lib/content/server-auth.ts` → `getUserRole()` (ตรวจ admin ก่อนทำ)
- `lib/supabase/server.ts` → `createServiceSupabase()` (ข้าม RLS — admin actions)
- `@clerk/nextjs/server` → `clerkClient().users.updateUserMetadata({ publicMetadata:{ role } })`
- `lib/content/profile-db.ts` → `getMyProfile`, `upsertMyProfile`, `requestWriter`

**ไหล (Flow)**
```
users admin   → getUserRole() ต้องเป็น admin → createServiceSupabase()
             → รายชั้นผู้ใช้ (Clerk) → ตั้ง role ผ่าน clerkClient.updateUserMetadata
comments mod  → admin → createServiceSupabase → ตั้ง status (visible/hidden) หรือลบ
profile       → getAuthedSupabase() → getMyProfile/upsertMyProfile; requestWriter ขอยกระดับ
```

**ระวัง (Gotchas)**
- admin-only — ตรวจ `isAdmin` **ก่อน** ทุก action
- ใช้ `createServiceSupabase` (ข้าม RLS) → **ต้อง** verify role ก่อนเสมอ
- role เก็บใน Clerk `publicMetadata.role`
- ห้าม expose service-role client ฝั่ง browser

---

## 15) เส้นทางงาน: ค้นหา (Search)

**เปิด (Open)**
- `app/search/page.tsx` + `loading.tsx` 🔵 — หน้าค้นหากลาง
- `components/search/search-client.tsx` 🟢 — UI filter + ผลลัพธ์จัดกลุ่ม

**เชื่อม (Wires)**
- `lib/content/search-index.ts` 🔷 → `buildSearchIndex`, `SEARCH_TYPE_LABEL`
- แหล่งข้อมูล: `public-source.ts` (articles), `concept-registry.ts` (concepts), `external-links.ts` (resources), รายการหน้า

**ไหล (Flow)**
```
page (server) → buildSearchIndex() (concepts/articles/resources/pages)
  → ส่งให้ SearchClient → filter + จัดกลุ่มผลลัพธ์ (label จาก SEARCH_TYPE_LABEL)
```

**ระวัง (Gotchas)**
- index สร้างจาก **ข้อมูลสาธารณะเท่านั้น**
- `SEARCH_TYPE_LABEL` สำหรับ label กลุ่มผลลัพธ์

---

## 16) เส้นทางงาน: Env / ตั้งค่า / Build & Lint checklist

**เปิด (Open)**
- `.env` (local) · env บน Vercel
- `supabase/schema.sql` 🟣 — ตาราง `entries`, `entry_revisions`, `profiles`, `comments`, `page_views` + RLS + RPC
- `eslint.config.mjs` 🟣 — ESLint flat config (`eslint-config-next/core-web-vitals`)
- `package.json` — scripts

**เชื่อม (Wires) — env ที่ต้องตั้ง**
| ตัวแปร | ใช้ทำอะไร |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` | อ่าน published, คอมเมนต์, นับวิว (anon, RLS) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` · `CLERK_SECRET_KEY` | Auth (Studio, บัญชีนักอ่าน, คอมเมนต์) |
| `SUPABASE_SERVICE_ROLE_KEY` | **server-only** — studio actions/admin (ข้าม RLS) · ห้าม prefix `NEXT_PUBLIC_` |
| `R2_ACCOUNT_ID` · `R2_ACCESS_KEY_ID` · `R2_SECRET_ACCESS_KEY` · `R2_BUCKET_NAME` | Cloudflare R2 (อัปโหลด/แสดงรูป) |
| `UPSTASH_REDIS_REST_URL` · `UPSTASH_REDIS_REST_TOKEN` | cache (ไม่มีก็ทำงานได้ — fallback) |

**ไหล (Flow)**
```
ตั้ง env → รัน supabase/schema.sql ใน Supabase SQL Editor (หลังเพิ่มตาราง)
       → npm run build && npm run lint ต้องเขียว → ค่อย commit
```

**ระวัง (Gotchas)**
- `SUPABASE_SERVICE_ROLE_KEY` server-only **ห้าม** prefix `NEXT_PUBLIC_` (guardrail #8)
- หลังเพิ่มตารางใหม่ ต้องรัน `schema.sql` ใน Supabase SQL Editor ก่อน ระบบคอมเมนต์/วิวจึงทำงาน
- `npm run build` + `npm run lint` ต้อง **เขียวก่อน commit** (guardrail #9)
- ห้ามใส่ secret/API key ลง repo (guardrail #8) — ใช้ env เท่านั้น
- ห้ามลบ/เขียนทับไฟล์ที่ไม่เกี่ยวกับงาน (guardrail #9)

---

## 17) สารบัญเส้นทางงาน (Quick Index)

| จะทำ… | ไปที่ |
|---|---|
| เพิ่ม/แก้หน้า static สาธารณะ | §2 |
| แสดงเนื้อหา published บนหน้า public | §3 |
| แก้หน้าอ่าน / ระบบ Reading (TOC/cite/glossary) | §4 |
| เขียน/บันทึก/เผยแพร่ใน Studio | §5 |
| Auth/Roles/ป้องกันเส้นทาง | §6 |
| เพิ่ม node/แก้ Constellation/wikilink | §7 |
| คอมเมนต์ | §8 |
| ตัวนับผู้เยี่ยม | §9 |
| อัปโหลด/ลบ/แสดงรูป (R2) | §10 |
| Cache (Redis) | §11 |
| ดีไซน์/สี/ฟอนต์/ไอคอน | §12 |
| แก่นเรื่องข้ามศาสตร์ (Themes) | §13 |
| Admin: ผู้ใช้/โมเดอเรชัน | §14 |
| ค้นหา | §15 |
| ตั้ง env / build / lint | §16 |

> อ่านก่อนเริ่มทุกครั้ง: `AGENTS.md` (กฎ/ขอบเขต) → ไฟล์นี้ (เส้นทางงาน) → `docs/code-index.md` (รายการไฟล์โดยละเอียด)

