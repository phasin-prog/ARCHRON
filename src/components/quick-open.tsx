"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { buildStaticIndex } from "@/features/search/index";
import type { SearchItem } from "@/features/search/types";

type Item = SearchItem;

// Escape regex special chars
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const INDEX = buildStaticIndex();

export function QuickOpen() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Cmd+K / Ctrl+K to toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [open]);

  const terms = useMemo(() => {
    return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  }, [query]);

  const matched = useMemo(() => {
    if (terms.length === 0) return INDEX.slice(0, 8);
    return INDEX
      .filter((it) => terms.every((t) => it.keywords.includes(t)))
      .slice(0, 12);
  }, [terms]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigate = useCallback(
    (item: Item) => {
      setOpen(false);
      setQuery("");
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.href);
      }
    },
    [router],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, matched.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && matched[selectedIndex]) {
      e.preventDefault();
      navigate(matched[selectedIndex]);
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView?.({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) return null;

  // Highlight matching terms
  const highlight = (text: string): React.ReactNode => {
    if (terms.length === 0) return text;
    const term = terms.find((t) => text.toLowerCase().includes(t.toLowerCase()));
    if (!term) return text;
    const parts = text.split(new RegExp(`(${escapeRegex(term)})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="rounded-sm bg-accent/30 text-text-heading">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-xl rounded-xl border border-accent/15 bg-bg-card shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-accent/10 px-4 py-3">
          <span className="inline-flex items-center justify-center w-5 h-5 text-[20px] text-accent/70" aria-hidden="true">
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ค้นหาแนวคิด บทความ หรือหน้า..."
            className="flex-1 border-none bg-transparent text-base text-text-heading placeholder:text-text-secondary/50 focus-visible:outline-none"
            aria-label="ค้นหาแบบเร็ว"
            role="combobox"
            aria-expanded={matched.length > 0}
            aria-controls="quick-open-listbox"
            aria-autocomplete="list"
          />
          <kbd className="hidden rounded border border-border/40 px-1.5 py-0.5 text-[10px] text-text-secondary/60 sm:inline">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {matched.length > 0 ? (
          <ul
            ref={listRef}
            id="quick-open-listbox"
            className="max-h-[360px] overflow-y-auto py-2"
            role="listbox"
            aria-label="ผลลัพธ์การค้นหา"
          >
            {matched.map((item, i) => (
              <li key={item.id} role="option" aria-selected={i === selectedIndex}>
                <button
                  type="button"
                  onClick={() => navigate(item)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === selectedIndex
                      ? "bg-accent/10"
                      : "hover:bg-bg-card"
                  }`}
                >
                  <span className="inline-flex items-center justify-center shrink-0 w-[1em] h-[1em] text-[18px] text-text-secondary/60" aria-hidden="true">
                    {item.external ? "↗" : "📄"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-text-heading">
                        {highlight(item.thaiTitle || item.title)}
                      </span>
                      {item.badge ? (
                        <span className="shrink-0 text-[10px] text-text-secondary/50">
                          {item.badge}
                        </span>
                      ) : null}
                    </div>
                    {item.description ? (
                      <p className="mt-0.5 truncate text-xs text-text-secondary/60">
                        {highlight(item.description)}
                      </p>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-[10px] text-text-secondary/45">
                    {item.external ? "ภายนอก" : "ไป →"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 text-center text-sm text-text-secondary/60">
            {query.trim() ? (
              <>
                ไม่พบผลลัพธ์สำหรับ &ldquo;{query.trim()}&rdquo;
                <br />
                <span className="text-xs">
                  ลองค้นหาแบบละเอียดที่{" "}
                  <a href="/search" className="text-accent hover:underline">
                    หน้าค้นหา
                  </a>
                </span>
              </>
            ) : (
              "พิมพ์เพื่อค้นหา — แนวคิด บทความ และหน้าต่าง ๆ"
            )}
          </div>
        )}

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-accent/10 px-4 py-2 text-[10px] text-text-secondary/45">
          <span>
            <kbd className="mr-1 rounded border border-border/40 px-1 py-0.5">↑↓</kbd>
            นำทาง{" "}
            <kbd className="ml-1 rounded border border-border/40 px-1 py-0.5">↵</kbd>
            เลือก
          </span>
          <span>
            <kbd className="rounded border border-border/40 px-1 py-0.5">Esc</kbd>
            ปิด
          </span>
        </div>
      </div>
    </div>
  );
}
