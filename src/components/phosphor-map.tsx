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
