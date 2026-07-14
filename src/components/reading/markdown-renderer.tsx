import React, { type ReactNode, type ReactElement } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { InternalConceptLink } from "@/components/reading/internal-concept-link";
import { CodeBlock, InlineCode } from "@/components/reading/code-block";
import { ResponsiveTable, ResponsiveTableHeader, ResponsiveTableCell } from "@/components/reading/responsive-table";
import { ResponsiveImage } from "@/components/reading/responsive-image";

// ปรับแต่ง Schema สำหรับ rehype-sanitize เพื่อป้องกัน XSS แต่ยังรักษา Class, ID, data attributes ของ Archron ไว้ครบถ้วน
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    "*": ["className", "class", "id", "style"],
    a: ["href", "target", "rel", "title", "data-footnote-ref", "data-footnote-backref"],
    img: ["src", "alt", "title", "loading", "decoding", "width", "height"],
    code: ["className", "class"],
    th: ["align", "colSpan", "rowSpan"],
    td: ["align", "colSpan", "rowSpan"],
    input: ["type", "checked", "disabled"],
  },
};

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

// Helper สำหรับใส่ Anchor link (#) ในหัวข้อ
function renderHeadingWithAnchor(Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6", children: ReactNode, id?: string) {
  return (
    <Tag id={id} className="group relative scroll-mt-[6.5rem]">
      {children}
      {id && (
        <a
          href={`#${id}`}
          aria-label="ลิงก์มายังหัวข้อนี้"
          className="anchor-link ml-2 inline-block font-sans font-normal text-accent opacity-0 transition-opacity group-hover:opacity-100 no-underline"
        >
          #
        </a>
      )}
    </Tag>
  );
}

// แผนผัง components สำหรับ ReactMarkdown เพื่อให้ทุกเครื่องหมายและสัญลักษณ์ (*, #, -, [[ ]], ตาราง)
// แปลงเป็น UI ของ ARCHRON อัตโนมัติและสม่ำเสมอทั้งหน้าอ่านจริง (ReadingPage) และหน้า Studio Editor Preview
export const mdComponents: Components = {
  h1({ children, id }) {
    return renderHeadingWithAnchor("h1", children, id);
  },
  h2({ children, id }) {
    return renderHeadingWithAnchor("h2", children, id);
  },
  h3({ children, id }) {
    return renderHeadingWithAnchor("h3", children, id);
  },
  h4({ children, id }) {
    return renderHeadingWithAnchor("h4", children, id);
  },
  h5({ children, id }) {
    return renderHeadingWithAnchor("h5", children, id);
  },
  h6({ children, id }) {
    return renderHeadingWithAnchor("h6", children, id);
  },
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
  pre({ children, ...props }) {
    // หากภายใน <pre> คือแท็ก <code> เราจะให้ CodeBlock เป็นผู้จัดการเรื่อง Syntax + Copy
    if (React.isValidElement(children) && children.type === "code") {
      const codeProps = (children as ReactElement<{ className?: string; children?: ReactNode }>).props;
      return <CodeBlock className={codeProps.className}>{codeProps.children}</CodeBlock>;
    }
    return <pre {...props}>{children}</pre>;
  },
  code({ className, children, ...props }) {
    // หากเป็น code ที่มี className ระบุภาษา (block code จาก parser) จะแสดง CodeBlock
    if (className && className.startsWith("language-")) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    // หากเป็น inline code ทั่วไป (เช่น `const x = 1` ในบรรทัด)
    return <InlineCode {...props}>{children}</InlineCode>;
  },
  table({ children, className, ...props }) {
    return (
      <ResponsiveTable className={className} {...props}>
        {children}
      </ResponsiveTable>
    );
  },
  th({ children, className, ...props }) {
    return (
      <ResponsiveTableHeader className={className} {...props}>
        {children}
      </ResponsiveTableHeader>
    );
  },
  td({ children, className, ...props }) {
    return (
      <ResponsiveTableCell className={className} {...props}>
        {children}
      </ResponsiveTableCell>
    );
  },
  img({ src, alt, title, className, ...props }) {
    return (
      <ResponsiveImage
        src={typeof src === "string" ? src : ""}
        alt={alt || ""}
        title={title || ""}
        className={className}
        {...props}
      />
    );
  },
};

// คอมโพเนนต์กลางสำหรับเรนเดอร์ Markdown ในระบบ ARCHRON (WYSIWYG 100% & Production-grade)
export function MarkdownRenderer({
  content,
  className = "md-body",
  customComponents,
}: {
  content: string | null | undefined;
  className?: string;
  customComponents?: Partial<Components>;
}) {
  if (!content || content.trim() === "") return null;

  const processedContent = wikilinkify(content);
  const mergedComponents: Components = { ...mdComponents, ...customComponents };

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkFrontmatter]}
        rehypePlugins={[rehypeSlug, [rehypeSanitize, sanitizeSchema]]}
        components={mergedComponents}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
