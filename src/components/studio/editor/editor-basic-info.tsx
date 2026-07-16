"use client";

import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import { slugify } from "@/lib/content/publishing/publish-validation";
import type { ValidationIssue } from "@/lib/content/publishing/editor-validation";
import { InlineGuidance } from "./inline-guidance";

export function EditorBasicInfo({
  draft,
  updateField,
  validationIssues,
}: {
  draft: EditorDraft;
  updateField: (field: keyof EditorDraft, value: unknown) => void;
  validationIssues?: Record<string, ValidationIssue>;
}) {
  const handleTagsChange = (val: string) => {
    const tags = val.split(",").map((t) => t.trim()).filter(Boolean);
    updateField("tags", tags);
  };

  return (
    <section className="space-y-4">
      <h2 className="font-serif text-lg font-semibold text-text-heading">ข้อมูลพื้นฐานและกรอบแนวคิด</h2>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div id="container-field-title" className="rounded-lg transition-all duration-300">
          <label htmlFor="field-title" title="ชื่อเรื่อง (Title)" className="block text-sm font-medium text-text-body">
            ชื่อเรื่อง <span className="text-accent">*</span>
          </label>
          <input
            id="field-title"
            type="text"
            value={draft.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
            placeholder="ชื่อบทความ / แนวคิด..."
          />
          <InlineGuidance issue={validationIssues?.["field-title"]} />
        </div>

        <div id="container-field-slug" className="rounded-lg transition-all duration-300">
          <label htmlFor="field-slug" title="ลิงก์ถาวร (Slug/URL path)" className="block text-sm font-medium text-text-body">
            ลิงก์ถาวร <span className="text-accent">*</span>
          </label>
          <input
            id="field-slug"
            type="text"
            value={draft.slug || ""}
            onChange={(e) => updateField("slug", slugify(e.target.value))}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 font-mono text-sm"
            placeholder="article-slug"
          />
          <InlineGuidance issue={validationIssues?.["field-slug"]} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div id="container-field-content-type" className="rounded-lg transition-all duration-300">
          <label htmlFor="field-content-type" title="ประเภทเนื้อหา (Content Type)" className="block text-sm font-medium text-text-body">
            ประเภทเนื้อหา <span className="text-accent">*</span>
          </label>
          <select
            id="field-content-type"
            value={draft.contentType || "article"}
            onChange={(e) => updateField("contentType", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          >
            <option value="article">บทความ (Article)</option>
            <option value="concept">แนวคิด (Concept)</option>
            <option value="person">นักคิด (Person)</option>
            <option value="book">หนังสือ (Book)</option>
            <option value="symbol">สัญลักษณ์ (Symbol)</option>
            <option value="term">คำศัพท์ (Term)</option>
          </select>
        </div>

        <div>
          <label htmlFor="field-status" title="สถานะ (Article Status)" className="block text-sm font-medium text-text-body">
            สถานะ <span className="text-accent">*</span>
          </label>
          <select
            id="field-status"
            value={draft.status || "draft"}
            onChange={(e) => updateField("status", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          >
            <option value="draft">ฉบับร่าง (Draft)</option>
            <option value="needs-source-check">รอตรวจแหล่งอ้างอิง</option>
            <option value="ready-to-publish">พร้อมเผยแพร่</option>
            <option value="published">เผยแพร่แล้ว</option>
          </select>
        </div>

        <div>
          <label htmlFor="field-difficulty" title="ระดับความลึก (Difficulty Level)" className="block text-sm font-medium text-text-body">ระดับความลึก</label>
          <select
            id="field-difficulty"
            value={draft.difficulty || "beginner"}
            onChange={(e) => updateField("difficulty", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          >
            <option value="beginner">เบื้องต้น (Beginner)</option>
            <option value="intermediate">ระดับกลาง (Intermediate)</option>
            <option value="advanced">ระดับลึกซึ้ง (Advanced)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div id="container-field-framework" className="rounded-lg transition-all duration-300">
          <label htmlFor="field-framework" title="แขนงวิชา/ทฤษฎีหลัก (Framework)" className="block text-sm font-medium text-text-body">
            แขนงวิชา / ทฤษฎีหลัก <span className="text-accent">*</span>
          </label>
          <input
            id="field-framework"
            type="text"
            list="framework-options"
            value={draft.framework || ""}
            onChange={(e) => updateField("framework", e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
            placeholder="เช่น จิตวิทยาวิเคราะห์ (Analytical Psychology)"
          />
          <datalist id="framework-options">
            <option value="จิตวิทยาวิเคราะห์ (Analytical Psychology)" />
            <option value="จิตวิเคราะห์ (Psychoanalysis)" />
            <option value="ปรัชญาและญาณวิทยา (Philosophy & Epistemology)" />
            <option value="จิตวิทยาการวิวัฒนาการ (Evolutionary Psychology)" />
            <option value="สังคมวิทยาและมานุษยวิทยา (Sociology & Anthropology)" />
            <option value="ปรัชญาตะวันออก (Eastern Philosophy)" />
            <option value="ประสาทวิทยาศาสตร์ (Neuroscience)" />
          </datalist>
          <InlineGuidance issue={validationIssues?.["field-framework"]} />
        </div>

        <div id="container-field-tags" className="rounded-lg transition-all duration-300">
          <label htmlFor="field-tags" title="คำค้น (Tags)" className="block text-sm font-medium text-text-body">คำค้น (คั่นด้วยคอมมา)</label>
          <input
            id="field-tags"
            type="text"
            value={Array.isArray(draft.tags) ? draft.tags.join(", ") : ""}
            onChange={(e) => handleTagsChange(e.target.value)}
            className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
            placeholder="psyche, shadow, jung, ego"
          />
          <InlineGuidance issue={validationIssues?.["field-tags"]} />
        </div>
      </div>

      <div id="container-field-short-description" className="rounded-lg transition-all duration-300">
        <label htmlFor="field-short-description" title="คำอธิบายสั้น (Short Description)" className="block text-sm font-medium text-text-body">คำอธิบายสั้น</label>
        <textarea
          id="field-short-description"
          value={draft.shortDescription || ""}
          onChange={(e) => updateField("shortDescription", e.target.value)}
          className="mt-1 w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30 resize-y"
          rows={2}
          placeholder="สรุปย่อ 1-2 ประโยค สำหรับแสดงบนการ์ดและผลการค้นหา..."
        />
        <InlineGuidance issue={validationIssues?.["field-short-description"]} />
      </div>
    </section>
  );
}
