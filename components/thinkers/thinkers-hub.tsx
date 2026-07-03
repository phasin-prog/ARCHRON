"use client";

import { useMemo, useState } from "react";
import { EN_LETTERS, THAI_LETTERS, type Thinker, type SchoolField } from "@/lib/content/schools";
import { disciplineMeta } from "@/components/discipline-meta";
import Link from "next/link";

interface ThinkerWithSchool extends Thinker {
  schoolId: string;
  schoolNameTh: string;
  schoolNameEn: string;
  field?: SchoolField;
}

export function ThinkersHub({ thinkers }: { thinkers: ThinkerWithSchool[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<SchoolField | "all">("all");

  const q = query.trim().toLowerCase();

  // สถิติรวม
  const totalThinkers = thinkers.length;
  const totalSchools = useMemo(() => new Set(thinkers.map((t) => t.schoolId)).size, [thinkers]);
  const totalFields = useMemo(() => new Set(thinkers.map((t) => t.field).filter(Boolean)).size, [thinkers]);

  // ค้นหารายการทั้งหมดที่มีสำนัก/นักคิดนี้
  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    for (const t of thinkers) {
      if (t.nameTh[0]) set.add(t.nameTh[0]);
      if (t.nameEn[0]) set.add(t.nameEn[0].toUpperCase());
    }
    return set;
  }, [thinkers]);

  // ตัวกรองหลัก
  const filtered = useMemo(() => {
    return thinkers
      .filter((t) => {
        // กรองตามหมวดอักษร
        if (letter) {
          const matchTh = t.nameTh.startsWith(letter);
          const matchEn = t.nameEn.toUpperCase().startsWith(letter);
          if (!matchTh && !matchEn) return false;
        }

        // กรองตามศาสตร์
        if (selectedField !== "all" && t.field !== selectedField) {
          return false;
        }

        // กรองตามคำค้นหา
        if (q) {
          const inNameTh = t.nameTh.toLowerCase().includes(q);
          const inNameEn = t.nameEn.toLowerCase().includes(q);
          const inQuote = t.quote.toLowerCase().includes(q);
          const inMasterpiece = t.masterpieces.some((m) => m.toLowerCase().includes(q));
          const inSchoolTh = t.schoolNameTh.toLowerCase().includes(q);
          const inSchoolEn = t.schoolNameEn.toLowerCase().includes(q);

          if (!inNameTh && !inNameEn && !inQuote && !inMasterpiece && !inSchoolTh && !inSchoolEn) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => a.nameTh.localeCompare(b.nameTh, "th"));
  }, [thinkers, letter, selectedField, q]);

  // ดึงรายการศาสตร์ทั้งหมดที่มีนักคิดอยู่ในขณะนี้ เพื่อให้คลิกกรองได้
  const fields = useMemo(() => {
    const set = new Set<SchoolField>();
    for (const t of thinkers) {
      if (t.field) set.add(t.field);
    }
    return Array.from(set);
  }, [thinkers]);

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
    <div className="mt-8 space-y-8">
      {/* สถิติรวม */}
      <div className="flex flex-wrap gap-3">
        {[
          { n: totalThinkers, l: "นักปราชญ์ทั้งหมด" },
          { n: totalSchools, l: "สำนักคิดต้นสังกัด" },
          { n: totalFields, l: "สาขาศาสตร์วิชา" },
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

      {/* ค้นหา */}
      <div className="flex items-center gap-3 rounded-md border border-ink/12 bg-surface-container/60 px-4 py-3 focus-within:border-burnished-gold/40">
        <span className="material-symbols-outlined text-[22px] text-burnished-gold">search</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาชื่อนักคิด คำคม ผลงาน หรือสำนักคิด..."
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

      {/* กรองตามศาสตร์หลัก */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-on-surface-variant/70 mr-2">ศาสตร์วิชา:</span>
        <button
          type="button"
          onClick={() => setSelectedField("all")}
          className={`tag-pill px-3 py-1.5 cursor-pointer transition-all ${
            selectedField === "all"
              ? "border border-burnished-gold/40 bg-burnished-gold/15 text-burnished-gold font-semibold"
              : "border border-transparent bg-ink/5 text-on-surface-variant/70 hover:text-soft-ivory"
          }`}
        >
          ทั้งหมด
        </button>
        {fields.map((f) => {
          const meta = disciplineMeta(f);
          const on = selectedField === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setSelectedField(f)}
              style={{
                borderColor: on ? meta.accent : "transparent",
                backgroundColor: on ? `${meta.accent}24` : undefined,
                color: on ? meta.accent : undefined,
              }}
              className={`tag-pill px-3 py-1.5 cursor-pointer transition-all ${
                on
                  ? "border font-semibold"
                  : "border border-transparent bg-ink/5 text-on-surface-variant/70 hover:text-soft-ivory"
              }`}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* A-Z index */}
      <div className="flex flex-wrap items-center gap-1 border-t border-slate-boundary/20 pt-4">
        <button
          type="button"
          onClick={() => setLetter(null)}
          className={`mr-1 rounded px-2.5 py-1 text-xs transition-colors ${
            letter === null
              ? "bg-burnished-gold/15 text-burnished-gold"
              : "text-on-surface-variant hover:text-burnished-gold"
          }`}
        >
          อักษรทั้งหมด
        </button>
        {THAI_LETTERS.map((ch) => letterBtn(ch))}
        <span className="mx-1 h-4 w-px bg-ink/8" />
        {EN_LETTERS.map((ch) => letterBtn(ch))}
      </div>

      {/* Grid ของ "การ์ดนักคิด" */}
      <div>
        {filtered.length === 0 ? (
          <p className="rounded-md border border-ink/10 bg-surface-container/40 p-8 text-center text-sm text-on-surface-variant/60">
            ไม่พบนักปราชญ์ที่ตรงกับการค้นหาหรือกรอง
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => {
              const meta = disciplineMeta(t.field);
              const thinkerSlug = t.nameEn.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link
                  key={t.nameEn}
                  href={`/thinkers/${thinkerSlug}`}
                  className="archron-card group relative flex flex-col justify-between overflow-hidden p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-burnished-gold/45"
                >
                  {/* แถบสีประจำศาสตร์ */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[3px]"
                    style={{ backgroundColor: meta.accent }}
                  />

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      {/* ICON GRID 3D จานรองมุมอสมมาตร */}
                      <span className="icon-tile" style={{ borderColor: `color-mix(in srgb, ${meta.accent} 26%, var(--color-slate-boundary))` }}>
                        <svg className="icon-3d" aria-hidden="true" style={{ "--ico-main": meta.accent } as React.CSSProperties}>
                          <use href="/icons/archron-icons.svg#level" />
                        </svg>
                      </span>
                      <span
                        className="rounded-full border px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider"
                        style={{
                          color: meta.accent,
                          borderColor: `${meta.accent}44`,
                          backgroundColor: `${meta.accent}12`,
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <h2 className="mt-4 font-serif text-xl font-semibold leading-snug text-on-surface group-hover:text-burnished-gold">
                      {t.nameTh}
                    </h2>
                    <span className="mt-1 block text-xs text-on-surface-variant/50">
                      {t.nameEn} · {t.era}
                    </span>

                    <p className="mt-2 block text-xs text-muted">
                      สำนักคิด:{" "}
                      <span className="text-soft-ivory group-hover:text-burnished-gold/80 transition-colors">
                        {t.schoolNameTh}
                      </span>
                    </p>

                    {t.quote ? (
                      <blockquote className="mt-4 border-l border-burnished-gold/40 pl-3 text-xs italic text-on-surface-variant/70 line-clamp-2">
                        “{t.quote}”
                      </blockquote>
                    ) : null}

                    {t.masterpieces.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {t.masterpieces.slice(0, 2).map((m) => (
                          <span
                            key={m}
                            className="inline-flex items-center gap-1 rounded bg-white/[0.03] px-2 py-0.5 text-[10px] text-on-surface-variant/80 border border-slate-boundary/20"
                          >
                            <span className="material-symbols-outlined text-[12px] text-burnished-gold/70">
                              menu_book
                            </span>
                            {m}
                          </span>
                        ))}
                        {t.masterpieces.length > 2 ? (
                          <span className="inline-flex items-center rounded bg-white/[0.03] px-2 py-0.5 text-[10px] text-muted">
                            +{t.masterpieces.length - 2}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <span className="mt-6 flex items-center gap-1 border-t border-ink/5 pt-4 text-xs font-semibold text-burnished-gold">
                    ศึกษาประวัติชีวิตและผลงาน
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
