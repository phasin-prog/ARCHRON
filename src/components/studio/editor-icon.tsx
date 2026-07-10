"use client";

import {
  ConceptIcon, PersonIcon, BookIcon, SchoolIcon, SymbolIcon,
  TermIcon, SourceIcon, QuoteIcon, EditIcon, CheckIcon,
  ClockIcon, ArrowLeftIcon, CloseIcon, ArrowRightIcon, LogoutIcon,
} from "@/components/icons";

type Props = {
  name: string;
  accent?: string;
  className?: string;
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  psychology: ConceptIcon,
  person: PersonIcon,
  menu_book: BookIcon,
  groups_2: SchoolIcon,
  category: SymbolIcon,
  tag: TermIcon,
  newspaper: SourceIcon,
  article: SourceIcon,
  format_quote: QuoteIcon,
  edit_note: EditIcon,
  check_circle: CheckIcon,
  verified: CheckIcon,
  schedule: ClockIcon,
  report: ClockIcon,
  inventory_2: ClockIcon,
  eco: ConceptIcon,
  language: SourceIcon,
  layers: BookIcon,
  arrow_left: ArrowLeftIcon,
  arrow_right: ArrowRightIcon,
  close: CloseIcon,
  logout: LogoutIcon,
  shield_person: EditIcon,
};

export function EditorIcon({ name, accent, className = "h-5 w-5" }: Props) {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        style={{ color: accent }}
        aria-hidden="true"
      >
        ◆
      </span>
    );
  }
  return <IconComponent className={className} style={accent ? { color: accent } : undefined} />;
}
