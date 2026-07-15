"use client";

import React from "react";
import { ExternalLinkIcon } from "@/components/icons";

export interface CitationNoteProps {
  id: string | number;
  number: number;
  text: string;
  sourceUrl?: string;
}

export function CitationNote({
  id,
  number,
  text,
  sourceUrl,
}: CitationNoteProps) {
  return (
    <div
      id={`ref-${id}`}
      className="group relative flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-bg-card/60 hover:bg-bg-card hover:border-border transition-all text-xs sm:text-sm my-2 scroll-mt-24 shadow-2xs"
    >
      {/* Footnote Number Badge */}
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent font-mono font-semibold text-xs shrink-0 select-none border border-accent/20">
        {number}
      </span>

      {/* Note Content */}
      <div className="flex-1 text-text-body leading-relaxed pt-0.5">
        <span>{text}</span>

        {/* Source URL Link */}
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 ml-2 text-accent hover:underline font-medium break-all"
            title="เปิดแหล่งอ้างอิงภายนอก"
          >
            <span>แหล่งอ้างอิง</span>
            <ExternalLinkIcon className="w-3.5 h-3.5 inline shrink-0" />
          </a>
        )}

        {/* Anchor Back-link to #cite-[id] */}
        <a
          href={`#cite-${id}`}
          className="inline-flex items-center justify-center ml-2 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold text-accent/70 hover:text-accent hover:bg-accent/10 transition-colors select-none"
          title="กลับไปยังจุดอ้างอิงในเนื้อหา"
          aria-label={`กลับไปยังจุดอ้างอิงที่ ${number}`}
        >
          ↩
        </a>
      </div>
    </div>
  );
}
