"use client";

import { useEffect, useState } from "react";

export type Feedback = { type: "success" | "error"; text: string };

export function FeedbackToast({
  feedback,
  onClose,
}: {
  feedback: Feedback | null;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!feedback) {
      setVisible(false);
      return;
    }
    setVisible(true);
    setLeaving(false);
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(onClose, 300);
    }, feedback.type === "success" ? 3000 : 5000);
    return () => clearTimeout(t);
  }, [feedback, onClose]);

  if (!visible) return null;

  const ok = feedback?.type === "success";
  const accent = ok ? "var(--color-success)" : "var(--color-error)";
  const bg = ok
    ? "bg-gradient-to-r from-success/20 via-success/10 to-transparent"
    : "bg-gradient-to-r from-error/20 via-error/10 to-transparent";
  const icon = ok ? "check_circle" : "error";

  return (
    <div
      role={ok ? "status" : "alert"}
      aria-live={ok ? "polite" : "assertive"}
      className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none"
    >
      <div
        className={`pointer-events-auto mx-4 flex w-full max-w-md items-start gap-4 rounded-lg border px-6 py-5 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 ${bg} ${leaving ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        style={{ borderColor: `${accent}55` }}
      >
        <span className="material-symbols-outlined shrink-0 text-[28px]" style={{ color: accent }}>
          {icon}
        </span>
        <p className="flex-1 pt-0.5 text-[15px] font-medium leading-relaxed" style={{ color: accent }}>
          {feedback?.text}
        </p>
        <button
          type="button"
          onClick={() => {
            setLeaving(true);
            setTimeout(onClose, 300);
          }}
          aria-label="ปิด"
          className="shrink-0 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100"
          style={{ color: accent }}
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  );
}
