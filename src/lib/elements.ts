// ジャンル連動要素定義
// ジャンルに応じて表示する要素カテゴリとアイテムを制御

export interface ElementItem {
  id: string;
  label: string;
  icon: string;
}

export interface ElementCategory {
  key: string;
  label: string;
  icon: string;
  type: "single" | "multi";
  items: ElementItem[];
  genres?: string[]; // 表示対象ジャンル（未指定=全ジャンル）
}

// ジャンル定義
export const GENRES: ElementItem[] = [
  { id: "battle", label: "バトルRPG", icon: "⚔️" },
  { id: "card", label: "カードゲーム", icon: "🃏" },
  { id: "nurture", label: "育成シミュレーション", icon: "🌱" },
  { id: "puzzle", label: "パズル", icon: "🧩" },
  { id: "rpg", label: "ダンジョンRPG", icon: "🗡️" },
  { id: "quiz", label: "クイズ", icon: "❓" },
  { id: "rhythm", label: "リズムゲーム", icon: "🎵" },
  { id: "simulator", label: "経営シミュレータ", icon: "🏗️" },
  { id: "action", label: "アクション", icon: "💥" },
  { id: "horror", label: "ホラー", icon: "👻" },
];

// ジャンル別サムネイル
export const GENRE_THUMBNAILS: Record<string, string> = {
  battle: "⚔️", card: "🃏", nurture: "🌱", puzzle: "🧩",
  rpg: "🗡️", quiz: "❓", rhythm: "🎵", simulator: "🏗️",
  action: "💥", horror: "👻",
};

// 要素カテゴリ定義（genres配列があればそのジャンルのみ表示）
export const ELEMENT_CATEGORIES: ElementCategory[] = [
  {
    key: "theme", label: "世界観", icon: "🌍", type: "single",
    items: [
      { id: "fantasy", label: "ファンタジー", icon: "🧙" },
      { id: "scifi", label: "SF・宇宙", icon: "🚀" },
      { id: "japanese", label: "和風", icon: "⛩️" },
      { id: "modern", label: "現代", icon: "🏙️" },
      { id: "dark", label: "ダーク", icon: "🌙" },
      { id: "animal", label: "動物・自然", icon: "🐾" },
      { id: "cyberpunk", label: "サイバーパンク", icon: "🌃" },
      { id: "medieval", label: "中世", icon: "🏰" },
      { id: "underwater", label: "海底", icon: "🐠" },
    ],
  },
  {
    key: "difficulty", label: "難易度", icon: "📊", type: "single",
    items: [
      { id: "easy", label: "イージー", icon: "😊" },
      { id: "normal", label: "ノーマル", icon: "😐" },
      { id: "hard", label: "ハード", icon: "😤" },
      { id: "nightmare", label: "ナイトメア", icon: "💀" },
    ],
  },
  {
    key: "battleSystem", label: "戦闘システム", icon: "⚔️", type: "single",
    genres: ["battle", "card", "rpg", "action", "horror"],
    items: [
      { id: "turn", label: "ターン制", icon: "🔄" },
      { id: "realtime", label: "リアルタイム", icon: "⚡" },
      { id: "tactics", label: "タクティクス", icon: "♟️" },
      { id: "deckbuild", label: "デッキ構築", icon: "🃏" },
      { id: "janken", label: "属性相性", icon: "✊" },
    ],
  },
  {
    key: "progression", label: "進行システム", icon: "📈", type: "single",
    items: [
      { id: "levelup", label: "レベルアップ制", icon: "📈" },
      { id: "stageclear", label: "ステージクリア制", icon: "🏁" },
      { id: "openworld", label: "自由探索型", icon: "🗺️" },
      { id: "endless", label: "エンドレス", icon: "♾️" },
    ],
  },
  {
    key: "growth", label: "育成・成長", icon: "🌳", type: "multi",
    genres: ["battle", "rpg", "nurture", "card", "action"],
    items: [
      { id: "exp", label: "経験値・レベル", icon: "📊" },
      { id: "skilltree", label: "スキルツリー", icon: "🌳" },
      { id: "equipment", label: "装備・強化", icon: "🛡️" },
      { id: "evolution", label: "進化・変身", icon: "🦋" },
      { id: "collection", label: "図鑑", icon: "📖" },
    ],
  },
  {
    key: "economy", label: "経済・リソース", icon: "💰", type: "multi",
    genres: ["battle", "rpg", "nurture", "simulator", "card"],
    items: [
      { id: "currency", label: "通貨", icon: "💰" },
      { id: "craft", label: "クラフト", icon: "🔨" },
      { id: "shop", label: "ショップ", icon: "🏪" },
      { id: "gacha", label: "ガチャ", icon: "🎰" },
    ],
  },
  {
    key: "artStyle", label: "ビジュアル", icon: "🎨", type: "single",
    items: [
      { id: "emoji", label: "絵文字ベース", icon: "😀" },
      { id: "pixel", label: "ドット絵風", icon: "🎮" },
      { id: "minimal", label: "ミニマル", icon: "◻️" },
      { id: "neon", label: "ネオン", icon: "💡" },
    ],
  },
  {
    key: "colorScheme", label: "カラー", icon: "🎨", type: "single",
    items: [
      { id: "dark", label: "ダーク", icon: "🌑" },
      { id: "light", label: "ライト", icon: "☀️" },
      { id: "pastel", label: "パステル", icon: "🌸" },
      { id: "vivid", label: "ビビッド", icon: "🌈" },
    ],
  },
  {
    key: "mood", label: "雰囲気", icon: "✨", type: "single",
    items: [
      { id: "serious", label: "シリアス", icon: "😠" },
      { id: "comedy", label: "コメディ", icon: "😂" },
      { id: "healing", label: "癒し系", icon: "🌿" },
      { id: "exciting", label: "熱血", icon: "🔥" },
      { id: "mysterious", label: "ミステリアス", icon: "🔮" },
    ],
  },
  {
    key: "uniqueFeature", label: "ユニーク要素", icon: "💡", type: "multi",
    items: [
      { id: "weather", label: "天候変化", icon: "🌦️" },
      { id: "permadeath", label: "パーマデス", icon: "💀" },
      { id: "multiending", label: "マルチエンド", icon: "🔀" },
      { id: "procedural", label: "自動生成", icon: "🎲" },
      { id: "timerewind", label: "時間巻き戻し", icon: "⏪" },
    ],
  },
];

// ジャンルに応じたカテゴリフィルタリング
export function getFilteredCategories(genreId: string): ElementCategory[] {
  return ELEMENT_CATEGORIES.filter(cat => {
    if (!cat.genres) return true; // genres未指定=全ジャンル表示
    return cat.genres.includes(genreId);
  });
}
