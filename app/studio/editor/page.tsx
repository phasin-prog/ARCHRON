"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  EMPTY_DRAFT,
  getPublishChecklist,
  canPublish,
  slugify,
  type EditorDraft,
} from "@/lib/content/publish-validation";
import { SearchableSelect } from "@/components/studio/searchable-select";
import { SearchableMultiSelect } from "@/components/studio/searchable-multi-select";
import { RelatedConceptPicker } from "@/components/studio/related-concept-picker";
import { InternalLinkSuggestionPanel } from "@/components/studio/internal-link-suggestion-panel";

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
const TAG_OPTIONS = [
  "jung", "freud", "lacan", "psyche", "ego", "shadow", "persona", "self",
  "archetype", "unconscious", "collective-unconscious", "individuation",
  "complex", "projection", "symbol", "myth", "philosophy", "psychoanalysis",
  "depth-psychology", "source-note", "beginner", "intermediate", "advanced",
];

const STORAGE_KEY = "tsc-editor-draft-v0";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-sm text-soft-ivory">{children}</label>;
}

const inputClass =
  "w-full rounded-md border border-white/10 bg-charcoal/40 px-3 py-2 text-ivory outline-none focus:border-antique-gold/50";

export default function StudioEditorPage() {
  const [draft, setDraft] = useState<EditorDraft>(EMPTY_DRAFT);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [publishTried, setPublishTried] = useState(false);
  const [ref, setRef] = useState({ sourceType: "primary-source", title: "", relatedClaim: "" });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setDraft({ ...EMPTY_DRAFT, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
  }, []);

  function set<K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function saveDraft() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setSavedAt(new Date().toLocaleString("th-TH"));
    } catch {
      // ignore
    }
  }

  const checklist = getPublishChecklist(draft);
  const ready = canPublish(checklist);
  const canPreview = draft.title.trim() !== "" && draft.contentType !== "";

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 border-b border-antique-gold/15 bg-midnight/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
          <Link href="/" className="text-sm text-soft-ivory hover:text-soft-gold">← กลับหน้าแรก</Link>
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-muted">สถานะ: {draft.status}</span>
          <div className="flex items-center gap-2">
            <button onClick={saveDraft} className="rounded-sm border border-white/20 px-4 py-2 text-sm text-ivory hover:border-antique-gold">บันทึกแบบร่าง</button>
            <button onClick={() => setPreview((v) => !v)} disabled={!canPreview} className="rounded-sm border border-white/20 px-4 py-2 text-sm text-ivory hover:border-antique-gold disabled:opacity-40">{preview ? "ปิดพรีวิว" : "พรีวิว"}</button>
            <button onClick={() => setPublishTried(true)} className="rounded-sm bg-gradient-to-br from-antique-gold to-soft-gold px-4 py-2 text-sm font-semibold text-[#1a1306]">เผยแพร่</button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1fr_320px]">
        <main className="space-y-10">
          {savedAt ? <p className="text-xs text-muted">บันทึกล่าสุดเมื่อ {savedAt}</p> : null}

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-ivory">ข้อมูลพื้นฐาน</h2>
            <div>
              <Label>Title</Label>
              <input className={inputClass} value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="เช่น Psyche ในจิตวิทยาเชิงลึก" />
            </div>
            <div>
              <Label>Slug</Label>
              <div className="flex gap-2">
                <input className={inputClass} value={draft.slug} onChange={(e) => set("slug", e.target.value)} placeholder="psyche" />
                <button onClick={() => set("slug", slugify(draft.title))} className="shrink-0 rounded-md border border-white/20 px-3 text-sm text-soft-ivory hover:border-antique-gold">สร้างจากชื่อ</button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Status</Label>
                <select className={inputClass} value={draft.status} onChange={(e) => set("status", e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label>Content Type</Label>
                <SearchableSelect value={draft.contentType} onChange={(v) => set("contentType", v)} options={CONTENT_TYPES} placeholder="เลือกประเภทเนื้อหา" />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-ivory">กรอบทฤษฎี</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Framework</Label>
                <SearchableSelect value={draft.framework} onChange={(v) => set("framework", v)} options={FRAMEWORKS} placeholder="เลือกกรอบทฤษฎี" />
              </div>
              <div>
                <Label>Difficulty</Label>
                <select className={inputClass} value={draft.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
                  {DIFFICULTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <Label>นักคิดหลัก</Label>
              <input className={inputClass} value={draft.mainThinker} onChange={(e) => set("mainThinker", e.target.value)} placeholder="เช่น Carl Jung" />
            </div>
            <div>
              <Label>Tags</Label>
              <SearchableMultiSelect values={draft.tags} onChange={(v) => set("tags", v)} options={TAG_OPTIONS} />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-ivory">เนื้อหา</h2>
            <div>
              <Label>คำอธิบายให้เห็นภาพ</Label>
              <textarea className={inputClass} rows={4} value={draft.visualExplanation} onChange={(e) => set("visualExplanation", e.target.value)} placeholder="อธิบายด้วยภาษาที่เห็นภาพ ไม่ลงศัพท์เทคนิคหนัก หลีกเลี่ยงคำสวยลอย ๆ" />
            </div>
            <div>
              <Label>ความหมายทางวิชาการ / เทคนิค (รองรับ [[Shadow]] / [[Carl Jung|ยุง]])</Label>
              <textarea className={inputClass} rows={4} value={draft.technicalMeaning} onChange={(e) => set("technicalMeaning", e.target.value)} placeholder="นิยามเชิงทฤษฎี ขอบเขตของคำ — แยกกรอบนักคิดกับการตีความของเว็บ" />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory">แนวคิดที่เกี่ยวข้อง</h2>
            <p className="text-sm text-muted">ค้นหาจาก Concept Registry แล้วระบุความสัมพันธ์ + เหตุผล</p>
            <RelatedConceptPicker value={draft.relatedConcepts} onChange={(v) => set("relatedConcepts", v)} />
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory">เอกสารอ้างอิง</h2>
            {draft.references.map((r, i) => (
              <div key={i} className="flex items-start justify-between gap-3 rounded-md border border-white/10 bg-charcoal/40 p-3">
                <div className="text-sm text-soft-ivory">
                  <span className="text-xs text-antique-gold">{r.sourceType}</span>
                  <span className="ml-2 text-ivory">{r.title}</span>
                  {r.relatedClaim ? <p className="mt-1 text-muted">รองรับ: {r.relatedClaim}</p> : null}
                </div>
                <button onClick={() => set("references", draft.references.filter((_, j) => j !== i))} className="text-xs text-danger">ลบ</button>
              </div>
            ))}
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_2fr_auto]">
              <select className={inputClass} value={ref.sourceType} onChange={(e) => setRef({ ...ref, sourceType: e.target.value })}>
                {SOURCE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input className={inputClass} value={ref.title} onChange={(e) => setRef({ ...ref, title: e.target.value })} placeholder="ชื่อแหล่ง/งาน" />
              <input className={inputClass} value={ref.relatedClaim} onChange={(e) => setRef({ ...ref, relatedClaim: e.target.value })} placeholder="รองรับ claim ใด" />
              <button
                onClick={() => {
                  if (ref.title.trim() === "") return;
                  set("references", [...draft.references, ref]);
                  setRef({ sourceType: "primary-source", title: "", relatedClaim: "" });
                }}
                className="rounded-md border border-white/20 px-3 text-sm text-soft-ivory hover:border-antique-gold"
              >
                เพิ่ม
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-ivory">Roots — ที่มาของคำ</h2>
            <div><Label>รากศัพท์ (Etymology)</Label><textarea className={inputClass} rows={2} value={draft.rootsEtymology} onChange={(e) => set("rootsEtymology", e.target.value)} /></div>
            <div><Label>การเปลี่ยนความหมาย</Label><textarea className={inputClass} rows={2} value={draft.rootsMeaningShift} onChange={(e) => set("rootsMeaningShift", e.target.value)} /></div>
            <div><Label>ข้อควรระวัง</Label><textarea className={inputClass} rows={2} value={draft.rootsCaution} onChange={(e) => set("rootsCaution", e.target.value)} placeholder="อย่าใช้รากศัพท์แทนนิยามทฤษฎี" /></div>
          </section>

          {preview ? (
            <section className="rounded-md border border-antique-gold/20 bg-surface-1/40 p-6">
              <p className="text-xs tracking-widest text-antique-gold">พรีวิว (ไม่เผยแพร่)</p>
              <h3 className="mt-2 font-serif text-2xl text-ivory">{draft.title || "(ยังไม่มีชื่อ)"}</h3>
              <p className="mt-1 text-sm text-muted">{[draft.framework, draft.difficulty, draft.mainThinker].filter(Boolean).join(" · ")}</p>
              {draft.tags.length > 0 ? <p className="mt-2 text-xs text-soft-gold">{draft.tags.join(", ")}</p> : null}
              {draft.visualExplanation ? <p className="mt-4 whitespace-pre-line text-soft-ivory">{draft.visualExplanation}</p> : null}
              {draft.technicalMeaning ? <p className="mt-3 whitespace-pre-line text-soft-ivory">{draft.technicalMeaning}</p> : null}
            </section>
          ) : null}
        </main>

        <aside className="space-y-6 md:sticky md:top-20 md:self-start">
          <div className="rounded-md border border-white/10 bg-surface-1/40 p-5">
            <h3 className="font-serif text-base text-ivory">คำแนะนำ</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              <li>เขียนให้ชัด ไม่ลดทอนแนวคิดจนผิด</li>
              <li>เลี่ยงคำว่า ลึก/คม/ทรงพลัง ถ้าไม่อธิบายว่าอย่างไร</li>
              <li>แยกข้อเท็จจริง แหล่งที่มา และการตีความ</li>
              <li>ถ้ายังไม่มีแหล่ง ตั้งสถานะ Needs Source Check</li>
            </ul>
          </div>
          <div className="rounded-md border border-white/10 bg-surface-1/40 p-5">
            <h3 className="font-serif text-base text-ivory">Publish Checklist</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {checklist.map((c) => (
                <li key={c.label} className={c.ok ? "text-soft-ivory" : "text-muted"}>
                  <span className={c.ok ? "text-success" : "text-danger"}>{c.ok ? "✓" : "✕"}</span>{" "}
                  {c.label}
                </li>
              ))}
            </ul>
            {publishTried ? (
              <p className={ready ? "mt-4 text-sm text-success" : "mt-4 text-sm text-danger"}>
                {ready ? "พร้อมเผยแพร่ (เดโม v0.1 — ยังไม่เชื่อมระบบเผยแพร่จริง)" : "ยังเผยแพร่ไม่ได้ — ทำรายการที่ยังไม่ผ่านให้ครบ"}
              </p>
            ) : null}
          </div>
          <InternalLinkSuggestionPanel
            text={`${draft.visualExplanation} ${draft.technicalMeaning}`}
            onInsert={(term) =>
              set(
                "technicalMeaning",
                draft.technicalMeaning + (draft.technicalMeaning ? " " : "") + `[[${term}]]`,
              )
            }
          />
        </aside>
      </div>
    </div>
  );
}
