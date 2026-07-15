"use client";

import React from "react";
import type {
  KnowledgeHealthReport,
  KnowledgeHealthIssue,
  HealthCategory,
} from "@/lib/content/studio/knowledge-health";
import { HEALTH_CATEGORY_LABELS } from "@/lib/content/studio/knowledge-health";

export interface DiagnosticsPanelProps {
  report: KnowledgeHealthReport;
  onGoToLineOrSection?: (target: string | number) => void;
}

const STATUS_META: Record<
  KnowledgeHealthReport["status"],
  { label: string; badgeClass: string; barClass: string; icon: string; desc: string }
> = {
  excellent: {
    label: "ดีเยี่ยม (Excellent)",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    barClass: "bg-emerald-600",
    icon: "🟢",
    desc: "เนื้อหามีความสมบูรณ์และเข้มข้นทางวิชาการตามมาตรฐานคลังความรู้ Archron",
  },
  good: {
    label: "ดี (Good)",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    barClass: "bg-[--color-accent]",
    icon: "🔵",
    desc: "อยู่ในเกณฑ์มาตรฐานที่ดี สามารถปรับปรุงรายละเอียดบางส่วนให้สมบูรณ์ยิ่งขึ้น",
  },
  needs_work: {
    label: "ต้องปรับปรุง (Needs Work)",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    barClass: "bg-amber-500",
    icon: "🟡",
    desc: "เนื้อหายังขาดองค์ประกอบวิชาการหรือการเชื่อมโยงโครงข่ายความรู้ที่สำคัญ",
  },
  critical: {
    label: "วิกฤต (Critical)",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    barClass: "bg-rose-600",
    icon: "🔴",
    desc: "จำเป็นต้องแก้ไขโครงสร้างพื้นฐานหรือเพิ่มรายละเอียดเนื้อหาก่อนการเผยแพร่",
  },
};

const SEVERITY_META: Record<
  KnowledgeHealthIssue["severity"],
  { icon: string; badgeClass: string; label: string; borderClass: string }
> = {
  critical: {
    icon: "🚨",
    badgeClass: "bg-rose-100/80 text-rose-800 border-rose-200",
    label: "วิกฤต",
    borderClass: "border-l-4 border-l-rose-500 border-[--color-border]",
  },
  warning: {
    icon: "⚠️",
    badgeClass: "bg-amber-100/80 text-amber-800 border-amber-200",
    label: "ข้อควรระวัง",
    borderClass: "border-l-4 border-l-amber-500 border-[--color-border]",
  },
  info: {
    icon: "💡",
    badgeClass: "bg-blue-100/80 text-blue-800 border-blue-200",
    label: "ข้อแนะนำ",
    borderClass: "border-l-4 border-l-blue-500 border-[--color-border]",
  },
};

const CATEGORY_ORDER: HealthCategory[] = [
  "structure",
  "academic",
  "references",
  "relations",
  "terminology",
];

