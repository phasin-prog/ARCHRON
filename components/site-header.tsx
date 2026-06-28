"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV = [
  { label: "บทความ", href: "/articles", icon: "newspaper" },
  { label: "คลังแนวคิด", href: "/concepts", icon: "psychology" },
  { label: "แผนที่ความสัมพันธ์", href: "/constellation", icon: "hub" },
  { label: "ซีรีส์", href: "/reading-sets", icon: "layers" },
  { label: "แหล่งอ้างอิง", href: "/sources", icon: "format_quote" },
  { label: "ทรัพยากรภายนอก", href: "/external-links", icon: "link" },
  { label: "Manifesto", href: "/manifesto", icon: "description" },
  { label: "สนับสนุน", href: "/support", icon: "favorite" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const id = requestAnimationFrame(onScroll); // เช็คตำแหน่งเริ่มต้นนอก effect body
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-50 glass-nav ${scrolled ? "is-scrolled" : ""}`}>
      <nav
        className={`mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link
          href="/"
          className="font-serif text-[22px] tracking-tight text-burnished-gold"
          aria-label="The Soul's Compass หน้าแรก"
        >
          The Soul&apos;s Compass
        </Link>

        <div className="hidden items-center gap-5 xl:flex" aria-label="เมนูหลัก">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-all duration-300 hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="ค้นหา"
            className="flex h-10 w-10 items-center justify-center text-on-surface-variant transition-colors hover:text-burnished-gold"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </Link>
          <Link
            href="/articles"
            className="hidden border border-burnished-gold/30 bg-burnished-gold/10 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-burnished-gold transition-all duration-500 hover:bg-burnished-gold hover:text-deep-navy md:block"
          >
            เข้าสู่คลังความรู้
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-on-surface xl:hidden"
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={open}
          >
            <span className="material-symbols-outlined text-2xl">{open ? "close" : "menu"}</span>
          </button>
        </div>
      </nav>

      {open ? (
        <nav
          className="menu-in border-t border-slate-boundary/40 bg-deep-navy px-6 py-3 xl:hidden"
          aria-label="เมนูมือถือ"
        >
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 border-b border-white/5 py-3 text-base text-on-surface-variant last:border-none hover:text-primary"
            >
              <span className="material-symbols-outlined text-[20px] text-burnished-gold/70">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
