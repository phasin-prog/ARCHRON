"use client";

import { useEffect, useRef } from "react";
import type { AcademicSeal } from "@/lib/content/seals";
import { SealIcon } from "./seal-icon";

interface SealDetailModalProps {
  seal: AcademicSeal | null;
  earnedAt?: Date;
  onClose: () => void;
}

const LEVEL_LABELS: Record<number, string> = {
  1: "Seeker",
  2: "Apprentice",
  3: "Scholar",
  4: "Sage",
  5: "Luminary",
  6: "Guardian",
  7: "Architect",
};

const LEVEL_COLORS: Record<string, string> = {
  Slate: "var(--color-text-secondary)",
  Cardinal: "var(--color-accent)",
  Silver: "var(--color-text-secondary)",
  Gold: "var(--color-premium)",
};

function getLevelColorName(color: string): string {
  if (color === "#465264") return "Slate";
  if (color === "#8C3030") return "Cardinal";
  if (color === "#C7D0DB") return "Silver";
  if (color === "#B89A63") return "Gold";
  return "";
}

export function SealDetailModal({ seal, earnedAt, onClose }: SealDetailModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!seal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [seal, onClose]);

  if (!seal) return null;

  const colorName = getLevelColorName(seal.color);
  const levelLabel = seal.level ? LEVEL_LABELS[seal.level] : "";

  return (
    <div
      className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${seal.nameThai} — รายละเอียดตรา`}
    >
      <div
        className="max-w-sm rounded-xl border border-border bg-bg-card p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <SealIcon seal={seal} size={120} />
          <h2 className="mt-4 font-heading text-xl font-semibold text-text-heading">
            {seal.nameThai}
          </h2>
          <p className="text-sm text-text-secondary">{seal.name}</p>
          <div className="mt-3 w-full border-t border-border" />
          <p className="mt-3 text-sm text-text-secondary">
            {colorName} · Level {seal.level} {levelLabel && `· ${levelLabel}`}
          </p>
          <p className="mt-4 font-serif text-sm leading-relaxed text-text-body">
            {seal.description}
          </p>
          <p className="mt-2 text-xs text-text-secondary">
            เงื่อนไข: {seal.requirement}
          </p>
          {earnedAt && (
            <p className="mt-4 text-xs text-text-secondary">
              ได้รับเมื่อ {earnedAt.toLocaleDateString("th-TH")}
            </p>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="mt-6 rounded-lg border border-border bg-bg px-6 py-2.5 text-sm text-text-heading transition-colors hover:border-accent hover:text-accent"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
