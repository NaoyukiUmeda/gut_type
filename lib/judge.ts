import { TIE_BREAK_PRIORITY, TYPE_IDS, TypeId } from "./types";
import { QUESTIONS } from "./questions";
export type Scores = Record<TypeId, number>;
export type JudgeResult = {main:TypeId; sub:TypeId|null; scores:Scores};
export function initScores(): Scores { return {A:0,B:0,C:0,D:0,E:0}; }
export function judge(scores: Scores): JudgeResult {
  const ranked = [...TIE_BREAK_PRIORITY].sort((a,b)=>scores[b]-scores[a]);
  const main=ranked[0], second=ranked[1];
  return {main,sub:scores[main]-scores[second]<=2 && scores[second]>0?second:null,scores};
}
export function scoreAnswers(value: unknown): JudgeResult {
  if (!value || typeof value!=="object" || Array.isArray(value)) throw new Error("ANSWERS_REQUIRED");
  const answers=value as Record<string,unknown>;
  if (Object.keys(answers).length!==QUESTIONS.length) throw new Error("ANSWER_COUNT");
  const scores=initScores();
  for(const question of QUESTIONS){
    const choice=question.choices.find(c=>c.id===answers[String(question.id)]);
    if(!choice) throw new Error("INVALID_CHOICE");
    for(const id of TYPE_IDS) scores[id]+=choice.score[id]??0;
  }
  return judge(scores);
}
