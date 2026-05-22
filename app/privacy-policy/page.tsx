import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 腸活スタートタイプ診断",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8 text-stone-800">
        プライバシーポリシー
      </h1>

      <section className="space-y-6 text-stone-700 leading-relaxed">
        <div>
          <h2 className="font-bold text-lg mb-2">1. 取得する情報</h2>
          <p>
            当サービスでは、LINE公式アカウントを通じて以下の情報を取得します。
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>LINEユーザーID</li>
            <li>表示名・プロフィール画像</li>
            <li>診断の回答内容</li>
            <li>診断結果</li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-2">2. 利用目的</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>診断結果のLINE送信</li>
            <li>あなたに合った腸活情報の提供</li>
            <li>個別相談の予約・連絡</li>
            <li>サービスの改善</li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-2">3. 第三者への提供</h2>
          <p>取得した個人情報を第三者に提供することはありません。</p>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-2">4. データの保管</h2>
          <p>取得した情報は安全な環境で適切に保管します。</p>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-2">5. データの削除</h2>
          <p>
            LINEで友だち登録を解除（ブロック）された場合、配信は停止します。
            データの完全削除をご希望の場合は、お問い合わせください。
          </p>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-2">6. お問い合わせ</h2>
          <p>
            本ポリシーに関するお問い合わせは、LINE公式アカウントよりお願いします。
          </p>
        </div>

        <p className="text-sm text-stone-500 mt-12">
          最終更新日：（公開時に記載）
        </p>
      </section>
    </main>
  );
}
