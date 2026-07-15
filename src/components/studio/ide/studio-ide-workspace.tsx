"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import { SemanticMdxEngine as MarkdownRenderer } from "@/components/reading/semantic-mdx-engine";
import { statusMeta, contentTypeMeta } from "@/lib/content/core/cosmology";
import { resolveIcon } from "@/lib/content/core/icon-map";
import { BookIcon, CheckIcon, TermIcon, ConceptIcon, SymbolIcon, ClockIcon, EditIcon, EyeIcon } from "@/components/icons";

export interface SidebarPanelItem {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode;
  badge?: number | string;
}

export interface StudioIdeWorkspaceProps {
  draft: EditorDraft;
  onChangeDraft: <K extends keyof EditorDraft>(key: K, value: EditorDraft[K]) => void;
  onSave?: () => Promise<void> | void;
  onPublish?: () => Promise<void> | void;
  publishing?: boolean;
  autoSaveState?: "idle" | "saving" | "saved";
  sidebarPanels?: SidebarPanelItem[];
  children?: React.ReactNode;
}

type ViewMode = "write" | "split" | "preview";

type ToolbarButton =
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

const TOOLBAR_ITEMS: ToolbarButton[] = [
  { label: "B", title: "ตัวหนา (Bold)", prefix: "**", suffix: "**", defaultText: "ตัวหนา", bold: true },
  { label: "I", title: "ตัวเอียง (Italic)", prefix: "*", suffix: "*", defaultText: "ตัวเอียง", italic: true },
  { label: "S", title: "ขีดฆ่า (Strikethrough)", prefix: "~~", suffix: "~~", defaultText: "ขีดฆ่า", strike: true },
  { type: "divider" },
  { label: "H2", title: "หัวข้อหลัก (Heading 2)", prefix: "## ", suffix: "", defaultText: "หัวข้อหลัก" },
  { label: "H3", title: "หัวข้อย่อย (Heading 3)", prefix: "### ", suffix: "", defaultText: "หัวข้อย่อย" },
  { label: "Quote", title: "โควตข้อความ (Blockquote)", prefix: "> ", suffix: "", defaultText: "คำคมหรืออ้างอิงทางวิชาการ" },
  { type: "divider" },
  { label: "Code", title: "โค้ดบล็อก (Code Block)", prefix: "```ts\n", suffix: "\n```", defaultText: "// โค้ดหรือข้อมูลโครงสร้างที่นี่" },
  { label: "Table", title: "ตาราง (Table)", prefix: "| มิติเปรียบเทียบ | ทฤษฎี 1 | ทฤษฎี 2 |\n| --- | --- | --- |\n| รายละเอียด | ข้อมูล A | ข้อมูล B |\n", suffix: "", defaultText: "" },
  { label: "Task", title: "รายการตรวจสอบ (Task List)", prefix: "- [ ] ", suffix: "", defaultText: "สิ่งที่ต้องตรวจสอบและค้นคว้าเพิ่ม" },
  { type: "divider" },
  { label: "Link", title: "แทรกลิงก์ (External Link)", prefix: "[", suffix: "](https://example.com)", defaultText: "ชื่อลิงก์อ้างอิง" },
  { label: "[[Concept]]", title: "เชื่อมโยงแนวคิดภายใน (Wikilink)", prefix: "[[", suffix: "|ชื่อที่แสดง]]", defaultText: "concept-slug", highlight: true },
  { label: "[[Cite]]", title: "แทรกจุดอ้างอิง (Citation)", prefix: "[[cite: ", suffix: "]]", defaultText: "1, 2", highlight: true },
];

