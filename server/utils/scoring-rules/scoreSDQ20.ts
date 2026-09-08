// SDQ-20 躯体形式解离问卷（20 题，1-5 求和）· 计分
import type { ScoringResult } from "../score";

// SDQ-5 简化版子集（4、8、13、15、18 题），用于快速筛查
const SDQ5_ITEMS = [4, 8, 13, 15, 18];

function getAnswerValue(answers: Record<number, number>, id: number, fallback = 1): number {
  return answers[id] ?? fallback;
}

// 参考区间（基于研究文献，仅供参考，非诊断标准）
function band(total: number) {
  if (total >= 50) return { level: "高度躯体解离症状", range: "≥50" };
  if (total >= 40) return { level: "显著躯体解离症状", range: "40–49" };
  if (total >= 30) return { level: "中度躯体解离症状", range: "30–39" };
  return { level: "较低躯体解离症状", range: "<30" };
}

export function scoreSDQ20(answers: Record<number, number>): ScoringResult {
  let total = 0;
  for (let i = 1; i <= 20; i++) total += getAnswerValue(answers, i);

  let sdq5 = 0;
  for (const it of SDQ5_ITEMS) sdq5 += getAnswerValue(answers, it);

  const { level, range } = band(total);
  const dims: Record<string, any> = {
    total: {
      name: "总分（SDQ-20）",
      score: total,
      max: 100,
      level: level + "（" + range + "）",
      desc: "20 题求和（1-5/题），总分 20-100，评估过去一年各类躯体解离体验（感觉异常、运动障碍、知觉变化等）。",
    },
    sdq5: {
      name: "SDQ-5 简化版",
      score: sdq5,
      max: 25,
      level: "",
      desc: "由第 4、8、13、15、18 题组成（各 1-5，总分 5-25），用于快速筛查躯体解离。",
    },
  };

  const suggestion = "【SDQ-20 躯体形式解离问卷】总分 " + total + " / 100（20 题求和，1-5 分/题）\n"
    + "参考等级：" + level + "（" + range + "）。参考区间：<30 较低、30-39 中度、40-49 显著、>=50 高度（非诊断标准）\n"
    + "• SDQ-5 简化版：" + sdq5 + " / 25（由第 4、8、13、15、18 题组成，用于快速筛查）\n\n"
    + "参考说明：SDQ-20 为单维度量表（Cronbach α 通常 >0.90），测量躯体解离作为整体构念，评估过去一年出现的感觉异常、运动障碍、知觉变化等躯体解离体验。参考区间基于研究文献，仅供筛查参考，不能直接等同于临床诊断。\n"
    + "注意：部分症状可能由躯体疾病引起，若总分别较高或症状明显影响生活，请务必先进行医学检查排除器质性病因，再寻求精神科或临床心理的专业评估。\n\n"
    + "本量表仅用于教育与自我筛查，不构成临床诊断。若有疑问请咨询专业人员。";

  return {
    totalScore: total,
    maxScore: 100,
    level,
    suggestion,
    severity: Math.round((total / 100) * 1000) / 1000,
    dimensionScores: { type: "sdq20", ...dims },
  };
}
