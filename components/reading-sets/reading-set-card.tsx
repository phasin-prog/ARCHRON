"use client";

import type { ReadingSetItem } from "@/lib/content/reading-sets";
import { difficultyMeta } from "@/lib/content/cosmology";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ReadingSetCard({ set }: { set: ReadingSetItem }) {
  const accent = "#C79A4A"; // Sapientia Gold
  const diffMeta = difficultyMeta(set.difficulty ?? "beginner");

  return (
    <article className="archron-card relative overflow-hidden p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:border-accent/45">
      {/* แถบสีข้างบ่งบอก cosmology */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: accent }}
      />

      <div className="space-y-4">
        {/* หัวเรื่องของเซ็ต */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary mr-1">
                {set.framework}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1"
                style={{
                  color: diffMeta.accent,
                  backgroundColor: `${diffMeta.accent}14`,
                  borderColor: `${diffMeta.accent}33`,
                  borderWidth: "1px",
                }}
              >
                <span className="material-symbols-outlined text-[11px]">{diffMeta.icon}</span>
                {set.difficulty === "beginner"
                  ? "ระดับเริ่มต้น"
                  : set.difficulty === "intermediate"
                    ? "ระดับกลาง"
                    : "ระดับสูง"}
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-text-heading group-hover:text-accent">
              {set.title}
            </h2>
          </div>

          {/* 3D ICON GRID */}
          <span
            className="inline-flex items-center justify-center w-11 h-11 flex-none border border-border/40 rounded-[0.9rem_0.3rem] bg-bg-card shrink-0 scale-100"
            style={{ borderColor: `color-mix(in srgb, ${accent} 26%, var(--color-border))` }}
          >
            <svg className="icon-3d" aria-hidden="true" style={{ "--ico-main": accent } as React.CSSProperties}>
              <use href="/icons/archron-icons.svg#reading-set" />
            </svg>
          </span>
        </div>

        {set.shortDescription && (
          <p className="text-sm leading-relaxed text-text-body/85">
            {set.shortDescription}
          </p>
        )}

        {/* เส้นทางการอ่านแบบเชื่อมโยง (Timeline Steps) */}
        <div className="py-4 border-t border-b border-border/20 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-accent/80">
            เส้นทางการเรียนรู้ ({set.steps.length} ขั้นตอน):
          </p>
          <div className="flex flex-col gap-4 pl-2 md:flex-row md:items-center md:gap-2 md:pl-0">
            {set.steps.map((step, idx) => {
              const isLast = idx === set.steps.length - 1;
              return (
                <div key={step.slug} className="flex flex-col items-start md:flex-row md:items-center min-w-[150px] flex-1">
                  <Link
                    href={
                      step.type === "person"
                        ? `/schools?person=${step.slug}`
                        : step.type === "article"
                          ? `/articles/${step.slug}`
                          : `/concepts/${step.slug}`
                    }
                    className="w-full flex items-center gap-2.5 rounded border border-border/30 bg-text-heading/[0.01] px-3 py-2 text-xs text-text-body hover:border-accent/45 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[10px] font-bold text-accent font-mono">
                      {idx + 1}
                    </span>
                    <span className="truncate flex-1 font-medium">{step.title}</span>
                  </Link>

                  {!isLast && (
                    <div className="flex justify-center w-5 mt-1.5 mb-1.5 md:mt-0 md:mb-0 md:w-auto md:mx-2 text-text-secondary/40 shrink-0">
                      {/* ลูกศรชี้ลงในมือถือ และชี้ขวาในเดสก์ท็อป */}
                      <span className="material-symbols-outlined text-[16px] md:hidden">
                        arrow_downward
                      </span>
                      <span className="material-symbols-outlined text-[16px] hidden md:inline">
                        arrow_forward
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {set.bodyMarkdown && (
          <div className="markdown-body prose prose-invert max-w-none text-xs text-text-body/80 leading-relaxed pt-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {set.bodyMarkdown}
            </ReactMarkdown>
          </div>
        )}

        <Link
          href={`/reading-sets/${set.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent/80 hover:text-accent transition-colors mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
        >
          ดูรายละเอียดซีรีส์
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
    </article>
  );
}
