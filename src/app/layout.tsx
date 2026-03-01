import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A.M.I.A - App Make In App",
  description: "AIがアプリを自動生成。作って、遊んで、共有しよう。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
