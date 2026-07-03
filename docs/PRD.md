# ARCHRON Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Living Document  
**Platform:** Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Supabase · Clerk  
**Language Strategy:** Thai-First (UI และเนื้อหาหลักภาษาไทย ทับศัพท์เฉพาะชื่อเฉพาะและศัพท์วิชาการสากล)

---

## SECTION 01: Executive Summary (บทคัดย่อผู้บริหาร)

- **Vision (วิสัยทัศน์):** สร้างคลังความรู้ทางจิตวิทยา มนุษยศาสตร์ และปรัชญาที่เป็นระบบเหนือกาลเวลา (Timeless Human Knowledge Library) ถ่ายทอดความลึกซึ้งของจิตใจมนุษย์ผ่านสถาปัตยกรรมข้อมูลที่งดงามและเชื่อมโยงกันอย่างมีชีวิต
- **Mission (พันธกิจ):** รวบรวม เรียบเรียง และสังเคราะห์แนวคิดนักคิดระดับโลก (เช่น C.G. Jung, Freud, Nietzsche ฯลฯ) ตลอดจนสายธารสำนักคิด ให้อยู่ในรูปแบบโครงข่ายความรู้ (Knowledge Graph / Constellation) ที่อ่านง่าย ค้นพบได้ลึก และน่าเชื่อถือทางวิชาการ
- **Problem (ปัญหา):** ความรู้วิชาการด้านจิตวิทยาและปรัชญามักกระจัดกระจาย เข้าใจยาก หรือถูกนำเสนออย่างตื้นเขิน/บิดเบือนในโลกออนไลน์ (เช่น การมองเป็น self-help ฉาบฉวย หรือสายมู) ขาดระบบการอ้างอิงและเชื่อมโยงที่ชัดเจน
- **Opportunity (โอกาส):** สร้างแพลตฟอร์มสารานุกรมความรู้วิชาการชั้นสูงที่เป็นภาษาไทย (Thai-first academic wiki & knowledge graph) ที่มีดีไซน์ระดับพรีเมียม สภาพแวดล้อมน่าอ่าน และเอื้อต่อการค้นคว้าเชิงลึก
- **Core Values (ค่านิยมหลัก):**
  1. *Scholarship & Integrity:* ความถูกต้องทางวิชาการและการอ้างอิงปฐมภูมิ
  2. *Connectivity:* ความเชื่อมโยงของสรรพสิ่งผ่านระบบโครงข่ายความรู้
  3. *Aesthetic & Tranquility:* ความงามรับใช้ความเข้าใจ สงบนิ่งลุ่มลึกดุจหอดูดาวยามค่ำคืน

---

## SECTION 02: Brand Identity (อัตลักษณ์แบรนด์)

