import InfoPage from "@/components/InfoPage";
import { SITE } from "@/lib/site";
export const metadata={title:"利用規約"};
export default function Page(){return <InfoPage title="利用規約"><h2>サービス内容</h2><p>GutTypeは、7問の回答をもとに食事や生活習慣を振り返る項目を表示する無料のチェックです。医学的な診断や治療、腸内細菌の測定は行いません。</p><h2>利用にあたって</h2><p>結果は回答に基づく整理の目安です。個人への効果や健康状態を保証するものではありません。利用上の注意と個人情報の取扱いを確認してご利用ください。</p><h2>禁止する行為</h2><ul><li>他人になりすまして回答や結果を保存する行為</li><li>不正アクセス、サービスを妨害する行為</li><li>他者の権利やプライバシーを侵害する行為</li></ul><h2>変更・停止</h2><p>内容や機能は更新・停止する場合があります。重要な変更はこのサイトで案内します。</p><h2>お問い合わせ</h2><p><a href={SITE.lineUrl}>公式LINE</a>からご連絡ください。</p><p className="small-note">更新日：2026年11月1日</p></InfoPage>;}
