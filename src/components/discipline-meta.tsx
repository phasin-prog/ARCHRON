// ARCHRON — Discipline Meta
// แม็ปศาสตร์ → ไอคอนประจำศาสตร์ (ICON LANGUAGE) + สีประจำหมวดตาม cosmology + ป้ายไทย
// ใช้ร่วมได้ทั้ง client/server (ไม่มี hook) — เป็นแหล่งกลางของ "ภาษาไอคอน" ทั้งเว็บ

import type { ComponentType } from "react";
import {
  PsychologyIcon,
  PhilosophyIcon,
  AnthropologyIcon,
  HistoryIcon,
  LanguageIcon,
  MythologyIcon,
  ReligionIcon,
  ScienceIcon,
  SymbolismIcon,
  ArtIcon,
  AIFutureIcon,
  CivilizationIcon,
} from "@/components/icons";

export type DisciplineKey =
  | "psychology"
  | "philosophy"
  | "anthropology"
  | "history"
  | "language"
  | "mythology"
  | "religion"
  | "science"
  | "symbol"
  | "art"
  | "ai-future"
  | "civilization";

export type DisciplineMeta = {
  Icon: ComponentType<{ className?: string }>;
  accent: string;
  label: string;
};

export const DISCIPLINE_META: Record<DisciplineKey, DisciplineMeta> = {
  psychology: { Icon: PsychologyIcon, accent: "var(--color-concept)", label: "จิตวิทยา" },
  philosophy: { Icon: PhilosophyIcon, accent: "var(--color-premium)", label: "ปรัชญา" },
  anthropology: { Icon: AnthropologyIcon, accent: "var(--color-quote)", label: "มานุษยวิทยา" },
  history: { Icon: HistoryIcon, accent: "var(--color-timeline)", label: "ประวัติศาสตร์" },
  language: { Icon: LanguageIcon, accent: "var(--color-quote)", label: "ภาษาและการตีความ" },
  mythology: { Icon: MythologyIcon, accent: "var(--color-timeline)", label: "ตำนาน" },
  religion: { Icon: ReligionIcon, accent: "var(--color-premium)", label: "ศาสนา" },
  science: { Icon: ScienceIcon, accent: "var(--color-thinker)", label: "วิทยาศาสตร์" },
  symbol: { Icon: SymbolismIcon, accent: "var(--color-symbol)", label: "สัญลักษณ์" },
  art: { Icon: ArtIcon, accent: "var(--color-book)", label: "ศิลปะ" },
  "ai-future": { Icon: AIFutureIcon, accent: "var(--color-info)", label: "ปัญญาประดิษฐ์และอนาคต" },
  civilization: { Icon: CivilizationIcon, accent: "var(--color-timeline)", label: "อารยธรรม" },
};

// ดีฟอลต์เมื่อไม่ระบุศาสตร์ — โทน Mercurius (สำนักคิด)
export const DEFAULT_DISCIPLINE: DisciplineMeta = {
  Icon: PhilosophyIcon,
  accent: "var(--color-quote)",
  label: "สำนักคิด",
};

export function disciplineMeta(key: DisciplineKey | undefined | null): DisciplineMeta {
  return (key && DISCIPLINE_META[key]) || DEFAULT_DISCIPLINE;
}
