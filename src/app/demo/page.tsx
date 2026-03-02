"use client";

import { useState, useRef, useEffect } from "react";

const GENRES = [
  { id: "battle", label: "バトルRPG", icon: "⚔️", color: "#FF4444", preset: { genre: "battle", theme: "fantasy", battleSystem: "turncommand", progression: "levelup", artStyle: "emoji", colorScheme: "dark" } },
  { id: "card", label: "カードゲーム", icon: "🃏", color: "#4488FF", preset: { genre: "card", theme: "fantasy", battleSystem: "deckbuild", progression: "stageclear", artStyle: "emoji", colorScheme: "dark" } },
  { id: "nurture", label: "育成シミュレーション", icon: "🌱", color: "#44BB44", preset: { genre: "nurture", theme: "animal", progression: "levelup", artStyle: "emoji", colorScheme: "pastel" } },
  { id: "puzzle", label: "パズル", icon: "🧩", color: "#FF8844", preset: { genre: "puzzle", theme: "modern", progression: "stageclear", artStyle: "minimal", colorScheme: "dark" } },
  { id: "rpg", label: "ダンジョンRPG", icon: "🗡️", color: "#AA44FF", preset: { genre: "rpg", theme: "medieval", battleSystem: "turncommand", progression: "levelup", artStyle: "emoji", colorScheme: "dark" } },
  { id: "quiz", label: "クイズ", icon: "❓", color: "#FFAA00", preset: { genre: "quiz", theme: "modern", progression: "stageclear", artStyle: "minimal", colorScheme: "vivid" } },
  { id: "rhythm", label: "リズムゲーム", icon: "🎵", color: "#FF44AA", preset: { genre: "rhythm", theme: "modern", progression: "stageclear", artStyle: "neon", colorScheme: "dark" } },
  { id: "simulator", label: "経営シミュレータ", icon: "🏗️", color: "#44AAAA", preset: { genre: "simulator", theme: "modern", progression: "realtime", artStyle: "minimal", colorScheme: "dark" } },
  { id: "custom", label: "カスタム（自由入力）", icon: "✨", color: "#888", preset: { genre: "custom" } },
];

