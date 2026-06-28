"use client";

import { useState, type ReactNode } from "react";

export type AccordionItem = { id: string; title: string; content: ReactNode };

// Accordion / Collapse — คลิกเพื่อพับ/กาง (รองรับมือถือ) กางแบบลื่นด้วย grid-rows
export function Accordion({
  items,
  single = false,
}: {
  items: AccordionItem[];
  single?: boolean;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = single ? new Set<string>() : new Set(open);
    if (open.has(id)) next.delete(id);
    else next.add(id);
    setOpen(next);
  };

  return (
    <div className="divide-y divide-ink/[0.07] overflow-hidden rounded-md border border-slate-boundary/50">
      {items.map((it) => {
        const isOpen = open.has(it.id);
        return (
          <div key={it.id} className="bg-surface-container/40">
            <button
              type="button"
              onClick={() => toggle(it.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-surface-container/70"
            >
              <span className="font-serif text-lg leading-snug text-on-surface">{it.title}</span>
              <span
                className={`material-symbols-outlined shrink-0 text-on-surface-variant/60 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 text-[15px] leading-relaxed text-on-surface-variant/80">
                  {it.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
