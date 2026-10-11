// 精神需求量表（SpNQ-20）· 计分
//
// 编制：Arndt Büssing（德国 Witten/Herdecke 大学）
// 定型版：Büssing A, Recchia DR, Koenig H, Baumann K, Frick E. Religions.
//   2018;9(1):13. doi:10.3390/rel9010013（开放获取）
// 权威综述：Büssing A. J Relig Health. 2021;60(5):3732-3748.
//   doi:10.1007/s10943-021-01421-4
// 官方站点与题本：https://www.spiritualneeds.net/
//
// 计分（官方口径）：每题 0-3 分（0 完全没有 / 1 有一点 / 2 比较强 / 3 非常强），
// 四个因子各自把所属题目**求和**：
//   内在平静需求 IPN（4 题）：0-12
//   存在需求     ExN（6 题）：0-18
//   给予需求     GGN（4 题）：0-12
//   宗教需求     RN （6 题）：0-18
// 20 题合计 0-60。官方另建议报告「SpNQ-20 总均值」（各题均值，0-3），
// 验证样本（n=2095）的均值为 1.01 ± 0.63、中位数 0.90。
//
// 关键：官方**没有总分切点、没有分档，也没有反向题**。因子得分只说明「哪一类的
// 精神需求在你身上更强」，不表示好坏、优劣或疾病程度。因此这里：
//   · 不输出「阳性 / 阴性」或「轻度 / 中度 / 重度」之类的判定；
//   · level 只报告得分最高的那个需求类别（并列时一并列出），属于描述而非结论；
//   · severity 仅用于结果页配色，取总均值在 0-3 上的相对高度，不会被读成病情轻重。
// 本量表在列表里归类为 personality，结果页因此不展示「严重程度」条。

import type { ScoringResult } from "../score";
import { spnqQuestions } from "../questions/spnq-questions";

function answerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 0,
): number {
  return answers[id] ?? fallback;
}

export const SPNQ_ITEM_COUNT = spnqQuestions.length;
/** 单题上限（0-3 四点） */
export const SPNQ_ITEM_MAX = 3;
/** 总均值上限，也就是单题上限 */
export const SPNQ_MEAN_MAX = 3;
/** 20 题求和的理论上限（也是官方 SpNQ-20 的合计满分） */
export const SPNQ_TOTAL_MAX = SPNQ_ITEM_MAX * SPNQ_ITEM_COUNT;

export interface SpNQSubscale {
  key: string;
  name: string;
  englishName: string;
  hint: string;
  items: number[];
}

/** 官方四因子（题号为题库里的连续编号 1-20） */
export const SPNQ_SUBSCALES: SpNQSubscale[] = [
  {
    key: "ipn",
    name: "内在平静需求",
    englishName: "Inner Peace Needs",
    hint: "想与人谈恐惧和担忧、亲近自然、待在安静之处、获得内心平静（第 1、3、4、5 题）",
    items: [1, 3, 4, 5],
  },
  {
    key: "exn",
    name: "存在需求",
    englishName: "Existential Needs",
    hint: "想理清人生中未解决的部分、在痛苦中寻找意义、谈人生意义与来世、原谅与被原谅（第 2、6、7、8、11、12 题）",
    items: [2, 6, 7, 8, 11, 12],
  },
  {
    key: "ggn",
    name: "给予需求",
    englishName: "Giving / Generativity Needs",
    hint: "想给予他人、安慰他人、传递自己的人生经验、确认人生有价值（第 9、10、19、20 题）",
    items: [9, 10, 19, 20],
  },
  {
    key: "rn",
    name: "宗教需求",
    englishName: "Religious Needs",
    hint: "与自己或他人一起祈祷、参加宗教仪式、读宗教或灵性书籍、转向更高的存在（第 13-18 题）",
    items: [13, 14, 15, 16, 17, 18],
  },
];

/** 某个因子的求和分 */
export function spnqSubscaleSum(
  answers: Record<number, number>,
  items: number[],
): number {
  return items.reduce((acc, id) => acc + answerValue(answers, id), 0);
}

/** 20 题的均值（0-3），即官方建议一并报告的 SpNQ-20 Mean Score */
export function spnqMean(answers: Record<number, number>): number {
  const sum = spnqQuestions.reduce((acc, q) => acc + answerValue(answers, q.id), 0);
  return sum / SPNQ_ITEM_COUNT;
}

/** 得分最高的因子（可能有并列）；用于结果的描述性标题 */
export function spnqTopNeeds(
  answers: Record<number, number>,
): { key: string; name: string; score: number; max: number }[] {
  const scored = SPNQ_SUBSCALES.map((sub) => ({
    key: sub.key,
    name: sub.name,
    score: spnqSubscaleSum(answers, sub.items),
    max: sub.items.length * SPNQ_ITEM_MAX,
  }));
  const top = Math.max(...scored.map((s) => s.score));
  return scored.filter((s) => s.score === top);
}

