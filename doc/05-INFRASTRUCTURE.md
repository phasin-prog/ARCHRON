# Phase 05 — Infrastructure

> สถาปัตยกรรมระบบ Production Infrastructure

---

## Architecture Overview

Infrastructure คือชั้นสำหรับ

- Storage (images, media, files)
- Cache layer
- Background Jobs & Queues
- Cron Jobs
- System Logs
- Audit Logs
- System Settings
- Feature Flags
- Backup & Recovery
- Migration History
- Health Monitoring

Supabase Storage + pg_net + pg_cron

---

## ER Design

```
storage_uploads (metadata)
├── storage_folders

cache_entries (key-value)
├── cache_stats

job_queues (priority queues)
├── job_logs
├── scheduled_jobs

cron_jobs (recurring tasks)
├── cron_logs

system_logs (app logs)
audit_logs (security/compliance)

system_settings (key-value)
feature_flags (toggle features)
├── flag_usage_logs

backup_history
migration_history

health_checks
├── health_incidents
```

---

## Complete SQL

```sql
-- ============================================================
-- Phase 05: Infrastructure
-- ARCHRON PostgreSQL Schema
-- ============================================================

-- Enums
CREATE TYPE job_status AS ENUM (
  'pending', 'processing', 'completed', 'failed', 'cancelled', 'retry'
);

CREATE TYPE job_priority AS ENUM (
  'low', 'normal', 'high', 'critical'
);

CREATE TYPE log_level AS ENUM (
  'debug', 'info', 'warn', 'error', 'fatal'
);

CREATE TYPE audit_action AS ENUM (
  'create', 'read', 'update', 'delete',
  'login', 'logout', 'export', 'import',
  'publish', 'archive', 'restore', 'permission_change'
);

CREATE TYPE health_status AS ENUM (
  'healthy', 'degraded', 'unhealthy', 'unknown'
);

CREATE TYPE backup_status AS ENUM (
  'pending', 'running', 'completed', 'failed'
);

CREATE TYPE flag_status AS ENUM (
  'active', 'inactive', 'gradual_rollout'
);

-- ============================================================
-- Storage
-- ============================================================

-- Storage metadata (Supabase Storage handles actual files)
CREATE TABLE storage_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES storage_folders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE storage_folders IS 'Folder structure สำหรับ storage';

CREATE TABLE storage_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES storage_folders(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE storage_uploads IS 'Metadata สำหรับไฟล์ที่อัปโหลด (Supabase Storage)';

-- ============================================================
-- Cache
-- ============================================================

CREATE TABLE cache_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,
  cache_value JSONB NOT NULL,
  ttl_seconds INT DEFAULT 3600,
  tags TEXT[] DEFAULT '{}',
  hit_count INT DEFAULT 0,
  last_hit_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE cache_entries IS 'Application-level cache (Redis alternative)';

CREATE INDEX idx_cache_key ON cache_entries(cache_key);
CREATE INDEX idx_cache_expires ON cache_entries(expires_at);
CREATE INDEX idx_cache_tags ON cache_entries USING GIN (tags);

-- ============================================================
-- Background Jobs
-- ============================================================

CREATE TABLE job_queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  concurrency_limit INT DEFAULT 1,
  retry_limit INT DEFAULT 3,
  timeout_seconds INT DEFAULT 300,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE job_queues IS 'Job queue definitions';

CREATE TABLE background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_name TEXT NOT NULL,
  job_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status job_status NOT NULL DEFAULT 'pending',
  priority job_priority NOT NULL DEFAULT 'normal',
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  error_message TEXT,
  result JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE background_jobs IS 'Background jobs queue';

CREATE TABLE job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES background_jobs(id) ON DELETE CASCADE,
  status job_status NOT NULL,
  message TEXT,
  error_stack TEXT,
  duration_ms INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE job_logs IS 'Job execution logs';

-- ============================================================
-- Cron Jobs
-- ============================================================

CREATE TABLE cron_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  schedule TEXT NOT NULL,
  function_name TEXT NOT NULL,
  function_args JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE cron_jobs IS 'Recurring cron jobs';

CREATE TABLE cron_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cron_job_id UUID NOT NULL REFERENCES cron_jobs(id) ON DELETE CASCADE,
  status job_status NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INT,
  result JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE cron_logs IS 'Cron job execution logs';

-- ============================================================
-- Logs
-- ============================================================

-- Application logs
CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level log_level NOT NULL DEFAULT 'info',
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  request_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE system_logs IS 'Application logs';

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action audit_action NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB DEFAULT '{}',
  new_values JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE audit_logs IS 'Audit logs สำหรับ compliance และ security';

-- ============================================================
-- System Settings
-- ============================================================

CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE system_settings IS 'System-wide settings (key-value)';

-- ============================================================
-- Feature Flags
-- ============================================================

CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  status flag_status NOT NULL DEFAULT 'inactive',
  rollout_percentage NUMERIC(5,2) DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  allowed_users UUID[] DEFAULT '{}',
  denied_users UUID[] DEFAULT '{}',
  conditions JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE feature_flags IS 'Feature flags สำหรับ gradual rollout';

CREATE TABLE feature_flag_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_id UUID NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_enabled BOOLEAN NOT NULL,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE feature_flag_usage IS 'Feature flag usage tracking';

-- ============================================================
-- Backup & Recovery
-- ============================================================

CREATE TABLE backup_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type TEXT NOT NULL,
  status backup_status NOT NULL DEFAULT 'pending',
  storage_path TEXT,
  file_size BIGINT,
  duration_seconds INT,
  checksum TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

COMMENT ON TABLE backup_history IS 'Backup history';

-- ============================================================
-- Migration History
-- ============================================================

CREATE TABLE migration_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  name TEXT NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checksum TEXT NOT NULL,
  execution_time_ms INT,
  metadata JSONB DEFAULT '{}'
);

COMMENT ON TABLE migration_history IS 'Schema migration history';

-- ============================================================
-- Health Monitoring
-- ============================================================

CREATE TABLE health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  status health_status NOT NULL DEFAULT 'unknown',
  response_time_ms INT,
  metadata JSONB DEFAULT '{}',
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE health_checks IS 'Health check results';

CREATE TABLE health_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  status health_status NOT NULL DEFAULT 'unhealthy',
  title TEXT NOT NULL,
  description TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  duration_seconds INT,
  impact TEXT,
  metadata JSONB DEFAULT '{}'
);

COMMENT ON TABLE health_incidents IS 'Health incidents';

-- ============================================================
-- Indexes
-- ============================================================

-- Storage
CREATE INDEX idx_storage_uploads_folder ON storage_uploads(folder_id);
CREATE INDEX idx_storage_uploads_uploaded_by ON storage_uploads(uploaded_by);
CREATE INDEX idx_storage_uploads_mime ON storage_uploads(mime_type);
CREATE INDEX idx_storage_uploads_public ON storage_uploads(is_public) WHERE is_public = true;

-- Cache
CREATE INDEX idx_cache_expires ON cache_entries(expires_at);

-- Background jobs
CREATE INDEX idx_bg_jobs_queue ON background_jobs(queue_name);
CREATE INDEX idx_bg_jobs_status ON background_jobs(status);
CREATE INDEX idx_bg_jobs_priority ON background_jobs(priority, created_at);
CREATE INDEX idx_bg_jobs_pending ON background_jobs(status, priority, created_at) WHERE status = 'pending';
CREATE INDEX idx_bg_jobs_processing ON background_jobs(status) WHERE status = 'processing';
CREATE INDEX idx_bg_jobs_created ON background_jobs(created_at DESC);

-- Job logs
CREATE INDEX idx_job_logs_job ON job_logs(job_id);
CREATE INDEX idx_job_logs_status ON job_logs(status);
CREATE INDEX idx_job_logs_created ON job_logs(created_at DESC);

-- Cron jobs
CREATE INDEX idx_cron_jobs_active ON cron_jobs(is_active) WHERE is_active = true;
CREATE INDEX idx_cron_jobs_next_run ON cron_jobs(next_run_at) WHERE is_active = true;

-- Cron logs
CREATE INDEX idx_cron_logs_job ON cron_logs(cron_job_id);
CREATE INDEX idx_cron_logs_created ON cron_logs(created_at DESC);

-- System logs
CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_source ON system_logs(source);
CREATE INDEX idx_system_logs_created ON system_logs(created_at DESC);
CREATE INDEX idx_system_logs_user ON system_logs(user_id);
CREATE INDEX idx_system_logs_request ON system_logs(request_id);

-- Audit logs
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- System settings
CREATE INDEX idx_system_settings_key ON system_settings(key);
CREATE INDEX idx_system_settings_public ON system_settings(is_public) WHERE is_public = true;

-- Feature flags
CREATE INDEX idx_feature_flags_name ON feature_flags(name);
CREATE INDEX idx_feature_flags_status ON feature_flags(status);

-- Feature flag usage
CREATE INDEX idx_flag_usage_flag ON feature_flag_usage(flag_id);
CREATE INDEX idx_flag_usage_user ON feature_flag_usage(user_id);

-- Backup history
CREATE INDEX idx_backup_history_status ON backup_history(status);
CREATE INDEX idx_backup_history_created ON backup_history(created_at DESC);

-- Migration history
CREATE INDEX idx_migration_history_version ON migration_history(version);
CREATE INDEX idx_migration_history_applied ON migration_history(applied_at DESC);

-- Health checks
CREATE INDEX idx_health_checks_service ON health_checks(service_name);
CREATE INDEX idx_health_checks_status ON health_checks(status);
CREATE INDEX idx_health_checks_checked ON health_checks(checked_at DESC);

-- Health incidents
CREATE INDEX idx_health_incidents_service ON health_incidents(service_name);
CREATE INDEX idx_health_incidents_status ON health_incidents(status);
CREATE INDEX idx_health_incidents_started ON health_incidents(started_at DESC);

-- ============================================================
-- Triggers
-- ============================================================

CREATE TRIGGER trigger_storage_uploads_updated_at
  BEFORE UPDATE ON storage_uploads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_cache_entries_updated_at
  BEFORE UPDATE ON cache_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_job_queues_updated_at
  BEFORE UPDATE ON job_queues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_background_jobs_updated_at
  BEFORE UPDATE ON background_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_cron_jobs_updated_at
  BEFORE UPDATE ON cron_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_feature_flags_updated_at
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Functions
-- ============================================================

-- Cleanup expired cache
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INT AS $$
DECLARE
  v_deleted INT;
BEGIN
  DELETE FROM cache_entries WHERE expires_at < NOW();
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- Get or set cache
CREATE OR REPLACE FUNCTION cache_get(p_key TEXT)
RETURNS JSONB AS $$
DECLARE
  v_value JSONB;
BEGIN
  SELECT cache_value INTO v_value
  FROM cache_entries
  WHERE cache_key = p_key
    AND expires_at > NOW();

  IF FOUND THEN
    UPDATE cache_entries SET
      hit_count = hit_count + 1,
      last_hit_at = NOW()
    WHERE cache_key = p_key;
    RETURN v_value;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION cache_set(
  p_key TEXT,
  p_value JSONB,
  p_ttl_seconds INT DEFAULT 3600,
  p_tags TEXT[] DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO cache_entries (cache_key, cache_value, ttl_seconds, tags, expires_at)
  VALUES (p_key, p_value, p_ttl_seconds, p_tags, NOW() + (p_ttl_seconds || ' seconds')::INTERVAL)
  ON CONFLICT (cache_key) DO UPDATE SET
    cache_value = p_value,
    ttl_seconds = p_ttl_seconds,
    tags = p_tags,
    expires_at = NOW() + (p_ttl_seconds || ' seconds')::INTERVAL,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Invalidate cache by tag
CREATE OR REPLACE FUNCTION cache_invalidate_by_tag(p_tag TEXT)
RETURNS INT AS $$
DECLARE
  v_deleted INT;
BEGIN
  DELETE FROM cache_entries WHERE p_tag = ANY(tags);
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- Enqueue background job
CREATE OR REPLACE FUNCTION enqueue_job(
  p_queue_name TEXT,
  p_job_type TEXT,
  p_payload JSONB DEFAULT '{}',
  p_priority job_priority DEFAULT 'normal',
  p_created_by UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_job_id UUID;
BEGIN
  INSERT INTO background_jobs (queue_name, job_type, payload, priority, created_by)
  VALUES (p_queue_name, p_job_type, p_payload, p_priority, p_created_by)
  RETURNING id INTO v_job_id;

  RETURN v_job_id;
END;
$$ LANGUAGE plpgsql;

-- Process next job
CREATE OR REPLACE FUNCTION process_next_job(p_queue_name TEXT)
RETURNS UUID AS $$
DECLARE
  v_job_id UUID;
BEGIN
  SELECT id INTO v_job_id
  FROM background_jobs
  WHERE queue_name = p_queue_name
    AND status = 'pending'
    AND attempts < max_attempts
  ORDER BY
    CASE priority
      WHEN 'critical' THEN 0
      WHEN 'high' THEN 1
      WHEN 'normal' THEN 2
      WHEN 'low' THEN 3
    END,
    created_at
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF FOUND THEN
    UPDATE background_jobs SET
      status = 'processing',
      started_at = NOW(),
      attempts = attempts + 1
    WHERE id = v_job_id;

    INSERT INTO job_logs (job_id, status, message)
    VALUES (v_job_id, 'processing', 'Job started');

    RETURN v_job_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Complete job
CREATE OR REPLACE FUNCTION complete_job(
  p_job_id UUID,
  p_status job_status DEFAULT 'completed',
  p_result JSONB DEFAULT '{}',
  p_error_message TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_duration_ms INT;
BEGIN
  SELECT EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000
  INTO v_duration_ms
  FROM background_jobs WHERE id = p_job_id;

  UPDATE background_jobs SET
    status = p_status,
    result = p_result,
    error_message = p_error_message,
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_job_id;

  INSERT INTO job_logs (job_id, status, message, error_stack, duration_ms)
  VALUES (p_job_id, p_status, p_status::TEXT, p_error_message, v_duration_ms);
END;
$$ LANGUAGE plpgsql;

-- Check feature flag
CREATE OR REPLACE FUNCTION is_feature_enabled(
  p_flag_name TEXT,
  p_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_flag feature_flags%ROWTYPE;
  v_enabled BOOLEAN;
BEGIN
  SELECT * INTO v_flag
  FROM feature_flags
  WHERE name = p_flag_name AND status = 'active';

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Check if user is explicitly denied
  IF p_user_id IS NOT NULL AND p_user_id = ANY(v_flag.denied_users) THEN
    RETURN FALSE;
  END IF;

  -- Check if user is explicitly allowed
  IF p_user_id IS NOT NULL AND p_user_id = ANY(v_flag.allowed_users) THEN
    RETURN TRUE;
  END IF;

  -- Gradual rollout
  IF v_flag.status = 'gradual_rollout' THEN
    v_enabled := (hashtext(p_user_id::TEXT) % 100) < v_flag.rollout_percentage;
    RETURN v_enabled;
  END IF;

  -- Default active
  RETURN v_flag.status = 'active';
END;
$$ LANGUAGE plpgsql STABLE;

-- Get system setting
CREATE OR REPLACE FUNCTION get_setting(p_key TEXT, p_default JSONB DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
  v_value JSONB;
BEGIN
  SELECT value INTO v_value
  FROM system_settings
  WHERE key = p_key;

  RETURN COALESCE(v_value, p_default);
END;
$$ LANGUAGE plpgsql STABLE;

-- Set system setting
CREATE OR REPLACE FUNCTION set_setting(
  p_key TEXT,
  p_value JSONB,
  p_description TEXT DEFAULT NULL,
  p_is_public BOOLEAN DEFAULT FALSE,
  p_updated_by UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO system_settings (key, value, description, is_public, updated_by)
  VALUES (p_key, p_value, p_description, p_is_public, p_updated_by)
  ON CONFLICT (key) DO UPDATE SET
    value = p_value,
    description = COALESCE(p_description, system_settings.description),
    is_public = p_is_public,
    updated_by = p_updated_by,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Record health check
CREATE OR REPLACE FUNCTION record_health_check(
  p_service TEXT,
  p_status health_status,
  p_response_time_ms INT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO health_checks (service_name, status, response_time_ms, metadata)
  VALUES (p_service, p_status, p_response_time_ms, p_metadata);
END;
$$ LANGUAGE plpgsql;

-- Cleanup old logs
CREATE OR REPLACE FUNCTION cleanup_old_logs(p_days INT DEFAULT 90)
RETURNS TABLE (
  table_name TEXT,
  deleted_count BIGINT
) AS $$
DECLARE
  v_count BIGINT;
BEGIN
  -- System logs
  DELETE FROM system_logs WHERE created_at < NOW() - (p_days || ' days')::INTERVAL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  table_name := 'system_logs';
  deleted_count := v_count;
  RETURN NEXT;

  -- Audit logs (keep longer)
  DELETE FROM audit_logs WHERE created_at < NOW() - (p_days * 2 || ' days')::INTERVAL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  table_name := 'audit_logs';
  deleted_count := v_count;
  RETURN NEXT;

  -- Search logs
  DELETE FROM search_logs WHERE created_at < NOW() - (p_days || ' days')::INTERVAL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  table_name := 'search_logs';
  deleted_count := v_count;
  RETURN NEXT;

  -- Analytics events
  DELETE FROM analytics_events WHERE created_at < NOW() - (p_days || ' days')::INTERVAL;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  table_name := 'analytics_events';
  deleted_count := v_count;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Views
-- ============================================================

-- Job queue status
CREATE VIEW v_job_queue_status AS
SELECT
  queue_name,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending,
  COUNT(*) FILTER (WHERE status = 'processing') AS processing,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed,
  COUNT(*) FILTER (WHERE status = 'failed') AS failed,
  AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) FILTER (WHERE status = 'completed') AS avg_duration_seconds
FROM background_jobs
GROUP BY queue_name;

-- System health overview
CREATE VIEW v_system_health AS
SELECT
  service_name,
  status,
  response_time_ms,
  checked_at
FROM health_checks hc
WHERE checked_at = (
  SELECT MAX(checked_at) FROM health_checks h2
  WHERE h2.service_name = hc.service_name
)
ORDER BY service_name;

-- Feature flags overview
CREATE VIEW v_feature_flags AS
SELECT
  name,
  status,
  rollout_percentage,
  array_length(allowed_users, 1) AS allowed_count,
  array_length(denied_users, 1) AS denied_count,
  updated_at
FROM feature_flags
ORDER BY name;

-- Storage usage
CREATE VIEW v_storage_usage AS
SELECT
  mime_type,
  COUNT(*) AS file_count,
  SUM(file_size) AS total_size_bytes,
  AVG(file_size) AS avg_size_bytes
FROM storage_uploads
GROUP BY mime_type
ORDER BY total_size_bytes DESC;

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE storage_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE background_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cron_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cron_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flag_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_incidents ENABLE ROW LEVEL SECURITY;

-- Storage
CREATE POLICY "Public read public uploads"
  ON storage_uploads FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users view own uploads"
  ON storage_uploads FOR SELECT
  USING (uploaded_by = auth.uid());

CREATE POLICY "Users upload files"
  ON storage_uploads FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Users manage own uploads"
  ON storage_uploads FOR ALL
  USING (uploaded_by = auth.uid());

-- Cache (admin only)
CREATE POLICY "Admins manage cache"
  ON cache_entries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Job queues
CREATE POLICY "Admins manage job queues"
  ON job_queues FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Background jobs
CREATE POLICY "Admins manage background jobs"
  ON background_jobs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users view own jobs"
  ON background_jobs FOR SELECT
  USING (created_by = auth.uid());

-- Job logs
CREATE POLICY "Admins view job logs"
  ON job_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cron jobs
CREATE POLICY "Admins manage cron jobs"
  ON cron_jobs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- System logs
CREATE POLICY "Admins view system logs"
  ON system_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert logs"
  ON system_logs FOR INSERT
  WITH CHECK (true);

-- Audit logs
CREATE POLICY "Admins view audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- System settings
CREATE POLICY "Public read public settings"
  ON system_settings FOR SELECT
  USING (is_public = true);

CREATE POLICY "Admins manage settings"
  ON system_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Feature flags
CREATE POLICY "Public read feature flags"
  ON feature_flags FOR SELECT
  USING (true);

CREATE POLICY "Admins manage feature flags"
  ON feature_flags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Feature flag usage
CREATE POLICY "Admins view flag usage"
  ON feature_flag_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Backup history
CREATE POLICY "Admins manage backups"
  ON backup_history FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Migration history
CREATE POLICY "Admins view migrations"
  ON migration_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Health checks
CREATE POLICY "Admins view health checks"
  ON health_checks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert health checks"
  ON health_checks FOR INSERT
  WITH CHECK (true);

-- Health incidents
CREATE POLICY "Admins manage incidents"
  ON health_incidents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- Performance Notes
-- ============================================================

1. **Cache layer**: ใช้ PostgreSQL แทน Redis — เหมาะกับ Supabase single-DB architecture

2. **Job processing**: `SKIP LOCKED` สำหรับ concurrent workers — ไม่ lock ซ้อน

3. **Log retention**: `cleanup_old_logs` ลบ logs เก่า — ปรับ p_days ตาม compliance requirements

4. **Feature flags**: Gradual rollout โดยใช้ hash-based % — deterministic per user

5. **Health checks**: Record ทุก check — ใช้ MAX(checked_at) สำหรับ latest status

---

## Example Queries

```sql
-- Get cache value
SELECT cache_get('popular_entries');

