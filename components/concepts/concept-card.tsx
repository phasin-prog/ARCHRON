"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ComponentType } from "react";
import { ContextMenu, type ContextMenuItem } from "@/components/context-menu";
import type { ConceptRegistryItem } from "@/lib/content/concept-registry";
import {
  ConceptIcon,
  PersonIcon,
  BookIcon,
  SchoolIcon,
  SymbolIcon,
  TermIcon,
} from "@/components/icons";

const NODE_LABEL: Record<string, string> = {
  concept: "แนวคิด",
  person: "นักคิด",
  book: "หนังสือ / งานเขียน",
  school: "สำนักคิด",
  symbol: "สัญลักษณ์",
  term: "คำศัพท์",
};

const NODE_ICON: Record<string, ComponentType<{ className?: string }>> = {
  concept: ConceptIcon,
  person: PersonIcon,
  book: BookIcon,
  school: SchoolIcon,
  symbol: SymbolIcon,
  term: TermIcon,
};

// การ์ดแนวคิด + เมนูลัด wiki (คลิกขวา / กดค้าง)
export function ConceptCard({ c }: { c: ConceptRegistryItem }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const Icon = NODE_ICON[c.nodeType];
  const href = `/concepts/${c.slug}`;

  const items: ContextMenuItem[] = [
    { label: "เปิดหน้าเต็ม", icon: "open_in_full", onSelect: () => router.push(href) },
    {
      label: "ดูในแผนที่ความสัมพันธ์",
      icon: "hub",
      onSelect: () => router.push(`/constellation?focus=${c.slug}`),
    },
    {
      label: "คัดลอกลิงก์",
      icon: "link",
      onSelect: () => {
        const url = `${window.location.origin}${href}`;
        navigator.clipboard
          ?.writeText(url)
          .then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          })
          .catch(() => {});
      },
    },
  ];

  return (
    <ContextMenu items={items} className="relative">
      <Link
        href={href}
        className="group block rounded-md border border-ink/10 bg-white/40 p-5 transition-colors hover:border-antique-gold/40"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {Icon ? <Icon className="h-5 w-5 text-antique-gold" /> : null}
            <span className="font-serif text-lg text-ivory group-hover:text-soft-gold">
              {c.title}
            </span>
          </div>
          <span className="shrink-0 text-xs text-antique-gold">
            {NODE_LABEL[c.nodeType] ?? c.nodeType}
          </span>
        </div>
        {c.thaiTitle ? <p className="mt-1 text-sm text-muted">{c.thaiTitle}</p> : null}
        {c.description ? (
          <p className="mt-2 text-sm leading-relaxed text-soft-ivory">{c.description}</p>
        ) : null}
      </Link>
      {copied ? (
        <span className="pointer-events-none absolute right-3 top-3 rounded bg-burnished-gold px-2 py-0.5 text-[11px] font-medium text-ink">
          คัดลอกแล้ว
        </span>
      ) : null}
    </ContextMenu>
  );
}
