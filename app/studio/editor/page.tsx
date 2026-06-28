"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth, useSession, UserButton } from "@clerk/nextjs";
import {
  EMPTY_DRAFT,
  getPublishChecklist,
  canPublish,
  slugify,
  type EditorDraft,
} from "@/lib/content/publish-validation";
import { createClerkSupabaseClient } from "@/lib/supabase/client";
import { saveDraft as saveDraftDb, loadDraftBySlug, publishEntry } from "@/lib/content/draft-db";
import { addRevision } from "@/lib/content/entries-db";
import { findDeadLinks } from "@/lib/content/internal-links";
import { revalidatePublic } from "./actions";
import { SearchableSelect } from "@/components/studio/searchable-select";
import { SearchableMultiSelect } from "@/components/studio/searchable-multi-select";
import { RelatedConceptPicker } from "@/components/studio/related-concept-picker";
import { InternalLinkSuggestionPanel } from "@/components/studio/internal-link-suggestion-panel";
import { RevisionPanel } from "@/components/studio/revision-panel";
import { MyContentSearch } from "@/components/studio/my-content-search";

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

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-sm text-soft-ivory">{children}</label>;
}

const inputClass =
  "w-full rounded-md border border-white/10 bg-charcoal/40 px-3 py-2 text-ivory outline-none focus:border-antique-gold/50";

