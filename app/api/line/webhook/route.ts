import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, getUserProfile, replyMessage } from "@/lib/line";
import { getServerSupabase } from "@/lib/supabase";

export const runtime = "edge";

type LineWebhookEvent = {
  type: string;
  replyToken?: string;
  source?: { userId?: string };
  message?: { type?: string; text?: string };
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-line-signature") || "";

  // 署名検証
  const valid = await verifyLineSignature(
    body,
    signature,
    process.env.LINE_CHANNEL_SECRET!
  );
  if (!valid) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const data = JSON.parse(body) as { events?: LineWebhookEvent[] };
  const events = data.events || [];
  const supabase = getServerSupabase();

  for (const event of events) {
    try {
      // 友だち追加イベント
      if (event.type === "follow") {
        const userId = event.source?.userId;
        if (!userId) continue;
        const profile = await getUserProfile(userId);

        // DBに保存（既にいたら更新）
        await supabase.from("line_users").upsert(
          {
            line_user_id: userId,
            display_name: profile?.displayName ?? null,
            picture_url: profile?.pictureUrl ?? null,
            status_message: profile?.statusMessage ?? null,
            is_blocked: false,
            followed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "line_user_id" }
        );

        // あいさつメッセージは LINE Official Account Manager 側の設定を推奨。
        // ここでは追加送信しない。
      }

      // ブロック（友だち解除）イベント
      if (event.type === "unfollow") {
        const userId = event.source?.userId;
        if (!userId) continue;

        await supabase
          .from("line_users")
          .update({
            is_blocked: true,
            updated_at: new Date().toISOString(),
          })
          .eq("line_user_id", userId);

        // 進行中の配信を停止
        await supabase
          .from("step_deliveries")
          .update({
            status: "stopped",
            updated_at: new Date().toISOString(),
          })
          .eq("line_user_id", userId)
          .in("status", ["pending", "in_progress"]);
      }

      // メッセージイベント（簡易な自動応答）
      if (event.type === "message" && event.message?.type === "text") {
        const text = event.message.text ?? "";
        const replyToken = event.replyToken;

        if (replyToken && text.includes("診断")) {
          await replyMessage(replyToken, [
            {
              type: "text",
              text: `診断はこちらから受けられます。\nhttps://liff.line.me/${process.env.LIFF_ID}`,
            },
          ]);
        }
      }
    } catch (err) {
      console.error("Webhook event error:", err);
      // エラーでもイベント単位で処理を続ける
    }
  }

  return NextResponse.json({ ok: true });
}
