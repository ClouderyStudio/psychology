// BIS-11 Barratt 冲动性量表（30 题，5 级）· 计分
import type { ScoringResult } from "../score";
import { bisQuestions } from "../questions/bis-questions";


function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 0,
): number {
  return answers[id] ?? fallback;
}

export function scoreBIS(answers: Record<number, number>): ScoringResult {
  let totalScore = 0;
  let attention = 0;
  let motor = 0;
  let nonplanning = 0;

  for (const q of bisQuestions) {
    const raw = getAnswerValue(answers, q.id, 1); // 默认 1=最低分
    const scored = q.reverse ? 6 - raw : raw;
    totalScore += scored;
    if (q.dimension === "attentional") attention += scored;
    else if (q.dimension === "motor") motor += scored;
    else if (q.dimension === "nonplanning") nonplanning += scored;
  }
  const maxScore = 150;
  let level = "";
  let suggestion = "";
  let severity = 0;

  if (totalScore >= 90) {
    level = "高冲动倾向";
    severity = 0.85;
    suggestion = `您的BIS-11总分为 ${totalScore}/150，冲动倾向明显较高。

【三维度表现】
• 注意力冲动：${attention}/50（注意力难以维持、易分心、走神）
• 运动冲动：${motor}/50（行动迅速、难克制即时行为）
• 无计划冲动：${nonplanning}/50（缺乏长远规划、冲动决策、临时变卦）

【建议】
• 冲动倾向可能让您更易卷入冲动行为、决策后悔或人际冲突
• 学习"停一停"技术——任何重要决定至少推迟 24 小时
• 记录冲动诱因，识别触发点；规律运动、正念练习对降低反应性冲动有较好帮助
• 如冲动行为已造成明显后果（财务损失、关系破裂、冲动攻击等），建议寻求专业心理咨询或精神科评估`;
  } else if (totalScore >= 76) {
    level = "较高冲动倾向";
    severity = 0.65;
    suggestion = `您的BIS-11总分为 ${totalScore}/150，冲动倾向处于较高水平。

【三维度表现】
• 注意力冲动：${attention}/50
• 运动冲动：${motor}/50
• 无计划冲动：${nonplanning}/50

【建议】
• 较易出现"先做后想"或决策后悔的情况
• 尝试在冲动时延后反应（深呼吸 6 秒、数 10 下）
• 培养计划习惯：写下来要做的事、列决策清单
• 保持规律睡眠与运动，可明显改善注意力和情绪调节`;
  } else if (totalScore >= 60) {
    level = "中等冲动倾向";
    severity = 0.4;
    suggestion = `您的BIS-11总分为 ${totalScore}/150，冲动倾向处于中等水平。

【三维度表现】
• 注意力冲动：${attention}/50
• 运动冲动：${motor}/50
• 无计划冲动：${nonplanning}/50

【说明】
• 多数人在某些维度上有轻度冲动倾向属于正常现象
• 您可以根据各维度分数判断自己最容易在哪类情境下"冲"出来

【建议】
• 保持稳定的作息和决策节奏
• 在感觉自己冲动时主动退一步，效果会很明显`;
  } else {
    level = "低冲动倾向";
    severity = Math.max(0.05, totalScore / maxScore * 0.5);
    suggestion = `您的BIS-11总分为 ${totalScore}/150，冲动倾向较低。

【三维度表现】
• 注意力冲动：${attention}/50
• 运动冲动：${motor}/50
• 无计划冲动：${nonplanning}/50

【说明】
• 您通常能在决策前思考、在行动前停顿，这是宝贵的心理资源
• 继续关注各维度均衡即可`;
  }

  return {
    totalScore,
    maxScore,
    level,
    suggestion,
    severity,
    dimensionScores: {
      attention: { score: attention, max: 50 },
      motor: { score: motor, max: 50 },
      nonplanning: { score: nonplanning, max: 50 },
    },
  };
}
