"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/lib/questions";
import { TypeId } from "@/lib/types";
import { initScores, judgeType } from "@/lib/judge";
import QuizCard from "@/components/QuizCard";
import ProgressBar from "@/components/ProgressBar";
import Disclaimer from "@/components/Disclaimer";

export default function QuizPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = QUESTIONS.length;
  const question = QUESTIONS[currentIndex];

  function finish(finalAnswers: Record<number, string>) {
    const scores = initScores();
    for (const q of QUESTIONS) {
      const choiceId = finalAnswers[q.id];
      const choice = q.choices.find((c) => c.id === choiceId);
      if (!choice) continue;
      for (const [t, v] of Object.entries(choice.score)) {
        scores[t as TypeId] += v ?? 0;
      }
    }
    const result = judgeType(scores);
    router.push(`/result/${result}/`);
  }

  function handleSelect(choiceId: string) {
    const nextAnswers = { ...answers, [question.id]: choiceId };
    setAnswers(nextAnswers);

    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      finish(nextAnswers);
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-10 flex flex-col min-h-screen">
      <ProgressBar current={currentIndex + 1} total={total} />

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
          disabled={currentIndex === 0}
          className="text-sm text-stone-500 hover:text-stone-700 disabled:opacity-0 transition"
        >
          ← 戻る
        </button>
      </div>

      <Disclaimer />
    </main>
  );
}
