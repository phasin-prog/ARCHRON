import { SkeletonLine } from "@/components/skeleton";

// Skeleton ระหว่างรอข้อมูลโปรไฟล์ (หน้า force-dynamic ดึง DB หลายก้อน)
// โครงตรงกับหน้าจริง: PageHeader → หัวโปรไฟล์ → แถบแท็บ → การ์ดระดับ → กริดเหรียญตรา
export default function ProfileLoading() {
  return (
    <main className="pb-24" role="status" aria-label="กำลังโหลดโปรไฟล์">
      {/* โครง PageHeader */}
      <div className="tpl-reference pb-10 pt-20">
        <div className="h-4 w-28 animate-pulse rounded bg-surface-3" />
        <div className="mt-4 h-9 w-60 animate-pulse rounded bg-surface-3" />
        <div className="mt-5 h-5 w-96 max-w-full animate-pulse rounded bg-surface-3" />
      </div>

      <div className="tpl-reference">
        {/* โครงหัวโปรไฟล์ — avatar + ชื่อ + ยศ */}
        <div className="archron-card flex flex-col items-center gap-4 p-7 sm:flex-row sm:gap-6">
          <div className="h-20 w-20 flex-none animate-pulse rounded-full bg-surface-3" />
          <div className="w-full max-w-xs space-y-3">
            <SkeletonLine width="55%" />
            <div className="flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-surface-3" />
              <div className="h-6 w-32 animate-pulse rounded-full bg-surface-3" />
            </div>
          </div>
        </div>

        {/* โครงแถบแท็บ */}
        <div className="mt-8 flex gap-2 border-b border-border/30 pb-3">
          <div className="h-6 w-32 animate-pulse rounded bg-surface-3" />
          <div className="h-6 w-24 animate-pulse rounded bg-surface-3" />
        </div>

        {/* โครงการ์ดระดับ */}
        <div className="archron-card mt-8 p-6 sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div className="w-full max-w-xs space-y-3">
              <SkeletonLine width="35%" />
              <SkeletonLine width="60%" />
            </div>
            <div className="h-10 w-14 animate-pulse rounded bg-surface-3" />
          </div>
          <div className="mt-5 h-2.5 w-full animate-pulse rounded-full bg-surface-3" />
          <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-md bg-surface-3/60" />
            ))}
          </div>
        </div>

        {/* โครงกริดเหรียญตรา */}
        <div className="mt-10 space-y-4">
          <SkeletonLine width="20%" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-md bg-surface-3/50" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
