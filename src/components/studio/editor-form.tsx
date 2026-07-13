"use client";

import { EditorIcon } from "@/components/studio/editor-icon";
import { SectionIndicator } from "@/components/studio/section-indicator";
import { SearchableSelect } from "@/components/studio/searchable-select";
import { SearchableMultiSelect } from "@/components/studio/searchable-multi-select";
import { RelatedConceptPicker } from "@/components/studio/related-concept-picker";
import { ImagePicker } from "@/components/studio/image-picker";
import { MarkdownRenderer } from "@/components/reading/markdown-renderer";
import {
  contentTypeMeta, statusMeta, difficultyMeta,
  sourceTypeMeta, frameworkMeta,
} from "@/lib/content/cosmology";
import { slugify, type EditorDraft, type EditorReference } from "@/lib/content/publish-validation";
import { SCHOOLS } from "@/lib/content/schools";
import { THEME_TAG_SUGGESTIONS } from "@/lib/content/themes";

const CONTENT_TYPES = [
  "article", "concept", "reading-set", "source-note",
  "person", "book", "school", "symbol", "term",
];
const STATUSES = [
  "draft", "needs-source-check", "ready-to-publish", "published", "archived",
];
const FRAMEWORKS = [
  "Analytical Psychology", "Depth Psychology", "Psychoanalysis", "Philosophy",
  "Existentialism", "Phenomenology", "Symbol / Myth", "Comparative Thought",
  "Editorial Interpretation",
];
const DIFFICULTIES = ["beginner", "intermediate", "advanced", "source-note"];
const SOURCE_TYPES = [
  "primary-source", "secondary-source", "commentary",
  "editorial-interpretation", "website", "dictionary-lexicon", "other",
];
const BASE_TAG_OPTIONS = [
  "jung", "freud", "lacan", "concept", "ego", "shadow", "persona", "self",
  "archetype", "unconscious", "collective-unconscious", "individuation",
  "complex", "projection", "symbol", "myth", "philosophy", "psychoanalysis",
  "depth-psychology", "source-note", "beginner", "intermediate", "advanced",
];
const TAG_OPTIONS = Array.from(new Set([...BASE_TAG_OPTIONS, ...THEME_TAG_SUGGESTIONS]));

const THINKER_OPTIONS = SCHOOLS.flatMap((s) =>
  s.thinkers.map((t) => ({ value: t.nameEn, label: `${t.nameTh} (${t.nameEn})` }))
);
const SCHOOL_OPTIONS = SCHOOLS.map((s) => ({
  value: s.id, label: `${s.nameTh} (${s.nameEn})`,
}));

function thinkerMeta() { return { icon: "person", accent: "var(--color-accent)" }; }
function schoolMeta() { return { icon: "groups_2", accent: "var(--color-accent)" }; }

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-text-body">{children}</label>;
}

const inputClass =
  "w-full rounded-md border border-text-heading/20 bg-text-heading/25 px-3 py-2 text-text-heading outline-none placeholder:text-text-secondary focus:border-accent/50 focus:ring-2 focus:ring-accent/30 transition-colors";

const textareaClass = `${inputClass} resize-y`;

type Props = {
  draft: EditorDraft;
  onChange: <K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) => void;
  show: Record<string, boolean>;
  preview: boolean;
  newRef: EditorReference;
  setNewRef: (r: EditorReference) => void;
  onAddRef: () => void;
  onRemoveRef: (i: number) => void;
  activeSection: string;
  onSectionClick: (id: string) => void;
};

