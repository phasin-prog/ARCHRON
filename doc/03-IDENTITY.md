# Phase 03 — Identity & Community

> สถาปัตยกรรมระบบ User Identity & Community Features

---

## Architecture Overview

Identity & Community คือชั้นสำหรับ

- User Profiles (extends Clerk)
- Roles & Permissions
- Organizations & Teams
- Bookmarks & Reading History
- Saved Collections
- Achievements & Gamification
- Notifications
- User Preferences
- API Keys
- Theme Preferences

Supabase RLS ใช้ `auth.uid()` สำหรับ row-level access

---

## ER Design

```
profiles (UUID PK = auth.users.id)
├── user_roles → roles
├── user_organizations → organizations
├── user_preferences (JSONB)
├── user_bookmarks → entries
├── reading_history → entries
├── saved_collections → collections
├── achievements → achievement_types
├── notifications
├── api_keys
└── user_activity_logs

roles (id, name, permissions[])
organizations (id, name, slug)
teams (id, org_id, name)
team_members (team_id, user_id, role)
```

---

## Complete SQL

```sql
-- ============================================================
-- Phase 03: Identity & Community
-- ARCHRON PostgreSQL Schema
-- ============================================================

-- Enums
CREATE TYPE user_role AS ENUM (
  'reader', 'contributor', 'editor', 'moderator', 'admin'
);

CREATE TYPE notification_type AS ENUM (
  'mention', 'comment', 'review', 'publish',
  'achievement', 'system', 'follow', 'like'
);

CREATE TYPE notification_status AS ENUM (
  'unread', 'read', 'archived'
);

CREATE TYPE achievement_rarity AS ENUM (
  'common', 'uncommon', 'rare', 'epic', 'legendary'
);

CREATE TYPE api_key_status AS ENUM (
  'active', 'revoked', 'expired'
);

-- ============================================================
-- Profiles
-- ============================================================

-- Profiles: extends auth.users with app-specific data
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website_url TEXT,
  location TEXT,
  role user_role NOT NULL DEFAULT 'reader',
  is_public BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  reading_streak INT DEFAULT 0,
  total_reading_minutes INT DEFAULT 0,
  entries_contributed INT DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'User profiles (extends Clerk auth.users)';

-- ============================================================
-- Roles & Permissions
-- ============================================================

-- Roles definition
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name user_role NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  permissions TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE roles IS 'Roles และ permissions ของระบบ';

-- User roles (many-to-many for flexibility)
CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, role_id)
);

COMMENT ON TABLE user_roles IS 'Mapping ระหว่าง users และ roles';

-- ============================================================
-- Organizations & Teams
-- ============================================================

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE organizations IS 'องค์กร/หน่วยงาน';

-- Organization members
CREATE TABLE organization_members (
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (org_id, user_id)
);

-- Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE teams IS 'Teams ภายใน organizations';

CREATE TABLE team_members (
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('lead', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

-- ============================================================
-- Bookmarks & Reading History
-- ============================================================

-- Bookmarks
CREATE TABLE user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  collection_name TEXT DEFAULT 'default',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, entry_id, collection_name)
);

COMMENT ON TABLE user_bookmarks IS 'Bookmarks ของ users';

-- Reading history
CREATE TABLE reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  reading_time_seconds INT DEFAULT 0,
  progress_percent NUMERIC(5,2) DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_position TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, entry_id)
);

COMMENT ON TABLE reading_history IS 'ประวัติการอ่านของ users';

-- ============================================================
-- Saved Collections
-- ============================================================

CREATE TABLE user_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  cover_url TEXT,
  entry_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_collections IS 'Collections ส่วนตัวของ users';

CREATE TABLE user_collection_entries (
  collection_id UUID NOT NULL REFERENCES user_collections(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  notes TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection_id, entry_id)
);

-- ============================================================
-- Achievements & Gamification
-- ============================================================

-- Achievement types (templates)
CREATE TABLE achievement_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  rarity achievement_rarity NOT NULL DEFAULT 'common',
  points INT DEFAULT 10,
  criteria JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE achievement_types IS 'Achievement templates/definitions';

-- User achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type_id UUID NOT NULL REFERENCES achievement_types(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, achievement_type_id)
);

COMMENT ON TABLE user_achievements IS 'Achievements ที่ users ได้รับ';

-- ============================================================
-- Notifications
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  status notification_status NOT NULL DEFAULT 'unread',
  metadata JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 'Notifications สำหรับ users';

-- ============================================================
-- User Preferences
-- ============================================================

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'system')),
  font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  language TEXT DEFAULT 'th',
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  reading_goal_minutes_per_day INT DEFAULT 30,
  preferred_content_types entry_type[] DEFAULT '{}',
  hidden_entries UUID[] DEFAULT '{}',
  custom_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

COMMENT ON TABLE user_preferences IS 'Preferences ส่วนตัวของ users';

-- ============================================================
-- API Keys
-- ============================================================

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{read}',
  status api_key_status NOT NULL DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE api_keys IS 'API keys สำหรับ programmatic access';

-- ============================================================
-- Activity Logs
-- ============================================================

CREATE TABLE user_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_activity_logs IS 'Activity logs สำหรับ auditing';

-- ============================================================
-- Indexes
-- ============================================================

-- Profiles
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_public ON profiles(is_public) WHERE is_public = true;
CREATE INDEX idx_profiles_active ON profiles(last_active_at DESC);

-- Roles
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
CREATE INDEX idx_user_roles_expires ON user_roles(expires_at) WHERE expires_at IS NOT NULL;

-- Organizations
CREATE INDEX idx_org_slug ON organizations(slug);
CREATE INDEX idx_org_members_user ON organization_members(user_id);
CREATE INDEX idx_org_members_org ON organization_members(org_id);

-- Teams
CREATE INDEX idx_teams_org ON teams(org_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_team ON team_members(team_id);

-- Bookmarks
CREATE INDEX idx_bookmarks_user ON user_bookmarks(user_id);
CREATE INDEX idx_bookmarks_entry ON user_bookmarks(entry_id);
CREATE INDEX idx_bookmarks_user_collection ON user_bookmarks(user_id, collection_name);

-- Reading history
CREATE INDEX idx_reading_history_user ON reading_history(user_id);
CREATE INDEX idx_reading_history_entry ON reading_history(entry_id);
CREATE INDEX idx_reading_history_completed ON reading_history(user_id, completed);
CREATE INDEX idx_reading_history_progress ON reading_history(user_id, progress_percent);

-- User collections
CREATE INDEX idx_user_collections_user ON user_collections(user_id);
CREATE INDEX idx_user_collections_public ON user_collections(is_public) WHERE is_public = true;
CREATE INDEX idx_user_collection_entries_entry ON user_collection_entries(entry_id);

-- Achievements
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_type ON user_achievements(achievement_type_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(user_id, status);
CREATE INDEX idx_notifications_unread ON notifications(user_id, status) WHERE status = 'unread';
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- User preferences
CREATE INDEX idx_user_preferences_user ON user_preferences(user_id);

-- API keys
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_active ON api_keys(status) WHERE status = 'active';

-- Activity logs
CREATE INDEX idx_activity_logs_user ON user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON user_activity_logs(action);
CREATE INDEX idx_activity_logs_entity ON user_activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON user_activity_logs(created_at DESC);

-- ============================================================
-- Triggers
-- ============================================================

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_collections_updated_at
  BEFORE UPDATE ON user_collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update reading streak
CREATE OR REPLACE FUNCTION update_reading_streak()
RETURNS TRIGGER AS $$
DECLARE
  v_last_active DATE;
  v_streak INT;
BEGIN
  SELECT DATE(last_active_at) INTO v_last_active
  FROM profiles WHERE id = NEW.user_id;

  IF v_last_active = CURRENT_DATE THEN
    -- Already read today, no change
    RETURN NEW;
  ELSIF v_last_active = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    UPDATE profiles SET
      reading_streak = reading_streak + 1,
      last_active_at = NOW()
    WHERE id = NEW.user_id;
  ELSE
    -- Streak broken, reset to 1
    UPDATE profiles SET
      reading_streak = 1,
      last_active_at = NOW()
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_reading_streak
  AFTER INSERT OR UPDATE ON reading_history
  FOR EACH ROW EXECUTE FUNCTION update_reading_streak();

-- ============================================================
-- Functions
-- ============================================================

-- Get user profile with stats
CREATE OR REPLACE FUNCTION get_user_profile(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role user_role,
  reading_streak INT,
  total_reading_minutes INT,
  entries_contributed INT,
  achievement_count BIGINT,
  bookmark_count BIGINT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id, p.username, p.display_name, p.avatar_url, p.bio,
    p.role, p.reading_streak, p.total_reading_minutes, p.entries_contributed,
    (SELECT COUNT(*) FROM user_achievements WHERE user_id = p.id),
    (SELECT COUNT(*) FROM user_bookmarks WHERE user_id = p.id),
    p.created_at
  FROM profiles p
  WHERE p.id = p_user_id AND p.is_public = true;
END;
$$ LANGUAGE plpgsql STABLE;

-- Check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_permission TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = p_user_id
      AND p_permission = ANY(r.permissions)
      AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant achievement
CREATE OR REPLACE FUNCTION grant_achievement(
  p_user_id UUID,
  p_achievement_name TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_achievement_id UUID;
BEGIN
  SELECT id INTO v_achievement_id
  FROM achievement_types
  WHERE name = p_achievement_name AND is_active = true;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  INSERT INTO user_achievements (user_id, achievement_type_id)
  VALUES (p_user_id, v_achievement_id)
  ON CONFLICT (user_id, achievement_type_id) DO NOTHING;

  -- Create notification
  INSERT INTO notifications (user_id, type, title, body, link)
  SELECT
    p_user_id,
    'achievement',
    'Achievement Unlocked!',
    at.display_name,
    '/profile/achievements'
  FROM achievement_types at
  WHERE at.id = v_achievement_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Get user's reading stats
CREATE OR REPLACE FUNCTION get_reading_stats(p_user_id UUID)
RETURNS TABLE (
  total_entries_read BIGINT,
  completed_entries BIGINT,
  total_minutes INT,
  current_streak INT,
  longest_streak INT,
  favorite_type entry_type,
  weekly_minutes NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM reading_history WHERE user_id = p_user_id),
    (SELECT COUNT(*) FROM reading_history WHERE user_id = p_user_id AND completed = true),
    (SELECT COALESCE(SUM(reading_time_seconds), 0) / 60 FROM reading_history WHERE user_id = p_user_id),
    (SELECT reading_streak FROM profiles WHERE id = p_user_id),
    (SELECT COALESCE(MAX(reading_streak), 0) FROM profiles WHERE id = p_user_id),
    (SELECT e.type FROM reading_history rh JOIN entries e ON e.id = rh.entry_id WHERE rh.user_id = p_user_id GROUP BY e.type ORDER BY COUNT(*) DESC LIMIT 1),
    (SELECT COALESCE(SUM(reading_time_seconds), 0) / 60.0 FROM reading_history WHERE user_id = p_user_id AND created_at > NOW() - INTERVAL '7 days');
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- Views
-- ============================================================

-- Public profiles
CREATE VIEW v_public_profiles AS
SELECT
  p.id, p.username, p.display_name, p.avatar_url, p.bio,
  p.role, p.reading_streak, p.entries_contributed,
  p.created_at
FROM profiles p
WHERE p.is_public = true;

-- Leaderboard
CREATE VIEW v_leaderboard AS
SELECT
  p.id, p.username, p.display_name, p.avatar_url,
  p.reading_streak,
  p.total_reading_minutes,
  p.entries_contributed,
  (SELECT COUNT(*) FROM user_achievements WHERE user_id = p.id) AS achievement_count
FROM profiles p
WHERE p.is_public = true
ORDER BY p.total_reading_minutes DESC, p.entries_contributed DESC;

-- Active users
CREATE VIEW v_active_users AS
SELECT
  p.id, p.username, p.display_name, p.avatar_url,
  p.last_active_at,
  (SELECT COUNT(*) FROM reading_history WHERE user_id = p.id AND created_at > NOW() - INTERVAL '7 days') AS recent_reads
FROM profiles p
WHERE p.last_active_at > NOW() - INTERVAL '30 days'
ORDER BY p.last_active_at DESC;

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collection_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles visible"
  ON profiles FOR SELECT
  USING (is_public = true OR id = auth.uid());

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- User roles
CREATE POLICY "Users view own roles"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

-- Organizations
CREATE POLICY "Public orgs visible"
  ON organizations FOR SELECT
  USING (is_active = true);

CREATE POLICY "Org members manage org"
  ON organizations FOR UPDATE
  USING (
    id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- Org members
CREATE POLICY "Org members visible"
  ON organization_members FOR SELECT
  USING (true);

CREATE POLICY "Org owners manage members"
  ON organization_members FOR ALL
  USING (
    org_id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid() AND role = 'owner')
  );

-- Teams
CREATE POLICY "Org teams visible"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Org admins manage teams"
  ON teams FOR ALL
  USING (
    org_id IN (SELECT org_id FROM organization_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
  );

-- Team members
CREATE POLICY "Team members visible"
  ON team_members FOR SELECT
  USING (true);

-- Bookmarks
CREATE POLICY "Users manage own bookmarks"
  ON user_bookmarks FOR ALL
  USING (user_id = auth.uid());

-- Reading history
CREATE POLICY "Users manage own reading history"
  ON reading_history FOR ALL
  USING (user_id = auth.uid());

-- User collections
CREATE POLICY "Public collections visible"
  ON user_collections FOR SELECT
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users manage own collections"
  ON user_collections FOR ALL
  USING (user_id = auth.uid());

-- Collection entries
CREATE POLICY "Collection entries visible"
  ON user_collection_entries FOR SELECT
  USING (
    collection_id IN (
      SELECT id FROM user_collections WHERE is_public = true OR user_id = auth.uid()
    )
  );

CREATE POLICY "Users manage own collection entries"
  ON user_collection_entries FOR ALL
  USING (
    collection_id IN (SELECT id FROM user_collections WHERE user_id = auth.uid())
  );

-- Achievement types
CREATE POLICY "Achievement types public"
  ON achievement_types FOR SELECT
  USING (is_active = true);

-- User achievements
CREATE POLICY "User achievements visible"
  ON user_achievements FOR SELECT
  USING (true);

-- Notifications
CREATE POLICY "Users manage own notifications"
  ON notifications FOR ALL
  USING (user_id = auth.uid());

-- User preferences
CREATE POLICY "Users manage own preferences"
  ON user_preferences FOR ALL
  USING (user_id = auth.uid());

-- API keys
CREATE POLICY "Users manage own API keys"
  ON api_keys FOR ALL
  USING (user_id = auth.uid());

-- Activity logs
CREATE POLICY "Users view own activity"
  ON user_activity_logs FOR SELECT
  USING (user_id = auth.uid());

-- ============================================================
-- Performance Notes
-- ============================================================

1. **Auto profile creation**: Trigger `handle_new_user` สร้าง profile + preferences อัตโนมัติเมื่อ user signup

2. **Reading streak**: Trigger `update_reading_streak` อัปเดต streak อัตโนมัติ — ไม่ต้อง application logic

3. **Permission check**: `user_has_permission` function สำหรับ check ใน RLS policies

4. **JSONB preferences**: `custom_preferences` สำหรับ feature flags ที่อาจเปลี่ยน

5. **Array columns**: `hidden_entries`, `preferred_content_types` ใช้ PostgreSQL arrays สำหรับ simple lists

---

## Example Queries

```sql
-- ดู profile ของตัวเอง
SELECT * FROM profiles WHERE id = auth.uid();

