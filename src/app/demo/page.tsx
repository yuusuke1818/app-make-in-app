"use client";

import { useState } from "react";
import { BattleGame, NurtureGame, PuzzleGame, QuizGame, SimulatorGame } from "@/components/StubGames";

// ====== 全要素定義（20カテゴリ以上） ======
const ELEMENTS = {
  genre: {
    label: "① ジャンル", icon: "🎮", type: "single" as const,
    items: [
      { id: "battle", label: "バトルRPG", icon: "⚔️" },
      { id: "nurture", label: "育成", icon: "🌱" },
      { id: "puzzle", label: "パズル", icon: "🧩" },
      { id: "quiz", label: "クイズ", icon: "❓" },
      { id: "simulator", label: "経営シミュレータ", icon: "🏗️" },
      { id: "card", label: "カードゲーム", icon: "🃏" },
      { id: "rpg", label: "ダンジョンRPG", icon: "🗡️" },
      { id: "rhythm", label: "リズム", icon: "🎵" },
      { id: "action", label: "アクション", icon: "💥" },
      { id: "horror", label: "ホラー", icon: "👻" },
    ],
  },
  theme: {
    label: "② 世界観", icon: "🌍", type: "single" as const,
    items: [
      { id: "fantasy", label: "ファンタジー", icon: "🧙" },
      { id: "scifi", label: "SF・宇宙", icon: "🚀" },
      { id: "japanese", label: "和風・侍", icon: "⛩️" },
      { id: "modern", label: "現代", icon: "🏙️" },
      { id: "horror_theme", label: "ダーク・ホラー", icon: "🌙" },
      { id: "animal", label: "動物・自然", icon: "🐾" },
      { id: "cyberpunk", label: "サイバーパンク", icon: "🌃" },
      { id: "medieval", label: "中世ヨーロッパ", icon: "🏰" },
      { id: "underwater", label: "海底・水中", icon: "🐠" },
      { id: "steampunk", label: "スチームパンク", icon: "⚙️" },
    ],
  },
  difficulty: {
    label: "③ 難易度", icon: "📊", type: "single" as const,
    items: [
      { id: "easy", label: "イージー", icon: "😊" },
      { id: "normal", label: "ノーマル", icon: "😐" },
      { id: "hard", label: "ハード", icon: "😤" },
      { id: "nightmare", label: "ナイトメア", icon: "💀" },
      { id: "auto", label: "自動調整", icon: "🤖" },
    ],
  },
  battleSystem: {
    label: "④ 戦闘システム", icon: "⚔️", type: "single" as const,
    items: [
      { id: "turn", label: "ターン制", icon: "🔄" },
      { id: "realtime", label: "リアルタイム", icon: "⚡" },
      { id: "tactics", label: "タクティクス", icon: "♟️" },
      { id: "deckbuild", label: "デッキ構築", icon: "🃏" },
      { id: "janken", label: "属性相性", icon: "✊" },
      { id: "auto_battle", label: "オート", icon: "🤖" },
    ],
  },
  progression: {
    label: "⑤ 進行システム", icon: "📈", type: "single" as const,
    items: [
      { id: "levelup", label: "レベルアップ制", icon: "📈" },
      { id: "stageclear", label: "ステージクリア制", icon: "🏁" },
      { id: "openworld", label: "自由探索型", icon: "🗺️" },
      { id: "wave", label: "ウェーブ制", icon: "🌊" },
      { id: "endless", label: "エンドレス", icon: "♾️" },
    ],
  },
  growth: {
    label: "⑥ 育成・成長", icon: "🌳", type: "multi" as const,
    items: [
      { id: "exp", label: "経験値・レベル", icon: "📊" },
      { id: "skilltree", label: "スキルツリー", icon: "🌳" },
      { id: "equipment", label: "装備・強化", icon: "🛡️" },
      { id: "evolution", label: "進化・変身", icon: "🦋" },
      { id: "statalloc", label: "ステ振り", icon: "📈" },
      { id: "collection", label: "図鑑・コレクション", icon: "📖" },
    ],
  },
  economy: {
    label: "⑦ 経済・リソース", icon: "💰", type: "multi" as const,
    items: [
      { id: "currency", label: "通貨", icon: "💰" },
      { id: "craft", label: "クラフト・合成", icon: "🔨" },
      { id: "shop", label: "ショップ", icon: "🏪" },
      { id: "gacha", label: "ガチャ", icon: "🎰" },
      { id: "trade", label: "トレード", icon: "🤝" },
    ],
  },
  artStyle: {
    label: "⑧ ビジュアル", icon: "🎨", type: "single" as const,
    items: [
      { id: "emoji", label: "絵文字ベース", icon: "😀" },
      { id: "pixel", label: "ドット絵風", icon: "🎮" },
      { id: "minimal", label: "ミニマル", icon: "◻️" },
      { id: "neon", label: "ネオン・グロウ", icon: "💡" },
      { id: "sketch", label: "手描き風", icon: "✏️" },
    ],
  },
  colorScheme: {
    label: "⑨ カラー", icon: "🎨", type: "single" as const,
    items: [
      { id: "dark", label: "ダーク", icon: "🌑" },
      { id: "light", label: "ライト", icon: "☀️" },
      { id: "pastel", label: "パステル", icon: "🌸" },
      { id: "vivid", label: "ビビッド", icon: "🌈" },
      { id: "retro", label: "レトロ", icon: "📺" },
    ],
  },
  sound: {
    label: "⑩ サウンド・演出", icon: "🔊", type: "multi" as const,
    items: [
      { id: "bgm", label: "BGM", icon: "🎵" },
      { id: "se", label: "効果音", icon: "🔊" },
      { id: "shake", label: "画面振動", icon: "📳" },
      { id: "particle", label: "パーティクル", icon: "✨" },
      { id: "animation", label: "派手なアニメ", icon: "💥" },
    ],
  },
  social: {
    label: "⑪ ソーシャル", icon: "👥", type: "multi" as const,
    items: [
      { id: "ranking", label: "ランキング", icon: "🏆" },
      { id: "friend", label: "フレンド", icon: "👥" },
      { id: "guild", label: "ギルド", icon: "🏛️" },
      { id: "pvp", label: "対戦", icon: "⚡" },
      { id: "likes", label: "いいね", icon: "❤️" },
    ],
  },
  controls: {
    label: "⑫ 操作方法", icon: "🕹️", type: "multi" as const,
    items: [
      { id: "tap", label: "タップ", icon: "👆" },
      { id: "swipe", label: "スワイプ", icon: "👉" },
      { id: "keyboard", label: "キーボード", icon: "⌨️" },
      { id: "dragdrop", label: "ドラッグ", icon: "✋" },
    ],
  },
  save: {
    label: "⑬ セーブ", icon: "💾", type: "single" as const,
    items: [
      { id: "autosave", label: "オートセーブ", icon: "💾" },
      { id: "manual", label: "手動セーブ", icon: "📝" },
      { id: "multislot", label: "複数スロット", icon: "📂" },
    ],
  },
  replay: {
    label: "⑭ リプレイ性", icon: "🔄", type: "multi" as const,
    items: [
      { id: "random", label: "ランダム生成", icon: "🎲" },
      { id: "achievement", label: "実績", icon: "🏅" },
      { id: "hidden", label: "隠し要素", icon: "🔍" },
      { id: "newgameplus", label: "ニューゲーム+", icon: "🔄" },
    ],
  },
  gameMode: {
    label: "⑮ ゲームモード", icon: "🎯", type: "multi" as const,
    items: [
      { id: "single", label: "シングル", icon: "🧑" },
      { id: "story", label: "ストーリー", icon: "📖" },
      { id: "timeattack", label: "タイムアタック", icon: "⏱️" },
      { id: "endless_mode", label: "エンドレス", icon: "♾️" },
      { id: "daily", label: "デイリー", icon: "📅" },
    ],
  },
  customize: {
    label: "⑯ カスタマイズ", icon: "🧑‍🎨", type: "multi" as const,
    items: [
      { id: "chara", label: "キャラメイク", icon: "🧑‍🎨" },
      { id: "difficulty_custom", label: "難易度調整", icon: "🎚️" },
      { id: "house_rule", label: "ルール変更", icon: "📜" },
    ],
  },
  mood: {
    label: "⑰ 雰囲気", icon: "✨", type: "single" as const,
    items: [
      { id: "serious", label: "シリアス", icon: "😠" },
      { id: "comedy", label: "コメディ", icon: "😂" },
      { id: "healing", label: "癒し系", icon: "🌿" },
      { id: "exciting", label: "熱血・興奮", icon: "🔥" },
      { id: "mysterious", label: "ミステリアス", icon: "🔮" },
    ],
  },
  target: {
    label: "⑱ ターゲット", icon: "🎯", type: "single" as const,
    items: [
      { id: "casual", label: "カジュアル", icon: "😊" },
      { id: "core", label: "コアゲーマー", icon: "🎮" },
      { id: "kids", label: "子ども向け", icon: "🧒" },
      { id: "all", label: "全年齢", icon: "👨‍👩‍👧‍👦" },
    ],
  },
  uniqueFeature: {
    label: "⑲ ユニーク要素", icon: "💡", type: "multi" as const,
    items: [
      { id: "weather", label: "天候変化", icon: "🌦️" },
      { id: "day_night", label: "昼夜サイクル", icon: "🌙" },
      { id: "permadeath", label: "パーマデス", icon: "💀" },
      { id: "timerewind", label: "時間巻き戻し", icon: "⏪" },
      { id: "multiending", label: "マルチエンド", icon: "🔀" },
      { id: "proceduralgen", label: "自動生成ステージ", icon: "🎲" },
    ],
  },
  screenLayout: {
    label: "⑳ 画面レイアウト", icon: "📱", type: "single" as const,
    items: [
      { id: "portrait", label: "縦型スマホ", icon: "📱" },
      { id: "landscape", label: "横型PC", icon: "🖥️" },
      { id: "responsive", label: "自動適応", icon: "📐" },
    ],
  },
};

