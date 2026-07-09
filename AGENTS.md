# AGENTS.md — Archron · Project Library & AI Guardrails

> ไฟล์นี้คือ "สารบัญโครงการ" สำหรับ AI / นักพัฒนา — ใช้หาตำแหน่ง Route และ Code ได้เร็ว
> และเป็น **กฎควบคุมขอบเขตงาน** (ทำเฉพาะที่สั่ง ไม่ทำเกิน) อ่านไฟล์นี้ก่อนเริ่มทุกครั้ง

Archron — คลังความรู้ภาษาไทยเรื่องจิตใจมนุษย์ (Wiki/Knowledge-Graph แนว Obsidian)
สแตก: **Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase · Clerk · TypeScript**

---

## 1. สารบัญ Route (Route Map)

| Route | ไฟล์ | โหมด | หน้าที่ |
|---|---|---|---|
| `/` | `app/page.tsx` | static | หน้าแรก (hero, search, continue reading, featured guide, latest knowledge, footer) |
| `/articles` | `app/articles/page.tsx` | ISR 5m | รายการบทความ |
| `/articles/[slug]` | `app/articles/[slug]/page.tsx` | SSG + ISR | หน้าอ่านบทความ (ใช้ `ReadingPage`, section="articles") |
| `/books` | `app/books/page.tsx` | ISR 5m | รายการหนังสือและตำรา |
| `/books/[slug]` | `app/books/[slug]/page.tsx` | ISR 5m | หน้าหนังสือ |
| `/compare` | `app/compare/page.tsx` | ISR 5m | เปรียบเทียบ Object (Comparative Knowledge Matrix) |
| `/concepts` | `app/concepts/page.tsx` | ISR 5m | รายการ node จาก concept-registry |
| `/concepts/[slug]` | `app/concepts/[slug]/page.tsx` | SSG + ISR | หน้าอ่านแนวคิด |
| `/constellation` | `app/constellation/page.tsx` | dynamic | Radial focus-map + no-JS fallback |
| `/disciplines` | `app/disciplines/page.tsx` | static | 12 แขนงวิชาที่เราศึกษา |
| `/disciplines/[slug]` | `app/disciplines/[slug]/page.tsx` | SSG | หน้าแขนงวิชา |
| `/discover` | `app/discover/page.tsx` | ISR 5m | ค้นพบเนื้อหาตามหมวดหมู่ |
| `/explore` | `app/explore/page.tsx` | ISR 5m | สำรวจคลังความรู้ |
| `/external-links` | `app/external-links/page.tsx` | static | คลังทรัพยากร/ลิงก์ภายนอก (6 หมวด) |
| `/faq` | `app/faq/page.tsx` | static | คำถามที่พบบ่อย (Accordion) |
| `/guide` | `app/guide/page.mdx` | static | บริการ Jungian Type Analysis |
| `/icons` | `app/icons/page.tsx` | static | แสดงตัวอย่างไอคอนทั้งหมด 47 รายการ (dev tool) |
| `/knowledge` | `app/knowledge/page.tsx` | ISR 5m | ภาพรวมคลังความรู้ — cosmology dashboard |
| `/manifesto` | `app/manifesto/page.tsx` | ISR 5m | จุดยืนโครงการ |
| `/profile` | `app/profile/page.tsx` | dynamic | โปรไฟล์ผู้ใช้ + Academic Seals |
| `/reading-sets` | `app/reading-sets/page.tsx` | ISR 5m | เส้นทางการอ่าน/ซีรีส์ |
| `/reading-sets/[slug]` | `app/reading-sets/[slug]/page.tsx` | ISR 5m | หน้าซีรีส์ |
| `/schools` | `app/schools/page.tsx` | ISR 5m | สำนักคิดและนักปราชญ์ |
| `/schools/[slug]` | `app/schools/[slug]/page.tsx` | ISR 5m | หน้าสำนักคิด |
| `/search` | `app/search/page.tsx` | ISR 5m | ค้นหากลาง |
| `/sources` | `app/sources/page.tsx` | static | แหล่งอ้างอิงภายใน |
| `/support` | `app/support/page.mdx` | static | สนับสนุนโครงการ |
| `/themes` | `app/themes/page.tsx` | ISR 5m | แก่นเรื่องข้ามศาสตร์ |
| `/themes/[slug]` | `app/themes/[slug]/page.tsx` | ISR 5m | หน้าแก่นเรื่อง |
| `/thinkers` | `app/thinkers/page.tsx` | ISR 5m | ดัชนีนักปราชญ์ |
| `/thinkers/[slug]` | `app/thinkers/[slug]/page.tsx` | ISR 5m | หน้านักปราชญ์ |
| `/timeline` | `app/timeline/page.tsx` | static | เส้นเวลาประวัติศาสตร์ปัญญา |
| `/studio/editor` | `app/studio/editor/page.tsx` | dynamic (Clerk) | ตัวเขียน/แก้เนื้อหา |

