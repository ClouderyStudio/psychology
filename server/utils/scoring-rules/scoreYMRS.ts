// YMRS 杨氏躁狂评定量表·简化自评版（11 题，0-4）· 计分
import type { ScoringResult } from "../score";


function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 0,
): number {
  return answers[id] ?? fallback;
}

export function scoreYMRS(answers: Record<number, number>): ScoringResult {
  let totalScore = 0;
  for (let i = 1; i <= 11; i++) {
    totalScore += getAnswerValue(answers, i, 0);
  }
  const maxScore = 44;

  let level = "";
  let suggestion = "";
  let severity = 0;

  if (totalScore >= 20) {
    level = "提示明显躁狂症状（请尽快就医）";
    severity = 0.9;
    suggestion = `您的YMRS总分为 ${totalScore}/${maxScore}，已超过临床躁狂常见切分点。

【结果说明】
• 提示您过去 48小时 可能存在明显的躁狂或轻躁狂发作
• 可能表现为：情绪异常高涨、精力过剩、睡眠需求减少、言语增多、思维奔逸、冲动冒险行为、过度自信/夸大
• YMRS 是临床他评量表，本结果只能粗略参考，强烈建议尽快由精神科医生进行专业评估

【请立即行动】
• 请告诉家人或信任的人您的状态，不要独自承担
• 尽快到精神科/心理科门诊就诊；如伴有冲动冒险行为，请家属陪同
• 在评估前请避免：熬夜、饮酒、擅自停用情绪稳定药物、大额消费或做出重大决定

【紧急联系】
• 全国统一心理援助热线：12356（24小时）
• 希望24热线：400-161-9995（24小时）
• 紧急情况请拨打 120 或前往就近医院急诊`;
  } else if (totalScore >= 12) {
    level = "提示可能存在轻躁狂";
    severity = 0.65;
    suggestion = `您的YMRS总分为 ${totalScore}/${maxScore}，提示可能存在轻躁狂状态。

【可能表现】
• 比平时更精力充沛、信心增强、睡眠需求减少、想法增多、语速变快
• 这种状态虽然可能让您感觉良好，但也可能让决策变得草率或难以察觉

【建议】
• 关注症状持续时间与变化：超过 4 天持续高涨应警惕
• 保持规律作息，避免睡眠剥夺（睡眠不足会加重躁狂）
• 减少咖啡因、酒精、功能性饮料
• 建议近期咨询精神科或心理科医生，由专业人员评估是否需要干预`;
  } else if (totalScore >= 6) {
    level = "亚临床躁狂倾向";
    severity = 0.3;
    suggestion = `您的YMRS总分为 ${totalScore}/${maxScore}，未达到明显躁狂或轻躁狂切分点，但有部分躁狂相关体验。

【说明】
• 偶尔出现精力充沛、情绪高涨是正常的
• 重点关注这些体验是否频繁出现或持续时间是否延长

【建议】
• 保持规律作息和情绪记录
• 如症状频繁或加重，请咨询专业人员`;
  } else {
    level = "当前未见明显躁狂症状";
    severity = 0.08;
    suggestion = `您的YMRS总分为 ${totalScore}/${maxScore}，当前未见明显躁狂症状。

【说明】
• 您的情绪状态和精力水平处于正常范围
• 偶尔的精力波动属于正常生理现象

【建议】
• 继续保持规律作息
• 如有反复出现的"特别有活力/睡眠需求很少/想法特别多"周期，建议留意情绪节律，必要时咨询专业人员`;
  }

  return {
    totalScore,
    maxScore,
    level,
    suggestion,
    severity,
  };
}