export function StudioIdeWorkspace({
  draft,
  onChangeDraft,
  onSave,
  onPublish,
  publishing = false,
  autoSaveState = "idle",
  sidebarPanels,
  children,
}: StudioIdeWorkspaceProps) {
  const [mode, setMode] = useState<ViewMode>("write");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const content = draft.bodyMarkdown || "";

  // คำนวณสถิติคำและอักขระ
  const charCount = content.length;
  const wordCount = useMemo(() => {
    // ภาษาไทยใช้การประมาณตัวอักษรเฉลี่ย 5 ตัวต่อ 1 คำ หรือนับคำตามช่องว่างภาษาอังกฤษ
    return Math.max(0, Math.round(charCount / 5));
  }, [charCount]);

  const statusInfo = useMemo(() => statusMeta(draft.status), [draft.status]);
  const typeInfo = useMemo(() => contentTypeMeta(draft.contentType), [draft.contentType]);

  const statusLabel = useMemo(() => {
    switch (draft.status) {
      case "published":
        return "เผยแพร่แล้ว";
      case "ready-to-publish":
        return "พร้อมเผยแพร่";
      case "needs-source-check":
        return "รอตรวจสอบอ้างอิง";
      case "archived":
        return "จัดเก็บลงกรุ";
      case "draft":
      default:
        return "ฉบับร่าง";
    }
  }, [draft.status]);

  // ฟังก์ชันแทรก Markdown ตรงตำแหน่งเคอร์เซอร์
  const insertMarkdown = useCallback(
    (prefix: string, suffix: string, defaultText = "ข้อความ") => {
      const textarea = textareaRef.current;
      if (!textarea) {
        const newContent = content + `\n${prefix}${defaultText}${suffix}`;
        onChangeDraft("bodyMarkdown", newContent);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end) || defaultText;
      const replacement = `${prefix}${selectedText}${suffix}`;

      const newContent = content.substring(0, start) + replacement + content.substring(end);
      onChangeDraft("bodyMarkdown", newContent);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
      }, 10);
    },
    [content, onChangeDraft]
  );

  // แทรกโครงสร้างมาตรฐาน SSOT ตามหมวดหมู่เนื้อหา
  const insertSSOTTemplate = () => {
    const ct = draft.contentType || "article";
    const title = draft.title || (ct === "concept" ? "ชื่อแนวคิด (Concept Title)" : "ชื่อบทความ (Article Title)");
    
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

    template += `## 🔗 แนวคิดที่เกี่ยวข้อง (Related Concepts)\n- [[Analytical Psychology]] : กรอบคิดและโครงข่ายหลักของแนวคิดนี้\n- [[Collective Unconscious]] : ทฤษฎีและโครงสร้างจิตที่เกี่ยวเนื่อง\n\n`;

    template += `## 📚 แหล่งอ้างอิงและตำรา (References)\n- [1] Jung, C. G. (1968). *The Archetypes and the Collective Unconscious* (2nd ed.). Princeton University Press.\n`;

    onChangeDraft("bodyMarkdown", template);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  };

  // โครงสร้างแผง Sidebar พื้นฐานในกรณีที่ไม่ได้ระบุ sidebarPanels หรือระบุมาไม่ครบ
  const defaultPanels: SidebarPanelItem[] = useMemo(() => {
    // 1. Outline Panel
    const headings: { level: number; text: string }[] = [];
    const lines = content.split("\n");
    for (const line of lines) {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        headings.push({ level: match[1].length, text: match[2].trim() });
      }
    }

    const outlinePanel: SidebarPanelItem = {
      id: "outline",
      label: "โครงสร้าง",
      icon: "menu_book",
      badge: headings.length > 0 ? headings.length : undefined,
      content: (
        <div className="space-y-3 font-ui text-xs">
          <div className="border-b border-border pb-2">
            <h4 className="font-semibold text-text-heading flex items-center gap-1.5">
              <BookIcon className="h-4 w-4 text-accent" />
              <span>โครงสร้างและหัวข้อหลัก (Outline)</span>
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              แสดงโครงลำดับชั้นของหัวข้อ (#, ##, ###) ในเนื้อหาปัจจุบัน
            </p>
          </div>
          {headings.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-4 text-center text-text-secondary">
              <p>ยังไม่มีหัวข้อในบทความนี้</p>
              <p className="mt-1 text-[11px]">พิมพ์ # หรือ ## ในตัวเขียน หรือใช้ปุ่มปลูกโครงสร้างมาตรฐาน</p>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {headings.map((h, i) => (
                <li
                  key={i}
                  className={`truncate rounded px-2 py-1 transition-colors hover:bg-bg-elevated/60 text-text-body ${
                    h.level === 1
                      ? "font-semibold text-text-heading bg-accent/5 pl-2"
                      : h.level === 2
                      ? "font-medium pl-4 text-text-body"
                      : "pl-6 text-text-secondary text-[11px]"
                  }`}
                >
                  <span className="text-accent/70 mr-1.5">{"#".repeat(h.level)}</span>
                  <span>{h.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
    };

    // 2. Health Panel
    const checks = [
      { label: "ชื่อเรื่องหลัก (Title)", passed: Boolean(draft.title?.trim()) },
      { label: "รหัสสั้น/Slug", passed: Boolean(draft.slug?.trim()) },
      { label: "คำอธิบายโดยย่อ (Short Description)", passed: Boolean(draft.shortDescription?.trim()) },
      { label: "กรอบทฤษฎี/แขนงวิชา (Framework)", passed: Boolean(draft.framework?.trim() || draft.school?.trim()) },
      { label: "ความยาวเนื้อหามากกว่า 100 คำ", passed: wordCount >= 100 },
      { label: "มีหัวข้อ คำอธิบายให้เห็นภาพ (Visual)", passed: content.includes("คำอธิบายให้เห็นภาพ") || content.includes("Visual Explanation") },
      { label: "มีหัวข้อ นิยามเชิงวิชาการ (Technical)", passed: content.includes("นิยามและแก่นทางวิชาการ") || content.includes("Technical Meaning") },
      { label: "มีรายการอ้างอิง (References)", passed: content.includes("แหล่งอ้างอิง") || content.includes("References") || (draft.references && draft.references.length > 0) },
    ];
    const passedCount = checks.filter((c) => c.passed).length;
    const healthScore = Math.round((passedCount / checks.length) * 100);

    const healthPanel: SidebarPanelItem = {
      id: "health",
      label: "สุขภาพ",
      icon: "verified",
      badge: `${healthScore}%`,
      content: (
        <div className="space-y-3 font-ui text-xs">
          <div className="border-b border-border pb-2">
            <h4 className="font-semibold text-text-heading flex items-center gap-1.5">
              <CheckIcon className="h-4 w-4 text-accent" />
              <span>สุขภาพความรู้และตรวจทาน (Knowledge Health)</span>
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              ตรวจเช็คความพร้อมตามมาตรฐาน Knowledge IDE
            </p>
          </div>
          <div className="rounded-lg bg-bg-elevated/50 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-text-body">คะแนนความสมบูรณ์</span>
              <span
                className={`font-bold ${
                  healthScore >= 80
                    ? "text-green-600"
                    : healthScore >= 50
                    ? "text-amber-600"
                    : "text-rose-600"
                }`}
              >
                {healthScore}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full transition-all duration-500 ${
                  healthScore >= 80
                    ? "bg-green-600"
                    : healthScore >= 50
                    ? "bg-amber-500"
                    : "bg-rose-500"
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
          <ul className="space-y-1.5">
            {checks.map((chk, idx) => (
              <li key={idx} className="flex items-center justify-between rounded p-1.5 hover:bg-bg-elevated/40">
                <span className="text-text-body">{chk.label}</span>
                <span className={chk.passed ? "text-green-600 font-semibold" : "text-amber-600"}>
                  {chk.passed ? "✅ ผ่าน" : "⚠️ ยังขาด"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ),
    };

    // 3. Metadata Panel
    const metadataPanel: SidebarPanelItem = {
      id: "metadata",
      label: "ข้อมูลสกัด",
      icon: "tag",
      content: (
        <div className="space-y-3 font-ui text-xs">
          <div className="border-b border-border pb-2">
            <h4 className="font-semibold text-text-heading flex items-center gap-1.5">
              <TermIcon className="h-4 w-4 text-accent" />
              <span>แผงตรวจสอบข้อมูลสกัด (Metadata)</span>
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              คุณลักษณะเชิงความรู้ที่สกัดได้จากโครงสร้างบทความ
            </p>
          </div>
          <div className="space-y-2">
            <div className="rounded-md border border-border/60 bg-bg-elevated/30 p-2.5">
              <div className="text-[11px] text-text-secondary">ประเภทเนื้อหา (Content Type)</div>
              <div className="font-semibold text-text-heading mt-0.5 flex items-center gap-1.5">
                {(() => { const T = resolveIcon(typeInfo.icon); return T ? <T className="h-3.5 w-3.5" style={{ color: typeInfo.accent }} /> : null; })()}
                <span>{typeInfo.label}</span>
              </div>
            </div>
            <div className="rounded-md border border-border/60 bg-bg-elevated/30 p-2.5">
              <div className="text-[11px] text-text-secondary">รหัสอ้างอิงในระบบ (Row Code)</div>
              <div className="font-mono font-medium text-text-heading mt-0.5">
                {draft.rowCode || "กำหนดอัตโนมัติเมื่อบันทึก"}
              </div>
            </div>
            <div className="rounded-md border border-border/60 bg-bg-elevated/30 p-2.5">
              <div className="text-[11px] text-text-secondary">กรอบทฤษฎี (Framework / School)</div>
              <div className="font-medium text-text-heading mt-0.5">
                {draft.framework || draft.school || "ยังไม่ได้ระบุ"}
              </div>
            </div>
            <div className="rounded-md border border-border/60 bg-bg-elevated/30 p-2.5">
              <div className="text-[11px] text-text-secondary">ระดับความลึก (Difficulty)</div>
              <div className="font-medium text-text-heading mt-0.5 capitalize">
                {draft.difficulty || "intermediate"}
              </div>
            </div>
            <div className="rounded-md border border-border/60 bg-bg-elevated/30 p-2.5">
              <div className="text-[11px] text-text-secondary">ป้ายกำกับ (Tags)</div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {draft.tags && draft.tags.length > 0 ? (
                  draft.tags.map((tag, i) => (
                    <span key={i} className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-text-secondary text-[11px]">ยังไม่มีป้ายกำกับ</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
    };

    // 4. AI Assistant Panel
    const aiPanel: SidebarPanelItem = {
      id: "ai",
      label: "ผู้ช่วย AI",
      icon: "psychology",
      content: (
        <div className="space-y-3 font-ui text-xs">
          <div className="border-b border-border pb-2">
            <h4 className="font-semibold text-text-heading flex items-center gap-1.5">
              <ConceptIcon className="h-4 w-4 text-accent" />
              <span>ผู้ช่วย AI เชิงวิชาการ (Knowledge Assistant)</span>
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              เครื่องมือช่วยค้นคว้า วิเคราะห์ และขัดเกลาตามมาตรฐาน Archron
            </p>
          </div>
          <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 space-y-2">
            <div className="font-semibold text-accent text-xs flex items-center gap-1">
              <span>⚡ คำสั่งวิเคราะห์ด่วน (Quick Prompts)</span>
            </div>
            <button
              type="button"
              onClick={() => insertMarkdown("\n> [!NOTE] ข้อเสนอแนะจาก AI\n> ", "\n", "ขัดเกลานิยามทางวิชาการให้มีความรัดกุมตามหลัก Analytical Psychology")}
              className="w-full text-left rounded border border-accent/30 bg-bg-card p-2 hover:bg-accent/10 transition-colors text-[11px] text-text-body"
            >
              📖 ขยายความนิยามเชิงวิชาการให้รัดกุมยิ่งขึ้น
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("\n### ตัวอย่างเชิงประจักษ์\n", "\n", "เพื่อความเข้าใจที่ชัดเจน ลองพิจารณาตัวอย่าง...")}
              className="w-full text-left rounded border border-accent/30 bg-bg-card p-2 hover:bg-accent/10 transition-colors text-[11px] text-text-body"
            >
              🌟 สร้างคำอธิบายเปรียบเปรยสำหรับบุคคลทั่วไป
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown("\n| มิติเปรียบเทียบ | ทฤษฎีของ Jung | แนวคิดทั่วไป |\n| --- | --- | --- |\n| แก่นความหมาย | | |\n", "", "")}
              className="w-full text-left rounded border border-accent/30 bg-bg-card p-2 hover:bg-accent/10 transition-colors text-[11px] text-text-body"
            >
              📊 สร้างตารางเปรียบเทียบมิติความคิด
            </button>
          </div>
        </div>
      ),
    };

    // 5. Relations Panel
    const relCount = (draft.relatedConcepts?.length || 0) + (draft.references?.length || 0);
    const relationsPanel: SidebarPanelItem = {
      id: "relations",
      label: "โครงข่าย",
      icon: "category",
      badge: relCount > 0 ? relCount : undefined,
      content: (
        <div className="space-y-3 font-ui text-xs">
          <div className="border-b border-border pb-2">
            <h4 className="font-semibold text-text-heading flex items-center gap-1.5">
              <SymbolIcon className="h-4 w-4 text-accent" />
              <span>โครงข่ายความรู้และการอ้างอิง (Relations & Refs)</span>
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              การเชื่อมโยงกับแนวคิดอื่นและรายการอ้างอิงในระบบ
            </p>
          </div>
          <div>
            <div className="font-semibold text-text-heading mb-1.5 flex items-center justify-between">
              <span>แนวคิดที่เกี่ยวข้อง ({draft.relatedConcepts?.length || 0})</span>
            </div>
            {draft.relatedConcepts && draft.relatedConcepts.length > 0 ? (
              <ul className="space-y-1.5">
                {draft.relatedConcepts.map((rel, idx) => (
                  <li key={idx} className="rounded border border-border/60 bg-bg-elevated/30 p-2 text-[11px]">
                    <div className="font-medium text-accent">[[{rel.conceptSlug}]]</div>
                    {rel.relationType && <div className="text-text-secondary mt-0.5">ความสัมพันธ์: {rel.relationType}</div>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] text-text-secondary rounded bg-bg-elevated/30 p-2">
                ยังไม่มีแนวคิดที่เชื่อมโยง พิมพ์ [[Slug]] ในเนื้อหาหรือเพิ่มผ่านแผงความสัมพันธ์
              </p>
            )}
          </div>
          <div className="pt-2 border-t border-border/60">
            <div className="font-semibold text-text-heading mb-1.5 flex items-center justify-between">
              <span>รายการอ้างอิง ({draft.references?.length || 0})</span>
            </div>
            {draft.references && draft.references.length > 0 ? (
              <ul className="space-y-1.5">
                {draft.references.map((ref, idx) => (
                  <li key={idx} className="rounded border border-border/60 bg-bg-elevated/30 p-2 text-[11px]">
                    <div className="font-medium text-text-heading">[{idx + 1}] {ref.title}</div>
                    {ref.sourceType && <div className="text-text-secondary mt-0.5">ประเภท: {ref.sourceType}</div>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] text-text-secondary rounded bg-bg-elevated/30 p-2">
                ยังไม่มีรายการอ้างอิง
              </p>
            )}
          </div>
        </div>
      ),
    };

    // 6. History Panel
    const historyPanel: SidebarPanelItem = {
      id: "history",
      label: "ประวัติ",
      icon: "schedule",
      content: (
        <div className="space-y-3 font-ui text-xs">
          <div className="border-b border-border pb-2">
            <h4 className="font-semibold text-text-heading flex items-center gap-1.5">
              <ClockIcon className="h-4 w-4 text-accent" />
              <span>ประวัติการแก้ไขและสถานะ (Revision History)</span>
            </h4>
            <p className="text-[11px] text-text-secondary mt-0.5">
              บันทึกการทำงานและสถานะอัตโนมัติในเซสชันปัจจุบัน
            </p>
          </div>
          <div className="space-y-2">
            <div className="rounded-md border border-border/60 bg-bg-elevated/30 p-2.5 flex items-center justify-between">
              <span className="text-text-secondary">สถานะการบันทึก</span>
              <span className="font-medium text-text-heading">
                {autoSaveState === "saving" && <span className="text-accent">⏳ กำลังบันทึก...</span>}
                {autoSaveState === "saved" && <span className="text-green-600">✅ บันทึกเรียบร้อย</span>}
                {autoSaveState === "idle" && <span>⚪ พร้อมทำงาน</span>}
              </span>
            </div>
            <div className="rounded-md border border-border/60 bg-bg-elevated/30 p-2.5 flex items-center justify-between">
              <span className="text-text-secondary">ความยาวเนื้อหารวม</span>
              <span className="font-semibold text-text-heading">{wordCount.toLocaleString()} คำ</span>
            </div>
            <div className="rounded-md border border-border/60 bg-bg-elevated/30 p-2.5 flex items-center justify-between">
              <span className="text-text-secondary">จำนวนตัวอักษร</span>
              <span className="font-semibold text-text-heading">{charCount.toLocaleString()} อักขระ</span>
            </div>
          </div>
          <div className="rounded-lg border border-dashed border-border p-3 text-[11px] text-text-secondary">
            <p className="font-semibold text-text-heading">💡 คำแนะนำ</p>
            <p className="mt-1">
              ระบบ Studio IDE ทำงานแบบ Single Source of Truth และทำการบันทึกอัตโนมัติตามระยะเวลา เพื่อไม่ให้สูญเสียงานเขียนสำคัญ
            </p>
          </div>
        </div>
      ),
    };

    return [outlinePanel, healthPanel, metadataPanel, aiPanel, relationsPanel, historyPanel];
  }, [content, draft, wordCount, charCount, autoSaveState, typeInfo, insertMarkdown]);

  // Panels ที่จะแสดงจริง (ใช้จาก props.sidebarPanels ถ้าส่งมา หรือใช้ defaultPanels)
  const activePanels = useMemo(() => {
    if (sidebarPanels && sidebarPanels.length > 0) {
      return sidebarPanels;
    }
    return defaultPanels;
  }, [sidebarPanels, defaultPanels]);

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    return activePanels[0]?.id || "outline";
  });

  const activePanel = useMemo(() => {
    const found = activePanels.find((p) => p.id === activeTabId);
    return found || activePanels[0] || null;
  }, [activePanels, activeTabId]);

  // Built-in writing workspace สำหรับ 70% primary area หากไม่ได้ส่ง children มา
  const renderBuiltInEditor = () => (
    <div className="flex flex-col h-full w-full bg-bg-card font-ui">
      {/* Formatting & Tool Bar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-bg-elevated/50 px-3 py-1.5 text-xs select-none">
        {TOOLBAR_ITEMS.map((btn, idx) => {
          if (btn.type === "divider") {
            return <span key={idx} className="mx-1 h-3.5 w-px bg-border/80" />;
          }
          return (
            <button
              key={idx}
              type="button"
              onClick={() => insertMarkdown(btn.prefix, btn.suffix, btn.defaultText)}
              title={btn.title}
              className={`rounded px-2 py-1 transition-all ${
                btn.highlight
                  ? "bg-accent/15 font-semibold text-accent hover:bg-accent hover:text-white"
                  : "text-text-body hover:bg-bg-card hover:text-text-heading"
              } ${btn.bold ? "font-bold" : ""} ${btn.italic ? "italic" : ""} ${
                btn.strike ? "line-through" : ""
              }`}
            >
              {btn.label}
            </button>
          );
        })}
        <span className="mx-1 h-3.5 w-px bg-border/80" />
        <button
          type="button"
          onClick={insertSSOTTemplate}
          title="แทรกโครงสร้างหัวข้อมาตรฐาน Archron (Visual, Technical, Roots, References)"
          className="inline-flex items-center gap-1 rounded bg-accent/10 px-2.5 py-1 font-semibold text-accent hover:bg-accent hover:text-white transition-all"
        >
          <EditIcon className="h-3.5 w-3.5" />
          <span>📑 ปลูกโครงสร้างมาตรฐาน</span>
        </button>
      </div>

      {/* Editor Body Textarea */}
      <div className="flex-1 overflow-hidden relative p-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChangeDraft("bodyMarkdown", e.target.value)}
          placeholder="เริ่มเขียนเนื้อหาความรู้ด้วย Markdown (MDX) ที่นี่... (ใช้ [[ ]] สำหรับ Wikilink และ [[cite: 1]] สำหรับอ้างอิง)"
          className="w-full h-full rounded-lg border-0 bg-transparent font-mono text-sm leading-relaxed text-text-heading outline-none resize-none focus:ring-0 placeholder:text-text-secondary/50"
        />
      </div>
    </div>
  );

  return (
    <div
      lang="th"
      className="flex flex-col h-full w-full bg-bg border border-border rounded-xl shadow-sm overflow-hidden text-text-body font-ui"
    >
      {/* Top IDE toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-bg-card px-4 py-2.5 text-sm select-none z-20">
        {/* Mode switch buttons */}
        <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-bg-elevated/50 p-1">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === "write"
                ? "bg-bg-card text-accent shadow-xs font-semibold"
                : "text-text-secondary hover:text-text-heading"
            }`}
          >
            <span>✍️</span>
            <span>เขียน (Write)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("split")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === "split"
                ? "bg-bg-card text-accent shadow-xs font-semibold"
                : "text-text-secondary hover:text-text-heading"
            }`}
          >
            <span>🌗</span>
            <span>คู่ขนาน (Split)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === "preview"
                ? "bg-bg-card text-accent shadow-xs font-semibold"
                : "text-text-secondary hover:text-text-heading"
            }`}
          >
            <span>👁️</span>
            <span>ดูตัวอย่าง (Preview)</span>
          </button>
        </div>

        {/* Word count & Status indicators */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="hidden sm:inline-flex items-center gap-1 text-text-secondary">
            <span className="font-semibold text-text-heading">{wordCount.toLocaleString()}</span> คำ
            <span className="text-border mx-1">|</span>
            <span className="font-semibold text-text-heading">{charCount.toLocaleString()}</span> อักขระ
          </span>

          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold text-[11px]"
            style={{ backgroundColor: `${statusInfo.accent}1f`, color: statusInfo.accent }}
          >
            {(() => { const S = resolveIcon(statusInfo.icon); return S ? <S className="h-3.5 w-3.5" style={{ color: statusInfo.accent }} /> : null; })()}
            <span>{statusLabel}</span>
          </span>

          {autoSaveState && (
            <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary">
              {autoSaveState === "saving" && <span className="text-accent animate-pulse">⏳ กำลังบันทึก...</span>}
              {autoSaveState === "saved" && <span className="text-green-600">✅ บันทึกแล้ว</span>}
              {autoSaveState === "idle" && <span>⚪ พร้อม</span>}
            </span>
          )}

          {/* Save Button */}
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={autoSaveState === "saving"}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-card px-3 py-1.5 font-medium text-text-heading hover:bg-bg-elevated hover:border-accent/40 transition-all disabled:opacity-50"
            >
              <span>💾</span>
              <span>บันทึก</span>
            </button>
          )}

          {/* Publish Button */}
          {onPublish && (
            <button
              type="button"
              onClick={onPublish}
              disabled={publishing}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-1.5 font-semibold text-white shadow-xs hover:brightness-110 transition-all disabled:opacity-50"
            >
              <span>🚀</span>
              <span>{publishing ? "กำลังเผยแพร่..." : "เผยแพร่"}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main workspace flex container */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative">
        {mode === "write" && (
          <>
            {/* Primary Area (70%): Writing workspace */}
            <div className="w-[70%] h-full flex flex-col border-r border-border overflow-hidden bg-bg-card">
              {children ? children : renderBuiltInEditor()}
            </div>

            {/* Secondary Area (30%): Knowledge Assistant IDE sidebar panels */}
            <div className="w-[30%] h-full bg-bg-card flex flex-col overflow-hidden border-l border-border">
              {/* Sidebar Tabs Bar */}
              <div className="flex items-center overflow-x-auto border-b border-border bg-bg-elevated/40 px-2 scrollbar-none">
                {activePanels.map((panel) => (
                  <button
                    key={panel.id}
                    type="button"
                    onClick={() => setActiveTabId(panel.id)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 text-xs whitespace-nowrap border-b-2 transition-all ${
                      activeTabId === panel.id
                        ? "border-accent text-accent font-semibold bg-bg-card shadow-xs"
                        : "border-transparent text-text-secondary hover:text-text-heading hover:bg-bg-elevated/60"
                    }`}
                  >
                    {(() => { const P = resolveIcon(panel.icon); return P ? <P className="h-4 w-4" /> : null; })()}
                    <span>{panel.label}</span>
                    {panel.badge !== undefined && (
                      <span className="ml-0.5 rounded-full bg-bg-elevated px-1.5 py-0.5 text-[10px] font-semibold text-text-secondary">
                        {panel.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Active Panel Content */}
              <div className="flex-1 overflow-y-auto p-4 bg-bg-card">
                {activePanel ? activePanel.content : null}
              </div>
            </div>
          </>
        )}

        {mode === "split" && (
          <>
            {/* Left 50% writing workspace */}
            <div className="w-[50%] h-full flex flex-col border-r border-border overflow-hidden bg-bg-card">
              {children ? children : renderBuiltInEditor()}
            </div>

            {/* Right 50% Live Preview area */}
            <div className="w-[50%] h-full flex flex-col overflow-y-auto bg-bg p-6">
              <div className="border-b border-border pb-3 mb-4 flex items-center justify-between">
                <span className="font-semibold text-xs text-accent flex items-center gap-1.5">
                  <EyeIcon className="h-4 w-4 text-accent" />
                  <span>👁️ แสดงผลตัวอย่างคู่ขนาน (Live MDX Preview)</span>
                </span>
                <span className="text-[11px] text-text-secondary">อัปเดตทันทีเมื่อพิมพ์</span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <MarkdownRenderer content={content || "*ยังไม่มีเนื้อหา Markdown สำหรับแสดงผล*"} />
              </div>
            </div>
          </>
        )}

        {mode === "preview" && (
          <div className="w-full h-full flex flex-col overflow-y-auto bg-bg p-8">
            <div className="max-w-4xl mx-auto w-full">
              <div className="border-b border-border pb-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: `${typeInfo.accent}1f`, color: typeInfo.accent }}
                  >
                    {(() => { const T = resolveIcon(typeInfo.icon); return T ? <T className="h-3.5 w-3.5" style={{ color: typeInfo.accent }} /> : null; })()}
                    <span>{typeInfo.label}</span>
                  </span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: `${statusInfo.accent}1f`, color: statusInfo.accent }}
                  >
                    <span>{statusLabel}</span>
                  </span>
                </div>
                <h1 className="text-3xl font-serif font-bold text-text-heading mb-2">
                  {draft.title || "บทความที่ยังไม่มีชื่อเรื่อง"}
                </h1>
                {draft.shortDescription && (
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {draft.shortDescription}
                  </p>
                )}
              </div>
              <MarkdownRenderer content={content || "*ยังไม่มีเนื้อหา Markdown สำหรับแสดงผล*"} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
