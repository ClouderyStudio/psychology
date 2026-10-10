// 生活满意度量表（SWLS）· 题库
//
// 编制：Diener E, Emmons RA, Larsen RJ, Griffin S. The Satisfaction With Life
// Scale. Journal of Personality Assessment. 1985;49(1):71-75.
// 中文版常引用熊承清、许远理《中国健康心理学杂志》2009;17(8):948-949。
//
// 结构：5 题，7 点单维，全部正向计分，无反向题，没有固定回忆期——问的是
// 「到目前为止对整体生活的判断」，因此题面里不出现「过去/最近」等窗口词。
// 总分 5-35，分越高生活满意度越高（与大多数症状量表方向相反）。
//
// 官方中文版（Yuen Mantak 译）第 4 题译作「直至现在为止，我都能够得到我在
// 生活上希望拥有的重要东西」，本文件采用该译法。

import type { Option } from "~/types/test";

export const swlsOptions: Option[] = [
  { value: 1, label: "非常不同意" },
  { value: 2, label: "不同意" },
  { value: 3, label: "有点不同意" },
  { value: 4, label: "中立" },
  { value: 5, label: "有点同意" },
  { value: 6, label: "同意" },
  { value: 7, label: "非常同意" },
];

export interface SWLSQuestion {
  id: number;
  text: string;
}

export const swlsQuestions: SWLSQuestion[] = [
  { id: 1, text: "我的生活大致符合我的理想。" },
  { id: 2, text: "我的生活状况非常圆满。" },
  { id: 3, text: "我对自己的生活感到满意。" },
  { id: 4, text: "直至现在为止，我都能够得到我在生活上希望拥有的重要东西。" },
  { id: 5, text: "如果我能重新活一次，我几乎不会想改变任何东西。" },
];
