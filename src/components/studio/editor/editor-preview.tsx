"use client";

import type { ReactNode, ComponentType } from "react";
import {
  VisualMeaningIcon,
  ScholarIcon,
  SourceRefIcon,
  RootIcon,
  AuthorPenIcon,
  CalendarIcon,
  ClockIcon,
  SchoolIcon,
} from "@/components/icons";
import { InternalLinkText } from "@/components/reading/internal-link-text";
import { SemanticMdxEngine as MarkdownRenderer } from "@/components/reading/semantic-mdx-engine";
import type { EditorDraft } from "@/lib/content/publishing/publish-validation";

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "ผู้เริ่มต้น",
  intermediate: "ระดับกลาง",
  advanced: "อ่านลึก",
  "source-note": "บันทึกอ้างอิง",
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

const CT_LABEL: Record<string, string> = {
  article: "บทความ",
  concept: "แนวคิด",
  person: "นักปราชญ์",
  book: "หนังสือ",
  symbol: "สัญลักษณ์",
  term: "ศัพท์",
  "reading-set": "ชุดการอ่าน",
  "source-note": "บันทึกอ้างอิง",
};

function readTime(draft: EditorDraft): string {
  const chars =
    (draft.visualExplanation ?? "").length +
    (draft.technicalMeaning ?? "").length +
    (draft.bodyMarkdown ?? "").length;
  return `${Math.max(1, Math.round(chars / 400))} นาที`;
}

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
    <h2 className={`flex items-center gap-3 font-serif text-fluid-h3 text-text-heading ${className}`}>
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
    </h2>
  );
}

