import { bpnsQuestions, bpnsDimensions } from "#imports";
import { ScoringResult } from "../score";

// BPNS 评分函数
export function scoreBPNS(answers: Record<number, number>): ScoringResult {
  const dimensions = ['autonomy', 'competence', 'relatedness'];
  const dimNames: Record<string, string> = {
    autonomy: '自主需求', competence: '胜任需求', relatedness: '归属需求'
  };

  const dimScores: Record<string, { total: number; count: number; }> = {
    autonomy: { total: 0, count: 0 },
    competence: { total: 0, count: 0 },
    relatedness: { total: 0, count: 0 }
  };

  // 计算各维度得分
  Object.entries(answers).forEach(([qid, value]) => {
    const id = parseInt(qid);
    const question = bpnsQuestions.find(q => q.id === id);
    if (!question) return;

    let score = value;
    if (question.reverse) {
      // 反向计分：1→7, 2→6, 3→5, 4→4, 5→3, 6→2, 7→1
      score = 8 - value;
    }
    dimScores[question.dimension].total += score;
    dimScores[question.dimension].count++;
  });

  // 计算各维度平均分和等级
  const dimAverages: Record<string, number> = {};
  const dimLevels: Record<string, string> = {};

  for (const dim of dimensions) {
    const avg = dimScores[dim].total / dimScores[dim].count;
    dimAverages[dim] = Math.round(avg * 100) / 100;

    if (avg >= 5.5) dimLevels[dim] = '高度满足';
    else if (avg >= 4) dimLevels[dim] = '基本满足';
    else if (avg >= 2.5) dimLevels[dim] = '部分满足';
    else dimLevels[dim] = '满足不足';
  }

  // 总分（各维度平均分的平均值，转换为百分制）
  const totalAvg = (dimAverages.autonomy + dimAverages.competence + dimAverages.relatedness) / 3;
  const totalScore = Math.round(totalAvg / 7 * 100);

  // 生成报告
  const suggestion = generateBPNSReport(dimAverages, dimLevels);

  return {
    totalScore,
    maxScore: 100,
    level: getOverallLevel(totalAvg),
    suggestion,
    severity: 1 - totalAvg / 7,
    dimensionScores: {
      autonomy: { score: dimAverages.autonomy, level: dimLevels.autonomy, desc: bpnsDimensions.autonomy.desc },
      competence: { score: dimAverages.competence, level: dimLevels.competence, desc: bpnsDimensions.competence.desc },
      relatedness: { score: dimAverages.relatedness, level: dimLevels.relatedness, desc: bpnsDimensions.relatedness.desc }
    }
  };
}
function getOverallLevel(avg: number): string {
  if (avg >= 5.5) return '心理需求满足良好';
  if (avg >= 4) return '心理需求基本满足';
  if (avg >= 2.5) return '心理需求部分满足';
  return '心理需求满足不足';
}
function generateBPNSReport(scores: Record<string, number>, levels: Record<string, string>): string {
  return `【基本心理需求满足情况分析】

一、各维度得分

1. 自主需求：${scores.autonomy}分（${levels.autonomy}）
   ${bpnsDimensions.autonomy.desc}
   ${levels.autonomy === '高度满足' ? '✓ 您能够按照自己的意愿行事，有较好的自主空间。' : levels.autonomy === '基本满足' ? '✓ 您多数时候能自主决定，有时会感到受约束。' : levels.autonomy === '部分满足' ? '⚠️ 您常感到缺乏自主权，建议寻找更多自主表达的机会。' : '⚠️ 您明显感到受他人控制，建议学习设定个人边界。'}

2. 胜任需求：${scores.competence}分（${levels.competence}）
   ${bpnsDimensions.competence.desc}
   ${levels.competence === '高度满足' ? '✓ 您对自己的能力有信心，能够应对挑战。' : levels.competence === '基本满足' ? '✓ 您多数时候能完成任务，建议挑战稍微超出能力的目标。' : levels.competence === '部分满足' ? '⚠️ 您常怀疑自己的能力，建议关注小成就建立信心。' : '⚠️ 您明显感到能力不足，建议从简单任务开始积累成功经验。'}

3. 归属需求：${scores.relatedness}分（${levels.relatedness}）
   ${bpnsDimensions.relatedness.desc}
   ${levels.relatedness === '高度满足' ? '✓ 您有良好的人际支持系统，能感受到关爱。' : levels.relatedness === '基本满足' ? '✓ 您有基本的人际关系，建议深化现有关系或拓展社交圈。' : levels.relatedness === '部分满足' ? '⚠️ 您常感到孤独，建议主动参与社交活动。' : '⚠️ 您明显缺乏归属感，建议寻求支持性团体或心理咨询。'}

二、综合评估

总分：${Math.round((scores.autonomy + scores.competence + scores.relatedness) / 3 * 100 / 7)}分

${getOverallLevel((scores.autonomy + scores.competence + scores.relatedness) / 3)}

【成长建议】
• 关注得分较低的维度，有针对性地改善
• 自主需求不足：练习说"不"，多做符合内心价值观的选择
• 胜任需求不足：设定小目标，记录每日成就，学习新技能
• 归属需求不足：主动联系朋友，参加兴趣小组，培养同理心

研究表明，基本心理需求的满足与幸福感、生活满意度正相关，与焦虑、抑郁负相关。`;
}
