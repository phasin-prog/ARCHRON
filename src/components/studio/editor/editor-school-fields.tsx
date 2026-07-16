"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import type { ValidationIssue } from "@/lib/content/publishing/editor-validation";
import { InlineGuidance } from "./inline-guidance";

export function EditorSchoolFields({ draft, updateField, validationIssues }: {
  draft: EditorDraft; updateField: (field: keyof EditorDraft, value: unknown) => void;
  validationIssues?: Record<string, ValidationIssue>;
}) {
  return (
    <section className="space-y-4 border-t border-border pt-6">
      <h2 className="font-serif text-lg font-semibold text-text-heading">ข้อมูลสำนักคิด</h2>
      <div>
        <label title="ผู้ก่อตั้ง (Founder)" className="block text-sm font-medium text-text-body">ผู้ก่อตั้ง</label>
        <input type="text" value={draft.founder} onChange={(e) => updateField("founder", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
        <InlineGuidance issue={validationIssues?.["field-founder"]} />
      </div>
      <div>
        <label title="ช่วงเวลา (Time Period)" className="block text-sm font-medium text-text-body">ช่วงเวลา</label>
        <input type="text" value={draft.period} onChange={(e) => updateField("period", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
        <InlineGuidance issue={validationIssues?.["field-period"]} />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body">Framework</label>
        <input type="text" value={draft.framework} onChange={(e) => updateField("framework", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
        <InlineGuidance issue={validationIssues?.["field-framework"]} />
      </div>
      <div>
        <label title="แนวคิดสำคัญ (Key Ideas)" className="block text-sm font-medium text-text-body">แนวคิดสำคัญ (คั่นด้วย ,)</label>
        <textarea value={draft.keyIdeas} onChange={(e) => updateField("keyIdeas", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y" rows={2} />
        <InlineGuidance issue={validationIssues?.["field-key-ideas"]} />
      </div>
      <div>
        <label title="คำอธิบายสั้น (Description)" className="block text-sm font-medium text-text-body">คำอธิบายสั้น</label>
        <textarea value={draft.shortDescription} onChange={(e) => updateField("shortDescription", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y" rows={2} />
        <InlineGuidance issue={validationIssues?.["field-short-description"]} />
      </div>
    </section>
  );
}
