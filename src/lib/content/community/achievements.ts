// ARCHRON — แคตตาล็อกเหรียญตรา/ความสำเร็จ (Achievements)
// 6 อันตาม Decisions ข้อ 5 · icon = emoji fallback
// evaluateAchievements(stats) คืน key ที่ควรปลดล็อก → ฝั่ง server upsert เฉพาะที่ยังไม่มี (idempotent)
// Pure module: ไม่มี import นอกจาก type ภายในไฟล์นี้เอง

export type AchievementKey =
  | "first-read"
  | "explorer-10"
  | "streak-7"
  | "deep-50"
  | "manifesto";

export type Achievement = {
  key: AchievementKey;
  title: string; // ชื่อเหรียญ (ไทย)
  description: string; // เงื่อนไข/คำอธิบาย (ไทย)
  icon: string; // Material Symbols name
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    key: "first-read",
    title: "ก้าวแรก",
    description: "อ่านชิ้นความรู้แรกจบ",
    icon: "footprint",
  },
  {
    key: "explorer-10",
    title: "นักสำรวจ",
    description: "อ่านครบ 10 ชิ้นความรู้",
    icon: "explore",
  },
  {
    key: "streak-7",
    title: "ไฟไม่มอด",
    description: "อ่านต่อเนื่อง 7 วัน",
    icon: "local_fire_department",
  },
  {
    key: "deep-50",
    title: "อ่านลึก",
    description: "อ่านครบ 50 ชิ้นความรู้",
    icon: "menu_book",
  },
  {
    key: "manifesto",
    title: "ผู้ร่วมปฏิญญา",
    description: "อ่านปฏิญญาก่อตั้งจบ",
    icon: "auto_awesome",
  },
];

// สถิติผู้ใช้ที่ใช้ประเมินเงื่อนไข (คำนวณฝั่ง server จาก reading_progress)
export type ReadingStats = {
  completed: number; // จำนวนชิ้นความรู้ (ทุกชนิด) ที่อ่านจบ
  streakDays: number; // จำนวนวันอ่านต่อเนื่องล่าสุด
  readManifesto: boolean; // อ่านปฏิญญาก่อตั้ง (slug=manifesto) จบแล้วหรือไม่
};

// slug ของปฏิญญาก่อตั้ง — ใช้ตรวจ achievement "manifesto"
export const MANIFESTO_SLUG = "manifesto";

// ประเมินว่า key ใดควรปลดล็อก (declarative) — คืน array ของ key
export function evaluateAchievements(stats: ReadingStats): AchievementKey[] {
  const unlocked: AchievementKey[] = [];
  if (stats.completed >= 1) unlocked.push("first-read");
  if (stats.completed >= 10) unlocked.push("explorer-10");
  if (stats.streakDays >= 7) unlocked.push("streak-7");
  if (stats.completed >= 50) unlocked.push("deep-50");
  if (stats.readManifesto) unlocked.push("manifesto");
  return unlocked;
}
