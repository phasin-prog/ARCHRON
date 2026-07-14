// ชุดไอคอน line แบบ minimal — ใช้ currentColor (คุมสีด้วย Tailwind text-*)
// ขนาดปรับผ่าน className (ดีฟอลต์ h-5 w-5)

export type IconProps = { className?: string; style?: React.CSSProperties };

// Standard UI icons — delegated to Phosphor duotone
export {
  SearchIcon,
  MenuIcon,
  ArrowRightIcon,
  CloseIcon,
  LoginIcon,
  EditIcon,
  LogoutIcon,
  ExternalLinkIcon,
  HelpIcon,
  HeartIcon,
  ManifestoIcon,
  QuoteIcon,
  BookIcon,
  ConceptIcon,
  PersonIcon,
  ChevronDownIcon,
  HistoryIcon,
} from "@/components/phosphor-map";

const SVG = (className: string, children: React.ReactNode, style?: React.CSSProperties) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

// ARCHRON mark — วงกลมเปิด (ความรู้ไม่สิ้นสุด) + จุดศูนย์กลาง (มนุษย์)
// แทนไอคอน compass เดิม ตาม Founding Brand Codex (เลี่ยงสัญลักษณ์เข็มทิศ)
export function ArchronMark({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={1.5} fill="currentColor" opacity={0.4} />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ARCHRON Logomark — vesica: วงรอบ (อารยธรรม) + สองวงซ้อน (จุดตัดของศาสตร์) + จุดศูนย์กลาง (มนุษย์)
// ใช้ currentColor คุมสีด้วย Tailwind text-* (ปกติ text-accent)
export function ArchronLogomark({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth={1.1} fill="currentColor" opacity={0.4} />
      <circle cx="17.5" cy="24" r="12.5" fill="currentColor" />
      <circle cx="30.5" cy="24" r="12.5" fill="currentColor" />
      <circle cx="24" cy="3.5" r="1.4" fill="currentColor" />
      <circle cx="24" cy="44.5" r="1.4" fill="currentColor" />
      <circle cx="24" cy="24" r="2.6" fill="currentColor" />
    </svg>
  );
}







export function SchoolIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 20V7L12 3L21 7V20" fill="currentColor" opacity={0.4} />
      <rect x="7" y="9" width="3" height="12" fill="currentColor" />
      <rect x="14" y="9" width="3" height="12" fill="currentColor" />
    </svg>
  );
}

export function SymbolIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 3l9 9-9 9-9-9z" />
      <circle cx="12" cy="12" r="2.2" />
    </>,
  );
}

export function TermIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M4 12l7-7h6a1 1 0 0 1 1 1v6l-7 7z" />
      <circle cx="14.5" cy="9.5" r="1.2" fill="currentColor" stroke="none" />
    </>,
  );
}

export function SourceIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5" />
      <line x1="9.5" y1="13" x2="16" y2="13" />
      <line x1="9.5" y1="16" x2="16" y2="16" />
    </>,
  );
}

export function PathIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="4" cy="4" r="2" fill="currentColor" opacity={0.4} />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <circle cx="20" cy="20" r="2" fill="currentColor" opacity={0.4} />
      <line x1="6" y1="6" x2="9.5" y2="9.5" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
      <line x1="14.5" y1="14.5" x2="18" y2="22" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
    </svg>
  );
}







/* ============================================================================
   ARCHRON — HEADER NAV ICONS (ไอคอนนำทางแถบ header)
   ลายเส้นเดียวกับชุด line ด้านบน (strokeWidth 1.5 · currentColor · ไม่มีวงแหวน)
   น้ำหนักเบาเหมาะกับแถบนำทางที่มี label ภาษาไทย · ใช้แทน Material Symbols ใน header
   ============================================================================ */

// คลังความรู้ — โหนดศูนย์กลาง + โหนดบริวารเชื่อม (แผนที่ความรู้)
// แทนไอคอน explore เดิม (เลี่ยงสัญลักษณ์เข็มทิศ ตาม Founding Brand Codex)
export function KnowledgeHubIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5" cy="5" r="2.5" fill="currentColor" />
      <circle cx="19" cy="5" r="2.5" fill="currentColor" />
      <circle cx="5" cy="19" r="2.5" fill="currentColor" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <circle cx="19" cy="19" r="2.5" fill="currentColor" />
      <line x1="7.5" y1="5" x2="9.5" y2="12" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
      <line x1="16.5" y1="5" x2="14.5" y2="12" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
      <line x1="7.5" y1="19" x2="9.5" y2="12" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
      <line x1="16.5" y1="19" x2="14.5" y2="12" stroke="currentColor" strokeWidth={1.5} opacity={0.4} />
    </svg>
  );
}



















