import Link from "next/link";
import type { Metadata } from "next";
import { SearchIcon, ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "ไม่พบหน้าที่ต้องการ — ARCHRON",
};

export default function NotFound() {
  return (
    <main className="tpl-reference flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      {/* Icon */}
      <div className="mb-8">
        <span className="inline-flex items-center justify-center w-[72px] h-[72px] text-[72px] text-accent/25" aria-hidden="true">◎</span>
      </div>

      {/* Message */}
      <h1 className="font-serif text-3xl text-text-heading sm:text-4xl">
        ไม่พบหน้าที่ต้องการ
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-text-secondary/70">
        หน้านี้อาจถูกย้าย ลบ หรือเปลี่ยนชื่อ — หรือคุณอาจพิมพ์ที่อยู่ผิด
      </p>

      {/* Suggestions */}
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-lg border border-border/30 bg-bg-card px-5 py-4 text-left transition-all hover:border-accent/40 hover:bg-bg-card"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 text-[24px] text-accent/60" aria-hidden="true">⌂</span>
          <div>
            <p className="text-sm font-medium text-text-heading group-hover:text-accent">
              กลับหน้าแรก
            </p>
            <p className="text-xs text-text-secondary/50">
              เริ่มต้นสำรวจจากจุดเริ่มต้น
            </p>
          </div>
          <ArrowRightIcon className="ml-auto h-[18px] w-[18px] text-text-secondary/30 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>

        <Link
          href="/search"
          className="group flex items-center gap-3 rounded-lg border border-border/30 bg-bg-card px-5 py-4 text-left transition-all hover:border-accent/40 hover:bg-bg-card"
        >
          <SearchIcon className="h-6 w-6 text-accent/60" />
          <div>
            <p className="text-sm font-medium text-text-heading group-hover:text-accent">
              ค้นหา
            </p>
            <p className="text-xs text-text-secondary/50">
              ค้นแนวคิด บทความ และหน้าต่าง ๆ
            </p>
          </div>
          <ArrowRightIcon className="ml-auto h-[18px] w-[18px] text-text-secondary/30 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>

        <Link
          href="/concepts"
          className="group flex items-center gap-3 rounded-lg border border-border/30 bg-bg-card px-5 py-4 text-left transition-all hover:border-accent/40 hover:bg-bg-card"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 text-[24px] text-accent/60" aria-hidden="true">🧠</span>
          <div>
            <p className="text-sm font-medium text-text-heading group-hover:text-accent">
              คลังแนวคิด
            </p>
            <p className="text-xs text-text-secondary/50">
              ระบบความรู้แบบเชื่อมโยง
            </p>
          </div>
          <ArrowRightIcon className="ml-auto h-[18px] w-[18px] text-text-secondary/30 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>

        <Link
          href="/articles"
          className="group flex items-center gap-3 rounded-lg border border-border/30 bg-bg-card px-5 py-4 text-left transition-all hover:border-accent/40 hover:bg-bg-card"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 text-[24px] text-accent/60" aria-hidden="true">📄</span>
          <div>
            <p className="text-sm font-medium text-text-heading group-hover:text-accent">
              บทความ
            </p>
            <p className="text-xs text-text-secondary/50">
              งานอ่านที่อธิบายและตีความแนวคิด
            </p>
          </div>
          <ArrowRightIcon className="ml-auto h-[18px] w-[18px] text-text-secondary/30 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
      </div>
    </main>
  );
}
