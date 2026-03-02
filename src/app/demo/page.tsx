"use client";

import { useState } from "react";
import { BattleGame, NurtureGame, PuzzleGame, QuizGame, SimulatorGame } from "@/components/StubGames";

const GENRES = [
  { id: "battle", label: "バトルRPG", icon: "⚔️", color: "#FF4444", component: BattleGame },
  { id: "nurture", label: "育成シミュレーション", icon: "🌱", color: "#44BB44", component: NurtureGame },
  { id: "puzzle", label: "パズル", icon: "🧩", color: "#FF8844", component: PuzzleGame },
  { id: "quiz", label: "クイズ", icon: "❓", color: "#FFAA00", component: QuizGame },
  { id: "simulator", label: "経営シミュレータ", icon: "🏗️", color: "#44AAAA", component: SimulatorGame },
];

export default function DemoPage() {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const active = GENRES.find(g => g.id === activeGenre);

  if (active) {
    const GameComponent = active.component;
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#eee", fontFamily: "'Noto Sans JP', sans-serif" }}>
        <div style={{ background: "#111", borderBottom: "1px solid #222", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setActiveGenre(null)} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 14 }}>← 戻る</button>
          <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{active.icon} {active.label}</span>
          <span style={{ fontSize: 10, color: "#555", background: "#222", padding: "2px 8px", borderRadius: 4 }}>PROTOTYPE</span>
        </div>
        <GameComponent />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#eee", fontFamily: "'Noto Sans JP', sans-serif" }}>
      <header style={{ background: "linear-gradient(135deg, #1a0a2e, #0a1a3e)", padding: "16px 20px", borderBottom: "1px solid #222", textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
          ⚡ A.M.I.A プロトタイプ
        </h1>
        <p style={{ fontSize: 12, color: "#888", margin: "6px 0 0" }}>ジャンルを選んで即プレイ</p>
      </header>

      <main style={{ maxWidth: 700, margin: "0 auto", padding: "24px 16px" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🎮 ジャンルを選択</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {GENRES.map(g => (
            <button key={g.id} onClick={() => setActiveGenre(g.id)}
              style={{ background: "#111", border: `2px solid ${g.color}55`, borderRadius: 14, padding: "20px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = g.color; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${g.color}55`; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ fontSize: 32 }}>{g.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#eee", marginTop: 6 }}>{g.label}</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>タップで即プレイ →</div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
