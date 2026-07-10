"use client";

import { useEffect, useState } from "react";
import { EditorIcon } from "@/components/studio/editor-icon";

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
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!feedback) { setVisible(false); return; }
    setVisible(true);
    setLeaving(false);
    const t = setTimeout(() => {
      setLeaving(true);
      setTimeout(onClose, 300);
    }, feedback.type === "success" ? 3000 : 6000);
    return () => clearTimeout(t);
  }, [feedback, onClose]);

  useEffect(() => {
    if (!visible) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setLeaving(true); setTimeout(onClose, 300); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [visible, onClose]);

  if (!visible || !feedback) return null;

  const accentMap = {
    success: "var(--color-success)",
    error: "var(--color-error)",
    info: "var(--color-accent)",
  };
  const iconMap = {
    success: "check_circle" as const,
    error: "report" as const,
    info: "edit_note" as const,
  };
  const accent = accentMap[feedback.type];
  const iconName = iconMap[feedback.type];

  return (
    <div
      className="fixed inset-0 z-toast flex items-center justify-center bg-bg/60 backdrop-blur-sm"
      onClick={() => { setLeaving(true); setTimeout(onClose, 300); }}
    >
      <div
        className={`pointer-events-auto mx-4 flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border px-8 py-10 text-center shadow-[0_24px_80px_-16px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 ${
          leaving ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ borderColor: `${accent}40`, backgroundColor: `color-mix(in srgb, ${accent} 6%, var(--color-bg))` }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: `${accent}18` }}>
          <EditorIcon name={iconName} className="h-7 w-7" accent={accent} />
        </span>
        <div>
          <h3 className="text-base font-semibold" style={{ color: accent }}>{feedback.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{feedback.message}</p>
        </div>
        <button
          type="button"
          onClick={() => { setLeaving(true); setTimeout(onClose, 300); }}
          className="mt-2 rounded-md px-5 py-2 text-sm font-medium text-text-inverse transition-all hover:brightness-110"
          style={{ backgroundColor: accent }}
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
