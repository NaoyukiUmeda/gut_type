import { TIE_BREAK_PRIORITY, TypeId } from "./types";

export type Scores = Record<TypeId, number>;

export function initScores(): Scores {
  return { A: 0, B: 0, C: 0, D: 0, E: 0 };
}

export type JudgeResult = {
  main: TypeId;
  sub: TypeId | null;
  scores: Scores;
};

export function judge(scores: Scores): JudgeResult {
  const max = Math.max(...Object.values(scores));
  const candidates = (Object.keys(scores) as TypeId[]).filter(
    (k) => scores[k] === max
  );
  const main = TIE_BREAK_PRIORITY.find((t) => candidates.includes(t)) ?? "E";

  const sorted = (Object.keys(scores) as TypeId[])
    .filter((t) => t !== main)
    .sort((a, b) => scores[b] - scores[a]);
  const second = sorted[0];
  const diff = scores[main] - scores[second];
  const sub = diff <= 2 && scores[second] > 0 ? second : null;

  return { main, sub, scores };
}
