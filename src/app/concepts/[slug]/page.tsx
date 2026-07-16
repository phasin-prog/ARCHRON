import type { Metadata } from "next";
import type { ComponentType, CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingPage } from "@/components/reading/reading-page";
import { ReadingErrorBoundary } from "@/components/reading/reading-error-boundary";
import { conceptRegistry, getConceptBySlug } from "@/lib/content/core/registry";
import { nodeTypeAccent } from "@/lib/content/core/cosmology";
import { entries } from "@/lib/content/core/seeds/entries";
import { getPublicEntries, getPublicEntryBySlug } from "@/lib/content/publishing/public-source";
import { generatePageMetadata } from "@/lib/content/seo/metadata";
import { articleLd, breadcrumbLd, organizationLd } from "@/lib/content/seo/structured-data";
import {
  ConceptIcon,
  PersonIcon,
  BookIcon,
  SchoolIcon,
  SymbolIcon,
  TermIcon,
} from "@/components/icons";

export const dynamicParams = true;
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
  if (entry) return generatePageMetadata(entry);
  const node = getConceptBySlug(slug);
  return {
    title: node?.title
      ? `${node.title} — ARCHRON`
      : "ไม่พบหน้า — ARCHRON",
  };
}



export default async function ConceptNodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  const node = getConceptBySlug(slug);
  const accentStyle = {
    ["--accent"]: nodeTypeAccent(node?.nodeType ?? "concept"),
  } as CSSProperties;

  if (entry) {
    const ldJson = {
      "@context": "https://schema.org",
      "@graph": [
        organizationLd(),
        breadcrumbLd([
          { name: "หน้าแรก", href: "/" },
          { name: "คลังแนวคิด", href: "/concepts" },
          { name: entry.title, href: `/concepts/${entry.slug}` },
        ]),
        articleLd(entry),
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
        <ReadingErrorBoundary>
          <ReadingPage entry={entry} section="concepts" atmosphere="atmo-dictionary" />
        </ReadingErrorBoundary>
      </>
    );
  }

  if (!node) {
    notFound();
  }
  const Icon = NODE_ICON[node.nodeType];
  const label = NODE_LABEL[node.nodeType] ?? node.nodeType;

  const stubLdJson = {
    "@context": "https://schema.org",
    "@graph": [
      organizationLd(),
      breadcrumbLd([
        { name: "หน้าแรก", href: "/" },
        { name: "คลังแนวคิด", href: "/concepts" },
        { name: node.title, href: `/concepts/${node.slug}` },
      ]),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(stubLdJson) }} />
      <main className="atmo-dictionary pb-24" style={accentStyle}>
      <header className="mx-auto max-w-2xl px-6 pb-8 pt-20">
        <div className="flex items-center gap-3">
          {Icon ? <Icon className="h-7 w-7 text-accent" /> : null}
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{label}</span>
        </div>
        <h1 className="mt-4 font-serif text-3xl text-text-heading md:text-4xl">{node.title}</h1>
        {node.description ? (
          <p className="mt-5 text-base leading-relaxed text-text-body">{node.description}</p>
        ) : null}
        <p className="mt-4 text-sm text-text-secondary">ยังไม่มีหน้าอ่านเต็มสำหรับแนวคิดนี้ — กำลังจัดเตรียมเนื้อหา</p>
      </header>

      <section className="mx-auto max-w-2xl space-y-10 px-6">
        <dl className="grid grid-cols-1 gap-4 border-y border-text-heading/10 py-6 text-sm sm:grid-cols-2">
          {node.thaiTitle ? (
            <div>
              <dt className="text-text-secondary">ชื่อไทย</dt>
              <dd className="mt-1 text-text-heading">{node.thaiTitle}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-text-secondary">ชนิด node</dt>
            <dd className="mt-1 text-text-heading">{label}</dd>
          </div>
          {node.framework ? (
            <div>
              <dt className="text-text-secondary">กรอบทฤษฎี</dt>
              <dd className="mt-1 text-text-heading">{node.framework}</dd>
            </div>
          ) : null}
          {node.aliases.length > 0 ? (
            <div>
              <dt className="text-text-secondary">ชื่อเรียกอื่น</dt>
              <dd className="mt-1 text-text-heading">{node.aliases.join(", ")}</dd>
            </div>
          ) : null}
        </dl>
      </section>
    </main>
    </>
  );
}
