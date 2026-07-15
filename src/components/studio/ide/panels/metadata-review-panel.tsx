"use client";

import React, { useState } from "react";
import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import type { ParsedMdxAnalysis } from "@/lib/content/studio/semantic-parser";
import { slugifyHeading } from "@/lib/content/studio/semantic-parser";

export interface MetadataReviewPanelProps {
  draft: EditorDraft;
  analysis: ParsedMdxAnalysis;
  onUpdateDraft: <K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) => void;
}

const DIFFICULTY_META: Record<
  string,
  { label: string; badgeClass: string; desc: string }
> = {
  beginner: {
    label: "เบื้องต้น (Beginner)",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    desc: "เหมาะสำหรับผู้เริ่มต้นศึกษาข้อความคิดและจิตวิทยาพื้นฐาน",
  },
  intermediate: {
    label: "ระดับกลาง (Intermediate)",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    desc: "มีความเข้มข้นทางวิชาการและใช้คำศัพท์เฉพาะทางจิตวิเคราะห์",
  },
  advanced: {
    label: "ขั้นสูง (Advanced)",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    desc: "เนื้อหาเชิงลึก อรรถกถา หรือบทวิเคราะห์ทฤษฎีชั้นสูง",
  },
  "source-note": {
    label: "บันทึกชั้นปฐมภูมิ (Source Note)",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    desc: "บันทึกหรือแปลความจากต้นฉบับตำราและเอกสารจดหมายเหตุ",
  },
};

