"use client";

import { SAMPLE_APPS, RANKING_REWARDS } from "@/lib/constants";

interface RankingTabProps {
  onAppClick: (app: (typeof SAMPLE_APPS)[number]) => void;
}

export default function RankingTab({ onAppClick }: RankingTabProps) {
  const sorted = [...SAMPLE_APPS].sort((a, b) => b.rating - a.rating);

  return (
    <div className="animate-fadeIn">
      <h2 className="mb-4 text-lg font-extrabold">🏆 ランキング</h2>

      {/* 報酬 */}
      <div className="mb-5 rounded-2xl bg-gradient-to-br from-[#1a0a3e] to-[#0a2a4e] p-4">
        <h3 className="mb-2 text-sm font-bold text-[#FFD700]">🎁 入賞特典</h3>
        {RANKING_REWARDS.map((r, i) => (
          <div key={i} className="flex justify-between border-b border-[#222] py-1.5 text-sm">
            <span className="font-bold">{r.rank}</span>
            <span className="text-[#aaa]">{r.reward}</span>
          </div>
        ))}
      </div>

      {/* ランキングリスト */}
      <div className="space-y-2">
        {sorted.map((app, idx) => {
          const medals = ["🥇", "🥈", "🥉"];
          const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
          return (
            <div
              key={app.id}
              onClick={() => onAppClick(app)}
              className="flex cursor-pointer items-center gap-3 rounded-xl border bg-[#111118] px-4 py-3 transition-colors hover:border-[#4ECDC4]"
              style={{ borderColor: idx < 3 ? `${colors[idx]}44` : "#222233" }}
            >
              <div
                className="w-9 text-center text-xl font-black"
                style={{ color: idx < 3 ? colors[idx] : "#555" }}
              >
                {idx < 3 ? medals[idx] : idx + 1}
              </div>
              <div className="text-3xl">{app.thumbnail}</div>
              <div className="flex-1">
                <div className="text-sm font-bold">{app.title}</div>
                <div className="text-[11px] text-[#888]">
                  by {app.author} • ⭐{app.rating} • ▶{app.plays.toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
