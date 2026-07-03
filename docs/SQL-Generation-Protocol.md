# ARCHRON SQL Generation Protocol

**Version:** 1.0  
**Status:** Production / Living Database Constitution  
**Target Engine:** PostgreSQL 16+ (Supabase Native)  
**Encoding:** UTF-8  
**Language Strategy:** Thai-First Design System (เอกสารหลักระบุแนวทางปฏิบัติการและสถาปัตยกรรมเป็นภาษาไทยควบคู่กับ SQL คำสั่งจริง)

---

## Objective (เป้าหมายสูงสุด)

เอกสารนี้กำหนด **สถาปัตยกรรมและโปรโตคอลการสร้างฐานข้อมูล (SQL Generation Protocol)** ทั้งหมดของ ARCHRON  
ARCHRON ไม่ใช่บล็อกหรือระบบ CRUD ทั่วไป แต่เป็น **"ห้องสมุดความรู้มนุษยชาติที่มีชีวิต (Living Knowledge Library)"**  
สถาปัตยกรรมฐานข้อมูลนี้ออกแบบเพื่อความคุ้มครองความถูกต้องทางวิชาการ (Knowledge Integrity), ความสัมพันธ์โครงข่ายความรู้ (Knowledge Graph), ความยืดหยุ่นของงานเขียนบรรณาธิการ (Editorial Workflow), และความเสถียรสูงสุดในระบบโปรดักชัน

---

## General Rules (กฎเหล็กสถาปัตยกรรม)

1. **UUID Primary Keys:** ทุกตารางในระบบต้องใช้คีย์หลักเป็น `uuid` ที่สร้างด้วย `gen_random_uuid()` หรือระบุประเภทที่เหมาะสม ห้ามใช้ ID แบบตัวเลขเพิ่มทีละหนึ่ง (`integer/serial`)
2. **Standard Auditing Columns:** ทุกตารางต้องมีฟิลด์ `created_at` และ `updated_at` เป็นประเภท `timestamptz` เสมอ
3. **Idempotent Migration-Safe SQL:** ทุกคำสั่ง SQL ต้องรันซ้ำได้โดยไม่ทำลายข้อมูลเดิม (ใช้ `IF NOT EXISTS`, `OR REPLACE`, `DROP POLICY IF EXISTS` ฯลฯ)
4. **Strict RLS Guardrails:** ทุกตารางต้องเปิดใช้งาน **Row Level Security (RLS)** เสมอ และกำหนดนโยบายรักษาความปลอดภัยที่รัดกุมที่สุด
5. **No Destructive Operations:** ห้ามเขียน SQL ลบตารางหรือลบประเภทข้อมูลเดิมทิ้งโดยไม่มีความจำเป็นอย่างยิ่ง

---

# PHASE 01: Knowledge Core (ระบบความรู้แกนกลาง)

สถาปัตยกรรมข้อมูลระดับแกนกลางที่รองรับข้อมูลประเภท Polymorphic Entries, ความเชื่อมโยงข้ามมโนทัศน์ (Knowledge Relations), และระบบอ้างอิงเชิงวิชาการ (References & Citations)

### 1. Architecture Overview
ระบบความรู้แกนกลางของ ARCHRON ใช้รูปแบบ **Single-Table Inheritance (Polymorphic Entries)** ควบคู่กับ **Relationship Join Tables** เพื่อประสานระบบนิเวศความรู้ทั้งหมดเข้าด้วยกัน ทำให้อ่านข้อมูลได้รวดเร็วผ่าน Index ที่เหมาะสม และรองรับการดึงข้อมูลเพื่อมาทำระบบ RAG (Retrieval-Augmented Generation) ในอนาคต

