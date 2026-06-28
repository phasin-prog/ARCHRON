import type { Metadata } from "next";
import Link from "next/link";
import { SCHOOLS } from "@/lib/content/schools";
import { SchoolsHub } from "@/components/schools/schools-hub";

export const metadata: Metadata = {
  title: "คลังปัญญา: สำนักคิดและนักปราชญ์โลก — The Soul's Compass",
  description:
    "ไดเรกทอรีสำนักคิดและนักปราชญ์โลก — สำรวจสำนักคิด นักปราชญ์ และผลงานเด่น เรียงตามชื่อสำนัก พร้อมค้นหาและดัชนีตัวอักษร",
};

export default function SchoolsPage() {
  return (
    <main className="px-6 pb-24 pt-10">
      <div className="mx-auto max-w-[1100px]">
        <nav aria-label="เส้นทางนำทาง" className="flex flex-wrap items-center gap-1 text-xs text-muted">
          <Link href="/" className="transition-colors hover:text-soft-gold">หน้าแรก</Link>
          <span className="material-symbols-outlined text-[16px] text-subtle">chevron_right</span>
          <span className="text-soft-ivory">สำนักคิดและนักปราชญ์</span>
        </nav>

        <header className="mt-6">
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

        <SchoolsHub schools={SCHOOLS} />
      </div>
    </main>
  );
}
