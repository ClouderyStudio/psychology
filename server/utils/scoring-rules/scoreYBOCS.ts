// Y-BOCS 耶鲁-布朗强迫量表（10 题，0-4 求和）· 计分
import type { ScoringResult } from "../score";

// 条目 1-5 强迫思维、6-10 强迫行为，各 0-20
const OBSESSIONS = [1,2,3,4,5];
const COMPULSIONS = [6,7,8,9,10];

function getAnswerValue(answers: Record<number, number>, id: number, fallback = 0): number {
  return answers[id] ?? fallback;
}

// 总分 0-40：0-7 亚临床 / 8-15 轻度 / 16-23 中度 / 24-31 重度 / 32-40 极重度
function band(total: number) {
  if (total <= 7) return { level: "亚临床", range: "0–7" };
  if (total <= 15) return { level: "轻度", range: "8–15" };
  if (total <= 23) return { level: "中度", range: "16–23" };
  if (total <= 31) return { level: "重度", range: "24–31" };
  return { level: "极重度", range: "32–40" };
}

export function scoreYBOCS(answers: Record<number, number>): ScoringResult {
  let total = 0;
  for (let i = 1; i <= 10; i++) total += getAnswerValue(answers, i);
  let ob = 0;
  for (const it of OBSESSIONS) ob += getAnswerValue(answers, it);
  let co = 0;
  for (const it of COMPULSIONS) co += getAnswerValue(answers, it);

  const { level, range } = band(total);
  const dims: Record<string, any> = {
    obsessions: {
      name: "强迫思维（条目1-5）",
      score: ob,
      max: 20,
      level: "",
      desc: "评估强迫思维的时间、干扰、痛苦、抵抗与控制（0-20）。",
    },
    compulsions: {
      name: "强迫行为（条目6-10）",
      score: co,
      max: 20,
      level: "",
      desc: "评估强迫行为的时间、干扰、痛苦、抵抗与控制（0-20）。",
    },
  };

  const suggestion = "【Y-BOCS 耶鲁-布朗强迫量表】总分 " + total + " / 40（10 题求和，0-4 分/题）\n"
    + "参考等级：" + level + "（" + range + "）。0-7 亚临床、8-15 轻度、16-23 中度、24-31 重度、32-40 极重度\n"
    + "• 强迫思维子量表 " + ob + " / 20 · 强迫行为子量表 " + co + " / 20\n\n"
    + "参考说明：Y-BOCS 由 Goodman 等 1989 年编制（Goodman/Price/Rasmussen），是衡量强迫症状严重程度的国际金标准之一。原版为半结构化访谈量表，本在线版为自评简化版（0-4 各条锚点已简化为通用选项），仅供筛查参考，分数不能直接等同于临床访谈结论。\n"
    + "注意：总分主要反映严重程度，不依赖具体症状内容；若分档较高或症状明显影响生活与功能，请及时寻求精神科或临床心理专业评估。\n\n"
    + "本量表仅用于教育与自我筛查，不构成临床诊断。";

  return {
    totalScore: total,
    maxScore: 40,
    level,
    suggestion,
    severity: Math.round((total / 40) * 1000) / 1000,
    dimensionScores: { type: "ybocs", ...dims },
  };
}