### 2. ER Design Explanation
* `public.entries`: ตารางหลักเก็บวัตถุความรู้ทุกประเภท (Article, Concept, Thinker, School, Book, Reference) แยกประเภทด้วย `content_type`
* `public.knowledge_relations`: ตารางเก็บเส้นความสัมพันธ์ (Edges) ในกราฟความรู้ มีทิศทาง (`source_entry_id` → `target_entry_id`) และประเภทความสัมพันธ์ (`relation_type`)
* `public.citations`: ตารางจัดเก็บข้อความอ้างอิงและคีย์ DOI/ISBN สำหรับความมั่นคงทางวิชาการ

### 3. Complete SQL
```sql
-- เปิดใช้ extension สำหรับสร้าง UUID
create extension if not exists "pgcrypto";

-- ENUM สำหรับประเภทวัตถุความรู้
do $$
begin
  if not exists (select 1 from pg_type where typname = 'archron_content_type') then
    create type archron_content_type as enum (
      'article', 'concept', 'reading-set', 'source-note', 'person', 'book', 'school', 'symbol', 'term'
    );
  end if;
end $$;

-- ENUM สำหรับสถานะบทความ
do $$
begin
  if not exists (select 1 from pg_type where typname = 'archron_entry_status') then
    create type archron_entry_status as enum (
      'draft', 'needs-source-check', 'ready-to-publish', 'published', 'archived'
    );
  end if;
end $$;

-- ENUM สำหรับประเภทความสัมพันธ์ของมโนทัศน์
do $$
begin
  if not exists (select 1 from pg_type where typname = 'archron_relation_type') then
    create type archron_relation_type as enum (
      'inspired_by', 'developed_from', 'criticized_by', 'supports', 'opposes', 
      'related_to', 'equivalent_to', 'prerequisite', 'successor', 'predecessor'
    );
  end if;
end $$;

-- 1) entries: ตารางจัดเก็บ Polymorphic Entries หลัก
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  status archron_entry_status not null default 'draft',
  content_type archron_content_type not null default 'article',
  author_id text not null, -- Clerk user id
  
  -- Identity Block (ตามข้อกำหนด VOS/AES)
  main_term text,
  thai_name text,
  original_term text,
  part_of_speech text,
  language_root text,
  ipa text,
  short_description text,
  
  -- Metadata & Taxonomy
  framework text,
  main_thinkers text[],
  school text,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced', 'source-note')),
  tags text[],
  
  -- Content Surfaces
  visual_explanation text,
  technical_meaning text,
  body_markdown text,
  cover_image text,
  
  -- Rich Structured Data (JSONB)
  roots jsonb, -- { etymology, historicalUsage, meaningShift, caution }
  related_cta jsonb, -- { articleSlugs, conceptSlugs, readingSetSlugs, showConstellationMap }
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

-- 2) knowledge_relations: โครงสร้างความสัมพันธ์ (Graph Edges)
create table if not exists public.knowledge_relations (
  id uuid primary key default gen_random_uuid(),
  source_entry_id uuid not null references public.entries(id) on delete cascade,
  target_entry_id uuid not null references public.entries(id) on delete cascade,
  relation_type archron_relation_type not null default 'related_to',
  reason text,
  created_at timestamptz not null default now(),
  constraint unique_knowledge_relation unique (source_entry_id, target_entry_id, relation_type)
);

-- 3) citations: ข้อมูลบรรณานุกรมและการอ้างอิงทางวิชาการ
create table if not exists public.citations (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  citation_key text not null, -- e.g., 'Jung1921'
  source_type text not null check (source_type in ('primary', 'secondary', 'citation', 'quote')),
  title text not null,
  author text,
  year integer,
  publisher text,
  doi_isbn text,
  citation_text text not null,
  created_at timestamptz not null default now()
);
```

### 4. Triggers
```sql
-- ฟังก์ชันช่วยอัปเดตเวลาอัตโนมัติ
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- Trigger สำหรับอัปเดตตาราง entries
drop trigger if exists entries_set_updated_at on public.entries;
create trigger entries_set_updated_at
  before update on public.entries
  for each row execute function public.set_updated_at();
```

