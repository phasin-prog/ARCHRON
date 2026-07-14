"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { roleFromMetadata, canWrite } from "@/lib/content/utils/roles";
import {
  EMPTY_DRAFT, getPublishChecklist, canPublish,
} from "@/lib/content/publishing/publish-validation";
import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import {
  saveDraftAction, saveDraftWithRevisionAction, loadDraftAction,
  publishAction,
} from "@/features/editor/actions";
import { getMyProfileAction } from "@/features/studio/actions/profile-actions";
import { findDeadLinks } from "@/lib/content/publishing/internal-links";
import { EditorHeader } from "@/components/studio/editor-header";
import { EditorFeedback, type EditorFeedbackData } from "@/components/studio/editor-feedback";
import { EditorIcon } from "@/components/studio/editor-icon";
import { useEditorMachine } from "@/features/editor/hooks/useEditorMachine";
import {
  EditorBasicInfo, EditorConceptFields,
  EditorPersonFields, EditorBookFields, EditorSchoolFields,
  EditorBody, EditorRelations, EditorCta, EditorPublishPanel,
  EditorPreview,
} from "@/components/studio/editor";
import { RevisionPanel } from "@/components/studio/revision-panel";

export default function StudioEditorPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, dispatch, updateField } = useEditorMachine(EMPTY_DRAFT);
  const { draft, mode } = state;

  const [feedback, setFeedback] = useState<EditorFeedbackData | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [revisionKey, setRevisionKey] = useState(0);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const role = roleFromMetadata(user?.publicMetadata);
  const canSave = draft.slug.trim() !== "" && draft.title.trim() !== "";
  const ct = draft.contentType;
  const canPreview = draft.title.trim() !== "" && draft.contentType !== "";
  const checklist = getPublishChecklist(draft);

  const deadLinks = useMemo(
    () => Array.from(new Set(findDeadLinks(`${draft.visualExplanation} ${draft.technicalMeaning} ${draft.bodyMarkdown}`))),
    [draft.visualExplanation, draft.technicalMeaning, draft.bodyMarkdown],
  );

  function showError(text: string) { setFeedback({ type: "error", title: "เกิดข้อผิดพลาด", message: text }); }
  function showSuccess(text: string) { setFeedback({ type: "success", title: "สำเร็จ", message: text }); }

  // Load profile display name
  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      const p = await getMyProfileAction();
      if (active && p?.display_name) dispatch({ type: "SET_DISPLAY_NAME", name: p.display_name });
    })();
    return () => { active = false; };
  }, [userId, dispatch]);

  // Load draft from ?slug= or create from ?type=
  useEffect(() => {
    const slug = searchParams.get("slug");
    const type = searchParams.get("type");
    if (!userId) return;

    if (slug) {
      let active = true;
      setLoadingDraft(true);
      dispatch({ type: "SET_MODE", payload: "editing" });
      (async () => {
        try {
          const result = await loadDraftAction(slug);
          if (active && result.draft) {
            dispatch({ type: "LOAD_DRAFT", draft: result.draft });
            if (result.authorId) dispatch({ type: "SET_ORIGINAL_AUTHOR", id: result.authorId, name: result.authorName ?? null });
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
      dispatch({ type: "SET_MODE", payload: "editing" });
      updateField("contentType", type);
      updateField("id", crypto.randomUUID());
    }
  }, [searchParams, userId, dispatch, updateField]);

  // Auto-save (debounced)
  useEffect(() => {
    if (!userId || !canSave || mode !== "editing") return;
    const timer = setTimeout(async () => {
      dispatch({ type: "AUTO_SAVE_START" });
      const result = await saveDraftAction(draft);
      if (result.error) {
        dispatch({ type: "AUTO_SAVE_DONE" });
      } else {
        dispatch({ type: "AUTO_SAVE_DONE" });
        const row = result.data as { id?: string } | null;
        const id = row?.id ?? entryId;
        if (id && id !== entryId) setEntryId(id);
        setFeedback(null);
      }
    }, 2500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, userId]);

  async function handleManualSave() {
    if (!userId) { showError("ยังไม่ได้เข้าสู่ระบบ"); return; }
    if (!canSave) { showError("ต้องมี Title และ Slug ก่อนบันทึก"); return; }
    const result = await saveDraftWithRevisionAction(draft);
    if (result.error) { showError(`บันทึกไม่สำเร็จ: ${result.error}`); return; }
    const row = result.data as { id?: string } | null;
    const id = row?.id ?? entryId;
    if (id && id !== entryId) setEntryId(id);
    setRevisionKey((k) => k + 1);
    dispatch({ type: "AUTO_SAVE_DONE" });
    showSuccess("บันทึก + เวอร์ชันแล้ว");
  }

  async function handlePublish() {
    dispatch({ type: "PUBLISH_TRIED" });
    if (!userId) { showError("ยังไม่ได้เข้าสู่ระบบ"); return; }
    if (!canSave) { showError("ต้องมี Title และ Slug ก่อนเผยแพร่"); return; }
    if (!canPublish(checklist)) {
      showError("ยังเผยแพร่ไม่ได้ — ทำรายการใน Publish Checklist ให้ครบก่อน");
      return;
    }
    if (deadLinks.length > 0) {
      showError(`พบลิงก์เสีย ${deadLinks.length} รายการ: ${deadLinks.join(", ")}`);
      return;
    }
    dispatch({ type: "PUBLISH_START" });
    const result = await publishAction(draft);
    if (result.error) {
      dispatch({ type: "PUBLISH_DONE" });
      showError(`เผยแพร่ไม่สำเร็จ: ${result.error}`);
      return;
    }
    const row = result.data as { id?: string } | null;
    const id = row?.id ?? entryId;
    if (id && id !== entryId) setEntryId(id);
    updateField("status", "published");
    dispatch({ type: "PUBLISH_DONE" });
    showSuccess("เผยแพร่แล้ว");
  }

  function handleRestore(snapshot: EditorDraft) {
    dispatch({ type: "LOAD_DRAFT", draft: snapshot });
    setRevisionKey((k) => k + 1);
    showSuccess("กู้คืนเวอร์ชันแล้ว — ยังไม่ได้บันทึก กด Save เพื่อยืนยัน");
  }

  function handleTogglePreview() {
    dispatch({ type: "SET_MODE", payload: mode === "preview" ? "editing" : "preview" });
  }

  // Auth gate: no write permission
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

  // Editor mode
  return (
    <div className="min-h-screen">
      <EditorHeader
        draft={draft} autoState={state.autoState} savedAt={state.savedAt}
        loadingDraft={loadingDraft} publishing={state.publishing}
        preview={mode === "preview"} canPreview={canPreview}
        onSave={handleManualSave} onPublish={handlePublish}
        onTogglePreview={handleTogglePreview}
        role={role} originalAuthorId={state.originalAuthorId}
        originalAuthorName={state.originalAuthorName}
        userId={userId ?? null} displayName={state.displayName}
      />

      <EditorFeedback feedback={feedback} onClose={() => setFeedback(null)} />

      {mode === "preview" ? (
        <EditorPreview draft={draft} displayName={state.displayName ?? undefined} />
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          <EditorBasicInfo draft={draft} updateField={updateField} />

          {ct === "concept" && <EditorConceptFields draft={draft} updateField={updateField} />}
          {ct === "person" && <EditorPersonFields draft={draft} updateField={updateField} />}
          {ct === "book" && <EditorBookFields draft={draft} updateField={updateField} />}
          {ct === "school" && <EditorSchoolFields draft={draft} updateField={updateField} />}

          <EditorBody draft={draft} updateField={updateField} />
          <EditorRelations draft={draft} updateField={updateField} />
          <EditorCta draft={draft} updateField={updateField} />

          <EditorPublishPanel
            draft={draft} publishTried={state.publishTried}
            deadLinks={deadLinks} onPublish={handlePublish}
            publishing={state.publishing}
          />

          <RevisionPanel
            entryId={entryId}
            reloadKey={revisionKey}
            onRestore={handleRestore}
          />
        </div>
      )}
    </div>
  );
}
