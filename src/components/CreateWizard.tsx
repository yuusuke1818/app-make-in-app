"use client";

import { useState } from "react";
import {
  GENRES, GAME_MODES, DIFFICULTIES, PROGRESSIONS, THEMES,
  ART_STYLES, COLOR_SCHEMES, BATTLE_SYSTEMS, GROWTH_ELEMENTS,
  ECONOMY_SYSTEMS, SOCIAL_FEATURES, SCREEN_LAYOUTS, CONTROL_METHODS,
  SOUND_EFFECTS, SAVE_SYSTEMS, REPLAY_ELEMENTS, CUSTOMIZE_OPTIONS,
  WIZARD_STEPS,
} from "@/lib/constants";
import type { AppCreationOptions } from "@/types";

interface CreateWizardProps {
  initialGenre?: string;
  onComplete: (options: AppCreationOptions) => void;
}

// 選択肢カードコンポーネント
function OptionCard({
  item,
  selected,
  onClick,
  small,
}: {
  item: { id: string; label: string; icon: string; desc: string; color?: string };
  selected: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 transition-all hover:brightness-110 ${
        small ? "px-3 py-2" : "px-4 py-4"
      }`}
      style={{
        borderColor: selected ? (item.color || "#4ECDC4") : "#222233",
        background: selected ? `${item.color || "#4ECDC4"}15` : "#111118",
      }}
    >
      <div className={small ? "text-lg" : "text-3xl"}>{item.icon}</div>
      <div className={`font-bold ${small ? "mt-0.5 text-xs" : "mt-1 text-sm"}`}>{item.label}</div>
      <div className="mt-0.5 text-[10px] text-[#888]">{item.desc}</div>
    </div>
  );
}

// 複数選択グリッド
function MultiSelectGrid({
  items,
  selected,
  onToggle,
  small,
}: {
  items: readonly { id: string; label: string; icon: string; desc: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  small?: boolean;
}) {
  return (
    <div className={`grid gap-2 ${small ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}>
      {items.map((item) => (
        <OptionCard
          key={item.id}
          item={item}
          selected={selected.includes(item.id)}
          onClick={() => onToggle(item.id)}
          small={small}
        />
      ))}
    </div>
  );
}

