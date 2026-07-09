import { SkeletonPageHeader, SkeletonCard } from "@/components/skeleton";

export default function GuideLoading() {
  return (
    <main className="pb-24">
      <section className="border-b px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <SkeletonPageHeader titleWidth="w-64" leadWidth="w-full" />
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="กำลังโหลดคำแนะนำ">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
