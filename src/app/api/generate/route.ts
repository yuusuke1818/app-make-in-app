import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// 選択肢IDからラベルへの変換マップ
const LABEL_MAP: Record<string, Record<string, string>> = {
  genre: {
    battle: "バトル", nurture: "育成", card: "カード", puzzle: "パズル",
    rpg: "RPG", quiz: "クイズ", rhythm: "リズム", simulator: "シミュレータ", custom: "カスタム",
  },
  gameMode: {
    single: "シングルプレイ", multi: "対人対戦", coop: "協力プレイ",
    timeattack: "タイムアタック", endless: "エンドレス", story: "ストーリー", daily: "デイリー",
  },
  difficulty: {
    easy: "イージー", normal: "ノーマル", hard: "ハード", nightmare: "ナイトメア", auto: "自動調整",
  },
  progression: {
    levelup: "レベルアップ制", stageclear: "ステージクリア制", openworld: "自由探索型",
    wave: "ウェーブ制", turnbased: "ターン制", realtime: "リアルタイム制",
  },
  theme: {
    fantasy: "ファンタジー", scifi: "SF", japanese: "和風", modern: "現代", horror: "ホラー",
    animal: "動物・自然", space: "宇宙", steampunk: "スチームパンク", cyberpunk: "サイバーパンク",
    medieval: "中世", postapocalypse: "終末世界",
  },
  artStyle: {
    pixel: "ドット絵", anime: "アニメ調", minimal: "ミニマル",
    emoji: "絵文字ベース", sketch: "手描き風", neon: "ネオン",
  },
  colorScheme: {
    dark: "ダーク", light: "ライト", pastel: "パステル",
    vivid: "ビビッド", mono: "モノクロ", retro: "レトロ",
  },
  battleSystem: {
    turncommand: "ターン制コマンド", realtime_action: "リアルタイムアクション",
    tactics: "タクティクス", deckbuild: "デッキ構築", janken: "属性相性", auto: "オートバトル",
  },
  growthElements: {
    exp_level: "経験値・レベル", skilltree: "スキルツリー", equipment: "装備・強化",
    evolution: "進化・変身", statalloc: "ステ振り", collection: "図鑑",
  },
  economy: {
    currency: "通貨", craft: "クラフト", shop: "ショップ", gacha: "ガチャ", stamina: "スタミナ",
  },
  saveSystem: {
    autosave: "オートセーブ", manual: "手動セーブ", multislot: "複数スロット",
  },
};

function resolveLabels(key: string, value: string | string[]): string {
  const map = LABEL_MAP[key];
  if (!map) return Array.isArray(value) ? value.join(", ") : value;
  if (Array.isArray(value)) return value.map((v) => map[v] || v).join(", ");
  return map[value] || value;
}

export async function POST(req: NextRequest) {
  try {
    const { options, mode, instruction, existingCode } = await req.json();

    const client = getClient();
    if (!client) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEYが設定されていません。Vercelの環境変数を確認してください。" },
        { status: 500 }
      );
    }

    // プロンプト構築
    let systemPrompt = `あなたは世界最高レベルのゲーム開発者兼デザイナーである。
ユーザの指定に基づき、ブラウザ上で動作する高品質なReactゲームコンポーネントを生成する。

【絶対ルール】
1. export default function Game() で始まるReact関数コンポーネントを1つだけ出力する
2. import文は一切書かない（React.useStateなどReact.xxxの形式で使用する）
3. 外部ライブラリは使用しない。純粋なReact + インラインスタイルのみ
4. コードブロック(\`\`\`)で囲まず、純粋なJavaScriptコードのみを出力する
5. ゲームは完全に動作し、遊べる状態にする
6. 日本語UIにする
7. インラインスタイルでデザインを作り込む。美しいUI/UXにする
8. ゲームロジックは十分な深みを持たせ、単調にしない
9. コード内にコメントは書かない
10. stateの初期化にはReact.useState()を使用する

【デザイン指針】
- 背景色、テキスト色、ボタン色はユーザ指定のカラースキームに従う
- フォントはNoto Sans JPを想定
- ボタンはborderRadius: 8以上、padding充分に取る
- HPバーなどはグラデーション＋アニメーション付きにする
- 画面は最大幅500pxに収める`;

    let userPrompt: string;

    if (mode === "improve" && existingCode) {
      // 改良モード
      userPrompt = `以下の既存ゲームコードを改良してください。

【改良指示】
${instruction}

【既存コード】
${existingCode}

改良後の完全なコードを出力してください。export default function Game() の形式を維持すること。`;
    } else {
      // 新規生成モード
      const spec = `
【アプリ名】${options.name || "無題のゲーム"}
【ジャンル】${resolveLabels("genre", options.genre)}
【ゲームモード】${resolveLabels("gameMode", options.gameMode)}
【難易度】${resolveLabels("difficulty", options.difficulty)}
【進行システム】${resolveLabels("progression", options.progression)}
【世界観】${resolveLabels("theme", options.theme)}
【アートスタイル】${resolveLabels("artStyle", options.artStyle)}
【カラースキーム】${resolveLabels("colorScheme", options.colorScheme)}
【戦闘システム】${resolveLabels("battleSystem", options.battleSystem || "なし")}
【育成要素】${resolveLabels("growthElements", options.growthElements)}
【経済システム】${resolveLabels("economy", options.economy)}
【保存】${resolveLabels("saveSystem", options.saveSystem)}
${options.customPrompt ? `【カスタム指示】${options.customPrompt}` : ""}`;

      userPrompt = `以下の仕様に基づいて、ブラウザで動作する高品質なゲームをReactコンポーネントとして生成してください。

${spec}

ゲームは十分なボリュームと深みを持ち、繰り返し遊びたくなる内容にしてください。
UIは美しく、アニメーションも活用してください。

export default function Game() { ... } の形式で、完全に動作するコードのみを出力してください。`;
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    // レスポンスからコードを抽出
    let code = "";
    for (const block of message.content) {
      if (block.type === "text") {
        code += block.text;
      }
    }

    // コードブロックのマークダウン記法を除去
    code = code.replace(/^```(?:jsx?|typescript|tsx?)?\n?/gm, "").replace(/\n?```$/gm, "").trim();

    // import/export/function前の余計な説明テキストを除去
    const markers = ["function Game", "export default", "import ", "const "];
    const positions = markers.map(m => code.indexOf(m)).filter(i => i >= 0);
    if (positions.length > 0) {
      const earliest = Math.min(...positions);
      if (earliest > 0) code = code.substring(earliest);
    }

    // コードの妥当性を簡易チェック
    if (!code.includes("function Game") && !code.includes("function game")) {
      return NextResponse.json(
        { error: "有効なゲームコードが生成されませんでした。再試行してください。" },
        { status: 500 }
      );
    }

    return NextResponse.json({ code, usage: message.usage });
  } catch (error: any) {
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: error.message || "アプリ生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
