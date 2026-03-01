// ====== 全17カテゴリの選択肢定義 ======

export const APP_NAME = "A.M.I.A";
export const APP_SUBTITLE = "App Make In App";

// 1. ジャンル
export const GENRES = [
  { id: "battle", label: "バトル", icon: "⚔️", desc: "対戦・戦闘系ゲーム", color: "#FF4444" },
  { id: "nurture", label: "育成", icon: "🌱", desc: "キャラ育成・シミュレーション", color: "#44BB44" },
  { id: "card", label: "カード", icon: "🃏", desc: "カードゲーム・デッキ構築", color: "#4488FF" },
  { id: "puzzle", label: "パズル", icon: "🧩", desc: "パズル・頭脳系", color: "#FF8844" },
  { id: "rpg", label: "RPG", icon: "🗡️", desc: "ロールプレイングゲーム", color: "#AA44FF" },
  { id: "quiz", label: "クイズ", icon: "❓", desc: "クイズ・知識系", color: "#FFAA00" },
  { id: "rhythm", label: "リズム", icon: "🎵", desc: "音楽・リズムゲーム", color: "#FF44AA" },
  { id: "simulator", label: "シミュレータ", icon: "🏗️", desc: "経営・生活シミュレーション", color: "#44AAAA" },
  { id: "custom", label: "カスタム", icon: "✨", desc: "自由入力でAIが判定・作成", color: "#888888" },
] as const;

// 2. ゲームモード
export const GAME_MODES = [
  { id: "single", label: "シングル", icon: "🧑", desc: "一人用" },
  { id: "multi", label: "対人対戦", icon: "⚡", desc: "マルチプレイヤー" },
  { id: "coop", label: "協力プレイ", icon: "🤝", desc: "Co-op（コープ）" },
  { id: "timeattack", label: "タイムアタック", icon: "⏱️", desc: "制限時間クリア" },
  { id: "endless", label: "エンドレス", icon: "♾️", desc: "無限モード" },
  { id: "story", label: "ストーリー", icon: "📖", desc: "シナリオ進行型" },
  { id: "daily", label: "デイリー", icon: "📅", desc: "日替わり挑戦" },
] as const;

// 3. 難易度
export const DIFFICULTIES = [
  { id: "easy", label: "イージー", icon: "😊", desc: "初心者向け" },
  { id: "normal", label: "ノーマル", icon: "😐", desc: "標準" },
  { id: "hard", label: "ハード", icon: "😤", desc: "上級者向け" },
  { id: "nightmare", label: "ナイトメア", icon: "💀", desc: "超高難度" },
  { id: "auto", label: "自動調整", icon: "🤖", desc: "AIが実力に合わせる" },
] as const;

// 4. 進行システム
export const PROGRESSIONS = [
  { id: "levelup", label: "レベルアップ制", icon: "📈", desc: "経験値で成長" },
  { id: "stageclear", label: "ステージクリア制", icon: "🏁", desc: "面クリア型" },
  { id: "openworld", label: "自由探索型", icon: "🗺️", desc: "オープンワールド風" },
  { id: "wave", label: "ウェーブ制", icon: "🌊", desc: "敵が波状出現" },
  { id: "turnbased", label: "ターン制", icon: "🔄", desc: "交互に行動" },
  { id: "realtime", label: "リアルタイム制", icon: "⚡", desc: "常時進行" },
] as const;

// 5. 世界観・テーマ
export const THEMES = [
  { id: "fantasy", label: "ファンタジー", icon: "🧙", desc: "剣と魔法" },
  { id: "scifi", label: "SF", icon: "🚀", desc: "近未来" },
  { id: "japanese", label: "和風", icon: "⛩️", desc: "侍・忍者・妖怪" },
  { id: "modern", label: "現代", icon: "🏙️", desc: "日常・学園" },
  { id: "horror", label: "ホラー", icon: "👻", desc: "恐怖・ダーク" },
  { id: "animal", label: "動物・自然", icon: "🐾", desc: "動物の世界" },
  { id: "space", label: "宇宙", icon: "🌌", desc: "惑星・銀河" },
  { id: "steampunk", label: "スチームパンク", icon: "⚙️", desc: "蒸気機関文明" },
  { id: "cyberpunk", label: "サイバーパンク", icon: "🌃", desc: "電脳都市" },
  { id: "medieval", label: "中世", icon: "🏰", desc: "中世ヨーロッパ" },
  { id: "postapocalypse", label: "終末世界", icon: "☢️", desc: "文明崩壊後" },
] as const;

