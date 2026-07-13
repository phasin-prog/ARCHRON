"use client";

import { useCallback, useDeferredValue, memo, useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons";
import { buildStaticIndex } from "@/features/search/index";
import { search } from "@/features/search/services";
import {
  SEARCH_TYPE_LABEL,
  SEARCH_TYPE_ORDER,
  type SearchType,
} from "@/features/search/types";

const INDEX = buildStaticIndex();
const MAX_SUGGESTIONS = 8;

function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const deferredQuery = useDeferredValue(query);

  const result = useMemo(
    () => search(INDEX, deferredQuery, { limit: MAX_SUGGESTIONS }),
    [deferredQuery],
  );

  const flatSuggestions = useMemo(
    () => result.groups.flatMap((g) => g.items),
    [result],
  );

  const showDropdown = focused && query.length > 0;

  const navigate = useCallback(
    (href: string, external?: boolean) => {
      setQuery("");
      setFocused(false);
      if (external) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
      }
    },
    [router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (showDropdown && flatSuggestions[selectedIndex]) {
        e.preventDefault();
        const { item: it } = flatSuggestions[selectedIndex];
        navigate(it.href, it.external);
      }
    } else if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
  };

  const handleFocus = () => {
    setFocused(true);
    setSelectedIndex(0);
  };

  const handleBlur = () => {
    setTimeout(() => setFocused(false), 200);
  };

  return (
    <form action="/search" method="get" className="relative" role="combobox" aria-expanded={showDropdown} aria-haspopup="listbox" aria-controls="home-search-listbox">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="ค้นหาทุกสิ่ง..."
        className="w-full rounded-xl border border-border bg-bg-card py-4 pl-12 pr-4 font-serif text-text-body shadow-sm transition-colors focus:border-accent/40 focus:ring-1 focus:ring-accent/20 focus:outline-none"
        aria-label="ค้นหา"
        aria-autocomplete="list"
        aria-controls="home-search-listbox"
        autoComplete="off"
      />

      {showDropdown && (
        <SearchSuggestions
          flatSuggestions={flatSuggestions}
          selectedIndex={selectedIndex}
          navigate={navigate}
          query={deferredQuery}
        />
      )}
    </form>
  );
}

const SearchSuggestions = memo(function SearchSuggestions({
  flatSuggestions,
  selectedIndex,
  navigate,
  query,
}: {
  flatSuggestions: Array<{ item: { id: string; href: string; external?: boolean; thaiTitle?: string; title: string; badge?: string; description?: string }; score: number }>;
  selectedIndex: number;
  navigate: (href: string, external?: boolean) => void;
  query: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView?.({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-accent/15 bg-bg-card shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)]">
      {flatSuggestions.length > 0 ? (
        <ul
          ref={listRef}
          id="home-search-listbox"
          className="max-h-[360px] overflow-y-auto py-1"
          role="listbox"
        >
          {flatSuggestions.map(({ item: it }) => (
            <li key={it.id} role="option" aria-selected={false}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  navigate(it.href, it.external);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent/8"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-text-heading">
                      {it.thaiTitle || it.title}
                    </span>
                    {it.badge ? (
                      <span className="shrink-0 text-[10px] text-text-secondary/50">
                        {it.badge}
                      </span>
                    ) : null}
                  </div>
                  {it.description ? (
                    <p className="mt-0.5 truncate text-xs text-text-secondary/60">
                      {it.description}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 text-[10px] text-text-secondary/40">
                  {it.external ? "ภายนอก" : "→"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="px-4 py-6 text-center text-sm text-text-secondary/60">
          ไม่พบผลลัพธ์สำหรับ &ldquo;{query}&rdquo;
        </div>
      )}
      <div className="flex items-center justify-between border-t border-accent/10 px-4 py-1.5 text-[10px] text-text-secondary/45">
        <span>
          <kbd className="mr-1 rounded border border-border/40 px-1 py-0.5">↑↓</kbd>
          นำทาง{" "}
          <kbd className="ml-1 rounded border border-border/40 px-1 py-0.5">↵</kbd>
          เปิด
        </span>
        <button
          type="submit"
          className="text-accent hover:underline focus-visible:outline-none"
        >
          ค้นหาทั้งหมด →
        </button>
      </div>
    </div>
  );
});

export { HomeSearch };
