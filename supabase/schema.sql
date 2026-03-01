-- ====== A.M.I.A データベーススキーマ ======

-- ユーザテーブル
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'ゲスト',
  email TEXT UNIQUE,
  avatar_url TEXT,
  plan_id TEXT NOT NULL DEFAULT 'free',
  generate_count INT NOT NULL DEFAULT 0,
  improve_count INT NOT NULL DEFAULT 0,
  period_start TEXT NOT NULL DEFAULT to_char(NOW(), 'YYYY-MM'),
  stripe_customer_id TEXT,
  coins INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 生成アプリテーブル
CREATE TABLE IF NOT EXISTS apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  theme TEXT,
  thumbnail TEXT,
  description TEXT,
  options JSONB NOT NULL DEFAULT '{}',
  code TEXT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  rating NUMERIC(2,1) DEFAULT 0,
  play_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 評価テーブル
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(app_id, user_id)
);

-- RLS（Row Level Security）有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- ポリシー：全ユーザ読み取り可能
CREATE POLICY "apps_read_all" ON apps FOR SELECT USING (true);
CREATE POLICY "ratings_read_all" ON ratings FOR SELECT USING (true);

-- ポリシー：認証ユーザのみ書き込み（anonキーで一旦全許可、後でAuth連携時に制限）
CREATE POLICY "apps_insert" ON apps FOR INSERT WITH CHECK (true);
CREATE POLICY "apps_update" ON apps FOR UPDATE USING (true);
CREATE POLICY "ratings_insert" ON ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "users_all" ON users FOR ALL USING (true);
