"use client";

import { CheckIcon } from "@/components/icons";

type Props = {
  autoState: "idle" | "saving" | "saved";
  savedAt: string | null;
};

export function EditorStatusBar({ autoState, savedAt }: Props) {
  if (autoState === "idle" && !savedAt) return null;

  if (autoState === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs text-accent">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        กำลังบันทึกอัตโนมัติ...
      </span>
    );
  }

  if (autoState === "saved" && savedAt) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success">
        <CheckIcon className="h-3 w-3" />
        บันทึกแล้ว {savedAt}
      </span>
    );
  }

  return null;
}
