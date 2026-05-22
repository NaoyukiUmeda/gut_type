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
  | "start"
  | "quiz"
  | "calculating"
  | "result"
  | "error";

type DebugInfo = {
  liffId: string;
  isInClient: boolean | null;
  isLoggedIn: boolean | null;
  error: string | null;
};

export default function LiffDiagnosisPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [step, setStep] = useState<Step>("loading");
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<TypeId | null>(null);
  const [subResult, setSubResult] = useState<TypeId | null>(null);

  useEffect(() => {
    const init = async () => {
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

      // 環境変数チェック
      if (!liffId) {
        console.error("NEXT_PUBLIC_LIFF_ID is not set");
        setDebugInfo({
          liffId: "(未設定)",
          isInClient: null,
          isLoggedIn: null,
          error: "NEXT_PUBLIC_LIFF_ID が設定されていません",
        });
        setStep("error");
        return;
      }

      try {
        // @line/liff はクライアント専用。SSR時の評価を避けるため動的import。
        const liff = (await import("@line/liff")).default;
        await liff.init({ liffId });

        const isInClient = liff.isInClient();
        const isLoggedIn = liff.isLoggedIn();

        setDebugInfo({ liffId, isInClient, isLoggedIn, error: null });

        // 未ログインならログイン処理。
        // - LINE内ブラウザ: 自動でログインされる
        // - 通常Webブラウザ: LINEログイン画面へリダイレクト → 戻ってくる
        if (!isLoggedIn) {
          liff.login();
          return;
        }

        // プロフィール取得（LINE内・Webブラウザ両方で動作）
        const p = await liff.getProfile();
        setProfile({
          userId: p.userId,
          displayName: p.displayName,
          pictureUrl: p.pictureUrl,
          statusMessage: p.statusMessage,
        });

        // クエリパラメータ ?result=X をチェック（診断結果ディープリンク）
        const params = new URLSearchParams(window.location.search);
        const resultParam = params.get("result");

        if (resultParam && ["A", "B", "C", "D", "E"].includes(resultParam)) {
          // 結果ディープリンク経由：DBから最新の診断結果を取得
          try {
            const res = await fetch(
              `/api/diagnosis/latest?line_user_id=${encodeURIComponent(
                p.userId
              )}`
            );
            const data = await res.json();
            if (data.ok && data.diagnosis) {
              setResult(data.diagnosis.main_type);
              setSubResult(data.diagnosis.sub_type);
              setStep("result");
              return;
            }
          } catch (fetchErr) {
            console.error("Fetch latest diagnosis error:", fetchErr);
          }

          // 取得失敗時は URL の result パラメータをフォールバックとして使用
          // （DBにデータが無くても結果ページは表示できる）
          setResult(resultParam as TypeId);
          setSubResult(null);
          setStep("result");
          return;
        }

        // クエリパラメータなし → 診断スタート画面
        setStep("start");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("LIFF init error:", err);
        setDebugInfo({
          liffId,
          isInClient: null,
          isLoggedIn: null,
          error: errorMsg,
        });
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

  // スタート画面
  if (step === "start") {
    return (
      <main className="max-w-md mx-auto px-5 py-12 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-3xl mb-4" aria-hidden>
            🌱
          </p>
          <h1 className="text-2xl font-bold text-stone-800 leading-relaxed">
            腸活スタートタイプ診断
          </h1>
          <p className="text-stone-600 leading-relaxed mt-4">
            食事・生活リズム・お腹の体感から、
            <br />
            あなたに合う腸活の始め方が分かります。
          </p>
          <p className="text-xs text-stone-500 mt-4">所要時間：約3分・7問</p>
          <button
            onClick={() => setStep("quiz")}
            className="mt-8 w-full max-w-xs bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-2xl px-8 py-4 transition"
          >
            診断をはじめる
          </button>
        </div>
        <Disclaimer />
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
        <p className="text-stone-700 leading-relaxed mb-6">
          申し訳ありません。
          <br />
          しばらくしてからもう一度お試しください。
        </p>

        {/* デバッグ情報（本番リリース後に削除） */}
        <details className="mt-8 text-left bg-stone-100 rounded-xl p-4 text-xs">
          <summary className="cursor-pointer text-stone-600 font-bold">
            デバッグ情報
          </summary>
          <pre className="mt-2 whitespace-pre-wrap break-all text-stone-700">
{JSON.stringify(debugInfo, null, 2)}
          </pre>
        </details>
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

        <button
          onClick={async () => {
            const consultUrl = process.env.NEXT_PUBLIC_CONSULT_URL;
            if (!consultUrl) {
              alert("予約URLが設定されていません。");
              return;
            }
            // LIFF内ブラウザなら liff.openWindow、それ以外は新規タブで開く
            const liff = (await import("@line/liff")).default;
            if (liff.isInClient()) {
              liff.openWindow({ url: consultUrl, external: false });
            } else {
              window.open(consultUrl, "_blank", "noopener,noreferrer");
            }
          }}
          className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-8 rounded-2xl text-center transition"
        >
          無料個別相談を予約する
        </button>
        <p className="text-xs text-stone-500 mt-3 text-center leading-relaxed">
          30分 ・ 無料 ・ オンライン
          <br />
          予約はカレンダーから希望日時を選ぶだけ
        </p>

        {/* 再診断 */}
        <section className="my-8 text-center">
          <button
            onClick={() => {
              // クエリパラメータを消してスタート画面に戻す
              window.history.replaceState({}, "", "/liff/diagnosis/");
              setResult(null);
              setSubResult(null);
              setCurrentQ(0);
              setAnswers({});
              setStep("start");
            }}
            className="text-sm text-stone-500 underline"
          >
            もう一度診断する
          </button>
        </section>

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
