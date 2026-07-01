import type { Metadata } from "next";
import Link from "next/link";
import { getPublicSchools } from "@/lib/content/public-source";
import { SchoolsHub } from "@/components/schools/schools-hub";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "คลังปัญญา: สำนักคิดและนักปราชญ์โลก — ARCHRON",
  description:
    "ไดเรกทอรีสำนักคิดและนักปราชญ์โลก — สำรวจสำนักคิด นักปราชญ์ และผลงานเด่น เรียงตามชื่อสำนัก พร้อมค้นหาและดัชนีตัวอักษร",
};

export default async function SchoolsPage() {
  const schools = await getPublicSchools();
  
  return (
    <main className="px-6 pb-24 pt-10">
      <div className="mx-auto max-w-[1100px]">
        <nav aria-label="เส้นทางนำทาง" className="flex flex-wrap items-center gap-1 text-xs text-muted">
          <Link href="/" className="rounded px-2 py-1.5 transition-colors hover:text-soft-gold focus-visible:ring-1 focus-visible:ring-burnished-gold/60 focus-visible:text-soft-gold focus-visible:outline-none">หน้าแรก</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle" aria-hidden="true">chevron_right</span>
          <span className="px-2 py-1.5 text-soft-ivory">สำนักคิดและนักปราชญ์</span>
        </nav>

        <header className="scroll-reveal mt-6">
          <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-burnished-gold/70">
            Schools of Thought &amp; Thinkers
          </span>
          <h1 className="mt-3 font-serif text-4xl font-bold text-ivory md:text-5xl">
            คลังปัญญา: สำนักคิดและนักปราชญ์โลก
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-soft-ivory">
            สำรวจสำนักคิด นักปราชญ์ และผลงานเด่น — เรียงตามชื่อสำนัก ค้นหาได้ตามชื่อสำนัก ชื่อนักคิด หรือชื่อผลงาน
          </p>
        </header>

        <div className="scroll-reveal stagger-1">
          <SchoolsHub schools={schools} />
        </div>
      </div>
    </main>
  );
}
