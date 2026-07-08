// Reusable skeleton components for loading states
// ใช้ animate-pulse + bg-surface-3 (bg tone) เคารพ prefers-reduced-motion

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
      <div className="mb-3 h-3 w-16 animate-pulse rounded bg-surface-3" />
      <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-surface-3" />
      <div className="mb-1 h-4 w-full animate-pulse rounded bg-surface-3" />
      <div className="mb-4 h-4 w-2/3 animate-pulse rounded bg-surface-3" />
      <div className="h-4 w-20 animate-pulse rounded bg-surface-3" />
    </div>
  );
}

// Skeleton สำหรับข้อความหนึ่งบรรทัด
export function SkeletonLine({ width = "100%", className = "" }: { width?: string; className?: string }) {
  return (
    <div
      className={`h-4 animate-pulse rounded bg-surface-3 ${className}`}
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
