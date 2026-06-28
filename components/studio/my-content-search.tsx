"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ContentEntry } from "@/types/content";
import { listMyEntries } from "@/lib/content/entries-db";

// ค้นหา/เปิดเนื้อหาของผู้เขียนเอง (Studio search) — ใช้ใน sidebar ของ editor
// ใช้ <a> (full reload) เพื่อให้ editor โหลด draft ใหม่ตาม ?slug
export function MyContentSearch({
  supabase,
  userId,
}: {
  supabase: SupabaseClient;
  userId: string | null;
}) {
  const [items, setItems] = useState<ContentEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      const data = await listMyEntries(supabase, userId);
      if (active) {
        setItems(data);
        setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [supabase, userId]);

  const term = q.trim().toLowerCase();
  const results = term
    ? items.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.slug.toLowerCase().includes(term) ||
          (e.thaiName ?? "").toLowerCase().includes(term),
      )
    : items;

  return (
    <div className="rounded-md border border-white/10 bg-surface-1/40 p-5">
      <h3 className="font-serif text-base text-ivory">ค้นหาเนื้อหาของฉัน</h3>
      {!userId ? (
        <p className="mt-3 text-sm text-muted">เข้าสู่ระบบเพื่อค้นหาและเปิดงานของคุณ</p>
      ) : (
        <>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชื่อ / slug..."
            className="mt-3 w-full rounded-md border border-white/10 bg-charcoal/40 px-3 py-2 text-sm text-ivory outline-none focus:border-antique-gold/50"
          />
          <ul className="mt-3 max-h-64 space-y-1 overflow-auto">
            {results.length === 0 ? (
              <li className="px-1 py-1.5 text-sm text-muted">
                {loaded ? "ไม่พบเนื้อหา" : "กำลังโหลด..."}
              </li>
            ) : (
              results.slice(0, 40).map((e) => (
                <li key={e.slug}>
                  <a
                    href={`/studio/editor?slug=${encodeURIComponent(e.slug)}`}
                    className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm text-soft-ivory transition-colors hover:bg-white/5 hover:text-soft-gold"
                  >
                    <span className="truncate">{e.title || e.slug}</span>
                    <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted">
                      {e.status}
                    </span>
                  </a>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
}