- **Brand Story:** ARCHRON เปรียบเสมือนเข็มทิศนำทางจิตวิญญาณ (The Soul's Compass) และหอดูดาวทางปัญญาที่พาผู้คนสำรวจกลุ่มดาวแห่งแนวคิดมนุษย์
- **Brand DNA:** ลุ่มลึก (Profound), วิชาการ (Academic), น่าเกรงขาม (Majestic), สงบนิ่ง (Tranquil), เหนือกาลเวลา (Timeless)
- **Color Cosmology:** ใช้โทนสีตามศาสตร์จักรวาลวิทยาความรู้ ได้แก่ `--color-deep-navy` (#080B16), `--color-midnight` (#0B1020), สีทองโบราณ `--color-antique-gold` (#C8A85A) และสีตามกลุ่มความรู้ (Prima, Sapientia, Mercurius, Psyche)
- **Typography:** หัวเรื่องใช้ Noto Serif Thai เพื่อความสง่างามวิชาการ เนื้อหาใช้ IBM Plex Sans Thai เพื่อความอ่านง่ายสบายตาในบทความขนาดยาว
- **Iconography:** ไอคอนสไตล์ Material Symbols และภาพประกอบแบบ 3D Grid/Engraving ที่มีมิติและผิวด้านประณีต
- **Visual Language:** Glassmorphism อ่อนๆ บนพื้นหลังเข้ม เส้นขอบบางเฉียบ (Slate Boundary) และแสงเรืองรอง (Ambient Glow) ที่ไม่แยงตา
- **Tone of Voice:** เป็นทางการ อบอุ่น สุขุม ชวนขบคิด ไม่ใช้ภาษาการตลาดฉาบฉวยหรือคำสแลง

---

## SECTION 03: Product Vision (วิสัยทัศน์ผลิตภัณฑ์)

- **Purpose:** เป็นคลังความรู้และเครื่องมือคิดค้น/เขียนงานทางจิตวิเคราะห์และมนุษยศาสตร์อันดับหนึ่งของภาษาไทย
- **Long-term Vision:** ขยายครอบคลุมปรัชญา ประวัติศาสตร์ และศิลปศาสตร์ทั่วโลก พร้อมระบบ AI Assistant ที่ช่วยเชื่อมโยงมโนทัศน์วิชาการ
- **Success Criteria:** ความถูกต้องของเนื้อหา ความลื่นไหลในการใช้งาน (Core Web Vitals > 95) และอัตราการมีส่วนร่วมในการอ่านเนื้อหายาว
- **North Star Metric:** จำนวนความสัมพันธ์ของแนวคิดที่ถูกค้นพบและเชื่อมโยง (Active Knowledge Links Explored & Reading Depth)
- **Core Principles:** Knowledge before decoration, Meaning before aesthetics, Structure before complexity

---

## SECTION 04: Target Users (กลุ่มผู้ใช้งานเป้าหมาย)

- **Reader (นักอ่านทั่วไปผู้ใฝ่รู้):** ต้องการเนื้อหาที่ลุ่มลึก อ่านง่าย สบายตา
- **Researcher (นักวิจัย/นักวิชาการ):** ต้องการการอ้างอิงที่แม่นยำ แหล่งข้อมูลปฐมภูมิ และการสืบค้นข้ามศาสตร์
- **Student (นักศึกษา):** ต้องการทำความเข้าใจแนวคิดยากๆ ผ่านแผนภาพ กราฟความรู้ และเส้นเวลา
- **Writer / Scholar (นักเขียน/ผู้เชี่ยวชาญ):** ต้องการ Studio Editor ที่เขียนสะดวก รองรับ Markdown, Wikilinks และระบบเวอร์ชัน
- **Psychologist / Philosopher (นักจิตวิทยา/นักปรัชญา):** ต้องการความถูกต้องตามหลักทฤษฎี ไม่บิดเบือน

---

## SECTION 05: Personas (บุคลิกผู้ใช้งาน)

- **Primary Persona (อาจารย์/นักวิจัย/นักเขียนผู้เชี่ยวชาญ):** ต้องการเครื่องมือจัดการเนื้อหาที่มีประสิทธิภาพ เชื่อมโยงแนวคิดซับซ้อน และเผยแพร่งานวิชาการที่น่าเชื่อถือ
- **Secondary Persona (นักศึกษาและนักอ่านผู้รักความรู้ลึกซึ้ง):** ชอบท่องไปใน Constellation Map เพื่อค้นหาความเชื่อมโยงระหว่างสำนักคิดและนักปราชญ์
- **User Journey:** เข้าสู่หน้าแรก → สำรวจผ่าน Constellation หรือค้นหาแนวคิด → อ่านบทความยาวในบรรยากาศสบายตา → คลิก Wikilink ไปยังแนวคิดที่เกี่ยวข้อง → บันทึกลงคลังส่วนตัว
- **Pain Points เดิม:** เว็บวิชาการไทยมักรก อ่านยาก หรือเว็บจิตวิทยาทั่วไปมักตื้นเขินและขาดการเชื่อมโยง
- **Goals:** เสพและสร้างความรู้ระดับลึกในสภาพแวดล้อมที่ส่งเสริมสมาธิสูงสุด

---

## SECTION 06: Product Scope (ขอบเขตผลิตภัณฑ์)

- **MVP (Completed):** โครงสร้างระบบ Next.js 16 App Router, หน้าสาธารณะ (Home, Articles, Concepts, Constellation, Schools, Themes), ระบบ Studio Editor เบื้องต้น, การเชื่อมต่อ Supabase & Clerk
- **V1 (Current Focus):** การยกระดับประสิทธิภาพมือถือ (Mobile Snappy Mode), การอัปเกรด Studio Editor ให้รองรับ Mentions/Citations เต็มรูปแบบ, ระบบ Revision & Moderation
- **V2 (Near Future):** ระบบ AI Knowledge Assistant, Reading Sets ที่สมบูรณ์, กราฟความรู้แบบ 3D/Interactive รายละเอียดสูง
- **Future Expansion:** การขยายสู่แอปพลิเคชันมือถือ, ระบบความร่วมมือแบบเรียลไทม์ (Real-time Collaborative Editing)

---

## SECTION 07: Feature List (รายการฟีเจอร์)

- **Homepage:** Hero Section, Core Pillars, Knowledge Atlas, Manifesto Preview, Quick Navigation
- **Library / Knowledge Hub:** สารบัญคลังความรู้ จัดหมวดหมู่ตามศาสตร์และระดับความลึก
- **Article System:** หน้าอ่านบทความยาว รองรับ TOC, Citations, Glossary, Related Articles
- **Concept System:** หน้าแนวคิดปฐมภูมิ แสดงนิยาม รากศัพท์ ประวัติศาสตร์ และ Backlinks
- **Thinker System:** หน้าประวัตินักคิดเชิงวิชาการ (Biography, Timeline, Influences, Major Works)
- **School System:** หน้าสำนักคิดและสายธารปัญญา (A-Z Index, Representative Thinkers, Core Debates)
- **Book / Reference System:** คลังอ้างอิงผลงานชิ้นเอกและบรรณานุกรม
- **Timeline:** เส้นเวลาประวัติศาสตร์การพัฒนาแนวคิด
- **Collections:** คลังอ่านส่วนตัว การบันทึกและจัดกลุ่มเนื้อหาของนักอ่าน
- **Search:** ระบบค้นหากลาง (Global Search) กรองตามประเภทเนื้อหาและคำสำคัญ
- **Studio Editor:** สภาพแวดล้อมการเขียน Markdown ไร้สิ่งรบกวน รองรับ `[[wikilink]]`, Autosave, Revision History
- **Profile & Settings:** จัดการข้อมูลส่วนบุคคล เกียรติประวัติ และสถิติการอ่าน
- **Authentication & Roles:** ระบบยืนยันตัวตน (Clerk) แบ่งสิทธิ์ Admin, Writer, Reader

---

## SECTION 08: Knowledge Architecture (สถาปัตยกรรมความรู้)

- **Knowledge Objects:** องค์ความรู้ถูกจัดแบ่งเป็น `Concept`, `Thinker`, `School`, `Theory`, `Article`, `Book`, `Reference`, `Timeline`
- **Relationships:** ความสัมพันธ์ระบุประเภทชัดเจน (เช่น *Inspired By*, *Influenced By*, *Criticized By*, *Developed From*, *Opposes*)
- **Ontology & Taxonomy:** จัดลำดับชั้นความรู้แบบห่วงโซ่ปัญญา: `Thinker ↓ School ↓ Concept ↓ Theory ↓ Article ↓ Reference ↓ Book`

---

## SECTION 09: Database Requirements (ข้อกำหนดฐานข้อมูล)

- **Entity List:** ตาราง `entries` (บทความ/แนวคิด), `entry_revisions` (ประวัติการแก้ไข), `profiles` (ผู้ใช้/นักเขียน), `comments` (ความคิดเห็น), `page_views` (สถิติการเข้าชม)
- **Security & RLS:** ใช้ Supabase Row Level Security (RLS) ปกป้องฉบับร่างส่วนตัว (Drafts) ให้เห็นเฉพาะเจ้าของและ Admin ส่วนข้อมูล Published เปิดอ่านสาธารณะ
- **Storage:** Cloudflare R2 สำหรับจัดเก็บรูปภาพและไฟล์สื่อ (Prefix `uploads/`)

---

## SECTION 10: Editor Requirements (ข้อกำหนดตัวเขียนเนื้อหา)

- **Markdown First:** รองรับการจัดรูปแบบ Markdown มาตรฐาน พร้อม Live Preview
- **Knowledge Linking:** รองรับระบบไวยากรณ์ `[[Slug]]` พร้อมหน้าต่างแนะนำแนวคิดอัตโนมัติ (Internal Link Suggestion)
- **Revision History:** บันทึกเวอร์ชันการแก้ไข สามารถย้อนกลับหรือเทียบความต่าง (Diff) ได้
- **Media & References:** อัปโหลดรูปภาพขึ้น R2 แนบคำบรรยาย และจัดการเชิงอรรถ/การอ้างอิง

---

## SECTION 11: Search Requirements (ข้อกำหนดการค้นหา)

- **Global Search:** ค้นหาครอบคลุมทุกเอนทิตี (บทความ, แนวคิด, สำนักคิด, ทรัพยากร)
- **Instant Search:** แสดงผลลัพธ์ทันทีขณะพิมพ์ พร้อมจัดกลุ่มตาม `SEARCH_TYPE_LABEL`
- **Performance:** อินเด็กซ์สร้างในหน่วยความจำและการค้นหาสอบถามข้อมูลอย่างรวดเร็ว

---

## SECTION 12: Knowledge Map (แผนที่ความรู้)

- **Constellation Map:** แผนผังรัศมี (Radial Focus Map) แสดงโหนดศูนย์กลางและโหนดเพื่อนบ้าน โยงเส้นความสัมพันธ์ สามารถคลิกย้ายศูนย์กลางและซูมได้ พร้อม fallback แบบไร้ JS

---

## SECTION 13: Studio Dashboard (แผงควบคุมนักเขียน)

- แผงควบคุมที่ลดความวิตกกังวล แสดงงานล่าสุด ฉบับร่าง คิวตีพิมพ์ และสถิติผู้อ่านในอินเทอร์เฟซที่สะอาดตา

---

## SECTION 14: User Profile (โปรไฟล์ผู้ใช้งาน)

- แสดงข้อมูลบัญชี สถานะบทบาท (`admin` / `writer` / `user`) ประวัติผลงานเขียน และคลังความรู้ที่บันทึกไว้

---

## SECTION 15: UI Requirements (ข้อกำหนด UI)

- อิง Design Tokens ใน `globals.css` ทุกชิ้นส่วน (Cards, Buttons, Accordions, Forms, Dialogs) สม่ำเสมอ ไม่สร้างสไตล์ขึ้นเอง

---

## SECTION 16: UX Requirements (ข้อกำหนด UX)

- ออกแบบให้รองรับการอ่านเนื้อหายาว (Long-form reading) การค้นหาและการเชื่อมโยงความรู้ที่ลื่นไหล ลด Decision Fatigue และยึดหลัก Recognition over Recall

---

## SECTION 17: Animation Requirements (ข้อกำหนดแอนิเมชัน)

- เคารพ `prefers-reduced-motion` และมีโหมด "Mobile Snappy Mode" ปิดแอนิเมชันหนักบนมือถือเพื่อความตอบสนองฉับไว

---

## SECTION 18: Performance (ข้อกำหนดประสิทธิภาพ)

- หน้าสาธารณะใช้ ISR (`revalidate = 300`) และ SSG เพื่อความเร็วสูงสุด เป้าหมาย Core Web Vitals และ Lighthouse > 95

---

## SECTION 19: Accessibility (ข้อกำหนดการเข้าถึง)

- มาตรฐาน WCAG AA รองรับ Keyboard navigation, ARIA labels ครบถ้วน โครงสร้าง Semantic HTML และระดับความต่างสีชัดเจน

---

## SECTION 20: SEO (ข้อกำหนด SEO)

- โครงสร้างข้อมูลและ SEO ครบวงจร (Open Graph, Twitter Card, JSON-LD Schema.org Article/Book/Person, Breadcrumbs, Canonical URLs)

---

## SECTION 21: Security (ข้อกำหนดความปลอดภัย)

- รักษากฎเหล็กความปลอดภัย (Supabase RLS + Clerk Auth) ห้ามเปิดเผย API keys ลง repo และบันทึกประวัติการแก้ไขข้อมูล (Audit Logs / Versioning)

---

## SECTION 22: AI Requirements (ข้อกำหนด AI Assistant)

- AI ทำหน้าที่ผู้ช่วยวิเคราะห์ความรู้ แนะนำการอ้างอิง และเชื่อมโยงมโนทัศน์วิชาการ โดยยึด AI Collaboration Constitution อย่างเคร่งครัด

---

## SECTION 23: Analytics (ข้อกำหนดวิเคราะห์ข้อมูล)

- เก็บสถิติการอ่าน (Page Views via RPC) พฤติกรรมการสืบค้น และการเข้าชมโหนดความรู้ เพื่อพัฒนาคลังข้อมูล

---

## SECTION 24: Technical Architecture (สถาปัตยกรรมระบบ)

- **Frontend:** Next.js 16 App Router · React 19 · Tailwind v4
- **Backend/Data:** Supabase PostgreSQL · Clerk Auth · Cloudflare R2 Object Storage · Upstash Redis

---

## SECTION 25: Deployment (ข้อกำหนดการปล่อยระบบ)

- Vercel Deployment พร้อมระบบ CI/CD ที่ตรวจ build/lint เขียวก่อนขึ้นจริง และจัดการ Environment Variables อย่างรัดกุม

---

## SECTION 26: Testing (ข้อกำหนดการทดสอบ)

- การตรวจสอบผ่าน Automated Linting/Building และเตรียมพร้อมสู่ Unit & E2E Testing สำหรับ core flow

---

## SECTION 27: Documentation (ข้อกำหนดเอกสาร)

- เอกสารระบบทั้งหมดต้องอัปเดตอย่างสม่ำเสมอในศูนย์กลาง `docs/AGENT-HANDOFF.md` และ `PRD.md`

---

## SECTION 28: Design System (ข้อกำหนดระบบดีไซน์)

- สืบทอดจากโทเค็นใน `globals.css` ครอบคลุม Color Cosmology, Typography, Spacing, Radius และ Shadow

---

## SECTION 29: Roadmap (แผนประเมินการพัฒนา)

- **Phase 1:** Core Architecture & P0-P1 Hubs (Completed)
- **Phase 2:** Performance & Mobile Snappy UX (Completed)
- **Phase 3:** Advanced Studio Mentions, Citations & AI Knowledge Assistant (In Progress)

---

## SECTION 30: Acceptance Criteria (เกณฑ์การตรวจรับงาน)

- โค้ดผ่าน `npm run build` และ `npm run lint` 100%
- หน้าเว็บโหลดเร็ว ตอบสนองทันทีบนมือถือ และคงอัตลักษณ์ Thai-first วิชาการลุ่มลึก

---

## APPENDIX A: Glossary (อภิธานศัพท์)

- คำศัพท์ทางจิตวิทยาและปรัชญาที่ใช้ในระบบ (เช่น Ego, Shadow, Anima/Animus, Archetype, Individuation)

---

## APPENDIX B: Knowledge Ontology (ลำดับชั้นความรู้)

- อ้างอิงห่วงโซ่: `Thinker ↓ School ↓ Concept ↓ Theory ↓ Article ↓ Reference ↓ Book ↓ Timeline`

---

## APPENDIX C: Color Cosmology (ศาสตร์แห่งสี)

- อ้างอิง Design Tokens: Prima (`--color-deep-navy`), Sapientia (`--color-antique-gold`), Mercurius, Psyche

---

## APPENDIX D: Design Constitution (ข้อกำหนดดีไซน์สูงสุด)

- อ้างอิง Phase 1 - Phase 60 ใน `docs/AGENT-HANDOFF.md`

---

## APPENDIX E: AI Constitution (ข้อกำหนดสำหรับ AI)

- อ้างอิง Phase 69 ใน `docs/AGENT-HANDOFF.md` ห้ามสร้างสไตล์หรือคอมโพเนนต์ซ้ำซ้อน

---

## APPENDIX F: Agent-Handoff (คู่มือส่งต่อ AI)

- อ้างอิงไฟล์ `docs/AGENT-HANDOFF.md`

---

## APPENDIX G: Coding Standards (มาตรฐานโค้ด)

- TypeScript Strict, Next.js 16 Server/Client Components Split, Thai-first semantics

---

## APPENDIX H: Database Schema (สกีมาฐานข้อมูล)

- อ้างอิงไฟล์ `supabase/schema.sql`

---

## APPENDIX I: Component Library (คลังคอมโพเนนต์)

- อ้างอิงไฟล์ใน directory `components/`

---

## APPENDIX J: Future Ideas (แนวคิดอนาคต)

- Interactive 3D Constellation, Reading Path AI Navigator, Audio Narrations
