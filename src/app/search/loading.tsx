export default function SearchLoading() {
  return (
    <main className="px-6 pb-24 pt-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 h-3 w-40 animate-pulse rounded bg-surface-3" />
        <div className="mb-3 h-10 w-32 animate-pulse rounded bg-surface-3" />
        <div className="mb-8 h-14 animate-pulse rounded-lg bg-surface-3" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-md bg-surface-3" />
          ))}
        </div>
      </div>
    </main>
  );
}
