"use client";

import { findLinkSuggestions } from "@/lib/content/internal-links";

// แสดงคำที่ตรงกับ Concept Registry จากเนื้อหาที่เขียน — ผู้เขียนกดเพื่อแทรก [[ ]] เอง (ไม่ auto-insert)
export function InternalLinkSuggestionPanel({
  text,
  onInsert,
}: {
  text: string;
  onInsert: (term: string) => void;
}) {
  const suggestions = findLinkSuggestions(text);
  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-md border border-text-heading/10 bg-surface-1/40 p-5">
      <h3 className="font-serif text-base text-text-heading">ลิงก์ที่อาจเชื่อม</h3>
      <p className="mt-1 text-xs text-text-secondary">
        พบคำที่ตรงกับ Concept Registry — กดเพื่อแทรก [[ ]] (ต้องยืนยันเอง ไม่แทรกอัตโนมัติ)
      </p>
      <ul className="mt-3 space-y-2">
        {suggestions.map((s) => (
          <li key={s.slug} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-text-body">
              {s.title} <span className="text-xs text-accent">{s.nodeType}</span>
            </span>
            <button
              type="button"
              onClick={() => onInsert(s.title)}
              className="rounded border border-text-heading/20 px-2 py-1 text-xs text-text-body hover:border-accent"
            >
              + [[ ]]
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
