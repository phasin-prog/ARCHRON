import { describe, it, expect } from "vitest";
import { chunkByHeading } from "@/lib/rtk/chunker";

describe("chunkByHeading", () => {
  it("returns empty array for empty markdown", () => {
    expect(chunkByHeading("")).toEqual([]);
  });

  it("returns single preamble chunk when no headings", () => {
    const md = "This is intro text without any heading.";
    const chunks = chunkByHeading(md);
    expect(chunks).toHaveLength(1);
    expect(chunks[0].heading).toBeNull();
    expect(chunks[0].headingLevel).toBeNull();
    expect(chunks[0].chunkNo).toBe(0);
    expect(chunks[0].markdown).toContain("intro text");
  });

  it("splits by ## and ### headings", () => {
    const md = [
      "Intro preamble.",
      "",
      "## First Section",
      "Content one.",
      "",
      "### Subsection",
      "Sub content.",
      "",
      "## Second Section",
      "Content two.",
    ].join("\n");

    const chunks = chunkByHeading(md);

    expect(chunks).toHaveLength(4);
    expect(chunks[0].heading).toBeNull(); // preamble
    expect(chunks[1].heading).toBe("First Section");
    expect(chunks[1].headingLevel).toBe(2);
    expect(chunks[2].heading).toBe("Subsection");
    expect(chunks[2].headingLevel).toBe(3);
    expect(chunks[3].heading).toBe("Second Section");
    expect(chunks[3].headingLevel).toBe(2);
  });

  it("strips # markers from heading text", () => {
    const md = "## My Heading\nContent.";
    const chunks = chunkByHeading(md);
    expect(chunks[0].heading).toBe("My Heading"); // no ## prefix
  });

  it("does not treat single # as a section heading", () => {
    const md = "# Title\n## Real Section\nContent.";
    const chunks = chunkByHeading(md);
    // # Title becomes part of preamble (not a section)
    expect(chunks[0].heading).toBeNull();
    expect(chunks[0].markdown).toContain("# Title");
    expect(chunks[1].heading).toBe("Real Section");
  });

  it("merges tiny chunks (<150 tokens) into previous", () => {
    // Build a chunk that is clearly >150 tokens, then a tiny one
    const bigContent = "word ".repeat(300); // ~300 tokens
    const tinyContent = "tiny."; // ~1 token
    const md = `## Big\n${bigContent}\n\n## Tiny\n${tinyContent}`;
    const chunks = chunkByHeading(md);
    // Tiny should be merged into Big
    const headings = chunks.map((c) => c.heading);
    expect(headings).not.toContain("Tiny");
    expect(headings).toContain("Big");
  });

  it("sits chunkNo sequentially from 0", () => {
    const md = "Intro\n## A\nx\n## B\ny";
    const chunks = chunkByHeading(md);
    expect(chunks.map((c) => c.chunkNo)).toEqual([0, 1, 2]);
  });
});
