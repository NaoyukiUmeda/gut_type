import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "腸内フローラ検査について | 腸活スタートタイプ診断",
};

export default function AboutTestPage() {
  const consultUrl = process.env.NEXT_PUBLIC_CONSULT_URL || "#";

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-stone-800">
        腸内フローラ検査について
      </h1>

      <div className="space-y-6 text-stone-700 leading-relaxed">
        <p>
          腸内フローラ検査は、便を採取して郵送するだけで、
          ご自身の腸内環境の傾向を見ることができる検査です。
        </p>

        <h2 className="font-bold text-lg mt-8">こんな方におすすめ</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>色々試したけど何が合うか分からない方</li>
          <li>自己流の腸活から卒業したい方</li>
          <li>データで自分の腸内環境を確認したい方</li>
        </ul>

        <h2 className="font-bold text-lg mt-8">こんな方には向きません</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>強い症状がある方（まず医療機関へ）</li>
          <li>検査ですべてが分かると期待している方</li>
        </ul>

        <p className="bg-stone-100 rounded-2xl p-5 mt-8">
          検査は無料診断直後にはおすすめしていません。
          まずは無料の個別相談で、本当にあなたに必要かを一緒に確認します。
        </p>

        <a
          href={consultUrl}
          className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-2xl text-center transition mt-8"
        >
          無料個別相談を予約する
        </a>
      </div>
    </main>
  );
}
