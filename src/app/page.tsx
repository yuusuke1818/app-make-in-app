"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { GENRES, GENRE_THUMBNAILS, getFilteredCategories } from "@/lib/elements";
import { BattleGame, NurtureGame, PuzzleGame, QuizGame, SimulatorGame } from "@/components/StubGames";
import { supabase } from "@/lib/supabase";

// スタブゲームマッピング
const STUB_MAP: Record<string, React.ComponentType> = {
  battle: BattleGame, nurture: NurtureGame, puzzle: PuzzleGame,
  quiz: QuizGame, simulator: SimulatorGame, card: BattleGame,
  rpg: BattleGame, rhythm: QuizGame, action: PuzzleGame, horror: BattleGame,
};

// ======================================
// 型定義
// ======================================
interface AppData {
  id: string; user_id: string; title: string; description: string;
  genre: string; theme: string; mood: string; thumbnail: string;
  options: Record<string, any>; code: string; status: string;
  version: number; play_count: number; like_count: number;
  avg_rating: number; rating_count: number;
  created_at: string; updated_at: string;
  users?: { display_name: string; avatar_url: string };
}
interface UserData {
  id: string; display_name: string; email: string; avatar_url: string;
  bio: string; plan: string; generate_count: number; app_count: number;
  total_likes_received: number; total_plays_received: number;
}

