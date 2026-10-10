// 匹兹堡睡眠质量指数（PSQI）· 计分
//
// 先把 18 个自评条目折算成 7 个成分（各 0-3 分），再求和得总分 0-21，分越高越差。
//   A 睡眠质量（C1）= Q6
//   B 入睡时间（C2）= 入睡用时（Q2）编码 + Q5a，合计 0-6 后按 0→0 / 1-2→1 / 3-4→2 / 5-6→3
//       Q2 编码：≤15 分钟=0、16-30=1、31-60=2、>60=3
//   C 睡眠时间（C3）= 实际睡眠时长（Q4）：>7 小时=0、6-7=1、5-6=2、<5=3
//   D 睡眠效率（C4）= 实际睡眠时长 ÷ 卧床时长 × 100%
//       卧床时长 = Q3 起床 - Q1 就寝（跨零点加 24 小时）；>85%=0、75-84%=1、65-74%=2、<65%=3
//   E 睡眠障碍（C5）= Q5b 至 Q5j 求和（0-27）：0→0、1-9→1、10-18→2、19-27→3
//       注意第 5 题的子项 a（入睡困难）已计入成分 B，不重复计入 E
//   F 催眠药物（C6）= Q7
//   G 日间功能障碍（C7）= Q8 + Q9（0-6）：0→0、1-2→1、3-4→2、5-6→3
//
// 判定：Buysse 等（1989）以总分 >5 判「睡眠质量差」（灵敏度 89.6%、特异度 86.5%）；
// 国内常用界值为 >7（刘贤臣等 1996）。本平台以 >5 为主判据，并在建议里同时说明
// 国内界值，因为两个界值对同一个人的结论可能不同。
//
// 说明：本平台把第 1-4 题做成滑块，取值一定有值；若卧床时长算出来 ≤0（例如就寝
// 与起床选了同一整点），成分 D 记 0 分并单独提示，避免除零。

import type { ScoringResult } from "../score";
import { psqiQuestions } from "../questions/psqi-questions";

function answerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 0,
): number {
  return answers[id] ?? fallback;
}

/** 条目 id 定位（按题库里的 code） */
function idOf(code: string): number {
  const q = psqiQuestions.find((x) => x.code === code);
  if (!q) throw new Error(`PSQI 题库缺少条目 ${code}`);
  return q.id;
}

export const PSQI_BEDTIME_ID = idOf("Q1");
export const PSQI_LATENCY_MINUTES_ID = idOf("Q2");
export const PSQI_RISETIME_ID = idOf("Q3");
export const PSQI_DURATION_ID = idOf("Q4");

/** 成分 A：主观睡眠质量 */
export const PSQI_QUALITY_ID = idOf("Q6");
/** 成分 E：夜间睡眠障碍（第 5 题的子项 b-j，共 9 题，0-27） */
export const PSQI_DISTURBANCE_IDS = [
  "Q5b", "Q5c", "Q5d", "Q5e", "Q5f", "Q5g", "Q5h", "Q5i", "Q5j",
].map(idOf);
/** 成分 F：催眠药物 */
export const PSQI_MEDICATION_ID = idOf("Q7");
/** 成分 G：日间功能障碍（Q8 + Q9） */
export const PSQI_DAYTIME_IDS = ["Q8", "Q9"].map(idOf);

/** 成分 B 的入睡用时编码：分钟 → 0-3 */
export function psqiLatencyCode(minutes: number): number {
  if (minutes <= 15) return 0;
  if (minutes <= 30) return 1;
  if (minutes <= 60) return 2;
  return 3;
}

/** 0-6 的合计分 → 0-3 的成成分分（成分 B、G 共用） */
export function psqiPairBand(sum: number): number {
  if (sum <= 0) return 0;
  if (sum <= 2) return 1;
  if (sum <= 4) return 2;
  return 3;
}

function band(value: number, cuts: number[]): number {
  for (let i = 0; i < cuts.length; i += 1) {
    if (value <= cuts[i]!) return i;
  }
  return cuts.length;
}

export const PSQI_POSITIVE_THRESHOLD = 6; // 总分 >5
export const PSQI_CHINESE_THRESHOLD = 8; // 国内常用 >7

