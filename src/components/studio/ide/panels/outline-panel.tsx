"use client";

import React from "react";
import type { HeadingNode } from "@/lib/content/studio/semantic-parser";

export interface OutlinePanelProps {
  headings: HeadingNode[];
  activeHeadingId?: string;
  onHeadingClick?: (id: string) => void;
}

export function OutlinePanel({
  headings,
  activeHeadingId,
  onHeadingClick,
}: OutlinePanelProps) {
  const handleHeadingSelect = (id: string) => {
    if (onHeadingClick) {
      onHeadingClick(id);
    }
    // เลื่อนหน้าจอไปยังเป้าหมายอย่างนุ่มนวล
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-4 text-sm text-text-body font-ui" lang="th">
      {/* Header Info */}
      <div className="p-3.5 rounded-lg bg-bg-elevated border border-border/60">
        <div className="flex items-center justify-between font-medium text-text-heading mb-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-accent"></span>
            <span>โครงสร้างสารบัญ (Document Outline)</span>
          </div>
          <span className="text-xs font-mono text-text-secondary">
            {headings.length} หัวข้อ
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          ลำดับชั้นหัวข้อ H1-H6 ที่สกัดจาก Markdown สด คลิกเพื่อเลื่อนไปยังหัวข้อเป้าหมายอย่างนุ่มนวล
        </p>
      </div>

      {/* Headings List */}
      <div className="p-2 rounded-xl bg-bg-card border border-border shadow-xs max-h-[520px] overflow-y-auto">
        {headings && headings.length > 0 ? (
          <nav className="space-y-1 py-1" aria-label="สารบัญเอกสาร">
            {headings.map((heading, idx) => {
              const isActive = activeHeadingId && heading.id === activeHeadingId;
              const indentPx = Math.max(0, (heading.level - 1) * 14);

              return (
                <button
                  key={`${heading.id}-${idx}`}
                  type="button"
                  onClick={() => handleHeadingSelect(heading.id)}
                  style={{ paddingLeft: `${indentPx + 10}px` }}
                  className={`w-full text-left py-2 pr-3 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                    isActive
                      ? "bg-accent/15 text-accent font-semibold border-l-2 border-l-accent"
                      : "text-text-body hover:bg-bg-elevated hover:text-accent"
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="shrink-0 font-mono text-[10px] uppercase text-text-secondary group-hover:text-accent/80 px-1 py-0.5 rounded bg-bg-elevated/60 border border-border/40">
                      H{heading.level}
                    </span>
                    <span className="truncate leading-snug">{heading.text || "(หัวข้อที่ไม่มีข้อความ)"}</span>
                  </div>
                  <span className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-accent pl-1 font-mono">
                    #{heading.id}
                  </span>
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="p-8 text-center rounded-lg bg-bg border border-dashed border-border space-y-2">
            <div className="text-xl text-text-secondary">📑</div>
            <h5 className="font-medium text-text-heading text-xs">
              ยังไม่พบหัวข้อย่อยในเนื้อหา
            </h5>
            <p className="text-xs text-text-secondary leading-relaxed max-w-[260px] mx-auto">
              กรุณาพิมพ์ <code className="font-mono text-xs px-1 py-0.5 rounded bg-bg-elevated text-text-heading">## ชื่อหัวข้อ</code> ในตัวเขียน Markdown เพื่อสร้างโครงสร้างและสารบัญของเอกสาร
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
