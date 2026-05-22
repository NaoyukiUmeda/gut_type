import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const lineUserId = req.nextUrl.searchParams.get("line_user_id");

  if (!lineUserId) {
    return NextResponse.json(
      { ok: false, error: "line_user_id required" },
      { status: 400 }
    );
  }

  try {
    const supabase = getServerSupabase();

    // 最新の診断結果を取得
    const { data, error } = await supabase
      .from("diagnoses")
      .select("*")
      .eq("line_user_id", lineUserId)
      .order("diagnosed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Fetch diagnosis error:", error);
      return NextResponse.json(
        { ok: false, error: "fetch_failed" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { ok: false, error: "no_diagnosis" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      diagnosis: {
        main_type: data.main_type,
        sub_type: data.sub_type,
        diagnosed_at: data.diagnosed_at,
      },
    });
  } catch (err) {
    console.error("Latest diagnosis exception:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
