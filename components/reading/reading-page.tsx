// หน้าอ่าน Unified (articles/concepts) — ใช้ ReadingToc + ReadingDock (ดูไฟล์ในโฟลเดอร์เดียวกัน)
import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ContentEntry, RelationType, SourceItem, Difficulty } from "@/types/content";
import { InternalLinkText } from "@/components/reading/internal-link-text";
import { InternalConceptLink } from "@/components/reading/internal-concept-link";
import { conceptTitle } from "@/lib/content/concept-registry";
import {
  VisualMeaningIcon,
  ScholarIcon,
  RealExampleIcon,
  SourceRefIcon,
  RootIcon,
  AuthorPenIcon,
  CalendarIcon,
  ClockIcon,
  PersonIcon,
  SchoolIcon,
  ConceptIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { Tooltip } from "@/components/tooltip";
import { ContentCardList } from "@/components/content-card";
import { ClerkProvider } from "@clerk/nextjs";
import { ReadingToc } from "@/components/reading/reading-toc";
import { ReadingDock } from "@/components/reading/reading-dock";
import { ReadingProgress } from "@/components/reading/reading-progress";
import { ViewCounter } from "@/components/reading/view-counter";
import { CommentSection } from "@/components/reading/comment-section";
import { LocalGraph } from "@/components/reading/local-graph";
import { ReadCompletionTracker } from "@/components/reading/read-completion-tracker";
import { FontSizeControl } from "@/components/reading/font-size-control";
import { themesForEntry } from "@/lib/content/themes";
import { getPublicEntries } from "@/lib/content/public-source";
import { getBacklinksForConcept } from "@/lib/content/related";

type Section = "articles" | "concepts" | "books";

const SECTION_LABEL: Record<Section, string> = {
  articles: "บทความ",
  concepts: "คลังแนวคิด",
  books: "หนังสือ",
};

const RELATION_LABEL: Record<RelationType, string> = {
  prerequisite: "ควรอ่านก่อน",
  related: "เกี่ยวข้องโดยตรง",
  "contrasts-with": "เปรียบเทียบ / ต่าง",
  "part-of": "เป็นส่วนหนึ่งของ",
  "source-of": "แหล่งที่มา",
  "used-in": "ถูกใช้ใน",
  "influenced-by": "ได้รับอิทธิพลจาก",
};

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: "ผู้เริ่มต้น",
  intermediate: "ระดับกลาง",
  advanced: "อ่านลึก",
  "source-note": "บันทึกอ้างอิง",
};

const DIFFICULTY_HINT: Record<Difficulty, string> = {
  beginner: "เหมาะกับผู้เริ่มต้น ไม่ต้องมีพื้นฐานมาก่อน",
  intermediate: "ควรคุ้นเคยกับแนวคิดที่เกี่ยวข้องบ้าง",
  advanced: "อ่านเชิงลึก เหมาะกับผู้ที่คุ้นเคยกับศัพท์เฉพาะแล้ว",
  "source-note": "บันทึกแหล่งอ้างอิง ไม่ใช่บทความอธิบายเต็ม",
};

const SOURCE_TYPE_LABEL: Record<string, string> = {
  "primary-source": "แหล่งต้นทาง",
  "secondary-source": "งานอธิบาย",
  commentary: "อรรถาธิบาย",
  "editorial-interpretation": "การตีความของเว็บ",
  website: "เว็บไซต์",
  "dictionary-lexicon": "พจนานุกรม / ศัพทานุกรม",
  other: "อื่น ๆ",
};

const MAX_RELATED_INLINE = 6;

// Citation System — แปลงมาร์กเกอร์ [[cite:N]] หรือ [[cite:N,M]] ในเนื้อหา
// ให้เป็นลิงก์ยกกำลัง [N] ที่กระโดดไปยังรายการ "เอกสารอ้างอิง" ข้อที่ N (#ref-N)
// (สไตล์ยกกำลังคุมด้วย .md-body a[href^="#ref-"] ใน globals.css) · backward-compatible
function citeify(md: string): string {
  return md.replace(/\[\[cite:\s*([\d\s,]+)\]\]/g, (_m, group: string) =>
    group
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
      .map((n) => `[${n}](#ref-${n})`)
      .join(""),
  );
}

