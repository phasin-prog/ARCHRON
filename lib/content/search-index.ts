// lib/content/search-index.ts — สร้าง index ค้นหากลาง (server-safe)
// รวม: แนวคิด (concept-registry) + บทความ (published entries) + ทรัพยากรภายนอก + หน้า/section
import { conceptRegistry } from "@/lib/content/concept-registry";
import { EXTERNAL_CATEGORIES } from "@/lib/content/external-links";
import { NODE_TYPE_LABEL } from "@/lib/content/graph";
import type { ContentEntry } from "@/types/content";

export type SearchType = "concept" | "article" | "resource" | "section";

export type SearchItem = {
  id: string;
  type: SearchType;
  title: string;
  thaiTitle?: string;
  description?: string;
  href: string;
  external?: boolean;
  badge?: string;
  keywords: string; // haystack (lowercase)
};

export const SEARCH_TYPE_LABEL: Record<SearchType, string> = {
  concept: "คลังแนวคิด",
  article: "บทความ",
  resource: "ทรัพยากรภายนอก",
  section: "หน้า",
};

export const SEARCH_TYPE_ORDER: SearchType[] = ["concept", "article", "resource", "section"];

const SECTIONS: { title: string; href: string; description: string }[] = [
  { title: "บทความ", href: "/articles", description: "งานอ่านที่อธิบายและตีความแนวคิด" },
  { title: "คลังแนวคิด", href: "/concepts", description: "ระบบความรู้แบบเชื่อมโยง (Wiki)" },
  { title: "แผนที่ความสัมพันธ์", href: "/constellation", description: "กราฟความสัมพันธ์ระหว่างแนวคิด" },
  { title: "เส้นทางการอ่าน / ซีรีส์", href: "/reading-sets", description: "ลำดับการอ่านจากพื้นฐานสู่ความลึก" },
  { title: "แหล่งอ้างอิง", href: "/sources", description: "ฐานความรู้และการอ้างอิงภายใน" },
  { title: "ทรัพยากรและลิงก์ภายนอก", href: "/external-links", description: "ลิงก์ งานวิจัย และคลังข้อมูลภายนอก" },
  { title: "Manifesto", href: "/manifesto", description: "จุดยืนและแนวทางของโครงการ" },
  { title: "สนับสนุนโครงการ", href: "/support", description: "ช่องทางสนับสนุน The Soul's Compass" },
];

const lc = (parts: (string | undefined | null)[]) =>
  parts.filter(Boolean).join(" ").toLowerCase();

export function buildSearchIndex(entries: ContentEntry[]): SearchItem[] {
  const items: SearchItem[] = [];

  // แนวคิด (concept-registry — รวม person/book/school/symbol/term)
  for (const c of conceptRegistry) {
    items.push({
      id: `concept:${c.slug}`,
      type: "concept",
      title: c.title,
      thaiTitle: c.thaiTitle,
      description: c.description,
      href: `/concepts/${c.slug}`,
      badge: NODE_TYPE_LABEL[c.nodeType],
      keywords: lc([c.title, c.thaiTitle, ...c.aliases, c.description, c.framework, c.slug]),
    });
  }

  // บทความ (published entries)
  for (const e of entries) {
    items.push({
      id: `article:${e.slug}`,
      type: "article",
      title: e.mainTerm ?? e.title,
      thaiTitle: e.thaiName,
      description: e.shortDescription,
      href: `/articles/${e.slug}`,
      badge: e.framework,
      keywords: lc([
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

  // ทรัพยากรภายนอก
  for (const cat of EXTERNAL_CATEGORIES) {
    for (const r of cat.items) {
      items.push({
        id: `resource:${r.url}`,
        type: "resource",
        title: r.title,
        description: r.description,
        href: r.url,
        external: true,
        badge: cat.thaiLabel,
        keywords: lc([r.title, r.description, ...r.tags, cat.thaiLabel, cat.enLabel]),
      });
    }
  }

  // หน้า / section
  for (const s of SECTIONS) {
    items.push({
      id: `section:${s.href}`,
      type: "section",
      title: s.title,
      description: s.description,
      href: s.href,
      keywords: lc([s.title, s.description, s.href]),
    });
  }

  return items;
}
