"use client";

import { useEffect } from "react";
import type { AcademicSeal } from "@/lib/content/seals";
import { SealIcon } from "./seal-icon";

interface SealNotificationProps {
  seal: AcademicSeal;
  onClose: () => void;
  onView: () => void;
}

export function SealNotification({ seal, onClose, onView }: SealNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed left-1/2 top-8 z-[var(--z-toast)] -translate-x-1/2"
      role="status"
      aria-live="polite"
      style={{
        animation: "seal-notif-in 300ms ease-out both",
      }}
    >
      <div className="flex items-center gap-4 rounded-xl border border-border bg-bg-card px-6 py-4 shadow-lg">
        <SealIcon seal={seal} size={40} />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-secondary/80">
            ได้รับตราประทับวิชาการ
          </span>
          <span className="font-heading text-sm font-semibold text-text-heading">
            {seal.nameThai} — {seal.name}
          </span>
          <span className="text-xs text-text-secondary">{seal.requirement}</span>
        </div>
        <button
          type="button"
          onClick={onView}
          className="ml-4 rounded-lg border border-border px-3 py-1.5 text-xs text-text-heading transition-colors hover:border-accent hover:text-accent"
        >
          ดูตรา
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-text-secondary hover:text-text-heading"
          aria-label="ปิด"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
