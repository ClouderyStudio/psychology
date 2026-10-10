// 网络游戏障碍量表（简式）（IGDS9-SF）· 题库
//
// 编制：Pontes HM, Griffiths MD. Measuring DSM-5 internet gaming disorder:
// Development and validation of a short psychometric scale. Computers in
// Human Behavior. 2015;45:137-143. 直接对应 DSM-5 网络游戏障碍（IGD）的 9 条
// 标准，单维，题干与标准一一对应（专注性、戒断、耐受性、控制失败、
// 失去兴趣、持续使用、欺骗、逃避情绪、功能损害）。
//
// 回忆期：过去 12 个月（官方指导语明确 past year）。
//
// 计分基准（本平台固定采用官方 PDF 的 1-5 记法，总分 9-45）：
//   1 = 从不，2 = 很少，3 = 有时，4 = 经常，5 = 非常频繁。
// 另一种常见的 0-4 记法（总分 0-36）在跨研究比较时不可混用，因此这里不再
// 提供第二套选项——如果将来要改，必须同时改计分与分级。
//
// 判定：官方以「非常频繁（5 分）」作为该条标准被认可，9 条中有 5 条及以上
// 被认可即达到网络游戏障碍的筛查标准。用总分切点或把「经常」也算作认可
// 属研究惯例，本平台不作依据。

import type { Option } from "~/types/test";

export const igdsOptions: Option[] = [
  { value: 1, label: "从不" },
  { value: 2, label: "很少" },
  { value: 3, label: "有时" },
  { value: 4, label: "经常" },
  { value: 5, label: "非常频繁" },
];

export interface IGDSQuestion {
  id: number;
  text: string;
}

export const igdsQuestions: IGDSQuestion[] = [
  {
    id: 1,
    text: "你是否时常专注于游戏相关的事？（例如反复回想之前的游戏、期待下一次游戏，或觉得游戏已经成为生活的重心）",
  },
  {
    id: 2,
    text: "当你尝试减少或停止游戏时，是否会感到烦躁、焦虑甚至难过？",
  },
  {
    id: 3,
    text: "你是否觉得需要花越来越多的时间在游戏上，才能获得满足感或乐趣？",
  },
  {
    id: 4,
    text: "你是否总是无法控制或停止自己的游戏行为？",
  },
  {
    id: 5,
    text: "你是否因投入游戏，而对以前的爱好和其他娱乐活动失去了兴趣？",
  },
  {
    id: 6,
    text: "尽管你已经知道游戏在你自己和他人之间造成了问题，是否仍然继续游戏？",
  },
  {
    id: 7,
    text: "你是否曾因游戏时间的问题，对家人、朋友或其他人有所隐瞒或撒谎？",
  },
  {
    id: 8,
    text: "你是否为了暂时逃避或缓解负面情绪（如无助、内疚、焦虑）而玩游戏？",
  },
  {
    id: 9,
    text: "你是否因游戏而危及或失去了重要的关系、工作、学业或职业机会？",
  },
];
