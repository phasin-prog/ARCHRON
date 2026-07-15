"use client";

import { useEffect } from "react";
import { CheckIcon, ClockIcon, EditIcon } from "@/components/icons";
import { Modal } from "@/components/modal";

export type EditorFeedbackData = {
  type: "success" | "error" | "info";
  title: string;
  message: string;
};

type Props = {
  feedback: EditorFeedbackData | null;
  onClose: () => void;
};

export function EditorFeedback({ feedback, onClose }: Props) {
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(onClose, feedback.type === "success" ? 3000 : 6000);
    return () => clearTimeout(t);
  }, [feedback, onClose]);

  if (!feedback) return null;

  const accentMap = {
    success: "var(--color-success)",
    error: "var(--color-error)",
    info: "var(--color-accent)",
  };
  const iconComponents = {
    success: CheckIcon,
    error: ClockIcon,
    info: EditIcon,
  } as const;
  const accent = accentMap[feedback.type];
  const Icon = iconComponents[feedback.type];

  return (
    <Modal open={!!feedback} onClose={onClose}>
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}18` }}>
          {Icon && <Icon className="h-7 w-7" style={{ color: accent }} />}
        </span>
        <div>
          <h3 className="text-base font-semibold" style={{ color: accent }}>{feedback.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{feedback.message}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onClose}
          className="mt-2 rounded-md px-5 py-2 text-sm font-medium text-text-inverse transition-all hover:brightness-110"
          style={{ backgroundColor: accent }}
        >
          ปิด
        </button>
      </div>
    </Modal>
  );
}