Chrome / โครงร่วม: `app/layout.tsx` (ฟอนต์ + SiteHeader/Footer + SkipToContent + Tabbar + Fab + QuickOpen + ConceptPopup) ·
`app/template.tsx` (route-fade + ScrollReveal กลาง) · `app/studio/layout.tsx` (ClerkProvider, force-dynamic) ·
`proxy.ts` (Clerk ป้องกัน `/studio(.*)`)

---

## 2. ตำแหน่ง Code (Code Map)

### `components/`
| ไฟล์ | หน้าที่ | client? |
|---|---|---|
| `site-header.tsx` | glass-nav sticky · เมนู dropdown แบบกลุ่ม (hover/focus) + ค้นหา + CTA + เมนูมือถือ + scroll-aware | ✅ |
| `site-footer.tsx` | footer 3 คอลัมน์ + จดหมายข่าว | — |
| `page-header.tsx`, `page-nav.tsx` | header/nav ของหน้า list (articles/concepts/reading-sets/sources) | — |
| `icons.tsx` | ชุดไอคอน SVG (ArchronMark, Search, Menu, Concept, Person, Book, School, Symbol, Term, Source, Path) | — |
| `icon-box.tsx` | กรอบแสดงไอคอน + label (ใช้ใน /icons) | — |
| `scroll-reveal.tsx` | IntersectionObserver เปิด `.scroll-reveal`→`.visible` (เรียกครั้งเดียวจาก template) | ✅ |
| `scroll-to-top.tsx` | ปุ่มเลื่อนขึ้นบนสุด (โผล่เมื่อ scroll ลง) เรนเดอร์ใน layout มีทุกหน้า | ✅ |
| `tooltip.tsx` | Tooltip คำอธิบายสั้น (CSS hover/focus, ใช้ใน server component ได้) | — |
| `accordion.tsx` | Accordion/Collapse reusable (คลิกพับ-กาง, grid-rows) — ใช้ในหน้า FAQ | ✅ |
| `schools/schools-hub.tsx` | หน้า /schools — search + A-Z index + accordion + modal นักคิด | ✅ |
| `reading/reading-page.tsx` | **หน้าอ่าน Unified** (ใช้ทั้ง article/concept) — breadcrumb, meta-grid, markdown, related, refs, CTA | — |
| `reading/internal-link-text.tsx` | render ข้อความที่มี `[[wikilink]]` | — |
| `seals/seal-profile-section.tsx` | ส่วนแสดง Seals ในหน้าโปรไฟล์ | ✅ |
| `seals/seal-gallery.tsx` | แกลเลอรี Seals ทั้งหมด (13 ตรา) | ✅ |
| `seals/seal-icon.tsx` | ตราเดี่ยว SVG (5 shapes) | — |
| `seals/seal-detail-modal.tsx` | Modal รายละเอียด Seal | ✅ |
| `seals/seal-notification.tsx` | แจ้งเตือนเมื่อปลดล็อก Seal ใหม่ | ✅ |
| `studio/searchable-select.tsx`, `searchable-multi-select.tsx` | dropdown ค้นหาได้ | ✅ |
| `studio/related-concept-picker.tsx` | เลือก related concept + relationType | ✅ |
| `studio/internal-link-suggestion-panel.tsx` | แนะนำ `[[ ]]` จาก registry | ✅ |
| `studio/revision-panel.tsx` | ประวัติเวอร์ชัน + กู้คืน | ✅ |
| `studio/my-content-search.tsx` | Studio search — ค้น `listMyEntries` ของผู้เขียน เปิดผ่าน `?slug=` | ✅ |
| `constellation/constellation-mindmap.tsx` | Radial focus-map (SVG เส้นโยง + HTML node chips · re-center · search) | ✅ |
| `search/search-client.tsx` | UI ค้นหากลาง (filter + ผลลัพธ์จัดกลุ่ม) | ✅ |
| `external-links/external-links-browser.tsx` | filter tabs + การ์ดทรัพยากร | ✅ |

