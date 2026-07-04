import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPublicReadingSetBySlug } from "@/lib/content/public-source";
import { calculateReadingSetEstimatedMinutes } from "@/lib/content/reading-sets";
import { difficultyMeta } from "@/lib/content/cosmology";

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  return [
    { slug: "foundations-of-jungian-psychology" },
    { slug: "path-to-individuation" },
    { slug: "understanding-the-psyche" },
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
    <main className="atmo-base atmo-dictionary pb-24">
      {/* Breadcrumb */}
      <nav aria-label="เส้นทางนำทาง" className="mx-auto max-w-[760px] px-4 sm:px-6 pt-20 text-xs text-muted">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="rounded px-2 py-1.5 transition-colors hover:text-soft-gold focus-visible:ring-1 focus-visible:ring-burnished-gold/60 focus-visible:outline-none">
              หน้าแรก
            </Link>
          </li>
          <li aria-hidden className="text-on-surface-variant/30">
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </li>
          <li>
            <Link href="/reading-sets" className="rounded px-2 py-1.5 transition-colors hover:text-soft-gold focus-visible:ring-1 focus-visible:ring-burnished-gold/60 focus-visible:outline-none">
              ซีรีส์
            </Link>
          </li>
          <li aria-hidden className="text-on-surface-variant/30">
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </li>
          <li className="px-2 py-1.5 text-soft-ivory truncate max-w-[200px]">{set.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mx-auto max-w-[760px] px-6 pb-8 pt-8">
        <div className="flex flex-wrap items-center gap-2">
          {set.framework && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
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
            <span className="material-symbols-outlined text-[11px]">{diffMeta.icon}</span>
            {set.difficulty === "beginner"
              ? "ระดับเริ่มต้น"
              : set.difficulty === "intermediate"
                ? "ระดับกลาง"
                : "ระดับสูง"}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted">
            <span className="material-symbols-outlined text-[12px]">schedule</span>
            ~{estimatedMinutes} นาที
          </span>
        </div>

        <h1 className="mt-4 font-serif text-3xl text-ivory md:text-4xl">
          {set.title}
        </h1>

        {set.shortDescription && (
          <p className="mt-4 text-base leading-relaxed text-soft-ivory/85">
            {set.shortDescription}
          </p>
        )}
      </header>

      {/* Steps Timeline */}
      <section className="mx-auto max-w-[760px] px-6 pb-10">
        <div className="rounded-xl border border-slate-boundary/20 bg-white/[0.02] p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-burnished-gold/80 mb-5">
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
                    <div className="absolute left-[15px] top-[32px] bottom-0 w-px bg-slate-boundary/25" />
                  )}

                  {/* วงกลมหมายเลข */}
                  <div className="relative z-10 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-burnished-gold/30 bg-midnight text-[11px] font-bold text-burnished-gold font-mono">
                    {idx + 1}
                  </div>

                  {/* เนื้อหา step */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <Link
                      href={href}
                      className="group block rounded-lg border border-transparent px-3 py-3 -mx-3 -my-3 transition-colors hover:border-burnished-gold/25 hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burnished-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-deep-navy"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                          {STEP_TYPE_LABEL[step.type]}
                        </span>
                      </div>
                      <h3 className="mt-1 font-serif text-lg text-ivory group-hover:text-soft-gold transition-colors">
                        {step.title}
                      </h3>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs text-burnished-gold/70 opacity-0 group-hover:opacity-100 transition-opacity">
                        เข้าสู่หน้าอ่าน
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
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
          <div className="markdown-body prose prose-invert max-w-none text-sm text-soft-ivory/80 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {set.bodyMarkdown}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-[760px] px-6">
        <div className="rounded-xl border border-burnished-gold/20 bg-burnished-gold/[0.04] p-6 text-center">
          <p className="text-sm text-soft-ivory/80">
            เริ่มต้นเส้นทางนี้ได้เลย — เลือกขั้นตอนแรกเพื่อเริ่มเรียนรู้
          </p>
          {set.steps.length > 0 && (
            <Link
              href={
                set.steps[0].type === "person"
                  ? `/schools?person=${set.steps[0].slug}`
                  : `/concepts/${set.steps[0].slug}`
              }
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-burnished-gold/90 px-5 py-2.5 text-sm font-semibold text-deep-navy transition-colors hover:bg-burnished-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burnished-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-deep-navy"
            >
              เริ่มขั้นตอนที่ 1
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
