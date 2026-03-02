import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A.M.I.A - App Make In App",
  description: "AIがゲームを自動生成。作って、遊んで、公開して、評価する。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'Noto Sans JP', sans-serif" }}>{children}</body>
    </html>
  );
}
