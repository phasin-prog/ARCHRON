"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { roleFromMetadata, canWrite } from "@/lib/content/utils/roles";
import {
  EMPTY_DRAFT, getPublishChecklist,
} from "@/lib/content/publishing/publish-validation";
import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import { validateEditorDraft } from "@/lib/content/publishing/editor-validation";
import {
  saveDraftAction, saveDraftWithRevisionAction, loadDraftAction,
  publishAction,
} from "@/features/editor/actions";
import { getMyProfileAction } from "@/features/studio/actions/profile-actions";
import { buildDocumentDiagnostics } from "@/lib/content/studio/document-diagnostics";
import { EditorHeader } from "@/components/studio/editor-header";
import { EditorFeedback, type EditorFeedbackData } from "@/components/studio/editor-feedback";
import { EditIcon } from "@/components/icons";
import { useEditorMachine } from "@/features/editor/hooks/useEditorMachine";
import {
  EditorBasicInfo, EditorCta, EditorPublishPanel,
  EditorPreview, EditorValidationModal, GuidePricingEditor,
} from "@/components/studio/editor";
import { RevisionPanel } from "@/components/studio/revision-panel";
import {
  StudioIdeWorkspace,
  BlueprintSelectorModal,
  type SidebarPanelItem,
} from "@/components/studio/ide";
import {
  MetadataReviewPanel,
  DiagnosticsPanel,
  OutlinePanel,
} from "@/components/studio/ide/panels";
import type { BlueprintId } from "@/lib/content/studio/blueprints";

