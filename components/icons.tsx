// ชุดไอคอน line แบบ minimal — ใช้ currentColor (คุมสีด้วย Tailwind text-*)
// ขนาดปรับผ่าน className (ดีฟอลต์ h-5 w-5)

type IconProps = { className?: string };

const SVG = (className: string, children: React.ReactNode) => (
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
    {children}
  </svg>
);

export function CompassIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="12,5 14,12 10,12" fill="currentColor" stroke="none" />
      <polygon points="12,19 14,12 10,12" fill="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </>,
  );
}

export function ConceptIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <line x1="8" y1="11" x2="16" y2="7" />
      <line x1="8" y1="13" x2="16" y2="17" />
    </>,
  );
}

export function PersonIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
    </>,
  );
}

export function BookIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M12 6c-1.5-1.2-3.5-2-6-2v13c2.5 0 4.5.8 6 2 1.5-1.2 3.5-2 6-2V4c-2.5 0-4.5.8-6 2z" />
      <line x1="12" y1="6" x2="12" y2="21" />
    </>,
  );
}

export function SchoolIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <path d="M4 9l8-4 8 4" />
      <line x1="6" y1="10" x2="6" y2="17" />
      <line x1="10" y1="10" x2="10" y2="17" />
      <line x1="14" y1="10" x2="14" y2="17" />
      <line x1="18" y1="10" x2="18" y2="17" />
      <line x1="4" y1="19" x2="20" y2="19" />
    </>,
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
  return SVG(
    className,
    <>
      <circle cx="5" cy="6" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="19" cy="18" r="1.8" />
      <line x1="6.4" y1="7.2" x2="10.6" y2="10.8" />
      <line x1="13.4" y1="13.2" x2="17.6" y2="16.8" />
    </>,
  );
}

export function SearchIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <circle cx="11" cy="11" r="6" />
      <line x1="20" y1="20" x2="15.5" y2="15.5" />
    </>,
  );
}

export function MenuIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </>,
  );
}

export function ArrowRightIcon({ className = "h-5 w-5" }: IconProps) {
  return SVG(
    className,
    <>
      <line x1="4" y1="12" x2="19" y2="12" />
      <path d="M13 6l6 6-6 6" />
    </>,
  );
}
