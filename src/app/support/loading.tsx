import { SkeletonPageHeader, SkeletonCard } from "@/components/skeleton";

export default function SupportLoading() {
  return (
    <main className="pb-24">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <SkeletonPageHeader />
        <div className="grid gap-4 md:grid-cols-3" role="status" aria-label="กำลังโหลด">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
