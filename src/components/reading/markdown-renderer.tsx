import React, { type ReactElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import type { PluggableList } from "unified";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { InternalConceptLink } from "@/components/reading/internal-concept-link";
import { CodeBlock, InlineCode } from "@/components/reading/code-block";
import { ResponsiveTable, ResponsiveTableHeader, ResponsiveTableCell } from "@/components/reading/responsive-table";
import { ResponsiveImage } from "@/components/reading/responsive-image";
import {
  BookPreview,
  CitationNote,
  DefinitionBlock,
  InteractiveTimeline,
  SymbolCard,
  ThinkerCard,
  type TimelineItem,
} from "@/components/reading/semantic";
import { resolveIconElement } from "@/lib/content/core/icon-map";

// ปรับแต่ง Schema สำหรับ rehype-sanitize เพื่อป้องกัน XSS แต่ยังรักษา Class, ID, data attributes ของ Archron ไว้ครบถ้วน
export const markdownSanitizeSchema = {
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

export const markdownRemarkPlugins = [remarkGfm, remarkBreaks, remarkFrontmatter];
export const markdownRehypePlugins: PluggableList = [
  rehypeSlug,
  [rehypeSanitize, markdownSanitizeSchema],
];

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
export type CalloutType = "NOTE" | "IMPORTANT" | "TIP" | "WARNING" | "CAUTION";

function getCalloutStyling(type: CalloutType) {
  switch (type) {
    case "NOTE": return { border: "border-l-4 border-accent", bg: "bg-accent/5", icon: "info", title: "ข้อสังเกต / บันทึกความรู้ (NOTE)", titleColor: "text-accent" };
    case "IMPORTANT": return { border: "border-l-4 border-purple-500", bg: "bg-purple-500/5", icon: "priority_high", title: "สาระสำคัญ (IMPORTANT)", titleColor: "text-purple-600 dark:text-purple-400" };
    case "TIP": return { border: "border-l-4 border-emerald-500", bg: "bg-emerald-500/5", icon: "lightbulb", title: "คำแนะนำและการประยุกต์ใช้ (TIP)", titleColor: "text-emerald-600 dark:text-emerald-400" };
    case "WARNING": return { border: "border-l-4 border-amber-500", bg: "bg-amber-500/5", icon: "warning", title: "ข้อควรระวัง / ข้อจำกัดทฤษฎี (WARNING)", titleColor: "text-amber-600 dark:text-amber-400" };
    case "CAUTION": return { border: "border-l-4 border-red-500", bg: "bg-red-500/5", icon: "dangerous", title: "คำเตือนความเสี่ยง (CAUTION)", titleColor: "text-red-600 dark:text-red-400" };
  }
}

export function CalloutBox({ type, children }: { type: CalloutType; children: ReactNode }) {
  const styling = getCalloutStyling(type);
  return <aside className={`my-6 rounded-r-xl ${styling.border} ${styling.bg} p-4 shadow-xs transition-all sm:p-5`}><div className="mb-2 flex items-center gap-2 font-sans text-sm font-bold tracking-wide"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/10">{resolveIconElement(styling.icon, { className: `h-3.5 w-3.5 ${styling.titleColor}` })}</span><span className={styling.titleColor}>{styling.title}</span></div><div className="font-serif text-sm leading-relaxed text-text-body/90 [&>p]:mb-2 [&>p:last-child]:mb-0">{children}</div></aside>;
}

function renderBlockquote({ children, ...props }: React.ComponentPropsWithoutRef<"blockquote">) {
  const childArray = React.Children.toArray(children);
  const firstChild = childArray[0];
  if (React.isValidElement(firstChild) && firstChild.type === "p") {
    const paragraphChildren = React.Children.toArray((firstChild.props as { children?: ReactNode }).children);
    const firstParagraphChild = paragraphChildren[0];
    if (typeof firstParagraphChild === "string") {
      const match = firstParagraphChild.trim().match(/^\[!(NOTE|IMPORTANT|TIP|WARNING|CAUTION)\](?:\s+(.*))?/i);
      if (match) {
        const updatedChildren = match[2] ? [match[2], ...paragraphChildren.slice(1)] : paragraphChildren.slice(1);
        const updatedParagraph = React.cloneElement(firstChild as ReactElement<{ children?: ReactNode }>, {}, updatedChildren.length > 0 ? updatedChildren : null);
        return <CalloutBox type={match[1].toUpperCase() as CalloutType}>{updatedChildren.length > 0 ? updatedParagraph : null}{childArray.slice(1)}</CalloutBox>;
      }
    }
  }
  return <blockquote className="my-6 border-l-2 border-premium/50 bg-premium/5 py-3 pl-4 pr-3 font-serif italic leading-relaxed text-text-body/90" {...props}>{children}</blockquote>;
}

type SemanticBlockName = "ThinkerCard" | "DefinitionBlock" | "BookPreview" | "SymbolCard" | "InteractiveTimeline" | "CitationNote";
type SemanticBlock = { name: SemanticBlockName; attributes: Record<string, string> };
const semanticBlockNames = new Set<SemanticBlockName>(["ThinkerCard", "DefinitionBlock", "BookPreview", "SymbolCard", "InteractiveTimeline", "CitationNote"]);
const semanticBlockMarker = "ARCHRON_SEMANTIC_BLOCK:";
const semanticBlockPattern = /^ARCHRON_SEMANTIC_BLOCK:([^\s]+)$/;

function parseSemanticAttributes(source: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const matcher = /([A-Za-z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let match: RegExpExecArray | null;
  while ((match = matcher.exec(source)) !== null) attributes[match[1]] = match[2] ?? match[3] ?? "";
  return attributes;
}

/** Converts recognised standalone semantic blocks without enabling raw HTML. */
export function semanticBlockify(markdown: string): string {
  const lines = markdown.split("\n");
  const output: string[] = [];
  let fence: "`" | "~" | null = null;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0] as "`" | "~";
      fence = fence === marker ? null : fence ?? marker;
      output.push(line);
      continue;
    }
    if (fence) { output.push(line); continue; }
    const opening = line.match(/^\s*<(ThinkerCard|DefinitionBlock|BookPreview|SymbolCard|InteractiveTimeline|CitationNote)\b(.*)$/);
    if (!opening) { output.push(line); continue; }
    const blockLines = [opening[2]];
    while (!blockLines.join("\n").includes("/>") && index + 1 < lines.length) blockLines.push(lines[++index]);
    const rawAttributes = blockLines.join("\n");
    const closingIndex = rawAttributes.indexOf("/>");
    if (closingIndex === -1 || rawAttributes.slice(closingIndex + 2).trim() !== "") { output.push(line, ...blockLines.slice(1)); continue; }
    const block: SemanticBlock = { name: opening[1] as SemanticBlockName, attributes: parseSemanticAttributes(rawAttributes.slice(0, closingIndex)) };
    output.push(`${semanticBlockMarker}${encodeURIComponent(JSON.stringify(block))}`);
  }
  return output.join("\n");
}

function getSemanticBlock(value: string): SemanticBlock | null {
  const match = value.match(semanticBlockPattern);
  if (!match) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(match[1]));
    if (typeof parsed === "object" && parsed !== null && "name" in parsed && "attributes" in parsed && semanticBlockNames.has((parsed as { name: SemanticBlockName }).name) && typeof (parsed as { attributes: unknown }).attributes === "object") return parsed as SemanticBlock;
  } catch { /* A malformed marker remains paragraph text. */ }
  return null;
}

