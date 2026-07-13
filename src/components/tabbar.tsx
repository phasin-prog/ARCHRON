"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArchronMark,
  KnowledgeHubIcon,
  PathIcon,
  SearchIcon,
  SchoolIcon,
} from "@/components/icons";

type Item = { href: string; label: string; Icon: React.ComponentType<{ className?: string }>; colorKey: string };

const ITEMS: Item[] = [
  { href: "/knowledge", label: "คลัง", Icon: KnowledgeHubIcon, colorKey: "knowledge" },
  { href: "/constellation", label: "แผนที่", Icon: PathIcon, colorKey: "constellation" },
  { href: "/", label: "หน้าแรก", Icon: ArchronMark, colorKey: "home" },
  { href: "/search", label: "ค้นหา", Icon: SearchIcon, colorKey: "search" },
  { href: "/thinkers", label: "นักปราชญ์", Icon: SchoolIcon, colorKey: "thinkers" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Tabbar() {
  const pathname = usePathname() || "/";
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  if (pathname.startsWith("/studio")) return null;

  return (
    <nav
      aria-label="นำทางหลัก"
      className="fixed inset-x-0 bottom-0 z-40 max-lg:flex lg:hidden"
    >
      <div className="nb-container mx-auto flex w-full max-w-lg items-center justify-around rounded-t-[30px] border border-b-0 border-accent/10 bg-bg/92 px-2 pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] backdrop-blur-md">
        {ITEMS.map((it, index) => {
          const active = isActive(pathname, it.href);
          return (
            <li key={it.href} className="list-none flex-1">
              <Link
                href={it.href}
                onClick={() => setTappedIndex(index)}
                aria-current={active ? "page" : undefined}
                className={`group relative flex flex-col items-center gap-0.5 px-1 py-1.5 min-h-[60px] nb-color--${it.colorKey} ${active ? "nb-item--active" : ""}`}
              >
                <span className={`nb-bubble-wrapper ${tappedIndex === index ? "nb-bubble--tap" : ""}`}>
                  <it.Icon
                    className={`nb-icon relative z-10 h-[22px] w-[22px] ${active ? "nb-icon--active" : "text-text-secondary/60"}`}
                  />
                </span>
                <span
                  className={`font-ui text-[10px] leading-none tracking-[0.04em] transition-colors duration-300 ${active ? "text-accent font-medium" : "text-text-secondary/50"}`}
                >
                  {it.label}
                </span>
              </Link>
            </li>
          );
        })}
      </div>
    </nav>
  );
}
