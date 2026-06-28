"use client";

import { useEffect, useMemo, useState } from "react";
import {
  EN_LETTERS,
  THAI_LETTERS,
  type School,
  type Thinker,
} from "@/lib/content/schools";

type ActiveModal = { school: School; thinker: Thinker } | null;

export function SchoolsHub({ schools }: { schools: School[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ActiveModal>(null);

  // Esc + ล็อกสกรอลล์เมื่อเปิด modal
  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [modal]);

  const q = query.trim().toLowerCase();

  // ตัวอักษรที่ "มี" สำนักจริง (ใช้เปิด/หรี่ในแถบดัชนี)
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

  const toggle = (id: string) => {
    const next = new Set(open);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpen(next);
  };
  const isOpen = (id: string) => q !== "" || open.has(id);

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
              ? "text-on-surface-variant hover:bg-white/5 hover:text-burnished-gold"
              : "cursor-default text-on-surface-variant/20"
        }`}
      >
        {ch}
      </button>
    );
  };

  return (
    <div className="mt-8">
      {/* Search */}
      <div className="flex items-center gap-3 rounded-md border border-white/12 bg-surface-container/60 px-4 py-3 focus-within:border-burnished-gold/40">
        <span className="material-symbols-outlined text-[22px] text-burnished-gold">search</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ค้นหาสำนักคิด นักปราชญ์ หรือชื่อผลงาน..."
          aria-label="ค้นหา"
          className="w-full bg-transparent text-base text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none"
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
        <span className="mx-1 h-4 w-px bg-white/10" />
        {EN_LETTERS.map((ch) => letterBtn(ch))}
      </div>

      {/* Accordion list */}
      <div className="mt-8 space-y-3">
        {filtered.length === 0 ? (
          <p className="rounded-md border border-white/10 bg-surface-container/40 p-8 text-center text-sm text-on-surface-variant/60">
            ไม่พบสำนักคิดที่ตรงกับการค้นหา
          </p>
        ) : (
          filtered.map((s) => {
            const expanded = isOpen(s.id);
            return (
              <div
                key={s.id}
                className="overflow-hidden rounded-md border border-slate-boundary/50 bg-surface-container/40"
              >
                <button
                  type="button"
                  onClick={() => toggle(s.id)}
                  aria-expanded={expanded}
                  className="flex w-full items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-surface-container/70"
                >
                  <span className="flex items-baseline gap-2">
                    <span className="font-serif text-xl text-on-surface">{s.nameTh}</span>
                    <span className="text-sm text-on-surface-variant/50">/ {s.nameEn}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full border border-white/12 px-2.5 py-0.5 text-[11px] text-on-surface-variant/70">
                      {s.thinkers.length} นักคิด
                    </span>
                    <span
                      className={`material-symbols-outlined text-on-surface-variant/60 transition-transform duration-300 ${
                        expanded ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-4 p-5 pt-0 sm:grid-cols-2">
                      {s.thinkers.map((t) => (
                        <button
                          key={t.nameEn}
                          type="button"
                          onClick={() => setModal({ school: s, thinker: t })}
                          className="group rounded-md border border-white/10 bg-surface-container/40 p-5 text-left transition-colors hover:border-burnished-gold/40 hover:bg-surface-container"
                        >
                          <h4 className="font-serif text-lg text-on-surface group-hover:text-burnished-gold">
                            {t.nameTh}
                          </h4>
                          <p className="text-sm text-on-surface-variant/55">
                            {t.nameEn} · {t.era}
                          </p>
                          <ul className="mt-3 space-y-1.5">
                            {t.masterpieces.map((m) => (
                              <li
                                key={m}
                                className="flex items-start gap-1.5 text-sm leading-relaxed text-on-surface-variant/75"
                              >
                                <span className="material-symbols-outlined mt-0.5 text-[15px] text-burnished-gold/70">
                                  menu_book
                                </span>
                                {m}
                              </li>
                            ))}
                          </ul>
                          <span className="mt-3 inline-flex items-center gap-1 text-xs text-burnished-gold">
                            ดูประวัติย่อ
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {modal ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={modal.thinker.nameTh}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        >
          <button
            type="button"
            aria-label="ปิด"
            onClick={() => setModal(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="route-fade relative z-10 w-full max-w-lg rounded-lg border border-burnished-gold/30 bg-surface-container p-7 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
            <button
              type="button"
              onClick={() => setModal(null)}
              aria-label="ปิด"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant/60 transition-colors hover:bg-white/5 hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <span className="text-xs tracking-[0.05em] text-burnished-gold/70">
              {modal.school.nameTh} · {modal.school.nameEn}
            </span>
            <h3 className="mt-2 font-serif text-2xl text-ivory">{modal.thinker.nameTh}</h3>
            <p className="mt-1 text-sm text-on-surface-variant/60">
              {modal.thinker.nameEn} · {modal.thinker.era}
            </p>

            <blockquote className="mt-5 border-l-2 border-burnished-gold pl-4 font-serif text-lg italic leading-relaxed text-soft-ivory">
              “{modal.thinker.quote}”
            </blockquote>

            {modal.thinker.concept ? (
              <p className="mt-4 text-sm leading-relaxed text-on-surface-variant/80">
                {modal.thinker.concept}
              </p>
            ) : null}
            {modal.thinker.bio ? (
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant/70">
                {modal.thinker.bio}
              </p>
            ) : null}

            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="mb-2 text-xs tracking-[0.04em] text-on-surface-variant/50">
                ผลงานเด่น
              </p>
              <ul className="space-y-1.5">
                {modal.thinker.masterpieces.map((m) => (
                  <li
                    key={m}
                    className="flex items-start gap-1.5 text-sm leading-relaxed text-soft-ivory"
                  >
                    <span className="material-symbols-outlined mt-0.5 text-[15px] text-burnished-gold/70">
                      menu_book
                    </span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