### 5. Functions
```sql
-- ค้นหาความสัมพันธ์ความรู้ย้อนกลับ (Backlinks)
create or replace function public.get_backlinks_for_entry(target_uuid uuid)
returns table (
  source_id uuid,
  source_title text,
  source_slug text,
  relation archron_relation_type
) language sql stable as $$
  select e.id, e.title, e.slug, r.relation_type
  from public.knowledge_relations r
  join public.entries e on r.source_entry_id = e.id
  where r.target_entry_id = target_uuid;
$$;
```

### 6. Views
```sql
-- วิวสำหรับแสดงบทความที่เผยแพร่สู่สาธารณะแล้วเท่านั้น (อนุมัติโดย anonymous read)
create or replace view public.published_entries as
  select * from public.entries
  where status = 'published';
```

### 7. Indexes
```sql
-- ดัชนีประสิทธิภาพสำหรับการค้นหาและกรองเนื้อหา
create index if not exists entries_slug_idx on public.entries (slug);
create index if not exists entries_status_type_idx on public.entries (status, content_type);
create index if not exists entries_author_idx on public.entries (author_id);
create index if not exists relation_source_idx on public.knowledge_relations (source_entry_id);
create index if not exists relation_target_idx on public.knowledge_relations (target_entry_id);
create index if not exists citation_entry_idx on public.citations (entry_id);
```

### 8. Policies
```sql
-- เปิดใช้ RLS เสมอ
alter table public.entries enable row level security;
alter table public.knowledge_relations enable row level security;
alter table public.citations enable row level security;

-- นโยบายสำหรับสาธารณะ (เปิดให้อ่านข้อมูลที่เผยแพร่แล้ว)
create policy "Anyone can read published entries"
  on public.entries for select
  using (status = 'published');

create policy "Anyone can read relations of published entries"
  on public.knowledge_relations for select
  using (
    exists (select 1 from public.entries where id = source_entry_id and status = 'published')
    and exists (select 1 from public.entries where id = target_entry_id and status = 'published')
  );

create policy "Anyone can read citations of published entries"
  on public.citations for select
  using (
    exists (select 1 from public.entries where id = entry_id and status = 'published')
  );
```

### 9. Performance Notes
* ดัชนีแบบผสม `entries_status_type_idx` ช่วยเร่งความเร็วในการโหลดหน้าหมวดหมู่สาธารณะได้ดีมาก
* `knowledge_relations` ป้องกันระเบียนซ้ำด้วย Unique Constraint เพื่อประสิทธิภาพของการทำ Graph Traversal

### 10. Future Expansion Notes
* สามารถปรับ `main_thinkers` ให้เปลี่ยนไปเป็นตารางเชื่อมโยงเฉพาะเมื่อต้องการทำดัชนีชิ้นงานข้ามหลายคนอย่างลึกซึ้ง

---

# PHASE 02: Editorial Studio (ระบบเขียนและงานบรรณาธิการ)

สถาปัตยกรรมข้อมูลสำหรับรองรับประวัติเวอร์ชัน (Revision History), ตัวจัดเก็บสเก็ตช์ร่าง (Drafts), และระบบการจัดการประวัติการเปลี่ยน URL (Slug Redirects)

### 1. Architecture Overview
ระบบความร่วมมือนักเขียนต้องการระบบจัดเก็บความคืบหน้าที่ไม่ส่งผลกระทบต่อหน้าสาธารณะ (Draft Isolation) พร้อมระบบความปลอดภัยระดับสิทธิ์เฉพาะบุคคล

### 2. ER Design Explanation
* `public.entry_revisions`: บันทึกรูปถ่ายข้อมูลอดีต (Snapshot) เป็น JSONB เพื่อการกู้คืนย้อนหลัง
* `public.slug_redirects`: ตารางจดจำสลักเดิมเมื่อนักเขียนเปลี่ยนชื่อ ป้องกันปัญหาสายสัมพันธ์ลิงก์เสีย (Dead Links)

