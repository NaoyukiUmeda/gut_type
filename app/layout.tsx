import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "腸活スタートタイプ診断",
  description: "7問で分かる、自分に合った腸活の始め方。",
  openGraph: {
    title: "腸活スタートタイプ診断",
    description:
      "腸活しているのに変わらない理由は、あなたの腸に合っていないからかもしれません。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.className}>
      <body className="bg-stone-50 text-stone-800 min-h-screen">
        {children}
        <footer className="border-t border-stone-200 py-8 mt-16">
          <div className="max-w-2xl mx-auto px-4 text-center text-xs text-stone-500 space-y-2">
            <nav className="flex justify-center gap-4 flex-wrap">
              <a href="/privacy-policy/" className="hover:text-stone-700">
                プライバシーポリシー
              </a>
              <a href="/disclaimer/" className="hover:text-stone-700">
                免責事項
              </a>
              <a href="/terms/" className="hover:text-stone-700">
                利用規約
              </a>
              <a href="/faq/" className="hover:text-stone-700">
                FAQ
              </a>
              <a href="/about-test/" className="hover:text-stone-700">
                検査について
              </a>
            </nav>
            <p>© 2026 腸活スタートタイプ診断</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
