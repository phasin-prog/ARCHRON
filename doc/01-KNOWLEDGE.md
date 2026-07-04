# Phase 01 — Knowledge Core

> สถาปัตยกรรมระบบเนื้อหาหลักของ ARCHRON

---

## Architecture Overview

Knowledge Core คือแกนกลางของระบบ ออกแบบมาเพื่อรองรับ

- บทความ (Articles)
- แนวคิด (Concepts)
- นักปราชญ์ (Thinkers)
- สำนักคิด (Schools)
- หนังสือ (Books)
- ทฤษฎี (Theories)
- คอลเลกชัน (Collections)
- ความสัมพันธ์ระหว่างเนื้อหา (Knowledge Relations)
- Tags, Keywords, References
- Metadata, SEO

ทุก entry มี slug เป็น identifier หลัก, รองรับหลายภาษา, มี timeline เหตุการณ์

---

## ER Design

### Core Tables

```
entries (UUID PK, slug, type, title, ...)
├── entry_metadata (JSONB)
├── seo_metadata (JSONB)
├── entry_tags → tags
├── entry_keywords → keywords
├── entry_aliases → aliases
├── entry_references → references
├── entry_citations → citations
├── entry_relations → entries (self-ref)
├── entry_timeline_events → timeline_events
├── entry_collections → collections
└── entry_translations → translations
```

### Supporting Tables

```
tags (id, name, slug)
keywords (id, name, slug)
aliases (id, alias, language)
schools (id, name, slug, description)
thinkers (id, name, slug, school_id)
books (id, title, slug, author_id)
theories (id, name, slug, school_id)
collections (id, name, slug, type)
languages (id, code, name)
translations (id, entry_id, language_id, title, ...)
references (id, entry_id, type, title, url, ...)
citations (id, source_entry_id, target_entry_id, ...)
timeline_events (id, entry_id, event_date, title, ...)
knowledge_relations (id, source_id, target_id, relation_type)
```

---

## Complete SQL

