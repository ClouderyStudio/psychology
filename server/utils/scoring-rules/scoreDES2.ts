// DES-II 解离经验量表（28 题，0-100 滑块）· 计分
import type { ScoringResult } from "../score";

// 子量表（各 6 题，均取平均，0-100）
const SUBSCALES: Array<{ key: string; name: string; items: number[]; desc: string }> = [
  { key: 'amnesia', name: '记忆缺失 (Amnesia)', items: [3,4,5,8,25,26], desc: '与解离性失忆相关：对日常事件出现片段性遗忘或记忆空白。' },
  { key: 'dpdr', name: '人格/现实解体 (DP/DR)', items: [7,11,12,13,27,28], desc: '自我脱离、像在旁观自己，或外界不真实、像隔着一层。' },
  { key: 'absorption', name: '吸收沉浸 (Absorption)', items: [2,14,15,17,18,20], desc: '在想象、音乐或活动中深度投入与沉浸；单独偏高常属非病理性。' },
];

function getAnswerValue(answers: Record<number, number>, id: number, fallback = 0): number {
  return answers[id] ?? fallback;
}

// 参照 NovoPsych(2024) 的分档：0-11低 / 12-19轻度 / 20-29中度 / 30-45高 / >=46显著
function band(pct: number) {
  if (pct <= 11) return { level: "低", range: "0–11" };
  if (pct <= 19) return { level: "轻度", range: "12–19" };
  if (pct <= 29) return { level: "中度", range: "20–29" };
  if (pct <= 45) return { level: "高", range: "30–45" };
  return { level: "显著解离倾向", range: "≥46" };
}

export function scoreDES2(answers: Record<number, number>): ScoringResult {
  let sum = 0;
  for (let i = 1; i <= 28; i++) sum += getAnswerValue(answers, i);
  const avg = Math.round((sum / 28) * 10) / 10; // 总分 = 28 题均值（0-100，1位小数）

  const dims: Record<string, any> = {};
  for (const s of SUBSCALES) {
    let ssum = 0;
    for (const it of s.items) ssum += getAnswerValue(answers, it);
    const savg = Math.round((ssum / s.items.length) * 10) / 10;
    const b = band(savg);
    dims[s.key] = {
      name: s.name,
      score: savg,
      max: 100,
      level: b.level + "（" + b.range + "）",
      desc: s.desc,
    };
  }

  const { level, range } = band(avg);
  const amn = dims.amnesia.score, dp = dims.dpdr.score, abs = dims.absorption.score;
  let note = "三子量表中，记忆缺失与人格/现实解体偏高更提示病理性解离；吸收沉浸单独偏高常属正常的沉浸/心流体验。";
  const suggestion = "【DES-II 解离经验量表】总分 " + avg.toFixed(1) + " / 100（28题均值）\n"
    + "参考等级：" + level + "（" + range + "）。0-11普通、12-19轻度、20-29中度、30-45高、>=46显著解离倾向 \n"
    + "• 记忆缺失 " + amn.toFixed(1) + " · 人格/现实解体 " + dp.toFixed(1) + " · 吸收沉浸 " + abs.toFixed(1) + "\n\n"
    + "参考说明：0-100 表示该体验出现的时间比例，分数越高越频繁。分档用于筛查与研究，不同研究阈值略有差异，需结合主观痛苦与功能受损综合判断，不能直接等同临床诊断。\n"
    + "注意：若正处于主动性想象训练，或已确诊多意识体体系（DID/OSDD 等），本量表部分题目即为你日常体验，结果可能部分失真，请结合自身实际多方面评估。\n\n"
    + "本量表仅用于教育与自我筛查。若分数较高且伴随明显解离、失忆或人格/现实解体体验，请及时寻求精神科或临床心理的专业评估。";

  return {
    totalScore: avg,
    maxScore: 100,
    level,
    suggestion,
    severity: Math.round((avg / 100) * 1000) / 1000,
    dimensionScores: { type: "des2", ...dims },
  };
}
