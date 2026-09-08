// 创伤后应激严重度（DSM-5-TR 成人严重度9题，0-4 求和）· 计分
import type { ScoringResult } from "../score";

// 每题 0-4，共 9 题；总分 0-36。平均分 total/9 定档：
// <0.5 无/亚临床 · <1.5 轻度 · <2.5 中度 · <3.5 重度 · ≥3.5 极重度
function levelByAvg(avg: number): string {
  if (avg >= 3.5) return "极重度";
  if (avg >= 2.5) return "重度";
  if (avg >= 1.5) return "中度";
  if (avg >= 0.5) return "轻度";
  return "无/亚临床";
}

export function scorePtsd(answers: Record<number, number>): ScoringResult {
  let total = 0;
  for (let i = 1; i <= 9; i++) total += answers[i] ?? 0;
  const avg = Math.round((total / 9) * 100) / 100;
  const level = levelByAvg(avg);
  const dims = {
    type: "ptsd",
    total: {
      name: "创伤后应激严重度总分",
      score: total,
      max: 36,
      level,
      desc: "过去 7 天平均分 " + avg + " / 4。",
    },
  };

  const suggestion = "【创伤后应激严重度】总分 " + total + " / 36（9题，0-4 分/题）\\n"
    + "参考等级：" + level + "（按平均分 " + avg + " / 4 定档）。平均分 <0.5 无/亚临床、<1.5 轻度、<2.5 中度、<3.5 重度、≥3.5 极重度\\n\\n"
    + "参考说明：" + "本量表为创伤后应激严重度量表（NSESSS 创伤后应激短量表，Kilpatrick/Resnick/Friedman）。评估经历过极端应激事件（创伤）后，过去 7 天内的侵入性回忆、回避、消极情绪与警觉增高。\\n"
    + "若总分较高或创伤后症状明显影响生活，请寻求精神科或临床心理专业评估；如处于急性危机（如想要伤害自己），请立即拨打全国心理援助热线 12356 或就医。\\n"
    + "本量表仅用于教育与自我筛查，不构成临床诊断。";

  return {
    totalScore: total,
    maxScore: 36,
    level,
    suggestion,
    severity: Math.round((total / 36) * 1000) / 1000,
    dimensionScores: dims,
  };
}
