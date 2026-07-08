"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArchronLogomark, HeartIcon, SourceRefIcon } from "@/components/icons";
import { createClerkSupabaseClient } from "@/lib/supabase/client";
import { getTotalPageViews } from "@/lib/content/views-db";

const EXPLORE = [
  { label: "เข้าสู่คลังความรู้", href: "/knowledge" },
  { label: "อ่านงานเขียน", href: "/articles" },
  { label: "คลังแนวคิด", href: "/concepts" },
  { label: "ศาสตร์ที่เราศึกษา", href: "/disciplines" },
  { label: "แผนที่ความสัมพันธ์", href: "/constellation" },
  { label: "ซีรีส์การอ่าน", href: "/reading-sets" },
];

const ABOUT = [
  { label: "ปฏิญญา", href: "/manifesto" },
  { label: "แหล่งอ้างอิง", href: "/sources" },
  { label: "ทรัพยากรภายนอก", href: "/external-links" },
  { label: "คำถามที่พบบ่อย", href: "/faq" },
  { label: "สนับสนุนโครงการ", href: "/support" },
];

export function SiteFooter() {
  const pathname = usePathname();
  const [totalViews, setTotalViews] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClerkSupabaseClient(async () => null);
    let active = true;
    getTotalPageViews(supabase).then((t) => {
      if (active) setTotalViews(t);
    });
    return () => {
      active = false;
    };
  }, []);

  if (pathname?.startsWith("/studio")) return null;

  const linkClass =
    "inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent";

  return (
    <footer id="footer" className="archive-hall relative z-10 w-full bg-bg py-16">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-4 sm:px-6 md:grid-cols-12 md:gap-x-14">
        {/* Brand */}
        <div className="md:col-span-6">
          <h6 className="archive-hall__heading"><span aria-hidden="true">🏛</span> ผู้เขียน</h6>
          <div className="flex items-center gap-3 text-accent">
            <ArchronLogomark className="h-8 w-8 shrink-0" />
            <span className="font-wordmark text-[23px] font-semibold tracking-[0.22em]">ARCHRON</span>
          </div>
          <p className="mt-3 font-serif text-lg italic text-accent">
            a living library of human understanding
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary/75">
            คลังความเข้าใจมนุษย์ที่มีชีวิต — ค่อย ๆ เขียน รวบรวม และเชื่อมโยงศาสตร์ต่าง ๆ
            ตั้งแต่จุดกำเนิด ผ่านกาลเวลา
          </p>
          <p className="mt-4 text-sm italic text-text-secondary/70">
            บันทึกโดย{" "}
            <span className="font-wordmark not-italic tracking-[0.14em] text-accent">Archeon</span> — ผู้แสวงหาต้นกำเนิด
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href="/support"
              aria-label="สนับสนุนโครงการ"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-accent/20 text-accent/70 transition-all hover:border-accent/50 hover:text-accent"
            >
              <HeartIcon className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/manifesto"
              aria-label="ปฏิญญา"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-accent/20 text-accent/70 transition-all hover:border-accent/50 hover:text-accent"
            >
              <SourceRefIcon className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>

        {/* Explore */}
        <div className="md:col-span-3">
          <h6 className="archive-hall__heading"><span aria-hidden="true">📜</span> สำรวจ</h6>
          <ul className="flex flex-col gap-3">
            {EXPLORE.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* เกี่ยวกับ */}
        <div className="md:col-span-3">
          <h6 className="archive-hall__heading"><span aria-hidden="true">📖</span> เกี่ยวกับ</h6>
          <ul className="flex flex-col gap-3">
            {ABOUT.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1200px] flex-col items-center justify-between gap-4 border-t border-accent/10 px-4 sm:px-6 pt-8 sm:flex-row">
        <p className="text-center text-xs leading-relaxed tracking-wide text-text-secondary/55 sm:text-left">
          © 2026 <span className="text-accent">ARCHRON</span>
          {totalViews != null && totalViews > 0 ? (
            <>
              <span className="px-1.5 text-text-secondary/50">·</span>
              <span className="inline-flex items-center gap-1 text-text-secondary/70">
                <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[14px] text-accent/70" aria-hidden="true">👁</span>
                ผู้เยี่ยมชม {totalViews.toLocaleString("th-TH")} ครั้ง
              </span>
            </>
          ) : null}
        </p>
        <div className="flex items-center gap-6">
          <p className="text-center font-serif text-sm italic text-text-secondary/70 sm:text-right">
            สร้างเพื่อการอ่านและการตีความอย่างมีบริบท
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 font-serif text-xs tracking-[0.08em] text-text-secondary/60 transition-colors hover:text-accent"
            aria-label="เลื่อนขึ้นบนสุด"
          >
            ขึ้นบนสุด
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
