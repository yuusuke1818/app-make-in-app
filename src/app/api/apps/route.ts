import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const published = req.nextUrl.searchParams.get("published");
  const sort = req.nextUrl.searchParams.get("sort") || "created_at";

  const supabase = getSupabase();
  if (!supabase) return NextResponse.json([]);

  let query = supabase.from("apps").select("*, users(display_name, avatar_url)");

  if (userId) query = query.eq("user_id", userId);
  if (published === "true") query = query.eq("status", "published");

  if (sort === "rating") {
    query = query.order("avg_rating", { ascending: false });
  } else if (sort === "plays") {
    query = query.order("play_count", { ascending: false });
  } else if (sort === "likes") {
    query = query.order("like_count", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query.limit(50);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ id: "local_" + Date.now(), ...body });

    const { data, error } = await supabase.from("apps").insert({
      user_id: body.userId, title: body.title, genre: body.genre,
      theme: body.theme || "", mood: body.mood || "",
      thumbnail: body.thumbnail || "🎮", description: body.description || "",
      options: body.options || {}, code: body.code || "stub",
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
