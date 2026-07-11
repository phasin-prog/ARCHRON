"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { roleFromMetadata, canWrite } from "@/lib/content/roles";
import {
  EMPTY_DRAFT, getPublishChecklist, canPublish, slugify, type EditorDraft, type EditorReference,
} from "@/lib/content/publish-validation";
import {
  saveDraftAction, saveDraftWithRevisionAction, loadDraftAction,
  publishAction,
} from "@/features/editor/actions";
import { findDeadLinks } from "@/lib/content/internal-links";
import { getMyProfileAction } from "@/features/studio/actions/profile-actions";
import { ContentTypeSelector } from "@/components/studio/content-type-selector";
import { EditorHeader } from "@/components/studio/editor-header";
import { EditorForm } from "@/components/studio/editor-form";
import { EditorSidebar } from "@/components/studio/editor-sidebar";
import { EditorFeedback, type EditorFeedbackData } from "@/components/studio/editor-feedback";
import { EditorIcon } from "@/components/studio/editor-icon";

export default function StudioEditorPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();

  const [draft, setDraft] = useState<EditorDraft>(EMPTY_DRAFT);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [autoState, setAutoState] = useState<"idle" | "saving" | "saved">("idle");
  const [feedback, setFeedback] = useState<EditorFeedbackData | null>(null);
  const [preview, setPreview] = useState(false);
  const [publishTried, setPublishTried] = useState(false);
  const [newRef, setNewRef] = useState<EditorReference>({ sourceType: "primary-source", title: "", relatedClaim: "" });
  const [publishing, setPublishing] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [showSelector, setShowSelector] = useState(true);
  const [originalAuthorId, setOriginalAuthorId] = useState<string | null>(null);
  const [originalAuthorName, setOriginalAuthorName] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("basic");

  const canSave = draft.slug.trim() !== "" && draft.title.trim() !== "";
  const role = roleFromMetadata(user?.publicMetadata);
  const ct = draft.contentType;

  const show = {
    shortDesc: true, status: true, contentType: true,
    framework: ["article", "concept", "person", "book"].includes(ct),
    difficulty: ["article", "concept"].includes(ct),
    mainThinker: ["article", "concept", "person", "book"].includes(ct),
    school: ["article", "concept"].includes(ct),
    tags: true, visualExplanation: true,
    technicalMeaning: ["article", "concept", "person"].includes(ct),
    bodyMarkdown: ct === "article",
    coverImage: ct === "article",
    relatedConcepts: ["article", "concept", "person", "school", "book"].includes(ct),
    references: true,
    roots: ["article", "concept"].includes(ct),
  };

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      const p = await getMyProfileAction();
      if (active && p?.display_name) setDisplayName(p.display_name);
    })();
    return () => { active = false; };
  }, [userId]);

  useEffect(() => {
    const slug = searchParams.get("slug");
    const type = searchParams.get("type");
    if (slug) {
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
          if (active) showError(`โหลดเนื้อหาไม่สำเร็จ: ${err instanceof Error ? err.message : "ข้อผิดพลาด"}`);
        } finally {
          if (active) setLoadingDraft(false);
        }
      })();
      return () => { active = false; };
    }
    if (type) {
      setShowSelector(false);
      setDraft((d) => ({ ...d, id: crypto.randomUUID(), contentType: type }));
    }
  }, [searchParams]);

  function set<K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function showError(text: string) { setFeedback({ type: "error", title: "เกิดข้อผิดพลาด", message: text }); }
  function showSuccess(text: string) { setFeedback({ type: "success", title: "สำเร็จ", message: text }); }

  async function persist(snapshot: boolean): Promise<boolean> {
    if (!userId || !canSave) return false;
    const action = snapshot ? saveDraftWithRevisionAction : saveDraftAction;
    const result = await action(draft);
    if (result.error) { showError(`บันทึกไม่สำเร็จ: ${result.error}`); return false; }
    setFeedback(null);
    const row = result.data as { id?: string } | null;
    const id = row?.id ?? entryId;
    if (id && id !== entryId) setEntryId(id);
    setSavedAt(new Date().toLocaleString("th-TH"));
    if (snapshot) setReloadKey((k) => k + 1);
    return true;
  }

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
    if (!userId) { showError("ยังไม่ได้เข้าสู่ระบบ"); return; }
    if (!canSave) { showError("ต้องมี Title และ Slug ก่อนบันทึก"); return; }
    const ok = await persist(true);
    if (ok) showSuccess("บันทึก + เวอร์ชันแล้ว");
  }

  const deadLinks = useMemo(
    () => Array.from(new Set(findDeadLinks(`${draft.visualExplanation} ${draft.technicalMeaning} ${draft.bodyMarkdown}`))),
    [draft.visualExplanation, draft.technicalMeaning, draft.bodyMarkdown],
  );

  async function handlePublish() {
    setPublishTried(true);
    if (!userId) { showError("ยังไม่ได้เข้าสู่ระบบ"); return; }
    if (!canSave) { showError("ต้องมี Title และ Slug ก่อนเผยแพร่"); return; }
    if (!canPublish(getPublishChecklist(draft, draft.contentType))) {
      showError("ยังเผยแพร่ไม่ได้ — ทำรายการใน Publish Checklist ให้ครบก่อน");
      return;
    }
    if (deadLinks.length > 0) {
      showError(`พบลิงก์เสีย ${deadLinks.length} รายการ: ${deadLinks.join(", ")}`);
      return;
    }
    setPublishing(true);
    const result = await publishAction(draft);
    if (result.error) { setPublishing(false); showError(`เผยแพร่ไม่สำเร็จ: ${result.error}`); return; }
    const row = result.data as { id?: string } | null;
    const id = row?.id ?? entryId;
    if (id && id !== entryId) setEntryId(id);
    setDraft((d) => ({ ...d, status: "published" }));
    setSavedAt(new Date().toLocaleString("th-TH"));
    setPublishing(false);
    showSuccess("เผยแพร่แล้ว");
  }

  const checklist = getPublishChecklist(draft, draft.contentType);
  const canPreview = draft.title.trim() !== "" && draft.contentType !== "";

  useEffect(() => {
    const els = document.querySelectorAll("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
          );
          const el = top.target as HTMLElement;
          setActiveSection(el.getAttribute("data-section") || "basic");
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (user && !canWrite(role)) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 text-accent">
          <EditorIcon name="edit_note" className="h-6 w-6" accent="var(--color-accent)" />
        </span>
        <h1 className="mt-6 font-serif text-2xl text-text-heading">ห้องเขียนสำหรับนักเขียน</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary/70">
          บัญชีของคุณเป็นผู้ใช้ทั่วไป (อ่านอย่างเดียว) หากต้องการเขียนและเรียบเรียงเนื้อหา
          กรุณาส่งคำขอเป็นนักเขียนเพื่อให้แอดมินพิจารณา
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/studio/profile" className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-accent px-6 py-2.5 text-sm font-semibold text-text-inverse hover:brightness-110 transition-all">
            <EditorIcon name="edit_note" className="h-4 w-4" />
            ขอเป็นนักเขียน
          </Link>
          <Link href="/studio" className="inline-flex min-h-[44px] items-center justify-center gap-2 border border-accent/40 px-6 py-2.5 text-sm text-accent hover:bg-accent/10">
            กลับห้องเขียน
          </Link>
        </div>
      </main>
    );
  }

  if (showSelector) return <ContentTypeSelector />;

  return (
    <div className="min-h-screen">
      <EditorHeader
        draft={draft} autoState={autoState} savedAt={savedAt}
        loadingDraft={loadingDraft} publishing={publishing}
        preview={preview} canPreview={canPreview}
        onSave={handleManualSave} onPublish={handlePublish}
        onTogglePreview={() => setPreview((v) => !v)}
        role={role} originalAuthorId={originalAuthorId}
        originalAuthorName={originalAuthorName}
        userId={userId ?? null} displayName={displayName}
      />

      <EditorFeedback feedback={feedback} onClose={() => setFeedback(null)} />

      {loadingDraft ? (
        <div className="mx-auto max-w-6xl gap-8 px-6 py-10 pb-28 md:grid md:grid-cols-[1fr_320px] lg:pb-10">
          <main className="space-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-text-heading/10" />
            ))}
          </main>
          <aside className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 w-full animate-pulse rounded bg-text-heading/10" />
            ))}
          </aside>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 pb-28 md:grid-cols-[1fr_320px] lg:pb-10">
          <EditorForm
            draft={draft} onChange={set} show={show}
            preview={preview}
            newRef={newRef} setNewRef={setNewRef}
            onAddRef={() => {
              if (newRef.title.trim() === "") return;
              set("references", [...draft.references, newRef]);
              setNewRef({ sourceType: "primary-source", title: "", relatedClaim: "" });
            }}
            onRemoveRef={(i) => set("references", draft.references.filter((_, j) => j !== i))}
            activeSection={activeSection}
            onSectionClick={scrollToSection}
          />
          <EditorSidebar
            checklist={checklist} deadLinks={deadLinks}
            publishTried={publishTried} entryId={entryId}
            reloadKey={reloadKey}
            onRestore={(d) => setDraft(d)}
            userId={userId ?? null}
            linkSuggestionText={`${draft.visualExplanation} ${draft.technicalMeaning}`}
            onInsertLink={(term) => set("technicalMeaning", draft.technicalMeaning + (draft.technicalMeaning ? " " : "") + `[[${term}]]`)}
          />
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-accent/15 bg-bg/90 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button onClick={handleManualSave} disabled={loadingDraft || publishing}
            className="flex-1 min-h-[44px] rounded-md border border-text-heading/20 px-3 py-2 text-sm text-text-heading hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-40">
            บันทึก
          </button>
          <button onClick={() => setPreview((v) => !v)} disabled={!canPreview || loadingDraft}
            className="flex-1 min-h-[44px] rounded-md border border-text-heading/20 px-3 py-2 text-sm text-text-heading hover:border-accent hover:bg-accent/5 transition-colors disabled:opacity-40">
            {preview ? "ปิดพรีวิว" : "พรีวิว"}
          </button>
          <button onClick={handlePublish} disabled={publishing || loadingDraft}
            className="flex-1 min-h-[44px] rounded-md bg-accent px-3 py-2 text-sm font-semibold text-text-inverse hover:brightness-110 transition-all disabled:opacity-50">
            {publishing ? "..." : "เผยแพร่"}
          </button>
        </div>
      </div>
    </div>
  );
}
