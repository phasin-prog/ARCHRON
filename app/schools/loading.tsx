export default function SchoolsLoading() {
  return (
    <main className="px-6 pb-24 pt-10">
      <div className="mx-auto max-w-[1100px]">
        {/* Breadcrumb Placeholder */}
        <div className="flex items-center gap-1">
          <div className="h-4 w-12 animate-pulse rounded bg-surface-3" />
          <span className="material-symbols-outlined text-[16px] text-surface-3">chevron_right</span>
          <div className="h-4 w-32 animate-pulse rounded bg-surface-3" />
        </div>

        {/* Header Placeholder */}
        <div className="mt-6 mb-10 space-y-3">
          <div className="h-4 w-44 animate-pulse rounded bg-surface-3" />
          <div className="h-10 w-80 animate-pulse rounded bg-surface-3" />
          <div className="h-5 w-full max-w-xl animate-pulse rounded bg-surface-3" />
        </div>

        {/* Search & Filter Placeholder */}
        <div className="mb-8 space-y-4">
          <div className="h-12 w-full animate-pulse rounded bg-surface-3" />
          <div className="flex gap-2">
            <div className="h-7 w-20 animate-pulse rounded bg-surface-3" />
            <div className="h-7 w-24 animate-pulse rounded bg-surface-3" />
          </div>
        </div>

        {/* Schools Cards Placeholder */}
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-md border border-border/20 bg-bg-card/20 p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-6 w-40 animate-pulse rounded bg-surface-3" />
                  <div className="h-4 w-28 animate-pulse rounded bg-surface-3" />
                </div>
                <div className="h-5 w-16 animate-pulse rounded-full bg-surface-3" />
              </div>
              <div className="h-16 w-full animate-pulse rounded bg-surface-3" />
              <div className="border-t border-border/20 pt-4 space-y-2">
                <div className="h-4 w-20 animate-pulse rounded bg-surface-3" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-surface-3" />
                  <div className="h-8 w-24 animate-pulse rounded bg-surface-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