export function MetadataReviewPanel({
  draft,
  analysis,
  onUpdateDraft,
}: MetadataReviewPanelProps) {
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [customSlug, setCustomSlug] = useState(draft.slug || "");
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [customSummary, setCustomSummary] = useState(draft.shortDescription || "");

  // Helper เพื่อดึงบทสรุป 150-200 อักษรจาก Markdown
  const extractSummaryFromMarkdown = (md: string): string => {
    if (!md) return "";
    const clean = md
      .replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, "") // Remove frontmatter
      .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, "$2$1") // Clean wikilinks
      .replace(/[#*`~_\[\]()\-+=|<>?!@#$%^&/\\]/g, " ") // Clean markdown symbols
      .replace(/\s+/g, " ")
      .trim();

    if (clean.length <= 180) return clean;
    const truncated = clean.slice(0, 180);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > 100 ? `${truncated.slice(0, lastSpace)}...` : `${truncated}...`;
  };

  const handleRegenerateSummary = () => {
    const extracted = extractSummaryFromMarkdown(draft.bodyMarkdown || "");
    if (extracted) {
      setCustomSummary(extracted);
      onUpdateDraft("shortDescription", extracted);
    }
  };

  const handleSyncSlug = () => {
    const generated =
      analysis.frontmatter?.slug || slugifyHeading(draft.title || "");
    if (generated) {
      setCustomSlug(generated);
      onUpdateDraft("slug", generated);
    }
  };

  const handleToggleTag = (tag: string) => {
    const currentTags = Array.isArray(draft.tags) ? draft.tags : [];
    const normalizedTag = tag.trim().toLowerCase();
    const exists = currentTags.some((t) => t.trim().toLowerCase() === normalizedTag);

    if (exists) {
      const updated = currentTags.filter(
        (t) => t.trim().toLowerCase() !== normalizedTag
      );
      onUpdateDraft("tags", updated);
    } else {
      onUpdateDraft("tags", [...currentTags, tag.trim()]);
    }
  };

  const currentTags = Array.isArray(draft.tags) ? draft.tags : [];
  const generatedSlug =
    (analysis.frontmatter?.slug as string) || slugifyHeading(draft.title || "") || "(ยังไม่ได้ระบุ)";
  const diffMeta =
    DIFFICULTY_META[analysis.difficultyEstimate] || DIFFICULTY_META.beginner;
  const currentDiffMeta =
    DIFFICULTY_META[draft.difficulty || "beginner"] || DIFFICULTY_META.beginner;

  return (
    <div className="space-y-6 text-sm text-[--color-text-body] font-[--font-ui]" lang="th">
      {/* ส่วนแนะนำและคำอธิบาย */}
      <div className="p-3.5 rounded-lg bg-[--color-bg-elevated] border border-[--color-border]/60">
        <div className="flex items-center gap-2 font-medium text-[--color-text-heading] mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[--color-accent]"></span>
          <span>ตรวจสอบอภิพันธุ์ข้อมูลเชิงความหมาย (Metadata Review)</span>
        </div>
        <p className="text-xs text-[--color-text-secondary] leading-relaxed">
          ระบบวิเคราะห์โครงสร้างและคำสำคัญจากเนื้อหา MDX สด (AST Analysis) เพื่อนำเสนอค่าอภิพันธุ์ข้อมูลที่เหมาะสม โดยไม่ต้องกรอกแบบฟอร์มแยก
        </p>
      </div>

      {/* 1. Slug Review Section */}
      <section className="p-4 rounded-xl bg-[--color-bg-card] border border-[--color-border] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-[--color-text-heading] flex items-center gap-1.5">
              <span>Slug (ลิงก์ถาวร)</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-[--color-accent] border border-blue-200">
                Generated / Extracted
              </span>
            </h4>
            <p className="text-xs text-[--color-text-secondary] mt-0.5">
              ตัวบ่งชี้สำหรับ URL และจุดอ้างอิงผ่าน Wikilink <code className="text-[11px] px-1 bg-[--color-bg-elevated] rounded">[[{draft.slug || generatedSlug}]]</code>
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isEditingSlug) {
                onUpdateDraft("slug", customSlug);
              } else {
                setCustomSlug(draft.slug || generatedSlug);
              }
              setIsEditingSlug(!isEditingSlug);
            }}
            className="text-xs font-medium px-2.5 py-1 rounded-md border border-[--color-border] bg-[--color-bg] hover:bg-[--color-bg-elevated] transition-colors text-[--color-text-heading]"
          >
            {isEditingSlug ? "บันทึก" : "แก้ไข (Edit)"}
          </button>
        </div>

        {isEditingSlug ? (
          <div className="space-y-2 pt-1">
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="เช่น analytical-psychology"
              className="w-full px-3 py-1.5 text-xs rounded-md border border-[--color-border] bg-[--color-bg] text-[--color-text-heading] focus:outline-none focus:border-[--color-accent]"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleSyncSlug}
                className="text-[11px] text-[--color-accent] hover:underline"
              >
                🔄 ดึงค่าจากหัวข้อ (Sync from Title)
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[--color-bg-elevated]/60 border border-[--color-border]/40">
            <span className="font-mono text-xs text-[--color-text-heading] truncate max-w-[200px]">
              {draft.slug || generatedSlug}
            </span>
            {draft.slug !== generatedSlug && (
              <button
                type="button"
                onClick={handleSyncSlug}
                className="text-xs font-medium text-[--color-accent] hover:text-[--color-accent]/80 px-2 py-0.5 rounded bg-[--color-bg-card] border border-[--color-border]/60 shadow-2xs"
                title="ซิงค์ค่าให้ตรงกับที่คำนวณได้"
              >
                🔄 ซิงค์
              </button>
            )}
          </div>
        )}
      </section>

      {/* 2. Summary (บทสรุปย่อ) Review Section */}
      <section className="p-4 rounded-xl bg-[--color-bg-card] border border-[--color-border] shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium text-[--color-text-heading] flex items-center gap-1.5">
              <span>บทสรุปย่อ (Summary)</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Extracted
              </span>
            </h4>
            <p className="text-xs text-[--color-text-secondary] mt-0.5">
              ใช้แสดงผลบนการ์ดบทความ ผลการค้นหา และการแนะนำเนื้อหาที่เกี่ยวข้อง
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (isEditingSummary) {
                onUpdateDraft("shortDescription", customSummary);
              } else {
                setCustomSummary(draft.shortDescription || "");
              }
              setIsEditingSummary(!isEditingSummary);
            }}
            className="text-xs font-medium px-2.5 py-1 rounded-md border border-[--color-border] bg-[--color-bg] hover:bg-[--color-bg-elevated] transition-colors shrink-0 text-[--color-text-heading]"
          >
            {isEditingSummary ? "บันทึก" : "แก้ไข"}
          </button>
        </div>

        {isEditingSummary ? (
          <div className="space-y-2 pt-1">
            <textarea
              rows={3}
              value={customSummary}
              onChange={(e) => setCustomSummary(e.target.value)}
              placeholder="ระบุบทสรุปย่อไม่เกิน 200 ตัวอักษร..."
              className="w-full px-3 py-2 text-xs rounded-md border border-[--color-border] bg-[--color-bg] text-[--color-text-heading] focus:outline-none focus:border-[--color-accent] leading-relaxed resize-none"
            />
            <div className="flex justify-between items-center text-[11px] text-[--color-text-secondary]">
              <span>{customSummary.length} ตัวอักษร</span>
              <button
                type="button"
                onClick={handleRegenerateSummary}
                className="text-[--color-accent] hover:underline flex items-center gap-1"
              >
                <span>⚡ คำนวณใหม่จากเนื้อหา (Regenerate)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-[--color-bg-elevated]/60 border border-[--color-border]/40 text-xs text-[--color-text-body] leading-relaxed min-h-[50px]">
              {draft.shortDescription || (
                <span className="text-[--color-text-secondary] italic">
                  ยังไม่ได้ระบุบทสรุปย่อ กดปุ่มคำนวณเพื่อสกัดอัตโนมัติจากเนื้อหา...
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={handleRegenerateSummary}
              className="w-full py-1.5 px-3 rounded-lg border border-[--color-border]/80 bg-[--color-bg] hover:bg-[--color-bg-elevated] text-xs font-medium text-[--color-text-heading] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>⚡ คำนวณใหม่จากเนื้อหา (Regenerate)</span>
            </button>
          </div>
        )}
      </section>

      {/* 3. Framework (กรอบทฤษฎี) Review Section */}
      <section className="p-4 rounded-xl bg-[--color-bg-card] border border-[--color-border] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-[--color-text-heading] flex items-center gap-1.5">
              <span>กรอบทฤษฎี (Framework)</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                Detected
              </span>
            </h4>
            <p className="text-xs text-[--color-text-secondary] mt-0.5">
              กรอบความคิดหลักที่ใช้อธิบายมโนทัศน์ (เช่น Analytical Psychology)
            </p>
          </div>
        </div>

        {/* ค่าปัจจุบัน */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[--color-bg-elevated] border border-[--color-border]/60">
          <span className="text-xs font-medium text-[--color-text-heading]">
            กรอบปัจจุบัน: <span className="text-[--color-accent]">{draft.framework || "(ยังไม่ระบุ)"}</span>
          </span>
        </div>

        {/* รายการ Frameworks ที่ตรวจพบ */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-medium text-[--color-text-secondary]">
            กรอบความคิดที่ตรวจพบจากคำศัพท์ในเนื้อหา:
          </p>
          {analysis.detectedFrameworks.length > 0 ? (
            <div className="space-y-1.5">
              {analysis.detectedFrameworks.map((fw) => {
                const isCurrent =
                  draft.framework &&
                  draft.framework.toLowerCase() === fw.framework.toLowerCase();

                return (
                  <div
                    key={fw.framework}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors ${
                      isCurrent
                        ? "bg-blue-50/60 border-[--color-accent] text-[--color-text-heading]"
                        : "bg-[--color-bg] border-[--color-border]/60 hover:border-[--color-border]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[--color-text-heading]">
                        {fw.framework}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[--color-bg-elevated] text-[--color-text-secondary] font-mono">
                        {fw.confidence}%
                      </span>
                    </div>
                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => onUpdateDraft("framework", fw.framework)}
                        className="text-[11px] font-medium text-[--color-accent] hover:text-[--color-accent]/80 px-2 py-1 rounded bg-[--color-bg-card] border border-[--color-border]/60 shadow-2xs hover:bg-[--color-bg-elevated] transition-colors flex items-center gap-1"
                      >
                        <span>✨ ยืนยันใช้ค่านี้ (Accept)</span>
                      </button>
                    )}
                    {isCurrent && (
                      <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ ใช้งานอยู่
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-3 text-center rounded-lg bg-[--color-bg] border border-dashed border-[--color-border] text-xs text-[--color-text-secondary]">
              ไม่พบกรอบทฤษฎีที่เด่นชัด ลองเพิ่มคำศัพท์หลัก เช่น Analytical Psychology หรือ Psychoanalysis ในเนื้อหา
            </div>
          )}
        </div>
      </section>

      {/* 4. Tags Review Section */}
      <section className="p-4 rounded-xl bg-[--color-bg-card] border border-[--color-border] shadow-xs space-y-3">
        <div>
          <h4 className="font-medium text-[--color-text-heading] flex items-center gap-1.5">
            <span>คำสำคัญและป้ายกำกับ (Tags)</span>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Suggested
            </span>
          </h4>
          <p className="text-xs text-[--color-text-secondary] mt-0.5">
            คลิกป้ายกำกับที่ระบบแนะนำเพื่อเพิ่มลงในรายการ หรือคลิกอีกครั้งเพื่อนำออก
          </p>
        </div>

        {/* Current tags */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-[--color-text-secondary] block">
            ป้ายกำกับที่เลือกแล้ว ({currentTags.length}):
          </span>
          <div className="flex flex-wrap gap-1.5 min-h-[28px] p-2 rounded-lg bg-[--color-bg-elevated] border border-[--color-border]/60">
            {currentTags.length > 0 ? (
              currentTags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => handleToggleTag(tag)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[--color-accent] text-white cursor-pointer hover:bg-red-500 transition-colors"
                  title="คลิกเพื่อนำออก"
                >
                  <span>#{tag}</span>
                  <span className="text-[10px] font-bold">×</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-[--color-text-secondary] italic">
                ยังไม่มีป้ายกำกับที่เลือก
              </span>
            )}
          </div>
        </div>

        {/* Suggested tags */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-medium text-[--color-text-secondary] block">
            ป้ายกำกับที่แนะนำจากเนื้อหา ({analysis.suggestedTags.length}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {analysis.suggestedTags.length > 0 ? (
              analysis.suggestedTags.map((tag) => {
                const isSelected = currentTags.some(
                  (t) => t.trim().toLowerCase() === tag.toLowerCase()
                );
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? "bg-blue-50 text-[--color-accent] border-[--color-accent] font-semibold"
                        : "bg-[--color-bg] text-[--color-text-body] border-[--color-border] hover:bg-[--color-bg-elevated] hover:border-[--color-border]/80"
                    }`}
                  >
                    <span>+{tag}</span>
                    {isSelected && <span className="text-[10px] text-[--color-accent]">✓</span>}
                  </button>
                );
              })
            ) : (
              <span className="text-xs text-[--color-text-secondary] italic">
                ไม่มีข้อเสนอแนะเพิ่มเติมจากคำศัพท์ปัจจุบัน
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 5. Difficulty Review Section */}
      <section className="p-4 rounded-xl bg-[--color-bg-card] border border-[--color-border] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-[--color-text-heading] flex items-center gap-1.5">
              <span>ระดับความเข้มข้นเนื้อหา (Difficulty)</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                Estimated
              </span>
            </h4>
            <p className="text-xs text-[--color-text-secondary] mt-0.5">
              ประเมินอัตโนมัติจากความซับซ้อน คำศัพท์ชั้นสูง และการอ้างอิงเชิงวิชาการ
            </p>
          </div>
        </div>

        {/* Current status vs Estimated */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-lg bg-[--color-bg-elevated] border border-[--color-border]/60 space-y-1">
            <span className="text-[11px] text-[--color-text-secondary] block font-medium">
              ระดับปัจจุบันที่กำหนดไว้
            </span>
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${currentDiffMeta.badgeClass}`}>
              {currentDiffMeta.label}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[--color-bg] border border-[--color-border]/80 space-y-1">
            <span className="text-[11px] text-[--color-text-secondary] block font-medium">
              ระดับที่ระบบประเมินได้ (AST Estimate)
            </span>
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${diffMeta.badgeClass}`}>
              {diffMeta.label}
            </span>
          </div>
        </div>

        <p className="text-xs text-[--color-text-secondary] bg-[--color-bg-elevated]/40 p-2.5 rounded-lg border border-[--color-border]/30">
          💡 {diffMeta.desc}
        </p>

        {draft.difficulty !== analysis.difficultyEstimate && (
          <button
            type="button"
            onClick={() => onUpdateDraft("difficulty", analysis.difficultyEstimate)}
            className="w-full py-2 px-3 rounded-lg bg-blue-50/80 hover:bg-blue-100/80 text-[--color-accent] border border-blue-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>✨ อัปเดตตามคำนวณ: {diffMeta.label} (Accept)</span>
          </button>
        )}
      </section>
    </div>
  );
}
