// 匹兹堡睡眠质量指数（PSQI）· 题库
//
// 编制：Buysse DJ, Reynolds CF, Monk TH, Berman SR, Kupfer DJ. The Pittsburgh
// Sleep Quality Index: a new instrument for psychiatric practice and research.
// Psychiatry Research. 1989;28(2):193-213. 中文版常引用刘贤臣等《中华精神科
// 杂志》1996;29(2):103-107 与路桃影等《重庆医学》2014;43(3):260-263。
// 回忆期：最近一个月。属筛查工具，不构成诊断。
//
// 结构：19 个自评条目 = 第 1-4 题（就寝/入睡用时/起床/实际睡眠时长）+ 第 5 题
// 的 10 个子项 a-j + 第 6-9 题。第 10 题（同床者信息）不计分，本平台不收录。
//
// **计分不是 19 题直接相加**：先把条目折算成 7 个成分（A 睡眠质量 / B 入睡时间 /
// C 睡眠时间 / D 睡眠效率 / E 睡眠障碍 / F 催眠药物 / G 日间功能障碍），每个成分
// 0-3 分，再求和得总分 0-21，分越高睡眠越差。具体折算见 scorePSQI.ts。
//
// 为什么第 1-4 题用滑块（range）而不是填空：本平台只有 type:"number" 的填空，
// 而 number 题被排除在必答之外——若允许留空，成分 B/C/D 会被当成 0 分算进
// 总分，结果会假性变好。第 1-4 题的取值只需精确到「整点」或「半小时」，滑块
// 足够表达，因此统一用 range 保证一定有值。

import type { Option } from "~/types/test";

/** 第 5、7、8 题的频率选项（第 5 题的子项与第 7、8 题共用） */
export const psqiFrequencyOptions: Option[] = [
  { value: 0, label: "过去一个月没有" },
  { value: 1, label: "每周不足 1 次" },
  { value: 2, label: "每周 1-2 次" },
  { value: 3, label: "每周 3 次或更多" },
];

/** 第 6 题：总体睡眠质量主观评价 */
export const psqiQualityOptions: Option[] = [
  { value: 0, label: "很好" },
  { value: 1, label: "较好" },
  { value: 2, label: "较差" },
  { value: 3, label: "很差" },
];

/** 第 9 题：白天精力不足带来的困难程度 */
export const psqiDaytimeOptions: Option[] = [
  { value: 0, label: "没有困难" },
  { value: 1, label: "有一点困难" },
  { value: 2, label: "比较困难" },
  { value: 3, label: "非常困难" },
];

export interface PSQIQuestion {
  id: number;
  /** 原量表题号，如 Q1 / Q5a / Q6，计分时按它定位条目 */
  code: string;
  text: string;
  /** range = 滑块（第 1-4 题）；options = 单选 */
  input: "range" | "options";
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
}

export const psqiQuestions: PSQIQuestion[] = [
  { id: 1, code: "Q1", input: "range", min: 0, max: 23, step: 1, minLabel: "0 点（午夜）", maxLabel: "23 点", text: "最近一个月，你通常几点上床睡觉？（按 24 小时制选整点）" },
  { id: 2, code: "Q2", input: "range", min: 0, max: 120, step: 5, minLabel: "0 分钟", maxLabel: "120 分钟以上", text: "最近一个月，你通常需要多长时间才能睡着？" },
  { id: 3, code: "Q3", input: "range", min: 0, max: 23, step: 1, minLabel: "0 点（午夜）", maxLabel: "23 点", text: "最近一个月，你通常早上几点起床？" },
  { id: 4, code: "Q4", input: "range", min: 0, max: 14, step: 0.5, minLabel: "0 小时", maxLabel: "14 小时", text: "最近一个月，你每晚实际睡着的时间大约有几小时？（不含卧床未睡的时间）" },
  { id: 5, code: "Q5a", input: "options", text: "最近一个月，你因为「上床后 30 分钟内不能入睡」而难以入睡的频率是？" },
  { id: 6, code: "Q5b", input: "options", text: "最近一个月，你因为「夜间或凌晨醒来」而难以维持睡眠的频率是？" },
  { id: 7, code: "Q5c", input: "options", text: "最近一个月，你因为「需要起夜上厕所」而睡不好的频率是？" },
  { id: 8, code: "Q5d", input: "options", text: "最近一个月，你因为「呼吸不畅」而睡不好的频率是？" },
  { id: 9, code: "Q5e", input: "options", text: "最近一个月，你因为「咳嗽或打鼾声大」而睡不好的频率是？" },
  { id: 10, code: "Q5f", input: "options", text: "最近一个月，你因为「感觉太冷」而睡不好的频率是？" },
  { id: 11, code: "Q5g", input: "options", text: "最近一个月，你因为「感觉太热」而睡不好的频率是？" },
  { id: 12, code: "Q5h", input: "options", text: "最近一个月，你因为「做噩梦」而睡不好的频率是？" },
  { id: 13, code: "Q5i", input: "options", text: "最近一个月，你因为「疼痛」而睡不好的频率是？" },
  { id: 14, code: "Q5j", input: "options", text: "最近一个月，你因为「其他原因」而睡不好的频率是？（若没有其他原因请选「过去一个月没有」）" },
  { id: 15, code: "Q6", input: "options", text: "最近一个月，你对自己整体睡眠质量的主观评价是？" },
  { id: 16, code: "Q7", input: "options", text: "最近一个月，你需要借助药物（处方药或自行服用）才能入睡的频率是？" },
  { id: 17, code: "Q8", input: "options", text: "最近一个月，你在开车、吃饭或参加社交活动时难以保持清醒的频率是？" },
  { id: 18, code: "Q9", input: "options", text: "最近一个月，你在「保持足够精力把事情做完」上感到困难的程度是？" },
];
