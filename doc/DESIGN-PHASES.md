# ARCHRON Design System — Master Plan

> แผนปรับปรุงเว็บ ARCHRON ทั้งหมด 30 Phases
> **Status:** Living Design Constitution
> **Framework:** Next.js 16 (App Router) · React 19 · Tailwind v4 · Supabase · Clerk

---

## Constitutional Reading Order (ลำดับการอ่านรัฐธรรมนูญก่อนเริ่มงาน)

> AI และนักพัฒนาต้องอ่านรัฐธรรมนูญเหล่านี้ก่อนเริ่มทุก Phase

| ลำดับ | รัฐธรรมนูญ | ตำแหน่งไฟล์ | ขอบเขต |
|---|---|---|---|
| 1 | **AGENT-HANDOFF.md** | `docs/AGENT-HANDOFF.md` | Master Operational Constitution — กฎเหล็ก, เส้นทางงาน, แผนที่โค้ด |
| 2 | **ROADMAP.md** | `docs/ROADMAP.md` | Context Engineering Roadmap 70 Phases — แผนที่ยุทธศาสตร์ทั้งระบบ 7 Layers |
| 3 | **PRD.md** | `docs/PRD.md` | Product Requirements — วิสัยทัศน์, Personas, Feature List, Acceptance Criteria |
| 4 | **Sitemap.md** | `docs/Sitemap.md` | Dynamic Route Architecture v3.0 — โครงสร้างเส้นทางทั้งหมด |
| 5 | **VOS.md** | `docs/VOS.md` | Visual Operating System — ปรัชญาดีไซน์, สี, โทเค็น, ฟอนต์, Layout |
| 6 | **SYMBOLS.md** | `docs/SYMBOLS.md` | Symbol Dictionary — สัญลักษณ์ 17 วัตถุความรู้, Interaction Symbols |
| 7 | **AES.md** | `docs/AES.md` | Editorial Experience System — ประสบการณ์การอ่าน, ลำดับชั้นข้อมูล, Card Design |
| 8 | **EDS.md** | `docs/EDS.md` | Editorial DNA System — จีโนมบรรณาธิการ 6 ชั้น, Dynamic Density |
| 9 | **AGENTS.md** | `AGENTS.md` | Agent Rules — ขอบเขตงานห้ามทำเกิน, Conventions |

---

## Constitutional Map (แผนผังรัฐธรรมนูญที่เกี่ยวข้องกับ Design Phases)

```text
AGENT-HANDOFF.md (Master Constitution)
├── ROADMAP.md (70 Phases → กำหนดว่า "ลำดับพัฒนาอะไรก่อนหลัง")
│   ├── Layer I: Brand Foundation (Phase 01-10)
│   │   └── Design Phase 01-05 ← ROADMAP Phase 07-08 (VOS, Color)
│   ├── Layer III: UX Architecture (Phase 21-30)
│   │   └── Design Phase 06-18 ← ROADMAP Phase 23-27 (Layout, Grid, Cards)
│   ├── Layer IV: Design System (Phase 31-40)
│   │   └── Design Phase 11-30 ← ROADMAP Phase 31, 36-40 (Typography, Components)
│   └── Layer VII: Platform Engineering (Phase 61-70)
│       └── Design Phase 30 ← ROADMAP Phase 66 (Performance)
├── PRD.md (Product → กำหนดว่า "ทำอะไร")
├── Sitemap.md (Routes → กำหนดว่า "มีหน้าไหน")
├── VOS.md (Visual → กำหนดว่า "หน้าตาเป็นอย่างไร")
│   ├── Phase 01 (VOS Tokens) ← อ้างอิง VOS.md §05-§09
│   ├── Phase 04 (Color) ← อ้างอิง VOS.md §05 Color Engine
│   ├── Phase 06 (Grid) ← อ้างอิง VOS.md §08 Grid System
│   └── Phase 29 (Motion) ← อ้างอิง VOS.md §11 Motion Engine
├── SYMBOLS.md (Symbols → กำหนดว่า "ใช้สัญลักษณ์อะไร")
│   ├── Phase 12 (Cards) ← อ้างอิง SYMBOLS.md §4 Knowledge Icons
│   └── Phase 16 (Navigation) ← อ้างอิง SYMBOLS.md §5 Interaction Symbols
├── AES.md (Editorial UX → กำหนดว่า "อ่านอย่างไร")
│   ├── Phase 07 (Layout) ← อ้างอิง AES.md §13 Layout Width
│   ├── Phase 10 (Reading Rhythm) ← อ้างอิง AES.md §6 Reading Sections
│   ├── Phase 12 (Cards) ← อ้างอิง AES.md §9 Card Archetypes
│   └── Phase 19-25 (Knowledge UI) ← อ้างอิง AES.md §2-§11
└── EDS.md (Editorial DNA → กำหนดว่า "รหัสพันธุกรรม")
    ├── Phase 02 (DNA) ← อ้างอิง EDS.md §2 Editorial Genome
    ├── Phase 12 (Cards) ← อ้างอิง EDS.md §3-§8 DNA Layers
    └── Phase 18 (Feedback) ← อ้างอิง EDS.md §10 Visual Rhythm
```

---

## ROADMAP Phase Mapping (แผนผังเชื่อมโยง ROADMAP 70 Phases ↔ Design Phases 30 Phases)

> อ้างอิง `ROADMAP.md` — Context Engineering Roadmap 7 Layers