// 6. アートスタイル
export const ART_STYLES = [
  { id: "pixel", label: "ドット絵", icon: "🎮", desc: "ピクセルアート" },
  { id: "anime", label: "アニメ調", icon: "🎨", desc: "アニメ風" },
  { id: "minimal", label: "ミニマル", icon: "◻️", desc: "シンプル・記号的" },
  { id: "emoji", label: "絵文字", icon: "😀", desc: "絵文字ベース" },
  { id: "sketch", label: "手描き風", icon: "✏️", desc: "スケッチ調" },
  { id: "neon", label: "ネオン", icon: "💡", desc: "発光・グロウ系" },
] as const;

// 7. カラースキーム
export const COLOR_SCHEMES = [
  { id: "dark", label: "ダーク", icon: "🌑", desc: "暗色基調" },
  { id: "light", label: "ライト", icon: "☀️", desc: "明色基調" },
  { id: "pastel", label: "パステル", icon: "🌸", desc: "柔らかい色合い" },
  { id: "vivid", label: "ビビッド", icon: "🌈", desc: "鮮やか原色系" },
  { id: "mono", label: "モノクロ", icon: "⬛", desc: "白黒" },
  { id: "retro", label: "レトロ", icon: "📺", desc: "ゲームボーイ風" },
] as const;

// 8. 戦闘システム
export const BATTLE_SYSTEMS = [
  { id: "turncommand", label: "ターン制コマンド", icon: "📋", desc: "コマンド選択型" },
  { id: "realtime_action", label: "リアルタイム", icon: "⚡", desc: "アクション型" },
  { id: "tactics", label: "タクティクス", icon: "♟️", desc: "戦略配置型" },
  { id: "deckbuild", label: "デッキ構築", icon: "🃏", desc: "カードバトル" },
  { id: "janken", label: "属性相性", icon: "✊", desc: "じゃんけん型" },
  { id: "auto", label: "オートバトル", icon: "🤖", desc: "自動戦闘" },
] as const;

// 9. 育成・成長要素
export const GROWTH_ELEMENTS = [
  { id: "exp_level", label: "経験値・レベル", icon: "📊", desc: "EXPで成長" },
  { id: "skilltree", label: "スキルツリー", icon: "🌳", desc: "技能分岐" },
  { id: "equipment", label: "装備・強化", icon: "🛡️", desc: "アイテム強化" },
  { id: "evolution", label: "進化・変身", icon: "🦋", desc: "進化システム" },
  { id: "statalloc", label: "ステ振り", icon: "📈", desc: "STR/INT等割り振り" },
  { id: "collection", label: "図鑑", icon: "📖", desc: "コレクション要素" },
] as const;

// 10. 経済システム
export const ECONOMY_SYSTEMS = [
  { id: "currency", label: "通貨", icon: "💰", desc: "ゴールド・コイン" },
  { id: "craft", label: "クラフト", icon: "🔨", desc: "素材収集・制作" },
  { id: "shop", label: "ショップ", icon: "🏪", desc: "売買システム" },
  { id: "gacha", label: "ガチャ", icon: "🎰", desc: "ランダム報酬" },
  { id: "stamina", label: "スタミナ", icon: "⚡", desc: "エネルギー制" },
] as const;

// 11. ソーシャル要素
export const SOCIAL_FEATURES = [
  { id: "friend", label: "フレンド", icon: "👥", desc: "友達機能" },
  { id: "guild", label: "ギルド", icon: "🏛️", desc: "チーム・組織" },
  { id: "chat", label: "チャット", icon: "💬", desc: "メッセージ" },
  { id: "leaderboard", label: "ランキング", icon: "🏆", desc: "順位表" },
  { id: "matching", label: "マッチング", icon: "🔗", desc: "対戦相手探し" },
  { id: "likes", label: "いいね", icon: "❤️", desc: "評価機能" },
] as const;

// 12. 画面レイアウト
export const SCREEN_LAYOUTS = [
  { id: "portrait", label: "縦型", icon: "📱", desc: "スマホ最適化" },
  { id: "landscape", label: "横型", icon: "🖥️", desc: "PC最適化" },
  { id: "responsive", label: "レスポンシブ", icon: "📐", desc: "自動適応" },
] as const;

// 13. 操作方法
export const CONTROL_METHODS = [
  { id: "tap", label: "タップ", icon: "👆", desc: "タップ/クリック" },
  { id: "swipe", label: "スワイプ", icon: "👉", desc: "スワイプ操作" },
  { id: "keyboard", label: "キーボード", icon: "⌨️", desc: "キー入力" },
  { id: "dragdrop", label: "ドラッグ", icon: "✋", desc: "ドラッグ&ドロップ" },
] as const;

// 14. サウンド・演出
export const SOUND_EFFECTS = [
  { id: "bgm", label: "BGM", icon: "🎵", desc: "背景音楽" },
  { id: "se", label: "効果音", icon: "🔊", desc: "SE" },
  { id: "screenshake", label: "画面振動", icon: "📳", desc: "シェイク" },
  { id: "particle", label: "パーティクル", icon: "✨", desc: "粒子演出" },
  { id: "animation_strong", label: "演出（強）", icon: "💥", desc: "派手なアニメ" },
  { id: "animation_light", label: "演出（軽）", icon: "🌟", desc: "控えめなアニメ" },
] as const;

