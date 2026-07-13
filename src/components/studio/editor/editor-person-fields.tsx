"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";

export function EditorPersonFields({ draft, updateField }: {
  draft: EditorDraft; updateField: (field: keyof EditorDraft, value: unknown) => void;
}) {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="font-serif text-lg font-semibold text-text-heading">ข้อมูลนักคิด</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-body">ปีเกิด</label>
          <input type="text" value={draft.bornYear} onChange={(e) => updateField("bornYear", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-body">ปีเสียชีวิต</label>
          <input type="text" value={draft.diedYear} onChange={(e) => updateField("diedYear", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">สัญชาติ</label>
        <input type="text" value={draft.nationality} onChange={(e) => updateField("nationality", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">แนวคิดสำคัญ (คั่นด้วย ,)</label>
        <textarea value={draft.keyIdeas} onChange={(e) => updateField("keyIdeas", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y" rows={2} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">ผลงานเด่น (คั่นด้วย ,)</label>
        <textarea value={draft.notableWorks} onChange={(e) => updateField("notableWorks", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y" rows={2} />
      </div>
    </section>
  );
}
