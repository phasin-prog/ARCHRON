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

      {/* Mobile / tablet (< lg): เมนูเต็ม (จัดกลุ่มลด cognitive load) */}
      {open ? (
        <nav
          id="mobile-nav"
          className="menu-in glass-nav-panel border-t border-slate-boundary/40 px-4 sm:px-6 py-4 lg:hidden"
          aria-label="เมนูมือถือ"
        >
          {/* Primary + Standard */}
          {[...PRIMARY_NAV, ...STANDARD_NAV].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded px-1 py-2.5 text-base transition-colors ${
                isActive(item.href) ? "text-accent font-semibold" : "text-on-surface-variant hover:text-accent"
              }`}
            >
              <item.Icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  isActive(item.href) ? "text-accent" : "text-accent/70"
                }`}
              />
              {item.label}
            </Link>
          ))}

          {/* Utility section */}
          <span className="my-2 block border-t border-slate-boundary/30" aria-hidden="true" />
          <span className="mb-1 block px-1 font-mono text-xs uppercase tracking-[0.12em] text-on-surface-variant/40">
            เพิ่มเติม
          </span>
          {UTILITY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded px-1 py-2.5 text-base transition-colors ${
                isActive(item.href) ? "text-accent font-semibold" : "text-on-surface-variant hover:text-accent"
              }`}
            >
              <item.Icon
                className={`h-5 w-5 shrink-0 transition-colors ${
                  isActive(item.href) ? "text-accent" : "text-accent/70"
                }`}
              />
              {item.label}
            </Link>
          ))}

          <span className="my-3 block h-px bg-slate-boundary/40" aria-hidden="true" />

          <SignedOut>
            <Link
              href="/th/login"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded border border-accent/30 px-4 py-2.5 text-base font-medium text-accent transition-colors hover:bg-accent hover:text-prima"
            >
              <LoginIcon className="h-5 w-5" />
              เข้าสู่ระบบ
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="flex flex-col gap-2">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded border border-accent/40 bg-accent/10 px-4 py-2.5 text-base font-semibold text-accent transition-colors hover:bg-accent hover:text-prima"
              >
                <PersonIcon className="h-5 w-5" />
                โปรไฟล์ของฉัน
              </Link>
              <Link
                href="/studio"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 rounded border border-accent/30 px-4 py-2.5 text-base font-medium text-accent transition-colors hover:bg-accent hover:text-prima"
              >
                <EditIcon className="h-5 w-5" />
                Studio
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  clerk.signOut();
                }}
                className="inline-flex items-center gap-2 rounded border border-danger/30 px-4 py-2.5 text-base font-medium text-danger transition-colors hover:bg-danger hover:text-ivory cursor-pointer"
              >
                <LogoutIcon className="h-5 w-5" />
                ออกจากระบบ
              </button>
            </div>
          </SignedIn>
        </nav>
      ) : null}
    </header>
  );
}
