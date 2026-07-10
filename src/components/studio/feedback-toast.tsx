"use client";

import { useEffect } from "react";
import { Modal } from "@/components/modal";

export type Feedback = { type: "success" | "error"; text: string };

export function FeedbackToast({
  feedback,
  onClose,
}: {
  feedback: Feedback | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(onClose, feedback.type === "success" ? 3000 : 5000);
    return () => clearTimeout(t);
  }, [feedback, onClose]);

  if (!feedback) return null;

  const ok = feedback.type === "success";
  const accent = ok ? "var(--color-success)" : "var(--color-error)";
  const icon = ok ? "✓" : "!";

  return (
    <Modal open={!!feedback} onClose={onClose}>
      <div className="flex items-start gap-4">
        <span
          className="flex shrink-0 items-center justify-center text-[28px] font-bold"
          style={{ color: accent }}
          aria-hidden="true"
        >
          {icon}
        </span>
        <p className="flex-1 pt-0.5 text-[15px] font-medium leading-relaxed" style={{ color: accent }}>
          {feedback.text}
        </p>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-4 py-2 text-sm font-medium text-text-inverse transition-all hover:brightness-110"
          style={{ backgroundColor: accent }}
        >
          ปิด
        </button>
      </div>
    </Modal>
  );
}
