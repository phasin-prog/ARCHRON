// supabase/functions/semantic-search/index.ts
// Hybrid search: embed คำค้นด้วย OpenAI แล้วเรียก RPC match_library (FTS + vector)
//
// Deploy:  supabase functions deploy semantic-search
// Secrets: OPENAI_API_KEY (แชร์กับ embed-library)
// Invoke:  POST { "q": "คำค้น", "k": 20 }  -> { results: [...] }
//
// ถ้าไม่มี key หรือ embedding ยังว่าง จะ fallback เป็น FTS อย่างเดียว (ยังใช้งานได้)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MODEL = "text-embedding-3-small";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  const { q, k } = await req.json().catch(() => ({ q: "", k: 20 }));
  const query = (q ?? "").toString().trim();
  if (!query) return new Response(JSON.stringify({ results: [] }), { headers: { "Content-Type": "application/json" } });

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  const sb = createClient(url, anonKey);

  let embedding: number[] | null = null;
  if (openaiKey) {
    try {
      const r = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: { "Authorization": `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, input: query }),
      });
      if (r.ok) embedding = (await r.json()).data?.[0]?.embedding ?? null;
    } catch (_) { /* fallback to FTS */ }
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
