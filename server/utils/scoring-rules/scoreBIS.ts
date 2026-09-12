// BIS-11 Barratt 冲动性量表（30 题，5 级）· 计分
import type { ScoringResult } from "../score";
import { bisQuestions } from "../questions/bis-questions";

function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 1,
): number {
  return answers[id] ?? fallback;
}

const RAW_MIN = 1;
const RAW_MAX = 5;
const ITEM_TOTAL = bisQuestions.length;
const REVERSE_TOTAL = bisQuestions.filter((q) => q.reverse).length;

// 反向题会把总分范围压窄：全选最低档时，反向题反而拿到满分。
// 因此「可达区间」必须由题库实际构成推导，不能沿用理论满分 150。
// 30 题中 11 题为反向计分：全选 1 → 19×1 + 11×5 = 74；全选 5 → 19×5 + 11×1 = 106。
const FORWARD_TOTAL = ITEM_TOTAL - REVERSE_TOTAL;
export const BIS_REACHABLE_MIN = FORWARD_TOTAL * RAW_MIN + REVERSE_TOTAL * RAW_MAX;
export const BIS_REACHABLE_MAX = FORWARD_TOTAL * RAW_MAX + REVERSE_TOTAL * RAW_MIN;
/** 理论满分：只在不含任何反向题时才能达到，仅用于说明，不作为分母 */
export const BIS_THEORETICAL_MAX = ITEM_TOTAL * RAW_MAX;
export { REVERSE_TOTAL as BIS_REVERSE_TOTAL };

const SPAN = BIS_REACHABLE_MAX - BIS_REACHABLE_MIN;

/** 总分在可达区间中的相对位置（0 = 最不冲动，1 = 最冲动） */
export function bisPosition(total: number): number {
  if (SPAN <= 0) return 0;
  return Math.min(1, Math.max(0, (total - BIS_REACHABLE_MIN) / SPAN));
}

// 分档切点 = 可达区间的四等分：74–81 低 / 82–89 中等偏低 / 90–97 中等偏高 / 98–106 高。
// BIS-11 没有公认的临床切分点（文献常见 ≥72、或各维度 T 分 ≥65），原实现的
// 60/76/90 是按理论满分 150 设的，而最低可能分就已经是 74 —— 结果是「低冲动
// 倾向」这一档永远无法达到，一个从不冲动的人也会被算成「中等冲动倾向」。
const CUT_LOW = BIS_REACHABLE_MIN + SPAN * 0.25;
const CUT_MID = BIS_REACHABLE_MIN + SPAN * 0.5;
const CUT_HIGH = BIS_REACHABLE_MIN + SPAN * 0.75;

const RANGE_NOTE = [
  `本量表 ${ITEM_TOTAL} 题中 ${REVERSE_TOTAL} 题为反向计分。反向题会把总分范围压窄：`,
  `最低可能分为 ${BIS_REACHABLE_MIN}（${FORWARD_TOTAL} 道正向题选最低档、${REVERSE_TOTAL} 道反向题选最高档），`,
  `最高为 ${BIS_REACHABLE_MAX}；理论满分 ${BIS_THEORETICAL_MAX} 只有在全部题目同为正向计分时才能达到。`,
  `下面的分档即按可达区间 ${BIS_REACHABLE_MIN}–${BIS_REACHABLE_MAX} 四等分，四档都可达。`,
].join("");

/** 各维度的可达上下限（同样受反向题数量影响） */
function dimBounds(dimension: string): { min: number; max: number; count: number } {
  const qs = bisQuestions.filter((q) => q.dimension === dimension);
  const rev = qs.filter((q) => q.reverse).length;
  return {
    min: (qs.length - rev) * RAW_MIN + rev * RAW_MAX,
    max: (qs.length - rev) * RAW_MAX + rev * RAW_MIN,
    count: qs.length,
  };
}

function dimLine(label: string, hint: string, score: number, b: { min: number; max: number }) {
  return `• ${label}：${score}（可达 ${b.min}–${b.max}）—— ${hint}`;
}