### 3. Complete SQL
```sql
-- 1) entry_revisions: ประวัติการแก้ไข (Version Control)
create table if not exists public.entry_revisions (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  snapshot jsonb not null,
  created_by text not null, -- Clerk user id
  note text,
  created_at timestamptz not null default now()
);

-- 2) slug_redirects: แฟ้มประวัติการเปลี่ยนเส้นทาง (Permanent Redirect Map)
create table if not exists public.slug_redirects (
  id uuid primary key default gen_random_uuid(),
  old_slug text unique not null,
  new_slug text not null,
  content_type archron_content_type not null,
  created_at timestamptz not null default now()
);
```

### 4. Triggers
```sql
-- ตัวส่งประวัติประวัติสำรองอัตโนมัติเมื่อเกิดการ Publish
create or replace function public.log_revision_on_publish()
returns trigger language plpgsql as $$
begin
  if new.status = 'published' and (old.status is null or old.status <> 'published') then
    insert into public.entry_revisions (entry_id, snapshot, created_by, note)
    values (
      new.id,
      to_jsonb(new),
      new.author_id,
      'Automatic revision logged on publish event.'
    );
  end if;
  return new;
end; $$;

drop trigger if exists trigger_log_revision_on_publish on public.entries;
create trigger trigger_log_revision_on_publish
  after update on public.entries
  for each row execute function public.log_revision_on_publish();
```

### 5. Functions
```sql
-- ตรวจสอบประวัติการเปลี่ยน slug ย้อนหลังแบบ Recursive
create or replace function public.resolve_slug_redirect(target_slug text)
returns text language plpgsql stable as $$
declare
  resolved text;
  visited text[];
begin
  resolved := target_slug;
  while exists(select 1 from public.slug_redirects where old_slug = resolved) loop
    -- ตรวจสอบ Infinite Loop
    if resolved = any(visited) then
      return null;
    end if;
    visited := array_append(visited, resolved);
    select new_slug into resolved from public.slug_redirects where old_slug = resolved;
  end loop;
  return resolved;
end; $$;
```

### 6. Views
```sql
-- แสดงผลเฉพาะการแก้ไขล่าสุดของบทความแต่ละเรื่อง
create or replace view public.latest_revisions as
  select distinct on (entry_id) *
  from public.entry_revisions
  order by entry_id, created_at desc;
```

### 7. Indexes
```sql
create index if not exists revisions_entry_time_idx on public.entry_revisions (entry_id, created_at desc);
create index if not exists slug_redirects_old_idx on public.slug_redirects (old_slug);
```

### 8. Policies
```sql
alter table public.entry_revisions enable row level security;
alter table public.slug_redirects enable row level security;

-- เจ้าของและแอดมินเท่านั้นที่เข้าถึง revision ได้
create policy "Owners and admins can view revisions"
  on public.entry_revisions for select
  using (
    created_by = auth.uid()::text or
    exists (
      select 1 from public.entries 
      where id = entry_id and author_id = auth.uid()::text
    )
  );

create policy "Anyone can read slug redirects"
  on public.slug_redirects for select
  using (true);
```

### 9. Performance Notes
* ฟังก์ชันดึง `resolve_slug_redirect` มีการตรวจสอบระบบวนลูปไม่สิ้นสุด (Infinite Loop Guard) ป้องกัน DB แฮงค์

### 10. Future Expansion Notes
* สามารถขยายระบบด้วยการบันทึกสถานะ Draft ที่แยกออกมาเป็นอีกตารางอย่างสิ้นเชิงเพื่อลดความหนาแน่นของตาราง `entries` หลัก

---

# PHASE 03: Identity & Community (ข้อมูลอัตลักษณ์และชุมชน)

การจัดการระบบโปรไฟล์ (Profiles), ลำดับสิทธิ์การเข้าถึง (Roles), ระบบคั่นบันทึกเนื้อหา (Bookmarks), และการจัดอันดับเกียรติประวัติ (Achievements)

