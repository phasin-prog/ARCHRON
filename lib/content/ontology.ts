// lib/content/ontology.ts — ARCHRON Phase 11: Knowledge Ontology
// กำหนดระเบียบลำดับชั้นและไวยากรณ์ความรู้ 17 วัตถุความรู้ ตาม SYMBOLS.md และ AGENT-HANDOFF.md
// ใช้ตรวจสอบและรับรองความถูกต้องของข้อมูลความรู้ (Ontology Validation)

import type { ContentEntry, ContentType } from "@/types/content";
import { nodeTypeCosmology, type Cosmology } from "@/lib/content/cosmology";

export type KnowledgeObjectClass =
  | "concept"
  | "thinker"
  | "school"
  | "article"
  | "source"
  | "symbol"
  | "term"
  | "collection";

export type OntologyValidationResult = {
  valid: boolean;
  warnings: string[];
  cosmology: Cosmology;
  objectClass: KnowledgeObjectClass;
};

// ถอดรหัสคลาสวัตถุความรู้จาก contentType
export function classifyKnowledgeObject(type: ContentType | string | undefined): KnowledgeObjectClass {
  switch (type) {
    case "concept":
      return "concept";
    case "person":
      return "thinker";
    case "school":
      return "school";
    case "article":
      return "article";
    case "book":
    case "source-note":
      return "source";
    case "symbol":
      return "symbol";
    case "term":
      return "term";
    case "reading-set":
      return "collection";
    default:
      return "article";
  }
}

// ตรวจสอบความถูกต้องตามหลัก Knowledge Ontology ของ ARCHRON
export function validateOntologyEntry(entry: ContentEntry): OntologyValidationResult {
  const warnings: string[] = [];
  const objectClass = classifyKnowledgeObject(entry.contentType);
  const cosmology = nodeTypeCosmology(entry.contentType);

  if (!entry.title || entry.title.trim() === "") {
    warnings.push("ระเบียนความรู้ขาดหัวข้อเรื่องหลัก (Title missing)");
  }
  if (!entry.slug || !/^[a-z0-9-]+$/.test(entry.slug)) {
    warnings.push("รหัส Slug ไม่สอดคล้องกับระเบียบ URI มาตรฐาน (Slug format invalid)");
  }

  // กฎเฉพาะแต่ละคลาสความรู้
  if (objectClass === "concept") {
    if (!entry.shortDescription && !entry.subtitle) {
      warnings.push("มโนทัศน์ (Concept) ควรมีคำอธิบายสั้น (shortDescription หรือ subtitle)");
    }
  }

  if (objectClass === "article") {
    if (!entry.author && entry.status === "published") {
      warnings.push("บทความที่เผยแพร่แล้วควรมีผู้เขียนหรือองค์บรรณาธิการระบุไว้");
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
    cosmology,
    objectClass,
  };
}

// สรุปภาพรวมโครงสร้างความรู้ของระเบียน
export function getOntologySummary(entry: ContentEntry) {
  const validation = validateOntologyEntry(entry);
  return {
    id: entry.id,
    slug: entry.slug,
    objectClass: validation.objectClass,
    cosmology: validation.cosmology,
    relationsCount: entry.relatedConcepts?.length ?? 0,
    referencesCount: entry.references?.length ?? 0,
    isValid: validation.valid,
  };
}
