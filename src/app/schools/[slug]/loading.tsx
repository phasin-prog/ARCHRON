export default function SchoolDetailLoading() {
  return (
    <main className="pb-24 pt-10 px-6">
      <div className="tpl-reference space-y-8">
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-surface-3" />
          <div className="h-8 w-64 animate-pulse rounded bg-surface-3" />
          <div className="h-4 w-48 animate-pulse rounded bg-surface-3" />
        </div>
        <div className="rounded-md border border-border/40 bg-bg-card/20 p-8 space-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-surface-3" />
          <div className="h-4 w-full animate-pulse rounded bg-surface-3" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-surface-3" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="archron-card p-6 space-y-3">
              <div className="h-5 w-32 animate-pulse rounded bg-surface-3" />
              <div className="h-4 w-full animate-pulse rounded bg-surface-3" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
