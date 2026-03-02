-- ====== A.M.I.A v2 スキーマ ======
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS apps CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT 'ゲスト',
  email TEXT UNIQUE,
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  plan TEXT NOT NULL DEFAULT 'free',
  generate_count INT NOT NULL DEFAULT 0,
  period_start TEXT NOT NULL DEFAULT to_char(NOW(), 'YYYY-MM'),
  total_likes_received INT NOT NULL DEFAULT 0,
  total_plays_received INT NOT NULL DEFAULT 0,
  app_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  genre TEXT NOT NULL,
  theme TEXT DEFAULT '',
  mood TEXT DEFAULT '',
  thumbnail TEXT DEFAULT '🎮',
  options JSONB NOT NULL DEFAULT '{}',
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  version INT DEFAULT 1,
  play_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  avg_rating NUMERIC(2,1) DEFAULT 0,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(app_id, user_id)
);

CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  score INT NOT NULL CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(app_id, user_id)
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "all_select" ON users FOR SELECT USING (true);
CREATE POLICY "all_select" ON apps FOR SELECT USING (true);
CREATE POLICY "all_select" ON likes FOR SELECT USING (true);
CREATE POLICY "all_select" ON ratings FOR SELECT USING (true);
CREATE POLICY "all_write" ON users FOR ALL USING (true);
CREATE POLICY "all_write" ON apps FOR ALL USING (true);
CREATE POLICY "all_write" ON likes FOR ALL USING (true);
CREATE POLICY "all_write" ON ratings FOR ALL USING (true);

CREATE INDEX idx_apps_user ON apps(user_id);
CREATE INDEX idx_apps_status ON apps(status);
CREATE INDEX idx_apps_genre ON apps(genre);
CREATE INDEX idx_apps_likes ON apps(like_count DESC);
CREATE INDEX idx_apps_plays ON apps(play_count DESC);