-- ดู leaderboard
SELECT * FROM v_leaderboard LIMIT 20;

-- ดู bookmarks ของตัวเอง
SELECT e.title, e.slug, e.type, ub.created_at
FROM user_bookmarks ub
JOIN entries e ON e.id = ub.entry_id
WHERE ub.user_id = auth.uid()
ORDER BY ub.created_at DESC;

-- ดู reading history
SELECT e.title, e.slug, rh.progress_percent, rh.completed, rh.reading_time_seconds
FROM reading_history rh
JOIN entries e ON e.id = rh.entry_id
WHERE rh.user_id = auth.uid()
ORDER BY rh.updated_at DESC;

-- ดู notifications ที่ยังไม่อ่าน
SELECT type, title, body, created_at
FROM notifications
WHERE user_id = auth.uid() AND status = 'unread'
ORDER BY created_at DESC;

-- ดู achievements
SELECT at.display_name, at.rarity, at.points, ua.earned_at
FROM user_achievements ua
JOIN achievement_types at ON at.id = ua.achievement_type_id
WHERE ua.user_id = auth.uid()
ORDER BY ua.earned_at DESC;

-- Check permission
SELECT user_has_permission(auth.uid(), 'can_publish');

-- ดู reading stats
SELECT * FROM get_reading_stats(auth.uid());
```

---

## Future Expansion

- **Following system**: Follow other users
- **Social features**: Comments on entries, likes
- **Reading groups**: Groups for shared reading
- **Custom achievements**: Users create achievements for others
- **API key management**: Dashboard for key rotation
- **Session management**: Track active sessions
