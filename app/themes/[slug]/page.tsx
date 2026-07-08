import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicEntries } from "@/lib/content/public-source";
import { THEMES, themeByKey, entriesForTheme } from "@/lib/content/themes";
import { contentTypeMeta } from "@/lib/content/cosmology";
import { EmptyState } from "@/components/empty-state";
import { ArrowRightIcon } from "@/components/icons";

export const dynamicParams = true;
export const revalidate = 300;

export function generateStaticParams() {
  return THEMES.map((t) => ({ slug: t.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const theme = themeByKey(slug);
  return {
    title: theme ? `${theme.label} — แก่นเรื่อง — ARCHRON` : "ไม่พบแก่นเรื่อง — ARCHRON",
    description: theme?.description,
  };
}

// ปลายทางหน้าอ่านตามชนิดเนื้อหา (article → /articles, อื่น ๆ → /concepts)
function entryHref(contentType: string | undefined, slug: string): string {
  return contentType === "article" ? `/articles/${slug}` : `/concepts/${slug}`;
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = themeByKey(slug);
  if (!theme) notFound();

  const entries = await getPublicEntries();
  const matched = entriesForTheme(entries, theme.key);

  return (
    <main className="px-6 pb-24 pt-10">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav aria-label="เส้นทางนำทาง" className="flex flex-wrap items-center gap-1 text-xs text-text-secondary">
          <Link href="/" className="rounded px-2 py-1.5 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:outline-none">หน้าแรก</Link>
          <ArrowRightIcon className="h-4 w-4" />
          <Link href="/themes" className="rounded px-2 py-1.5 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:outline-none">แก่นเรื่อง</Link>
          <ArrowRightIcon className="h-4 w-4" />
          <span className="px-2 py-1.5 text-text-body">{theme.label}</span>
        </nav>

        <header className="scroll-reveal mt-6">
          <span
            className="inline-block h-1 w-12 rounded-full"
            style={{ backgroundColor: theme.accent }}
            aria-hidden="true"
          />
          <h1 className="mt-4 font-serif text-4xl font-bold md:text-5xl" style={{ color: theme.accent }}>
            {theme.label}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-body">
            {theme.description}
          </p>
          <p className="mt-3 text-sm text-text-secondary">
            รวม {matched.length} รายการที่พูดถึงแก่นเรื่องนี้ ข้ามศาสตร์
          </p>
        </header>

        <section className="scroll-reveal stagger-1 mt-10">
          {matched.length === 0 ? (
            <EmptyState
              icon="category"
              title="ยังไม่มีเนื้อหาเผยแพร่ภายใต้แก่นเรื่องนี้"
              description={`เนื้อหาจะปรากฏเมื่อมีบทความ/แนวคิดติดแท็กแก่นเรื่อง “${theme.label}”`}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {matched.map((e) => {
                const meta = contentTypeMeta(e.contentType);
                return (
                  <Link
                    key={e.slug}
                    href={entryHref(e.contentType, e.slug)}
                    className="archron-card group p-6"
                  >
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{ backgroundColor: `${meta.accent}1f`, color: meta.accent }}
                    >
                      {meta.label}
                    </span>
                    <h2 className="mt-2 font-serif text-xl text-text-heading group-hover:text-accent">
                      {e.mainTerm ?? e.title}
                    </h2>
                    {e.shortDescription ? (
                      <p className="mt-2 text-sm leading-relaxed text-text-body">
                        {e.shortDescription}
                      </p>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-12">
          <Link href="/themes" className="text-sm text-accent hover:underline">
            ← แก่นเรื่องทั้งหมด
          </Link>
        </div>
      </div>
    </main>
  );
}
