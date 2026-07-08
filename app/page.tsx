import Link from "next/link";
import { RecentlyViewed } from "@/components/recently-viewed";
import { DisciplineCard } from "@/components/discipline-card";
import { DISCIPLINES } from "@/lib/content/disciplines";
import { SearchIcon, ArrowRightIcon } from "@/components/icons";

export default function HomePage() {
  const latestKnowledge = DISCIPLINES.slice(0, 8);

  return (
    <main>
      {/* ── 1. HERO ── */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--color-accent) 6%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold tracking-tight text-text-heading sm:text-6xl md:text-7xl">
            ARCHRON
          </h1>
          <p className="mt-4 font-serif text-xl text-text-secondary sm:text-2xl">
            เข้าใจมนุษย์ ผ่านความรู้
          </p>
          <p className="mt-2 font-serif text-base text-text-secondary/70">
            Understanding Humanity Through Knowledge
          </p>
        </div>
      </section>

      {/* ── 2. SEARCH BAR ── */}
      <section className="relative z-10 -mt-8 flex justify-center px-4">
        <div className="w-full max-w-[720px]">
          <form action="/search" method="get" className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              name="q"
              placeholder="ค้นหาทุกสิ่ง..."
              className="w-full rounded-xl border border-border bg-bg-card py-4 pl-12 pr-4 text-center font-serif text-text-body shadow-sm transition-colors focus:border-accent/40 focus:ring-1 focus:ring-accent/20 focus:outline-none"
              aria-label="ค้นหา"
            />
          </form>
        </div>
      </section>

      {/* ── 3. CONTINUE READING (authenticated users only) ── */}
      <section className="mx-auto mt-20 max-w-[1200px] px-6">
        <RecentlyViewed />
      </section>

      {/* ── 4. FEATURED GUIDE ── */}
      <section className="mx-auto mt-20 max-w-[1200px] px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-2xl font-semibold text-text-heading">
            คู่มือแนะนำ
          </h2>
          <Link
            href="/guide"
            className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover"
          >
            ดูทั้งหมด <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link
            href="/guide"
            className="group rounded-xl border border-border bg-bg-card p-6 transition-colors hover:border-accent/30 hover:bg-bg-elevated"
          >
            <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
              Guide
            </span>
            <h3 className="mt-3 font-serif text-lg font-semibold text-text-heading">
              Jungian Type Analysis
            </h3>
            <p className="mt-2 text-sm text-text-secondary line-clamp-2">
              วิเคราะห์โครงสร้าง Ego ผ่านกรอบทฤษฎีจิตวิทยาเชิงลึกของคาร์ล ยุง
            </p>
          </Link>
        </div>
      </section>

      {/* ── 5. LATEST KNOWLEDGE ── */}
      <section className="mx-auto mt-20 max-w-[1200px] px-6 pb-24">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-2xl font-semibold text-text-heading">
            ความรู้ล่าสุด
          </h2>
          <Link
            href="/knowledge"
            className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover"
          >
            ดูทั้งหมด <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {latestKnowledge.map((d) => (
            <DisciplineCard key={d.key} entry={d} />
          ))}
        </div>
      </section>
    </main>
  );
}