```sql
-- ============================================================
-- Phase 01: Knowledge Core
-- ARCHRON PostgreSQL Schema
-- ============================================================

-- Enums
CREATE TYPE entry_type AS ENUM (
  'article', 'concept', 'thinker', 'school',
  'book', 'theory', 'collection'
);

CREATE TYPE relation_type AS ENUM (
  'related_to', 'part_of', 'influences', 'influenced_by',
  'contradicts', 'supports', 'extends', 'applies_to',
  'found_in', 'authored_by', 'member_of'
);

CREATE TYPE alias_language AS ENUM (
  'th', 'en', 'ja', 'zh', 'ko', 'de', 'fr', 'other'
);

CREATE TYPE reference_type AS ENUM (
  'primary_source', 'secondary_source', 'book',
  'journal', 'website', 'interview', 'lecture',
  'dataset', 'other'
);

CREATE TYPE collection_type AS ENUM (
  'series', 'pathway', 'curated', 'auto', 'temporal'
);

CREATE TYPE timeline_event_type AS ENUM (
  'birth', 'death', 'publication', 'founding',
  'discovery', 'milestone', 'other'
);

-- ============================================================
-- Core Tables
-- ============================================================

-- Entries: central content table
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  type entry_type NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  body TEXT,
  language TEXT NOT NULL DEFAULT 'th',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'private')),
  author_id UUID,
  featured_image_url TEXT,
  reading_time_minutes INT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  version INT NOT NULL DEFAULT 1
);

COMMENT ON TABLE entries IS 'ตารางหลักเก็บเนื้อหาทุกประเภทของ ARCHRON';

-- Entry metadata (flexible key-value)
CREATE TABLE entry_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT 'null',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entry_id, key)
);

COMMENT ON TABLE entry_metadata IS 'Metadata แบบ flexible สำหรับ entries (JSONB key-value)';

-- SEO metadata
CREATE TABLE seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  meta_title TEXT,
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  no_index BOOLEAN DEFAULT FALSE,
  json_ld JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entry_id)
);

COMMENT ON TABLE seo_metadata IS 'SEO metadata สำหรับ entries (Open Graph, JSON-LD, Canonical)';

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE tags IS 'Tags สำหรับจัดกลุ่ม entries';

CREATE TABLE entry_tags (
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (entry_id, tag_id)
);

-- Keywords
CREATE TABLE keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  language TEXT NOT NULL DEFAULT 'th',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE keywords IS 'Keywords สำหรับ search optimization';

CREATE TABLE entry_keywords (
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  keyword_id UUID NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (entry_id, keyword_id)
);

-- Aliases (alternative names)
CREATE TABLE aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  language alias_language NOT NULL DEFAULT 'th',
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entry_id, alias, language)
);

COMMENT ON TABLE aliases IS 'ชื่อทางเลือก/ชื่อสากลของ entries (หลายภาษา)';

-- ============================================================
-- Knowledge Graph Tables
-- ============================================================

-- Knowledge relations
CREATE TABLE knowledge_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  relation relation_type NOT NULL,
  weight NUMERIC(3,2) DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1),
  description TEXT,
  bidirectional BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_id, target_id, relation),
  CHECK (source_id != target_id)
);

COMMENT ON TABLE knowledge_relations IS 'ความสัมพันธ์ระหว่าง entries (Knowledge Graph edges)';

-- Schools
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  founded_year INT,
  origin_region TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE schools IS 'สำนักคิด/โรงเรียนทางปรัชญาและจิตวิทยา';

-- Thinkers
CREATE TABLE thinkers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES entries(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  birth_year INT,
  death_year INT,
  nationality TEXT,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  biography TEXT,
  portrait_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE thinkers IS 'นักปราชญ์/นักคิด';

-- Books
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES entries(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author_id UUID REFERENCES thinkers(id) ON DELETE SET NULL,
  publication_year INT,
  isbn TEXT,
  cover_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE books IS 'หนังสือ/ตำราที่เกี่ยวข้อง';

-- Theories
CREATE TABLE theories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES entries(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  summary TEXT,
  key_concepts TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE theories IS 'ทฤษฎี/แขนงความรู้';

-- ============================================================
-- Localization & Timeline
-- ============================================================

-- Languages
CREATE TABLE languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  native_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE languages IS 'ภาษาที่รองรับในระบบ';

-- Translations
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  body TEXT,
  is_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entry_id, language_id)
);

COMMENT ON TABLE translations IS 'การแปล entries หลายภาษา';

-- Timeline events
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  event_date DATE,
  event_year INT,
  event_type timeline_event_type NOT NULL DEFAULT 'other',
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE timeline_events IS 'เหตุการณ์ใน Timeline ของ entries';

-- ============================================================
-- References & Citations
-- ============================================================

-- External references
CREATE TABLE entry_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  reference_type reference_type NOT NULL DEFAULT 'other',
  title TEXT NOT NULL,
  author TEXT,
  url TEXT,
  isbn TEXT,
  doi TEXT,
  access_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE entry_references IS 'แหล่งอ้างอิงภายนอกของ entries';

-- Internal citations (cross-linking entries)
CREATE TABLE entry_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  target_entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  context TEXT,
  page_number INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_entry_id, target_entry_id)
);

COMMENT ON TABLE entry_citations IS 'การอ้างอิงภายในระหว่าง entries';

-- ============================================================
-- Collections
-- ============================================================

CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type collection_type NOT NULL DEFAULT 'curated',
  description TEXT,
  cover_url TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE collections IS 'คอลเลกชัน/เส้นทางการอ่าน (series, pathway, etc.)';

CREATE TABLE collection_entries (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection_id, entry_id)
);

-- ============================================================
-- Indexes
-- ============================================================

-- Entries
CREATE INDEX idx_entries_slug ON entries(slug);
CREATE INDEX idx_entries_type ON entries(type);
CREATE INDEX idx_entries_status ON entries(status);
CREATE INDEX idx_entries_language ON entries(language);
CREATE INDEX idx_entries_author ON entries(author_id);
CREATE INDEX idx_entries_published_at ON entries(published_at DESC);
CREATE INDEX idx_entries_created_at ON entries(created_at DESC);
CREATE INDEX idx_entries_type_status ON entries(type, status);
CREATE INDEX idx_entries_status_published ON entries(status, published_at DESC);

-- Full text search on entries
CREATE INDEX idx_entries_fts ON entries USING GIN (
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(subtitle, '') || ' ' || coalesce(description, ''))
);

-- Entry metadata
CREATE INDEX idx_entry_metadata_entry ON entry_metadata(entry_id);
CREATE INDEX idx_entry_metadata_key ON entry_metadata(key);
CREATE INDEX idx_entry_metadata_value ON entry_metadata USING GIN (value);

-- Tags
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_entry_tags_tag ON entry_tags(tag_id);

-- Keywords
CREATE INDEX idx_keywords_slug ON keywords(slug);
CREATE INDEX idx_keywords_name ON keywords(name);
CREATE INDEX idx_entry_keywords_keyword ON entry_keywords(keyword_id);

-- Aliases
CREATE INDEX idx_aliases_entry ON aliases(entry_id);
CREATE INDEX idx_aliases_alias ON aliases(alias);
CREATE INDEX idx_aliases_language ON aliases(language);

-- Knowledge relations
CREATE INDEX idx_kr_source ON knowledge_relations(source_id);
CREATE INDEX idx_kr_target ON knowledge_relations(target_id);
CREATE INDEX idx_kr_relation ON knowledge_relations(relation);
CREATE INDEX idx_kr_source_relation ON knowledge_relations(source_id, relation);
CREATE INDEX idx_kr_target_relation ON knowledge_relations(target_id, relation);

-- Schools
CREATE INDEX idx_schools_slug ON schools(slug);

-- Thinkers
CREATE INDEX idx_thinkers_slug ON thinkers(slug);
CREATE INDEX idx_thinkers_school ON thinkers(school_id);
CREATE INDEX idx_thinkers_entry ON thinkers(entry_id);

-- Books
CREATE INDEX idx_books_slug ON books(slug);
CREATE INDEX idx_books_author ON books(author_id);

-- Theories
CREATE INDEX idx_theories_slug ON theories(slug);
CREATE INDEX idx_theories_school ON theories(school_id);

-- Languages
CREATE INDEX idx_languages_code ON languages(code);

-- Translations
CREATE INDEX idx_translations_entry ON translations(entry_id);
CREATE INDEX idx_translations_language ON translations(language_id);

-- Timeline events
CREATE INDEX idx_timeline_entry ON timeline_events(entry_id);
CREATE INDEX idx_timeline_date ON timeline_events(event_date);
CREATE INDEX idx_timeline_year ON timeline_events(event_year);

-- References
CREATE INDEX idx_references_entry ON entry_references(entry_id);
CREATE INDEX idx_references_type ON entry_references(reference_type);

-- Citations
CREATE INDEX idx_citations_source ON entry_citations(source_entry_id);
CREATE INDEX idx_citations_target ON entry_citations(target_entry_id);

-- Collections
CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_collections_type ON collections(type);
CREATE INDEX idx_collection_entries_entry ON collection_entries(entry_id);

-- ============================================================
-- Triggers
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_entries_updated_at
  BEFORE UPDATE ON entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_entry_metadata_updated_at
  BEFORE UPDATE ON entry_metadata
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_tags_updated_at
  BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_keywords_updated_at
  BEFORE UPDATE ON keywords
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_aliases_updated_at
  BEFORE UPDATE ON aliases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_knowledge_relations_updated_at
  BEFORE UPDATE ON knowledge_relations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_thinkers_updated_at
  BEFORE UPDATE ON thinkers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_theories_updated_at
  BEFORE UPDATE ON theories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_timeline_events_updated_at
  BEFORE UPDATE ON timeline_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_references_updated_at
  BEFORE UPDATE ON entry_references
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Functions
-- ============================================================

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(
    REGEXP_REPLACE(TRIM(title), '[^a-zA-Z0-9ก-๙\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Get entry by slug (common query)
CREATE OR REPLACE FUNCTION get_entry_by_slug(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  type entry_type,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  body TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT e.id, e.slug, e.type, e.title, e.subtitle, e.description, e.body, e.status, e.created_at, e.updated_at
  FROM entries e
  WHERE e.slug = p_slug AND e.status = 'published';
END;
$$ LANGUAGE plpgsql STABLE;

-- Search entries by keyword
CREATE OR REPLACE FUNCTION search_entries(
  p_query TEXT,
  p_type entry_type DEFAULT NULL,
  p_limit INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  type entry_type,
  title TEXT,
  description TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id, e.slug, e.type, e.title, e.description,
    ts_rank(
      to_tsvector('simple', coalesce(e.title, '') || ' ' || coalesce(e.description, '')),
      plainto_tsquery('simple', p_query)
    ) AS rank
  FROM entries e
  WHERE e.status = 'published'
    AND (p_type IS NULL OR e.type = p_type)
    AND to_tsvector('simple', coalesce(e.title, '') || ' ' || coalesce(e.description, ''))
        @@ plainto_tsquery('simple', p_query)
  ORDER BY rank DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get related entries
CREATE OR REPLACE FUNCTION get_related_entries(
  p_entry_id UUID,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  type entry_type,
  title TEXT,
  relation relation_type,
  weight NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id, e.slug, e.type, e.title,
    kr.relation, kr.weight
  FROM knowledge_relations kr
  JOIN entries e ON e.id = kr.target_id
  WHERE kr.source_id = p_entry_id
    AND e.status = 'published'
  ORDER BY kr.weight DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get backlinks (entries that link to this one)
CREATE OR REPLACE FUNCTION get_backlinks(
  p_entry_id UUID,
  p_limit INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  type entry_type,
  title TEXT,
  relation relation_type
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id, e.slug, e.type, e.title,
    kr.relation
  FROM knowledge_relations kr
  JOIN entries e ON e.id = kr.source_id
  WHERE kr.target_id = p_entry_id
    AND e.status = 'published'
  ORDER BY e.title
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- Views
-- ============================================================

-- Published entries with metadata
CREATE VIEW v_published_entries AS
SELECT
  e.*,
  (SELECT COUNT(*) FROM knowledge_relations kr WHERE kr.source_id = e.id) AS outgoing_relations,
  (SELECT COUNT(*) FROM knowledge_relations kr WHERE kr.target_id = e.id) AS incoming_relations,
  (SELECT COUNT(*) FROM entry_tags et WHERE et.entry_id = e.id) AS tag_count,
  (SELECT COUNT(*) FROM entry_keywords ek WHERE ek.entry_id = e.id) AS keyword_count
FROM entries e
WHERE e.status = 'published';

-- Entry statistics by type
CREATE VIEW v_entry_stats AS
SELECT
  type,
  status,
  COUNT(*) AS count,
  AVG(reading_time_minutes) AS avg_reading_time,
  MIN(created_at) AS earliest,
  MAX(created_at) AS latest
FROM entries
GROUP BY type, status;

-- Knowledge graph summary
CREATE VIEW v_knowledge_graph AS
SELECT
  kr.relation,
  COUNT(*) AS edge_count,
  AVG(kr.weight) AS avg_weight,
  COUNT(DISTINCT kr.source_id) AS unique_sources,
  COUNT(DISTINCT kr.target_id) AS unique_targets
FROM knowledge_relations kr
GROUP BY kr.relation;

-- ============================================================
-- RLS Policies
-- ============================================================

-- Enable RLS
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE thinkers ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE theories ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_keywords ENABLE ROW LEVEL SECURITY;

-- Public read for published content
CREATE POLICY "Public read published entries"
  ON entries FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public read published entries metadata"
  ON entry_metadata FOR SELECT
  USING (
    entry_id IN (SELECT id FROM entries WHERE status = 'published')
  );

CREATE POLICY "Public read seo metadata"
  ON seo_metadata FOR SELECT
  USING (
    entry_id IN (SELECT id FROM entries WHERE status = 'published')
  );

CREATE POLICY "Public read tags"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Public read keywords"
  ON keywords FOR SELECT
  USING (true);

CREATE POLICY "Public read aliases"
  ON aliases FOR SELECT
  USING (true);

CREATE POLICY "Public read knowledge relations"
  ON knowledge_relations FOR SELECT
  USING (true);

CREATE POLICY "Public read schools"
  ON schools FOR SELECT
  USING (true);

CREATE POLICY "Public read thinkers"
  ON thinkers FOR SELECT
  USING (true);

CREATE POLICY "Public read books"
  ON books FOR SELECT
  USING (true);

CREATE POLICY "Public read theories"
  ON theories FOR SELECT
  USING (true);

CREATE POLICY "Public read languages"
  ON languages FOR SELECT
  USING (true);

CREATE POLICY "Public read translations"
  ON translations FOR SELECT
  USING (true);

CREATE POLICY "Public read timeline events"
  ON timeline_events FOR SELECT
  USING (true);

CREATE POLICY "Public read references"
  ON entry_references FOR SELECT
  USING (true);

CREATE POLICY "Public read citations"
  ON entry_citations FOR SELECT
  USING (true);

CREATE POLICY "Public read published collections"
  ON collections FOR SELECT
  USING (is_published = true);

CREATE POLICY "Public read published collection entries"
  ON collection_entries FOR SELECT
  USING (
    collection_id IN (SELECT id FROM collections WHERE is_published = true)
  );

CREATE POLICY "Public read entry tags"
  ON entry_tags FOR SELECT
  USING (true);

CREATE POLICY "Public read entry keywords"
  ON entry_keywords FOR SELECT
  USING (true);

-- ============================================================
-- Performance Notes
-- ============================================================

1. **FTS Index**: ใช้ `to_tsvector('simple', ...)` สำหรับรองรับภาษาไทย (ไม่ใช้ `'english'` ที่จะ stem เป็นภาษาอังกฤษ)

2. **Composite Indexes**: `type + status` และ `status + published_at` cover query ที่ใช้บ่อยที่สุด

3. **JSONB GIN Index**: บน `entry_metadata.value` สำหรับค้นหาแบบ flexible

4. **knowledge_relations**: Index บน `source_id + relation` และ `target_id + relation` สำหรับ graph traversal

5. **Views**: `v_published_entries` ใช้ computed columns แทน subquery ใน application layer

---

## Example Queries

```sql
-- ค้นหาบทความทั้งหมดที่มีคำว่า "Jung" ในชื่อ
SELECT * FROM search_entries('Jung', 'article');

