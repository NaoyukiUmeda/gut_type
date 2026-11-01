import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";
import { TYPE_IDS, TYPES } from "@/lib/types";
import CheckFlow from "@/components/CheckFlow";
import Disclaimer from "@/components/Disclaimer";
export default function HomePage() {
  return <main id="main">
    <section className="shell hero"><div><p className="eyebrow">GutMediaの生活習慣チェック</p>
      <h1>食事と生活習慣を、<br/>7問で振り返る。</h1>
      <p className="hero-description">何を食べたか、いつ眠ったか。最近の習慣を答えると、振り返る項目と、記録するときの行動例が見られます。</p>
      <p className="check-meta">全7問・無料・LINE登録なしでも利用できます</p>
      <Link className="button" href="/liff/diagnosis/">7問のチェックを始める <span aria-hidden>→</span></Link>
      <p className="small-note">回答はこの画面内で集計します。LINEへの保存は、希望する場合だけです。</p>
    </div><figure className="hero-photo"><Image src="/images/food-notes.webp" alt="ご飯と野菜のおかずに、記録用のノートと鉛筆を添えた食卓。" width={1536} height={1024} priority/><figcaption>AI生成イメージ</figcaption></figure></section>
    <section className="shell section"><CheckFlow/></section>
    <section className="section tinted"><div className="shell split"><div><p className="eyebrow">結果の見方</p><h2>結果は5つの<br/>確認項目から。</h2><p>腸内細菌の種類や、不調の原因は分かりません。回答に付けた点数を使い、5つの項目から今回の候補を表示します。</p><Link className="text-link" href="/notice/">集計方法を確認する →</Link></div><ol className="topic-list">{TYPE_IDS.map((id,i)=><li key={id}><span>0{i+1}</span>{TYPES[id].name}</li>)}</ol></div></section>
    <section className="shell section reading"><div><p className="eyebrow">図で確認する</p><h2>食事の記録には、<br/>何を残せばいい？</h2><p>写真とメモで残せる情報の違いを、GutMediaの比較図で確認できます。</p><a className="text-link" href={SITE.foodGuideUrl}>食事記録の図解ガイドを読む ↗</a></div><div className="record-diagram" aria-label="写真とメモの使い分け"><div><span>写真</span><strong>料理の見た目</strong><p>食卓全体、盛り付け</p></div><span className="plus" aria-hidden>＋</span><div><span>メモ</span><strong>写らない情報</strong><p>時刻、材料、気づき</p></div></div></section>
    <section className="shell line-panel"><div><p className="eyebrow">公式LINE</p><h2>LINEからの案内はこちら</h2><p>友だち追加ページが開きます。</p></div><a className="button secondary" href={SITE.lineUrl}>公式LINEを開く ↗</a></section>
    <div className="shell"><Disclaimer/></div>
  </main>;
}
