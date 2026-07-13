// lib/content/recommendations.ts — Recommendation Engine (Phase 50)
// ระบบแนะนำเนื้อหาที่เกี่ยวข้อง based on concepts, framework, difficulty
// อ้างอิง: ROADMAP Phase 50 · Sitemap.md §/discover

import type { ContentEntry } from "@/types/content";

export type RecommendationReason =
  | "shared-concepts"
  | "same-framework"
  | "same-thinker"
  | "difficulty-progression"
  | "popular"
  | "recent"
  | "complementary";

export type Recommendation = {
  entry: ContentEntry;
  score: number;
  reasons: RecommendationReason[];
  sharedConcepts: string[];
};

/**
 * แนะนำบทความที่เกี่ยวข้องกับ entry ที่กำลังอ่าน
 * คำนวณจาก: concept ร่วม, framework เดียวกัน, thinker เดียวกัน, difficulty progression
 */
export function getRecommendations(
  current: ContentEntry,
  all: ContentEntry[],
  limit = 8,
): Recommendation[] {
  const currentConcepts = current.relatedConcepts.map((r) => r.conceptSlug);
  const currentThinkers = current.mainThinkers ?? [];
  const currentFramework = current.framework;

  return all
    .filter((e) => e.status === "published" && e.slug !== current.slug)
    .map((e) => {
      let score = 0;
      const reasons: RecommendationReason[] = [];
      const sharedConcepts: string[] = [];

      // 1. Shared concepts (high weight)
      const entryConcepts = e.relatedConcepts.map((r) => r.conceptSlug);
      const shared = entryConcepts.filter((c) => currentConcepts.includes(c));
      if (shared.length > 0) {
        score += shared.length * 3;
        reasons.push("shared-concepts");
        sharedConcepts.push(...shared);
      }

      // 2. Same framework
      if (currentFramework && e.framework === currentFramework) {
        score += 2;
        reasons.push("same-framework");
      }

      // 3. Same thinker
      if (currentThinkers.length > 0 && e.mainThinkers) {
        const sharedThinkers = e.mainThinkers.filter((t) =>
          currentThinkers.includes(t),
        );
        if (sharedThinkers.length > 0) {
          score += sharedThinkers.length * 1.5;
          reasons.push("same-thinker");
        }
      }

      // 4. Difficulty progression (suggest slightly harder)
      if (current.difficulty) {
        const diffOrder = ["beginner", "intermediate", "advanced", "source-note"];
        const currentIdx = diffOrder.indexOf(current.difficulty);
        const entryIdx = diffOrder.indexOf(e.difficulty ?? "beginner");
        if (entryIdx === currentIdx + 1) {
          score += 1;
          reasons.push("difficulty-progression");
        }
      }

      // 5. Recency bonus
      if (e.updatedAt) {
        const daysSinceUpdate =
          (Date.now() - new Date(e.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 30) {
          score += 0.5;
          reasons.push("recent");
        }
      }

      return {
        entry: e,
        score,
        reasons,
        sharedConcepts,
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * แนะนำ "เส้นทางการอ่าน" (reading path) จาก entry ปัจจุบัน
 * ใช้ difficulty progression + shared concepts
 */
export function getReadingPath(
  current: ContentEntry,
  all: ContentEntry[],
  maxSteps = 5,
): ContentEntry[] {
  const path: ContentEntry[] = [current];
  const visited = new Set([current.slug]);

  let currentEntry = current;

  for (let i = 0; i < maxSteps - 1; i++) {
    const next = getRecommendations(currentEntry, all, 20)
      .find((r) => !visited.has(r.entry.slug));

    if (!next) break;

    path.push(next.entry);
    visited.add(next.entry.slug);
    currentEntry = next.entry;
  }

  return path;
}

/**
 * หา "เนื้อหาที่ควรอ่านก่อน" (prerequisites) จาก concept relations
 */
export function getPrerequisites(
  entry: ContentEntry,
  all: ContentEntry[],
  limit = 3,
): ContentEntry[] {
  const prerequisiteSlugs = entry.relatedConcepts
    .filter((r) => r.relationType === "prerequisite")
    .map((r) => r.conceptSlug);

  return all
    .filter(
      (e) =>
        e.status === "published" &&
        prerequisiteSlugs.some(
          (s) =>
            e.relatedConcepts.some((r) => r.conceptSlug === s) ||
            e.slug === s,
        ),
    )
    .slice(0, limit);
}

/**
 * หา "หัวข้อที่ควรอ่านต่อ" (next topics) จาก concept relations
 */
export function getNextTopics(
  entry: ContentEntry,
  all: ContentEntry[],
  limit = 3,
): ContentEntry[] {
  const usedInSlugs = entry.relatedConcepts
    .filter((r) => r.relationType === "used-in")
    .map((r) => r.conceptSlug);

  return all
    .filter(
      (e) =>
        e.status === "published" &&
        usedInSlugs.some(
          (s) =>
            e.relatedConcepts.some((r) => r.conceptSlug === s) ||
            e.slug === s,
        ),
    )
    .slice(0, limit);
}

/**
 * หา "บทความยอดนิยม" (popular) จาก view count
 * (placeholder - will use view counter data)
 */
export function getPopularEntries(
  all: ContentEntry[],
  limit = 6,
): ContentEntry[] {
  return all
    .filter((e) => e.status === "published")
    .sort((a, b) => {
      // Sort by view count if available, otherwise by recency
      const aViews = 0; // TODO: integrate view counter
      const bViews = 0;
      if (bViews !== aViews) return bViews - aViews;
      const au = a.updatedAt ?? "";
      const bu = b.updatedAt ?? "";
      return bu.localeCompare(au);
    })
    .slice(0, limit);
}

/**
 * หา "บทความล่าสุด" (recent)
 */
export function getRecentEntries(
  all: ContentEntry[],
  limit = 6,
): ContentEntry[] {
  return all
    .filter((e) => e.status === "published")
    .sort((a, b) => {
      const au = a.updatedAt ?? a.publishedAt ?? "";
      const bu = b.updatedAt ?? b.publishedAt ?? "";
      return bu.localeCompare(au);
    })
    .slice(0, limit);
}
