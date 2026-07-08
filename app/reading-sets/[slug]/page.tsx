import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublicReadingSetBySlug } from "@/lib/content/public-source";
import { calculateReadingSetEstimatedMinutes } from "@/lib/content/reading-sets";
import { difficultyMeta } from "@/lib/content/cosmology";
import { ArrowRightIcon, ClockIcon } from "@/components/icons";

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  return [
    { slug: "foundations-of-jungian-psychology" },
    { slug: "path-to-individuation" },
    { slug: "understanding-the-concept" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const set = await getPublicReadingSetBySlug(slug);
  return {
    title: set ? `${set.title} — ARCHRON` : "ไม่พบซีรีส์ — ARCHRON",
    description: set?.shortDescription,
  };
}

const STEP_TYPE_LABEL: Record<string, string> = {
  concept: "แนวคิด",
  article: "บทความ",
  person: "นักคิด",
};

export default async function ReadingSetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const set = await getPublicReadingSetBySlug(slug);

  if (!set) {
    notFound();
  }

  const diffMeta = difficultyMeta(set.difficulty ?? "beginner");
  const estimatedMinutes = calculateReadingSetEstimatedMinutes(set);

  return (
    <main className="atmo-dictionary pb-24">
      {/* Breadcrumb */}
      <nav aria-label="เส้นทางนำทาง" className="mx-auto max-w-[760px] px-4 sm:px-6 pt-20 text-xs text-text-secondary">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="rounded px-2 py-1.5 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:outline-none">
              หน้าแรก
            </Link>
          </li>
          <li aria-hidden className="text-text-secondary/30">
            <ArrowRightIcon className="h-4 w-4" />
          </li>
          <li>
            <Link href="/reading-sets" className="rounded px-2 py-1.5 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:outline-none">
              ซีรีส์
            </Link>
          </li>
          <li aria-hidden className="text-text-secondary/30">
            <ArrowRightIcon className="h-4 w-4" />
          </li>
          <li className="px-2 py-1.5 text-text-body truncate max-w-[200px]">{set.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mx-auto max-w-[760px] px-6 pb-8 pt-8">
        <div className="flex flex-wrap items-center gap-2">
          {set.framework && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
              {set.framework}
            </span>
          )}
          <span
            className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider flex items-center gap-1"
            style={{
              color: diffMeta.accent,
              backgroundColor: `${diffMeta.accent}14`,
              borderColor: `${diffMeta.accent}33`,
              borderWidth: "1px",
            }}
          >
            {set.difficulty === "beginner"
              ? "ระดับเริ่มต้น"
              : set.difficulty === "intermediate"
                ? "ระดับกลาง"
                : "ระดับสูง"}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-text-secondary">
            <ClockIcon className="h-3 w-3" />
            ~{estimatedMinutes} นาที
          </span>
        </div>

        <h1 className="mt-4 font-serif text-3xl text-text-heading md:text-4xl">
          {set.title}
        </h1>

        {set.shortDescription && (
          <p className="mt-4 text-base leading-relaxed text-text-body/85">
            {set.shortDescription}
          </p>
        )}
      </header>

      {/* Steps Timeline */}
      <section className="mx-auto max-w-[760px] px-6 pb-10">
        <div className="rounded-xl border border-border/20 bg-text-heading/[0.02] p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-accent/80 mb-5">
            เส้นทางการเรียนรู้ ({set.steps.length} ขั้นตอน)
          </h2>

          <ol className="relative space-y-0">
            {set.steps.map((step, idx) => {
              const isLast = idx === set.steps.length - 1;
              const href =
                step.type === "person"
                  ? `/schools?person=${step.slug}`
                  : `/concepts/${step.slug}`;

              return (
                <li key={step.slug} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* เส้นเชื่อม */}
                  {!isLast && (
                    <div className="absolute left-[15px] top-[32px] bottom-0 w-px bg-border/25" />
                  )}

                  {/* วงกลมหมายเลข */}
                  <div className="relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-accent/30 bg-bg text-[11px] font-bold text-accent font-mono">
                    {idx + 1}
                  </div>

                  {/* เนื้อหา step */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <Link
                      href={href}
                      className="group block rounded-lg border border-transparent px-3 py-3 -mx-3 -my-3 transition-colors hover:border-accent/25 hover:bg-text-heading/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                          {STEP_TYPE_LABEL[step.type]}
                        </span>
                      </div>
                      <h3 className="mt-1 font-serif text-lg text-text-heading group-hover:text-accent transition-colors">
                        {step.title}
                      </h3>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-accent/70 opacity-0 group-hover:opacity-100 transition-opacity">
                        เข้าสู่หน้าอ่าน
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Body Markdown */}
      {set.bodyMarkdown && (
        <section className="mx-auto max-w-[760px] px-6 pb-10">
          <div className="markdown-body prose prose-invert max-w-none text-sm text-text-body/80 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {set.bodyMarkdown}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-[760px] px-6">
        <div className="rounded-xl border border-accent/20 bg-accent/[0.04] p-6 text-center">
          <p className="text-sm text-text-body/80">
            เริ่มต้นเส้นทางนี้ได้เลย — เลือกขั้นตอนแรกเพื่อเริ่มเรียนรู้
          </p>
          {set.steps.length > 0 && (
            <Link
              href={
                set.steps[0].type === "person"
                  ? `/schools?person=${set.steps[0].slug}`
                  : `/concepts/${set.steps[0].slug}`
              }
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent/90 px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              เริ่มขั้นตอนที่ 1
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
