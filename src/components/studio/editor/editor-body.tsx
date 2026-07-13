"use client";

import { useState } from "react";
import type { EditorDraft } from "@/lib/content/publishing/publish-validation";

export function EditorBody({ draft, updateField }: {
  draft: EditorDraft; updateField: (field: keyof EditorDraft, value: unknown) => void;
}) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <section className="space-y-4 border-t border-border pt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-text-heading">เนื้อหา (Markdown)</h2>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-text-body hover:bg-bg-elevated transition-colors"
        >
          {showPreview ? "แก้ไข" : "พรีวิว"}
        </button>
      </div>
      {showPreview ? (
        <div className="min-h-[300px] rounded-md border border-text-heading/15 bg-bg-card p-4 prose prose-sm max-w-none text-text-body">
          {draft.bodyMarkdown ? (
            <pre className="whitespace-pre-wrap font-sans text-sm">{draft.bodyMarkdown}</pre>
          ) : (
            <p className="text-text-secondary italic">ยังไม่มีเนื้อหา</p>
          )}
        </div>
      ) : (
        <textarea
          value={draft.bodyMarkdown}
          onChange={(e) => updateField("bodyMarkdown", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y font-mono text-sm"
          rows={20}
          placeholder="เขียนเนื้อหาด้วย Markdown..."
        />
      )}
    </section>
  );
}
