"use client";

import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#222233] bg-gradient-to-r from-[#1a0a2e] to-[#0a1a3e] px-5 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#45B7D1] bg-clip-text text-2xl font-black tracking-wide text-transparent">
            ⚡ {APP_NAME}
          </span>
          <span className="rounded-full bg-[#1a1a2e] px-2 py-0.5 text-[10px] text-[#888]">
            {APP_SUBTITLE}
          </span>
        </div>
        <div className="text-xs text-[#555]">v0.2</div>
      </div>
    </header>
  );
}