-- Set cache value
SELECT cache_set('popular_entries', '["uuid1", "uuid2"]', 3600, ARRAY['entries']);

-- Invalidate cache by tag
SELECT cache_invalidate_by_tag('entries');

-- Enqueue a job
SELECT enqueue_job('emails', 'send_notification', '{"user_id": "uuid", "message": "hello"}', 'normal');

-- Process next job
SELECT process_next_job('emails');

-- Complete a job
SELECT complete_job('uuid-of-job', 'completed', '{"sent": true}');

-- Check feature flag
SELECT is_feature_enabled('new_search_ui', auth.uid());

-- Get system setting
SELECT get_setting('maintenance_mode', 'false');

-- Set system setting
SELECT set_setting('maintenance_mode', 'true', 'Enable maintenance mode', false, auth.uid());

-- Record health check
SELECT record_health_check('database', 'healthy', 15);

-- Get job queue status
SELECT * FROM v_job_queue_status;

-- Get system health
SELECT * FROM v_system_health;

-- Get feature flags
SELECT * FROM v_feature_flags;

-- Get storage usage
SELECT * FROM v_storage_usage;

-- Cleanup expired cache
SELECT cleanup_expired_cache();

-- Cleanup old logs (90 days)
SELECT * FROM cleanup_old_logs(90);
```

---

## Future Expansion

- **Redis cache**: Migrate cache to Redis when scale requires
- **Job orchestration**: Complex workflows with dependencies
- **Metrics pipeline**: Export to Grafana/Datadog
- **Log aggregation**: Centralized logging with ELK stack
- **Disaster recovery**: Automated backup + restore procedures
- **Infrastructure as Code**: Terraform/Pulumi for Supabase resources
