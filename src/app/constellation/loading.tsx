export default function ConstellationLoading() {
  return (
    <main className="pb-24 pt-10 px-6">
      <div className="mx-auto max-w-6xl flex flex-col items-center justify-center min-h-[60vh]">
        <div className="space-y-4 text-center">
          <div className="h-8 w-8 mx-auto animate-pulse rounded-full bg-surface-3" />
          <div className="h-4 w-48 mx-auto animate-pulse rounded bg-surface-3" />
          <div className="h-3 w-64 mx-auto animate-pulse rounded bg-surface-3" />
        </div>
      </div>
    </main>
  );
}