export function scorePSQI(answers: Record<number, number>): ScoringResult {
  const bedtime = answerValue(answers, PSQI_BEDTIME_ID, 23);
  const rise = answerValue(answers, PSQI_RISETIME_ID, 7);
  const latencyMinutes = answerValue(answers, PSQI_LATENCY_MINUTES_ID, 30);
  const duration = answerValue(answers, PSQI_DURATION_ID, 0);
  const latencyDistress = answerValue(answers, idOf("Q5a"), 0);

  // 成分 A：睡眠质量
  const cA = answerValue(answers, PSQI_QUALITY_ID, 0);
  // 成分 B：入睡时间
  const cB = psqiPairBand(psqiLatencyCode(latencyMinutes) + latencyDistress);
  // 成分 C：睡眠时间
  const cC = duration > 7 ? 0 : duration >= 6 ? 1 : duration >= 5 ? 2 : 3;
  // 成分 D：睡眠效率
  const timeInBed = ((rise - bedtime + 24) % 24) || 0;
  const efficiency = timeInBed > 0 ? (duration / timeInBed) * 100 : 0;
  const cD = timeInBed <= 0 ? 0 : efficiency > 85 ? 0 : efficiency >= 75 ? 1 : efficiency >= 65 ? 2 : 3;
  // 成分 E：睡眠障碍
  const disturbance = PSQI_DISTURBANCE_IDS.reduce((s, id) => s + answerValue(answers, id, 0), 0);
  const cE = band(disturbance, [0, 9, 18]);
  // 成分 F：催眠药物
  const cF = answerValue(answers, PSQI_MEDICATION_ID, 0);
  // 成分 G：日间功能障碍
  const daytime = PSQI_DAYTIME_IDS.reduce((s, id) => s + answerValue(answers, id, 0), 0);
  const cG = psqiPairBand(daytime);

  const components = [cA, cB, cC, cD, cE, cF, cG];
  const totalScore = components.reduce((s, v) => s + v, 0);
  const maxScore = 21;

  const positive = totalScore >= PSQI_POSITIVE_THRESHOLD;
  const positiveChinese = totalScore >= PSQI_CHINESE_THRESHOLD;
  const level = positive ? "睡眠质量差（建议关注并进一步评估）" : "睡眠质量尚可";
  const severity = positive
    ? Math.min(0.95, 0.5 + ((totalScore - 6) / 15) * 0.45)
    : Math.max(0.05, (totalScore / maxScore) * 0.6);

  const tstText = duration > 0 ? duration + " 小时" : "未填写";
  const effText = timeInBed > 0 ? efficiency.toFixed(0) + "%" : "无法计算（卧床时长 ≤ 0）";

  const suggestion = "【匹兹堡睡眠质量指数（PSQI）】\n"
    + "总分：" + totalScore + " / " + maxScore + "（分越高睡眠质量越差）\n"
    + "七个成分（各 0-3 分）：\n"
    + "· A 睡眠质量：" + cA + "\n"
    + "· B 入睡时间：" + cB + "（入睡用时 " + latencyMinutes + " 分钟）\n"
    + "· C 睡眠时间：" + cC + "（实际睡眠 " + tstText + "）\n"
    + "· D 睡眠效率：" + cD + "（" + effText + "）\n"
    + "· E 睡眠障碍：" + cE + "（9 项合计 " + disturbance + " / 27）\n"
    + "· F 催眠药物：" + cF + "\n"
    + "· G 日间功能障碍：" + cG + "\n\n"
    + "参考判定：" + (positive
      ? "总分已超过 Buysse 等（1989）的界值（>5），提示睡眠质量偏差，建议进一步评估。"
      : "总分未超过 Buysse 等（1989）的界值（>5），本次筛查未提示明显的睡眠质量问题。")
    + (positiveChinese ? "" : " 国内研究常用 >7 作为界值，本结果距该界值更远，但两个界值不一致时以专业评估为准。") + "\n\n"
    + "【怎么读这个结果】\n"
    + "· PSQI 看的是最近一个月，偶尔一两晚睡不好不会把总分推高，得分高说明问题有一定的持续性。\n"
    + "· 成分 D（睡眠效率）是「实际睡着的时间 ÷ 躺在床上的时间」：在床上清醒的时间越长，这一项越差。固定起床时间、睡不着就起床做点安静的事，通常比硬躺更有效。\n"
    + "· 成分 F 只反映「用药物助眠的频率」，不代表用药是否合理；是否继续用药请与开药的医生讨论，不要自行停药。\n"
    + "· 睡眠问题常与焦虑、抑郁、疼痛、呼吸暂停（打鼾、憋醒）、咖啡因与酒精使用互相影响。若长期入睡困难、早醒或白天困倦到影响安全，建议到睡眠专科或精神科评估。\n"
    + "· 本结果仅供参考，不能替代睡眠监测或专业诊断。";

  return {
    totalScore,
    maxScore,
    level,
    suggestion,
    severity,
    dimensionScores: {
      type: "psqi",
      total: { name: "总分", score: totalScore, max: maxScore, desc: "七个成分之和，>5 提示睡眠质量差（Buysse 1989）。" },
      quality: { name: "A 睡眠质量", score: cA, max: 3, desc: "对整体睡眠质量的主观评价（Q6）。" },
      latency: { name: "B 入睡时间", score: cB, max: 3, desc: "入睡用时（" + latencyMinutes + " 分钟）与「难以入睡」频率的合计。" },
      duration: { name: "C 睡眠时间", score: cC, max: 3, desc: "每晚实际睡眠时长（" + tstText + "）。" },
      efficiency: { name: "D 睡眠效率", score: cD, max: 3, desc: "实际睡眠 ÷ 卧床时长（" + effText + "）。" },
      disturbance: { name: "E 睡眠障碍", score: cE, max: 3, desc: "夜间醒来、起夜、疼痛等 9 项干扰之和（" + disturbance + " / 27）。" },
      medication: { name: "F 催眠药物", score: cF, max: 3, desc: "借助药物入睡的频率（Q7）。" },
      daytime: { name: "G 日间功能障碍", score: cG, max: 3, desc: "白天困倦与精力不足的合计（Q8+Q9）。" },
    },
  };
}
