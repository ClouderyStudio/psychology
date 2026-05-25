import { calculateDimensionScores, scl90Dimensions } from "#imports";
import { ScoringResult } from "../score";

export type SCL90DimensionKey = keyof typeof scl90Dimensions;

// 更新 SCL-90 评分函数
export function scoreSCL90(answers: Record<number, number>): ScoringResult {
  // 计算总分（所有题目得分之和）
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  // 计算总均分 = 总分 / 90
  const averageScore = totalScore / 90;

  // 计算各维度得分
  const dimensionScores = calculateDimensionScores(answers);

  // 找出得分最高的三个维度
  const sortedDimensions = (
    Object.entries(dimensionScores) as Array<
      [
        SCL90DimensionKey,
        { total: number; average: number; level: string; description: string },
      ]
    >
  )
    .sort((a, b) => b[1].average - a[1].average)
    .slice(0, 3);

  // 判断总体严重程度
  let level = "";
  let suggestion = "";

  if (averageScore < 2) {
    level = "心理健康状况良好";
    suggestion = `您的SCL-90总均分为 ${averageScore.toFixed(2)} 分，处于正常范围。

【总体评估】
心理健康状况良好，各项指标均在正常范围内。您具有良好的心理适应能力，能够较好地应对日常生活中的压力。

${generateDimensionReport(dimensionScores, sortedDimensions)}

【成长建议】
• 继续保持健康的生活方式
• 定期关注自己的心理状态
• 培养积极乐观的心态
• 与他人保持良好的社交关系`;
  } else if (averageScore < 2.5) {
    level = "轻度心理困扰";
    suggestion = `您的SCL-90总均分为 ${averageScore.toFixed(2)} 分，处于轻度水平。

【总体评估】
您可能存在轻度的心理困扰，主要表现为${sortedDimensions.map((d) => scl90Dimensions[d[0]]?.name || d[0]).join("、")}等方面的问题。

${generateDimensionReport(dimensionScores, sortedDimensions)}

【成长建议】
• 关注自己的情绪变化，记录心情日记
• 增加户外活动和体育锻炼
• 与信任的朋友或家人倾诉
• 学习放松技巧，如深呼吸、冥想
• 培养兴趣爱好，丰富生活`;
  } else if (averageScore < 3.5) {
    level = "中度心理困扰";
    suggestion = `您的SCL-90总均分为 ${averageScore.toFixed(2)} 分，处于中度水平。

【总体评估】
您存在中度心理困扰，${sortedDimensions.map((d) => scl90Dimensions[d[0]]?.name || d[0]).join("、")}等方面的症状较为明显，需要引起重视。

${generateDimensionReport(dimensionScores, sortedDimensions)}

【成长建议】
• 建议寻求专业心理咨询帮助
• 进行系统的心理评估和治疗
• 建立健康的支持系统
• 学习压力管理和情绪调节技巧
• 保持规律作息和健康饮食
• 避免自我责备，接纳当前状态`;
  } else {
    level = "重度心理困扰";
    suggestion = `您的SCL-90总均分为 ${averageScore.toFixed(2)} 分，处于重度水平。

【总体评估】
您存在较明显的心理困扰，多个维度的得分较高，强烈建议寻求专业帮助。

${generateDimensionReport(dimensionScores, sortedDimensions)}

【成长建议】
• 尽快寻求专业心理医生帮助
• 前往医院心理科或精神科就诊
• 告知家人或信任的朋友您的情况
• 24小时心理援助热线：400-161-9995
• 如有自伤念头，请立即前往医院急诊
• 请记住：寻求帮助是勇敢和智慧的表现`;
  }

  return {
    totalScore,
    maxScore: 450,
    level,
    suggestion,
    severity: averageScore / 5,
    rawScore: totalScore,
    standardizedScore: averageScore,
    dimensionScores: dimensionScores,
  };
}
// 生成维度报告
function generateDimensionReport(
  dimensionScores: Partial<
    Record<
      SCL90DimensionKey,
      { total: number; average: number; level: string; description: string }
    >
  >,
  topDimensions: Array<[SCL90DimensionKey, { average: number; level: string }]>,
): string {
  let report = "\n【各维度得分详情】\n\n";

  const dimensionOrder: SCL90DimensionKey[] = [
    "somatization",
    "obsessive",
    "interpersonal",
    "depression",
    "anxiety",
    "hostility",
    "phobic",
    "paranoid",
    "psychotic",
    "additional",
  ];

  for (const dimKey of dimensionOrder) {
    const dimInfo = scl90Dimensions[dimKey];
    const score = dimensionScores[dimKey];
    if (dimInfo && score) {
      const levelIcon =
        score.level === "很高"
          ? "🔴"
          : score.level === "较高"
            ? "🟠"
            : score.level === "中等"
              ? "🟡"
              : score.level === "较低"
                ? "🟢"
                : "⚪";
      report += `${levelIcon} ${dimInfo.icon} ${dimInfo.name}（${dimInfo.nameEn}）\n`;
      report += `   均分：${score.average} 分（${score.level}）\n`;
      report += `   ${dimInfo.description}\n`;
      if (score.average >= 2.5) {
        report += `   ⚠️ ${dimInfo.highScore}\n`;
      }
      report += "\n";
    }
  }

  report += "【重点关注维度】\n";
  for (const [i, [dimKey, score]] of topDimensions.entries()) {
    const dimInfo = scl90Dimensions[dimKey];
    report += `${i + 1}. ${dimInfo?.icon || "📌"} ${dimInfo?.name || dimKey}：${score.average}分（${score.level}）\n`;
  }

  return report;
}