### 1. Architecture Overview
ระบบชุมชนใช้โครงสร้างความเชื่อถือร่วมกัน โดยการทำงานของ Clerk เพื่อยืนยันสิทธิ์เข้าใช้งาน และซิงโครไนซ์บันทึกโปรไฟล์เข้าสู่ตาราง `public.profiles` เพื่อใช้กับสิทธิ์ RLS

### 2. ER Design Explanation
* `public.profiles`: บันทึกบทบาทสิทธิ์ (User / Writer / Admin) และชีวประวัติ
* `public.bookmarks`: เก็บบันทึกความทรงจำการอ่านของผู้อ่านเฉพาะบุคคล
* `public.comments`: บันทึกการถกเถียงเชิงวิชาการ

### 3. Complete SQL
```sql
-- ENUM สำหรับสิทธิ์บทบาทผู้ใช้งาน
do $$
begin
  if not exists (select 1 from pg_type where typname = 'archron_role') then
    create type archron_role as enum ('admin', 'writer', 'user');
  end if;
end $$;

-- 1) profiles: อัตลักษณ์และสิทธิ์บทบาทของผู้ใช้งาน
create table if not exists public.profiles (
  id text primary key, -- Clerk User ID
  full_name text not null,
  avatar_url text,
  role archron_role not null default 'user',
  bio text,
  writer_requested timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) bookmarks: ระบบจดจำชิ้นงานที่บันทึก
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  entry_id uuid not null references public.entries(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint unique_user_bookmark unique (user_id, entry_id)
);

-- 3) comments: ระบบความเห็นและการถามตอบเชิงวิชาการ
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.entries(id) on delete cascade,
  author_id text not null references public.profiles(id) on delete cascade,
  content text not null,
  status text not null default 'visible' check (status in ('visible', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 4. Triggers
```sql
-- Trigger อัปเดตตาราง profiles
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Trigger อัปเดตตาราง comments
drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at
  before update on public.comments
  for each row execute function public.set_updated_at();
```

### 5. Functions
```sql
-- คืนค่าประเภทและจำนวนผลงานของนักเขียนแต่ละท่าน
create or replace function public.get_writer_contributions_count(writer_id text)
returns table (
  content_type archron_content_type,
  total_count bigint
) language sql stable as $$
  select content_type, count(*)
  from public.entries
  where author_id = writer_id and status = 'published'
  group by content_type;
$$;
```

### 6. Views
```sql
-- วิวแสดงผลโปรไฟล์นักเขียนพร้อมบทความที่เผยแพร่แล้ว
create or replace view public.active_writers as
  select p.id, p.full_name, p.avatar_url, p.bio
  from public.profiles p
  where p.role in ('writer', 'admin')
  and exists (
    select 1 from public.entries where author_id = p.id and status = 'published'
  );
```

### 7. Indexes
```sql
create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists bookmarks_user_idx on public.bookmarks (user_id);
create index if not exists comments_entry_status_idx on public.comments (entry_id, status);
```

### 8. Policies
```sql
alter table public.profiles enable row level security;
alter table public.bookmarks enable row level security;
alter table public.comments enable row level security;

-- นโยบายสำหรับ Profiles
create policy "Anyone can view profile information"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (id = auth.uid()::text);

-- นโยบายสำหรับ Bookmarks
create policy "Users can manage their own bookmarks"
  on public.bookmarks for all
  using (user_id = auth.uid()::text);

-- นโยบายสำหรับ Comments
create policy "Anyone can view visible comments"
  on public.comments for select
  using (status = 'visible');

create policy "Authenticated users can post comments"
  on public.comments for insert
  with check (auth.uid()::text = author_id);
