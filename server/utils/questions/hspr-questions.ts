// 高敏感特质量表修订版（HSP-R）· 题库
//
// 编制：Pluess M, Aron E, Kähkönen JE, Lionetti F, Huang Y, Tillmann T, Greven C,
// Aron A. Evolution of the Concept of Sensory Processing Sensitivity and its
// Measurement: The Highly Sensitive Person Scale-Revised. Personality and
// Individual Differences. 2026;257:113782. doi:10.1016/j.paid.2026.113782
// 预印本：https://osf.io/preprints/psyarxiv/w7bqu
// 官方题本（英文，末页附六个分量表的题号）：https://hsperson.com/wp-content/uploads/2025/02/New-Self-Test-PDF.pdf
// 量表总览与下载：https://sensitivityresearch.com/research/sensitivity-measures/
//
// 使用条件（官方题本末页）：引用上述完整文献，并提供 hsperson.com 与
// sensitivityresearch.com 两个链接；超出授权范围的用途需联系第一作者。
//
// 结构：18 题，7 点（1 = 完全没有 … 7 = 极其），一个总体分 + 六个分量表各 3 题。
// 六个分量表与总体敏感性共用同一批题目，不重复计分：
//   过度唤起 = 第 3、9、15 题      积极体验敏感 = 第 5、12、16 题
//   社交敏感 = 第 4、8、11 题      深度加工 = 第 7、13、18 题
//   情绪反应 = 第 2、6、10 题      细节敏感 = 第 1、14、17 题
//
// 计分与判定见 scoreHSPR.ts（取平均分，平均分 > 5 提示高敏感倾向）。
// 本量表没有固定回忆期，问的是「你作为一个人的整体情况」；官方指导语还允许
// 无法作答的题目直接跳过，因此题面里不出现任何时间窗口词。
//
// 与 1997 年 27 题的 HSPS 的关系：HSP-R 是同批作者在 27 题版基础上精简并重新
// 结构化的修订版，题量与分量表划分都不同，引用时不要混为一谈。

import type { Option } from "~/types/test";

export const hsprOptions: Option[] = [
  { value: 1, label: "完全没有" },
  { value: 2, label: "几乎没有" },
  { value: 3, label: "稍微" },
  { value: 4, label: "中等程度" },
  { value: 5, label: "明显" },
  { value: 6, label: "非常" },
  { value: 7, label: "极其" },
];

export interface HSPRQuestion {
  id: number;
  text: string;
}

export const hsprQuestions: HSPRQuestion[] = [
  { id: 1, text: "你能注意到物品被人挪动过吗？" },
  { id: 2, text: "你是否很容易受到他人反馈（无论是正面还是负面）的影响？" },
  { id: 3, text: "强烈的灯光、刺鼻的气味、粗糙的布料或近处的警笛声，会不会让你感到难受？" },
  { id: 4, text: "你是否能轻易察觉到别人正有什么感受？" },
  { id: 5, text: "你会留意并享受细腻的气味、味道、声音或艺术作品吗？" },
  { id: 6, text: "你是否容易受到身边人情绪的影响？" },
  { id: 7, text: "你是否倾向于把事情想得很深？" },
  { id: 8, text: "你是否擅长预判别人对某个处境会有什么感受？" },
  { id: 9, text: "强烈的刺激，比如很大的噪音或混乱的场面，会不会让你感到困扰？" },
  { id: 10, text: "无论有没有表现出来，你对自己经历的事情反应是否都很强烈？" },
  { id: 11, text: "别人会说你很擅长理解他们的感受或想法吗？" },
  { id: 12, text: "你是否容易完全沉浸在音乐里？" },
  { id: 13, text: "你是否会去思考哲学性的问题？" },
  { id: 14, text: "比起别人，你似乎更容易注意到天气的变化吗？" },
  { id: 15, text: "当周围同时发生很多事情时，你是否会感到一种不舒服的紧张或唤起？" },
  { id: 16, text: "你是否会被艺术或音乐深深打动？" },
  { id: 17, text: "你是否容易注意到季节变换的细微迹象（比如冬去春来）？" },
  { id: 18, text: "你喜欢深入的交谈吗？" },
];
