"use client";

import { useState, useRef } from "react";
import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import type { ValidationIssue } from "@/lib/content/publishing/editor-validation";
import { MarkdownRenderer } from "@/components/reading/markdown-renderer";
import { EditorIcon } from "@/components/studio/editor-icon";
import { InlineGuidance } from "./inline-guidance";

type ViewMode = "write" | "split" | "preview";


type ToolbarItem =
  | { type: "divider" }
  | {
      type?: "button";
      label: string;
      title: string;
      prefix: string;
      suffix: string;
      defaultText: string;
      bold?: boolean;
      italic?: boolean;
      strike?: boolean;
      highlight?: boolean;
    };

const TOOLBAR_ITEMS: ToolbarItem[] = [
  { label: "B", title: "ตัวหนา (Bold)", prefix: "**", suffix: "**", defaultText: "ตัวหนา", bold: true },
  { label: "I", title: "ตัวเอียง (Italic)", prefix: "*", suffix: "*", defaultText: "ตัวเอียง", italic: true },
  { label: "S", title: "ขีดฆ่า (Strikethrough)", prefix: "~~", suffix: "~~", defaultText: "ขีดฆ่า", strike: true },
  { type: "divider" },
  { label: "H2", title: "หัวข้อหลัก (Heading 2)", prefix: "## ", suffix: "", defaultText: "หัวข้อหลัก" },
  { label: "H3", title: "หัวข้อย่อย (Heading 3)", prefix: "### ", suffix: "", defaultText: "หัวข้อย่อย" },
  { label: "Quote", title: "โควตข้อความ (Blockquote)", prefix: "> ", suffix: "", defaultText: "คำคมหรืออ้างอิง" },
  { type: "divider" },
  { label: "Code", title: "โค้ดบล็อก (Code Block)", prefix: "```ts\n", suffix: "\n```", defaultText: "// โค้ดที่นี่" },
  { label: "Table", title: "ตาราง (Table)", prefix: "| หัวข้อ 1 | หัวข้อ 2 |\n| --- | --- |\n| ข้อมูล 1 | ข้อมูล 2 |\n", suffix: "", defaultText: "" },
  { label: "Task", title: "รายการตรวจสอบ (Task List)", prefix: "- [ ] ", suffix: "", defaultText: "สิ่งที่ต้องทำ" },
  { type: "divider" },
  { label: "Link", title: "แทรกลิงก์ (External Link)", prefix: "[", suffix: "](https://example.com)", defaultText: "ชื่อลิงก์" },
  { label: "[[Concept]]", title: "เชื่อมโยงแนวคิดภายใน (Wikilink)", prefix: "[[", suffix: "|ชื่อที่แสดง]]", defaultText: "concept-slug", highlight: true },
  { label: "[[Cite]]", title: "แทรกจุดอ้างอิง (Citation)", prefix: "[[cite: ", suffix: "]]", defaultText: "1, 2", highlight: true },
  { type: "divider" },
  {
    label: "📑 ปลูกโครงสร้างมาตรฐาน (Insert SSOT Template)",
    title: "แทรกโครงสร้างหัวข้อมาตรฐาน Archron (Visual, Technical, Roots, References) ลงใน Body Markdown",
    prefix: "## 🌟 คำอธิบายให้เห็นภาพ (Visual Explanation)\n[อธิบายเปรียบเปรยหรือตัวอย่างเชิงประจักษ์ด้วยภาษาที่เข้าใจง่าย เพื่อให้บุคคลทั่วไปเข้าใจได้ทันที...]\n\n## 🎓 นิยามและแก่นทางวิชาการ (Technical Meaning)\n[ระบุนิยามทางวิชาการและทฤษฎีที่เกี่ยวข้อง...]\n\n## 🏛️ รากศัพท์และการเปลี่ยนผ่านความหมาย (Etymology & Roots)\n[ระบุที่มาของคำเดิมในภาษากรีก/ละติน หรือเหตุผล...]\n\n## 📖 เนื้อหาและคำอธิบายเชิงลึก (Core Content)\n",
    suffix: "\n\n## 🔗 แนวคิดที่เกี่ยวข้อง (Related Concepts)\n- [[Analytical Psychology]] : กรอบคิดและโครงข่ายหลัก\n\n## 📚 แหล่งอ้างอิงและตำรา (References)\n- [1] Jung, C. G. (1968). *The Archetypes and the Collective Unconscious*.\n",
    defaultText: "เริ่มเขียนการวิเคราะห์ทั้งหมดที่นี่...",
    highlight: true,
  },
];

