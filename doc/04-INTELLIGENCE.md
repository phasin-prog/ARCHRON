# Phase 04 — Knowledge Intelligence

> สถาปัตยกรรมระบบ AI-Powered Knowledge Discovery

---

## Architecture Overview

Knowledge Intelligence คือชั้นสำหรับ

- Search (full-text + semantic)
- Knowledge Graph (nodes + edges)
- Embeddings & Vector Similarity
- Recommendations
- Analytics & Events
- Feedback & Ranking

ใช้ pgvector สำหรับ vector operations, FTS สำหรับ text search

---

## ER Design

```
search_index (view from entries + embeddings)
├── search_logs → profiles
├── search_suggestions

knowledge_graph_nodes (entries + custom nodes)
knowledge_graph_edges (relations + weights)
├── graph_snapshots
├── graph_communities

ai_embeddings (from Phase 02)
├── embedding_clusters
├── similarity_matrix

recommendations → entries
├── recommendation_logs

analytics_events → profiles
├── content_analytics → entries
├── popular_content (view)
├── trending_entries (view)

feedback → entries
├── entry_rankings
├── ranking_logs
```

---

## Complete SQL

```sql
-- ============================================================
-- Phase 04: Knowledge Intelligence
-- ARCHRON PostgreSQL Schema
-- ============================================================

-- Enums
CREATE TYPE search_type AS ENUM (
  'fulltext', 'semantic', 'hybrid', 'filter'
);

CREATE TYPE event_type AS ENUM (
  'page_view', 'entry_read', 'search', 'bookmark',
  'share', 'download', 'click', 'scroll_depth',
  'reading_complete', 'backlink_follow', 'recommendation_click'
);

CREATE TYPE feedback_type AS ENUM (
  'helpful', 'not_helpful', 'outdated', 'inaccurate',
  'unclear', 'suggestion', 'report'
);

CREATE TYPE ranking_type AS ENUM (
  'relevance', 'popularity', 'recency', 'authority',
  'quality', 'engagement', 'composite'
);

CREATE TYPE node_type AS ENUM (
  'entry', 'concept', 'thinker', 'school',
  'book', 'theory', 'keyword', 'custom'
);

CREATE TYPE edge_type AS ENUM (
  'related_to', 'part_of', 'influences', 'influenced_by',
  'contradicts', 'supports', 'extends', 'applies_to',
  'found_in', 'authored_by', 'member_of', 'mentions',
  'cites', 'similar_to', 'prerequisite', 'follows'
);

-- ============================================================
-- Search
-- ============================================================

-- Search logs
CREATE TABLE search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  search_type search_type NOT NULL DEFAULT 'fulltext',
  filters JSONB DEFAULT '{}',
  result_count INT DEFAULT 0,
  clicked_entry_id UUID REFERENCES entries(id) ON DELETE SET NULL,
  clicked_position INT,
  session_id TEXT,
  latency_ms INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE search_logs IS 'ประวัติการค้นหาทั้งหมด';

-- Search suggestions (autocomplete)
CREATE TABLE search_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL UNIQUE,
  normalized_term TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  result_count INT DEFAULT 0,
  click_count INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE search_suggestions IS 'คำแนะนำสำหรับ search autocomplete';

-- Search index (materialized for performance)
CREATE MATERIALIZED VIEW mv_search_index AS
SELECT
  e.id,
  e.slug,
  e.type,
  e.title,
  e.subtitle,
  e.description,
  e.body,
  e.status,
  e.language,
  e.published_at,
  e.created_at,
  to_tsvector('simple', coalesce(e.title, '') || ' ' || coalesce(e.subtitle, '') || ' ' || coalesce(e.description, '') || ' ' || coalesce(e.body, '')) AS search_vector,
  array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) AS tags,
  array_agg(DISTINCT kw.name) FILTER (WHERE kw.name IS NOT NULL) AS keywords
FROM entries e
LEFT JOIN entry_tags et ON et.entry_id = e.id
LEFT JOIN tags t ON t.id = et.tag_id
LEFT JOIN entry_keywords ek ON ek.entry_id = e.id
LEFT JOIN keywords kw ON kw.id = ek.keyword_id
WHERE e.status = 'published'
GROUP BY e.id, e.slug, e.type, e.title, e.subtitle, e.description, e.body, e.status, e.language, e.published_at, e.created_at;

CREATE UNIQUE INDEX idx_mv_search_index_id ON mv_search_index(id);
CREATE INDEX idx_mv_search_index_fts ON mv_search_index USING GIN (search_vector);
CREATE INDEX idx_mv_search_index_type ON mv_search_index(type);
CREATE INDEX idx_mv_search_index_tags ON mv_search_index USING GIN (tags);
CREATE INDEX idx_mv_search_index_keywords ON mv_search_index USING GIN (keywords);

-- ============================================================
-- Knowledge Graph
-- ============================================================

-- Graph nodes (extended from entries + custom nodes)
CREATE TABLE knowledge_graph_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES entries(id) ON DELETE SET NULL,
  node_type node_type NOT NULL DEFAULT 'entry',
  label TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  embedding_id UUID REFERENCES ai_embeddings(id) ON DELETE SET NULL,
  x NUMERIC,
  y NUMERIC,
  is_cluster_center BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE knowledge_graph_nodes IS 'Nodes ของ Knowledge Graph';

-- Graph edges (extended from knowledge_relations)
CREATE TABLE knowledge_graph_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES knowledge_graph_nodes(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES knowledge_graph_nodes(id) ON DELETE CASCADE,
  edge_type edge_type NOT NULL DEFAULT 'related_to',
  weight NUMERIC(5,4) DEFAULT 1.0 CHECK (weight >= 0 AND weight <= 1),
  label TEXT,
  metadata JSONB DEFAULT '{}',
  is_bidirectional BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_id, target_id, edge_type),
  CHECK (source_id != target_id)
);

COMMENT ON TABLE knowledge_graph_edges IS 'Edges ของ Knowledge Graph';

-- Graph snapshots (for history)
CREATE TABLE graph_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  description TEXT,
  node_count INT DEFAULT 0,
  edge_count INT DEFAULT 0,
  snapshot_data JSONB NOT NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE graph_snapshots IS 'Snapshots ของ graph state';

-- Graph communities (detected clusters)
CREATE TABLE graph_communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  description TEXT,
  node_ids UUID[] NOT NULL DEFAULT '{}',
  community_score NUMERIC(5,4),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE graph_communities IS 'Communities/clusters ที่ตรวจพบใน graph';

-- ============================================================
-- Embeddings & Similarity
-- ============================================================

-- Embedding clusters
CREATE TABLE embedding_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_embedding_id UUID NOT NULL REFERENCES ai_embeddings(id) ON DELETE CASCADE,
  member_ids UUID[] NOT NULL DEFAULT '{}',
  cluster_size INT DEFAULT 0,
  avg_distance NUMERIC(5,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE embedding_clusters IS 'Clusters ของ embeddings ที่คล้ายกัน';

-- Similarity cache
CREATE TABLE similarity_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  target_entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  similarity_score NUMERIC(5,4) NOT NULL,
  method TEXT DEFAULT 'cosine',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(source_entry_id, target_entry_id),
  CHECK (source_entry_id != target_entry_id)
);

COMMENT ON TABLE similarity_cache IS 'Cache ของ similarity scores';

-- ============================================================
-- Recommendations
-- ============================================================

CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  score NUMERIC(5,4) NOT NULL,
  reason TEXT,
  algorithm TEXT NOT NULL DEFAULT 'collaborative',
  is_clicked BOOLEAN DEFAULT FALSE,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, entry_id, algorithm)
);

COMMENT ON TABLE recommendations IS 'Recommendations สำหรับ users';

-- Recommendation logs
CREATE TABLE recommendation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id UUID NOT NULL REFERENCES recommendations(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE recommendation_logs IS 'ประวัติ interactions กับ recommendations';

-- ============================================================
-- Analytics & Events
-- ============================================================

-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type event_type NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  entry_id UUID REFERENCES entries(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE analytics_events IS 'Analytics events ทั้งหมด';

-- Content analytics (aggregated)
CREATE TABLE content_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  view_count INT DEFAULT 0,
  unique_viewers INT DEFAULT 0,
  read_count INT DEFAULT 0,
  complete_read_count INT DEFAULT 0,
  avg_read_time_seconds INT DEFAULT 0,
  bookmark_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  search_impressions INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entry_id, date)
);

COMMENT ON TABLE content_analytics IS 'Daily aggregated analytics สำหรับ entries';

-- ============================================================
-- Feedback
-- ============================================================

CREATE TABLE entry_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  feedback_type feedback_type NOT NULL,
  comment TEXT,
  metadata JSONB DEFAULT '{}',
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, entry_id, feedback_type)
);

COMMENT ON TABLE entry_feedback IS 'User feedback สำหรับ entries';

-- ============================================================
-- Rankings
-- ============================================================

CREATE TABLE entry_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  ranking_type ranking_type NOT NULL,
  score NUMERIC(10,4) NOT NULL,
  rank_position INT,
  calculation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entry_id, ranking_type, calculation_date)
);

COMMENT ON TABLE entry_rankings IS 'Ranking scores สำหรับ entries';

-- Ranking logs
CREATE TABLE ranking_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ranking_type ranking_type NOT NULL,
  entries_ranked INT DEFAULT 0,
  calculation_time_ms INT,
  algorithm_version TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE ranking_logs IS 'ประวัติการคำนวณ rankings';

-- ============================================================
-- Indexes
-- ============================================================

-- Search logs
CREATE INDEX idx_search_logs_user ON search_logs(user_id);
CREATE INDEX idx_search_logs_query ON search_logs(query);
CREATE INDEX idx_search_logs_type ON search_logs(search_type);
CREATE INDEX idx_search_logs_created ON search_logs(created_at DESC);
CREATE INDEX idx_search_logs_session ON search_logs(session_id);

-- Search suggestions
CREATE INDEX idx_search_suggestions_term ON search_suggestions(normalized_term);
CREATE INDEX idx_search_suggestions_active ON search_suggestions(is_active) WHERE is_active = true;
CREATE INDEX idx_search_suggestions_clicks ON search_suggestions(click_count DESC);

-- Knowledge graph nodes
CREATE INDEX idx_kgn_entry ON knowledge_graph_nodes(entry_id);
CREATE INDEX idx_kgn_type ON knowledge_graph_nodes(node_type);
CREATE INDEX idx_kgn_label ON knowledge_graph_nodes USING GIN (to_tsvector('simple', label));
CREATE INDEX idx_kgn_cluster ON knowledge_graph_nodes(is_cluster_center) WHERE is_cluster_center = true;

-- Knowledge graph edges
CREATE INDEX idx_kge_source ON knowledge_graph_edges(source_id);
CREATE INDEX idx_kge_target ON knowledge_graph_edges(target_id);
CREATE INDEX idx_kge_type ON knowledge_graph_edges(edge_type);
CREATE INDEX idx_kge_weight ON knowledge_graph_edges(weight DESC);
CREATE INDEX idx_kge_source_type ON knowledge_graph_edges(source_id, edge_type);
CREATE INDEX idx_kge_target_type ON knowledge_graph_edges(target_id, edge_type);

-- Similarity cache
CREATE INDEX idx_similarity_source ON similarity_cache(source_entry_id);
CREATE INDEX idx_similarity_target ON similarity_cache(target_entry_id);
CREATE INDEX idx_similarity_score ON similarity_cache(similarity_score DESC);

-- Recommendations
CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_recommendations_entry ON recommendations(entry_id);
CREATE INDEX idx_recommendations_score ON recommendations(score DESC);
CREATE INDEX idx_recommendations_user_score ON recommendations(user_id, score DESC);
CREATE INDEX idx_recommendations_active ON recommendations(user_id, is_clicked) WHERE is_clicked = false;

-- Analytics events
CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_entity ON analytics_events(entity_type, entity_id);
CREATE INDEX idx_analytics_entry ON analytics_events(entry_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);

-- Content analytics
CREATE INDEX idx_content_analytics_entry ON content_analytics(entry_id);
CREATE INDEX idx_content_analytics_date ON content_analytics(date DESC);
CREATE INDEX idx_content_analytics_entry_date ON content_analytics(entry_id, date DESC);

-- Feedback
CREATE INDEX idx_feedback_user ON entry_feedback(user_id);
CREATE INDEX idx_feedback_entry ON entry_feedback(entry_id);
CREATE INDEX idx_feedback_type ON entry_feedback(feedback_type);
CREATE INDEX idx_feedback_unresolved ON entry_feedback(is_resolved) WHERE is_resolved = false;

-- Rankings
CREATE INDEX idx_rankings_entry ON entry_rankings(entry_id);
CREATE INDEX idx_rankings_type ON entry_rankings(ranking_type);
CREATE INDEX idx_rankings_date ON entry_rankings(calculation_date DESC);
CREATE INDEX idx_rankings_type_date ON entry_rankings(ranking_type, calculation_date DESC, score DESC);

-- ============================================================
-- Triggers
-- ============================================================

CREATE TRIGGER trigger_search_suggestions_updated_at
  BEFORE UPDATE ON search_suggestions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_knowledge_graph_nodes_updated_at
  BEFORE UPDATE ON knowledge_graph_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_knowledge_graph_edges_updated_at
  BEFORE UPDATE ON knowledge_graph_edges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_content_analytics_updated_at
  BEFORE UPDATE ON content_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update content analytics on event
CREATE OR REPLACE FUNCTION update_content_analytics()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.entry_id IS NOT NULL THEN
    INSERT INTO content_analytics (entry_id, date, view_count, unique_viewers, read_count)
    VALUES (
      NEW.entry_id,
      CURRENT_DATE,
      CASE WHEN NEW.event_type = 'page_view' THEN 1 ELSE 0 END,
      CASE WHEN NEW.event_type = 'page_view' AND NEW.user_id IS NOT NULL THEN 1 ELSE 0 END,
      CASE WHEN NEW.event_type IN ('entry_read', 'reading_complete') THEN 1 ELSE 0 END
    )
    ON CONFLICT (entry_id, date) DO UPDATE SET
      view_count = content_analytics.view_count + EXCLUDED.view_count,
      unique_viewers = content_analytics.unique_viewers + EXCLUDED.unique_viewers,
      read_count = content_analytics.read_count + EXCLUDED.read_count,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_content_analytics
  AFTER INSERT ON analytics_events
  FOR EACH ROW EXECUTE FUNCTION update_content_analytics();

-- ============================================================
-- Functions
-- ============================================================

-- Full-text search
CREATE OR REPLACE FUNCTION search_content(
  p_query TEXT,
  p_type entry_type DEFAULT NULL,
  p_tags TEXT[] DEFAULT NULL,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  type entry_type,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  rank REAL,
  tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    si.id, si.slug, si.type, si.title, si.subtitle, si.description,
    ts_rank(si.search_vector, plainto_tsquery('simple', p_query)) AS rank,
    si.tags
  FROM mv_search_index si
  WHERE si.search_vector @@ plainto_tsquery('simple', p_query)
    AND (p_type IS NULL OR si.type = p_type)
    AND (p_tags IS NULL OR si.tags && p_tags)
  ORDER BY rank DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Semantic search (vector similarity)
CREATE OR REPLACE FUNCTION search_semantic(
  p_embedding VECTOR(1536),
  p_entry_id UUID DEFAULT NULL,
  p_type entry_type DEFAULT NULL,
  p_limit INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  type entry_type,
  title TEXT,
  description TEXT,
  distance NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id, e.slug, e.type, e.title, e.description,
    (ae.embedding <=> p_embedding)::NUMERIC AS distance
  FROM ai_embeddings ae
  JOIN entries e ON e.id = ae.entry_id
  WHERE e.status = 'published'
    AND (p_entry_id IS NULL OR e.id != p_entry_id)
    AND (p_type IS NULL OR e.type = p_type)
  ORDER BY ae.embedding <=> p_embedding
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get similar entries
CREATE OR REPLACE FUNCTION get_similar_entries(
  p_entry_id UUID,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  type entry_type,
  title TEXT,
  similarity NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id, e.slug, e.type, e.title,
    sc.similarity_score AS similarity
  FROM similarity_cache sc
  JOIN entries e ON e.id = sc.target_entry_id
  WHERE sc.source_entry_id = p_entry_id
    AND e.status = 'published'
  ORDER BY sc.similarity_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get recommendations
CREATE OR REPLACE FUNCTION get_recommendations(
  p_user_id UUID,
  p_limit INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  type entry_type,
  title TEXT,
  description TEXT,
  score NUMERIC,
  reason TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id, e.slug, e.type, e.title, e.description,
    r.score, r.reason
  FROM recommendations r
  JOIN entries e ON e.id = r.entry_id
  WHERE r.user_id = p_user_id
    AND r.is_clicked = false
    AND (r.expires_at IS NULL OR r.expires_at > NOW())
    AND e.status = 'published'
  ORDER BY r.score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get trending entries
CREATE OR REPLACE FUNCTION get_trending_entries(
  p_days INT DEFAULT 7,
  p_limit INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  type entry_type,
  title TEXT,
  total_views INT,
  trending_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id, e.slug, e.type, e.title,
    SUM(ca.view_count)::INT AS total_views,
    (SUM(ca.view_count) * 0.7 + SUM(ca.read_count) * 0.3) / p_days AS trending_score
  FROM content_analytics ca
  JOIN entries e ON e.id = ca.entry_id
  WHERE ca.date >= CURRENT_DATE - (p_days || ' days')::INTERVAL
    AND e.status = 'published'
  GROUP BY e.id, e.slug, e.type, e.title
  ORDER BY trending_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Calculate entry ranking
CREATE OR REPLACE FUNCTION calculate_entry_ranking(
  p_entry_id UUID,
  p_ranking_type ranking_type DEFAULT 'composite'
)
RETURNS NUMERIC AS $$
DECLARE
  v_score NUMERIC := 0;
  v_analytics RECORD;
  v_feedback RECORD;
BEGIN
  -- Get analytics for last 30 days
  SELECT
    COALESCE(SUM(view_count), 0) AS views,
    COALESCE(SUM(read_count), 0) AS reads,
    COALESCE(SUM(bookmark_count), 0) AS bookmarks,
    COALESCE(SUM(share_count), 0) AS shares
  INTO v_analytics
  FROM content_analytics
  WHERE entry_id = p_entry_id
    AND date >= CURRENT_DATE - INTERVAL '30 days';

  -- Get feedback
  SELECT
    COUNT(*) FILTER (WHERE feedback_type = 'helpful') AS helpful,
    COUNT(*) FILTER (WHERE feedback_type = 'not_helpful') AS not_helpful
  INTO v_feedback
  FROM entry_feedback
  WHERE entry_id = p_entry_id;

  -- Calculate composite score
  v_score :=
    (v_analytics.views * 0.1) +
    (v_analytics.reads * 0.3) +
    (v_analytics.bookmarks * 0.5) +
    (v_analytics.shares * 0.7) +
    (v_feedback.helpful * 2.0) -
    (v_feedback.not_helpful * 1.0);

  -- Store ranking
  INSERT INTO entry_rankings (entry_id, ranking_type, score)
  VALUES (p_entry_id, p_ranking_type, v_score)
  ON CONFLICT (entry_id, ranking_type, calculation_date) DO UPDATE SET
    score = v_score,
    updated_at = NOW();

  RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- Refresh search index
CREATE OR REPLACE FUNCTION refresh_search_index()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_search_index;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Views
-- ============================================================

-- Popular entries (last 7 days)
CREATE VIEW v_popular_entries AS
SELECT
  e.id, e.slug, e.type, e.title, e.description,
  COALESCE(SUM(ca.view_count), 0) AS views_7d,
  COALESCE(SUM(ca.read_count), 0) AS reads_7d,
  COALESCE(SUM(ca.bookmark_count), 0) AS bookmarks_7d
FROM entries e
LEFT JOIN content_analytics ca ON ca.entry_id = e.id AND ca.date >= CURRENT_DATE - INTERVAL '7 days'
WHERE e.status = 'published'
GROUP BY e.id, e.slug, e.type, e.title, e.description
ORDER BY views_7d DESC;

-- Trending entries
CREATE VIEW v_trending_entries AS
SELECT
  e.id, e.slug, e.type, e.title,
  SUM(ca.view_count) AS total_views,
  (SUM(ca.view_count) * 0.7 + SUM(ca.read_count) * 0.3) / 7.0 AS trending_score
FROM content_analytics ca
JOIN entries e ON e.id = ca.entry_id
WHERE ca.date >= CURRENT_DATE - INTERVAL '7 days'
  AND e.status = 'published'
GROUP BY e.id, e.slug, e.type, e.title
ORDER BY trending_score DESC;

-- Search analytics
CREATE VIEW v_search_analytics AS
SELECT
  query,
  COUNT(*) AS search_count,
  AVG(result_count) AS avg_results,
  AVG(latency_ms) AS avg_latency,
  COUNT(DISTINCT user_id) AS unique_users
FROM search_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY query
ORDER BY search_count DESC;

-- Content performance
CREATE VIEW v_content_performance AS
SELECT
  e.id, e.slug, e.type, e.title,
  SUM(ca.view_count) AS total_views,
  SUM(ca.read_count) AS total_reads,
  AVG(ca.avg_read_time_seconds) AS avg_read_time,
  SUM(ca.bookmark_count) AS total_bookmarks,
  COUNT(DISTINCT ef.id) FILTER (WHERE ef.feedback_type = 'helpful') AS helpful_count,
  COUNT(DISTINCT ef.id) FILTER (WHERE ef.feedback_type = 'not_helpful') AS not_helpful_count
FROM entries e
LEFT JOIN content_analytics ca ON ca.entry_id = e.id
LEFT JOIN entry_feedback ef ON ef.entry_id = e.id
WHERE e.status = 'published'
GROUP BY e.id, e.slug, e.type, e.title;

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_graph_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE graph_communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE embedding_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE similarity_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_logs ENABLE ROW LEVEL SECURITY;

-- Search logs
CREATE POLICY "Users view own search logs"
  ON search_logs FOR SELECT
  USING (user_id = auth.uid());

-- Search suggestions
CREATE POLICY "Public read suggestions"
  ON search_suggestions FOR SELECT
  USING (is_active = true);

-- Knowledge graph
CREATE POLICY "Public read graph nodes"
  ON knowledge_graph_nodes FOR SELECT
  USING (true);

CREATE POLICY "Public read graph edges"
  ON knowledge_graph_edges FOR SELECT
  USING (true);

CREATE POLICY "Admins manage graph"
  ON knowledge_graph_nodes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins manage graph edges"
  ON knowledge_graph_edges FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Graph snapshots
CREATE POLICY "Public read snapshots"
  ON graph_snapshots FOR SELECT
  USING (true);

-- Graph communities
CREATE POLICY "Public read communities"
  ON graph_communities FOR SELECT
  USING (true);

-- Similarity cache
CREATE POLICY "Public read similarity"
  ON similarity_cache FOR SELECT
  USING (true);

-- Recommendations
CREATE POLICY "Users view own recommendations"
  ON recommendations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users update own recommendations"
  ON recommendations FOR UPDATE
  USING (user_id = auth.uid());

-- Recommendation logs
CREATE POLICY "Users manage own recommendation logs"
  ON recommendation_logs FOR ALL
  USING (
    recommendation_id IN (
      SELECT id FROM recommendations WHERE user_id = auth.uid()
    )
  );

-- Analytics events
CREATE POLICY "Users view own analytics"
  ON analytics_events FOR SELECT
  USING (user_id = auth.uid());

-- Content analytics
CREATE POLICY "Public read content analytics"
  ON content_analytics FOR SELECT
  USING (true);

-- Feedback
CREATE POLICY "Users manage own feedback"
  ON entry_feedback FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Public read feedback"
  ON entry_feedback FOR SELECT
  USING (true);

-- Rankings
CREATE POLICY "Public read rankings"
  ON entry_rankings FOR SELECT
  USING (true);

CREATE POLICY "Admins manage rankings"
  ON entry_rankings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Ranking logs
CREATE POLICY "Admins manage ranking logs"
  ON ranking_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- Performance Notes
-- ============================================================

1. **Materialized View**: `mv_search_index` pre-computes search vectors — refresh ด้วย pg_cron ทุก 5 นาที

2. **pgvector index**: ใช้ IVFFlat (< 1M rows) — เมื่อข้อมูลเยอะ เปลี่ยนเป็น HNSW

3. **Similarity cache**: Cache similarity scores เพื่อหลีกเลี่ยง computation ซ้ำ

4. **Content analytics**: Daily aggregation ลด cardinality — ไม่ต้อง query raw events

5. **Composite ranking**: `calculate_entry_ranking` คำนวณ score จาก analytics + feedback

---

## Example Queries

```sql
-- Full-text search
SELECT * FROM search_content('Jungian archetypes', 'article');

