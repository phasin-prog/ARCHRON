import { SkeletonPageHeader, SkeletonCard } from "@/components/skeleton";

export default function DisciplinesLoading() {
  return (
    <main className="pb-24">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <SkeletonPageHeader />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="กำลังโหลดศาสตร์">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
