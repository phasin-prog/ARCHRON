// lib/content/relationships.ts — ARCHRON Phase 13: Relationship System
// ระบบจัดการความสัมพันธ์แบบสองทิศทาง (Bi-directional Relationships), เมทริกซ์ความเชื่อมโยง และห่วงโซ่ความรู้

import type { ContentEntry, RelationType } from "@/types/content";

export type DirectedEdge = {
  sourceSlug: string;
  targetSlug: string;
  relationType: RelationType;
  bidirectionalType: RelationType;
};

export type RelationshipGraphMatrix = {
  adjacencyMap: Map<string, DirectedEdge[]>;
  backlinksMap: Map<string, string[]>;
};

// ถอดรหัสความสัมพันธ์คู่ตรงข้ามหรือทิศทางย้อนกลับ (Inverse Relationship)
export function getInverseRelationType(type: RelationType): RelationType {
  switch (type) {
    case "prerequisite":
      return "used-in";
    case "contrasts-with":
      return "contrasts-with";
    case "part-of":
      return "source-of";
    case "source-of":
      return "part-of";
    case "used-in":
      return "prerequisite";
    case "influenced-by":
      return "source-of";
    case "related":
    default:
      return "related";
  }
}

// สร้างเมทริกซ์ความสัมพันธ์ทั้งหมดจากรายการ Entries (Relationship Matrix)
export function buildRelationshipMatrix(entries: ContentEntry[]): RelationshipGraphMatrix {
  const adjacencyMap = new Map<string, DirectedEdge[]>();
  const backlinksMap = new Map<string, string[]>();

  for (const entry of entries) {
    if (!adjacencyMap.has(entry.slug)) {
      adjacencyMap.set(entry.slug, []);
    }
    if (!backlinksMap.has(entry.slug)) {
      backlinksMap.set(entry.slug, []);
    }
  }

  for (const source of entries) {
    for (const rel of source.relatedConcepts ?? []) {
      const targetSlug = rel.conceptSlug;
      const invType = getInverseRelationType(rel.relationType);

      // บันทึก Edge ขาออก
      const sourceEdges = adjacencyMap.get(source.slug) ?? [];
      sourceEdges.push({
        sourceSlug: source.slug,
        targetSlug,
        relationType: rel.relationType,
        bidirectionalType: invType,
      });
      adjacencyMap.set(source.slug, sourceEdges);

      // บันทึก Backlink ย้อนกลับ
      const targetBacklinks = backlinksMap.get(targetSlug) ?? [];
      if (!targetBacklinks.includes(source.slug)) {
        targetBacklinks.push(source.slug);
      }
      backlinksMap.set(targetSlug, targetBacklinks);
    }
  }

  return { adjacencyMap, backlinksMap };
}

// ค้นหาห่วงโซ่ความรู้ 2 ทอด (2-hop neighborhood recommendations)
export function getTwoHopRelationships(slug: string, matrix: RelationshipGraphMatrix, entries: ContentEntry[]) {
  const firstHopEdges = matrix.adjacencyMap.get(slug) ?? [];
  const firstHopSlugs = new Set(firstHopEdges.map((e) => e.targetSlug));
  const secondHopSlugs = new Set<string>();

  for (const firstSlug of firstHopSlugs) {
    const secondEdges = matrix.adjacencyMap.get(firstSlug) ?? [];
    for (const edge of secondEdges) {
      if (edge.targetSlug !== slug && !firstHopSlugs.has(edge.targetSlug)) {
        secondHopSlugs.add(edge.targetSlug);
      }
    }
  }

  return entries.filter((e) => secondHopSlugs.has(e.slug));
}
