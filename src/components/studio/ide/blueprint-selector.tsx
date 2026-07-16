"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  BLUEPRINTS,
  getAllBlueprints,
  generateMdxFromBlueprint,
  type BlueprintId,
  type KnowledgeBlueprint,
} from "@/lib/content/studio/blueprints";
import { CloseIcon, BookIcon, EditIcon } from "@/components/icons";
import { resolveIconElement } from "@/lib/content/core/icon-map";
import { slugify } from "@/lib/content/publishing/publish-validation";

export interface BlueprintSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelectBlueprint: (
    blueprintId: BlueprintId,
    generatedMdx: string,
    initialTitle?: string,
    initialSlug?: string
  ) => void;
  currentDraftTitle?: string;
}

export function BlueprintSelectorModal({
  open,
  onClose,
  onSelectBlueprint,
  currentDraftTitle = "",
}: BlueprintSelectorModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<BlueprintId>("concept");
  const [hoveredId, setHoveredId] = useState<BlueprintId | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync initial title from props when modal opens
  useEffect(() => {
    if (open) {
      const initialTitle = currentDraftTitle.trim();
      setTitleInput(initialTitle);
      if (initialTitle) {
        setSlugInput(slugify(initialTitle));
        setSlugManual(false);
      } else {
        setSlugInput("");
        setSlugManual(false);
      }
    }
  }, [open, currentDraftTitle]);

  // Handle ESC key to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !mounted || typeof document === "undefined") return null;

  const blueprints = getAllBlueprints();
  const activeBlueprint: KnowledgeBlueprint =
    BLUEPRINTS[hoveredId ?? selectedId] ?? BLUEPRINTS[selectedId] ?? BLUEPRINTS.concept;
  const selectedBlueprint: KnowledgeBlueprint =
    BLUEPRINTS[selectedId] ?? BLUEPRINTS.concept;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitleInput(val);
    if (!slugManual) {
      setSlugInput(slugify(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSlugInput(val);
    setSlugManual(true);
  };

  const handleConfirm = () => {
    const finalTitle = titleInput.trim() || undefined;
    const finalSlug =
      slugInput.trim() || (finalTitle ? slugify(finalTitle) : undefined);
    const generatedMdx = generateMdxFromBlueprint(
      selectedId,
      finalTitle,
      finalSlug
    );
    onSelectBlueprint(selectedId, generatedMdx, finalTitle, finalSlug);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-4 bg-bg-elevated/80 shrink-0 gap-4">
          <div className="space-y-1">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-text-heading flex items-center gap-2">
              <span>🏛️</span>
              <span>เลือกแม่พิมพ์ความรู้ (Knowledge Blueprint)</span>
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary max-w-2xl leading-relaxed">
              แม่พิมพ์แต่ละชนิดคือโครงสร้างทางความรู้ (Semantic Structure) ที่ช่วยจัดระเบียบเนื้อหาและสร้าง MDX Template อัตโนมัติ โดยใช้ Workspace เขียนงานเดียวกันเสมอ
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-text-secondary hover:bg-bg hover:text-text-heading transition-colors shrink-0"
            title="ปิดหน้าต่าง"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Grid of 6 Blueprint Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blueprints.map((bp) => {
              const isSelected = selectedId === bp.id;
              return (
                <div
                  key={bp.id}
                  onClick={() => setSelectedId(bp.id)}
                  onMouseEnter={() => setHoveredId(bp.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(bp.id);
                    }
                  }}
                  className={`group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all cursor-pointer select-none ${
                    isSelected
                      ? "border-accent bg-accent/5 ring-2 ring-accent/20 shadow-md"
                      : "border-border bg-bg-card hover:border-border/80 hover:bg-bg-elevated/40"
                  }`}
                >
                  <div>
                    {/* Top Row: Icon + Names */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                          isSelected
                            ? "bg-accent text-white"
                            : "bg-accent/10 text-accent group-hover:bg-accent/20"
                        }`}
                      >
                        {resolveIconElement(bp.icon, { className: "h-5 w-5" })}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] font-mono text-text-secondary uppercase">
                          {bp.nameEn}
                        </span>
                      </div>
                    </div>

                    <h4 className="font-serif text-base font-bold text-text-heading mt-3 flex items-center justify-between">
                      <span>{bp.nameTh}</span>
                      {isSelected && (
                        <span className="text-accent text-sm font-sans" title="เลือกแม่พิมพ์นี้">
                          ✓
                        </span>
                      )}
                    </h4>

                    <p className="text-xs text-text-body/90 mt-1.5 line-clamp-2 min-h-[2.25rem] leading-relaxed">
                      {bp.description}
                    </p>
                  </div>

                  {/* Bottom Row: Badges & Headings count */}
                  <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {bp.defaultTags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-bg-elevated px-2 py-0.5 text-[10px] text-text-secondary font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] font-semibold text-accent flex items-center gap-1">
                      <span>📑 {bp.requiredHeadings.length} หัวข้อโครงสร้างบังคับ</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section Preview & Quick Input */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 border-t border-border/60">
            {/* Left: Preview required headings */}
            <div className="lg:col-span-6 rounded-xl border border-border bg-bg-elevated/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                  <BookIcon className="h-4 w-4 text-accent" />
                  <span>
                    ตัวอย่างโครงสร้างหัวข้อ ({activeBlueprint.nameTh} — {activeBlueprint.nameEn})
                  </span>
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-text-body">
                {activeBlueprint.requiredHeadings.map((heading, idx) => (
                  <li
                    key={heading + idx}
                    className="flex items-center gap-2 rounded-lg bg-bg-card border border-border/60 px-3 py-2 text-text-heading font-medium shadow-sm"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] font-mono text-accent">
                      {idx + 1}
                    </span>
                    <span className="truncate">{heading}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Quick Input Bar */}
            <div className="lg:col-span-6 rounded-xl border border-border bg-bg-card p-4 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                  <EditIcon className="h-4 w-4 text-accent" />
                  <span>ตั้งชื่อและเริ่มต้นทันที (Quick Setup)</span>
                </h4>

                <div className="space-y-1.5">
                  <label
                    htmlFor="blueprint-title-input"
                    className="block text-xs font-medium text-text-heading"
                  >
                    ชื่อบทความหรือแนวคิด (Title)
                  </label>
                  <input
                    id="blueprint-title-input"
                    type="text"
                    value={titleInput}
                    onChange={handleTitleChange}
                    placeholder={`เช่น ${
                      selectedId === "thinker"
                        ? "Carl Jung"
                        : selectedId === "book"
                        ? "Man and His Symbols"
                        : "Collective Unconscious"
                    }`}
                    className="w-full rounded-lg border border-border bg-bg px-3.5 py-2 text-sm text-text-heading placeholder:text-text-secondary/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="blueprint-slug-input"
                    className="block text-xs font-medium text-text-heading"
                  >
                    รหัส URL (Slug — สร้างอัตโนมัติ)
                  </label>
                  <input
                    id="blueprint-slug-input"
                    type="text"
                    value={slugInput}
                    onChange={handleSlugChange}
                    placeholder={`เช่น ${
                      selectedId === "thinker"
                        ? "carl-jung"
                        : selectedId === "book"
                        ? "man-and-his-symbols"
                        : "collective-unconscious"
                    }`}
                    className="w-full rounded-lg border border-border bg-bg px-3.5 py-2 text-xs font-mono text-text-heading placeholder:text-text-secondary/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
                  />
                </div>
              </div>

              <p className="text-[11px] text-text-secondary bg-bg-elevated/60 rounded-lg p-2.5 border border-border/40">
                💡 <strong className="text-text-heading font-medium">คำแนะนำ:</strong> เมื่อกดสร้าง ระบบจะสร้างหน้า YAML Frontmatter พร้อมโครงสร้างหัวข้อ และแท็กพื้นฐานสำหรับ <span className="font-semibold text-accent">{selectedBlueprint.nameTh}</span> ให้อัตโนมัติ
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-6 py-4 bg-bg-elevated/50 shrink-0">
          <div className="text-xs text-text-secondary flex items-center gap-2">
            <span>แม่พิมพ์ที่เลือก:</span>
            <span className="font-bold text-text-heading bg-bg px-2 py-1 rounded border border-border font-serif">
              {selectedBlueprint.nameTh} ({selectedBlueprint.nameEn})
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-lg border border-border px-4 py-2.5 text-xs font-semibold text-text-secondary hover:bg-bg hover:text-text-heading transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 active:scale-[0.99] transition-all"
            >
              <span>✨ ใช้แม่พิมพ์นี้และเริ่มเขียนทันที</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
