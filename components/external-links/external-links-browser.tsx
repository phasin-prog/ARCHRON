"use client";

import { useState } from "react";
import type { ExternalCategory } from "@/lib/content/external-links";

export function ExternalLinksBrowser({ categories }: { categories: ExternalCategory[] }) {
  const [active, setActive] = useState<string>("all");
  const visible = active === "all" ? categories : categories.filter((c) => c.id === active);

  const chip = (on: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-200 ${
      on
        ? "border-burnished-gold/50 bg-burnished-gold/10 text-burnished-gold"
        : "border-ink/12 text-on-surface-variant hover:border-ink/25 hover:text-on-surface"
    }`;

  return (
    <div className="mt-8">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setActive("all")} className={chip(active === "all")}>
          ทั้งหมด
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c.id)}
            className={chip(active === c.id)}
          >
            {c.thaiLabel}
          </button>
        ))}
      </div>

      {/* Grouped grid (key=active → fade-rise ใหม่ทุกครั้งที่สลับฟิลเตอร์) */}
      <div key={active} className="route-fade mt-10 space-y-14">
        {visible.map((cat) => (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
            <h2
              id={`cat-${cat.id}`}
              className="flex items-center gap-2.5 font-serif text-2xl text-on-surface"
            >
              <span className="material-symbols-outlined text-burnished-gold">{cat.icon}</span>
              {cat.thaiLabel}
              <span className="text-base text-on-surface-variant/50">({cat.enLabel})</span>
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col rounded-md border border-slate-boundary/50 bg-surface-container/50 p-6 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-1 hover:border-burnished-gold/40 hover:bg-surface-container"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-serif text-lg leading-snug text-on-surface group-hover:text-burnished-gold">
                      {item.title}
                    </h3>
                    <span className="material-symbols-outlined shrink-0 text-[18px] text-on-surface-variant/50 transition-colors group-hover:text-burnished-gold">
                      open_in_new
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-on-surface-variant/70">
                    {item.description}
                  </p>
                  {item.tags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-ink/10 px-2.5 py-0.5 text-[11px] text-on-surface-variant/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1 text-xs text-burnished-gold">
                    เปิดลิงก์ภายนอก
                    <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
