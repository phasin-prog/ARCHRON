import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";
import { getPublicEntries } from "@/lib/content/public-source";

export const metadata: Metadata = {
  title: "บทความ — ARCHRON",
};

// E8 — อ่านจาก Supabase (published) + fallback static · ISR 5 นาที + on-demand จาก E7
export const revalidate = 300;

export default async function ArticlesPage() {
  const published = await getPublicEntries();

  return (
    <main className="pb-24">
      <PageHeader
        kicker="บทความ"
        title="บทความ"
        lead="งานอ่านที่อธิบาย วิเคราะห์ และตีความแนวคิดเกี่ยวกับจิตใจมนุษย์ โดยวางไว้ในบริบทเดิมและเชื่อมกลับไปยังแนวคิดและแหล่งอ้างอิง"
      />
      <section className="scroll-reveal stagger-1 mx-auto max-w-6xl px-6">
        {published.length === 0 ? (
          <div className="rounded-md border border-ink/10 bg-surface-1/50 p-10 text-center">
            <p className="text-soft-ivory">ยังไม่มีบทความเผยแพร่ — กำลังจัดเตรียมเนื้อหาชุดแรก</p>
            <p className="mt-2 text-sm text-muted">เนื้อหาเริ่มต้นจะถูกเพิ่มใน Phase 13 (Initial Content Seed)</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {published.map((e) => (
              <Link
                key={e.slug}
                href={`/articles/${e.slug}`}
                className="group rounded-md border border-ink/10 bg-surface-1/50 p-6 transition-colors hover:border-antique-gold/40"
              >
                <span className="text-xs tracking-widest text-antique-gold">
                  {e.framework ?? e.contentType}
                </span>
                <h2 className="mt-2 font-serif text-xl text-ivory group-hover:text-soft-gold">
                  {e.title}
                </h2>
                {e.shortDescription ? (
                  <p className="mt-2 text-sm leading-relaxed text-soft-ivory">
                    {e.shortDescription}
                  </p>
                ) : null}
                <span className="mt-3 inline-block text-sm text-soft-gold">อ่านต่อ →</span>
              </Link>
            ))}
          </div>
        )}
      </section>
      <PageNav current="/articles" />
    </main>
  );
}
