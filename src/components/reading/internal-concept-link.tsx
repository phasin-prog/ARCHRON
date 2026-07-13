"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContextMenu, type ContextMenuItem } from "@/components/context-menu";
import { getConceptBySlug } from "@/lib/content/core/registry";

// ลิงก์ [[wikilink]] ในเนื้อหาอ่าน + Glossary (A2): hover/focus เพื่อดูนิยามสั้น
// + เมนูลัด wiki (inline, คลิกขวา/กดค้าง)
export function InternalConceptLink({ slug, label }: { slug: string; label: string }) {
  const router = useRouter();
  const href = `/concepts/${slug}`;
  const g = getConceptBySlug(slug); // ข้อมูลนิยามจาก Concept Registry

  const items: ContextMenuItem[] = [
    { label: "เปิดหน้าเต็ม", icon: "open_in_full", onSelect: () => router.push(href) },
    {
      label: "ดูในแผนที่ความสัมพันธ์",
      icon: "hub",
      onSelect: () => router.push(`/constellation?focus=${slug}`),
    },
    {
      label: "คัดลอกลิงก์",
      icon: "link",
      onSelect: () => {
        navigator.clipboard?.writeText(`${window.location.origin}${href}`).catch(() => {});
      },
    },
  ];

  return (
    <ContextMenu as="span" items={items} className="inline">
      <span className="group/gloss relative inline-block">
        <Link
          href={href}
          className="text-accent underline decoration-accent/30 decoration-dotted underline-offset-2 hover:decoration-accent"
        >
          {label}
        </Link>

        {/* Glossary card — แสดงเมื่อ hover/focus ถ้ามีนิยามใน registry */}
        {g ? (
          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-64 max-w-[80vw] -translate-x-1/2 translate-y-1 rounded-md border border-accent/25 bg-bg-card/95 p-3 text-left opacity-0 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)] backdrop-blur transition duration-200 group-hover/gloss:translate-y-0 group-hover/gloss:opacity-100 group-focus-within/gloss:translate-y-0 group-focus-within/gloss:opacity-100"
          >
            <span className="block font-serif text-sm leading-snug text-text-heading">
              {g.thaiTitle ?? g.title}
              {g.thaiTitle ? (
                <span className="text-text-secondary/50"> · {g.title}</span>
              ) : null}
            </span>
            {g.framework ? (
              <span className="mt-1 block text-[11px] tracking-[0.02em] text-accent/80">
                {g.framework}
              </span>
            ) : null}
            {g.description ? (
              <span className="mt-1.5 block text-xs leading-relaxed text-text-secondary/80">
                {g.description}
              </span>
            ) : null}
            <span className="mt-2 block text-[11px] text-accent">เปิดหน้าเต็ม →</span>
          </span>
        ) : null}
      </span>
    </ContextMenu>
  );
}
