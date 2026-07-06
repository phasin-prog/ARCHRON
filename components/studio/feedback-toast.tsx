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
  const accent = ok ? "var(--color-success)" : "var(--color-danger)";
  const bg = ok
    ? "bg-gradient-to-r from-success/20 via-success/10 to-transparent"
    : "bg-gradient-to-r from-danger/20 via-danger/10 to-transparent";
  const icon = ok ? "check_circle" : "error";

  return (
    <div
      role={ok ? "status" : "alert"}
      aria-live={ok ? "polite" : "assertive"}
      className="fixed inset-x-0 top-0 z-[70] flex justify-center pointer-events-none"
    >
      <div
        className={`
          pointer-events-auto mx-4 mt-[76px] flex w-full max-w-3xl items-center gap-4
          rounded-lg border px-5 py-4 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5)]
          backdrop-blur-xl transition-all duration-300
          ${bg}
          ${leaving ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}
        `}
        style={{ borderColor: `${accent}55` }}
      >
        <span
          className="material-symbols-outlined shrink-0 text-[26px]"
          style={{ color: accent }}
        >
          {icon}
        </span>
        <p
          className="flex-1 text-[15px] font-medium leading-relaxed tracking-wide"
          style={{ color: accent }}
        >
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
