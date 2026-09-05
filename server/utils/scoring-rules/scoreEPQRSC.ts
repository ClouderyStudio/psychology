import { epqRscScales } from "../questions/epq-rsc-questions";
import { ScoringResult } from "../score";

export type EPQRSCScaleKey = keyof typeof epqRscScales;

// EPQ-RSC 评分函数
export function scoreEPQRSC(answers: Record<number, number>): ScoringResult {
  // 各维度得分
  const scores = { E: 0, N: 0, P: 0, L: 0 };
  const counts = { E: 0, N: 0, P: 0, L: 0 };

  // 根据题目映射计算得分
  for (let i = 1; i <= 48; i++) {
    const answer = answers[i];
    if (answer === undefined) continue;

    const scaleInfo = getEPQRSCScaleInfo(i);
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

  // 计算标准分（T分数）
  const tScores = convertToEPQRSC_TScores(rawScores);

  // 生成结果报告
  const suggestion = generateEPQRSCReport(tScores, rawScores);

  // 确定主要人格特征
  const maxT = Math.max(tScores.E, tScores.N, tScores.P);
  let primaryType: EPQRSCScaleKey = "P";
  if (tScores.E === maxT) primaryType = "E";
  else if (tScores.N === maxT) primaryType = "N";
  else primaryType = "P";

  return {
    totalScore: rawScores.E,
    maxScore: 48,
    level: `${epqRscScales[primaryType].name}倾向`,
    suggestion: suggestion,
    severity: 0,
    dimensionScores: {
      E: {
        raw: rawScores.E,
        tScore: tScores.E,
        name: epqRscScales.E.name,
        highDesc: epqRscScales.E.highDesc,
        lowDesc: epqRscScales.E.lowDesc,
        level: getEPQRSCLevelDesc("E", tScores.E),
      },
      N: {
        raw: rawScores.N,
        tScore: tScores.N,
        name: epqRscScales.N.name,
        highDesc: epqRscScales.N.highDesc,
        lowDesc: epqRscScales.N.lowDesc,
        level: getEPQRSCLevelDesc("N", tScores.N),
      },
      P: {
        raw: rawScores.P,
        tScore: tScores.P,
        name: epqRscScales.P.name,
        highDesc: epqRscScales.P.highDesc,
        lowDesc: epqRscScales.P.lowDesc,
        level: getEPQRSCLevelDesc("P", tScores.P),
      },
      L: {
        raw: rawScores.L,
        tScore: tScores.L,
        name: epqRscScales.L.name,
        validity: getEPQRSCValidityDesc(tScores.L),
      },
    },
  };
}
// 获取题目信息（维度、是否反向计分）
function getEPQRSCScaleInfo(
  id: number,
): { scale: "E" | "N" | "P" | "L"; reverse: boolean } | null {
  const scaleMap: Record<
    number,
    { scale: "E" | "N" | "P" | "L"; reverse: boolean }
  > = {
    // E量表：正向（11题），反向（1题）
    3: { scale: "E", reverse: false },
    7: { scale: "E", reverse: false },
    11: { scale: "E", reverse: false },
    15: { scale: "E", reverse: false },
    19: { scale: "E", reverse: false },
    23: { scale: "E", reverse: false },
    27: { scale: "E", reverse: true },
    32: { scale: "E", reverse: false },
    36: { scale: "E", reverse: false },
    41: { scale: "E", reverse: false },
    44: { scale: "E", reverse: false },
    48: { scale: "E", reverse: false },

    // N量表：全部正向（12题）
    1: { scale: "N", reverse: false },
    5: { scale: "N", reverse: false },
    9: { scale: "N", reverse: false },
    13: { scale: "N", reverse: false },
    17: { scale: "N", reverse: false },
    21: { scale: "N", reverse: false },
    25: { scale: "N", reverse: false },
    30: { scale: "N", reverse: false },
    34: { scale: "N", reverse: false },
    38: { scale: "N", reverse: false },
    42: { scale: "N", reverse: false },
    46: { scale: "N", reverse: false },

    // P量表：正向（5题），反向（7题）
    10: { scale: "P", reverse: false },
    14: { scale: "P", reverse: false },
    22: { scale: "P", reverse: false },
    31: { scale: "P", reverse: false },
    39: { scale: "P", reverse: false },
    2: { scale: "P", reverse: true },
    6: { scale: "P", reverse: true },
    18: { scale: "P", reverse: true },
    26: { scale: "P", reverse: true },
    28: { scale: "P", reverse: true },
    35: { scale: "P", reverse: true },
    43: { scale: "P", reverse: true },

    // L量表：正向（3题），反向（8题）
    4: { scale: "L", reverse: false },
    16: { scale: "L", reverse: false },
    45: { scale: "L", reverse: false },
    8: { scale: "L", reverse: true },
    12: { scale: "L", reverse: true },
    20: { scale: "L", reverse: true },
    24: { scale: "L", reverse: true },
    29: { scale: "L", reverse: true },
    33: { scale: "L", reverse: true },
    37: { scale: "L", reverse: true },
    40: { scale: "L", reverse: true },
    47: { scale: "L", reverse: true },
  };

  return scaleMap[id] || null;
}
// 将原始分数转换为 T 分数
function convertToEPQRSC_TScores(raw: {
  E: number;
  N: number;
  P: number;
  L: number;
}): { E: number; N: number; P: number; L: number } {
  // 中国常模数据
  // E量表：M≈7.5, SD≈3.2
  // N量表：M≈6.8, SD≈3.5
  // P量表：M≈3.5, SD≈2.5
  // L量表：M≈8.5, SD≈3.8
  const tScores = {
    E: 50 + (10 * (raw.E - 7.5)) / 3.2,
    N: 50 + (10 * (raw.N - 6.8)) / 3.5,
    P: 50 + (10 * (raw.P - 3.5)) / 2.5,
    L: 50 + (10 * (raw.L - 8.5)) / 3.8,
  };

  // 限制范围在 0-100 之间
  for (const key of ["E", "N", "P", "L"] as const) {
    tScores[key] = Math.min(100, Math.max(0, Math.round(tScores[key])));
  }

  return tScores;
}
// 获取维度水平描述
function getEPQRSCLevelDesc(scale: string, tScore: number): string {
  if (tScore >= 61.5) return "典型高分";
  if (tScore >= 56.7) return "倾向高分";
  if (tScore <= 38.5) return "典型低分";
  if (tScore <= 43.3) return "倾向低分";
  return "中间型";
}
// 获取效度描述
function getEPQRSCValidityDesc(tScore: number): string {
  if (tScore >= 60) {
    return "您的回答可能存在掩饰倾向，结果可信度较低。建议在放松状态下重新作答。";
  }
  if (tScore >= 50) {
    return "您的回答基本可信。";
  }
  return "您的回答真实可信。";
}
// 生成 EPQ-RSC 综合报告
function generateEPQRSCReport(
  tScores: { E: number; N: number; P: number; L: number },
  raw: { E: number; N: number; P: number; L: number },
): string {
  let report = "【艾森克人格问卷简式量表（EPQ-RSC）结果分析】\n\n";
  report += "本量表由北京大学钱铭怡教授等修订，基于中国常模进行解释。\n\n";

  // 效度分析
  report += "一、效度分析\n\n";
  report += `掩饰性（L量表）：${tScores.L}分（原始分：${raw.L}/12）\n`;
  report += `${getEPQRSCValidityDesc(tScores.L)}\n\n`;

  if (tScores.L >= 60) {
    report +=
      "⚠️ 温馨提示：由于L分较高，本次结果仅供参考。建议在放松状态下重新作答以获得更准确的结果。\n\n";
  }

  // 各维度详细分析
  report += "二、各维度得分分析\n\n";

  // E量表（内外向）
  report += `1. 内外向（E量表）：${tScores.E}分（${getEPQRSCLevelDesc("E", tScores.E)}）\n`;
  report += `   原始分：${raw.E}/12\n`;
  if (tScores.E >= 56.7) {
    report += `   ${epqRscScales.E.highDesc}\n`;
    if (tScores.E >= 61.5) {
      report +=
        "   ⚠️ 过高E分：需关注是否存在行为冲动、社交过度、注意力不集中等问题。\n";
    }
  } else if (tScores.E <= 43.3) {
    report += `   ${epqRscScales.E.lowDesc}\n`;
    if (tScores.E <= 38.5) {
      report += "   ⚠️ 过低E分：需关注是否存在社交回避、自信心不足等问题。\n";
    }
  } else {
    report +=
      "   您属于中间型，兼具内外向的特点，在社交场合既能活跃也能安静。\n";
  }
  report += "\n";

  // N量表（神经质）
  report += `2. 神经质（N量表）：${tScores.N}分（${getEPQRSCLevelDesc("N", tScores.N)}）\n`;
  report += `   原始分：${raw.N}/12\n`;
  if (tScores.N >= 56.7) {
    report += `   ${epqRscScales.N.highDesc}\n`;
    if (tScores.N >= 61.5) {
      report += "   ⚠️ 过高N分：需关注情绪管理能力，可能存在焦虑、抑郁倾向。\n";
    }
  } else if (tScores.N <= 43.3) {
    report += `   ${epqRscScales.N.lowDesc}\n`;
  } else {
    report +=
      "   您情绪稳定性中等，大多数时候能够保持平和，偶尔会有情绪波动。\n";
  }
  report += "\n";

  // P量表（精神质）
  report += `3. 精神质（P量表）：${tScores.P}分（${getEPQRSCLevelDesc("P", tScores.P)}）\n`;
  report += `   原始分：${raw.P}/12\n`;
  if (tScores.P >= 56.7) {
    report += `   ${epqRscScales.P.highDesc}\n`;
    if (tScores.P >= 61.5) {
      report += "   ⚠️ 过高P分：需关注人际关系和共情能力。\n";
    }
  } else if (tScores.P <= 43.3) {
    report += `   ${epqRscScales.P.lowDesc}\n`;
  } else {
    report +=
      "   您具有适度的精神质倾向，能够与人保持良好关系，同时保持独立思考。\n";
  }
  report += "\n";

  // 人格综合描述（E和N组合气质类型）
  report += "三、人格综合描述\n\n";

  if (tScores.E >= 56.7 && tScores.N <= 43.3) {
    report += "• 您属于多血质类型：外向、稳定、乐观、善于社交，情绪稳定。\n";
  } else if (tScores.E >= 56.7 && tScores.N >= 56.7) {
    report +=
      "• 您属于胆汁质类型：外向、不稳定、热情、易冲动，情绪波动较大。\n";
  } else if (tScores.E <= 43.3 && tScores.N <= 43.3) {
    report += "• 您属于粘液质类型：内向、稳定、安静、稳重，情绪平稳持久。\n";
  } else if (tScores.E <= 43.3 && tScores.N >= 56.7) {
    report += "• 您属于抑郁质类型：内向、不稳定、敏感、细腻，情绪体验深刻。\n";
  } else {
    report += "• 您属于混合型气质，在不同的情境下会表现出不同的人格特点。\n";
  }

  report += "\n四、应用建议\n\n";
  report += "• 了解自己的人格特点是自我成长的第一步\n";
  report += "• 发挥自己人格特质中的优势，接纳和完善不足\n";
  report += "• 在人际交往和工作学习中，找到适合自己性格的方式\n";

  if (tScores.N >= 56.7) {
    report += "• 建议学习情绪管理技巧，如正念冥想、深呼吸放松等\n";
  }
  if (tScores.P >= 56.7) {
    report += "• 建议多关注他人感受，培养共情能力和合作精神\n";
  }
  if (tScores.E <= 43.3) {
    report += "• 建议适当参与社交活动，逐步扩展人际关系\n";
  }

  report += "\n五、气质类型对应的典型特征\n\n";
  report += "┌─────────┬─────────────┬────────────────────────────┐\n";
  report += "│ 气质类型 │   E/N组合   │        主要特征           │\n";
  report += "├─────────┼─────────────┼────────────────────────────┤\n";
  report += "│ 多血质   │  外向+稳定  │ 活泼好动、善于交际、乐观  │\n";
  report += "├─────────┼─────────────┼────────────────────────────┤\n";
  report += "│ 胆汁质   │  外向+不稳  │ 热情直率、精力旺盛、易冲动│\n";
  report += "├─────────┼─────────────┼────────────────────────────┤\n";
  report += "│ 粘液质   │  内向+稳定  │ 安静稳重、耐心细致、自制力│\n";
  report += "├─────────┼─────────────┼────────────────────────────┤\n";
  report += "│ 抑郁质   │  内向+不稳  │ 敏感细腻、思考深入、情绪化│\n";
  report += "└─────────┴─────────────┴────────────────────────────┘\n";

  return report;
}
