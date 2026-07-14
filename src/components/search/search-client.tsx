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
  onSubmit,
}: {
  query: string;
  setQuery: (v: string) => void;
  clear: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-bg-card px-5 py-3.5 shadow-sm transition-all duration-300 focus-within:border-accent/30 focus-within:shadow-md focus-within:ring-1 focus-within:ring-accent/20">
        <SearchIcon className="h-5.5 w-5.5 text-accent" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
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
      <button
        type="button"
        onClick={onSubmit}
        className="shrink-0 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-text-inverse shadow-sm transition-all duration-200 hover:bg-accent/90 hover:shadow-md active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
      >
        ค้นหา
      </button>
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
  searchQuery,
  result,
  setQuery,
}: {
  searchQuery: string;
  result: SearchResult;
  setQuery: (v: string) => void;
}) {
  return (
    <div className="mt-8">
      {!searchQuery ? (
        <div className="py-8 text-center">
          <p className="text-sm text-text-secondary/50 mb-4">
            พิมพ์คำค้นด้านบนเพื่อค้นทั่วทั้งคลังความรู้
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["เงา", "Jung", "ปรัชญา", "IPA"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full border border-border/40 px-3 py-1 text-xs text-text-secondary/60 transition-colors duration-200 hover:bg-accent/8 hover:text-accent hover:border-accent/20"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : result.total === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-text-secondary/60 mb-4">ไม่พบผลลัพธ์สำหรับ &ldquo;{searchQuery.trim()}&rdquo;</p>
          <p className="text-xs text-text-secondary/45">ลองใช้คำค้นอื่น หรือตรวจสอบการสะกด</p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-xs text-text-secondary/50">พบ {result.total} รายการ</p>
          <div className="space-y-9">
            {result.groups.map((g) => (
              <section key={g.type}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-xs font-semibold tracking-[0.05em] text-accent/70 whitespace-nowrap">
                    {g.label} · {g.items.length}
                  </h2>
                  <span className="h-px flex-1 bg-accent/10" />
                </div>
                <div className="space-y-3">
                  {g.items.map(({ item: it }) => {
                    const inner = (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-[1.05rem] text-text-heading group-hover:text-accent">
                            {it.thaiTitle || it.title}
                          </span>
                          {it.thaiTitle && it.thaiTitle !== it.title ? (
                            <span className="ml-2 text-xs text-text-secondary/45">{it.title}</span>
                          ) : null}
                          {it.external ? (
                            <ExternalLinkIcon className="h-[15px] w-[15px] text-text-secondary/55" />
                          ) : null}
                        </div>
                        {it.description ? (
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-body/70">
                            {it.description}
                          </p>
                        ) : null}
                        {it.badge ? (
                          <span className="mt-2.5 inline-flex text-[11px] px-1.5 py-0.5 rounded-md bg-accent/5 text-accent/70">
                            {it.badge}
                          </span>
                        ) : null}
                      </>
                    );
                    const cls =
                      "group block rounded-lg border border-border/50 bg-bg-card/60 px-5 py-4 transition-all duration-200 hover:border-accent/20 hover:shadow-sm hover:-translate-y-0.5 hover:bg-accent/[0.03]";
                    return (
                      <div key={it.id}>
                        {it.external ? (
                          <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>
                            {inner}
                          </a>
                        ) : (
                          <Link href={it.href} className={cls}>
                            {inner}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

export function SearchClient({ items, initialQuery }: { items: SearchItem[]; initialQuery?: string }) {
  const { query, setQuery, activeType, setActiveType, searchQuery, result, clear, submit } = useSearch(items, initialQuery ?? "");

  return (
    <div className="mt-8">
      <SearchBar query={query} setQuery={setQuery} clear={clear} onSubmit={submit} />
      <TypeFilters activeType={activeType} setActiveType={setActiveType} />
      <SearchResults searchQuery={searchQuery} result={result} setQuery={setQuery} />
    </div>
  );
}
