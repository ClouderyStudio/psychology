// 亲密关系经历量表修订版（ECR-R，36 题）· 计分
//
// 计分：每题 1-7；反向题按 score = 8 - 原作答；分量表分 = 该 18 题的均值（1-7）。
// 反向题（官方勘误版）：焦虑 9、11；回避 20、22、26、27、28、29、30、31、33、
// 34、35、36。第 21 题不反向。
//
// 关于「四类依恋型」：原作者 Fraley 明确反对把人硬分成四类（「没有所谓天然或
// 正确的归类方式」），分类必须依赖样本的中位数切分，固定用 4 分作截断属常见但
// 非官方的做法。本平台仍给出四个方向的描述（因为用户需要可读的结果），但明确
// 标注它只是按「两个维度各自与量表中点 4 相比的高低」得到的倾向，不是官方
// 分类，也不应被当作固定的人格标签。

import type { ScoringResult } from "../score";
import { ecrrQuestions } from "../questions/ecrr-questions";

function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 4,
): number {
  return answers[id] ?? fallback;
}

/** 反向计分：score = 8 - 原作答 */
export function ecrrReverseScore(raw: number): number {
  return 8 - raw;
}

export const ECRR_ANXIETY_ITEMS = ecrrQuestions
  .filter((q) => q.dimension === "anxiety")
  .map((q) => q.id);
export const ECRR_AVOIDANCE_ITEMS = ecrrQuestions
  .filter((q) => q.dimension === "avoidance")
  .map((q) => q.id);
export const ECRR_REVERSE_ITEMS = ecrrQuestions
  .filter((q) => q.reverse)
  .map((q) => q.id);

function dimensionMean(
  answers: Record<number, number>,
  ids: number[],
): number {
  const sum = ids.reduce((acc, id) => {
    const q = ecrrQuestions.find((x) => x.id === id)!;
    const raw = getAnswerValue(answers, id, 4);
    return acc + (q.reverse ? ecrrReverseScore(raw) : raw);
  }, 0);
  return sum / ids.length;
}

/** 依恋倾向：按两个维度各自与量表中点 4 相比的高低（非官方分类） */
export function ecrrPattern(anxiety: number, avoidance: number): {
  key: string;
  label: string;
  hint: string;
} {
  const highAnx = anxiety >= 4;
  const highAvo = avoidance >= 4;
  if (!highAnx && !highAvo) {
    return {
      key: "secure",
      label: "安全型倾向",
      hint: "在亲密关系里既能亲近、也能保持独立，对伴侣的回应有基本的信任。",
    };
  }
  if (highAnx && !highAvo) {
    return {
      key: "preoccupied",
      label: "焦虑型（专注型）倾向",
      hint: "渴望高度亲密，容易担心被抛弃、反复确认对方的感情，情绪起伏与关系反馈绑得很紧。",
    };
  }
  if (!highAnx && highAvo) {
    return {
      key: "dismissing",
      label: "回避型（冷漠型）倾向",
      hint: "习惯自己处理情绪，不太愿意依赖别人，过于亲近时容易想拉开距离。",
    };
  }
  return {
    key: "fearful",
    label: "紊乱型（恐惧-回避型）倾向",
    hint: "既想亲近又害怕受伤，常在靠近与推开之间反复。",
  };
}

export function scoreECRR(answers: Record<number, number>): ScoringResult {
  const anxiety = dimensionMean(answers, ECRR_ANXIETY_ITEMS);
  const avoidance = dimensionMean(answers, ECRR_AVOIDANCE_ITEMS);
  const pattern = ecrrPattern(anxiety, avoidance);

  // 本量表没有可累加的总分：两个维度分是均值，各自独立，相加没有意义。
  const level = pattern.label;
  const severity = Math.min(0.9, Math.max(anxiety, avoidance) / 7);

  const fmt = (v: number) => v.toFixed(2);

  const suggestion = "【亲密关系经历量表修订版（ECR-R）】\n"
    + "• 依恋焦虑：" + fmt(anxiety) + " / 7\n"
    + "• 依恋回避：" + fmt(avoidance) + " / 7\n"
    + "（两个维度是各自 18 题的平均分，不存在可以相加的总分）\n\n"
    + "【本次倾向】" + pattern.label + "\n"
    + pattern.hint + "\n"
    + "这一归类是按「两个维度各自与量表中点 4 相比的高低」得到的，属于便于理解的描述方式；ECR-R 原作者的立场是不把人硬分成四类，因此请不要把它当作固定的人格标签。\n\n"
    + "【怎么读这两个分数】\n"
    + "• 依恋焦虑高：倾向于担心对方不够爱自己、害怕被抛弃，容易反复寻求确认；对关系中的信号（回复快慢、语气变化）特别敏感。\n"
    + "• 依恋回避高：倾向于把情绪收起来、强调独立，靠近时会不舒服，压力大时更想独处；不是「不在乎」，而是不习惯用依赖的方式应对。\n"
    + "• 两个维度都不算高：在关系里比较能靠近也能分开，通常也更容易在冲突后修复。\n"
    + "• 依恋风格不是终身固定的：它会随具体的关系、关系阶段和经历而变化，也有研究显示在稳定安全的关系里会逐渐向安全型移动。\n"
    + "• 若很在意关系中的不安或反复拉扯，伴侣治疗、依恋取向的个体咨询都会有帮助，不必独自消化。\n\n"
    + "本结果仅供参考，不能替代专业评估或诊断。";

  return {
    totalScore: 0,
    maxScore: 0,
    level,
    suggestion,
    severity,
    dimensionScores: {
      type: "ecrr",
      anxiety: { name: "依恋焦虑", score: Number(anxiety.toFixed(2)), max: 7, level: anxiety >= 4 ? "偏高" : "偏低", desc: "担心被抛弃、反复寻求确认的程度（第 1-18 题均值）。" },
      avoidance: { name: "依恋回避", score: Number(avoidance.toFixed(2)), max: 7, level: avoidance >= 4 ? "偏高" : "偏低", desc: "回避亲密与依赖的程度（第 19-36 题均值，含 12 道反向题）。" },
      pattern: { name: "依恋倾向", score: 0, max: 0, level: pattern.label, desc: pattern.hint },
    },
  };
}