export default function StudioEditorPage() {
  const { userId } = useAuth();
  const { session } = useSession();

  const supabase = useMemo(
    () => createClerkSupabaseClient(async () => (await session?.getToken()) ?? null),
    [session],
  );

  const [draft, setDraft] = useState<EditorDraft>(EMPTY_DRAFT);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [autoState, setAutoState] = useState<"idle" | "saving" | "saved">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [publishTried, setPublishTried] = useState(false);
  const [ref, setRef] = useState({ sourceType: "primary-source", title: "", relatedClaim: "" });
  const [publishing, setPublishing] = useState(false);

  const canSave = draft.slug.trim() !== "" && draft.title.trim() !== "";

  // โหลดเนื้อหาเดิมถ้ามี ?slug=
  useEffect(() => {
    const slug =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("slug")
        : null;
    if (!slug) return;
    let active = true;
    (async () => {
      const loaded = await loadDraftBySlug(supabase, slug);
      if (active && loaded) setDraft(loaded);
    })();
    return () => {
      active = false;
    };
  }, [supabase]);

  function set<K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  // บันทึกลง Supabase; snapshot=true จะเก็บลง version history ด้วย
  async function persist(snapshot: boolean): Promise<boolean> {
    if (!userId || !canSave) return false;
    const { data, error } = await saveDraftDb(supabase, userId, draft);
    if (error) {
      setMessage(`บันทึกไม่สำเร็จ: ${error.message}`);
      return false;
    }
    setMessage(null);
    const row = data as { id?: string } | null;
    const id = row?.id ?? entryId;
    if (id && id !== entryId) setEntryId(id);
    setSavedAt(new Date().toLocaleString("th-TH"));
    if (snapshot && id) {
      await addRevision(supabase, id, draft, userId, "บันทึกด้วยตนเอง");
      setReloadKey((k) => k + 1);
    }
    return true;
  }

  // Autosave — debounce 2.5 วินาทีหลังหยุดพิมพ์
  useEffect(() => {
    if (!userId || !canSave) return;
    const t = setTimeout(async () => {
      setAutoState("saving");
      const ok = await persist(false);
      setAutoState(ok ? "saved" : "idle");
    }, 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, userId]);

  async function handleManualSave() {
    if (!userId) {
      setMessage("ยังไม่ได้เข้าสู่ระบบ — บันทึกไม่ได้");
      return;
    }
    if (!canSave) {
      setMessage("ต้องมี Title และ Slug ก่อนบันทึก");
      return;
    }
    await persist(true);
  }

  // dead links จากทุกฟิลด์ข้อความ (คำอธิบายให้เห็นภาพ / ความหมายเทคนิค / เนื้อหา Markdown)
  const deadLinks = useMemo(
    () =>
      Array.from(
        new Set(
          findDeadLinks(
            `${draft.visualExplanation} ${draft.technicalMeaning} ${draft.bodyMarkdown}`,
          ),
        ),
      ),
    [draft.visualExplanation, draft.technicalMeaning, draft.bodyMarkdown],
  );

  // เผยแพร่จริง (E7): ตรวจ checklist + dead links → publish → snapshot → revalidate public
  async function handlePublish() {
    setPublishTried(true);
    if (!userId) {
      setMessage("ยังไม่ได้เข้าสู่ระบบ — เผยแพร่ไม่ได้");
      return;
    }
    if (!canSave) {
      setMessage("ต้องมี Title และ Slug ก่อนเผยแพร่");
      return;
    }
    if (!canPublish(getPublishChecklist(draft))) {
      setMessage("ยังเผยแพร่ไม่ได้ — ทำรายการใน Publish Checklist ให้ครบก่อน");
      return;
    }
    if (deadLinks.length > 0) {
      setMessage(
        `พบลิงก์เสีย (dead links) ${deadLinks.length} รายการ: ${deadLinks.join(", ")} — แก้หรือลบก่อนเผยแพร่`,
      );
      return;
    }
    setPublishing(true);
    const { data, error } = await publishEntry(supabase, userId, draft);
    if (error) {
      setPublishing(false);
      setMessage(`เผยแพร่ไม่สำเร็จ: ${error.message}`);
      return;
    }
    const row = data as { id?: string } | null;
    const id = row?.id ?? entryId;
    if (id && id !== entryId) setEntryId(id);
    if (id) {
      await addRevision(supabase, id, { ...draft, status: "published" }, userId, "เผยแพร่");
      setReloadKey((k) => k + 1);
    }
    setDraft((d) => ({ ...d, status: "published" }));
    setSavedAt(new Date().toLocaleString("th-TH"));
    try {
      await revalidatePublic(draft.slug);
    } catch {
      // revalidate ล้มเหลวไม่นับว่า publish ล้มเหลว — เนื้อหาถูกตั้ง published แล้ว
    }
    setPublishing(false);
    setMessage("เผยแพร่แล้ว ✓ — ตั้งสถานะ published (หน้า public จะดึงจาก DB เมื่อทำ E8)");
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
            <button onClick={handleManualSave} className="rounded-sm border border-white/20 px-4 py-2 text-sm text-ivory hover:border-antique-gold">บันทึก + เวอร์ชัน</button>
            <button onClick={() => setPreview((v) => !v)} disabled={!canPreview} className="rounded-sm border border-white/20 px-4 py-2 text-sm text-ivory hover:border-antique-gold disabled:opacity-40">{preview ? "ปิดพรีวิว" : "พรีวิว"}</button>
            <button onClick={handlePublish} disabled={publishing} className="rounded-sm bg-gradient-to-br from-antique-gold to-soft-gold px-4 py-2 text-sm font-semibold text-[#1a1306] disabled:opacity-50">{publishing ? "กำลังเผยแพร่..." : "เผยแพร่"}</button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1fr_320px]">
        <main className="space-y-10">
          <p className="text-xs text-muted">
            เขียนในชื่อ (author_id): <span className="text-soft-ivory">{userId ?? "— (ยังไม่ได้ login)"}</span>
            {autoState === "saving" ? <span> · กำลังบันทึกอัตโนมัติ...</span> : null}
            {autoState === "saved" && savedAt ? <span> · บันทึกอัตโนมัติแล้ว {savedAt}</span> : null}
          </p>
          {message ? <p className="text-sm text-danger">{message}</p> : null}

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
            <div>
              <Label>เนื้อหาเต็ม (Markdown)</Label>
              <textarea
                className={`${inputClass} font-mono text-sm leading-relaxed`}
                rows={16}
                value={draft.bodyMarkdown}
                onChange={(e) => set("bodyMarkdown", e.target.value)}
                placeholder={"เขียนเนื้อหาแบบ Markdown — รองรับหัวข้อ (## , ### ), ตัวหนา **...**, รายการ, ตาราง (GFM), บล็อกอ้างอิง > ...\nระบบแปลงเป็น HTML แบบปลอดภัย ไม่อนุญาต raw HTML"}
              />
              <p className="mt-1 text-xs text-muted">รองรับ Markdown + GFM (ตาราง, รายการงาน, ขีดฆ่า) · กด “พรีวิว” เพื่อดูผลลัพธ์</p>
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
              {draft.bodyMarkdown && draft.bodyMarkdown.trim() !== "" ? (
                <div className="md-body mt-5 border-t border-white/10 pt-5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.bodyMarkdown}</ReactMarkdown>
                </div>
              ) : null}
            </section>
          ) : null}
        </main>

        <aside className="space-y-6 md:sticky md:top-20 md:self-start">
          <MyContentSearch supabase={supabase} userId={userId ?? null} />
          <div className="rounded-md border border-white/10 bg-surface-1/40 p-5">
            <h3 className="font-serif text-base text-ivory">คำแนะนำ</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              <li>เขียนให้ชัด ไม่ลดทอนแนวคิดจนผิด</li>
              <li>เลี่ยงคำว่า ลึก/คม/ทรงพลัง ถ้าไม่อธิบายว่าอย่างไร</li>
              <li>แยกข้อเท็จจริง แหล่งที่มา และการตีความ</li>
              <li>autosave ทุก 2.5 วิ · กด “บันทึก + เวอร์ชัน” เพื่อเก็บ snapshot</li>
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
            {deadLinks.length > 0 ? (
              <p className="mt-3 text-xs text-danger">
                ลิงก์เสีย {deadLinks.length}: {deadLinks.join(", ")}
              </p>
            ) : null}
            {publishTried ? (
              <p className={ready && deadLinks.length === 0 ? "mt-4 text-sm text-success" : "mt-4 text-sm text-danger"}>
                {ready && deadLinks.length === 0
                  ? "พร้อมเผยแพร่ — กดปุ่ม “เผยแพร่” ด้านบน"
                  : "ยังเผยแพร่ไม่ได้ — ทำรายการที่ยังไม่ผ่าน / แก้ลิงก์เสียให้ครบ"}
              </p>
            ) : null}
          </div>
          <RevisionPanel
            supabase={supabase}
            entryId={entryId}
            reloadKey={reloadKey}
            onRestore={(d) => setDraft(d)}
          />
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
