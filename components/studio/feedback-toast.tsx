"use client";

import { useEffect } from "react";

export type Feedback = { type: "success" | "error"; text: string };

// Pop-up Feedback — แจ้งสถานะแบบ Positive (สำเร็จ) / Negative (ผิดพลาด)
// auto-dismiss ~4.5 วิ + ปิดเองได้ · a11y role status/alert · โทนมืด cosmology
export function FeedbackToast({
  feedback,
  onClose,
}: {
  feedback: Feedback | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [feedback, onClose]);

  if (!feedback) return null;

  const ok = feedback.type === "success";
  const accent = ok ? "var(--color-success)" : "var(--color-danger)";
  const icon = ok ? "check_circle" : "error";

  return (
    <div
      role={ok ? "status" : "alert"}
      aria-live={ok ? "polite" : "assertive"}
      className="route-fade fixed right-4 top-20 z-[60] w-[min(92vw,380px)]"
    >
      <div
        className="flex items-start gap-3 rounded-md border bg-surface-1/95 p-4 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.65)] backdrop-blur"
        style={{ borderColor: `${accent}66` }}
      >
        <span className="material-symbols-outlined text-[22px]" style={{ color: accent }}>
          {icon}
        </span>
        <p className="flex-1 text-sm leading-relaxed text-on-surface">{feedback.text}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="ปิดการแจ้งเตือน"
          className="shrink-0 text-on-surface-variant/60 transition-colors hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
