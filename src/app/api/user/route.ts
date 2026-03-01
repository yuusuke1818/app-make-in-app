import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET: ユーザ情報取得（なければ作成）
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const name = req.nextUrl.searchParams.get("name") || "ゲスト";

  if (!userId) {
    return NextResponse.json({ error: "userIdが必要です" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    // Supabase未設定時はフォールバック
    return NextResponse.json({
      id: userId,
      plan_id: "free",
      generate_count: 0,
      improve_count: 0,
      period_start: new Date().toISOString().slice(0, 7),
    });
  }

  // ユーザ取得 or 作成
  let { data: user } = await supabase.from("users").select("*").eq("id", userId).single();

  if (!user) {
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({ id: userId, name })
      .select()
      .single();

    if (error) {
      // テーブル未作成の場合のフォールバック
      return NextResponse.json({
        id: userId,
        plan_id: "free",
        generate_count: 0,
        improve_count: 0,
        period_start: new Date().toISOString().slice(0, 7),
      });
    }
    user = newUser;
  }

  // 月リセット
  const currentMonth = new Date().toISOString().slice(0, 7);
  if (user.period_start !== currentMonth) {
    const { data: updated } = await supabase
      .from("users")
      .update({ generate_count: 0, improve_count: 0, period_start: currentMonth })
      .eq("id", userId)
      .select()
      .single();
    if (updated) user = updated;
  }

  return NextResponse.json(user);
}

// POST: 使用量加算 or プラン更新
export async function POST(req: NextRequest) {
  try {
    const { userId, action, planId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "userIdが必要です" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({
        id: userId,
        plan_id: planId || "free",
        generate_count: 0,
        improve_count: 0,
        period_start: new Date().toISOString().slice(0, 7),
      });
    }

    let updateData: Record<string, any> = {};

    if (action === "generate") {
      const { data: user } = await supabase.from("users").select("generate_count").eq("id", userId).single();
      updateData = { generate_count: (user?.generate_count || 0) + 1 };
    } else if (action === "improve") {
      const { data: user } = await supabase.from("users").select("improve_count").eq("id", userId).single();
      updateData = { improve_count: (user?.improve_count || 0) + 1 };
    } else if (action === "updatePlan" && planId) {
      updateData = { plan_id: planId };
    }

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
