import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { DISCIPLINES, getDiscipline } from "@/lib/content/disciplines";
import { DISCIPLINE_META } from "@/components/discipline-meta";

export function generateStaticParams() {
  return DISCIPLINES.map((d) => ({ slug: d.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDiscipline(slug);
  const label = d ? DISCIPLINE_META[d.key].label : null;
  return {
    title: label ? `${label} — ศาสตร์ที่เราศึกษา · ARCHRON` : "ไม่พบหน้า — ARCHRON",
    description: d?.overview,
  };
}

export default async function DisciplinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDiscipline(slug);
  if (!d) notFound();

  const meta = DISCIPLINE_META[d.key];
  const Icon = meta.Icon;
  const accentStyle = { ["--accent"]: meta.accent } as CSSProperties;

  return (
    <main className="pb-24" style={accentStyle}>
      <PageHeader
        breadcrumb={[
          { label: "หน้าแรก", href: "/" },
          { label: "คลังความรู้", href: "/knowledge" },
          { label: "ศาสตร์ที่เราศึกษา", href: "/disciplines" },
          { label: meta.label },
        ]}
        kicker={d.en}
        title={meta.label}
        lead={d.overview}
      />

      <div className="mx-auto max-w-2xl px-6">
        {/* ไอคอนประจำศาสตร์ */}
        <span
          className="flex h-16 w-16 items-center justify-center rounded-2xl border"
          style={{
            color: meta.accent,
            borderColor: `color-mix(in srgb, ${meta.accent} 30%, transparent)`,
            backgroundColor: `color-mix(in srgb, ${meta.accent} 10%, transparent)`,
          }}
        >
          <Icon className="h-8 w-8" />
        </span>

        {/* ศึกษาอะไร */}
        <section className="scroll-reveal mt-12">
          <h2 className="flex items-center gap-3 font-serif text-fluid-h3 text-text-heading">
            <span className="h-5 w-[3px] rounded" style={{ backgroundColor: meta.accent }} aria-hidden="true" />
            ศึกษาอะไร
          </h2>
          <ul className="mt-5 space-y-3">
            {d.studies.map((s) => (
              <li key={s} className="flex gap-3 text-base leading-relaxed text-text-body">
                <span
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: meta.accent }}
                  aria-hidden="true"
                />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* คำถามสำคัญ */}
        <section className="scroll-reveal mt-12">
          <h2 className="flex items-center gap-3 font-serif text-fluid-h3 text-text-heading">
            <span className="h-5 w-[3px] rounded" style={{ backgroundColor: meta.accent }} aria-hidden="true" />
            คำถามสำคัญ
          </h2>
          <div className="mt-5 space-y-3">
            {d.questions.map((q, i) => (
              <div
                key={q}
                className="flex items-start gap-4 rounded-xl border border-border/20 bg-text-heading/[0.02] p-4"
              >
                <span className="font-mono text-sm" style={{ color: meta.accent }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-text-body">{q}</p>
              </div>
            ))}
          </div>
        </section>

        {/* มุมที่ ARCHRON ใช้อ่าน */}
        <section className="scroll-reveal mt-12">
          <h2 className="flex items-center gap-3 font-serif text-fluid-h3 text-text-heading">
            <span className="h-5 w-[3px] rounded" style={{ backgroundColor: meta.accent }} aria-hidden="true" />
            มุมที่ ARCHRON ใช้อ่าน
          </h2>
          <p className="mt-5 border-l-2 pl-5 text-base leading-loose text-text-body" style={{ borderColor: `color-mix(in srgb, ${meta.accent} 45%, transparent)` }}>
            {d.lens}
          </p>
        </section>

        {/* นำทาง */}
        <div className="mt-16 flex items-center justify-between border-t border-border/20 pt-8 text-sm">
          <Link href="/disciplines" className="text-accent transition-colors hover:text-accent">
            ← ศาสตร์ทั้งหมด
          </Link>
          <Link href="/concepts" className="text-text-secondary transition-colors hover:text-accent">
            สำรวจคลังแนวคิด →
          </Link>
        </div>
      </div>
    </main>
  );
}
