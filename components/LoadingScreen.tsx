"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "あなたの食事・生活リズム・お腹の体感を整理中…",
  "あなたに合いそうな腸活の始め方を整理中…",
];

export default function LoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 1300);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="fixed inset-0 z-50 bg-stone-50 flex flex-col items-center justify-center px-8">
      <div className="w-12 h-12 rounded-full border-4 border-stone-200 border-t-emerald-500 animate-spin" />
      <p className="text-sm text-stone-600 mt-7 text-center leading-relaxed">
        {MESSAGES[index]}
      </p>
    </main>
  );
}