/* ============================================================================
   ARCHRON — ICON LANGUAGE (ชุดไอคอนประจำศาสตร์ ตาม brand board)
   ลายเส้นเชิงสัญลักษณ์ในวงแหวนล้อมรอบ (signature ของบอร์ด) · currentColor · 24x24
   ============================================================================ */

// ตัวห่อมาตรฐาน: วงแหวนวงนอก (ซิกเนเจอร์บอร์ด) + กลีฟด้านใน
const RingSVG = (className: string, children: React.ReactNode) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="7" />
    {children}
  </svg>
);

// จิตวิทยา — ร่างนั่งสงบ/จิต (concept) ในวงแหวน
export function PsychologyIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </>,
  );
}

// ปรัชญา — ต้นไม้แห่งความคิด (ทรงพุ่ม + ราก)
export function PhilosophyIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 8.2L8.6 15.2H15.4L12 8.2Z" />
    </>,
  );
}

// มานุษยวิทยา — มนุษย์ (กางแขน-ขา, ความเป็นมนุษย์)
export function AnthropologyIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="7.4" r="1.6" />
      <path d="M12 9v4.6" />
      <path d="M12 10.6L8.3 8.1M12 10.6l3.7-2.5" />
      <path d="M12 13.6L9.3 17.6M12 13.6l2.7 4" />
    </>,
  );
}



// ภาษา — หนังสือ/แผ่นจารึก (ตัวอักษรและการตีความ)
export function LanguageIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <path d="M12 8.6C10.5 7.6 8.7 7.4 7 7.6v9c1.7-.2 3.5.1 5 1.1 1.5-1 3.3-1.3 5-1.1v-9c-1.7-.2-3.5.1-5 1z" />
      <path d="M12 8.6v9.1" />
    </>,
  );
}

// ตำนาน — สัตว์มีปีก (ปีกกางออกจากศูนย์)
export function MythologyIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="9.2" r="1.1" />
      <path d="M12 10.6v6" />
      <path d="M12 11.4C9.4 9.4 7.6 10.1 5.8 8.6c.8 2.4 2.5 3.7 5.2 3.9" />
      <path d="M12 11.4c2.6-2 4.4-1.3 6.2-2.8-.8 2.4-2.5 3.7-5.2 3.9" />
    </>,
  );
}

// ศาสนา — ร่างมีรัศมี/ภาวะเหนือพ้น
export function ReligionIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="9" r="1.7" />
      <path d="M9.3 7.4c0-1 1.2-1.8 2.7-1.8s2.7.8 2.7 1.8" />
      <path d="M8 17.4c0-2.7 1.8-4.7 4-4.7s4 2 4 4.7" />
    </>,
  );
}

// วิทยาศาสตร์ — อะตอม (นิวเคลียส + วงโคจร)
export function ScienceIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="6.2" ry="2.5" />
      <ellipse cx="12" cy="12" rx="6.2" ry="2.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="6.2" ry="2.5" transform="rotate(120 12 12)" />
    </>,
  );
}

// สัญลักษณ์ — ดวงตาในรูปสี่เหลี่ยมข้าวหลามตัด (สัญญะ/ความหมาย)
export function SymbolismIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <path d="M12 5.6L18.4 12 12 18.4 5.6 12z" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" stroke="none" />
    </>,
  );
}

// ศิลปะ — ใบไม้/รอยพู่กัน (vesica + ก้าน)
export function ArtIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <path d="M12 5.6c3.1 2.7 3.1 8.1 0 10.8-3.1-2.7-3.1-8.1 0-10.8z" />
      <path d="M12 8v10" />
    </>,
  );
}

// ปัญญาประดิษฐ์ & อนาคต — โครงข่ายโหนด (ระบบเชื่อมโยง)
export function AIFutureIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="11.2" r="1.6" />
      <circle cx="7.4" cy="8.4" r="1.2" />
      <circle cx="16.6" cy="9.4" r="1.2" />
      <circle cx="11.4" cy="16.6" r="1.2" />
      <path d="M10.7 10.1 8.4 9M13.4 10.6l2-.7M11.6 12.8l-.1 2.6" />
    </>,
  );
}

