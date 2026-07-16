import { describe, expect, it } from "vitest";
import { draftToPreviewEntry } from "@/lib/content/publishing/draft-preview";
import { EMPTY_DRAFT } from "@/lib/content/publishing/publish-validation";

describe("draftToPreviewEntry", () => {
  it("maps all renderable concept fields into a shared reading entry", () => {
    const entry = draftToPreviewEntry({
      ...EMPTY_DRAFT,
      id: "draft-1",
      title: "Persona",
      slug: "persona",
      contentType: "concept",
      status: "ready-to-publish",
      difficulty: "intermediate",
      tags: ["Jung", "identity"],
      mainTerm: "Persona",
      thaiName: "บุคลิกภาพภายนอก",
      originalTerm: "persona",
      partOfSpeech: "noun",
      languageRoot: "Latin",
      ipa: "/pərˈsoʊnə/",
      framework: "Analytical psychology",
      school: "Jungian",
      mainThinker: "Carl Jung, Emma Jung",
      shortDescription: "A social mask.",
      visualExplanation: "A mask worn in public.",
      technicalMeaning: "A psychic structure.",
      realWorldExamples: "A doctor at work.",
      rootsEtymology: "Latin persona",
      rootsMeaningShift: "From theatrical mask to social role",
      rootsCaution: "Do not mistake it for the whole person.",
      bodyMarkdown: "# Persona",
      coverImage: "https://example.test/persona.jpg",
      rowCode: "CON-001",
      rowName: "Persona entry",
      relatedConcepts: [{ conceptSlug: "shadow", relationType: "contrasts-with", reason: "paired" }],
      references: [{ sourceType: "primary-source", title: "Two Essays", relatedClaim: "Defines persona" }],
      articleSlugs: ["jung"],
      conceptSlugs: ["shadow"],
      readingSetSlugs: ["jung-basics"],
    }, "  Ananda  ");

    expect(entry).toMatchObject({
      contentType: "concept",
      id: "draft-1",
      author: "Ananda",
      status: "ready-to-publish",
      difficulty: "intermediate",
      mainTerm: "Persona",
      thaiName: "บุคลิกภาพภายนอก",
      mainThinkers: ["Carl Jung, Emma Jung"],
      roots: {
        etymology: "Latin persona",
        meaningShift: "From theatrical mask to social role",
        caution: "Do not mistake it for the whole person.",
      },
      relatedCTA: {
        articleSlugs: ["jung"],
        conceptSlugs: ["shadow"],
        readingSetSlugs: ["jung-basics"],
      },
      relatedConcepts: [{ conceptSlug: "shadow", relationType: "contrasts-with", reason: "paired" }],
      references: [{ sourceType: "primary-source", title: "Two Essays", relatedClaim: "Defines persona" }],
    });
  });

  it("uses safe enum fallbacks while retaining a valid shared entry", () => {
    const entry = draftToPreviewEntry({
      ...EMPTY_DRAFT,
      contentType: "unknown",
      status: "unknown",
      difficulty: "unknown",
      relatedConcepts: [{ conceptSlug: "self", relationType: "unknown", reason: "" }],
      references: [{ sourceType: "unknown", title: "Untyped", relatedClaim: "" }],
    });

    expect(entry.contentType).toBe("article");
    expect(entry.status).toBe("draft");
    expect(entry.difficulty).toBe("beginner");
    expect(entry.relatedConcepts[0]?.relationType).toBe("related");
    expect(entry.references[0]?.sourceType).toBe("other");
  });

  it("splits person list fields and omits empty optional values", () => {
    const entry = draftToPreviewEntry({
      ...EMPTY_DRAFT,
      contentType: "person",
      mainTerm: "Carl Jung",
      mainThinker: "Carl Jung",
      keyIdeas: "archetype, , individuation ",
      notableWorks: "Psychological Types, Memories",
    });

    expect(entry).toMatchObject({
      contentType: "person",
      mainTerm: "Carl Jung",
      keyIdeas: ["archetype", "individuation"],
      notableWorks: ["Psychological Types", "Memories"],
    });
    expect(entry.author).toBeUndefined();
    expect(entry.relatedCTA).toBeUndefined();
  });
});
