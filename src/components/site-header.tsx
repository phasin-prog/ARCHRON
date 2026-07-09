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
  SchoolIcon,
  SynthesisIcon,
  GridIcon,
  ChevronDownIcon,
} from "@/components/icons";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";

type IconComponent = React.ComponentType<{ className?: string }>;
type Tier = "primary" | "standard";
type NavItem = { label: string; href: string; Icon: IconComponent; tier: Tier };

// ลิงก์ระดับบน — ลดเหลือ 5-6 จุดตัดสินใจ (Hick's Law / Miller's Law)
// primary = เด่นสุด, standard = ปานกลาง, utility = dropdown "เพิ่มเติม", support = pill
const NAV: NavItem[] = [
  { label: "คลังความรู้", href: "/knowledge", Icon: KnowledgeHubIcon, tier: "primary" },
  { label: "แผนที่ความรู้", href: "/constellation", Icon: HistoryIcon, tier: "standard" },
  { label: "สำนักคิด", href: "/schools", Icon: SchoolIcon, tier: "standard" },
  { label: "แหล่งอ้างอิง", href: "/sources", Icon: QuoteIcon, tier: "standard" },
  { label: "คำถามที่พบบ่อย", href: "/faq", Icon: HelpIcon, tier: "standard" },
];

// สีลิงก์เดสก์ท็อปตาม tier (ไม่มีไอคอนบนเดสก์ท็อป — ลดความแน่น)
function tierClass(tier: Tier, isActive: boolean): string {
  if (isActive) return "text-accent font-semibold";
  if (tier === "primary") return "text-text-heading hover:text-accent";
  return "text-text-secondary hover:text-accent";
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const acctRef = useRef<HTMLDivElement>(null);
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

  // ปิดเมนูมือถือและคืนค่า body scroll เมื่อปรับขนาดหน้าจอ >= 1024px
  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      if (window.innerWidth >= 1024 && open) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  // ปิดเมนูมือถือเมื่อกดปุ่ม Esc
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
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

  // หน้า Studio เป็นพื้นที่ทำงาน (มี chrome ของตัวเอง) — ซ่อน header สาธารณะ
  // หน้าอ่านเนื้อหา (articles/concepts/books detail) — ซ่อน header เพื่อให้ focus ที่การอ่าน
  const readingPaths = ["/articles/", "/concepts/", "/books/"];
  const isReadingPage = readingPaths.some((p) => pathname?.startsWith(p));
  if (pathname?.startsWith("/studio") || isReadingPage) return null;

  const menuItem =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-text-heading/5 hover:text-text-heading";

  const pillClass = (href: string) =>
    `gold-pill ${isActive(href) ? "gold-pill--active" : ""}`;

  return (
    <header className={`sticky top-0 z-50 glass-nav ${scrolled ? "is-scrolled" : ""}`}>
      {/* Desktop (>lg) — center-aligned logo + gold pill nav */}
      <div className="hidden lg:block">
        <div className="mx-auto px-6" style={{ maxWidth: "var(--width-dashboard)" }}>
          {/* Row 1: Logo center + Search/Account right */}
          <div className="relative flex justify-center py-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-accent hover:opacity-85 transition-opacity"
              aria-label="ARCHRON หน้าแรก"
            >
              <ArchronLogomark className="h-7 w-7 shrink-0" />
              <span className="font-wordmark text-[21px] font-semibold tracking-[0.2em]">ARCHRON</span>
            </Link>
            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-2">
              <Link
                href="/search"
                aria-label="ค้นหา"
                className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:text-accent"
              >
                <SearchIcon className="h-[20px] w-[20px]" />
              </Link>
              <SignedIn>
                <Link
                  href="/profile"
                  aria-label="โปรไฟล์ของฉัน"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:text-accent"
                >
                  <PersonIcon className="h-[20px] w-[20px]" />
                </Link>
              </SignedIn>
              <div className="relative" ref={acctRef}>
                <button
                  type="button"
                  onClick={() => setAcctOpen((v) => !v)}
                  aria-expanded={acctOpen}
                  aria-haspopup="menu"
                  aria-controls="account-menu"
                  aria-label="เมนูบัญชี"
                  className="flex items-center gap-2 rounded-full border border-accent/20 py-1.5 pl-2.5 pr-3 text-sm font-serif text-accent transition-colors hover:border-accent/40 hover:text-accent"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10">
                    <PersonIcon className="h-[16px] w-[16px]" />
                  </span>
                  <span>บัญชี</span>
                  <ChevronDownIcon
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${acctOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {acctOpen ? (
                  <div
                    id="account-menu"
                    role="menu"
                    className="glass-nav-panel absolute right-0 top-[calc(100%+10px)] min-w-[214px] rounded-xl border border-accent/20 p-1.5 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)]"
                  >
                    <SignedOut>
                      <p className="px-3 pb-1 pt-2 text-sm font-medium text-text-secondary/80">ยินดีต้อนรับ</p>
                      <Link href="/th/login" onClick={() => setAcctOpen(false)} className={menuItem} role="menuitem">
                        <LoginIcon className="h-[18px] w-[18px] text-accent" />
                        เข้าสู่ระบบ
                      </Link>
                    </SignedOut>
                    <SignedIn>
                      <p className="px-3 pb-1 pt-2 text-sm font-medium text-text-secondary/80">บัญชีของคุณ</p>
                      <Link href="/profile" onClick={() => setAcctOpen(false)} className={menuItem} role="menuitem">
                        <PersonIcon className="h-[18px] w-[18px] text-accent" />
                        โปรไฟล์ของฉัน
                      </Link>
                      <Link href="/studio" onClick={() => setAcctOpen(false)} className={menuItem} role="menuitem">
                        <EditIcon className="h-[18px] w-[18px] text-accent" />
                        Studio
                      </Link>
                      <span className="my-1.5 block h-px bg-border/30" aria-hidden="true" />
                      <button
                        type="button"
                        onClick={() => { setAcctOpen(false); clerk.signOut(); }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-error transition-colors hover:bg-error/10"
                        role="menuitem"
                      >
                        <LogoutIcon className="h-[18px] w-[18px]" />
                        ออกจากระบบ
                      </button>
                    </SignedIn>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="h-px bg-accent/10" />
          {/* Row 2: Nav pills */}
          <nav className="flex justify-center gap-1.5 py-3" aria-label="เมนูหลัก">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={pillClass(item.href)} data-nav-label={item.label}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile (<lg) — logo left + hamburger right */}
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-accent hover:opacity-85 transition-opacity"
          aria-label="ARCHRON หน้าแรก"
        >
          <ArchronLogomark className="h-7 w-7 shrink-0" />
          <span className="font-wordmark text-[21px] font-semibold tracking-[0.2em]">ARCHRON</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex h-11 w-11 items-center justify-center transition-colors ${open ? "text-accent" : "text-text-heading hover:text-accent"}`}
          aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile / tablet (< lg): Modern Full-screen Glass Overlay */}
      {open ? (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="เมนูนำทางและบัญชีผู้ใช้"
          className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-bg/95 backdrop-blur-2xl transition-all duration-300 lg:hidden"
        >
          {/* Top Bar */}
          <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-border/30 bg-bg/90 px-4 sm:px-6 backdrop-blur-md">
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
              className="flex h-10 w-10 items-center justify-center rounded-full bg-text-heading/5 text-text-heading transition-colors hover:bg-text-heading/10"
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
              className="flex w-full items-center gap-3 rounded-xl border border-border/40 bg-text-heading/[0.04] px-4 py-3 text-text-secondary transition-all hover:border-accent/50 hover:bg-text-heading/[0.06] hover:text-text-heading shadow-sm"
            >
              <SearchIcon className="h-5 w-5 text-accent" />
              <span className="text-base font-medium">ค้นหาความรู้ แนวคิด หรือสำนักคิด...</span>
            </Link>

            {/* Nav Items */}
            <div className="space-y-2.5">
              {NAV.map((item) => {
                let subLabel = "สำรวจและค้นหาเนื้อหาในคลังความรู้";
                if (item.href === "/explore") subLabel = "สารบัญนำทางและแผนที่คลังความรู้ทั้งหมด";
                else if (item.href === "/constellation") subLabel = "แผนที่ความสัมพันธ์ของแนวคิดและศาสตร์ต่าง ๆ";
                else if (item.href === "/schools") subLabel = "สำนักคิด นักปราชญ์ และผู้รากฐานทฤษฎี";
                else if (item.href === "/sources") subLabel = "แหล่งอ้างอิงและบรรณานุกรม";
                else if (item.href === "/faq") subLabel = "คำถามที่พบบ่อยเกี่ยวกับโครงการ";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    data-nav-label={item.label}
                    className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all ${
                      isActive(item.href)
                        ? "border-accent/60 bg-accent/10"
                        : "border-border/30 bg-text-heading/[0.025] hover:border-accent/40 hover:bg-text-heading/[0.06]"
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
                          isActive(item.href) ? "text-accent" : "text-text-heading"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="mt-0.5 text-xs text-text-secondary/70 font-normal">
                        {subLabel}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

          </div>

          {/* Bottom Pinned Section: User Card & Support Footer */}
          <div className="mt-auto shrink-0 border-t border-border/30 bg-bg/80 px-4 py-5 sm:px-6 backdrop-blur-md space-y-4">
            <SignedOut>
              <Link
                href="/th/login"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent py-3 text-base font-semibold text-bg transition-all hover:opacity-95"
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
                    className="flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/15 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent hover:text-bg"
                  >
                    <PersonIcon className="h-4 w-4 shrink-0" />
                    <span>โปรไฟล์ของฉัน</span>
                  </Link>
                  <Link
                    href="/studio"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-text-heading/5 py-2.5 text-sm font-medium text-text-heading transition-all hover:bg-text-heading/10"
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
                  className="flex w-full items-center justify-center gap-2 py-1.5 text-xs font-medium text-error/80 transition-colors hover:text-error cursor-pointer"
                >
                  <LogoutIcon className="h-4 w-4 shrink-0" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </SignedIn>

            {/* Support Project Link */}
            <div className="pt-1 text-center">
              <Link
                href="/support"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-accent/20 px-4 py-1 text-xs text-accent/80 transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-accent"
              >
                <HeartIcon className="h-3.5 w-3.5 text-accent" />
                <span>สนับสนุนโครงการ Archron</span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
