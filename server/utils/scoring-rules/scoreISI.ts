// ISI 失眠严重程度指数（7 题，0-4）· 计分
import type { ScoringResult } from "../score";


function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 0,
): number {
  return answers[id] ?? fallback;
}

export function scoreISI(answers: Record<number, number>): ScoringResult {
  let totalScore = 0;
  for (let i = 1; i <= 7; i++) {
    totalScore += getAnswerValue(answers, i, 0);
  }
  const maxScore = 28;

  let level = "";
  let suggestion = "";
  let severity = 0;

  if (totalScore >= 22) {
    level = "严重临床失眠";
    severity = 0.9;
    suggestion = `您的ISI总分为 ${totalScore}/${maxScore}，处于严重临床失眠范围。

【说明】
• 失眠已对您的日间功能、情绪与生活质量造成明显影响
• 严重失眠常与情绪问题（焦虑/抑郁）、慢性压力或躯体疾病共存

【建议】
• 强烈建议尽快到睡眠专科或精神科就诊，评估是否需要药物+认知行为治疗（CBT-I）
• 在就诊前请避免：长期自行使用安眠药、依赖酒精助眠、长时间白天补觉
• 保持起床时间固定、卧室仅用于睡眠，是 CBT-I 的基础`;
  } else if (totalScore >= 15) {
    level = "中度临床失眠";
    severity = 0.65;
    suggestion = `您的ISI总分为 ${totalScore}/${maxScore}，达到中度临床失眠标准。

【建议】
• 建议咨询睡眠专科或精神科医生
• CBT-I（认知行为治疗）是慢性失眠的首选一线治疗，效果持久且无药物副作用
• 改善睡眠卫生：
  - 固定起床时间（即使前一晚没睡好）
  - 卧室仅用于睡眠，避免在床上工作/刷手机
  - 傍晚后避免咖啡因/酒精/吸烟
  - 白天适度运动，但睡前 3 小时避免剧烈运动
  - 仅在真正困倦时上床，若 20 分钟未入睡则起床`;
  } else if (totalScore >= 8) {
    level = "亚临床失眠（轻度）";
    severity = 0.3;
    suggestion = `您的ISI总分为 ${totalScore}/${maxScore}，处于亚临床失眠范围。

【说明】
• 尚未达到临床失眠标准，但已有困扰
• 现在调整是预防慢性化的最佳时机

【建议】
• 重点改善睡眠卫生习惯（见上一档建议）
• 记录 2 周睡眠日记，识别触发模式
• 学习放松技巧：深呼吸、渐进式肌肉放松、正念冥想
• 如持续超过 3 个月或加重，建议咨询医生`;
  } else {
    level = "无临床失眠";
    severity = Math.max(0.05, totalScore / maxScore * 0.5);
    suggestion = `您的ISI总分为 ${totalScore}/${maxScore}，当前未提示临床失眠。

【说明】
• 您的睡眠质量处于正常范围
• 偶尔睡眠不好是正常现象，无需过度担忧
• 保持规律的作息节奏与适度运动`;
  }

  return {
    totalScore,
    maxScore,
    level,
    suggestion,
    severity,
  };
}
