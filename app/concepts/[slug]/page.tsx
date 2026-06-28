import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingPage } from "@/components/reading/reading-page";
import { conceptRegistry, getConceptBySlug } from "@/lib/content/concept-registry";
import { getBacklinksForConcept } from "@/lib/content/related";
import { entries } from "@/lib/content/entries";
import { getPublicEntries, getPublicEntryBySlug } from "@/lib/content/public-source";
import {
  ConceptIcon,
  PersonIcon,
  BookIcon,
  SchoolIcon,
  SymbolIcon,
  TermIcon,
} from "@/components/icons";

// Dynamic route — รองรับ slug ใหม่ตอน runtime
export const dynamicParams = true;
// E8 — ISR: regenerate ทุก 5 นาที + on-demand revalidate จาก E7
export const revalidate = 300;

const NODE_LABEL: Record<string, string> = {
  concept: "แนวคิด",
  person: "นักคิด",
  book: "หนังสือ / งานเขียน",
  school: "สำนักคิด",
  symbol: "สัญลักษณ์",
  term: "คำศัพท์",
};

const NODE_ICON: Record<string, ComponentType<{ className?: string }>> = {
  concept: ConceptIcon,
  person: PersonIcon,
  book: BookIcon,
  school: SchoolIcon,
  symbol: SymbolIcon,
  term: TermIcon,
};

export function generateStaticParams() {
  const slugs = new Set<string>([
    ...conceptRegistry.map((c) => c.slug),
    ...entries.map((e) => e.slug),
  ]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  const node = getConceptBySlug(slug);
  const title = entry?.title ?? node?.title;
  return {
    title: title
      ? `${title} — ARCHRON`
      : "ไม่พบหน้า — ARCHRON",
  };
}

// บล็อก backlinks — บทความ/เนื้อหาที่อ้างถึงแนวคิดนี้
async function Backlinks({ slug }: { slug: string }) {
  const all = await getPublicEntries();
  const backlinks = getBacklinksForConcept(slug, all).filter(
    (a) => a.slug !== slug,
  );
  return (
    <section className="mx-auto mt-4 max-w-2xl border-t border-ink/10 px-6 pt-10">
      <h2 className="font-serif text-xl text-ivory">บทความที่ใช้แนวคิดนี้</h2>
      {backlinks.length === 0 ? (
        <p className="mt-3 text-sm text-muted">ยังไม่มีบทความอื่นอ้างถึงแนวคิดนี้</p>
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
      <div className="mt-8">
        <Link href="/concepts" className="text-sm text-soft-gold hover:underline">
          ← กลับคลังแนวคิดทั้งหมด
        </Link>
      </div>
    </section>
  );
}

export default async function ConceptNodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);

  // ถ้ามีเนื้อหาเต็ม → render รูปแบบเดียวกับ Article (ReadingPage) + backlinks
  if (entry) {
    return (
      <div className="pb-24">
        <ReadingPage entry={entry} section="concepts" />
        <Backlinks slug={slug} />
      </div>
    );
  }

  // ยังไม่มีเนื้อหาเต็ม → stub จาก registry
  const node = getConceptBySlug(slug);
  if (!node) {
    notFound();
  }
  const Icon = NODE_ICON[node.nodeType];
  const label = NODE_LABEL[node.nodeType] ?? node.nodeType;

  return (
    <main className="pb-24">
      <header className="mx-auto max-w-2xl px-6 pb-8 pt-20">
        <div className="flex items-center gap-3">
          {Icon ? <Icon className="h-7 w-7 text-antique-gold" /> : null}
          <span className="text-xs tracking-[0.05em] text-antique-gold">{label}</span>
        </div>
        <h1 className="mt-4 font-serif text-3xl text-ivory md:text-4xl">{node.title}</h1>
        {node.description ? (
          <p className="mt-5 text-base leading-relaxed text-soft-ivory">{node.description}</p>
        ) : null}
        <p className="mt-4 text-sm text-muted">ยังไม่มีหน้าอ่านเต็มสำหรับแนวคิดนี้ — กำลังจัดเตรียมเนื้อหา</p>
      </header>

      <section className="mx-auto max-w-2xl space-y-10 px-6">
        <dl className="grid grid-cols-2 gap-4 border-y border-ink/10 py-6 text-sm">
          {node.thaiTitle ? (
            <div>
              <dt className="text-muted">ชื่อไทย</dt>
              <dd className="mt-1 text-ivory">{node.thaiTitle}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-muted">ชนิด node</dt>
            <dd className="mt-1 text-ivory">{label}</dd>
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
      </section>

      <Backlinks slug={slug} />
    </main>
  );
}
