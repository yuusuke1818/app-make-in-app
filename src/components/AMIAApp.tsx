"use client";

import { useState, useCallback } from "react";
import Header from "./Header";
import BottomNav, { type TabId } from "./BottomNav";
import HomeTab from "./HomeTab";
import CreateWizard from "./CreateWizard";
import CommunityTab from "./CommunityTab";
import RankingTab from "./RankingTab";
import MyAppsTab from "./MyAppsTab";
import ImproveDialog from "./ImproveDialog";
import GamePlayer from "./GamePlayer";
import { GENRES, SAMPLE_APPS } from "@/lib/constants";
import type { AppCreationOptions } from "@/types";

interface SavedApp {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  options: AppCreationOptions;
  code: string;
}

type AppView = "main" | "playing" | "generating";

export default function AMIAApp() {
  const [tab, setTab] = useState<TabId>("home");
  const [view, setView] = useState<AppView>("main");
  const [initialGenre, setInitialGenre] = useState<string | undefined>();
  const [myApps, setMyApps] = useState<SavedApp[]>([]);
  const [currentApp, setCurrentApp] = useState<SavedApp | null>(null);
  const [improvingApp, setImprovingApp] = useState<SavedApp | null>(null);
  const [detailApp, setDetailApp] = useState<(typeof SAMPLE_APPS)[number] | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [lastGenOptions, setLastGenOptions] = useState<AppCreationOptions | null>(null);

  const [genProgress, setGenProgress] = useState(0);
  const [genStatus, setGenStatus] = useState("");
  const [genError, setGenError] = useState<string | null>(null);

  const generateApp = useCallback(async (options: AppCreationOptions) => {
    setView("generating");
    setGenProgress(0);
    setGenStatus("設定を解析中...");
    setGenError(null);
    setLastGenOptions(options);

    const progressSteps = [
      { p: 15, s: "ジャンル・モード解析完了" },
      { p: 30, s: "世界観・テーマ適用中..." },
      { p: 50, s: "ゲームシステム構築中..." },
      { p: 70, s: "UI・演出を生成中..." },
      { p: 85, s: "最終調整中..." },
    ];

    let stepIdx = 0;
    const timer = setInterval(() => {
      if (stepIdx < progressSteps.length) {
        setGenProgress(progressSteps[stepIdx].p);
        setGenStatus(progressSteps[stepIdx].s);
        stepIdx++;
      }
    }, 800);

    try {
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

      const genre = GENRES.find((g) => g.id === options.genre);
      const saved: SavedApp = {
        id: `my_${Date.now()}`,
        title: options.name || `${genre?.label || "カスタム"}アプリ`,
        thumbnail: `${genre?.icon || "✨"}🎮`,
        createdAt: new Date().toISOString().split("T")[0],
        options,
        code: data.code,
      };

      setMyApps((prev) => [...prev, saved]);
      setCurrentApp(saved);
      setTimeout(() => setView("playing"), 500);
    } catch (err: any) {
      clearInterval(timer);
      setGenError(err.message);
      setGenProgress(0);
      setGenStatus("");
    }
  }, []);

  const handleImprove = useCallback(async (instruction: string) => {
    if (!improvingApp) return;
    const appToImprove = improvingApp;
    setImprovingApp(null);
    setView("generating");
    setGenProgress(0);
    setGenStatus("改良指示を解析中...");
    setGenError(null);

    const progressSteps = [
      { p: 20, s: "既存コードを分析中..." },
      { p: 50, s: "改良を適用中..." },
      { p: 80, s: "テスト・最終調整中..." },
    ];

    let stepIdx = 0;
    const timer = setInterval(() => {
      if (stepIdx < progressSteps.length) {
        setGenProgress(progressSteps[stepIdx].p);
        setGenStatus(progressSteps[stepIdx].s);
        stepIdx++;
      }
    }, 1000);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          options: appToImprove.options,
          mode: "improve",
          instruction,
          existingCode: appToImprove.code,
        }),
      });

      clearInterval(timer);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "改良に失敗しました");
      }

      const data = await res.json();
      setGenProgress(100);
      setGenStatus("改良完了！");

      const updated: SavedApp = { ...appToImprove, code: data.code };
      setMyApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setCurrentApp(updated);
      setTimeout(() => setView("playing"), 500);
    } catch (err: any) {
      clearInterval(timer);
      setGenError(err.message);
    }
  }, [improvingApp]);

  const playApp = useCallback((app: SavedApp) => {
    setCurrentApp(app);
    setView("playing");
  }, []);

  // ====== ゲームプレイ画面 ======
  if (view === "playing" && currentApp) {
    return (
      <GamePlayer
        code={currentApp.code}
        title={currentApp.title}
        onBack={() => { setView("main"); setCurrentApp(null); }}
        onImprove={() => { setImprovingApp(currentApp); }}
      />
    );
  }

  // ====== 生成中画面 ======
  if (view === "generating") {
    return (
      <div className="flex min-h-screen flex-col bg-[#0a0a1a]">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          {genError ? (
            <>
              <div className="mb-4 text-5xl">⚠️</div>
              <h3 className="mb-2 text-lg font-bold text-[#f44]">生成に失敗しました</h3>
              <p className="mb-6 max-w-md text-sm text-[#888]">{genError}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setView("main"); setGenError(null); }}
                  className="rounded-lg border border-[#444] px-5 py-2 text-sm text-[#aaa]"
                >
                  戻る
                </button>
                <button
                  onClick={() => { if (lastGenOptions) generateApp(lastGenOptions); }}
                  className="rounded-lg bg-[#4ECDC4] px-5 py-2 text-sm font-bold text-white"
                >
                  再試行
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 text-5xl" style={{ animation: "spin 2s linear infinite" }}>⚡</div>
              <h3 className="mb-2 text-lg font-bold">AIがアプリを生成中...</h3>
              <p className="mb-6 text-sm text-[#888]">{genStatus}</p>
              <div className="mb-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-[#333]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${genProgress}%`, background: "linear-gradient(90deg, #FF6B6B, #4ECDC4)" }}
                />
              </div>
              <span className="text-xs text-[#666]">{genProgress}%</span>
            </>
          )}
        </div>
      </div>
    );
  }

  // ====== アプリ詳細画面 ======
  if (detailApp) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0a0a1a]">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-4">
          <button onClick={() => setDetailApp(null)} className="mb-3 text-sm text-[#aaa] hover:text-white">
            ← 一覧に戻る
          </button>
          <div className="rounded-2xl bg-[#111118] p-5">
            <div className="mb-4 flex gap-4">
              <div className="text-6xl">{detailApp.thumbnail}</div>
              <div className="flex-1">
                <h2 className="mb-1 text-xl font-extrabold">{detailApp.title}</h2>
                <div className="text-sm text-[#888]">by {detailApp.author} • {detailApp.createdAt}</div>
                <div className="mt-1 text-sm text-[#aaa]">{detailApp.desc}</div>
                <div className="mt-2 flex gap-4 text-sm">
                  <span>⭐ {detailApp.rating}</span>
                  <span>▶ {detailApp.plays.toLocaleString()}</span>
                  <span>❤️ {detailApp.likes}</span>
                  <span>💬 {detailApp.comments}</span>
                </div>
              </div>
            </div>
            <button className="mb-4 w-full rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] py-3.5 text-base font-extrabold text-white opacity-50">
              ▶ プレイする（コミュニティアプリは準備中）
            </button>
            <div className="mb-2 text-sm text-[#aaa]">評価する：</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => setRatings((prev) => ({ ...prev, [detailApp.id]: r }))}
                  className="bg-transparent text-2xl"
                  style={{ color: (ratings[detailApp.id] || 0) >= r ? "#FFD700" : "#333" }}
                >
                  ★
                </button>
              ))}
              {ratings[detailApp.id] && (
                <span className="ml-2 self-center text-sm text-[#888]">{ratings[detailApp.id]}/5</span>
              )}
            </div>
          </div>
        </main>
        <BottomNav activeTab={tab} onTabChange={(t) => { setDetailApp(null); setTab(t); }} />
      </div>
    );
  }

  // ====== メイン画面 ======
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a1a]">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-4">
        {tab === "home" && (
          <HomeTab
            onCreateClick={() => { setInitialGenre(undefined); setTab("create"); }}
            onAppClick={setDetailApp}
            onCategoryClick={(id) => { setInitialGenre(id); setTab("create"); }}
          />
        )}
        {tab === "create" && <CreateWizard initialGenre={initialGenre} onComplete={generateApp} />}
        {tab === "community" && <CommunityTab onAppClick={setDetailApp} />}
        {tab === "ranking" && <RankingTab onAppClick={setDetailApp} />}
        {tab === "myapps" && (
          <MyAppsTab
            apps={myApps}
            onPlay={(app) => {
              const found = myApps.find((a) => a.id === app.id);
              if (found) playApp(found);
            }}
            onDelete={(id) => setMyApps((prev) => prev.filter((a) => a.id !== id))}
            onImprove={(app) => {
              const found = myApps.find((a) => a.id === app.id);
              if (found) setImprovingApp(found);
            }}
            onCreateClick={() => { setInitialGenre(undefined); setTab("create"); }}
          />
        )}
      </main>
      <BottomNav activeTab={tab} onTabChange={(t) => { setDetailApp(null); setTab(t); }} />
      {improvingApp && (
        <ImproveDialog
          appTitle={improvingApp.title}
          onSubmit={handleImprove}
          onClose={() => setImprovingApp(null)}
        />
      )}
    </div>
  );
}