-- Semantic search
SELECT * FROM search_semantic($1::vector, NULL, NULL, 10);

-- Get similar entries
SELECT * FROM get_similar_entries('uuid-of-entry', 10);

-- Get recommendations for user
SELECT * FROM get_recommendations(auth.uid(), 20);

-- Get trending entries
SELECT * FROM get_trending_entries(7, 20);

-- Get popular entries
SELECT * FROM v_popular_entries LIMIT 20;

-- Search analytics
SELECT * FROM v_search_analytics LIMIT 20;

-- Content performance
SELECT * FROM v_content_performance ORDER BY total_views DESC LIMIT 20;

-- Calculate ranking for entry
SELECT calculate_entry_ranking('uuid-of-entry', 'composite');

-- Refresh search index
SELECT refresh_search_index();

-- Get graph neighbors
SELECT
  kn.label, ke.edge_type, ke.weight
FROM knowledge_graph_edges ke
JOIN knowledge_graph_nodes kn ON kn.id = ke.target_id
WHERE ke.source_id = 'uuid-of-node'
ORDER BY ke.weight DESC;

-- Get communities
SELECT name, node_ids, community_score
FROM graph_communities
ORDER BY community_score DESC;

-- Submit feedback
INSERT INTO entry_feedback (user_id, entry_id, feedback_type, comment)
VALUES (auth.uid(), 'uuid-of-entry', 'helpful', 'Very informative');
```

---

## Future Expansion

- **Real-time search**: WebSocket สำหรับ live suggestions
- **Graph algorithms**: PageRank, centrality, community detection
- **A/B testing**: Framework สำหรับ ranking algorithms
- **Personalized search**: User history-based ranking
- **Multi-modal search**: Image + text hybrid search
- **Knowledge evolution tracking**: Track how knowledge changes over time
