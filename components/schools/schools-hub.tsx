"use client";

import { useMemo, useState } from "react";
import { EN_LETTERS, THAI_LETTERS, type School } from "@/lib/content/schools";
import { disciplineMeta } from "@/components/discipline-meta";
import Link from "next/link";
import { SearchIcon, CloseIcon, ArrowRightIcon } from "@/components/icons";

export function SchoolsHub({ schools }: { schools: School[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);

  const q = query.trim().toLowerCase();

  const totalThinkers = useMemo(
    () => schools.reduce((n, s) => n + s.thinkers.length, 0),
    [schools],
  );
  const totalFields = useMemo(
    () => new Set(schools.map((s) => s.field).filter(Boolean)).size,
    [schools],
  );

  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    for (const s of schools) {
      if (s.nameTh[0]) set.add(s.nameTh[0]);
      if (s.nameEn[0]) set.add(s.nameEn[0].toUpperCase());
    }
    return set;
  }, [schools]);

  const matchSchool = (s: School): boolean => {
    if (!q) return true;
    if (s.nameTh.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q)) return true;
    return s.thinkers.some(
      (t) =>
        t.nameTh.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.masterpieces.some((m) => m.toLowerCase().includes(q)),
    );
  };
  const matchLetter = (s: School): boolean => {
    if (!letter) return true;
    return s.nameTh.startsWith(letter) || s.nameEn.toUpperCase().startsWith(letter);
  };

  const filtered = useMemo(
    () =>
      schools
        .filter((s) => matchLetter(s) && matchSchool(s))
        .sort((a, b) => a.nameTh.localeCompare(b.nameTh, "th")),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [schools, q, letter],
  );

  const letterBtn = (ch: string) => {
    const has = availableLetters.has(ch);
    const on = letter === ch;
    return (
      <button
        key={ch}
        type="button"
        disabled={!has}
        onClick={() => setLetter(on ? null : ch)}
        className={`flex h-7 min-w-7 items-center justify-center rounded px-1 text-xs transition-colors ${
          on
            ? "bg-accent/15 text-accent"
            : has
              ? "text-text-secondary hover:bg-text-heading/5 hover:text-accent"
              : "cursor-default text-text-secondary/20"
        }`}
      >
        {ch}
      </button>
    );
  };

  return (
    <div className="mt-8">
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { n: schools.length, l: "สำนักคิด" },
          { n: totalThinkers, l: "นักปราชญ์" },
          { n: totalFields, l: "ศาสตร์" },
        ].map((st) => (
          <div
            key={st.l}
            className="flex items-baseline gap-2 rounded-lg border border-text-heading/12 bg-bg-card/40 px-4 py-2.5"
          >
            <span className="font-serif text-2xl font-bold text-accent">{st.n}</span>
            <span className="text-xs text-text-secondary/60">{st.l}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-md border border-text-heading/12 bg-bg-card/60 px-4 py-3 focus-within:border-accent/40">
        <SearchIcon className="h-5.5 w-5.5 text-accent" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาสำนักคิด นักปราชญ์ หรือชื่อผลงาน..."
          aria-label="ค้นหา"
          className="w-full bg-transparent text-base text-text-heading placeholder:text-text-secondary/55 focus-visible:ring-2 focus-visible:ring-accent/30 focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="ล้างคำค้น"
            className="text-text-secondary/60 transition-colors hover:text-text-heading"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => setLetter(null)}
          className={`mr-1 rounded px-2.5 py-1 text-xs transition-colors ${
            letter === null
              ? "bg-accent/15 text-accent"
              : "text-text-secondary hover:text-accent"
          }`}
        >
          ทั้งหมด
        </button>
        {THAI_LETTERS.map((ch) => letterBtn(ch))}
        <span className="mx-1 h-4 w-px bg-text-heading/8" />
        {EN_LETTERS.map((ch) => letterBtn(ch))}
      </div>

      <div className="mt-8">
        {filtered.length === 0 ? (
          <p className="rounded-md border border-text-heading/10 bg-bg-card/40 p-8 text-center text-sm text-text-secondary/60">
            ไม่พบสำนักคิดที่ตรงกับการค้นหา
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => {
              const meta = disciplineMeta(s.field);
              return (
                <Link
                  key={s.id}
                  href={`/schools/${s.id}`}
                  className="archron-card group relative flex flex-col justify-between overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  style={{
                    background: `linear-gradient(160deg, color-mix(in srgb, ${meta.accent} 7%, #181C2A) 0%, #181C2A 100%)`,
                  }}
                >
                  <div>
                    <h2 className="font-serif text-2xl font-bold leading-tight text-text-heading transition-colors group-hover:text-accent">
                      {s.nameTh}
                    </h2>

                    <div className="mt-1 flex items-center gap-2 text-xs font-mono text-text-secondary/55">
                      <span>{s.nameEn}</span>
                      {s.field ? (
                        <>
                          <span aria-hidden>·</span>
                          <span
                            className="font-medium"
                            style={{ color: meta.accent }}
                          >
                            {meta.label}
                          </span>
                        </>
                      ) : null}
                    </div>

                    {s.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-text-body/75 line-clamp-3">
                        {s.description}
                      </p>
                    ) : null}

                    {s.thinkers.length > 0 ? (
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {s.thinkers.slice(0, 4).map((t) => (
                          <span
                            key={t.nameEn}
                            className="inline-flex items-center gap-1 rounded-full bg-text-heading/[0.04] px-2.5 py-1 text-[11px] text-text-body/80 border border-border/15 transition-colors group-hover:border-border/25"
                          >
                            {t.nameTh}
                          </span>
                        ))}
                        {s.thinkers.length > 4 ? (
                          <span className="text-[11px] text-text-secondary font-mono">+{s.thinkers.length - 4}</span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border/15 pt-4">
                    <span
                      className="flex items-center gap-1 text-xs font-semibold transition-all duration-300 group-hover:gap-2"
                      style={{ color: meta.accent }}
                    >
                      เข้าสู่สำนักคิด
                      <ArrowRightIcon className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-mono text-text-secondary">{s.thinkers.length} ปราชญ์</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
