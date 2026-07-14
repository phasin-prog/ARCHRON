"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ComponentType, memo } from "react";
import { ContextMenu, type ContextMenuItem } from "@/components/context-menu";
import type { ConceptRegistryItem } from "@/lib/content/core/registry";
import {
  ConceptIcon,
  PersonIcon,
  BookIcon,
  SchoolIcon,
  SymbolIcon,
  TermIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { NODE_TYPE_COLOR } from "@/lib/content/reading/graph";
import { ViewBadge } from "@/components/view-badge";

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

const ConceptCardInner = function ConceptCard({ c, hasRealContent = false }: { c: ConceptRegistryItem; hasRealContent?: boolean }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const Icon = NODE_ICON[c.nodeType];
  const accent = NODE_TYPE_COLOR[c.nodeType] ?? "var(--color-accent)";
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
        className={`group relative flex min-h-[240px] flex-col overflow-hidden rounded-lg border p-6 transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
          hasRealContent
            ? "border-[color-mix(in_srgb,var(--color-border)_35%,transparent)] bg-[linear-gradient(175deg,var(--color-bg-card)_0%,var(--color-bg-card)_100%)]"
            : "border-dashed border-border/30 bg-bg-card/30 opacity-70 hover:opacity-90 hover:border-border/50"
        }`}
        style={{
          boxShadow: hasRealContent
            ? `0 2px 16px -4px rgba(0,0,0,0.5), inset 0 1px 2px color-mix(in srgb, ${accent} 6%, transparent)`
            : `inset 0 1px 2px rgba(0,0,0,0.1)`,
        } as React.CSSProperties}
      >
        {hasRealContent && (
          <span
            aria-hidden
            className="absolute -right-3 -top-3 h-20 w-20 rounded-full opacity-[0.04] blur-2xl transition-opacity duration-700 group-hover:opacity-[0.09]"
            style={{ backgroundColor: accent }}
          />
        )}

        <span
          aria-hidden
          className="absolute right-4 top-4"
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-30"
              style={{ backgroundColor: accent, animation: hasRealContent ? "concept-pulse 3s ease-in-out infinite" : "none" }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: accent }}
            />
          </span>
        </span>

        {!hasRealContent && (
          <span className="absolute left-4 top-4 rounded-full border border-dashed border-border/30 bg-bg-card/60 px-2.5 py-0.5 text-[9px] font-medium text-text-secondary/45">
            โครงร่าง
          </span>
        )}

        <div className="mb-4 flex justify-center pt-2">
          <span
            className="inline-flex items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-105"
            style={{
              width: "3.5rem",
              height: "3.5rem",
              borderColor: `color-mix(in srgb, ${accent} ${hasRealContent ? "20%" : "12%"}, var(--color-border))`,
              background: hasRealContent
                ? `linear-gradient(165deg, color-mix(in srgb, ${accent} 10%, var(--color-bg-card)) 0%, color-mix(in srgb, ${accent} 3%, var(--color-bg-card)) 100%)`
                : "var(--color-bg-card)",
              boxShadow: hasRealContent
                ? `inset 0 1px 2px color-mix(in srgb, ${accent} 8%, transparent), 0 2px 8px rgba(0,0,0,0.2)`
                : "inset 0 1px 1px rgba(0,0,0,0.1)",
              color: hasRealContent ? accent : `color-mix(in srgb, ${accent} 40%, var(--color-text-secondary))`,
            } as React.CSSProperties}
          >
            {Icon ? (
              <Icon className="h-7 w-7 transition-colors duration-300" />
            ) : null}
          </span>
        </div>

        <div className="flex flex-col items-center text-center flex-1">
          <span
            className="mb-1 inline-block rounded-full px-2 py-0.5 text-sm font-medium text-text-secondary/80 transition-colors duration-300"
            style={{
              color: hasRealContent ? accent : `color-mix(in srgb, ${accent} 50%, var(--color-text-secondary))`,
              backgroundColor: `color-mix(in srgb, ${accent} ${hasRealContent ? "10%" : "5%"}, transparent)`,
            }}
          >
            {NODE_LABEL[c.nodeType] ?? c.nodeType}
          </span>

          <h2
            className={`font-serif font-bold leading-snug transition-colors duration-300 ${
              hasRealContent
                ? "text-lg text-text-heading group-hover:text-accent"
                : "text-lg text-text-secondary/60"
            }`}
          >
            {c.title}
          </h2>

          {c.thaiTitle ? (
            <p className={`mt-0.5 text-xs font-medium ${hasRealContent ? "text-text-secondary/60" : "text-text-secondary/35"}`}>
              {c.thaiTitle}
            </p>
          ) : null}
        </div>

        {c.description ? (
          <p
            className={`mt-4 flex-1 text-sm leading-relaxed line-clamp-3 ${
              hasRealContent ? "text-text-body/70" : "text-text-secondary/40"
            }`}
          >
            {c.description}
          </p>
        ) : (
          <div className="mt-4 flex-1" />
        )}

        <div className={`mt-4 flex items-center justify-between border-t pt-3.5 ${hasRealContent ? "border-border/15" : "border-dashed border-border/15"}`}>
          <span
            className="flex items-center gap-1 text-xs font-semibold transition-all duration-300 group-hover:gap-2"
            style={{ color: hasRealContent ? accent : `color-mix(in srgb, ${accent} 50%, var(--color-text-secondary))` }}
          >
            {hasRealContent ? "สำรวจ" : "เปิดดู"}
            <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 stroke-[1.75]" aria-hidden="true" />
          </span>
          <ViewBadge slug={c.slug} />
        </div>
      </Link>
      {copied ? (
        <span className="pointer-events-none absolute right-3 top-3 rounded bg-accent px-2 py-0.5 text-[11px] font-medium text-text-inverse">
          คัดลอกแล้ว
        </span>
      ) : null}
    </ContextMenu>
  );
};

export const ConceptCard = memo(ConceptCardInner);
