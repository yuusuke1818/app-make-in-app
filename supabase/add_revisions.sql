-- ====== 改良履歴テーブル追加 ======
-- 既存テーブルはそのまま、このSQLを追加実行する

CREATE TABLE IF NOT EXISTS revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id UUID REFERENCES apps(id) ON DELETE CASCADE NOT NULL,
  version INT NOT NULL,
  instruction TEXT NOT NULL,        -- 改良指示内容
  status TEXT NOT NULL DEFAULT 'pending',  -- pending / applied / failed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "all_select" ON revisions FOR SELECT USING (true);
CREATE POLICY "all_write" ON revisions FOR ALL USING (true);
CREATE INDEX idx_revisions_app ON revisions(app_id);
