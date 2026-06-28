"use client";

import { useState } from "react";

type Option = { value: string; label?: string };

export function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "เลือก...",
}: {
  value: string;
  onChange: (v: string) => void;
  options: (string | Option)[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const norm: Option[] = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : { value: o.value, label: o.label ?? o.value },
  );
  const current = norm.find((o) => o.value === value);
  const filtered = norm.filter((o) =>
    (o.label ?? o.value).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-ink/10 bg-white/40 px-3 py-2 text-left text-ivory"
      >
        <span className={current ? "text-ivory" : "text-subtle"}>
          {current ? current.label : placeholder}
        </span>
        <span className="text-muted">▾</span>
      </button>
      {open ? (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-ink/15 bg-surface-2 p-2">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหา..."
            className="w-full rounded border border-ink/10 bg-white/60 px-2 py-1.5 text-sm text-ivory outline-none"
          />
          <ul className="mt-2 max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-2 py-2 text-sm text-muted">ไม่พบรายการ</li>
            ) : (
              filtered.map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                      setQ("");
                    }}
                    className="block w-full rounded px-2 py-2 text-left text-sm text-soft-ivory hover:bg-ink/5"
                  >
                    {o.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