// ======================================
// メインアプリ
// ======================================
export default function AMIAApp() {
  // 認証
  const [user, setUser] = useState<UserData | null>(null);
  const [loginName, setLoginName] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  // タブ
  const [tab, setTab] = useState<"home" | "create" | "community" | "ranking" | "myapps">("home");

  // 作成フロー
  const [createStep, setCreateStep] = useState<"genre" | "options" | "confirm" | "generating" | "preview">("genre");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [appName, setAppName] = useState("");
  const [freeInput, setFreeInput] = useState("");
  const [genProgress, setGenProgress] = useState(0);
  const [genStatus, setGenStatus] = useState("");
  const [generatedApp, setGeneratedApp] = useState<AppData | null>(null);

  // プレイ
  const [playingApp, setPlayingApp] = useState<AppData | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [showImprove, setShowImprove] = useState(false);
  const [improveInput, setImproveInput] = useState("");
  const [improving, setImproving] = useState(false);

  // AI生成モード
  const [useAI, setUseAI] = useState(false);
  const [genError, setGenError] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // データ
  const [publicApps, setPublicApps] = useState<AppData[]>([]);
  const [myApps, setMyApps] = useState<AppData[]>([]);
  const [rankingApps, setRankingApps] = useState<AppData[]>([]);

  // ======================================
  // ゲストログイン
  // ======================================
  const guestLogin = async () => {
    const name = loginName.trim() || "ゲスト" + Math.floor(Math.random() * 9999);
    const id = crypto.randomUUID();
    const u: UserData = { id, display_name: name, email: "", avatar_url: "", bio: "", plan: "free", generate_count: 0, app_count: 0, total_likes_received: 0, total_plays_received: 0 };
    if (supabase) {
      try { await supabase.from("users").insert({ id, display_name: name }); } catch {}
    }
    setUser(u);
    setShowLogin(false);
    localStorage.setItem("amia_user", JSON.stringify(u));
  };

  // ローカルストレージから復元
  useEffect(() => {
    try {
      const saved = localStorage.getItem("amia_user");
      if (saved) setUser(JSON.parse(saved));
    } catch {}
    loadPublicApps();
  }, []);

  // ======================================
  // データ読み込み
  // ======================================
  const loadPublicApps = async () => {
    if (!supabase) return;
    try {
      const { data } = await supabase.from("apps").select("*, users(display_name, avatar_url)").eq("status", "published").order("created_at", { ascending: false }).limit(30);
      if (data) setPublicApps(data as AppData[]);
      const { data: ranked } = await supabase.from("apps").select("*, users(display_name, avatar_url)").eq("status", "published").order("like_count", { ascending: false }).limit(20);
      if (ranked) setRankingApps(ranked as AppData[]);
    } catch {}
  };

  const loadMyApps = async () => {
    if (!supabase || !user) return;
    try {
      const { data } = await supabase.from("apps").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) setMyApps(data as AppData[]);
    } catch {}
  };

  useEffect(() => { if (user && tab === "myapps") loadMyApps(); }, [tab, user]);

  // ======================================
  // 要素選択
  // ======================================
  const toggle = (key: string, id: string, type: "single" | "multi") => {
    setSelections(p => {
      const cur = p[key] || [];
      if (type === "single") return { ...p, [key]: [id] };
      return { ...p, [key]: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] };
    });
  };

  // ======================================
  // アプリ生成（AI / スタブ）
  // ======================================
  const generateApp = async () => {
    setCreateStep("generating");
    setGenProgress(0);
    setGenError("");
    const title = appName || (GENRES.find(g => g.id === selectedGenre)?.label || "") + "ゲーム";

    if (useAI) {
      // === AI生成モード ===
      const progressSteps = ["要素解析中...", "プロンプト構築中...", "AIがゲームロジック生成中...", "コード出力中...", "検証中..."];
      let stepIdx = 0;
      const timer = setInterval(() => {
        if (stepIdx < progressSteps.length) {
          setGenProgress(Math.min(90, Math.round(((stepIdx + 1) / progressSteps.length) * 90)));
          setGenStatus(progressSteps[stepIdx]);
          stepIdx++;
        }
      }, 2000);

      try {
        const options = {
          name: title, genre: selectedGenre,
          ...Object.fromEntries(Object.entries(selections).map(([k, v]) => [k, v.length === 1 ? v[0] : v])),
          gameMode: ["single"], screenLayout: "responsive", controls: ["tap"],
          saveSystem: "autosave", customPrompt: freeInput || "",
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

        const appId = crypto.randomUUID();
        const app: AppData = {
          id: appId, user_id: user?.id || "", title,
          description: freeInput || `${title} - AI生成ゲーム`,
          genre: selectedGenre, theme: (selections.theme || [""])[0], mood: (selections.mood || [""])[0],
          thumbnail: GENRE_THUMBNAILS[selectedGenre] || "🎮",
          options: { ...selections, freeInput }, code: data.code,
          status: "draft", version: 1, play_count: 0, like_count: 0,
          avg_rating: 0, rating_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        };
        if (supabase && user) {
          try {
            const { data: saved } = await supabase.from("apps").insert({
              id: appId, user_id: user.id, title, description: app.description,
              genre: selectedGenre, theme: app.theme, mood: app.mood, thumbnail: app.thumbnail,
              options: app.options, code: data.code, status: "draft",
            }).select().single();
            if (saved) Object.assign(app, saved);
          } catch {}
        }
        await new Promise(r => setTimeout(r, 500));
        setGeneratedApp(app);
        setCreateStep("preview");
      } catch (err: any) {
        clearInterval(timer);
        setGenError(err.message);
        setCreateStep("confirm");
      }
    } else {
      // === スタブモード ===
      const steps = ["要素解析中...", "世界観構築中...", "ゲームロジック生成中...", "UI生成中...", "完了！"];
      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 350));
        setGenProgress(Math.round(((i + 1) / steps.length) * 100));
        setGenStatus(steps[i]);
      }
      const appId = crypto.randomUUID();
      const app: AppData = {
        id: appId, user_id: user?.id || "", title,
        description: freeInput || `${title}のAI生成ゲーム`,
        genre: selectedGenre, theme: (selections.theme || [""])[0], mood: (selections.mood || [""])[0],
        thumbnail: GENRE_THUMBNAILS[selectedGenre] || "🎮",
        options: { ...selections, freeInput }, code: "stub",
        status: "draft", version: 1, play_count: 0, like_count: 0,
        avg_rating: 0, rating_count: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      if (supabase && user) {
        try {
          const { data } = await supabase.from("apps").insert({
            id: appId, user_id: user.id, title, description: app.description,
            genre: selectedGenre, theme: app.theme, mood: app.mood, thumbnail: app.thumbnail,
            options: app.options, code: "stub", status: "draft",
          }).select().single();
          if (data) Object.assign(app, data);
        } catch {}
      }
      setGeneratedApp(app);
      setCreateStep("preview");
    }
  };

  // ======================================
  // 改良機能（AI）
  // ======================================
  const improveApp = async (app: AppData) => {
    if (!improveInput.trim()) return;
    setImproving(true);
    try {
      if (app.code !== "stub" && useAI) {
        // AI改良
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ options: { name: app.title }, mode: "improve", instruction: improveInput, existingCode: app.code }),
        });
        if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
        const data = await res.json();
        const newVersion = app.version + 1;
        if (supabase) {
          try {
            await supabase.from("apps").update({ code: data.code, version: newVersion, updated_at: new Date().toISOString() }).eq("id", app.id);
          } catch {}
        }
        const updated = { ...app, code: data.code, version: newVersion };
        setPlayingApp(updated);
        setGeneratedApp(updated);
      } else {
        // スタブモード：改良は表示のみ
        const updated = { ...app, version: app.version + 1 };
        if (supabase) {
          try { await supabase.from("apps").update({ version: updated.version }).eq("id", app.id); } catch {}
        }
        setPlayingApp(updated);
        setGeneratedApp(updated);
      }
      setShowImprove(false);
      setImproveInput("");
    } catch (err: any) {
      alert("改良に失敗: " + err.message);
    } finally {
      setImproving(false);
    }
  };

  // ======================================
  // AI生成コードのiframe描画
  // ======================================
  const renderAIGame = (code: string) => {
    if (!iframeRef.current) return;
    const escaped = code.replace(/<\/script>/g, "<\\/script>");
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
  document.getElementById('root').innerHTML = '<div style="padding:20px;color:#f44;text-align:center"><h3>描画エラー</h3><pre style="text-align:left;font-size:11px;color:#888;margin-top:8px;white-space:pre-wrap">' + e.message + '</pre></div>';
}
<\/script></body></html>`;
    iframeRef.current.srcdoc = html;
  };

  useEffect(() => {
    if (playingApp && playingApp.code !== "stub" && iframeRef.current) renderAIGame(playingApp.code);
  }, [playingApp]);

  // ======================================
  // 公開
  // ======================================
  const publishApp = async (app: AppData) => {
    if (supabase) {
      try { await supabase.from("apps").update({ status: "published" }).eq("id", app.id); } catch {}
    }
    app.status = "published";
    setGeneratedApp({ ...app });
    loadPublicApps();
    loadMyApps();
  };

  // ======================================
  // いいね
  // ======================================
  const toggleLike = async (app: AppData) => {
    if (!user) { setShowLogin(true); return; }
    if (!supabase) return;
    try {
      if (hasLiked) {
        await supabase.from("likes").delete().eq("app_id", app.id).eq("user_id", user.id);
        await supabase.from("apps").update({ like_count: Math.max(0, app.like_count - 1) }).eq("id", app.id);
        app.like_count = Math.max(0, app.like_count - 1);
        setHasLiked(false);
      } else {
        await supabase.from("likes").insert({ app_id: app.id, user_id: user.id });
        await supabase.from("apps").update({ like_count: app.like_count + 1 }).eq("id", app.id);
        app.like_count += 1;
        setHasLiked(true);
      }
      setPlayingApp({ ...app });
    } catch {}
  };

  // ======================================
  // 評価
  // ======================================
  const rateApp = async (app: AppData, score: number) => {
    if (!user || !supabase) return;
    try {
      await supabase.from("ratings").upsert({ app_id: app.id, user_id: user.id, score });
      setMyRating(score);
      // 平均再計算
      const { data: ratings } = await supabase.from("ratings").select("score").eq("app_id", app.id);
      if (ratings && ratings.length > 0) {
        const avg = ratings.reduce((s, r) => s + r.score, 0) / ratings.length;
        await supabase.from("apps").update({ avg_rating: Math.round(avg * 10) / 10, rating_count: ratings.length }).eq("id", app.id);
        app.avg_rating = Math.round(avg * 10) / 10;
        app.rating_count = ratings.length;
        setPlayingApp({ ...app });
      }
    } catch {}
  };

  // プレイ時にいいね・評価状態取得
  const openPlay = async (app: AppData) => {
    setPlayingApp(app);
    setHasLiked(false);
    setMyRating(0);
    setShowImprove(false);
    // プレイ数加算
    if (supabase) {
      try {
        await supabase.from("apps").update({ play_count: app.play_count + 1 }).eq("id", app.id);
        if (user) {
          const { data: like } = await supabase.from("likes").select("id").eq("app_id", app.id).eq("user_id", user.id).single();
          if (like) setHasLiked(true);
          const { data: rating } = await supabase.from("ratings").select("score").eq("app_id", app.id).eq("user_id", user.id).single();
          if (rating) setMyRating(rating.score);
        }
      } catch {}
    }
  };

  // ======================================
  // スタイル定数
  // ======================================
  const BG = "#0a0a1a";
  const CARD_BG = "#111118";
  const ACCENT = "#4ECDC4";
  const ACCENT2 = "#FF6B6B";

  // ======================================
  // ログインモーダル
  // ======================================
  const LoginModal = () => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={() => setShowLogin(false)}>
      <div style={{ background: CARD_BG, borderRadius: 16, padding: 24, maxWidth: 380, width: "100%" }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 20, fontWeight: 800, textAlign: "center", marginBottom: 4 }}>A.M.I.Aにログイン</h2>
        <p style={{ fontSize: 12, color: "#888", textAlign: "center", marginBottom: 20 }}>アプリを作成・公開・評価するにはログインが必要</p>
        <div style={{ marginBottom: 16 }}>
          <input value={loginName} onChange={e => setLoginName(e.target.value)} placeholder="ニックネーム（任意）"
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #333", background: BG, color: "#eee", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
        </div>
        <button onClick={guestLogin}
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${ACCENT}, #45B7D1)`, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
          🎮 ゲストログイン
        </button>
        <button disabled style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1px solid #333", background: "transparent", color: "#666", fontSize: 14, cursor: "default" }}>
          Googleログイン（準備中）
        </button>
      </div>
    </div>
  );

  // ======================================
  // アプリカード
  // ======================================
  const AppCard = ({ app, showAuthor = true }: { app: AppData; showAuthor?: boolean }) => (
    <button onClick={() => openPlay(app)}
      style={{ background: CARD_BG, border: "1px solid #222", borderRadius: 14, padding: 14, cursor: "pointer", textAlign: "left", width: "100%", transition: "border-color 0.2s" }}
      onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ fontSize: 36, width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a2e", borderRadius: 10 }}>{app.thumbnail}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#eee", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{app.title}</div>
          {showAuthor && <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{(app as any).users?.display_name || "匿名"}</div>}
          <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#666" }}>
            <span>▶ {app.play_count}</span>
            <span>❤️ {app.like_count}</span>
            {app.avg_rating > 0 && <span>⭐ {app.avg_rating}</span>}
            <span style={{ color: "#555" }}>{app.genre}</span>
          </div>
        </div>
      </div>
    </button>
  );

  // ======================================
  // プレイ画面
  // ======================================
  if (playingApp) {
    const isAIGenerated = playingApp.code !== "stub";
    const GameComponent = !isAIGenerated ? (STUB_MAP[playingApp.genre] || BattleGame) : null;
    return (
      <div style={{ minHeight: "100vh", background: BG, color: "#eee", fontFamily: "'Noto Sans JP', sans-serif", display: "flex", flexDirection: "column" }}>
        {/* ヘッダー */}
        <div style={{ background: CARD_BG, borderBottom: "1px solid #222", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => { setPlayingApp(null); loadPublicApps(); }} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 14 }}>← 戻る</button>
          <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{playingApp.thumbnail} {playingApp.title}</span>
          <span style={{ fontSize: 10, color: isAIGenerated ? "#4ECDC4" : "#FF8844", background: "#222", padding: "2px 6px", borderRadius: 4 }}>{isAIGenerated ? "AI" : "STUB"} v{playingApp.version}</span>
        </div>

        {/* ゲーム表示 */}
        {isAIGenerated ? (
          <iframe ref={iframeRef} style={{ flex: 1, width: "100%", border: "none", minHeight: "60vh" }} title={playingApp.title} />
        ) : (
          GameComponent && <GameComponent />
        )}

        {/* 評価バー */}
        <div style={{ background: CARD_BG, borderTop: "1px solid #222", padding: "12px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {/* いいね */}
            <button onClick={() => toggleLike(playingApp)}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 20, border: `1px solid ${hasLiked ? ACCENT2 : "#333"}`, background: hasLiked ? `${ACCENT2}22` : "transparent", color: hasLiked ? ACCENT2 : "#aaa", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              {hasLiked ? "❤️" : "🤍"} {playingApp.like_count}
            </button>
            {/* ★評価 */}
            <div style={{ display: "flex", gap: 2 }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => rateApp(playingApp, s)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: s <= myRating ? "#FFD700" : "#333" }}>★</button>
              ))}
              {playingApp.avg_rating > 0 && <span style={{ fontSize: 11, color: "#888", alignSelf: "center", marginLeft: 4 }}>{playingApp.avg_rating}</span>}
            </div>
            {/* プレイ数 */}
            <span style={{ fontSize: 11, color: "#666" }}>▶ {playingApp.play_count + 1}回プレイ</span>
            {/* 改良ボタン（自分のアプリのみ） */}
            {user && playingApp.user_id === user.id && (
              <button onClick={() => setShowImprove(!showImprove)}
                style={{ marginLeft: "auto", padding: "6px 14px", borderRadius: 20, border: "none", background: showImprove ? "#555" : "#FF8844", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                {showImprove ? "✕ 閉じる" : "🔧 改良"}
              </button>
            )}
          </div>
          {/* 改良入力 */}
          {showImprove && (
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <input value={improveInput} onChange={e => setImproveInput(e.target.value)} placeholder="改良内容（例：敵を強くして、必殺技を追加）"
                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #333", background: BG, color: "#eee", fontSize: 13, outline: "none" }} />
              <button onClick={() => improveApp(playingApp)} disabled={!improveInput.trim() || improving}
                style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: !improveInput.trim() || improving ? "#555" : ACCENT, color: "#fff", cursor: !improveInput.trim() || improving ? "default" : "pointer", fontWeight: 700, fontSize: 13, minWidth: 80 }}>
                {improving ? "⏳..." : "⚡ 改良"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ======================================
  // 作成フロー
  // ======================================
  if (tab === "create" && user) {
    if (createStep === "generating") {
      return (
        <div style={{ minHeight: "100vh", background: BG, color: "#eee", fontFamily: "'Noto Sans JP', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16, animation: "spin 2s linear infinite" }}>⚡</div>
          <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
          <h3 style={{ marginBottom: 8 }}>AIがゲームを生成中...</h3>
          <p style={{ color: "#888", fontSize: 13 }}>{genStatus}</p>
          <div style={{ height: 8, background: "#333", borderRadius: 4, width: "80%", maxWidth: 320, overflow: "hidden", marginTop: 16 }}>
            <div style={{ height: "100%", background: `linear-gradient(90deg, ${ACCENT2}, ${ACCENT})`, width: `${genProgress}%`, transition: "width 0.3s", borderRadius: 4 }} />
          </div>
          <span style={{ fontSize: 12, color: "#666", marginTop: 6 }}>{genProgress}%</span>
        </div>
      );
    }

    if (createStep === "preview" && generatedApp) {
      const isAI = generatedApp.code !== "stub";
      const PreviewGameComponent = !isAI ? (STUB_MAP[generatedApp.genre] || BattleGame) : null;
      return (
        <div style={{ minHeight: "100vh", background: BG, color: "#eee", fontFamily: "'Noto Sans JP', sans-serif", display: "flex", flexDirection: "column" }}>
          <div style={{ background: CARD_BG, borderBottom: "1px solid #222", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setCreateStep("confirm")} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 14 }}>← 戻る</button>
            <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>プレビュー: {generatedApp.title}</span>
            <span style={{ fontSize: 10, color: isAI ? ACCENT : "#FF8844", background: "#222", padding: "2px 6px", borderRadius: 4 }}>{isAI ? "AI生成" : "STUB"}</span>
          </div>
          {isAI ? (
            <iframe style={{ flex: 1, width: "100%", border: "none", minHeight: "55vh" }} title={generatedApp.title}
              ref={(el) => { if (el && generatedApp.code !== "stub") { const esc = generatedApp.code.replace(/<\/script>/g, "<\\/script>"); el.srcdoc = '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;800;900&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:"Noto Sans JP",sans-serif;background:#0a0a1a;color:#eee;overflow-x:hidden}#root{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:8px}</style></head><body><div id="root"></div><script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"><\\/script><script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"><\\/script><script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js"><\\/script><script type="text/babel">try{' + esc + ';const root=ReactDOM.createRoot(document.getElementById("root"));root.render(React.createElement(Game));}catch(e){document.getElementById("root").innerHTML="<div style=\\"padding:20px;color:#f44;text-align:center\\"><h3>エラー</h3><p>"+e.message+"</p></div>";}<\\/script></body></html>'; } }} />
          ) : (
            PreviewGameComponent && <PreviewGameComponent />
          )}
          {/* 改良＋操作パネル */}
          <div style={{ padding: "12px 16px", background: CARD_BG, borderTop: "1px solid #222" }}>
            {/* 改良入力 */}
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input value={improveInput} onChange={e => setImproveInput(e.target.value)} placeholder="改良指示（例：敵を増やして、BGM演出を追加）"
                style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #333", background: BG, color: "#eee", fontSize: 13, outline: "none" }} />
              <button onClick={() => improveApp(generatedApp)} disabled={!improveInput.trim() || improving}
                style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: !improveInput.trim() || improving ? "#555" : "#FF8844", color: "#fff", cursor: !improveInput.trim() || improving ? "default" : "pointer", fontWeight: 700, fontSize: 13, minWidth: 80, whiteSpace: "nowrap" }}>
                {improving ? "⏳..." : "🔧 改良"}
              </button>
            </div>
            {/* アクションボタン */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setCreateStep("genre"); setSelections({}); setSelectedGenre(""); setAppName(""); setFreeInput(""); setGeneratedApp(null); setGenError(""); setImproveInput(""); }}
                style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #444", background: "transparent", color: "#aaa", cursor: "pointer", fontSize: 13 }}>作り直す</button>
              {generatedApp.status === "draft" && (
                <button onClick={() => publishApp(generatedApp)}
                  style={{ padding: "12px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, color: "#fff", cursor: "pointer", fontSize: 15, fontWeight: 800 }}>
                  🌐 公開する
                </button>
              )}
              {generatedApp.status === "published" && (
                <div style={{ padding: "12px 20px", background: "#1a3a1a", borderRadius: 10, color: "#4CAF50", fontWeight: 700 }}>✅ 公開済み</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // 作成UI
    return (
      <div style={{ minHeight: "100vh", background: BG, color: "#eee", fontFamily: "'Noto Sans JP', sans-serif" }}>
        <div style={{ background: CARD_BG, borderBottom: "1px solid #222", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => { if (createStep === "genre") setTab("home"); else if (createStep === "options") setCreateStep("genre"); else if (createStep === "confirm") setCreateStep("options"); }}
            style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 14 }}>← 戻る</button>
          <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>
            {createStep === "genre" ? "① ジャンル選択" : createStep === "options" ? "② 要素カスタマイズ" : "③ 確認＆生成"}
          </span>
        </div>

        <main style={{ maxWidth: 600, margin: "0 auto", padding: "16px 16px 80px" }}>
          {/* ステップ1: ジャンル */}
          {createStep === "genre" && (
            <>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🎮 どんなゲームを作る？</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
                {GENRES.map(g => (
                  <button key={g.id} onClick={() => { setSelectedGenre(g.id); setSelections({}); setCreateStep("options"); }}
                    style={{ background: CARD_BG, border: `2px solid ${selectedGenre === g.id ? ACCENT : "#222"}`, borderRadius: 14, padding: "16px 12px", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
                    onMouseLeave={e => e.currentTarget.style.borderColor = selectedGenre === g.id ? ACCENT : "#222"}>
                    <div style={{ fontSize: 32 }}>{g.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#eee", marginTop: 6 }}>{g.label}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ステップ2: 要素カスタマイズ（ジャンル連動） */}
          {createStep === "options" && selectedGenre && (
            <>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                {GENRES.find(g => g.id === selectedGenre)?.icon} {GENRES.find(g => g.id === selectedGenre)?.label}の要素を選択
              </h2>
              {getFilteredCategories(selectedGenre).map(cat => (
                <div key={cat.key} style={{ marginBottom: 18 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#ccc" }}>{cat.icon} {cat.label}{cat.type === "multi" ? "（複数可）" : ""}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {cat.items.map(item => {
                      const sel = (selections[cat.key] || []).includes(item.id);
                      return (
                        <button key={item.id} onClick={() => toggle(cat.key, item.id, cat.type)}
                          style={{ padding: "6px 12px", borderRadius: 8, border: `2px solid ${sel ? ACCENT : "#333"}`, background: sel ? `${ACCENT}15` : CARD_BG, color: sel ? ACCENT : "#bbb", cursor: "pointer", fontSize: 12, fontWeight: sel ? 700 : 400, display: "flex", alignItems: "center", gap: 4 }}>
                          {item.icon} {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button onClick={() => setCreateStep("confirm")}
                style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${ACCENT}, #45B7D1)`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
                次へ →
              </button>
            </>
          )}

          {/* ステップ3: 確認＆生成 */}
          {createStep === "confirm" && (
            <>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📝 最終確認</h2>
              {genError && (
                <div style={{ background: "#3a1a1a", border: "1px solid #f44", borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 12, color: "#f88" }}>
                  ⚠️ {genError}
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>ゲーム名</label>
                <input value={appName} onChange={e => setAppName(e.target.value)} placeholder="例：宇宙戦記RPG"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #333", background: CARD_BG, color: "#eee", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "#aaa", display: "block", marginBottom: 4 }}>✏️ 自由入力（AIへの追加指示）</label>
                <textarea value={freeInput} onChange={e => setFreeInput(e.target.value)}
                  placeholder="例：主人公は猫で、敵はネズミの軍団。必殺技は「にゃんこパンチ」。"
                  style={{ width: "100%", minHeight: 80, padding: "10px 12px", borderRadius: 8, border: "1px solid #333", background: CARD_BG, color: "#eee", fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
              </div>
              {/* AI切替トグル */}
              <div style={{ marginBottom: 14, background: CARD_BG, borderRadius: 10, padding: 12, display: "flex", alignItems: "center", gap: 10, border: `1px solid ${useAI ? ACCENT : "#333"}` }}>
                <button onClick={() => setUseAI(!useAI)}
                  style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: useAI ? ACCENT : "#333", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: useAI ? 23 : 3, transition: "left 0.2s" }} />
                </button>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>AI生成 {useAI ? "ON" : "OFF"}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>{useAI ? "Claude APIでオリジナルゲームを生成（API消費あり・30秒程度）" : "プロトタイプ表示（API消費なし・即座）"}</div>
                </div>
              </div>
              {/* 選択サマリー */}
              <div style={{ background: CARD_BG, borderRadius: 10, padding: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, marginBottom: 6 }}>選択された要素</div>
                <div style={{ fontSize: 12, color: "#ccc", marginBottom: 4 }}>🎮 ジャンル: {GENRES.find(g => g.id === selectedGenre)?.label}</div>
                {getFilteredCategories(selectedGenre).map(cat => {
                  const sel = selections[cat.key] || [];
                  if (sel.length === 0) return null;
                  const labels = sel.map(id => cat.items.find(i => i.id === id)?.label || id);
                  return <div key={cat.key} style={{ fontSize: 12, color: "#ccc", marginBottom: 3 }}>{cat.icon} {cat.label}: {labels.join(", ")}</div>;
                })}
              </div>
              <button onClick={generateApp}
                style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
                ⚡ ゲームを生成する
              </button>
            </>
          )}
        </main>
      </div>
    );
  }

  // ======================================
  // メインレイアウト（タブ）
  // ======================================
  return (
    <div style={{ minHeight: "100vh", background: BG, color: "#eee", fontFamily: "'Noto Sans JP', sans-serif", paddingBottom: 60 }}>
      {showLogin && <LoginModal />}

      {/* ヘッダー */}
      <header style={{ background: "linear-gradient(135deg, #1a0a2e, #0a1a3e)", padding: "12px 16px", borderBottom: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>A.M.I.A</h1>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#aaa" }}>{user.display_name}</span>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{user.display_name[0]}</div>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}
            style={{ padding: "6px 16px", borderRadius: 8, border: `1px solid ${ACCENT}`, background: "transparent", color: ACCENT, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>ログイン</button>
        )}
      </header>

      {/* コンテンツ */}
      <main style={{ maxWidth: 650, margin: "0 auto", padding: "16px" }}>
        {/* ホーム */}
        {tab === "home" && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🔥 新着アプリ</h2>
            {publicApps.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {publicApps.map(app => <AppCard key={app.id} app={app} />)}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#555" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎮</div>
                <p style={{ fontSize: 14, marginBottom: 8 }}>まだアプリが公開されていません</p>
                <p style={{ fontSize: 12 }}>最初のアプリを作って公開しよう！</p>
                <button onClick={() => { if (!user) { setShowLogin(true); } else { setTab("create"); setCreateStep("genre"); } }}
                  style={{ marginTop: 12, padding: "10px 24px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                  ⚡ アプリを作成
                </button>
              </div>
            )}
          </>
        )}

        {/* コミュニティ */}
        {tab === "community" && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🌐 コミュニティ</h2>
            {publicApps.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {publicApps.map(app => <AppCard key={app.id} app={app} />)}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#555" }}>まだ公開アプリがありません</div>
            )}
          </>
        )}

        {/* ランキング */}
        {tab === "ranking" && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🏆 ランキング</h2>
            {rankingApps.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {rankingApps.map((app, i) => (
                  <div key={app.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#555", width: 24, textAlign: "center" }}>{i + 1}</span>
                    <div style={{ flex: 1 }}><AppCard app={app} /></div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#555" }}>まだランキングデータがありません</div>
            )}
          </>
        )}

        {/* マイアプリ */}
        {tab === "myapps" && (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📦 マイアプリ</h2>
            {!user ? (
              <div style={{ textAlign: "center", padding: 40, color: "#555" }}>
                <p>ログインしてアプリを管理しよう</p>
                <button onClick={() => setShowLogin(true)}
                  style={{ marginTop: 12, padding: "10px 24px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", cursor: "pointer", fontWeight: 700 }}>ログイン</button>
              </div>
            ) : myApps.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {myApps.map(app => (
                  <div key={app.id} style={{ position: "relative" }}>
                    <AppCard app={app} showAuthor={false} />
                    <span style={{ position: "absolute", top: 8, right: 8, fontSize: 10, padding: "2px 6px", borderRadius: 4, background: app.status === "published" ? "#1a3a1a" : "#3a3a1a", color: app.status === "published" ? "#4CAF50" : "#FF8844" }}>
                      {app.status === "published" ? "公開中" : "下書き"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#555" }}>
                <p>まだアプリがありません</p>
                <button onClick={() => { setTab("create"); setCreateStep("genre"); }}
                  style={{ marginTop: 12, padding: "10px 24px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`, color: "#fff", cursor: "pointer", fontWeight: 700 }}>作成する</button>
              </div>
            )}
          </>
        )}

        {/* 作成タブ（未ログイン時） */}
        {tab === "create" && !user && (
          <div style={{ textAlign: "center", padding: 40, color: "#555" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
            <p style={{ marginBottom: 8 }}>ログインしてアプリを作成しよう</p>
            <button onClick={() => setShowLogin(true)}
              style={{ marginTop: 12, padding: "10px 24px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", cursor: "pointer", fontWeight: 700 }}>ログイン</button>
          </div>
        )}
      </main>

      {/* ボトムタブ */}
      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: CARD_BG, borderTop: "1px solid #222", display: "flex", zIndex: 50 }}>
        {([
          { id: "home", icon: "🏠", label: "ホーム" },
          { id: "create", icon: "⚡", label: "作成" },
          { id: "community", icon: "🌐", label: "コミュニティ" },
          { id: "ranking", icon: "🏆", label: "ランキング" },
          { id: "myapps", icon: "📦", label: "マイアプリ" },
        ] as const).map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); if (t.id === "create" && user) setCreateStep("genre"); }}
            style={{ flex: 1, padding: "8px 0", background: "none", border: "none", cursor: "pointer", textAlign: "center", color: tab === t.id ? ACCENT : "#666", transition: "color 0.2s" }}>
            <div style={{ fontSize: 18 }}>{t.icon}</div>
            <div style={{ fontSize: 9, marginTop: 2, fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</div>
          </button>
        ))}
      </nav>
    </div>
  );
}
