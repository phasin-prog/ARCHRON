import React from "react";
import {
  ConceptIcon, PersonIcon, BookIcon, SchoolIcon, SymbolIcon,
  TermIcon, SourceIcon, QuoteIcon, EditIcon, CheckIcon,
  ClockIcon, ArrowLeftIcon, ArrowRightIcon, CloseIcon, LogoutIcon,
  EyeIcon, TrendingUpIcon, MoreIcon, ShuffleIcon, AchievementBadgeIcon,
} from "@/components/icons";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  concept: ConceptIcon,
  person: PersonIcon,
  book: BookIcon,
  school: SchoolIcon,
  symbol: SymbolIcon,
  term: TermIcon,
  source: SourceIcon,
  quote: QuoteIcon,
  edit: EditIcon,
  check: CheckIcon,
  clock: ClockIcon,
  arrow_left: ArrowLeftIcon,
  arrow_right: ArrowRightIcon,
  close: CloseIcon,
  logout: LogoutIcon,
  eye: EyeIcon,
  trending: TrendingUpIcon,
  more: MoreIcon,
  shuffle: ShuffleIcon,
  achievement: AchievementBadgeIcon,
};

type IconComponent = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

export function resolveIcon(name: string): IconComponent | null {
  return ICON_MAP[name] ?? null;
}

export type { IconComponent };