// อารยธรรม — กงล้อรัศมี (ศูนย์กลาง + แฉกรอบทิศ)
export function CivilizationIcon({ className = "h-5 w-5" }: IconProps) {
  return RingSVG(
    className,
    <>
      <circle cx="12" cy="12" r="1.7" />
      <path d="M12 8.6V6M12 15.4V18M8.6 12H6M15.4 12H18" />
      <path d="M9.6 9.6 7.8 7.8M14.4 9.6l1.8-1.8M9.6 14.4l-1.8 1.8M14.4 14.4l1.8 1.8" />
      <circle cx="12" cy="6" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="18" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="6" cy="12" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="0.5" fill="currentColor" stroke="none" />
    </>,
  );
}

// ── ไอคอนหัวข้อหน้าอ่าน (Reading Section) — ภาษาเส้นเดียวกัน ใช้ currentColor คุมด้วย --accent ──

// ความหมายให้เห็นภาพ — ดวงตา + จุดศูนย์กลาง (echo แบรนด์)
export function VisualMeaningIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.7" />
      <circle cx="12" cy="12" r="0.4" fill="currentColor" stroke="none" />
    </>,
  );
}

// ความหมายทางวิชาการ — หนังสือเปิดสองหน้า
export function ScholarIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 6.5C10.4 5.3 7.9 4.8 4.5 5.2v12c3.4-.4 5.9.1 7.5 1.3" />
      <path d="M12 6.5C13.6 5.3 16.1 4.8 19.5 5.2v12c-3.4-.4-5.9.1-7.5 1.3" />
      <path d="M12 6.5v12" />
    </>,
  );
}

// ตัวอย่างในชีวิตจริง — ต้นอ่อน (ชีวิต)
export function RealExampleIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 20.5V12" />
      <path d="M12 13.5c0-3-2.4-5.4-5.4-5.4C6.6 11.1 9 13.5 12 13.5z" />
      <path d="M12 11.2c0-2.6 2.1-4.7 4.7-4.7 0 2.6-2.1 4.7-4.7 4.7z" />
      <path d="M5.5 20.5h13" />
    </>,
  );
}

// นำมาจากตำราไหน — เอกสารอ้างอิง
export function SourceRefIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M7 4.5h6.5l4 4V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1z" />
      <path d="M13.3 4.5v4.2h4.2" />
      <path d="M9 12.5h6M9 15.5h4.5" />
    </>,
  );
}

// รากแนวคิด — ราก
export function RootIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 22V10" stroke="currentColor" strokeWidth={2} opacity={0.4} />
      <path d="M12 10C12 10 8 6 12 2C12 2 16 6 12 10Z" fill="currentColor" />
      <circle cx="12" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ผู้เขียน — ปากกา
export function AuthorPenIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M4.5 19.5l1-3.8L15.7 5.5a1.9 1.9 0 0 1 2.8 2.8L8.3 18.5l-3.8 1z" />
      <path d="M14 7.2l2.8 2.8" />
    </>,
  );
}

// เผยแพร่ — ปฏิทิน
export function CalendarIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <rect x="4.5" y="5.5" width="15" height="14" rx="1.6" />
      <path d="M4.5 9.5h15M8.5 3.5v3M15.5 3.5v3" />
    </>,
  );
}

// แก้ไขล่าสุด — นาฬิกา
export function ClockIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.2l2.6 1.6" />
    </>,
  );
}

// สังเคราะห์ — วงกลมสองวงประสานกัน (เปรียบเทียบ/บูรณาการ)
export function SynthesisIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="7" cy="12" r="4.5" fill="currentColor" opacity={0.4} />
      <circle cx="17" cy="12" r="4.5" fill="currentColor" opacity={0.4} />
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
    </svg>
  );
}

// กริด/หมวดศาสตร์ — สี่ช่องมน (ใช้กับ "ศาสตร์ที่เราศึกษา")
export function GridIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.4" />
      <rect x="13" y="4" width="7" height="7" rx="1.4" />
      <rect x="4" y="13" width="7" height="7" rx="1.4" />
      <rect x="13" y="13" width="7" height="7" rx="1.4" />
    </>
  );
}

