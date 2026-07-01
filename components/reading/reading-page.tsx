// หน้าอ่าน Unified (articles/concepts) — ใช้ ReadingToc + ReadingDock (ดูไฟล์ในโฟลเดอร์เดียวกัน)
import type { ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ContentEntry, RelationType, SourceItem, Difficulty } from "@/types/content";
import { InternalLinkText } from "@/components/reading/internal-link-text";
import { InternalConceptLink } from "@/components/reading/internal-concept-link";
import { conceptTitle } from "@/lib/content/concept-registry";
import { Tooltip } from "@/components/tooltip";
import { ClerkProvider } from "@clerk/nextjs";
import { ReadingToc } from "@/components/reading/reading-toc";
import { ReadingDock } from "@/components/reading/reading-dock";
import { ReadingProgress } from "@/components/reading/reading-progress";
import { ViewCounter } from "@/components/reading/view-counter";
import { CommentSection } from "@/components/reading/comment-section";
import { LocalGraph } from "@/components/reading/local-graph";
import { themesForEntry } from "@/lib/content/themes";
import { getPublicEntries } from "@/lib/content/public-source";
import { getBacklinksForConcept } from "@/lib/content/related";

type Section = "articles" | "concepts";

const SECTION_LABEL: Record<Section, string> = {
  articles: "บทความ",
  concepts: "คลังแนวคิด",
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

// ปลายทางปุ่ม CTA "สำรวจประเภททางจิตวิทยา" → หน้าบริการ Jungian Type Analysis
const GUIDE_CTA_HREF = "/guide";

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
      <dt className="text-[11px] tracking-[0.04em] text-muted">{label}</dt>
      <dd className="mt-1 text-sm leading-snug text-ivory">{value}</dd>
    </div>
  );
}

