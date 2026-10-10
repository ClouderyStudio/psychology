// 网络游戏障碍量表（简式）（IGDS9-SF，9 题，9-45）· 计分
//
// 官方判定（DSM-5 口径）：以「非常频繁（5 分）」表示该条标准被认可，
// 9 条中 ≥5 条被认可即达到网络游戏障碍的筛查标准。
// 总分（9-45）只作程度描述，官方并不提供总分截断值；本平台另给的连续分档
// 属描述性做法，仅用于把分数读成「程度」，不作为判定依据。

import type { ScoringResult } from "../score";
import { igdsQuestions } from "../questions/igds-questions";

function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 1,
): number {
  return answers[id] ?? fallback;
}

/** 官方认可阈值：作答为「非常频繁」 */
export const IGDS_ENDORSED_VALUE = 5;
/** 官方障碍判定所需的被认可条目数 */
export const IGDS_DISORDER_THRESHOLD = 5;

export function scoreIGDS(answers: Record<number, number>): ScoringResult {
  let totalScore = 0;
  let endorsed = 0;
  for (const q of igdsQuestions) {
    const v = getAnswerValue(answers, q.id, 1);
    totalScore += v;
    if (v >= IGDS_ENDORSED_VALUE) endorsed += 1;
  }
  const maxScore = igdsQuestions.length * 5;

  const hasDisorder = endorsed >= IGDS_DISORDER_THRESHOLD;
  const level = hasDisorder
    ? "达到网络游戏障碍筛查标准（建议专业评估）"
    : "未达网络游戏障碍筛查标准";
  const severity = hasDisorder
    ? Math.min(0.95, 0.6 + ((endorsed - 5) / 4) * 0.35)
    : Math.min(0.5, (totalScore / maxScore) * 0.6);

  const suggestion = "【网络游戏障碍量表（IGDS9-SF）】总分 " + totalScore + " / " + maxScore + "（9-45）\n"
    + "「非常频繁」的条目数：" + endorsed + " / 9\n\n"
    + "参考判定：" + (hasDisorder
      ? "9 条标准中有 " + endorsed + " 条为「非常频繁」，达到 ≥5 条的筛查标准，建议请专业人员进一步评估。"
      : "被认可的条目为 " + endorsed + " 条，未达到 ≥5 条的筛查标准。") + "\n\n"
    + "【怎么读这个结果】\n"
    + "• IGDS9-SF 的官方判定方式是「有几条标准达到非常频繁」，而不是总分高低。总分 9-45 只用来描述整体程度。\n"
    + "• 达到筛查标准不等于确诊：网络游戏障碍的诊断还要看病程（通常需持续 12 个月）、功能损害程度，并排除其他精神障碍与单纯的投入型玩法。\n"
    + "• 游戏本身不是问题。值得留意的是：是否已无法自主控制时长、是否以游戏回避现实压力、是否已损害睡眠、学业工作或人际关系。\n"
    + "• 若你同时存在明显的抑郁、焦虑或注意力问题，这些也可能与游戏行为互相加重，建议一并评估，而不是只处理游戏。\n\n"
    + "本结果仅供参考，不能替代专业诊断。若游戏已明显影响生活，请咨询精神科或心理科医生。";

  return {
    totalScore,
    maxScore,
    level,
    suggestion,
    severity,
    dimensionScores: {
      type: "igds",
      total: { name: "IGDS9-SF 总分", score: totalScore, max: maxScore, level, desc: "9-45 分，仅描述整体程度；判定看被认可条目数。" },
      endorsed: { name: "「非常频繁」条目数", score: endorsed, max: 9, level, desc: "≥5 条即达到官方筛查标准。" },
    },
  };
}
