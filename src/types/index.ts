// ====== アプリ作成時の設定項目（全17カテゴリ対応） ======

// 1. ジャンル
export type Genre =
  | "battle" | "nurture" | "card" | "puzzle" | "rpg"
  | "quiz" | "rhythm" | "simulator" | "custom";

// 2. ゲームモード
export type GameMode =
  | "single" | "multi" | "coop" | "timeattack"
  | "endless" | "story" | "daily";

// 3. 難易度
export type Difficulty = "easy" | "normal" | "hard" | "nightmare" | "auto";

// 4. 進行システム
export type ProgressionSystem =
  | "levelup" | "stageclear" | "openworld" | "wave" | "turnbased" | "realtime";

// 5. 世界観・テーマ
export type Theme =
  | "fantasy" | "scifi" | "japanese" | "modern" | "horror"
  | "animal" | "space" | "steampunk" | "cyberpunk" | "medieval" | "postapocalypse";

// 6. アートスタイル
export type ArtStyle =
  | "pixel" | "anime" | "minimal" | "emoji" | "sketch" | "neon";

// 7. カラースキーム
export type ColorScheme =
  | "dark" | "light" | "pastel" | "vivid" | "mono" | "retro";

// 8. 戦闘システム
export type BattleSystem =
  | "turncommand" | "realtime_action" | "tactics"
  | "deckbuild" | "janken" | "auto";

// 9. 育成・成長要素
export type GrowthElement =
  | "exp_level" | "skilltree" | "equipment" | "evolution"
  | "statalloc" | "collection";

// 10. 経済・リソース
export type EconomySystem =
  | "currency" | "craft" | "shop" | "gacha" | "stamina";

// 11. ソーシャル要素
export type SocialFeature =
  | "friend" | "guild" | "chat" | "leaderboard" | "matching" | "likes";

// 12. 画面レイアウト
export type ScreenLayout = "portrait" | "landscape" | "responsive";

// 13. 操作方法
export type ControlMethod = "tap" | "swipe" | "keyboard" | "dragdrop";

// 14. サウンド・演出
export type SoundEffect =
  | "bgm" | "se" | "screenshake" | "particle" | "animation_strong" | "animation_light";

// 15. 保存・データ
export type SaveSystem = "autosave" | "manual" | "multislot";

// 16. リプレイ性
export type ReplayElement =
  | "random_gen" | "achievement" | "hidden" | "newgameplus";

// 17. カスタマイズ性
export type CustomizeOption =
  | "character_maker" | "difficulty_custom" | "house_rule";

// ====== アプリ作成オプション ======
export interface AppCreationOptions {
  name: string;
  genre: Genre;
  gameMode: GameMode[];
  difficulty: Difficulty;
  progression: ProgressionSystem;
  theme: Theme;
  artStyle: ArtStyle;
  colorScheme: ColorScheme;
  battleSystem?: BattleSystem;
  growthElements: GrowthElement[];
  economy: EconomySystem[];
  social: SocialFeature[];
  screenLayout: ScreenLayout;
  controls: ControlMethod[];
  sounds: SoundEffect[];
  saveSystem: SaveSystem;
  replayElements: ReplayElement[];
  customization: CustomizeOption[];
  customPrompt?: string;
}

// ====== 生成済みアプリ ======
export interface GeneratedApp {
  id: string;
  title: string;
  options: AppCreationOptions;
  code: string; // AI生成されたReactコンポーネントコード
  createdAt: string;
  version: number;
}

// ====== 公開アプリ ======
export interface PublishedApp {
  id: string;
  title: string;
  author: string;
  genre: Genre;
  theme: Theme;
  rating: number;
  plays: number;
  likes: number;
  comments: number;
  desc: string;
  thumbnail: string;
  createdAt: string;
  options: AppCreationOptions;
  generatedApp?: GeneratedApp;
}

// ====== ユーザ ======
export interface User {
  id: string;
  name: string;
  avatar: string;
  coins: number;
  badges: string[];
  createdApps: string[];
}

// ====== 改良リクエスト ======
export interface ImprovementRequest {
  appId: string;
  instruction: string; // ユーザの改良指示
  targetElements: string[]; // 変更対象の要素
}