| ROADMAP Layer | ROADMAP Phases | Design Phases | ขอบเขต |
|---|---|---|---|
| **Layer I: Brand Foundation** | 01-10 | Phase 01-05 (Foundation) | Brand DNA → VOS → Color → Copy |
| **Layer II: Knowledge Architecture** | 11-20 | — (เป็น data layer ไม่ใช่ UI) | Ontology, Metadata, Graph, SEO |
| **Layer III: UX Architecture** | 21-30 | Phase 06-10 (Layout) | Layout, Grid, Spacing, Rhythm, Accessibility |
| **Layer IV: Design System** | 31-40 | Phase 11-18 (Components) | Typography, Icons, Cards, Motion, Responsive |
| **Layer V: Knowledge Platform** | 41-50 | Phase 19-25 (Knowledge UI) | Article, Concept, Thinker, School, Book, Graph, Timeline |
| **Layer VI: Editorial Studio** | 51-60 | Phase 26-28 (Studio) | Dashboard, Editor, Profile |
| **Layer VII: Platform Engineering** | 61-70 | Phase 29-30 (Motion/Responsive) | Performance, Security, Deployment |

### ROADMAP ↔ Design Phase Detail

| ROADMAP Phase | ชื่อ | Design Phase ที่เกี่ยวข้อง |
|---|---|---|
| ROADMAP §07 | Visual Operating System | Design Phase 01 (VOS Tokens) |
| ROADMAP §08 | Color Cosmology | Design Phase 04 (Color) |
| ROADMAP §21 | Editorial DNA | Design Phase 02 (DNA) |
| ROADMAP §22 | Editorial Experience | Design Phase 10 (Reading Rhythm), 19-25 (Knowledge UI) |
| ROADMAP §23 | Layout System | Design Phase 07 (Layout) |
| ROADMAP §24 | Grid System | Design Phase 06 (Grid) |
| ROADMAP §25 | Spacing System | Design Phase 08 (Spacing) |
| ROADMAP §26 | Card Morphology | Design Phase 12 (Cards) |
| ROADMAP §27 | Navigation System | Design Phase 16 (Navigation) |
| ROADMAP §30 | Accessibility | Design Phase 30 (Responsive) |
| ROADMAP §31 | Typography | Design Phase 11 (Typography) |
| ROADMAP §36 | Component Library | Design Phase 12-18 (Components) |
| ROADMAP §38 | Motion System | Design Phase 29 (Motion) |
| ROADMAP §40 | Responsive System | Design Phase 30 (Responsive) |
| ROADMAP §41 | Article System | Design Phase 19 (Article) |
| ROADMAP §42 | Concept System | Design Phase 20 (Concept) |
| ROADMAP §43 | Thinker System | Design Phase 21 (Thinker) |
| ROADMAP §44 | School System | Design Phase 22 (School) |
| ROADMAP §46 | Book System | Design Phase 23 (Book) |
| ROADMAP §48 | Timeline Experience | Design Phase 25 (Timeline) |
| ROADMAP §51 | Studio UX | Design Phase 26 (Studio Dashboard) |
| ROADMAP §52 | Rich Editor | Design Phase 27 (Editor) |

---

## Overview

ARCHRON ต้องการ Design System ระดับ Production ที่สะท้อน

- **Knowledge-first**: ทุก pixel ต้องส่งเสริมการเรียนรู้ (PRD §03: Knowledge before decoration)
- **Thai Identity**: ไม่ใช่ template — มี DNA ของตัวเอง (AGENT-HANDOFF §18.1: Visual Psychology)
- **Living System**: ไม่ใช่ static style guide — evolve ได้ (EDS §16: Design evolves. The DNA remains.)
- **Enterprise-grade**: พร้อม scale ทั้งด้าน performance และ maintenance (PRD §18: Core Web Vitals > 95)
- **Roadmap-aligned**: Design Phases สอดคล้องกับ ROADMAP 70 Phases ทุก Layer (ROADMAP.md §Final Goal)

### 18 Golden Rules (กฎทองคำสูงสุด — อ้างอิง AGENT-HANDOFF §18.4)

ทุก Phase ต้องยึดถือกฎ 18 ประการ ซึ่งสรุปเป็นหลักการออกแบบหลัก 7 ข้อใน VOS.md §02:
1. Human First · 2. Knowledge First · 3. Quiet Interface · 4. Timeless Design
5. Functional Beauty · 6. Progressive Complexity · 7. Invisible Technology

---

## Phase Categories

```text
Foundation        (Phase 01-05)    <- ภาษาการออกแบบทั้งหมด
Layout            (Phase 06-10)    <- โครงสร้างหน้าจอ
Typography        (Phase 11)       <- ตัวอักษร (ทำทีหลัง)
Components        (Phase 12-18)    <- ชิ้นส่วน UI
Knowledge UI      (Phase 19-25)    <- หน้าเนื้อหาเฉพาะทาง
Studio            (Phase 26-28)    <- ส่วนผู้เขียน
Motion            (Phase 29-30)    <- การเคลื่อนไหว + Responsive
```

---

## Foundation

### Phase 01 — Visual Operating System (VOS)

**วัตถุประสงค์**: กำหนดภาษาการออกแบบทั้งหมด — "ระบบปฏิบัติการทางสายตา"

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §05 Color Engine · §06 Surface Engine · §07 Typography · §08 Grid · §09 Icon System · `ROADMAP.md` Phase 07

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Design Tokens | สี, ขนาด, ระยะห่าง, เงา, ขอบ, มุม, ความโปร่งใส | VOS.md §05-§09, `globals.css`, ROADMAP §07 |
| Semantic Tokens | แผนที่ token ไปยังความหมาย (surface, content, accent) | VOS.md §06 Surface Engine |
| State Tokens | hover, active, focus, disabled, error, success | AGENT-HANDOFF §12 Cosmology |
| Density Scale | compact, comfortable, spacious | EDS.md §12 Dynamic Density |
| Elevation Scale | 0-5 levels (Background → Modal/Overlay) | VOS.md §06 ลำดับชั้นพื้นผิว |
| Border Radius Scale | 0, sm, md, lg, xl, 2xl, full | AES.md §14 Card Philosophy |
| Opacity Scale | 0%, 5%, 10%, 25%, 50%, 75%, 100% | VOS.md §15 Background Engine |
| Breakpoint Tokens | sm, md, lg, xl, 2xl | VOS.md §08 Grid System |

