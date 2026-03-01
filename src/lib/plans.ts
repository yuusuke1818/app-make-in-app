// ====== 課金プラン定義 ======

export interface PricingPlan {
  id: string;
  name: string;
  price: number; // 月額（円）
  generateLimit: number; // 月間生成回数（-1で無制限）
  improveLimit: number;  // 月間改良回数（-1で無制限）
  badge: string;
  color: string;
  features: string[];
  stripePriceId: string; // Stripeの価格ID（後で設定）
}

export const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    generateLimit: 3,
    improveLimit: 1,
    badge: "🆓",
    color: "#888",
    features: [
      "月3回までアプリ生成",
      "月1回まで改良",
      "アプリ保存3個まで",
      "コミュニティ閲覧",
    ],
    stripePriceId: "",
  },
  {
    id: "basic",
    name: "Basic",
    price: 480,
    generateLimit: 30,
    improveLimit: 15,
    badge: "⭐",
    color: "#4488FF",
    features: [
      "月30回アプリ生成",
      "月15回改良",
      "アプリ保存20個まで",
      "ランキング参加",
      "Basicバッジ",
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || "",
  },
  {
    id: "pro",
    name: "Pro",
    price: 980,
    generateLimit: 100,
    improveLimit: 50,
    badge: "💎",
    color: "#AA44FF",
    features: [
      "月100回アプリ生成",
      "月50回改良",
      "アプリ保存100個まで",
      "優先AI生成",
      "Proバッジ",
      "広告非表示",
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: 1980,
    generateLimit: -1,
    improveLimit: -1,
    badge: "👑",
    color: "#FFD700",
    features: [
      "無制限アプリ生成",
      "無制限改良",
      "アプリ保存無制限",
      "最優先AI生成",
      "Unlimitedバッジ",
      "広告非表示",
      "限定テーマ解放",
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_UNLIMITED_PRICE_ID || "",
  },
];

export function getPlan(planId: string): PricingPlan {
  return PLANS.find((p) => p.id === planId) || PLANS[0];
}

// ====== 使用量チェック ======

export interface UserUsage {
  planId: string;
  generateCount: number; // 今月の生成回数
  improveCount: number;  // 今月の改良回数
  periodStart: string;   // 課金期間開始日
}

export function canGenerate(usage: UserUsage): boolean {
  const plan = getPlan(usage.planId);
  if (plan.generateLimit === -1) return true;
  return usage.generateCount < plan.generateLimit;
}

export function canImprove(usage: UserUsage): boolean {
  const plan = getPlan(usage.planId);
  if (plan.improveLimit === -1) return true;
  return usage.improveCount < plan.improveLimit;
}

export function getRemainingGenerates(usage: UserUsage): number | "unlimited" {
  const plan = getPlan(usage.planId);
  if (plan.generateLimit === -1) return "unlimited";
  return Math.max(0, plan.generateLimit - usage.generateCount);
}

export function getRemainingImproves(usage: UserUsage): number | "unlimited" {
  const plan = getPlan(usage.planId);
  if (plan.improveLimit === -1) return "unlimited";
  return Math.max(0, plan.improveLimit - usage.improveCount);
}
