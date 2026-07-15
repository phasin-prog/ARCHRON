// src/lib/content/studio/knowledge-health.ts
// ARCHRON Studio v2 — Knowledge Health Validator
// ระบบประเมินและวินิจฉัยความสมบูรณ์เชิงวิชาการของเนื้อหา (Live Knowledge Health Score)
// ออกแบบตามหลัก "Knowledge Health" ไม่ใช่ form checklist ที่กีดกันการเขียน

export type HealthCategory =
  | "structure"
  | "academic"
  | "references"
  | "relations"
  | "terminology";

export type HealthIssueSeverity = "info" | "warning" | "critical";

export interface KnowledgeHealthIssue {
  id: string;
  category: HealthCategory;
  severity: HealthIssueSeverity;
  title: string;
  description: string;
  suggestion?: string;
  line?: number;
  autoFixAction?: string;
}

export interface CategoryScore {
  category: HealthCategory;
  score: number;
  maxScore: number;
  labelTh: string;
}

export interface KnowledgeHealthReport {
  totalScore: number;
  status: "excellent" | "good" | "needs_work" | "critical";
  categories: Record<HealthCategory, CategoryScore>;
  issues: KnowledgeHealthIssue[];
}

import type { ParsedMdxAnalysis } from "./semantic-parser";

export interface KnowledgeAnalysis {
  wordCount?: number;
  headingCount?: number;
  wikilinkCount?: number;
  [key: string]: any;
}

export interface DraftInput {
  title: string;
  slug: string;
  contentType: string;
  bodyMarkdown: string;
}

export const HEALTH_CATEGORY_LABELS: Record<HealthCategory, string> = {
  structure: "โครงสร้างมาตรฐาน",
  academic: "ความเข้มข้นเชิงวิชาการ",
  references: "เอกสารและแหล่งอ้างอิง",
  relations: "การเชื่อมโยงโครงข่ายความรู้",
  terminology: "ความแม่นยำของคำศัพท์",
};

/**
 * นับจำนวนคำในข้อความ รองรับทั้งภาษาไทยและภาษาอังกฤษ
 */
