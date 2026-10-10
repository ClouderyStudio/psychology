// SCOFF 进食障碍筛查问卷 · 题库
//
// 编制：Morgan JF, Reid F, Lacey JH. The SCOFF questionnaire: assessment of a
// new screening tool for eating disorders. BMJ. 1999;319(7223):1467-1468.
//
// 中文版（香港中学生样本）：Leung SF, Lee KL, Lee SM, et al. Psychometric
// properties of the SCOFF questionnaire (Chinese version). Int J Nurs Stud.
// 2009;46(2):239-247.
//
// 结构：5 题二分类（是 / 否），每题 1 分，总分 0-5，≥2 为阳性。
// 字母即缩写来源：Sick（催吐）、Control（失控）、One stone（体重下降）、
// Fat（体像）、Food（食物主导）。
//
// 翻译注意：原版为英国英语，Sick 明确指「让自己呕吐」而非「生病」，
// 中文必须写成「催吐」，否则这一题会失去原意。

import type { Option } from "~/types/test";

export const scoffOptions: Option[] = [
  { value: 1, label: "是" },
  { value: 0, label: "否" },
];

export interface SCOFFQuestion {
  id: number;
  text: string;
}

export const scoffQuestions: SCOFFQuestion[] = [
  { id: 1, text: "你是否会因为吃得太饱、感到不舒服而让自己催吐？" },
  { id: 2, text: "你是否担心自己已经无法控制吃多少？" },
  { id: 3, text: "你最近是否曾在 3 个月内体重下降超过 6.35 公斤（约 14 磅）？" },
  { id: 4, text: "当别人说你太瘦时，你是否仍认为自己很胖？" },
  { id: 5, text: "你是否觉得食物主导了你的生活？" },
];
