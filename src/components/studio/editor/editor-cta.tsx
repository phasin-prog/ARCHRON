"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";

export function EditorCta({ draft, updateField }: {
  draft: EditorDraft; updateField: (field: keyof EditorDraft, value: unknown) => void;
}) {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="font-serif text-lg font-semibold text-text-heading">คำแนะนำเนื้อหาที่เกี่ยวข้อง (Related CTA)</h2>
      <div>
        <label className="block text-sm font-medium text-text-body">Article Slugs (คั่นด้วย ,)</label>
        <input type="text" value={draft.articleSlugs?.join(", ") ?? ""}
          onChange={(e) => updateField("articleSlugs", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          placeholder="slug1, slug2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">Concept Slugs (คั่นด้วย ,)</label>
        <input type="text" value={draft.conceptSlugs?.join(", ") ?? ""}
          onChange={(e) => updateField("conceptSlugs", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          placeholder="concept1, concept2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">Reading Set Slugs (คั่นด้วย ,)</label>
        <input type="text" value={draft.readingSetSlugs?.join(", ") ?? ""}
          onChange={(e) => updateField("readingSetSlugs", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          placeholder="set1, set2" />
      </div>
    </section>
  );
}
