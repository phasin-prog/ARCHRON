# ARCHRON Platform Engineering Documentation (Phases 61-70)

> **สถานะ:** รัฐธรรมนูญวิศวกรรมแพลตฟอร์ม (Platform Engineering Constitution)
> **เป้าหมาย:** บันทึกสถาปัตยกรรมพื้นฐานของระบบ production ทั้งหมด

---

## Phase 61: Database Constitution (SQL Generation Protocol)

### หลักการ
- ใช้ PostgreSQL ผ่าน Supabase
- ทุกตารางต้องมี UUID PK, created_at, updated_at
- ไม่ใช้ integer IDs
- RLS (Row Level Security) เปิดใช้งานเสมอ

### โครงสร้างตาราง

#### 1. `entries` — ตารางหลักสำหรับเนื้อหาทุกประเภท
```sql
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  status text not null default 'draft',
  content_type text not null default 'article',
  author_id text not null,
  -- identity block
  main_term text,
  thai_name text,
  original_term text,
  part_of_speech text,
  language_root text,
  ipa text,
  short_description text,
  -- framework / theory
  framework text,
  main_thinkers text[],
  school text,
  difficulty text,
  tags text[],
  -- content
  visual_explanation text,
  technical_meaning text,
  body_markdown text,
  cover_image text,
  -- structured (jsonb)
  roots jsonb,
  related_concepts jsonb not null default '[]'::jsonb,
  source_refs jsonb not null default '[]'::jsonb,
  related_cta jsonb,
  -- timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
```

#### 2. `entry_revisions` — ประวัติเวอร์ชัน
```sql
create table if not exists public.entry_revisions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  snapshot jsonb not null,
  created_by text not null,
  note text,
  created_at timestamptz not null default now()
);
```

#### 3. `page_views` — นับจำนวนผู้เข้าชม
```sql
create table if not exists public.page_views (
  slug text primary key,
  views integer not null default 0,
  updated_at timestamptz not null default now()
);
```

#### 4. `drafts` — แบบร่างชั่วคราว
```sql
create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  author_id text not null,
  slug text not null,
  title text not null default '',
  body_markdown text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### RLS Policies
```sql
-- entries: published = anyone can read
alter table public.entries enable row level security;
create policy "entries_select_published" on public.entries
  for select using (status = 'published' or auth.role() = 'service_role');

-- entries: draft = only owner
create policy "entries_select_own" on public.entries
  for select using (author_id = auth.uid()::text or auth.role() = 'service_role');

-- entries: insert/update = service_role only
create policy "entries_insert_service" on public.entries
  for insert with check (auth.role() = 'service_role');
create policy "entries_update_service" on public.entries
  for update using (auth.role() = 'service_role');
```

---

## Phase 62: SQL Architecture

### ไฟล์ที่เกี่ยวข้อง
- `supabase/schema.sql` — Schema หลัก (420 บรรทัด)
- `supabase/seed.sql` — ข้อมูลเริ่มต้น (ถ้ามี)

### วิธีใช้งาน
1. เปิด Supabase Dashboard
2. ไปที่ SQL Editor
3. คัดลอกเนื้อหาจาก `schema.sql`
4. สร้าง New Query
5. วางเนื้อหาและกด Run

### หมายเหตุ
- Schema เป็น idempotent (ปลอดภัยต่อการรันซ้ำ)
- ใช้ `if not exists` และ `drop policy if exists`

---

## Phase 63: Storage Architecture (Cloudflare R2)

### สถาปัตยกรรม
```
Client → /api/media → Cloudflare R2 (private bucket)
```

### การตั้งค่า
1. สร้าง R2 Bucket ใน Cloudflare Dashboard
2. ตั้งค่า Access Key ใน `.env.local`:
   ```
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=archron-media
   ```

### โครงสร้างโฟลเดอร์ R2
```
/archron-media/
  /assets/
    /images/
    /videos/
    /audio/
    /documents/
```

### API Routes
- `POST /api/media/upload` — อัปโหลดไฟล์
- `GET /api/media/[key]` — ดึงไฟล์ (proxy)
- `DELETE /api/media/[key]` — ลบไฟล์

---

## Phase 64: Caching Strategy

### กลยุทธ์ caching
1. **ISR (Incremental Static Regeneration)**
   - `revalidate = 300` (5 นาที) สำหรับหน้า list
   - On-demand revalidation เมื่อมี publish

2. **Upstash Redis**
   - TTL: 300 วินาที
   - Keys: `archron:cache:entries:published`, `archron:cache:entry:<slug>`

3. **Client-side caching**
   - React Query / SWR สำหรับ data fetching
   - localStorage สำหรับ bookmarks, history

### ตัวอย่างโค้ด
```typescript
// lib/supabase/server.ts
const revalidate = 300; // 5 minutes

