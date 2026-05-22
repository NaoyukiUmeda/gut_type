"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/lib/questions";
import { TypeId } from "@/lib/types";
import { initScores, judge } from "@/lib/judge";
import QuizCard from "@/components/QuizCard";
import ProgressBar from "@/components/ProgressBar";
import LoadingScreen from "@/components/LoadingScreen";
import Disclaimer from "@/components/Disclaimer";

const TOTAL = QUESTIONS.length; // 7
const LOADING_STEP = TOTAL + 1; // 8

export default function QuizPage() {
  const router = useRouter();
  // step: 1〜7=質問, 8=集計中
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // 集計中画面に入ったらスコア計算 → 少し待って結果ページへ
  useEffect(() => {
    if (step !== LOADING_STEP) return;

    const scores = initScores();
    for (const q of QUESTIONS) {
      const choice = q.choices.find((c) => c.id === answers[q.id]);
      if (!choice) continue;
      for (const [t, v] of Object.entries(choice.score)) {
        scores[t as TypeId] += v ?? 0;
      }
    }
    const result = judge(scores);
    const subParam = result.sub ? `?sub=${result.sub}` : "";

    const timer = setTimeout(() => {
      router.push(`/result/${result.main}/${subParam}`);
    }, 2600);
    return () => clearTimeout(timer);
  }, [step, answers, router]);

  if (step === LOADING_STEP) {
    return <LoadingScreen />;
  }

  const question = QUESTIONS[step - 1];

  function handleSelect(choiceId: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: choiceId }));
    setStep((s) => s + 1); // 7問目回答で 8（集計中）へ
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  return (
    <main className="max-w-md mx-auto px-6 py-10 flex flex-col min-h-screen">
      <ProgressBar current={step} total={TOTAL} />

      <div className="flex-1 flex flex-col justify-center py-8">
        <QuizCard
          question={question}
          selectedChoiceId={answers[question.id]}
          onSelect={handleSelect}
        />
      </div>

      <div className="flex justify-start">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1}
          className="text-sm text-stone-500 hover:text-stone-700 disabled:opacity-0 transition"
        >
          ← 戻る
        </button>
      </div>

      <Disclaimer />
    </main>
  );
}
