import type { Metadata } from "next";
import type { ComponentType } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";
import { conceptRegistry } from "@/lib/content/concept-registry";
import {
  ConceptIcon,
  PersonIcon,
  BookIcon,
  SchoolIcon,
  SymbolIcon,
  TermIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "คลังแนวคิด — The Soul's Compass",
};

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

export default function ConceptsPage() {
  return (
    <main className="pb-24">
      <PageHeader
        kicker="คลังแนวคิด / Wiki"
        title="แผนที่ความรู้ของจิตใจมนุษย์"
        lead="ไม่ใช่หมวดบทความ แต่เป็นระบบความรู้แบบเชื่อมโยง ที่พาผู้อ่านเดินจากแนวคิดหนึ่งไปยังอีกแนวคิดอย่างมีเหตุผล"
      />
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {conceptRegistry.map((c) => {
            const Icon = NODE_ICON[c.nodeType];
            return (
              <Link
                key={c.slug}
                href={`/concepts/${c.slug}`}
                className="group rounded-md border border-white/10 bg-charcoal/40 p-5 transition-colors hover:border-antique-gold/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {Icon ? <Icon className="h-5 w-5 text-antique-gold" /> : null}
                    <span className="font-serif text-lg text-ivory group-hover:text-soft-gold">
                      {c.title}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs text-antique-gold">
                    {NODE_LABEL[c.nodeType] ?? c.nodeType}
                  </span>
                </div>
                {c.thaiTitle ? (
                  <p className="mt-1 text-sm text-muted">{c.thaiTitle}</p>
                ) : null}
                {c.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-soft-ivory">
                    {c.description}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>
      </section>
      <PageNav current="/concepts" />
    </main>
  );
}
