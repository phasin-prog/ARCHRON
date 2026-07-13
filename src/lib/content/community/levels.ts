// ARCHRON — ระบบระดับนักอ่าน (Level System)
// เลื่อนระดับตามจำนวน "ชิ้นความรู้ที่อ่านจบ" (ทุกชนิดเนื้อหา ไม่จำกัดเฉพาะ article)
// 6 ขั้น เกณฑ์ 0/3/10/25/50/100 (Decisions ข้อ 4) — ใช้ทั้งฝั่ง compute และ UI
// Pure module: ไม่มี import นอกจาก type ภายในไฟล์นี้เอง

export type Level = {
  level: number; // 1–6
  name: string; // ชื่อระดับภาษาไทย
  threshold: number; // จำนวนชิ้นความรู้อ่านจบขั้นต่ำที่เข้าระดับนี้
};

// เรียงจากต่ำ → สูง (ต้องเรียง threshold จากน้อยไปมากเสมอ)
export const LEVELS: Level[] = [
  { level: 1, name: "ผู้มาเยือน", threshold: 0 },
  { level: 2, name: "ผู้อ่าน", threshold: 3 },
  { level: 3, name: "ผู้ใฝ่รู้", threshold: 10 },
  { level: 4, name: "นักสำรวจ", threshold: 25 },
  { level: 5, name: "นักคิด", threshold: 50 },
  { level: 6, name: "นักปราชญ์", threshold: 100 },
];

// ระดับปัจจุบัน = ระดับสูงสุดที่ threshold <= count
export function currentLevel(count: number): Level {
  const n = Math.max(0, Math.floor(count || 0));
  let result = LEVELS[0];
  for (const lv of LEVELS) {
    if (n >= lv.threshold) result = lv;
    else break;
  }
  return result;
}

// ระดับถัดไป (null = อยู่ระดับสูงสุดแล้ว)
export function nextLevel(count: number): Level | null {
  const cur = currentLevel(count);
  const idx = LEVELS.findIndex((lv) => lv.level === cur.level);
  return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

export type LevelProgress = {
  level: number; // เลขระดับปัจจุบัน
  name: string; // ชื่อระดับปัจจุบัน
  next: Level | null; // ระดับถัดไป (null = สูงสุดแล้ว)
  toNext: number; // เหลืออีกกี่ชิ้นความรู้จะเลื่อนระดับ (0 เมื่อสูงสุด)
  pct: number; // ความคืบหน้าไปยังระดับถัดไป 0–100 (100 เมื่อสูงสุด)
};

// ความคืบหน้าไปยังระดับถัดไป — ใช้กับแถบ progress ใน /profile
export function levelProgress(count: number): LevelProgress {
  const n = Math.max(0, Math.floor(count || 0));
  const cur = currentLevel(n);
  const next = nextLevel(n);

  if (!next) {
    return { level: cur.level, name: cur.name, next: null, toNext: 0, pct: 100 };
  }

  const span = next.threshold - cur.threshold;
  const done = n - cur.threshold;
  const pct = span > 0 ? Math.min(100, Math.max(0, Math.round((done / span) * 100))) : 0;
  const toNext = Math.max(0, next.threshold - n);

  return { level: cur.level, name: cur.name, next, toNext, pct };
}
