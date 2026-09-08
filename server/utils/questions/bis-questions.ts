import type { Option } from "~/types/test";

// BIS-11 选项（5 级评分，分数越高冲动性越强；反向题在 score.ts 中用 6 - score 处理）
export const bisOptions: Option[] = [
  { value: 1, label: "从不/很少" },
  { value: 2, label: "偶尔" },
  { value: 3, label: "经常" },
  { value: 4, label: "几乎总是" },
  { value: 5, label: "总是" },
];

export type BISDimension = "attentional" | "motor" | "nonplanning";

export interface BISQuestion {
  id: number;
  text: string;
  dimension: BISDimension;
  reverse: boolean; // 反向计分（=1 表示"无冲动"的方向）
}

// BIS-11 Barratt 冲动性量表（第 11 版）— 30 题
// 编制：Patton JH, Stanford MS, Barratt ES (1995)。
//      中文版常用修订版本：周宵等（2006，中南大学） / 北京安定医院罗学荣等。
//
// 量表结构（30 题，3 个分量表）：
//   注意力冲动 (AI, attentional)：  6, 9, 11, 12, 14, 18, 20, 23, 27, 30  (10 题)
//   运动冲动   (MI, motor)：       2, 3, 4, 15, 16, 17, 19, 22, 24, 26  (10 题)
//   无计划冲动 (NI, nonplanning)：  1, 5, 7, 8, 10, 13, 21, 25, 28, 29  (10 题)
//
// 反向计分（Patton 原版 + 国内常用中文修订版综合；题号与上表一致）：
//   attentional  反向：11, 14, 23
//   motor        反向：4, 15, 16, 22, 24
//   nonplanning  反向：1, 5, 7, 8, 10, 13, 21, 25, 28
//   合计反向题：16 道
//
// 计分要点：
//   每题 1-5 分；反向题计分 = 6 - 原始分。
//   总分 = 三维度分数之和（范围 30-150）。
//   维度分 = 该维度下所有题得分之和（每维度 10-50）。
//
// 说明：BIS-11 目前没有公认统一的临床截断分，不同研究使用的切分点差异较大
//   （常见切分点：≥72 或各维度 T 分 ≥65）。本实现按四档给出参考分级，结果仅作筛查。
export const bisQuestions: BISQuestion[] = [
  // ---- attentional 注意力冲动（10） ----
  { id: 6,  text: "我常常不能很好地集中注意力。", dimension: "attentional", reverse: false },
  { id: 9,  text: "我很难长时间把注意力集中在一件事情上。", dimension: "attentional", reverse: false },
  { id: 11, text: "我能认真思考并完成一项任务。", dimension: "attentional", reverse: true },
  { id: 12, text: "在课堂上或会议中，我常常走神。", dimension: "attentional", reverse: false },
  { id: 14, text: "我会思考一段时间后才决定是否做某件事。", dimension: "attentional", reverse: true },
  { id: 18, text: "我在思考问题时常常被别的想法打断。", dimension: "attentional", reverse: false },
  { id: 20, text: "我是一个稳定且不容易分心的人。", dimension: "attentional", reverse: true },
  { id: 23, text: "我常因一时冲动而行动，事后才后悔。", dimension: "attentional", reverse: false },
  { id: 27, text: "我对新的体验和活动充满好奇。", dimension: "attentional", reverse: false },
  { id: 30, text: "我很难长时间专注于一项任务。", dimension: "attentional", reverse: false },

  // ---- motor 运动冲动（10） ----
  { id: 2,  text: "我做事不加思考。", dimension: "motor", reverse: false },
  { id: 3,  text: "我是一个冲动的人。", dimension: "motor", reverse: false },
  { id: 4,  text: "我常常很快做出决定。", dimension: "motor", reverse: false },
  { id: 15, text: "我行动之前会先停下来想一想。", dimension: "motor", reverse: true },
  { id: 16, text: "我做事能够三思而后行。", dimension: "motor", reverse: true },
  { id: 17, text: "我有时无法克制自己的冲动行为。", dimension: "motor", reverse: false },
  { id: 19, text: "我有时会坐立不安。", dimension: "motor", reverse: false },
  { id: 22, text: "我是一个沉着稳重的人。", dimension: "motor", reverse: true },
  { id: 24, text: "我比大多数人做事要慢一些。", dimension: "motor", reverse: true },
  { id: 26, text: "我有时不经思考就说出了口。", dimension: "motor", reverse: false },

  // ---- nonplanning 无计划冲动（10） ----
  { id: 1,  text: "我为未来做计划。", dimension: "nonplanning", reverse: true },
  { id: 5,  text: "我对未来漠不关心。", dimension: "nonplanning", reverse: false },
  { id: 7,  text: "我经常搬家或更换生活安排。", dimension: "nonplanning", reverse: false },
  { id: 8,  text: "我经常换工作或换学习方向。", dimension: "nonplanning", reverse: false },
  { id: 10, text: "我对钱很谨慎。", dimension: "nonplanning", reverse: true },
  { id: 13, text: "我对某些事情很认真。", dimension: "nonplanning", reverse: true },
  { id: 21, text: "我花钱有计划。", dimension: "nonplanning", reverse: true },
  { id: 25, text: "我做事经常临时改变计划。", dimension: "nonplanning", reverse: false },
  { id: 28, text: "我会买一些并不真正需要的东西。", dimension: "nonplanning", reverse: false },
  { id: 29, text: "我经常变换自己的兴趣或活动。", dimension: "nonplanning", reverse: false },
];