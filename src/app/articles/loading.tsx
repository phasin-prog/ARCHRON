import { SkeletonCard } from "@/components/skeleton";

export default function ArticlesLoading() {
  return (
    <main className="pb-24">
      <div className="tpl-reference pt-16">
        <div className="mb-10 space-y-3">
          <div className="h-4 w-20 animate-pulse rounded bg-surface-3" />
          <div className="h-10 w-48 animate-pulse rounded bg-surface-3" />
          <div className="h-5 w-96 animate-pulse rounded bg-surface-3" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
