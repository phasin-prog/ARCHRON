"use client";

import type { AcademicSeal } from "@/lib/content/seals";
import { SealIcon } from "./seal-icon";
import { Modal } from "@/components/modal";
import { colors } from "@/lib/content/colors";

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

function getLevelColorName(color: string): string {
  if (color === colors.slateDark) return "Slate";
  if (color === colors.cardinalAcademic) return "Cardinal";
  if (color === colors.silverLight) return "Silver";
  if (color === colors.premium) return "Gold";
  return "";
}

export function SealDetailModal({ seal, earnedAt, onClose }: SealDetailModalProps) {
  if (!seal) return null;

  const colorName = getLevelColorName(seal.color);
  const levelLabel = seal.level ? LEVEL_LABELS[seal.level] : "";

  return (
    <Modal open={!!seal} onClose={onClose} title={seal.nameThai}>
      <div className="flex flex-col items-center text-center">
        <SealIcon seal={seal} size={120} />
        <p className="mt-2 text-sm text-text-secondary">{seal.name}</p>
        <div className="mt-4 w-full border-t border-border" />
        <p className="mt-4 text-sm text-text-secondary">
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
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border bg-bg px-6 py-2.5 text-sm text-text-heading transition-colors hover:border-accent hover:text-accent"
        >
          ปิด
        </button>
      </div>
    </Modal>
  );
}