// ประมาณเวลาอ่านจากความยาวเนื้อหา (ภาษาไทยไม่เว้นวรรค — ใช้จำนวนอักขระ ~400/นาที)
function readTime(entry: ContentEntry): string {
  const chars =
    (entry.visualExplanation ?? "").length +
    (entry.technicalMeaning ?? "").length +
    (entry.bodyMarkdown ?? "").length;
  return `${Math.max(1, Math.round(chars / 400))} นาที`;
}

// Glossary (A2) — ลิงก์ /concepts/<slug> ในเนื้อหา เดินผ่าน InternalConceptLink
// (ได้ hover นิยาม + เมนูลัด wiki) · ลิงก์ภายนอกเปิดแท็บใหม่ · ที่เหลือ render ปกติ
const mdComponents: Components = {
  a({ href, children }) {
    const h = typeof href === "string" ? href : "";
    const m = h.match(/^\/concepts\/([^/#?]+)/);
    if (m) {
      const label = typeof children === "string" ? children : String(children ?? "");
      return <InternalConceptLink slug={m[1]} label={label} />;
    }
    if (/^https?:\/\//.test(h)) {
      return (
        <a href={h} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return <a href={h}>{children}</a>;
  },
};

function MetaCell({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="archron-panel p-4">
      <dt className="text-xs tracking-[0.04em] text-text-secondary">{label}</dt>
      <dd className="mt-1 text-sm leading-snug text-text-heading">{value}</dd>
    </div>
  );
}

// หัวข้อ Header 3 พร้อมไอคอนเส้นในกรอบ accent (สีตาม Cosmology ของหน้าผ่าน --accent)
function SectionH3({
  icon: Icon,
  children,
  className = "",
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`flex items-center gap-3 font-serif text-fluid-h3 text-text-heading ${className}`}>
      <span
        className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border"
        style={{
          color: "var(--accent)",
          borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
          backgroundColor: "color-mix(in srgb, var(--accent) 9%, transparent)",
        }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span>{children}</span>
    </h3>
  );
}

// Meta Card — บริบทของแนวคิด: นักคิด · สำนักคิด · รากแนวคิด · เผยแพร่ · แก้ไข · ผู้เขียน
function MetaCard({ entry, readingTime }: { entry: ContentEntry; readingTime: string }) {
  const rootText =
    entry.roots?.etymology ?? entry.languageRoot ?? entry.roots?.historicalUsage ?? null;
  const accentIcon = { color: "var(--accent)" };

  return (
    <div className="archron-panel relative mt-8 overflow-hidden p-5 sm:p-6">
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: "var(--accent)" }}
        aria-hidden="true"
      />
      <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
        {entry.mainThinkers && entry.mainThinkers.length > 0 ? (
          <div className="sm:col-span-2">
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-text-secondary">
              <span style={accentIcon}><PersonIcon className="h-4 w-4" /></span>
              นักคิดหลัก
            </dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {entry.mainThinkers.map((t) => {
                const thinkerSlug = t.toLowerCase().replace(/\s+/g, "-");
                return (
                  <Link
                    key={t}
                    href={`/thinkers/${thinkerSlug}`}
                    className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-xs text-accent transition-colors hover:bg-accent/20"
                  >
                    {t}
                  </Link>
                );
              })}
            </dd>
          </div>
        ) : null}

        {entry.school || entry.framework ? (
          <div>
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-text-secondary">
              <span style={accentIcon}><SchoolIcon className="h-4 w-4" /></span>
              สำนักคิด
            </dt>
            <dd className="mt-1 text-sm text-text-heading">{entry.school ?? entry.framework}</dd>
          </div>
        ) : null}

        {rootText ? (
          <div>
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-text-secondary">
              <span style={accentIcon}><RootIcon className="h-4 w-4" /></span>
              รากแนวคิด
            </dt>
            <dd className="mt-1 text-sm leading-snug text-text-heading">{rootText}</dd>
          </div>
        ) : null}

        <div>
          <dt className="flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-text-secondary">
            <span style={accentIcon}><AuthorPenIcon className="h-4 w-4" /></span>
            ผู้เขียน
          </dt>
          <dd className="mt-1 text-sm text-text-heading">{entry.author ?? "Archron · Admin"}</dd>
        </div>

        {entry.publishedAt ? (
          <div>
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-text-secondary">
              <span style={accentIcon}><CalendarIcon className="h-4 w-4" /></span>
              เผยแพร่
            </dt>
            <dd className="mt-1 text-sm text-text-heading">{entry.publishedAt}</dd>
          </div>
        ) : null}

        <div>
          <dt className="flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-text-secondary">
            <span style={accentIcon}><ClockIcon className="h-4 w-4" /></span>
            แก้ไขล่าสุด
          </dt>
          <dd className="mt-1 text-sm text-text-heading">
            {entry.updatedAt ? `${entry.updatedAt} · ` : ""}อ่าน ~ {readingTime}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export async function ReadingPage({
  entry,
  section = "concepts",
  atmosphere = "",
}: {
  entry: ContentEntry;
  section?: Section;
  atmosphere?: string;
}) {
  const relatedInline = entry.relatedConcepts.slice(0, MAX_RELATED_INLINE);
  const hasOverflow = entry.relatedConcepts.length > MAX_RELATED_INLINE;

  const subtitleParts = [entry.thaiName, entry.originalTerm, entry.partOfSpeech].filter(Boolean);
  const themes = themesForEntry(entry);

  // ดึงข้อมูล backlinks สำหรับแสดงในหน้านี้โดยตรง
  const allEntries = await getPublicEntries();
  const backlinks = getBacklinksForConcept(entry.slug, allEntries).filter(
    (a) => a.slug !== entry.slug,
  );

  // ลำดับ ก่อนหน้า/ถัดไป ภายในหมวดเดียวกัน (เรียงใหม่→เก่า) — พาผู้อ่านเดินต่อในคลัง ไม่เป็นทางตัน
  const navType = section === "articles" ? "article" : "concept";
  const navPool = allEntries
    .filter((e) => e.contentType === navType)
    .sort(
      (a, b) =>
        (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") ||
        a.title.localeCompare(b.title),
    );
  const navIdx = navPool.findIndex((e) => e.slug === entry.slug);
  const prevEntry = navIdx > 0 ? navPool[navIdx - 1] : null;
  const nextEntry =
    navIdx >= 0 && navIdx < navPool.length - 1 ? navPool[navIdx + 1] : null;

  return (
    <div className={`mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_min(760px,100%)_1fr] lg:gap-8${atmosphere ? ` ${atmosphere}` : ""}`}>
      {/* แถบความคืบหน้าการอ่าน (ทุกจอ) */}
      <ReadingProgress />

      {/* Sticky TOC (เฉพาะ lg+ · ซ่อนบนจอเล็ก · ขึ้นเมื่อมีหัวข้อ >= 3) */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto py-10 pr-2">
          <ReadingToc />
        </div>
      </aside>

      <main id="reading-article" className="relative z-10 w-full max-w-[760px] px-4 sm:px-6 pb-24 pt-10 lg:mx-0 mx-auto">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[600px] -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 0%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 100%)",
          }}
        />
        {/* Breadcrumb + Font Size */}
        <div className="scroll-reveal flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="เส้นทางนำทาง" className="flex flex-wrap items-center gap-1 text-xs text-text-secondary">
            <Link href="/" className="rounded px-2 py-2 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:text-accent focus-visible:outline-none">หน้าแรก</Link>
            <span className="material-symbols-outlined text-[16px] text-text-secondary" aria-hidden="true">chevron_right</span>
            <Link href="/knowledge" className="rounded px-2 py-2 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:text-accent focus-visible:outline-none">คลังความรู้</Link>
            <span className="material-symbols-outlined text-[16px] text-text-secondary" aria-hidden="true">chevron_right</span>
            <Link href={`/${section}`} className="rounded px-2 py-2 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:text-accent focus-visible:outline-none">
              {SECTION_LABEL[section]}
            </Link>
            <span className="material-symbols-outlined text-[16px] text-text-secondary" aria-hidden="true">chevron_right</span>
            <span className="px-2 py-2 text-text-body">{entry.mainTerm ?? entry.title}</span>
          </nav>
          <FontSizeControl />
        </div>

        {/* Header Zone */}
        <header className="scroll-reveal stagger-1 mt-7">
          {/* ชื่อภาษาอังกฤษ (Header 1) */}
          <h1 className="font-serif text-fluid-h2 font-semibold text-text-heading">
            {entry.mainTerm ?? entry.title}
          </h1>

          {/* คำอธิบายแบบกระชับ */}
          {entry.shortDescription ? (
            <p className="mt-4 text-base leading-relaxed text-text-body">{entry.shortDescription}</p>
          ) : null}

          {/* ด้านล่าง: คำแปลไทย/ชื่อไทย — ชนิดคำ — กรอบทฤษฎี — ชื่อเรียกภาษาอื่นๆ */}
          {subtitleParts.length > 0 || entry.ipa || entry.framework ? (
            <p className="mt-3.5 text-xs leading-relaxed text-text-secondary">
              {[
                entry.thaiName ? `ชื่อไทย/แปลไทย: ${entry.thaiName}` : null,
                entry.partOfSpeech ? `ชนิดคำ: ${entry.partOfSpeech}` : null,
                entry.framework ? `กรอบทฤษฎี: ${entry.framework}` : null,
                entry.originalTerm ? `ชื่อเรียกอื่น: ${entry.originalTerm}` : null
              ].filter(Boolean).join(" — ")}
              {entry.ipa ? <span className="text-text-secondary/70"> ({entry.ipa})</span> : null}
            </p>
          ) : null}

          {/* บันทึกไปยังหน้าการอ่าน */}
          <div className="mt-4 flex items-center gap-1.5 text-xs text-accent font-medium">
            <span className="material-symbols-outlined text-[16px]">bookmark_added</span>
            <span>บันทึกไปยังประวัติการอ่านแล้ว (สามารถอ่านต่อได้จากหน้าแรก)</span>
          </div>

          <hr className="mt-6 border-border/20" />

          {themes.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-text-secondary">แก่นเรื่อง:</span>
              {themes.map((t) => (
                <Link
                  key={t.key}
                  href={`/themes/${t.key}`}
                  title={t.description}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition-opacity hover:opacity-80"
                  style={{
                    borderColor: `${t.accent}55`,
                    color: t.accent,
                    backgroundColor: `${t.accent}12`,
                  }}
                >
                  {t.label}
                </Link>
              ))}
            </div>
          ) : null}

        </header>

        {/* Meta Card — บริบทของแนวคิด (นักคิด · สำนัก · ราก · เผยแพร่ · แก้ไข · ผู้เขียน) */}
        <MetaCard entry={entry} readingTime={readTime(entry)} />

        {/* Main Content Zone */}
        {entry.visualExplanation ? (
          <section className="scroll-reveal mt-14">
            {/* คำอธิบายให้เห็นภาพ (Header 3) */}
            <SectionH3 icon={VisualMeaningIcon}>คำอธิบายให้เห็นภาพ</SectionH3>
            <div className="md-body mt-4 whitespace-pre-line">
              <InternalLinkText text={entry.visualExplanation} />
            </div>
          </section>
        ) : null}

        {entry.technicalMeaning ? (
          <section className="scroll-reveal mt-14">
            {/* ความหมายทางวิชาการ / เทคนิค (Header 3) */}
            <SectionH3 icon={ScholarIcon}>ความหมายทางวิชาการ / เทคนิค</SectionH3>
            <div className="md-body mt-4 whitespace-pre-line">
              <InternalLinkText text={entry.technicalMeaning} />
            </div>
          </section>
        ) : null}

        {/* ตัวอย่างในชีวิตจริง อิงจากตำรา (Header 3) — ช่องเนื้อหาใหม่ realWorldExamples */}
        {entry.realWorldExamples ? (
          <section className="scroll-reveal mt-14">
            <SectionH3 icon={RealExampleIcon}>ตัวอย่างในชีวิตจริง (อิงจากตำรา)</SectionH3>
            <div className="md-body mt-4 whitespace-pre-line">
              <InternalLinkText text={entry.realWorldExamples} />
            </div>
          </section>
        ) : null}

        {entry.bodyMarkdown && entry.bodyMarkdown.trim() !== "" ? (
          <section className="scroll-reveal mt-14">
            <div className="md-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {citeify(entry.bodyMarkdown)}
              </ReactMarkdown>
            </div>
          </section>
        ) : null}

        {/* ความเข้าใจผิดที่พบบ่อย (Caution) */}
        {entry.roots?.caution ? (
          <section className="scroll-reveal mt-14 border border-warning/20 bg-warning/5 p-5 rounded-md">
            <h3 className="font-serif text-fluid-h3 text-warning/90 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">warning</span>
              ความเข้าใจผิดที่พบบ่อย / ข้อควรระวัง
            </h3>
            <p className="mt-3 text-base leading-relaxed text-text-body/95">
              {entry.roots.caution}
            </p>
          </section>
        ) : null}

        {entry.roots && (entry.roots.etymology || entry.roots.historicalUsage || entry.roots.meaningShift) ? (
          <section className="scroll-reveal mt-14">
            <SectionH3 icon={RootIcon}>ที่มาของคำและบริบท</SectionH3>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-text-body">
              {entry.roots.etymology ? (
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span><span className="text-text-secondary">รากศัพท์: </span>{entry.roots.etymology}</span>
                </li>
              ) : null}
              {entry.roots.historicalUsage ? (
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span><span className="text-text-secondary">การใช้ในอดีต: </span>{entry.roots.historicalUsage}</span>
                </li>
              ) : null}
              {entry.roots.meaningShift ? (
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span><span className="text-text-secondary">การเปลี่ยนความหมาย: </span>{entry.roots.meaningShift}</span>
                </li>
              ) : null}
            </ul>
          </section>
        ) : null}

        {/* นำมาจากตำราไหน — เอกสารอ้างอิง (Header 3) · ⑦ อยู่ก่อนแนวคิดที่เกี่ยวข้อง */}
        {entry.references.length > 0 ? (
          <section className="scroll-reveal mt-14">
            <SectionH3 icon={SourceRefIcon}>นำมาจากตำราไหน</SectionH3>
            <ol className="mt-5 space-y-3">
              {entry.references.map((s: SourceItem, i) => (
                <li
                  key={i}
                  id={`ref-${i + 1}`}
                  className="reference-item text-sm leading-relaxed text-text-body"
                >
                  <span className="mr-2 text-accent">{i + 1}.</span>
                  <span className="mr-1 text-xs tracking-[0.04em] text-accent/70">
                    [{SOURCE_TYPE_LABEL[s.sourceType] ?? s.sourceType}]
                  </span>
                  <span className="text-text-heading">{[s.author, s.title].filter(Boolean).join(", ")}</span>
                  {s.year ? <span className="text-text-secondary"> ({s.year})</span> : null}
                  {s.relatedClaim ? (
                    <span className="mt-1 block text-text-secondary">รองรับ: {s.relatedClaim}</span>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* Ecosystem & Relations Zone — ⑧ แนวคิดที่เกี่ยวข้อง + แผนที่ความสัมพันธ์ */}
        {entry.relatedConcepts.length > 0 ? (
          <section className="mt-14">
            <SectionH3 icon={ConceptIcon} className="scroll-reveal">แนวคิดที่เกี่ยวข้อง</SectionH3>
            <LocalGraph entry={entry} />
            <ContentCardList
              items={relatedInline.map((rc) => ({
                slug: rc.conceptSlug,
                relationType: rc.relationType,
                reason: rc.reason,
              }))}
              className="mt-5"
            />
            {hasOverflow ? (
              <Link href={`/constellation?focus=${entry.slug}`} className="mt-5 inline-block text-sm text-accent hover:underline">
                ดูแผนที่ความสัมพันธ์ทั้งหมด →
              </Link>
            ) : null}
          </section>
        ) : null}

        {/* CTA — สนับสนุนโครงการ */}
        <aside className="scroll-reveal mt-16 overflow-hidden rounded-md border border-border/30 bg-bg-card/50 p-7 md:p-9">
          <div>
            <span className="text-xs tracking-[0.05em] text-accent">
              สนับสนุน ARCHRON
            </span>
            <h2 className="mt-3 font-serif text-2xl text-text-heading">
              สนับสนุนคลังความรู้ที่คุณกำลังอ่าน
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-text-body">
              ARCHRON เป็นโครงการคลังความรู้อิสระที่ยังเติบโตต่อเนื่อง — ทุกการสนับสนุนช่วยให้เราเขียนและเชื่อมโยงความรู้ได้มากขึ้น
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/support"
                className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-br from-accent to-accent px-6 py-3 text-sm font-semibold text-text-inverse transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                สนับสนุนโครงการ
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link href="/guide" className="text-sm text-accent hover:underline focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:outline-none">
                ใช้บริการ Jungian Type Analysis →
              </Link>
            </div>
          </div>
        </aside>

        {/* สถิติผู้เยี่ยมชมต่อบทความ */}
        <div className="mt-12 flex justify-end">
          <ViewCounter slug={entry.slug} title={entry.title} section={section} />
        </div>

        {/* ระบบความคิดเห็น (island — ครอบ ClerkProvider เฉพาะส่วนนี้) */}
        <ClerkProvider>
          <CommentSection section={section} slug={entry.slug} />
        </ClerkProvider>

        {/* บทความที่ใช้แนวคิดนี้ (Backlinks) — แสดงเฉพาะแนวคิด (concepts) */}
        {section === "concepts" && (
          <section className="scroll-reveal mt-14 border-t border-border/20 pt-10">
            <h3 className="font-serif text-fluid-h3 text-text-heading">บทความที่ใช้แนวคิดนี้</h3>
            {backlinks.length === 0 ? (
              <p className="mt-4 text-sm text-text-secondary">ยังไม่มีบทความอื่นอ้างถึงแนวคิดนี้</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {backlinks.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/articles/${a.slug}`}
                      className="text-base text-text-body transition-colors hover:text-accent"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* ⑬ แถบนำทาง ก่อนหน้า / กลับหน้าหลัก / ถัดไป (สลับตามหมวด บทความ/แนวคิด) */}
        <nav
          aria-label="นำทางระหว่างเนื้อหา"
          className="mt-16 grid grid-cols-1 items-center gap-4 border-t border-border/20 pt-8 text-sm sm:grid-cols-3 sm:gap-3"
        >
          <div className="justify-self-start">
            {prevEntry ? (
              <Link href={`/${section}/${prevEntry.slug}`} className="group inline-flex flex-col gap-0.5">
                <span className="flex items-center gap-1 text-xs uppercase tracking-wide text-text-secondary">
                  <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" /> ก่อนหน้า
                </span>
                <span className="font-serif text-text-body transition-colors group-hover:text-accent">
                  {prevEntry.mainTerm ?? prevEntry.title}
                </span>
              </Link>
            ) : null}
          </div>
          <div className="justify-self-center text-center">
            <Link href={`/${section}`} className="text-text-secondary transition-colors hover:text-accent">
              กลับหน้าหลัก
            </Link>
          </div>
          <div className="justify-self-end text-right">
            {nextEntry ? (
              <Link href={`/${section}/${nextEntry.slug}`} className="group inline-flex flex-col gap-0.5">
                <span className="flex items-center justify-end gap-1 text-xs uppercase tracking-wide text-text-secondary">
                  ถัดไป <ArrowRightIcon className="h-3.5 w-3.5" />
                </span>
                <span className="font-serif text-text-body transition-colors group-hover:text-accent">
                  {nextEntry.mainTerm ?? nextEntry.title}
                </span>
              </Link>
            ) : null}
          </div>
        </nav>

        {/* ตัวติดตาม "อ่านจบ" อัตโนมัติ — sentinel ล่องหนท้ายเนื้อหา + dwell timer
            เมื่อเลื่อนถึงจุดนี้และค้างหน้าครบเวลา → บันทึก reading_progress (ผู้ล็อกอินเท่านั้น) */}
        <ReadCompletionTracker slug={entry.slug} contentType={entry.contentType} />
      </main>

      {/* spacer คอลัมน์ขวา — รักษาบทความให้อยู่กึ่งกลาง grid (บน lg) และแสดง Mini-Graph (บน xl) */}
      <div className="hidden lg:block xl:hidden" aria-hidden="true" />

      {/* ข้อมูลเสริมคอลัมน์ขวา (Sticky Mini-Graph & Quick Nav สำหรับจอ Ultra-wide xl >= 1280px) */}
      <aside className="hidden xl:block">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto py-10 pl-2 space-y-6">
          {entry.relatedConcepts.length > 0 ? (
            <div className="archron-panel p-5">
              <h4 className="flex items-center gap-2 font-serif text-base font-semibold text-text-heading">
                <span className="material-symbols-outlined text-[18px] text-accent">hub</span>
                แผนที่ความเชื่อมโยง
              </h4>
              <p className="mt-1.5 text-xs text-text-secondary">เชื่อมโยงกับ {entry.relatedConcepts.length} แนวคิดในคลัง</p>
              <div className="mt-4 space-y-2.5">
                {entry.relatedConcepts.slice(0, 5).map((rc) => (
                  <Link
                    key={rc.conceptSlug}
                    href={`/concepts/${rc.conceptSlug}`}
                    className="block rounded-md border border-border/30 bg-bg-card/60 p-2.5 text-xs text-text-body hover:border-accent/40 hover:bg-bg-card hover:text-accent transition-colors"
                  >
                    <div className="font-serif font-medium text-text-heading">{conceptTitle(rc.conceptSlug)}</div>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-accent/90">
                      <span>{RELATION_LABEL[rc.relationType]}</span>
                      <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href={`/constellation?focus=${entry.slug}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
              >
                <span className="material-symbols-outlined text-[16px]">explore</span>
                เปิด Constellation Map
              </Link>
            </div>
          ) : null}

          {backlinks.length > 0 ? (
            <div className="archron-panel p-5">
              <h4 className="flex items-center gap-2 font-serif text-base font-semibold text-text-heading">
                <span className="material-symbols-outlined text-[18px] text-accent">link</span>
                อ้างถึงในบทความ ({backlinks.length})
              </h4>
              <ul className="mt-3 space-y-2 text-xs">
                {backlinks.slice(0, 5).map((a) => (
                  <li key={a.slug}>
                    <Link href={`/articles/${a.slug}`} className="block truncate text-text-body hover:text-accent transition-colors">
                      • {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </aside>

      {/* แถบเครื่องมือหน้าอ่าน (desktop) */}
      <ReadingDock slug={entry.slug} />
    </div>
  );
}
