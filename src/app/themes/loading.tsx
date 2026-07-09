import { SkeletonPageHeader, SkeletonCard } from "@/components/skeleton";

export default function ThemesLoading() {
  return (
    <main className="pb-24">
      <div className="mx-auto max-w-5xl px-6 pt-16">
        <SkeletonPageHeader />
        <div className="grid gap-4 sm:grid-cols-2" role="status" aria-label="กำลังโหลดแก่นเรื่อง">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
