"use client";

// Phosphor duotone icon mappings — standard UI icons
// Each maps an Archron icon name to a Phosphor duotone variant
// Props passthrough: className, style — consumer API unchanged

import type { IconProps } from "@/components/icons";
import {
  ArrowRight,
  ArrowSquareOut,
  BookOpen,
  Buildings,
  CaretDown,
  ClockCounterClockwise,
  Graph,
  Heart,
  IntersectThree,
  List,
  MagnifyingGlass,
  Path,
  PencilSimple,
  Question,
  Quotes,
  Scroll,
  ShareNetwork,
  SignIn,
  SignOut,
  Tree,
  User,
  X,
  CaretLeft,
  CaretRight,
  ArrowLeft,
  ArrowUp,
  Bell,
  Check,
  House,
  Funnel,
  SortAscending,
  Copy,
  Share,
  BookmarkSimple,
  Clock,
  Calendar,
  DotsThree,
  UserCircle,
  Books,
  SquaresFour,
  GridFour,
  Files,
  // Discipline rings
  Brain,
  Scales,
  PersonSimple,
  Translate,
  Lightning,
  Church,
  Atom,
  Shapes,
  PaintBrush,
  Robot,
  Globe,
  // Content types
  Diamond,
  Tag,
  FileText,
  // Manifesto
  BookOpenText,
  HandHeart,
  Wrench,
  Prohibit,
  Gift,
  ShieldCheck,
  Plant,
  CheckCircle,
  // Reading page
  Eye,
  GraduationCap,
  Lightbulb,
  Pen,
  // Badges
  Star,
  Trophy,
  Certificate,
  Flame,
  // Source types
  ChatDots,
} from "@phosphor-icons/react";

