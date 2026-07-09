import type { Metadata } from "next";
import {
  ArchronMark,
  ArchronLogomark,
  ConceptIcon,
  PersonIcon,
  BookIcon,
  SchoolIcon,
  SymbolIcon,
  TermIcon,
  SourceIcon,
  PathIcon,
  SearchIcon,
  MenuIcon,
  ArrowRightIcon,
  KnowledgeHubIcon,
  ManifestoIcon,
  QuoteIcon,
  ExternalLinkIcon,
  HelpIcon,
  HeartIcon,
  CloseIcon,
  LoginIcon,
  EditIcon,
  LogoutIcon,
  PsychologyIcon,
  PhilosophyIcon,
  AnthropologyIcon,
  HistoryIcon,
  LanguageIcon,
  MythologyIcon,
  ReligionIcon,
  ScienceIcon,
  SymbolismIcon,
  ArtIcon,
  AIFutureIcon,
  CivilizationIcon,
  VisualMeaningIcon,
  ScholarIcon,
  RealExampleIcon,
  SourceRefIcon,
  RootIcon,
  AuthorPenIcon,
  CalendarIcon,
  ClockIcon,
  SynthesisIcon,
  GridIcon,
  CollectionIcon,
  NotificationIcon,
} from "@/components/icons";
import { IconBox } from "@/components/icon-box";

export const metadata: Metadata = {
  title: "ไอคอนทั้งหมด — ARCHRON",
  description: "ชุดไอคอน SVG ทั้งหมดของ ARCHRON",
};

const ALL_ICONS: { name: string; component: React.ComponentType<{ className?: string }> }[] = [
  { name: "ArchronMark", component: ArchronMark },
  { name: "ArchronLogomark", component: ArchronLogomark },
  { name: "ConceptIcon", component: ConceptIcon },
  { name: "PersonIcon", component: PersonIcon },
  { name: "BookIcon", component: BookIcon },
  { name: "SchoolIcon", component: SchoolIcon },
  { name: "SymbolIcon", component: SymbolIcon },
  { name: "TermIcon", component: TermIcon },
  { name: "SourceIcon", component: SourceIcon },
  { name: "PathIcon", component: PathIcon },
  { name: "SearchIcon", component: SearchIcon },
  { name: "MenuIcon", component: MenuIcon },
  { name: "ArrowRightIcon", component: ArrowRightIcon },
  { name: "KnowledgeHubIcon", component: KnowledgeHubIcon },
  { name: "ManifestoIcon", component: ManifestoIcon },
  { name: "QuoteIcon", component: QuoteIcon },
  { name: "ExternalLinkIcon", component: ExternalLinkIcon },
  { name: "HelpIcon", component: HelpIcon },
  { name: "HeartIcon", component: HeartIcon },
  { name: "CloseIcon", component: CloseIcon },
  { name: "LoginIcon", component: LoginIcon },
  { name: "EditIcon", component: EditIcon },
  { name: "LogoutIcon", component: LogoutIcon },
  { name: "PsychologyIcon", component: PsychologyIcon },
  { name: "PhilosophyIcon", component: PhilosophyIcon },
  { name: "AnthropologyIcon", component: AnthropologyIcon },
  { name: "HistoryIcon", component: HistoryIcon },
  { name: "LanguageIcon", component: LanguageIcon },
  { name: "MythologyIcon", component: MythologyIcon },
  { name: "ReligionIcon", component: ReligionIcon },
  { name: "ScienceIcon", component: ScienceIcon },
  { name: "SymbolismIcon", component: SymbolismIcon },
  { name: "ArtIcon", component: ArtIcon },
  { name: "AIFutureIcon", component: AIFutureIcon },
  { name: "CivilizationIcon", component: CivilizationIcon },
  { name: "VisualMeaningIcon", component: VisualMeaningIcon },
  { name: "ScholarIcon", component: ScholarIcon },
  { name: "RealExampleIcon", component: RealExampleIcon },
  { name: "SourceRefIcon", component: SourceRefIcon },
  { name: "RootIcon", component: RootIcon },
  { name: "AuthorPenIcon", component: AuthorPenIcon },
  { name: "CalendarIcon", component: CalendarIcon },
  { name: "ClockIcon", component: ClockIcon },
  { name: "SynthesisIcon", component: SynthesisIcon },
  { name: "GridIcon", component: GridIcon },
  { name: "CollectionIcon", component: CollectionIcon },
  { name: "NotificationIcon", component: NotificationIcon },
];

const CATEGORIES: { label: string; names: string[] }[] = [
  {
    label: "Knowledge Objects",
    names: ["ConceptIcon", "PersonIcon", "BookIcon", "SchoolIcon", "SymbolIcon", "CollectionIcon", "PathIcon", "TermIcon"],
  },
  {
    label: "Domains",
    names: ["PsychologyIcon", "PhilosophyIcon", "AnthropologyIcon", "HistoryIcon", "LanguageIcon", "MythologyIcon", "ReligionIcon", "ScienceIcon", "SymbolismIcon", "ArtIcon", "AIFutureIcon", "CivilizationIcon"],
  },
  {
    label: "Actions",
    names: ["SearchIcon", "MenuIcon", "ArrowRightIcon", "CloseIcon", "LoginIcon", "EditIcon", "LogoutIcon", "ExternalLinkIcon", "HeartIcon", "HelpIcon", "NotificationIcon", "GridIcon", "SynthesisIcon"],
  },
  {
    label: "Brand & Meta",
    names: ["ArchronMark", "ArchronLogomark", "KnowledgeHubIcon", "ManifestoIcon", "QuoteIcon", "SourceIcon", "SourceRefIcon", "ScholarIcon", "RealExampleIcon", "RootIcon", "AuthorPenIcon", "VisualMeaningIcon", "CalendarIcon", "ClockIcon"],
  },
];

export default function IconsPage() {
  return (
    <main className="tpl-reference py-16">
      <h1 className="font-heading text-3xl text-text-heading">ชุดไอคอน ARCHRON</h1>
      <p className="mt-2 text-sm text-text-secondary">
        ไอคอน SVG ทั้งหมด {ALL_ICONS.length} ตัว — ใช้ currentColor, 2px stroke, 24×24 viewBox
      </p>

      {CATEGORIES.map((cat) => (
        <section key={cat.label} className="mt-12">
          <h2 className="font-heading text-xl text-text-heading">{cat.label}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {cat.names.map((name) => {
              const icon = ALL_ICONS.find((i) => i.name === name);
              if (!icon) return null;
              const Icon = icon.component;
              return (
                <div
                  key={name}
                  className="flex flex-col items-center gap-3 rounded-lg border border-border bg-bg-card p-4"
                >
                  <IconBox icon={<Icon className="h-6 w-6" />} size="sm" />
                  <span className="font-ui text-xs text-text-secondary">{name}</span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
