import type { Option } from "~/types/test";

// BPAQ 选项（5 级评分，分数越高攻击性越强；本量表无反向题）
export const bpaqOptions: Option[] = [
  { value: 1, label: "完全不符合" },
  { value: 2, label: "比较不符合" },
  { value: 3, label: "中性" },
  { value: 4, label: "比较符合" },
  { value: 5, label: "完全符合" },
];

export type BPAQDimension = "physical" | "verbal" | "anger" | "hostility";

export interface BPAQQuestion {
  id: number;
  text: string;
  dimension: BPAQDimension;
}

// BPAQ Buss-Perry 攻击性问卷 — 29 题
// 编制：Buss AH, Perry M (1992). J Pers Soc Psychol.
//      中文版修订：李献云等（2009 / 2011），北京回龙观医院。
//
// 量表结构（29 题，4 个分量表）：
//   身体攻击 (physical aggression)：    1, 5, 9, 13, 17, 21, 25, 29           (8 题)
//   言语攻击 (verbal aggression)：      2, 6, 10, 14, 18, 22, 26               (7 题)
//   愤怒     (anger):                  3, 7, 11, 15, 19, 23, 27               (7 题)
//   敌意     (hostility):              4, 8, 12, 16, 20, 24, 28               (7 题)
//
// 计分要点：
//   每题 1-5 分；本量表无反向计分，全部正向计分。
//   总分 = 4 维度分数之和（范围 29-145）。
//   维度分 = 该维度下所有题得分之和。
//   中文常模各维度均值（成人）：身体 ≈ 18.0 / 言语 ≈ 13.5 / 愤怒 ≈ 16.0 / 敌意 ≈ 18.0。
//   总分 ≈ 65 分常被作为参考切分点（高于此提示攻击倾向较明显）。
//
// 题目方向：所有题目都为正向计分，分数越高攻击性越强。
export const bpaqQuestions: BPAQQuestion[] = [
  // ---- physical 身体攻击（8） ----
  { id: 1,  text: "有些朋友觉得我性子急。", dimension: "physical" },
  { id: 5,  text: "如果有人先惹我，我会毫不犹豫地还击。", dimension: "physical" },
  { id: 9,  text: "如果有人打我，我会打回去。", dimension: "physical" },
  { id: 13, text: "我比大多数人更容易卷入争吵。", dimension: "physical" },
  { id: 17, text: "如果有必要，我愿意用身体的方式解决冲突。", dimension: "physical" },
  { id: 21, text: "我曾经威胁过我认识的某些人。", dimension: "physical" },
  { id: 25, text: "我会因为一点小事就动怒。", dimension: "physical" },
  { id: 29, text: "我有时会摔门、拍桌子或摔东西。", dimension: "physical" },

  // ---- verbal 言语攻击（7） ----
  { id: 2,  text: "我常常会高声说话或大喊。", dimension: "verbal" },
  { id: 6,  text: "朋友们说我爱争论。", dimension: "verbal" },
  { id: 10, text: "我常常在别人说完之前就急着反驳。", dimension: "verbal" },
  { id: 14, text: "我经常质疑别人的观点。", dimension: "verbal" },
  { id: 18, text: "我很难控制自己说出伤人的话。", dimension: "verbal" },
  { id: 22, text: "当别人不同意我的看法时，我会很不耐烦。", dimension: "verbal" },
  { id: 26, text: "我经常和别人发生言语冲突。", dimension: "verbal" },

  // ---- anger 愤怒（7） ----
  { id: 3,  text: "我容易发火。", dimension: "anger" },
  { id: 7,  text: "我常常感到烦躁。", dimension: "anger" },
  { id: 11, text: "我经常对别人感到恼怒。", dimension: "anger" },
  { id: 15, text: "我有时觉得自己快要被气炸了。", dimension: "anger" },
  { id: 19, text: "我经常因为小事生气。", dimension: "anger" },
  { id: 23, text: "我对不公平的事情反应强烈。", dimension: "anger" },
  { id: 27, text: "我常常因为别人做事的方式而恼火。", dimension: "anger" },

  // ---- hostility 敌意（7） ----
  { id: 4,  text: "我常常觉得别人在针对我。", dimension: "hostility" },
  { id: 8,  text: "我知道有些人不喜欢我。", dimension: "hostility" },
  { id: 12, text: "我常常觉得被人利用。", dimension: "hostility" },
  { id: 16, text: "我对陌生人容易抱有戒心。", dimension: "hostility" },
  { id: 20, text: "我觉得大多数人本质上是自私的。", dimension: "hostility" },
  { id: 24, text: "我常常觉得别人欠我的。", dimension: "hostility" },
  { id: 28, text: "我经常怀疑别人的动机。", dimension: "hostility" },
];