export function scoreBIS(answers: Record<number, number>): ScoringResult {
  let totalScore = 0;
  let attention = 0;
  let motor = 0;
  let nonplanning = 0;

  for (const q of bisQuestions) {
    const raw = getAnswerValue(answers, q.id, RAW_MIN); // 默认 1=最低分
    const scored = q.reverse ? RAW_MAX + RAW_MIN - raw : raw;
    totalScore += scored;
    if (q.dimension === "attentional") attention += scored;
    else if (q.dimension === "motor") motor += scored;
    else if (q.dimension === "nonplanning") nonplanning += scored;
  }

  const aB = dimBounds("attentional");
  const mB = dimBounds("motor");
  const nB = dimBounds("nonplanning");
  const dims = [
    dimLine("注意力冲动", "注意力难以维持、易分心走神", attention, aB),
    dimLine("运动冲动", "行动迅速、难克制即时行为", motor, mB),
    dimLine("无计划冲动", "缺乏长远规划、冲动决策、临时变卦", nonplanning, nB),
  ].join("\n");

  const severity = bisPosition(totalScore);

  let level = "";
  let suggestion = "";

  if (totalScore >= CUT_HIGH) {
    level = "高冲动倾向";
    suggestion = `您的 BIS-11 总分为 ${totalScore}（可达区间 ${BIS_REACHABLE_MIN}–${BIS_REACHABLE_MAX}），冲动倾向在本次作答中处于最高一档。

【三维度表现】
${dims}

【建议】
• 冲动倾向可能让您更易卷入冲动行为、决策后悔或人际冲突
• 学习"停一停"技术——任何重要决定至少推迟 24 小时
• 记录冲动诱因，识别触发点；规律运动、正念练习对降低反应性冲动有较好帮助
• 如冲动行为已造成明显后果（财务损失、关系破裂、冲动攻击等），建议寻求专业心理咨询或精神科评估`;
  } else if (totalScore >= CUT_MID) {
    level = "中等偏高冲动倾向";
    suggestion = `您的 BIS-11 总分为 ${totalScore}（可达区间 ${BIS_REACHABLE_MIN}–${BIS_REACHABLE_MAX}），冲动倾向高于中间位置。

【三维度表现】
${dims}

【建议】
• 较易出现"先做后想"或决策后悔的情况
• 尝试在冲动时延后反应（深呼吸 6 秒、数 10 下）
• 培养计划习惯：写下来要做的事、列决策清单
• 保持规律睡眠与运动，可明显改善注意力和情绪调节`;
  } else if (totalScore >= CUT_LOW) {
    level = "中等偏低冲动倾向";
    suggestion = `您的 BIS-11 总分为 ${totalScore}（可达区间 ${BIS_REACHABLE_MIN}–${BIS_REACHABLE_MAX}），冲动倾向低于中间位置。

【三维度表现】
${dims}

【说明】
• 多数人在某些维度上有轻度冲动倾向属于正常现象
• 您可以根据各维度分数判断自己最容易在哪类情境下"冲"出来

【建议】
• 保持稳定的作息和决策节奏
• 在感觉自己冲动时主动退一步，效果会很明显`;
  } else {
    level = "低冲动倾向";
    suggestion = `您的 BIS-11 总分为 ${totalScore}（可达区间 ${BIS_REACHABLE_MIN}–${BIS_REACHABLE_MAX}），冲动倾向在本次作答中处于最低一档。

【三维度表现】
${dims}

【说明】
• 您通常能在决策前思考、在行动前停顿，这是宝贵的心理资源
• 继续关注各维度均衡即可`;
  }

  return {
    totalScore,
    maxScore: BIS_REACHABLE_MAX,
    minScore: BIS_REACHABLE_MIN,
    scoreNote: RANGE_NOTE,
    level,
    suggestion,
    severity,
    dimensionScores: {
      attention: { name: "注意力冲动", score: attention, max: aB.max, min: aB.min, count: aB.count },
      motor: { name: "运动冲动", score: motor, max: mB.max, min: mB.min, count: mB.count },
      nonplanning: { name: "无计划冲动", score: nonplanning, max: nB.max, min: nB.min, count: nB.count },
    },
  };
}
