import type { AcademicSeal } from "@/lib/content/seals";

interface SealIconProps {
  seal: AcademicSeal;
  size?: number;
  isLocked?: boolean;
  className?: string;
}

const SHAPE_PATHS: Record<AcademicSeal["shape"], string> = {
  circle: "M 32 4 A 28 28 0 1 1 32 60 A 28 28 0 1 1 32 4 Z",
  octagon:
    "M 32 4 L 50 10 L 60 32 L 50 54 L 32 60 L 14 54 L 4 32 L 14 10 Z",
  hexagon: "M 32 4 L 56 18 L 56 46 L 32 60 L 8 46 L 8 18 Z",
  diamond: "M 32 4 L 60 32 L 32 60 L 4 32 Z",
  compass:
    "M 32 4 L 36 28 L 60 32 L 36 36 L 32 60 L 28 36 L 4 32 L 28 28 Z",
};

const SYMBOL_PATHS: Record<string, string> = {
  "the-seeker": "M 32 30 A 2 2 0 1 1 32 34 A 2 2 0 1 1 32 30 Z",
  "the-reader": "M 22 24 L 42 24 M 22 32 L 42 32 M 22 40 L 42 40",
  "the-collector":
    "M 24 26 A 2 2 0 1 1 24 30 M 32 26 A 2 2 0 1 1 32 30 M 40 26 A 2 2 0 1 1 40 30 M 24 38 A 2 2 0 1 1 24 42 M 32 38 A 2 2 0 1 1 32 42 M 40 38 A 2 2 0 1 1 40 42",
  "the-scholar": "M 32 20 L 32 44 M 20 32 L 44 32",
  "the-analyst": "M 32 20 L 32 44 M 20 32 L 44 32 M 24 24 L 40 40 M 40 24 L 24 40",
  "the-explorer":
    "M 32 16 L 34 30 L 48 32 L 34 34 L 32 48 L 30 34 L 16 32 L 30 30 Z",
  "the-archivist": "M 20 22 L 44 22 M 20 32 L 44 32 M 20 42 L 44 42",
  "the-cartographer":
    "M 32 18 L 32 46 M 18 32 L 46 32 M 22 22 L 42 42 M 42 22 L 22 46",
  "the-curator": "M 32 20 L 40 32 L 32 44 L 24 32 Z",
  "the-sage":
    "M 32 28 A 2 2 0 1 1 32 32 M 24 20 L 32 28 L 40 20 M 24 44 L 32 36 L 40 44 M 18 32 L 24 32 M 40 32 L 46 32",
  "the-navigator":
    "M 32 20 A 12 12 0 0 1 44 32 A 12 12 0 0 1 32 44 A 12 12 0 0 1 20 32 A 12 12 0 0 1 32 20 M 32 16 L 32 20 M 32 44 L 32 48 M 16 32 L 20 32 M 44 32 L 48 32",
  "the-luminary":
    "M 32 28 A 2 2 0 1 1 32 32 M 28 20 L 32 28 L 36 20 M 20 28 L 28 30 L 20 34 M 44 28 L 36 30 L 44 34 M 28 44 L 32 36 L 36 44",
  "the-architect":
    "M 32 18 L 32 46 M 18 32 L 46 32 M 24 24 L 40 40 M 40 24 L 24 40 M 32 18 L 40 32 L 32 46 L 24 32 Z",
  "the-companion":
    "M 32 22 A 6 6 0 1 1 32 34 A 6 6 0 1 1 32 22 M 32 16 L 34 28 L 48 32 L 34 34 L 32 48 L 30 34 L 16 32 L 30 28 Z",
  "the-patron":
    "M 32 18 L 36 26 L 44 26 L 38 32 L 40 40 L 32 36 L 24 40 L 26 32 L 20 26 L 28 26 Z",
};

export function SealIcon({ seal, size = 64, isLocked = false, className = "" }: SealIconProps) {
  const shapePath = SHAPE_PATHS[seal.shape];
  const symbolPath = SYMBOL_PATHS[seal.id] ?? "";
  const color = seal.color;
  const opacity = isLocked ? 0.3 : 1;
  const filter = isLocked ? "grayscale(1)" : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity, filter }}
      role="img"
      aria-label={`${seal.nameThai} — ${seal.description}`}
    >
      <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={shapePath} />
        <path d={symbolPath} />
        <text
          x="32"
          y="14"
          fontSize="4"
          textAnchor="middle"
          fill={color}
          stroke="none"
          fontFamily="var(--font-ui)"
          letterSpacing="0.5"
        >
          ARCHRON
        </text>
      </g>
    </svg>
  );
}