export function scoreSpNQ(answers: Record<number, number>): ScoringResult {
  const mean = spnqMean(answers);
  const average = Number(mean.toFixed(2));
  const totalSum = spnqQuestions.reduce((acc, q) => acc + answerValue(answers, q.id), 0);

  const tops = spnqTopNeeds(answers);
  // 描述性判定：只说明「哪一类需求相对更强」，不表示好坏。全 0 时改为中性表述。
  const highest = Math.max(...tops.map((t) => t.score));
  const level = highest === 0
    ? "暂未报告明显的精神需求"
    : "相对突出的需求：" + tops.map((t) => t.name).join("、");

  // 仅用于配色：总均值在 0-3 上的相对高度。
  const severity = Math.max(0.05, Math.min(0.95, mean / SPNQ_MEAN_MAX));

  // 各因子按均值从高到低排列，帮助读者直接看出优先次序
  const ranked = SPNQ_SUBSCALES
    .map((sub) => ({
      sub,
      sum: spnqSubscaleSum(answers, sub.items),
      max: sub.items.length * SPNQ_ITEM_MAX,
      avg: spnqSubscaleSum(answers, sub.items) / sub.items.length,
    }))
    .sort((a, b) => b.avg - a.avg);

  const rankLines = ranked
    .map((r) => "• " + r.sub.name + "（" + r.sub.englishName + "）："
      + r.sum + " / " + r.max + "，均值 " + r.avg.toFixed(2) + " / 3")
    .join("\n");

  const topLine = highest === 0
    ? "本次四个因子的得分都在最低档，没有相对突出的需求类别。"
    : "相对更强的是：" + tops.map((t) => t.name).join("、")
      + "。这只是说这一类需求在你身上更明显，不代表其他几类不重要。";

  const suggestion = "【精神需求量表（SpNQ-20）】\n"
    + "20 题合计：" + totalSum + " / " + SPNQ_TOTAL_MAX
    + "　总均值：" + average.toFixed(2) + " / 3（官方建议一并报告的 SpNQ-20 Mean Score）\n\n"
    + "【四个因子各自的得分】（按均值从高到低）\n"
    + rankLines + "\n"
    + topLine + "\n\n"
    + "【这个量表在问什么】\n"
    + "SpNQ 问的不是「你的精神生活好不好」，而是「你现在有哪些精神层面的需求」——想安静、想被人倾听、想弄清人生的意义、想给予和传递、想祈祷或参加仪式，都属于正常的人类需求。有需求不等于有问题。\n\n"
    + "【怎么读这个结果】\n"
    + "• 分数高只表示这类需求目前比较强烈，分数低也不代表「境界高」。不同处境下（生病、丧亲、换工作、退休、子女离家）各因子的高低本来就会变化。\n"
    + "• 官方没有给这个量表任何总分切点或严重程度分档，因此本页也不做「达标 / 不达标」这类判定。参考一下验证样本的位置：20 题的总均值平均约 1.01、中位数 0.90（最高 3 分），如果你明显高于这个水平，说明需求比较集中。\n"
    + "• 如果「内在平静需求」或「存在需求」偏高，通常提示需要留出安静的时间、或找可信任的人（朋友、家人、咨询师）把心里的问题谈开。\n"
    + "• 如果「宗教需求」偏高，说明信仰或仪式感对你有实际的支持作用，可以主动保留这部分生活；完全不高也完全正常，本量表本来就兼顾有信仰与无信仰的人。\n"
    + "• 如果「给予需求」偏高，说明照顾他人、传递经验对你有意义——也留意别因此把自己的休息挤掉。\n"
    + "• 需求长期得不到回应时，人容易感到孤独、空虚或疲惫。这种情况找人聊一聊会有帮助。\n"
    + "• 本结果仅供参考，不构成医学诊断或心理评估。";

  const dimensionScores: Record<string, any> = {
    type: "spnq",
    mean: {
      name: "总均值",
      score: average,
      max: SPNQ_MEAN_MAX,
      desc: "20 题的均值（0-3），官方建议一并报告的 SpNQ-20 Mean Score；验证样本均值约 1.01、中位数 0.90。",
    },
    total: {
      name: "需求合计",
      score: totalSum,
      max: SPNQ_TOTAL_MAX,
      desc: "20 题求和（0-60）。官方未提供总分切点，此处仅作汇总，不用于判定。",
    },
  };
  for (const sub of SPNQ_SUBSCALES) {
    dimensionScores[sub.key] = {
      name: sub.name,
      score: spnqSubscaleSum(answers, sub.items),
      max: sub.items.length * SPNQ_ITEM_MAX,
      desc: sub.hint + "（求和分，官方只按因子报告，无分档）",
    };
  }

  return {
    totalScore: totalSum,
    maxScore: SPNQ_TOTAL_MAX,
    scoreNote:
      "本量表按官方口径只做四因子的求和与总均值，没有总分切点、没有分档，也不做达标与否的判定。上面的合计分就是 20 题相加（满分 60）；官方建议一并参考总均值（0-3，验证样本约 1.01）。",
    level,
    suggestion,
    severity,
    dimensionScores,
  };
}
