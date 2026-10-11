// 精神需求量表（Spiritual Needs Questionnaire, SpNQ-20）· 题库
//
// 编制：Arndt Büssing（德国 Witten/Herdecke 大学）
// 首发：Büssing A, Balzat HJ, Heusser P. Eur J Med Res. 2010;15(6):266-273.
//   19 题版，α≈.93。
// 定型版（本实现依据）：Büssing A, Recchia DR, Koenig H, Baumann K, Frick E.
//   Spiritual Needs of Patients with Chronic Diseases. Religions. 2018;9(1):13.
//   doi:10.3390/rel9010013（开放获取，n=2095，CFI=0.96 / RMSEA=0.04）
// 权威综述与四因子结构：Büssing A. J Relig Health. 2021;60(5):3732-3748.
//   doi:10.1007/s10943-021-01421-4
// 官方题本与说明：https://www.spiritualneeds.net/
//
// 版权：官方题纸页脚写明「SpNQ © Arndt Büssing; permission required to copy or
// publish (www.spiritualneeds.net)」，翻译版还需填写官方登记表。本平台按研究/自评
// 用途整理中文题面，版权归原作者所有；如需公开转载请先联系作者
// （arndt.buessing@uni-wh.de）。
//
// 结构：SpNQ-20 共 20 题，回答 0 = 完全没有 / 1 = 有一点 / 2 = 比较强 / 3 = 非常强。
// 官方四因子（题号按本文件的连续编号，括号内为官方编号）：
//   内在平静需求 IPN（4 题）：1(N2) 3(N6) 4(N7) 5(N8)
//   存在需求 ExN（6 题）：2(N5) 6(N10) 7(N11) 8(N12) 11(N16) 12(N17)
//   给予 / 生成性需求 GGN（4 题）：9(N14) 10(N15) 19(N26) 20(N27)
//   宗教需求 RN（6 题）：13(N18) 14(N19) 15(N20) 16(N21) 17(N22) 18(N23)
//
// 重要：官方只提供单个题目的 0-3 评分，以及按因子求和；**没有总分切点、没有分档、
// 也没有反向题**。因此结果里只报告各因子得分与总均值，不做「高/低/异常」判定。
// 计分见 scoreSpNQ.ts。
//
// 回忆期：官方 PDF 的指导语是「During the last time, did you have had the needs
// …」，部分版本用「过去两周」。本平台按通用题面处理，不作固定窗口。
//
// 说明：原标题涉及宗教的 6 题（13-18）保留原意，其中「更高的存在」是官方英文
// higher presence 的直译，原文举例为 God / Allah，中文举例扩展到上天、佛菩萨、
// 祖先等，以便不同信仰与无信仰者作答（无非宗教替代措辞，改问法即偏离原量表）。

import type { Option } from "~/types/test";

export const spnqOptions: Option[] = [
  { value: 0, label: "完全没有" },
  { value: 1, label: "有一点" },
  { value: 2, label: "比较强" },
  { value: 3, label: "非常强" },
];

export interface SpNQQuestion {
  id: number;
  text: string;
}

export const spnqQuestions: SpNQQuestion[] = [
  // 题号为本平台的连续编号 1-20（作答页会按此编号出题）；
  // 每行末尾标注官方编号 N 与所属因子，便于与原量表逐条对照。
  { id: 1, text: "与别人谈谈自己的恐惧和担忧" }, // N2 · 内在平静
  { id: 2, text: "理清或澄清人生中尚未解决的部分" }, // N5 · 存在
  { id: 3, text: "沉浸于自然之美" }, // N6 · 内在平静
  { id: 4, text: "待在一个安静、平和的地方" }, // N7 · 内在平静
  { id: 5, text: "找到内心的平静" }, // N8 · 内在平静
  { id: 6, text: "在疾病或痛苦中找到意义" }, // N10 · 存在
  { id: 7, text: "与某人谈谈人生意义的问题" }, // N11 · 存在
  { id: 8, text: "与某人谈谈死后生命（来世）的可能性" }, // N12 · 存在
  { id: 9, text: "把属于自己的东西给予他人（时间、经验或物质）" }, // N14 · 给予
  { id: 10, text: "安慰某个人" }, // N15 · 给予
  { id: 11, text: "原谅某个特定时期里的某个人" }, // N16 · 存在
  { id: 12, text: "获得原谅" }, // N17 · 存在
  { id: 13, text: "与他人一起祈祷" }, // N18 · 宗教
  { id: 14, text: "有人为你祈祷" }, // N19 · 宗教
  { id: 15, text: "自己祈祷" }, // N20 · 宗教
  { id: 16, text: "参加宗教仪式（如礼拜、法会）" }, // N21 · 宗教
  { id: 17, text: "阅读宗教或灵性方面的书籍" }, // N22 · 宗教
  { id: 18, text: "转向更高的存在（如神、上天、佛菩萨、祖先等）" }, // N23 · 宗教
  { id: 19, text: "把自己的人生经验传递给他人" }, // N26 · 给予
  { id: 20, text: "确信自己的人生是有意义、有价值的" }, // N27 · 给予
];
