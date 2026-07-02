// supabase/functions/semantic-search/index.ts
// Hybrid search: embed คำค้นด้วย Gemini แล้วเรียก RPC match_library (FTS + vector)
//
// Deploy:  supabase functions deploy semantic-search
// Secrets: GEMINI_API_KEY (แชร์กับ embed-library)
// Invoke:  POST { "q": "คำค้น", "k": 20 } -> { results, mode }
//
// ถ้าไม่มี key/embedding ยังว่าง จะ fallback เป็น FTS อย่างเดียว (ยังใช้งานได้)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MODEL = "gemini-embedding-001";
const DIM = 1536;

function l2norm(v: number[]): number[] {
  let s = 0; for (const x of v) s += x * x; s = Math.sqrt(s) || 1;
  return v.map((x) => x / s);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const { q, k } = await req.json().catch(() => ({ q: "", k: 20 }));
  const query = (q ?? "").toString().trim();
  if (!query) return new Response(JSON.stringify({ results: [] }), { headers: { "Content-Type": "application/json" } });

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const key = Deno.env.get("GEMINI_API_KEY");
  const sb = createClient(url, anonKey);

  let embedding: number[] | null = null;
  if (key) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:embedContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify({ model: `models/${MODEL}`, content: { parts: [{ text: query }] }, outputDimensionality: DIM }),
        },
      );
      if (r.ok) {
        const v = (await r.json())?.embedding?.values;
        if (v) embedding = l2norm(v);
      }
    } catch (_) { /* fallback FTS */ }
  }

  const { data, error } = await sb.rpc("match_library", {
    query_text: query,
    query_embedding: embedding,
    match_count: Math.min(Math.max(Number(k) || 20, 1), 50),
  });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ results: data, mode: embedding ? "hybrid" : "fts" }), {
    headers: { "Content-Type": "application/json" },
  });
});
