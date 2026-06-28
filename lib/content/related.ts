import type { ContentEntry } from "@/types/content";

export type RelatedArticle = {
  entry: ContentEntry;
  score: number;
  sharedConcepts: string[];
};

// หาบทความที่เกี่ยวข้องจาก concept ร่วมกัน
// priority: concept ร่วมมากสุด > framework เดียวกัน > thinker เดียวกัน > updatedAt ล่าสุด
export function getRelatedArticles(
  current: ContentEntry,
  all: ContentEntry[],
  limit = 6,
): RelatedArticle[] {
  const currentConcepts = current.relatedConcepts.map((r) => r.conceptSlug);

  return all
    .filter((e) => e.status === "published")
    .filter((e) => e.slug !== current.slug)
    .map((e) => {
      const concepts = e.relatedConcepts.map((r) => r.conceptSlug);
      const sharedConcepts = concepts.filter((c) =>
        currentConcepts.includes(c),
      );
      let score = sharedConcepts.length;
      if (e.framework && current.framework && e.framework === current.framework) {
        score += 0.5;
      }
      if (
        e.mainThinkers &&
        current.mainThinkers &&
        e.mainThinkers.some((t) => current.mainThinkers!.includes(t))
      ) {
        score += 0.25;
      }
      return { entry: e, score, sharedConcepts };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const au = a.entry.updatedAt ?? "";
      const bu = b.entry.updatedAt ?? "";
      return bu.localeCompare(au);
    })
    .slice(0, limit);
}

// หาบทความที่อ้างถึง concept หนึ่ง (backlinks)
export function getBacklinksForConcept(
  conceptSlug: string,
  all: ContentEntry[],
): ContentEntry[] {
  return all
    .filter((e) => e.status === "published")
    .filter((e) =>
      e.relatedConcepts.some((r) => r.conceptSlug === conceptSlug),
    );
}

// กฎ Constellation Map: ถ้า related รวมเกิน threshold ให้แสดงบางส่วน + ส่งต่อ map
export function shouldUseConstellation(
  relatedCount: number,
  threshold = 6,
): boolean {
  return relatedCount > threshold;
}