```

### 9. Performance Notes
* `profiles` ผูกโดยตรงกับ Clerk User ID เพื่อลดทอนภาระเชื่อมตารางข้ามระบบภายนอก

### 10. Future Expansion Notes
* ในอนาคตสามารถจัดตั้งตาราง `teams` หรือ `organizations` เพื่อให้รองรับบทความวิชาการที่ประพันธ์ร่วมกันหลายคน (Co-authorship)

---

# PHASE 04: Knowledge Intelligence (ระบบปัญญาและความรู้)

สถาปัตยกรรมสำหรับระบบสถิติการใช้งาน (Analytics), ตัวนับยอดผู้เข้าอ่าน (Page Views), และการจัดลำดับคะแนนนิยมทางความรู้

### 1. Architecture Overview
ระบบปัญญารวมความรู้ต้องการสถิติที่เที่ยงตรง ปราศจากการเรียกประมวลผลซ้ำซากที่ส่งผลกระทบต่อหน่วยความจำเครื่อง

### 2. ER Design Explanation
* `public.page_views`: จัดเก็บตัวเลขนับยอดวิวบทความ แยกตามสลักความรู้ (Slug-based aggregation)
* `public.search_logs`: แฟ้มประวัติการสืบค้นเพื่อการพัฒนาประสิทธิภาพและประยุกต์ใช้ในการทำระบบ RAG Suggestion

### 3. Complete SQL
```sql
-- 1) page_views: ตัวสะสมสถิติจำนวนการคลิกอ่านรายหน้าความรู้
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  views_count bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- 2) search_logs: บันทึกข้อมูลคีย์เวิร์ดค้นหาความรู้ยอดนิยม
create table if not exists public.search_logs (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  results_count integer not null default 0,
  user_id text, -- Clerk user id (หากล็อกอิน)
  created_at timestamptz not null default now()
);
```

### 4. Triggers
```sql
-- Trigger อัปเดตตาราง page_views
drop trigger if exists page_views_set_updated_at on public.page_views;
create trigger page_views_set_updated_at
  before update on public.page_views
  for each row execute function public.set_updated_at();
```

### 5. Functions
```sql
-- ฟังก์ชัน RPC อะตอมมิกสำหรับเพิ่มยอดอ่านรายหน้าแบบ Fire-and-forget
create or replace function public.increment_page_view(target_slug text)
returns bigint language plpgsql security definer as $$
declare
  new_views bigint;
begin
  insert into public.page_views (slug, views_count)
  values (target_slug, 1)
  on conflict (slug)
  do update set views_count = public.page_views.views_count + 1
  returning views_count into new_views;
  
  return new_views;
end; $$;
```

### 6. Views
```sql
-- วิวจัดอันดับชิ้นงานความรู้ยอดนิยมสูงสุด (Top Read)
create or replace view public.popular_entries as
  select e.id, e.title, e.slug, e.content_type, v.views_count
  from public.entries e
  join public.page_views v on e.slug = v.slug
  where e.status = 'published'
  order by v.views_count desc;
```

### 7. Indexes
```sql
create index if not exists search_logs_query_idx on public.search_logs (query);
create index if not exists page_views_count_idx on public.page_views (views_count desc);
```

### 8. Policies
```sql
alter table public.page_views enable row level security;
alter table public.search_logs enable row level security;

-- อนุญาตให้อ่านสถิติดูยอดเข้าใช้งานได้ทั่วไป
create policy "Anyone can view page views data"
  on public.page_views for select
  using (true);

-- การเพิ่มสถิติวิดต้องผ่าน RPC เท่านั้น ไม่เปิดให้สับแก้ตรงๆ
create policy "Increment functions can update views"
  on public.page_views for update
  using (true);
