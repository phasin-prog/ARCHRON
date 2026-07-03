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
  psychology: { Icon: PsychologyIcon, accent: "#6E93A8", label: "จิตวิทยา" },
  philosophy: { Icon: PhilosophyIcon, accent: "#C79A4A", label: "ปรัชญา" },
  anthropology: { Icon: AnthropologyIcon, accent: "#8AA395", label: "มานุษยวิทยา" },
  history: { Icon: HistoryIcon, accent: "#B9C2CE", label: "ประวัติศาสตร์" },
  language: { Icon: LanguageIcon, accent: "#8AA395", label: "ภาษาและการตีความ" },
  mythology: { Icon: MythologyIcon, accent: "#B9C2CE", label: "ตำนาน" },
  religion: { Icon: ReligionIcon, accent: "#C79A4A", label: "ศาสนา" },
  science: { Icon: ScienceIcon, accent: "#7FB08A", label: "วิทยาศาสตร์" },
  symbol: { Icon: SymbolismIcon, accent: "#C79A4A", label: "สัญลักษณ์" },
  art: { Icon: ArtIcon, accent: "#C79A4A", label: "ศิลปะ" },
  "ai-future": { Icon: AIFutureIcon, accent: "#6E93A8", label: "ปัญญาประดิษฐ์และอนาคต" },
  civilization: { Icon: CivilizationIcon, accent: "#8AA395", label: "อารยธรรม" },
};

// ดีฟอลต์เมื่อไม่ระบุศาสตร์ — โทน Mercurius (สำนักคิด)
export const DEFAULT_DISCIPLINE: DisciplineMeta = {
  Icon: PhilosophyIcon,
  accent: "#8AA395",
  label: "สำนักคิด",
};

export function disciplineMeta(key: DisciplineKey | undefined | null): DisciplineMeta {
  return (key && DISCIPLINE_META[key]) || DEFAULT_DISCIPLINE;
}
