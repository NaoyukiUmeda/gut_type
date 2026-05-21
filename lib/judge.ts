import { TIE_BREAK_PRIORITY, TypeId } from "./types";

export type Scores = Record<TypeId, number>;

export function initScores(): Scores {
  return { A: 0, B: 0, C: 0, D: 0, E: 0 };
}

export function judgeType(scores: Scores): TypeId {
  const max = Math.max(...Object.values(scores));
  const candidates = (Object.keys(scores) as TypeId[]).filter(
    (k) => scores[k] === max
  );
  return TIE_BREAK_PRIORITY.find((t) => candidates.includes(t)) ?? "E";
}
