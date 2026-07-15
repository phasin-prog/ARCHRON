// src/lib/content/studio/semantic-parser.ts
// ARCHRON Studio v2 — Semantic MDX Parser
// Real-time semantic parser that extracts structural AST metadata from raw MDX (with optional YAML frontmatter).
// MDX is Single Source of Truth in ARCHRON Studio v2.

import { conceptRegistry, resolveConcept } from "@/lib/content/core/registry";

export interface HeadingNode {
  id: string;
  text: string;
  level: number;
}

export interface WikilinkNode {
  target: string;
  label: string;
  isCitation: boolean;
  citationIds?: string[];
}

export interface FrameworkMatch {
  framework: string;
  confidence: number;
}

export interface ParsedMdxAnalysis {
  frontmatter: Record<string, any>;
  headings: HeadingNode[];
  wikilinks: WikilinkNode[];
  internalConceptSlugs: string[];
  citationNumbers: string[];
  wordCount: number;
  readingTimeMinutes: number;
  difficultyEstimate: "beginner" | "intermediate" | "advanced" | "source-note";
  detectedFrameworks: FrameworkMatch[];
  suggestedTags: string[];
  entityMentions: string[];
}

const punctuationRegex = /[^\p{L}\p{N}\s-]/gu;

/**
 * Generate a clean slug id for a heading string, preserving Unicode letters (including Thai),
 * numbers, and hyphens. Compatible with `rehype-slug` / `github-slugger`.
 */
