"use client";

import { useMemo, useState, memo, useDeferredValue, useTransition } from "react";
import { EN_LETTERS, THAI_LETTERS, type Thinker, type SchoolField } from "@/lib/content/core/seeds/schools";
import { disciplineMeta } from "@/components/discipline-meta";
import Link from "next/link";
import { SearchIcon, CloseIcon, ArrowRightIcon } from "@/components/icons";

const collator = new Intl.Collator("th");

interface ThinkerWithSchool extends Thinker {
  schoolId: string;
  schoolNameTh: string;
  schoolNameEn: string;
  field?: SchoolField;
}

const ThinkerCard = memo(function ThinkerCard({ t }: { t: ThinkerWithSchool }) {
  const meta = disciplineMeta(t.field);
  const thinkerSlug = t.nameEn.toLowerCase().replace(/\s+/g, "-");
  return (
    <Link
      href={`/thinkers/${thinkerSlug}`}
      className="thinker-card archron-card group relative flex flex-col justify-between overflow-hidden p-6 transition duration-300 ease-out hover:-translate-y-0.5 hover:border-accent/45 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      style={{ "--thinker-accent": meta.accent } as React.CSSProperties}
    >
      <div>
        <h2 className="font-serif text-2xl font-bold leading-tight text-text-heading transition-colors group-hover:text-accent">
          {t.nameTh}
        </h2>
        <div className="mt-1 flex items-center gap-2 text-xs font-mono text-text-secondary/55">
          <span>{t.nameEn}</span>
          <span aria-hidden>·</span>
          <span>{t.era}</span>
        </div>
        <p className="mt-2.5 text-xs">
          <span className="text-text-secondary">สำนักคิด </span>
          <span
            className="font-medium transition-colors group-hover:text-accent/80"
            style={{ color: meta.accent }}
          >
            {t.schoolNameTh}
          </span>
        </p>
        {t.quote ? (
          <blockquote
            className="mt-4 rounded-r-sm border-l-2 pl-3 text-sm italic leading-relaxed text-text-secondary/80 line-clamp-3"
            style={{
              borderLeftColor: `color-mix(in srgb, ${meta.accent} 50%, transparent)`,
              background: `linear-gradient(90deg, color-mix(in srgb, ${meta.accent} 6%, transparent) 0%, transparent 100%)`,
            }}
          >
            &ldquo;{t.quote}&rdquo;
          </blockquote>
        ) : null}
        {t.masterpieces.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {t.masterpieces.slice(0, 2).map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1 rounded-full bg-text-heading/[0.04] px-2.5 py-0.5 text-[10px] text-text-secondary/70 border border-border/15"
              >
                {m}
              </span>
            ))}
            {t.masterpieces.length > 2 ? (
              <span className="inline-flex items-center rounded-full bg-text-heading/[0.04] px-2 py-0.5 text-[10px] text-text-secondary font-mono">
                +{t.masterpieces.length - 2}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-border/15 pt-4">
        <span
          className="flex items-center gap-1 text-xs font-semibold group-hover:gap-2"
          style={{ color: meta.accent }}
        >
          ดูข้อมูลนักคิด
          <ArrowRightIcon className="h-4 w-4" />
        </span>
        <span className="text-[11px] font-mono text-text-secondary">นักคิด</span>
      </div>
    </Link>
  );
});

const ITEMS_PER_PAGE = 24;

export function ThinkersHub({ thinkers }: { thinkers: ThinkerWithSchool[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<SchoolField | "all">("all");
  const [page, setPage] = useState(1);
  const [, startTransition] = useTransition();

  const deferredQuery = useDeferredValue(query);
  const q = deferredQuery.trim().toLowerCase();

  const totalThinkers = thinkers.length;
  const totalSchools = useMemo(() => new Set(thinkers.map((t) => t.schoolId)).size, [thinkers]);
  const totalFields = useMemo(() => new Set(thinkers.map((t) => t.field).filter(Boolean)).size, [thinkers]);

  const availableLetters = useMemo(() => {
    const set = new Set<string>();
    for (const t of thinkers) {
      if (t.nameTh[0]) set.add(t.nameTh[0]);
      if (t.nameEn[0]) set.add(t.nameEn[0].toUpperCase());
    }
    return set;
  }, [thinkers]);

  const filtered = useMemo(() => {
    return thinkers
      .filter((t) => {
        if (letter) {
          const matchTh = t.nameTh.startsWith(letter);
          const matchEn = t.nameEn.toUpperCase().startsWith(letter);
          if (!matchTh && !matchEn) return false;
        }

        if (selectedField !== "all" && t.field !== selectedField) {
          return false;
        }

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
      .sort((a, b) => collator.compare(a.nameTh, b.nameTh));
  }, [thinkers, letter, selectedField, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

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
        onClick={() => { setLetter(on ? null : ch); setPage(1); }}
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
    <div className="mt-8 space-y-8">
      <div className="flex flex-wrap gap-3">
        {[
          { n: totalThinkers, l: "นักคิดทั้งหมด" },
          { n: totalSchools, l: "สำนักคิดที่จัดกลุ่ม" },
          { n: totalFields, l: "สาขาวิชา" },
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
          onChange={(e) => startTransition(() => { setQuery(e.target.value); setPage(1); })}
            placeholder="ค้นหาชื่อนักคิด คำพูด ผลงาน หรือสำนักคิด..."
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

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-secondary/70 mr-2">ศาสตร์วิชา:</span>
        <button
          type="button"
          onClick={() => { setSelectedField("all"); setPage(1); }}
          className={`inline-flex items-center rounded-full text-[11px] font-semibold leading-[1.4] bg-accent/10 text-accent px-3 py-1.5 cursor-pointer transition-colors duration-200 ${
             selectedField === "all"
               ? "border border-accent/40 bg-accent/15 text-accent font-semibold"
               : "border border-transparent bg-text-heading/5 text-text-secondary/70 hover:text-text-body"
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
              onClick={() => { setSelectedField(f); setPage(1); }}
              style={{
                borderColor: on ? meta.accent : "transparent",
                backgroundColor: on ? `${meta.accent}24` : undefined,
                color: on ? meta.accent : undefined,
              }}
              className={`inline-flex items-center rounded-full text-[11px] font-semibold leading-[1.4] bg-accent/10 text-accent px-3 py-1.5 cursor-pointer transition-colors duration-200 ${
                 on
                   ? "border font-semibold"
                   : "border border-transparent bg-text-heading/5 text-text-secondary/70 hover:text-text-body"
               }`}
            >
              {meta.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-1 border-t border-border/20 pt-4">
        <button
          type="button"
          onClick={() => { setLetter(null); setPage(1); }}
          className={`mr-1 rounded px-2.5 py-1 text-xs transition-colors ${
            letter === null
              ? "bg-accent/15 text-accent"
              : "text-text-secondary hover:text-accent"
          }`}
        >
          อักษรทั้งหมด
        </button>
        {THAI_LETTERS.map((ch) => letterBtn(ch))}
        <span className="mx-1 h-4 w-px bg-text-heading/8" />
        {EN_LETTERS.map((ch) => letterBtn(ch))}
      </div>

      <div className="flex items-center justify-between text-xs text-text-secondary/60">
        <p>พบทั้งหมด {filtered.length} นักคิด</p>
        {totalPages > 1 && (
          <p>หน้า {safePage} จาก {totalPages}</p>
        )}
      </div>

      <div>
        {filtered.length === 0 ? (
          <p className="rounded-md border border-text-heading/10 bg-bg-card/40 p-8 text-center text-sm text-text-secondary/60">
            ไม่พบนักคิดที่ตรงกับคำค้นหาหรือตัวกรอง
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((t) => (
              <ThinkerCard key={t.nameEn} t={t} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center gap-1 rounded-md border border-border/30 bg-bg-card/40 px-3 py-2 text-sm text-text-body hover:border-accent/40 hover:text-accent disabled:opacity-30 disabled:hover:border-border/30 disabled:hover:text-text-body"
          >
            <ArrowRightIcon className="h-4 w-4" style={{ transform: "rotate(180deg)" }} />
            ก่อนหน้า
          </button>
          <span className="text-sm text-text-secondary/60">
            {safePage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage === totalPages}
            onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="flex items-center gap-1 rounded-md border border-border/30 bg-bg-card/40 px-3 py-2 text-sm text-text-body hover:border-accent/40 hover:text-accent disabled:opacity-30 disabled:hover:border-border/30 disabled:hover:text-text-body"
          >
            ถัดไป
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
