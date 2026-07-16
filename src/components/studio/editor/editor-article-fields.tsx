"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import type { ValidationIssue } from "@/lib/content/publishing/editor-validation";
import { InlineGuidance } from "./inline-guidance";

export function EditorArticleFields({
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
      <h2 className="font-serif text-lg font-semibold text-text-heading">ข้อมูลบทความ (Article Fields)</h2>
      <p className="text-xs text-text-secondary">
        กรอกข้อมูลส่วนนี้เพื่อให้ผ่านเกณฑ์ Publish Checklist ด้านความลึกซึ้งทางวิชาการและคำอธิบายให้เห็นภาพ — Roots ไม่บังคับสำหรับบทความ
      </p>

      <div id="container-field-visual-explanation" className="rounded-lg transition-all duration-300">
          <label htmlFor="field-visual-explanation" title="คำอธิบายให้เห็นภาพ (Visual Explanation)" className="block text-sm font-medium text-text-body">
            คำอธิบายให้เห็นภาพ
          </label>
        <p className="mb-1 text-xs text-text-secondary/80">อธิบายภาพเปรียบเปรยหรือตัวอย่างเชิงประจักษ์ที่ช่วยให้ผู้อ่านเข้าใจแก่นเรื่องทันที</p>
        <textarea
          id="field-visual-explanation"
          value={draft.visualExplanation || ""}
          onChange={(e) => updateField("visualExplanation", e.target.value)}
          className="w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y"
          rows={3}
          placeholder="ตัวอย่างเช่น: การเปรียบจิตไร้สำนึกเสมือนภูเขาน้ำแข็งที่ส่วนใหญ่อยู่ใต้มหาสมุทร..."
        />
        <InlineGuidance issue={validationIssues?.["field-visual-explanation"]} />
      </div>

      <div id="container-field-technical-meaning" className="rounded-lg transition-all duration-300">
          <label htmlFor="field-technical-meaning" title="ความหมายทางวิชาการ (Technical Meaning)" className="block text-sm font-medium text-text-body">
            ความหมายทางวิชาการ
          </label>
        <p className="mb-1 text-xs text-text-secondary/80">นิยามที่แม่นยำตามทฤษฎีหรือกรอบแนวคิดทางวิชาการ</p>
        <textarea
          id="field-technical-meaning"
          value={draft.technicalMeaning || ""}
          onChange={(e) => updateField("technicalMeaning", e.target.value)}
          className="w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y"
          rows={3}
          placeholder="ตัวอย่างเช่น: ในทฤษฎีของคาร์ล ชุง หมายถึงโครงสร้างทางจิตที่เป็นตัวแทนของการปรับตัวเข้ากับสังคม..."
        />
        <InlineGuidance issue={validationIssues?.["field-technical-meaning"]} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div id="container-field-roots-etymology" className="rounded-lg transition-all duration-300">
          <label htmlFor="field-roots-etymology" title="รากศัพท์/ที่มา (Etymology/Origin)" className="block text-sm font-medium text-text-body">
            รากศัพท์หรือที่มา (Roots / Etymology) <span className="text-text-secondary/60 text-xs">(ไม่บังคับ)</span>
          </label>
          <p className="mb-1 text-xs text-text-secondary/80">ที่มาของคำศัพท์ในภาษาละติน กรีก หรือประวัติศาสตร์แนวคิด — เว้นว่างได้หากบทความไม่เกี่ยวข้อง</p>
          <input
            id="field-roots-etymology"
            type="text"
            value={draft.rootsEtymology || ""}
            onChange={(e) => updateField("rootsEtymology", e.target.value)}
            className="w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
            placeholder="เช่น กรีกโบราณ ψυχή (psykhē)... หรือใส่ - หากไม่มี"
          />
          <InlineGuidance issue={validationIssues?.["field-roots-etymology"]} />
        </div>

        <div id="container-field-roots-caution" className="rounded-lg transition-all duration-300">
          <label htmlFor="field-roots-caution" title="คำเตือนการใช้ (Usage Warning)" className="block text-sm font-medium text-text-body">
            คำเตือนการใช้ (Roots Caution) <span className="text-text-secondary/60 text-xs">(ไม่บังคับ)</span>
          </label>
          <p className="mb-1 text-xs text-text-secondary/80">ข้อควรระวังในการแปลความหมาย — เว้นว่างได้</p>
          <input
            id="field-roots-caution"
            type="text"
            value={draft.rootsCaution || ""}
            onChange={(e) => updateField("rootsCaution", e.target.value)}
            className="w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
            placeholder="เช่น เป็นแนวคิดร่วมสมัย หรือ ข้อควรระวังไม่สับสนกับคำทั่วไป..."
          />
        </div>
      </div>
    </section>
  );
}
