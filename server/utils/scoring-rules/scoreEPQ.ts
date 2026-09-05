import { epqScales, epqInterpretation } from "../questions/epq-questions";
import type { ScoringResult } from "../score";

export type EPQScaleKey = keyof typeof epqScales;

// EPQ 评分函数
export function scoreEPQ(answers: Record<number, number>): ScoringResult {
  // 各维度得分
  const scores = { E: 0, N: 0, P: 0, L: 0 };
  const counts = { E: 0, N: 0, P: 0, L: 0 };

  // 根据题目映射计算得分
  for (let i = 1; i <= 88; i++) {
    const answer = answers[i];
    if (answer === undefined) continue;

    // 根据题目ID判断属于哪个维度以及是否反向计分
    const scaleInfo = getEPQScaleInfo(i);
    if (!scaleInfo) continue;

    let score = answer; // answer 是 1（是）或 0（否）
    if (scaleInfo.reverse) {
      // 反向计分：答"是"得0分，答"否"得1分
      score = 1 - answer;
    }

    scores[scaleInfo.scale] += score;
    counts[scaleInfo.scale]++;
  }

  // 原始分数
  const rawScores = {
    E: scores.E,
    N: scores.N,
    P: scores.P,
    L: scores.L,
  };

  // 将原始分数转换为 T 分数（标准分）
  // T = 50 + 10 * (X - M) / SD
  // 使用标准常模（中国常模）
  const tScores = convertToTScores(rawScores);

  // 生成结果报告
  const suggestion = generateEPQReport(tScores, rawScores);

  // 确定主要人格特征（T分最高的维度）
  const maxT = Math.max(tScores.E, tScores.N, tScores.P);
  let primaryType: EPQScaleKey = "P";
  if (tScores.E === maxT) primaryType = "E";
  else if (tScores.N === maxT) primaryType = "N";
  else primaryType = "P";

  return {
    totalScore: tScores.E, // 主要用E分作为总分参考
    maxScore: 100,
    level: `${epqScales[primaryType].name}型人格`,
    suggestion: suggestion,
    severity: 0,
    dimensionScores: {
      E: {
        raw: rawScores.E,
        tScore: tScores.E,
        name: epqScales.E.name,
        desc: getEPQLevelDesc("E", tScores.E),
      },
      N: {
        raw: rawScores.N,
        tScore: tScores.N,
        name: epqScales.N.name,
        desc: getEPQLevelDesc("N", tScores.N),
      },
      P: {
        raw: rawScores.P,
        tScore: tScores.P,
        name: epqScales.P.name,
        desc: getEPQLevelDesc("P", tScores.P),
      },
      L: {
        raw: rawScores.L,
        tScore: tScores.L,
        name: epqScales.L.name,
        desc: getEPQValidityDesc(tScores.L),
      },
    },
  };
}
// 获取题目信息（维度、是否反向计分）
function getEPQScaleInfo(
  id: number,
): { scale: "E" | "N" | "P" | "L"; reverse: boolean } | null {
  // 定义所有题目的维度映射
  const scaleMap: Record<
    number,
    { scale: "E" | "N" | "P" | "L"; reverse: boolean }
  > = {
    // E量表
    1: { scale: "E", reverse: false },
    5: { scale: "E", reverse: false },
    10: { scale: "E", reverse: false },
    13: { scale: "E", reverse: false },
    14: { scale: "E", reverse: false },
    17: { scale: "E", reverse: false },
    21: { scale: "E", reverse: true },
    25: { scale: "E", reverse: false },
    29: { scale: "E", reverse: true },
    33: { scale: "E", reverse: false },
    37: { scale: "E", reverse: false },
    41: { scale: "E", reverse: false },
    45: { scale: "E", reverse: true },
    49: { scale: "E", reverse: false },
    53: { scale: "E", reverse: false },
    55: { scale: "E", reverse: false },
    61: { scale: "E", reverse: false },
    65: { scale: "E", reverse: false },
    71: { scale: "E", reverse: false },
    80: { scale: "E", reverse: false },
    84: { scale: "E", reverse: false },

    // N量表
    3: { scale: "N", reverse: false },
    7: { scale: "N", reverse: false },
    12: { scale: "N", reverse: false },
    15: { scale: "N", reverse: false },
    19: { scale: "N", reverse: false },
    23: { scale: "N", reverse: false },
    27: { scale: "N", reverse: false },
    31: { scale: "N", reverse: false },
    35: { scale: "N", reverse: false },
    39: { scale: "N", reverse: false },
    43: { scale: "N", reverse: false },
    47: { scale: "N", reverse: false },
    51: { scale: "N", reverse: false },
    57: { scale: "N", reverse: false },
    59: { scale: "N", reverse: false },
    63: { scale: "N", reverse: false },
    67: { scale: "N", reverse: false },
    69: { scale: "N", reverse: false },
    73: { scale: "N", reverse: false },
    74: { scale: "N", reverse: false },
    77: { scale: "N", reverse: false },
    78: { scale: "N", reverse: false },
    82: { scale: "N", reverse: false },
    86: { scale: "N", reverse: false },

    // P量表 - 反向计分题
    2: { scale: "P", reverse: true },
    6: { scale: "P", reverse: true },
    9: { scale: "P", reverse: true },
    11: { scale: "P", reverse: true },
    18: { scale: "P", reverse: true },
    38: { scale: "P", reverse: true },
    42: { scale: "P", reverse: true },
    56: { scale: "P", reverse: true },
    62: { scale: "P", reverse: true },
    72: { scale: "P", reverse: true },
    88: { scale: "P", reverse: true },
    // P量表 - 正向计分题
    22: { scale: "P", reverse: false },
    26: { scale: "P", reverse: false },
    30: { scale: "P", reverse: false },
    34: { scale: "P", reverse: false },
    46: { scale: "P", reverse: false },
    50: { scale: "P", reverse: false },
    66: { scale: "P", reverse: false },
    68: { scale: "P", reverse: false },
    75: { scale: "P", reverse: false },
    76: { scale: "P", reverse: false },
    81: { scale: "P", reverse: false },
    85: { scale: "P", reverse: false },

    // L量表 - 反向计分题
    4: { scale: "L", reverse: true },
    8: { scale: "L", reverse: true },
    16: { scale: "L", reverse: true },
    24: { scale: "L", reverse: true },
    28: { scale: "L", reverse: true },
    40: { scale: "L", reverse: true },
    44: { scale: "L", reverse: true },
    48: { scale: "L", reverse: true },
    52: { scale: "L", reverse: true },
    54: { scale: "L", reverse: true },
    60: { scale: "L", reverse: true },
    64: { scale: "L", reverse: true },
    70: { scale: "L", reverse: true },
    79: { scale: "L", reverse: true },
    83: { scale: "L", reverse: true },
    // L量表 - 正向计分题
    20: { scale: "L", reverse: false },
    32: { scale: "L", reverse: false },
    36: { scale: "L", reverse: false },
    58: { scale: "L", reverse: false },
    87: { scale: "L", reverse: false },
  };

  return scaleMap[id] || null;
}
// 将原始分数转换为 T 分数（使用中国常模）
function convertToTScores(raw: {
  E: number;
  N: number;
  P: number;
  L: number;
}): { E: number; N: number; P: number; L: number } {
  // 中国常模数据（男性）
  // E量表: M=11.16, SD=4.41
  // N量表: M=9.06, SD=4.75
  // P量表: M=5.68, SD=3.09
  // L量表: M=12.51, SD=3.57
  const tScores = {
    E: 50 + (10 * (raw.E - 11.16)) / 4.41,
    N: 50 + (10 * (raw.N - 9.06)) / 4.75,
    P: 50 + (10 * (raw.P - 5.68)) / 3.09,
    L: 50 + (10 * (raw.L - 12.51)) / 3.57,
  };

  // 限制范围在 0-100 之间
  for (const key of ["E", "N", "P", "L"] as const) {
    tScores[key] = Math.min(100, Math.max(0, Math.round(tScores[key])));
  }

  return tScores;
}
// 获取维度水平描述
function getEPQLevelDesc(scale: string, tScore: number): string {
  if (tScore >= 61.5) return "典型高分";
  if (tScore >= 56.7) return "倾向高分";
  if (tScore <= 38.5) return "典型低分";
  if (tScore <= 43.3) return "倾向低分";
  return "中间型";
}
// 获取效度描述
function getEPQValidityDesc(tScore: number): string {
  if (tScore >= 60) {
    return "您的回答可能存在掩饰倾向，结果可信度较低。建议在放松状态下重新作答。";
  }
  if (tScore >= 50) {
    return "您的回答基本可信，但有一定掩饰倾向。";
  }
  return "您的回答真实可信。";
}
// 生成 EPQ 综合报告
function generateEPQReport(
  tScores: { E: number; N: number; P: number; L: number },
  raw: { E: number; N: number; P: number; L: number },
): string {
  let report = "【艾森克人格问卷结果分析】\n\n";

  // 各维度详细分析
  report += "一、各维度得分分析\n\n";

  // E量表（内外向）
  report += `1. 内外向（E量表）：${tScores.E}分（${getEPQLevelDesc("E", tScores.E)}）\n`;
  if (tScores.E >= 56.7) {
    report += `   ${epqInterpretation.E.high}\n`;
  } else if (tScores.E <= 43.3) {
    report += `   ${epqInterpretation.E.low}\n`;
  } else {
    report += `   您属于中间型，兼具内外向的特点，在社交场合既能活跃也能安静。\n`;
  }
  report += `   原始分：${raw.E}/21\n\n`;

  // N量表（神经质）
  report += `2. 神经质（N量表）：${tScores.N}分（${getEPQLevelDesc("N", tScores.N)}）\n`;
  if (tScores.N >= 56.7) {
    report += `   ${epqInterpretation.N.high}\n`;
  } else if (tScores.N <= 43.3) {
    report += `   ${epqInterpretation.N.low}\n`;
  } else {
    report += `   您情绪稳定性中等，大多数时候能够保持平和，偶尔会有情绪波动。\n`;
  }
  report += `   原始分：${raw.N}/24\n\n`;

  // P量表（精神质）
  report += `3. 精神质（P量表）：${tScores.P}分（${getEPQLevelDesc("P", tScores.P)}）\n`;
  if (tScores.P >= 56.7) {
    report += `   ${epqInterpretation.P.high}\n`;
  } else if (tScores.P <= 43.3) {
    report += `   ${epqInterpretation.P.low}\n`;
  } else {
    report += `   您具有适度的精神质倾向，能够与人保持良好关系，同时保持独立思考。\n`;
  }
  report += `   原始分：${raw.P}/23\n\n`;

  // L量表（效度）
  report += `二、效度分析\n\n`;
  report += `掩饰性（L量表）：${tScores.L}分\n`;
  report += `${epqInterpretation.L[tScores.L >= 60 ? "high" : "low"]}\n`;
  report += `原始分：${raw.L}/20\n\n`;

  // 人格综合描述
  report += `三、人格综合描述\n\n`;

  // 组合判断
  if (tScores.E >= 56.7 && tScores.N <= 43.3) {
    report += `• 您属于多血质类型：外向、稳定、乐观、善于社交，情绪稳定。\n`;
  } else if (tScores.E >= 56.7 && tScores.N >= 56.7) {
    report += `• 您属于胆汁质类型：外向、不稳定、热情、易冲动，情绪波动较大。\n`;
  } else if (tScores.E <= 43.3 && tScores.N <= 43.3) {
    report += `• 您属于粘液质类型：内向、稳定、安静、稳重，情绪平稳持久。\n`;
  } else if (tScores.E <= 43.3 && tScores.N >= 56.7) {
    report += `• 您属于抑郁质类型：内向、不稳定、敏感、细腻，情绪体验深刻。\n`;
  } else {
    report += `• 您属于混合型气质，在不同的情境下会表现出不同的人格特点。\n`;
  }

  report += `\n【应用建议】\n`;
  report += `• 了解自己的人格特点是自我成长的第一步\n`;
  report += `• 发挥自己人格特质中的优势，接纳和完善不足\n`;
  report += `• 在人际交往和工作学习中，找到适合自己性格的方式\n`;
  report += `• 如果N分较高（情绪不稳定），建议学习情绪管理技巧\n`;
  report += `• 如果P分较高，建议多关注他人感受，培养共情能力\n`;

  if (tScores.L >= 60) {
    report += `\n⚠️ 温馨提示：由于您的L分较高，本次结果仅供参考。建议在放松状态下重新作答以获得更准确的结果。`;
  }

  return report;
}
