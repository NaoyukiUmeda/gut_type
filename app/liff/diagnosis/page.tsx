"use client";

import { useEffect, useState } from "react";
import { QUESTIONS } from "@/lib/questions";
import { TYPES, TypeId } from "@/lib/types";
import { initScores, judge } from "@/lib/judge";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import Disclaimer from "@/components/Disclaimer";

type Profile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
};

type Step =
  | "loading"
  | "quiz"
  | "calculating"
  | "result"
  | "not-in-line"
  | "error";

export default function LiffDiagnosisPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [step, setStep] = useState<Step>("loading");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<TypeId | null>(null);
  const [subResult, setSubResult] = useState<TypeId | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // @line/liff はクライアント専用。SSR時の評価を避けるため動的import。
        const liff = (await import("@line/liff")).default;
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });

        // LINE内ブラウザでない場合は LINE登録への案内を表示
        if (!liff.isInClient()) {
          setStep("not-in-line");
          return;
        }

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        const p = await liff.getProfile();
        setProfile({
          userId: p.userId,
          displayName: p.displayName,
          pictureUrl: p.pictureUrl,
          statusMessage: p.statusMessage,
        });
        setStep("quiz");
      } catch (err) {
        console.error("LIFF init error:", err);
        setStep("error");
      }
    };
    init();
  }, []);

  const finishDiagnosis = async (
    finalAnswers: Record<number, string>,
    p: Profile
  ) => {
    const scores = initScores();
    for (const q of QUESTIONS) {
      const choice = q.choices.find((c) => c.id === finalAnswers[q.id]);
      if (!choice) continue;
      for (const [t, v] of Object.entries(choice.score)) {
        scores[t as TypeId] += v ?? 0;
      }
    }

    const judged = judge(scores);

    // DB保存 + LINE通知
    try {
      const res = await fetch("/api/diagnosis/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          line_user_id: p.userId,
          display_name: p.displayName,
          main_type: judged.main,
          sub_type: judged.sub,
          scores,
          answers: finalAnswers,
        }),
      });
      if (!res.ok) {
        console.error("Save failed:", await res.text());
      }
    } catch (err) {
      console.error("Save error:", err);
    }

    setResult(judged.main);
    setSubResult(judged.sub);
    setTimeout(() => setStep("result"), 1500);
  };

  const handleAnswer = (qId: number, choiceId: string) => {
    const newAnswers = { ...answers, [qId]: choiceId };
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 200);
    } else {
      // 最終問 → 集計
      setStep("calculating");
      if (profile) finishDiagnosis(newAnswers, profile);
    }
  };

  // ローディング
  if (step === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-stone-600">準備中...</p>
      </div>
    );
  }

  // LINE外ブラウザで開かれた場合
  if (step === "not-in-line") {
    return (
      <main className="max-w-md mx-auto px-5 py-16 text-center">
        <h2 className="text-xl font-bold mb-4 text-stone-800">
          LINEアプリでご利用ください
        </h2>
        <p className="text-stone-700 leading-relaxed mb-6">
          この診断はLINEアプリ内で動作します。
          <br />
          LINEで友だち追加してから、
          <br />
          トーク画面のメニューよりお進みください。
        </p>
        <a
          href={process.env.NEXT_PUBLIC_LINE_URL || "#"}
          className="inline-block bg-emerald-500 text-white font-bold py-4 px-8 rounded-2xl"
        >
          LINE友だち追加へ
        </a>
      </main>
    );
  }

  // エラー
  if (step === "error") {
    return (
      <main className="max-w-md mx-auto px-5 py-16 text-center">
        <h2 className="text-xl font-bold mb-4 text-stone-800">
          エラーが発生しました
        </h2>
        <p className="text-stone-700 leading-relaxed">
          申し訳ありません。
          <br />
          しばらくしてからもう一度お試しください。
        </p>
      </main>
    );
  }

  // 集計中
  if (step === "calculating") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-50 px-6">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-6" />
        <p className="text-stone-700 text-center leading-relaxed">
          あなたに合いそうな腸活の始め方を整理中...
        </p>
      </div>
    );
  }

  // 結果
  if (step === "result" && result) {
    const data = TYPES[result];
    const subData = subResult ? TYPES[subResult] : null;
    return (
      <main className="max-w-md mx-auto px-4 py-8">
        <header className="text-center mb-6">
          <p className="text-sm text-stone-500 mb-2">
            あなたの腸活スタートタイプは
          </p>
          <h1 className="text-2xl font-bold text-stone-800 leading-relaxed">
            {data.name}
          </h1>
          {subData && (
            <p className="text-sm text-stone-600 mt-3">
              サブ傾向：{subData.name}もややあり
            </p>
          )}
          <p className="text-stone-700 leading-relaxed mt-4">
            {data.catchphrase}
          </p>
        </header>

        <BeforeAfterSection
          typeId={result}
          beforeTitle={data.beforeTitle}
          beforeDescription={data.beforeDescription}
          afterTitle={data.afterTitle}
          afterDescription={data.afterDescription}
          transitionMessage={data.transitionMessage}
          traits={data.traits}
          altPrefix={data.name}
        />

        <p className="text-center text-sm text-stone-500 my-8">
          ※詳しい解説はLINEのトーク画面でも確認できます
        </p>

        <a
          href={process.env.NEXT_PUBLIC_CONSULT_URL || "#"}
          className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-2xl text-center transition"
        >
          無料個別相談を予約する
        </a>

        <Disclaimer />
      </main>
    );
  }

  // 診断中
  const q = QUESTIONS[currentQ];
  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <div className="text-sm text-stone-600 mb-2 text-right">
        {currentQ + 1} / {QUESTIONS.length}
      </div>
      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentQ + 1) / QUESTIONS.length) * 100}%`,
          }}
        />
      </div>

      <h2 className="text-lg font-bold mb-6 leading-relaxed text-stone-800">
        {q.text}
      </h2>

      <div className="space-y-3">
        {q.choices.map((c) => (
          <button
            key={c.id}
            onClick={() => handleAnswer(q.id, c.id)}
            className="w-full text-left bg-white hover:bg-stone-100 border border-stone-200 rounded-2xl px-5 py-4 text-stone-700 leading-relaxed transition"
          >
            {c.label}
          </button>
        ))}
      </div>

      {currentQ > 0 && (
        <button
          onClick={() => setCurrentQ(currentQ - 1)}
          className="mt-8 text-sm text-stone-500 underline"
        >
          ← 前の質問に戻る
        </button>
      )}
    </main>
  );
}
