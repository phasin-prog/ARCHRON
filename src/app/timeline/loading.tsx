import { SkeletonPageHeader, SkeletonCard } from "@/components/skeleton";

export default function TimelineLoading() {
  return (
    <main className="pb-24">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <SkeletonPageHeader />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="กำลังโหลดเส้นเวลา">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
