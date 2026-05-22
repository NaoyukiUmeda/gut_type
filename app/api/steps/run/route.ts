import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { pushMessage, Message } from "@/lib/line";
import { TypeId } from "@/lib/types";

export const runtime = "edge";

// 各タイプ × 各Day（1〜3）の配信メッセージ。
// 文面は運用に合わせて随時調整してよい。
const STEP_MESSAGES: Record<TypeId, Record<number, string>> = {
  A: {
    1: "【Day1】お肉多め・ニオイ気になるタイプのあなたへ。\n\n今日のテーマは“足し算”です。お肉を減らさなくて大丈夫。まずはわかめ味噌汁を1品足すところから。海藻・きのこ・豆類で腸の土台を整えていきましょう。",
    2: "【Day2】やりがちなNG腸活。\n\nニオイが気になると消臭サプリに頼りたくなりますが、先に足したいのは食物繊維です。きのことワカメの味噌汁が手軽でおすすめ。即席味噌汁に乾燥海藻を足すだけでもOK。",
    3: "【Day3】3日間おつかれさまでした。\n\nここまでは“きっかけ”です。あなたに本当に合う続け方は、食事だけでなく生活全体を見ないと分かりません。",
  },
  B: {
    1: "【Day1】こってり外食・だるさタイプのあなたへ。\n\n今日のテーマは“小さな引き算”。全部を変えなくて大丈夫です。まずは飲み物を緑茶に変えるところから始めましょう。",
    2: "【Day2】やりがちなNG腸活。\n\nいきなり完璧な食事を目指すと続きません。揚げ物を週2回だけ「焼き・蒸し」に変える、副菜を1つ足す。そのくらいの小さな調整で十分です。",
    3: "【Day3】3日間おつかれさまでした。\n\n“だるさ”の原因は食事だけとは限りません。一度、生活全体を一緒に整理してみませんか。",
  },
  C: {
    1: "【Day1】糖質寄り・食後眠気タイプのあなたへ。\n\n今日のテーマは“選び方を変える”。糖質はゼロにしなくて大丈夫。白米をもち麦入りにする、おにぎりを冷たいまま食べる、から始めましょう。",
    2: "【Day2】やりがちなNG腸活。\n\n糖質を一気に抜くと反動が来ます。食物繊維やタンパク質を一緒に取るのがコツ。食後5分だけ歩くのも効果的です。",
    3: "【Day3】3日間おつかれさまでした。\n\n食後の眠気や間食欲は、食べる順番でも変わります。あなたに合うやり方を一緒に見つけましょう。",
  },
  D: {
    1: "【Day1】ストレス反応・リズム乱れタイプのあなたへ。\n\n今日のテーマは“腸を追い込まない”。食事を完璧にする前に、まず朝の常温の水を1杯から始めましょう。",
    2: "【Day2】やりがちなNG腸活。\n\n不調が続くと食事を頑張りたくなりますが、このタイプはまず睡眠とリズムが先です。寝る前10分だけスマホを置いてみてください。",
    3: "【Day3】3日間おつかれさまでした。\n\nお腹の不調は、メンタルや生活リズムとセットのことが多いです。一人で抱えず、一度相談してみませんか。",
  },
  E: {
    1: "【Day1】バランス維持タイプのあなたへ。\n\n今日のテーマは“今の良さに足す”。土台はできています。旬の果物や色の違う野菜を1つ足してみましょう。",
    2: "【Day2】もう一歩、楽しむために。\n\n同じものばかりにならないこと。食材の種類を増やすほど、腸活は無理なく楽しく続きます。",
    3: "【Day3】3日間おつかれさまでした。\n\n今の習慣をベースに、さらに自分に合う形へ。気になることがあれば気軽に相談してください。",
  },
};

// Day3 の末尾に付ける個別相談の案内
const CONSULT_URL = process.env.NEXT_PUBLIC_CONSULT_URL || "#";

export async function GET(req: NextRequest) {
  // 認可（外部cronサービスから CRON_SECRET 付きで叩く想定）
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = getServerSupabase();
  const now = new Date().toISOString();

  // 送信対象：pending or in_progress、next_send_at が現在以前、未ブロック
  const { data: deliveries, error } = await supabase
    .from("step_deliveries")
    .select("*, line_users!inner(is_blocked)")
    .in("status", ["pending", "in_progress"])
    .lte("next_send_at", now)
    .eq("line_users.is_blocked", false);

  if (error) {
    console.error("Cron query error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  let sentCount = 0;
  let failedCount = 0;

  for (const delivery of deliveries || []) {
    try {
      const nextDay = delivery.current_day + 1;

      if (nextDay > 3) {
        // 既に3日分送信済み → 完了に倒す
        await supabase
          .from("step_deliveries")
          .update({
            status: "completed",
            completed_at: now,
            updated_at: now,
          })
          .eq("id", delivery.id);
        continue;
      }

      const text = STEP_MESSAGES[delivery.main_type as TypeId][nextDay];
      const messages: Message[] = [{ type: "text", text }];

      // Day3 は個別相談URLも添える
      if (nextDay === 3) {
        messages.push({
          type: "text",
          text: `無料個別相談はこちらから予約できます。\n${CONSULT_URL}`,
        });
      }

      const ok = await pushMessage(delivery.line_user_id, messages);

      if (ok) {
        sentCount++;
        // 次回送信日時（翌日 UTC 0:00 = JST 9:00）
        const next = new Date();
        next.setUTCDate(next.getUTCDate() + 1);
        next.setUTCHours(0, 0, 0, 0);

        await supabase
          .from("step_deliveries")
          .update({
            current_day: nextDay,
            status: nextDay >= 3 ? "completed" : "in_progress",
            next_send_at: nextDay >= 3 ? null : next.toISOString(),
            completed_at: nextDay >= 3 ? now : null,
            updated_at: now,
          })
          .eq("id", delivery.id);
      } else {
        failedCount++;
      }
    } catch (err) {
      console.error("Step delivery error:", err);
      failedCount++;
    }
  }

  return NextResponse.json({
    ok: true,
    sent: sentCount,
    failed: failedCount,
    total: deliveries?.length || 0,
  });
}
