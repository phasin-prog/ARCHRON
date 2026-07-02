import { useId } from "react";

// PlateBackdrop — ฉากหลัง "แผ่นจารดาราศาสตร์" แบบใช้ซ้ำได้ (Server Component · SVG ล้วน)
// อิง AGENT-HANDOFF §12: ใช้ design tokens เท่านั้น · เคารพความนิ่งของเว็บ (ไม่มี animation)
//
// density:
// - "subtle"  → กริดจางอย่างเดียว (พื้นหลังหน้าเนื้อหา — ไม่รบกวนการอ่าน)
// - "section" → กริด + ขีดพิกัดขอบ + ดาวประปราย (ส่วนคั่น/หัวหน้า)
// สำหรับ hero เต็มรูปแบบ (วงโคจร/โครงข่ายดาว/ปกเล่ม) ใช้ฉากเฉพาะใน app/page.tsx
type PlateBackdropProps = {
  density?: "subtle" | "section";
  className?: string;
};

export function PlateBackdrop({ density = "subtle", className = "" }: PlateBackdropProps) {
  // id ต่อ instance — กัน <pattern>/<mask> ชนกันเมื่อมีหลายชิ้นบนหน้าเดียว
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const gridId = `plate-grid-${uid}`;
  const fadeId = `plate-fade-${uid}`;
  const maskId = `plate-mask-${uid}`;

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 800"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <pattern id={gridId} width="120" height="120" patternUnits="userSpaceOnUse">
          <path
            d="M30 0v120M60 0v120M90 0v120M0 30h120M0 60h120M0 90h120"
            stroke="var(--color-ink)"
            strokeOpacity=".018"
            strokeWidth="1"
          />
          <path d="M120 0H0V120" stroke="var(--color-ink)" strokeOpacity=".045" strokeWidth="1" />
        </pattern>
        <radialGradient id={fadeId} cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="80%" stopColor="#fff" stopOpacity=".45" />
          <stop offset="100%" stopColor="#fff" stopOpacity=".12" />
        </radialGradient>
        <mask id={maskId}>
          <rect width="1440" height="800" fill={`url(#${fadeId})`} />
        </mask>
      </defs>

      <rect width="1440" height="800" fill={`url(#${gridId})`} mask={`url(#${maskId})`} />

      {density === "section" ? (
        <>
          {/* ขีดพิกัดขอบบน-ล่าง (ทุก 60px) */}
          <g stroke="var(--color-gold)" strokeOpacity=".22">
            <path d="M60 14H1380" strokeWidth="5" strokeDasharray="1 59" />
            <path d="M60 786H1380" strokeWidth="5" strokeDasharray="1 59" />
          </g>
          {/* ดาวประปราย — ใช้ accent ของหน้า (Dynamic Accent) เป็นแสงนำ */}
          <g fill="var(--color-ink)" fillOpacity=".3">
            <circle cx="180" cy="140" r="1.3" />
            <circle cx="1260" cy="110" r="1.4" />
            <circle cx="1340" cy="420" r="1.1" />
            <circle cx="95" cy="520" r="1.2" />
            <circle cx="760" cy="90" r="1.1" />
            <circle cx="520" cy="680" r="1.2" />
            <circle cx="1080" cy="640" r="1.3" />
          </g>
          <g fill="var(--accent)" fillOpacity=".5">
            <circle cx="340" cy="220" r="1.8" />
            <circle cx="1150" cy="260" r="1.8" />
          </g>
        </>
      ) : null}
    </svg>
  );
}
