"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArchronLogomark,
  KnowledgeHubIcon,
  ManifestoIcon,
  QuoteIcon,
  ExternalLinkIcon,
  HelpIcon,
  HeartIcon,
  SearchIcon,
  MenuIcon,
  CloseIcon,
  LoginIcon,
  EditIcon,
  LogoutIcon,
  PersonIcon,
  HistoryIcon,
  SynthesisIcon,
  GridIcon,
} from "@/components/icons";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";

type IconComponent = React.ComponentType<{ className?: string }>;
type Tier = "primary" | "standard" | "utility" | "support";
type NavItem = { label: string; href: string; Icon: IconComponent; tier: Tier };

// ลิงก์ระดับบน — ลดเหลือ 5-6 จุดตัดสินใจ (Hick's Law / Miller's Law)
// primary = เด่นสุด, standard = ปานกลาง, utility = dropdown "เพิ่มเติม", support = pill
const NAV: NavItem[] = [
  { label: "คลังความรู้", href: "/articles", Icon: KnowledgeHubIcon, tier: "primary" },
  { label: "สำรวจ", href: "/concepts", Icon: SearchIcon, tier: "standard" },
  { label: "ศาสตร์", href: "/schools", Icon: GridIcon, tier: "standard" },
  { label: "ปฏิญญา", href: "/manifesto", Icon: ManifestoIcon, tier: "utility" },
  { label: "แหล่งอ้างอิง", href: "/sources", Icon: QuoteIcon, tier: "utility" },
  { label: "คำถามที่พบบ่อย", href: "/faq", Icon: HelpIcon, tier: "utility" },
  { label: "แผนที่ความสัมพันธ์", href: "/constellation", Icon: HistoryIcon, tier: "utility" },
  { label: "สนับสนุนโครงการ", href: "/support", Icon: HeartIcon, tier: "support" },
];

// Desktop: แสดง 3 หลัก + dropdown "เพิ่มเติม" + support pill
const PRIMARY_NAV = NAV.filter((i) => i.tier === "primary");
const STANDARD_NAV = NAV.filter((i) => i.tier === "standard");
const UTILITY_NAV = NAV.filter((i) => i.tier === "utility");
const SUPPORT = NAV.find((i) => i.tier === "support");

