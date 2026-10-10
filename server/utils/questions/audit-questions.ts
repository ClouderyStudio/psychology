// 酒精使用障碍筛查量表（AUDIT）· 题库
//
// 编制：WHO 协作项目（Saunders JB, Aasland OG, Babor TF, de la Fuente JR,
// Grant M）。1989 年首版（WHO/MNH/DAT/89.4），1993 年正式发表，2001 年发布
// 第二版使用指南。官网计分页：https://auditscreen.org/about/scoring-audit
//
// 结构：10 题自评，无反向计分。总分 0-40。
// 计分口径（容易写错的一点）：
//   · 第 1-8 题 5 档，取值 0/1/2/3/4；
//   · 第 9、10 题只有 3 档，取值 0/2/4 —— 不是 0/1/2。
// 三因子划分（Saunders 1993 原始概念）：
//   · 危险饮酒 hazardous：第 1-3 题（0-12）
//   · 依赖症状 dependence：第 4-6 题（0-12）
//   · 有害饮酒 harmful：第 7-10 题（0-16）
//
// 回忆期：第 1-3 题问一般饮酒情况，第 4-8 题问「过去一年」，第 9-10 题区分
// 「有，但不在过去一年」与「有，在过去一年」。
//
// 「一杯」按 WHO 原研究约 8-13 g 纯酒精，中文版常用换算：啤酒约 250 ml、
// 葡萄酒约 100 ml、白酒约 25 ml。若本地标准杯定义不同，需相应调整题 2、3
// 的选项描述（本文件与 test-timeframe 的说明文案保持一致）。
//
// 第 1 题选「从不」时，原版会跳至第 9-10 题；在线版无法跳题，指导语里已
// 说明「不饮酒者第 1 题选从不，其余饮酒相关问题按最低档作答」，这些题目
// 的作答值本身为 0，不影响总分。

import type { Option } from "~/types/test";

// 第 1、3-8 题通用频率档位
export const auditFrequencyOptions: Option[] = [
  { value: 0, label: "从不" },
  { value: 1, label: "每月一次或更少" },
  { value: 2, label: "每月 2-4 次" },
  { value: 3, label: "每周 2-3 次" },
  { value: 4, label: "每周 4 次或更多" },
];

export const auditQuantityOptions: Option[] = [
  { value: 0, label: "1 或 2 杯" },
  { value: 1, label: "3 或 4 杯" },
  { value: 2, label: "5 或 6 杯" },
  { value: 3, label: "7、8 或 9 杯" },
  { value: 4, label: "10 杯或更多" },
];

// 第 4-8 题频率档位（选项数量与第 1 题一致，但措辞更细）
export const auditPastYearFrequencyOptions: Option[] = [
  { value: 0, label: "从不" },
  { value: 1, label: "少于每月一次" },
  { value: 2, label: "每月一次" },
  { value: 3, label: "每周一次" },
  { value: 4, label: "每天或几乎每天" },
];

// 第 9、10 题：0/2/4 三档，没有中间值 1、3
export const auditHarmOptions: Option[] = [
  { value: 0, label: "没有" },
  { value: 2, label: "有，但不是过去一年" },
  { value: 4, label: "有，在过去一年" },
];

export interface AUDITQuestion {
  id: number;
  text: string;
  options: Option[];
}

export const auditQuestions: AUDITQuestion[] = [
  {
    id: 1,
    text: "你多久喝一次含酒精的饮料？",
    options: auditFrequencyOptions,
  },
  {
    id: 2,
    text: "在你喝酒的日子里，通常一天喝多少杯（标准杯）？",
    options: auditQuantityOptions,
  },
  {
    id: 3,
    text: "你多久一次在一次饮酒中喝 6 杯或以上？",
    options: auditFrequencyOptions,
  },
  {
    id: 4,
    text: "过去一年里，你多久出现一次「一旦开始喝就停不下来」的情况？",
    options: auditPastYearFrequencyOptions,
  },
  {
    id: 5,
    text: "过去一年里，你多久因喝酒而没能做平时该做的事？",
    options: auditPastYearFrequencyOptions,
  },
  {
    id: 6,
    text: "过去一年里，你多久在大量饮酒后的早晨需要先喝一杯才能让自己正常起来？",
    options: auditPastYearFrequencyOptions,
  },
  {
    id: 7,
    text: "过去一年里，你多久在饮酒后感到内疚或后悔？",
    options: auditPastYearFrequencyOptions,
  },
  {
    id: 8,
    text: "过去一年里，你多久因饮酒而想不起前一晚发生过的事？",
    options: auditPastYearFrequencyOptions,
  },
  {
    id: 9,
    text: "你是否曾因饮酒而使自己或他人受伤？",
    options: auditHarmOptions,
  },
  {
    id: 10,
    text: "是否有亲戚、朋友、医生或其他健康工作者对你的饮酒表示担心，或建议你减少饮酒？",
    options: auditHarmOptions,
  },
];
