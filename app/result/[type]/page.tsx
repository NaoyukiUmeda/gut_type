import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TYPES, TypeId } from "@/lib/types";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import SubTrendNote from "@/components/SubTrendNote";
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
    title: `${data.name} | 腸活スタートタイプ診断`,
    description: data.catchphrase,
    openGraph: {
      title: `あなたの腸活スタートタイプは「${data.name}」`,
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
    <main className="max-w-md mx-auto px-4 py-8">
      {/* ヘッダー */}
      <header className="text-center mb-6">
        <p className="text-sm text-stone-500 mb-2">
          あなたの腸活スタートタイプは
        </p>
        <h1 className="text-2xl font-bold text-stone-800 leading-relaxed">
          {data.name}
        </h1>
        <Suspense fallback={null}>
          <SubTrendNote main={type} />
        </Suspense>
        <p className="text-stone-700 leading-relaxed mt-4">
          {data.catchphrase}
        </p>
      </header>

      {/* Before / After（中核） */}
      <BeforeAfterSection
        typeId={type}
        beforeTitle={data.beforeTitle}
        beforeDescription={data.beforeDescription}
        afterTitle={data.afterTitle}
        afterDescription={data.afterDescription}
        transitionMessage={data.transitionMessage}
        traits={data.traits}
        altPrefix={data.name}
      />

      {/* 今日からできること */}
      <section className="my-8">
        <h2 className="font-bold mb-3 text-stone-800">✨ 今日からできること</h2>
        <ol className="space-y-2">
          {data.todos.map((todo, i) => (
            <li key={todo} className="text-stone-700 leading-relaxed">
              {i + 1}. {todo}
            </li>
          ))}
        </ol>
      </section>

      {/* コンビニで選ぶなら */}
      <section className="my-8">
        <h2 className="font-bold mb-3 text-stone-800">🍵 コンビニで選ぶなら</h2>
        <ul className="grid grid-cols-2 gap-2">
          {data.conveni.map((c) => (
            <li key={c} className="text-stone-700 text-sm">
              ・{c}
            </li>
          ))}
        </ul>
      </section>

      {/* レシピ */}
      <section className="my-8 bg-stone-100/60 rounded-2xl p-6">
        <h2 className="font-bold mb-3 text-stone-800">🥣 おすすめレシピ</h2>
        <p className="font-bold mb-2 text-stone-800">{data.recipeName}</p>
        <p className="text-sm text-stone-600 mb-1">
          材料：{data.recipeIngredients.join("、")}
        </p>
        <p className="text-sm text-stone-700 mb-3 leading-relaxed">
          {data.recipeHow}
        </p>
        <p className="text-xs text-stone-600 leading-relaxed">
          {data.recipeNote}
        </p>
      </section>

      {/* 菌の豆知識（折りたたみ） */}
      <details className="my-8 bg-stone-100/60 rounded-2xl p-4">
        <summary className="cursor-pointer font-bold text-stone-700">
          もっと知りたい人向け：菌の豆知識
        </summary>
        <p className="text-xs text-stone-600 leading-relaxed mt-3">
          {data.bacteriaNote}
        </p>
      </details>

      {/* 注意書き */}
      <Disclaimer />

      {/* LINE誘導（最重要CTA） */}
      <section className="my-8 bg-emerald-50/60 rounded-3xl p-6 border border-emerald-100">
        <p className="text-sm text-stone-600 mb-3">📱 さらに詳しく知りたい方は</p>
        <h2 className="font-bold text-lg mb-3 text-stone-800 leading-relaxed">
          LINEで「あなた専用の3日間ミニ講座」を受け取れます
        </h2>
        <p className="text-sm text-stone-600 mb-5 leading-relaxed">
          今の結果に加えて、{data.name}向けの具体的なアクションプランを
          3日間にわたってお届けします。
        </p>
        <a
          href={lineUrl}
          className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-2xl text-center transition"
        >
          LINEで詳しい解説を受け取る
        </a>
      </section>

      <div className="text-center mt-8">
        <Link href="/" className="text-sm text-stone-500 underline">
          もう一度診断する
        </Link>
      </div>
    </main>
  );
}
