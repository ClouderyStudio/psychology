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
// 原始量表：Patton JH, Stanford MS, Barratt ES (1995)。
//
// 【题目来源与编号】本文件的三因子结构与题号沿用原版 BIS-11，但条目内容是按
// 中文表达习惯自行整理的中文表述，并非原版条目的逐条翻译，因此题号与原版条目
// 并不一一对应（例如原版第 9 题为"我能轻松集中注意力"，本表第 9 题改写为"我很
// 难长时间把注意力集中在一件事情上"）。
//
// 【反向计分不能照搬原版清单】原版 BIS-11 的反向题为 12 条
//   （1, 7, 8, 9, 10, 12, 13, 15, 20, 27, 29, 30）。本实现有多条原版反向题被改写
// 成了正向陈述（答得越高越"不冲动"的反面写法），照搬 12 条清单会算错方向；
// 反过来，本表也有原版并非反向题、但中文改写后必须反向计分的条目。
// 判定标准只有一条：**答"总是"是否代表更冲动**。越高越冲动 → 正向计分；
// 越高越不冲动 → 反向计分（= 6 - 原始分）。
//
// 逐条核对后的反向题（共 11 条 / 30 题）：
//   id 11 我能认真思考并完成一项任务     —— 答"总是"= 注意力控制好
//   id 14 我会思考一段时间后才决定        —— 答"总是"= 先想后做
//   id 20 我是一个稳定且不容易分心的人    —— 答"总是"= 专注稳定
//   id 15 我行动之前会先停下来想一想      —— 答"总是"= 克制
//   id 16 我做事能够三思而后行            —— 答"总是"= 克制
//   id 22 我是一个沉着稳重的人            —— 答"总是"= 不冲动
//   id 24 我比大多数人做事要慢一些        —— 答"总是"= 动作冲动低
//   id 1  我为未来做计划                  —— 答"总是"= 有规划
//   id 10 我对钱很谨慎                    —— 答"总是"= 有计划
//   id 13 我对某些事情很认真              —— 答"总是"= 有坚持
//   id 21 我花钱有计划                    —— 答"总是"= 有计划
// 逐条核对后**不需要**反向计分的可疑条目：id 27「我对新的体验和活动充满好奇」
//   与冲动性只有弱关联（更接近感觉寻求），但在本表中按"越高越冲动"计分；
//   id 4「我常常很快做出决定」、id 19「我有时会坐立不安」同样按正向计分。
//   若要修订题目文本，须同步复核上面的反向清单。
//
// 量表结构（30 题，3 个分量表，各 10 题）：
//   注意力冲动 (AI, attentional)：  6, 9, 11, 12, 14, 18, 20, 23, 27, 30
//   运动冲动   (MI, motor)：       2, 3, 4, 15, 16, 17, 19, 22, 24, 26
//   无计划冲动 (NI, nonplanning)：  1, 5, 7, 8, 10, 13, 21, 25, 28, 29
//
// 计分要点：
//   每题 1-5 分；反向题计分 = 6 - 原始分。
//   总分 = 三维度分数之和；理论范围 30-150。
//   由于反向题的存在，实际可达区间只有 74-106（见 scoreBIS.ts 的推导），
//   分档切点按可达区间四等分，不能按 30-150 设置。
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