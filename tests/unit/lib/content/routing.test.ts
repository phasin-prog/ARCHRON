import { describe, expect, it } from "vitest";
import {
  contentEntryHref,
  getLibraryArticles,
  isArticleRouteEntry,
  isConceptRouteEntry,
  isLibraryEntry,
  registryNodeHref,
} from "@/lib/content/routing";

describe("contentEntryHref", () => {
  it("routes each public content type to its dedicated page", () => {
    expect(contentEntryHref({ contentType: "article", slug: "night-sea-journey" })).toBe(
      "/articles/night-sea-journey",
    );
    expect(contentEntryHref({ contentType: "book", slug: "psychological-types" })).toBe(
      "/books/psychological-types",
    );
    expect(contentEntryHref({ contentType: "person", slug: "carl-jung" })).toBe(
      "/thinkers/carl-jung",
    );
    expect(contentEntryHref({ contentType: "reading-set", slug: "foundations" })).toBe(
      "/reading-sets/foundations",
    );
  });

  it("sends the guide pricing record to the guide rather than an article URL", () => {
    const entry = { contentType: "article" as const, slug: "guide-pricing" };

    expect(isLibraryEntry(entry)).toBe(false);
    expect(contentEntryHref(entry)).toBe("/guide");
  });
});

describe("getLibraryArticles", () => {
  it("excludes the guide pricing configuration from article listings", () => {
    const entries = [
      { contentType: "article" as const, slug: "night-sea-journey" },
      { contentType: "article" as const, slug: "guide-pricing" },
    ];

    expect(getLibraryArticles(entries)).toEqual([
      { contentType: "article", slug: "night-sea-journey" },
    ]);
  });
});

describe("registryNodeHref", () => {
  it("uses dedicated routes for thinker and book nodes", () => {
    expect(registryNodeHref("person", "carl-jung")).toBe("/thinkers/carl-jung");
    expect(registryNodeHref("book", "psychological-types")).toBe(
      "/books/psychological-types",
    );
  });

  it("keeps wiki-only node types in the concepts route", () => {
    expect(registryNodeHref("concept", "shadow")).toBe("/concepts/shadow");
    expect(registryNodeHref("school", "analytical-psychology")).toBe(
      "/concepts/analytical-psychology",
    );
  });
});

describe("detail route guards", () => {
  it("keeps articles, concepts, and service data in their own routes", () => {
    expect(isArticleRouteEntry({ contentType: "article", slug: "night-sea-journey" })).toBe(true);
    expect(isArticleRouteEntry({ contentType: "book", slug: "psychological-types" })).toBe(false);
    expect(isArticleRouteEntry({ contentType: "article", slug: "guide-pricing" })).toBe(false);

    expect(isConceptRouteEntry({ contentType: "concept", slug: "shadow" })).toBe(true);
    expect(isConceptRouteEntry({ contentType: "person", slug: "carl-jung" })).toBe(false);
  });
});
