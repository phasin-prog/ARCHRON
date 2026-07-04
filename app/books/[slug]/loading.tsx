export default function BookDetailLoading() {
  return (
    <main className="pb-24 pt-10 px-6">
      <div className="mx-auto max-w-[700px] space-y-8">
        <div className="space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-surface-3" />
          <div className="h-8 w-64 animate-pulse rounded bg-surface-3" />
          <div className="h-4 w-96 animate-pulse rounded bg-surface-3" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-full animate-pulse rounded bg-surface-3" />
          ))}
        </div>
      </div>
    </main>
  );
}
