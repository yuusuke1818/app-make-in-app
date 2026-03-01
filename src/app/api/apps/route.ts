import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET: アプリ一覧取得
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const published = req.nextUrl.searchParams.get("published");
  const sort = req.nextUrl.searchParams.get("sort") || "created_at";

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json([]);
  }

  let query = supabase.from("apps").select("*");

  if (userId) {
    query = query.eq("user_id", userId);
  }
  if (published === "true") {
    query = query.eq("is_published", true);
  }

  if (sort === "rating") {
    query = query.order("rating", { ascending: false });
  } else if (sort === "plays") {
    query = query.order("play_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.limit(50);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST: アプリ保存
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, title, genre, theme, thumbnail, description, options, code } = body;

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ id: `local_${Date.now()}`, ...body });
    }

    const { data, error } = await supabase
      .from("apps")
      .insert({
        user_id: userId,
        title,
        genre,
        theme: theme || null,
        thumbnail: thumbnail || "🎮",
        description: description || "",
        options: options || {},
        code,
      })
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
