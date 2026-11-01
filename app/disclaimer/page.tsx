import InfoPage from "@/components/InfoPage";
import { SITE } from "@/lib/site";
export const metadata={title:"利用上の注意"};
export default function Page(){return <InfoPage title="利用上の注意"><p>GutTypeの結果は、回答を振り返る項目と記録の行動例です。病気の診断、治療、腸内細菌の測定を目的としたものではありません。</p><p>体調の変化や不調の原因は、このチェックからは特定できません。症状が続く場合や強い症状がある場合は、医療機関にご相談ください。</p><p>結果の行動例は、体調の改善や特定の期間内の変化を保証するものではありません。</p><p>健康情報の読み方は<a href={SITE.researchGuideUrl}>GutMediaの図解ガイド</a>でも確認できます。</p></InfoPage>;}