export async function ReadingPage({
  entry,
  section = "concepts",
}: {
  entry: ContentEntry;
  section?: Section;
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

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 xl:grid-cols-[1fr_42rem_1fr] xl:gap-8">
      {/* แถบความคืบหน้าการอ่าน (ทุกจอ) */}
      <ReadingProgress />

      {/* Sticky TOC (เฉพาะ xl+ · ซ่อนบนจอเล็ก · ขึ้นเมื่อมีหัวข้อ >= 3) */}
      <aside className="hidden xl:block">
        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto py-10 pr-2">
          <ReadingToc />
        </div>
      </aside>

      <main id="reading-article" className="w-full max-w-2xl px-6 pb-24 pt-10 xl:mx-0 mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="เส้นทางนำทาง" className="scroll-reveal flex flex-wrap items-center gap-1 text-xs text-muted">
          <Link href="/" className="rounded px-2 py-1.5 transition-colors hover:text-soft-gold focus-visible:ring-1 focus-visible:ring-burnished-gold/60 focus-visible:text-soft-gold focus-visible:outline-none">หน้าแรก</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle" aria-hidden="true">chevron_right</span>
          <Link href={`/${section}`} className="rounded px-2 py-1.5 transition-colors hover:text-soft-gold focus-visible:ring-1 focus-visible:ring-burnished-gold/60 focus-visible:text-soft-gold focus-visible:outline-none">
            {SECTION_LABEL[section]}
          </Link>
          <span className="material-symbols-outlined text-[16px] text-subtle" aria-hidden="true">chevron_right</span>
          <span className="px-2 py-1.5 text-soft-ivory">{entry.mainTerm ?? entry.title}</span>
        </nav>

        {/* Header Zone */}
        <header className="scroll-reveal stagger-1 mt-7">
          {/* ชื่อภาษาอังกฤษ (Header 1) */}
          <h1 className="font-serif text-fluid-h2 font-semibold text-ivory">
            {entry.mainTerm ?? entry.title}
          </h1>

          {/* คำอธิบายแบบกระชับ */}
          {entry.shortDescription ? (
            <p className="mt-4 text-base leading-relaxed text-soft-ivory">{entry.shortDescription}</p>
          ) : null}

          {/* ด้านล่าง: คำแปลไทย/ชื่อไทย — ชนิดคำ — กรอบทฤษฎี — ชื่อเรียกภาษาอื่นๆ */}
          {subtitleParts.length > 0 || entry.ipa || entry.framework ? (
            <p className="mt-3.5 text-xs leading-relaxed text-muted">
              {[
                entry.thaiName ? `ชื่อไทย/แปลไทย: ${entry.thaiName}` : null,
                entry.partOfSpeech ? `ชนิดคำ: ${entry.partOfSpeech}` : null,
                entry.framework ? `กรอบทฤษฎี: ${entry.framework}` : null,
                entry.originalTerm ? `ชื่อเรียกอื่น: ${entry.originalTerm}` : null
              ].filter(Boolean).join(" — ")}
              {entry.ipa ? <span className="text-on-surface-variant/70"> ({entry.ipa})</span> : null}
            </p>
          ) : null}

          {/* บันทึกไปยังหน้าการอ่าน */}
          <div className="mt-4 flex items-center gap-1.5 text-xs text-soft-gold font-medium">
            <span className="material-symbols-outlined text-[16px]">bookmark_added</span>
            <span>บันทึกไปยังประวัติการอ่านแล้ว (สามารถอ่านต่อได้จากหน้าแรก)</span>
          </div>

          <hr className="mt-6 border-slate-boundary/20" />

          {entry.updatedAt || entry.author ? (
            <div className="mt-3 flex items-center gap-4 text-xs text-subtle">
              {entry.updatedAt ? <span>อัปเดตล่าสุด {entry.updatedAt}</span> : null}
              {entry.author ? <span>เขียนโดย {entry.author}</span> : null}
              <span>เวลาอ่าน ~ {readTime(entry)}</span>
            </div>
          ) : null}

          {themes.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">แก่นเรื่อง:</span>
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

          {entry.mainThinkers && entry.mainThinkers.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted">นักคิดที่เกี่ยวข้อง:</span>
              {entry.mainThinkers.map((t) => {
                const thinkerSlug = t.toLowerCase().replace(/\s+/g, "-");
                return (
                  <Link
                    key={t}
                    href={`/thinkers/${thinkerSlug}`}
                    className="inline-flex items-center gap-1 rounded bg-burnished-gold/10 border border-burnished-gold/25 px-2.5 py-0.5 text-xs text-burnished-gold transition-colors hover:bg-burnished-gold/20"
                  >
                    <span className="material-symbols-outlined text-[14px]">person</span>
                    {t}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </header>

        {/* Main Content Zone */}
        {entry.visualExplanation ? (
          <section className="scroll-reveal mt-12">
            {/* คำอธิบายให้เห็นภาพ (Header 3) */}
            <h3 className="font-serif text-fluid-h3 text-ivory">คำอธิบายให้เห็นภาพ</h3>
            <div className="md-body mt-4 whitespace-pre-line">
              <InternalLinkText text={entry.visualExplanation} />
            </div>
          </section>
        ) : null}

        {entry.technicalMeaning ? (
          <section className="scroll-reveal mt-12">
            {/* ความหมายทางวิชาการ / เทคนิค (Header 3) */}
            <h3 className="font-serif text-fluid-h3 text-ivory">ความหมายทางวิชาการ / เทคนิค</h3>
            <div className="md-body mt-4 whitespace-pre-line">
              <InternalLinkText text={entry.technicalMeaning} />
            </div>
          </section>
        ) : null}

        {entry.bodyMarkdown && entry.bodyMarkdown.trim() !== "" ? (
          <section className="scroll-reveal mt-12">
            <div className="md-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {citeify(entry.bodyMarkdown)}
              </ReactMarkdown>
            </div>
          </section>
        ) : null}

        {/* ความเข้าใจผิดที่พบบ่อย (Caution) */}
        {entry.roots?.caution ? (
          <section className="scroll-reveal mt-12 border border-warning/20 bg-warning/5 p-5 rounded-md">
            <h3 className="font-serif text-fluid-h3 text-warning/90 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">warning</span>
              ความเข้าใจผิดที่พบบ่อย / ข้อควรระวัง
            </h3>
            <p className="mt-3 text-base leading-relaxed text-soft-ivory/95">
              {entry.roots.caution}
            </p>
          </section>
        ) : null}

        {entry.roots && (entry.roots.etymology || entry.roots.historicalUsage || entry.roots.meaningShift) ? (
          <section className="scroll-reveal mt-12">
            <h3 className="font-serif text-fluid-h3 text-ivory">ที่มาของคำและบริบท</h3>
            <ul className="mt-4 space-y-3 text-base leading-relaxed text-soft-ivory">
              {entry.roots.etymology ? (
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-antique-gold" aria-hidden="true" />
                  <span><span className="text-muted">รากศัพท์: </span>{entry.roots.etymology}</span>
                </li>
              ) : null}
              {entry.roots.historicalUsage ? (
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-antique-gold" aria-hidden="true" />
                  <span><span className="text-muted">การใช้ในอดีต: </span>{entry.roots.historicalUsage}</span>
                </li>
              ) : null}
              {entry.roots.meaningShift ? (
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-antique-gold" aria-hidden="true" />
                  <span><span className="text-muted">การเปลี่ยนความหมาย: </span>{entry.roots.meaningShift}</span>
                </li>
              ) : null}
            </ul>
          </section>
        ) : null}

        {/* Ecosystem & Relations Zone */}
        {entry.relatedConcepts.length > 0 ? (
          <section className="mt-14">
            {/* แนวคิดที่เกี่ยวข้อง (Header 3) */}
            <h3 className="scroll-reveal font-serif text-fluid-h3 text-ivory">แนวคิดที่เกี่ยวข้อง</h3>
            <LocalGraph entry={entry} />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedInline.map((rc, i) => (
                <Link
                  key={rc.conceptSlug}
                  href={`/concepts/${rc.conceptSlug}`}
                  className={`archron-card scroll-reveal stagger-${i + 1} group flex flex-col p-5`}
                >
                  <span className="font-serif text-lg text-ivory group-hover:text-soft-gold">
                    {conceptTitle(rc.conceptSlug)}
                  </span>
                  <span className="mt-2 inline-block w-fit rounded-full border border-antique-gold/30 px-2.5 py-0.5 text-[11px] text-antique-gold">
                    {RELATION_LABEL[rc.relationType]}
                  </span>
                  {rc.reason ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted">{rc.reason}</p>
                  ) : null}
                </Link>
              ))}
            </div>
            {hasOverflow ? (
              <Link href={`/constellation?focus=${entry.slug}`} className="mt-5 inline-block text-sm text-soft-gold hover:underline">
                ดูแผนที่ความสัมพันธ์ทั้งหมด →
              </Link>
            ) : null}
          </section>
        ) : null}

        {/* Footer Zone — References */}
        {entry.references.length > 0 ? (
          <section className="scroll-reveal mt-14">
            {/* เอกสารอ้างอิง (Header 3) */}
            <h3 className="font-serif text-fluid-h3 text-ivory">เอกสารอ้างอิง</h3>
            <ol className="mt-5 space-y-3">
              {entry.references.map((s: SourceItem, i) => (
                <li
                  key={i}
                  id={`ref-${i + 1}`}
                  className="reference-item text-sm leading-relaxed text-soft-ivory"
                >
                  <span className="mr-2 text-antique-gold">{i + 1}.</span>
                  <span className="mr-1 text-xs tracking-[0.04em] text-antique-gold/70">
                    [{SOURCE_TYPE_LABEL[s.sourceType] ?? s.sourceType}]
                  </span>
                  <span className="text-ivory">{[s.author, s.title].filter(Boolean).join(", ")}</span>
                  {s.year ? <span className="text-muted"> ({s.year})</span> : null}
                  {s.relatedClaim ? (
                    <span className="mt-1 block text-muted">รองรับ: {s.relatedClaim}</span>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {/* CTA — guide การเข้าใจตัวตน */}
        <aside className="scroll-reveal mt-16 overflow-hidden rounded-md border border-antique-gold/30 bg-surface-1/50 p-7 md:p-9">
          <div>
            <span className="text-xs tracking-[0.05em] text-antique-gold">
              Psychological Types · การอ่านตัวตน
            </span>
            <h2 className="mt-3 font-serif text-2xl text-ivory">
              ทำความเข้าใจแนวโน้มทางจิตของคุณ ผ่านกรอบ Psychological Types
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-soft-ivory">
              บริการอ่านและให้คำแนะนำเชิงลึก โดยใช้ทฤษฎีประเภททางจิตวิทยา (Psychological Types)
              ของ C. G. Jung เป็นกรอบในการ guide การเข้าใจตัวตน — อ่าน “แนวโน้ม”
              อย่างมีบริบท ไม่ใช่ตัดสินด้วยป้ายประเภทสำเร็จรูป และแยกการตีความออกจากข้อเท็จจริงตามแนวทางของคลังความรู้นี้
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href={GUIDE_CTA_HREF}
                className="inline-flex items-center gap-2 rounded-sm bg-gradient-to-br from-antique-gold to-soft-gold px-6 py-3 text-sm font-semibold text-prima transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none"
              >
                เริ่มสำรวจประเภททางจิตวิทยาของคุณ
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link href="/articles" className="text-sm text-soft-gold hover:underline focus-visible:ring-1 focus-visible:ring-burnished-gold/60 focus-visible:outline-none">
                อ่านบทความที่เกี่ยวข้อง →
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
          <section className="scroll-reveal mt-14 border-t border-slate-boundary/20 pt-10">
            <h3 className="font-serif text-fluid-h3 text-ivory">บทความที่ใช้แนวคิดนี้</h3>
            {backlinks.length === 0 ? (
              <p className="mt-4 text-sm text-muted">ยังไม่มีบทความอื่นอ้างถึงแนวคิดนี้</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {backlinks.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/articles/${a.slug}`}
                      className="text-base text-soft-ivory transition-colors hover:text-soft-gold"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {section === "concepts" && (
          <div className="mt-8">
            <Link href="/concepts" className="text-sm text-soft-gold hover:underline">
              ← กลับคลังแนวคิดทั้งหมด
            </Link>
          </div>
        )}
      </main>

      {/* spacer คอลัมน์ขวา — รักษาบทความให้อยู่กึ่งกลาง grid */}
      <div className="hidden xl:block" aria-hidden="true" />

      {/* แถบเครื่องมือหน้าอ่าน (desktop) */}
      <ReadingDock slug={entry.slug} />
    </div>
  );
}
