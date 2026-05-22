import Link from "next/link";
import Disclaimer from "@/components/Disclaimer";

export default function Home() {
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "#";

  return (
    <main className="max-w-md mx-auto px-6 py-12 flex flex-col items-center min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
        <p className="text-3xl mb-4" aria-hidden>
          🌱
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 leading-relaxed">
          腸活スタートタイプ診断
        </h1>
        <p className="text-stone-600 leading-relaxed mt-4">
          腸活しているのに変わらない理由は、
          <br />
          あなたの腸に合っていないからかもしれません。
        </p>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-6 py-6 mt-8 text-left w-full">
          <p className="text-stone-700 leading-loose text-sm">
            腸活って、ヨーグルトを食べればいい。
            <br />
            サプリを飲めばいい。
            <br />
            発酵食品を増やせばいい。
          </p>
          <p className="text-stone-700 leading-loose text-sm mt-4">
            そう思われがちだけど、
            <br />
            実際は人によって合うものが違います。
          </p>
          <p className="text-stone-700 leading-loose text-sm mt-4">
            この診断では、食事・生活リズム・お腹の体感から、
            あなたに合いそうな腸活の始め方を整理します。
          </p>
        </div>

        <p className="text-xs text-stone-500 mt-6">所要時間：約3分・7問</p>

        {/* CTA：LINE誘導をメインに */}
        <div className="w-full mt-6">
          {/* メインCTA */}
          <a
            href={lineUrl}
            className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 px-8 rounded-2xl text-center transition"
          >
            LINEで診断する（推奨）
          </a>
          <p className="text-xs text-stone-500 text-center mt-2">
            結果に加えて、あなた専用の3日間ミニ講座が届きます
          </p>

          {/* 区切り */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-stone-200" />
            <p className="text-xs text-stone-400">または</p>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* サブCTA */}
          <a
            href="/quiz/"
            className="block w-full bg-white hover:bg-stone-50 text-stone-700 font-bold py-4 px-8 rounded-2xl text-center transition border-2 border-stone-200"
          >
            Web版で診断する
          </a>
          <p className="text-xs text-stone-500 text-center mt-2">
            LINE登録なしでも結果は見られます
          </p>

          <div className="text-center mt-6">
            <Link
              href="/notice/"
              className="text-sm text-stone-500 hover:text-stone-700 underline underline-offset-4"
            >
              この診断について
            </Link>
          </div>
        </div>
      </div>

      <Disclaimer />
    </main>
  );
}
