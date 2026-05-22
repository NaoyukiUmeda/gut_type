import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | 腸活スタートタイプ診断",
};

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8 text-stone-800">利用規約</h1>

      <section className="space-y-6 text-stone-700 leading-relaxed">
        <div>
          <h2 className="font-bold text-lg mb-2">第1条（適用）</h2>
          <p>
            本規約は、当サービス（腸活スタートタイプ診断）の利用に関する条件を、
            利用者と運営者との間で定めるものです。
          </p>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-2">第2条（サービス内容）</h2>
          <p>
            当サービスは、食事・生活リズム・お腹の体感に関する質問への回答から、
            腸活の始め方を提案するセルフチェックおよび関連情報の配信を行います。
            医療行為・診断・治療を目的としたものではありません。
          </p>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-2">第3条（禁止事項）</h2>
          <p>利用者は、以下の行為をしてはなりません。</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>法令または公序良俗に違反する行為</li>
            <li>当サービスの運営を妨害する行為</li>
            <li>他の利用者または第三者の権利を侵害する行為</li>
            <li>不正アクセスやそれを試みる行為</li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-2">第4条（免責事項）</h2>
          <p>
            当サービスの利用により生じた損害について、運営者は責任を負いかねます。
            詳細は免責事項のページをご確認ください。
          </p>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-2">第5条（規約の変更）</h2>
          <p>
            運営者は、必要と判断した場合、本規約を変更することがあります。
            変更後の規約は、当サイトに掲載した時点から効力を生じます。
          </p>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-2">第6条（お問い合わせ）</h2>
          <p>
            本規約に関するお問い合わせは、LINE公式アカウントよりお願いします。
          </p>
        </div>

        <p className="text-sm text-stone-500 mt-12">
          最終更新日：（公開時に記載）
        </p>
      </section>
    </main>
  );
}