**Deliverable**: `tokens.css` + `design-tokens.json`

**Gotchas**: ห้าม hardcode สีหรือขนาดเด็ดขาด (AGENT-HANDOFF §18.4: Strict Token Inheritance)

---

### Phase 02 — Editorial DNA

**วัตถุประสงค์**: DNA ของ Interface ทั้งระบบ — "ถ้าลบ logo ออก ยังรู้ว่าคือ ARCHRON"

**อ้างอิงรัฐธรรมนูญ**: `EDS.md` ทั้งหมด · `VOS.md` §04 Visual Personality · `ROADMAP.md` Phase 21

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Visual Personality | Elegant, Academic, Warm, Calm, Curious, Intellectual, Organic, Minimal, Sophisticated, Timeless | VOS.md §04 (Embrace/Never) |
| Shape Language | รูปทรงที่ใช้ — angular vs rounded vs organic | EDS.md §9 Universal Rules |
| Pattern Identity | ลวดลายเฉพาะที่เป็น signature | SYMBOLS.md §6 Decorative Motifs |
| Proportion Rules | สัดส่วน golden ratio / modular scale | VOS.md §06 Surface Engine |
| Contrast Philosophy | ความ contrast ของ hierarchy | AES.md §15 Empty Space |
| Empty Space Philosophy | วิธีใช้ whitespace = "องค์ประกอบทางบรรณาธิการ" | EDS.md §10 Visual Rhythm |
| Texture Language | พื้นผิว, noise, grain, gradients | VOS.md §15 Background Engine (2-6% opacity) |

**Deliverable**: `dna.md` + visual examples

**Gotchas**: ห้ามมีลักษณะ Corporate, Cold, Gaming/Sci-Fi/Cyberpunk, Glass Everywhere, Over Decorative (VOS.md §04)

---

### Phase 03 — Atmosphere

**วัตถุประสงค์**: กลิ่นอายของ ARCHRON — "ความรู้สึกเมื่อเปิดหน้าเว็บ"

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §03 Design Language · §13 Dynamic Context Engine · `PRD.md` §02 Brand Identity · `ROADMAP.md` Phase 04

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Mood Board | ภาพอ้างอิง 20-30 ภาพ — หอดูดาวยามค่ำคืน, พิพิธภัณฑ์, กระดาษโบราณ | PRD §02: "หอดูดาวทางปัญญา" |
| Emotion Map | ความรู้สึกที่ต้องการสื่อในแต่ละ context | VOS.md §13 Dynamic Context Engine |
| Sensory Brand | เสียง, ความรู้สึก, จังหวะ | PRD §02: "สงบนิ่ง ลุ่มลึก" |
| Cultural References | อ้างอิงทางวัฒนธรรม (vibe ไม่ใช่ motif) | SYMBOLS.md §6 Decorative Motifs |
| Anti-patterns | สิ่งที่ ARCHRON ไม่ใช่ | VOS.md §04 (Never list) |

**Deliverable**: `atmosphere.md` + mood board images

**Gotchas**: ห้ามใช้ Gaming/Sci-Fi/Cyberpunk, ห้ามใช้ Glassmorphism ทุกที่ (VOS.md §04)

---

### Phase 04 — Color Cosmology

