"use client";

import { useState } from "react";

export function SearchableMultiSelect({
  values,
  onChange,
  options,
  placeholder = "ค้นหาและเลือก...",
}: {
  values: string[];
  onChange: (v: string[]) => void;
  options: string[];
  placeholder?: string;
}) {
  const [q, setQ] = useState("");

  const available = options.filter(
    (o) => !values.includes(o) && o.toLowerCase().includes(q.toLowerCase()),
  );

  function add(v: string) {
    if (!values.includes(v)) onChange([...values, v]);
    setQ("");
  }

  return (
    <div className="rounded-md border border-ink/10 bg-white/40 p-2">
      {values.length > 0 ? (
        <div className="mb-2 flex flex-wrap gap-2">
          {values.map((v) => (
            <span key={v} className="inline-flex items-center gap-1 rounded-full border border-antique-gold/30 bg-antique-gold/10 px-2.5 py-1 text-xs text-soft-gold">
              {v}
              <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="text-soft-gold/70 hover:text-soft-gold">
                ✕
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent px-1 py-1 text-sm text-ivory outline-none"
      />
      {q !== "" ? (
        <ul className="mt-2 max-h-48 overflow-y-auto">
          {available.length === 0 ? (
            <li className="px-1 py-1.5 text-sm text-muted">ไม่พบ — แท็กควรมีหน้าที่จริง อย่าใช้คำสวยลอย ๆ</li>
          ) : (
            available.map((o) => (
              <li key={o}>
                <button type="button" onClick={() => add(o)} className="block w-full rounded px-2 py-1.5 text-left text-sm text-soft-ivory hover:bg-ink/5">
                  {o}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
