import Link from "next/link";
import type { ReactNode } from "react";
import { getConceptBySlug, conceptTitle } from "@/lib/content/concept-registry";
import type { RelationType } from "@/types/content";
import {
  ConceptIcon,
  PersonIcon,
  BookIcon,
  SchoolIcon,
  SymbolIcon,
  TermIcon,
  SourceIcon,
  ArrowRightIcon,
} from "@/components/icons";

export type CardVariant =
  | "article"
  | "concept"
  | "person"
  | "book"
  | "school"
  | "symbol"
  | "term";

const RELATION_LABEL: Record<RelationType, string> = {
  prerequisite: "ควรอ่านก่อน",
  related: "เกี่ยวข้องโดยตรง",
  "contrasts-with": "เปรียบเทียบ / ต่าง",
  "part-of": "เป็นส่วนหนึ่งของ",
  "source-of": "แหล่งที่มา",
  "used-in": "ถูกใช้ใน",
  "influenced-by": "ได้รับอิทธิพลจาก",
};

const VARIANT_ICON: Record<CardVariant, (props: { className?: string }) => ReactNode> = {
  article: SourceIcon,
  concept: ConceptIcon,
  person: PersonIcon,
  book: BookIcon,
  school: SchoolIcon,
  symbol: SymbolIcon,
  term: TermIcon,
};

const VARIANT_HREF = (variant: CardVariant, slug: string): string => {
  const base = {
    article: "/articles",
    concept: "/concepts",
    person: "/concepts",
    book: "/concepts",
    school: "/concepts",
    symbol: "/concepts",
    term: "/concepts",
  }[variant];
  return `${base}/${slug}`;
};

const VARIANT_LABEL: Record<CardVariant, string> = {
  article: "บทความ",
  concept: "แนวคิด",
  person: "นักคิด",
  book: "หนังสือ",
  school: "สำนักคิด",
  symbol: "สัญลักษณ์",
  term: "คำศัพท์",
};

export function variantFromNodeType(nodeType: string): CardVariant {
  switch (nodeType) {
    case "article": return "article";
    case "concept": return "concept";
    case "person":  return "person";
    case "book":    return "book";
    case "school":  return "school";
    case "symbol":  return "symbol";
    case "term":    return "term";
    default:        return "concept";
  }
}

type ContentCardProps = {
  slug: string;
  variant?: CardVariant;
  relationType?: RelationType;
  reason?: string;
  className?: string;
  stagger?: number;
};

export function ContentCard({
  slug,
  variant,
  relationType,
  reason,
  className = "",
  stagger = 1,
}: ContentCardProps) {
  const item = getConceptBySlug(slug);
  const v = variant ?? (item ? variantFromNodeType(item.nodeType) : "concept");
  const Icon = VARIANT_ICON[v];
  const href = VARIANT_HREF(v, slug);
  const title = item?.thaiTitle ?? item?.title ?? conceptTitle(slug) ?? slug;
  const typeLabel = VARIANT_LABEL[v];

  // จำกัด reason ให้สั้น
  const shortReason = reason && reason.length > 120 ? reason.slice(0, 117) + "…" : reason;

  return (
    <Link
      href={href}
      className={`archron-card archron-card--${v} scroll-reveal stagger-${Math.min(stagger, 6)} group flex flex-col justify-between p-5.5 sm:p-6 ${className}`}
    >
      <div>
        {/* Header Row: Type Badge + Action Arrow */}
        <div className="mb-3.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--card-accent)]/20 bg-[var(--card-accent)]/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-[var(--card-accent)]">
            <Icon className="h-3.5 w-3.5" />
            {typeLabel}
          </span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/40 text-text-secondary/60 transition-all duration-300 group-hover:border-[var(--card-accent)]/40 group-hover:bg-[var(--card-accent)]/10 group-hover:text-[var(--card-accent)] group-hover:translate-x-0.5">
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-medium leading-snug tracking-tight text-text-heading break-words transition-colors duration-200 group-hover:text-[var(--card-accent)]">
          {title}
        </h3>
      </div>

      {/* Footer / Relation & Reason */}
      {(relationType || shortReason) && (
        <div className="mt-4 border-t border-border/40 pt-3">
          {relationType && (
            <span className="mb-1.5 inline-flex items-center rounded-md border border-[var(--card-accent)]/30 bg-[var(--card-accent)]/5 px-2 py-0.5 text-[11px] font-medium text-[var(--card-accent)]">
              {RELATION_LABEL[relationType]}
            </span>
          )}
          {shortReason && (
            <p className="text-xs leading-relaxed text-text-secondary line-clamp-2">
              {shortReason}
            </p>
          )}
        </div>
      )}
    </Link>
  );
}

type ContentCardListProps = {
  items: {
    slug: string;
    relationType?: RelationType;
    reason?: string;
  }[];
  className?: string;
};

export function ContentCardList({ items, className = "" }: ContentCardListProps) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {items.map((item, i) => (
        <ContentCard
          key={item.slug}
          slug={item.slug}
          relationType={item.relationType}
          reason={item.reason}
          stagger={i + 1}
        />
      ))}
    </div>
  );
}
