import { describe, it, expect } from "vitest";
import { slugify, getPublishChecklist, canPublish, EMPTY_DRAFT } from "@/lib/content/publishing/publish-validation";
import { validateEditorDraft } from "@/lib/content/publishing/editor-validation";
import { DEFAULT_PRICING } from "@/lib/content/guide/pricing-data";

describe("slugify", () => {
  it("converts title to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("removes special characters", () => {
    expect(slugify("Hello! World?")).toBe("hello-world");
  });
  it("collapses multiple dashes", () => {
    expect(slugify("a---b")).toBe("a-b");
  });
  it("trims whitespace", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
  });
});

describe("getPublishChecklist", () => {
  it("requires title", () => {
    const items = getPublishChecklist({ ...EMPTY_DRAFT, title: "" });
    const titleItem = items.find((i) => i.label === "มี Title");
    expect(titleItem?.ok).toBe(false);
  });
  it("requires slug", () => {
    const items = getPublishChecklist({ ...EMPTY_DRAFT, slug: "" });
    const slugItem = items.find((i) => i.label === "มี Slug");
    expect(slugItem?.ok).toBe(false);
  });
});

describe("canPublish", () => {
  it("returns true when all items ok", () => {
    expect(canPublish([{ label: "a", ok: true }, { label: "b", ok: true }])).toBe(true);
  });
  it("returns false when any item fails", () => {
    expect(canPublish([{ label: "a", ok: true }, { label: "b", ok: false }])).toBe(false);
  });
});

describe("guide pricing validation", () => {
  it("allows the guide pricing configuration to publish without article-only fields", () => {
    const result = validateEditorDraft({
      ...EMPTY_DRAFT,
      title: "Guide Pricing",
      slug: "guide-pricing",
      bodyMarkdown: JSON.stringify(DEFAULT_PRICING),
    });

    expect(result.canPublish).toBe(true);
  });
});
