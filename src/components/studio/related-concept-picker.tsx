"use client";

import { useState } from "react";
import { conceptRegistry } from "@/lib/content/core/registry";

type RC = { conceptSlug: string; relationType: string; reason: string };

const RELATION_TYPES = [
  "prerequisite", "related", "contrasts-with", "part-of",
  "source-of", "used-in", "influenced-by",
];

export function RelatedConceptPicker({
  value,
  onChange,
}: {
  value: RC[];
  onChange: (v: RC[]) => void;
}) {
  const [q, setQ] = useState("");
  const [slug, setSlug] = useState("");
  const [rel, setRel] = useState("related");
  const [reason, setReason] = useState("");

  const results = conceptRegistry
    .filter((c) => !value.some((v) => v.conceptSlug === c.slug))
    .filter(
      (c) =>
        c.title.toLowerCase().includes(q.toLowerCase()) ||
        (c.thaiTitle ?? "").includes(q) ||
        c.slug.includes(q.toLowerCase()),
    )
    .slice(0, 8);

  const inputClass =
    "w-full rounded-md border border-text-heading/10 bg-text-heading/40 px-3 py-2 text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-colors";

  function add() {
    if (slug.trim() === "") return;
    onChange([...value, { conceptSlug: slug, relationType: rel, reason }]);
    setSlug("");
    setReason("");
    setRel("related");
    setQ("");
  }

  return (
    <div className="space-y-3">
      {value.map((r, i) => (
        <div key={i} className="flex items-start justify-between gap-3 rounded-md border border-text-heading/10 bg-text-heading/40 p-3">
          <div className="text-sm text-text-body">
            <span className="text-text-heading">{r.conceptSlug}</span>
            <span className="ml-2 text-xs text-accent">{r.relationType}</span>
            {r.reason ? <p className="mt-1 text-text-secondary">{r.reason}</p> : null}
          </div>
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-xs text-error" aria-label={`ลบความสัมพันธ์ ${r.conceptSlug}`}>ลบ</button>
        </div>
      ))}

      <div className="rounded-md border border-text-heading/10 bg-surface-1/40 p-3">
        <input
          value={slug ? slug : q}
          onChange={(e) => {
            setQ(e.target.value);
            setSlug("");
          }}
          placeholder="ค้นหาแนวคิดจาก Concept Registry..."
          aria-label="ค้นหาแนวคิด"
          className={inputClass}
        />
        {q !== "" && slug === "" ? (
          <ul className="mt-2 max-h-48 overflow-y-auto">
            {results.length === 0 ? (
              <li className="px-2 py-2 text-sm text-text-secondary">ไม่พบใน registry</li>
            ) : (
              results.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      setSlug(c.slug);
                      setQ(c.title);
                    }}
                    className="block w-full rounded px-2 py-1.5 text-left text-sm text-text-body hover:bg-text-heading/5"
                  >
                    {c.title}
                    {c.thaiTitle ? <span className="text-text-secondary"> · {c.thaiTitle}</span> : null}
                    <span className="ml-2 text-xs text-accent">{c.nodeType}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}

        {slug !== "" ? (
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <select className={inputClass} value={rel} onChange={(e) => setRel(e.target.value)} aria-label="ประเภทความสัมพันธ์">
              {RELATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="เหตุผลที่เชื่อมโยง (ห้ามเชื่อมเพราะชื่อคล้าย)" aria-label="เหตุผลที่เชื่อมโยง" />
            <button type="button" onClick={add} className="rounded-md border border-text-heading/20 px-3 text-sm text-text-body hover:border-accent">เพิ่ม</button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
