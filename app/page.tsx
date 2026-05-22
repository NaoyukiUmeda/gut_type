import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import Disclaimer from "@/components/Disclaimer";

export default function Home() {
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

        <div className="mt-6 flex flex-col items-center gap-4 w-full">
          <CTAButton href="/quiz/">診断をスタートする</CTAButton>
          <Link
            href="/notice/"
            className="text-sm text-stone-500 hover:text-stone-700 underline underline-offset-4"
          >
            この診断について
          </Link>
        </div>
      </div>

      <Disclaimer />
    </main>
  );
}
