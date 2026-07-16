import {
  findDeadLinks,
  findLinkSuggestions,
  parseInternalLinks,
} from "@/lib/content/publishing/internal-links";
import type {
  LinkSuggestion,
  LinkToken,
} from "@/lib/content/publishing/internal-links";
import {
  evaluateKnowledgeHealth,
} from "@/lib/content/studio/knowledge-health";
import type {
  DraftInput,
  KnowledgeHealthReport,
} from "@/lib/content/studio/knowledge-health";
import { parseMdxSemantic } from "@/lib/content/studio/semantic-parser";
import type { ParsedMdxAnalysis } from "@/lib/content/studio/semantic-parser";

/**
 * The subset of an editor draft needed to run document diagnostics.
 * Extra editor-only fields are intentionally optional so this module remains
 * independent from the publishing form's full draft type.
 */
export interface DocumentDiagnosticsInput extends DraftInput {
  visualExplanation?: string;
  technicalMeaning?: string;
}

export interface DocumentLinkDiagnostics {
  /** Parsed links from the canonical Markdown document. */
  tokens: LinkToken[];
  /** Unresolved non-citation targets across all authored text fields. */
  deadTargets: string[];
  /** Registry matches that may be useful as internal links. */
  suggestions: LinkSuggestion[];
}

export interface DocumentDiagnostics {
  analysis: ParsedMdxAnalysis;
  health: KnowledgeHealthReport;
  links: DocumentLinkDiagnostics;
}

function joinAuthoredText(input: DocumentDiagnosticsInput): string {
  return [input.bodyMarkdown, input.visualExplanation, input.technicalMeaning]
    .filter((value): value is string => Boolean(value?.trim()))
    .join("\n\n");
}

function normalizeCitationTokens(
  tokens: LinkToken[],
  citationTargets: ReadonlySet<string>,
): LinkToken[] {
  return tokens.map((token) => {
    if (token.type === "link" && citationTargets.has(token.slug)) {
      return { ...token, dead: false };
    }
    return token;
  });
}

/**
 * Builds every non-blocking document diagnostic from one parsed Markdown
 * analysis. Publish-gating validation deliberately remains a separate concern.
 */
export function buildDocumentDiagnostics(
  input: DocumentDiagnosticsInput,
): DocumentDiagnostics {
  const bodyMarkdown = input.bodyMarkdown || "";
  const analysis = parseMdxSemantic(bodyMarkdown);
  const authoredText = joinAuthoredText(input);
  const citationTargets = new Set(
    analysis.wikilinks
      .filter((link) => link.isCitation)
      .map((link) => link.target),
  );

  return {
    analysis,
    health: evaluateKnowledgeHealth(input, analysis),
    links: {
      tokens: normalizeCitationTokens(
        parseInternalLinks(bodyMarkdown),
        citationTargets,
      ),
      deadTargets: Array.from(
        new Set(
          findDeadLinks(authoredText).filter(
            (target) => !citationTargets.has(target),
          ),
        ),
      ),
      suggestions: findLinkSuggestions(authoredText),
    },
  };
}
