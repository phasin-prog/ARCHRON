"use client";

import { useState } from "react";
import { SealGallery } from "./seal-gallery";
import { SealDetailModal } from "./seal-detail-modal";
import { SealIcon } from "./seal-icon";
import { SEALS, type AcademicSeal } from "@/lib/content/community/seals";

export function SealProfileSection() {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedSeal, setSelectedSeal] = useState<AcademicSeal | null>(null);
  const earnedSealIds: string[] = []; // UI-only — no DB backing yet

  return (
    <>
      <section className="tpl-content mt-16">
        <h2 className="font-heading text-2xl font-semibold text-text-heading">
          ตราประทับวิชาการ
        </h2>
        <div className="mt-4 flex items-center gap-4">
          {SEALS.slice(0, 5).map((seal) => (
            <SealIcon
              key={seal.id}
              seal={seal}
              size={32}
              isLocked={!earnedSealIds.includes(seal.id)}
            />
          ))}
          <span className="text-sm text-text-secondary">
            {earnedSealIds.length} ตราที่ได้รับ
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowGallery(true)}
          className="mt-4 rounded-lg border border-border px-4 py-2 text-sm text-text-heading transition-colors hover:border-accent hover:text-accent"
        >
          ดูตราทั้งหมด
        </button>
      </section>

      {showGallery && (
        <div className="fixed inset-0 z-[var(--z-overlay)] overflow-y-auto bg-black/50 p-4">
          <div className="mx-auto mt-8 max-w-4xl rounded-xl border border-border bg-bg p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-semibold text-text-heading">
                ตราประทับวิชาการทั้งหมด
              </h2>
              <button
                type="button"
                onClick={() => setShowGallery(false)}
                className="text-text-secondary hover:text-text-heading"
                aria-label="ปิด"
              >
                ✕
              </button>
            </div>
            <SealGallery
              earnedSealIds={earnedSealIds}
              onSelectSeal={(seal) => setSelectedSeal(seal)}
            />
          </div>
        </div>
      )}

      <SealDetailModal
        seal={selectedSeal}
        onClose={() => setSelectedSeal(null)}
      />
    </>
  );
}
