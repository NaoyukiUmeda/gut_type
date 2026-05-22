import { NextRequest, NextResponse } from "next/server";
import { pushMessage, Message } from "@/lib/line";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  // CRON_SECRET で認可（外部から叩かれないように）
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { line_user_id, messages } = (await req.json()) as {
    line_user_id: string;
    messages: Message[];
  };

  const ok = await pushMessage(line_user_id, messages);
  return NextResponse.json({ ok });
}
