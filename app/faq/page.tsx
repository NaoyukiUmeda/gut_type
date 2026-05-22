import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "よくある質問 | 腸活スタートタイプ診断",
};

const faqs = [
  {
    q: "診断は無料ですか?",
    a: "はい、診断・LINE配信・個別相談はすべて無料です。",
  },
  {
    q: "個人情報はどう扱われますか?",
    a: "プライバシーポリシーに沿って厳重に管理します。",
  },
  {
    q: "LINEを使わずに診断できますか?",
    a: "Web版の診断もご用意しています。ただし、3日間ミニ講座はLINE登録者限定です。",
  },
  {
    q: "個別相談ではどんなことができますか?",
    a: "診断結果をもとに、今の食事や生活リズムを一緒に整理します。詳しくは個別相談案内ページをご覧ください。",
  },
  {
    q: "腸内フローラ検査について教えてください",
    a: "希望者には個別相談の中で案内しています。検査の詳細は『腸内フローラ検査について』のページをご覧ください。",
  },
];

export default function FaqPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8 text-stone-800">よくある質問</h1>
      <div className="space-y-6">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="bg-stone-50 rounded-2xl p-5 border border-stone-200"
          >
            <summary className="font-bold cursor-pointer text-stone-800">
              {f.q}
            </summary>
            <p className="mt-3 text-stone-700 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
