import { COSMOLOGY_ACCENT, type Cosmology } from "@/lib/content/cosmology";

// VesicaPattern — พื้นหลัง vesica จาง ๆ ซ้ำเป็น grid สำหรับ section สาย
// cosmology-aware: สี pattern อ่านจาก cosmology ของ section (ผ่าน inline style)
// server component (pure SVG + CSS, ไม่ต้อง JS) · pointer-events:none · aria-hidden
//
// แนวคิด: vesica (สองวงซ้อน) ซ้ำ ๆ = การเชื่อมโยงของศาสตร์ สื่อว่า section นี้คือ "สาย" ใด
// สีเปลี่ยนตาม cosmology → Psyche (แนวคิด), Mercurius (สำนัก), Sapientia (บทความ) ฯลฯ

type Props = {
  cosmology: Cosmology;
  className?: string;
  /** ความจางของ pattern (0-1) default 0.06 */
  opacity?: number;
};

export function VesicaPattern({ cosmology, className, opacity = 0.06 }: Props) {
  const accent = COSMOLOGY_ACCENT[cosmology];
  // vesica unit ขนาด 48x48 วาด 2x2 tile เพื่อให้ repeat สม่ำเสมอ
  const patternId = `vesica-${cosmology}`;

  return (
    <svg
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none", opacity }}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width="96"
          height="96"
          patternUnits="userSpaceOnUse"
        >
          {/* vesica unit: สองวงซ้อน + จุดศูนย์ */}
          <g
            fill="none"
            stroke={accent}
            strokeWidth="1"
            transform="translate(48 48)"
          >
            <circle cx="-9" cy="0" r="13" />
            <circle cx="9" cy="0" r="13" />
            <circle cx="0" cy="0" r="1.6" fill={accent} stroke="none" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
