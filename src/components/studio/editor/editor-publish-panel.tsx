"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import { getPublishChecklist, canPublish } from "@/lib/content/publishing/publish-validation";

export function EditorPublishPanel({ draft, publishTried, deadLinks, onPublish, publishing }: {
  draft: EditorDraft;
  publishTried: boolean;
  deadLinks: string[];
  onPublish: () => void;
  publishing: boolean;
}) {
  const checklist = getPublishChecklist(draft);
  const ready = canPublish(checklist) && deadLinks.length === 0;

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="font-serif text-lg font-semibold text-text-heading">ตรวจสอบก่อนเผยแพร่</h2>
      <ul className="space-y-2 text-sm">
        {checklist.map((c) => (
          <li key={c.label} className={`flex items-center gap-2 ${c.ok ? "text-text-body" : "text-text-secondary"}`}>
            <span className={c.ok ? "text-accent" : "text-text-secondary"}>
              {c.ok ? "\u2713" : "\u2715"}
            </span>
            {c.label}
          </li>
        ))}
      </ul>
      {deadLinks.length > 0 && (
        <p className="text-xs text-text-secondary" role="alert">
          ลิงก์เสีย {deadLinks.length}: {deadLinks.join(", ")}
        </p>
      )}
      {publishTried && !ready && (
        <p className="text-sm text-red-600">ยังเผยแพร่ไม่ได้ — ทำรายการที่ยังไม่ผ่านให้ครบ</p>
      )}
      {ready && (
        <button
          type="button"
          onClick={onPublish}
          disabled={publishing}
          className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
        >
          {publishing ? "กำลังเผยแพร่..." : "เผยแพร่"}
        </button>
      )}
    </section>
  );
}
