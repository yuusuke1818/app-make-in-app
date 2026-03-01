"use client";

const TABS = [
  { id: "home", label: "ホーム", icon: "🏠" },
  { id: "create", label: "作成", icon: "🛠️" },
  { id: "community", label: "コミュニティ", icon: "🌐" },
  { id: "ranking", label: "ランキング", icon: "🏆" },
  { id: "myapps", label: "マイアプリ", icon: "📦" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="sticky bottom-0 z-50 flex justify-around border-t border-[#222233] bg-[#111118] py-2">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onTabChange(t.id)}
          className="flex flex-col items-center gap-0.5 border-none bg-transparent px-3 py-1 transition-colors"
          style={{ color: activeTab === t.id ? "#4ECDC4" : "#666" }}
        >
          <span className="text-xl">{t.icon}</span>
          <span
            className="text-[10px]"
            style={{ fontWeight: activeTab === t.id ? 700 : 400 }}
          >
            {t.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