### `lib/content/` (ข้อมูล + ลอจิกเนื้อหา)
| ไฟล์ | หน้าที่ |
|---|---|
| `entries.ts` | seed entries (static) + `getEntryBySlug`, `allEntrySlugs` |
| `concept-registry.ts` | registry ของ node (15) + `resolveConcept`, `conceptTitle`, `getConceptBySlug`, type `NodeType` |
| `public-source.ts` | `getPublicEntries`/`getPublicEntryBySlug` — อ่าน DB published → fallback seed (มี env guard) |
| `entries-db.ts` | public reads + authed: `listMyEntries`, `getMyEntryBySlug`, `upsertEntryRow`, `deleteEntry`, `addRevision`, `getRevisions`, `getPublishedEntries/BySlug/Slugs` |
| `draft-db.ts` | `saveDraft`, `loadDraftBySlug`, `listMyDrafts`, `publishEntry` |
| `draft-mapper.ts` | `EditorDraft` ↔ DB row (`draftToRow`/`entryToDraft`) |
| `entry-mapper.ts` | `EntryRow` ↔ `ContentEntry` (`rowToEntry`) |
| `publish-validation.ts` | `EditorDraft`, `EMPTY_DRAFT`, `getPublishChecklist`, `canPublish`, `slugify` |
| `internal-links.ts` | `parseInternalLinks`, `findDeadLinks`, `findLinkSuggestions` |
| `related.ts` | `getBacklinksForConcept` |
| `graph.ts` | `buildGraph` + `NODE_TYPE_LABEL/COLOR`, `RELATION_LABEL` (ใช้กับ /constellation) |
| `external-links.ts` | `EXTERNAL_CATEGORIES` (ข้อมูลทรัพยากรภายนอก) |
| `search-index.ts` | `buildSearchIndex` + `SEARCH_TYPE_LABEL` (ใช้กับ /search) |
| `seals.ts` | Academic Seals data (15 ตรา, 4 ระดับ, 11 function helpers) |

### อื่น ๆ
| ตำแหน่ง | หน้าที่ |
|---|---|
| `lib/supabase/client.ts` | Supabase client แนบ Clerk token (ฝั่ง studio, RLS) |
| `lib/supabase/server.ts` | Supabase server client (anon, อ่าน published) |
| `types/content.ts` | `ContentEntry` + enum (`ArticleStatus`, `ContentType`, `RelationType`, ...) |
| `supabase/schema.sql` | ตาราง `entries` + `entry_revisions` + RLS policies |
| `app/globals.css` | Tailwind v4 `@theme` (design tokens) + component CSS + motion (`--ease/--dur`, scroll-reveal, glass-nav, ambient-glow) |
| `proxy.ts` | Clerk protect `/studio(.*)` (ผ่านถ้าไม่มีคีย์) |
| `mdx.d.ts` | TypeScript declaration for `.mdx` module imports |
| `eslint.config.mjs` | ESLint flat config (`eslint-config-next/core-web-vitals`) |
| `docs/` | orchestrator.md · supabase-clerk-setup.md · verify-build-checklist.md |
| `docs/superpowers/` | specs/ · plans/ — design system gap completion completed |

---

## 3. Conventions (ทำตามนี้เสมอ)

