"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ValidationIssue } from "@/lib/content/publishing/editor-validation";
import { ClockIcon, CloseIcon, ConceptIcon, CheckIcon } from "@/components/icons";

export function EditorValidationModal({
  open,
  onClose,
  issues,
  onGoToField,
  onConfirmPublish,
}: {
  open: boolean;
  onClose: () => void;
  issues: ValidationIssue[];
  onGoToField: (fieldId: string) => void;
  onConfirmPublish?: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !mounted || typeof document === "undefined") return null;

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const suggestions = issues.filter((i) => i.severity === "suggestion");
  const hasBlockers = errors.length > 0;
  const coachItems = [...warnings, ...suggestions];

  const firstIssue = issues[0];

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-border bg-bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-bg-elevated/80 shrink-0">
          <div className="flex items-center gap-3">
            <span className={`flex h-11 w-11 items-center justify-center rounded-full shrink-0 ${
              hasBlockers ? "bg-red-500/15 text-red-600" : "bg-emerald-500/15 text-emerald-600"
            }`}>
              {hasBlockers ? <ClockIcon className="h-6 w-6" /> : <CheckIcon className="h-6 w-6" />}
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-text-heading">
                {hasBlockers ? "ยังไม่พร้อมเผยแพร่" : "ตรวจสอบก่อนเผยแพร่"}
              </h3>
              <p className="text-xs text-text-secondary">
                {hasBlockers
                  ? `บทความนี้ยังขาดข้อมูลสำคัญ ${errors.length} ส่วน`
                  : coachItems.length > 0
                  ? `ผ่านเกณฑ์ขั้นต่ำแล้ว — มีข้อแนะนำ ${coachItems.length} รายการ`
                  : "เนื้อหาพร้อมเผยแพร่ กดยืนยันด้านล่าง"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary hover:bg-bg hover:text-text-heading transition-colors"
            title="ปิดหน้าต่าง"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Issues List */}
        <div className="overflow-y-auto p-6 space-y-6 divide-y divide-border/60">
          {/* Errors Section */}
          {errors.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" />
                <span>ส่วนที่ต้องแก้ไขก่อนเผยแพร่ ({errors.length})</span>
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
                      <p className="text-red-700 font-medium">{issue.message}</p>
                      <p className="text-[11px] text-text-secondary italic">{issue.whyItMatters}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onGoToField(issue.fieldId)}
                      className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 font-semibold text-white shadow-sm hover:bg-red-500 transition-all text-xs"
                    >
                      <span>ไปที่ช่องนี้</span>
                      <span>→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publishing Coach Section — แสดงเมื่อมี warning/suggestion อย่างน้อย 1 */}
          {coachItems.length > 0 && (
            <div className={`space-y-3 ${errors.length > 0 ? "pt-5" : ""}`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <ConceptIcon className="h-4 w-4" />
                <span>ข้อเสนอแนะก่อนเผยแพร่ ({coachItems.length})</span>
              </h4>
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 space-y-3">
                <p className="text-xs text-text-secondary leading-relaxed">
                  {errors.length === 0
                    ? "บทความของคุณผ่านเกณฑ์ขั้นต่ำแล้ว รายการด้านล่างเป็นข้อแนะนำเพื่อยกระดับคุณภาพ สามารถเผยแพร่ก่อนแล้วค่อยกลับมาเพิ่มเติมได้"
                    : "รายการด้านล่างเป็นข้อแนะนำเพื่อยกระดับคุณภาพ แก้ไขส่วนที่จำเป็นเสร็จแล้วสามารถเผยแพร่ได้"}
                </p>
                <div className="space-y-2">
                  {coachItems.map((issue, idx) => (
                    <div
                      key={issue.fieldId + idx}
                      className="flex items-start gap-2.5 rounded-lg border border-accent/10 bg-bg-card p-3"
                    >
                      <span className="mt-0.5 shrink-0 text-accent">
                        <ConceptIcon className="h-4 w-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text-heading text-xs">{issue.label}</span>
                          <span className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-secondary font-mono">
                            {issue.sectionName}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5">{issue.message}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onGoToField(issue.fieldId)}
                        className="shrink-0 rounded-md border border-accent/30 px-2.5 py-1 text-[11px] font-medium text-accent hover:bg-accent/10 transition-all"
                      >
                        แก้ไข
                      </button>
                    </div>
                  ))}
                </div>
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
            ปิด และกลับไปแก้ไข
          </button>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {hasBlockers && firstIssue && (
              <button
                type="button"
                onClick={() => onGoToField(firstIssue.fieldId)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 transition-all"
              >
                <span>ไปที่ข้อผิดพลาดแรก</span>
                <span>→</span>
              </button>
            )}
            {!hasBlockers && onConfirmPublish && (
              <button
                type="button"
                onClick={onConfirmPublish}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 transition-all"
              >
                <CheckIcon className="h-4 w-4" />
                <span>ยืนยันเผยแพร่</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
