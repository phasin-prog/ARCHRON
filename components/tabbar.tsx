"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon, KnowledgeHubIcon, MenuIcon, PersonIcon } from "@/components/icons";

type Item = { href: string; label: string; icon: string; key: string };

// ปลายทางหลักสำหรับมือถือ (เลือกจาก glass-nav เดิม ให้กระชับ) + โปรไฟล์นักอ่าน
const ITEMS: Item[] = [
  { href: "/", label: "หน้าแรก", icon: "home", key: "home" },
  { href: "/knowledge", label: "คลังความรู้", icon: "explore", key: "explore" },
  { href: "/search", label: "ค้นหา", icon: "search", key: "search" },
  { href: "/constellation", label: "แผนที่", icon: "hub", key: "hub" },
  { href: "/profile", label: "โปรไฟล์", icon: "person", key: "person" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Tabbar — นำทางหลักบนมือถือ (≤ md) · ซ่อนบน desktop ที่มี glass-nav อยู่แล้ว
// motion: เฉพาะ transform/opacity/สี · เคารพ prefers-reduced-motion (transition สั้น ๆ)
export function Tabbar() {
  const pathname = usePathname() || "/";

  // ไม่แสดงบนหน้า Studio (เป็นพื้นที่ทำงานของนักเขียน มีแถบเครื่องมือของตัวเอง)
  if (pathname.startsWith("/studio")) return null;

  return (
    <nav
      aria-label="นำทางหลัก"
      className="glass-nav fixed inset-x-0 bottom-0 z-40 border-t border-accent/12 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 sm:px-4">
        {ITEMS.map((it) => {
          const active = isActive(pathname, it.href);
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className="group flex flex-col items-center gap-0.5 px-1 py-2.5 min-h-[48px]"
              >
                <span
                  className={`flex h-9 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                    active
                      ? "scale-105 bg-accent/15 text-accent"
                      : "text-text-secondary/65 group-hover:text-accent/80"
                  }`}
                >
                  {it.key === "home" && <MenuIcon className="h-5.5 w-5.5" />}
                  {it.key === "explore" && <KnowledgeHubIcon className="h-5.5 w-5.5" />}
                  {it.key === "search" && <SearchIcon className="h-5.5 w-5.5" />}
                  {it.key === "hub" && <KnowledgeHubIcon className="h-5.5 w-5.5" />}
                  {it.key === "person" && <PersonIcon className="h-5.5 w-5.5" />}
                </span>
                <span
                  className={`font-serif text-[10px] leading-none tracking-[0.04em] transition-colors duration-300 ${
                    active ? "text-accent" : "text-text-secondary/60"
                  }`}
                >
                  {it.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
