import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getPublicEntries } from "@/lib/content/public-source";
import { THEMES, entriesForTheme } from "@/lib/content/themes";

export const metadata: Metadata = {
  title: "แก่นเรื่อง — ARCHRON",
  description:
    "แก่นเรื่องข้ามศาสตร์ของ ARCHRON — รวมแนวคิด บทความ และนักคิดที่พูดถึงแก่นเดียวกัน แม้มาจากต่างศาสตร์",
};

export const revalidate = 300;

export default async function ThemesPage() {
  const entries = await getPublicEntries();

  return (
    <main className="pb-24">
      <PageHeader
        kicker="แก่นเรื่อง"
        title="แก่นเรื่องข้ามศาสตร์"
        lead="แก่นความคิดที่ปรากฏซ้ำในหลายศาสตร์ — เลือกแก่นเรื่องเพื่อรวบรวมแนวคิด บทความ และนักคิดที่พูดถึงสิ่งเดียวกัน แม้จะมาจากจิตวิทยา ปรัชญา หรือศาสตร์อื่น"
      />
      <section className="scroll-reveal stagger-1 mx-auto max-w-5xl px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {THEMES.map((t) => {
            const count = entriesForTheme(entries, t.key).length;
            return (
              <Link
                key={t.key}
                href={`/themes/${t.key}`}
                className="archron-card group p-6 transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                style={{ borderColor: `${t.accent}44` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2
                    className="font-serif text-xl group-hover:opacity-90"
                    style={{ color: t.accent }}
                  >
                    {t.label}
                  </h2>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                    style={{ backgroundColor: `${t.accent}1f`, color: t.accent }}
                  >
                    {count} รายการ
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-text-body">{t.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
