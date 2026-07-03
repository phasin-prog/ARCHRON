"use client";

import { useMemo, useState } from "react";
import { EN_LETTERS, THAI_LETTERS, type School } from "@/lib/content/schools";
import { disciplineMeta } from "@/components/discipline-meta";

import Link from "next/link";

export function SchoolsHub({ schools }: { schools: School[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);

  const q = query.trim().toLowerCase();

  // สถิติรวม — คำนวณสดจากข้อมูลจริง (ไม่ hardcode)
  const totalThinkers = useMemo(
    () => schools.reduce((n, s) => n + s.thinkers.length, 0),
    [schools],
  );
  const totalFields = useMemo(
    () => new Set(schools.map((s) => s.field).filter(Boolean)).size,
    [schools],
  );

  // ตัวอักษรที่ "มี" สำนักจริง (ใช้เปิด/หรี่ในแถบดัชนี)
  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    for (const s of schools) {
      if (s.nameTh[0]) set.add(s.nameTh[0]);
      if (s.nameEn[0]) set.add(s.nameEn[0].toUpperCase());
    }
    return set;
  }, [schools]);

  // ค้นหายังครอบคลุมชื่อนักคิด/ผลงาน เพื่อ "กรองระดับสำนัก" (แต่ไม่เรนเดอร์การ์ดนักคิด)
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
            ? "bg-burnished-gold/15 text-burnished-gold"
            : has
              ? "text-on-surface-variant hover:bg-ink/5 hover:text-burnished-gold"
              : "cursor-default text-on-surface-variant/20"
        }`}
      >
        {ch}
      </button>
    );
  };

  return (
    <div className="mt-8">
      {/* สถิติรวม (นับสด) */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { n: schools.length, l: "สำนักคิด" },
          { n: totalThinkers, l: "นักปราชญ์" },
          { n: totalFields, l: "ศาสตร์" },
        ].map((st) => (
          <div
            key={st.l}
            className="flex items-baseline gap-2 rounded-lg border border-ink/12 bg-surface-container/40 px-4 py-2.5"
          >
            <span className="font-serif text-2xl font-bold text-burnished-gold">{st.n}</span>
            <span className="text-xs text-on-surface-variant/60">{st.l}</span>
          </div>
        ))}
      </div>

      {/* Search — ยังกรองด้วยชื่อนักคิด/ผลงานได้ (กรองระดับสำนัก) */}
      <div className="flex items-center gap-3 rounded-md border border-ink/12 bg-surface-container/60 px-4 py-3 focus-within:border-burnished-gold/40">
        <span className="material-symbols-outlined text-[22px] text-burnished-gold">search</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาสำนักคิด นักปราชญ์ หรือชื่อผลงาน..."
          aria-label="ค้นหา"
          className="w-full bg-transparent text-base text-on-surface placeholder:text-on-surface-variant/55 focus-visible:ring-2 focus-visible:ring-burnished-gold/30 focus:outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="ล้างคำค้น"
            className="text-on-surface-variant/60 transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        ) : null}
      </div>

      {/* A-Z index */}
      <div className="mt-4 flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => setLetter(null)}
          className={`mr-1 rounded px-2.5 py-1 text-xs transition-colors ${
            letter === null
              ? "bg-burnished-gold/15 text-burnished-gold"
              : "text-on-surface-variant hover:text-burnished-gold"
          }`}
        >
          ทั้งหมด
        </button>
        {THAI_LETTERS.map((ch) => letterBtn(ch))}
        <span className="mx-1 h-4 w-px bg-ink/8" />
        {EN_LETTERS.map((ch) => letterBtn(ch))}
      </div>

      {/* Grid ของ "การ์ดสำนัก" — คลิกทั้งใบเข้า /schools/[slug] เพื่อดู Thinkers
          (ไม่เรนเดอร์การ์ดนักคิด inline อีกต่อไป เพื่อความเร็วเมื่อมีนักคิดจำนวนมาก) */}
      <div className="mt-8">
        {filtered.length === 0 ? (
          <p className="rounded-md border border-ink/10 bg-surface-container/40 p-8 text-center text-sm text-on-surface-variant/60">
            ไม่พบสำนักคิดที่ตรงกับการค้นหา
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => {
              const meta = disciplineMeta(s.field);
              const Icon = meta.Icon;
              return (
                <Link
                  key={s.id}
                  href={`/schools/${s.id}`}
                  className="archron-card group relative flex flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-burnished-gold/45"
                >
                  {/* แถบสีประจำศาสตร์ */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[3px]"
                    style={{ backgroundColor: meta.accent }}
                  />

                  <div className="flex items-center justify-between gap-3">
                    <span className="icon-tile scale-90" style={{ borderColor: `color-mix(in srgb, ${meta.accent} 26%, var(--color-slate-boundary))` }} title={meta.label}>
                      <svg className="icon-3d" aria-hidden="true" style={{ "--ico-main": meta.accent } as React.CSSProperties}>
                        <use href="/icons/archron-icons.svg#level" />
                      </svg>
                    </span>
                    {s.thinkers.length > 0 ? (
                      <span
                        className="rounded-full border px-2.5 py-0.5 text-[11px]"
                        style={{
                          color: meta.accent,
                          borderColor: `${meta.accent}44`,
                          backgroundColor: `${meta.accent}12`,
                        }}
                      >
                        {s.thinkers.length} นักคิด
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-4 font-serif text-xl font-semibold leading-snug text-on-surface group-hover:text-burnished-gold">
                    {s.nameTh}
                  </h2>
                  <span className="mt-1 block text-[11px] uppercase tracking-[0.08em] text-on-surface-variant/45">
                    {s.nameEn} · {meta.label}
                  </span>

                  {s.description ? (
                    <p className="mt-3 overflow-hidden text-sm leading-relaxed text-on-surface-variant/75 [-webkit-box-orient:vertical] [-webkit-line-clamp:3] [display:-webkit-box]">
                      {s.description}
                    </p>
                  ) : null}

                  <span className="mt-auto flex items-center gap-1 border-t border-ink/5 pt-4 text-xs font-semibold text-burnished-gold">
                    ดูนักคิดและประวัติเต็ม
                    <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:translate-x-0.5">
                      arrow_forward
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
