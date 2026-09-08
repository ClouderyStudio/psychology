import type { Option } from "~/types/test";

// SIOSS 选项：是/否（是=1，否=0）
export const siossOptions: Option[] = [
  { value: 1, label: "是" },
  { value: 0, label: "否" },
];

// SIOSS 题目维度
export type SIOSSDimension =
  | "hopeless" // 绝望因子
  | "optimism" // 乐观因子（反向：回答"否"提示缺乏乐观感）
  | "sleep" // 睡眠因子
  | "concealment" // 掩饰因子（测谎，不计入总分）
  | "suicide-history"; // 既往自杀行为条目（题22）

export interface SIOSSQuestion {
  id: number;
  text: string;
  dimension: SIOSSDimension;
}

// SIOSS 自杀意念自评量表（Self-rating Idea of Suicide Scale）— 26题
// 编制：夏朝云、王东波等，2002，《临床精神医学杂志》；量表出处另见
// 张作记主编《行为医学量表手册》（2005）。
//
// 分量表结构（共26题）：
//   绝望  (12题)：2,3,4,8,11,14,16,17,19,20,23,26
//   乐观  ( 4题)：1,7,10,21（反向计分，回答"否"计1分）
//   睡眠  ( 4题)：5,12,18,24
//   掩饰  ( 5题)：6,9,13,15,25（测谎维度，不计入总分；≥4分提示作答不真实）
//   既往自杀行为（1题）：22
// 计分说明：每题仅"是/否"二选一。其中10题（1,5,6,7,9,10,13,15,21,25）
// 回答"否"计1分，其余16题回答"是"计1分。
// 自杀意念总分 = 绝望+乐观+睡眠+题22，满分21分；总分≥12分判定为存在自杀意念。
export const siossQuestions: SIOSSQuestion[] = [
  { id: 1, text: "在我的日常生活中，充满了使我感兴趣的事情。", dimension: "optimism" },
  { id: 2, text: "我深信生活对我是残酷的。", dimension: "hopeless" },
  { id: 3, text: "我时常感到悲观失望。", dimension: "hopeless" },
  { id: 4, text: "我容易哭或想哭。", dimension: "hopeless" },
  { id: 5, text: "我容易入睡并且一夜睡得很好。", dimension: "sleep" },
  { id: 6, text: "有时我也讲假话。", dimension: "concealment" },
  { id: 7, text: "生活在这个丰富多彩的时代里是多么美好。", dimension: "optimism" },
  { id: 8, text: "我确实缺少自信心。", dimension: "hopeless" },
  { id: 9, text: "我有时发脾气。", dimension: "concealment" },
  { id: 10, text: "我总觉得人生是有价值的。", dimension: "optimism" },
  { id: 11, text: "大部分时间，我觉得我还是死了的好。", dimension: "hopeless" },
  { id: 12, text: "我睡得不安，很容易被吵醒。", dimension: "sleep" },
  { id: 13, text: "有时我也会说人家的闲话。", dimension: "concealment" },
  { id: 14, text: "有时我觉得我真是毫无用处。", dimension: "hopeless" },
  { id: 15, text: "偶尔我听了下流的笑话也会发笑。", dimension: "concealment" },
  { id: 16, text: "我的前途似乎没有希望。", dimension: "hopeless" },
  { id: 17, text: "我想结束自己的生命。", dimension: "hopeless" },
  { id: 18, text: "我醒得太早。", dimension: "sleep" },
  { id: 19, text: "我觉得我的生活是失败的。", dimension: "hopeless" },
  { id: 20, text: "我总是将事情看得严重些。", dimension: "hopeless" },
  { id: 21, text: "我对将来抱有希望。", dimension: "optimism" },
  { id: 22, text: "我曾经自杀过。", dimension: "suicide-history" },
  { id: 23, text: "有时我觉得我就要垮了。", dimension: "hopeless" },
  { id: 24, text: "有些时期我因忧虑而失眠。", dimension: "sleep" },
  { id: 25, text: "我曾损坏或遗失过别人的东西。", dimension: "concealment" },
  { id: 26, text: "有时我想一死了之，但又矛盾重重。", dimension: "hopeless" },
];
