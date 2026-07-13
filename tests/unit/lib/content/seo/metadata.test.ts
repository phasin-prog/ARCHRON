import { describe, it, expect } from "vitest";
import { generatePageMetadata } from "@/lib/content/seo/metadata";
import type { DiscriminatedEntry } from "@/types/content";

describe("generatePageMetadata", () => {
  const entry = {
    id: "test", title: "Psyche", slug: "psyche", status: "published",
    contentType: "concept",
    mainTerm: "Psyche", thaiName: "ไซคี",
    shortDescription: "แนวคิดเรื่องจิตในจิตวิทยาวิเคราะห์",
    relatedConcepts: [], references: [],
  } as unknown as DiscriminatedEntry;

  it("generates title with ARCHRON suffix", () => {
    const meta = generatePageMetadata(entry);
    expect(meta.title).toBe("Psyche — ARCHRON");
  });

  it("includes OpenGraph data", () => {
    const meta = generatePageMetadata(entry);
    expect(meta.openGraph).toBeDefined();
    expect(meta.openGraph?.title).toContain("Psyche");
  });

  it("includes canonical URL", () => {
    const meta = generatePageMetadata(entry);
    expect(meta.alternates?.canonical).toBeDefined();
    expect(meta.alternates?.canonical?.toString()).toContain("/concepts/psyche");
  });

  it("includes Twitter card", () => {
    const meta = generatePageMetadata(entry);
    expect(meta.twitter?.card).toBe("summary_large_image");
  });
});
