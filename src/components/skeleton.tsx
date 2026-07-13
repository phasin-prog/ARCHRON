// Reusable skeleton components for loading states
// ใช้ skeleton-shimmer + surface colors เคารพ prefers-reduced-motion

type SkeletonCardProps = {
  className?: string;
};

// การ์ด skeleton สำหรับรายการบทความ / แนวคิด
export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div
      className={`rounded-md border border-border/20 bg-surface-1/50 p-6 ${className}`}
      aria-hidden="true"
    >
      <div className="mb-3 h-3 w-16 skeleton-shimmer rounded" />
      <div className="mb-2 h-6 w-3/4 skeleton-shimmer rounded" />
      <div className="mb-1 h-4 w-full skeleton-shimmer rounded" />
      <div className="mb-4 h-4 w-2/3 skeleton-shimmer rounded" />
      <div className="h-4 w-20 skeleton-shimmer rounded" />
    </div>
  );
}

// Skeleton สำหรับข้อความหนึ่งบรรทัด
export function SkeletonLine({ width = "100%", className = "" }: { width?: string; className?: string }) {
  return (
    <div
      className={`h-4 skeleton-shimmer rounded ${className}`}
      style={{ width }}
      aria-hidden="true"
    />
  );
}

// Skeleton สำหรับบล็อกข้อความหลายบรรทัด
export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={i === lines - 1 ? "60%" : "100%"} />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid gap-4 md:grid-cols-2"
      role="status"
      aria-label="กำลังโหลดเนื้อหา"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Page header skeleton — breadcrumb + kicker + title + lead
export function SkeletonPageHeader({
  kickerWidth = "w-20",
  titleWidth = "w-48",
  leadWidth = "w-96",
}: {
  kickerWidth?: string;
  titleWidth?: string;
  leadWidth?: string;
}) {
  return (
    <div className="mb-10 space-y-3" aria-hidden="true">
      <div className={`h-3 ${kickerWidth} skeleton-shimmer rounded`} />
      <div className={`h-8 ${titleWidth} skeleton-shimmer rounded`} />
      <div className={`h-5 ${leadWidth} skeleton-shimmer rounded`} />
    </div>
  );
}

// Article content skeleton — meta pills + title + byline + paragraphs
export function SkeletonArticleContent() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4" aria-hidden="true">
      <div className="flex gap-2">
        <div className="h-5 w-16 skeleton-shimmer rounded-full" />
        <div className="h-5 w-20 skeleton-shimmer rounded-full" />
        <div className="h-5 w-24 skeleton-shimmer rounded-full" />
      </div>
      <div className="h-10 w-3/4 skeleton-shimmer rounded" />
      <div className="h-4 w-1/2 skeleton-shimmer rounded" />
      <div className="space-y-2 pt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-4 skeleton-shimmer rounded"
            style={{ width: i === 7 ? "55%" : "100%" }}
          />
        ))}
      </div>
    </div>
  );
}

// Home hero skeleton — centered wordmark + subtitle + search
export function SkeletonHomeHero() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center" aria-hidden="true">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="mx-auto h-12 w-64 skeleton-shimmer rounded" />
        <div className="mx-auto h-5 w-80 skeleton-shimmer rounded" />
        <div className="mx-auto h-5 w-56 skeleton-shimmer rounded" />
        <div className="mx-auto mt-8 h-12 w-full max-w-md skeleton-shimmer rounded-lg" />
      </div>
    </section>
  );
}

// Accordion skeleton — stack of clickable header bars
export function SkeletonAccordion({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border/20 p-4">
          <div className="h-5 w-3/4 skeleton-shimmer rounded" />
        </div>
      ))}
    </div>
  );
}

// Icon grid skeleton — small square boxes
export function SkeletonIconGrid({ count = 24 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      role="status"
      aria-label="กำลังโหลดไอคอน"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 rounded-lg border border-border/20 p-4">
          <div className="h-10 w-10 skeleton-shimmer rounded" />
          <div className="h-3 w-16 skeleton-shimmer rounded" />
        </div>
      ))}
    </div>
  );
}
