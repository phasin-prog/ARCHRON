"use client";

import type { ReadingSetItem } from "@/lib/content/core/seeds/reading-sets";
import { difficultyMeta } from "@/lib/content/core/cosmology";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowRightIcon, ReadingSetBadgeIcon } from "@/components/icons";

export function ReadingSetCard({ set }: { set: ReadingSetItem }) {
  const accent = "var(--color-accent)"; // Sapientia Gold
  const diffMeta = difficultyMeta(set.difficulty ?? "beginner");

  return (
    <article className="archron-card relative overflow-hidden p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:border-accent/45 border-t-2"
      style={{ borderTopColor: accent } as React.CSSProperties}
    >

      <div className="space-y-4">
        {/* หัวเรื่องของเซ็ต */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-text-secondary/80 mr-1">
                {set.framework}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-sm font-medium text-text-secondary/80 flex items-center gap-1"
                style={{
                  color: diffMeta.accent,
                  backgroundColor: `${diffMeta.accent}14`,
                  borderColor: `${diffMeta.accent}33`,
                  borderWidth: "1px",
                }}
              >
                <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[11px]" aria-hidden="true">{diffMeta.icon === "auto_stories" ? "📖" : diffMeta.icon === "school" ? "🎓" : "◆"}</span>
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
            <ReadingSetBadgeIcon className="w-6 h-6 text-accent" />
          </span>
        </div>

        {set.shortDescription && (
          <p className="text-sm leading-relaxed text-text-body/85">
            {set.shortDescription}
          </p>
        )}

        {/* เส้นทางการอ่านแบบเชื่อมโยง (Timeline Steps) */}
        <div className="py-4 border-t border-b border-border/20 space-y-3">
          <p className="text-sm font-medium text-text-secondary/80">
            รายการอ่านตามลำดับ ({set.steps.length} ขั้นตอน):
          </p>
          <div className="flex flex-col gap-4 pl-2 md:flex-row md:items-center md:gap-2 md:pl-0">
            {set.steps.map((step, idx) => {
              const isLast = idx === set.steps.length - 1;
              return (
                <div key={step.slug} className="flex flex-col items-start md:flex-row md:items-center min-w-0 w-full md:w-auto flex-1">
                  <Link
                    href={
                      step.type === "person"
                        ? `/thinkers/${step.slug}`
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
                      <span className="inline-flex items-center justify-center w-4 h-4 md:hidden" aria-hidden="true">↓</span>
                      <ArrowRightIcon className="h-4 w-4 hidden md:inline" />
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
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
