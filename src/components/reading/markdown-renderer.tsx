import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { InternalConceptLink } from "@/components/reading/internal-concept-link";

// แปลงสัญลักษณ์พิเศษของ ARCHRON ให้เป็น Markdown มาตรฐานก่อนส่งเข้า ReactMarkdown:
// 1. [[cite: 1, 2]] -> [1](#ref-1)[2](#ref-2)
// 2. [[concept-slug|ชื่อที่แสดง]] หรือ [[Concept Title]] -> [ชื่อที่แสดง](/concepts/concept-slug)
export function wikilinkify(md: string): string {
  if (!md) return "";

  // 1. แปลง citation [[cite: 1, 2]]
  let processed = md.replace(/\[\[cite:\s*([\d\s,]+)\]\]/g, (_m, group: string) =>
    group
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
      .map((n) => `[${n}](#ref-${n})`)
      .join(""),
  );

  // 2. แปลง [[wikilink]] เป็น [label](/concepts/slug)
  // ระวังไม่ให้ทับซ้อนถ้าไม่ใช่ citation
  processed = processed.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, rawTarget: string, rawLabel?: string) => {
    const target = rawTarget.trim();
    if (target.toLowerCase().startsWith("cite:")) return match;

    const label = (rawLabel ?? target).trim();
    // แปลงชื่อเป็น slug มาตรฐาน
    const slug = target.toLowerCase().replace(/\s+/g, "-");
    return `[${label}](/concepts/${slug})`;
  });

  return processed;
}

// แผนผัง components สำหรับ ReactMarkdown เพื่อให้ทุกเครื่องหมายและสัญลักษณ์ (*, #, -, [[ ]], ตาราง)
// แปลงเป็น UI ของ ARCHRON อัตโนมัติและสม่ำเสมอทั้งหน้าอ่านจริง (ReadingPage) และหน้า Studio Editor Preview
export const mdComponents: Components = {
  a({ href, children }) {
    const h = typeof href === "string" ? href : "";
    const m = h.match(/^\/concepts\/([^/#?]+)/);
    if (m) {
      const label = typeof children === "string" ? children : String(children ?? "");
      return <InternalConceptLink slug={m[1]} label={label} />;
    }
    if (/^https?:\/\//.test(h)) {
      return (
        <a href={h} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return <a href={h}>{children}</a>;
  },
};

// คอมโพเนนต์กลางสำหรับเรนเดอร์ Markdown ในระบบ ARCHRON (WYSIWYG 100%)
export function MarkdownRenderer({
  content,
  className = "md-body",
}: {
  content: string | null | undefined;
  className?: string;
}) {
  if (!content || content.trim() === "") return null;

  const processedContent = wikilinkify(content);

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
