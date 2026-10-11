// 高敏感特质量表修订版（HSP-R，18 题）· 计分
//
// 编制：Pluess M, Aron E, Kähkönen JE, Lionetti F, Huang Y, Tillmann T, Greven C,
// Aron A. Evolution of the Concept of Sensory Processing Sensitivity and its
// Measurement: The Highly Sensitive Person Scale-Revised. Personality and
// Individual Differences. 2026;257:113782. doi:10.1016/j.paid.2026.113782
// 预印本：https://osf.io/preprints/psyarxiv/w7bqu
// 官方题本与自测：https://hsperson.com/test/highly-sensitive-test/
// 量表总览与下载：https://sensitivityresearch.com/research/sensitivity-measures/
//
// 计分（官方口径，见官方自测 PDF 的「Instructions to Calculate the Results」）：
//   把实际作答的题目相加后取平均（分母为实际作答的题数）。官方只给出一条判断：
//   **平均分 > 5 提示具有高敏感倾向**。除此之外官方没有分档、没有切点，也明确
//   说明分数会随性别、年龄、文化背景等因素而不同，只表示敏感性连续谱上的大致
//   位置，不构成精确指标，更不是诊断。
//
// 本平台的题目全部必答，因此分母恒为 18。展示上把 totalScore / maxScore 定为
// 「平均分 / 7」，使结果页圆环比例与官方口径一致（题目和 / 126 = 平均分 / 7）。
//
// 六个分量表各只有 3 题，官方只说明它们用于「理解各方面对整体敏感性的贡献」，
// 既未给出分量表常模，也未给出分量表切点，因此结果里只作描述、不单独定级。
//
// 方向说明：本量表分数越高表示越敏感。高敏感（感觉加工敏感性）是中性的人格与
// 气质特质，不是障碍也不是缺点，因此不要沿用症状量表「分高＝问题严重」的读法。

import type { ScoringResult } from "../score";
import { hsprQuestions } from "../questions/hspr-questions";

function answerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 4,
): number {
  return answers[id] ?? fallback;
}

export const HSPR_ITEM_COUNT = hsprQuestions.length;
/** 官方判定线：平均分「严格大于」5 才算高敏感倾向（官方原文是 greater than 5） */
export const HSPR_THRESHOLD = 5;
/** 平均分的满分，也就是作答区间的上限（1-7 的单题、3 题与 18 题均值同为 7） */
export const HSPR_MEAN_MAX = 7;

export interface HSPRSubscale {
  key: string;
  name: string;
  hint: string;
  items: number[];
}

/** 官方题本给出的六个方面（各 3 题） */
export const HSPR_SUBSCALES: HSPRSubscale[] = [
  { key: "overstimulation", name: "过度唤起", hint: "被强烈或密集的刺激压得难受的程度（第 3、9、15 题）", items: [3, 9, 15] },
  { key: "positive", name: "积极体验敏感", hint: "对音乐、艺术与美好细节的深度投入（第 5、12、16 题）", items: [5, 12, 16] },
  { key: "social", name: "社交敏感", hint: "察觉并理解他人情绪的能力（第 4、8、11 题）", items: [4, 8, 11] },
  { key: "depth", name: "深度加工", hint: "倾向于深入思考与深谈（第 7、13、18 题）", items: [7, 13, 18] },
  { key: "reactivity", name: "情绪反应", hint: "对反馈、氛围与自身经历的反应强度（第 2、6、10 题）", items: [2, 6, 10] },
  { key: "details", name: "细节敏感", hint: "留意环境与季节中的细微变化（第 1、14、17 题）", items: [1, 14, 17] },
];

/** 18 题的平均分（1-7），即官方口径的「总分」 */
export function hsprMean(answers: Record<number, number>): number {
  const sum = hsprQuestions.reduce((acc, q) => acc + answerValue(answers, q.id), 0);
  return sum / HSPR_ITEM_COUNT;
}

/** 某个分量表（3 题）的平均分（1-7） */
export function hsprSubscaleMean(
  answers: Record<number, number>,
  items: number[],
): number {
  const sum = items.reduce((acc, id) => acc + answerValue(answers, id), 0);
  return sum / items.length;
}

