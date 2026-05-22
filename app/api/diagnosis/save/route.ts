import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { pushMessage } from "@/lib/line";
import { TYPES, TypeId } from "@/lib/types";

export const runtime = "edge";

type SaveRequest = {
  line_user_id: string;
  display_name?: string;
  main_type: TypeId;
  sub_type: TypeId | null;
  scores: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
  };
  answers: Record<string, string>;
};

export async function POST(req: NextRequest) {
  try {
    const body: SaveRequest = await req.json();
    const supabase = getServerSupabase();

    // 1. ユーザーが未登録なら登録（LIFFでログインしただけの状態を想定）
    await supabase.from("line_users").upsert(
      {
        line_user_id: body.line_user_id,
        display_name: body.display_name ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "line_user_id" }
    );

    // 2. 診断結果を保存
    const { data: diagnosis, error: diagError } = await supabase
      .from("diagnoses")
      .insert({
        line_user_id: body.line_user_id,
        main_type: body.main_type,
        sub_type: body.sub_type,
        score_a: body.scores.A,
        score_b: body.scores.B,
        score_c: body.scores.C,
        score_d: body.scores.D,
        score_e: body.scores.E,
        answers_json: body.answers,
        diagnosed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (diagError || !diagnosis) {
      console.error("Diagnosis save error:", diagError);
      return NextResponse.json(
        { ok: false, error: "DB save failed" },
        { status: 500 }
      );
    }

    // 3. 3日間配信の進行レコードを作成
    // 既存の進行中レコードがあれば stop して新しく作り直す
    await supabase
      .from("step_deliveries")
      .update({ status: "stopped", updated_at: new Date().toISOString() })
      .eq("line_user_id", body.line_user_id)
      .in("status", ["pending", "in_progress"]);

    // 次回送信日時：明日の JST 9:00 = UTC 0:00
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    await supabase.from("step_deliveries").insert({
      line_user_id: body.line_user_id,
      diagnosis_id: diagnosis.id,
      main_type: body.main_type,
      current_day: 0,
      status: "pending",
      next_send_at: tomorrow.toISOString(),
    });

    // 4. 診断完了メッセージを LINE に送信
    const typeData = TYPES[body.main_type];
    await pushMessage(body.line_user_id, [
      {
        type: "text",
        text: `診断おつかれさまでした!\n\nあなたの腸活スタートタイプは\n【${typeData.name}】です。\n\n${typeData.catchphrase}\n\n明日から3日間、あなたのタイプに合わせたミニ講座をお届けします。`,
      },
      {
        type: "text",
        text: `詳しい結果はこちらから見られます。\nhttps://liff.line.me/${process.env.LIFF_ID}?result=${body.main_type}`,
      },
    ]);

    return NextResponse.json({ ok: true, diagnosis_id: diagnosis.id });
  } catch (err) {
    console.error("Save API error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
