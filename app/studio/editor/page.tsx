"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import { roleFromMetadata, canWrite, isAdmin } from "@/lib/content/roles";
import {
  EMPTY_DRAFT,
  getPublishChecklist,
  canPublish,
  slugify,
  type EditorDraft,
} from "@/lib/content/publish-validation";
import {
  saveDraftAction,
  saveDraftWithRevisionAction,
  loadDraftAction,
  publishAction,
  revalidatePublic,
} from "./actions";
import { findDeadLinks } from "@/lib/content/internal-links";
import { SearchableSelect } from "@/components/studio/searchable-select";
import { SearchableMultiSelect } from "@/components/studio/searchable-multi-select";
import { THEME_TAG_SUGGESTIONS } from "@/lib/content/themes";
import { SCHOOLS } from "@/lib/content/schools";
import { RelatedConceptPicker } from "@/components/studio/related-concept-picker";
import { InternalLinkSuggestionPanel } from "@/components/studio/internal-link-suggestion-panel";
import { RevisionPanel } from "@/components/studio/revision-panel";
import { MyContentSearch } from "@/components/studio/my-content-search";
import { ImagePicker } from "@/components/studio/image-picker";
import { FeedbackToast, type Feedback } from "@/components/studio/feedback-toast";
import {
  getMyProfileAction,
} from "@/app/studio/profile/actions";
import {
  contentTypeMeta,
  statusMeta,
  difficultyMeta,
  sourceTypeMeta,
  frameworkMeta,
} from "@/lib/content/cosmology";
import { ContentTypeSelector } from "@/components/studio/content-type-selector";

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
  "jung", "freud", "lacan", "psyche", "ego", "shadow", "persona", "self",
  "archetype", "unconscious", "collective-unconscious", "individuation",
  "complex", "projection", "symbol", "myth", "philosophy", "psychoanalysis",
  "depth-psychology", "source-note", "beginner", "intermediate", "advanced",
];
const TAG_OPTIONS = Array.from(new Set([...BASE_TAG_OPTIONS, ...THEME_TAG_SUGGESTIONS]));

const THINKER_OPTIONS = SCHOOLS.flatMap((s) =>
  s.thinkers.map((t) => ({
    value: t.nameEn,
    label: `${t.nameTh} (${t.nameEn})`,
  }))
);
const thinkerMeta = (val: string) => {
  return {
    icon: "person",
    accent: "var(--color-antique-gold)",
  };
};

const SCHOOL_OPTIONS = SCHOOLS.map((s) => ({
  value: s.id,
  label: `${s.nameTh} (${s.nameEn})`,
}));
const schoolMeta = (val: string) => {
  return {
    icon: "account_balance",
    accent: "var(--color-antique-gold)",
  };
};

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="mb-1 block text-sm text-soft-ivory">{children}</label>;
}

const inputClass =
  "w-full rounded-md border border-ink/10 bg-charcoal/40 px-3 py-2 text-ivory outline-none focus:border-antique-gold/50 focus:ring-2 focus:ring-antique-gold/20 transition-colors";

const textareaClass = `${inputClass} resize-y`;

