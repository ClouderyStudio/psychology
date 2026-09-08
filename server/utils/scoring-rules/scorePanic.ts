// 惊恐障碍严重度（DSM-5-TR 成人严重度10题，0-4 求和）· 计分
import type { ScoringResult } from "../score";

// 每题 0-4，共 10 题；总分 0-40。平均分 total/10 定档：
// <0.5 无/亚临床 · <1.5 轻度 · <2.5 中度 · <3.5 重度 · ≥3.5 极重度
function levelByAvg(avg: number): string {
  if (avg >= 3.5) return "极重度";
  if (avg >= 2.5) return "重度";
  if (avg >= 1.5) return "中度";
  if (avg >= 0.5) return "轻度";
  return "无/亚临床";
}

export function scorePanic(answers: Record<number, number>): ScoringResult {
  let total = 0;
  for (let i = 1; i <= 10; i++) total += answers[i] ?? 0;
  const avg = Math.round((total / 10) * 100) / 100;
  const level = levelByAvg(avg);
  const dims = {
    type: "panic",
    total: {
      name: "惊恐障碍严重度总分",
      score: total,
      max: 40,
      level,
      desc: "过去 7 天平均分 " + avg + " / 4。",
    },
  };

  const suggestion = "【惊恐障碍严重度】总分 " + total + " / 40（10题，0-4 分/题）\\n"
    + "参考等级：" + level + "（按平均分 " + avg + " / 4 定档）。平均分 <0.5 无/亚临床、<1.5 轻度、<2.5 中度、<3.5 重度、≥3.5 极重度\\n\\n"
    + "参考说明：" + "本量表为惊恐障碍成人严重度量表（DSM-5-TR，Craske/Wittchen/Bogels/Stein/Andrews/Lebeau）。评估过去 7 天惊恐发作的频率、担忧、躯体症状与回避。\\n"
    + "若惊恐发作反复出现或明显影响生活，请寻求专业评估；惊恐发作本身不会直接危及生命，及时处理有助于改善。\\n"
    + "本量表仅用于教育与自我筛查，不构成临床诊断。";

  return {
    totalScore: total,
    maxScore: 40,
    level,
    suggestion,
    severity: Math.round((total / 40) * 1000) / 1000,
    dimensionScores: dims,
  };
}
