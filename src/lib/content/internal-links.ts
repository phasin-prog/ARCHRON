import { conceptRegistry, resolveConcept } from "./concept-registry";

// Phase 10 — Internal link suggestion + Obsidian-like [[ ]] parsing

export type LinkSuggestion = {
  term: string;
  slug: string;
  title: string;
  nodeType: string;
};

// สแกนข้อความ เทียบกับ title/thaiTitle/alias ใน registry แล้วเสนอ link (ไม่ auto-insert)
export function findLinkSuggestions(text: string): LinkSuggestion[] {
  const found: LinkSuggestion[] = [];
  const seen = new Set<string>();
  const lower = text.toLowerCase();

  for (const item of conceptRegistry) {
    const terms = [item.title, item.thaiTitle, ...item.aliases].filter(
      (t): t is string => Boolean(t),
    );
    for (const term of terms) {
      if (term.length < 2) continue;
      if (lower.includes(term.toLowerCase())) {
        if (!seen.has(item.slug)) {
          found.push({
            term,
            slug: item.slug,
            title: item.title,
            nodeType: item.nodeType,
          });
          seen.add(item.slug);
        }
        break;
      }
    }
  }
  return found.slice(0, 8);
}

export type LinkToken =
  | { type: "text"; value: string }
  | { type: "link"; slug: string; label: string; dead: boolean };

const LINK_RE = /\[\[([^\]]+)\]\]/g;

// แปลงข้อความที่มี [[Shadow]] / [[Carl Jung|ยุง]] เป็น token สำหรับ render
export function parseInternalLinks(text: string): LinkToken[] {
  const tokens: LinkToken[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;

  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) {
      tokens.push({ type: "text", value: text.slice(last, m.index) });
    }
    const parts = m[1].split("|");
    const target = parts[0].trim();
    const label = (parts[1] ?? "").trim();
    const node = resolveConcept(target);
    tokens.push({
      type: "link",
      slug: node ? node.slug : target,
      label: label !== "" ? label : node ? node.title : target,
      dead: !node,
    });
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    tokens.push({ type: "text", value: text.slice(last) });
  }
  return tokens;
}

// คืนรายชื่อ target ที่หา node ปลายทางไม่เจอ (dead links)
export function findDeadLinks(text: string): string[] {
  const dead: string[] = [];
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    const target = m[1].split("|")[0].trim();
    if (!resolveConcept(target)) dead.push(target);
  }
  return dead;
}