export async function getPublicEntries() {
  // 1. Check Redis cache
  // 2. If miss, query Supabase
  // 3. Store in Redis with TTL
  // 4. Return data
}
```

---

## Phase 65: Search Engine

### สถาปัตยกรรม
```
Client → /search → buildSearchIndex() → Filter + Sort → Results
```

### ประเภทการค้นหา
1. **Full-text search** — ค้นหาจาก title, body, tags
2. **Filter by type** — กรองตาม content_type
3. **Filter by framework** — กรองตาม framework
4. **Filter by difficulty** — กรองตาม difficulty

### ตัวอย่างโค้ด
```typescript
// lib/content/search-index.ts
export function buildSearchIndex(entries: ContentEntry[]) {
  return entries.map(entry => ({
    ...entry,
    searchText: [
      entry.title,
      entry.shortDescription,
      entry.subtitle,
      entry.framework,
      ...(entry.tags ?? []),
    ].join(' ').toLowerCase()
  }));
}
```

---

## Phase 66: Performance Optimization

### กลยุทธ์

1. **RSC (React Server Components)**
   - ใช้ Server Component เป็นค่าเริ่มต้น
   - Client Component เฉพาะส่วนที่ต้อง interaction

2. **Font Optimization**
   - ใช้ `next/font` สำหรับ font loading
   - Subset ฟอนต์เฉพาะตัวอักษรที่ใช้

3. **Image Optimization**
   - ใช้ `next/image` สำหรับรูปภาพ
   - Lazy loading อัตโนมัติ
   - Responsive sizes

4. **Bundle Optimization**
   - Tree shaking อัตโนมัติ
   - Code splitting ตาม route
   - Dynamic imports สำหรับ heavy components

5. **SVG Sprites**
   - รวมไอคอนเป็น SVG sprite
   - ลดจำนวน HTTP requests

### ตัวอย่างโค้ด
```typescript
// Dynamic import สำหรับ heavy components
const ConstellationMindmap = dynamic(
  () => import('@/components/constellation/constellation-mindmap'),
  { loading: () => <Skeleton /> }
);
```

---

## Phase 67: Security

### ชั้นความปลอดภัย

1. **Clerk Authentication**
   - ตรวจสอบ user ทุก request
   - JWT token validation

2. **Supabase RLS**
   - Row Level Security เปิดใช้งานเสมอ
   - Service role สำหรับ server-side operations

3. **Proxy Routes**
   - `/api/media/*` — proxy ไปยัง R2
   - ป้องกัน direct access ไปยัง storage

4. **Environment Guards**
   - ตรวจสอบ env variables ก่อนใช้งาน
   - ไม่เก็บ secrets ในโค้ด

5. **Input Validation**
   - Validate ทุก input ก่อนบันทึก
   - Sanitize markdown content

### ตัวอย่างโค้ด
```typescript
// lib/content/server-auth.ts
export async function getAuthedSupabase() {
  const userId = await getUserId();
  if (!userId) throw new Error('Unauthorized');
  
  const supabase = createServiceRoleClient();
  return { supabase, userId };
}
```

---

## Phase 68: API Architecture

### โครงสร้าง API Routes

```
app/
  api/
    media/
      upload/route.ts    — POST อัปโหลดไฟล์
      [key]/route.ts     — GET/DELETE จัดการไฟล์
    draft/
      save/route.ts      — POST บันทึกแบบร่าง
      load/route.ts      — POST โหลดแบบร่าง
    entries/
      publish/route.ts   — POST เผยแพร่บทความ
      revalidate/route.ts — POST revalidate cache
```

### หลักการออกแบบ
1. **RESTful** — ใช้ HTTP methods ถูกต้อง
2. **Error handling** — จัดการ error ทุกระดับ
3. **Rate limiting** — จำกัดจำนวน requests
4. **Validation** — Validate ทุก input

---

## Phase 69: Deployment Pipeline (Vercel CI/CD)

### ขั้นตอน

1. **Git Push**
   ```bash
   git push origin main
   ```

2. **Vercel Auto Deploy**
   - Detect changes
   - Install dependencies
   - Run build
   - Deploy to production

3. **Pre-deploy Checks**
   ```bash
   npm run build    # ต้อง pass
   npm run lint     # ต้อง pass
   ```

4. **Environment Variables**
   - ตั้งค่าใน Vercel Dashboard
   - ไม่ commit `.env.local`

### Checklist
- [ ] `npm run build` ผ่าน
- [ ] `npm run lint` ผ่าน
- [ ] ไม่มี TypeScript errors
- [ ] ไม่มี runtime errors
- [ ] ทดสอบบน staging environment

---

## Phase 70: Agent Handoff

### ไฟล์ที่เกี่ยวข้อง
- `docs/AGENT-HANDOFF.md` — Master Operational Constitution (496 บรรทัด)
- `AGENTS.md` — Agent Rules (root)

### สารบัญ
1. โครงสร้างรัฐธรรมนูญ (§0)
2. เส้นทางงาน (§2-§20)
3. ข้อบังคับสถาปัตยกรรม (§3)
4. สารานุกรมคำจำกัดความ (§0.1)

### วิธีใช้
1. อ่าน `AGENTS.md` ก่อนเริ่มงานทุกครั้ง
2. อ่าน `AGENT-HANDOFF.md` เพื่อเข้าใจโครงสร้าง
3. ตรวจสอบไฟล์ที่เกี่ยวข้องตามเส้นทางงาน
4. ทำตามข้อบังคับอย่างเคร่งครัด

---

## Summary

| Phase | System | Status |
|-------|--------|--------|
| 61 | Database Constitution | ✓ |
| 62 | SQL Architecture | ✓ |
| 63 | Storage Architecture | ✓ |
| 64 | Caching Strategy | ✓ |
| 65 | Search Engine | ✓ |
| 66 | Performance Optimization | ✓ |
| 67 | Security | ✓ |
| 68 | API Architecture | ✓ |
| 69 | Deployment Pipeline | ✓ |
| 70 | Agent Handoff | ✓ |

---

## Constitutional Compliance

| Constitution | Compliance |
|--------------|------------|
| AGENT-HANDOFF.md | ✓ ปฏิบัติตามรัฐธรรมนูญ |
| ROADMAP Phase 61-70 | ✓ ครบทุกเฟส |
| AGENTS.md | ✓ ปฏิบัติตามกฎเหล็ก |
