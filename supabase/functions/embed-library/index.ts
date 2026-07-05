// supabase/functions/embed-library/index.ts
// Backfill embeddings ให้แถว library ที่ยังไม่มี embedding
// ใช้ Google Gemini `gemini-embedding-001` (outputDimensionality=1536 + L2-normalize)
// ให้ตรงคอลัมน์ embedding extensions.vector(1536)
//
// Deploy:   supabase functions deploy embed-library
// Secrets:  supabase secrets set GEMINI_API_KEY=...      (ห้าม commit key ลง repo)
// Invoke:   POST (service role) เรียกซ้ำจนกว่า remaining=0
//
// ทำงานเป็น batch ต่อการเรียก 1 ครั้ง (กัน timeout) แล้วคืน remaining เพื่อเรียกซ้ำ

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BATCH = 40;
const MODEL = "gemini-embedding-001";
const DIM = 1536;

function l2norm(v: number[]): number[] {
  let s = 0;
  for (const x of v) s += x * x;
  s = Math.sqrt(s) || 1;
  return v.map((x) => x / s);
}

async function embed(text: string, key: string): Promise<number[] | null> {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:embedContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        model: `models/${MODEL}`,
        content: { parts: [{ text: text || " " }] },
        outputDimensionality: DIM,
      }),
    },
  );
  if (!r.ok) return null;
  const j = await r.json();
  const v = j?.embedding?.values;
  return v ? l2norm(v) : null;
}

Deno.serve(async () => {
  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) return new Response(JSON.stringify({ error: "GEMINI_API_KEY not set" }), { status: 500 });
  const sb = createClient(url, serviceKey);

  const { data: rows, error } = await sb
    .from("library").select("id, title, summary, tags").is("embedding", null).limit(BATCH);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  if (!rows || rows.length === 0) return new Response(JSON.stringify({ done: true, embedded: 0, remaining: 0 }));

  let embedded = 0;
  for (const r of rows) {
    const text = [r.title, r.summary, Array.isArray(r.tags) ? r.tags.join(" ") : ""].filter(Boolean).join("\n").slice(0, 4000);
    const emb = await embed(text, key);
    if (emb) {
      const { error: upErr } = await sb.from("library").update({ embedding: emb }).eq("id", r.id);
      if (!upErr) embedded++;
    }
    await new Promise((res) => setTimeout(res, 200)); // gentle on rate limits
  }

  const { count: remaining } = await sb.from("library").select("id", { count: "exact", head: true }).is("embedding", null);
  return new Response(JSON.stringify({ done: (remaining ?? 0) === 0, embedded, remaining: remaining ?? 0 }), {
    headers: { "Content-Type": "application/json" },
  });
});
