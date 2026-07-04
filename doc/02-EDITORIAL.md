# Phase 02 — Editorial Studio

> สถาปัตยกรรมระบบ Editorial Platform

---

## Architecture Overview

Editorial Studio คือชั้นสำหรับ

- Drafts & Versions
- Revision History
- Publishing Workflow
- AI Integration (embeddings, prompts, jobs)
- Comments & Review
- Media Management
- Slug History & Redirects
- Editorial Status & Publishing Queue

ทุก draft เป็น working copy, published version คือ immutable snapshot

---

## ER Design

```
drafts (UUID PK, entry_id, author_id, ...)
├── draft_revisions (UUID PK, draft_id, version, ...)
├── draft_media → media_assets
├── draft_comments → profiles (author)
├── ai_jobs → drafts
├── ai_embeddings → entries
├── ai_prompts → prompt_library
└── editorial_checklists → drafts

entries (from Phase 01)
├── entry_slug_history → entries
├── entry_redirects → entries
├── editorial_status → profiles (editor)
└── publish_queue → entries
```

---

## Complete SQL

```sql
-- ============================================================
-- Phase 02: Editorial Studio
-- ARCHRON PostgreSQL Schema
-- ============================================================

-- Enums
CREATE TYPE editorial_status AS ENUM (
  'draft', 'in_review', 'reviewed', 'approved',
  'revision_requested', 'scheduled', 'published',
  'archived', 'private'
);

CREATE TYPE ai_job_status AS ENUM (
  'pending', 'processing', 'completed', 'failed', 'cancelled'
);

CREATE TYPE ai_job_type AS ENUM (
  'embedding', 'summarization', 'tag_suggestion',
  'readability_check', 'translation', 'image_generation',
  'content_analysis', 'seo_optimization', 'other'
);

CREATE TYPE media_type AS ENUM (
  'image', 'video', 'audio', 'document', 'embed', 'other'
);

CREATE TYPE comment_status AS ENUM (
  'active', 'resolved', 'deleted'
);

CREATE TYPE revision_change_type AS ENUM (
  'create', 'update', 'publish', 'archive',
  'restore', 'delete', 'rename', 'status_change'
);

-- ============================================================
-- Drafts & Versions
-- ============================================================

-- Drafts: working copies of entries
CREATE TABLE drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES entries(id) ON DELETE SET NULL,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  type entry_type NOT NULL,
  subtitle TEXT,
  description TEXT,
  body TEXT,
  language TEXT NOT NULL DEFAULT 'th',
  editorial editorial_status NOT NULL DEFAULT 'draft',
  featured_image_url TEXT,
  reading_time_minutes INT,
  metadata JSONB DEFAULT '{}',
  seo JSONB DEFAULT '{}',
  is_dirty BOOLEAN DEFAULT TRUE,
  last_saved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE drafts IS 'Working copies ของ entries ก่อน publish';

-- Draft revisions: version history of drafts
CREATE TABLE draft_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
  version INT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  body TEXT,
  subtitle TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  change_type revision_change_type NOT NULL DEFAULT 'update',
  change_summary TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(draft_id, version)
);

COMMENT ON TABLE draft_revisions IS 'ประวัติเวอร์ชันของ drafts';

-- ============================================================
-- Editorial Workflow
-- ============================================================

-- Editorial checklists
CREATE TABLE editorial_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_by UUID,
  completed_at TIMESTAMPTZ,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE editorial_checklists IS 'Checklist items สำหรับ editorial workflow';

-- Comments & Reviews
CREATE TABLE draft_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  status comment_status NOT NULL DEFAULT 'active',
  parent_comment_id UUID REFERENCES draft_comments(id) ON DELETE CASCADE,
  position_text TEXT,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE draft_comments IS 'ความคิดเห็น/รีวิวใน drafting process';

-- Publishing queue
CREATE TABLE publish_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
  entry_id UUID REFERENCES entries(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  published_by UUID,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'published', 'failed', 'cancelled')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE publish_queue IS 'คิวการ publish entries';

-- ============================================================
-- Slug History & Redirects
-- ============================================================

-- Slug history
CREATE TABLE entry_slug_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  old_slug TEXT NOT NULL,
  new_slug TEXT NOT NULL,
  changed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE entry_slug_history IS 'ประวัติการเปลี่ยน slug';

-- Redirects
CREATE TABLE entry_redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_slug TEXT NOT NULL UNIQUE,
  to_entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  redirect_type TEXT NOT NULL DEFAULT '301' CHECK (redirect_type IN ('301', '302')),
  is_active BOOLEAN DEFAULT TRUE,
  hit_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE entry_redirects IS 'URL redirects เมื่อ slug เปลี่ยน';

-- ============================================================
-- Media & Assets
-- ============================================================

CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  media_type media_type NOT NULL DEFAULT 'image',
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  width INT,
  height INT,
  duration_seconds NUMERIC,
  uploaded_by UUID,
  is_public BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE media_assets IS 'ไฟล์ media ทั้งหมดในระบบ';

CREATE TABLE draft_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID NOT NULL REFERENCES drafts(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(draft_id, media_id)
);

COMMENT ON TABLE draft_media IS 'Media attachments ของ drafts';

-- ============================================================
-- AI Integration
-- ============================================================

-- AI jobs queue
CREATE TABLE ai_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES drafts(id) ON DELETE SET NULL,
  entry_id UUID REFERENCES entries(id) ON DELETE SET NULL,
  job_type ai_job_type NOT NULL,
  status ai_job_status NOT NULL DEFAULT 'pending',
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  error_message TEXT,
  model TEXT,
  tokens_used INT,
  cost_usd NUMERIC(10,6),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE ai_jobs IS 'คิวงาน AI (embedding, summarization, etc.)';

-- AI embeddings
CREATE TABLE ai_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  dimensions INT NOT NULL,
  embedding VECTOR(1536),
  text_chunk TEXT,
  chunk_index INT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE ai_embeddings IS 'Vector embeddings สำหรับ semantic search';

-- Prompt library
CREATE TABLE ai_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  template TEXT NOT NULL,
  model TEXT DEFAULT 'gpt-4',
  temperature NUMERIC(3,2) DEFAULT 0.7,
  max_tokens INT DEFAULT 2000,
  system_prompt TEXT,
  tags TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE ai_prompts IS 'Prompt templates สำหรับ AI operations';

-- AI prompt usage log
CREATE TABLE ai_prompt_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES ai_prompts(id) ON DELETE CASCADE,
  job_id UUID REFERENCES ai_jobs(id) ON DELETE SET NULL,
  input_variables JSONB DEFAULT '{}',
  output TEXT,
  tokens_used INT,
  model TEXT,
  latency_ms INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE ai_prompt_usage IS 'ประวัติการใช้ prompts';

-- ============================================================
-- Indexes
-- ============================================================

-- Drafts
CREATE INDEX idx_drafts_entry ON drafts(entry_id);
CREATE INDEX idx_drafts_author ON drafts(author_id);
CREATE INDEX idx_drafts_slug ON drafts(slug);
CREATE INDEX idx_drafts_editorial ON drafts(editorial);
CREATE INDEX idx_drafts_type ON drafts(type);
CREATE INDEX idx_drafts_created ON drafts(created_at DESC);
CREATE INDEX idx_drafts_updated ON drafts(updated_at DESC);
CREATE INDEX idx_drafts_author_status ON drafts(author_id, editorial);
CREATE INDEX idx_drafts_dirty ON drafts(is_dirty) WHERE is_dirty = true;

-- Draft revisions
CREATE INDEX idx_draft_revisions_draft ON draft_revisions(draft_id);
CREATE INDEX idx_draft_revisions_version ON draft_revisions(draft_id, version DESC);
CREATE INDEX idx_draft_revisions_created ON draft_revisions(created_at DESC);

-- Editorial checklists
CREATE INDEX idx_editorial_checklists_draft ON editorial_checklists(draft_id);
CREATE INDEX idx_editorial_checklists_incomplete ON editorial_checklists(draft_id, is_completed) WHERE is_completed = false;

-- Comments
CREATE INDEX idx_draft_comments_draft ON draft_comments(draft_id);
CREATE INDEX idx_draft_comments_author ON draft_comments(author_id);
CREATE INDEX idx_draft_comments_parent ON draft_comments(parent_comment_id);
CREATE INDEX idx_draft_comments_status ON draft_comments(status);
CREATE INDEX idx_draft_comments_active ON draft_comments(draft_id, status) WHERE status = 'active';

-- Publish queue
CREATE INDEX idx_publish_queue_draft ON publish_queue(draft_id);
CREATE INDEX idx_publish_queue_status ON publish_queue(status);
CREATE INDEX idx_publish_queue_scheduled ON publish_queue(scheduled_at) WHERE status = 'queued';
CREATE INDEX idx_publish_queue_processing ON publish_queue(status) WHERE status = 'processing';

-- Slug history
CREATE INDEX idx_slug_history_entry ON entry_slug_history(entry_id);
CREATE INDEX idx_slug_history_old_slug ON entry_slug_history(old_slug);

-- Redirects
CREATE INDEX idx_redirects_from_slug ON entry_redirects(from_slug);
CREATE INDEX idx_redirects_active ON entry_redirects(is_active) WHERE is_active = true;

-- Media
CREATE INDEX idx_media_type ON media_assets(media_type);
CREATE INDEX idx_media_uploaded_by ON media_assets(uploaded_by);
CREATE INDEX idx_media_public ON media_assets(is_public) WHERE is_public = true;
CREATE INDEX idx_media_mime ON media_assets(mime_type);
CREATE INDEX idx_draft_media_draft ON draft_media(draft_id);

-- AI jobs
CREATE INDEX idx_ai_jobs_draft ON ai_jobs(draft_id);
CREATE INDEX idx_ai_jobs_entry ON ai_jobs(entry_id);
CREATE INDEX idx_ai_jobs_type ON ai_jobs(job_type);
CREATE INDEX idx_ai_jobs_status ON ai_jobs(status);
CREATE INDEX idx_ai_jobs_pending ON ai_jobs(status, created_at) WHERE status = 'pending';
CREATE INDEX idx_ai_jobs_processing ON ai_jobs(status) WHERE status = 'processing';

-- AI embeddings
CREATE INDEX idx_ai_embeddings_entry ON ai_embeddings(entry_id);
CREATE INDEX idx_ai_embeddings_model ON ai_embeddings(model);
-- Vector similarity index (IVFFlat for < 1M rows, switch to HNSW later)
CREATE INDEX idx_ai_embeddings_vector ON ai_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- AI prompts
CREATE INDEX idx_ai_prompts_slug ON ai_prompts(slug);
CREATE INDEX idx_ai_prompts_active ON ai_prompts(is_active) WHERE is_active = true;
CREATE INDEX idx_ai_prompt_usage_prompt ON ai_prompt_usage(prompt_id);
CREATE INDEX idx_ai_prompt_usage_job ON ai_prompt_usage(job_id);

-- ============================================================
-- Triggers
-- ============================================================

CREATE TRIGGER trigger_drafts_updated_at
  BEFORE UPDATE ON drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_draft_comments_updated_at
  BEFORE UPDATE ON draft_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_publish_queue_updated_at
  BEFORE UPDATE ON publish_queue
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_entry_redirects_updated_at
  BEFORE UPDATE ON entry_redirects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_media_assets_updated_at
  BEFORE UPDATE ON media_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ai_jobs_updated_at
  BEFORE UPDATE ON ai_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ai_embeddings_updated_at
  BEFORE UPDATE ON ai_embeddings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_ai_prompts_updated_at
  BEFORE UPDATE ON ai_prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Functions
-- ============================================================

-- Create a new revision when draft is updated
CREATE OR REPLACE FUNCTION create_draft_revision()
RETURNS TRIGGER AS $$
DECLARE
  v_version INT;
BEGIN
  SELECT COALESCE(MAX(version), 0) + 1
  INTO v_version
  FROM draft_revisions
  WHERE draft_id = NEW.id;

  INSERT INTO draft_revisions (draft_id, version, title, slug, body, subtitle, description, metadata, change_type, created_by)
  VALUES (NEW.id, v_version, NEW.title, NEW.slug, NEW.body, NEW.subtitle, NEW.description, NEW.metadata, 'update', NEW.author_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_draft_revision
  AFTER UPDATE ON drafts
  FOR EACH ROW EXECUTE FUNCTION create_draft_revision();

-- Create initial revision on draft insert
CREATE OR REPLACE FUNCTION create_initial_draft_revision()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO draft_revisions (draft_id, version, title, slug, body, subtitle, description, metadata, change_type, created_by)
  VALUES (NEW.id, 1, NEW.title, NEW.slug, NEW.body, NEW.subtitle, NEW.description, NEW.metadata, 'create', NEW.author_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_initial_draft_revision
  AFTER INSERT ON drafts
  FOR EACH ROW EXECUTE FUNCTION create_initial_draft_revision();

-- Track slug changes
CREATE OR REPLACE FUNCTION track_slug_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.slug IS DISTINCT FROM NEW.slug THEN
    INSERT INTO entry_slug_history (entry_id, old_slug, new_slug, changed_by)
    VALUES (NEW.id, OLD.slug, NEW.slug, auth.uid());

    INSERT INTO entry_redirects (from_slug, to_entry_id)
    VALUES (OLD.slug, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_track_slug_change
  AFTER UPDATE OF slug ON entries
  FOR EACH ROW EXECUTE FUNCTION track_slug_change();

-- Publish draft to entry
CREATE OR REPLACE FUNCTION publish_draft_to_entry(p_draft_id UUID, p_published_by UUID)
RETURNS UUID AS $$
DECLARE
  v_entry_id UUID;
  v_draft drafts%ROWTYPE;
BEGIN
  SELECT * INTO v_draft FROM drafts WHERE id = p_draft_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Draft not found: %', p_draft_id;
  END IF;

  IF v_draft.entry_id IS NOT NULL THEN
    -- Update existing entry
    UPDATE entries SET
      title = v_draft.title,
      slug = v_draft.slug,
      subtitle = v_draft.subtitle,
      description = v_draft.description,
      body = v_draft.body,
      language = v_draft.language,
      type = v_draft.type,
      featured_image_url = v_draft.featured_image_url,
      reading_time_minutes = v_draft.reading_time_minutes,
      status = 'published',
      published_at = NOW(),
      version = version + 1,
      updated_at = NOW()
    WHERE id = v_draft.entry_id
    RETURNING id INTO v_entry_id;
  ELSE
    -- Create new entry
    INSERT INTO entries (slug, type, title, subtitle, description, body, language, author_id, featured_image_url, reading_time_minutes, status, published_at)
    VALUES (v_draft.slug, v_draft.type, v_draft.title, v_draft.subtitle, v_draft.description, v_draft.body, v_draft.language, v_draft.author_id, v_draft.featured_image_url, v_draft.reading_time_minutes, 'published', NOW())
    RETURNING id INTO v_entry_id;

    UPDATE drafts SET entry_id = v_entry_id WHERE id = p_draft_id;
  END IF;

  -- Update editorial status
  UPDATE drafts SET editorial = 'published', updated_at = NOW() WHERE id = p_draft_id;

  -- Log revision
  INSERT INTO draft_revisions (draft_id, version, title, slug, body, change_type, change_summary, created_by)
  SELECT id, COALESCE(MAX(version), 0) + 1, title, slug, body, 'publish', 'Published to entry', p_published_by
  FROM drafts WHERE id = p_draft_id
  GROUP BY id, title, slug, body;

  RETURN v_entry_id;
END;
$$ LANGUAGE plpgsql;

-- Get draft with full info
CREATE OR REPLACE FUNCTION get_draft_full(p_draft_id UUID)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  body TEXT,
  editorial editorial_status,
  version INT,
  author_id UUID,
  entry_id UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id, d.slug, d.title, d.subtitle, d.description, d.body,
    d.editorial, dr.version, d.author_id, d.entry_id,
    d.created_at, d.updated_at
  FROM drafts d
  LEFT JOIN draft_revisions dr ON dr.draft_id = d.id AND dr.version = (
    SELECT MAX(version) FROM draft_revisions WHERE draft_id = d.id
  )
  WHERE d.id = p_draft_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- Views
-- ============================================================

-- Active drafts
CREATE VIEW v_active_drafts AS
SELECT
  d.*,
  (SELECT MAX(version) FROM draft_revisions WHERE draft_id = d.id) AS current_version,
  (SELECT COUNT(*) FROM draft_comments WHERE draft_id = d.id AND status = 'active') AS comment_count,
  (SELECT COUNT(*) FROM editorial_checklists WHERE draft_id = d.id AND is_completed = false) AS remaining_checks
FROM drafts d
WHERE d.editorial NOT IN ('published', 'archived');

-- Publish queue view
CREATE VIEW v_publish_queue AS
SELECT
  pq.*,
  d.title AS draft_title,
  d.slug AS draft_slug,
  e.title AS entry_title
FROM publish_queue pq
JOIN drafts d ON d.id = pq.draft_id
LEFT JOIN entries e ON e.id = pq.entry_id
WHERE pq.status IN ('queued', 'processing');

-- AI job stats
CREATE VIEW v_ai_job_stats AS
SELECT
  job_type,
  status,
  COUNT(*) AS count,
  AVG(tokens_used) AS avg_tokens,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) AS avg_duration_seconds
FROM ai_jobs
GROUP BY job_type, status;

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE editorial_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE publish_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_slug_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE draft_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_prompt_usage ENABLE ROW LEVEL SECURITY;

-- Authors can manage their own drafts
CREATE POLICY "Authors manage own drafts"
  ON drafts FOR ALL
  USING (author_id = auth.uid());

-- Authors can view their own revisions
CREATE POLICY "Authors view own revisions"
  ON draft_revisions FOR SELECT
  USING (
    draft_id IN (SELECT id FROM drafts WHERE author_id = auth.uid())
  );

-- Authors can manage their own checklists
CREATE POLICY "Authors manage own checklists"
  ON editorial_checklists FOR ALL
  USING (
    draft_id IN (SELECT id FROM drafts WHERE author_id = auth.uid())
  );

-- Authors and editors can comment
CREATE POLICY "Authors and editors can comment"
  ON draft_comments FOR ALL
  USING (
    author_id = auth.uid()
    OR draft_id IN (SELECT id FROM drafts WHERE author_id = auth.uid())
  );

-- Admins can manage publish queue
CREATE POLICY "Admins manage publish queue"
  ON publish_queue FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Public read for redirects
CREATE POLICY "Public read redirects"
  ON entry_redirects FOR SELECT
  USING (is_active = true);

-- Public read for public media
CREATE POLICY "Public read public media"
  ON media_assets FOR SELECT
  USING (is_public = true);

-- Users can upload media
CREATE POLICY "Users can upload media"
  ON media_assets FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());

-- Users can manage their own media
CREATE POLICY "Users manage own media"
  ON media_assets FOR ALL
  USING (uploaded_by = auth.uid());

-- Authors manage own draft media
CREATE POLICY "Authors manage own draft media"
  ON draft_media FOR ALL
  USING (
    draft_id IN (SELECT id FROM drafts WHERE author_id = auth.uid())
  );

-- Admins manage AI jobs
CREATE POLICY "Admins manage AI jobs"
  ON ai_jobs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Public read embeddings (for search)
CREATE POLICY "Public read embeddings"
  ON ai_embeddings FOR SELECT
  USING (true);

-- Admins manage prompts
CREATE POLICY "Admins manage prompts"
  ON ai_prompts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================================
-- Performance Notes
-- ============================================================

1. **Draft revisions trigger**: สร้าง revision อัตโนมัติทุกครั้งที่ draft ถูก update — ไม่ต้อง application layer

2. **IVFFlat index**: สำหรับ vector search (< 1M rows) — เมื่อข้อมูลเยอะขึ้น เปลี่ยนเป็น HNSW

3. **Partial indexes**: `is_dirty = true` และ `is_completed = false` สำหรับ queries ที่มีเฉพาะ active items

4. **Publish function**: `publish_draft_to_entry` ทำ atomic publish — สร้าง/update entry + log revision ใน single transaction

5. **Slug history**: Auto-track slug changes + สร้าง redirect อัตโนมัติ

---

## Example Queries

```sql
-- ดู drafts ที่ยังไม่ได้ publish
SELECT * FROM v_active_drafts ORDER BY updated_at DESC;

