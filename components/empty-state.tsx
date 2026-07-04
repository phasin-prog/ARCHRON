import type { ReactNode } from "react";

// EmptyState — สถานะว่าง/ยังไม่มีเนื้อหา แบบมาตรฐาน
// ใช้ทุกหน้า list เพื่อความสม่ำเสมอ (articles, reading-sets, sources, ฯลฯ)
// icon = ชื่อ Material Symbols (เช่น "menu_book", "auto_stories")
export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  children,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-boundary/25 bg-surface-container-low/50 p-10 text-center sm:p-12">
      <span
        className="material-symbols-outlined text-[40px] text-burnished-gold/30"
        aria-hidden="true"
      >
        {icon}
      </span>
      <p className="mt-4 font-serif text-lg text-ivory">{title}</p>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant/65">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
