# A.M.I.A - App Make In App

AIがアプリを自動生成するプラットフォーム。キーワードを選ぶだけでアプリを作成・プレイ・共有できる。

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイル**: Tailwind CSS
- **AI**: Claude API (Anthropic)
- **デプロイ**: Vercel

## セットアップ

```bash
npm install
npm run dev
```

## 機能一覧

### 実装済み
- 全17カテゴリの要素選択ウィザード（10ステップ）
- ホーム / 作成 / コミュニティ / ランキング / マイアプリ
- アプリ改良機能（ダイアログ経由で指示）
- 評価・ランキングシステム

### 今後実装予定
- Claude API接続によるリアルタイムアプリ生成
- 生成アプリのプレイ機能
- バックエンド（ユーザ認証・データ永続化）
- ソーシャル機能（フレンド・ギルド・チャット）

## ディレクトリ構造

```
src/
├── app/            # Next.js App Router
├── components/     # UIコンポーネント
├── lib/            # 定数・ユーティリティ
└── types/          # TypeScript型定義
```
