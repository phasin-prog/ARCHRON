// lib/content/taxonomy.ts — ARCHRON Phase 15: Taxonomy System
// ระบบสารบบและอนุกรมวิธานความรู้ เชื่อมโยงศาสตร์ (Disciplines), จักรวาลวิทยา (Cosmology) และแกนเรื่อง (Themes)

import type { ContentEntry } from "@/types/content";
import { DISCIPLINES } from "@/lib/content/disciplines";
import type { DisciplineKey } from "@/components/discipline-meta";
import { THEMES } from "@/lib/content/themes";
import { COSMOLOGY_KEYS, type CosmologyKey } from "@/lib/content/cosmology";

export type TaxonomyCluster = {
  key: string;
  label: string;
  description: string;
  entrySlugs: string[];
};

export type TaxonomyRegistry = {
  disciplines: Record<string, TaxonomyCluster>;
  themes: Record<string, TaxonomyCluster>;
  cosmologies: Record<string, TaxonomyCluster>;
};

// สกัดอนุกรมวิธานและจัดกลุ่ม entries ทั้งหมด
export function buildTaxonomyRegistry(entries: ContentEntry[]): TaxonomyRegistry {
  const publishedEntries = entries.filter((e) => e.status === "published");

  const discClusters: Record<string, TaxonomyCluster> = {};
  for (const disc of DISCIPLINES) {
    discClusters[disc.key] = {
      key: disc.key,
      label: disc.en,
      description: disc.desc,
      entrySlugs: publishedEntries
        .filter((e) => e.framework?.toLowerCase().includes(disc.key) || e.tags?.includes(disc.key))
        .map((e) => e.slug),
    };
  }

  const themeClusters: Record<string, TaxonomyCluster> = {};
  for (const t of THEMES) {
    themeClusters[t.key] = {
      key: t.key,
      label: t.label,
      description: t.description,
      entrySlugs: publishedEntries
        .filter((e) => e.tags?.some((tag) => t.aliases.includes(tag.toLowerCase())))
        .map((e) => e.slug),
    };
  }

  const cosmologyClusters: Record<string, TaxonomyCluster> = {};
  for (const [key, meta] of Object.entries(COSMOLOGY_KEYS)) {
    cosmologyClusters[key] = {
      key,
      label: meta.label,
      description: `Cosmology domain: ${meta.label}`,
      entrySlugs: publishedEntries.map((e) => e.slug),
    };
  }

  return {
    disciplines: discClusters,
    themes: themeClusters,
    cosmologies: cosmologyClusters,
  };
}
