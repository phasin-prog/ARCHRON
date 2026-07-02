// DisciplineCard — การ์ดศาสตร์ "ตราสลัก" (presentational, ใช้ได้ทั้ง server/client)
// ไอคอน/สี/ป้าย จาก discipline-meta · คำอธิบายจาก lib/content/disciplines
// Redesign "แผ่นจารดาราศาสตร์": ไอคอนเป็นลายน้ำสลักมุมการ์ด (ไม่ใช้ icon tile)
// hover เอฟเฟกต์เดียว = ขอบชัดขึ้น + ลายน้ำเด่นขึ้น (เว็บนิ่ง ตาม design-system.md)
import Link from "next/link";
import type { CSSProperties } from "react";
import { DISCIPLINE_META } from "@/components/discipline-meta";
import type { DisciplineEntry } from "@/lib/content/disciplines";

const CARD_CLASS =
  "group relative flex h-full w-full flex-col overflow-hidden border p-7 transition-colors duration-500 " +
  "border-[color:color-mix(in_srgb,var(--dc-accent)_22%,transparent)] " +
  "hover:border-[color:color-mix(in_srgb,var(--dc-accent)_50%,transparent)] " +
  "focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none";

export function DisciplineCard({ entry, href }: { entry: DisciplineEntry; href?: string }) {
  const meta = DISCIPLINE_META[entry.key];
  const Icon = meta.Icon;
  // ส่งสี accent ของศาสตร์ผ่าน CSS var — ให้ border/hover อ่านจาก token เดียวกัน
  const style = {
    "--dc-accent": meta.accent,
    background: "linear-gradient(160deg, var(--color-surface-container), var(--color-paper-sunken))",
  } as CSSProperties;

  const inner = (
    <>
      {/* ลายน้ำตราศาสตร์ — สลักจางที่มุมขวาล่าง เด่นขึ้นเมื่อ hover */}
      <span
        className="pointer-events-none absolute -bottom-6 -right-6 opacity-[0.13] transition-opacity duration-500 group-hover:opacity-30"
        style={{ color: "var(--dc-accent)" }}
        aria-hidden="true"
      >
        <Icon className="h-32 w-32" />
      </span>
      <span
        className="text-[10.5px] font-semibold uppercase tracking-[0.16em] opacity-85"
        style={{ color: "var(--dc-accent)" }}
      >
        {entry.en}
      </span>
      <h3 className="mt-2 font-serif text-[22px] font-semibold leading-snug text-on-surface">{meta.label}</h3>
      <p className="mt-3 max-w-[88%] text-[0.95rem] leading-relaxed text-on-surface-variant/80">{entry.desc}</p>
    </>
  );

  return href ? (
    <Link href={href} className={CARD_CLASS} style={style}>
      {inner}
    </Link>
  ) : (
    <article className={CARD_CLASS} style={style}>
      {inner}
    </article>
  );
}
