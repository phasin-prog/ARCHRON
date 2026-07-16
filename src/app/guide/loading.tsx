import { SkeletonPageHeader, SkeletonCard } from "@/components/skeleton";

export default function GuideLoading() {
  return (
    <main className="pb-24">
      <section className="border-b py-20">
        <div className="tpl-reference">
          <SkeletonPageHeader titleWidth="w-64" leadWidth="w-full" />
        </div>
      </section>
      <section className="tpl-reference py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="กำลังโหลดคำแนะนำ">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
