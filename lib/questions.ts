import { TypeId } from "./types";

export type Choice = {
  id: string;
  label: string;
  score: Partial<Record<TypeId, number>>;
};

export type Question = {
  id: number;
  text: string;
  choices: Choice[];
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "便通の状態に一番近いものは?",
    choices: [
      { id: "q1_1", label: "毎日ある", score: {} },
      { id: "q1_2", label: "2〜3日に1回", score: { A: 2 } },
      { id: "q1_3", label: "便秘気味", score: { A: 3 } },
      { id: "q1_4", label: "下しやすい", score: { C: 2, B: 1 } },
      { id: "q1_5", label: "日によってバラバラ", score: { C: 2 } },
    ],
  },
  {
    id: 2,
    text: "お腹の張りはありますか?",
    choices: [
      { id: "q2_1", label: "ほぼない", score: {} },
      { id: "q2_2", label: "食後に張る", score: { B: 3 } },
      { id: "q2_3", label: "夕方に張る", score: { B: 2 } },
      { id: "q2_4", label: "発酵食品や乳製品で張る", score: { B: 3 } },
      { id: "q2_5", label: "よく分からない", score: { B: 1 } },
    ],
  },
  {
    id: 3,
    text: "食事の傾向に近いものは?",
    choices: [
      { id: "q3_1", label: "自炊多め", score: {} },
      { id: "q3_2", label: "外食多め", score: { D: 2 } },
      { id: "q3_3", label: "コンビニ多め", score: { D: 3 } },
      { id: "q3_4", label: "甘いもの多め", score: { D: 2, E: 1 } },
      { id: "q3_5", label: "食事時間がバラバラ", score: { C: 2, D: 1 } },
    ],
  },
  {
    id: 4,
    text: "野菜・海藻・豆類はどれくらい食べますか?",
    choices: [
      { id: "q4_1", label: "ほぼ毎日", score: {} },
      { id: "q4_2", label: "週3〜4回", score: { D: 1 } },
      { id: "q4_3", label: "週1〜2回", score: { D: 2 } },
      { id: "q4_4", label: "かなり少ない", score: { D: 3, A: 1 } },
    ],
  },
  {
    id: 5,
    text: "発酵食品との相性は?",
    choices: [
      { id: "q5_1", label: "よく食べるし問題ない", score: {} },
      { id: "q5_2", label: "たまに食べる", score: { D: 1 } },
      { id: "q5_3", label: "あまり食べない", score: { D: 2 } },
      { id: "q5_4", label: "食べるとお腹が張る", score: { B: 3 } },
      { id: "q5_5", label: "効果が分からない", score: { E: 1, D: 1 } },
    ],
  },
  {
    id: 6,
    text: "水分量は?",
    choices: [
      { id: "q6_1", label: "1.5L以上", score: {} },
      { id: "q6_2", label: "1L前後", score: { A: 1 } },
      { id: "q6_3", label: "かなり少ない", score: { A: 2, D: 1 } },
      { id: "q6_4", label: "コーヒー・お茶が多い", score: { C: 1, A: 1 } },
    ],
  },
  {
    id: 7,
    text: "ストレスは?",
    choices: [
      { id: "q7_1", label: "少ない", score: {} },
      { id: "q7_2", label: "普通", score: { C: 1 } },
      { id: "q7_3", label: "多い", score: { C: 3 } },
      { id: "q7_4", label: "お腹に出やすい", score: { C: 3, B: 1 } },
    ],
  },
  {
    id: 8,
    text: "睡眠は?",
    choices: [
      { id: "q8_1", label: "7時間以上", score: {} },
      { id: "q8_2", label: "6時間前後", score: { C: 1, E: 1 } },
      { id: "q8_3", label: "5時間以下", score: { C: 3, E: 2 } },
      { id: "q8_4", label: "時間がバラバラ", score: { C: 2, D: 1 } },
    ],
  },
  {
    id: 9,
    text: "肌・疲れ・体型で気になることは?",
    choices: [
      { id: "q9_1", label: "特に気にならない", score: {} },
      { id: "q9_2", label: "疲れやすい", score: { E: 2, C: 1 } },
      { id: "q9_3", label: "肌荒れしやすい", score: { E: 3 } },
      { id: "q9_4", label: "太りやすくなった", score: { E: 2, D: 1 } },
      { id: "q9_5", label: "気分が落ちやすい", score: { C: 2, E: 1 } },
    ],
  },
  {
    id: 10,
    text: "腸活経験は?",
    choices: [
      { id: "q10_1", label: "ほぼない", score: { D: 1 } },
      { id: "q10_2", label: "ヨーグルトを食べている", score: {} },
      { id: "q10_3", label: "サプリを飲んでいる", score: { E: 1 } },
      { id: "q10_4", label: "色々試したけど続かない", score: { D: 2, E: 1 } },
      { id: "q10_5", label: "試したけど合わなかった", score: { B: 2, E: 1 } },
    ],
  },
  {
    id: 11,
    text: "今一番知りたいことは?",
    choices: [
      { id: "q11_1", label: "便通を整えたい", score: { A: 3 } },
      { id: "q11_2", label: "お腹の張りを減らしたい", score: { B: 3 } },
      { id: "q11_3", label: "肌・美容を整えたい", score: { E: 3 } },
      { id: "q11_4", label: "疲れにくくなりたい", score: { E: 2, C: 1 } },
      { id: "q11_5", label: "自分に合う腸活を知りたい", score: { E: 1, D: 1 } },
    ],
  },
  {
    id: 12,
    text: "結果はどう受け取りますか?",
    choices: [
      // Q12は加点なし。結果ページ後のLINE誘導に影響させる。
      { id: "q12_1", label: "LINEで受け取る(おすすめ)", score: {} },
      { id: "q12_2", label: "その場で見る", score: {} },
    ],
  },
];