const ELEMENT_KEYS = Object.keys(ELEMENTS) as (keyof typeof ELEMENTS)[];

// スタブ：ジャンルに応じた仮コンポーネント
const STUB_MAP: Record<string, React.ComponentType> = {
  battle: BattleGame, nurture: NurtureGame, puzzle: PuzzleGame,
  quiz: QuizGame, simulator: SimulatorGame,
  card: BattleGame, rpg: BattleGame, rhythm: QuizGame,
  action: PuzzleGame, horror: BattleGame,
};

export default function DemoPage() {
  // 選択状態
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [freeInput, setFreeInput] = useState("");
  const [appName, setAppName] = useState("");
  // フロー状態
  const [step, setStep] = useState<"select" | "generating" | "playing">("select");
  const [genProgress, setGenProgress] = useState(0);
  const [genStatus, setGenStatus] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  // ウィザードステップ
  const [wizStep, setWizStep] = useState(0);
  // AI生成モード切替
  const [useAI, setUseAI] = useState(false);

  const toggle = (key: string, id: string, type: "single" | "multi") => {
    setSelections(prev => {
      const cur = prev[key] || [];
      if (type === "single") return { ...prev, [key]: [id] };
      return { ...prev, [key]: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] };
    });
  };

  const isSelected = (key: string, id: string) => (selections[key] || []).includes(id);

  // ウィザードのグループ分け
  const wizGroups = [
    { keys: ["genre"], title: "ジャンルを選択" },
    { keys: ["theme", "mood"], title: "世界観と雰囲気" },
    { keys: ["difficulty", "target"], title: "難易度とターゲット" },
    { keys: ["battleSystem", "progression"], title: "戦闘と進行" },
    { keys: ["growth", "economy"], title: "育成と経済" },
    { keys: ["artStyle", "colorScheme"], title: "ビジュアル" },
    { keys: ["sound", "controls"], title: "操作と演出" },
    { keys: ["social", "gameMode"], title: "ソーシャルとモード" },
    { keys: ["save", "replay", "customize"], title: "セーブ・リプレイ・カスタマイズ" },
    { keys: ["uniqueFeature", "screenLayout"], title: "ユニーク要素とレイアウト" },
  ];

  const totalWizSteps = wizGroups.length + 1; // +1 for 確認画面

  // 生成実行
  const generate = async () => {
    setStep("generating");
    setGenProgress(0);
    setSelectedGenre((selections.genre || ["battle"])[0]);

    const steps = [
      { p: 10, s: "選択要素を解析中..." },
      { p: 25, s: "世界観を構築中..." },
      { p: 40, s: "ゲームロジック生成中..." },
      { p: 55, s: "キャラクター・敵を配置中..." },
      { p: 70, s: "UIデザインを適用中..." },
      { p: 85, s: "バランス調整中..." },
      { p: 95, s: "最終仕上げ..." },
      { p: 100, s: "完了！" },
    ];

    if (useAI) {
      // 実際のAI生成（将来用）
      // const res = await fetch("/api/generate", { ... });
    }

    // スタブ：プログレスアニメーション
    for (const st of steps) {
      await new Promise(r => setTimeout(r, 350));
      setGenProgress(st.p);
      setGenStatus(st.s);
    }

    await new Promise(r => setTimeout(r, 400));
    setStep("playing");
  };

  // 選択要素のサマリー
  const buildSummary = () => {
    const items: string[] = [];
    ELEMENT_KEYS.forEach(key => {
      const sel = selections[key] || [];
      if (sel.length === 0) return;
      const el = ELEMENTS[key];
      const labels = sel.map(id => el.items.find(i => i.id === id)?.label || id);
      items.push(`${el.icon}${el.label.replace(/^[①-⑳]\s*/, "")}: ${labels.join(", ")}`);
    });
    if (freeInput) items.push(`✏️ 自由入力: ${freeInput}`);
    return items;
  };

  // ====== プレイ画面 ======
  if (step === "playing") {
    const GameComponent = STUB_MAP[selectedGenre] || BattleGame;
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#eee", fontFamily: "'Noto Sans JP', sans-serif" }}>
        <div style={{ background: "#111", borderBottom: "1px solid #222", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => { setStep("select"); setWizStep(0); }} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 14 }}>← 戻る</button>
          <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{appName || "生成されたゲーム"}</span>
          <span style={{ fontSize: 10, color: useAI ? "#4ECDC4" : "#FF8844", background: "#222", padding: "2px 8px", borderRadius: 4 }}>{useAI ? "AI GENERATED" : "PROTOTYPE"}</span>
        </div>
        <GameComponent />
      </div>
    );
  }

  // ====== 生成中画面 ======
  if (step === "generating") {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#eee", fontFamily: "'Noto Sans JP', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ fontSize: 56, marginBottom: 16, animation: "spin 2s linear infinite" }}>⚡</div>
        <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
        <h3 style={{ marginBottom: 8, fontSize: 18 }}>AIがゲームを生成中...</h3>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>{genStatus}</p>
        <div style={{ height: 8, background: "#333", borderRadius: 4, width: "100%", maxWidth: 350, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #FF6B6B, #4ECDC4)", width: `${genProgress}%`, transition: "width 0.3s" }} />
        </div>
        <span style={{ fontSize: 12, color: "#666" }}>{genProgress}%</span>
        {/* 選択した要素を表示 */}
        <div style={{ marginTop: 24, background: "#111", borderRadius: 12, padding: 12, maxWidth: 400, width: "100%", maxHeight: 200, overflowY: "auto" }}>
          <div style={{ fontSize: 11, color: "#666", marginBottom: 6 }}>選択された要素:</div>
          {buildSummary().map((s, i) => <div key={i} style={{ fontSize: 11, color: "#aaa", marginBottom: 3 }}>{s}</div>)}
        </div>
      </div>
    );
  }

  // ====== 要素選択画面（ウィザード方式） ======
  const currentGroup = wizStep < wizGroups.length ? wizGroups[wizStep] : null;
  const isConfirmStep = wizStep === wizGroups.length;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#eee", fontFamily: "'Noto Sans JP', sans-serif" }}>
      <header style={{ background: "linear-gradient(135deg, #1a0a2e, #0a1a3e)", padding: "14px 20px", borderBottom: "1px solid #222", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, background: "linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
          ⚡ A.M.I.A
        </h1>
        <p style={{ fontSize: 11, color: "#888", margin: "4px 0 0" }}>20以上の要素を組み合わせてAIがゲームを生成</p>
      </header>

      <main style={{ maxWidth: 650, margin: "0 auto", padding: "16px 16px 100px" }}>
        {/* プログレスバー */}
        <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
          {Array.from({ length: totalWizSteps }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= wizStep ? "linear-gradient(90deg, #FF6B6B, #4ECDC4)" : "#333", transition: "background 0.3s" }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#666", marginBottom: 16 }}>
          ステップ {wizStep + 1}/{totalWizSteps} — {isConfirmStep ? "確認＆生成" : currentGroup?.title}
        </div>

        {/* 確認画面 */}
        {isConfirmStep && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>📝 設定確認＆生成</h2>

            {/* アプリ名 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>ゲーム名（任意）</label>
              <input value={appName} onChange={e => setAppName(e.target.value)} placeholder="例：宇宙戦記RPG"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #333", background: "#111", color: "#eee", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* 自由入力 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>✏️ 自由入力（AIへの追加指示）</label>
              <textarea value={freeInput} onChange={e => setFreeInput(e.target.value)}
                placeholder="例：主人公は猫で、敵はネズミの軍団。必殺技は「にゃんこパンチ」。倒すとレアアイテムが出る仕組みにして。"
                style={{ width: "100%", minHeight: 80, padding: "10px 12px", borderRadius: 8, border: "1px solid #333", background: "#111", color: "#eee", fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
            </div>

            {/* AI切替 */}
            <div style={{ marginBottom: 16, background: "#111", borderRadius: 10, padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setUseAI(!useAI)}
                style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: useAI ? "#4ECDC4" : "#333", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: useAI ? 23 : 3, transition: "left 0.2s" }} />
              </button>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>AI生成モード {useAI ? "ON" : "OFF"}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{useAI ? "Claude APIで本物のゲームを生成（API消費あり）" : "プロトタイプ表示（API消費なし）"}</div>
              </div>
            </div>

            {/* サマリー */}
            <div style={{ background: "#111", borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#4ECDC4", marginBottom: 8 }}>選択された要素</div>
              {buildSummary().length > 0 ? (
                buildSummary().map((s, i) => <div key={i} style={{ fontSize: 12, color: "#ccc", marginBottom: 4, paddingLeft: 4 }}>{s}</div>)
              ) : (
                <div style={{ fontSize: 12, color: "#666" }}>要素が選択されていません（デフォルト設定で生成）</div>
              )}
            </div>
          </div>
        )}

        {/* 要素選択画面 */}
        {currentGroup && currentGroup.keys.map(key => {
          const el = ELEMENTS[key as keyof typeof ELEMENTS];
          if (!el) return null;
          return (
            <div key={key} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{el.icon} {el.label}{el.type === "multi" ? "（複数可）" : ""}</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {el.items.map(item => {
                  const sel = isSelected(key, item.id);
                  return (
                    <button key={item.id} onClick={() => toggle(key, item.id, el.type)}
                      style={{
                        padding: "8px 14px", borderRadius: 10,
                        border: `2px solid ${sel ? "#4ECDC4" : "#333"}`,
                        background: sel ? "#4ECDC415" : "#111",
                        color: sel ? "#4ECDC4" : "#ccc",
                        cursor: "pointer", fontSize: 13, fontWeight: sel ? 700 : 400,
                        transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6,
                      }}>
                      <span>{item.icon}</span><span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ナビゲーションボタン */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#111", borderTop: "1px solid #222", padding: "12px 16px", display: "flex", gap: 10, justifyContent: "center" }}>
          {wizStep > 0 && (
            <button onClick={() => setWizStep(p => p - 1)}
              style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #444", background: "none", color: "#aaa", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              ← 戻る
            </button>
          )}
          {wizStep < totalWizSteps - 1 ? (
            <button onClick={() => setWizStep(p => p + 1)}
              style={{ flex: 1, maxWidth: 300, padding: "12px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #4ECDC4, #45B7D1)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
              次へ →
            </button>
          ) : (
            <button onClick={generate}
              style={{ flex: 1, maxWidth: 300, padding: "12px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #FF6B6B, #4ECDC4)", color: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 800 }}>
              ⚡ ゲームを生成する
            </button>
          )}
          {wizStep < totalWizSteps - 1 && (
            <button onClick={() => setWizStep(totalWizSteps - 1)}
              style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #333", background: "none", color: "#666", cursor: "pointer", fontSize: 12 }}>
              スキップ ≫
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
