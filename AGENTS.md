# AGENTS.md — The Soul's Compass · Project Library & AI Guardrails

> ไฟล์นี้คือ "สารบัญโครงการ" สำหรับ AI / นักพัฒนา — ใช้หาตำแหน่ง Route และ Code ได้เร็ว
> และเป็น **กฎควบคุมขอบเขตงาน** (ทำเฉพาะที่สั่ง ไม่ทำเกิน) อ่านไฟล์นี้ก่อนเริ่มทุกครั้ง

The Soul's Compass — คลังความรู้ภาษาไทยเรื่องจิตใจมนุษย์ (Wiki/Knowledge-Graph แนว Obsidian)
สแตก: **Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase · Clerk · TypeScript**

---

## 1. สารบัญ Route (Route Map)

| Route | ไฟล์ | โหมด | หน้าที่ |
|---|---|---|---|
| `/` | `app/page.tsx` | static | หน้าแรก (hero, pillars, knowledge atlas, manifesto, quick links) |
| `/articles` | `app/articles/page.tsx` | ISR 5m | รายการบทความ (อ่าน DB published → fallback seed) |
| `/articles/[slug]` | `app/articles/[slug]/page.tsx` | SSG + ISR | หน้าอ่านบทความ (ใช้ `ReadingPage`, section="articles") |
| `/concepts` | `app/concepts/page.tsx` | static | รายการ node จาก concept-registry |
| `/concepts/[slug]` | `app/concepts/[slug]/page.tsx` | SSG + ISR | หน้าอ่านแนวคิด (entry → `ReadingPage` + Backlinks; ไม่มี entry → stub จาก registry) |
| `/constellation` | `app/constellation/page.tsx` | dynamic | Radial focus-map (โฟกัส+เพื่อนบ้าน คลิกย้ายศูนย์กลาง · รับ `?focus=`) + no-JS fallback |
| `/external-links` | `app/external-links/page.tsx` | static | คลังทรัพยากร/ลิงก์ภายนอก (6 หมวด) |
| `/schools` | `app/schools/page.tsx` | static | สำนักคิดและนักปราชญ์ (search + A-Z + accordion + modal) |
| `/faq` | `app/faq/page.tsx` | static | คำถามที่พบบ่อย (Accordion) |
| `/guide` | `app/guide/page.tsx` | static | บริการ Jungian Type Analysis (CTA จากหน้าอ่าน) |
| `/manifesto` | `app/manifesto/page.tsx` | static | จุดยืนโครงการ |
| `/reading-sets` | `app/reading-sets/page.tsx` | static | เส้นทางการอ่าน/ซีรีส์ (ยัง placeholder — ไม่มีข้อมูลซีรีส์จริง) |
| `/search` | `app/search/page.tsx` | static + ISR | ค้นหากลาง (แนวคิด/บทความ/ทรัพยากร/หน้า) |
| `/sources` | `app/sources/page.tsx` | static | แหล่งอ้างอิงภายใน |
| `/support` | `app/support/page.tsx` | static | สนับสนุนโครงการ |
| `/studio/editor` | `app/studio/editor/page.tsx` | dynamic (Clerk) | ตัวเขียน/แก้เนื้อหา (autosave, version, publish, markdown, my-content-search) |

Chrome / โครงร่วม: `app/layout.tsx` (ฟอนต์ + SiteHeader/Footer + Material Symbols) ·
`app/template.tsx` (route-fade + ScrollReveal กลาง) · `app/studio/layout.tsx` (ClerkProvider, force-dynamic) ·
`middleware.ts` (Clerk ป้องกัน `/studio(.*)`)

---

## 2. ตำแหน่ง Code (Code Map)

### `components/`
| ไฟล์ | หน้าที่ | client? |
|---|---|---|
| `site-header.tsx` | glass-nav sticky · เมนู dropdown แบบกลุ่ม (hover/focus) + ค้นหา + CTA + เมนูมือถือ + scroll-aware | ✅ |
| `site-footer.tsx` | footer 3 คอลัมน์ + จดหมายข่าว | — |
| `page-header.tsx`, `page-nav.tsx` | header/nav ของหน้า list (articles/concepts/reading-sets/sources) | — |
| `icons.tsx` | ชุดไอคอน SVG (Compass, Search, Menu, Concept, Person, Book, School, Symbol, Term, Source, Path) | — |
| `scroll-reveal.tsx` | IntersectionObserver เปิด `.scroll-reveal`→`.visible` (เรียกครั้งเดียวจาก template) | ✅ |
| `scroll-to-top.tsx` | ปุ่มเลื่อนขึ้นบนสุด (โผล่เมื่อ scroll ลง) เรนเดอร์ใน layout มีทุกหน้า | ✅ |
| `tooltip.tsx` | Tooltip คำอธิบายสั้น (CSS hover/focus, ใช้ใน server component ได้) | — |
| `accordion.tsx` | Accordion/Collapse reusable (คลิกพับ-กาง, grid-rows) — ใช้ในหน้า FAQ | ✅ |
| `schools/schools-hub.tsx` | หน้า /schools — search + A-Z index + accordion + modal นักคิด | ✅ |
| `reading/reading-page.tsx` | **หน้าอ่าน Unified** (ใช้ทั้ง article/concept) — breadcrumb, meta-grid, markdown, related, refs, CTA | — |
| `reading/internal-link-text.tsx` | render ข้อความที่มี `[[wikilink]]` | — |
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

### อื่น ๆ
| ตำแหน่ง | หน้าที่ |
|---|---|
| `lib/supabase/client.ts` | Supabase client แนบ Clerk token (ฝั่ง studio, RLS) |
| `lib/supabase/server.ts` | Supabase server client (anon, อ่าน published) |
| `types/content.ts` | `ContentEntry` + enum (`ArticleStatus`, `ContentType`, `RelationType`, ...) |
| `supabase/schema.sql` | ตาราง `entries` + `entry_revisions` + RLS policies |
| `app/globals.css` | Tailwind v4 `@theme` (design tokens) + component CSS + motion (`--ease/--dur`, scroll-reveal, glass-nav, ambient-glow) |
| `middleware.ts` | Clerk protect `/studio(.*)` (ผ่านถ้าไม่มีคีย์) |
| `eslint.config.mjs` | ESLint flat config (`eslint-config-next/core-web-vitals`) |
| `docs/` | orchestrator.md · supabase-clerk-setup.md · verify-build-checklist.md |

---

## 3. Conventions (ทำตามนี้เสมอ)

- **Thai-first:** UI ทุกส่วนเป็นภาษาไทย · `lang="th"` · ไม่มี i18n / locale switcher / EN routes · คงภาษาอังกฤษเฉพาะชื่อเฉพาะ (The Soul's Compass, Manifesto) และศัพท์วิชาการ (Ego, Psychological Types ฯลฯ)
- **Design tokens (`app/globals.css`):** พื้น `--color-deep-navy #080B16` / `--color-midnight #0B1020` / `surface-container*` · ทอง `--color-antique-gold #C8A85A` (เนื้อหา) · `--color-burnished-gold #D4AF37` (chrome/หน้าใหม่) · ตัวอักษร `--color-ivory` / `--color-on-surface` · เส้น `--color-slate-boundary`
- **ฟอนต์:** หัวข้อ `--font-serif` (Noto Serif Thai) · เนื้อหา `--font-sans` (IBM Plex Sans Thai) · ไอคอน Material Symbols (โหลดใน layout)
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