export default function CreateWizard({ initialGenre, onComplete }: CreateWizardProps) {
  const [step, setStep] = useState(initialGenre ? 1 : 0);
  const [options, setOptions] = useState<Partial<AppCreationOptions>>({
    name: "",
    genre: (initialGenre as AppCreationOptions["genre"]) || undefined,
    gameMode: ["single"],
    difficulty: "normal",
    progression: "levelup",
    theme: "fantasy",
    artStyle: "emoji",
    colorScheme: "dark",
    battleSystem: "turncommand",
    growthElements: ["exp_level"],
    economy: ["currency"],
    social: ["leaderboard", "likes"],
    screenLayout: "responsive",
    controls: ["tap"],
    sounds: ["se", "animation_light"],
    saveSystem: "autosave",
    replayElements: ["random_gen"],
    customization: ["character_maker"],
    customPrompt: "",
  });

  const set = <K extends keyof AppCreationOptions>(key: K, val: AppCreationOptions[K]) =>
    setOptions((prev) => ({ ...prev, [key]: val }));

  const toggle = (key: keyof AppCreationOptions, id: string) => {
    const arr = (options[key] as string[]) || [];
    set(key, (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]) as any);
  };

  const canNext = () => {
    switch (step) {
      case 0: return !!options.genre;
      default: return true;
    }
  };

  const handleComplete = () => {
    onComplete(options as AppCreationOptions);
  };

  const totalSteps = WIZARD_STEPS.length;

  return (
    <div className="animate-fadeIn">
      <h2 className="mb-4 text-lg font-extrabold">🛠️ アプリを作成</h2>

      {/* プログレスバー */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs text-[#888]">
          {step + 1}/{totalSteps} {WIZARD_STEPS[step]?.label}
        </span>
      </div>
      <div className="mb-6 flex gap-1">
        {WIZARD_STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded"
            style={{
              background: i <= step
                ? "linear-gradient(90deg, #FF6B6B, #4ECDC4)"
                : "#333",
            }}
          />
        ))}
      </div>

      {/* Step 0: ジャンル */}
      {step === 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold">1. ジャンルを選択</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {GENRES.map((g) => (
              <OptionCard
                key={g.id}
                item={g}
                selected={options.genre === g.id}
                onClick={() => set("genre", g.id as any)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 1: ゲームモード＋難易度＋進行 */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-bold">2. ゲームモード（複数選択可）</h3>
            <MultiSelectGrid items={GAME_MODES} selected={options.gameMode || []} onToggle={(id) => toggle("gameMode", id)} small />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold">3. 難易度</h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {DIFFICULTIES.map((d) => (
                <OptionCard key={d.id} item={d} selected={options.difficulty === d.id} onClick={() => set("difficulty", d.id as any)} small />
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold">4. 進行システム</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PROGRESSIONS.map((p) => (
                <OptionCard key={p.id} item={p} selected={options.progression === p.id} onClick={() => set("progression", p.id as any)} small />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: 世界観 */}
      {step === 2 && (
        <div>
          <h3 className="mb-3 text-sm font-bold">5. 世界観・テーマ</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {THEMES.map((t) => (
              <OptionCard key={t.id} item={t} selected={options.theme === t.id} onClick={() => set("theme", t.id as any)} small />
            ))}
          </div>
        </div>
      )}

      {/* Step 3: ビジュアル */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-bold">6. アートスタイル</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ART_STYLES.map((a) => (
                <OptionCard key={a.id} item={a} selected={options.artStyle === a.id} onClick={() => set("artStyle", a.id as any)} small />
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold">7. カラースキーム（配色）</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {COLOR_SCHEMES.map((c) => (
                <OptionCard key={c.id} item={c} selected={options.colorScheme === c.id} onClick={() => set("colorScheme", c.id as any)} small />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: バトルシステム */}
      {step === 4 && (
        <div>
          <h3 className="mb-3 text-sm font-bold">8. 戦闘システム</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BATTLE_SYSTEMS.map((b) => (
              <OptionCard key={b.id} item={b} selected={options.battleSystem === b.id} onClick={() => set("battleSystem", b.id as any)} small />
            ))}
          </div>
        </div>
      )}

      {/* Step 5: 育成・経済 */}
      {step === 5 && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-bold">9. 育成・成長要素（複数選択可）</h3>
            <MultiSelectGrid items={GROWTH_ELEMENTS} selected={options.growthElements || []} onToggle={(id) => toggle("growthElements", id)} small />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold">10. 経済・リソース（複数選択可）</h3>
            <MultiSelectGrid items={ECONOMY_SYSTEMS} selected={options.economy || []} onToggle={(id) => toggle("economy", id)} small />
          </div>
        </div>
      )}

      {/* Step 6: ソーシャル */}
      {step === 6 && (
        <div>
          <h3 className="mb-3 text-sm font-bold">11. ソーシャル要素（複数選択可）</h3>
          <MultiSelectGrid items={SOCIAL_FEATURES} selected={options.social || []} onToggle={(id) => toggle("social", id)} small />
        </div>
      )}

      {/* Step 7: 操作・演出 */}
      {step === 7 && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-bold">12. 画面レイアウト</h3>
            <div className="grid grid-cols-3 gap-2">
              {SCREEN_LAYOUTS.map((s) => (
                <OptionCard key={s.id} item={s} selected={options.screenLayout === s.id} onClick={() => set("screenLayout", s.id as any)} small />
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold">13. 操作方法（複数選択可）</h3>
            <MultiSelectGrid items={CONTROL_METHODS} selected={options.controls || []} onToggle={(id) => toggle("controls", id)} small />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold">14. サウンド・演出（複数選択可）</h3>
            <MultiSelectGrid items={SOUND_EFFECTS} selected={options.sounds || []} onToggle={(id) => toggle("sounds", id)} small />
          </div>
        </div>
      )}

      {/* Step 8: 保存・リプレイ・カスタマイズ */}
      {step === 8 && (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-bold">15. 保存システム</h3>
            <div className="grid grid-cols-3 gap-2">
              {SAVE_SYSTEMS.map((s) => (
                <OptionCard key={s.id} item={s} selected={options.saveSystem === s.id} onClick={() => set("saveSystem", s.id as any)} small />
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold">16. リプレイ性（複数選択可）</h3>
            <MultiSelectGrid items={REPLAY_ELEMENTS} selected={options.replayElements || []} onToggle={(id) => toggle("replayElements", id)} small />
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold">17. カスタマイズ性（複数選択可）</h3>
            <MultiSelectGrid items={CUSTOMIZE_OPTIONS} selected={options.customization || []} onToggle={(id) => toggle("customization", id)} small />
          </div>
        </div>
      )}

      {/* Step 9: 確認・名前入力 */}
      {step === 9 && (
        <div>
          <h3 className="mb-4 text-sm font-bold">アプリ名と最終確認</h3>
          <div className="mb-4 rounded-xl bg-[#111118] p-4">
            <label className="mb-1 block text-xs text-[#aaa]">アプリ名</label>
            <input
              value={options.name || ""}
              onChange={(e) => set("name", e.target.value)}
              placeholder="例：ドラゴンクエスト風RPG"
              className="w-full rounded-lg border border-[#333] bg-[#0a0a1a] px-3 py-2.5 text-sm text-white outline-none focus:border-[#4ECDC4]"
            />
          </div>
          {options.genre === "custom" && (
            <div className="mb-4 rounded-xl bg-[#111118] p-4">
              <label className="mb-1 block text-xs text-[#aaa]">カスタムプロンプト（自由記述）</label>
              <textarea
                value={options.customPrompt || ""}
                onChange={(e) => set("customPrompt", e.target.value)}
                placeholder="どんなアプリを作りたいか自由に記述..."
                className="min-h-[80px] w-full resize-y rounded-lg border border-[#333] bg-[#0a0a1a] px-3 py-2.5 text-sm text-white outline-none focus:border-[#4ECDC4]"
              />
            </div>
          )}
          {/* 選択内容サマリー */}
          <div className="rounded-xl bg-[#111118] p-4">
            <h4 className="mb-3 text-xs font-bold text-[#4ECDC4]">選択内容</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {[
                ["ジャンル", GENRES.find((g) => g.id === options.genre)?.label],
                ["モード", (options.gameMode || []).join(", ")],
                ["難易度", DIFFICULTIES.find((d) => d.id === options.difficulty)?.label],
                ["進行", PROGRESSIONS.find((p) => p.id === options.progression)?.label],
                ["世界観", THEMES.find((t) => t.id === options.theme)?.label],
                ["アート", ART_STYLES.find((a) => a.id === options.artStyle)?.label],
                ["配色", COLOR_SCHEMES.find((c) => c.id === options.colorScheme)?.label],
                ["戦闘", BATTLE_SYSTEMS.find((b) => b.id === options.battleSystem)?.label],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between border-b border-[#222] pb-1">
                  <span className="text-[#888]">{label}</span>
                  <span className="font-semibold">{value || "-"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ナビゲーションボタン */}
      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="rounded-lg border border-[#444] px-5 py-2.5 text-sm text-[#aaa] transition-colors hover:bg-[#222]"
          >
            ← 戻る
          </button>
        )}
        {step < totalSteps - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canNext()}
            className="flex-1 rounded-lg bg-gradient-to-r from-[#4ECDC4] to-[#45B7D1] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02] disabled:opacity-40"
          >
            次へ →
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="flex-1 rounded-lg bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] px-5 py-3 text-base font-extrabold text-white shadow-lg transition-transform hover:scale-[1.02]"
          >
            ⚡ AIで生成する
          </button>
        )}
      </div>
    </div>
  );
}
