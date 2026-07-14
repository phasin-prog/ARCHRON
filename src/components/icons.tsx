export type IconProps = { className?: string; style?: React.CSSProperties };

// All icons delegated to Phosphor duotone
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
  KnowledgeHubIcon,
  SynthesisIcon,
  PathIcon,
  RootIcon,
  SchoolIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  BookmarkActiveIcon,
  BookmarkIcon,
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CollectionIcon,
  CopyIcon,
  FilterIcon,
  GridIcon,
  HomeIcon,
  LibraryIcon,
  MoreIcon,
  NotificationIcon,
  ProfileIcon,
  ShareIcon,
  SortIcon,
  SourcesIcon,
  // Discipline rings
  PsychologyIcon,
  PhilosophyIcon,
  AnthropologyIcon,
  LanguageIcon,
  MythologyIcon,
  ReligionIcon,
  ScienceIcon,
  SymbolismIcon,
  ArtIcon,
  AIFutureIcon,
  CivilizationIcon,
  // Content types
  SymbolIcon,
  TermIcon,
  SourceIcon,
  // Manifesto section
  PreambleIcon,
  WhyExistIcon,
  WhatStudyIcon,
  WhatBelieveIcon,
  OurMethodIcon,
  WhatRejectIcon,
  WhatOfferIcon,
  OurResponsibilityIcon,
  OurLegacyIcon,
  ClosingDeclIcon,
  // Reading page section
  VisualMeaningIcon,
  ScholarIcon,
  RealExampleIcon,
  SourceRefIcon,
  AuthorPenIcon,
  // Badges
  LevelBadgeIcon,
  AchievementBadgeIcon,
  ReadingSetBadgeIcon,
  SourceBadgeIcon,
  LanternBadgeIcon,
  LanternIcon,
  ReadingSetIcon,
  // Source types
  PrimarySourceIcon,
  SecondarySourceIcon,
  InterpretationIcon,
} from "@/components/phosphor-map";

// ARCHRON mark — วงกลมเปิด (ความรู้ไม่สิ้นสุด) + จุดศูนย์กลาง (มนุษย์)
export function ArchronMark({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="currentColor" opacity={0.4} />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ARCHRON Logomark — vesica: วงรอบ (อารยธรรม) + สองวงซ้อน (จุดตัดของศาสตร์) + จุดศูนย์กลาง (มนุษย์)
export function ArchronLogomark({ className = "h-7 w-7" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="currentColor" opacity={0.4} />
      <circle cx="17.5" cy="24" r="12.5" fill="currentColor" />
      <circle cx="30.5" cy="24" r="12.5" fill="currentColor" />
      <circle cx="24" cy="3.5" r="1.4" fill="currentColor" />
      <circle cx="24" cy="44.5" r="1.4" fill="currentColor" />
      <circle cx="24" cy="24" r="2.6" fill="currentColor" />
    </svg>
  );
}
