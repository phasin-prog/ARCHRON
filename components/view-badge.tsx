"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClerkSupabaseClient } from "@/lib/supabase/client";

// ป้ายจำนวนผู้เยี่ยมชมสำหรับการ์ดในหน้า list — แสดงอย่างเดียว (ไม่นับเพิ่ม)
// ดึงแบบ batch: รวม slug ที่ร้องขอใน tick เดียวกันแล้วยิงคำถามครั้งเดียว (.in)
// ซ่อนตัวเองเมื่อยอด = 0 หรือยังไม่พร้อม (ตารางยังไม่ถูกสร้าง) เพื่อไม่ให้รก

const cache = new Map<string, number>();
const listeners = new Map<string, Set<(n: number) => void>>();
let pending = new Set<string>();
let scheduled = false;
let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) client = createClerkSupabaseClient(async () => null);
  return client;
}

function notify(slug: string, n: number) {
  listeners.get(slug)?.forEach((fn) => fn(n));
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(async () => {
    scheduled = false;
    const slugs = Array.from(pending);
    pending = new Set();
    if (slugs.length === 0) return;
    const { data, error } = await getClient()
      .from("page_views")
      .select("slug, views")
      .in("slug", slugs);
    const found = new Set<string>();
    if (!error && data) {
      for (const row of data as { slug: string; views: number }[]) {
        const n = Number(row.views);
        cache.set(row.slug, n);
        found.add(row.slug);
        notify(row.slug, n);
      }
    }
    // slug ที่ไม่พบ (หรือ error) = 0 — ซ่อน
    for (const s of slugs) {
      if (!found.has(s)) {
        cache.set(s, 0);
        notify(s, 0);
      }
    }
  });
}

export function ViewBadge({ slug, className }: { slug: string; className?: string }) {
  const [n, setN] = useState<number | null>(() => (cache.has(slug) ? cache.get(slug)! : null));

  useEffect(() => {
    if (cache.has(slug)) {
      setN(cache.get(slug)!);
      return;
    }
    const set = listeners.get(slug) ?? new Set<(n: number) => void>();
    set.add(setN);
    listeners.set(slug, set);
    pending.add(slug);
    schedule();
    return () => {
      set.delete(setN);
    };
  }, [slug]);

  if (n === null || n <= 0) return null;

  return (
    <span
      className={
        className ??
        "inline-flex items-center gap-1 text-xs text-text-secondary/55"
      }
      role="status" aria-live="polite"
    >
      <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[14px] text-accent/70" aria-hidden="true">👁</span>
      {n.toLocaleString("th-TH")}
    </span>
  );
}
