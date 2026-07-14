"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import type { ValidationIssue } from "@/lib/content/publishing/editor-validation";
import { InlineGuidance } from "./inline-guidance";

export function EditorConceptFields({
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
      <h2 className="font-serif text-lg font-semibold text-text-heading">ข้อมูลแนวคิด (Concept Details)</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div id="container-field-main-term" className="rounded-lg transition-all duration-300">
          <label htmlFor="field-main-term" className="block text-sm font-medium text-text-body">ศัพท์หลัก (Main Term)</label>
          <input
            id="field-main-term"
            type="text"
            value={draft.mainTerm || ""}
            onChange={(e) => updateField("mainTerm", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div>
          <label htmlFor="field-thai-name" className="block text-sm font-medium text-text-body">ชื่อไทย</label>
          <input
            id="field-thai-name"
            type="text"
            value={draft.thaiName || ""}
            onChange={(e) => updateField("thaiName", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div id="container-field-roots-etymology" className="rounded-lg transition-all duration-300">
          <label htmlFor="field-roots-etymology" className="block text-sm font-medium text-text-body">
            รากศัพท์ (Etymology) <span className="text-accent">*</span>
          </label>
          <input
            id="field-roots-etymology"
            type="text"
            value={draft.rootsEtymology || ""}
            onChange={(e) => updateField("rootsEtymology", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          />
          <InlineGuidance issue={validationIssues?.["field-roots-etymology"]} />
        </div>
        <div id="container-field-roots-caution" className="rounded-lg transition-all duration-300">
          <label htmlFor="field-roots-caution" className="block text-sm font-medium text-text-body">
            คำเตือน / เหตุผลที่ยังไม่ใส่ (Caution) <span className="text-accent">*</span>
          </label>
          <input
            id="field-roots-caution"
            type="text"
            value={draft.rootsCaution || ""}
            onChange={(e) => updateField("rootsCaution", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          />
        </div>
      </div>

      <div id="container-field-visual-explanation" className="rounded-lg transition-all duration-300">
        <label htmlFor="field-visual-explanation" className="block text-sm font-medium text-text-body">
          คำอธิบายให้เห็นภาพ (Visual Explanation) <span className="text-accent">*</span>
        </label>
        <textarea
          id="field-visual-explanation"
          value={draft.visualExplanation || ""}
          onChange={(e) => updateField("visualExplanation", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y"
          rows={3}
        />
        <InlineGuidance issue={validationIssues?.["field-visual-explanation"]} />
      </div>

      <div id="container-field-technical-meaning" className="rounded-lg transition-all duration-300">
        <label htmlFor="field-technical-meaning" className="block text-sm font-medium text-text-body">
          ความหมายทางวิชาการ (Technical Meaning) <span className="text-accent">*</span>
        </label>
        <textarea
          id="field-technical-meaning"
          value={draft.technicalMeaning || ""}
          onChange={(e) => updateField("technicalMeaning", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y"
          rows={3}
        />
        <InlineGuidance issue={validationIssues?.["field-technical-meaning"]} />
      </div>
    </section>
  );
}
