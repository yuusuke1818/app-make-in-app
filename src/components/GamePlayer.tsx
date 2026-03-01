"use client";

import { useEffect, useRef, useState } from "react";

interface GamePlayerProps {
  code: string;
  title: string;
  onBack: () => void;
  onImprove: () => void;
}

export default function GamePlayer({ code, title, onBack, onImprove }: GamePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!iframeRef.current || !code) return;

    // React + ReactDOMをCDNから読み込み、生成コードをiframe内で実行
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Noto Sans JP', sans-serif; background: #0a0a1a; color: #eee; overflow-x: hidden; }
    #root { min-height: 100vh; display: flex; flex-direction: column; align-items: center; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js"></script>
  <script type="text/babel">
    try {
      ${code}

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(Game));
      window.parent.postMessage({ type: 'game-loaded' }, '*');
    } catch (err) {
      window.parent.postMessage({ type: 'game-error', message: err.message }, '*');
      document.getElementById('root').innerHTML = '<div style="padding:20px;color:#f44;text-align:center"><h3>エラーが発生しました</h3><p>' + err.message + '</p></div>';
    }
  </script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "game-loaded") {
        setLoaded(true);
        setError(null);
      }
      if (e.data?.type === "game-error") {
        setError(e.data.message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      URL.revokeObjectURL(url);
      window.removeEventListener("message", handleMessage);
    };
  }, [code]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a1a]">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 border-b border-[#222] bg-[#111118] px-4 py-2.5">
        <button
          onClick={onBack}
          className="rounded-md bg-transparent px-2 py-1 text-sm text-[#aaa] transition-colors hover:text-white"
        >
          ← 戻る
        </button>
        <span className="flex-1 text-sm font-bold">{title}</span>
        <button
          onClick={onImprove}
          className="rounded-md bg-[#FF8844] px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#EE7733]"
        >
          🔧 改良
        </button>
      </div>

      {/* ローディング */}
      {!loaded && !error && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="text-4xl" style={{ animation: "spin 1.5s linear infinite" }}>🎮</div>
          <p className="text-sm text-[#888]">ゲームを起動中...</p>
        </div>
      )}

      {/* エラー */}
      {error && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <div className="text-4xl">⚠️</div>
          <p className="text-sm text-[#f44]">ゲーム実行中にエラーが発生</p>
          <p className="max-w-md text-xs text-[#888]">{error}</p>
          <button
            onClick={onImprove}
            className="mt-2 rounded-lg bg-[#FF8844] px-5 py-2 text-sm font-bold text-white"
          >
            🔧 AIで修正する
          </button>
        </div>
      )}

      {/* ゲームiframe */}
      <iframe
        ref={iframeRef}
        className="flex-1 border-none"
        style={{
          width: "100%",
          minHeight: "calc(100vh - 48px)",
          display: error ? "none" : "block",
        }}
        sandbox="allow-scripts allow-same-origin"
        title={title}
      />
    </div>
  );
}
