# Embedding + Search Index — Setup & Task Brief

เป้าหมาย: ทำให้ **Index / Library / Loading Data ไวขึ้น** ด้วย DB-backed index (FTS) + semantic search (pgvector) แทนการ build in-memory index ทั้งก้อนทุกครั้ง

## สิ่งที่ทำเข้า production แล้ว (โดย Studio/Editor)
- เปิด `pgvector` 0.8.0 (extension `vector`)
- เพิ่มคอลัมน์ `embedding vector(1536)` ที่ `library` และ `chunks`
- สร้าง index: GIN(fts) + HNSW(embedding cosine) ทั้งสองตาราง
- สร้าง RPC `public.match_library(query_text, query_embedding, match_count)` — hybrid FTS+vector (fallback FTS เมื่อ embedding ว่าง) + grant anon/authenticated
- Backfill `library` จาก entries (published) = **1,015 แถว พร้อม FTS** → หน้า Library/ค้นหา query จาก DB ได้ทันที
- ทดสอบแล้ว: `select * from match_library('Jung', null, 5)` คืนผลตรง

RLS: `library`/`chunks` เปิด RLS + มี SELECT policy อยู่แล้ว (ไม่แตะ)

## เหลือให้ทำ (ต้องมี OpenAI key + deploy)

### 1. ตั้ง OpenAI API key (ไม่ commit ลง repo)
```
supabase secrets set OPENAI_API_KEY=sk-...            # สำหรับ edge functions
# ฝั่งเว็บ (ไม่บังคับ ถ้าใช้ edge function): ไม่ต้องใส่ key ใน NEXT_PUBLIC_*
```

### 2. Deploy edge functions
```
supabase functions deploy embed-library
supabase functions deploy semantic-search
```

### 3. Backfill embeddings (เรียกซ้ำจน remaining = 0)
`embed-library` ทำทีละ batch (96 แถว/ครั้ง) กัน timeout — เรียกซ้ำจนกว่า `remaining` = 0
```
# ตัวอย่าง (ใช้ service role):
curl -X POST "$SUPABASE_URL/functions/v1/embed-library" -H "Authorization: Bearer $SERVICE_ROLE_KEY"
# → {"embedded":96,"remaining":919} ... เรียกซ้ำ ... {"done":true,"remaining":0}
```
ต้นทุนโดยประมาณ: text-embedding-3-small ~ $0.02 / 1M tokens → 1,015 แถว catalog ราคาไม่กี่เซนต์

### 4. Rewire frontend (Task Brief — Frontend Engineering)
เปลี่ยนจาก in-memory `buildSearchIndex` (lib/content/search-index.ts) มาใช้ DB index:
- **หน้า /library**: ใช้ `listLibrary({category, limit, offset})` (pagination) แทนโหลด entries ทั้งหมด → โหลดไวขึ้นชัด
- **Search box**: ใช้ `searchLibraryFts(q)` (เร็ว, ไม่ต้อง key) หรือ `semanticSearch(q)` (hybrid, ต้อง key+deploy) จาก `lib/content/search-db.ts`
- คง in-memory index ไว้เป็น fallback ได้ระหว่างเปลี่ยนผ่าน
- ระวัง Thai-first: ผล match_library คืน slug/title ไทย ใช้เชื่อม route เดิม `/concepts /articles /schools` ตาม category

### 5. (ถัดไป) chunk-level RAG
ตาราง `chunks` พร้อมแล้ว (embedding + fts) แต่ยังว่าง — ถ้าต้องการค้นระดับย่อหน้า/RAG ให้เพิ่ม pipeline แตก body_markdown → chunks แล้ว embed (ใช้รูปแบบเดียวกับ embed-library) เป็นเฟสถัดไป

## Guardrails
- ห้าม commit OPENAI_API_KEY ลง repo — ใช้ `supabase secrets` เท่านั้น
- migration DDL apply เข้า prod แล้ว (ผ่าน Supabase migration `enable_pgvector_and_search_index`); ไฟล์ .sql ใน repo เป็น source of record
- ไม่แตะ auth/RLS เดิม; backfill เป็น idempotent (rerun ปลอดภัย)
