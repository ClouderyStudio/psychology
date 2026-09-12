// DES-II 解离经验量表（28 题，0-100 滑块）· 计分
import type { ScoringResult } from "../score";
import { des2Questions, type DES2Dimension } from "../questions/des2-questions";

// 子量表（三因子覆盖全部 28 题，成员由题库推导，见 des2-questions.ts 的判定依据）
const SUBSCALE_META: Array<{ key: DES2Dimension; name: string; desc: string }> = [
  {
    key: "amnesia",
    name: "记忆缺失 (Amnesia)",
    desc: "对日常事件出现片段性遗忘或记忆空白：不记得走过的路、说过的话、做过的事。",
  },
  {
    key: "dpdr",
    name: "人格/现实解体 (DP/DR)",
    desc: "自我脱离、像在旁观自己，或外界不真实、像隔着一层。",
  },
  {
    key: "absorption",
    name: "吸收沉浸 (Absorption)",
    desc: "在想象、音乐或活动中深度投入与沉浸；单独偏高常属非病理性。",
  },
];

export const DES2_SUBSCALES = SUBSCALE_META.map((m) => ({
  ...m,
  items: des2Questions.filter((q) => q.dimension === m.key).map((q) => q.id),
}));

function getAnswerValue(answers: Record<number, number>, id: number, fallback = 0): number {
  return answers[id] ?? fallback;
}

// 参照 NovoPsych(2024) 的分档：0-11低 / 12-19轻度 / 20-29中度 / 30-45高 / >=46显著
// 注意：这套分档是给**总分**用的（DES-II 只有总分有公开常模），子量表沿用同一
// 套区间只是为了给读者一个数量级参照，不是各自独立的常模；因此子量表的等级
// 不再套用总分档位的"解离倾向"字样，避免把分量表数值读成整体的临床结论。
const BANDS = [
  { max: 11, range: "0–11" },
  { max: 19, range: "12–19" },
  { max: 29, range: "20–29" },
  { max: 45, range: "30–45" },
  { max: Infinity, range: "≥46" },
];
const TOTAL_LEVELS = ["低", "轻度", "中度", "高", "显著解离倾向"];
const SUBSCALE_LEVELS = ["低", "轻度", "中度", "高", "显著"];

function bandIndex(pct: number): number {
  const i = BANDS.findIndex((b) => pct <= b.max);
  return i === -1 ? BANDS.length - 1 : i;
}

function band(pct: number, kind: "total" | "subscale" = "total") {
  const i = bandIndex(pct);
  const levels = kind === "total" ? TOTAL_LEVELS : SUBSCALE_LEVELS;
  return { level: levels[i]!, range: BANDS[i]!.range, index: i };
}

export function scoreDES2(answers: Record<number, number>): ScoringResult {
  let sum = 0;
  for (let i = 1; i <= 28; i++) sum += getAnswerValue(answers, i);
  const avg = Math.round((sum / 28) * 10) / 10; // 总分 = 28 题均值（0-100，1位小数）

  const dims: Record<string, any> = {};
  for (const s of DES2_SUBSCALES) {
    let ssum = 0;
    for (const it of s.items) ssum += getAnswerValue(answers, it);
    const savg = Math.round((ssum / s.items.length) * 10) / 10;
    const b = band(savg, "subscale");
    dims[s.key] = {
      name: s.name,
      score: savg,
      max: 100,
      itemCount: s.items.length,
      items: s.items,
      level: b.level + "（" + b.range + "，沿用总分区间）",
      desc: s.desc,
    };
  }

  const { level, range } = band(avg);
  const amn = dims.amnesia.score, dp = dims.dpdr.score, abs = dims.absorption.score;
  const suggestion = "【DES-II 解离经验量表】总分 " + avg.toFixed(1) + " / 100（28题均值）\n"
    + "参考等级：" + level + "（" + range + "）。0-11普通、12-19轻度、20-29中度、30-45高、>=46显著解离倾向 \n"
    + "• 记忆缺失 " + amn.toFixed(1) + " · 人格/现实解体 " + dp.toFixed(1) + " · 吸收沉浸 " + abs.toFixed(1) + "\n"
    + "  子量表题数：" + DES2_SUBSCALES.map((s) => s.name.split(" ")[0] + " " + s.items.length + " 题").join(" · ") + "，覆盖全部 28 题\n\n"
    + "参考说明：0-100 表示该体验出现的时间比例，分数越高越频繁。分档用于筛查与研究，不同研究阈值略有差异，需结合主观痛苦与功能受损综合判断，不能直接等同临床诊断。\n"
    + "分量表说明：有公开常模的只有总分；三个因子分是这套中文条目按构念的归类（原版 DES-II 的因子分组按原版题号定义，与本表题号不对应），只能用于比较本次作答内部三者的相对高低，不能与文献中的分量表数值直接比较。\n"
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
