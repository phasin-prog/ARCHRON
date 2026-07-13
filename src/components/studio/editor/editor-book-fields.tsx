"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";

export function EditorBookFields({ draft, updateField }: {
  draft: EditorDraft; updateField: (field: keyof EditorDraft, value: unknown) => void;
}) {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="font-serif text-lg font-semibold text-text-heading">ข้อมูลหนังสือ</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-body">ปีที่พิมพ์</label>
          <input type="text" value={draft.publicationYear} onChange={(e) => updateField("publicationYear", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-body">สำนักพิมพ์</label>
          <input type="text" value={draft.publisher} onChange={(e) => updateField("publisher", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">ISBN</label>
        <input type="text" value={draft.isbn} onChange={(e) => updateField("isbn", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">Framework</label>
        <input type="text" value={draft.framework} onChange={(e) => updateField("framework", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">คำอธิบายสั้น</label>
        <textarea value={draft.shortDescription} onChange={(e) => updateField("shortDescription", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y" rows={2} />
      </div>
    </section>
  );
}
