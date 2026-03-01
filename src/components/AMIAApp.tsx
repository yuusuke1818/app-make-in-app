"use client";

import { useState } from "react";
import Header from "./Header";
import BottomNav, { type TabId } from "./BottomNav";
import HomeTab from "./HomeTab";
import CreateWizard from "./CreateWizard";
import CommunityTab from "./CommunityTab";
import RankingTab from "./RankingTab";
import MyAppsTab from "./MyAppsTab";
import ImproveDialog from "./ImproveDialog";
import { GENRES, SAMPLE_APPS } from "@/lib/constants";
import type { AppCreationOptions } from "@/types";

interface SavedApp {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  options: AppCreationOptions;
}

export default function AMIAApp() {
  const [tab, setTab] = useState<TabId>("home");
  const [initialGenre, setInitialGenre] = useState<string | undefined>();
  const [myApps, setMyApps] = useState<SavedApp[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<AppCreationOptions | null>(null);
  const [improvingApp, setImprovingApp] = useState<SavedApp | null>(null);
  const [detailApp, setDetailApp] = useState<(typeof SAMPLE_APPS)[number] | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  // アプリ生成処理
  const handleGenerate = async (options: AppCreationOptions) => {
    setGenerating(true);
    setGeneratedOptions(options);
    // 実際にはここでClaude APIを呼び出す
    await new Promise((r) => setTimeout(r, 3000));
    setGenerating(false);

    const genre = GENRES.find((g) => g.id === options.genre);
    const saved: SavedApp = {
      id: `my_${Date.now()}`,
      title: options.name || `${genre?.label || "カスタム"}アプリ`,
      thumbnail: `${genre?.icon || "✨"}🎮`,
      createdAt: new Date().toISOString().split("T")[0],
      options,
    };
    setMyApps((prev) => [...prev, saved]);
    setGeneratedOptions(null);
    setTab("myapps");
  };

  // 改良処理
  const handleImprove = async (instruction: string) => {
    if (!improvingApp) return;
    setImprovingApp(null);
    setGenerating(true);
    // 実際にはClaude APIで改良指示を送信
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    // 改良完了のフィードバック（将来的にはアプリ内容を更新）
  };

  // 生成中画面
  if (generating) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0a0a1a]">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="mb-4 text-5xl" style={{ animation: "spin 2s linear infinite" }}>
            ⚡
          </div>
          <h3 className="mb-2 text-lg font-bold">AIがアプリを生成中...</h3>
          <p className="mb-6 text-sm text-[#888]">
            選択された全要素を分析し、最適なアプリを構築しています
          </p>
          <div className="w-full max-w-xs space-y-2 rounded-xl bg-[#111118] p-4 text-left text-xs text-[#666]">
            <div>✅ ジャンル・モード解析完了</div>
            <div>✅ 世界観・テーマ適用中...</div>
            <div>✅ ゲームシステム構築中...</div>
            <div className="animate-pulse">⏳ UI・演出を生成中...</div>
          </div>
        </div>
      </div>
    );
  }

  // アプリ詳細画面
  if (detailApp) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0a0a1a]">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-4">
          <button
            onClick={() => setDetailApp(null)}
            className="mb-3 text-sm text-[#aaa] hover:text-white"
          >
            ← 一覧に戻る
          </button>
          <div className="rounded-2xl bg-[#111118] p-5">
            <div className="mb-4 flex gap-4">
              <div className="text-6xl">{detailApp.thumbnail}</div>
              <div className="flex-1">
                <h2 className="mb-1 text-xl font-extrabold">{detailApp.title}</h2>
                <div className="text-sm text-[#888]">
                  by {detailApp.author} • {detailApp.createdAt}
                </div>
                <div className="mt-1 text-sm text-[#aaa]">{detailApp.desc}</div>
                <div className="mt-2 flex gap-4 text-sm">
                  <span>⭐ {detailApp.rating}</span>
                  <span>▶ {detailApp.plays.toLocaleString()}</span>
                  <span>❤️ {detailApp.likes}</span>
                  <span>💬 {detailApp.comments}</span>
                </div>
              </div>
            </div>
            <button className="mb-4 w-full rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] py-3.5 text-base font-extrabold text-white transition-transform hover:scale-[1.01]">
              ▶ プレイする
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
                <span className="ml-2 self-center text-sm text-[#888]">
                  {ratings[detailApp.id]}/5
                </span>
              )}
            </div>
          </div>
        </main>
        <BottomNav activeTab={tab} onTabChange={(t) => { setDetailApp(null); setTab(t); }} />
      </div>
    );
  }

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
        {tab === "create" && (
          <CreateWizard
            initialGenre={initialGenre}
            onComplete={handleGenerate}
          />
        )}
        {tab === "community" && <CommunityTab onAppClick={setDetailApp} />}
        {tab === "ranking" && <RankingTab onAppClick={setDetailApp} />}
        {tab === "myapps" && (
          <MyAppsTab
            apps={myApps}
            onPlay={() => {}}
            onDelete={(id) => setMyApps((prev) => prev.filter((a) => a.id !== id))}
            onImprove={(app) => setImprovingApp(app as any)}
            onCreateClick={() => { setInitialGenre(undefined); setTab("create"); }}
          />
        )}
      </main>
      <BottomNav activeTab={tab} onTabChange={(t) => { setDetailApp(null); setTab(t); }} />

      {/* 改良ダイアログ */}
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
