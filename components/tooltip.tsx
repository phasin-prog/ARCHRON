import type { ReactNode } from "react";

// Tooltip — กล่องคำอธิบายสั้นเมื่อ hover/focus (CSS ล้วน ใช้ใน server component ได้)
// ไม่รก: ทริกเกอร์ปกติดูเรียบ, กล่องผุดเหนือเฉพาะตอนชี้/โฟกัส
export function Tooltip({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`group/tt relative inline-flex items-center ${className}`}>
      <span tabIndex={0} className="cursor-help outline-none">
        {children}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[240px] -translate-x-1/2 whitespace-normal rounded-md border border-white/12 bg-surface-container px-3 py-2 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-on-surface-variant opacity-0 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)] transition-opacity duration-200 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}