export function slugifyHeading(text: string): string {
  const clean = text
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, "$2$1")
    .replace(/[`*~_]/g, "")
    .trim()
    .toLowerCase();

  return clean
    .replace(punctuationRegex, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

class HeadingSlugger {
  private occurrences = new Map<string, number>();

  slug(text: string): string {
    let base = slugifyHeading(text);
    if (!base) {
      base = "heading";
    }
    const count = this.occurrences.get(base) || 0;
    this.occurrences.set(base, count + 1);
    if (count === 0) {
      return base;
    }
    return `${base}-${count}`;
  }
}

function parseYamlValue(val: string): unknown {
  const trimmed = val.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (trimmed !== "" && !trimmed.startsWith("0x") && !isNaN(Number(trimmed)) && !isNaN(parseFloat(trimmed))) {
    return Number(trimmed);
  }
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((item) => parseYamlValue(item.trim()));
  }
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseYamlFrontmatter(yamlString: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = yamlString.split(/\r?\n/);
  let currentKey: string | null = null;
  let currentArray: unknown[] | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const itemMatch = line.match(/^\s+-\s+(.*)$/);
    if (currentKey && itemMatch) {
      if (!currentArray) {
        currentArray = [];
        result[currentKey] = currentArray;
      }
      currentArray.push(parseYamlValue(itemMatch[1]));
      continue;
    }

    const kvMatch = line.match(/^([a-zA-Z0-9_-]+)\s*:\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      const rawVal = kvMatch[2].trim();
      currentKey = key;
      if (!rawVal) {
        currentArray = [];
        result[key] = currentArray;
      } else {
        currentArray = null;
        result[key] = parseYamlValue(rawVal);
      }
    }
  }

  return result;
}

/**
 * Parse MDX content in real time to extract semantic AST metadata.
 */
export function parseMdxSemantic(rawMdx: string): ParsedMdxAnalysis {
  let bodyText = rawMdx;
  let frontmatter: Record<string, any> = {};

  const fmMatch = rawMdx.match(/^---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (fmMatch) {
    frontmatter = parseYamlFrontmatter(fmMatch[1]);
    bodyText = rawMdx.slice(fmMatch[0].length);
  }

  // 1. Headings
  const headings: HeadingNode[] = [];
  const slugger = new HeadingSlugger();
  const lines = bodyText.split(/\r?\n/);
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = slugger.slug(text);
      headings.push({ id, text, level });
    }
  }

  // 2. Wikilinks & Citations
  const wikilinks: WikilinkNode[] = [];
  const internalConceptSlugsSet = new Set<string>();
  const citationNumbersSet = new Set<string>();
  const entityMentionsSet = new Set<string>();

  const wikilinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  let linkMatch: RegExpExecArray | null;

  while ((linkMatch = wikilinkRegex.exec(bodyText)) !== null) {
    const rawTarget = linkMatch[1].trim();
    const rawLabel = (linkMatch[2] ?? "").trim() || rawTarget;

    if (/^cite:/i.test(rawTarget)) {
      const citationString = rawTarget.replace(/^cite:\s*/i, "").trim();
      const ids = citationString
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

      for (const id of ids) {
        citationNumbersSet.add(id);
      }

      wikilinks.push({
        target: rawTarget,
        label: rawLabel,
        isCitation: true,
        citationIds: ids,
      });
    } else {
      wikilinks.push({
        target: rawTarget,
        label: rawLabel,
        isCitation: false,
      });

      const resolved = resolveConcept(rawTarget);
      if (resolved) {
        internalConceptSlugsSet.add(resolved.slug);
        entityMentionsSet.add(resolved.title);
      } else {
        const fallbackSlug = slugifyHeading(rawTarget);
        if (fallbackSlug) {
          internalConceptSlugsSet.add(fallbackSlug);
        }
        entityMentionsSet.add(rawTarget);
      }
    }
  }

  // 3. Word Count & Reading Time
  const thaiCharCount = (bodyText.match(/[\u0E00-\u0E7F]/g) || []).length;
  const nonThaiText = bodyText
    .replace(/[\u0E00-\u0E7F]+/g, " ")
    .replace(/[*`_~#[\]()\-+=|<>?!@#$%^&/\\.,:;]/g, " ")
    .trim();
  const englishWordCount = nonThaiText
    ? nonThaiText.split(/\s+/).filter((w) => /\w/.test(w)).length
    : 0;

  const approxThaiWords = Math.round(thaiCharCount / 5);
  const wordCount = approxThaiWords + englishWordCount;

  let readingTimeMinutes = 0;
  if (wordCount > 0 || thaiCharCount > 0) {
    const timeFromThai = thaiCharCount / 500;
    const timeFromEnglish = englishWordCount / 200;
    readingTimeMinutes = Math.max(1, Math.ceil(timeFromThai + timeFromEnglish));
  }

  // 4. Difficulty Estimation
  const advancedKeywords = [
    "individuation",
    "archetype",
    "collective unconscious",
    "phenomenology",
    "hermeneutics",
    "กระบวนการปัจเจกภาพ",
    "แม่แบบ",
    "จิตไร้สำนึกร่วม",
    "ปรากฏการณ์วิทยา",
    "ศาสตร์แห่งการตีความ",
  ];

  const lowerBody = bodyText.toLowerCase();
  let advancedKeywordOccurrences = 0;
  for (const kw of advancedKeywords) {
    const regex = new RegExp(`(?:\\b|(?<=[\\s\\u0E00-\\u0E7F]))${kw}(?:\\b|(?=[\\s\\u0E00-\\u0E7F]))`, "gi");
    const matches = lowerBody.match(regex);
    if (matches) {
      advancedKeywordOccurrences += matches.length;
    }
  }

  const isSourceNote =
    frontmatter.difficulty === "source-note" ||
    frontmatter.contentType === "source-note" ||
    frontmatter.type === "source-note" ||
    (Array.isArray(frontmatter.tags) && frontmatter.tags.includes("source-note")) ||
    lowerBody.includes("source-note");

  let difficultyEstimate: "beginner" | "intermediate" | "advanced" | "source-note" = "beginner";

  if (isSourceNote && frontmatter.difficulty === "source-note") {
    difficultyEstimate = "source-note";
  } else if (isSourceNote || citationNumbersSet.size > 5 || advancedKeywordOccurrences > 3) {
    difficultyEstimate = "advanced";
  } else {
    const intermediateKeywords = [
      "ego", "shadow", "persona", "unconscious", "complex", "projection",
      "symbol", "myth", "philosophy", "psychoanalysis", "anima", "animus",
      "อัตตา", "เงา", "เพอร์โซนา", "ปม", "การฉายภาพ", "สัญลักษณ์", "ตำนาน", "ปรัชญา",
    ];
    let intermediateOccurrences = 0;
    for (const kw of intermediateKeywords) {
      if (lowerBody.includes(kw)) {
        intermediateOccurrences++;
      }
    }
    if (intermediateOccurrences >= 3 || wordCount > 600 || headings.length > 3) {
      difficultyEstimate = "intermediate";
    } else {
      difficultyEstimate = "beginner";
    }
  }

  // 5. Framework Detection
  const KNOWN_FRAMEWORKS: Array<{ name: string; patterns: RegExp[] }> = [
    {
      name: "Analytical Psychology",
      patterns: [
        /\banalytical psychology\b/i,
        /\bjung(?:ian)?\b/i,
        /\barchetype(?:s)?\b/i,
        /\bcollective unconscious\b/i,
        /\bindividuation\b/i,
        /\banima\b/i,
        /\banimus\b/i,
        /จิตวิทยาวิเคราะห์/,
        /คาร์ล ยุง/,
        /กระบวนการปัจเจกภาพ/,
      ],
    },
    {
      name: "Depth Psychology",
      patterns: [
        /\bdepth psychology\b/i,
        /\bunconscious\b/i,
        /\bsubconscious\b/i,
        /\bpsyche\b/i,
        /\bdream(?:s)?\b/i,
        /จิตวิทยาเชิงลึก/,
        /จิตไร้สำนึก/,
        /จิตใต้สำนึก/,
        /ความฝัน/,
      ],
    },
    {
      name: "Psychoanalysis",
      patterns: [
        /\bpsychoanalysis\b/i,
        /\bfreud(?:ian)?\b/i,
        /\blacan(?:ian)?\b/i,
        /\bid\b/i,
        /\bego\b/i,
        /\bsuperego\b/i,
        /\blibido\b/i,
        /\brepression\b/i,
        /จิตวิเคราะห์/,
        /ซิกมันด์ ฟรอยด์/,
        /ฟรอยด์/,
        /ลากอง/,
      ],
    },
    {
      name: "Philosophy",
      patterns: [
        /\bphilosophy\b/i,
        /\bphilosophical\b/i,
        /\bepistemology\b/i,
        /\bmetaphysics\b/i,
        /\bethics\b/i,
        /\bontology\b/i,
        /\bnietzsche\b/i,
        /\bplato\b/i,
        /\baristotle\b/i,
        /ปรัชญา/,
        /ญาณวิทยา/,
        /อภิปรัชญา/,
        /จริยศาสตร์/,
      ],
    },
    {
      name: "Existentialism",
      patterns: [
        /\bexistentialism\b/i,
        /\bexistential\b/i,
        /\bsartre\b/i,
        /\bcamus\b/i,
        /\bkierkegaard\b/i,
        /\bheidegger\b/i,
        /\babsurd(?:ism)?\b/i,
        /\bfreedom\b/i,
        /\bauthenticity\b/i,
        /อัตถิภาวนิยม/,
        /อับเซิร์ด/,
        /ซาร์ตร์/,
        /กามูส์/,
        /ความหมายชีวิต/,
      ],
    },
    {
      name: "Phenomenology",
      patterns: [
        /\bphenomenology\b/i,
        /\bphenomenological\b/i,
        /\bhusserl\b/i,
        /\bintentionality\b/i,
        /\blived experience\b/i,
        /ปรากฏการณ์วิทยา/,
        /ฮุสเซิร์ล/,
        /ประสบการณ์ตรง/,
      ],
    },
    {
      name: "Symbol / Myth",
      patterns: [
        /\bsymbol(?:s|ism)?\b/i,
        /\bmyth(?:s|ology)?\b/i,
        /\bcampbell\b/i,
        /\bhero'?s journey\b/i,
        /\bmotif(?:s)?\b/i,
        /\ballegory\b/i,
        /\bfolklore\b/i,
        /สัญลักษณ์/,
        /ตำนาน/,
        /เทพปกรณัม/,
        /โจเซฟ แคมป์เบลล์/,
      ],
    },
    {
      name: "Comparative Thought",
      patterns: [
        /\bcomparative(?: thought)?\b/i,
        /\beast and west\b/i,
        /\bbuddhism\b/i,
        /\btaoism\b/i,
        /\bzen\b/i,
        /\beastern philosophy\b/i,
        /\bsyncretism\b/i,
        /เปรียบเทียบ/,
        /ตะวันออกและตะวันตก/,
        /พุทธปรัชญา/,
        /เต๋า/,
      ],
    },
  ];

  const fullTextForMatching = `${frontmatter.title || ""} ${frontmatter.framework || ""} ${Array.isArray(frontmatter.tags) ? frontmatter.tags.join(" ") : ""} ${bodyText}`;

  const detectedFrameworks: FrameworkMatch[] = [];
  for (const fw of KNOWN_FRAMEWORKS) {
    let occurrences = 0;
    for (const pattern of fw.patterns) {
      const matches = fullTextForMatching.match(pattern);
      if (matches) {
        occurrences += matches.length;
      }
    }

    if (typeof frontmatter.framework === "string" && frontmatter.framework.toLowerCase() === fw.name.toLowerCase()) {
      occurrences = Math.max(occurrences, 5);
    }

    if (occurrences > 0) {
      const confidence = Math.min(100, occurrences * 20 + 10);
      detectedFrameworks.push({ framework: fw.name, confidence });
    }
  }

  detectedFrameworks.sort((a, b) => b.confidence - a.confidence);

  // 6. Suggested Tags
  const CORE_TERMS: Array<{ tag: string; patterns: RegExp[] }> = [
    { tag: "jung", patterns: [/\bjung(?:ian)?\b/i, /ยุง/, /คาร์ล ยุง/] },
    { tag: "freud", patterns: [/\bfreud(?:ian)?\b/i, /ฟรอยด์/, /ซิกมันด์ ฟรอยด์/] },
    { tag: "ego", patterns: [/\bego\b/i, /อีโก้/, /อัตตา/] },
    { tag: "shadow", patterns: [/\bshadow(?:s)?\b/i, /เงา/, /เงามืด/] },
    { tag: "persona", patterns: [/\bpersona\b/i, /เพอร์โซนา/, /หน้ากากทางสังคม/] },
    { tag: "self", patterns: [/\bself\b/i, /เซลฟ์/, /ตัวตนที่แท้จริง/] },
    { tag: "archetype", patterns: [/\barchetype(?:s)?\b/i, /แม่แบบ/, /อาร์คีไทป์/] },
    { tag: "unconscious", patterns: [/\b(?:un|sub)conscious\b/i, /จิตไร้สำนึก/, /จิตใต้สำนึก/] },
    { tag: "complex", patterns: [/\bcomplex(?:es)?\b/i, /ปมในใจ/, /ปมทางจิต/] },
    { tag: "projection", patterns: [/\bprojection\b/i, /การฉายภาพ/] },
    { tag: "symbol", patterns: [/\bsymbol(?:s|ism)?\b/i, /สัญลักษณ์/] },
    { tag: "myth", patterns: [/\bmyth(?:s|ology)?\b/i, /ตำนาน/, /เทพปกรณัม/] },
    { tag: "philosophy", patterns: [/\bphilosophy\b/i, /\bphilosophical\b/i, /ปรัชญา/] },
    { tag: "individuation", patterns: [/\bindividuation\b/i, /กระบวนการปัจเจกภาพ/] },
    { tag: "anima", patterns: [/\banima\b/i, /แอนิมา/] },
    { tag: "animus", patterns: [/\banimus\b/i, /แอนิมัส/] },
    { tag: "psychoanalysis", patterns: [/\bpsychoanalysis\b/i, /จิตวิเคราะห์/] },
    { tag: "depth-psychology", patterns: [/\bdepth psychology\b/i, /จิตวิทยาเชิงลึก/] },
  ];

  const suggestedTagsSet = new Set<string>();
  if (Array.isArray(frontmatter.tags)) {
    for (const t of frontmatter.tags) {
      if (typeof t === "string" && t.trim()) {
        suggestedTagsSet.add(t.trim().toLowerCase());
      }
    }
  }

  for (const term of CORE_TERMS) {
    for (const pattern of term.patterns) {
      if (pattern.test(fullTextForMatching)) {
        suggestedTagsSet.add(term.tag);
        break;
      }
    }
  }

  // 7. Enrich Entity Mentions via conceptRegistry
  const fullTextLower = fullTextForMatching.toLowerCase();
  for (const item of conceptRegistry) {
    if (item.title.length >= 3 && fullTextLower.includes(item.title.toLowerCase())) {
      entityMentionsSet.add(item.title);
    } else if (item.thaiTitle && item.thaiTitle.length >= 3 && fullTextForMatching.includes(item.thaiTitle)) {
      entityMentionsSet.add(item.title);
    }
  }

  return {
    frontmatter,
    headings,
    wikilinks,
    internalConceptSlugs: Array.from(internalConceptSlugsSet),
    citationNumbers: Array.from(citationNumbersSet),
    wordCount,
    readingTimeMinutes,
    difficultyEstimate,
    detectedFrameworks,
    suggestedTags: Array.from(suggestedTagsSet),
    entityMentions: Array.from(entityMentionsSet),
  };
}