// สีลิงก์เดสก์ท็อปตาม tier (ไม่มีไอคอนบนเดสก์ท็อป — ลดความแน่น)
function tierClass(tier: Tier, isActive: boolean): string {
  if (isActive) return "text-accent font-semibold";
  switch (tier) {
    case "primary":
      return "text-on-surface hover:text-accent";
    case "utility":
      return "text-on-surface-variant/55 hover:text-accent";
    default:
      return "text-on-surface-variant hover:text-accent";
  }
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const acctRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const clerk = useClerk();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && !!pathname?.startsWith(href));

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ล็อกการเลื่อนหน้าเว็บ (Body scroll lock) เมื่อเปิดเมนูมือถือ
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ปิด dropdown บัญชีเมื่อคลิกนอก / กด Esc
  useEffect(() => {
    if (!acctOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (acctRef.current && !acctRef.current.contains(e.target as Node)) setAcctOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAcctOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [acctOpen]);

  // ปิด dropdown "เพิ่มเติม" เมื่อคลิกนอก / กด Esc
  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [moreOpen]);

  // หน้า Studio เป็นพื้นที่ทำงาน (มี chrome ของตัวเอง) — ซ่อน header สาธารณะ
  if (pathname?.startsWith("/studio")) return null;

  const menuItem =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-on-surface-variant transition-colors hover:bg-white/5 hover:text-on-surface";

  return (
    <header className={`sticky top-0 z-50 glass-nav ${scrolled ? "is-scrolled" : ""}`}>
      <nav
        className={`mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 transition-all duration-500 ${
          scrolled ? "py-2.5" : "py-4"
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

        {/* Desktop (lg+): 3 หลัก + dropdown "เพิ่มเติม" + support pill */}
        <div className="hidden items-center gap-1 lg:flex" aria-label="เมนูหลัก">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium tracking-[0.01em] transition-colors ${tierClass(
                item.tier,
                isActive(item.href),
              )}`}
            >
              {item.label}
            </Link>
          ))}
          {STANDARD_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm tracking-[0.01em] transition-colors ${tierClass(
                item.tier,
                isActive(item.href),
              )}`}
            >
              {item.label}
            </Link>
          ))}
          {/* Dropdown "เพิ่มเติม" สำหรับ utility items */}
          {UTILITY_NAV.length > 0 ? (
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
                aria-controls="more-menu"
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-on-surface-variant/55 transition-colors hover:text-accent"
              >
                เพิ่มเติม
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {moreOpen ? (
                <div
                  id="more-menu"
                  role="menu"
                  className="glass-nav-panel absolute right-0 top-[calc(100%+8px)] min-w-[200px] rounded-xl border border-slate-boundary/40 p-1.5 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)]"
                >
                  {UTILITY_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={menuItem}
                      role="menuitem"
                    >
                      <item.Icon className="h-[18px] w-[18px] text-accent" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          {SUPPORT ? (
            <>
              <span className="mx-1.5 h-5 w-px bg-slate-boundary/40" aria-hidden="true" />
              <Link
                href={SUPPORT.href}
                className="rounded-full border border-accent/30 px-4 py-1.5 text-sm text-soft-gold transition-colors hover:bg-accent/10 hover:text-ivory"
              >
                สนับสนุน
              </Link>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="ค้นหา"
            className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/5 ${
              pathname === "/search" ? "text-accent" : "text-on-surface-variant hover:text-accent"
            }`}
          >
            <SearchIcon className="h-[22px] w-[22px]" />
          </Link>

          {/* โปรไฟล์นักอ่าน — ทางเข้าลัดเด่น (เฉพาะผู้ล็อกอิน, เดสก์ท็อป) */}
          <SignedIn>
            <Link
              href="/profile"
              aria-label="โปรไฟล์ของฉัน"
              className={`hidden h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/5 lg:flex ${
                isActive("/profile") ? "text-accent" : "text-on-surface-variant hover:text-accent"
              }`}
            >
              <PersonIcon className="h-[22px] w-[22px]" />
            </Link>
          </SignedIn>

          {/* Account dropdown (lg+) — รวม เข้าสู่ระบบ / โปรไฟล์ / Studio / ออกจากระบบ */}
          <div className="relative hidden lg:block" ref={acctRef}>
            <button
              type="button"
              onClick={() => setAcctOpen((v) => !v)}
              aria-expanded={acctOpen}
              aria-haspopup="menu"
              aria-controls="account-menu"
              aria-label="เมนูบัญชี"
              className="flex items-center gap-2 rounded-full border border-slate-boundary/40 bg-white/[0.03] py-1.5 pl-2 pr-2.5 text-on-surface-variant transition-colors hover:border-accent/40 hover:text-on-surface"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent">
                <PersonIcon className="h-[18px] w-[18px]" />
              </span>
              <span className="text-sm">บัญชี</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 transition-transform duration-200 ${acctOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {acctOpen ? (
              <div
                id="account-menu"
                role="menu"
                className="glass-nav-panel absolute right-0 top-[calc(100%+10px)] min-w-[214px] rounded-xl border border-slate-boundary/40 p-1.5 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)]"
              >
                <SignedOut>
                  <p className="px-3 pb-1 pt-2 font-mono text-xs uppercase tracking-[0.12em] text-on-surface-variant/50">
                    ยินดีต้อนรับ
                  </p>
                  <Link href="/th/login" onClick={() => setAcctOpen(false)} className={menuItem} role="menuitem">
                    <LoginIcon className="h-[18px] w-[18px] text-accent" />
                    เข้าสู่ระบบ
                  </Link>
                </SignedOut>

                <SignedIn>
                  <p className="px-3 pb-1 pt-2 font-mono text-xs uppercase tracking-[0.12em] text-on-surface-variant/50">
                    บัญชีของคุณ
                  </p>
                  <Link href="/profile" onClick={() => setAcctOpen(false)} className={menuItem} role="menuitem">
                    <PersonIcon className="h-[18px] w-[18px] text-accent" />
                    โปรไฟล์ของฉัน
                  </Link>
                  <Link href="/studio" onClick={() => setAcctOpen(false)} className={menuItem} role="menuitem">
                    <EditIcon className="h-[18px] w-[18px] text-accent" />
                    Studio
                  </Link>
                  <span className="my-1.5 block h-px bg-slate-boundary/30" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => {
                      setAcctOpen(false);
                      clerk.signOut();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-danger transition-colors hover:bg-danger/10"
                    role="menuitem"
                  >
                    <LogoutIcon className="h-[18px] w-[18px]" />
                    ออกจากระบบ
                  </button>
                </SignedIn>
              </div>
            ) : null}
          </div>

          {/* Mobile / tablet (< lg): hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`flex h-11 w-11 items-center justify-center transition-colors lg:hidden ${
              open ? "text-accent" : "text-on-surface hover:text-accent"
            }`}
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile / tablet (< lg): Modern Full-screen Glass Overlay */}
      {open ? (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="เมนูนำทางและบัญชีผู้ใช้"
          className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-deep-navy/95 backdrop-blur-2xl transition-all duration-300 lg:hidden"
        >
          {/* Top Bar */}
          <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-boundary/30 bg-deep-navy/90 px-4 sm:px-6 backdrop-blur-md">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 text-accent hover:opacity-85 transition-opacity"
              aria-label="ARCHRON หน้าแรก"
            >
              <ArchronLogomark className="h-7 w-7 shrink-0" />
              <span className="font-wordmark text-[21px] font-semibold tracking-[0.2em]">ARCHRON</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-on-surface transition-colors hover:bg-white/10"
              aria-label="ปิดเมนู"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Main Content Area: Search Bar + Nav Groups */}
          <div className="flex-1 px-4 py-6 sm:px-6 space-y-6">
            {/* Integrated Search Bar */}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-boundary/40 bg-white/[0.04] px-4 py-3 text-on-surface-variant transition-all hover:border-accent/50 hover:bg-white/[0.06] hover:text-ivory shadow-sm"
            >
              <SearchIcon className="h-5 w-5 text-accent" />
              <span className="text-base font-medium">ค้นหาความรู้ แนวคิด หรือสำนักคิด...</span>
            </Link>

            {/* Primary & Standard Nav (Feature Cards Stack) */}
            <div className="space-y-2.5">
              {[...PRIMARY_NAV, ...STANDARD_NAV].map((item) => {
                let subLabel = "สำรวจและค้นหาเนื้อหาในคลังความรู้";
                if (item.href === "/articles") subLabel = "บทความ งานเขียน และบทวิเคราะห์เชิงลึก";
                else if (item.href === "/concepts") subLabel = "คำศัพท์และโครงสร้างแนวคิดทางจิตวิทยา";
                else if (item.href === "/schools") subLabel = "สำนักคิด นักปราชญ์ และผู้รากฐานทฤษฎี";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all ${
                      isActive(item.href)
                        ? "border-accent/60 bg-accent/10 shadow-[0_0_20px_rgba(200,168,90,0.15)]"
                        : "border-slate-boundary/30 bg-white/[0.025] hover:border-accent/40 hover:bg-white/[0.06]"
                    }`}
                  >
                    <item.Icon
                      className={`mt-0.5 h-6 w-6 shrink-0 transition-colors ${
                        isActive(item.href) ? "text-accent" : "text-accent/80"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span
                        className={`text-base font-semibold tracking-wide ${
                          isActive(item.href) ? "text-accent" : "text-ivory"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="mt-0.5 text-xs text-on-surface-variant/70 font-normal">
                        {subLabel}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Utility Nav Section (2-Column Grid) */}
            <div className="pt-2">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="h-px flex-1 bg-slate-boundary/30" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-on-surface-variant/50">
                  เพิ่มเติม
                </span>
                <span className="h-px flex-1 bg-slate-boundary/30" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {UTILITY_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-sm transition-all ${
                      isActive(item.href)
                        ? "border-accent/50 bg-accent/10 font-semibold text-accent"
                        : "border-white/5 bg-white/[0.015] text-on-surface-variant hover:border-white/15 hover:bg-white/[0.05] hover:text-ivory"
                    }`}
                  >
                    <item.Icon className="h-4 w-4 shrink-0 text-accent" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Pinned Section: User Card & Support Footer */}
          <div className="mt-auto shrink-0 border-t border-slate-boundary/30 bg-deep-navy/80 px-4 py-5 sm:px-6 backdrop-blur-md space-y-4">
            <SignedOut>
              <Link
                href="/th/login"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-soft-gold py-3 text-base font-semibold text-deep-navy shadow-[0_0_20px_rgba(200,168,90,0.15)] transition-all hover:opacity-95"
              >
                <LoginIcon className="h-5 w-5" />
                <span>เข้าสู่ระบบ</span>
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/15 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent hover:text-deep-navy"
                  >
                    <PersonIcon className="h-4 w-4 shrink-0" />
                    <span>โปรไฟล์ของฉัน</span>
                  </Link>
                  <Link
                    href="/studio"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-boundary/40 bg-white/5 py-2.5 text-sm font-medium text-ivory transition-all hover:bg-white/10"
                  >
                    <EditIcon className="h-4 w-4 shrink-0 text-accent" />
                    <span>Studio</span>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    clerk.signOut();
                  }}
                  className="flex w-full items-center justify-center gap-2 py-1.5 text-xs font-medium text-danger/80 transition-colors hover:text-danger cursor-pointer"
                >
                  <LogoutIcon className="h-4 w-4 shrink-0" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </SignedIn>

            {/* Support Project Link */}
            {SUPPORT ? (
              <div className="pt-1 text-center">
                <Link
                  href={SUPPORT.href}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-accent/20 px-4 py-1 text-xs text-soft-gold/80 transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-soft-gold"
                >
                  <HeartIcon className="h-3.5 w-3.5 text-accent" />
                  <span>สนับสนุนโครงการ Archron</span>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
