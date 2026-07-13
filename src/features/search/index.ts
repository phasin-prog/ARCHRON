import { conceptRegistry } from "@/lib/content/core/registry";
import { EXTERNAL_CATEGORIES } from "@/lib/content/utils/external-links";
import { NODE_TYPE_LABEL } from "@/lib/content/reading/graph";
import type { ContentEntry } from "@/types/content";
import type { SearchItem, SearchType } from "./types";
import { normalizeText } from "./tokenizer";

const SECTIONS: { title: string; href: string; description: string }[] = [
  { title: "บทความ", href: "/articles", description: "งานอ่านที่อธิบายและตีความแนวคิด" },
  { title: "คลังแนวคิด", href: "/concepts", description: "ระบบความรู้แบบเชื่อมโยง (Wiki)" },
  { title: "แผนที่ความสัมพันธ์", href: "/constellation", description: "กราฟความสัมพันธ์ระหว่างแนวคิด" },
  { title: "สำนักคิดและนักปราชญ์", href: "/schools", description: "ไดเรกทอรีสำนักคิด นักปราชญ์ และผลงานเด่น" },
  { title: "เส้นทางการอ่าน / ซีรีส์", href: "/reading-sets", description: "ลำดับการอ่านจากพื้นฐานสู่ความลึก" },
  { title: "แหล่งอ้างอิง", href: "/sources", description: "ฐานความรู้และการอ้างอิงภายใน" },
  { title: "ทรัพยากรและลิงก์ภายนอก", href: "/external-links", description: "ลิงก์ งานวิจัย และคลังข้อมูลภายนอก" },
  { title: "Manifesto", href: "/manifesto", description: "จุดยืนและแนวทางของโครงการ" },
  { title: "คำถามที่พบบ่อย", href: "/faq", description: "คำถามที่พบบ่อยเกี่ยวกับโครงการ วิธีอ่าน ระดับเนื้อหา และการอ้างอิง" },
  { title: "สนับสนุนโครงการ", href: "/support", description: "ช่องทางสนับสนุน ARCHRON" },
];

function buildKeywords(parts: (string | undefined | null)[]): string {
  return normalizeText(parts.filter(Boolean).join(" "));
}

export function buildStaticIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const c of conceptRegistry) {
    items.push({
      id: `concept:${c.slug}`,
      type: "concept" as SearchType,
      title: c.title,
      thaiTitle: c.thaiTitle,
      description: c.description,
      href: `/concepts/${c.slug}`,
      badge: NODE_TYPE_LABEL[c.nodeType],
      keywords: buildKeywords([c.title, c.thaiTitle, ...c.aliases, c.description, c.framework, c.slug]),
    });
  }

  for (const cat of EXTERNAL_CATEGORIES) {
    for (const r of cat.items) {
      items.push({
        id: `resource:${r.url}`,
        type: "resource" as SearchType,
        title: r.title,
        description: r.description,
        href: r.url,
        external: true,
        badge: cat.thaiLabel,
        keywords: buildKeywords([r.title, r.description, ...r.tags, cat.thaiLabel, cat.enLabel]),
      });
    }
  }

  for (const s of SECTIONS) {
    items.push({
      id: `section:${s.href}`,
      type: "section" as SearchType,
      title: s.title,
      description: s.description,
      href: s.href,
      keywords: buildKeywords([s.title, s.description, s.href]),
    });
  }

  return items;
}

export function buildSearchIndex(entries: ContentEntry[]): SearchItem[] {
  const items: SearchItem[] = [];

  for (const c of conceptRegistry) {
    items.push({
      id: `concept:${c.slug}`,
      type: "concept" as SearchType,
      title: c.title,
      thaiTitle: c.thaiTitle,
      description: c.description,
      href: `/concepts/${c.slug}`,
      badge: NODE_TYPE_LABEL[c.nodeType],
      keywords: buildKeywords([c.title, c.thaiTitle, ...c.aliases, c.description, c.framework, c.slug]),
    });
  }

  for (const e of entries) {
    items.push({
      id: `article:${e.slug}`,
      type: "article" as SearchType,
      title: e.mainTerm ?? e.title,
      thaiTitle: e.thaiName,
      description: e.shortDescription,
      href: `/articles/${e.slug}`,
      badge: e.framework,
      keywords: buildKeywords([
        e.title,
        e.mainTerm,
        e.thaiName,
        e.shortDescription,
        e.framework,
        ...(e.mainThinkers ?? []),
        ...(e.tags ?? []),
        e.slug,
      ]),
    });
  }

  for (const cat of EXTERNAL_CATEGORIES) {
    for (const r of cat.items) {
      items.push({
        id: `resource:${r.url}`,
        type: "resource" as SearchType,
        title: r.title,
        description: r.description,
        href: r.url,
        external: true,
        badge: cat.thaiLabel,
        keywords: buildKeywords([r.title, r.description, ...r.tags, cat.thaiLabel, cat.enLabel]),
      });
    }
  }

  for (const s of SECTIONS) {
    items.push({
      id: `section:${s.href}`,
      type: "section" as SearchType,
      title: s.title,
      description: s.description,
      href: s.href,
      keywords: buildKeywords([s.title, s.description, s.href]),
    });
  }

  return items;
}
