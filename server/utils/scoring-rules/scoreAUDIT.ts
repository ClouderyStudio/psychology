// 酒精使用障碍筛查量表（AUDIT，10 题，0-40）· 计分
//
// 计分：第 1-8 题 0/1/2/3/4，第 9、10 题 0/2/4（分值已写在题库选项里，
// 这里直接累加作答值）。
//
// 界值：WHO 的四区带是正式表述——
//   Zone I  0-7   健康教育
//   Zone II 8-15  简单建议
//   Zone III 16-19 简单建议 + 简短咨询与持续监测
//   Zone IV 20-40 转诊专科评估
// auditscreen.org 另给「1-7 低风险 / 8-14 危险或有害 / ≥15 很可能依赖」的
// 二分三分法，是本平台上采用的分档；中文版的界值本身尚无统一结论（系统回顾
// 显示国内研究取 7-13 分不等），因此分界值只作参考，不做定论式表述。

import type { ScoringResult } from "../score";
import { auditQuestions } from "../questions/audit-questions";

function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 0,
): number {
  return answers[id] ?? fallback;
}

/** 危险饮酒（第 1-3 题） */
export const AUDIT_HAZARDOUS_ITEMS = [1, 2, 3];
/** 依赖症状（第 4-6 题） */
export const AUDIT_DEPENDENCE_ITEMS = [4, 5, 6];
/** 有害饮酒（第 7-10 题） */
export const AUDIT_HARMFUL_ITEMS = [7, 8, 9, 10];

function sumItems(answers: Record<number, number>, ids: number[]): number {
  return ids.reduce((sum, id) => sum + getAnswerValue(answers, id, 0), 0);
}

/** 每题的满分量（第 9、10 题是 0/2/4，满分 4；其余满分 4） */
const MAX_PER_ITEM = auditQuestions.map((q) => Math.max(...q.options.map((o) => o.value)));
const AUDIT_MAX = MAX_PER_ITEM.reduce((a, b) => a + b, 0);

export function scoreAUDIT(answers: Record<number, number>): ScoringResult {
  let totalScore = 0;
  for (const q of auditQuestions) totalScore += getAnswerValue(answers, q.id, 0);
  const maxScore = AUDIT_MAX;

  const hazardous = sumItems(answers, AUDIT_HAZARDOUS_ITEMS);
  const dependence = sumItems(answers, AUDIT_DEPENDENCE_ITEMS);
  const harmful = sumItems(answers, AUDIT_HARMFUL_ITEMS);

  let level = "";
  let suggestion = "";
  let severity = 0;

  if (totalScore >= 20) {
    level = "高风险的饮酒模式（建议专科评估）";
    severity = Math.min(0.95, 0.75 + ((totalScore - 20) / 20) * 0.2);
    suggestion = "您的 AUDIT 总分为 " + totalScore + "/" + maxScore + "，落在 WHO 手册的最高区带（Zone IV）。\n\n"
      + "【说明】\n"
      + "• 这一区带提示很可能已存在酒精依赖或与其相当的饮酒问题，通常需要专业人员做系统评估\n"
      + "• 自行突然停酒在某些情况下可能不安全，若平时饮酒量大，请先咨询医生\n\n"
      + "【建议】\n"
      + "• 建议到精神科、成瘾医学或心理科就诊，做一次完整的评估\n"
      + "• 记录一周的饮酒量、时间与场合，就诊时带给医生\n"
      + "• 避免用酒精缓解失眠、焦虑或情绪低落，这会让问题互相加重";
  } else if (totalScore >= 16) {
    level = "危险饮酒（建议简短干预）";
    severity = 0.6;
    suggestion = "您的 AUDIT 总分为 " + totalScore + "/" + maxScore + "，位于 WHO 手册的 Zone III。\n\n"
      + "【说明】\n"
      + "• 饮酒已在健康、关系或工作学业上造成可观察到的影响\n"
      + "• 这是干预效果最好的阶段，及时调整通常能避免问题继续发展\n\n"
      + "【建议】\n"
      + "• 给自己设定明确的上限（如每周饮酒天数与每次杯数），并记录下来\n"
      + "• 尝试每周有几天完全不饮酒，观察睡眠与情绪的变化\n"
      + "• 如果自己减不下来，可寻求成瘾医学或心理科医生的简短咨询";
  } else if (totalScore >= 8) {
    level = "危险或有害饮酒（建议留意）";
    severity = 0.35;
    suggestion = "您的 AUDIT 总分为 " + totalScore + "/" + maxScore + "，达到 WHO 的 Zone II，提示饮酒已存在风险。\n\n"
      + "【说明】\n"
      + "• 尚未构成依赖，但饮酒方式（一次大量、频率偏高）会带来可累积的伤害\n"
      + "• 中文版界值在不同研究中取值 7-13 分不等，8 分是较常采用的一个起点\n\n"
      + "【建议】\n"
      + "• 减少单次饮酒量，避免空腹饮酒与「一次喝很多」的场合\n"
      + "• 了解自己的标准杯换算：约等于啤酒 250 ml、葡萄酒 100 ml、白酒 25 ml\n"
      + "• 若发现自己越来越难控制在预想的量，建议做一次专业评估";
  } else {
    level = totalScore === 0 ? "未见饮酒风险" : "低风险饮酒";
    severity = Math.max(0.05, (totalScore / maxScore) * 0.4);
    suggestion = "您的 AUDIT 总分为 " + totalScore + "/" + maxScore + "，处于 WHO 的 Zone I，暂未提示饮酒相关问题。\n\n"
      + "【说明】\n"
      + "• 这一档的建议是保持健康教育式的关注\n"
      + "• AUDIT 问的是过去一年的典型情况，短期内的变化不一定被反映\n\n"
      + "【建议】\n"
      + "• 保持现有的饮酒习惯，注意不空腹饮酒、不酒后驾车\n"
      + "• 如果近期饮酒量明显增加，或家人朋友开始表达担心，可以重新做一次";
  }

  const suggestionFull = suggestion + "\n\n"
    + "【分量表（按 Saunders 1993 的概念划分）】\n"
    + "• 危险饮酒（第 1-3 题）" + hazardous + " / 12\n"
    + "• 依赖症状（第 4-6 题）" + dependence + " / 12\n"
    + "• 有害饮酒（第 7-10 题）" + harmful + " / 16\n\n"
    + "AUDIT 是筛查工具，不是诊断：分数高低反映的是饮酒相关风险的高低，最终判断需要专业人员结合实际情况做出。";

  return {
    totalScore,
    maxScore,
    level,
    suggestion: suggestionFull,
    severity,
    dimensionScores: {
      type: "audit",
      total: { name: "AUDIT 总分", score: totalScore, max: maxScore, level, desc: "≥8 提示危险或有害饮酒。" },
      hazardous: { name: "危险饮酒", score: hazardous, max: 12, desc: "饮酒频率、单次饮酒量与大量饮酒（第 1-3 题）。" },
      dependence: { name: "依赖症状", score: dependence, max: 12, desc: "失控、失职与晨起饮酒（第 4-6 题）。" },
      harmful: { name: "有害饮酒", score: harmful, max: 16, desc: "内疚、遗忘、受伤与他人担忧（第 7-10 题）。" },
    },
  };
}
