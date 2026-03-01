"use client";

import { GENRES, SAMPLE_APPS } from "@/lib/constants";

interface HomeTabProps {
  onCreateClick: () => void;
  onAppClick: (app: (typeof SAMPLE_APPS)[number]) => void;
  onCategoryClick: (genreId: string) => void;
}

export default function HomeTab({ onCreateClick, onAppClick, onCategoryClick }: HomeTabProps) {
  return (
    <div className="animate-fadeIn">
      {/* ヒーロー */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-[#1a0a3e] to-[#0a2a4e] px-6 py-8 text-center">
        <h1 className="mb-2 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-2xl font-extrabold text-transparent">
          アプリの中で、アプリを作ろう。
        </h1>
        <p className="text-sm text-[#aaa]">
          A.M.I.A ― キーワードを選ぶだけでAIがアプリを自動生成。作って、遊んで、共有しよう。
        </p>
        <button
          onClick={onCreateClick}
          className="mt-5 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] px-8 py-3 text-base font-extrabold text-white shadow-lg shadow-[#4ECDC4]/30 transition-transform hover:scale-105"
        >
          🛠️ アプリを作成する
        </button>
      </div>

      {/* 人気アプリ */}
      <h3 className="mb-3 text-base font-bold">🔥 人気のアプリ</h3>
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SAMPLE_APPS.slice(0, 4).map((app) => (
          <div
            key={app.id}
            onClick={() => onAppClick(app)}
            className="cursor-pointer rounded-xl border border-[#222233] bg-[#111118] p-4 transition-colors hover:border-[#4ECDC4]"
          >
            <div className="mb-1 text-4xl">{app.thumbnail}</div>
            <div className="text-sm font-bold">{app.title}</div>
            <div className="mt-1 text-[11px] text-[#888]">
              {app.author} • ⭐{app.rating} • ▶{app.plays.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] text-[#666]">{app.desc}</div>
          </div>
        ))}
      </div>

      {/* カテゴリ */}
      <h3 className="mb-3 text-base font-bold">📁 カテゴリ</h3>
      <div className="flex flex-wrap gap-2">
        {GENRES.filter((c) => c.id !== "custom").map((cat) => (
          <div
            key={cat.id}
            onClick={() => onCategoryClick(cat.id)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border bg-[#111118] px-4 py-2.5 transition-all hover:brightness-125"
            style={{ borderColor: `${cat.color}33` }}
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="text-sm font-semibold">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