export default function StudioEditorPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();

  const [draft, setDraft] = useState<EditorDraft>(EMPTY_DRAFT);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [autoState, setAutoState] = useState<"idle" | "saving" | "saved">("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const showError = (text: string) => setFeedback({ type: "error", text });
  const showSuccess = (text: string) => setFeedback({ type: "success", text });
  const [preview, setPreview] = useState(false);
  const [publishTried, setPublishTried] = useState(false);
  const [ref, setRef] = useState({ sourceType: "primary-source", title: "", relatedClaim: "" });
  const [publishing, setPublishing] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [showSelector, setShowSelector] = useState(true);
  const [originalAuthorId, setOriginalAuthorId] = useState<string | null>(null);
  const [originalAuthorName, setOriginalAuthorName] = useState<string | null>(null);

  const canSave = draft.slug.trim() !== "" && draft.title.trim() !== "";

  // โหลด display_name จาก profile
  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      const p = await getMyProfileAction();
      if (active && p?.display_name) setDisplayName(p.display_name);
    })();
    return () => { active = false; };
  }, [userId]);

  // โหลดเนื้อหาเดิมถ้ามี ?slug= หรือ ?type= หรือสร้าง UUID ใหม่
  useEffect(() => {
    const slug = searchParams.get("slug");
    const type = searchParams.get("type");

    if (slug) {
      // โหลดเนื้อหาเดิม
      setShowSelector(false);
      let active = true;
      setLoadingDraft(true);
      (async () => {
        try {
          const { draft: loaded, authorId, authorName } = await loadDraftAction(slug);
          if (active && loaded) {
            setDraft(loaded);
            setOriginalAuthorId(authorId);
            setOriginalAuthorName(authorName);
          }
        } catch (err) {
          if (active) {
            showError(`โหลดเนื้อหาไม่สำเร็จ: ${err instanceof Error ? err.message : "ข้อผิดพลาดไม่ทราบสาเหตุ"}`);
          }
        } finally {
          if (active) setLoadingDraft(false);
        }
      })();
      return () => { active = false; };
    }

    if (type) {
      // สร้างเนื้อหาใหม่ตาม type ที่เลือก
      setShowSelector(false);
      setDraft((d) => ({
        ...d,
        id: crypto.randomUUID(),
        contentType: type,
      }));
    }
    // ถ้าไม่มี slug และไม่มี type — แสดง selector
  }, [searchParams]);

  function set<K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  // บันทึกลง Supabase ผ่าน Server Action; snapshot=true จะเก็บลง version history ด้วย
  async function persist(snapshot: boolean): Promise<boolean> {
    if (!userId || !canSave) return false;
    let result;
    if (snapshot) {
      result = await saveDraftWithRevisionAction(draft);
    } else {
      result = await saveDraftAction(draft);
    }
    if (result.error) {
      showError(`บันทึกไม่สำเร็จ: ${result.error}`);
      return false;
    }
    setFeedback(null);
    const row = result.data as { id?: string } | null;
    const id = row?.id ?? entryId;
    if (id && id !== entryId) setEntryId(id);
    setSavedAt(new Date().toLocaleString("th-TH"));
    if (snapshot) {
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
      showError("ยังไม่ได้เข้าสู่ระบบ — บันทึกไม่ได้");
      return;
    }
    if (!canSave) {
      showError("ต้องมี Title และ Slug ก่อนบันทึก");
      return;
    }
    const ok = await persist(true);
    if (ok) showSuccess("บันทึก + เวอร์ชันแล้ว ✓");
  }

  // dead links จากทุกฟิลด์ข้อความ
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
      showError("ยังไม่ได้เข้าสู่ระบบ — เผยแพร่ไม่ได้");
      return;
    }
    if (!canSave) {
      showError("ต้องมี Title และ Slug ก่อนเผยแพร่");
      return;
    }
    if (!canPublish(getPublishChecklist(draft))) {
      showError("ยังเผยแพร่ไม่ได้ — ทำรายการใน Publish Checklist ให้ครบก่อน");
      return;
    }
    if (deadLinks.length > 0) {
      showError(
        `พบลิงก์เสีย (dead links) ${deadLinks.length} รายการ: ${deadLinks.join(", ")} — แก้หรือลบก่อนเผยแพร่`,
      );
      return;
    }
    setPublishing(true);
    const result = await publishAction(draft);
    if (result.error) {
      setPublishing(false);
      showError(`เผยแพร่ไม่สำเร็จ: ${result.error}`);
      return;
    }
    const row = result.data as { id?: string } | null;
    const id = row?.id ?? entryId;
    if (id && id !== entryId) setEntryId(id);
    setDraft((d) => ({ ...d, status: "published" }));
    setSavedAt(new Date().toLocaleString("th-TH"));
    setPublishing(false);
    showSuccess("เผยแพร่แล้ว ✓");
  }

  const checklist = getPublishChecklist(draft);
  const ready = canPublish(checklist);
  const canPreview = draft.title.trim() !== "" && draft.contentType !== "";
  const typeMeta = contentTypeMeta(draft.contentType);
  const role = roleFromMetadata(user?.publicMetadata);
  const ct = draft.contentType;

  // กำหนดว่า sections ไหนแสดง/ซ่อน ตาม content type
  const show = {
    shortDesc: true,
    status: true,
    contentType: true,
    framework: ["article", "concept", "person", "book"].includes(ct),
    difficulty: ["article", "concept"].includes(ct),
    mainThinker: ["article", "concept", "person", "book"].includes(ct),
    school: ["article", "concept"].includes(ct),
    tags: true,
    visualExplanation: true,
    technicalMeaning: ["article", "concept", "person"].includes(ct),
    bodyMarkdown: ct === "article",
    coverImage: ct === "article",
    relatedConcepts: ["article", "concept", "person", "school", "book"].includes(ct),
    references: true,
    roots: ["article", "concept"].includes(ct),
  };

  // กั้นสิทธิ: role user เขียนไม่ได้
  if (user && !canWrite(role)) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-burnished-gold/30 text-burnished-gold">
          <span className="material-symbols-outlined text-[26px]">lock</span>
        </span>
        <h1 className="mt-6 font-serif text-2xl text-on-surface">ห้องเขียนสำหรับนักเขียน</h1>
        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant/70">
          บัญชีของคุณเป็นผู้ใช้ทั่วไป (อ่านอย่างเดียว) หากต้องการเขียนและเรียบเรียงเนื้อหา
          กรุณาส่งคำขอเป็นนักเขียนเพื่อให้แอดมินพิจารณา
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/studio/profile"
            className="inline-flex items-center justify-center gap-2 bg-antique-gold px-6 py-2.5 text-sm font-semibold text-prima hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            ขอเป็นนักเขียน
          </Link>
          <Link
            href="/studio"
            className="inline-flex items-center justify-center gap-2 border border-burnished-gold/40 px-6 py-2.5 text-sm text-burnished-gold hover:bg-burnished-gold/10"
          >
            กลับห้องเขียน
          </Link>
        </div>
      </main>
    );
  }

  // แสดง Content Type Selector ถ้ายังไม่ได้เลือกประเภท
  if (showSelector) {
    return <ContentTypeSelector />;
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 border-b border-antique-gold/15 bg-midnight/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
          <Link href="/studio" className="text-sm text-soft-ivory hover:text-soft-gold">← กลับห้องเขียน</Link>
          <span
            className="tag-pill gap-1.5"
            style={{ backgroundColor: `${statusMeta(draft.status).accent}1f`, color: statusMeta(draft.status).accent }}
          >
            <span className="material-symbols-outlined text-[14px]">{statusMeta(draft.status).icon}</span>
            {draft.status}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={handleManualSave} disabled={loadingDraft || publishing} className="rounded-md border border-ink/20 px-4 py-2 text-sm text-ivory hover:border-antique-gold hover:bg-antique-gold/5 transition-colors disabled:opacity-40">บันทึก + เวอร์ชัน</button>
            <button onClick={() => setPreview((v) => !v)} disabled={!canPreview || loadingDraft} className="rounded-md border border-ink/20 px-4 py-2 text-sm text-ivory hover:border-antique-gold hover:bg-antique-gold/5 transition-colors disabled:opacity-40">{preview ? "ปิดพรีวิว" : "พรีวิว"}</button>
            <button onClick={handlePublish} disabled={publishing || loadingDraft} className="rounded-md bg-antique-gold px-4 py-2 text-sm font-semibold text-prima hover:brightness-110 transition-all disabled:opacity-50">{publishing ? "กำลังเผยแพร่..." : "เผยแพร่"}</button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>

      {loadingDraft ? (
        <div className="mx-auto max-w-6xl px-6 py-10 pb-28 md:grid-cols-[1fr_320px] lg:pb-10 md:grid gap-8">
          <main className="space-y-10">
            <div className="h-3 w-48 animate-pulse rounded bg-surface-2" />
            <section className="space-y-4">
              <div className="h-6 w-32 animate-pulse rounded bg-surface-2" />
              <div className="h-10 w-full animate-pulse rounded bg-surface-2" />
              <div className="h-10 w-full animate-pulse rounded bg-surface-2" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-surface-2" />
            </section>
            <section className="space-y-4">
              <div className="h-6 w-40 animate-pulse rounded bg-surface-2" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-10 animate-pulse rounded bg-surface-2" />
                <div className="h-10 animate-pulse rounded bg-surface-2" />
              </div>
            </section>
            <section className="space-y-4">
              <div className="h-6 w-24 animate-pulse rounded bg-surface-2" />
              <div className="h-24 w-full animate-pulse rounded bg-surface-2" />
              <div className="h-24 w-full animate-pulse rounded bg-surface-2" />
              <div className="h-40 w-full animate-pulse rounded bg-surface-2" />
            </section>
          </main>
          <aside className="space-y-6 md:sticky md:top-20 md:self-start">
            <div className="archron-panel p-5">
              <div className="h-5 w-40 animate-pulse rounded bg-surface-2" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" />
              </div>
            </div>
            <div className="archron-panel p-5">
              <div className="h-5 w-36 animate-pulse rounded bg-surface-2" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-surface-2" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-surface-2" />
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 pb-28 md:grid-cols-[1fr_320px] lg:pb-10">
        <main className="space-y-10">
          <p className="text-xs text-muted">
            เขียนในชื่อ: <span className="text-soft-ivory">{displayName || user?.fullName || user?.username || "นักเขียน"}</span>
            {autoState === "saving" ? <span> · กำลังบันทึกอัตโนมัติ...</span> : null}
            {autoState === "saved" && savedAt ? <span> · บันทึกอัตโนมัติแล้ว {savedAt}</span> : null}
          </p>
          {isAdmin(role) && originalAuthorId && originalAuthorId !== userId && (
            <div className="mt-2 rounded-md border border-burnished-gold/30 bg-burnished-gold/5 px-3 py-2 text-xs text-burnished-gold">
              <span className="material-symbols-outlined mr-1 align-middle text-[14px]">admin_panel_settings</span>
              กำลังแก้ไขเนื้อหาของ: <span className="font-semibold">{originalAuthorName || originalAuthorId}</span>
            </div>
          )}
          <FeedbackToast feedback={feedback} onClose={() => setFeedback(null)} />

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-ivory">ข้อมูลพื้นฐาน</h2>
            <div>
              <Label htmlFor="entry-title">Title</Label>
              <input id="entry-title" className={inputClass} value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="เช่น Psyche ในจิตวิทยาเชิงลึก" />
            </div>
            <div>
              <Label htmlFor="entry-slug">Slug</Label>
              <div className="flex gap-2">
                <input id="entry-slug" className={inputClass} value={draft.slug} onChange={(e) => set("slug", e.target.value)} placeholder="psyche" />
                <button onClick={() => set("slug", slugify(draft.title))} className="shrink-0 rounded-md border border-ink/20 px-3 py-2 text-sm text-soft-ivory hover:border-antique-gold hover:bg-antique-gold/5 transition-colors">สร้างจากชื่อ</button>
              </div>
            </div>
            {show.shortDesc && (
              <div>
                <Label htmlFor="entry-short-description">คำอธิบายสั้น / นิยามย่อ (Short Description)</Label>
                <input id="entry-short-description" className={inputClass} value={draft.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="คำอธิบายสั้นๆ สำหรับแสดงบนการ์ดหรือหน้ารวมบทความ" />
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              {show.status && (
                <div>
                  <Label htmlFor="entry-status">Status</Label>
                   <SearchableSelect id="entry-status" value={draft.status} onChange={(v) => set("status", v)} options={STATUSES} placeholder="เลือกสถานะ" meta={statusMeta} placement="top" />
                </div>
              )}
              {show.contentType && (
                <div>
                  <Label htmlFor="entry-content-type">Content Type</Label>
                   <SearchableSelect id="entry-content-type" value={draft.contentType} onChange={(v) => set("contentType", v)} options={CONTENT_TYPES} placeholder="เลือกประเภทเนื้อหา" meta={contentTypeMeta} placement="top" />
                  {draft.contentType ? (
                    <span
                      className="mt-2 tag-pill gap-1.5"
                      style={{ backgroundColor: `${typeMeta.accent}1f`, color: typeMeta.accent }}
                    >
                      <span className="material-symbols-outlined text-[16px]">{typeMeta.icon}</span>
                      {typeMeta.label}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </section>

          {show.framework && (
            <section className="space-y-4">
              <h2 className="font-serif text-xl text-ivory">กรอบทฤษฎี</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="entry-framework">Framework</Label>
                   <SearchableSelect id="entry-framework" value={draft.framework} onChange={(v) => set("framework", v)} options={FRAMEWORKS} placeholder="เลือกหรือสร้างกรอบทฤษฎี" meta={frameworkMeta} allowCustom placement="top" />
                </div>
                {show.difficulty && (
                  <div>
                    <Label htmlFor="entry-difficulty">Difficulty</Label>
                    <SearchableSelect id="entry-difficulty" value={draft.difficulty} onChange={(v) => set("difficulty", v)} options={DIFFICULTIES} placeholder="เลือกระดับ" meta={difficultyMeta} placement="top" />
                  </div>
                )}
              </div>
              {show.mainThinker && (
                <div>
                  <Label htmlFor="entry-main-thinker">นักคิดหลัก</Label>
                   <SearchableSelect id="entry-main-thinker" value={draft.mainThinker} onChange={(v) => set("mainThinker", v)} options={THINKER_OPTIONS} placeholder="เลือกหรือค้นหานักคิดที่เกี่ยวข้อง" meta={thinkerMeta} allowCustom placement="top" />
                </div>
              )}
              {show.school && (
                <div>
                  <Label htmlFor="entry-school">สำนักคิดที่สังกัด (School)</Label>
                   <SearchableSelect id="entry-school" value={draft.school} onChange={(v) => set("school", v)} options={SCHOOL_OPTIONS} placeholder="เลือกหรือระบุสำนักคิด" meta={schoolMeta} allowCustom placement="top" />
                </div>
              )}
              <div>
                <Label>Tags</Label>
                <SearchableMultiSelect values={draft.tags} onChange={(v) => set("tags", v)} options={TAG_OPTIONS} />
              </div>
            </section>
          )}

          {!show.framework && show.tags && (
            <section className="space-y-4">
              <h2 className="font-serif text-xl text-ivory">แท็ก</h2>
              <div>
                <Label>Tags</Label>
                <SearchableMultiSelect values={draft.tags} onChange={(v) => set("tags", v)} options={TAG_OPTIONS} />
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h2 className="font-serif text-xl text-ivory">เนื้อหา</h2>
            {show.visualExplanation && (
              <div>
                <Label htmlFor="entry-visual-explanation">คำอธิบายให้เห็นภาพ</Label>
                <textarea id="entry-visual-explanation" className={textareaClass} rows={4} value={draft.visualExplanation} onChange={(e) => set("visualExplanation", e.target.value)} placeholder="อธิบายด้วยภาษาที่เห็นภาพ ไม่ลงศัพท์เทคนิคหนัก หลีกเลี่ยงคำสวยลอย ๆ" />
              </div>
            )}
            {show.technicalMeaning && (
              <div>
                <Label htmlFor="entry-technical-meaning">ความหมายทางวิชาการ / เทคนิค (รองรับ [[Shadow]] / [[Carl Jung|ยุง]])</Label>
                <textarea id="entry-technical-meaning" className={textareaClass} rows={4} value={draft.technicalMeaning} onChange={(e) => set("technicalMeaning", e.target.value)} placeholder="นิยามเชิงทฤษฎี ขอบเขตของคำ — แยกกรอบนักคิดกับการตีความของเว็บ" />
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
                  onChange={(e) => set("bodyMarkdown", e.target.value)}
                  placeholder={"เขียนเนื้อหาแบบ Markdown — รองรับหัวข้อ (## , ### ), ตัวหนา **...**, รายการ, ตาราง (GFM), บล็อกอ้างอิง > ...\nระบบแปลงเป็น HTML แบบปลอดภัย ไม่อนุญาต raw HTML"}
                />
                <p className="mt-1 text-xs text-muted">{"รองรับ Markdown + GFM (ตาราง, รายการงาน, ขีดฆ่า) · กด \u201Cพรีวิว\u201D เพื่อดูผลลัพธ์"}</p>
              </div>
            )}
          </section>

          {show.coverImage && (
            <section className="space-y-4">
              <h2 className="font-serif text-xl text-ivory">ภาพปก</h2>
              <ImagePicker
                value={draft.coverImage}
                onChange={(url) => set("coverImage", url)}
                onRemove={() => set("coverImage", "")}
                entryId={draft.id || undefined}
              />
            </section>
          )}

          {show.relatedConcepts && (
            <section className="space-y-3">
              <h2 className="font-serif text-xl text-ivory">แนวคิดที่เกี่ยวข้อง</h2>
              <p className="text-sm text-muted">ค้นหาจาก Concept Registry แล้วระบุความสัมพันธ์ + เหตุผล</p>
              <RelatedConceptPicker value={draft.relatedConcepts} onChange={(v) => set("relatedConcepts", v)} />
            </section>
          )}

          <section className="space-y-3">
            <h2 className="font-serif text-xl text-ivory">เอกสารอ้างอิง</h2>
            {draft.references.map((r, i) => (
              <div key={i} className="flex items-start justify-between gap-3 rounded-md archron-panel p-3">
                <div className="text-sm text-soft-ivory">
                  <span
                    className="inline-flex items-center gap-1 text-xs"
                    style={{ color: sourceTypeMeta(r.sourceType).accent }}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {sourceTypeMeta(r.sourceType).icon}
                    </span>
                    {r.sourceType}
                  </span>
                  <span className="ml-2 text-ivory">{r.title}</span>
                  {r.relatedClaim ? <p className="mt-1 text-muted">รองรับ: {r.relatedClaim}</p> : null}
                </div>
                <button onClick={() => set("references", draft.references.filter((_, j) => j !== i))} className="rounded-md px-2 py-1 text-xs text-danger hover:bg-danger/10 transition-colors">ลบ</button>
              </div>
            ))}
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto]">
               <SearchableSelect value={ref.sourceType} onChange={(v) => setRef({ ...ref, sourceType: v })} options={SOURCE_TYPES} placeholder="ชนิดแหล่ง" meta={sourceTypeMeta} placement="top" />
              <input id="ref-title" className={inputClass} value={ref.title} onChange={(e) => setRef({ ...ref, title: e.target.value })} placeholder="ชื่อแหล่ง/งาน" aria-label="ชื่อแหล่ง/งาน" />
              <input id="ref-related-claim" className={inputClass} value={ref.relatedClaim} onChange={(e) => setRef({ ...ref, relatedClaim: e.target.value })} placeholder="รองรับ claim ใด" aria-label="รองรับ claim ใด" />
              <button
                onClick={() => {
                  if (ref.title.trim() === "") return;
                  set("references", [...draft.references, ref]);
                  setRef({ sourceType: "primary-source", title: "", relatedClaim: "" });
                }}
                className="rounded-md border border-ink/20 px-3 py-2 text-sm text-soft-ivory hover:border-antique-gold hover:bg-antique-gold/5 transition-colors"
                aria-label="เพิ่มเอกสารอ้างอิง"
              >
                เพิ่ม
              </button>
            </div>
          </section>

          {show.roots && (
            <section className="space-y-4">
              <h2 className="font-serif text-xl text-ivory">Roots — ที่มาของคำ</h2>
              <div><Label htmlFor="entry-roots-etymology">รากศัพท์ (Etymology)</Label><textarea id="entry-roots-etymology" className={textareaClass} rows={2} value={draft.rootsEtymology} onChange={(e) => set("rootsEtymology", e.target.value)} /></div>
              <div><Label htmlFor="entry-roots-meaning-shift">การเปลี่ยนความหมาย</Label><textarea id="entry-roots-meaning-shift" className={textareaClass} rows={2} value={draft.rootsMeaningShift} onChange={(e) => set("rootsMeaningShift", e.target.value)} /></div>
              <div><Label htmlFor="entry-roots-caution">ข้อควรระวัง</Label><textarea id="entry-roots-caution" className={textareaClass} rows={2} value={draft.rootsCaution} onChange={(e) => set("rootsCaution", e.target.value)} placeholder="อย่าใช้รากศัพท์แทนนิยามทฤษฎี" /></div>
            </section>
          )}

          {preview ? (
            <section className="archron-panel p-6 max-w-[var(--measure)]">
              <p className="text-xs tracking-widest text-accent">พรีวิว (ไม่เผยแพร่)</p>
              <h3 className="mt-2 font-serif text-2xl text-ivory">{draft.title || "(ยังไม่มีชื่อ)"}</h3>
              <p className="mt-1 text-sm text-muted">{[draft.framework, draft.difficulty, draft.mainThinker].filter(Boolean).join(" · ")}</p>
              {draft.tags.length > 0 ? <p className="mt-2 text-xs text-soft-gold">{draft.tags.join(", ")}</p> : null}
              {draft.coverImage ? (
                <div className="mt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={draft.coverImage} alt={draft.title ? `ภาพปก: ${draft.title}` : "ภาพปก"} className="h-48 w-full rounded-md object-cover" />
                </div>
              ) : null}
              {draft.visualExplanation ? <p className="mt-4 whitespace-pre-line text-soft-ivory">{draft.visualExplanation}</p> : null}
              {draft.technicalMeaning ? <p className="mt-3 whitespace-pre-line text-soft-ivory">{draft.technicalMeaning}</p> : null}
              {draft.bodyMarkdown && draft.bodyMarkdown.trim() !== "" ? (
                <div className="md-body mt-5 border-t border-ink/10 pt-5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.bodyMarkdown}</ReactMarkdown>
                </div>
              ) : null}
            </section>
          ) : null}
        </main>

        <aside className="space-y-6 md:sticky md:top-20 md:self-start">
          <MyContentSearch userId={userId ?? null} />
          <div className="archron-panel p-5">
            <h3 className="font-serif text-base text-ivory">คำแนะนำ</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
              <li>เขียนให้ชัด ไม่ลดทอนแนวคิดจนผิด</li>
              <li>เลี่ยงคำว่า ลึก/คม/ทรงพลัง ถ้าไม่อธิบายว่าอย่างไร</li>
              <li>แยกข้อเท็จจริง แหล่งที่มา และการตีความ</li>
              <li>{"autosave ทุก 2.5 วิ · กด \u201Cบันทึก + เวอร์ชัน\u201D เพื่อเก็บ snapshot"}</li>
            </ul>
          </div>
          <div className="archron-panel p-5">
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
                  ? "พร้อมเผยแพร่ — กดปุ่ม \u201Cเผยแพร่\u201D ด้านบน"
                  : "ยังเผยแพร่ไม่ได้ — ทำรายการที่ยังไม่ผ่าน / แก้ลิงก์เสียให้ครบ"}
              </p>
            ) : null}
          </div>
          <RevisionPanel
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
      )}

      {/* แถบปุ่มล่างสำหรับมือถือ */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-burnished-gold/15 bg-midnight/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button
            onClick={handleManualSave}
            className="flex-1 rounded-md border border-ink/20 px-3 py-2 text-sm text-ivory hover:border-antique-gold hover:bg-antique-gold/5 transition-colors"
            disabled={loadingDraft || publishing}
          >
            บันทึก
          </button>
          <button
            onClick={() => setPreview((v) => !v)}
            disabled={!canPreview || loadingDraft}
            className="flex-1 rounded-md border border-ink/20 px-3 py-2 text-sm text-ivory hover:border-antique-gold hover:bg-antique-gold/5 transition-colors disabled:opacity-40"
          >
            {preview ? "ปิดพรีวิว" : "พรีวิว"}
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing || loadingDraft}
            className="flex-1 rounded-md bg-antique-gold px-3 py-2 text-sm font-semibold text-prima hover:brightness-110 transition-all disabled:opacity-50"
          >
            {publishing ? "..." : "เผยแพร่"}
          </button>
        </div>
      </div>
    </div>
  );
}
