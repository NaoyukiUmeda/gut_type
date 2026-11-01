import Link from "next/link";
import { ReactNode } from "react";
export default function InfoPage({title,children}:{title:string;children:ReactNode}) {
  return <main id="main" className="document"><p className="eyebrow">GutTypeについて</p><h1>{title}</h1><div className="prose">{children}</div><Link className="text-link" href="/">チェックのトップへ戻る →</Link></main>;
}
