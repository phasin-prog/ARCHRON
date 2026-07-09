import { SkeletonIconGrid } from "@/components/skeleton";

export default function IconsLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 space-y-3">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-3" />
        <div className="h-5 w-72 animate-pulse rounded bg-surface-3" />
      </div>
      <SkeletonIconGrid count={24} />
    </main>
  );
}
