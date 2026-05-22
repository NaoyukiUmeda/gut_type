import { createClient } from "@supabase/supabase-js";

/**
 * サーバー側（API Routes / Pages Functions）専用の Supabase クライアント。
 * SERVICE_ROLE_KEY を使うため、絶対にクライアントへ露出させないこと。
 *
 * 本プロジェクトは Supabase へサーバー側からのみアクセスする設計のため、
 * クライアント用クライアント（ANON KEY 利用）は用意しない。
 */
export function getServerSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