export function DiagnosticsPanel({
  report,
  onGoToLineOrSection,
}: DiagnosticsPanelProps) {
  const statusInfo = STATUS_META[report.status] || STATUS_META.critical;

  return (
    <div className="space-y-6 text-sm text-[--color-text-body] font-[--font-ui]" lang="th">
      {/* 1. Overall Health Score Card */}
      <section className="p-4 rounded-xl bg-[--color-bg-card] border border-[--color-border] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-[--color-text-heading]">
              ระดับสุขภาพคลังความรู้ (Knowledge Health Score)
            </h4>
            <p className="text-xs text-[--color-text-secondary] mt-0.5">
              ประเมินความสมบูรณ์เชิงวิชาการและโครงข่ายความรู้ตามเวลาจริง
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}
          >
            <span>{statusInfo.icon}</span>
            <span>{statusInfo.label}</span>
          </span>
        </div>

        {/* Score Bar / Display */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono tracking-tight text-[--color-text-heading]">
                {report.totalScore}
              </span>
              <span className="text-xs font-semibold text-[--color-text-secondary]">/ 100 คะแนน</span>
            </div>
            <span className="text-xs text-[--color-text-secondary] font-mono">
              {report.issues.length} ข้อวินิจฉัย
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-[--color-bg-elevated] overflow-hidden border border-[--color-border]/60">
            <div
              className={`h-full transition-all duration-500 rounded-full ${statusInfo.barClass}`}
              style={{ width: `${Math.max(5, Math.min(100, report.totalScore))}%` }}
            />
          </div>
          <p className="text-xs text-[--color-text-secondary] leading-relaxed pt-1">
            {statusInfo.desc}
          </p>
        </div>
      </section>

      {/* 2. Breakdown by Category */}
      <section className="p-4 rounded-xl bg-[--color-bg-card] border border-[--color-border] shadow-xs space-y-3">
        <h4 className="font-medium text-[--color-text-heading] text-xs uppercase tracking-wider text-[--color-text-secondary]">
          รายละเอียดคะแนนตามหมวดหมู่ (Category Breakdown)
        </h4>

        <div className="space-y-3 pt-1">
          {CATEGORY_ORDER.map((catKey) => {
            const cat = report.categories[catKey] || {
              category: catKey,
              score: 0,
              maxScore: 20,
              labelTh: HEALTH_CATEGORY_LABELS[catKey] || catKey,
            };
            const percentage = Math.round((cat.score / Math.max(1, cat.maxScore)) * 100);

            // สีของหลอดคะแนนย่อย
            let subBarClass = "bg-[--color-accent]";
            if (percentage >= 80) subBarClass = "bg-emerald-600";
            else if (percentage < 50) subBarClass = "bg-rose-500";
            else if (percentage < 70) subBarClass = "bg-amber-500";

            return (
              <div key={catKey} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[--color-text-heading]">
                    {cat.labelTh}
                  </span>
                  <span className="font-mono font-semibold text-[--color-text-heading]">
                    {cat.score}{" "}
                    <span className="text-[--color-text-secondary] font-normal">
                      / {cat.maxScore}
                    </span>
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[--color-bg-elevated] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${subBarClass}`}
                    style={{ width: `${Math.max(5, Math.min(100, percentage))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Scrollable List of Issues */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-[--color-text-heading] text-xs uppercase tracking-wider text-[--color-text-secondary]">
            รายการข้อวินิจฉัยและคำแนะนำ ({report.issues.length})
          </h4>
        </div>

        {report.issues.length > 0 ? (
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {report.issues.map((issue) => {
              const sev = SEVERITY_META[issue.severity] || SEVERITY_META.info;

              return (
                <div
                  key={issue.id}
                  className={`p-3.5 rounded-xl bg-[--color-bg-card] border shadow-2xs space-y-2 transition-all ${sev.borderClass}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-medium text-[--color-text-heading] text-xs">
                      <span className="text-sm">{sev.icon}</span>
                      <span>{issue.title}</span>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border ${sev.badgeClass}`}
                    >
                      {sev.label}
                    </span>
                  </div>

                  <p className="text-xs text-[--color-text-body] leading-relaxed">
                    {issue.description}
                  </p>

                  {issue.suggestion && (
                    <div className="p-2.5 rounded-lg bg-[--color-bg-elevated]/70 border border-[--color-border]/50 text-xs text-[--color-text-secondary] space-y-1">
                      <div className="font-semibold text-[--color-text-heading] flex items-center gap-1">
                        <span>💡 คำแนะนำ:</span>
                      </div>
                      <p className="leading-relaxed">{issue.suggestion}</p>
                    </div>
                  )}

                  {/* Actions / Jump to Line */}
                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      {typeof issue.line === "number" && (
                        <button
                          type="button"
                          onClick={() => onGoToLineOrSection?.(issue.line!)}
                          className="font-mono text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors cursor-pointer"
                        >
                          [บรรทัดที่ {issue.line}]
                        </button>
                      )}
                    </div>

                    {issue.autoFixAction && (
                      <button
                        type="button"
                        onClick={() => onGoToLineOrSection?.(issue.autoFixAction!)}
                        className="font-medium text-[--color-accent] hover:text-[--color-accent]/80 px-2.5 py-1 rounded bg-blue-50/80 border border-blue-200 flex items-center gap-1 transition-colors"
                      >
                        <span>✨ แก้ไขอัตโนมัติ (Auto-fix)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl bg-[--color-bg-card] border border-[--color-border] shadow-xs space-y-2">
            <div className="text-2xl">🎉</div>
            <h5 className="font-medium text-[--color-text-heading]">
              ไม่พบข้อวินิจฉัยหรือจุดที่ต้องปรับปรุง
            </h5>
            <p className="text-xs text-[--color-text-secondary] leading-relaxed">
              เนื้อหาของคุณมีโครงสร้าง ความลุ่มลึก และการอ้างอิงทางวิชาการครบถ้วนตามเกณฑ์ Archron
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
