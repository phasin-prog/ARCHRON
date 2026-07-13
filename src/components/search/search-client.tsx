"use client";

import { memo } from "react";
import Link from "next/link";
import { SearchIcon, CloseIcon, ExternalLinkIcon } from "@/components/icons";
import {
  SEARCH_TYPE_LABEL,
  SEARCH_TYPE_ORDER,
  type SearchItem,
} from "@/features/search/types";
import type { SearchResult } from "@/features/search/types";
import { useSearch } from "@/features/search/hooks";

const SearchBar = memo(function SearchBar({
  query,
  setQuery,
  clear,
}: {
  query: string;
  setQuery: (v: string) => void;
  clear: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-card px-5 py-3.5 shadow-sm transition-all duration-300 focus-within:border-accent/30 focus-within:shadow-md focus-within:ring-1 focus-within:ring-accent/20">
      <SearchIcon className="h-5.5 w-5.5 text-accent" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ค้นหาแนวคิด บทความ ทรัพยากร หรือหน้า..."
        aria-label="ค้นหา"
        className="w-full bg-transparent text-lg font-ui text-text-heading placeholder:text-text-secondary/50 focus-visible:outline-none"
      />
      {query ? (
        <div className="animate-in fade-in zoom-in-90 duration-200">
          <button
            type="button"
            onClick={clear}
            aria-label="ล้างคำค้น"
            className="rounded-md p-1 text-text-secondary/60 transition-colors hover:text-text-heading hover:bg-bg-card focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
});

const TypeFilters = memo(function TypeFilters({
  activeType,
  setActiveType,
}: {
  activeType: string;
  setActiveType: (v: string) => void;
}) {
  const chip = (on: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-xs font-ui transition-all duration-200 ${
      on
        ? "border-accent/40 bg-accent-subtle text-accent shadow-sm"
        : "border-border/60 bg-transparent text-text-secondary hover:border-text-heading/20 hover:bg-bg-elevated hover:text-text-heading"
    } active:scale-[0.97]`;

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => setActiveType("all")}
        className={chip(activeType === "all")}
      >
        ทั้งหมด
      </button>
      {SEARCH_TYPE_ORDER.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setActiveType(t)}
          className={chip(activeType === t)}
        >
          {SEARCH_TYPE_LABEL[t]}
        </button>
      ))}
    </div>
  );
});

const SearchResults = memo(function SearchResults({
  debouncedQuery,
  result,
}: {
  debouncedQuery: string;
  result: SearchResult;
}) {
  return (
    <div className="mt-8">
      {!debouncedQuery ? (
        <p className="text-sm text-text-secondary/60">
          พิมพ์คำค้น เช่น &ldquo;เงา&rdquo;, &ldquo;Jung&rdquo;, &ldquo;ปรัชญา&rdquo;, &ldquo;IPA&rdquo; — ค้นได้ทั้งแนวคิด บทความ ทรัพยากรภายนอก และหน้าต่าง ๆ
        </p>
      ) : result.total === 0 ? (
        <p className="text-sm text-text-secondary/60">ไม่พบผลลัพธ์สำหรับ &ldquo;{debouncedQuery.trim()}&rdquo;</p>
      ) : (
        <>
          <p className="mb-5 text-xs text-text-secondary/50">พบ {result.total} รายการ</p>
          <div className="space-y-9">
            {result.groups.map((g) => (
              <section key={g.type}>
                <h2 className="mb-3 text-xs font-semibold tracking-[0.05em] text-accent/70">
                  {g.label} · {g.items.length}
                </h2>
                <ul className="divide-y divide-ink/5 overflow-hidden rounded-md border border-text-heading/10">
                  {g.items.map(({ item: it }) => {
                    const inner = (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-base text-text-heading group-hover:text-accent">
                            {it.thaiTitle || it.title}
                          </span>
                          {it.thaiTitle && it.thaiTitle !== it.title ? (
                            <span className="text-xs text-text-secondary/45">{it.title}</span>
                          ) : null}
                          {it.external ? (
                            <ExternalLinkIcon className="h-[15px] w-[15px] text-text-secondary/55" />
                          ) : null}
                        </div>
                        {it.description ? (
                          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-text-secondary/65">
                            {it.description}
                          </p>
                        ) : null}
                        {it.badge ? (
                          <span className="mt-2 inline-block text-[11px] text-text-secondary/45">
                            {it.badge}
                          </span>
                        ) : null}
                      </>
                    );
                    const cls =
                      "group block bg-bg-card/40 px-4 py-3 transition-colors hover:bg-bg-card";
                    return (
                      <li key={it.id}>
                        {it.external ? (
                          <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>
                            {inner}
                          </a>
                        ) : (
                          <Link href={it.href} className={cls}>
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

export function SearchClient({ items, initialQuery }: { items: SearchItem[]; initialQuery?: string }) {
  const { query, setQuery, activeType, setActiveType, debouncedQuery, result, clear } = useSearch(items, initialQuery ?? "");

  return (
    <div className="mt-8">
      <SearchBar query={query} setQuery={setQuery} clear={clear} />
      <TypeFilters activeType={activeType} setActiveType={setActiveType} />
      <SearchResults debouncedQuery={debouncedQuery} result={result} />
    </div>
  );
}
