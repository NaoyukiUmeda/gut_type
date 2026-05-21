import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "この診断について | 自分に合う腸活タイプ診断",
  description: "腸活タイプ診断の注意事項・免責事項について。",
};

export default function NoticePage() {
  return (
    <main className="max-w-md mx-auto px-6 py-12 flex flex-col min-h-screen">
      <h1 className="text-xl font-bold text-stone-800 text-center">
        この診断について
      </h1>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm px-6 py-6 mt-8">
        <p className="text-stone-700 leading-loose">
          この診断は、現在の生活習慣や体感から
          <br />
          腸活の始め方を提案するセルフチェックです。
          <br />
          医療行為・診断・治療を目的としたものではありません。
        </p>
        <p className="text-stone-700 leading-loose mt-5">
          強い腹痛、血便、急な体重減少、
          <br />
          長引く下痢・便秘などがある場合は、
          <br />
          医療機関にご相談ください。
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
