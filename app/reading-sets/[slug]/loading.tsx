export default function ReadingSetDetailLoading() {
  return (
    <main className="atmo-dictionary pb-24">
      <div className="mx-auto max-w-3xl px-6 pt-20">
        {/* Breadcrumb skeleton */}
        <div className="h-3 w-48 rounded bg-white/5 animate-pulse" />

        {/* Header skeleton */}
        <div className="mt-8 space-y-4">
          <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
          <div className="h-10 w-3/4 rounded bg-white/5 animate-pulse" />
          <div className="h-5 w-full rounded bg-white/5 animate-pulse" />
          <div className="h-5 w-2/3 rounded bg-white/5 animate-pulse" />
        </div>

        {/* Steps skeleton */}
        <div className="mt-10 rounded-xl border border-slate-boundary/20 bg-white/[0.02] p-6">
          <div className="h-3 w-40 rounded bg-white/5 animate-pulse mb-6" />
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-[30px] w-[30px] shrink-0 rounded-full border border-white/10 bg-white/5 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-16 rounded bg-white/5 animate-pulse" />
                  <div className="h-5 w-48 rounded bg-white/5 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Body skeleton */}
        <div className="mt-10 space-y-3">
          <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
        </div>
      </div>
    </main>
  );
}
