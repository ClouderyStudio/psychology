// 成人 ADHD 自评量表（ASRS-v1.1，18 题）· 计分
//
// 同时输出两套结果：
//   1) 官方筛查计数（WHO 原始规则）：按每题各自的阈值二分类为 0/1，
//      统计 Part A（第 1-6 题）的阴影计数 0-6，≥4 即提示症状与成人 ADHD 相符；
//   2) Likert 总分（0-72，常见做法、非 WHO 原始）：Part A 0-24、Part B 0-48。
// 页面上的判定以第 1 套为准，第 2 套只作程度描述。
//
// 分量表划分取自 APA 转载的官方原件：注意力缺陷 = 第 1-4、7-12 题（10 题，
// 满分 40）；多动/冲动 = 第 5、6、13-18 题（8 题，满分 32）。

import type { ScoringResult } from "../score";
import { asrsQuestions } from "../questions/asrs-questions";

function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 0,
): number {
  return answers[id] ?? fallback;
}

/** 阴影计分阈值：达到该值（≥）即记 1 分 */
export const ASRS_SHADOW_THRESHOLDS: Record<number, number> = {
  1: 2, 2: 2, 3: 2, 9: 2, 12: 2, 16: 2, 18: 2,
  4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 10: 3, 11: 3, 13: 3, 14: 3, 15: 3, 17: 3,
};

/** Part A = 第 1-6 题（官方判定所用部分） */
export const ASRS_PART_A_ITEMS = [1, 2, 3, 4, 5, 6];
/** 注意力缺陷分量表（APA 原件） */
export const ASRS_INATTENTION_ITEMS = [1, 2, 3, 4, 7, 8, 9, 10, 11, 12];
/** 多动/冲动分量表（APA 原件） */
export const ASRS_HYPERACTIVE_ITEMS = [5, 6, 13, 14, 15, 16, 17, 18];

/** 官方阳性线：Part A 阴影计数 ≥4 */
export const ASRS_PART_A_THRESHOLD = 4;

function sumItems(answers: Record<number, number>, ids: number[]): number {
  return ids.reduce((sum, id) => sum + getAnswerValue(answers, id, 0), 0);
}

export function scoreASRS(answers: Record<number, number>): ScoringResult {
  let totalScore = 0;
  let shadowCount = 0;
  for (const q of asrsQuestions) {
    const v = getAnswerValue(answers, q.id, 0);
    totalScore += v;
    // 官方阴影计数只统计 Part A（第 1-6 题），Part B 不参与阳性判定
    if (
      ASRS_PART_A_ITEMS.includes(q.id) &&
      v >= (ASRS_SHADOW_THRESHOLDS[q.id] ?? 3)
    ) {
      shadowCount += 1;
    }
  }
  const maxScore = 72;

  const partA = sumItems(answers, ASRS_PART_A_ITEMS);
  const inattention = sumItems(answers, ASRS_INATTENTION_ITEMS);
  const hyperactive = sumItems(answers, ASRS_HYPERACTIVE_ITEMS);

  const positive = shadowCount >= ASRS_PART_A_THRESHOLD;
  const level = positive
    ? "筛查阳性（症状可能与成人 ADHD 相符）"
    : "未达筛查阈值";
  const severity = positive
    ? Math.min(0.95, 0.6 + ((shadowCount - 4) / 2) * 0.35)
    : Math.min(0.5, (totalScore / maxScore) * 0.75);

  const suggestion = "【成人 ADHD 自评量表（ASRS-v1.1）】\n"
    + "Part A 阴影计数：" + shadowCount + " / 6（官方判定依据）\n"
    + "Likert 总分：" + totalScore + " / " + maxScore + "（仅描述程度）\n"
    + "• 注意力缺陷分量表：" + inattention + " / 40\n"
    + "• 多动/冲动分量表：" + hyperactive + " / 32\n\n"
    + "参考判定：" + (positive
      ? "Part A 达到 ≥4 的官方阳性线，提示症状可能与成人 ADHD 相符，建议请专业人员进一步评估。"
      : "Part A 未达到 ≥4 的官方阳性线，本次筛查未提示与成人 ADHD 相符的症状模式。") + "\n\n"
    + "【怎么读这个结果】\n"
    + "• 官方判定看的是 Part A 六题里「达到各自频率阈值」的题数，不是总分高低。ASRS 的 Likert 总分只用于描述整体程度，没有官方截断值。\n"
    + "• 达到阳性线不等于确诊 ADHD：诊断还需要追查童年期（12 岁前）就存在的症状、症状跨情境出现、并造成明确的功能损害，同时排除焦虑、抑郁、睡眠剥夺等会造成类似表现的原因。\n"
    + "• 长期睡眠不足、焦虑、抑郁、甲状腺功能异常、长期压力都可能让人看起来「注意力差、坐不住」，这些同样值得评估。\n"
    + "• 如果你确实符合上述模式，且一直被「拖延、丢东西、开不了头」困扰，建议到精神科或心理科做一次正式评估，而不是只凭这份结果下结论。\n\n"
    + "本结果仅供参考，不能替代专业诊断。";

  return {
    totalScore,
    maxScore,
    level,
    suggestion,
    severity,
    dimensionScores: {
      type: "asrs",
      total: { name: "Likert 总分", score: totalScore, max: maxScore, desc: "0-4 计分相加，仅描述程度，无官方截断值。" },
      shadow: { name: "Part A 阴影计数", score: shadowCount, max: 6, level, desc: "官方判定依据：≥4 提示症状可能与成人 ADHD 相符。" },
      inattention: { name: "注意力缺陷", score: inattention, max: 40, desc: "第 1-4、7-12 题（APA 原件划分）。" },
      hyperactive: { name: "多动 / 冲动", score: hyperactive, max: 32, desc: "第 5、6、13-18 题（APA 原件划分）。" },
    },
  };
}
