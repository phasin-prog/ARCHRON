import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ไม่พบหน้าที่ต้องการ — ARCHRON",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center">
      {/* Icon */}
      <div className="mb-8">
        <span className="material-symbols-outlined text-[72px] text-accent/25">
          explore_off
        </span>
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
          <span className="material-symbols-outlined text-[24px] text-accent/60">
            home
          </span>
          <div>
            <p className="text-sm font-medium text-text-heading group-hover:text-accent">
              กลับหน้าแรก
            </p>
            <p className="text-xs text-text-secondary/50">
              เริ่มต้นสำรวจจากจุดเริ่มต้น
            </p>
          </div>
          <span className="material-symbols-outlined ml-auto text-[18px] text-text-secondary/30 opacity-0 transition-opacity group-hover:opacity-100">
            arrow_forward
          </span>
        </Link>

        <Link
          href="/search"
          className="group flex items-center gap-3 rounded-lg border border-border/30 bg-bg-card px-5 py-4 text-left transition-all hover:border-accent/40 hover:bg-bg-card"
        >
          <span className="material-symbols-outlined text-[24px] text-accent/60">
            search
          </span>
          <div>
            <p className="text-sm font-medium text-text-heading group-hover:text-accent">
              ค้นหา
            </p>
            <p className="text-xs text-text-secondary/50">
              ค้นแนวคิด บทความ และหน้าต่าง ๆ
            </p>
          </div>
          <span className="material-symbols-outlined ml-auto text-[18px] text-text-secondary/30 opacity-0 transition-opacity group-hover:opacity-100">
            arrow_forward
          </span>
        </Link>

        <Link
          href="/concepts"
          className="group flex items-center gap-3 rounded-lg border border-border/30 bg-bg-card px-5 py-4 text-left transition-all hover:border-accent/40 hover:bg-bg-card"
        >
          <span className="material-symbols-outlined text-[24px] text-accent/60">
            neurology
          </span>
          <div>
            <p className="text-sm font-medium text-text-heading group-hover:text-accent">
              คลังแนวคิด
            </p>
            <p className="text-xs text-text-secondary/50">
              ระบบความรู้แบบเชื่อมโยง
            </p>
          </div>
          <span className="material-symbols-outlined ml-auto text-[18px] text-text-secondary/30 opacity-0 transition-opacity group-hover:opacity-100">
            arrow_forward
          </span>
        </Link>

        <Link
          href="/articles"
          className="group flex items-center gap-3 rounded-lg border border-border/30 bg-bg-card px-5 py-4 text-left transition-all hover:border-accent/40 hover:bg-bg-card"
        >
          <span className="material-symbols-outlined text-[24px] text-accent/60">
            article
          </span>
          <div>
            <p className="text-sm font-medium text-text-heading group-hover:text-accent">
              บทความ
            </p>
            <p className="text-xs text-text-secondary/50">
              งานอ่านที่อธิบายและตีความแนวคิด
            </p>
          </div>
          <span className="material-symbols-outlined ml-auto text-[18px] text-text-secondary/30 opacity-0 transition-opacity group-hover:opacity-100">
            arrow_forward
          </span>
        </Link>
      </div>
    </main>
  );
}
