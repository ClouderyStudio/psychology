// BPAQ Buss-Perry 攻击性量表（29 题，5 级）· 计分
import type { ScoringResult } from "../score";


function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 0,
): number {
  return answers[id] ?? fallback;
}

export function scoreBPAQ(answers: Record<number, number>): ScoringResult {
  const physicalItems = [1, 5, 9, 13, 17, 21, 25, 29];
  const verbalItems = [2, 6, 10, 14, 18, 22, 26];
  const angerItems = [3, 7, 11, 15, 19, 23, 27];
  const hostilityItems = [4, 8, 12, 16, 20, 24, 28];

  let physical = 0;
  let verbal = 0;
  let anger = 0;
  let hostility = 0;

  for (const id of physicalItems) physical += getAnswerValue(answers, id, 1);
  for (const id of verbalItems) verbal += getAnswerValue(answers, id, 1);
  for (const id of angerItems) anger += getAnswerValue(answers, id, 1);
  for (const id of hostilityItems) hostility += getAnswerValue(answers, id, 1);

  const totalScore = physical + verbal + anger + hostility;
  const maxScore = 145;

  let level = "";
  let suggestion = "";
  let severity = 0;

  // 严重度梯度：按总分和身体攻击分（最具临床意义的维度）联合评估
  const highPhysical = physical >= 28; // 身体攻击维度约高于均值 10 分
  const highTotal = totalScore >= 90;

  if (highTotal || highPhysical) {
    level = "攻击倾向较强";
    severity = 0.85;
    suggestion = `您的BPAQ总分为 ${totalScore}/145，攻击倾向较明显。

【四维度表现】
• 身体攻击：${physical}/40（身体性攻击行为）
• 言语攻击：${verbal}/35（言语争吵、反驳）
• 愤怒：${anger}/35（易激惹、烦躁）
• 敌意：${hostility}/35（怀疑、对人抱有戒心）

【说明】
• 持续的高攻击倾向与人际冲突、关系破裂、冲动攻击风险相关
• 如果身体攻击或言语攻击已造成人际关系或法律后果，强烈建议寻求专业帮助

【建议】
• 识别激惹诱因（场景/话题/人物），尽量提前规避或预演应对方式
• 学习愤怒管理：识别愤怒的早期信号、暂停反应、放松技巧
• 规律有氧运动可以显著降低攻击冲动
• 心理咨询（如 CBT、辩证行为治疗 DBT）有成熟证据`;
  } else if (totalScore >= 65) {
    level = "攻击倾向较明显";
    severity = 0.55;
    suggestion = `您的BPAQ总分为 ${totalScore}/145，攻击倾向处于较明显水平。

【四维度表现】
• 身体攻击：${physical}/40
• 言语攻击：${verbal}/35
• 愤怒：${anger}/35
• 敌意：${hostility}/35

【建议】
• 在冲突情境中尝试"暂停-反思-回应"的节奏，避免被情绪推着走
• 区分"愤怒情绪"与"攻击行为"，允许自己感受愤怒但不一定要行动
• 练习非暴力沟通（NVC）：陈述事实 + 表达感受 + 说出需求 + 提出具体请求`;
  } else if (totalScore >= 50) {
    level = "中等攻击倾向";
    severity = 0.3;
    suggestion = `您的BPAQ总分为 ${totalScore}/145，处于中等水平。

【四维度表现】
• 身体攻击：${physical}/40
• 言语攻击：${verbal}/35
• 愤怒：${anger}/35
• 敌意：${hostility}/35

【说明】
• 多数人在某些维度上偶尔有较强反应属正常
• 您可以根据各维度分数判断自己最容易在哪种情境下被激怒

【建议】
• 保持情绪管理与放松练习
• 对"敌意"维度偏高者，可练习换位思考，尝试理解他人善意的一面`;
  } else {
    level = "攻击倾向较低";
    severity = Math.max(0.05, totalScore / maxScore * 0.4);
    suggestion = `您的BPAQ总分为 ${totalScore}/145，攻击倾向较低。

【四维度表现】
• 身体攻击：${physical}/40
• 言语攻击：${verbal}/35
• 愤怒：${anger}/35
• 敌意：${hostility}/35

【说明】
• 您在冲突中通常能保持较平稳的反应，是良好情绪管理能力的体现`;
  }

  return {
    totalScore,
    maxScore,
    level,
    suggestion,
    severity,
    dimensionScores: {
      physical: { score: physical, max: 40 },
      verbal: { score: verbal, max: 35 },
      anger: { score: anger, max: 35 },
      hostility: { score: hostility, max: 35 },
    },
  };
}