function stringAttribute(attributes: Record<string, string>, ...names: string[]) { return names.map((name) => attributes[name]).find(Boolean) ?? ""; }
function safeExternalUrl(value: string | undefined) { return value && /^https?:\/\//i.test(value) ? value : undefined; }

function timelineItems(value: string | undefined): TimelineItem[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item): TimelineItem[] => {
      if (typeof item !== "object" || item === null || !("year" in item) || !("title" in item) || !("description" in item) || (typeof item.year !== "string" && typeof item.year !== "number") || typeof item.title !== "string" || typeof item.description !== "string") return [];
      return [{ year: item.year, title: item.title, description: item.description, thinker: "thinker" in item && typeof item.thinker === "string" ? item.thinker : undefined }];
    });
  } catch { return []; }
}

function renderSemanticBlock(block: SemanticBlock) {
  const { attributes } = block;
  switch (block.name) {
    case "ThinkerCard": return <ThinkerCard {...attributes} />;
    case "DefinitionBlock": return <DefinitionBlock term={stringAttribute(attributes, "term", "title", "name")} definition={stringAttribute(attributes, "definition", "meaning")} phonetic={attributes.phonetic} etymology={attributes.etymology} category={attributes.category} />;
    case "BookPreview": return <BookPreview slug={attributes.slug ?? ""} titleTh={stringAttribute(attributes, "titleTh", "title", "name")} titleEn={attributes.titleEn} author={attributes.author ?? ""} year={attributes.year} coverUrl={safeExternalUrl(attributes.coverUrl)} summary={attributes.summary} />;
    case "SymbolCard": return <SymbolCard slug={attributes.slug ?? ""} nameTh={stringAttribute(attributes, "nameTh", "name", "title")} nameEn={attributes.nameEn} archetype={attributes.archetype} shortMeaning={stringAttribute(attributes, "shortMeaning", "meaning", "definition")} />;
    case "InteractiveTimeline": return <InteractiveTimeline items={timelineItems(attributes.items)} />;
    case "CitationNote": { const number = Number(attributes.number); return <CitationNote id={stringAttribute(attributes, "id", "number")} number={Number.isFinite(number) ? number : 0} text={attributes.text ?? ""} sourceUrl={safeExternalUrl(attributes.sourceUrl)} />; }
  }
}

function renderParagraph({ children, ...props }: React.ComponentPropsWithoutRef<"p">) {
  const paragraphChildren = React.Children.toArray(children);
  if (paragraphChildren.length === 1 && typeof paragraphChildren[0] === "string") {
    const block = getSemanticBlock(paragraphChildren[0]);
    if (block) return renderSemanticBlock(block);
  }
  return <p {...props}>{children}</p>;
}

export interface MarkdownRendererProps {
  content: string | null | undefined;
  className?: string;
  customComponents?: Partial<Components>;
  enableAutoLinking?: boolean;
  enableCallouts?: boolean;
  enableSemanticBlocks?: boolean;
}

export function createMarkdownComponents({ customComponents, enableCallouts = true, enableSemanticBlocks = true }: Pick<MarkdownRendererProps, "customComponents" | "enableCallouts" | "enableSemanticBlocks">): Components {
  return { ...mdComponents, ...(enableCallouts ? { blockquote: renderBlockquote } : {}), ...(enableSemanticBlocks ? { p: renderParagraph } : {}), ...customComponents };
}

export function MarkdownRenderer({
  content,
  className = "md-body",
  customComponents,
  enableAutoLinking = true,
  enableCallouts = true,
  enableSemanticBlocks = true,
}: MarkdownRendererProps) {
  if (!content || content.trim() === "") return null;

  const linkedContent = enableAutoLinking ? wikilinkify(content) : content;
  const processedContent = enableSemanticBlocks ? semanticBlockify(linkedContent) : linkedContent;
  const components = createMarkdownComponents({ customComponents, enableCallouts, enableSemanticBlocks });

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={markdownRemarkPlugins}
        rehypePlugins={markdownRehypePlugins}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
