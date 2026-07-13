// lib/content/graph.ts — Constellation graph adapter (server-safe, ไม่มี "use client")
// สร้างกราฟความสัมพันธ์จากข้อมูลจริง: nodes = concept-registry, edges = entries.relatedConcepts (+relatedCTA soft)
import { colors } from "@/lib/content/utils/colors";
import {
  conceptRegistry,
  getConceptBySlug,
  type NodeType,
} from "@/lib/content/core/registry";
import type { ContentEntry, RelationType } from "@/types/content";

export type GraphNode = {
  id: string; // = slug
  label: string;
  thaiTitle?: string;
  nodeType: NodeType;
  framework?: string;
  description?: string;
  hasPage: boolean; // มี entry เนื้อหาเต็ม (อ่านได้จริง)
  inbound: number; // ลิงก์ขาเข้า (กฎ hub)
  degree: number; // in + out (กำหนดขนาด)
  isHub: boolean; // inbound > 6
  clusterGroup?: string; // กลุ่มคลัสเตอร์ตาม Framework / Discipline
  centralityScore?: number; // คะแนนความเป็นศูนย์กลาง (0-1)
};

export type GraphEdge = {
  source: string;
  target: string;
  relation: RelationType;
  reason?: string;
  soft?: boolean; // มาจาก relatedCTA (เส้นรอง จาง/ประ)
};

export type GraphData = { nodes: GraphNode[]; edges: GraphEdge[] };

const HUB_THRESHOLD = 6; // ตรงกับ MAX_RELATED_INLINE / roadmap P1.1

export const NODE_TYPE_LABEL: Record<NodeType, string> = {
  concept: "แนวคิด",
  person: "นักคิด",
  book: "หนังสือ / งานเขียน",
  school: "สำนักคิด",
  symbol: "สัญลักษณ์",
  term: "คำศัพท์",
};

// ARCHRON Color Cosmology — สีโหนดตามสถานะการสืบค้น (เข้มพอให้คอนทราสต์บน Humanitas)
export const NODE_TYPE_COLOR: Record<NodeType, string> = {
  concept: colors.steelBlue, // Psyche , โลกภายใน/การวิเคราะห์
  person: colors.sageDarker, // Mercurius , บทสนทนา/การแปรเปลี่ยน
  book: colors.amberGold, // Sapientia เข้ม , ปัญญาสะสม
  school: colors.tealGreen, // การบูรณาการ
  symbol: colors.silverGray, // Prima Materia , ตำนาน/สัญลักษณ์
  term: colors.ashGray, // Charcoal-gray
};

export const RELATION_LABEL: Record<RelationType, string> = {
  prerequisite: "ควรอ่านก่อน",
  related: "เกี่ยวข้องโดยตรง",
  "contrasts-with": "เปรียบเทียบ / ต่าง",
  "part-of": "เป็นส่วนหนึ่งของ",
  "source-of": "แหล่งที่มา",
  "used-in": "ถูกใช้ใน",
  "influenced-by": "ได้รับอิทธิพลจาก",
};

export const NODE_TYPE_ORDER: NodeType[] = [
  "concept",
  "person",
  "book",
  "school",
  "symbol",
  "term",
];

export function buildGraph(entries: ContentEntry[]): GraphData {
  const nodes = new Map<string, GraphNode>();

  // 1) registry = node หลัก
  for (const c of conceptRegistry) {
    nodes.set(c.slug, {
      id: c.slug,
      label: c.title,
      thaiTitle: c.thaiTitle,
      nodeType: c.nodeType,
      framework: c.framework,
      description: c.description,
      hasPage: false,
      inbound: 0,
      degree: 0,
      isHub: false,
    });
  }

  // 2) entries → node "อ่านได้" + edges
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  const pushEdge = (e: GraphEdge) => {
    const key = `${e.source}->${e.target}:${e.relation}:${e.soft ? "s" : "m"}`;
    if (seen.has(key) || e.source === e.target) return;
    seen.add(key);
    edges.push(e);
  };

  for (const e of entries) {
    const existing = nodes.get(e.slug);
    if (existing) existing.hasPage = true;
    else
      nodes.set(e.slug, {
        id: e.slug,
        label: e.title,
        thaiTitle: e.thaiName,
        nodeType: (e.contentType as NodeType) ?? "concept",
        framework: e.framework,
        description: e.shortDescription,
        hasPage: true,
        inbound: 0,
        degree: 0,
        isHub: false,
      });

    for (const rc of e.relatedConcepts ?? []) {
      if (!nodes.has(rc.conceptSlug)) continue; // กัน dead edge
      pushEdge({ source: e.slug, target: rc.conceptSlug, relation: rc.relationType, reason: rc.reason });
    }
    for (const s of e.relatedCTA?.conceptSlugs ?? [])
      if (nodes.has(s)) pushEdge({ source: e.slug, target: s, relation: "related", soft: true });
    for (const s of e.relatedCTA?.articleSlugs ?? [])
      if (nodes.has(s)) pushEdge({ source: e.slug, target: s, relation: "used-in", soft: true });
  }

  // 3) degree / inbound / hub (นับเฉพาะเส้นหลัก)
  for (const ed of edges) {
    if (ed.soft) continue;
    const s = nodes.get(ed.source);
    const t = nodes.get(ed.target);
    if (s) s.degree += 1;
    if (t) {
      t.degree += 1;
      t.inbound += 1;
    }
  }
  let maxDegree = 1;
  for (const n of nodes.values()) {
    if (n.degree > maxDegree) maxDegree = n.degree;
  }
  for (const n of nodes.values()) {
    n.isHub = n.inbound > HUB_THRESHOLD;
    n.centralityScore = Number((n.degree / maxDegree).toFixed(3));
    n.clusterGroup = n.framework ?? n.nodeType ?? "general";
  }

  return { nodes: [...nodes.values()], edges };
}

// ── Local Graph (B2) — กราฟย่อยรายโหนด: โหนดเป้าหมาย + เพื่อนบ้านโดยตรง ──────────
// สร้างจาก entry.relatedConcepts โดยตรง (ไม่ต้องโหลด entries ทั้งหมด) + ดึงชื่อ/ชนิดจาก registry
export type LocalGraphNode = {
  slug: string;
  label: string;
  nodeType: NodeType;
  relation?: RelationType;
};
export type LocalGraph = { center: LocalGraphNode; neighbors: LocalGraphNode[] };

export function localGraphFromEntry(entry: ContentEntry, max = 8): LocalGraph {
  const center: LocalGraphNode = {
    slug: entry.slug,
    label: entry.mainTerm ?? entry.title,
    nodeType: (entry.contentType as NodeType) ?? "concept",
  };
  const seen = new Set<string>([entry.slug]);
  const neighbors: LocalGraphNode[] = [];
  for (const rc of entry.relatedConcepts ?? []) {
    const slug = rc.conceptSlug;
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    const reg = getConceptBySlug(slug);
    neighbors.push({
      slug,
      label: reg?.title ?? slug,
      nodeType: reg?.nodeType ?? "concept",
      relation: rc.relationType,
    });
    if (neighbors.length >= max) break;
  }
  return { center, neighbors };
}
