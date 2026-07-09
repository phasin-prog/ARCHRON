import { SkeletonPageHeader, SkeletonAccordion } from "@/components/skeleton";

export default function FaqLoading() {
  return (
    <main className="pb-24">
      <div className="mx-auto max-w-3xl px-6 pt-16">
        <SkeletonPageHeader />
        <SkeletonAccordion count={5} />
      </div>
    </main>
  );
}
