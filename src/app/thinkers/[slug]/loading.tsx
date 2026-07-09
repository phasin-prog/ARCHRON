export default function ThinkerDetailLoading() {
  return (
    <main className="pb-24 pt-10 px-6">
      <div className="mx-auto max-w-[800px] space-y-8">
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-surface-3" />
          <div className="h-8 w-64 animate-pulse rounded bg-surface-3" />
          <div className="h-4 w-96 animate-pulse rounded bg-surface-3" />
        </div>
        <div className="rounded-md border border-border/40 bg-bg-card/20 p-8 space-y-4">
          <div className="h-4 w-32 animate-pulse rounded bg-surface-3" />
          <div className="h-6 w-48 animate-pulse rounded bg-surface-3" />
          <div className="h-4 w-full animate-pulse rounded bg-surface-3" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-surface-3" />
          ))}
        </div>
      </div>
    </main>
  );
}
