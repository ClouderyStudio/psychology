// 生活满意度量表（SWLS）· 计分
//
// 5 题 7 点（1=非常不同意 … 4=中立 … 7=非常同意），无反向题，总分 5-35，
// **分越高越满意**（方向与 PHQ-9 等症状量表相反，展示时不要套用「分高=差」）。
//
// 分档（Pavot & Diener 的常见描述，非原始诊断性切点）：
//   31-35 极度满意 / 26-30 满意 / 21-25 稍满意 / 20 中立 /
//   15-19 稍不满意 / 10-14 不满意 / 5-9 极度不满意
// 变化 ≥3 分通常被视为有意义的变化（Pavot & Diener 2009 综述）。
//
// 单题（如第 3 题）单独看属常见做法、非 Diener 正式推荐：单题信度低于总分，
// 因此本文件只在建议里说明，不把单题做成独立结论。

import type { ScoringResult } from "../score";
import { swlsQuestions } from "../questions/swls-questions";

function answerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 4,
): number {
  return answers[id] ?? fallback;
}

/** 分档：返回 { label, hint } */
export function swlsBand(total: number): { label: string; hint: string } {
  if (total >= 31) return { label: "极度满意", hint: "对整体生活的评价非常积极。" };
  if (total >= 26) return { label: "满意", hint: "对生活整体感到满意，重要方面基本如愿。" };
  if (total >= 21) return { label: "稍满意", hint: "整体偏满意，但仍有明显希望改善的地方。" };
  if (total === 20) return { label: "中立", hint: "满意与不满意大致相当，没有明确倾向。" };
  if (total >= 15) return { label: "稍不满意", hint: "对生活的评价略偏负面，可能存在一些持续的压力或落差。" };
  if (total >= 10) return { label: "不满意", hint: "对生活整体不满意，重要方面与期望有较大差距。" };
  return { label: "极度不满意", hint: "对生活的评价非常负面，值得认真对待并寻求支持。" };
}

export const SWLS_MEANINGFUL_CHANGE = 3;

export function scoreSWLS(answers: Record<number, number>): ScoringResult {
  const totalScore = swlsQuestions.reduce(
    (sum, q) => sum + answerValue(answers, q.id, 4),
    0,
  );
  const maxScore = 35;
  const band = swlsBand(totalScore);
  const level = band.label;
  // 方向与症状量表相反：满意度越高，严重度越低（仅用于展示配色）
  const severity = Math.max(0.05, Math.min(1, 1 - (totalScore - 5) / 30));

  const third = answerValue(answers, 3, 4);

  const suggestion = "【生活满意度量表（SWLS）】\n"
    + "总分：" + totalScore + " / " + maxScore + "（分越高越满意）\n"
    + "本次分档：" + band.label + "——" + band.hint + "\n\n"
    + "【怎么读这个结果】\n"
    + "· SWLS 问的不是情绪好坏，而是你对自己整个人生的「判断」：理想与现状的差距、是否得到了看重的东西、愿不愿意重来。因此分数偏低不等于抑郁，分数偏高也不代表没有困扰。\n"
    + "· 总分变化 ≥3 分通常才被视为有意义的变化，单次得分不必过度解读；把它当作一条基线、隔一段时间再测一次，比纠结某一个数字更有用。\n"
    + "· 5 题里第 3 题（「我对自己的生活感到满意」）你选了 " + third + " 分，这一题常被单独拿出来讨论，但单题的信度低于整套题目，仅供参考，不要据此下结论。\n"
    + "· 如果得分长期偏低，且伴随情绪低落、兴趣减退、睡眠或食欲变化，建议找心理咨询师或精神科医生聊一聊——生活满意度是需要被认真对待的信号，而不只是「想开点」的问题。\n"
    + "· 本结果仅供参考，SWLS 是研究常用的主观幸福感指标，不是诊断工具。";

  return {
    totalScore,
    maxScore,
    level,
    suggestion,
    severity,
    dimensionScores: {
      type: "swls",
      total: { name: "总分", score: totalScore, max: maxScore, desc: "5 题 7 点相加，5-35，分越高越满意。" },
      band: { name: "满意度分档", score: 0, max: 0, level: band.label, desc: band.hint },
    },
  };
}