-- ดู revision history ของ draft
SELECT version, title, change_type, change_summary, created_at
FROM draft_revisions
WHERE draft_id = 'uuid-of-draft'
ORDER BY version DESC;

-- ดู comments ของ draft
SELECT dc.content, dc.status, dc.created_at,
       au.email AS author_email
FROM draft_comments dc
JOIN auth.users au ON au.id = dc.author_id
WHERE dc.draft_id = 'uuid-of-draft'
  AND dc.status = 'active';

-- Publish a draft
SELECT publish_draft_to_entry('uuid-of-draft', 'uuid-of-user');

-- ดู media ที่ใช้ใน draft
SELECT ma.filename, ma.media_type, ma.url
FROM media_assets ma
JOIN draft_media dm ON dm.media_id = ma.id
WHERE dm.draft_id = 'uuid-of-draft'
ORDER BY dm.sort_order;

-- ดู AI jobs ที่ pending
SELECT * FROM ai_jobs WHERE status = 'pending' ORDER BY created_at;

-- ค้นหา entries ด้วย vector similarity
SELECT
  e.id, e.title, e.slug,
  ae.embedding <=> $1 AS distance
FROM ai_embeddings ae
JOIN entries e ON e.id = ae.entry_id
ORDER BY distance
LIMIT 10;

-- ดู redirects ที่ active
SELECT from_slug, to_entry_id, redirect_type, hit_count
FROM entry_redirects
WHERE is_active = true;
```

---

## Future Expansion

- **Real-time collaboration**: ใช้ Supabase Realtime สำหรับ多人 editing
- **AI auto-tagging**: ใช้ embeddings สำหรับ auto-suggest tags
- **Content scoring**: AI-powered readability + SEO scoring
- **Batch publishing**: Queue สำหรับ publish หลาย entries พร้อมกัน
- **Version diff**: Visual diff ระหว่าง revisions
