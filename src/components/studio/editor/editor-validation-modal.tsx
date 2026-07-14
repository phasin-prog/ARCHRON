"use client";

import React, { useEffect } from "react";
import type { ValidationIssue } from "@/lib/content/publishing/editor-validation";

export function EditorValidationModal({
  open,
  onClose,
  issues,
  onGoToField,
}: {
  open: boolean;
  onClose: () => void;
  issues: ValidationIssue[];
  onGoToField: (fieldId: string) => void;
}) {
  // ESC key to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const suggestions = issues.filter((i) => i.severity === "suggestion");

  const firstIssue = issues[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-bg-elevated/80 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/15 text-red-600 text-xl shrink-0">
              🛑
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-text-heading">ยังไม่สามารถเผยแพร่เนื้อหาได้ (Cannot publish yet)</h3>
              <p className="text-xs text-text-secondary">
                {errors.length > 0
                  ? `บทความนี้ยังขาดข้อมูลสำคัญที่บังคับใช้ ${errors.length} ส่วน`
                  : `พบข้อเสนอแนะเพื่อยกระดับคุณภาพ ${issues.length} รายการ`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary hover:bg-bg hover:text-text-heading transition-colors text-lg font-bold"
          >
            &times;
          </button>
        </div>

        {/* Issues List */}
        <div className="overflow-y-auto p-6 space-y-6 divide-y divide-border/60">
          {/* Errors Section */}
          {errors.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <span>🛑 ส่วนที่ต้องแก้ไขก่อนเผยแพร่ ({errors.length})</span>
              </h4>
              <div className="space-y-2.5">
                {errors.map((issue, idx) => (
                  <div
                    key={issue.fieldId + idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs transition-all hover:border-red-500/40"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-heading text-sm">{issue.label}</span>
                        <span className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-secondary font-mono">
                          {issue.sectionName}
                        </span>
                      </div>
                      <p className="text-red-700 dark:text-red-300 font-medium">{issue.message}</p>
                      <p className="text-[11px] text-text-secondary italic">{issue.whyItMatters}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onGoToField(issue.fieldId)}
                      className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 font-semibold text-white shadow-sm hover:bg-red-500 transition-all text-xs"
                    >
                      <span>ไปที่ช่องนี้ (Go to field)</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings Section */}
          {warnings.length > 0 && (
            <div className={`space-y-3 ${errors.length > 0 ? "pt-5" : ""}`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span>⚠️ คำเตือนเพื่อยกระดับคุณภาพ ({warnings.length})</span>
              </h4>
              <div className="space-y-2.5">
                {warnings.map((issue, idx) => (
                  <div
                    key={issue.fieldId + idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs transition-all hover:border-amber-500/40"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-heading text-sm">{issue.label}</span>
                        <span className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-secondary font-mono">
                          {issue.sectionName}
                        </span>
                      </div>
                      <p className="text-amber-800 dark:text-amber-300 font-medium">{issue.message}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onGoToField(issue.fieldId)}
                      className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-all text-xs"
                    >
                      <span>ไปที่ช่องนี้</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions Section */}
          {suggestions.length > 0 && (
            <div className={`space-y-3 ${(errors.length > 0 || warnings.length > 0) ? "pt-5" : ""}`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <span>💡 ข้อเสนอแนะเสริมเพื่อความสมบูรณ์แบบ ({suggestions.length})</span>
              </h4>
              <div className="space-y-2.5">
                {suggestions.map((issue, idx) => (
                  <div
                    key={issue.fieldId + idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4 text-xs transition-all hover:border-accent/40"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-text-heading text-sm">{issue.label}</span>
                        <span className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-secondary font-mono">
                          {issue.sectionName}
                        </span>
                      </div>
                      <p className="text-accent font-medium">{issue.message}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onGoToField(issue.fieldId)}
                      className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 font-semibold text-accent hover:bg-accent/20 transition-all text-xs"
                    >
                      <span>ไปที่ช่องนี้</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-border px-6 py-4 bg-bg-elevated/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto rounded-lg border border-border px-5 py-2.5 text-xs font-semibold text-text-secondary hover:bg-bg hover:text-text-heading transition-all"
          >
            ปิดหน้าต่าง และกลับไปแก้ไข
          </button>
          {firstIssue && (
            <button
              type="button"
              onClick={() => onGoToField(firstIssue.fieldId)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 transition-all"
            >
              <span>Go to first issue ({firstIssue.label})</span>
              <span>→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
