"use client";

import type { Components } from "react-markdown";
import { MarkdownRenderer } from "@/components/reading/markdown-renderer";

export { CalloutBox, type CalloutType } from "@/components/reading/markdown-renderer";

export interface SemanticMdxEngineProps {
  content: string | null | undefined;
  className?: string;
  enableAutoLinking?: boolean;
  enableCallouts?: boolean;
  customComponents?: Partial<Components>;
}

/**
 * Compatibility adapter for existing semantic-MDX callers. Rendering, plugin
 * order, sanitization, callouts, and recognised semantic blocks all live in
 * MarkdownRenderer so public pages and Studio previews cannot drift.
 */
export function SemanticMdxEngine({
  content,
  className = "md-body space-y-4",
  enableAutoLinking = true,
  enableCallouts = true,
  customComponents,
}: SemanticMdxEngineProps) {
  return (
    <MarkdownRenderer
      content={content}
      className={className}
      customComponents={customComponents}
      enableAutoLinking={enableAutoLinking}
      enableCallouts={enableCallouts}
      enableSemanticBlocks
    />
  );
}
