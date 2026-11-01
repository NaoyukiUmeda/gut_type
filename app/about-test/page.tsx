import InfoPage from "@/components/InfoPage";
import { SITE } from "@/lib/site";
export const metadata={title:"質問チェックと検査の違い"};
export default function Page(){return <InfoPage title="質問チェックと検査の違い"><p>GutTypeは質問への回答を整理するサービスです。便などの検体を使った検査は行いません。</p><div className="record-diagram"><div><span>GutType</span><strong>質問への回答</strong><p>習慣を振り返る目安</p></div><span className="plus" aria-hidden>／</span><div><span>検査</span><strong>検体などの測定</strong><p>方法によって分かる範囲が異なる</p></div></div><h2>結果から菌の種類や量は分かりません</h2><p>このチェックの結果を、腸内細菌の測定結果や病気の診断として使うことはできません。</p><h2>情報を読むときの確認項目</h2><p>どんな人を対象に、何を調べた結果か。GutMediaでは、対象・条件・結果・限界を確認する順番を図で説明しています。</p><p><a href={SITE.researchGuideUrl}>腸活の情報の読み方を見る</a></p></InfoPage>;}
