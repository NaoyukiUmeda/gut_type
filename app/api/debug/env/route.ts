import { NextResponse } from "next/server";

export const runtime = "edge";

// ⚠️ 切り分け用の一時エンドポイント。動作確認後に必ず削除すること。
export async function GET() {
  const result = {
    SUPABASE_URL: process.env.SUPABASE_URL ? "set" : "missing",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "set"
      : "missing",
    LINE_CHANNEL_ACCESS_TOKEN: process.env.LINE_CHANNEL_ACCESS_TOKEN
      ? "set"
      : "missing",
    CRON_SECRET: process.env.CRON_SECRET ? "set" : "missing",
    NEXT_PUBLIC_CONSULT_URL: process.env.NEXT_PUBLIC_CONSULT_URL || "missing",
    LIFF_ID: process.env.LIFF_ID ? "set" : "missing",
    NEXT_PUBLIC_LIFF_ID: process.env.NEXT_PUBLIC_LIFF_ID ? "set" : "missing",
  };

  // テレメトリの logs 配列から確認できるよう、結果を console.log にも出す。
  console.log("[debug/env]", JSON.stringify(result));

  return NextResponse.json(result);
}
