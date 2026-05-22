// LINE Messaging API を fetch で直接呼び出すヘルパー。
// Cloudflare の Edge Runtime（Workers環境）は Node.js 専用APIに非対応のため、
// @line/bot-sdk は使わず fetch のみで実装する。

const LINE_API_BASE = "https://api.line.me/v2/bot";

export type TextMessage = {
  type: "text";
  text: string;
};

export type FlexMessage = {
  type: "flex";
  altText: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contents: any;
};

export type Message = TextMessage | FlexMessage;

export async function pushMessage(
  userId: string,
  messages: Message[]
): Promise<boolean> {
  try {
    const res = await fetch(`${LINE_API_BASE}/message/push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: userId,
        messages,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("LINE Push API error:", res.status, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("LINE Push API exception:", error);
    return false;
  }
}

export async function replyMessage(
  replyToken: string,
  messages: Message[]
): Promise<boolean> {
  try {
    const res = await fetch(`${LINE_API_BASE}/message/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        replyToken,
        messages,
      }),
    });

    return res.ok;
  } catch (error) {
    console.error("LINE Reply API exception:", error);
    return false;
  }
}

export type LineProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
};

export async function getUserProfile(
  userId: string
): Promise<LineProfile | null> {
  try {
    const res = await fetch(`${LINE_API_BASE}/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as LineProfile;
  } catch {
    return null;
  }
}

/**
 * LINE Webhook の署名検証（HMAC-SHA256）。
 * Web Crypto API を使うため Edge Runtime でも動作する。
 */
export async function verifyLineSignature(
  body: string,
  signature: string,
  channelSecret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(channelSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const bytes = new Uint8Array(sig);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const expected = btoa(binary);

  return expected === signature;
}