-- ดู entries ที่เกี่ยวข้องกับ entry หนึ่ง
SELECT * FROM get_related_entries('uuid-of-entry');

-- ดู backlinks ของ entry
SELECT * FROM get_backlinks('uuid-of-entry');

-- ดูสถิติ entries ตาม type
SELECT * FROM v_entry_stats;

-- ดู knowledge graph summary
SELECT * FROM v_knowledge_graph;

-- ค้นหา entry ตาม slug
SELECT * FROM get_entry_by_slug('jungian-archetypes');

-- ดู tags ของ entry หนึ่ง
SELECT t.name, t.slug
FROM tags t
JOIN entry_tags et ON et.tag_id = t.id
WHERE et.entry_id = 'uuid-of-entry';

-- ดู aliases ของ entry
SELECT alias, language
FROM aliases
WHERE entry_id = 'uuid-of-entry';

-- ดู timeline events ของ entry
SELECT event_date, event_type, title
FROM timeline_events
WHERE entry_id = 'uuid-of-entry'
ORDER BY event_date;
```

---

## Future Expansion

- **Versioning**: Phase 02 จะเพิ่ม draft/revision system
- **Full multilingual FTS**: เพิ่ม dictionary ภาษาไทยแบบ custom
- **Graph algorithms**: Phase 04 จะเพิ่ม PageRank, centrality
- **Soft deletes**: เพิ่ม `deleted_at` column เมื่อมี trash system
- **Entry inheritance**: ใช้ PostgreSQL table partitioning สำหรับ type-specific columns
