import Link from "next/link";
import type { ContentEntry } from "@/types/content";
import { disciplineMeta } from "@/components/discipline-meta";

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
      className="archron-card group block p-6 transition-all duration-300 hover:border-accent/45 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      {/* Field Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: `${meta.accent}1a`,
            color: meta.accent,
          }}
        >
          <Icon className="h-3 w-3" />
          {meta.label}
        </span>
        {anyEntry.year && (
          <span className="text-[10px] text-text-secondary/50">
            {anyEntry.year}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl font-medium text-text-heading group-hover:text-accent transition-colors">
        {entry.title}
      </h3>

      {/* Author */}
      {entry.mainThinkers && entry.mainThinkers.length > 0 && (
        <p className="mt-1 text-xs text-text-secondary/60">
          {entry.mainThinkers.join(", ")}
        </p>
      )}

      {/* Description */}
      {entry.shortDescription && (
        <p className="mt-3 text-sm text-text-secondary/70 line-clamp-3">
          {entry.shortDescription}
        </p>
      )}

      {/* Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {entry.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-bg-card/50 px-2 py-0.5 text-[10px] text-text-secondary/60"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Arrow */}
      <div className="mt-4 flex items-center gap-1 text-xs text-accent/70 opacity-0 group-hover:opacity-100 transition-opacity">
        <span>อ่านรายละเอียด</span>
        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
      </div>
    </Link>
  );
}