export function EditorBody({
  draft,
  updateField,
  validationIssues,
}: {
  draft: EditorDraft;
  updateField: (field: keyof EditorDraft, value: unknown) => void;
  validationIssues?: Record<string, ValidationIssue>;
}) {
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const content = draft.bodyMarkdown || "";

  // คำนวณสถิติเวลาอ่านและจำนวนตัวอักษร/คำ
  const charCount = content.length;
  // ภาษาไทยไม่เว้นวรรคคำ จึงประมาณคำโดยใช้อักขระเฉลี่ย 5 ตัว/คำ หรือนับช่องว่างหากเป็นอังกฤษ
  const wordCount = Math.max(0, Math.round(charCount / 5));
  const readTimeMinutes = Math.max(1, Math.round(charCount / 400));

  // ฟังก์ชันช่วยแทรก Markdown ตรงตำแหน่งเคอร์เซอร์ที่เลือกอยู่ (เรียกใน onClick event handler เท่านั้น)
  const insertMarkdown = (prefix: string, suffix: string, defaultText = "ข้อความ") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    updateField("bodyMarkdown", newContent);

    // ย้ายตำแหน่งเคอร์เซอร์ไปยังข้อความที่แทรกใหม่หลังจาก State อัปเดต
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  const generateSSOTTemplate = (targetType?: string) => {
    const ct = targetType || draft.contentType || "article";
    const title = draft.title || (ct === "concept" ? "ชื่อแนวคิดใหม่ (Concept Title)" : "ชื่อหัวข้อบทความ (Article Title)");
    
    let template = `# ${title}\n\n`;

    if (ct === "concept" || ct === "term" || ct === "symbol") {
      template += `> **ศัพท์หลัก (Main Term):** ${draft.mainTerm || "Archetype"} | **ชื่อไทย:** ${draft.thaiName || "แม่แบบดั้งเดิม"} | **รากศัพท์ (Etymology):** ${draft.originalTerm || "αρχέτυπον (กรีก)"}\n\n`;
    } else if (ct === "person") {
      template += `> **นักคิดหลัก:** ${draft.mainThinker || "Carl Gustav Jung"} | **ช่วงชีวิต:** ${draft.bornYear || "1875"} - ${draft.diedYear || "1961"} | **สัญชาติ:** ${draft.nationality || "สวิส"}\n\n`;
    }

    if (draft.framework) {
      template += `## 🧩 กรอบทฤษฎีและแขนงวิชา (Framework)\n- **สังกัดทฤษฎี:** ${draft.framework}\n\n`;
    }

    template += `## 🌟 คำอธิบายให้เห็นภาพ (Visual Explanation)\n> [!NOTE] คำอธิบายเชิงประจักษ์\n${draft.visualExplanation || "[อธิบายภาพเปรียบเปรยหรือตัวอย่างเชิงประจักษ์ด้วยภาษาที่เข้าใจง่าย เพื่อให้บุคคลทั่วไปสามารถนึกภาพและเข้าใจแนวคิดนี้ได้ทันทีตั้งแต่ย่อหน้าแรก...]"}\n\n`;

    template += `## 🎓 นิยามและความหมายทางวิชาการ (Technical Meaning)\n${draft.technicalMeaning || "[ระบุนิยามทางวิชาการที่แม่นยำตามทฤษฎีเชิงลึก และอธิบายกลไกการทำงานทางจิตวิทยาของแนวคิดนี้...]"}\n\n`;

    if (ct === "concept" || ct === "term") {
      template += `## 🏛️ รากศัพท์และการเปลี่ยนผ่านความหมาย (Etymology & Roots)\n- **ที่มาและรากคำดั้งเดิม:** ${draft.rootsEtymology || "[อธิบายรากคำในภาษากรีก/ละติน การเริ่มใช้ครั้งแรกโดยใครในบริบทใด...]"}\n- **ข้อควรระวังในการตีความ:** ${draft.rootsCaution || "[ข้อควรระวังไม่ให้นำไปสับสนกับความหมายในภาษาปุถุชนทั่วไป...]"}\n\n`;
    }

    template += `## 📖 เนื้อหาหลักและการวิเคราะห์เชิงลึก (Core Content & MDX)\n[เรียบเรียงการวิเคราะห์ทั้งหมดที่นี่ รองรับ GFM, Callout Blocks (\`> [!IMPORTANT]\`), ตารางเปรียบเทียบ, โค้ดบล็อก และการจัดรูปแบบขั้นสูง]\n\n`;

    template += `### ตัวอย่างตารางเปรียบเทียบ (Comparison Table)\n| มิติการวิเคราะห์ | ทฤษฎีจิตวิทยาวิเคราะห์ (Jung) | ทฤษฎีจิตวิเคราะห์ (Freud) |\n| --- | --- | --- |\n| **โครงสร้างไร้สำนึก** | Collective Unconscious | Personal Unconscious |\n| **พลังขับเคลื่อนจิต** | Psychic Energy / Individuation | Libido / Pleasure Principle |\n\n`;

    template += `## 🔗 แนวคิดที่เกี่ยวข้อง (Related Concepts)\n- [[Analytical Psychology]] : กรอบคิดและโครงข่ายหลักของแนวคิดนี้\n- [[Collective Unconscious]] : ทฤษฎีและโครงสร้างจิตที่เกี่ยวเนื่อง\n- [[Individuation]] : เป้าหมายสูงสุดของการพัฒนาตนเอง\n\n`;

    template += `## 📚 แหล่งอ้างอิงและตำรา (References)\n- [1] Jung, C. G. (1968). *The Archetypes and the Collective Unconscious* (2nd ed.). Princeton University Press.\n- [2] Campbell, J. (1949). *The Hero with a Thousand Faces*. Pantheon Books.\n`;

    updateField("bodyMarkdown", template);
    
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  return (
    <section className="space-y-4 border-t border-border pt-6">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold text-text-heading">Archron Studio Workspace</h2>
          <p className="text-xs text-text-secondary">ห้องเขียนและเรียบเรียง Markdown + GFM แบบ Single Source of Truth</p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="inline-flex rounded-lg border border-border/80 bg-bg-elevated/50 p-1">
          <button
            type="button"
            onClick={() => setViewMode("write")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              viewMode === "write"
                ? "bg-bg-card text-accent shadow-xs"
                : "text-text-secondary hover:text-text-heading"
            }`}
          >
            เขียน (Write)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              viewMode === "split"
                ? "bg-bg-card text-accent shadow-xs"
                : "text-text-secondary hover:text-text-heading"
            }`}
          >
            แบ่งครึ่งจอ (Split Live)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              viewMode === "preview"
                ? "bg-bg-card text-accent shadow-xs"
                : "text-text-secondary hover:text-text-heading"
            }`}
          >
            พรีวิวเนื้อหา (Preview)
          </button>
        </div>
      </div>

      {/* Template Generator Bar */}
      {viewMode !== "preview" && (
        <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
          <div>
            <span className="font-semibold text-xs text-accent flex items-center gap-1.5">
              <EditorIcon name="edit_note" className="h-4 w-4 text-accent" />
              <span>ปลูกโครงสร้างแม่แบบอัตโนมัติ (Generate MDX/GFM Template)</span>
            </span>
            <p className="text-[11px] text-text-secondary mt-0.5">
              กดปุ่มเพื่อสร้างโครงสร้างบทความมาตรฐาน (Visual, Technical, Roots, References) ลงใน Body Markdown ครบถ้วนในคลิกเดียว
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => generateSSOTTemplate("concept")}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-text-inverse shadow-xs hover:brightness-110 transition-all"
            >
              <EditorIcon name="psychology" className="h-3.5 w-3.5" />
              แม่แบบ Concept
            </button>
            <button
              type="button"
              onClick={() => generateSSOTTemplate("article")}
              className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-bg-card px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 transition-all"
            >
              <EditorIcon name="article" className="h-3.5 w-3.5" />
              แม่แบบ Article
            </button>
            <button
              type="button"
              onClick={() => generateSSOTTemplate("person")}
              className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-bg-card px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/10 transition-all"
            >
              <EditorIcon name="person" className="h-3.5 w-3.5" />
              แม่แบบ Person
            </button>
          </div>
        </div>
      )}

      {/* Editor Workspace Container */}
      <div className="rounded-xl border border-border/80 bg-bg-card shadow-sm overflow-hidden transition-all">
        {/* Markdown Toolbar (แสดงเฉพาะโหมด write และ split) */}
        {viewMode !== "preview" && (
          <div className="flex flex-wrap items-center gap-1.5 border-b border-border/80 bg-bg-elevated/60 px-3 py-2 text-xs select-none">
            {TOOLBAR_ITEMS.map((btn, idx) => {
              if (btn.type === "divider") {
                return <span key={idx} className="mx-1 h-4 w-px bg-border/80" />;
              }
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => insertMarkdown(btn.prefix, btn.suffix, btn.defaultText)}
                  title={btn.title}
                  className={`rounded px-2 py-1 transition-all ${
                    btn.highlight
                      ? "bg-accent/15 font-semibold text-accent hover:bg-accent hover:text-text-inverse"
                      : "text-text-body hover:bg-bg-card hover:text-text-heading"
                  } ${btn.bold ? "font-bold" : ""} ${btn.italic ? "italic" : ""} ${
                    btn.strike ? "line-through" : ""
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        )}

        {/* View Layouts */}
        <div id="container-field-body-markdown" className="p-1 rounded-lg transition-all duration-300">
          {viewMode === "write" && (
            <textarea
              id="field-body-markdown"
              ref={textareaRef}
              value={content}
              onChange={(e) => updateField("bodyMarkdown", e.target.value)}
              className="w-full rounded-lg border-0 bg-transparent p-4 font-mono text-sm leading-relaxed text-text-heading outline-none resize-y focus:ring-0"
              rows={24}
              placeholder="เขียนเนื้อหาด้วย Markdown... รองรับ GFM, [[Concept]], และ [[cite: 1, 2]]"
            />
          )}

          {viewMode === "split" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Left Column: Write */}
              <div className="border-b lg:border-b-0 lg:border-r border-border/60 p-2">
                <textarea
                  id="field-body-markdown"
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => updateField("bodyMarkdown", e.target.value)}
                  className="w-full min-h-[550px] rounded-lg border-0 bg-transparent p-3 font-mono text-sm leading-relaxed text-text-heading outline-none resize-y focus:ring-0"
                  rows={24}
                  placeholder="เขียนเนื้อหาด้วย Markdown... รองรับ GFM, [[Concept]], และ [[cite: 1, 2]]"
                />
              </div>

              {/* Right Column: Live WYSIWYG Preview */}
              <div className="p-4 overflow-y-auto max-h-[650px] bg-bg/40 rounded-r-lg">
                <div className="mb-3 flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                    Live WYSIWYG Preview
                  </span>
                  <span className="text-[11px] text-text-secondary">เรนเดอร์ผ่าน Engine จริง</span>
                </div>
                {content.trim() ? (
                  <MarkdownRenderer content={content} />
                ) : (
                  <p className="py-12 text-center text-sm italic text-text-secondary/60">
                    เริ่มพิมพ์ทางซ้ายเพื่อดูตัวอย่างผลลัพธ์แบบเรียลไทม์ที่นี่...
                  </p>
                )}
              </div>
            </div>
          )}

          {viewMode === "preview" && (
            <div className="p-6 min-h-[400px]">
              {content.trim() ? (
                <MarkdownRenderer content={content} />
              ) : (
                <p className="py-12 text-center text-sm italic text-text-secondary/60">
                  ยังไม่มีเนื้อหาสำหรับพรีวิว
                </p>
              )}
            </div>
          )}
          {/* Live SSOT Structural Checklist */}
          {viewMode !== "preview" && (
            <div className="px-4 py-3 border-t border-border/60 bg-bg-elevated/30 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-text-heading mr-1 flex items-center gap-1.5">
                <EditorIcon name="check_circle" className="h-4 w-4 text-accent" />
                <span>ตรวจโครงสร้าง SSOT สด:</span>
              </span>
              <span className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                (/#[#]?\s*(คำอธิบายเชิงประจักษ์|คำอธิบายให้เห็นภาพ|ภาพเปรียบเปรย|Visual Explanation|ตัวอย่างให้เห็นภาพ)/i.test(content) || />\s*\[!(NOTE|TIP|IMPORTANT)\]\s*คำอธิบาย/i.test(content) || draft.visualExplanation.trim() !== "")
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-700 border border-amber-500/20"
              }`}>
                <EditorIcon name={( /#[#]?\s*(คำอธิบายเชิงประจักษ์|คำอธิบายให้เห็นภาพ|ภาพเปรียบเปรย|Visual Explanation|ตัวอย่างให้เห็นภาพ)/i.test(content) || />\s*\[!(NOTE|TIP|IMPORTANT)\]\s*คำอธิบาย/i.test(content) || draft.visualExplanation.trim() !== "") ? "check_circle" : "report"} className="h-3.5 w-3.5" />
                <span>คำอธิบายให้เห็นภาพ</span>
              </span>
              <span className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                (/#[#]?\s*(นิยาม|ความหมายทางวิชาการ|นิยามและแก่น|นิยามเชิงเทคนิค|Technical Meaning|แก่นทางวิชาการ)/i.test(content) || draft.technicalMeaning.trim() !== "")
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-700 border border-amber-500/20"
              }`}>
                <EditorIcon name={( /#[#]?\s*(นิยาม|ความหมายทางวิชาการ|นิยามและแก่น|นิยามเชิงเทคนิค|Technical Meaning|แก่นทางวิชาการ)/i.test(content) || draft.technicalMeaning.trim() !== "") ? "check_circle" : "report"} className="h-3.5 w-3.5" />
                <span>ความหมายทางวิชาการ</span>
              </span>
              {(draft.contentType === "concept" || draft.contentType === "term") && (
                <span className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                  (/#[#]?\s*(รากศัพท์|ที่มาของคำ|Etymology|Roots|การเปลี่ยนความหมาย|รากคำ)/i.test(content) || (draft.rootsEtymology && draft.rootsEtymology.trim() !== "") || (draft.rootsCaution && draft.rootsCaution.trim() !== ""))
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                }`}>
                  <EditorIcon name={( /#[#]?\s*(รากศัพท์|ที่มาของคำ|Etymology|Roots|การเปลี่ยนความหมาย|รากคำ)/i.test(content) || (draft.rootsEtymology && draft.rootsEtymology.trim() !== "") || (draft.rootsCaution && draft.rootsCaution.trim() !== "")) ? "check_circle" : "report"} className="h-3.5 w-3.5" />
                  <span>รากศัพท์ / ข้อควรระวัง</span>
                </span>
              )}
              <span className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                (/\[\[[^\]]+\]\]/.test(content) || /#[#]?\s*(แนวคิดที่เกี่ยวข้อง|Related Concepts|เชื่อมโยง)/i.test(content) || (draft.relatedConcepts && draft.relatedConcepts.length > 0))
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-700 border border-amber-500/20"
              }`}>
                <EditorIcon name={( /\[\[[^\]]+\]\]/.test(content) || /#[#]?\s*(แนวคิดที่เกี่ยวข้อง|Related Concepts|เชื่อมโยง)/i.test(content) || (draft.relatedConcepts && draft.relatedConcepts.length > 0)) ? "check_circle" : "report"} className="h-3.5 w-3.5" />
                <span>แนวคิดที่เกี่ยวข้อง ([[Wikilink]])</span>
              </span>
              <span className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                (/\[\^?\d+\]/.test(content) || /#[#]?\s*(แหล่งอ้างอิง|อ้างอิง|References|Citations|ตำรา)/i.test(content) || (draft.references && draft.references.length > 0) || draft.status === "needs-source-check")
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-700 border border-amber-500/20"
              }`}>
                <EditorIcon name={( /\[\^?\d+\]/.test(content) || /#[#]?\s*(แหล่งอ้างอิง|อ้างอิง|References|Citations|ตำรา)/i.test(content) || (draft.references && draft.references.length > 0) || draft.status === "needs-source-check") ? "check_circle" : "report"} className="h-3.5 w-3.5" />
                <span>แหล่งอ้างอิง ([^1])</span>
              </span>
            </div>
          )}

          <div className="px-3 pb-2">
            <InlineGuidance issue={validationIssues?.["field-body-markdown"]} />
          </div>
        </div>

        {/* Live Metrics Footer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 bg-bg-elevated/50 px-4 py-2.5 text-xs text-text-secondary select-none">
          <div className="flex items-center gap-4">
            <span>
              ตัวอักษร: <strong className="text-text-heading">{charCount.toLocaleString()}</strong> ตัว
            </span>
            <span>
              คำ (ประมาณ): <strong className="text-text-heading">{wordCount.toLocaleString()}</strong> คำ
            </span>
            <span>
              เวลาอ่านเฉลี่ย: <strong className="text-accent font-medium">~{readTimeMinutes} นาที</strong>
            </span>
          </div>
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px]">Production GFM & Archron Wikilink Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
