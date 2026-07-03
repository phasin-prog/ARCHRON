import type { Metadata } from "next";
import type { ComponentType, CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingPage } from "@/components/reading/reading-page";
import { conceptRegistry, getConceptBySlug } from "@/lib/content/concept-registry";
import { nodeTypeAccent } from "@/lib/content/cosmology";
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



export default async function ConceptNodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  const node = getConceptBySlug(slug);
  // Dynamic Accent รายชิ้น — ตั้ง --accent ตาม nodeType ของเนื้อหานี้
  const accentStyle = {
    ["--accent"]: nodeTypeAccent(node?.nodeType ?? "concept"),
  } as CSSProperties;

  // ถ้ามีเนื้อหาเต็ม → render รูปแบบเดียวกับ Article (ReadingPage)
  if (entry) {
    return (
      <div className="pb-24" style={accentStyle}>
        <ReadingPage entry={entry} section="concepts" />
      </div>
    );
  }

  // ยังไม่มีเนื้อหาเต็ม → stub จาก registry
  if (!node) {
    notFound();
  }
  const Icon = NODE_ICON[node.nodeType];
  const label = NODE_LABEL[node.nodeType] ?? node.nodeType;

  return (
    <main className="pb-24" style={accentStyle}>
      <header className="mx-auto max-w-2xl px-6 pb-8 pt-20">
        <div className="flex items-center gap-3">
          {Icon ? <Icon className="h-7 w-7 text-accent" /> : null}
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{label}</span>
        </div>
        <h1 className="mt-4 font-serif text-3xl text-ivory md:text-4xl">{node.title}</h1>
        {node.description ? (
          <p className="mt-5 text-base leading-relaxed text-soft-ivory">{node.description}</p>
        ) : null}
        <p className="mt-4 text-sm text-muted">ยังไม่มีหน้าอ่านเต็มสำหรับแนวคิดนี้ — กำลังจัดเตรียมเนื้อหา</p>
      </header>

      <section className="mx-auto max-w-2xl space-y-10 px-6">
        <dl className="grid grid-cols-1 gap-4 border-y border-ink/10 py-6 text-sm sm:grid-cols-2">
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
    </main>
  );
}
