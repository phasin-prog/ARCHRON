"use client";

import { useMemo, useState } from "react";
import type { ExternalCategory } from "@/lib/content/external-links";

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function ExternalLinksBrowser({ categories }: { categories: ExternalCategory[] }) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

  // กรองหมวดและรายการภายในหมวด
  const filtered = useMemo(() => {
    const matchedCats = categories
      .map((cat) => {
        // กรองรายการในแต่ละหมวด
        const matchedItems = cat.items.filter((item) => {
          if (!q) return true;
          const host = hostOf(item.url);
          const inTitle = item.title.toLowerCase().includes(q);
          const inDesc = item.description.toLowerCase().includes(q);
          const inHost = host.toLowerCase().includes(q);
          const inTags = item.tags.some((t) => t.toLowerCase().includes(q));

          return inTitle || inDesc || inHost || inTags;
        });

        return {
          ...cat,
          items: matchedItems,
        };
      })
      .filter((cat) => cat.items.length > 0); // โชว์เฉพาะหมวดที่มีไอเท็มที่แมตช์

    // กรองตามฟิลเตอร์แท็บ
    if (active === "all") return matchedCats;
    return matchedCats.filter((c) => c.id === active);
  }, [categories, active, q]);

  // นับจำนวนรวม
  const totalItemsCount = useMemo(() => {
    return filtered.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filtered]);

  const chip = (on: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-200 cursor-pointer ${
      on
        ? "border-burnished-gold/50 bg-burnished-gold/10 text-burnished-gold"
        : "border-ink/12 text-on-surface-variant hover:border-ink/25 hover:text-soft-ivory"
    }`;

  return (
    <div className="mt-8 space-y-6">
      {/* แท่งค้นหา */}
      <div className="flex items-center gap-3 rounded-md border border-ink/12 bg-surface-container/60 px-4 py-2.5 focus-within:border-burnished-gold/45">
        <span className="material-symbols-outlined text-[20px] text-burnished-gold">search</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาแหล่งข้อมูลภายนอก ชื่อหน่วยงาน แท็ก หรือเว็บไซต์..."
          aria-label="ค้นหาแหล่งข้อมูลภายนอก"
          className="w-full bg-transparent text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-burnished-gold/30 placeholder:text-on-surface-variant/50"
        />
        {query ? (
          <button type="button" onClick={() => setQuery("")} className="text-on-surface-variant hover:text-soft-gold">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        ) : null}
      </div>

      {/* ฟิลเตอร์หมวด */}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setActive("all")} className={chip(active === "all")}>
          ทั้งหมด
        </button>
        {categories.map((c) => {
          // นับจำนวนไอเท็มก่อนกรองข้อความ เพื่อหรี่สีปุ่มหากไม่มีรายการตามหมวดเลย
          const hasItems = c.items.length > 0;
          return (
            <button
              key={c.id}
              type="button"
              disabled={!hasItems}
              onClick={() => setActive(c.id)}
              className={chip(active === c.id)}
            >
              {c.thaiLabel}
            </button>
          );
        })}
      </div>

      {/* แสดงผลรายการ */}
      {totalItemsCount === 0 ? (
        <div className="rounded-md border border-ink/10 bg-surface-container/30 p-12 text-center text-on-surface-variant/50">
          ไม่พบแหล่งข้อมูลภายนอกที่ตรงกับการค้นหาของคุณ
        </div>
      ) : (
        <div key={active} className="route-fade mt-10 space-y-14">
          {filtered.map((cat) => (
            <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
              <h2
                id={`cat-${cat.id}`}
                className="flex items-center gap-2.5 border-b border-slate-boundary/20 pb-3 font-serif text-2xl text-on-surface"
              >
                <span className="material-symbols-outlined text-burnished-gold">{cat.icon}</span>
                {cat.thaiLabel}
                <span className="text-base text-on-surface-variant/50">({cat.enLabel})</span>
                <span className="ml-auto text-sm font-normal text-on-surface-variant/40">
                  {cat.items.length} แหล่ง
                </span>
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((item) => {
                  const host = hostOf(item.url);
                  return (
                    <a
                      key={item.url}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="archron-card group relative flex flex-col justify-between overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-burnished-gold/45"
                    >
                      <div>
                        {/* host + external icon */}
                        <div className="flex items-center justify-between gap-3">
                          {host ? (
                            <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-on-surface-variant/55">
                              <span className="material-symbols-outlined text-[15px] text-burnished-gold/70">
                                public
                              </span>
                              <span className="truncate">{host}</span>
                            </span>
                          ) : (
                            <span />
                          )}
                          <span className="material-symbols-outlined shrink-0 text-[18px] text-on-surface-variant/40 transition-colors group-hover:text-burnished-gold">
                            open_in_new
                          </span>
                        </div>

                        <h3 className="mt-3 font-serif text-lg leading-snug text-on-surface transition-colors group-hover:text-burnished-gold">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-soft-ivory/85">
                          {item.description}
                        </p>

                        {item.tags.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.tags.map((t) => (
                              <span
                                key={t}
                                className="rounded bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.06em] text-on-surface-variant/60 border border-slate-boundary/10"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {item.checkedAt && (
                          <span className="mt-3 text-[9px] font-mono text-on-surface-variant/40 block">
                            ตรวจสอบล่าสุดเมื่อ: {item.checkedAt}
                          </span>
                        )}
                      </div>

                      <span className="mt-5 flex items-center gap-1.5 border-t border-ink/8 pt-3 text-xs font-semibold text-burnished-gold">
                        เปิดลิงก์ภายนอก
                        <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          arrow_outward
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
