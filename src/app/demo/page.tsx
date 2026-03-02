"use client";

import { useState, useRef, useEffect } from "react";
import { STUB_GAMES } from "@/lib/stubs";

const GENRES = [
  { id: "battle", label: "バトルRPG", icon: "⚔️", color: "#FF4444" },
  { id: "card", label: "カードゲーム", icon: "🃏", color: "#4488FF" },
  { id: "nurture", label: "育成シミュレーション", icon: "🌱", color: "#44BB44" },
  { id: "puzzle", label: "パズル", icon: "🧩", color: "#FF8844" },
  { id: "rpg", label: "ダンジョンRPG", icon: "🗡️", color: "#AA44FF" },
  { id: "quiz", label: "クイズ", icon: "❓", color: "#FFAA00" },
  { id: "rhythm", label: "リズムゲーム", icon: "🎵", color: "#FF44AA" },
  { id: "simulator", label: "経営シミュレータ", icon: "🏗️", color: "#44AAAA" },
  { id: "custom", label: "ローグライク", icon: "✨", color: "#4ECDC4" },
];

export default function DemoPage() {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedGenre, setGeneratedGenre] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState("");
  const [genProgress, setGenProgress] = useState(0);
  const [history, setHistory] = useState<{ title: string; code: string; genre: string }[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // スタブモード：APIを叩かず事前定義コードを使用
  const generate = async (genreId: string) => {
    const genre = GENRES.find((g) => g.id === genreId);
    if (!genre) return;

    setGenerating(true);
    setGenProgress(0);
    setGenStatus("AIがゲームを構築中...");

    // プログレス演出（スタブなので高速）
    const steps = [
      { p: 20, s: "ジャンル解析完了 ✓" },
      { p: 50, s: "ゲームロジック構築中..." },
      { p: 80, s: "UI生成中..." },
      { p: 100, s: "完了！" },
    ];
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setGenProgress(steps[i].p);
      setGenStatus(steps[i].s);
    }

    const code = STUB_GAMES[genreId] || STUB_GAMES["custom"];
    const title = genre.label + "ゲーム";

    await new Promise((r) => setTimeout(r, 300));
    setGeneratedCode(code);
    setGeneratedTitle(title);
    setGeneratedGenre(genreId);
    setHistory((prev) => [{ title, code, genre: genreId }, ...prev.filter(h => h.genre !== genreId).slice(0, 8)]);
    setGenerating(false);
  };

  // iframe描画（srcdoc方式）
  useEffect(() => {
    if (!iframeRef.current || !generatedCode) return;
    const escaped = generatedCode.replace(/<\/script>/g, "<\\/script>");
    const html = `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Noto Sans JP',sans-serif;background:#0a0a1a;color:#eee;overflow-x:hidden}#root{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:8px}</style>
</head><body><div id="root"><div style="text-align:center;padding:40px;color:#888">読み込み中...</div></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js"><\/script>
<script type="text/babel">
try {
  ${escaped}
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(Game));
} catch(e) {
  document.getElementById('root').innerHTML = '<div style="padding:20px;color:#f44;text-align:center"><h3>エラー</h3><pre style="text-align:left;font-size:11px;color:#888;margin-top:8px;white-space:pre-wrap">' + e.message + '\\n' + e.stack + '</pre></div>';
}
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
          <span style={{ fontSize: 10, color: "#555", background: "#222", padding: "2px 8px", borderRadius: 4 }}>STUB MODE</span>
        </div>
        <iframe
          ref={iframeRef}
          style={{ flex: 1, width: "100%", border: "none", minHeight: "calc(100vh - 44px)" }}
          title={generatedTitle}
        />
      </div>
    );
  }

  // ====== メイン画面 ======
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#eee", fontFamily: "'Noto Sans JP', sans-serif" }}>
      {/* ヘッダー */}
      <header style={{ background: "linear-gradient(135deg, #1a0a2e, #0a1a3e)", padding: "14px 20px", borderBottom: "1px solid #222", textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, background: "linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
          ⚡ A.M.I.A プロトタイプ
        </h1>
        <p style={{ fontSize: 11, color: "#888", margin: "4px 0 0" }}>
          全ジャンルのゲーム品質テスト
          <span style={{ background: "#FF884433", color: "#FF8844", padding: "1px 6px", borderRadius: 4, fontSize: 9, marginLeft: 6 }}>STUB MODE - API未使用</span>
        </p>
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
              <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #FF6B6B, #4ECDC4)", width: `${genProgress}%`, transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: 11, color: "#666" }}>{genProgress}%</span>
          </div>
        )}

        {/* ジャンル選択 */}
        {!generating && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🎮 ジャンルを選んで即プレイ</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 24 }}>
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => generate(g.id)}
                  style={{
                    background: "#111",
                    border: `2px solid ${g.color}66`,
                    borderRadius: 14,
                    padding: "16px 14px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = g.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${g.color}66`; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ fontSize: 28 }}>{g.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#eee", marginTop: 4 }}>{g.label}</div>
                  <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>タップで即プレイ →</div>
                </button>
              ))}
            </div>

            {/* 生成履歴 */}
            {history.length > 0 && (
              <>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📜 プレイ履歴</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {history.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => { setGeneratedCode(h.code); setGeneratedTitle(h.title); setGeneratedGenre(h.genre); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, background: "#111", border: "1px solid #222", borderRadius: 10, padding: "10px 14px", cursor: "pointer", textAlign: "left" }}
                    >
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
