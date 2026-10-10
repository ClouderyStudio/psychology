// SCOFF 进食障碍筛查问卷（5 题二分类，0-5）· 计分
//
// 官方阈值：≥2 个「是」为阳性。原始研究（临床 vs 对照）灵敏度 100%、
// 特异度 87.5%；中文版（香港中学生，Leung 2009）灵敏度 76.1%、特异度 97.1%。
// SCOFF 没有轻 / 中 / 重度分档，只有阴性与阳性两档。

import type { ScoringResult } from "../score";

function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 0,
): number {
  return answers[id] ?? fallback;
}

export function scoreSCOFF(answers: Record<number, number>): ScoringResult {
  let totalScore = 0;
  for (let i = 1; i <= 5; i++) {
    totalScore += getAnswerValue(answers, i, 0) >= 1 ? 1 : 0;
  }
  const maxScore = 5;

  const positive = totalScore >= 2;
  const level = positive ? "筛查阳性（建议专业评估）" : "筛查阴性";
  const severity = positive ? Math.min(0.95, 0.55 + (totalScore - 2) * 0.13) : 0.1;

  const suggestion = "【SCOFF 进食障碍筛查】阳性题数 " + totalScore + " / " + maxScore + "\n"
    + "参考判定：" + (positive
      ? "≥2 项为阳性，提示可能存在需要专业人员评估的进食问题。"
      : "0-1 项，本次筛查阴性。") + "\n\n"
    + "【怎么读这个结果】\n"
    + "• SCOFF 只有阴性 / 阳性两档，没有轻中重度之分，也不能区分具体是哪一类进食问题。\n"
    + "• 阳性说明「值得请专业人员评估」，不等于确诊；阴性也不能完全排除进食障碍——筛查工具总有漏检。\n"
    + "• 若你近期出现体重明显下降、反复催吐或滥用泻药、因进食问题晕倒或月经停止，无论本问卷得分多少，都请尽快就医。\n\n"
    + "本结果仅供参考，不能替代专业诊断。如进食问题已影响身体或情绪，请咨询精神科、心理科或营养科医生。";

  return {
    totalScore,
    maxScore,
    level,
    suggestion,
    severity,
    dimensionScores: {
      type: "scoff",
      total: { name: "SCOFF 阳性题数", score: totalScore, max: maxScore, level, desc: "≥2 项为阳性。" },
    },
  };
}
