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

type Item = { href: string; label: string; Icon: React.ComponentType<{ className?: string }>; color: string };

const ITEMS: Item[] = [
  { href: "/knowledge", label: "คลังความรู้", Icon: KnowledgeHubIcon, color: "#06b8ff" },
  { href: "/constellation", label: "แผนที่ความรู้", Icon: PathIcon, color: "#8444d6" },
  { href: "/", label: "หน้าแรก", Icon: ArchronMark, color: "#f2704d" },
  { href: "/search", label: "ค้นหา", Icon: SearchIcon, color: "#f8cd4b" },
  { href: "/thinkers", label: "นักปราชญ์", Icon: SchoolIcon, color: "#405fff" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Tabbar() {
  const pathname = usePathname() || "/";
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);

  return (
    <nav
      aria-label="นำทางหลัก"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center pb-[calc(env(safe-area-inset-bottom,0px)+4px)] max-lg:flex lg:hidden"
    >
      <div className="nb-pill">
        {ITEMS.map((it, index) => {
          const active = isActive(pathname, it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setTappedIndex(index)}
              aria-label={it.label}
              aria-current={active ? "page" : undefined}
              style={{ color: it.color }}
              className={`nb-item ${active ? "nb-item--active" : ""} ${tappedIndex === index ? "nb-item--tap" : ""}`}
              onAnimationEnd={() => setTappedIndex(null)}
            >
              <span className="nb-icon">
                <it.Icon className="nb-icon-svg" />
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
