// 特定恐怖症严重度（DSM-5-TR 成人严重度10题，0-4 求和）· 计分
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

export function scorePhobia(answers: Record<number, number>): ScoringResult {
  let total = 0;
  for (let i = 1; i <= 10; i++) total += answers[i] ?? 0;
  const avg = Math.round((total / 10) * 100) / 100;
  const level = levelByAvg(avg);
  const dims = {
    type: "phobia",
    total: {
      name: "特定恐怖症严重度总分",
      score: total,
      max: 40,
      level,
      desc: "过去 7 天平均分 " + avg + " / 4。",
    },
  };

  const suggestion = "【特定恐怖症严重度】总分 " + total + " / 40（10题，0-4 分/题）\n"
    + "参考等级：" + level + "（按平均分 " + avg + " / 4 定档）。平均分 <0.5 无/亚临床、<1.5 轻度、<2.5 中度、<3.5 重度、≥3.5 极重度\n\n"
    + "参考说明：" + "本量表为特定恐怖症成人严重度量表（DSM-5-TR）。请先选定最令你焦虑的一类情境（驾驶/飞行/隧道/桥梁/封闭空间、动物或昆虫、高处/风暴/水、血液/针头/注射、呛噎或呕吐），再按该类情境作答过去 7 天的状态。\n"
    + "若对特定事物的恐惧明显超出合理程度并影响生活，请寻求专业评估。\n"
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
