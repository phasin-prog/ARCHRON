import { describe, expect, it } from "vitest";
import { buildDocumentDiagnostics } from "@/lib/content/studio/document-diagnostics";

const baseDraft = {
  title: "A working document",
  slug: "working-document",
  contentType: "article",
  bodyMarkdown: "",
};

describe("buildDocumentDiagnostics", () => {
  it("uses one Markdown analysis for both semantic metadata and health", () => {
    const diagnostics = buildDocumentDiagnostics({
      ...baseDraft,
      bodyMarkdown: "# Opening\n\n## Detail\n\n[[ego]]",
    });

    expect(diagnostics.analysis.headings.map((heading) => heading.text)).toEqual([
      "Opening",
      "Detail",
    ]);
    expect(diagnostics.analysis.wordCount).toBeGreaterThan(0);
    expect(diagnostics.health.categories.structure.score).toBeGreaterThanOrEqual(0);
  });

  it("aggregates and deduplicates unresolved links from authored text fields", () => {
    const diagnostics = buildDocumentDiagnostics({
      ...baseDraft,
      bodyMarkdown: "[[missing-node]] [[missing-node]] [[ego]]",
      visualExplanation: "[[also-missing]]",
      technicalMeaning: "[[missing-node]]",
    });

    expect(diagnostics.links.deadTargets).toEqual([
      "missing-node",
      "also-missing",
    ]);
    expect(diagnostics.links.tokens).toContainEqual(
      expect.objectContaining({
        type: "link",
        slug: "ego",
        dead: false,
      }),
    );
  });

  it("does not report semantic citations as dead internal links", () => {
    const diagnostics = buildDocumentDiagnostics({
      ...baseDraft,
      bodyMarkdown: "A claim [[cite: source-1, source-2]] and [[missing-node]].",
    });

    expect(diagnostics.analysis.citationNumbers).toEqual(["source-1", "source-2"]);
    expect(diagnostics.links.deadTargets).toEqual(["missing-node"]);
    expect(diagnostics.links.tokens).toContainEqual(
      expect.objectContaining({
        type: "link",
        slug: "cite: source-1, source-2",
        dead: false,
      }),
    );
  });
});
