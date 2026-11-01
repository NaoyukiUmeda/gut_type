import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {default: SITE.title, template: "%s | GutType"},
  description: SITE.description,
  openGraph: {title: SITE.title, description: SITE.description, type: "website", locale: "ja_JP", images: [{url:"/images/food-notes-og.jpg",width:1200,height:630,alt:"食卓と記録用のノート。AI生成イメージ。"}]},
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="ja"><body>
    <a className="skip-link" href="#main">本文へ移動</a>
    <header className="site-header"><div className="header-inner">
      <Link className="brand" href="/" aria-label="GutType ホーム">GutType<span>無料の生活習慣チェック</span></Link>
      <nav aria-label="メインメニュー"><Link href="/notice/">このチェックについて</Link><a href={SITE.mediaUrl}>GutMediaを読む ↗</a></nav>
    </div></header>
    {children}
    <footer className="site-footer"><div className="footer-inner"><div><Link className="brand" href="/">GutType</Link><p>食事や生活習慣を振り返る。<br/>記録の方法は、GutMediaの図解ガイドへ。</p></div><nav aria-label="フッターメニュー">
      <Link href="/faq/">よくある質問</Link><Link href="/privacy-policy/">個人情報の取扱い</Link><Link href="/notice/">このチェックについて</Link><Link href="/terms/">利用規約</Link><Link href="/disclaimer/">利用上の注意</Link><a href={SITE.lineUrl}>公式LINEを開く ↗</a>
    </nav><small>© 2026 GutType / GutMedia</small></div></footer>
  </body></html>;
}
