import Disclaimer from "@/components/Disclaimer";

export const metadata = {
  title: "腸活スタートタイプ診断",
  description:
    "腸活しているのに変わらない理由は、あなたの腸に合っていないからかもしれません。3分で分かる、無料のLINE診断です。",
  openGraph: {
    title: "腸活スタートタイプ診断",
    description:
      "腸活しているのに変わらない理由は、あなたの腸に合っていないからかもしれません。",
    type: "website",
  },
};

export default function HomePage() {
  const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "#";

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-md mx-auto px-5 py-12">
        {/* ヘッダー */}
        <header className="text-center mb-10">
          <h1 className="text-xl font-bold text-stone-700 tracking-wider">
            腸活スタートタイプ診断
          </h1>
        </header>

        {/* ファーストビュー */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-800 leading-relaxed mb-6">
            腸活しているのに変わらない理由は、
            <br />
            あなたの腸に合っていないからかも
            <br />
            しれません。
          </h2>
          <p className="text-stone-700 leading-relaxed mb-8">
            食事・生活リズム・お腹の体感から、
            <br />
            あなたに合う腸活の始め方が分かる、
            <br />
            無料のLINE診断です。
          </p>
          <div className="text-center text-sm text-stone-500 mb-6">
            3分 ・ 7問 ・ 無料
          </div>
          <a
            href={lineUrl}
            className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 px-8 rounded-2xl text-center transition shadow-sm"
          >
            LINE友だち追加して診断
          </a>
          <p className="text-xs text-stone-500 text-center mt-3">
            タップするとLINEアプリが開きます
          </p>
        </section>

        {/* 診断でわかること */}
        <section className="mb-12 bg-white rounded-3xl p-6 border border-stone-200/80">
          <h3 className="font-bold text-stone-800 mb-4">診断でわかること</h3>
          <ul className="space-y-3">
            {[
              "あなたの腸活タイプ",
              "今日からできる3つのアクション",
              "コンビニで選べる食材",
              "タイプ別おすすめレシピ",
              "3日間のミニ腸活講座(LINE配信)",
              "希望者には無料個別相談",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-stone-700">
                <span className="text-emerald-500 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5つのタイプ */}
        <section className="mb-12">
          <h3 className="font-bold text-stone-800 mb-4 text-center">
            あなたはどのタイプ?
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              "お肉多め・ニオイ気になるタイプ",
              "こってり外食・だるさタイプ",
              "糖質寄り・食後眠気タイプ",
              "ストレス反応・リズム乱れタイプ",
              "バランス維持タイプ",
            ].map((t) => (
              <div
                key={t}
                className="bg-white rounded-2xl px-5 py-4 border border-stone-200/80 text-stone-700 text-sm text-center"
              >
                {t}
              </div>
            ))}
          </div>
        </section>

        {/* こんな方におすすめ */}
        <section className="mb-12 bg-emerald-50/60 rounded-3xl p-6 border border-emerald-100">
          <h3 className="font-bold text-stone-800 mb-4">こんな方におすすめ</h3>
          <ul className="space-y-2 text-stone-700 text-sm">
            <li>・腸活しているのに変化を感じない</li>
            <li>・何から始めたらいいか分からない</li>
            <li>・ヨーグルトやサプリで効果が出ない</li>
            <li>・自分に合う方法を整理したい</li>
          </ul>
        </section>

        {/* もう一度CTA */}
        <section className="mb-12">
          <a
            href={lineUrl}
            className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 px-8 rounded-2xl text-center transition shadow-sm"
          >
            LINE友だち追加して診断
          </a>
          <p className="text-xs text-stone-500 text-center mt-3">
            タップするとLINEアプリが開きます
          </p>
        </section>

        <Disclaimer />
      </div>
    </main>
  );
}
