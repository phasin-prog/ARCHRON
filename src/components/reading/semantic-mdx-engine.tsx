"use client";

import React, { type ReactNode, type ReactElement } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { mdComponents, wikilinkify } from "@/components/reading/markdown-renderer";
import { EditorIcon } from "@/components/studio/editor-icon";
import {
  ThinkerCard,
  DefinitionBlock,
  BookPreview,
  SymbolCard,
  InteractiveTimeline,
  CitationNote,
} from "@/components/reading/semantic";

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "thinkercard", "ThinkerCard",
    "definitionblock", "DefinitionBlock",
    "bookpreview", "BookPreview",
    "symbolcard", "SymbolCard",
    "interactivetimeline", "InteractiveTimeline",
    "citationnote", "CitationNote",
  ],
  attributes: {
    ...defaultSchema.attributes,
    "*": [
      "className", "class", "id", "style", "slug", "nameTh", "nameEn",
      "school", "period", "summary", "term", "phonetic", "etymology",
      "definition", "category", "titleTh", "titleEn", "author", "year",
      "coverUrl", "archetype", "shortMeaning", "items", "number", "text", "sourceUrl",
    ],
    a: ["href", "target", "rel", "title", "data-footnote-ref", "data-footnote-backref"],
    img: ["src", "alt", "title", "loading", "decoding", "width", "height"],
    code: ["className", "class"],
    th: ["align", "colSpan", "rowSpan"],
    td: ["align", "colSpan", "rowSpan"],
    blockquote: ["className", "class"],
  },
};

export type CalloutType = "NOTE" | "IMPORTANT" | "TIP" | "WARNING" | "CAUTION";

function getCalloutStyling(type: CalloutType) {
  switch (type) {
    case "NOTE":
      return {
        border: "border-l-4 border-accent",
        bg: "bg-accent/5",
        icon: "info",
        title: "ข้อสังเกต / บันทึกความรู้ (NOTE)",
        titleColor: "text-accent",
      };
    case "IMPORTANT":
      return {
        border: "border-l-4 border-purple-500",
        bg: "bg-purple-500/5",
        icon: "priority_high",
        title: "สาระสำคัญ (IMPORTANT)",
        titleColor: "text-purple-600 dark:text-purple-400",
      };
    case "TIP":
      return {
        border: "border-l-4 border-emerald-500",
        bg: "bg-emerald-500/5",
        icon: "lightbulb",
        title: "คำแนะนำและการประยุกต์ใช้ (TIP)",
        titleColor: "text-emerald-600 dark:text-emerald-400",
      };
    case "WARNING":
      return {
        border: "border-l-4 border-amber-500",
        bg: "bg-amber-500/5",
        icon: "warning",
        title: "ข้อควรระวัง / ข้อจำกัดทฤษฎี (WARNING)",
        titleColor: "text-amber-600 dark:text-amber-400",
      };
    case "CAUTION":
      return {
        border: "border-l-4 border-red-500",
        bg: "bg-red-500/5",
        icon: "dangerous",
        title: "คำเตือนความเสี่ยง (CAUTION)",
        titleColor: "text-red-600 dark:text-red-400",
      };
  }
}

export function CalloutBox({ type, children }: { type: CalloutType; children: ReactNode }) {
  const styling = getCalloutStyling(type);
  return (
    <aside className={`my-6 rounded-r-xl ${styling.border} ${styling.bg} p-4 sm:p-5 shadow-xs transition-all`}>
      <div className="mb-2 flex items-center gap-2 font-sans text-sm font-bold tracking-wide">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/10">
          <EditorIcon name={styling.icon} className={`h-3.5 w-3.5 ${styling.titleColor}`} />
        </span>
        <span className={styling.titleColor}>{styling.title}</span>
      </div>
      <div className="font-serif text-sm leading-relaxed text-text-body/90 [&>p]:mb-2 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}

// Custom blockquote handler that detects `[!NOTE]` / `[!WARNING]` syntax
function renderBlockquote({ children, ...props }: React.ComponentPropsWithoutRef<"blockquote">) {
  const childArray = React.Children.toArray(children);
  if (childArray.length > 0) {
    const firstChild = childArray[0];
    if (React.isValidElement(firstChild) && firstChild.type === "p") {
      const pChildren = React.Children.toArray((firstChild.props as { children?: ReactNode }).children);
      if (pChildren.length > 0 && typeof pChildren[0] === "string") {
        const text = pChildren[0].trim();
        const calloutMatch = text.match(/^\[!(NOTE|IMPORTANT|TIP|WARNING|CAUTION)\](?:\s+(.*))?/i);
        if (calloutMatch) {
          const type = calloutMatch[1].toUpperCase() as CalloutType;
          const remainingText = calloutMatch[2] || "";
          
          const newFirstPChildren = [...pChildren];
          if (remainingText) {
            newFirstPChildren[0] = remainingText;
          } else {
            newFirstPChildren.shift();
          }

          const modifiedFirstChild = React.cloneElement(
            firstChild as ReactElement<{ children?: ReactNode }>,
            {},
            newFirstPChildren.length > 0 ? newFirstPChildren : null
          );

          const restChildren = childArray.slice(1);
          return (
            <CalloutBox type={type}>
              {newFirstPChildren.length > 0 ? modifiedFirstChild : null}
              {restChildren}
            </CalloutBox>
          );
        }
      }
    }
  }

  return (
    <blockquote
      className="my-6 border-l-2 border-premium/50 bg-premium/5 py-3 pl-4 pr-3 font-serif italic leading-relaxed text-text-body/90"
      {...props}
    >
      {children}
    </blockquote>
  );
}

export interface SemanticMdxEngineProps {
  content: string | null | undefined;
  className?: string;
  enableAutoLinking?: boolean;
  enableCallouts?: boolean;
  customComponents?: Partial<Components>;
}

export function SemanticMdxEngine({
  content,
  className = "md-body space-y-4",
  enableAutoLinking = true,
  enableCallouts = true,
  customComponents,
}: SemanticMdxEngineProps) {
  if (!content || content.trim() === "") return null;

  const processedContent = enableAutoLinking ? wikilinkify(content) : content;

  const mergedComponents: Record<string, any> = {
    ...mdComponents,
    thinkercard: ThinkerCard,
    ThinkerCard: ThinkerCard,
    definitionblock: DefinitionBlock,
    DefinitionBlock: DefinitionBlock,
    bookpreview: BookPreview,
    BookPreview: BookPreview,
    symbolcard: SymbolCard,
    SymbolCard: SymbolCard,
    interactivetimeline: InteractiveTimeline,
    InteractiveTimeline: InteractiveTimeline,
    citationnote: CitationNote,
    CitationNote: CitationNote,
    ...(enableCallouts ? { blockquote: renderBlockquote } : {}),
    ...customComponents,
  };

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks, remarkFrontmatter]}
        rehypePlugins={[rehypeSlug, [rehypeSanitize, sanitizeSchema]]}
        components={mergedComponents as Partial<Components>}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
