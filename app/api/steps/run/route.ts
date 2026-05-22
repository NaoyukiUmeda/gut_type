import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";
import { pushMessage } from "@/lib/line";
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

const CONSULT_URL = process.env.NEXT_PUBLIC_CONSULT_URL || "#";

type DebugLog = {
  step: string;
  ok: boolean;
  detail?: unknown;
  error?: string;
};

// レスポンス本文を返しつつ、同じ内容を console.log で出力する。
// Cloudflare のテレメトリ（logs 配列）から内容を確認できるようにするため。
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonLog(payload: any, status?: number) {
  console.log("[steps/run]", JSON.stringify(payload));
  return NextResponse.json(payload, status ? { status } : undefined);
}

export async function GET(req: NextRequest) {
  const debug: DebugLog[] = [];
  const now = new Date().toISOString();

  // 1. 認可チェック
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return jsonLog({ ok: false, error: "unauthorized" }, 401);
  }

  // 2. 環境変数チェック
  const envCheck = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    LINE_CHANNEL_ACCESS_TOKEN: !!process.env.LINE_CHANNEL_ACCESS_TOKEN,
    CRON_SECRET: !!process.env.CRON_SECRET,
  };
  debug.push({ step: "env_check", ok: true, detail: envCheck });

  if (!envCheck.SUPABASE_URL || !envCheck.SUPABASE_SERVICE_ROLE_KEY) {
    return jsonLog({ ok: false, error: "missing_env", debug }, 500);
  }

  // 3. Supabaseクライアント初期化
  let supabase;
  try {
    supabase = getServerSupabase();
    debug.push({ step: "supabase_init", ok: true });
  } catch (err) {
    debug.push({
      step: "supabase_init",
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
    return jsonLog({ ok: false, error: "supabase_init_failed", debug }, 500);
  }

  // 4. 配信対象の取得
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let deliveries: any[] = [];
  try {
    const { data, error } = await supabase
      .from("step_deliveries")
      .select("*, line_users!inner(is_blocked, display_name)")
      .in("status", ["pending", "in_progress"])
      .lte("next_send_at", now)
      .eq("line_users.is_blocked", false);

    if (error) {
      debug.push({
        step: "fetch_deliveries",
        ok: false,
        error: error.message,
        detail: { code: error.code, hint: error.hint, details: error.details },
      });
      return jsonLog({ ok: false, error: "fetch_failed", debug }, 500);
    }

    deliveries = data || [];
    debug.push({
      step: "fetch_deliveries",
      ok: true,
      detail: {
        count: deliveries.length,
        sample: deliveries[0]
          ? {
              id: deliveries[0].id,
              main_type: deliveries[0].main_type,
              current_day: deliveries[0].current_day,
              status: deliveries[0].status,
            }
          : null,
      },
    });
  } catch (err) {
    debug.push({
      step: "fetch_deliveries_exception",
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
    return jsonLog({ ok: false, error: "fetch_exception", debug }, 500);
  }

  // 5. 配信処理
  let sentCount = 0;
  let failedCount = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemLogs: any[] = [];

  for (const delivery of deliveries) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemLog: any = {
      id: delivery.id,
      main_type: delivery.main_type,
      current_day: delivery.current_day,
      ok: false,
    };

    try {
      const nextDay = delivery.current_day + 1;

      if (!["A", "B", "C", "D", "E"].includes(delivery.main_type)) {
        itemLog.error = `invalid main_type: ${delivery.main_type}`;
        itemLogs.push(itemLog);
        failedCount++;
        continue;
      }

      if (nextDay > 3) {
        const { error: updateErr } = await supabase
          .from("step_deliveries")
          .update({ status: "completed", completed_at: now, updated_at: now })
          .eq("id", delivery.id);
        if (updateErr) {
          itemLog.error = `update_complete_failed: ${updateErr.message}`;
        } else {
          itemLog.ok = true;
          itemLog.note = "marked as completed";
        }
        itemLogs.push(itemLog);
        continue;
      }

      const message = STEP_MESSAGES[delivery.main_type as TypeId]?.[nextDay];
      if (!message) {
        itemLog.error = `no message for type=${delivery.main_type} day=${nextDay}`;
        itemLogs.push(itemLog);
        failedCount++;
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const messages: any[] = [{ type: "text", text: message }];
      if (nextDay === 3) {
        messages.push({
          type: "text",
          text: `無料個別相談はこちらから予約できます。\n${CONSULT_URL}`,
        });
      }

      const ok = await pushMessage(delivery.line_user_id, messages);
      if (!ok) {
        itemLog.error = "push_failed (LINE API)";
        itemLogs.push(itemLog);
        failedCount++;
        continue;
      }

      const next = new Date();
      next.setUTCDate(next.getUTCDate() + 1);
      next.setUTCHours(0, 0, 0, 0);

      const { error: updateErr } = await supabase
        .from("step_deliveries")
        .update({
          current_day: nextDay,
          status: nextDay >= 3 ? "completed" : "in_progress",
          next_send_at: nextDay >= 3 ? null : next.toISOString(),
          completed_at: nextDay >= 3 ? now : null,
          updated_at: now,
        })
        .eq("id", delivery.id);

      if (updateErr) {
        itemLog.error = `update_after_push_failed: ${updateErr.message}`;
        itemLogs.push(itemLog);
        failedCount++;
        continue;
      }

      itemLog.ok = true;
      itemLog.sent_day = nextDay;
      itemLogs.push(itemLog);
      sentCount++;
    } catch (err) {
      itemLog.error = err instanceof Error ? err.message : String(err);
      itemLogs.push(itemLog);
      failedCount++;
    }
  }

  return jsonLog({
    ok: true,
    sent: sentCount,
    failed: failedCount,
    total: deliveries.length,
    debug,
    items: itemLogs,
  });
}