export default function StudioEditorPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const { state, dispatch, updateField } = useEditorMachine(EMPTY_DRAFT);
  const { draft, mode } = state;

  const [feedback, setFeedback] = useState<EditorFeedbackData | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [revisionKey, setRevisionKey] = useState(0);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);
  const [showAdvancedForms, setShowAdvancedForms] = useState(false);
  const goToFieldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const role = roleFromMetadata(user?.publicMetadata);
  const canSave = draft.slug.trim() !== "" && draft.title.trim() !== "";
  const ct = draft.contentType;
  const isGuidePricing = draft.slug === "guide-pricing";
  const canPreview = !isGuidePricing && draft.title.trim() !== "" && draft.contentType !== "";
  const checklist = getPublishChecklist(draft);

  const validationResult = useMemo(() => validateEditorDraft(draft), [draft]);

  const diagnostics = useMemo(() => buildDocumentDiagnostics(draft), [draft]);
  const { analysis, health: healthReport } = diagnostics;

  const sidebarPanels = useMemo<SidebarPanelItem[]>(() => [
    {
      id: "outline",
      label: "โครงสร้าง",
      icon: "list",
      badge: analysis.headings.length > 0 ? analysis.headings.length : undefined,
      content: (
        <OutlinePanel
          headings={analysis.headings}
          onHeadingClick={(id) => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      ),
    },
    {
      id: "health",
      label: "สุขภาพความรู้",
      icon: "health_and_safety",
      badge: `${healthReport.totalScore}/100`,
      content: (
        <DiagnosticsPanel
          report={healthReport}
          onGoToLineOrSection={(target) => {
            handleGoToField(String(target));
          }}
        />
      ),
    },
    {
      id: "metadata",
      label: "ข้อมูลสกัด",
      icon: "database",
      content: (
        <MetadataReviewPanel
          draft={draft}
          analysis={analysis}
          onUpdateDraft={updateField}
        />
      ),
    },
  ], [analysis, healthReport, draft, updateField]);

  function handleSelectBlueprint(
    blueprintId: BlueprintId,
    generatedMdx: string,
    initialTitle?: string,
    initialSlug?: string
  ) {
    updateField("bodyMarkdown", generatedMdx);
    if (initialTitle) updateField("title", initialTitle);
    if (initialSlug) updateField("slug", initialSlug);
    setShowBlueprintModal(false);
    showSuccess(`ใช้แม่พิมพ์ความรู้ "${blueprintId}" สำหรับสร้างเนื้อหาแล้ว`);
  }


  const deadLinks = diagnostics.links.deadTargets;

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
        showError(result.error);
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

  useEffect(() => {
    return () => {
      if (goToFieldTimerRef.current) clearTimeout(goToFieldTimerRef.current);
    };
  }, []);

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

  function handleGoToField(fieldId: string) {
    setShowValidationModal(false);
    if (goToFieldTimerRef.current) clearTimeout(goToFieldTimerRef.current);
    goToFieldTimerRef.current = setTimeout(() => {
      goToFieldTimerRef.current = null;
      const containerId = `container-${fieldId}`;
      const container = document.getElementById(containerId) || document.getElementById(fieldId);
      const input = document.getElementById(fieldId) as HTMLElement | null;

      if (container) {
        container.scrollIntoView({ behavior: "smooth", block: "center" });
        container.classList.add("ring-2", "ring-red-500", "ring-offset-4", "ring-offset-bg", "bg-red-500/10");
        setTimeout(() => {
          container.classList.remove("ring-2", "ring-red-500", "ring-offset-4", "ring-offset-bg", "bg-red-500/10");
        }, 3000);
      } else if (input) {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      if (input && typeof input.focus === "function") {
        input.focus();
      }
    }, 200);
  }

  async function handlePublish() {
    dispatch({ type: "PUBLISH_TRIED" });
    if (!userId) { showError("ยังไม่ได้เข้าสู่ระบบ"); return; }
    if (!canSave) { showError("ต้องมี Title และ Slug ก่อนเผยแพร่"); return; }
    setShowValidationModal(true);
  }

  async function confirmPublish() {
    setShowValidationModal(false);
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
          <EditIcon className="h-6 w-6" />
        </span>
        <h1 className="mt-6 font-serif text-2xl text-text-heading">ห้องเขียนสำหรับนักเขียน</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary/70">
          บัญชีของคุณเป็นผู้ใช้ทั่วไป (อ่านอย่างเดียว) หากต้องการเขียนและเรียบเรียงเนื้อหา
          กรุณาส่งคำขอเป็นนักเขียนเพื่อให้แอดมินพิจารณา
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/studio/profile" className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-accent px-6 py-2.5 text-sm font-semibold text-text-inverse hover:brightness-110 transition-all">
            <EditIcon className="h-4 w-4" />
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

      {mode !== "preview" && (
        <div className="border-b border-border/60 bg-bg-card/50 px-6 py-2.5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowBlueprintModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-text-inverse transition-all"
              >
                <EditIcon className="h-4 w-4" />
                📑 เลือกแม่พิมพ์ความรู้ (Knowledge Blueprint)
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span className="hidden sm:inline">MDX คือแหล่งความรู้หลัก (Single Source of Truth)</span>
              <button
                type="button"
                onClick={() => setShowAdvancedForms((prev) => !prev)}
                className="underline hover:text-accent transition-colors"
              >
                {showAdvancedForms ? "▲ ซ่อนฟอร์มข้อมูลขั้นสูง" : "▼ แสดงฟอร์มข้อมูลขั้นสูง"}
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === "preview" ? (
        <EditorPreview draft={draft} displayName={state.displayName ?? undefined} />
      ) : (
        <div className="space-y-6">
          {isGuidePricing ? (
            <div className="mx-auto max-w-5xl px-4 pt-6">
              <GuidePricingEditor
                bodyMarkdown={draft.bodyMarkdown}
                onChange={(bodyMarkdown) => updateField("bodyMarkdown", bodyMarkdown)}
              />
            </div>
          ) : (
            <div className="h-[calc(100vh-140px)] min-h-[600px] border-b border-border">
              <StudioIdeWorkspace
                draft={draft}
                onChangeDraft={updateField}
                onSave={handleManualSave}
                onPublish={handlePublish}
                publishing={state.publishing}
                autoSaveState={state.autoState}
                sidebarPanels={sidebarPanels}
              />
            </div>
          )}

          <div className="mx-auto max-w-5xl px-4 pb-12 space-y-8">
            {showAdvancedForms && !isGuidePricing && (
              <div className="space-y-8 rounded-xl border border-border bg-bg-card p-6 shadow-xs animate-fade-in">
                <div className="border-b border-border pb-3">
                  <h3 className="font-serif text-lg font-bold text-text-heading">🛠️ ฟอร์มแก้ไขข้อมูลขั้นสูง (Advanced Form Overrides)</h3>
                  <p className="text-xs text-text-secondary">ใช้สำหรับปรับแต่งค่าฟิลด์พิเศษ หรือข้อมูลที่ต้องการกำหนดค่าเฉพาะเจาะจงนอกเหนือจาก MDX</p>
                </div>
                <EditorBasicInfo draft={draft} updateField={updateField} validationIssues={validationResult.byField} />
                <EditorCta draft={draft} updateField={updateField} />
              </div>
            )}

            <EditorPublishPanel
              draft={draft} publishTried={state.publishTried}
              deadLinks={deadLinks} onPublish={handlePublish}
              publishing={state.publishing} validationIssues={validationResult.all}
            />

            <RevisionPanel
              entryId={entryId}
              reloadKey={revisionKey}
              onRestore={handleRestore}
            />
          </div>
        </div>
      )}

      <EditorValidationModal
        open={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        issues={validationResult.all}
        onGoToField={handleGoToField}
        onConfirmPublish={validationResult.canPublish ? confirmPublish : undefined}
      />

      <BlueprintSelectorModal
        open={showBlueprintModal}
        onClose={() => setShowBlueprintModal(false)}
        onSelectBlueprint={handleSelectBlueprint}
        currentDraftTitle={draft.title}
      />
    </div>
  );
}
