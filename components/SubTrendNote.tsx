"use client";

import { useSearchParams } from "next/navigation";
import { TYPES, TypeId } from "@/lib/types";

/**
 * サブ傾向の表示。
 * 静的エクスポートでは結果ページのサーバーコンポーネントが
 * クエリパラメータを参照できないため、クライアント側で ?sub= を読む。
 */
export default function SubTrendNote({ main }: { main: TypeId }) {
  const searchParams = useSearchParams();
  const raw = searchParams.get("sub")?.toUpperCase();
  const sub = raw as TypeId | undefined;

  if (!sub || sub === main || !TYPES[sub]) return null;

  return (
    <p className="text-sm text-stone-600 mt-3">
      サブ傾向：{TYPES[sub].name}もややあり
    </p>
  );
}
