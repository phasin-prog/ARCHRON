"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { EditorStatusBar } from "@/components/studio/editor-status-bar";
import { EditorIcon } from "@/components/studio/editor-icon";
import { statusMeta } from "@/lib/content/cosmology";
import { isAdmin, type Role } from "@/lib/content/roles";
import type { EditorDraft } from "@/lib/content/publish-validation";

type Props = {
  draft: EditorDraft;
  autoState: "idle" | "saving" | "saved";
  savedAt: string | null;
  loadingDraft: boolean;
  publishing: boolean;
  preview: boolean;
  canPreview: boolean;
  onSave: () => void;
  onPublish: () => void;
  onTogglePreview: () => void;
  role: Role;
  originalAuthorId: string | null;
  originalAuthorName: string | null;
  userId: string | null;
  displayName: string | null;
};

export function EditorHeader({
  draft, autoState, savedAt, loadingDraft, publishing,
  preview, canPreview, onSave, onPublish, onTogglePreview,
  role, originalAuthorId, originalAuthorName, userId, displayName,
}: Props) {
  const status = statusMeta(draft.status);
  const editingOther = isAdmin(role) && originalAuthorId && originalAuthorId !== userId;

  return (
    <div className="sticky top-0 z-40 border-b border-accent/15 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/studio" className="flex items-center gap-1.5 text-sm text-text-body hover:text-accent">
            <EditorIcon name="arrow_left" className="h-4 w-4" />
            กลับห้องเขียน
          </Link>
          {displayName && (
            <span className="hidden text-xs text-text-secondary sm:inline">
              {displayName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-[1.4]"
            style={{ backgroundColor: `${status.accent}1f`, color: status.accent }}
          >
            <EditorIcon name={draft.status === "published" ? "check_circle" : "edit_note"} className="h-3 w-3" />
            {draft.status}
          </span>
          <EditorStatusBar autoState={autoState} savedAt={savedAt} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            disabled={loadingDraft || publishing}
            className="rounded-md border border-text-heading/20 px-4 py-2 text-sm text-text-heading hover:border-accent hover:bg-accent/5 active:scale-[0.97] transition-colors disabled:opacity-40"
          >
            บันทึก + เวอร์ชัน
          </button>
          <button
            onClick={onTogglePreview}
            disabled={!canPreview || loadingDraft}
            className="rounded-md border border-text-heading/20 px-4 py-2 text-sm text-text-heading hover:border-accent hover:bg-accent/5 active:scale-[0.97] transition-colors disabled:opacity-40"
          >
            {preview ? "ปิดพรีวิว" : "พรีวิว"}
          </button>
          <button
            onClick={onPublish}
            disabled={publishing || loadingDraft}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-text-inverse hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-50"
          >
            {publishing ? "กำลังเผยแพร่..." : "เผยแพร่"}
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      {editingOther && (
        <div className="mx-auto max-w-6xl px-6 pb-2">
          <div className="rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-accent">
            <EditorIcon name="edit_note" className="mr-1 inline h-3.5 w-3.5 align-middle" />
            กำลังแก้ไขเนื้อหาของ: <span className="font-semibold">{originalAuthorName || originalAuthorId}</span>
          </div>
        </div>
      )}
    </div>
  );
}
