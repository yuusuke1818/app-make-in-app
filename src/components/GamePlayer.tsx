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

  useEffect(() => {
    if (!iframeRef.current || !code) return;
    const escaped = code.replace(/<\/script>/g, "<\\/script>");
    const html = `<!DOCTYPE html>
<html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Noto Sans JP',sans-serif;background:#0a0a1a;color:#eee;overflow-x:hidden}#root{min-height:100vh;display:flex;flex-direction:column;align-items:center}</style>
</head><body><div id="root"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js"><\/script>
<script type="text/babel">
try{${escaped}
const root=ReactDOM.createRoot(document.getElementById('root'));root.render(React.createElement(Game));
}catch(e){document.getElementById('root').innerHTML='<div style="padding:20px;color:#f44;text-align:center"><h3>エラー</h3><p>'+e.message+'</p></div>';}
<\/script></body></html>`;
    iframeRef.current.srcdoc = html;
  }, [code]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a1a]">
      <div className="flex items-center gap-3 border-b border-[#222] bg-[#111118] px-4 py-2.5">
        <button onClick={onBack} className="rounded-md bg-transparent px-2 py-1 text-sm text-[#aaa] transition-colors hover:text-white">← 戻る</button>
        <span className="flex-1 text-sm font-bold">{title}</span>
        <button onClick={onImprove} className="rounded-md bg-[#FF8844] px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#EE7733]">🔧 改良</button>
      </div>
      <iframe ref={iframeRef} className="flex-1 border-none" style={{ width: "100%", minHeight: "calc(100vh - 48px)" }} title={title} />
    </div>
  );
}
