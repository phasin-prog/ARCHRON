"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArchronMark,
  KnowledgeHubIcon,
  PathIcon,
  SearchIcon,
  SchoolIcon,
} from "@/components/icons";

type Item = { href: string; label: string; Icon: React.ComponentType<{ className?: string }> };

const ITEMS: Item[] = [
  { href: "/knowledge", label: "คลัง", Icon: KnowledgeHubIcon },
  { href: "/constellation", label: "แผนที่", Icon: PathIcon },
  { href: "/", label: "หน้าแรก", Icon: ArchronMark },
  { href: "/search", label: "ค้นหา", Icon: SearchIcon },
  { href: "/thinkers", label: "นักปราชญ์", Icon: SchoolIcon },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Tabbar() {
  const pathname = usePathname() || "/";

  if (pathname.startsWith("/studio")) return null;

  return (
    <nav
      aria-label="นำทางหลัก"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-accent/8 bg-white pb-[calc(env(safe-area-inset-bottom,0px)+2px)] max-lg:flex lg:hidden"
    >
      {ITEMS.map((it) => {
        const active = isActive(pathname, it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-label={it.label}
            aria-current={active ? "page" : undefined}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
          >
            <it.Icon
              className={`h-6 w-6 transition-colors duration-200 ${
                active ? "text-accent" : "text-text-secondary/55"
              }`}
            />
            <span
              className={`text-[10px] font-medium leading-none transition-colors duration-200 ${
                active ? "text-accent" : "text-text-secondary/50"
              }`}
            >
              {it.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
