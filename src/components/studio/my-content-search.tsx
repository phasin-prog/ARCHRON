"use client";

import { useEffect, useState } from "react";
import type { ContentEntry } from "@/types/content";
import { listMyEntriesAction } from "@/features/editor/actions";
import { contentTypeMeta } from "@/lib/content/cosmology";

// ค้นหา/เปิดเนื้อหาของผู้เขียนเอง (Studio search) — ใช้ใน sidebar ของ editor
// ใช้ <a> (full reload) เพื่อให้ editor โหลด draft ใหม่ตาม ?slug
export function MyContentSearch({ userId }: { userId: string | null }) {
  const [items, setItems] = useState<ContentEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      const { entries } = await listMyEntriesAction();
      if (active) {
        setItems(entries);
        setLoaded(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId]);

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
    <div className="rounded-md border border-text-heading/10 bg-surface-1/40 p-5">
      <h3 className="font-serif text-base text-text-heading">ค้นหาเนื้อหาของฉัน</h3>
      {!userId ? (
        <p className="mt-3 text-sm text-text-secondary">เข้าสู่ระบบเพื่อค้นหาและเปิดงานของคุณ</p>
      ) : (
        <>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชื่อ / slug..."
            aria-label="ค้นหาเนื้อหาของฉัน"
            className="mt-3 w-full rounded-md border border-text-heading/10 bg-text-heading/40 px-3 py-2 text-sm text-text-heading outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-colors"
          />
          <ul className="mt-3 max-h-64 space-y-1 overflow-auto">
            {results.length === 0 ? (
              <li className="px-1 py-1.5 text-sm text-text-secondary">
                {loaded ? "ไม่พบเนื้อหา" : "กำลังโหลด..."}
              </li>
            ) : (
              results.slice(0, 40).map((e) => {
                const meta = contentTypeMeta(e.contentType);
                return (
                  <li key={e.slug}>
                    <a
                      href={`/studio/editor?slug=${encodeURIComponent(e.slug)}`}
                      className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm text-text-body transition-colors hover:bg-text-heading/5 hover:text-accent"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="inline-flex items-center justify-center shrink-0 w-4 h-4"
                          style={{ color: meta.accent }}
                          title={meta.label}
                          aria-hidden="true"
                        >
                          ◆
                        </span>
                        <span className="truncate">{e.title || e.slug}</span>
                      </span>
                      <span className="shrink-0 text-sm font-medium text-text-secondary/80">
                        {e.status}
                      </span>
                    </a>
                  </li>
                );
              })
            )}
          </ul>
        </>
      )}
    </div>
  );
}
