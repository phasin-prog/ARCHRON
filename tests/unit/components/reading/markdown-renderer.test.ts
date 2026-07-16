import { describe, expect, it } from "vitest";
import { semanticBlockify, wikilinkify } from "@/components/reading/markdown-renderer";

describe("semanticBlockify", () => {
  it("converts a recognised standalone semantic block to a safe marker", () => {
    const result = semanticBlockify('<DefinitionBlock term="Persona" definition="A social mask" />');

    expect(result).toMatch(/^ARCHRON_SEMANTIC_BLOCK:/);
    expect(result).not.toContain("<DefinitionBlock");
  });

  it("does not transform semantic-looking text inside a code fence", () => {
    const source = "```md\n<DefinitionBlock term=\"Persona\" definition=\"A social mask\" />\n```";

    expect(semanticBlockify(source)).toBe(source);
  });
});

describe("wikilinkify", () => {
  it("keeps citations as reference anchors while resolving internal labels", () => {
    expect(wikilinkify("[[cite: 1, 2]] [[ego|Ego]]")).toBe(
      "[1](#ref-1)[2](#ref-2) [Ego](/concepts/ego)",
    );
  });
});
