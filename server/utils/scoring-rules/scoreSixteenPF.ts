import {
  getQuestionFactor,
  getCorrectAnswer,
  isReverseQuestion,
  sixteenPFFactors,
} from "#imports";
import { ScoringResult } from "../score";

// 16PF 评分函数
export function scoreSixteenPF(answers: Record<number, number>): ScoringResult {
  // 初始化各因素得分
  const factorScores: Record<string, number> = {};
  const factorCounts: Record<string, number> = {};

  // 初始化所有因素
  const factors: string[] = [
    "A",
    "B",
    "C",
    "E",
    "F",
    "G",
    "H",
    "I",
    "L",
    "M",
    "N",
    "O",
    "Q1",
    "Q2",
    "Q3",
    "Q4",
  ];
  factors.forEach((f) => {
    factorScores[f] = 0;
    factorCounts[f] = 0;
  });

  // 计算各因素得分
  Object.entries(answers).forEach(([qid, value]) => {
    const id = parseInt(qid);
    const factor = getQuestionFactor(id);
    if (factor && factors.includes(factor)) {
      let score = value;
      if (factor === "B") {
        // 因素B为推理/能力题：答对得1分，答错得0分
        const correctAnswer = getCorrectAnswer(id);
        score = correctAnswer !== null && value === correctAnswer ? 1 : 0;
      } else {
        // 其他因素：0-1-2计分，反向计分：0→2, 1→1, 2→0
        if (isReverseQuestion(id)) {
          score = 2 - value;
        }
      }
      factorScores[factor]! += score;
      factorCounts[factor]!++;
    }
  });

  // 计算各因素标准分（转换为1-10分制）
  const standardScores: Record<string, number> = {};
  const rawScores: Record<string, number> = {};

  for (const factor of factors) {
    const count = factorCounts[factor];
    if (count && count > 0) {
      const maxPossible = factor === "B" ? count : count * 2;
      const rawScore = factorScores[factor]!;
      rawScores[factor] = rawScore;
      // 转换为10分制标准分
      let stdScore = Math.round((rawScore / maxPossible) * 9) + 1;
      stdScore = Math.min(10, Math.max(1, stdScore));
      standardScores[factor] = stdScore;
    } else {
      standardScores[factor] = 5;
      rawScores[factor] = 0;
    }
  }

  // 计算次级人格因素
  const secondaryScores = calculateSecondaryFactors(standardScores);

  // 生成结果报告
  const suggestion = generateSixteenPFReport(standardScores, secondaryScores);

  // 确定主要人格特征（最高的3个因素）
  const sortedFactors = [...factors].sort(
    (a, b) => (standardScores[b] ?? 0) - (standardScores[a] ?? 0),
  );
  const topFactors = sortedFactors.slice(0, 3);

  return {
    totalScore: 0,
    maxScore: 0,
    level: `${sixteenPFFactors[topFactors[0] as keyof typeof sixteenPFFactors].name}型人格`,
    suggestion: suggestion,
    severity: 0,
    dimensionScores: {
      factors: standardScores,
      rawScores: rawScores,
      secondaryFactors: secondaryScores,
      topFactors: topFactors.map((f) => {
        const factorInfo = sixteenPFFactors[f as keyof typeof sixteenPFFactors];
        return {
          factor: f,
          name: factorInfo.name,
          score: standardScores[f] ?? 0,
          highDesc: factorInfo.highDesc,
          lowDesc: factorInfo.lowDesc,
        };
      }),
    },
  };
}
// 计算次级人格因素
function calculateSecondaryFactors(
  scores: Record<string, number>,
): Record<string, { score: number; level: string; description: string }> {
  // 适应与焦虑性 X1 = [(38+2L+3O+4Q4) - (2C+2H+2Q3)]/10
  const sL = scores["L"] ?? 5;
  const sO = scores["O"] ?? 5;
  const sQ4 = scores["Q4"] ?? 5;
  const sC = scores["C"] ?? 5;
  const sH = scores["H"] ?? 5;
  const sQ3 = scores["Q3"] ?? 5;
  const x1 = (38 + 2 * sL + 3 * sO + 4 * sQ4 - 2 * sC - 2 * sH - 2 * sQ3) / 10;

  // 内向与外向性 X2 = [(2A+3E+4F+5H) - (2Q2+11)]/10
  const sA = scores["A"] ?? 5;
  const sE = scores["E"] ?? 5;
  const sF = scores["F"] ?? 5;
  const sQ2 = scores["Q2"] ?? 5;
  const x2 = (2 * sA + 3 * sE + 4 * sF + 5 * sH - 2 * sQ2 - 11) / 10;

  // 感情用事与安详机警性 X3 = [(77+2C+2E+2F+2N) - (4A+6I+2M)]/10
  const sN = scores["N"] ?? 5;
  const sI = scores["I"] ?? 5;
  const sM = scores["M"] ?? 5;
  const x3 =
    (77 + 2 * sC + 2 * sE + 2 * sF + 2 * sN - 4 * sA - 6 * sI - 2 * sM) / 10;

  // 怯懦与果断性 X4 = [(4E+3H+4Q3) - (3A+6G+2I+2O)]/10
  const sG = scores["G"] ?? 5;
  const x4 =
    (4 * sE + 3 * sH + 4 * sQ3 - 3 * sA - 6 * sG - 2 * sI - 2 * sO) / 10;

  return {
    X1: {
      score: Math.round(x1 * 10) / 10,
      level: x1 > 5.5 ? "高焦虑" : x1 < 4.5 ? "低焦虑" : "中等焦虑",
      description:
        x1 > 5.5
          ? "容易焦虑紧张，对自己境遇常感不满。建议学习放松技巧，保持积极心态。"
          : "生活适应顺利，通常感觉心满意足。能够有效应对压力。",
    },
    X2: {
      score: Math.round(x2 * 10) / 10,
      level: x2 > 5.5 ? "外向型" : x2 < 4.5 ? "内向型" : "中间型",
      description:
        x2 > 5.5
          ? "善于交际、开朗大方。喜欢社交活动，容易与人建立联系。"
          : "羞怯审慎、拘谨不自然。更享受独处或小范围社交。",
    },
    X3: {
      score: Math.round(x3 * 10) / 10,
      level: x3 > 5.5 ? "安详机警型" : x3 < 4.5 ? "感情用事型" : "中间型",
      description:
        x3 > 5.5
          ? "安详警觉、果断刚毅。决策时理性客观，不易受情绪影响。"
          : "情绪多困扰、敏感含蓄。决策时容易受感情影响。",
    },
    X4: {
      score: Math.round(x4 * 10) / 10,
      level: x4 > 5.5 ? "果断型" : x4 < 4.5 ? "怯懦型" : "中间型",
      description:
        x4 > 5.5
          ? "果断独立、有主见。在团队中常担任领导角色。"
          : "顺从依赖、缺乏决断。倾向于听从他人安排。",
    },
  };
}
// 生成16PF综合报告
function generateSixteenPFReport(
  scores: Record<string, number>,
  secondary: Record<string, any>,
): string {
  let report = "【卡特尔16种人格因素问卷结果分析】\n\n";
  report += "一、16种人格因素分析\n\n";

  const factorsList = [
    "A",
    "B",
    "C",
    "E",
    "F",
    "G",
    "H",
    "I",
    "L",
    "M",
    "N",
    "O",
    "Q1",
    "Q2",
    "Q3",
    "Q4",
  ];

  for (const f of factorsList) {
    const score = scores[f] ?? 5;
    const factor = sixteenPFFactors[f as keyof typeof sixteenPFFactors];
    const level = score >= 7 ? "高分" : score <= 4 ? "低分" : "中等";
    const desc = score >= 7 ? factor.highDesc : factor.lowDesc;
    report += `${factor.name}(${f})：${score}分 - ${level}\n`;
    report += `  ${desc}\n\n`;
  }

  report += "二、次级人格因素分析\n\n";
  report += `• 适应与焦虑性(X1)：${secondary.X1.score}分 - ${secondary.X1.level}\n  ${secondary.X1.description}\n\n`;
  report += `• 内向与外向性(X2)：${secondary.X2.score}分 - ${secondary.X2.level}\n  ${secondary.X2.description}\n\n`;
  report += `• 感情用事与安详机警性(X3)：${secondary.X3.score}分 - ${secondary.X3.level}\n  ${secondary.X3.description}\n\n`;
  report += `• 怯懦与果断性(X4)：${secondary.X4.score}分 - ${secondary.X4.level}\n  ${secondary.X4.description}\n\n`;

  report += "三、应用建议\n\n";
  report += "16PF广泛应用于：\n";
  report += "• 心理咨询：了解来访者人格特征，制定个性化方案\n";
  report += "• 职业指导：评估工作适应性，推荐适合的职业方向\n";
  report += "• 人才选拔：预测工作稳定性和压力承受能力\n";
  report += "• 自我成长：认识自己的人格特质，发挥优势改进不足\n\n";

  report += "四、分数解释\n\n";
  report += "• 1-3分：低分倾向\n";
  report += "• 4-7分：中间水平\n";
  report += "• 8-10分：高分倾向\n";
  report += "分数越高，越接近高分描述；分数越低，越接近低分描述。";

  return report;
}
