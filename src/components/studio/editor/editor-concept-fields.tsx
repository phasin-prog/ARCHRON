"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";

export function EditorConceptFields({ draft, updateField }: {
  draft: EditorDraft; updateField: (field: keyof EditorDraft, value: unknown) => void;
}) {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="font-serif text-lg font-semibold text-text-heading">ข้อมูลแนวคิด</h2>
      <div>
        <label className="block text-sm font-medium text-text-body">ศัพท์หลัก (Main Term)</label>
        <input type="text" value={draft.mainTerm} onChange={(e) => updateField("mainTerm", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">ชื่อไทย</label>
        <input type="text" value={draft.thaiName} onChange={(e) => updateField("thaiName", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">รากศัพท์ (Etymology)</label>
        <input type="text" value={draft.rootsEtymology} onChange={(e) => updateField("rootsEtymology", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">คำเตือน (Caution)</label>
        <input type="text" value={draft.rootsCaution} onChange={(e) => updateField("rootsCaution", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">Framework</label>
        <input type="text" value={draft.framework} onChange={(e) => updateField("framework", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">คำอธิบาย (Visual Explanation)</label>
        <textarea value={draft.visualExplanation} onChange={(e) => updateField("visualExplanation", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y" rows={3} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">ความหมายทางวิชาการ</label>
        <textarea value={draft.technicalMeaning} onChange={(e) => updateField("technicalMeaning", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y" rows={3} />
      </div>
    </section>
  );
}
