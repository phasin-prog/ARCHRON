import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { PageScaffold } from "@/components/page-scaffold";
import { conceptRegistry } from "@/lib/content/core/registry";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import {
  BookIcon,
  SynthesisIcon,
  GridIcon,
} from "@/components/icons";
import Link from "next/link";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "สารบัญคลังความรู้ — ARCHRON",
  description:
    "สารบัญคลังความรู้ — ค้นหาและเรียกดูบทความ แนวคิด และนักปราชญ์ได้โดยตรงจากหน้านี้",
};

// ── Data (server) ──

type ArticleRow = {
  type: "article";
  slug: string;
  title: string;
  publishedAt: string;
  description: string | undefined;
};

type ConceptRow = {
  type: "concept";
  slug: string;
  title: string;
  thaiTitle: string | undefined;
  description: string | undefined;
  framework: string | undefined;
};

type ThinkerRow = {
  type: "thinker";
  slug: string;
  title: string;
  thaiTitle: string | undefined;
  description: string | undefined;
  framework: string | undefined;
};

export type KnowledgeRow = ArticleRow | ConceptRow | ThinkerRow;

export default async function KnowledgePage() {
  const entries = await getPublicEntries("article");

  const articles: ArticleRow[] = entries.map((e) => ({
    type: "article" as const,
    slug: e.slug,
    title: e.title,
    publishedAt: e.publishedAt ?? "",
    description: e.shortDescription,
  }));

  const concepts: ConceptRow[] = conceptRegistry
    .filter((c) => c.nodeType === "concept")
    .map((c) => ({
      type: "concept" as const,
      slug: c.slug,
      title: c.title,
      thaiTitle: c.thaiTitle,
      description: c.description,
      framework: c.framework,
    }));

  const thinkers: ThinkerRow[] = conceptRegistry
    .filter((c) => c.nodeType === "person")
    .map((c) => ({
      type: "thinker" as const,
      slug: c.slug,
      title: c.title,
      thaiTitle: c.thaiTitle,
      description: c.description,
      framework: c.framework,
    }));

  return (
    <PageScaffold ambient navCurrent="/knowledge">
      <div className="tpl-reference pt-24">
        <Breadcrumb
          items={[{ label: "หน้าแรก", href: "/" }, { label: "คลังความรู้" }]}
          className="mb-10"
        />

        <header className="mb-12 space-y-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-accent">
            <span className="h-[5px] w-[5px] rounded-full bg-accent" aria-hidden="true" />
            สารบัญคลังความรู้
          </span>
          <h1 className="font-serif text-4xl tracking-tight text-text-heading sm:text-5xl">
            คลังความรู้
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-text-secondary/80">
            ค้นหาและเรียกดูบทความ แนวคิด และนักปราชญ์ได้โดยตรง — พิมพ์เพื่อกรองทันที
          </p>
        </header>

        <KnowledgeIndex articles={articles} concepts={concepts} thinkers={thinkers} />

        {/* Quick links ไปส่วนอื่น */}
        <footer className="mt-16 border-t border-border/30 pt-10">
          <div className="grid gap-5 sm:grid-cols-3">
            <QuickLink
              href="/constellation"
              icon={<SynthesisIcon className="h-5 w-5" />}
              title="แผนที่ความสัมพันธ์"
              desc="สำรวจปฏิสัมพันธ์ระหว่างแนวคิดในรูปโครงข่ายความรู้"
            />
            <QuickLink
              href="/reading-sets"
              icon={<BookIcon className="h-5 w-5" />}
              title="เส้นทางการอ่าน"
              desc="ลำดับการอ่านที่เรียงจากพื้นฐานสู่ความเข้าใจระดับลึก"
            />
            <QuickLink
              href="/themes"
              icon={<GridIcon className="h-5 w-5" />}
              title="แก่นเรื่องข้ามศาสตร์"
              desc="แก่นความคิดที่ปรากฏซ้ำ เช่น จิตไร้สำนึก เสรีภาพ ความหมาย"
            />
          </div>
        </footer>
      </div>
    </PageScaffold>
  );
}

function QuickLink({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-border/20 bg-bg-card/40 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:bg-bg-card/70"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/30 bg-bg-elevated text-text-secondary transition-colors duration-300 group-hover:text-accent">
        {icon}
      </span>
      <div>
        <span className="text-sm font-medium text-text-heading transition-colors duration-300 group-hover:text-accent">
          {title}
        </span>
        <p className="mt-0.5 text-xs leading-relaxed text-text-secondary/60">
          {desc}
        </p>
      </div>
    </Link>
  );
}

// ── Client component for search + filter ──
import { KnowledgeIndex } from "@/components/knowledge/knowledge-index";
