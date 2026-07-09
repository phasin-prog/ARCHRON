import { SkeletonPageHeader, SkeletonCard } from "@/components/skeleton";

export default function SourcesLoading() {
  return (
    <main className="pb-24">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <SkeletonPageHeader />
        <div className="space-y-12">
          <section>
            <div className="grid gap-[18px] md:grid-cols-3" role="status" aria-label="กำลังโหลดแหล่งอ้างอิง">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </section>
          <section>
            <div className="grid gap-[18px] md:grid-cols-3" role="status" aria-label="กำลังโหลดดัชนี">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </section>
          <section>
            <div className="grid gap-6 md:grid-cols-3" role="status" aria-label="กำลังโหลด方法论">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
