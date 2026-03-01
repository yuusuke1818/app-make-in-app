"use client";

import { useState } from "react";

interface ImproveDialogProps {
  appTitle: string;
  onSubmit: (instruction: string) => void;
  onClose: () => void;
}

export default function ImproveDialog({ appTitle, onSubmit, onClose }: ImproveDialogProps) {
  const [instruction, setInstruction] = useState("");

  const suggestions = [
    "難易度を上げてほしい",
    "新しいキャラクターを追加",
    "UIをもっとかっこよく",
    "ステージを増やして",
    "BGMを追加して",
    "マルチプレイ対応にして",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#1a1a2e] p-6">
        <h3 className="mb-1 text-base font-bold">🔧 アプリを改良</h3>
        <p className="mb-4 text-xs text-[#888]">「{appTitle}」をどう改良したいか指示してください</p>

        {/* 提案チップ */}
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInstruction((prev) => (prev ? prev + "、" + s : s))}
              className="rounded-full border border-[#333] px-3 py-1 text-[11px] text-[#aaa] transition-colors hover:border-[#4ECDC4] hover:text-[#4ECDC4]"
            >
              {s}
            </button>
          ))}
        </div>

        <textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="改良内容を自由に記述..."
          className="mb-4 min-h-[100px] w-full resize-y rounded-lg border border-[#333] bg-[#0a0a1a] px-3 py-2.5 text-sm text-white outline-none focus:border-[#4ECDC4]"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#444] px-4 py-2 text-sm text-[#aaa] hover:bg-[#222]"
          >
            キャンセル
          </button>
          <button
            onClick={() => instruction && onSubmit(instruction)}
            disabled={!instruction}
            className="flex-1 rounded-lg bg-gradient-to-r from-[#FF8844] to-[#FF6B6B] px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-40"
          >
            ⚡ AIで改良する
          </button>
        </div>
      </div>
    </div>
  );
}
