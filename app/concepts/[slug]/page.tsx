import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { conceptRegistry, getConceptBySlug } from "@/lib/content/concept-registry";
import { getBacklinksForConcept } from "@/lib/content/related";
import { entries } from "@/lib/content/entries";

// Dynamic route — pre-render node ที่มีใน registry และรองรับ slug ใหม่ตอน runtime
export const dynamicParams = true;

const NODE_LABEL: Record<string, string> = {
  concept: "แนวคิด",
  person: "นักคิด",
  book: "หนังสือ / งานเขียน",
  school: "สำนักคิด",
  symbol: "สัญลักษณ์",
  term: "คำศัพท์",
};

export function generateStaticParams() {
  return conceptRegistry.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const node = getConceptBySlug(slug);
  return {
    title: node
      ? `${node.title} — The Soul's Compass`
      : "ไม่พบหน้า — The Soul's Compass",
  };
}

export default async function ConceptNodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const node = getConceptBySlug(slug);
  if (!node) {
    notFound();
  }
  const backlinks = getBacklinksForConcept(slug, entries);

  return (
    <main className="pb-24">
      <PageHeader
        kicker={NODE_LABEL[node.nodeType] ?? node.nodeType}
        title={node.title}
        lead={node.description}
      />
      <section className="mx-auto max-w-2xl space-y-10 px-6">
        <dl className="grid grid-cols-2 gap-4 border-y border-white/10 py-6 text-sm">
          {node.thaiTitle ? (
            <div>
              <dt className="text-muted">ชื่อไทย</dt>
              <dd className="mt-1 text-ivory">{node.thaiTitle}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-muted">ชนิด node</dt>
            <dd className="mt-1 text-ivory">{NODE_LABEL[node.nodeType] ?? node.nodeType}</dd>
          </div>
          {node.framework ? (
            <div>
              <dt className="text-muted">กรอบทฤษฎี</dt>
              <dd className="mt-1 text-ivory">{node.framework}</dd>
            </div>
          ) : null}
          {node.aliases.length > 0 ? (
            <div>
              <dt className="text-muted">ชื่อเรียกอื่น</dt>
              <dd className="mt-1 text-ivory">{node.aliases.join(", ")}</dd>
            </div>
          ) : null}
        </dl>

        <div>
          <h2 className="font-serif text-xl text-ivory">บทความที่ใช้แนวคิดนี้</h2>
          {backlinks.length === 0 ? (
            <p className="mt-3 text-sm text-muted">ยังไม่มีบทความอ้างถึงแนวคิดนี้</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {backlinks.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/articles/${a.slug}`}
                    className="text-soft-ivory transition-colors hover:text-soft-gold"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-white/10 pt-6">
          <Link href="/concepts" className="text-sm text-soft-gold hover:underline">
            ← กลับคลังแนวคิดทั้งหมด
          </Link>
        </div>
      </section>
    </main>
  );
}
