// ARCHRON Color System — Single JS Source of Truth
// Must stay in sync with app/globals.css @theme block
// ใช้ใน JS/TS contexts ที่ var(--color-*) ใช้ไม่ได้

export const colors = {
  // Neutral Canvas
  bg: "#F9F5F3",
  bgCard: "#FFFFFF",
  bgElevated: "#EDEBE9",
  border: "#D7D5D3",
  textHeading: "#1A1815",
  textBody: "#3A3835",
  textSecondary: "#65625C",
  textInverse: "#FFFFFF",

  // Academic Accent
  accent: "#8C1515",
  accentHover: "#6B1010",

  // Premium
  premium: "#B89A63",
  premiumHover: "#C8AA73",

  // Knowledge Categories
  concept: "#7BA3D4",
  thinker: "#7AB57A",
  theory: "#A89AC8",
  school: "#7AACAC",
  book: "#D4A96A",
  article: "#C48A9A",
  symbol: "#D4B050",
  timeline: "#8A9AAA",
  quote: "#9ABA9A",
  guide: "#8A9AC8",

  // Semantic
  success: "#6AAA7A",
  warning: "#D4AA50",
  error: "#CC7A7A",
  info: "#7A8ABA",

  // Shared Content Palette
  steelBlue: "#6E93A8",
  sageDarker: "#8AA395",
  amberGold: "#C9A24A",
  tealGreen: "#7FB08A",
  silverGray: "#B9C2CE",
  ashGray: "#9A948A",
  ochreGold: "#CBA45A",
  neutralMuted: "#858992",
  goldAccent: "#C49B55",
  mutedSlate: "#6A7A8A",

  // Cosmology
  warmGray: "#8A8780",
  softBlue: "#5B7FAB",
  warmGold: "#C4A040",
  amberBrown: "#B58A5A",
  forestGreen: "#5A8A6A",
  sageGreen: "#7A9A7A",
  roseMuted: "#AB6B7A",
  indigoSoft: "#6A7AB5",

  // Status & Difficulty
  redMuted: "#B55A5A",
  amberDark: "#C48A30",
  greenForest: "#4A8A5A",
  blueSlate: "#5A7AAA",

  // Seal Progression
  slateDark: "#465264",
  cardinalAcademic: "#8C3030",
  silverLight: "#C7D0DB",
} as const;

export type ColorKey = keyof typeof colors;