export function scoreHSPR(answers: Record<number, number>): ScoringResult {
  const mean = hsprMean(answers);
  const average = Number(mean.toFixed(2));
  const isHigh = mean > HSPR_THRESHOLD;
  const level = isHigh ? "高敏感倾向" : "未显示高敏感倾向";

  // 仅用于配色：取平均分在 1-7 上的相对高度。本量表属人格/气质特质，结果页
  // 不展示「严重程度」条（见 result.vue 的 canScore 白名单），因此这个数值
  // 不会被读成病情轻重。
  const severity = Math.max(0.05, Math.min(0.95, mean / HSPR_MEAN_MAX));

  const subLines = HSPR_SUBSCALES.map((sub) => {
    const v = hsprSubscaleMean(answers, sub.items);
    return "• " + sub.name + "：" + v.toFixed(2) + " —— " + sub.hint;
  }).join("\n");

  const suggestion = "【高敏感特质量表修订版（HSP-R）】\n"
    + "平均分：" + average.toFixed(2) + " / 7（18 题相加后除以题数，官方口径）\n"
    + "本次判定：" + level + "\n\n"
    + "【官方怎么判定】\n"
    + "官方只给出一条标准：18 题的平均分 > 5 提示具有高敏感倾向。除此之外没有分档，也不提供「多少分算轻度、多少分算中度」。官方同时说明：分数会随性别、年龄、文化背景等因素而不同，只表示你在敏感性连续谱上的大致位置，不是精确指标，更不是诊断。\n\n"
    + "【六个方面各自的贡献】（各 3 题均值，仅作描述）\n"
    + subLines + "\n"
    + "这六个方面各只有 3 道题，官方只说明它们帮你看清整体敏感性主要由哪些方面构成，既没有分量表常模也没有分量表切点，请不要单独拿某一项给自己下定论。\n\n"
    + "【怎么读这个结果】\n"
    + "• 高敏感指的是感觉加工敏感性（Sensory Processing Sensitivity）：这类人对内外刺激的加工更深、反应更强，大约每 5 个人里有 1 个。它是一种中性的人格与气质特质，不是障碍，也不是缺点。\n"
    + "• 敏感同时带来代价与优势：一方面容易被人多、噪音、强光、日程过密压垮；另一方面也意味着观察细致、共情力强、对音乐艺术与美好细节的感受更深。\n"
    + "• 研究提示的规律是「环境放大」：处在支持性的环境里，高敏感者的心理状态可能好于一般水平；长期处在高压、充满敌意或被忽视的环境里，则更容易出现焦虑、抑郁与耗竭。所以关键往往不在于「我敏不敏感」，而在于「我的生活能不能留出缓冲」。\n"
    + "• 可以做的：把刺激量当成预算来管理（重要社交或高强度工作之后留出独处恢复的时间）、减少同时进行的任务、给自己留一个安静的角落、把「我需要先安静一下」直接说出来而不是硬撑。\n"
    + "• 如果长期因为敏感而感到疲惫、失眠、情绪低落或难以工作，建议找心理咨询师谈一谈——这是可以一起调整的议题。\n"
    + "• 本结果仅供参考，不能替代专业评估或诊断。";

  const dimensionScores: Record<string, any> = {
    type: "hspr",
    total: {
      name: "总体敏感度（平均分）",
      score: average,
      max: HSPR_MEAN_MAX,
      level,
      desc: "18 题的平均分（1-7）；官方判定为平均分 > 5 提示高敏感倾向。",
    },
  };
  for (const sub of HSPR_SUBSCALES) {
    dimensionScores[sub.key] = {
      name: sub.name,
      score: Number(hsprSubscaleMean(answers, sub.items).toFixed(2)),
      max: HSPR_MEAN_MAX,
      desc: sub.hint + "（3 题均值，仅作描述，不单独定级）",
    };
  }

  return {
    totalScore: average,
    maxScore: HSPR_MEAN_MAX,
    scoreNote:
      "本量表按官方口径以平均分判定：18 题相加后除以题数，平均分 > 5 提示高敏感倾向。上面的分数就是这个平均分（满分 7），不是各题相加的和。",
    level,
    suggestion,
    severity,
    dimensionScores,
  };
}
