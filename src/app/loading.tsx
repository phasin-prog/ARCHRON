import { SkeletonHomeHero, SkeletonCard } from "@/components/skeleton";

export default function HomeLoading() {
  return (
    <main>
      <SkeletonHomeHero />
      <div className="mx-auto max-w-[1200px] px-6 pb-24">
        <div className="mb-8 space-y-3">
          <div className="h-6 w-40 animate-pulse rounded bg-surface-3" />
          <div className="h-4 w-64 animate-pulse rounded bg-surface-3" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="status" aria-label="กำลังโหลดเนื้อหาล่าสุด">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
