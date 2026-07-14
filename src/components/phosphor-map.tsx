// Phosphor duotone icon mappings — standard UI icons
// Each maps an Archron icon name to a Phosphor duotone variant
// Props passthrough: className, style — consumer API unchanged

import type { IconProps } from "@/components/icons";
import {
  ArrowRight,
  ArrowSquareOut,
  BookOpen,
  CaretDown,
  ClockCounterClockwise,
  Graph,
  Heart,
  List,
  MagnifyingGlass,
  PencilSimple,
  Question,
  Quotes,
  Scroll,
  SignIn,
  SignOut,
  User,
  X,
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
