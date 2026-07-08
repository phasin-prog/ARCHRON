import type { ReactNode } from "react";

// SectionHeading — หัวข้อ section มาตรฐาน (kicker + title + optional action)
// ใช้แทนการเขียน h2 + ป้ายเล็กแยกกันในแต่ละหน้า เพื่อความสม่ำเสมอ
export function SectionHeading({
  kicker,
  title,
  action,
  className = "",
}: {
  kicker?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-end justify-between gap-4 ${className}`}>
      <div>
        {kicker ? (
          <p className="text-xs font-semibold tracking-[0.18em] text-accent uppercase transition-colors duration-700">
            {kicker}
          </p>
        ) : null}
        <h2 className="mt-2 font-serif text-2xl text-text-heading md:text-3xl">{title}</h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}