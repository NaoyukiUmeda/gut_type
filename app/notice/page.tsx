import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "この診断について | 腸活スタートタイプ診断",
  description: "腸活スタートタイプ診断の注意事項・免責事項について。",
};

export default function NoticePage() {
  return (
    <main className="max-w-md mx-auto px-6 py-12 flex flex-col min-h-screen">
      <h1 className="text-xl font-bold text-stone-800 text-center">
        この診断について
      </h1>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-6 py-6 mt-8">
        <p className="text-stone-700 leading-loose">
          この診断は、今の食事・生活リズム・お腹の体感から、
          あなたに合いそうな腸活の始め方を整理するセルフチェックです。
        </p>
        <p className="text-stone-700 leading-loose mt-5">
          実際にどんな菌がどれくらいいるかは、
          この診断だけでは分かりません。
        </p>
        <p className="text-stone-700 leading-loose mt-5">
          医療行為や病気の診断を目的としたものではありません。
          強い腹痛、血便、急な体重減少、長引く下痢・便秘などがある場合は、
          医療機関に相談してください。
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-base font-bold text-stone-800 mb-2">運営者情報</h2>
        <p className="text-sm text-stone-500 leading-relaxed">
          （運営者名・連絡先は後日記載）
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-bold text-stone-800 mb-2">
          プライバシーポリシー
        </h2>
        <p className="text-sm text-stone-500 leading-relaxed">
          （プライバシーポリシーは後日記載）
        </p>
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="text-sm text-stone-500 hover:text-stone-700 underline underline-offset-4"
        >
          ← トップに戻る
        </Link>
      </div>
    </main>
  );
}