- **Thai-first:** UI ทุกส่วนเป็นภาษาไทย · `lang="th"` · ไม่มี i18n / locale switcher / EN routes · คงภาษาอังกฤษเฉพาะชื่อเฉพาะ (Archron, Manifesto) และศัพท์วิชาการ (Ego, Psychological Types ฯลฯ)
- **Design tokens (`app/globals.css`):** พื้น `--color-bg #FAF8F5` / `--color-bg-card #FFFFFF` / `--color-bg-elevated #F5F3F0` · เส้น `--color-border #E5E2DC` · ตัวอักษร `--color-text-heading #1A1815` / `--color-text-body #3A3835` / `--color-text-secondary #8A8780` · accent `--color-accent #5F8DCE` (ฟ้า — primary, Academic) · `--color-premium #B89A63` (ทอง — featured/premium elements เท่านั้น)
- **ฟอนต์:** หัวข้อ `--font-display` = Playfair Display (อังกฤษ/proper nouns) · `--font-heading` = IBM Plex Serif + Noto Serif Thai (หัวข้อไทย) · `--font-body` = Lora + Noto Serif Thai (เนื้อหา — serif) · `--font-ui` = Inter + Noto Sans Thai (UI — sans) · `--font-wordmark` = Cinzel (ARCHRON wordmark)
- **ไอคอน:** Custom SVG icons (47 ตัว) ใน `components/icons.tsx` — 2px stroke, 24×24 viewBox, currentColor · จัดเรียงตามหมวดหมู่ (navigation, discipline, UI, call-to-action)
- **Motion:** ใช้ tokens `--ease-soft/--ease-out`, `--dur-fast/base/slow` · animate เฉพาะ `transform`/`opacity` · เคารพ `prefers-reduced-motion`
- **Data flow:** หน้า public → `getPublicEntries()` (DB published → fallback seed) + `export const revalidate = 300` · studio → Supabase + Clerk token (RLS)
- **External links:** ใช้ `target="_blank" rel="noopener noreferrer"` เสมอ
- **Build/Lint:** `npm run build` และ `npm run lint` ต้อง **เขียวก่อน commit** · ไม่ใช้ `any` พร่ำเพรื่อ · ไม่เรียก ref `.current` ตอน render
- **Commit:** push ลง `main` · commit เฉพาะไฟล์ที่เกี่ยวกับงานนั้น · ข้อความ commit อธิบายสาระ

---

## 4. Guardrails — ขอบเขตงาน (บังคับ: ทำเฉพาะที่สั่ง ห้ามทำเกิน)

1. **ทำเฉพาะสิ่งที่ผู้ใช้สั่ง** — ห้ามเพิ่มหน้า/ฟีเจอร์/ลิงก์/เนื้อหา ที่ไม่ได้ถูกขอ แม้จะ "ดูเข้าท่า"
2. **ห้ามแตะ global chrome** (`site-header.tsx`, `site-footer.tsx`, `app/layout.tsx`, `app/template.tsx`) โดยไม่ได้รับคำสั่งชัดเจน
3. **ห้ามแต่งข้อมูลขึ้นเอง** — เนื้อหาวิชาการ, ราคา, ช่องทางติดต่อ, URL, แหล่งอ้างอิง, เลขบัญชี ถ้าไม่มีข้อมูลจริง **ให้ถาม** อย่าเดา
4. **คง Thai-first** — ห้ามเพิ่ม English page/route/switcher หรือข้อความอังกฤษเกินจำเป็น
5. **คง identity** — โครงการนี้ "ไม่ใช่" สายมู / self-help / คลินิก / การตลาด · ห้ามเปลี่ยน brand palette/โทนโดยไม่ขอ
6. **งานหลายขั้น (3+ ไฟล์/ขั้น)** — ยืนยันแผนกับผู้ใช้ก่อนลงมือ · ไม่ลด scope และไม่ขยาย scope เอง
7. **ห้ามแก้ schema/RLS/migration** โดยไม่ได้รับคำสั่ง · draft ส่วนตัวของผู้เขียน **ต้องไม่หลุด** สู่ public
8. **ห้ามใส่ secret/API key** ลงในโค้ดหรือ repo · ใช้ env เท่านั้น
9. **ห้าม commit ถ้า build/lint ไม่เขียว** · ห้ามลบ/เขียนทับไฟล์ที่ไม่เกี่ยวกับงาน
10. เมื่อไม่แน่ใจ — **ถามก่อนทำ** ดีกว่าทำผิดทิศ

---

## 5. คำสั่งที่ใช้บ่อย
```bash
npm install        # ติดตั้ง dependency
npm run dev        # dev server (localhost:3000)
npm run build      # production build (ต้องเขียวก่อน commit)
npm run lint       # ESLint flat config (ต้องเขียวก่อน commit)
```
env ที่ต้องมี: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

**Keep this block, including in commits.** It is part of the project's agent setup, maintained by `next dev` for every agent that works here. If it appears as an uncommitted change, that is intentional — commit it as-is. Do not remove it to clean up a diff; it will be regenerated.
<!-- END:nextjs-agent-rules -->
