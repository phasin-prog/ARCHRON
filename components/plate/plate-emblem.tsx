import type { ReactNode } from "react";

// PlateEmblem — "ตราสลัก" ครอบไอคอนใดก็ได้จาก components/icons.tsx
// แทนที่สูตร icon-tile เดิม (กล่อง tinted) ด้วยวงโคจรจาร + ดาวเหนือตรา
// ใช้กับหัวหน้า (PageHeader emblem slot) / การ์ดที่ต้องการตราประจำหมวด
//
// สี: ส่งผ่าน `accent` เป็นค่า token เช่น "var(--cos-psyche)" — ห้ามส่ง hex ตรง
type PlateEmblemProps = {
  children: ReactNode; // ไอคอนเส้น (stroke=currentColor)
  accent?: string;
  /** ขนาดกล่องรวม (px) */
  size?: number;
  className?: string;
};

export function PlateEmblem({
  children,
  accent = "var(--color-gold)",
  size = 96,
  className = "",
}: PlateEmblemProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, color: accent }}
      aria-hidden="true"
    >
      {/* วงโคจรจารคู่ + ดาวเหนือตรา */}
      <svg viewBox="0 0 96 96" fill="none" className="absolute inset-0 h-full w-full">
        <circle cx="48" cy="52" r="38" stroke="currentColor" strokeOpacity=".35" />
        <circle cx="48" cy="52" r="31" stroke="currentColor" strokeOpacity=".18" strokeDasharray="1 5" />
        <path
          d="M48 2l2.2 6.6L57 10.8l-6.8 2.2L48 19.6l-2.2-6.6-6.8-2.2 6.8-2.2z"
          fill="currentColor"
          fillOpacity=".8"
        />
        <path d="M10 52h6M80 52h6" stroke="currentColor" strokeOpacity=".4" />
      </svg>
      {/* ไอคอนกลางตรา */}
      <span className="relative flex h-9 w-9 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
        {children}
      </span>
    </span>
  );
}
