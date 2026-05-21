import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "自分に合う腸活タイプ診断",
  description: "12問で分かる、あなたに合った腸活の始め方。",
  openGraph: {
    title: "自分に合う腸活タイプ診断",
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
      </body>
    </html>
  );
}
