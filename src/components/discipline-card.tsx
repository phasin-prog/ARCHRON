// DisciplineCard — การ์ดศาสตร์ (presentational, ใช้ได้ทั้ง server/client)
// ไอคอน/สี/ป้าย จาก discipline-meta · คำอธิบายจาก lib/content/disciplines
import Link from "next/link";
import { DISCIPLINE_META } from "@/components/discipline-meta";
import type { DisciplineEntry } from "@/lib/content/disciplines";

const CARD_CLASS =
  "group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/25 bg-text-heading/[0.02] p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-30px_rgba(0,0,0,0.7)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none border-t-2 border-transparent hover:border-accent/40";

export function DisciplineCard({ entry, href }: { entry: DisciplineEntry; href?: string }) {
  const meta = DISCIPLINE_META[entry.key];
  const Icon = meta.Icon;

  const inner = (
    <>

      {/* แสงเรืองมุมบนขวา */}
      <span
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-90"
        style={{ background: `radial-gradient(circle, color-mix(in srgb, ${meta.accent} 18%, transparent), transparent 70%)` }}
        aria-hidden="true"
      />
      <span
        className="flex h-14 w-14 items-center justify-center rounded-xl border transition-transform duration-500 group-hover:scale-105"
        style={{
          color: meta.accent,
          borderColor: `color-mix(in srgb, ${meta.accent} 30%, transparent)`,
          backgroundColor: `color-mix(in srgb, ${meta.accent} 10%, transparent)`,
        }}
      >
        <Icon className="h-7 w-7" />
      </span>
      <span
        className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.14em] opacity-85"
        style={{ color: meta.accent }}
      >
        {entry.en}
      </span>
      <h3 className="mt-1 font-serif text-[22px] leading-snug text-text-heading">{meta.label}</h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-text-secondary/80">{entry.desc}</p>
    </>
  );

  return href ? (
    <Link href={href} className={CARD_CLASS}>
      {inner}
    </Link>
  ) : (
    <article className={CARD_CLASS}>{inner}</article>
  );
}
