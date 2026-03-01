import { NextRequest, NextResponse } from "next/server";

// TODO: 本番ではDBを使用する（Vercel KV / Supabase / PlanetScale等）
// 現在はインメモリで管理（サーバー再起動でリセット）
const userUsageMap = new Map<string, {
  planId: string;
  generateCount: number;
  improveCount: number;
  periodStart: string;
  stripeCustomerId?: string;
}>();

function getOrCreateUsage(userId: string) {
  if (!userUsageMap.has(userId)) {
    userUsageMap.set(userId, {
      planId: "free",
      generateCount: 0,
      improveCount: 0,
      periodStart: new Date().toISOString().slice(0, 7), // YYYY-MM
    });
  }
  const usage = userUsageMap.get(userId)!;

  // 月が変わったらリセット
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (usage.periodStart !== currentMonth) {
    usage.generateCount = 0;
    usage.improveCount = 0;
    usage.periodStart = currentMonth;
  }

  return usage;
}

// GET: 使用量取得
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userIdが必要です" }, { status: 400 });
  }

  const usage = getOrCreateUsage(userId);
  return NextResponse.json(usage);
}

// POST: 使用量加算 or プラン更新
export async function POST(req: NextRequest) {
  try {
    const { userId, action, planId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userIdが必要です" }, { status: 400 });
    }

    const usage = getOrCreateUsage(userId);

    if (action === "generate") {
      usage.generateCount += 1;
    } else if (action === "improve") {
      usage.improveCount += 1;
    } else if (action === "updatePlan" && planId) {
      usage.planId = planId;
    }

    userUsageMap.set(userId, usage);
    return NextResponse.json(usage);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
