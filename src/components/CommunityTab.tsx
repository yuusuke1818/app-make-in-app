"use client";

import { useState } from "react";
import { SAMPLE_APPS } from "@/lib/constants";

interface CommunityTabProps {
  onAppClick: (app: (typeof SAMPLE_APPS)[number]) => void;
}

export default function CommunityTab({ onAppClick }: CommunityTabProps) {
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_APPS.filter(
    (a) =>
      !search ||
      a.title.includes(search) ||
      a.desc.includes(search) ||
      a.genre.includes(search)
  );

  return (
    <div className="animate-fadeIn">
      <h2 className="mb-3 text-lg font-extrabold">🌐 コミュニティ</h2>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 アプリを検索..."
        className="mb-4 w-full rounded-lg border border-[#333] bg-[#111118] px-4 py-2.5 text-sm text-white outline-none focus:border-[#4ECDC4]"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((app) => (
          <div
            key={app.id}
            onClick={() => onAppClick(app)}
            className="cursor-pointer rounded-xl border border-[#222233] bg-[#111118] p-4 transition-colors hover:border-[#4ECDC4]"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-1 text-3xl">{app.thumbnail}</div>
                <div className="text-sm font-bold">{app.title}</div>
              </div>
              <div className="text-right text-[11px] text-[#888]">
                <div>⭐ {app.rating}</div>
                <div>▶ {app.plays.toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-1 text-xs text-[#888]">by {app.author}</div>
            <div className="mt-1 text-[11px] text-[#666]">{app.desc}</div>
            <div className="mt-2 flex gap-3 text-[11px] text-[#555]">
              <span>❤️ {app.likes}</span>
              <span>💬 {app.comments}</span>
              <span>📅 {app.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
