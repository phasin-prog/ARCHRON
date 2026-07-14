"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import { getPublishChecklist, canPublish } from "@/lib/content/publishing/publish-validation";
import type { ValidationIssue } from "@/lib/content/publishing/editor-validation";

export function EditorPublishPanel({
  draft,
  publishTried,
  deadLinks,
  onPublish,
  publishing,
  validationIssues,
}: {
  draft: EditorDraft;
  publishTried: boolean;
  deadLinks: string[];
  onPublish: () => void;
  publishing: boolean;
  validationIssues?: ValidationIssue[];
}) {
  const checklist = getPublishChecklist(draft);
  const legacyReady = canPublish(checklist) && deadLinks.length === 0;

  const errors = validationIssues?.filter((i) => i.severity === "error") ?? [];
  const warnings = validationIssues?.filter((i) => i.severity === "warning") ?? [];
  const suggestions = validationIssues?.filter((i) => i.severity === "suggestion") ?? [];

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-serif text-lg font-semibold text-text-heading">ตรวจสอบก่อนเผยแพร่ (Validation & Publish)</h2>
          <p className="text-xs text-text-secondary">
            กดเผยแพร่เพื่อตรวจสอบความครบถ้วนตามเกณฑ์ Academic Quality หรือดูรายงานข้อผิดพลาด
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          {errors.length > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 text-red-600 px-2.5 py-1 font-bold">
              🛑 {errors.length} Errors
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-600 px-2.5 py-1 font-bold">
              ✓ Ready
            </span>
          )}
          {warnings.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 px-2.5 py-1 font-medium">
              ⚠️ {warnings.length} Warnings
            </span>
          )}
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm bg-bg-elevated/50 p-4 rounded-xl border border-border/80">
        {checklist.map((c) => (
          <li key={c.label} className={`flex items-center gap-2 ${c.ok ? "text-text-body" : "text-text-secondary"}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
              c.ok ? "bg-accent/15 text-accent" : "bg-red-500/15 text-red-500"
            }`}>
              {c.ok ? "\u2713" : "\u2715"}
            </span>
            <span className={c.ok ? "font-medium text-text-heading" : "text-text-secondary"}>{c.label}</span>
          </li>
        ))}
      </ul>

      {deadLinks.length > 0 && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-300" role="alert">
          <span className="font-bold">🛑 พบลิงก์ภายในที่เสีย ({deadLinks.length}):</span> {deadLinks.join(", ")}
        </div>
      )}

      {publishTried && errors.length > 0 && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400 animate-in fade-in">
          ❌ ยังเผยแพร่ไม่ได้ — พบข้อผิดพลาด {errors.length} จุด กรุณากดปุ่มด้านล่างเพื่อเปิดหน้าต่างนำทางแก้ไข
        </p>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={onPublish}
          disabled={publishing}
          className={`w-full rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
            errors.length > 0
              ? "bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110"
              : "bg-accent hover:bg-accent-hover"
          } disabled:opacity-50`}
        >
          {publishing ? (
            <span>กำลังเผยแพร่เนื้อหา...</span>
          ) : errors.length > 0 ? (
            <span>🔍 ตรวจสอบและแก้ไขก่อนเผยแพร่ (Check {errors.length} Issues)</span>
          ) : (
            <span>✨ ยืนยันเผยแพร่สู่คลังความรู้ (Publish Now)</span>
          )}
        </button>
      </div>
    </section>
  );
}