export default function DemoPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [appName, setAppName] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState("");
  const [genProgress, setGenProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [history, setHistory] = useState<{ title: string; code: string; genre: string }[]>([]);
  const [improvingCode, setImprovingCode] = useState<string | null>(null);
  const [improveInput, setImproveInput] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generate = async (genreId: string) => {
    const genre = GENRES.find((g) => g.id === genreId);
    if (!genre) return;

    setGenerating(true);
    setGenProgress(0);
    setGenStatus("AIがゲームを構築中...");
    setError(null);
    setGeneratedCode(null);

    const steps = [
      { p: 15, s: "ジャンル解析完了 ✓" },
      { p: 35, s: "ゲームロジック構築中..." },
      { p: 55, s: "UI・デザイン生成中..." },
      { p: 75, s: "バランス調整中..." },
      { p: 90, s: "最終仕上げ..." },
    ];
    let si = 0;
    const timer = setInterval(() => {
      if (si < steps.length) { setGenProgress(steps[si].p); setGenStatus(steps[si].s); si++; }
    }, 1200);

    try {
      const title = appName || `${genre.label}ゲーム`;
      const options = {
        name: title,
        ...genre.preset,
        gameMode: ["single"],
        difficulty: "normal",
        growthElements: ["exp_level", "equipment"],
        economy: ["currency", "shop"],
        social: ["leaderboard"],
        screenLayout: "responsive",
        controls: ["tap"],
        sounds: ["se", "animation_light"],
        saveSystem: "autosave",
        replayElements: ["random_gen"],
        customization: ["character_maker"],
        customPrompt: genreId === "custom" ? customPrompt : "",
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ options, mode: "generate" }),
      });

      clearInterval(timer);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "生成に失敗しました");
      }

      const data = await res.json();
      setGenProgress(100);
      setGenStatus("完了！");
      setGeneratedCode(data.code);
      setGeneratedTitle(title);
      setHistory((prev) => [{ title, code: data.code, genre: genreId }, ...prev.slice(0, 9)]);

      setTimeout(() => setGenerating(false), 300);
    } catch (err: any) {
      clearInterval(timer);
      setGenerating(false);
      setError(err.message);
    }
  };

  const improve = async () => {
    if (!improvingCode || !improveInput) return;
    setGenerating(true);
    setGenProgress(0);
    setGenStatus("改良中...");
    setError(null);

    const steps = [{ p: 30, s: "コード分析中..." }, { p: 60, s: "改良適用中..." }, { p: 85, s: "仕上げ中..." }];
    let si = 0;
    const timer = setInterval(() => { if (si < steps.length) { setGenProgress(steps[si].p); setGenStatus(steps[si].s); si++; } }, 1000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ options: { name: generatedTitle }, mode: "improve", instruction: improveInput, existingCode: improvingCode }),
      });
      clearInterval(timer);
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const data = await res.json();
      setGenProgress(100);
      setGeneratedCode(data.code);
      setImprovingCode(null);
      setImproveInput("");
      setTimeout(() => setGenerating(false), 300);
    } catch (err: any) {
      clearInterval(timer);
      setGenerating(false);
      setError(err.message);
    }
  };

  // iframe描画
  useEffect(() => {
    if (!iframeRef.current || !generatedCode) return;
    const html = `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Noto Sans JP',sans-serif;background:#0a0a1a;color:#eee;overflow-x:hidden}#root{min-height:100vh;display:flex;flex-direction:column;align-items:center}</style>
</head><body><div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js"><\/script>
<script type="text/babel">
try{${generatedCode.replace(/<\/script>/g, '<\\/script>')}
const root=ReactDOM.createRoot(document.getElementById('root'));root.render(React.createElement(Game));
}catch(e){document.getElementById('root').innerHTML='<div style="padding:20px;color:#f44;text-align:center"><h3>エラー</h3><p>'+e.message+'</p></div>';}
<\/script></body></html>`;
    iframeRef.current.srcdoc = html;
  }, [generatedCode]);

  // ====== ゲームプレイ画面 ======
  if (generatedCode && !generating) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#eee", fontFamily: "'Noto Sans JP', sans-serif", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#111", borderBottom: "1px solid #222", padding: "8px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setGeneratedCode(null)} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 14 }}>← 戻る</button>
          <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{generatedTitle}</span>
          <button onClick={() => { setImprovingCode(generatedCode); }} style={{ background: "#FF8844", border: "none", borderRadius: 6, color: "#fff", padding: "4px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>🔧 改良</button>
        </div>

        {improvingCode && (
          <div style={{ background: "#1a1a2e", padding: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <input value={improveInput} onChange={(e) => setImproveInput(e.target.value)} placeholder="改良内容を入力（例：敵を強くして、必殺技を追加）"
              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #333", background: "#0a0a1a", color: "#eee", fontSize: 13, outline: "none" }} />
            <button onClick={improve} disabled={!improveInput}
              style={{ background: !improveInput ? "#555" : "linear-gradient(135deg, #FF8844, #FF6B6B)", border: "none", borderRadius: 8, color: "#fff", padding: "8px 16px", cursor: improveInput ? "pointer" : "default", fontSize: 13, fontWeight: 700 }}>
              ⚡ 改良
            </button>
            <button onClick={() => { setImprovingCode(null); setImproveInput(""); }} style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}>✕</button>
          </div>
        )}

        <iframe ref={iframeRef} style={{ flex: 1, width: "100%", border: "none", minHeight: "calc(100vh - 50px)" }} title={generatedTitle} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#eee", fontFamily: "'Noto Sans JP', sans-serif" }}>
      {/* ヘッダー */}
      <header style={{ background: "linear-gradient(135deg, #1a0a2e, #0a1a3e)", padding: "14px 20px", borderBottom: "1px solid #222", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, background: "linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
          ⚡ A.M.I.A プロトタイプ
        </h1>
        <p style={{ fontSize: 11, color: "#888", margin: "4px 0 0" }}>全ジャンルのAI生成品質をテスト</p>
      </header>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px" }}>
        {/* 生成中 */}
        {generating && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: "spin 2s linear infinite" }}>⚡</div>
            <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
            <h3 style={{ marginBottom: 8 }}>AIがゲームを生成中...</h3>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>{genStatus}</p>
            <div style={{ height: 6, background: "#333", borderRadius: 3, maxWidth: 300, margin: "0 auto 8px", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #FF6B6B, #4ECDC4)", width: `${genProgress}%`, transition: "width 0.5s" }} />
            </div>
            <span style={{ fontSize: 11, color: "#666" }}>{genProgress}%</span>
          </div>
        )}

        {/* エラー */}
        {error && !generating && (
          <div style={{ textAlign: "center", padding: "30px 20px", background: "#1a0a0a", borderRadius: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 36 }}>⚠️</div>
            <p style={{ color: "#f44", fontSize: 14, margin: "8px 0" }}>生成に失敗しました</p>
            <p style={{ color: "#888", fontSize: 12 }}>{error}</p>
            <button onClick={() => setError(null)} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 8, border: "none", background: "#4ECDC4", color: "#fff", cursor: "pointer", fontWeight: 600 }}>OK</button>
          </div>
        )}

        {/* ジャンル選択 */}
        {!generating && !generatedCode && (
          <>
            {/* 名前入力 */}
            <div style={{ marginBottom: 16 }}>
              <input value={appName} onChange={(e) => setAppName(e.target.value)} placeholder="ゲーム名（任意）"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #333", background: "#111", color: "#eee", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>

            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🎮 ジャンルを選んでAI生成</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 24 }}>
              {GENRES.map((g) => (
                <button key={g.id} onClick={() => { if (g.id === "custom") { setSelectedGenre("custom"); } else { generate(g.id); } }}
                  style={{ background: selectedGenre === g.id ? `${g.color}22` : "#111", border: `2px solid ${g.color}66`, borderRadius: 14, padding: "16px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = g.color}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = `${g.color}66`}>
                  <div style={{ fontSize: 28 }}>{g.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#eee", marginTop: 4 }}>{g.label}</div>
                </button>
              ))}
            </div>

            {/* カスタム入力 */}
            {selectedGenre === "custom" && (
              <div style={{ background: "#111", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <label style={{ fontSize: 13, color: "#aaa", display: "block", marginBottom: 6 }}>自由にゲーム内容を記述</label>
                <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="例：宇宙を舞台にした戦略シミュレーション。惑星を開拓して資源を集め、敵の艦隊と戦う。"
                  style={{ width: "100%", minHeight: 80, padding: "10px 14px", borderRadius: 8, border: "1px solid #333", background: "#0a0a1a", color: "#eee", fontSize: 13, resize: "vertical", boxSizing: "border-box", outline: "none" }} />
                <button onClick={() => generate("custom")} disabled={!customPrompt}
                  style={{ marginTop: 10, width: "100%", padding: "12px", borderRadius: 10, border: "none", background: customPrompt ? "linear-gradient(135deg, #FF6B6B, #4ECDC4)" : "#333", color: "#fff", fontWeight: 700, fontSize: 15, cursor: customPrompt ? "pointer" : "default" }}>
                  ⚡ AIで生成する
                </button>
              </div>
            )}

            {/* 生成履歴 */}
            {history.length > 0 && (
              <>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📜 生成履歴</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {history.map((h, i) => (
                    <button key={i} onClick={() => { setGeneratedCode(h.code); setGeneratedTitle(h.title); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, background: "#111", border: "1px solid #222", borderRadius: 10, padding: "10px 14px", cursor: "pointer", textAlign: "left" }}>
                      <span style={{ fontSize: 22 }}>{GENRES.find((g) => g.id === h.genre)?.icon || "🎮"}</span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#eee" }}>{h.title}</span>
                      <span style={{ fontSize: 11, color: "#4ECDC4" }}>▶ プレイ</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
