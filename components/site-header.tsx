"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArchronLogomark } from "@/components/icons";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";

type NavItem = { label: string; href: string; icon: string };

// ลิงก์ระดับบนทั้งหมด — แยกเป็นลิงก์เดี่ยว ไม่มี dropdown
const NAV: NavItem[] = [
  { label: "เข้าสู่คลังความรู้", href: "/knowledge", icon: "explore" },
  { label: "ปฏิญญา", href: "/manifesto", icon: "description" },
  { label: "แหล่งอ้างอิง", href: "/sources", icon: "format_quote" },
  { label: "ทรัพยากรภายนอก", href: "/external-links", icon: "link" },
  { label: "คำถามที่พบบ่อย", href: "/faq", icon: "help" },
  { label: "สนับสนุนโครงการ", href: "/support", icon: "favorite" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const clerk = useClerk();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const id = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // หน้า Studio เป็นพื้นที่ทำงาน (มี chrome ของตัวเอง) — ซ่อน header สาธารณะ
  if (pathname?.startsWith("/studio")) return null;

  return (
    <header className={`sticky top-0 z-50 glass-nav ${scrolled ? "is-scrolled" : ""}`}>
      <nav
        className={`mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-accent hover:opacity-85 transition-opacity"
          aria-label="ARCHRON หน้าแรก"
        >
          <ArchronLogomark className="h-7 w-7 shrink-0" />
          <span className="font-wordmark text-[21px] font-semibold tracking-[0.2em]">ARCHRON</span>
        </Link>

        {/* Desktop (lg+): ลิงก์แบนแยกเดี่ยว */}
        <div className="hidden items-center gap-0.5 lg:flex" aria-label="เมนูหลัก">
          {NAV.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-1.5 rounded-md px-2.5 py-2 text-[13px] tracking-[0.02em] transition-colors ${
                  isActive ? "text-accent font-semibold" : "text-on-surface-variant hover:text-accent"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[17px] transition-colors ${
                    isActive ? "text-accent" : "text-accent/60 group-hover:text-accent"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="ค้นหา"
            className={`flex h-10 w-10 items-center justify-center transition-colors ${
              pathname === "/search" ? "text-accent" : "text-on-surface-variant hover:text-accent"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </Link>
          
          <SignedOut>
            <Link
              href="/th/login"
              className="hidden items-center gap-1.5 border border-accent/30 bg-accent/5 px-6 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-accent transition-all duration-500 hover:bg-accent hover:text-prima lg:inline-flex"
            >
              <span className="material-symbols-outlined text-[15px]">login</span>
              เข้าสู่ระบบ
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/studio"
                className="inline-flex items-center gap-1.5 border border-accent/30 bg-accent/10 px-6 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-accent transition-all duration-500 hover:bg-accent hover:text-prima"
              >
                <span className="material-symbols-outlined text-[15px]">edit_note</span>
                Studio
              </Link>
              <button
                onClick={() => clerk.signOut()}
                className="inline-flex items-center gap-1.5 border border-danger/30 bg-danger/5 px-5 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-danger transition-all duration-500 hover:bg-danger hover:text-ivory cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">logout</span>
                ออกจากระบบ
              </button>
            </div>
          </SignedIn>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`flex h-10 w-10 items-center justify-center transition-colors lg:hidden ${
              open ? "text-accent" : "text-on-surface hover:text-accent"
            }`}
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={open}
          >
            <span className="material-symbols-outlined text-2xl">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile / tablet (< lg): ลิงก์แยกเดี่ยว + Studio */}
      {open ? (
        <nav
          className="menu-in border-t border-slate-boundary/40 bg-deep-navy px-6 py-4 lg:hidden"
          aria-label="เมนูมือถือ"
        >
          {NAV.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded px-1 py-2.5 text-base transition-colors ${
                  isActive ? "text-accent font-semibold" : "text-on-surface-variant hover:text-accent"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] transition-colors ${
                    isActive ? "text-accent" : "text-accent/70"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
          <SignedOut>
            <Link
              href="/th/login"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center gap-2 rounded border border-accent/30 px-4 py-2.5 text-base font-medium text-accent transition-colors hover:bg-accent hover:text-prima"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              เข้าสู่ระบบ
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="flex flex-col gap-2">
              <Link
                href="/studio"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center gap-2 rounded border border-accent/30 px-4 py-2.5 text-base font-medium text-accent transition-colors hover:bg-accent hover:text-prima"
              >
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                Studio
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  clerk.signOut();
                }}
                className="inline-flex items-center gap-2 rounded border border-danger/30 px-4 py-2.5 text-base font-medium text-danger transition-colors hover:bg-danger hover:text-ivory cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                ออกจากระบบ
              </button>
            </div>
          </SignedIn>
        </nav>
      ) : null}
    </header>
  );
}
