import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import Disclaimer from "@/components/Disclaimer";

export default function Home() {
  return (
    <main className="max-w-md mx-auto px-6 py-12 flex flex-col items-center min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-3xl mb-4" aria-hidden>
          🌱
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 leading-relaxed">
          自分に合う
          <br />
          腸活タイプ診断
        </h1>
        <p className="text-stone-600 leading-relaxed mt-5">
          腸活しているのに変わらない理由は、
          <br />
          あなたの腸に合っていないからかもしれません。
        </p>

        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-6 py-6 mt-8 text-left w-full">
          <ul className="text-stone-700 leading-relaxed space-y-2 text-sm">
            <li>・12問の質問に答えるだけ</li>
            <li>・あなたのタイプと、今日からやることが分かる</li>
            <li>・所要時間：約2分</li>
          </ul>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 w-full">
          <CTAButton href="/quiz/">診断をはじめる</CTAButton>
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
