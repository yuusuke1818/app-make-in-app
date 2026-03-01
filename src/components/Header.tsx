"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";
import UsageBadge from "./UsageBadge";
import type { UserUsage } from "@/lib/plans";

interface HeaderProps {
  usage?: UserUsage;
  onUpgradeClick?: () => void;
}

export default function Header({ usage, onUpgradeClick }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-[#222233] bg-gradient-to-r from-[#1a0a2e] to-[#0a1a3e] px-4 py-2.5">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#45B7D1] bg-clip-text text-xl font-black tracking-wide text-transparent sm:text-2xl">
            ⚡ {APP_NAME}
          </span>
          <span className="hidden rounded-full bg-[#1a1a2e] px-2 py-0.5 text-[9px] text-[#888] sm:inline">
            {APP_SUBTITLE}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 使用量バッジ */}
          {usage && onUpgradeClick && (
            <div className="hidden sm:block">
              <UsageBadge usage={usage} onUpgrade={onUpgradeClick} />
            </div>
          )}

          {/* ユーザメニュー */}
          {session ? (
            <div className="flex items-center gap-2">
              <span className="max-w-[80px] truncate text-xs text-[#aaa]">
                {session.user?.name || "ゲスト"}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-md bg-[#222] px-2 py-1 text-[10px] text-[#888] transition-colors hover:bg-[#333]"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded-md bg-[#4ECDC4] px-3 py-1 text-xs font-bold text-white transition-transform hover:scale-105"
            >
              ログイン
            </button>
          )}
        </div>
      </div>

      {/* モバイル用使用量表示 */}
      {usage && onUpgradeClick && (
        <div className="mt-1.5 sm:hidden">
          <UsageBadge usage={usage} onUpgrade={onUpgradeClick} />
        </div>
      )}
    </header>
  );
}