export function SearchIcon({ className = "h-5 w-5", style }: IconProps) {
  return <MagnifyingGlass className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function MenuIcon({ className = "h-5 w-5", style }: IconProps) {
  return <List className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ArrowRightIcon({ className = "h-5 w-5", style }: IconProps) {
  return <ArrowRight className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function CloseIcon({ className = "h-5 w-5", style }: IconProps) {
  return <X className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function LoginIcon({ className = "h-5 w-5", style }: IconProps) {
  return <SignIn className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function EditIcon({ className = "h-5 w-5", style }: IconProps) {
  return <PencilSimple className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function LogoutIcon({ className = "h-5 w-5", style }: IconProps) {
  return <SignOut className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ExternalLinkIcon({ className = "h-5 w-5", style }: IconProps) {
  return <ArrowSquareOut className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function HelpIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Question className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function HeartIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Heart className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ManifestoIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Scroll className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function QuoteIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Quotes className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function BookIcon({ className = "h-5 w-5", style }: IconProps) {
  return <BookOpen className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ConceptIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Graph className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function PersonIcon({ className = "h-5 w-5", style }: IconProps) {
  return <User className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ChevronDownIcon({ className = "h-5 w-5", style }: IconProps) {
  return <CaretDown className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function HistoryIcon({ className = "h-5 w-5", style }: IconProps) {
  return <ClockCounterClockwise className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function KnowledgeHubIcon({ className = "h-5 w-5", style }: IconProps) {
  return <ShareNetwork className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function SynthesisIcon({ className = "h-5 w-5", style }: IconProps) {
  return <IntersectThree className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function PathIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Path className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function RootIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Tree className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function SchoolIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Buildings className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ChevronLeftIcon({ className = "h-5 w-5", style }: IconProps) {
  return <CaretLeft className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ChevronRightIcon({ className = "h-5 w-5", style }: IconProps) {
  return <CaretRight className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ArrowLeftIcon({ className = "h-5 w-5", style }: IconProps) {
  return <ArrowLeft className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ArrowUpIcon({ className = "h-5 w-5", style }: IconProps) {
  return <ArrowUp className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function NotificationIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Bell className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function CheckIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Check className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function HomeIcon({ className = "h-5 w-5", style }: IconProps) {
  return <House className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function FilterIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Funnel className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function SortIcon({ className = "h-5 w-5", style }: IconProps) {
  return <SortAscending className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function CopyIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Copy className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ShareIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Share className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function BookmarkIcon({ className = "h-5 w-5", style }: IconProps) {
  return <BookmarkSimple className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function BookmarkActiveIcon({ className = "h-5 w-5", style }: IconProps) {
  return <BookmarkSimple className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ClockIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Clock className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function CalendarIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Calendar className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function MoreIcon({ className = "h-5 w-5", style }: IconProps) {
  return <DotsThree className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ProfileIcon({ className = "h-5 w-5", style }: IconProps) {
  return <UserCircle className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function LibraryIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Books className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function GridIcon({ className = "h-5 w-5", style }: IconProps) {
  return <SquaresFour className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function CollectionIcon({ className = "h-5 w-5", style }: IconProps) {
  return <GridFour className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function SourcesIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Files className={className} style={style} weight="duotone" aria-hidden="true" />;
}

// ── Discipline rings ──

export function PsychologyIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Brain className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function PhilosophyIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Scales className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function AnthropologyIcon({ className = "h-5 w-5", style }: IconProps) {
  return <PersonSimple className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function LanguageIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Translate className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function MythologyIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Lightning className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ReligionIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Church className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ScienceIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Atom className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function SymbolismIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Shapes className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ArtIcon({ className = "h-5 w-5", style }: IconProps) {
  return <PaintBrush className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function AIFutureIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Robot className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function CivilizationIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Globe className={className} style={style} weight="duotone" aria-hidden="true" />;
}

// ── Content types ──

export function SymbolIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Diamond className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function TermIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Tag className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function SourceIcon({ className = "h-5 w-5", style }: IconProps) {
  return <FileText className={className} style={style} weight="duotone" aria-hidden="true" />;
}

// ── Manifesto section ──

export function PreambleIcon({ className = "h-6 w-6", style }: IconProps) {
  return <BookOpenText className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function WhyExistIcon({ className = "h-6 w-6", style }: IconProps) {
  return <Question className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function WhatStudyIcon({ className = "h-6 w-6", style }: IconProps) {
  return <MagnifyingGlass className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function WhatBelieveIcon({ className = "h-6 w-6", style }: IconProps) {
  return <HandHeart className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function OurMethodIcon({ className = "h-6 w-6", style }: IconProps) {
  return <Wrench className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function WhatRejectIcon({ className = "h-6 w-6", style }: IconProps) {
  return <Prohibit className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function WhatOfferIcon({ className = "h-6 w-6", style }: IconProps) {
  return <Gift className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function OurResponsibilityIcon({ className = "h-6 w-6", style }: IconProps) {
  return <ShieldCheck className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function OurLegacyIcon({ className = "h-6 w-6", style }: IconProps) {
  return <Plant className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ClosingDeclIcon({ className = "h-6 w-6", style }: IconProps) {
  return <CheckCircle className={className} style={style} weight="duotone" aria-hidden="true" />;
}

// ── Reading page section ──

export function VisualMeaningIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Eye className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ScholarIcon({ className = "h-5 w-5", style }: IconProps) {
  return <GraduationCap className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function RealExampleIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Lightbulb className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function SourceRefIcon({ className = "h-5 w-5", style }: IconProps) {
  return <FileText className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function AuthorPenIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Pen className={className} style={style} weight="duotone" aria-hidden="true" />;
}

// ── Badges ──

export function LevelBadgeIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Star className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function AchievementBadgeIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Trophy className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ReadingSetBadgeIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Books className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function SourceBadgeIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Certificate className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function LanternBadgeIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Flame className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function LanternIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Flame className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function ReadingSetIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Books className={className} style={style} weight="duotone" aria-hidden="true" />;
}

// ── Source types ──

export function PrimarySourceIcon({ className = "h-5 w-5", style }: IconProps) {
  return <FileText className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function SecondarySourceIcon({ className = "h-5 w-5", style }: IconProps) {
  return <Files className={className} style={style} weight="duotone" aria-hidden="true" />;
}

export function InterpretationIcon({ className = "h-5 w-5", style }: IconProps) {
  return <ChatDots className={className} style={style} weight="duotone" aria-hidden="true" />;
}
