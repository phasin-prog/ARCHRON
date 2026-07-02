// supabase/functions/embed-library/index.ts
// Backfill embeddings ให้แถว library ที่ยังไม่มี embedding
// ใช้ OpenAI text-embedding-3-small (1536 มิติ) — ตรงกับคอลัมน์ embedding extensions.vector(1536)
//
// Deploy:   supabase functions deploy embed-library
// Secrets:  supabase secrets set OPENAI_API_KEY=sk-...   (ห้าม commit key ลง repo)
// Invoke:   POST (ต้องใช้ service role หรือเรียกซ้ำจนกว่า remaining=0)
//
// ทำงานเป็น batch ต่อการเรียก 1 ครั้ง (กัน timeout) แล้วคืน remaining เพื่อเรียกซ้ำ

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BATCH = 96; // OpenAI รับหลายข้อความต่อ request ได้
const MODEL = "text-embedding-3-small";

Deno.serve(async () => {
  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!openaiKey) {
    return new Response(JSON.stringify({ error: "OPENAI_API_KEY not set" }), { status: 500 });
  }
  const sb = createClient(url, serviceKey);

  // ดึงแถวที่ยังไม่มี embedding
  const { data: rows, error } = await sb
    .from("library")
    .select("id, title, summary, tags")
    .is("embedding", null)
    .limit(BATCH);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  if (!rows || rows.length === 0) {
    return new Response(JSON.stringify({ done: true, embedded: 0, remaining: 0 }));
  }

  const inputs = rows.map((r) =>
    [r.title, r.summary, Array.isArray(r.tags) ? r.tags.join(" ") : ""].filter(Boolean).join("\n").slice(0, 8000)
  );

  const resp = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { "Authorization": `Bearer ${openaiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, input: inputs }),
  });
  if (!resp.ok) {
    return new Response(JSON.stringify({ error: `OpenAI ${resp.status}: ${await resp.text()}` }), { status: 502 });
  }
  const json = await resp.json();

  let embedded = 0;
  for (let i = 0; i < rows.length; i++) {
    const emb = json.data[i]?.embedding;
    if (!emb) continue;
    const { error: upErr } = await sb.from("library").update({ embedding: emb }).eq("id", rows[i].id);
    if (!upErr) embedded++;
  }

  const { count: remaining } = await sb
    .from("library").select("id", { count: "exact", head: true }).is("embedding", null);

  return new Response(JSON.stringify({ done: (remaining ?? 0) === 0, embedded, remaining: remaining ?? 0 }), {
    headers: { "Content-Type": "application/json" },
  });
});
