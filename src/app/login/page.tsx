"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { APP_NAME, APP_SUBTITLE } from "@/lib/constants";

export default function LoginPage() {
  const [guestName, setGuestName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    await signIn("credentials", {
      name: guestName || "ゲスト",
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a1a] px-4">
      <div className="w-full max-w-sm">
        {/* ロゴ */}
        <div className="mb-8 text-center">
          <h1 className="mb-1 bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#45B7D1] bg-clip-text text-4xl font-black tracking-wide text-transparent">
            ⚡ {APP_NAME}
          </h1>
          <p className="text-sm text-[#888]">{APP_SUBTITLE}</p>
          <p className="mt-2 text-xs text-[#666]">
            AIがアプリを自動生成。作って、遊んで、共有しよう。
          </p>
        </div>

        <div className="rounded-2xl bg-[#111118] p-6">
          <h2 className="mb-4 text-center text-base font-bold">ログイン</h2>

          {/* Googleログイン */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="mb-3 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#333] transition-transform hover:scale-[1.02]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Googleでログイン
          </button>

          {/* GitHubログイン */}
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-[#24292e] px-4 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHubでログイン
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#333]" />
            <span className="text-xs text-[#666]">または</span>
            <div className="h-px flex-1 bg-[#333]" />
          </div>

          {/* ゲストログイン */}
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="ニックネーム（任意）"
            className="mb-3 w-full rounded-lg border border-[#333] bg-[#0a0a1a] px-3 py-2.5 text-sm text-white outline-none focus:border-[#4ECDC4]"
          />
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#4ECDC4] to-[#45B7D1] px-4 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "ログイン中..." : "🎮 ゲストで始める"}
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] text-[#555]">
          ログインすることで利用規約に同意したものとみなします
        </p>
      </div>
    </div>
  );
}