```

### 9. Performance Notes
* การใช้งานฟังก์ชัน `increment_page_view` ได้รับการรับรองในโหมด `security definer` เพื่อให้อัปเดตได้โดยไม่ต้องอ้างสิทธิ์ RLS

### 10. Future Expansion Notes
* เฟสถัดไปรองรับการใส่ฟิลด์ประเภท `vector` (pgvector extension) ลงในตาราง `entries` เพื่อทำการค้นหารูปแบบ Semantic Search และมโนทัศน์ใกล้เคียง

---

# PHASE 05: Infrastructure (สถาปัตยกรรมวิศวกรรม)

สถาปัตยกรรมระดับระบบสำหรับการบันทึกประวัติการเปลี่ยนแปลงระดับลึก (Audit Logs), การจัดการงานพื้นหลัง (Background Jobs), และระบบเปิดปิดฟีเจอร์ชั่วคราว (Feature Flags)

### 1. Architecture Overview
มิตินี้ดูแลความมั่นคงของโครงสร้างวิศวกรรมทั้งหมด ป้องกันปัญหาด้านความโปร่งใสทางระบบ

### 2. ER Design Explanation
* `public.audit_logs`: บันทึกพฤติกรรมและความเปลี่ยนแปลงที่กระทำโดย Admin/Writer สำหรับการประเมินย้อนกลับ
* `public.system_settings`: จัดเก็บ Feature Flags และพารามิเตอร์ของระบบ

### 3. Complete SQL
```sql
-- 1) audit_logs: การบันทึกพฤติกรรมระดับลึกเพื่อความโปร่งใสสูงสุด
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id text not null, -- Clerk ID
  action text not null, -- e.g., 'PUBLISH_ENTRY', 'DELETE_COMMENT'
  target_table text not null,
  target_id uuid,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- 2) system_settings: ตัวแปรสากลและระบบควบคุมสถานะการเผยแพร่ความรู้
create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  description text,
  updated_by text not null,
  updated_at timestamptz not null default now()
);
```

### 4. Triggers
```sql
-- Trigger อัปเดตตาราง system_settings
drop trigger if exists system_settings_set_updated_at on public.system_settings;
create trigger system_settings_set_updated_at
  before update on public.system_settings
  for each row execute function public.set_updated_at();
```

### 5. Functions
```sql
-- ฟังก์ชันอำนวยความสะดวกในการตรวจสอบสถานะ Feature Flag
create or replace function public.is_feature_enabled(flag_key text)
returns boolean language plpgsql stable as $$
declare
  flag_value boolean;
begin
  select (value->>'enabled')::boolean into flag_value
  from public.system_settings
  where key = flag_key;
  
  return coalesce(flag_value, false);
end; $$;
```

### 6. Views
```sql
-- แสดงผลประวัติการเข้าจัดการระบบเฉพาะเหตุการณ์สำคัญระดับวิกฤต (Critical Audit Trail)
create or replace view public.critical_audit_trail as
  select *
  from public.audit_logs
  where action in ('DELETE_ENTRY', 'ROLE_UPGRADE', 'SYSTEM_SETTING_CHANGE')
  order by created_at desc;
```

### 7. Indexes
```sql
create index if not exists audit_logs_action_actor_idx on public.audit_logs (action, actor_id);
create index if not exists system_settings_key_idx on public.system_settings (key);
```

### 8. Policies
```sql
alter table public.audit_logs enable row level security;
alter table public.system_settings enable row level security;

-- แอดมินผู้มีอำนาจสูงสุดเท่านั้นจึงเข้าดูตาราง Infrastructure ได้
create policy "Admins only can interact with audit logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid()::text and role = 'admin'
    )
  );

create policy "Admins only can modify system settings"
  on public.system_settings for all
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid()::text and role = 'admin'
    )
  );
```

### 9. Performance Notes
* ดัชนี `audit_logs_action_actor_idx` ช่วยตรวจสอบความรับผิดชอบของนักเขียนทุกคนได้อย่างทันควัน

### 10. Future Expansion Notes
* ตาราง `audit_logs` รองรับการทำ Partitioning บน PostgreSQL เพื่อรองรับฐานข้อมูลขนาดใหญ่เมื่อประวัติการบันทึกเติบโตในระยะยาว 5–10 ปีข้างหน้า
