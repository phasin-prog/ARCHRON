"use client";

import { useState, type ReactNode } from "react";
import { ChevronRightIcon } from "@/components/icons";

export function ThresholdFootnote({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="my-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-text-secondary/80 transition-colors hover:text-[var(--color-text-heading)]"
      >
        <span
          className="inline-block transition-transform duration-300"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          <ChevronRightIcon className="h-3.5 w-3.5" />
        </span>
        {label}
      </button>
      <div
        className="overflow-hidden transition-all duration-500"
        style={{
          maxHeight: open ? "350px" : "0",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="mt-3 border-l-2 border-[var(--color-accent)] pl-4 pt-3">
          {children}
        </div>
      </div>
    </div>
  );
}
