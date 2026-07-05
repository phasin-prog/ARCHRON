// lib/content/search-db.ts
// Server helper สำหรับค้นหา/โหลดข้อมูลจาก DB index (library) แทนการ build in-memory index ทั้งก้อน
// - searchLibraryFts: ค้นแบบ FTS ผ่าน RPC match_library (ไม่ต้องมี embedding) — ใช้ได้ทันที
// - listLibrary: ดึง catalog แบบแบ่งหน้า (pagination) สำหรับหน้า /library ให้โหลดไว
//
// สำหรับ semantic (vector) ให้เรียก Edge Function `semantic-search` (embed คำค้นฝั่ง server)

import { createClient } from "@supabase/supabase-js";

function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

export type LibraryHit = {
  entry_id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: string | null;
  tags: string[] | null;
  score?: number;
};

// ค้นแบบ FTS (เร็ว, ไม่ต้องมี embedding) — เหมาะกับ search box ทั่วไป
export async function searchLibraryFts(query: string, k = 20): Promise<LibraryHit[]> {
  if (!query?.trim()) return [];
  const { data, error } = await db().rpc("match_library", {
    query_text: query.trim(),
    query_embedding: null,
    match_count: k,
  });
  if (error) throw error;
  return (data ?? []) as LibraryHit[];
}

// รายการ catalog แบบแบ่งหน้า สำหรับ /library (โหลดเฉพาะหน้าที่ต้องการ)
export async function listLibrary(opts: { category?: string; limit?: number; offset?: number } = {}) {
  const { category, limit = 30, offset = 0 } = opts;
  let q = db()
    .from("library")
    .select("entry_id, slug, title, summary, category, tags, updated_at", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (category) q = q.eq("category", category);
  const { data, error, count } = await q;
  if (error) throw error;
  return { rows: (data ?? []) as LibraryHit[], total: count ?? 0 };
}

// Semantic hybrid search ผ่าน Edge Function (ต้องตั้ง OPENAI_API_KEY + deploy semantic-search)
export async function semanticSearch(query: string, k = 20): Promise<LibraryHit[]> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const res = await fetch(`${base}/functions/v1/semantic-search`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${anon}`, "Content-Type": "application/json" },
    body: JSON.stringify({ q: query, k }),
  });
  if (!res.ok) return searchLibraryFts(query, k); // fallback FTS
  const json = await res.json();
  return (json.results ?? []) as LibraryHit[];
}