export function EditorPreview({
  draft,
  displayName,
}: {
  draft: EditorDraft;
  displayName?: string;
}) {
  const subtitleParts = [draft.thaiName, draft.originalTerm, draft.partOfSpeech].filter(Boolean);
  const authorName = displayName?.trim() || "Archron · Admin";
  const accentIcon = { color: "var(--accent)" };
  const hasRefs = draft.references.length > 0;
  const hasRoots = draft.rootsEtymology.trim() !== "" || draft.rootsMeaningShift.trim() !== "";
  const hasRelated = draft.relatedConcepts.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-24 pt-10">
      {/* Breadcrumb (static for preview) */}
      <nav aria-label="เส้นทางนำทาง" className="flex flex-wrap items-center gap-1 text-xs text-text-secondary">
        <span className="px-2 py-2">หน้าแรก</span>
        <span className="text-text-secondary/50">›</span>
        <span className="px-2 py-2">คลังความรู้</span>
        <span className="text-text-secondary/50">›</span>
        <span className="px-2 py-2">
          {CT_LABEL[draft.contentType] ?? draft.contentType}
        </span>
        <span className="text-text-secondary/50">›</span>
        <span className="px-2 py-2 text-text-body">{draft.mainTerm || draft.title || "(ยังไม่มีชื่อ)"}</span>
      </nav>

      {/* Header Zone */}
      <header className="mt-7">
        <h1 className="font-serif text-fluid-h2 font-semibold text-text-heading break-words">
          {draft.mainTerm || draft.title || "(ยังไม่มีชื่อ)"}
        </h1>

        {draft.mainTerm && draft.title && draft.mainTerm !== draft.title ? (
          <p className="mt-1 text-sm text-text-secondary">{draft.title}</p>
        ) : null}

        {draft.shortDescription ? (
          <p className="mt-4 text-base leading-relaxed text-text-body">{draft.shortDescription}</p>
        ) : null}

        {subtitleParts.length > 0 || draft.ipa || draft.framework ? (
          <p className="mt-3.5 text-xs leading-relaxed text-text-secondary">
            {[
              draft.thaiName ? `ชื่อไทย/แปลไทย: ${draft.thaiName}` : null,
              draft.partOfSpeech ? `ชนิดคำ: ${draft.partOfSpeech}` : null,
              draft.framework ? `กรอบทฤษฎี: ${draft.framework}` : null,
              draft.originalTerm ? `ชื่อเรียกอื่น: ${draft.originalTerm}` : null,
            ]
              .filter(Boolean)
              .join(" — ")}
            {draft.ipa ? <span className="text-text-secondary/70"> ({draft.ipa})</span> : null}
          </p>
        ) : null}

        <div className="mt-4 flex items-center gap-1.5 text-xs text-accent font-medium">
          <span className="inline-flex items-center justify-center w-4 h-4" aria-hidden="true">🔖</span>
          <span>พรีวิวเนื้อหา — หน้าตัวอย่างขณะเขียน</span>
        </div>

        <hr className="mt-6 border-border/20" />
      </header>

      {/* MetaCard */}
      <div className="archron-panel relative mt-8 overflow-hidden p-5 sm:p-6 border-t-2"
        style={{ borderTopColor: "var(--accent)" }}
      >
        <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          {draft.difficulty ? (
            <div className="archron-panel p-4">
              <dt className="text-xs tracking-[0.04em] text-text-secondary">ระดับความยาก</dt>
              <dd className="mt-1 text-sm leading-snug text-text-heading">
                {DIFFICULTY_LABEL[draft.difficulty] ?? draft.difficulty}
              </dd>
            </div>
          ) : null}

          {draft.school || draft.framework ? (
            <div className="archron-panel p-4">
              <dt className="flex items-center gap-1.5 text-sm font-medium text-text-secondary/80">
                <span style={accentIcon}><SchoolIcon className="h-4 w-4" /></span>
                สำนักคิด / กรอบทฤษฎี
              </dt>
              <dd className="mt-1 text-sm text-text-heading">{draft.school || draft.framework}</dd>
            </div>
          ) : (
            <div className="hidden sm:block" aria-hidden="true" />
          )}

          {draft.languageRoot ? (
            <div className="archron-panel p-4">
              <dt className="text-xs tracking-[0.04em] text-text-secondary">รากภาษา</dt>
              <dd className="mt-1 text-sm leading-snug text-text-heading">{draft.languageRoot}</dd>
            </div>
          ) : null}

          <div className="archron-panel p-4">
            <dt className="flex items-center gap-1.5 text-sm font-medium text-text-secondary/80">
              <span style={accentIcon}><AuthorPenIcon className="h-4 w-4" /></span>
              ผู้เขียน
            </dt>
            <dd className="mt-1 text-sm text-text-heading">{authorName}</dd>
          </div>

          <div className="archron-panel p-4">
            <dt className="flex items-center gap-1.5 text-sm font-medium text-text-secondary/80">
              <span style={accentIcon}><CalendarIcon className="h-4 w-4" /></span>
              สถานะ
            </dt>
            <dd className="mt-1 text-sm text-text-heading">
              {draft.status === "published" ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
            </dd>
          </div>

          <div className="archron-panel p-4">
            <dt className="flex items-center gap-1.5 text-sm font-medium text-text-secondary/80">
              <span style={accentIcon}><ClockIcon className="h-4 w-4" /></span>
              เวลาอ่านโดยประมาณ
            </dt>
            <dd className="mt-1 text-sm text-text-heading">~ {readTime(draft)}</dd>
          </div>
        </dl>
      </div>

      {/* visualExplanation */}
      {draft.visualExplanation ? (
        <section className="mt-14">
          <SectionH3 icon={VisualMeaningIcon}>คำอธิบายให้เห็นภาพ</SectionH3>
          <div className="md-body mt-4 whitespace-pre-line">
            <InternalLinkText text={draft.visualExplanation} />
          </div>
        </section>
      ) : null}

      {/* technicalMeaning */}
      {draft.technicalMeaning ? (
        <section className="mt-14">
          <SectionH3 icon={ScholarIcon}>ความหมายทางวิชาการ / เทคนิค</SectionH3>
          <div className="md-body mt-4 whitespace-pre-line">
            <InternalLinkText text={draft.technicalMeaning} />
          </div>
        </section>
      ) : null}

      {/* bodyMarkdown */}
      {draft.bodyMarkdown && draft.bodyMarkdown.trim() !== "" ? (
        <section className="mt-14">
          <MarkdownRenderer content={draft.bodyMarkdown} />
        </section>
      ) : null}

      {/* Caution */}
      {draft.rootsCaution ? (
        <section className="mt-14 border border-warning/20 bg-warning/5 p-5 rounded-md">
          <h3 className="font-serif text-fluid-h3 text-warning/90 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 text-[20px]" aria-hidden="true">⚠</span>
            ความเข้าใจผิดที่พบบ่อย / ข้อควรระวัง
          </h3>
          <p className="mt-3 text-base leading-relaxed text-text-body/95">
            {draft.rootsCaution}
          </p>
        </section>
      ) : null}

      {/* Roots */}
      {hasRoots ? (
        <section className="mt-14">
          <SectionH3 icon={RootIcon}>ที่มาของคำและบริบท</SectionH3>
          <ul className="mt-4 space-y-3 text-base leading-relaxed text-text-body">
            {draft.rootsEtymology ? (
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span><span className="text-text-secondary">รากศัพท์: </span>{draft.rootsEtymology}</span>
              </li>
            ) : null}
            {draft.rootsMeaningShift ? (
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span><span className="text-text-secondary">การเปลี่ยนความหมาย: </span>{draft.rootsMeaningShift}</span>
              </li>
            ) : null}
          </ul>
        </section>
      ) : null}

      {/* References */}
      {hasRefs ? (
        <section className="mt-14">
          <SectionH3 icon={SourceRefIcon}>นำมาจากตำราไหน</SectionH3>
          <ol className="mt-5 space-y-3">
            {draft.references.map((ref, i) => (
              <li key={i} id={`ref-${i + 1}`} className="reference-item text-sm leading-relaxed text-text-body">
                <span className="mr-2 text-accent">{i + 1}.</span>
                <span className="mr-1 text-xs tracking-[0.04em] text-accent/70">
                  [{SOURCE_TYPE_LABEL[ref.sourceType] ?? ref.sourceType}]
                </span>
                <span className="text-text-heading">{ref.title}</span>
                {ref.relatedClaim ? (
                  <span className="mt-1 block text-text-secondary">รองรับ: {ref.relatedClaim}</span>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* Related Concepts (simple list — no LocalGraph in preview) */}
      {hasRelated ? (
        <section className="mt-14">
          <h2 className="flex items-center gap-3 font-serif text-fluid-h3 text-text-heading">
            <span
              className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border"
              style={{
                color: "var(--accent)",
                borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--accent) 9%, transparent)",
              }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </span>
            <span>แนวคิดที่เกี่ยวข้อง</span>
          </h2>
          <ul className="mt-5 space-y-2">
            {draft.relatedConcepts.map((rc) => (
              <li key={rc.conceptSlug} className="flex items-start gap-2 text-sm text-text-body">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span>
                  <span className="font-medium text-text-heading">{rc.conceptSlug}</span>
                  {rc.relationType ? (
                    <span className="text-text-secondary"> · {rc.relationType}</span>
                  ) : null}
                  {rc.reason ? (
                    <span className="text-text-secondary"> — {rc.reason}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* CT-specific preview sections */}
      {draft.contentType === "person" ? (
        <section className="mt-14">
          <SectionH3 icon={ScholarIcon}>ข้อมูลนักปราชญ์</SectionH3>
          <div className="archron-panel mt-4 p-5 space-y-3 text-sm text-text-body">
            {draft.mainThinker ? (
              <div>
                <span className="text-text-secondary">ชื่อ: </span>
                <span className="text-text-heading">{draft.mainThinker}</span>
              </div>
            ) : null}
            {draft.nationality ? (
              <div>
                <span className="text-text-secondary">สัญชาติ: </span>
                <span>{draft.nationality}</span>
              </div>
            ) : null}
            {draft.bornYear || draft.diedYear ? (
              <div>
                <span className="text-text-secondary">ปี: </span>
                <span>{draft.bornYear}{draft.diedYear ? ` — ${draft.diedYear}` : ""}</span>
              </div>
            ) : null}
            {draft.keyIdeas ? (
              <div>
                <span className="text-text-secondary">แนวคิดสำคัญ: </span>
                <span>{draft.keyIdeas}</span>
              </div>
            ) : null}
            {draft.notableWorks ? (
              <div>
                <span className="text-text-secondary">ผลงานเด่น: </span>
                <span>{draft.notableWorks}</span>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {draft.contentType === "book" ? (
        <section className="mt-14">
          <SectionH3 icon={ScholarIcon}>ข้อมูลหนังสือ</SectionH3>
          <div className="archron-panel mt-4 p-5 space-y-3 text-sm text-text-body">
            {draft.publicationYear ? (
              <div>
                <span className="text-text-secondary">ปีที่พิมพ์: </span>
                <span>{draft.publicationYear}</span>
              </div>
            ) : null}
            {draft.publisher ? (
              <div>
                <span className="text-text-secondary">สำนักพิมพ์: </span>
                <span>{draft.publisher}</span>
              </div>
            ) : null}
            {draft.isbn ? (
              <div>
                <span className="text-text-secondary">ISBN: </span>
                <span>{draft.isbn}</span>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Empty state — nothing to preview */}
      {!draft.title && !draft.mainTerm && !draft.shortDescription &&
       !draft.visualExplanation && !draft.technicalMeaning &&
       !draft.bodyMarkdown && !hasRefs && !hasRoots && !hasRelated ? (
        <section className="mt-20 text-center">
          <p className="text-lg text-text-secondary">ยังไม่มีเนื้อหาสำหรับพรีวิว</p>
          <p className="mt-2 text-sm text-text-secondary/70">
            ลองเพิ่ม Title, คำอธิบาย, หรือเนื้อหาในโหมดแก้ไข แล้วกลับมาดูพรีวิวอีกครั้ง
          </p>
        </section>
      ) : null}
    </div>
  );
}