**วัตถุประสงค์**: Semantic Color System + Dynamic Color

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §05 Color Engine · `AGENT-HANDOFF.md` §12 Bridge Colors · `AES.md` §12 Dynamic Color Cosmology · `EDS.md` §11 Dynamic Color Cosmology · `ROADMAP.md` Phase 08

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Core Palette | Canvas (#080B16), Warm Ivory, Paper/Stone, Graphite | VOS.md §05 Base Palette |
| Domain Accents | 9 สาขาวิชา: Royal Violet, Indigo, Bronze, Crimson, Amber, Terracotta, Emerald, Cyan, Azure | VOS.md §05 Dynamic Domain Accents |
| State Colors | hover, active, focus, disabled, error, warning, success, info | — |
| Bridge Colors | 6 สีผสมข้ามศาสตร์ (reflection, threshold, illumination, dialogue, praxis, manuscript) | AGENT-HANDOFF §12 |
| Dark/Light Mode | ทั้งสองโหมดมี semantic mapping เดียวกัน | — |
| Dynamic Color | สีเปลี่ยนตาม context ผ่าน `routeCosmology()` | `lib/content/cosmology.ts` |
| Accessibility | WCAG 2.1 AA contrast ratios | VOS.md §18 Accessibility |
| Color Grammar | ห้ามเปลี่ยนสีพื้นหลังหลัก (Never Background) | EDS.md §11, AES.md §12 |

**Deliverable**: `colors.css` + `color-grammar.md`

**Gotchas**: สีพื้นหลังหลักต้องคง `--color-deep-navy` (#080B16) เสมอ ห้ามเปลี่ยนตามศาสตร์ (AGENT-HANDOFF §12)

---

### Phase 05 — Editorial Language

**วัตถุประสงค์**: ข้อความทุกส่วนของ interface

**อ้างอิงรัฐธรรมนูญ**: `PRD.md` §02 Tone of Voice · `EDS.md` §14 Reading Philosophy · `AGENT-HANDOFF.md` §18.1 Curiosity Psychology · `ROADMAP.md` Phase 06

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Label System | ชื่อ field, ป้าย, ข้อความสั้น | — |
| Button Copy | CTA, actions, confirmations | SYMBOLS.md §5 Interaction Symbols |
| Empty State | ข้อความเมื่อไม่มีข้อมูล (ทุก context) | EDS.md §8 Navigation: "ความรู้ไม่ควรมีจุดสิ้นสุด" |
| Error Messages | ข้อความ error ที่เป็นประโยชน์ | — |
| Microcopy | Placeholder, helper text, tooltip | — |
| Tone of Voice | เป็นทางการ อบอุ่น สุขุม ชวนขบคิด ไม่ใช้ภาษาการตลาดฉาบฉวย | PRD §02 |
| Thai Writing Rules | วรรคตอน, ภาษาเขียน, ศัพท์เทคนิค | Thai-first (AGENT-HANDOFF §17) |

**Deliverable**: `copy-guide.md` + `empty-states.md`

**Gotchas**: Thai-first เสมอ ห้ามเพิ่ม EN route/switcher (AGENT-HANDOFF §17)

---

## Layout

### Phase 06 — Grid System

**วัตถุประสงค์**: โครงสร้างตาราง

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §08 Grid System · `ROADMAP.md` Phase 24

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Column System | Desktop 12 · Tablet 8 · Mobile 4 columns | VOS.md §08 |
| Gutter Scale | 8, 12, 16, 24, 32, 48px | VOS.md §08: 8pt Grid |
| Margin Scale | ตาม breakpoint | — |
| Grid Variants | fixed, fluid, content-width | — |
| Nested Grid | กฎการซ้อน grid | — |

**Deliverable**: `grid.css` + examples

---

### Phase 07 — Layout System

**วัตถุประสงค์**: โครงสร้างหน้าจอทั้งหมด

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §17 Layout Archetypes · `AES.md` §13 Layout Width · `Sitemap.md` · `ROADMAP.md` Phase 23

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Page Templates | 8 archetypes: Article, Thinker, Concept, Book, Timeline, Search, Studio, Dashboard | VOS.md §17 |
| Section Patterns | hero, content, sidebar, footer | AES.md §2 Information Hierarchy |
| Width Rules | Reading 760px · Reference 980px · Studio 1280px · Dashboard 1440px | AES.md §13 |
| Content Zones | primary, secondary, tertiary | — |
| Sidebar Rules | sticky, collapsible | — |
| Footer Patterns | minimal, full | — |

**Deliverable**: `layout.css` + template specs

**Gotchas**: ความกว้างหน้าอ่านต้องจำกัดที่ 760px (AGENT-HANDOFF §4)

---

### Phase 08 — Spacing System

**วัตถุประสงค์**: ระยะห่างทั้งหมด
**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §08 Grid (8pt Rhythm) · `ROADMAP.md` Phase 25

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Base Unit | 4px | VOS.md §08: 8pt Grid |
| Spacing Scale | 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64 | — |
| Component Spacing | padding/margin ภายใน components | EDS.md §10 Visual Rhythm |
| Section Spacing | ระยะห่างระหว่าง sections | AES.md §7 Section Style |
| Text Spacing | line-height, letter-spacing | VOS.md §07 Reading Rhythm |
| Responsive Spacing | ระยะห่างเปลี่ยนตาม breakpoint | — |

**Deliverable**: `spacing.css`

---

### Phase 09 — Container System

**วัตถุประสงค์**: ขนาดสูงสุดของ content

**อ้างอิงรัฐธรรมนูญ**: `AES.md` §13 Layout Width · `ROADMAP.md` Phase 23

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Max Width Scale | sm(640), md(768), lg(1024), xl(1280), 2xl(1536), prose(75ch) | — |
| Container Variants | narrow, standard, wide, full | AES.md §13 |
| Reading Container | 760px (not 75ch — ใช้ px ตาม AES) | AES.md §13: "760px" |
| Content-Width Rules | เมื่อใช้ container ไหน | AES.md §13 |

**Deliverable**: `containers.css`

---

### Phase 10 — Reading Rhythm

**วัตถุประสงค์**: จังหวะการอ่าน

**อ้างอิงรัฐธรรมนูญ**: `AES.md` §6 Reading Sections · §7 Section Style · §16 Knowledge Rhythm · `EDS.md` §10 Visual Rhythm · `ROADMAP.md` Phase 22

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Vertical Rhythm | baseline grid 8px | VOS.md §08 |
| Paragraph Spacing | ระยะห่างย่อหน้า | AES.md §7 |
| Heading Spacing | ระยะห่างก่อน/หลัง heading — Large Top, Small Bottom | AES.md §7 |
| List Spacing | ระยะห่างระหว่าง list items | — |
| Block Spacing | ระยะห่าง between content blocks | EDS.md §10 |
| Section Breaks | เส้นคั่น, เว้นวรรค — ห้ามประดับลวดลายไม่จำเป็น | AES.md §7: "No Decoration" |

**Deliverable**: `rhythm.css`

**Gotchas**: Whitespace = องค์ประกอบทางบรรณาธิการ ไม่ใช่พื้นที่ว่างเปล่า (EDS.md §10)

---

## Typography

### Phase 11 — Typography Constitution

> **ไว้ทำทีหลัง** — หลังจาก Phase 01-10, 12-30 สมบูรณ์แล้ว

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §07 Typography System · `ROADMAP.md` Phase 31

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Font Stack | Editorial: Noto Serif Thai · UI: IBM Plex Sans Thai · Mono: JetBrains Mono | VOS.md §07 |
| Type Scale | modular scale สำหรับ headings + body | — |
| Thai Font Considerations | ขนาด, line-height, weight สำหรับอักษรไทย | VOS.md §07: "Reading Rhythm" |
| Heading Hierarchy | H1-H6 rules | — |
| Body Text Rules | ขนาด, ระยะบรรทัด, ความกว้างบรรทัด | — |
| Code Typography | monospace, syntax highlighting | — |
| Caption/Footnote | ขนาดเล็ก | — |
| Type Composition | การจัดวางตัวอักษรร่วมกับ layout | — |

**Deliverable**: `typography.css` + `type-scale.json`

---

## Components

### Phase 12 — Card Morphology

**วัตถุประสงค์**: 24 Families ของ Card

**อ้างอิงรัฐธรรมนูญ**: `AES.md` §9 Card Archetypes · §14 Card Philosophy · `EDS.md` §3-§8 DNA Layers · §12 Dynamic Density · `VOS.md` §14 Card System · `SYMBOLS.md` §4 Knowledge Icons · `ROADMAP.md` Phase 26

| Family | ใช้กับ | DNA Layers | อ้างอิง |
|---|---|---|---|
| ArticleCard | บทความ | Identity → Content → Navigation | AES §9 (Reading First) |
| ConceptCard | แนวคิด | Identity → Content → Relationship | AES §9 (Definition First) |
| ThinkerCard | นักปราชญ์ | Identity → Context → Navigation | AES §9 (Portrait First) |
| SchoolCard | สำนักคิด | Identity → Context → Navigation | AES §9 (School Card) |
| BookCard | หนังสือ | Identity → Evidence → Navigation | AES §9 (Cover First) |
| TheoryCard | ทฤษฎี | Identity → Relationship → Content | — |
| CollectionCard | คอลเลกชัน | Identity → Relationship → Navigation | AES §9 (Relationship First) |
| PathCard | เส้นทางการอ่าน | Identity → Navigation | — |
| TagCard | Tags | Identity | — |
| ReferenceCard | แหล่งอ้างอิง | Identity → Evidence | AES §9 (Citation First) |
| SearchResultCard | ผลการค้นหา | Identity → Context → Navigation | — |
| AchievementCard | Achievements | Identity → Content | — |
| UserCard | โปรไฟล์ผู้ใช้ | Identity → Context | — |
| NotificationCard | การแจ้งเตือน | Identity → Content | — |
| DraftCard | Drafts ใน Studio | Identity → Context → Navigation | — |
| RevisionCard | ประวัติเวอร์ชัน | Identity → Evidence | — |
| CommentCard | ความคิดเห็น | Identity → Content | — |
| MediaCard | ไฟล์ media | Identity → Content | — |
| ExternalLinkCard | ลิงก์ภายนอก | Identity → Navigation | — |
| TimelineCard | เหตุการณ์ Timeline | Identity (Time) → Navigation | AES §9 (Chronology First) |
| GraphNodeCard | Node ใน Knowledge Graph | Identity → Relationship | — |
| StatCard | สถิติ | Identity → Content | — |
| FeatureCard | คุณสมบัติ (landing) | Identity → Content → Navigation | — |
| SkeletonCard | Loading state | — | — |

**Deliverable**: `cards.css` + component specs

**Gotchas**:
- การ์ดต้องให้สัมผัสคล้าย "ป้ายคำอธิบายในพิพิธภัณฑ์" (AES §14)
- ห้ามใช้ Heavy Shadows, Glass everywhere, Huge Radius > 12px, Gradient Cards, Neon Glow (AES §14)
- ห้ามคิดค้นบล็อกใหม่โดยไร้ความจำเป็น (EDS §13)
- ความหนาแน่น 3 ระดับ: Light, Medium, Heavy (EDS §12)

---

### Phase 13 — Button System

**อ้างอิงรัฐธรรมนูญ**: `SYMBOLS.md` §5 Universal Interaction Symbols · `ROADMAP.md` Phase 36

| รายการ | รายละเอียด |
|---|---|
| Variants | primary, secondary, tertiary, ghost, danger, link |
| Sizes | sm, md, lg |
| States | default, hover, active, focus, disabled, loading |
| Icon Buttons | with icon, icon-only — ใช้สัญลักษณ์จาก SYMBOLS.md |
| Button Groups | toolbar, segmented |
| Floating Action | FAB for key actions |

**Deliverable**: `buttons.css` + component specs

---

### Phase 14 — Input System

| รายการ | รายละเอียด |
|---|---|
| Text Input | text, email, password, search, url, tel |
| Textarea | multiline text |
| Select | dropdown, multi-select |
| Checkbox | single, group |
| Radio | single, group |
| Toggle | on/off switch |
| Date/Time | date picker, time picker |
| File Upload | drag & drop, browse |
| States | default, focus, error, disabled, loading |
| Labels & Helpers | label, placeholder, helper, error message |
| Validation | real-time, on-submit |

**Deliverable**: `inputs.css` + component specs

---

### Phase 15 — Tag, Badge, Chip, Pill

| Component | ใช้กับ | อ้างอิง |
|---|---|---|
| Tag | ป้ายกำกับเนื้อหา (clickable) | EDS.md §8 Navigation |
| Badge | จำนวน, สถานะ (notification count) | — |
| Chip | ตัวเลือกที่เลือก/ยกเลิกได้ | — |
| Pill | แสดงข้อมูลสั้นๆ | — |

**Deliverable**: `labels.css` + component specs

---

### Phase 16 — Navigation

**อ้างอิงรัฐธรรมนูญ**: `SYMBOLS.md` §5 Universal Interaction Symbols · `VOS.md` §09 Icon System · `ROADMAP.md` Phase 27

| Component | รายละเอียด | อ้างอิง |
|---|---|---|
| Navbar | glass-morphism sticky, mobile hamburger | VOS.md §06 Floating Layer |
| Sidebar | collapsible, nested items, active state | — |
| Breadcrumb | hierarchical navigation | — |
| Tab Navigation | horizontal tabs, vertical tabs | — |
| Pagination | page numbers, infinite scroll | — |
| Skip Links | accessibility | VOS.md §18 |

**Deliverable**: `navigation.css` + component specs

---

### Phase 17 — Dialog, Modal, Drawer, Popover

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §06 Surface Engine (Layer 7-8) · `ROADMAP.md` Phase 36

| Component | รายละเอียด |
|---|---|
| Dialog | confirmation, form, information |
| Modal | centered, fullscreen, sheet |
| Drawer | left, right, bottom |
| Popover | hover, click, persistent |
| Tooltip | hover, focus, always-on |

**Deliverable**: `overlays.css` + component specs

---

### Phase 18 — Feedback

**อ้างอิงรัฐธรรมนูญ**: `EDS.md` §10 Visual Rhythm · `VOS.md` §11 Motion Engine · `ROADMAP.md` Phase 36

| Component | รายละเอียด |
|---|---|
| Toast | success, error, warning, info |
| Alert | inline, dismissible |
| Loading | spinner, progress bar, skeleton |
| Empty State | illustration + message + action — ใช้สัญลักษณ์จาก SYMBOLS.md |
| Error State | error page, retry |
| Success State | confirmation, celebration |

**Deliverable**: `feedback.css` + component specs

---

## Knowledge UI

### Phase 19 — Article Experience

**อ้างอิงรัฐธรรมนูญ**: `AES.md` §2-§11 · `EDS.md` §2-§8 · `AGENT-HANDOFF.md` §4 · `ROADMAP.md` Phase 41

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Reading View | clean, distraction-free, 760px width | AES §13 |
| Identity Block | English Title → Word Type → IPA → Origin → Thai Definition | AES §4 |
| Metadata Card | Thinker, School, Origin, Author, Published, Updated, Reading Time, Difficulty | AES §5 |
| Reading Sections | 10 ขั้น: Meaning → Definition → Context → Example → Misunderstandings → Related → Sources → Further → References → Navigation | AES §6 |
| Table of Contents | auto-generated, sticky sidebar | AGENT-HANDOFF §4 |
| Progress Indicator | reading progress bar | — |
| Related Knowledge | สูงสุด 6 การ์ด "Knowledge Connections" (ไม่ใช่ "You may also like") | AES §10 |
| References | Academic Callout สไตล์ Editorial (ไม่ใช่กล่องสีฉูดฉาด) | AES §8 |
| Navigation | Previous ← Library → Next | AES §11 |
| Dynamic Color | สีแต้มตามสาขาวิชา | AES §12 |

**Deliverable**: Article layout + components

**Gotchas**:
- ห้ามมี Hero Banner, Huge Image, Marketing (AES §3)
- ห้าม中断 reading flow (AES §2)
- ใช้ `[[wikilink]]` สำหรับ internal links (AGENT-HANDOFF §4)

---

### Phase 20 — Concept Experience

**อ้างอิงรัฐธรรมนูญ**: `AES.md` §4 Identity Block · `EDS.md` §3-§5 · `SYMBOLS.md` §4 Crystal · `ROADMAP.md` Phase 42

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Identity Block | ตามหลัก AES §4 — Word Type, IPA, Origin, Definition | AES §4 |
| Concept Page | definition, context, relations | EDS §3-§5 |
| Related Concepts | graph visualization — ใช้ Crystal symbol | SYMBOLS.md §4 |
| Backlinks | entries that reference this | EDS §3 Relationship |
| Etymology | word origin — ใช้ Scroll symbol | SYMBOLS.md §4 |
| Schools | which schools discuss this — ใช้ Temple symbol | SYMBOLS.md §4 |
| Timeline | historical context — ใช้ Hourglass symbol | SYMBOLS.md §4 |

**Deliverable**: Concept layout + components

---

### Phase 21 — Thinker Experience

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §17 Thinker Layout · `SYMBOLS.md` §4 Bust · `AES.md` §9 Thinker Card · `ROADMAP.md` Phase 43

| รายการ | รายละเอียด |
|---|---|
| Profile | portrait, bio, dates — Biography Style (VOS §17) |
| Works | books, articles |
| Ideas | key concepts — ใช้ Crystal symbol |
| School | affiliation — ใช้ Temple symbol |
| Timeline | life events — ใช้ Hourglass symbol |
| Related Thinkers | connections — ใช้ Bridge symbol |

**Deliverable**: Thinker layout + components

---

### Phase 22 — School Experience

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §17 · `SYMBOLS.md` §4 Temple · `AES.md` §9 School Card · `ROADMAP.md` Phase 44

| รายการ | รายละเอียด |
|---|---|
| Overview | description, founding |
| Members | thinkers in school |
| Key Ideas | core concepts |
| Works | important books |
| Timeline | historical development |
| Related Schools | connections — ใช้ Bridge symbol |

**Deliverable**: School layout + components

---

### Phase 23 — Book Experience

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §17 Book Layout · `SYMBOLS.md` §4 Open Book · `AES.md` §9 Book Card · `ROADMAP.md` Phase 46

| รายการ | รายละเอียด |
|---|---|
| Book Page | cover, metadata — Library Style (VOS §17) |
| Author | thinker profile link — ใช้ Bust symbol |
| Summary | synopsis |
| Key Concepts | ideas from book |
| References | citations — ใช้ Bookmark symbol |
| Related Books | similar works |

**Deliverable**: Book layout + components

---

### Phase 24 — Knowledge Graph

**อ้างอิงรัฐธรรมนูญ**: `SYMBOLS.md` §4 Constellation · `AGENT-HANDOFF.md` §7 · `VOS.md` §11 Motion Engine · `ROADMAP.md` Phase 14

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Graph View | interactive node-edge — ใช้ Constellation symbol | SYMBOLS.md §4 |
| Focus Mode | highlight node + neighbors — Radial Focus Map | AGENT-HANDOFF §7 |
| Search in Graph | find nodes | — |
| Filters | by type, school, era | — |
| Zoom/Pan | touch-friendly | VOS §11: Orbit motion |
| Detail Panel | node info sidebar | — |

**Deliverable**: Graph visualization + components

**Gotchas**: รองรับ No-JS fallback (AGENT-HANDOFF §7)

---

### Phase 25 — Timeline Experience

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §17 Timeline Layout · `SYMBOLS.md` §4 Hourglass · `AES.md` §9 Timeline Card · `ROADMAP.md` Phase 48

| รายการ | รายละเอียด |
|---|---|
| Timeline View | horizontal/vertical — Museum Walk Style (VOS §17) |
| Event Cards | Chronology First (AES §9) — ปีศักราช + ยุคสมัย |
| Filters | by type, era, school |
| Zoom | century, decade, year |
| Navigation | jump to era |
| Related Entries | linked content — ใช้ Bridge symbol |

**Deliverable**: Timeline layout + components

---

## Studio

### Phase 26 — Studio Dashboard

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §17 Dashboard Layout · `Sitemap.md` §11 Studio · `PRD.md` §13 · `ROADMAP.md` Phase 51

| รายการ | รายละเอียด |
|---|---|
| My Content | drafts, published, archived |
| Quick Actions | new draft, continue writing |
| Stats | views, reads, bookmarks |
| Notifications | reviews, comments |
| Activity | recent actions |

**Deliverable**: Dashboard layout + components

---

### Phase 27 — Editor

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §17 Studio Layout · `PRD.md` §10 Editor Requirements · `AGENT-HANDOFF.md` §5 · `ROADMAP.md` Phase 52

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Markdown Editor | split view, preview — Workspace Style (VOS §17) | PRD §10 |
| Toolbar | formatting, links, images | — |
| Autosave | real-time save indicator | AGENT-HANDOFF §5 |
| Version History | diff view, restore | PRD §10: Revision History |
| Publishing | checklist, schedule | AGENT-HANDOFF §5 |
| SEO | meta, og image | PRD §20 |
| AI Assistant | suggestions, rewrite | PRD §22 |
| Wikilinks | `[[Slug]]` with suggestion panel | PRD §10: Knowledge Linking |

**Deliverable**: Editor layout + components

---

### Phase 28 — Profile, Achievement, Collection

**อ้างอิงรัฐธรรมนูญ**: `Sitemap.md` §10 Profile · `PRD.md` §14 · `ROADMAP.md` Phase 51

| รายการ | รายละเอียด |
|---|---|
| Profile Page | avatar, bio, stats |
| Reading History | recently read |
| Bookmarks | saved entries |
| Achievements | badges, progress |
| Collections | user-created series |
| Settings | preferences, theme |

**Deliverable**: Profile layout + components

---

## Motion

### Phase 29 — Motion System

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §11 Motion Engine · `PRD.md` §17 Animation Requirements · `ROADMAP.md` Phase 38

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Easing Curves | standard, enter, exit | VOS §11 |
| Duration Scale | Short 150ms · Normal 300ms · Long 500ms+ | VOS §11 |
| Motion Types | Fade, Slide, Expand/Collapse, Scale, Float, Orbit, Reveal | VOS §11 |
| Page Transitions | route-fade (template.tsx) | AGENT-HANDOFF §2 |
| Scroll Animations | .scroll-reveal → .visible | AGENT-HANDOFF §2 |
| Micro Interactions | hover, click, toggle | — |
| Loading Animations | skeleton, spinner | — |
| Reduced Motion | เคารพ `prefers-reduced-motion: reduce` → เปลี่ยนเป็น Fade | VOS §11, PRD §17 |

**Deliverable**: `motion.css` + `motion-tokens.json`

**Gotchas**: ห้ามใส่ motion เพื่อความบันเทิงฉาบฉวย (VOS §11)

---

### Phase 30 — Responsive System

**อ้างอิงรัฐธรรมนูญ**: `VOS.md` §08 Grid · §18 Accessibility · `PRD.md` §17 Mobile Snappy Mode · `ROADMAP.md` Phase 40

| รายการ | รายละเอียด | อ้างอิง |
|---|---|---|
| Breakpoints | Mobile 0-640 · Tablet 641-1024 · Desktop 1025+ | VOS §08 |
| Mobile-first | base styles for mobile | — |
| Touch Targets | minimum 44x44px | VOS §18 |
| Responsive Typography | fluid type scale — `clamp()` | VOS §07 |
| Responsive Spacing | fluid spacing | — |
| Container Queries | component-level responsive | — |
| Mobile Snappy Mode | ปิดแอนิเมชันหนักบนมือถือ | PRD §17 |
| Testing | cross-device, cross-browser | PRD §26 |

**Deliverable**: `responsive.css` + breakpoint specs

---

## Implementation Order (ลำดับการพัฒนา)

```
 1. Phase 01  (VOS Tokens)         ← foundation สำหรับทุก phase · อ้างอิง VOS.md
 2. Phase 02  (Editorial DNA)      ← identity · อ้างอิง EDS.md
 3. Phase 03  (Atmosphere)         ← mood · อ้างอิง VOS.md §03, PRD §02
 4. Phase 04  (Color Cosmology)    ← visual language · อ้างอิง VOS.md §05
 5. Phase 08  (Spacing)            ← layout foundation · อ้างอิง VOS.md §08
 6. Phase 09  (Containers)         ← content width · อ้างอิง AES.md §13
 7. Phase 06  (Grid)               ← structural grid · อ้างอิง VOS.md §08
 8. Phase 07  (Layout)             ← page templates · อ้างอิง VOS.md §17
 9. Phase 10  (Reading Rhythm)     ← reading experience · อ้างอิง AES.md §6-§7
10. Phase 13  (Buttons)            ← most-used component · อ้างอิง SYMBOLS.md §5
11. Phase 14  (Inputs)             ← form components
12. Phase 15  (Tags/Badges)        ← labeling
13. Phase 16  (Navigation)         ← wayfinding · อ้างอิง SYMBOLS.md §5
14. Phase 17  (Dialogs)            ← overlays · อ้างอิง VOS.md §06
15. Phase 18  (Feedback)           ← system responses
16. Phase 12  (Cards)              ← 24 families · อ้างอิง AES.md §9, EDS.md §3-§8
17. Phase 05  (Copy)               ← editorial voice · อ้างอิง PRD §02
18. Phase 19-25 (Knowledge UI)     ← content experiences · อ้างอิง AES.md ทั้งหมด
19. Phase 26-28 (Studio)           ← author tools · อ้างอิง Sitemap.md §11
20. Phase 29  (Motion)             ← animation · อ้างอิง VOS.md §11
21. Phase 30  (Responsive)         ← multi-device · อ้างอิง VOS.md §08, §18
22. Phase 11  (Typography)         ← ทำสุดท้าย · อ้างอิง VOS.md §07
```

---

## Deliverable Checklist

```
tokens.css                 Phase 01  ← VOS.md §05-§09
design-tokens.json         Phase 01  ← VOS.md §05-§09
dna.md                     Phase 02  ← EDS.md, VOS.md §04
atmosphere.md              Phase 03  ← VOS.md §03, PRD §02
colors.css                 Phase 04  ← VOS.md §05
color-grammar.md           Phase 04  ← EDS.md §11, AES.md §12
copy-guide.md              Phase 05  ← PRD §02
empty-states.md            Phase 05  ← EDS.md §8
grid.css                   Phase 06  ← VOS.md §08
layout.css                 Phase 07  ← VOS.md §17, AES.md §13
spacing.css                Phase 08  ← VOS.md §08
containers.css             Phase 09  ← AES.md §13
rhythm.css                 Phase 10  ← AES.md §6-§7, EDS.md §10
typography.css             Phase 11  ← VOS.md §07
cards.css                  Phase 12  ← AES.md §9, EDS.md §3-§8, VOS.md §14
buttons.css                Phase 13  ← SYMBOLS.md §5
inputs.css                 Phase 14
labels.css                 Phase 15  ← EDS.md §8
navigation.css             Phase 16  ← SYMBOLS.md §5, VOS.md §06
overlays.css               Phase 17  ← VOS.md §06
feedback.css               Phase 18  ← EDS.md §10, VOS.md §11
motion.css                 Phase 29  ← VOS.md §11
motion-tokens.json         Phase 29  ← VOS.md §11
responsive.css             Phase 30  ← VOS.md §08, §18
```

---

## Cross-Reference Summary (สรุปการเชื่อมโยงรัฐธรรมนูญ)

| Design Phase | รัฐธรรมนูญหลัก | รัฐธรรมนูญรอง | ROADMAP Phase |
|---|---|---|---|
| Phase 01 (VOS) | VOS.md §05-§09 | AGENT-HANDOFF §12 | ROADMAP §07 |
| Phase 02 (DNA) | EDS.md ทั้งหมด | VOS.md §04 | ROADMAP §21 |
| Phase 03 (Atmosphere) | VOS.md §03, §13 | PRD §02 | ROADMAP §04 |
| Phase 04 (Color) | VOS.md §05 | EDS.md §11, AES.md §12, AGENT-HANDOFF §12 | ROADMAP §08 |
| Phase 05 (Copy) | PRD §02 | EDS.md §14 | ROADMAP §06 |
| Phase 06 (Grid) | VOS.md §08 | — | ROADMAP §24 |
| Phase 07 (Layout) | VOS.md §17 | AES.md §13, Sitemap.md | ROADMAP §23 |
| Phase 08 (Spacing) | VOS.md §08 | EDS.md §10 | ROADMAP §25 |
| Phase 09 (Containers) | AES.md §13 | — | ROADMAP §23 |
| Phase 10 (Rhythm) | AES.md §6-§7 | EDS.md §10 | ROADMAP §22 |
| Phase 11 (Typography) | VOS.md §07 | — | ROADMAP §31 |
| Phase 12 (Cards) | AES.md §9, §14 | EDS.md §3-§8, §12, VOS.md §14, SYMBOLS.md §4 | ROADMAP §26 |
| Phase 13 (Buttons) | SYMBOLS.md §5 | — | ROADMAP §36 |
| Phase 16 (Navigation) | SYMBOLS.md §5 | VOS.md §06, §09 | ROADMAP §27 |
| Phase 17 (Dialogs) | VOS.md §06 | — | ROADMAP §36 |
| Phase 18 (Feedback) | EDS.md §10 | VOS.md §11 | ROADMAP §36 |
| Phase 19-25 (Knowledge) | AES.md ทั้งหมด | EDS.md §2-§8, SYMBOLS.md §4 | ROADMAP §41-§48 |
| Phase 26-28 (Studio) | Sitemap.md §11 | PRD §10, §13, AGENT-HANDOFF §5 | ROADMAP §51-§52 |
| Phase 29 (Motion) | VOS.md §11 | PRD §17 | ROADMAP §38 |
| Phase 30 (Responsive) | VOS.md §08, §18 | PRD §17 | ROADMAP §40 |