// CollectionIcon — 4-square grid (Collection object type)
export function CollectionIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.4" />
      <rect x="14" y="3" width="7" height="7" rx="1.4" />
      <rect x="3" y="14" width="7" height="7" rx="1.4" />
      <rect x="14" y="14" width="7" height="7" rx="1.4" />
    </>
  );
}

// NotificationIcon — bell (notifications)
export function NotificationIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>
  );
}

/* ============================================================================
   ARCHRON — CAROUSEL & NAVIGATION UTILITY ICONS
   ============================================================================ */
export function ChevronLeftIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <path d="M15 18l-6-6 6-6" />
  );
}

export function ChevronRightIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <path d="M9 18l6-6-6-6" />
  );
}



export function ArrowLeftIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <line x1="20" y1="12" x2="5" y2="12" />
      <path d="M11 18l-6-6 6-6" />
    </>
  );
}

export function ArrowUpIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <path d="M12 19V5M6 11l6-6 6 6" />
  );
}

/* ============================================================================
   ARCHRON — MANIFESTO MOVEMENT ICONS (strokeWidth=1.5 · currentColor)
   ============================================================================ */
export function PreambleIcon({ className = "h-6 w-6" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 6c-1.6-1.2-3.8-1.6-6-1.4v12c2.2-.2 4.4.2 6 1.4 1.6-1.2 3.8-1.6 6-1.4v-12c-2.2-.2-4.4.2-6 1.4Z" />
      <path d="M12 6v12" />
    </>
  );
}

export function WhyExistIcon({ className = "h-6 w-6" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="8" r="2.2" />
      <circle cx="9" cy="18" r="2.2" />
      <path d="M7.9 7.3 16.1 6.8M7.4 8 8.6 15.9M10.9 16.7 16.2 9.8" />
    </>
  );
}

export function WhatStudyIcon({ className = "h-6 w-6" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M15.5 20v-2.2a5.5 5.5 0 1 0-7 0V20" />
      <path d="M12 12.2c1.1 0 1.8-.9 1.8-2 0-1-.7-1.9-1.8-1.9s-1.8.9-1.8 1.9c0 1.1.7 2 1.8 2Z" />
    </>
  );
}

export function WhatBelieveIcon({ className = "h-6 w-6" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 4v3M4.5 8h15M6.8 8l-2.3 5.2M17.2 8l2.3 5.2" />
      <path d="M2.6 13.2a3.4 2 0 0 0 3.8 0M17.6 13.2a3.4 2 0 0 0 3.8 0" />
      <path d="M9 19h6M12 7v12" />
    </>
  );
}

export function OurMethodIcon({ className = "h-6 w-6" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l4.5 4.5" />
      <path d="M10.5 7.5v6M7.5 10.5h6" />
    </>
  );
}

export function WhatRejectIcon({ className = "h-6 w-6" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 3.5 5 6.2v5c0 4.3 3 7 7 9.3 4-2.3 7-5 7-9.3v-5L12 3.5Z" />
      <path d="M9.3 9.3l5.4 5.4M14.7 9.3l-5.4 5.4" />
    </>
  );
}

export function WhatOfferIcon({ className = "h-6 w-6" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  );
}

export function OurResponsibilityIcon({ className = "h-6 w-6" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 21c-4-2.2-7-5-7-9.3v-5L12 3.9l7 2.8v5C19 16 16 18.8 12 21Z" />
      <path d="M9 11.6l2.1 2.1L15 9.9" />
    </>
  );
}

export function OurLegacyIcon({ className = "h-6 w-6" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 20v-8" />
      <path d="M12 12c0-2.8-2.2-5-5-5 0 2.8 2.2 5 5 5Z" />
      <path d="M12 12c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z" />
      <path d="M8.5 20h7" />
    </>
  );
}

export function ClosingDeclIcon({ className = "h-6 w-6" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.2 8.8 10.8 10.8 8.8 15.2 13.2 13.2 Z" />
      <circle cx="12" cy="12" r="1" />
    </>
  );
}

/* ============================================================================
   ARCHRON — ALL-IN-ONE CANONICAL SYSTEM ICONS (ชุดแม่แบบ 26 Canonical Icons)
   ตามมาตรฐาน All-in-One Icon Template (24x24 · strokeWidth 1.5 · currentColor · 2px pad)
   ============================================================================ */
