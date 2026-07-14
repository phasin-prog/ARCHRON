"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import type { ValidationIssue } from "@/lib/content/publishing/editor-validation";
import { InlineGuidance } from "./inline-guidance";

export function EditorPersonFields({
  draft,
  updateField,
  validationIssues,
}: {
  draft: EditorDraft;
  updateField: (field: keyof EditorDraft, value: unknown) => void;
  validationIssues?: Record<string, ValidationIssue>;
}) {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="font-serif text-lg font-semibold text-text-heading">ข้อมูลนักคิดและคุณูปการทางวิชาการ (Thinker & Academic Impact)</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-body">ปีเกิด</label>
          <input type="text" value={draft.bornYear || ""} onChange={(e) => updateField("bornYear", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
            placeholder="1875" />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-body">ปีเสียชีวิต</label>
          <input type="text" value={draft.diedYear || ""} onChange={(e) => updateField("diedYear", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
            placeholder="1961 (หรือ - หากยังมีชีวิตอยู่)" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">สัญชาติ</label>
        <input type="text" value={draft.nationality || ""} onChange={(e) => updateField("nationality", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          placeholder="สวิส (Swiss)" />
      </div>
      <div id="container-field-technical-meaning" className="rounded-lg transition-all duration-300">
        <label htmlFor="field-technical-meaning" className="block text-sm font-medium text-text-body">
          ความหมายทางวิชาการ / บทบาทต่อสาขาวิชา (Technical Meaning) <span className="text-accent">*</span>
        </label>
        <p className="mb-1 text-xs text-text-secondary/80">สรุปคุณูปการหลักหรืออิทธิพลเชิงทฤษฎีที่มีต่อแวดวงวิชาการจิตใจมนุษย์</p>
        <textarea
          id="field-technical-meaning"
          value={draft.technicalMeaning || ""}
          onChange={(e) => updateField("technicalMeaning", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y"
          rows={3}
          placeholder="ตัวอย่าง: ผู้ริเริ่มจิตวิทยาวิเคราะห์และผู้เสนอแนวคิดเรื่องจิตไร้สำนึกร่วม (Collective Unconscious)..."
        />
        <InlineGuidance issue={validationIssues?.["field-technical-meaning"]} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">แนวคิดสำคัญ (คั่นด้วย ,)</label>
        <textarea value={draft.keyIdeas || ""} onChange={(e) => updateField("keyIdeas", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y" rows={2}
          placeholder="Archetypes, Shadow, Individuation, Synchronicity" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">ผลงานเด่น (คั่นด้วย ,)</label>
        <textarea value={draft.notableWorks || ""} onChange={(e) => updateField("notableWorks", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y" rows={2}
          placeholder="Psychological Types (1921), Man and His Symbols (1964), The Red Book" />
      </div>
    </section>
  );
}
