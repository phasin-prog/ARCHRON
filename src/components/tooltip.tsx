"use client";

import type { ReactNode } from "react";
import { useState } from "react";

// Tooltip — กล่องคำอธิบายสั้นเมื่อ hover/focus (รองรับคีย์บอร์ด)
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
  const [showByKeyboard, setShowByKeyboard] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setShowByKeyboard((prev) => !prev);
    } else if (e.key === "Escape") {
      setShowByKeyboard(false);
    }
  };

  return (
    <span className={`group/tt relative inline-flex items-center ${className}`}>
      <span
        tabIndex={0}
        className="cursor-help outline-none"
        onKeyDown={handleKeyDown}
        onBlur={() => setShowByKeyboard(false)}
        role="button"
        aria-label={`คำอธิบาย: ${label}`}
      >
        {children}
      </span>
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[240px] -translate-x-1/2 whitespace-normal rounded-md border border-text-heading/12 bg-bg-card px-3 py-2 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-text-secondary shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)] transition-opacity duration-200 ${
          showByKeyboard ? "opacity-100" : "opacity-0 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100"
        }`}
      >
        {label}
      </span>
    </span>
  );
}