function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  // ลบเครื่องหมาย Markdown พื้นฐาน
  const clean = text.replace(/[#*`~_\[\](){}><|+=-]/g, " ").trim();
  const tokens = clean.split(/\s+/).filter(Boolean);
  const thaiChars = (clean.match(/[\u0E00-\u0E7F]/g) || []).length;
  // ประมาณการคำไทยเฉลี่ย 6 ตัวอักษรต่อคำ
  const approxThaiWords = Math.round(thaiChars / 6);
  const nonThaiTokens = tokens.filter((t) => !/[\u0E00-\u0E7F]/.test(t)).length;
  return approxThaiWords + nonThaiTokens;
}

/**
 * ประเมินสุขภาพและคุณภาพเชิงวิชาการของเนื้อหา (Knowledge Health Assessment)
 */
export function evaluateKnowledgeHealth(
  draft: DraftInput,
  analysis?: Partial<ParsedMdxAnalysis> | KnowledgeAnalysis | Record<string, any>
): KnowledgeHealthReport {
  const issues: KnowledgeHealthIssue[] = [];
  const safeAnalysis = (analysis || {}) as KnowledgeAnalysis;

  const title = (draft.title || "").trim();
  const slug = (draft.slug || "").trim();
  const contentType = (draft.contentType || "article").toLowerCase();
  const bodyMarkdown = draft.bodyMarkdown || "";

  const wordCount =
    typeof safeAnalysis.wordCount === "number" && !isNaN(safeAnalysis.wordCount)
      ? safeAnalysis.wordCount
      : countWords(bodyMarkdown);

  const h2Matches = bodyMarkdown.match(/^##\s+.+/gm) || [];
  const h2Count =
    typeof safeAnalysis.headingCount === "number" &&
    !isNaN(safeAnalysis.headingCount)
      ? safeAnalysis.headingCount
      : h2Matches.length;

  const wikilinkMatches = (bodyMarkdown.match(/\[\[([^\]]+)\]\]/g) || []).filter(
    (link) => !link.toLowerCase().startsWith("[[cite:")
  );
  const wikilinkCount =
    typeof safeAnalysis.wikilinkCount === "number" &&
    !isNaN(safeAnalysis.wikilinkCount)
      ? safeAnalysis.wikilinkCount
      : wikilinkMatches.length;

  // ==========================================
  // 1. Evaluate Structure (โครงสร้างมาตรฐาน) — Max 20 pts
  // ==========================================
  let structureScore = 0;

  if (title.length > 0) {
    structureScore += 6;
  } else {
    issues.push({
      id: "structure-missing-title",
      category: "structure",
      severity: "critical",
      title: "ยังไม่ได้ระบุชื่อหัวข้อ (Title)",
      description:
        "ชื่อหัวข้อเป็นข้อมูลสำคัญที่สุดในการแสดงผลในระบบคลังความรู้ และช่วยให้ผู้อ่านเข้าใจแก่นหลักของเนื้อหาทันที",
      suggestion: "ควรตั้งชื่อหัวข้อให้ชัดเจน กระชับ และสะท้อนแก่นเรื่องทางวิชาการ",
    });
  }

  if (slug.length > 0) {
    structureScore += 4;
  } else {
    issues.push({
      id: "structure-missing-slug",
      category: "structure",
      severity: "critical",
      title: "ยังไม่ได้ระบุ Slug (ลิงก์ถาวร)",
      description:
        "Slug จำเป็นสำหรับการสร้าง URL ถาวรและการอ้างอิงผ่าน Wikilink [[...]] ในโครงข่ายความรู้ Archron",
      suggestion:
        "ควรกำหนด Slug เป็นภาษาอังกฤษตัวพิมพ์เล็กหรือตัวเลข คั่นด้วยยัติภังค์ (เช่น analytical-psychology)",
    });
  }

  if (wordCount < 100) {
    issues.push({
      id: "structure-body-too-short",
      category: "structure",
      severity: wordCount < 30 ? "critical" : "warning",
      title: "เนื้อหาหลักสั้นเกินไป (< 100 คำ)",
      description: `เนื้อหาปัจจุบันมีประมาณ ${wordCount} คำ ซึ่งยังไม่เพียงพอสำหรับการอธิบายมโนทัศน์ทางวิชาการเชิงลึกตามมาตรฐาน Archron`,
      suggestion:
        "ควรขยายความอธิบายบริบททางทฤษฎี นิยามศัพท์ และการยกตัวอย่างเชิงประจักษ์ให้ครบถ้วนยิ่งขึ้น",
    });
    if (wordCount >= 50 && h2Count >= 1) {
      structureScore += 4;
    }
  } else {
    const isShortFormat = contentType === "term" || contentType === "symbol";
    const requiredH2 = isShortFormat ? 2 : 3;

    if (h2Count >= requiredH2) {
      structureScore += 10;
    } else if (h2Count > 0) {
      structureScore += 6;
      issues.push({
        id: "structure-few-headings",
        category: "structure",
        severity: "info",
        title: "โครงสร้างหัวข้อย่อยยังไม่ครบถ้วน (H2)",
        description: `พบหัวข้อย่อยระดับ H2 จำนวน ${h2Count} หัวข้อ แนะนำให้แบ่งหัวข้อย่อยอย่างน้อย ${requiredH2} ส่วนเพื่อช่วยให้การอ่านและจัดระบบความคิดเป็นไปอย่างมีประสิทธิภาพ`,
        suggestion:
          "ควรเพิ่มหัวข้อสำคัญ เช่น บริบทปัญญา นิยามและความหมายทางวิชาการ หรือตัวอย่างเชิงประจักษ์",
      });
    } else {
      structureScore += 3;
      issues.push({
        id: "structure-no-headings",
        category: "structure",
        severity: "warning",
        title: "ไม่พบหัวข้อย่อยระดับ H2 ในเนื้อหา",
        description:
          "เนื้อหายังไม่ได้ถูกแบ่งย่อยด้วย Markdown Headings (## หัวข้อ) ทำให้การอ่านทบทวนและทำความเข้าใจโครงสร้างทฤษฎีทำได้ยาก",
        suggestion:
          "ควรแบ่งส่วนเนื้อหาออกเป็นหัวข้อย่อย เช่น ## บริบทปัญญา ## นิยามทางวิชาการ และ ## แหล่งอ้างอิง",
      });
    }
  }

  structureScore = Math.max(0, Math.min(20, structureScore));

  // ==========================================
  // 2. Evaluate Academic Rigor (ความเข้มข้นเชิงวิชาการ) — Max 20 pts
  // ==========================================
  let academicScore = 0;

  const hasDefinitions =
    /#+#?\s*(นิยาม|ความหมายทางวิชาการ|นิยามและแก่น|Technical Meaning|วัตถุประสงค์|Objective|คำนิยาม|แก่นทางวิชาการ|บริบทปัญญา|รากศัพท์|Etymology|Core Concepts)/i.test(
      bodyMarkdown
    ) ||
    /\[!(NOTE|TIP|IMPORTANT)\]\s*(นิยาม|ความหมาย|คำอธิบาย|ข้อพึงระวัง|แก่นวิชาการ)/i.test(
      bodyMarkdown
    ) ||
    (bodyMarkdown.includes("นิยาม") && wordCount > 150);

  if (hasDefinitions) {
    academicScore += 10;
  } else {
    issues.push({
      id: "academic-missing-definition",
      category: "academic",
      severity: "warning",
      title: "ยังไม่พบนิยามหรือความหมายทางวิชาการที่ชัดเจน",
      description:
        "เนื้อหายังขาดการระบุนิยามเชิงเทคนิค (Technical Meaning) หรือหัวข้อวัตถุประสงค์ทางวิชาการที่ชัดเจน",
      suggestion:
        "ควรเพิ่มหัวข้อ '## นิยามและความหมายทางวิชาการ (Technical Meaning)' เพื่อปูพื้นฐานความเข้าใจที่แม่นยำตามมาตรฐาน Archron",
    });
  }

  const analyticalKeywords =
    /(\b(วิเคราะห์|ทฤษฎี|มโนทัศน์|กลไก|โครงสร้าง|กระบวนการ|ปรากฏการณ์|อิทธิพล|จิตวิเคราะห์|จิตวิทยา|จิตไร้สำนึก|เชิงลึก|ความสัมพันธ์|สันนิษฐาน|ข้อเสนอ|เปรียบเทียบ|ปฏิสัมพันธ์|archetype|psychoanalysis|unconscious|complex|individuation|libido|synchronicity)\b)/gi;
  const analyticalMatches = bodyMarkdown.match(analyticalKeywords) || [];
  const hasCalloutExplanations = />\s*\[!(NOTE|TIP|IMPORTANT)\]/i.test(
    bodyMarkdown
  );

  if (analyticalMatches.length >= 5 || (wordCount > 250 && analyticalMatches.length >= 3) || (analyticalMatches.length >= 3 && hasCalloutExplanations)) {
    academicScore += 10;
  } else if (analyticalMatches.length >= 2) {
    academicScore += 6;
    issues.push({
      id: "academic-moderate-analytical-depth",
      category: "academic",
      severity: "info",
      title: "สามารถเสริมความลุ่มลึกเชิงวิเคราะห์เพิ่มเติมได้",
      description:
        "เนื้อหามีการให้ข้อมูลพื้นฐานแล้ว แต่อาจเพิ่มสัดส่วนการวิเคราะห์เชิงลึก เช่น กลไกการทำงานทางจิตวิทยา หรือข้อถกเถียงเชิงทฤษฎี",
      suggestion:
        "ควรเสริมอรรถกถา (Commentary) หรือการวิเคราะห์ว่าเหตุใดมโนทัศน์นี้จึงมีผลกระทบต่อจิตใจและสภาวะปัญญาของมนุษย์",
    });
  } else {
    academicScore += 2;
    issues.push({
      id: "academic-low-analytical-depth",
      category: "academic",
      severity: "warning",
      title: "เนื้อหายังขาดความลุ่มลึกเชิงวิเคราะห์",
      description:
        "สัดส่วนของการอธิบายเชิงวิเคราะห์ทางวิชาการยังค่อนข้างน้อยเมื่อเทียบกับการบรรยายข้อความทั่วไป",
      suggestion:
        "ควรเสริมการวิเคราะห์กลไกการทำงานของจิตใจ หรือเชื่อมโยงเข้ากับกรอบทฤษฎีจิตวิเคราะห์เชิงลึกของ Archron",
    });
  }

  academicScore = Math.max(0, Math.min(20, academicScore));

  // ==========================================
  // 3. Evaluate References (เอกสารและแหล่งอ้างอิง) — Max 20 pts
  // ==========================================
  let referencesScore = 0;

  const hasCiteTags = /\[\[cite:\s*[^\]]+\]\]/i.test(bodyMarkdown);
  const hasRefHeading =
    /^##\s+.*(อ้างอิง|References|Citations|บรรณานุกรม|แหล่งข้อมูล|ตำราหลัก)/im.test(
      bodyMarkdown
    );
  const hasStandardCitations =
    /\[\^?\d+\]/.test(bodyMarkdown) ||
    /https?:\/\/[^\s)]+/.test(bodyMarkdown) ||
    /\b(ISBN|CW\s*\d+|Collected\s+Works|Sigmund\s+Freud,\s*\d+|Carl\s+Jung,\s*\d+)/i.test(
      bodyMarkdown
    );

  if (hasCiteTags || hasRefHeading || hasStandardCitations) {
    referencesScore = 20;
  } else {
    referencesScore = 0;
    if (contentType === "article" || contentType === "concept") {
      issues.push({
        id: "references-missing",
        category: "references",
        severity: "warning",
        title: "ยังไม่พบการอ้างอิงแหล่งที่มา",
        description:
          "งานเขียนประเภทบทความและแนวคิดจำเป็นต้องมีเอกสารอ้างอิงหรือแหล่งข้อมูลอ้างอิงทางวิชาการ เพื่อความน่าเชื่อถือและสามารถตรวจสอบได้ตามมาตรฐาน Archron",
        suggestion:
          "ควรเพิ่มหัวข้อ '## แหล่งอ้างอิง (References)' หรือใช้รูปแบบ [[cite: ชื่อตำรา/ผู้แต่ง]] เพื่อระบุที่มาของทฤษฎี",
      });
    } else if (wordCount >= 100) {
      issues.push({
        id: "references-general-missing",
        category: "references",
        severity: "info",
        title: "ยังไม่พบการอ้างอิงแหล่งข้อมูล",
        description:
          "การเพิ่มเอกสารอ้างอิง หนังสือตำรา หรือลิงก์ที่เกี่ยวข้อง จะช่วยเพิ่มความน่าเชื่อถือทางปัญญาและคุณค่าของเนื้อหา",
        suggestion:
          "ควรระบุตำราหลักหรือแหล่งอ้างอิงที่ใช้ในการเรียบเรียงเนื้อหานี้",
      });
    }
  }

  // ==========================================
  // 4. Evaluate Relations (การเชื่อมโยงโครงข่ายความรู้) — Max 20 pts
  // ==========================================
  let relationsScore = 0;

  if (wikilinkCount >= 3) {
    relationsScore = 20;
  } else if (wikilinkCount > 0) {
    relationsScore = 12;
    issues.push({
      id: "relations-low-wikilinks",
      category: "relations",
      severity: "info",
      title: "การเชื่อมโยงโครงข่ายความรู้ยังมีน้อย",
      description: `พบจุดเชื่อมโยง Wikilink เพียง ${wikilinkCount} จุด ในโครงข่ายความรู้ Archron`,
      suggestion:
        "ควรเชื่อมโยงแนวคิดภายในอย่างน้อย 2-3 จุดด้วย [[wikilink]] เพื่อช่วยให้ผู้อ่านสำรวจความรู้ที่เกี่ยวเนื่องได้ไม่รู้จบ",
    });
  } else {
    relationsScore = 0;
    issues.push({
      id: "relations-zero-wikilinks",
      category: "relations",
      severity: "warning",
      title: "ยังไม่มีการเชื่อมโยงโครงข่ายความรู้",
      description:
        "ไม่พบการเชื่อมโยง Wikilink [[...]] ในเนื้อหา ทำให้บทความหรือแนวคิดนี้กลายเป็นโหนดโดดเดี่ยว (Orphan Node) ในคลังความรู้",
      suggestion: "ควรเชื่อมโยงแนวคิดภายในอย่างน้อย 2-3 จุดด้วย [[wikilink]]",
    });
  }

  // ==========================================
  // 5. Evaluate Terminology (ความแม่นยำของคำศัพท์) — Max 20 pts
  // ==========================================
  let terminologyScore = 20;

  const lowercaseParenthesesMatch = bodyMarkdown.match(
    /\(\s*(ego|shadow|persona|individuation|collective\s+unconscious|anima|animus|archetype|self|complex)\s*\)/i
  );
  const lowercaseStandalones = bodyMarkdown.match(
    /(?:^|\s|\b)(ego|shadow|persona|individuation|collective\s+unconscious)(?:\s|\b|$|[.,;!?)])/g
  );

  const hasLowercaseMistake =
    (lowercaseParenthesesMatch &&
      /^[a-z]/.test(lowercaseParenthesesMatch[1])) ||
    (lowercaseStandalones &&
      lowercaseStandalones.some((s) => /^[a-z]/.test(s.trim())));

  if (hasLowercaseMistake) {
    terminologyScore = 12;
    issues.push({
      id: "terminology-capitalization-issue",
      category: "terminology",
      severity: "info",
      title: "ควรตรวจสอบอักษรตัวพิมพ์ใหญ่ของศัพท์เฉพาะทางจิตวิเคราะห์",
      description:
        "พบคำศัพท์ทางจิตวิทยาเชิงลึกที่สะกดด้วยอักษรตัวพิมพ์เล็ก (เช่น ego, shadow, persona หรือ collective unconscious) ซึ่งตามมาตรฐาน Archron ควรขึ้นต้นด้วยอักษรตัวพิมพ์ใหญ่ (Capitalization) เมื่อสื่อถึงมโนทัศน์เฉพาะทาง",
      suggestion:
        "ควรปรับการสะกดเป็น Ego, Shadow, Persona, Individuation หรือ Collective Unconscious เพื่อคงความแม่นยำทางวิชาการ",
      autoFixAction: "capitalize-key-terms",
    });
  } else {
    const academicEnglishTerms =
      /\b(Ego|Shadow|Persona|Individuation|Collective\s+Unconscious|Personal\s+Unconscious|Anima|Animus|Self|Archetype|Archetypes|Complex|Complexes|Active\s+Imagination|Synchronicity|Archron|Carl\s+Jung|Sigmund\s+Freud)\b/;
    const academicThaiTerms =
      /(จิตวิเคราะห์|จิตไร้สำนึก|จิตสำนึก|ตัวตน|เงา|หน้ากาก|กระบวนการกลายเป็นตัวตนแท้|แม่พิมพ์ต้นแบบ|ปมทางจิต|การจินตนาการเชิงรุก|ความพ้องจังหวะ)/;

    const hasAcademicTerms =
      academicEnglishTerms.test(bodyMarkdown) ||
      academicThaiTerms.test(bodyMarkdown) ||
      bodyMarkdown.includes("จิต") ||
      bodyMarkdown.includes("ปรัชญา");

    if (!hasAcademicTerms && wordCount < 200) {
      terminologyScore = 14;
      issues.push({
        id: "terminology-missing-key-terms",
        category: "terminology",
        severity: "info",
        title: "แนะนำให้ระบุคำศัพท์เฉพาะทางจิตวิเคราะห์หรือจิตวิทยาเชิงลึก",
        description:
          "ในเนื้อหายังไม่ปรากฏคำศัพท์หลัก (Key Terms) ทางจิตวิทยาเชิงลึกหรือจิตวิเคราะห์ เช่น Ego, Shadow, Persona, Individuation หรือ Collective Unconscious",
        suggestion:
          "ควรระบุคำศัพท์สำคัญทางวิชาการพร้อมวงเล็บภาษาอังกฤษตัวพิมพ์ใหญ่ (เช่น ตัวตนเงา (Shadow) หรือ หน้ากาก (Persona)) เพื่อเพิ่มความชัดเจนและแม่นยำทางวิชาการ",
      });
    }
  }

  terminologyScore = Math.max(0, Math.min(20, terminologyScore));

  // ==========================================
  // Calculate Total & Sort Issues
  // ==========================================
  const totalScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        structureScore +
          academicScore +
          referencesScore +
          relationsScore +
          terminologyScore
      )
    )
  );

  let status: KnowledgeHealthReport["status"] = "critical";
  if (totalScore >= 85) {
    status = "excellent";
  } else if (totalScore >= 70) {
    status = "good";
  } else if (totalScore >= 50) {
    status = "needs_work";
  } else {
    status = "critical";
  }

  const severityOrder: Record<HealthIssueSeverity, number> = {
    critical: 0,
    warning: 1,
    info: 2,
  };
  issues.sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  const categories: Record<HealthCategory, CategoryScore> = {
    structure: {
      category: "structure",
      score: structureScore,
      maxScore: 20,
      labelTh: HEALTH_CATEGORY_LABELS.structure,
    },
    academic: {
      category: "academic",
      score: academicScore,
      maxScore: 20,
      labelTh: HEALTH_CATEGORY_LABELS.academic,
    },
    references: {
      category: "references",
      score: referencesScore,
      maxScore: 20,
      labelTh: HEALTH_CATEGORY_LABELS.references,
    },
    relations: {
      category: "relations",
      score: relationsScore,
      maxScore: 20,
      labelTh: HEALTH_CATEGORY_LABELS.relations,
    },
    terminology: {
      category: "terminology",
      score: terminologyScore,
      maxScore: 20,
      labelTh: HEALTH_CATEGORY_LABELS.terminology,
    },
  };

  return {
    totalScore,
    status,
    categories,
    issues,
  };
}
