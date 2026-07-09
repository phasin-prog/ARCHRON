export default function DiscoverLoading() {
  return (
    <main className="pb-24">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="mb-10 space-y-3">
          <div className="h-4 w-20 animate-pulse rounded bg-surface-3" />
          <div className="h-10 w-48 animate-pulse rounded bg-surface-3" />
          <div className="h-5 w-96 animate-pulse rounded bg-surface-3" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="archron-card p-6 space-y-3">
              <div className="h-4 w-16 animate-pulse rounded bg-surface-3" />
              <div className="h-6 w-32 animate-pulse rounded bg-surface-3" />
              <div className="h-4 w-full animate-pulse rounded bg-surface-3" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
