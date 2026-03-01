"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import Header from "./Header";
import BottomNav, { type TabId } from "./BottomNav";
import HomeTab from "./HomeTab";
import CreateWizard from "./CreateWizard";
import CommunityTab from "./CommunityTab";
import RankingTab from "./RankingTab";
import MyAppsTab from "./MyAppsTab";
import ImproveDialog from "./ImproveDialog";
import GamePlayer from "./GamePlayer";
import PricingModal from "./PricingModal";
import { GENRES, SAMPLE_APPS } from "@/lib/constants";
import { canGenerate, canImprove, type UserUsage } from "@/lib/plans";
import type { AppCreationOptions } from "@/types";
import type { PricingPlan } from "@/lib/plans";

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
  const { data: session } = useSession();
  const [tab, setTab] = useState<TabId>("home");
  const [view, setView] = useState<AppView>("main");
  const [initialGenre, setInitialGenre] = useState<string | undefined>();
  const [myApps, setMyApps] = useState<SavedApp[]>([]);
  const [currentApp, setCurrentApp] = useState<SavedApp | null>(null);
  const [improvingApp, setImprovingApp] = useState<SavedApp | null>(null);
  const [detailApp, setDetailApp] = useState<(typeof SAMPLE_APPS)[number] | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [lastGenOptions, setLastGenOptions] = useState<AppCreationOptions | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  // 使用量管理
  const [usage, setUsage] = useState<UserUsage>({
    planId: "free",
    generateCount: 0,
    improveCount: 0,
    periodStart: new Date().toISOString().slice(0, 7),
  });

  const [genProgress, setGenProgress] = useState(0);
  const [genStatus, setGenStatus] = useState("");
  const [genError, setGenError] = useState<string | null>(null);

  // 使用量取得
  const fetchUsage = useCallback(async () => {
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    try {
      const res = await fetch(`/api/user?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch {}
  }, [session]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  // 使用量加算
  const incrementUsage = async (action: "generate" | "improve") => {
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch {}
  };

  // Stripe決済開始
  const handleSelectPlan = async (plan: PricingPlan) => {
    if (!plan.stripePriceId) {
      alert("このプランの決済設定は準備中です。しばらくお待ちください。");
      setShowPricing(false);
      return;
    }
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          userId: (session?.user as any)?.id,
          userEmail: session?.user?.email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "決済ページの作成に失敗しました");
      }
    } catch (err: any) {
      alert("エラー: " + err.message);
    }
    setShowPricing(false);
  };

  // アプリ生成
  const generateApp = useCallback(async (options: AppCreationOptions) => {
    if (!canGenerate(usage)) {
      setShowPricing(true);
      return;
    }

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

      await incrementUsage("generate");

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
  }, [usage]);

  // 改良
  const handleImprove = useCallback(async (instruction: string) => {
    if (!improvingApp) return;

    if (!canImprove(usage)) {
      setShowPricing(true);
      setImprovingApp(null);
      return;
    }

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

      await incrementUsage("improve");

      const updated: SavedApp = { ...appToImprove, code: data.code };
      setMyApps((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setCurrentApp(updated);
      setTimeout(() => setView("playing"), 500);
    } catch (err: any) {
      clearInterval(timer);
      setGenError(err.message);
    }
  }, [improvingApp, usage]);

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
        <Header usage={usage} onUpgradeClick={() => setShowPricing(true)} />
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
        <Header usage={usage} onUpgradeClick={() => setShowPricing(true)} />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-4">
          <button onClick={() => setDetailApp(null)} className="mb-3 text-sm text-[#aaa] hover:text-white">← 一覧に戻る</button>
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
                </div>
              </div>
            </div>
            <button className="mb-4 w-full rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] py-3.5 text-base font-extrabold text-white opacity-50">
              ▶ プレイする（コミュニティアプリは準備中）
            </button>
            <div className="mb-2 text-sm text-[#aaa]">評価する：</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} onClick={() => setRatings((prev) => ({ ...prev, [detailApp.id]: r }))} className="bg-transparent text-2xl" style={{ color: (ratings[detailApp.id] || 0) >= r ? "#FFD700" : "#333" }}>★</button>
              ))}
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
      <Header usage={usage} onUpgradeClick={() => setShowPricing(true)} />
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
            onPlay={(app) => { const f = myApps.find((a) => a.id === app.id); if (f) playApp(f); }}
            onDelete={(id) => setMyApps((prev) => prev.filter((a) => a.id !== id))}
            onImprove={(app) => { const f = myApps.find((a) => a.id === app.id); if (f) setImprovingApp(f); }}
            onCreateClick={() => { setInitialGenre(undefined); setTab("create"); }}
          />
        )}
      </main>
      <BottomNav activeTab={tab} onTabChange={(t) => { setDetailApp(null); setTab(t); }} />

      {improvingApp && (
        <ImproveDialog appTitle={improvingApp.title} onSubmit={handleImprove} onClose={() => setImprovingApp(null)} />
      )}
      {showPricing && (
        <PricingModal currentPlanId={usage.planId} onSelectPlan={handleSelectPlan} onClose={() => setShowPricing(false)} />
      )}
    </div>
  );
}
