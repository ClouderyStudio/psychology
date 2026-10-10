// 进食态度测验（EAT-26，26 题，0-78）· 计分
//
// 计分要点：第 1-25 题按「总是 3 / 经常 2 / 常常 1 / 有时·很少·从不 0」，
// 第 26 题反向（从不 3 / 很少 2 / 有时 1 / 其余 0）。
//
// 作答存的是「档位序号」（总是 5 / 经常 4 / 常常 3 / 有时 2 / 很少 1 / 从不 0），
// 因为作答页要求选项 value 逐题唯一；档位到分值的换算集中在本文件，两条映射表
// 也把「为什么不能直接把选项值当分数」这件事固定在计分侧：三个 0 分档必须能被
// 区分开，否则用户选「有时 / 很少 / 从不」在数据上完全一样。
//
// 三个分量表来自 Garner 等 1982 年报告的因子结构，用于解释得分来源；
// 官方不提供分量表常模与截断值，因此分量表只作说明，不单独定级。
// 阳性线 ≥20 也是官方的「转介指标」之一（另有行为条目勾选、BMI 偏低两条，
// 本在线版只收 26 道自评题，无法评估后两条）。

import type { ScoringResult } from "../score";

/**
 * 档位 → 分值：下标即档位（0 从不 / 1 很少 / 2 有时 / 3 常常 / 4 经常 / 5 总是）。
 * 第 1-25 题只有「常常」及以上计分，三个低档位一律 0 分。
 */
export const EAT26_BAND_SCORES = [0, 0, 0, 1, 2, 3] as const;

/** 第 26 题反向：从不 3 / 很少 2 / 有时 1，「常常」及以上 0 分 */
export const EAT26_REVERSE_BAND_SCORES = [3, 2, 1, 0, 0, 0] as const;

/** 第 26 题是唯一的反向题 */
export const EAT26_REVERSE_ITEM = 26;

/** 把某题的作答档位换算成量表分 */
export function eat26ItemScore(id: number, band: number | undefined): number {
  if (band === undefined) return 0;
  const table = id === EAT26_REVERSE_ITEM ? EAT26_REVERSE_BAND_SCORES : EAT26_BAND_SCORES;
  return table[band] ?? 0;
}

function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 0,
): number {
  return eat26ItemScore(id, answers[id] ?? fallback);
}

/** 节食（13 题，含反向的第 26 题） */
export const EAT26_DIETING_ITEMS = [1, 6, 7, 10, 11, 12, 14, 16, 17, 22, 23, 24, 26];
/** 贪食与食物关注（6 题） */
export const EAT26_BULIMIA_ITEMS = [3, 4, 9, 18, 21, 25];
/** 口腔控制（7 题） */
export const EAT26_ORAL_ITEMS = [2, 5, 8, 13, 15, 19, 20];

function sumItems(answers: Record<number, number>, ids: number[]): number {
  return ids.reduce((sum, id) => sum + getAnswerValue(answers, id, 0), 0);
}

export function scoreEAT26(answers: Record<number, number>): ScoringResult {
  let totalScore = 0;
  for (let i = 1; i <= 26; i++) totalScore += getAnswerValue(answers, i, 0);
  const maxScore = 78;

  const dieting = sumItems(answers, EAT26_DIETING_ITEMS);
  const bulimia = sumItems(answers, EAT26_BULIMIA_ITEMS);
  const oral = sumItems(answers, EAT26_ORAL_ITEMS);

  const positive = totalScore >= 20;
  const level = positive ? "筛查阳性（建议专业评估）" : "未达筛查阈值";
  const severity = positive
    ? Math.min(0.95, 0.5 + ((totalScore - 20) / (maxScore - 20)) * 0.45)
    : Math.max(0.05, (totalScore / maxScore) * 0.5);

  const suggestion = "【进食态度测验（EAT-26）】总分 " + totalScore + " / " + maxScore + "（26 题）\n"
    + "参考判定：" + (positive
      ? "≥20 分，达到官方筛查阳性线，建议请专业人员进一步评估。"
      : "低于 20 分，本次未达筛查阳性线。") + "\n\n"
    + "【分量表（按 Garner 1982 因子结构，仅作解释用）】\n"
    + "• 节食 " + dieting + " / 39\n"
    + "• 贪食与食物关注 " + bulimia + " / 18\n"
    + "• 口腔控制 " + oral + " / 21\n"
    + "官方不提供分量表常模与截断值，以上数字只说明得分主要来自哪些方面，不单独判定。\n\n"
    + "【怎么读这个分数】\n"
    + "• EAT-26 是筛查工具，不是诊断工具：≥20 提示「值得进一步评估」，不等于患病；低于 20 也不能排除进食问题，尤其是暴食、催吐、滥用泻药等行为在量表上可能只占少数条目。\n"
    + "• 若你在本量表之外还存在下列情况，请直接寻求专业评估，不必等分数达到 20：反复暴食并感到失控；为控制体重而催吐、用泻药或减肥药；每天运动超过 60 分钟且停不下来；半年内体重下降明显。\n"
    + "• 中文资料常见把 0-10 / 11-20 / 20-30 分为「大致正常 / 可能有倾向 / 很大机会」，这套分档并非 Garner 官方设定，仅作参考。\n\n"
    + "本结果仅供参考，不能替代专业诊断。如进食问题已影响身体或情绪，请咨询精神科、心理科或营养科医生。";

  return {
    totalScore,
    maxScore,
    level,
    suggestion,
    severity,
    dimensionScores: {
      type: "eat26",
      total: { name: "EAT-26 总分", score: totalScore, max: maxScore, level, desc: "≥20 为官方筛查阳性线。" },
      dieting: { name: "节食", score: dieting, max: 39, desc: "对体重、热量与节食行为的关注。" },
      bulimia: { name: "贪食与食物关注", score: bulimia, max: 18, desc: "暴食、催吐与对食物的反复思虑。" },
      oral: { name: "口腔控制", score: oral, max: 21, desc: "对进食量的自我控制与他人评价。" },
    },
  };
}
