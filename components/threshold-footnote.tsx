"use client";

import { useState, type ReactNode } from "react";

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
        className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] transition-colors hover:text-[var(--color-text-heading)]"
      >
        <span
          className="inline-block transition-transform duration-300"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
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
