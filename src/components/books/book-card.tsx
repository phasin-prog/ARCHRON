import Link from "next/link";
import type { ContentEntry } from "@/types/content";
import { disciplineMeta } from "@/components/discipline-meta";
import { ArrowRightIcon } from "@/components/icons";

interface BookCardProps {
  entry: ContentEntry;
}

export function BookCard({ entry }: BookCardProps) {
  const anyEntry = entry as Record<string, any>;
  const meta = disciplineMeta(anyEntry.field || "philosophy");
  const Icon = meta.Icon;

  return (
    <Link
      href={`/books/${entry.slug}`}
      className="archron-card archron-card--book group relative flex flex-col justify-between p-6 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      style={{ "--card-accent": meta.accent } as React.CSSProperties}
    >
      <div>
        {/* Field Badge & Year Row */}
        <div className="mb-3.5 flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide border"
            style={{
              backgroundColor: `${meta.accent}14`,
              borderColor: `${meta.accent}33`,
              color: meta.accent,
            }}
          >
            <Icon className="h-3.5 w-3.5" />
            {meta.label}
          </span>
          {anyEntry.year && (
            <span className="font-serif text-xs font-medium text-text-secondary/70">
              {anyEntry.year}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl font-medium leading-snug tracking-tight text-text-heading transition-colors duration-200 group-hover:text-[var(--card-accent)]">
          {entry.title}
        </h3>

        {/* Author */}
        {entry.mainThinkers && entry.mainThinkers.length > 0 && (
          <p className="mt-1.5 text-xs font-medium tracking-wide text-text-secondary/80">
            {entry.mainThinkers.join(" · ")}
          </p>
        )}

        {/* Description */}
        {entry.shortDescription && (
          <p className="mt-3 text-xs leading-relaxed text-text-secondary line-clamp-3">
            {entry.shortDescription}
          </p>
        )}
      </div>

      <div>
        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-border/30">
            {entry.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border/40 bg-bg-card/80 px-2 py-0.5 text-[10px] font-medium text-text-secondary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Indicator */}
        <div className="mt-3.5 flex items-center justify-between text-xs font-medium text-text-secondary/70 transition-colors group-hover:text-[var(--card-accent)]">
          <span>อ่านเนื้อหาและบทวิเคราะห์</span>
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border/40 transition-transform duration-300 group-hover:border-[var(--card-accent)]/40 group-hover:bg-[var(--card-accent)]/10 group-hover:translate-x-0.5">
            <ArrowRightIcon className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
