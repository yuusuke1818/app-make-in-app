"use client";

interface SavedApp {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
}

interface MyAppsTabProps {
  apps: SavedApp[];
  onPlay: (app: SavedApp) => void;
  onDelete: (id: string) => void;
  onImprove: (app: SavedApp) => void;
  onCreateClick: () => void;
}

export default function MyAppsTab({ apps, onPlay, onDelete, onImprove, onCreateClick }: MyAppsTabProps) {
  if (apps.length === 0) {
    return (
      <div className="animate-fadeIn py-10 text-center">
        <div className="mb-3 text-5xl">📭</div>
        <p className="mb-4 text-[#888]">まだアプリを作成していない</p>
        <button
          onClick={onCreateClick}
          className="rounded-lg bg-[#4ECDC4] px-6 py-2.5 font-bold text-white transition-transform hover:scale-105"
        >
          🛠️ アプリを作成する
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h2 className="mb-4 text-lg font-extrabold">📦 マイアプリ</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {apps.map((app) => (
          <div key={app.id} className="rounded-xl border border-[#333] bg-[#111118] p-4">
            <div className="mb-1 text-3xl">{app.thumbnail}</div>
            <div className="text-sm font-bold">{app.title}</div>
            <div className="mt-1 text-[11px] text-[#888]">{app.createdAt}</div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onPlay(app)}
                className="flex-1 rounded-md bg-[#4488FF] py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#3377EE]"
              >
                ▶ プレイ
              </button>
              <button
                onClick={() => onImprove(app)}
                className="flex-1 rounded-md bg-[#FF8844] py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#EE7733]"
              >
                🔧 改良
              </button>
              <button
                onClick={() => onDelete(app.id)}
                className="rounded-md bg-[#f44] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#d33]"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