export function HomeIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M3.5 11.2L12 3.8L20.5 11.2V19.5C20.5 20.3284 19.8284 21 19 21H5C4.17157 21 3.5 20.3284 3.5 19.5V11.2Z" />
      <path d="M9 21V13.5C9 12.6716 9.67157 12 10.5 12H13.5C14.3284 12 15 12.6716 15 13.5V21" />
    </>,
  );
}

export function LibraryIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <rect x="2.8" y="3.5" width="5.2" height="17" rx="1.8" />
      <rect x="9.4" y="3.5" width="5.2" height="17" rx="1.8" />
      <rect x="16" y="3.5" width="5.2" height="17" rx="1.8" />
    </>,
  );
}

export function SourcesIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <rect x="3.5" y="3" width="11" height="14.2" rx="2" />
      <path d="M9.5 8.2V20C9.5 21.1 10.4 22 11.5 22H18.5C19.6 22 20.5 21.1 20.5 20V8.2" />
      <path d="M12.5 18.5L15 21L17.5 18.5" />
    </>,
  );
}

export function ProfileIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="12" cy="8.2" r="4" />
      <path d="M4.8 19.2C4.8 15.1 7.9 12.8 12 12.8C16.1 12.8 19.2 15.1 19.2 19.2" />
    </>,
  );
}

export function PrimarySourceIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <rect x="6" y="2.8" width="12" height="18.4" rx="2" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </>,
  );
}

export function SecondarySourceIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <rect x="4.2" y="3" width="10.5" height="14" rx="2" />
      <rect x="9.3" y="7" width="10.5" height="14" rx="2" />
    </>,
  );
}

export function InterpretationIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <rect x="6" y="2.8" width="12" height="18.4" rx="2" />
      <path d="M8.8 15.2L15.2 8.8" />
    </>,
  );
}

export function BookmarkIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M7 3.5H17C17.8284 3.5 18.5 4.17157 18.5 5V20L12 16.2L5.5 20V5C5.5 4.17157 6.17157 3.5 7 3.5Z" />
    </>,
  );
}

export function BookmarkActiveIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M7 3.5H17C17.8284 3.5 18.5 4.17157 18.5 5V20L12 16.2L5.5 20V5C5.5 4.17157 6.17157 3.5 7 3.5Z" />
      <circle cx="12" cy="10.2" r="1.3" fill="currentColor" stroke="none" />
    </>,
  );
}

export function ShareIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="6.5" cy="12" r="2" />
      <circle cx="17.5" cy="6" r="2" />
      <circle cx="17.5" cy="18" r="2" />
      <path d="M9 10.8L15 7.2M9 13.2L15 16.8" />
    </>,
  );
}

export function CopyIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <rect x="8.2" y="3.8" width="10" height="10" rx="2" />
      <path d="M5.8 9.2V17.2C5.8 18.5 6.7 19.8 8.2 19.8H15.5" />
    </>,
  );
}

export function FilterIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M3.5 8H10.5" />
      <circle cx="14.2" cy="8" r="2.2" />
      <path d="M17.8 8H20.5" />
      <path d="M3.5 16H8.2" />
      <circle cx="11.9" cy="16" r="2.2" />
      <path d="M15.1 16H20.5" />
    </>,
  );
}

export function SortIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M8 15L12 19L16 15" />
      <path d="M12 19V5" />
      <path d="M16 9L12 5L8 9" opacity={0.35} />
    </>,
  );
}

export function CheckIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <path d="M5.5 12.5L10.2 17.2L18.8 7.2" />,
  );
}

export function MoreIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="6" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>,
  );
}

/* ============================================================================
   ARCHRON — BADGE & SPRITE FALLBACK ICONS (สำหรับ card-badge และ 3d-icon container)
   ============================================================================ */
export function LevelBadgeIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </>
  );
}

export function AchievementBadgeIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </>
  );
}

export function ReadingSetBadgeIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0.5-0.05" />
      <path d="M6 18h14" />
      <circle cx="11" cy="10" r="2" />
      <line x1="16" y1="10" x2="16" y2="10.01" />
    </>
  );
}

export function SourceBadgeIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </>
  );
}

export function LanternBadgeIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 2v3M9 5h6l1 14H8L9 5z" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M10 19v3h4v-3" />
    </>
  );
}

export const LanternIcon = LanternBadgeIcon;
export const ReadingSetIcon = ReadingSetBadgeIcon;
