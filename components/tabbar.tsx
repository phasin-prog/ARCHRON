"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; icon: string };

// 4 ปลายทางหลักสำหรับมือถือ (เลือกจาก glass-nav เดิม ให้กระชับ)
const ITEMS: Item[] = [
  { href: "/", label: "หน้าแรก", icon: "home" },
  { href: "/concepts", label: "คลังแนวคิด", icon: "neurology" },
  { href: "/search", label: "ค้นหา", icon: "search" },
  { href: "/constellation", label: "แผนที่", icon: "hub" },
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
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {ITEMS.map((it) => {
          const active = isActive(pathname, it.href);
          return (
            <li key={it.href} className="flex-1">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className="group flex flex-col items-center gap-0.5 px-1 py-2"
              >
                <span
                  className={`flex h-8 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                    active
                      ? "scale-105 bg-accent/15 text-accent"
                      : "text-on-surface-variant/65 group-hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{it.icon}</span>
                </span>
                <span
                  className={`text-[10px] leading-none transition-colors duration-300 ${
                    active ? "text-accent" : "text-on-surface-variant/60"
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
