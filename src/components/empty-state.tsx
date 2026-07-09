import type { ReactNode } from "react";

// EmptyState — สถานะว่าง/ยังไม่มีเนื้อหา แบบมาตรฐาน
// ใช้ทุกหน้า list เพื่อความสม่ำเสมอ (articles, reading-sets, sources, ฯลฯ)
// icon prop accepts a ReactNode for custom icon rendering
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
    <div className="rounded-xl border border-border/25 bg-bg-card/50 p-10 text-center sm:p-12">
      <span className="inline-flex items-center justify-center w-10 h-10 text-[40px] text-accent/30" aria-hidden="true">
        {typeof icon === "string" ? icon[0]?.toUpperCase() : "○"}
      </span>
      <p className="mt-4 font-serif text-lg text-text-heading">{title}</p>
      {description ? (
        <p className="mt-2 text-sm leading-relaxed text-text-secondary/65">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
