"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchIcon, CloseIcon, ExternalLinkIcon } from "@/components/icons";
import {
  SEARCH_TYPE_LABEL,
  SEARCH_TYPE_ORDER,
  type SearchItem,
  type SearchType,
} from "@/lib/content/search-index";

export function SearchClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<SearchType | "all">("all");

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const matched = useMemo(() => {
    if (terms.length === 0) return [];
    return items.filter(
      (it) =>
        (active === "all" || it.type === active) &&
        terms.every((t) => it.keywords.includes(t)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, active, items]);

  const groups = SEARCH_TYPE_ORDER.map((type) => ({
    type,
    items: matched.filter((m) => m.type === type),
  })).filter((g) => g.items.length > 0);

  const chip = (on: boolean) =>
    `rounded-full border px-3 py-1 text-xs transition-colors duration-200 ${
      on
        ? "border-accent/50 bg-accent/10 text-accent"
        : "border-text-heading/12 text-text-secondary hover:border-text-heading/25 hover:text-text-heading"
    }`;

  return (
    <div className="mt-8">
      {/* Search box */}
      <div className="flex items-center gap-3 rounded-lg border border-text-heading/12 bg-bg-card/60 px-4 py-3 focus-within:border-accent/40 focus-within:ring-1 focus-within:ring-accent/20 transition-colors">
        <SearchIcon className="h-5.5 w-5.5 text-accent" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาแนวคิด บทความ ทรัพยากร หรือหน้า..."
          aria-label="ค้นหา"
          className="w-full bg-transparent text-base text-text-heading placeholder:text-text-secondary/50 focus-visible:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="ล้างคำค้น"
            className="rounded-md p-1 text-text-secondary/60 transition-colors hover:text-text-heading hover:bg-bg-card focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      {/* Type filter */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setActive("all")} className={chip(active === "all")}>
          ทั้งหมด
        </button>
        {SEARCH_TYPE_ORDER.map((t) => (
          <button key={t} type="button" onClick={() => setActive(t)} className={chip(active === t)}>
            {SEARCH_TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-8">
        {terms.length === 0 ? (
          <p className="text-sm text-text-secondary/60">
            พิมพ์คำค้น เช่น “เงา”, “Jung”, “ปรัชญา”, “IPA” — ค้นได้ทั้งแนวคิด บทความ ทรัพยากรภายนอก และหน้าต่าง ๆ
          </p>
        ) : matched.length === 0 ? (
          <p className="text-sm text-text-secondary/60">ไม่พบผลลัพธ์สำหรับ “{query.trim()}”</p>
        ) : (
          <>
            <p className="mb-5 text-xs text-text-secondary/50">พบ {matched.length} รายการ</p>
            <div className="space-y-9">
              {groups.map((g) => (
                <section key={g.type}>
                  <h2 className="mb-3 text-xs font-semibold tracking-[0.05em] text-accent/70">
                    {SEARCH_TYPE_LABEL[g.type]} · {g.items.length}
                  </h2>
                  <ul className="divide-y divide-ink/5 overflow-hidden rounded-md border border-text-heading/10">
                    {g.items.map((it) => {
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
    </div>
  );
}
