# Embedding + Search Index — Setup & Task Brief

เป้าหมาย: ทำให้ **Index / Library / Loading Data ไวขึ้น** ด้วย DB-backed index (FTS) + semantic search (pgvector) แทนการ build in-memory index ทั้งก้อนทุกครั้ง

โมเดล embedding: **Google Gemini `gemini-embedding-001`** ขอ `outputDimensionality=1536` + L2-normalize (ให้ตรงคอลัมน์ `vector(1536)` และเข้ากับ HNSW cosine)

## สิ่งที่ทำเข้า production แล้ว (โดย Studio/Editor)
- เปิด `pgvector` 0.8.0 (extension `vector`)
- เพิ่มคอลัมน์ `embedding vector(1536)` ที่ `library` และ `chunks`
- index: GIN(fts) + HNSW(embedding cosine) ทั้งสองตาราง
- RPC `public.match_library(query_text, query_embedding, match_count)` — hybrid FTS+vector (fallback FTS เมื่อ embedding ว่าง) + grant anon/authenticated
- Backfill `library` จาก entries (published) = 1,015 แถว พร้อม FTS
- ทดสอบ FTS: `select * from match_library('Jung', null, 5)` คืนผลตรง

RLS: `library`/`chunks` เปิด RLS + มี SELECT policy อยู่แล้ว (ไม่แตะ)

## ตั้งค่า Gemini key + deploy (โปรดักชัน)

### 1. ตั้ง key ใน Supabase secrets (ห้าม commit)
```
supabase secrets set GEMINI_API_KEY=...
```
> คำเตือน: หาก key เคยถูกแชร์เป็นข้อความเปิด ควร rotate/สร้างใหม่ก่อนใช้จริง

### 2. Deploy edge functions
```
supabase functions deploy embed-library
supabase functions deploy semantic-search
```

### 3. Backfill embeddings (เรียกซ้ำจน remaining=0)
`embed-library` ทำทีละ batch (40 แถว/ครั้ง) กัน timeout + หน่วงกัน rate limit
```
curl -X POST "$SUPABASE_URL/functions/v1/embed-library" -H "Authorization: Bearer $SERVICE_ROLE_KEY"
# → {"embedded":40,"remaining":975} ... เรียกซ้ำ ... {"done":true,"remaining":0}
```
> Gemini free tier มี rate limit (429) — ถ้า backfill จำนวนมากควรใช้ tier ที่มีโควตาสูงขึ้น หรือปล่อยเรียกซ้ำเป็นระยะ

### 4. Rewire frontend (Task Brief — Frontend Engineering)
เปลี่ยนจาก in-memory `buildSearchIndex` (lib/content/search-index.ts) มาใช้ DB index:
- **/library**: ใช้ `listLibrary({category, limit, offset})` (pagination) แทนโหลด entries ทั้งหมด
- **Search box**: `searchLibraryFts(q)` (เร็ว ไม่ต้อง key) หรือ `semanticSearch(q)` (hybrid ต้อง key+deploy) จาก `lib/content/search-db.ts`
- คง in-memory index เป็น fallback ระหว่างเปลี่ยนผ่านได้
- Thai-first: ผลลัพธ์คืน slug/title ไทย เชื่อม route เดิม /concepts /articles /schools ตาม category

### 5. (เฟสถัดไป) chunk-level RAG
ตาราง `chunks` พร้อม (embedding+fts) แต่ยังว่าง — เพิ่ม pipeline แตก body_markdown → chunks แล้ว embed (Gemini เช่นกัน) ภายหลัง

## Guardrails
- ห้าม commit GEMINI_API_KEY ลง repo — ใช้ `supabase secrets` เท่านั้น
- migration DDL apply เข้า prod แล้ว (Supabase migration `enable_pgvector_and_search_index`); .sql ใน repo เป็น source of record
- ไม่แตะ auth/RLS เดิม; backfill idempotent (rerun ปลอดภัย)