// 15. 保存システム
export const SAVE_SYSTEMS = [
  { id: "autosave", label: "オートセーブ", icon: "💾", desc: "自動保存" },
  { id: "manual", label: "手動セーブ", icon: "📝", desc: "任意保存" },
  { id: "multislot", label: "複数スロット", icon: "📂", desc: "複数データ" },
] as const;

// 16. リプレイ性
export const REPLAY_ELEMENTS = [
  { id: "random_gen", label: "ランダム生成", icon: "🎲", desc: "毎回違う展開" },
  { id: "achievement", label: "実績", icon: "🏅", desc: "トロフィー" },
  { id: "hidden", label: "隠し要素", icon: "🔍", desc: "やりこみ" },
  { id: "newgameplus", label: "周回強化", icon: "🔄", desc: "ニューゲーム+" },
] as const;

// 17. カスタマイズ性
export const CUSTOMIZE_OPTIONS = [
  { id: "character_maker", label: "キャラメイク", icon: "🧑‍🎨", desc: "名前・見た目" },
  { id: "difficulty_custom", label: "難易度調整", icon: "🎚️", desc: "自由設定" },
  { id: "house_rule", label: "ルール変更", icon: "📜", desc: "ハウスルール" },
] as const;

// ====== ウィザードステップ定義 ======
export const WIZARD_STEPS = [
  { id: "genre", label: "ジャンル", number: 1 },
  { id: "mode", label: "モード", number: 2 },
  { id: "world", label: "世界観", number: 3 },
  { id: "visual", label: "ビジュアル", number: 4 },
  { id: "system", label: "システム", number: 5 },
  { id: "growth", label: "育成・経済", number: 6 },
  { id: "social", label: "ソーシャル", number: 7 },
  { id: "ux", label: "操作・演出", number: 8 },
  { id: "meta", label: "保存・周回", number: 9 },
  { id: "confirm", label: "確認", number: 10 },
] as const;

// ====== ランキング報酬 ======
export const RANKING_REWARDS = [
  { rank: "🥇 1位", reward: "プレミアムバッジ + 10,000コイン + 限定アバター" },
  { rank: "🥈 2位", reward: "ゴールドバッジ + 5,000コイン" },
  { rank: "🥉 3位", reward: "シルバーバッジ + 2,500コイン" },
  { rank: "4〜10位", reward: "ブロンズバッジ + 1,000コイン" },
];

// ====== サンプルアプリ ======
export const SAMPLE_APPS = [
  {
    id: "app1", title: "ドラゴンバトラー", genre: "battle" as const, author: "GameMaster01",
    rating: 4.8, plays: 12400, desc: "ドラゴンを操作して敵と戦うターン制バトル",
    thumbnail: "⚔️🐉", createdAt: "2026-02-28", likes: 890, comments: 234,
    theme: "fantasy" as const,
  },
  {
    id: "app2", title: "にゃんこ育成記", genre: "nurture" as const, author: "CatLover99",
    rating: 4.6, plays: 8900, desc: "かわいい猫を育てて冒険に出そう",
    thumbnail: "🌱🐱", createdAt: "2026-02-27", likes: 672, comments: 189,
    theme: "animal" as const,
  },
  {
    id: "app3", title: "エレメントカードバトル", genre: "card" as const, author: "CardShark",
    rating: 4.9, plays: 15600, desc: "属性カードを集めてデッキを構築し対戦",
    thumbnail: "🃏🔥", createdAt: "2026-02-26", likes: 1230, comments: 456,
    theme: "fantasy" as const,
  },
  {
    id: "app4", title: "漢字パズルマスター", genre: "puzzle" as const, author: "KanjiKing",
    rating: 4.5, plays: 6700, desc: "漢字を組み合わせて熟語を作るパズル",
    thumbnail: "🧩📝", createdAt: "2026-02-25", likes: 445, comments: 98,
    theme: "modern" as const,
  },
  {
    id: "app5", title: "勇者の冒険譚", genre: "rpg" as const, author: "RPGFan2026",
    rating: 4.7, plays: 11200, desc: "AIが生成する無限ダンジョンRPG",
    thumbnail: "🗡️🏰", createdAt: "2026-02-24", likes: 980, comments: 312,
    theme: "medieval" as const,
  },
  {
    id: "app6", title: "雑学チャレンジ", genre: "quiz" as const, author: "QuizMaster",
    rating: 4.3, plays: 5400, desc: "AIが出題する雑学クイズ100問",
    thumbnail: "❓🧠", createdAt: "2026-02-23", likes: 334, comments: 67,
    theme: "modern" as const,
  },
];
