import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免責事項 | 腸活スタートタイプ診断",
};

export default function DisclaimerPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8 text-stone-800">免責事項</h1>

      <div className="space-y-6 text-stone-700 leading-relaxed">
        <p>
          本診断は、現在の食事・生活リズム・お腹の体感から、
          腸活の始め方を提案するセルフチェックです。
        </p>
        <p>
          実際にどのような腸内細菌がどれくらいいるかは、
          本診断だけでは判定できません。
        </p>
        <p>
          本診断は医療行為や病気の診断を目的としたものではありません。
        </p>
        <p>
          強い腹痛、血便、急な体重減少、長引く下痢・便秘などの症状がある場合は、
          速やかに医療機関にご相談ください。
        </p>
        <p>
          本診断の結果に基づいて生じた一切の損害について、
          運営者は責任を負いかねます。
        </p>
      </div>
    </main>
  );
}
