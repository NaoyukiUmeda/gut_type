import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TYPES, TypeId } from "@/lib/types";
import ResultCard from "@/components/ResultCard";
import CTAButton from "@/components/CTAButton";
import Disclaimer from "@/components/Disclaimer";

const TYPE_IDS: TypeId[] = ["A", "B", "C", "D", "E"];

// 静的エクスポート用：A〜Eのページを事前生成
export function generateStaticParams() {
  return TYPE_IDS.map((type) => ({ type }));
}

export function generateMetadata({
  params,
}: {
  params: { type: string };
}): Metadata {
  const data = TYPES[params.type.toUpperCase() as TypeId];
  if (!data) return {};
  return {
    title: `${data.name} | 自分に合う腸活タイプ診断`,
    description: data.catchphrase,
    openGraph: {
      title: `あなたの腸活タイプは「${data.name}」`,
      description: data.catchphrase,
      type: "website",
    },
  };
}

export default function ResultPage({
  params,
}: {
  params: { type: string };
}) {
  const type = params.type.toUpperCase() as TypeId;
  const data = TYPES[type];
  if (!data) notFound();

  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "#";

  return (
    <main className="max-w-md mx-auto px-6 py-12 flex flex-col min-h-screen">
      <ResultCard data={data} />

      <div className="mt-10 flex flex-col items-center gap-3">
        <CTAButton href={lineUrl} external>
          LINEで詳細を受け取る
        </CTAButton>
        <p className="text-xs text-stone-500 text-center leading-relaxed">
          3日間のミニ講座と無料個別相談の案内が届きます
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="text-sm text-stone-500 hover:text-stone-700 underline underline-offset-4"
        >
          もう一度診断する
        </Link>
      </div>

      <Disclaimer />
    </main>
  );
}