export function EditorForm({
  draft, onChange, show, preview,
  newRef, setNewRef, onAddRef, onRemoveRef, activeSection, onSectionClick,
}: Props) {
  const typeMeta = contentTypeMeta(draft.contentType);

  const sections = [
    { id: "basic", label: "ข้อมูลพื้นฐาน", visible: true },
    { id: "framework", label: "กรอบทฤษฎี", visible: show.framework },
    { id: "content", label: "เนื้อหา", visible: true },
    { id: "cover", label: "ภาพปก", visible: show.coverImage },
    { id: "related", label: "แนวคิดที่เกี่ยวข้อง", visible: show.relatedConcepts },
    { id: "references", label: "เอกสารอ้างอิง", visible: true },
    { id: "roots", label: "Roots", visible: show.roots },
  ];

  return (
    <main className="space-y-10">
      <SectionIndicator sections={sections} activeSection={activeSection} onSectionClick={onSectionClick} />

      <section id="basic" className="space-y-4" data-section="basic">
        <h2 className="font-serif text-xl text-text-heading">ข้อมูลพื้นฐาน</h2>
        <div>
          <Label htmlFor="entry-title">Title</Label>
          <input id="entry-title" className={inputClass} value={draft.title} onChange={(e) => onChange("title", e.target.value)} placeholder="เช่น Psyche ในจิตวิทยาเชิงลึก" />
        </div>
        <div>
          <Label htmlFor="entry-slug">Slug</Label>
          <div className="flex gap-2">
            <input id="entry-slug" className={inputClass} value={draft.slug} onChange={(e) => onChange("slug", e.target.value)} placeholder="concept" />
            <button onClick={() => onChange("slug", slugify(draft.title))} className="shrink-0 rounded-md border border-text-heading/20 px-3 py-2 text-sm text-text-body hover:border-accent hover:bg-accent/5 transition-colors">สร้างจากชื่อ</button>
          </div>
        </div>
        {show.shortDesc && (
          <div>
            <Label htmlFor="entry-short-description">คำอธิบายสั้น / นิยามย่อ</Label>
            <input id="entry-short-description" className={inputClass} value={draft.shortDescription} onChange={(e) => onChange("shortDescription", e.target.value)} placeholder="คำอธิบายสั้นๆ สำหรับแสดงบนการ์ด" />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          {show.status && (
            <div>
              <Label htmlFor="entry-status">Status</Label>
              <SearchableSelect id="entry-status" value={draft.status} onChange={(v) => onChange("status", v)} options={STATUSES} placeholder="เลือกสถานะ" meta={statusMeta} placement="top" />
            </div>
          )}
          {show.contentType && (
            <div>
              <Label htmlFor="entry-content-type">Content Type</Label>
              <SearchableSelect id="entry-content-type" value={draft.contentType} onChange={(v) => onChange("contentType", v)} options={CONTENT_TYPES} placeholder="เลือกประเภทเนื้อหา" meta={contentTypeMeta} placement="top" />
              {draft.contentType && (
                <span
                  className="mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-[1.4]"
                  style={{ backgroundColor: `${typeMeta.accent}1f`, color: typeMeta.accent }}
                >
                  <EditorIcon name={typeMeta.icon} className="h-3 w-3" />
                  {typeMeta.label}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {show.framework && (
        <section id="framework" className="space-y-4" data-section="framework">
          <h2 className="font-serif text-xl text-text-heading">กรอบทฤษฎี</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="entry-framework">Framework</Label>
              <SearchableSelect id="entry-framework" value={draft.framework} onChange={(v) => onChange("framework", v)} options={FRAMEWORKS} placeholder="เลือกหรือสร้างกรอบทฤษฎี" meta={frameworkMeta} allowCustom placement="top" />
            </div>
            {show.difficulty && (
              <div>
                <Label htmlFor="entry-difficulty">Difficulty</Label>
                <SearchableSelect id="entry-difficulty" value={draft.difficulty} onChange={(v) => onChange("difficulty", v)} options={DIFFICULTIES} placeholder="เลือกระดับ" meta={difficultyMeta} placement="top" />
              </div>
            )}
          </div>
          {show.mainThinker && (
            <div>
              <Label htmlFor="entry-main-thinker">นักคิดหลัก</Label>
              <SearchableSelect id="entry-main-thinker" value={draft.mainThinker} onChange={(v) => onChange("mainThinker", v)} options={THINKER_OPTIONS} placeholder="เลือกหรือค้นหานักคิดที่เกี่ยวข้อง" meta={thinkerMeta} allowCustom placement="top" />
            </div>
          )}
          {show.school && (
            <div>
              <Label htmlFor="entry-school">สำนักคิดที่สังกัด</Label>
              <SearchableSelect id="entry-school" value={draft.school} onChange={(v) => onChange("school", v)} options={SCHOOL_OPTIONS} placeholder="เลือกหรือระบุสำนักคิด" meta={schoolMeta} allowCustom placement="top" />
            </div>
          )}
          <div>
            <Label>Tags</Label>
            <SearchableMultiSelect values={draft.tags} onChange={(v) => onChange("tags", v)} options={TAG_OPTIONS} />
          </div>
        </section>
      )}

      {!show.framework && show.tags && (
        <section className="space-y-4">
          <h2 className="font-serif text-xl text-text-heading">แท็ก</h2>
          <div>
            <Label>Tags</Label>
            <SearchableMultiSelect values={draft.tags} onChange={(v) => onChange("tags", v)} options={TAG_OPTIONS} />
          </div>
        </section>
      )}

      <section id="content" className="space-y-4" data-section="content">
        <h2 className="font-serif text-xl text-text-heading">เนื้อหา</h2>
        {show.visualExplanation && (
          <div>
            <Label htmlFor="entry-visual-explanation">คำอธิบายให้เห็นภาพ</Label>
            <textarea id="entry-visual-explanation" className={textareaClass} rows={4} value={draft.visualExplanation} onChange={(e) => onChange("visualExplanation", e.target.value)} placeholder="อธิบายด้วยภาษาที่เห็นภาพ" />
          </div>
        )}
        {show.technicalMeaning && (
          <div>
            <Label htmlFor="entry-technical-meaning">ความหมายทางวิชาการ / เทคนิค</Label>
            <textarea id="entry-technical-meaning" className={textareaClass} rows={4} value={draft.technicalMeaning} onChange={(e) => onChange("technicalMeaning", e.target.value)} placeholder="นิยามเชิงทฤษฎี" />
          </div>
        )}
        {show.bodyMarkdown && (
          <div>
            <Label htmlFor="entry-body-markdown">เนื้อหาเต็ม (Markdown)</Label>
            <textarea
              id="entry-body-markdown"
              className={`${textareaClass} font-mono text-sm leading-relaxed`}
              rows={16}
              value={draft.bodyMarkdown}
              onChange={(e) => onChange("bodyMarkdown", e.target.value)}
              placeholder="เขียนเนื้อหาแบบ Markdown"
            />
            <p className="mt-1 text-xs text-text-secondary">{"รองรับ Markdown + GFM · กด \"พรีวิว\" เพื่อดูผลลัพธ์"}</p>
          </div>
        )}
      </section>

      {show.coverImage && (
        <section id="cover" className="space-y-4" data-section="cover">
          <h2 className="font-serif text-xl text-text-heading">ภาพปก</h2>
          <ImagePicker
            value={draft.coverImage}
            onChange={(url) => onChange("coverImage", url)}
            onRemove={() => onChange("coverImage", "")}
            entryId={draft.id || undefined}
          />
        </section>
      )}

      {show.relatedConcepts && (
        <section id="related" className="space-y-3" data-section="related">
          <h2 className="font-serif text-xl text-text-heading">แนวคิดที่เกี่ยวข้อง</h2>
          <p className="text-sm text-text-secondary">ค้นหาจาก Concept Registry แล้วระบุความสัมพันธ์ + เหตุผล</p>
          <RelatedConceptPicker value={draft.relatedConcepts} onChange={(v) => onChange("relatedConcepts", v)} />
        </section>
      )}

      <section id="references" className="space-y-3" data-section="references">
        <h2 className="font-serif text-xl text-text-heading">เอกสารอ้างอิง</h2>
        {draft.references.map((r, i) => (
          <div key={i} className="flex items-start justify-between gap-3 rounded-md archron-panel p-3">
            <div className="text-sm text-text-body">
              <span className="inline-flex items-center gap-1 text-xs" style={{ color: sourceTypeMeta(r.sourceType).accent }}>
                <EditorIcon name={sourceTypeMeta(r.sourceType).icon} className="h-3 w-3" />
                {r.sourceType}
              </span>
              <span className="ml-2 text-text-heading">{r.title}</span>
              {r.relatedClaim ? <p className="mt-1 text-text-secondary">รองรับ: {r.relatedClaim}</p> : null}
            </div>
            <button onClick={() => onRemoveRef(i)} className="rounded-md px-2 py-1 text-xs text-error hover:bg-error/10 transition-colors">ลบ</button>
          </div>
        ))}
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto]">
          <SearchableSelect value={newRef.sourceType} onChange={(v) => setNewRef({ ...newRef, sourceType: v })} options={SOURCE_TYPES} placeholder="ชนิดแหล่ง" meta={sourceTypeMeta} placement="top" />
          <input className={inputClass} value={newRef.title} onChange={(e) => setNewRef({ ...newRef, title: e.target.value })} placeholder="ชื่อแหล่ง/งาน" aria-label="ชื่อแหล่ง/งาน" />
          <input className={inputClass} value={newRef.relatedClaim} onChange={(e) => setNewRef({ ...newRef, relatedClaim: e.target.value })} placeholder="รองรับ claim ใด" aria-label="รองรับ claim ใด" />
          <button onClick={onAddRef} className="rounded-md border border-text-heading/20 px-3 py-2 text-sm text-text-body hover:border-accent hover:bg-accent/5 transition-colors">เพิ่ม</button>
        </div>
      </section>

      {show.roots && (
        <section id="roots" className="space-y-4" data-section="roots">
          <h2 className="font-serif text-xl text-text-heading">Roots — ที่มาของคำ</h2>
          <div><Label htmlFor="entry-roots-etymology">รากศัพท์ (Etymology)</Label><textarea id="entry-roots-etymology" className={textareaClass} rows={2} value={draft.rootsEtymology} onChange={(e) => onChange("rootsEtymology", e.target.value)} /></div>
          <div><Label htmlFor="entry-roots-meaning-shift">การเปลี่ยนความหมาย</Label><textarea id="entry-roots-meaning-shift" className={textareaClass} rows={2} value={draft.rootsMeaningShift} onChange={(e) => onChange("rootsMeaningShift", e.target.value)} /></div>
          <div><Label htmlFor="entry-roots-caution">ข้อควรระวัง</Label><textarea id="entry-roots-caution" className={textareaClass} rows={2} value={draft.rootsCaution} onChange={(e) => onChange("rootsCaution", e.target.value)} placeholder="อย่าใช้รากศัพท์แทนนิยามทฤษฎี" /></div>
        </section>
      )}

      {preview && (
        <section className="archron-panel max-w-[var(--measure)] p-6">
          <p className="flex items-center gap-1 text-xs tracking-widest text-accent">
            <EditorIcon name="edit_note" className="h-3 w-3" />
            พรีวิว (ไม่เผยแพร่)
          </p>
          {draft.title && <h3 className="mt-2 font-serif text-2xl text-text-heading">{draft.title}</h3>}
          {draft.coverImage && (
            <div className="mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={draft.coverImage} alt={draft.title || "ภาพปก"} loading="lazy" decoding="async" className="h-48 w-full rounded-md object-cover" />
            </div>
          )}
          {draft.visualExplanation && <p className="mt-4 whitespace-pre-line text-text-body">{draft.visualExplanation}</p>}
          {draft.technicalMeaning && <p className="mt-3 whitespace-pre-line text-text-body">{draft.technicalMeaning}</p>}
          {draft.bodyMarkdown && draft.bodyMarkdown.trim() !== "" && (
            <div className="mt-5 border-t border-text-heading/10 pt-5">
              <MarkdownRenderer content={draft.bodyMarkdown} />
            </div>
          )}
        </section>
      )}
    </main>
  );
}
