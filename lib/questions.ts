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
    text: "忙しい時、つい選びがちな食事は?",
    choices: [
      {
        id: "q1_1",
        label: "牛丼・から揚げ・ハンバーグなど、ガッツリお肉系",
        score: { A: 3, B: 1 },
      },
      {
        id: "q1_2",
        label: "ラーメン・パスタ・菓子パンなど、手軽な炭水化物",
        score: { C: 3 },
      },
      {
        id: "q1_3",
        label: "ホットスナック・揚げ物・こってり系",
        score: { B: 3, C: 1 },
      },
      {
        id: "q1_4",
        label: "食べる時間がバラバラ、またはコーヒーで済ませがち",
        score: { D: 3 },
      },
      {
        id: "q1_5",
        label: "定食・味噌汁・野菜も意識して選ぶ",
        score: { E: 3 },
      },
    ],
  },
  {
    id: 2,
    text: "間食や飲み物の習慣で近いものは?",
    choices: [
      {
        id: "q2_1",
        label: "プロテイン、チーズ、肉系のおつまみが多い",
        score: { A: 3 },
      },
      {
        id: "q2_2",
        label: "食後の甘いものがやめられない",
        score: { C: 3 },
      },
      {
        id: "q2_3",
        label: "フラペチーノ、ケーキ、スナック菓子が好き",
        score: { B: 3, C: 1 },
      },
      {
        id: "q2_4",
        label: "ストレスでドカ食い・ヤケ酒しがち",
        score: { D: 3, B: 1 },
      },
      {
        id: "q2_5",
        label: "間食はナッツ・フルーツ・ヨーグルトが多い",
        score: { E: 3 },
      },
    ],
  },
  {
    id: 3,
    text: "最近のお腹や便で一番気になることは?",
    choices: [
      {
        id: "q3_1",
        label: "便やおならのニオイが気になる",
        score: { A: 3 },
      },
      {
        id: "q3_2",
        label: "すっきり出ない、重だるい",
        score: { B: 2, A: 1 },
      },
      {
        id: "q3_3",
        label: "食後にお腹がパンパンに張る",
        score: { C: 2, D: 1 },
      },
      {
        id: "q3_4",
        label: "緊張やストレスでお腹が乱れる",
        score: { D: 3 },
      },
      {
        id: "q3_5",
        label: "だいたい同じ時間に自然に出る",
        score: { E: 3 },
      },
    ],
  },
  {
    id: 4,
    text: "疲れや肌の調子で近いものは?",
    choices: [
      {
        id: "q4_1",
        label: "肌のくすみや吹き出物が気になる",
        score: { A: 2, B: 1 },
      },
      {
        id: "q4_2",
        label: "寝ても疲れが抜けにくい",
        score: { B: 3, D: 1 },
      },
      {
        id: "q4_3",
        label: "昼食後に強い眠気がある",
        score: { C: 3 },
      },
      {
        id: "q4_4",
        label: "疲れているのに眠りが浅い",
        score: { D: 3 },
      },
      {
        id: "q4_5",
        label: "一晩寝ればだいたい回復する",
        score: { E: 3 },
      },
    ],
  },
  {
    id: 5,
    text: "気分やメンタルで近いものは?",
    choices: [
      {
        id: "q5_1",
        label: "最近イライラしやすい",
        score: { A: 1, B: 1, D: 1 },
      },
      {
        id: "q5_2",
        label: "理由なく気分が沈む日がある",
        score: { D: 3 },
      },
      {
        id: "q5_3",
        label: "疲れると甘いもの・脂っこいものが欲しくなる",
        score: { C: 2, B: 2 },
      },
      {
        id: "q5_4",
        label: "常に何かに追われている感じがある",
        score: { D: 3 },
      },
      {
        id: "q5_5",
        label: "気持ちの切り替えは比較的できる",
        score: { E: 3 },
      },
    ],
  },
  {
    id: 6,
    text: "野菜・海藻・豆類はどれくらい食べる?",
    choices: [
      {
        id: "q6_1",
        label: "かなり少ない",
        score: { A: 1, B: 2, C: 1 },
      },
      {
        id: "q6_2",
        label: "週1〜2回くらい",
        score: { B: 1, C: 1 },
      },
      {
        id: "q6_3",
        label: "週3〜4回くらい",
        score: { D: 1 },
      },
      {
        id: "q6_4",
        label: "ほぼ毎日",
        score: { E: 2 },
      },
      {
        id: "q6_5",
        label: "複数種類を意識して食べている",
        score: { E: 3 },
      },
    ],
  },
  {
    id: 7,
    text: "睡眠・生活リズムで近いものは?",
    choices: [
      {
        id: "q7_1",
        label: "睡眠時間が短い",
        score: { D: 3, B: 1 },
      },
      {
        id: "q7_2",
        label: "寝る時間がバラバラ",
        score: { D: 3 },
      },
      {
        id: "q7_3",
        label: "夜遅くに食べることが多い",
        score: { D: 2, B: 1 },
      },
      {
        id: "q7_4",
        label: "朝食を抜きがち",
        score: { D: 1, C: 1 },
      },
      {
        id: "q7_5",
        label: "比較的リズムは安定している",
        score: { E: 3 },
      },
    ],
  },
];
