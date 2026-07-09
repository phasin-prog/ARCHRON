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
  psychology: { Icon: PsychologyIcon, accent: "#7BA3D4", label: "จิตวิทยา" },
  philosophy: { Icon: PhilosophyIcon, accent: "#C49B55", label: "ปรัชญา" },
  anthropology: { Icon: AnthropologyIcon, accent: "#9ABA9A", label: "มานุษยวิทยา" },
  history: { Icon: HistoryIcon, accent: "#8A9AAA", label: "ประวัติศาสตร์" },
  language: { Icon: LanguageIcon, accent: "#9ABA9A", label: "ภาษาและการตีความ" },
  mythology: { Icon: MythologyIcon, accent: "#8A9AAA", label: "ตำนาน" },
  religion: { Icon: ReligionIcon, accent: "#C49B55", label: "ศาสนา" },
  science: { Icon: ScienceIcon, accent: "#7AB57A", label: "วิทยาศาสตร์" },
  symbol: { Icon: SymbolismIcon, accent: "#D4B050", label: "สัญลักษณ์" },
  art: { Icon: ArtIcon, accent: "#D4A96A", label: "ศิลปะ" },
  "ai-future": { Icon: AIFutureIcon, accent: "#7A8ABA", label: "ปัญญาประดิษฐ์และอนาคต" },
  civilization: { Icon: CivilizationIcon, accent: "#8A9AAA", label: "อารยธรรม" },
};

// ดีฟอลต์เมื่อไม่ระบุศาสตร์ — โทน Mercurius (สำนักคิด)
export const DEFAULT_DISCIPLINE: DisciplineMeta = {
  Icon: PhilosophyIcon,
  accent: "#9ABA9A",
  label: "สำนักคิด",
};

export function disciplineMeta(key: DisciplineKey | undefined | null): DisciplineMeta {
  return (key && DISCIPLINE_META[key]) || DEFAULT_DISCIPLINE;
}
