import { epqInterpretation, epqScales } from "./epq-questions"
import { epqRscScales } from "./epq-rsc-questions"
import { calculateDimensionScores, scl90Dimensions } from "./scl90-dimensions"

interface ScoringInput {
  testId: string
  answers: Record<number, number>
}

interface ScoringResult {
  totalScore: number
  maxScore: number
  level: string
  suggestion: string
  severity: number
  dimensionScores?: Record<string, number>
  rawScore?: number
  standardizedScore?: number
}

export function calculateScore(input: ScoringInput): ScoringResult {
  const { testId, answers } = input
  
  switch (testId) {
    case 'phq9':
      return scorePHQ9(answers)
    case 'gad7':
      return scoreGAD7(answers)
    case 'pss':
      return scorePSS(answers)
    case 'scl90':
      return scoreSCL90(answers)
    case 'sds':
      return scoreSDS(answers)
    case 'sas':
      return scoreSAS(answers)
    case 'mbti':
      return scoreMBTI(answers)
    case 'sccs':
      return scoreSCCS(answers)
    case 'temperament':
      return scoreTemperament(answers)
    case 'bdc':
      return scoreBDC(answers)
    case 'epq':
      return scoreEPQ(answers)
    case 'epq-rsc':
      return scoreEPQRSC(answers)
    case 'emotional-stability':
      return scoreEmotionalStability(answers)
    default:
      return {
        totalScore: 0,
        maxScore: 0,
        level: '未知',
        suggestion: '评分规则未定义',
        severity: 0
      }
  }
}

// PHQ-9 抑郁筛查量表
function scorePHQ9(answers: Record<number, number>): ScoringResult {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
  
  let level = ''
  let suggestion = ''
  
  if (totalScore <= 4) {
    level = '无显著抑郁症状'
    suggestion = '您的情绪状态良好，请继续保持健康的生活方式，规律作息，适当运动。'
  } else if (totalScore <= 9) {
    level = '轻度抑郁'
    suggestion = '您可能存在轻度情绪困扰。建议：\n• 增加社交活动和户外运动\n• 保持规律作息\n• 尝试冥想或深呼吸放松\n• 与信任的朋友家人倾诉'
  } else if (totalScore <= 14) {
    level = '中度抑郁'
    suggestion = '您的情绪状态需要关注。建议：\n• 寻求专业心理咨询支持\n• 记录情绪变化，识别触发因素\n• 建立健康的生活习惯\n• 考虑参加支持小组'
  } else if (totalScore <= 19) {
    level = '中重度抑郁'
    suggestion = '您的情绪困扰较明显。强烈建议：\n• 尽快咨询心理医生或精神科医生\n• 不要独自承受，寻求家人支持\n• 避免重大决定\n• 如出现自伤念头，立即寻求紧急帮助'
  } else {
    level = '重度抑郁'
    suggestion = '您的症状较为严重，请立即寻求专业医疗帮助！\n• 尽快预约精神科医生\n• 告知家人或信任的朋友\n• 24小时心理援助热线：希望24热线（400-161-9995）\n• 如情况紧急，请前往医院急诊'
  }
  
  return {
    totalScore,
    maxScore: 27,
    level,
    suggestion,
    severity: totalScore / 27
  }
}

// GAD-7 焦虑筛查量表
function scoreGAD7(answers: Record<number, number>): ScoringResult {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
  
  let level = ''
  let suggestion = ''
  
  if (totalScore <= 4) {
    level = '轻度焦虑'
    suggestion = '您的焦虑水平在正常范围内。保持健康的生活方式，学会放松技巧可以帮助维持良好状态。'
  } else if (totalScore <= 9) {
    level = '中度焦虑'
    suggestion = '您存在中等程度的焦虑症状。建议：\n• 学习深呼吸、渐进式肌肉放松\n• 减少咖啡因摄入\n• 保证充足睡眠\n• 考虑正念冥想练习'
  } else if (totalScore <= 14) {
    level = '中重度焦虑'
    suggestion = '您的焦虑水平较高。建议：\n• 寻求心理咨询帮助\n• 学习认知行为疗法技巧\n• 规律运动（尤其是有氧运动）\n• 避免饮酒和咖啡因'
  } else {
    level = '重度焦虑'
    suggestion = '您的焦虑症状较严重，请及时寻求专业帮助！\n• 建议尽快咨询精神科医生\n• 可能需要药物治疗配合心理治疗\n• 建立紧急应对计划\n• 告知亲友您的情况'
  }
  
  return {
    totalScore,
    maxScore: 21,
    level,
    suggestion,
    severity: totalScore / 21
  }
}

// PSS 压力感知量表（含反向计分）
function scorePSS(answers: Record<number, number>): ScoringResult {
  // PSS-10 反向计分题：4,5,7,8
  let totalScore = 0
  for (let i = 1; i <= 10; i++) {
    if ([4, 5, 7, 8].includes(i)) {
      // 反向计分: 0=4, 1=3, 2=2, 3=1, 4=0
      totalScore += 4 - answers[i]
    } else {
      totalScore += answers[i]
    }
  }
  
  let level = ''
  let suggestion = ''
  
  if (totalScore <= 13) {
    level = '压力水平较低'
    suggestion = '您目前压力管理得很好。继续保持：\n• 现有的应对策略\n• 定期自我关照\n• 预防性压力管理'
  } else if (totalScore <= 26) {
    level = '压力水平适中'
    suggestion = '您的压力水平在可控范围内。建议：\n• 学习时间管理技巧\n• 建立工作生活边界\n• 定期放松和休息\n• 保持社交支持网络'
  } else {
    level = '压力水平较高'
    suggestion = '您的压力水平较高，需要积极干预。建议：\n• 评估压力来源并制定应对计划\n• 学习压力管理技巧（正念、运动）\n• 寻求心理咨询支持\n• 考虑减少不必要承诺'
  }
  
  return {
    totalScore,
    maxScore: 40,
    level,
    suggestion,
    severity: totalScore / 40
  }
}

// 更新 SCL-90 评分函数
function scoreSCL90(answers: Record<number, number>): ScoringResult {
  // 计算总分（所有题目得分之和）
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0)
  
  // 计算总均分 = 总分 / 90
  const averageScore = totalScore / 90
  
  // 计算各维度得分
  const dimensionScores = calculateDimensionScores(answers)
  
  // 找出得分最高的三个维度
  const sortedDimensions = Object.entries(dimensionScores)
    .sort((a, b) => b[1].average - a[1].average)
    .slice(0, 3)
  
  // 判断总体严重程度
  let level = ''
  let suggestion = ''
  
  if (averageScore < 2) {
    level = '心理健康状况良好'
    suggestion = `您的SCL-90总均分为 ${averageScore.toFixed(2)} 分，处于正常范围。

【总体评估】
心理健康状况良好，各项指标均在正常范围内。您具有良好的心理适应能力，能够较好地应对日常生活中的压力。

${generateDimensionReport(dimensionScores, sortedDimensions)}

【成长建议】
• 继续保持健康的生活方式
• 定期关注自己的心理状态
• 培养积极乐观的心态
• 与他人保持良好的社交关系`
  } else if (averageScore < 2.5) {
    level = '轻度心理困扰'
    suggestion = `您的SCL-90总均分为 ${averageScore.toFixed(2)} 分，处于轻度水平。

【总体评估】
您可能存在轻度的心理困扰，主要表现为${sortedDimensions.map(d => scl90Dimensions[d[0]]?.name || d[0]).join('、')}等方面的问题。

${generateDimensionReport(dimensionScores, sortedDimensions)}

【成长建议】
• 关注自己的情绪变化，记录心情日记
• 增加户外活动和体育锻炼
• 与信任的朋友或家人倾诉
• 学习放松技巧，如深呼吸、冥想
• 培养兴趣爱好，丰富生活`
  } else if (averageScore < 3.5) {
    level = '中度心理困扰'
    suggestion = `您的SCL-90总均分为 ${averageScore.toFixed(2)} 分，处于中度水平。

【总体评估】
您存在中度心理困扰，${sortedDimensions.map(d => scl90Dimensions[d[0]]?.name || d[0]).join('、')}等方面的症状较为明显，需要引起重视。

${generateDimensionReport(dimensionScores, sortedDimensions)}

【成长建议】
• 建议寻求专业心理咨询帮助
• 进行系统的心理评估和治疗
• 建立健康的支持系统
• 学习压力管理和情绪调节技巧
• 保持规律作息和健康饮食
• 避免自我责备，接纳当前状态`
  } else {
    level = '重度心理困扰'
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
• 请记住：寻求帮助是勇敢和智慧的表现`
  }
  
  return {
    totalScore,
    maxScore: 450,
    level,
    suggestion,
    severity: averageScore / 5,
    rawScore: totalScore,
    standardizedScore: averageScore,
    dimensionScores: dimensionScores
  }
}

// 生成维度报告
function generateDimensionReport(
  dimensionScores: Record<string, { total: number; average: number; level: string; description: string }>,
  topDimensions: [string, { average: number; level: string }][]
): string {
  let report = '\n【各维度得分详情】\n\n'
  
  const dimensionOrder = ['somatization', 'obsessive', 'interpersonal', 'depression', 'anxiety', 'hostility', 'phobic', 'paranoid', 'psychotic', 'additional']
  
  for (const dimKey of dimensionOrder) {
    const dimInfo = scl90Dimensions[dimKey]
    const score = dimensionScores[dimKey]
    if (dimInfo && score) {
      const levelIcon = score.level === '很高' ? '🔴' : score.level === '较高' ? '🟠' : score.level === '中等' ? '🟡' : score.level === '较低' ? '🟢' : '⚪'
      report += `${levelIcon} ${dimInfo.icon} ${dimInfo.name}（${dimInfo.nameEn}）\n`
      report += `   均分：${score.average} 分（${score.level}）\n`
      report += `   ${dimInfo.description}\n`
      if (score.average >= 2.5) {
        report += `   ⚠️ ${dimInfo.highScore}\n`
      }
      report += '\n'
    }
  }
  
  report += '【重点关注维度】\n'
  for (let i = 0; i < topDimensions.length; i++) {
    const [dimKey, score] = topDimensions[i]
    const dimInfo = scl90Dimensions[dimKey]
    report += `${i + 1}. ${dimInfo?.icon || '📌'} ${dimInfo?.name || dimKey}：${score.average}分（${score.level}）\n`
  }
  
  return report
}

// SDS 抑郁自评量表
function scoreSDS(answers: Record<number, number>): ScoringResult {
  // SDS 反向计分题：2,5,6,11,12,14,16,17,18,20
  const reverseItems = [2, 5, 6, 11, 12, 14, 16, 17, 18, 20]
  
  let rawScore = 0
  for (let i = 1; i <= 20; i++) {
    if (reverseItems.includes(i)) {
      // 反向计分：1→4, 2→3, 3→2, 4→1
      rawScore += 5 - answers[i]
    } else {
      rawScore += answers[i]
    }
  }
  
  // 计算标准分（乘以1.25后取整）
  const standardizedScore = Math.round(rawScore * 1.25)
  
  // 判断抑郁程度
  let level = ''
  let suggestion = ''
  
  if (standardizedScore <= 53) {
    level = '无抑郁症状'
    suggestion = '您的情绪状态良好，请继续保持健康的生活方式。'
  } else if (standardizedScore <= 62) {
    level = '轻度抑郁'
    suggestion = '您存在轻度抑郁倾向，建议：\n• 增加户外活动和运动\n• 保持规律的作息时间\n• 与亲友保持联系\n• 培养兴趣爱好'
  } else if (standardizedScore <= 72) {
    level = '中度抑郁'
    suggestion = '您存在中度抑郁倾向，建议：\n• 寻求专业心理咨询\n• 评估是否需要药物治疗\n• 建立支持系统\n• 学习认知行为疗法技巧'
  } else {
    level = '重度抑郁'
    suggestion = '您存在重度抑郁倾向，强烈建议：\n• 立即寻求精神科医生帮助\n• 可能需要药物治疗\n• 告知家人您的状况\n• 如有自伤念头，立即拨打心理援助热线'
  }
  
  return {
    totalScore: standardizedScore,
    maxScore: 100,
    level,
    suggestion,
    severity: standardizedScore / 100,
    rawScore,
    standardizedScore
  }
}

// SAS 焦虑自评量表
function scoreSAS(answers: Record<number, number>): ScoringResult {
  // SAS 反向计分题：5,9,13,17,19
  const reverseItems = [5, 9, 13, 17, 19]
  
  let rawScore = 0
  for (let i = 1; i <= 20; i++) {
    if (reverseItems.includes(i)) {
      // 反向计分：1→4, 2→3, 3→2, 4→1
      rawScore += 5 - answers[i]
    } else {
      rawScore += answers[i]
    }
  }
  
  // 计算标准分（乘以1.25后取整）
  const standardizedScore = Math.round(rawScore * 1.25)
  
  // 判断焦虑程度
  let level = ''
  let suggestion = ''
  
  if (standardizedScore <= 50) {
    level = '无焦虑症状'
    suggestion = '您的情绪状态良好，请继续保持健康的生活方式。'
  } else if (standardizedScore <= 59) {
    level = '轻度焦虑'
    suggestion = '您存在轻度焦虑倾向，建议：\n• 学习放松技巧（深呼吸、冥想）\n• 减少咖啡因摄入\n• 保证充足睡眠\n• 规律运动'
  } else if (standardizedScore <= 69) {
    level = '中度焦虑'
    suggestion = '您存在中度焦虑倾向，建议：\n• 寻求专业心理咨询\n• 学习认知行为疗法\n• 建立压力管理计划\n• 避免饮酒和咖啡因'
  } else {
    level = '重度焦虑'
    suggestion = '您存在重度焦虑倾向，强烈建议：\n• 尽快咨询精神科医生\n• 可能需要药物治疗\n• 学习急性焦虑应对技巧\n• 建立紧急支持系统'
  }
  
  return {
    totalScore: standardizedScore,
    maxScore: 100,
    level,
    suggestion,
    severity: standardizedScore / 100,
    rawScore,
    standardizedScore
  }
}

// 生成个性化建议
export function generatePersonalizedAdvice(
  result: ScoringResult, 
  testTitle: string
): string {
  if (result.severity > 0.7) {
    return `根据${testTitle}的评估结果，您的得分较高。请重视这个信号，考虑寻求专业心理健康服务。记住，寻求帮助是勇气和智慧的表现。`
  } else if (result.severity > 0.4) {
    return `您的得分处于中等水平。建议关注自我照顾，尝试一些压力管理技巧，如规律运动、正念练习。如果需要，可以寻求心理咨询师的支持。`
  } else {
    return `您的评估结果良好。保持健康的生活方式，定期关注自己的心理状态，预防胜于治疗。`
  }
}

// MBTI 评分函数
function scoreMBTI(answers: Record<number, number>): ScoringResult {
  // 初始化各维度得分
  let eiScore = 0  // E(外向) vs I(内向) - 分数高偏向E
  let snScore = 0  // S(实感) vs N(直觉) - 分数高偏向S
  let tfScore = 0  // T(思考) vs F(情感) - 分数高偏向T
  let jpScore = 0  // J(判断) vs P(感知) - 分数高偏向J
  
  let eiCount = 0
  let snCount = 0
  let tfCount = 0
  let jpCount = 0
  
  // 遍历所有答案计算分数
  Object.entries(answers).forEach(([qid, value]) => {
    const id = parseInt(qid)
    
    // E/I 维度 (1-24题)
    if (id >= 1 && id <= 24) {
      // E/I 维度的反向计分题：9-16题是反向（偏向I的题目）
      if (id >= 9 && id <= 16) {
        // 反向计分: 0→4, 1→3, 2→2, 3→1, 4→0
        eiScore += 4 - value
      } else {
        eiScore += value
      }
      eiCount++
    } 
    // S/N 维度 (25-47题)
    else if (id >= 25 && id <= 47) {
      // S/N 维度的反向计分题：35-47题是反向（偏向N的题目）
      if (id >= 35 && id <= 47) {
        snScore += 4 - value
      } else {
        snScore += value
      }
      snCount++
    } 
    // T/F 维度 (48-70题)
    else if (id >= 48 && id <= 70) {
      // T/F 维度的反向计分题：59-70题是反向（偏向F的题目）
      if (id >= 59 && id <= 70) {
        tfScore += 4 - value
      } else {
        tfScore += value
      }
      tfCount++
    } 
    // J/P 维度 (71-93题)
    else if (id >= 71 && id <= 93) {
      // J/P 维度的反向计分题：82-93题是反向（偏向P的题目）
      if (id >= 82 && id <= 93) {
        jpScore += 4 - value
      } else {
        jpScore += value
      }
      jpCount++
    }
  })
  
  // 计算平均分（0-4分制）
  // 使用总分除以题数，而不是简单平均
  const eiAvg = eiCount > 0 ? eiScore / eiCount : 2
  const snAvg = snCount > 0 ? snScore / snCount : 2
  const tfAvg = tfCount > 0 ? tfScore / tfCount : 2
  const jpAvg = jpCount > 0 ? jpScore / jpCount : 2
  
  // 确定类型（以2.5为分界点）
  // 注意：分数越高越偏向第一个字母，分数越低越偏向第二个字母
  const ei = eiAvg > 2.5 ? 'E' : 'I'
  const sn = snAvg > 2.5 ? 'S' : 'N'
  const tf = tfAvg > 2.5 ? 'T' : 'F'
  const jp = jpAvg > 2.5 ? 'J' : 'P'
  
  const mbtiType = `${ei}${sn}${tf}${jp}`
  
  // 获取类型详细描述
  const typeInfo = getMBTIDetailedDescription(mbtiType)
  
  // 生成个性化建议
  const suggestion = generateMBTISuggestion(mbtiType, { eiAvg, snAvg, tfAvg, jpAvg })
  
  return {
    totalScore: Math.round((eiAvg + snAvg + tfAvg + jpAvg) / 4 * 25), // 转换为百分制
    maxScore: 100,
    level: mbtiType,
    suggestion: suggestion,
    severity: 0,
    dimensionScores: {
      E_I: { score: eiScore, avg: eiAvg, result: ei },
      S_N: { score: snScore, avg: snAvg, result: sn },
      T_F: { score: tfScore, avg: tfAvg, result: tf },
      J_P: { score: jpScore, avg: jpAvg, result: jp },
      type: mbtiType,
      typeName: typeInfo.name
    }
  }
}

// MBTI 16种人格类型详细描述
function getMBTIDetailedDescription(type: string): { name: string; traits: string[]; career: string[]; relationship: string } {
  const types: Record<string, any> = {
    'ISTJ': {
      name: '检查员型 - 细致、严谨、可靠',
      traits: ['务实', '注重事实', '有责任感', '条理清晰', '遵守规则'],
      career: ['会计师', '审计师', '工程师', '图书管理员', '数据库管理员'],
      relationship: '忠诚可靠的伴侣，重视承诺，但可能不擅长表达情感'
    },
    'ISFJ': {
      name: '保护者型 - 友善、忠诚、体贴',
      traits: ['默默付出', '关注他人需求', '有耐心', '忠诚可靠', '注重细节'],
      career: ['护士', '图书管理员', '行政助理', '教师', '社工'],
      relationship: '温柔体贴的伴侣，愿意为家人付出，需要被认可和感谢'
    },
    'INFJ': {
      name: '倡导者型 - 理想主义、有洞察力',
      traits: ['有远见', '理想主义', '深刻洞察', '富有创造力', '善于倾听'],
      career: ['心理咨询师', '作家', '艺术家', '非营利组织工作者', 'HR'],
      relationship: '追求深度连接的伴侣，重视精神契合，需要个人空间'
    },
    'INTJ': {
      name: '战略家型 - 独立、果断、有远见',
      traits: ['独立思考', '战略性强', '追求效率', '自信', '创新'],
      career: ['科学家', '工程师', 'CEO', '战略顾问', '架构师'],
      relationship: '理性独立的伴侣，重视智力匹配，需要互相尊重'
    },
    'ISTP': {
      name: '冒险家型 - 灵活、务实、冷静',
      traits: ['善于解决问题', '动手能力强', '冷静', '灵活应变', '喜欢冒险'],
      career: ['工程师', '飞行员', '赛车手', '机械师', '程序员'],
      relationship: '独立自主的伴侣，需要自由空间，行动胜于言语'
    },
    'ISFP': {
      name: '艺术家型 - 温和、敏感、有审美',
      traits: ['热爱艺术', '温和友善', '活在当下', '忠于内心', '灵活'],
      career: ['艺术家', '设计师', '音乐家', '摄影师', '兽医'],
      relationship: '温柔体贴的伴侣，重视和谐，需要情感支持'
    },
    'INFP': {
      name: '治愈者型 - 理想主义、忠诚、有热情',
      traits: ['内心充满热情', '理想主义', '忠诚', '富有创意', '善解人意'],
      career: ['作家', '心理咨询师', '艺术家', '教师', '非营利组织'],
      relationship: '忠诚的理想主义者，追求灵魂伴侣，需要被理解'
    },
    'INTP': {
      name: '思考者型 - 逻辑、创新、好奇',
      traits: ['逻辑严密', '热爱理论', '创新思维', '好奇心强', '分析能力强'],
      career: ['科学家', '程序员', '哲学家', '研究员', '系统分析师'],
      relationship: '理性的思考者，重视智力交流，需要独处时间'
    },
    'ESTP': {
      name: '实践者型 - 精力充沛、务实、灵活',
      traits: ['善于社交', '灵活应变', '冒险精神', '解决问题', '行动派'],
      career: ['销售', '企业家', '运动员', '警察', '消防员'],
      relationship: '活力四射的伴侣，喜欢新鲜刺激，需要保持趣味性'
    },
    'ESFP': {
      name: '表演者型 - 热情、开朗、享受生活',
      traits: ['热爱社交', '乐观积极', '善于表达', '享受当下', '有感染力'],
      career: ['演员', '销售', '活动策划', '导游', '公关'],
      relationship: '热情洋溢的伴侣，擅长制造快乐，需要关注和欣赏'
    },
    'ENFP': {
      name: '激励者型 - 热情、创意、有感染力',
      traits: ['充满热情', '富有创意', '善于沟通', '乐观', '适应力强'],
      career: ['作家', '心理咨询师', '市场营销', '公关', '企业家'],
      relationship: '充满热情的伴侣，喜欢新鲜事物，需要情感连接'
    },
    'ENTP': {
      name: '辩论家型 - 机智、创新、善于辩论',
      traits: ['聪明机智', '热爱挑战', '创新思维', '善于辩论', '适应力强'],
      career: ['律师', '企业家', '发明家', '营销', '战略顾问'],
      relationship: '充满智慧的伴侣，喜欢思想碰撞，需要智力刺激'
    },
    'ESTJ': {
      name: '监督者型 - 务实、果断、有组织力',
      traits: ['果断', '有组织', '注重效率', '负责任', '善于管理'],
      career: ['经理', '法官', '警察', '项目经理', '军人'],
      relationship: '负责任的伴侣，重视家庭秩序，需要尊重和认可'
    },
    'ESFJ': {
      name: '支持者型 - 友善、热心、有责任感',
      traits: ['热心助人', '善于合作', '重视和谐', '有责任感', '务实'],
      career: ['护士', '教师', '销售', '行政', '社工'],
      relationship: '体贴照顾的伴侣，重视家庭和谐，需要情感回馈'
    },
    'ENFJ': {
      name: '教育家型 - 有魅力、善于激励、有远见',
      traits: ['有魅力', '善于沟通', '激励他人', '有远见', '热心助人'],
      career: ['教师', '心理咨询师', 'HR', '公关', '非营利组织'],
      relationship: '魅力十足的伴侣，重视深度关系，需要真诚交流'
    },
    'ENTJ': {
      name: '指挥官型 - 自信、果断、有战略眼光',
      traits: ['自信', '果断', '有战略眼光', '善于领导', '追求卓越'],
      career: ['CEO', '企业家', '律师', '政治家', '高管'],
      relationship: '强势独立的伴侣，重视互相成就，需要平等尊重'
    }
  }
  
  return types[type] || {
    name: '探索者型',
    traits: ['独特', '有潜力', '不断成长'],
    career: ['多种可能'],
    relationship: '独特的个体，需要相互理解'
  }
}

// 生成 MBTI 个性化建议
function generateMBTISuggestion(type: string, scores: { eiAvg: number; snAvg: number; tfAvg: number; jpAvg: number }): string {
  const typeInfo = getMBTIDetailedDescription(type)
  
  let suggestion = `您的MBTI人格类型是：${typeInfo.name}\n\n`
  suggestion += `【性格特点】\n${typeInfo.traits.join('、')}\n\n`
  suggestion += `【适合职业】\n${typeInfo.career.join('、')}\n\n`
  suggestion += `【人际关系】\n${typeInfo.relationship}\n\n`
  
  // 添加维度倾向分析
  suggestion += `【维度倾向】\n`
  suggestion += `• ${scores.eiAvg > 2.5 ? '外向(E)' : '内向(I)'}倾向：${scores.eiAvg > 2.5 ? '您倾向于从外部世界获取能量' : '您倾向于从内心世界获取能量'}\n`
  suggestion += `• ${scores.snAvg > 2.5 ? '实感(S)' : '直觉(N)'}倾向：${scores.snAvg > 2.5 ? '您更关注具体事实和细节' : '您更关注整体和未来可能性'}\n`
  suggestion += `• ${scores.tfAvg > 2.5 ? '思考(T)' : '情感(F)'}倾向：${scores.tfAvg > 2.5 ? '您做决定更依赖逻辑分析' : '您做决定更考虑情感因素'}\n`
  suggestion += `• ${scores.jpAvg > 2.5 ? '判断(J)' : '感知(P)'}倾向：${scores.jpAvg > 2.5 ? '您喜欢有计划有条理的生活' : '您喜欢灵活随性的生活'}\n\n`
  
  suggestion += `【成长建议】\n`
  suggestion += `• 了解自己的性格特点，发挥优势，接纳不足\n`
  suggestion += `• 尝试理解不同类型的人，提升沟通和协作能力\n`
  suggestion += `• 在工作生活中找到适合自己性格的发展路径\n`
  suggestion += `• 记住：每种性格类型都有其独特的价值`
  
  return suggestion
}

// SCCS 评分函数
function scoreSCCS(answers: Record<number, number>): ScoringResult {
  // 初始化各维度分数
  let disharmonyScore = 0  // 自我与经验的不和谐
  let flexibilityScore = 0 // 自我的灵活性
  let rigidityScore = 0    // 自我的刻板性
  
  let disharmonyCount = 0
  let flexibilityCount = 0
  let rigidityCount = 0
  
  // 遍历所有答案计算分数
  Object.entries(answers).forEach(([qid, value]) => {
    const id = parseInt(qid)
    
    if (id >= 1 && id <= 16) {
      // 维度1：自我与经验的不和谐（正向计分）
      disharmonyScore += value
      disharmonyCount++
    } else if (id >= 17 && id <= 28) {
      // 维度2：自我的灵活性（反向计分）
      // 反向计分：1→5, 2→4, 3→3, 4→2, 5→1
      flexibilityScore += 6 - value
      flexibilityCount++
    } else if (id >= 29 && id <= 35) {
      // 维度3：自我的刻板性（正向计分）
      rigidityScore += value
      rigidityCount++
    }
  })
  
  // 计算各维度总分和均分
  const disharmonyTotal = disharmonyScore
  const flexibilityTotal = flexibilityScore
  const rigidityTotal = rigidityScore
  
  const disharmonyAvg = disharmonyCount > 0 ? disharmonyScore / disharmonyCount : 3
  const flexibilityAvg = flexibilityCount > 0 ? flexibilityScore / flexibilityCount : 3
  const rigidityAvg = rigidityCount > 0 ? rigidityScore / rigidityCount : 3
  
  // 计算综合和谐指数
  // 公式：(6 - 不和谐均分) * 0.5 + 灵活性均分 * 0.3 + (6 - 刻板性均分) * 0.2
  const harmonyIndex = (6 - disharmonyAvg) * 0.5 + flexibilityAvg * 0.3 + (6 - rigidityAvg) * 0.2
  
  // 确定和谐等级
  let harmonyLevel = ''
  let harmonyColor = ''
  let harmonyDesc = ''
  
  if (harmonyIndex >= 4.5) {
    harmonyLevel = '高度和谐'
    harmonyColor = '#3d6a4f'
    harmonyDesc = '你拥有良好的自我和谐度。你的内心世界与外在经验能够较好地整合，面对变化时灵活从容，同时保持开放的心态。这种状态有助于心理健康和个人成长。'
  } else if (harmonyIndex >= 3.5) {
    harmonyLevel = '比较和谐'
    harmonyColor = '#5e8c6f'
    harmonyDesc = '你的自我和谐度处于良好水平。大多数时候你能够接纳自己，适应环境。可能在特定情境下会感到一些内心冲突，但整体上能够保持平衡。'
  } else if (harmonyIndex >= 2.5) {
    harmonyLevel = '一般'
    harmonyColor = '#8b6919'
    harmonyDesc = '你的自我和谐度处于中等水平。你可能会在某些方面感到内心矛盾或难以适应变化。建议多关注自己的内心感受，尝试以更开放和灵活的态度面对自己和周围的世界。'
  } else if (harmonyIndex >= 1.5) {
    harmonyLevel = '不太和谐'
    harmonyColor = '#8b3d1f'
    harmonyDesc = '你的自我和谐度偏低，可能经常感到内心冲突、难以适应变化，或者固守着某些观念难以改变。建议你寻求心理咨询师的帮助，探索内心的矛盾，学习更灵活的应对方式。'
  } else {
    harmonyLevel = '严重不和谐'
    harmonyColor = '#8b1a1a'
    harmonyDesc = '你的自我和谐度较低，内心冲突可能较为严重。我们真诚地建议你考虑寻求专业心理咨询师的帮助，系统性地探索自我，学习接纳自己、调节情绪的方法。请记住，求助是勇敢和智慧的表现。'
  }
  
  // 生成各维度描述
  const getDimensionDesc = (dim: string, avg: number): string => {
    if (dim === 'disharmony') {
      if (avg <= 2.0) return '自我与经验高度和谐，内心一致性强'
      if (avg <= 3.0) return '自我与经验基本和谐，偶尔感到矛盾'
      if (avg <= 4.0) return '自我与经验存在较明显的不一致'
      return '自我与经验严重不和谐，内心冲突较多'
    } else if (dim === 'flexibility') {
      if (avg >= 4.0) return '自我灵活性很高，适应能力强'
      if (avg >= 3.0) return '自我灵活性较好，能够应对变化'
      if (avg >= 2.0) return '自我灵活性一般，有时难以适应变化'
      return '自我灵活性较低，面对变化时可能感到困难'
    } else {
      if (avg <= 2.0) return '自我概念开放灵活，不固守成规'
      if (avg <= 3.0) return '自我概念有一定弹性，偶尔表现得刻板'
      if (avg <= 4.0) return '自我概念偏刻板，习惯按固定方式行事'
      return '自我概念非常刻板，难以改变固有观念'
    }
  }
  
  // 构建建议文本
  const suggestion = `
【综合自我和谐指数】
和谐等级：${harmonyLevel}
综合指数：${harmonyIndex.toFixed(2)} / 5.00
${harmonyDesc}

【各维度详细分析】

🌊 自我与经验的不和谐
总分：${disharmonyTotal} 分 | 每题均分：${disharmonyAvg.toFixed(2)} / 5.00
${getDimensionDesc('disharmony', disharmonyAvg)}
${disharmonyAvg > 3 ? '建议：关注内心冲突，学习接纳自己的感受，尝试理解矛盾背后的需求。' : '建议：继续保持良好的自我认知，定期反思和调整。'}

🌿 自我的灵活性
总分：${flexibilityTotal} 分 | 每题均分：${flexibilityAvg.toFixed(2)} / 5.00
${getDimensionDesc('flexibility', flexibilityAvg)}
${flexibilityAvg < 3 ? '建议：尝试用不同方式解决问题，培养适应变化的能力，保持开放心态。' : '建议：继续保持灵活性，同时注意在变化中保持核心价值。'}

🪨 自我的刻板性
总分：${rigidityTotal} 分 | 每题均分：${rigidityAvg.toFixed(2)} / 5.00
${getDimensionDesc('rigidity', rigidityAvg)}
${rigidityAvg > 3 ? '建议：尝试接纳不同观点，培养灵活的思维方式，减少固有观念的限制。' : '建议：保持开放心态，继续探索新的可能性。'}

【成长建议】
• 自我和谐是一个动态发展的过程，需要持续的自我觉察和调整
• 接纳自己的不完美，允许自己在成长中犯错和学习
• 建立健康的支持系统，与他人分享内心感受
• 如果需要，可以寻求专业心理咨询师的帮助，进行更深入的自我探索
  `
  
  return {
    totalScore: Math.round(harmonyIndex * 20), // 转换为百分制
    maxScore: 100,
    level: harmonyLevel,
    suggestion: suggestion,
    severity: 1 - (harmonyIndex / 5), // 严重程度（越低越和谐）
    dimensionScores: {
      disharmony: { total: disharmonyTotal, avg: disharmonyAvg, desc: getDimensionDesc('disharmony', disharmonyAvg) },
      flexibility: { total: flexibilityTotal, avg: flexibilityAvg, desc: getDimensionDesc('flexibility', flexibilityAvg) },
      rigidity: { total: rigidityTotal, avg: rigidityAvg, desc: getDimensionDesc('rigidity', rigidityAvg) },
      harmonyIndex: harmonyIndex,
      harmonyLevel: harmonyLevel
    }
  }
}

// 气质类型评分函数
function scoreTemperament(answers: Record<number, number>): ScoringResult {
  // 初始化各维度分数
  let cholericScore = 0   // 胆汁质
  let sanguineScore = 0   // 多血质
  let phlegmaticScore = 0 // 粘液质
  let melancholicScore = 0 // 抑郁质
  
  // 各维度题目数量
  let cholericCount = 0
  let sanguineCount = 0
  let phlegmaticCount = 0
  let melancholicCount = 0
  
  // 题目维度映射（基于题目ID和维度类型）
  // 胆汁质题号: 2,6,9,14,17,21,27,31,36,38,42,48,50,54,58
  const cholericItems = [2, 6, 9, 14, 17, 21, 27, 31, 36, 38, 42, 48, 50, 54, 58]
  // 多血质题号: 4,8,11,16,19,23,25,29,34,40,44,46,52,56,60
  const sanguineItems = [4, 8, 11, 16, 19, 23, 25, 29, 34, 40, 44, 46, 52, 56, 60]
  // 粘液质题号: 1,7,10,13,18,22,26,30,33,39,43,45,49,55,57
  const phlegmaticItems = [1, 7, 10, 13, 18, 22, 26, 30, 33, 39, 43, 45, 49, 55, 57]
  // 抑郁质题号: 3,5,12,15,20,24,28,32,35,37,41,47,51,53,59
  const melancholicItems = [3, 5, 12, 15, 20, 24, 28, 32, 35, 37, 41, 47, 51, 53, 59]
  
  // 遍历所有答案计算分数
  Object.entries(answers).forEach(([qid, value]) => {
    const id = parseInt(qid)
    
    if (cholericItems.includes(id)) {
      cholericScore += value
      cholericCount++
    } else if (sanguineItems.includes(id)) {
      sanguineScore += value
      sanguineCount++
    } else if (phlegmaticItems.includes(id)) {
      phlegmaticScore += value
      phlegmaticCount++
    } else if (melancholicItems.includes(id)) {
      melancholicScore += value
      melancholicCount++
    }
  })
  
  // 计算各维度得分（总分范围：-30 到 30）
  const scores = {
    choleric: cholericScore,
    sanguine: sanguineScore,
    phlegmatic: phlegmaticScore,
    melancholic: melancholicScore
  }
  
  // 确定主要气质类型
  const sortedTypes = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const primaryType = sortedTypes[0][0]
  const primaryScore = sortedTypes[0][1]
  const secondaryType = sortedTypes[1][0]
  const secondaryScore = sortedTypes[1][1]
  const scoreDiff = primaryScore - secondaryScore
  
  // 判断气质类型
  let temperamentType = ''
  let temperamentDesc = ''
  
  if (scoreDiff >= 4) {
    // 单一气质类型
    temperamentType = getTemperamentName(primaryType)
    temperamentDesc = getTemperamentDescription(primaryType, true)
  } else if (scoreDiff >= 0) {
    // 混合气质类型
    temperamentType = `${getTemperamentName(primaryType)}-${getTemperamentName(secondaryType)}混合型`
    temperamentDesc = getMixedTemperamentDescription(primaryType, secondaryType)
  } else {
    temperamentType = getTemperamentName(primaryType)
    temperamentDesc = getTemperamentDescription(primaryType, false)
  }
  
  // 判断典型性
  let typicalLevel = ''
  if (primaryScore > 20) {
    typicalLevel = '典型'
  } else if (primaryScore >= 10) {
    typicalLevel = '一般'
  } else {
    typicalLevel = '倾向'
  }
  
  // 生成详细建议
  const suggestion = generateTemperamentSuggestion(scores, temperamentType, typicalLevel)
  
  return {
    totalScore: primaryScore,
    maxScore: 30,
    level: `${typicalLevel}${temperamentType}`,
    suggestion: suggestion,
    severity: 0,
    dimensionScores: {
      choleric: { score: cholericScore, name: '胆汁质', icon: '🔥', desc: getTemperamentShortDesc('choleric') },
      sanguine: { score: sanguineScore, name: '多血质', icon: '💧', desc: getTemperamentShortDesc('sanguine') },
      phlegmatic: { score: phlegmaticScore, name: '粘液质', icon: '🌱', desc: getTemperamentShortDesc('phlegmatic') },
      melancholic: { score: melancholicScore, name: '抑郁质', icon: '🌙', desc: getTemperamentShortDesc('melancholic') },
      primaryType: primaryType,
      secondaryType: secondaryType,
      typicalLevel: typicalLevel
    }
  }
}

// 获取气质类型名称
function getTemperamentName(type: string): string {
  const names: Record<string, string> = {
    choleric: '胆汁质',
    sanguine: '多血质',
    phlegmatic: '粘液质',
    melancholic: '抑郁质'
  }
  return names[type] || type
}

// 获取气质类型简要描述
function getTemperamentShortDesc(type: string): string {
  const descs: Record<string, string> = {
    choleric: '精力旺盛、热情直率、易冲动',
    sanguine: '活泼好动、善于交际、反应快',
    phlegmatic: '安静稳重、耐心细致、有自制力',
    melancholic: '敏感细腻、思考深入、情绪体验深刻'
  }
  return descs[type] || ''
}

// 获取气质类型详细描述
function getTemperamentDescription(type: string, isTypical: boolean): string {
  const descriptions: Record<string, string> = {
    choleric: `【胆汁质特点】
• 精力旺盛，行动迅速，反应强烈
• 热情直率，情感体验强烈而持久
• 意志坚强，不怕挫折，勇敢果断
• 但容易冲动，脾气急躁，缺乏耐心
• 思维敏捷但有时粗枝大叶

【适合的工作】
• 需要快速反应和决断力的工作
• 具有挑战性和竞争性的环境
• 如：企业家、运动员、军人、外科医生

${isTypical ? '【发展建议】\n• 学习情绪管理，培养耐心\n• 做事前多思考，避免冲动决策\n• 发挥热情和行动力的优势' : ''}`,

    sanguine: `【多血质特点】
• 活泼好动，反应灵敏，善于交际
• 情绪丰富且外露，容易适应新环境
• 兴趣广泛，机智灵活
• 但注意力易转移，兴趣易变化
• 做事可能不够深入持久

【适合的工作】
• 需要灵活应变和沟通能力的工作
• 变化多样的工作环境
• 如：销售、公关、教师、导游、主持人

${isTypical ? '【发展建议】\n• 培养专注力，做事有始有终\n• 深化专业知识，避免浅尝辄止\n• 发挥社交优势和适应能力' : ''}`,

    phlegmatic: `【粘液质特点】
• 安静稳重，反应沉稳，情绪不易外露
• 耐心细致，善于忍耐和坚持
• 注意力稳定，做事有条不紊
• 生活有规律，自制力强
• 但行动较慢，适应新环境较慢

【适合的工作】
• 需要耐心和细致的工作
• 规律性强的环境
• 如：会计、图书管理员、科研人员、工程师

${isTypical ? '【发展建议】\n• 适当培养灵活性，接受新事物\n• 提高决策速度，避免过度犹豫\n• 发挥稳重和持久的优势' : ''}`,

    melancholic: `【抑郁质特点】
• 情感体验深刻、持久，内心世界丰富
• 敏感细腻，善于觉察细微变化
• 思考深入，有艺术天赋
• 做事认真负责，追求完美
• 但容易多愁善感，行动较迟缓

【适合的工作】
• 需要细致观察和深入思考的工作
• 安静独立的工作环境
• 如：艺术家、作家、心理咨询师、设计师

${isTypical ? '【发展建议】\n• 学会调节情绪，培养乐观心态\n• 增强自信心，减少过度思虑\n• 发挥敏感和创造力的优势' : ''}`
  }
  return descriptions[type] || ''
}

// 获取混合气质类型描述
function getMixedTemperamentDescription(type1: string, type2: string): string {
  const name1 = getTemperamentName(type1)
  const name2 = getTemperamentName(type2)
  
  return `您的气质类型为【${name1}-${name2}混合型】，兼具两种气质的特点。
  
您既有${name1}的${getTemperamentShortDesc(type1)}，
又带有${name2}的${getTemperamentShortDesc(type2)}。

这种混合型气质让您在不同情境下能够灵活调整，既有${name1}的行动力，又有${name2}的稳定性。

【成长建议】
• 了解自己的双重特质，在不同场合发挥相应优势
• 注意平衡两种气质的优缺点
• 培养自我觉察能力，找到最适合自己的发展路径`
}

// 生成气质类型综合建议
function generateTemperamentSuggestion(
  scores: Record<string, number>, 
  type: string, 
  typicalLevel: string
): string {
  let suggestion = `【气质类型分析结果】

`
  
  suggestion += `您的气质类型为：${type}（${typicalLevel}型）
`
  
  suggestion += `
【各维度得分】
🔥 胆汁质：${scores.choleric} 分
💧 多血质：${scores.sanguine} 分
🌱 粘液质：${scores.phlegmatic} 分
🌙 抑郁质：${scores.melancholic} 分

【说明】
• 得分越高，说明越具有该气质类型的典型特征
• 单项超过20分为典型，10-20分为一般，低于10分为倾向
• 分差小于4分时可能为混合型气质

【重要提示】
气质是与生俱来的心理特征，没有好坏之分。每种气质都有其独特的优势和需要注意的方面。了解自己的气质类型，可以帮助您：
• 选择更适合的学习和工作方式
• 在人际交往中更好地理解自己和他人
• 发挥自身优势，接纳自己的特点

请记住：气质类型不是限制，而是认识自我的起点。`
  
  return suggestion
}

// BDC 评分函数
function scoreBDC(answers: Record<number, number>): ScoringResult {
  // 计算总分（所有题目得分相加）
  let totalScore = 0
  for (let i = 1; i <= 15; i++) {
    totalScore += answers[i] || 0
  }
  
  // 根据总分确定抑郁程度
  let level = ''
  let suggestion = ''
  let severity = 0
  
  if (totalScore <= 4) {
    level = '没有抑郁症'
    suggestion = '您的心理状态良好，请继续保持健康的生活方式。\n\n建议：\n• 保持规律作息\n• 适当运动\n• 与家人朋友保持良好沟通'
    severity = 0.1
  } else if (totalScore <= 10) {
    level = '偶尔有抑郁情绪'
    suggestion = '您偶尔会有抑郁情绪，这是正常的，但值得关注。\n\n建议：\n• 保持规律作息，保证充足睡眠\n• 多与朋友家人交流，分享感受\n• 适当运动，如散步、瑜伽\n• 培养兴趣爱好，丰富生活'
    severity = 0.25
  } else if (totalScore <= 20) {
    level = '轻度抑郁'
    suggestion = '您可能存在轻度抑郁倾向。\n\n建议：\n• 关注自己的情绪变化，记录心情日记\n• 增加社交活动，避免孤立\n• 尝试正念冥想或深呼吸放松\n• 考虑寻求心理咨询师的帮助\n• 学习压力管理和情绪调节技巧'
    severity = 0.5
  } else if (totalScore <= 30) {
    level = '中度抑郁'
    suggestion = '您存在中度抑郁倾向。\n\n建议：\n• 尽快寻求专业心理咨询帮助\n• 建议前往医院心理科或精神科就诊\n• 评估是否需要药物治疗配合心理治疗\n• 建立支持系统，告知信任的人\n• 避免重大决定，给自己时间恢复\n• 学习认知行为疗法技巧'
    severity = 0.75
  } else {
    level = '严重抑郁'
    suggestion = '您存在严重抑郁倾向，请立即采取行动！\n\n紧急建议：\n• 立即寻求精神科医生帮助\n• 告知家人或信任的朋友您的状况\n• 24小时心理援助热线：400-161-9995\n• 如有自伤念头，请立即前往医院急诊\n• 请记住：寻求帮助是勇敢和智慧的表现，您并不孤单'
    severity = 0.95
  }
  
  return {
    totalScore,
    maxScore: 45,
    level,
    suggestion,
    severity,
    dimensionScores: {
      totalScore,
      maxScore: 45,
      scorePercentage: (totalScore / 45) * 100
    }
  }
}

// EPQ 评分函数
function scoreEPQ(answers: Record<number, number>): ScoringResult {
  // 各维度得分
  const scores = { E: 0, N: 0, P: 0, L: 0 }
  const counts = { E: 0, N: 0, P: 0, L: 0 }
  
  // 根据题目映射计算得分
  for (let i = 1; i <= 88; i++) {
    const answer = answers[i]
    if (answer === undefined) continue
    
    // 根据题目ID判断属于哪个维度以及是否反向计分
    const scaleInfo = getEPQScaleInfo(i)
    if (!scaleInfo) continue
    
    let score = answer  // answer 是 1（是）或 0（否）
    if (scaleInfo.reverse) {
      // 反向计分：答"是"得0分，答"否"得1分
      score = 1 - answer
    }
    
    scores[scaleInfo.scale] += score
    counts[scaleInfo.scale]++
  }
  
  // 原始分数
  const rawScores = {
    E: scores.E,
    N: scores.N,
    P: scores.P,
    L: scores.L
  }
  
  // 将原始分数转换为 T 分数（标准分）
  // T = 50 + 10 * (X - M) / SD
  // 使用标准常模（中国常模）
  const tScores = convertToTScores(rawScores)
  
  // 生成结果报告
  const suggestion = generateEPQReport(tScores, rawScores)
  
  // 确定主要人格特征（T分最高的维度）
  const maxT = Math.max(tScores.E, tScores.N, tScores.P)
  let primaryType = ''
  if (tScores.E === maxT) primaryType = 'E'
  else if (tScores.N === maxT) primaryType = 'N'
  else primaryType = 'P'
  
  return {
    totalScore: tScores.E,  // 主要用E分作为总分参考
    maxScore: 100,
    level: `${epqScales[primaryType].name}型人格`,
    suggestion: suggestion,
    severity: 0,
    dimensionScores: {
      E: { raw: rawScores.E, tScore: tScores.E, name: epqScales.E.name, desc: getEPQLevelDesc('E', tScores.E) },
      N: { raw: rawScores.N, tScore: tScores.N, name: epqScales.N.name, desc: getEPQLevelDesc('N', tScores.N) },
      P: { raw: rawScores.P, tScore: tScores.P, name: epqScales.P.name, desc: getEPQLevelDesc('P', tScores.P) },
      L: { raw: rawScores.L, tScore: tScores.L, name: epqScales.L.name, desc: getEPQValidityDesc(tScores.L) }
    }
  }
}

// 获取题目信息（维度、是否反向计分）
function getEPQScaleInfo(id: number): { scale: 'E' | 'N' | 'P' | 'L'; reverse: boolean } | null {
  // 定义所有题目的维度映射
  const scaleMap: Record<number, { scale: 'E' | 'N' | 'P' | 'L'; reverse: boolean }> = {
    // E量表
    1: { scale: 'E', reverse: false }, 5: { scale: 'E', reverse: false }, 10: { scale: 'E', reverse: false },
    13: { scale: 'E', reverse: false }, 14: { scale: 'E', reverse: false }, 17: { scale: 'E', reverse: false },
    21: { scale: 'E', reverse: true }, 25: { scale: 'E', reverse: false }, 29: { scale: 'E', reverse: true },
    33: { scale: 'E', reverse: false }, 37: { scale: 'E', reverse: false }, 41: { scale: 'E', reverse: false },
    45: { scale: 'E', reverse: true }, 49: { scale: 'E', reverse: false }, 53: { scale: 'E', reverse: false },
    55: { scale: 'E', reverse: false }, 61: { scale: 'E', reverse: false }, 65: { scale: 'E', reverse: false },
    71: { scale: 'E', reverse: false }, 80: { scale: 'E', reverse: false }, 84: { scale: 'E', reverse: false },
    
    // N量表
    3: { scale: 'N', reverse: false }, 7: { scale: 'N', reverse: false }, 12: { scale: 'N', reverse: false },
    15: { scale: 'N', reverse: false }, 19: { scale: 'N', reverse: false }, 23: { scale: 'N', reverse: false },
    27: { scale: 'N', reverse: false }, 31: { scale: 'N', reverse: false }, 35: { scale: 'N', reverse: false },
    39: { scale: 'N', reverse: false }, 43: { scale: 'N', reverse: false }, 47: { scale: 'N', reverse: false },
    51: { scale: 'N', reverse: false }, 57: { scale: 'N', reverse: false }, 59: { scale: 'N', reverse: false },
    63: { scale: 'N', reverse: false }, 67: { scale: 'N', reverse: false }, 69: { scale: 'N', reverse: false },
    73: { scale: 'N', reverse: false }, 74: { scale: 'N', reverse: false }, 77: { scale: 'N', reverse: false },
    78: { scale: 'N', reverse: false }, 82: { scale: 'N', reverse: false }, 86: { scale: 'N', reverse: false },
    
    // P量表 - 反向计分题
    2: { scale: 'P', reverse: true }, 6: { scale: 'P', reverse: true }, 9: { scale: 'P', reverse: true },
    11: { scale: 'P', reverse: true }, 18: { scale: 'P', reverse: true }, 38: { scale: 'P', reverse: true },
    42: { scale: 'P', reverse: true }, 56: { scale: 'P', reverse: true }, 62: { scale: 'P', reverse: true },
    72: { scale: 'P', reverse: true }, 88: { scale: 'P', reverse: true },
    // P量表 - 正向计分题
    22: { scale: 'P', reverse: false }, 26: { scale: 'P', reverse: false }, 30: { scale: 'P', reverse: false },
    34: { scale: 'P', reverse: false }, 46: { scale: 'P', reverse: false }, 50: { scale: 'P', reverse: false },
    66: { scale: 'P', reverse: false }, 68: { scale: 'P', reverse: false }, 75: { scale: 'P', reverse: false },
    76: { scale: 'P', reverse: false }, 81: { scale: 'P', reverse: false }, 85: { scale: 'P', reverse: false },
    
    // L量表 - 反向计分题
    4: { scale: 'L', reverse: true }, 8: { scale: 'L', reverse: true }, 16: { scale: 'L', reverse: true },
    24: { scale: 'L', reverse: true }, 28: { scale: 'L', reverse: true }, 40: { scale: 'L', reverse: true },
    44: { scale: 'L', reverse: true }, 48: { scale: 'L', reverse: true }, 52: { scale: 'L', reverse: true },
    54: { scale: 'L', reverse: true }, 60: { scale: 'L', reverse: true }, 64: { scale: 'L', reverse: true },
    70: { scale: 'L', reverse: true }, 79: { scale: 'L', reverse: true }, 83: { scale: 'L', reverse: true },
    // L量表 - 正向计分题
    20: { scale: 'L', reverse: false }, 32: { scale: 'L', reverse: false }, 36: { scale: 'L', reverse: false },
    58: { scale: 'L', reverse: false }, 87: { scale: 'L', reverse: false }
  }
  
  return scaleMap[id] || null
}

// 将原始分数转换为 T 分数（使用中国常模）
function convertToTScores(raw: { E: number; N: number; P: number; L: number }): { E: number; N: number; P: number; L: number } {
  // 中国常模数据（男性）
  // E量表: M=11.16, SD=4.41
  // N量表: M=9.06, SD=4.75
  // P量表: M=5.68, SD=3.09
  // L量表: M=12.51, SD=3.57
  
  const tScores = {
    E: 50 + 10 * (raw.E - 11.16) / 4.41,
    N: 50 + 10 * (raw.N - 9.06) / 4.75,
    P: 50 + 10 * (raw.P - 5.68) / 3.09,
    L: 50 + 10 * (raw.L - 12.51) / 3.57
  }
  
  // 限制范围在 0-100 之间
  for (const key of ['E', 'N', 'P', 'L'] as const) {
    tScores[key] = Math.min(100, Math.max(0, Math.round(tScores[key])))
  }
  
  return tScores
}

// 获取维度水平描述
function getEPQLevelDesc(scale: string, tScore: number): string {
  if (tScore >= 61.5) return '典型高分'
  if (tScore >= 56.7) return '倾向高分'
  if (tScore <= 38.5) return '典型低分'
  if (tScore <= 43.3) return '倾向低分'
  return '中间型'
}

// 获取效度描述
function getEPQValidityDesc(tScore: number): string {
  if (tScore >= 60) {
    return '您的回答可能存在掩饰倾向，结果可信度较低。建议在放松状态下重新作答。'
  }
  if (tScore >= 50) {
    return '您的回答基本可信，但有一定掩饰倾向。'
  }
  return '您的回答真实可信。'
}

// 生成 EPQ 综合报告
function generateEPQReport(tScores: { E: number; N: number; P: number; L: number }, raw: { E: number; N: number; P: number; L: number }): string {
  let report = '【艾森克人格问卷结果分析】\n\n'
  
  // 各维度详细分析
  report += '一、各维度得分分析\n\n'
  
  // E量表（内外向）
  report += `1. 内外向（E量表）：${tScores.E}分（${getEPQLevelDesc('E', tScores.E)}）\n`
  if (tScores.E >= 56.7) {
    report += `   ${epqInterpretation.E.high}\n`
  } else if (tScores.E <= 43.3) {
    report += `   ${epqInterpretation.E.low}\n`
  } else {
    report += `   您属于中间型，兼具内外向的特点，在社交场合既能活跃也能安静。\n`
  }
  report += `   原始分：${raw.E}/21\n\n`
  
  // N量表（神经质）
  report += `2. 神经质（N量表）：${tScores.N}分（${getEPQLevelDesc('N', tScores.N)}）\n`
  if (tScores.N >= 56.7) {
    report += `   ${epqInterpretation.N.high}\n`
  } else if (tScores.N <= 43.3) {
    report += `   ${epqInterpretation.N.low}\n`
  } else {
    report += `   您情绪稳定性中等，大多数时候能够保持平和，偶尔会有情绪波动。\n`
  }
  report += `   原始分：${raw.N}/24\n\n`
  
  // P量表（精神质）
  report += `3. 精神质（P量表）：${tScores.P}分（${getEPQLevelDesc('P', tScores.P)}）\n`
  if (tScores.P >= 56.7) {
    report += `   ${epqInterpretation.P.high}\n`
  } else if (tScores.P <= 43.3) {
    report += `   ${epqInterpretation.P.low}\n`
  } else {
    report += `   您具有适度的精神质倾向，能够与人保持良好关系，同时保持独立思考。\n`
  }
  report += `   原始分：${raw.P}/23\n\n`
  
  // L量表（效度）
  report += `二、效度分析\n\n`
  report += `掩饰性（L量表）：${tScores.L}分\n`
  report += `${epqInterpretation.L[tScores.L >= 60 ? 'high' : 'low']}\n`
  report += `原始分：${raw.L}/20\n\n`
  
  // 人格综合描述
  report += `三、人格综合描述\n\n`
  
  // 组合判断
  if (tScores.E >= 56.7 && tScores.N <= 43.3) {
    report += `• 您属于多血质类型：外向、稳定、乐观、善于社交，情绪稳定。\n`
  } else if (tScores.E >= 56.7 && tScores.N >= 56.7) {
    report += `• 您属于胆汁质类型：外向、不稳定、热情、易冲动，情绪波动较大。\n`
  } else if (tScores.E <= 43.3 && tScores.N <= 43.3) {
    report += `• 您属于粘液质类型：内向、稳定、安静、稳重，情绪平稳持久。\n`
  } else if (tScores.E <= 43.3 && tScores.N >= 56.7) {
    report += `• 您属于抑郁质类型：内向、不稳定、敏感、细腻，情绪体验深刻。\n`
  } else {
    report += `• 您属于混合型气质，在不同的情境下会表现出不同的人格特点。\n`
  }
  
  report += `\n【应用建议】\n`
  report += `• 了解自己的人格特点是自我成长的第一步\n`
  report += `• 发挥自己人格特质中的优势，接纳和完善不足\n`
  report += `• 在人际交往和工作学习中，找到适合自己性格的方式\n`
  report += `• 如果N分较高（情绪不稳定），建议学习情绪管理技巧\n`
  report += `• 如果P分较高，建议多关注他人感受，培养共情能力\n`
  
  if (tScores.L >= 60) {
    report += `\n⚠️ 温馨提示：由于您的L分较高，本次结果仅供参考。建议在放松状态下重新作答以获得更准确的结果。`
  }
  
  return report
}

// EPQ-RSC 评分函数
function scoreEPQRSC(answers: Record<number, number>): ScoringResult {
  // 各维度得分
  const scores = { E: 0, N: 0, P: 0, L: 0 }
  const counts = { E: 0, N: 0, P: 0, L: 0 }
  
  // 根据题目映射计算得分
  for (let i = 1; i <= 48; i++) {
    const answer = answers[i]
    if (answer === undefined) continue
    
    const scaleInfo = getEPQRSCScaleInfo(i)
    if (!scaleInfo) continue
    
    let score = answer  // answer 是 1（是）或 0（否）
    if (scaleInfo.reverse) {
      // 反向计分：答"是"得0分，答"否"得1分
      score = 1 - answer
    }
    
    scores[scaleInfo.scale] += score
    counts[scaleInfo.scale]++
  }
  
  // 原始分数
  const rawScores = {
    E: scores.E,
    N: scores.N,
    P: scores.P,
    L: scores.L
  }
  
  // 计算标准分（T分数）
  const tScores = convertToEPQRSC_TScores(rawScores)
  
  // 生成结果报告
  const suggestion = generateEPQRSCReport(tScores, rawScores)
  
  // 确定主要人格特征
  const maxT = Math.max(tScores.E, tScores.N, tScores.P)
  let primaryType = ''
  if (tScores.E === maxT) primaryType = 'E'
  else if (tScores.N === maxT) primaryType = 'N'
  else primaryType = 'P'
  
  return {
    totalScore: rawScores.E,
    maxScore: 48,
    level: `${epqRscScales[primaryType].name}倾向`,
    suggestion: suggestion,
    severity: 0,
    dimensionScores: {
      E: { raw: rawScores.E, tScore: tScores.E, name: epqRscScales.E.name, 
           highDesc: epqRscScales.E.highDesc, lowDesc: epqRscScales.E.lowDesc,
           level: getEPQRSCLevelDesc('E', tScores.E) },
      N: { raw: rawScores.N, tScore: tScores.N, name: epqRscScales.N.name,
           highDesc: epqRscScales.N.highDesc, lowDesc: epqRscScales.N.lowDesc,
           level: getEPQRSCLevelDesc('N', tScores.N) },
      P: { raw: rawScores.P, tScore: tScores.P, name: epqRscScales.P.name,
           highDesc: epqRscScales.P.highDesc, lowDesc: epqRscScales.P.lowDesc,
           level: getEPQRSCLevelDesc('P', tScores.P) },
      L: { raw: rawScores.L, tScore: tScores.L, name: epqRscScales.L.name,
           validity: getEPQRSCValidityDesc(tScores.L) }
    }
  }
}

// 获取题目信息（维度、是否反向计分）
function getEPQRSCScaleInfo(id: number): { scale: 'E' | 'N' | 'P' | 'L'; reverse: boolean } | null {
  const scaleMap: Record<number, { scale: 'E' | 'N' | 'P' | 'L'; reverse: boolean }> = {
    // E量表：正向（11题），反向（1题）
    3: { scale: 'E', reverse: false }, 7: { scale: 'E', reverse: false }, 11: { scale: 'E', reverse: false },
    15: { scale: 'E', reverse: false }, 19: { scale: 'E', reverse: false }, 23: { scale: 'E', reverse: false },
    27: { scale: 'E', reverse: true }, 32: { scale: 'E', reverse: false }, 36: { scale: 'E', reverse: false },
    41: { scale: 'E', reverse: false }, 44: { scale: 'E', reverse: false }, 48: { scale: 'E', reverse: false },
    
    // N量表：全部正向（12题）
    1: { scale: 'N', reverse: false }, 5: { scale: 'N', reverse: false }, 9: { scale: 'N', reverse: false },
    13: { scale: 'N', reverse: false }, 17: { scale: 'N', reverse: false }, 21: { scale: 'N', reverse: false },
    25: { scale: 'N', reverse: false }, 30: { scale: 'N', reverse: false }, 34: { scale: 'N', reverse: false },
    38: { scale: 'N', reverse: false }, 42: { scale: 'N', reverse: false }, 46: { scale: 'N', reverse: false },
    
    // P量表：正向（5题），反向（7题）
    10: { scale: 'P', reverse: false }, 14: { scale: 'P', reverse: false }, 22: { scale: 'P', reverse: false },
    31: { scale: 'P', reverse: false }, 39: { scale: 'P', reverse: false },
    2: { scale: 'P', reverse: true }, 6: { scale: 'P', reverse: true }, 18: { scale: 'P', reverse: true },
    26: { scale: 'P', reverse: true }, 28: { scale: 'P', reverse: true }, 35: { scale: 'P', reverse: true },
    43: { scale: 'P', reverse: true },
    
    // L量表：正向（3题），反向（8题）
    4: { scale: 'L', reverse: false }, 16: { scale: 'L', reverse: false }, 45: { scale: 'L', reverse: false },
    8: { scale: 'L', reverse: true }, 12: { scale: 'L', reverse: true }, 20: { scale: 'L', reverse: true },
    24: { scale: 'L', reverse: true }, 29: { scale: 'L', reverse: true }, 33: { scale: 'L', reverse: true },
    37: { scale: 'L', reverse: true }, 40: { scale: 'L', reverse: true }, 47: { scale: 'L', reverse: true }
  }
  
  return scaleMap[id] || null
}

// 将原始分数转换为 T 分数
function convertToEPQRSC_TScores(raw: { E: number; N: number; P: number; L: number }): { E: number; N: number; P: number; L: number } {
  // 中国常模数据
  // E量表：M≈7.5, SD≈3.2
  // N量表：M≈6.8, SD≈3.5
  // P量表：M≈3.5, SD≈2.5
  // L量表：M≈8.5, SD≈3.8
  
  const tScores = {
    E: 50 + 10 * (raw.E - 7.5) / 3.2,
    N: 50 + 10 * (raw.N - 6.8) / 3.5,
    P: 50 + 10 * (raw.P - 3.5) / 2.5,
    L: 50 + 10 * (raw.L - 8.5) / 3.8
  }
  
  // 限制范围在 0-100 之间
  for (const key of ['E', 'N', 'P', 'L'] as const) {
    tScores[key] = Math.min(100, Math.max(0, Math.round(tScores[key])))
  }
  
  return tScores
}

// 获取维度水平描述
function getEPQRSCLevelDesc(scale: string, tScore: number): string {
  if (tScore >= 61.5) return '典型高分'
  if (tScore >= 56.7) return '倾向高分'
  if (tScore <= 38.5) return '典型低分'
  if (tScore <= 43.3) return '倾向低分'
  return '中间型'
}

// 获取效度描述
function getEPQRSCValidityDesc(tScore: number): string {
  if (tScore >= 60) {
    return '您的回答可能存在掩饰倾向，结果可信度较低。建议在放松状态下重新作答。'
  }
  if (tScore >= 50) {
    return '您的回答基本可信。'
  }
  return '您的回答真实可信。'
}

// 生成 EPQ-RSC 综合报告
function generateEPQRSCReport(tScores: { E: number; N: number; P: number; L: number }, raw: { E: number; N: number; P: number; L: number }): string {
  let report = '【艾森克人格问卷简式量表（EPQ-RSC）结果分析】\n\n'
  report += '本量表由北京大学钱铭怡教授等修订，基于中国常模进行解释。\n\n'
  
  // 效度分析
  report += '一、效度分析\n\n'
  report += `掩饰性（L量表）：${tScores.L}分（原始分：${raw.L}/12）\n`
  report += `${getEPQRSCValidityDesc(tScores.L)}\n\n`
  
  if (tScores.L >= 60) {
    report += '⚠️ 温馨提示：由于L分较高，本次结果仅供参考。建议在放松状态下重新作答以获得更准确的结果。\n\n'
  }
  
  // 各维度详细分析
  report += '二、各维度得分分析\n\n'
  
  // E量表（内外向）
  report += `1. 内外向（E量表）：${tScores.E}分（${getEPQRSCLevelDesc('E', tScores.E)}）\n`
  report += `   原始分：${raw.E}/12\n`
  if (tScores.E >= 56.7) {
    report += `   ${epqRscScales.E.highDesc}\n`
    if (tScores.E >= 61.5) {
      report += '   ⚠️ 过高E分：需关注是否存在行为冲动、社交过度、注意力不集中等问题。\n'
    }
  } else if (tScores.E <= 43.3) {
    report += `   ${epqRscScales.E.lowDesc}\n`
    if (tScores.E <= 38.5) {
      report += '   ⚠️ 过低E分：需关注是否存在社交回避、自信心不足等问题。\n'
    }
  } else {
    report += '   您属于中间型，兼具内外向的特点，在社交场合既能活跃也能安静。\n'
  }
  report += '\n'
  
  // N量表（神经质）
  report += `2. 神经质（N量表）：${tScores.N}分（${getEPQRSCLevelDesc('N', tScores.N)}）\n`
  report += `   原始分：${raw.N}/12\n`
  if (tScores.N >= 56.7) {
    report += `   ${epqRscScales.N.highDesc}\n`
    if (tScores.N >= 61.5) {
      report += '   ⚠️ 过高N分：需关注情绪管理能力，可能存在焦虑、抑郁倾向。\n'
    }
  } else if (tScores.N <= 43.3) {
    report += `   ${epqRscScales.N.lowDesc}\n`
  } else {
    report += '   您情绪稳定性中等，大多数时候能够保持平和，偶尔会有情绪波动。\n'
  }
  report += '\n'
  
  // P量表（精神质）
  report += `3. 精神质（P量表）：${tScores.P}分（${getEPQRSCLevelDesc('P', tScores.P)}）\n`
  report += `   原始分：${raw.P}/12\n`
  if (tScores.P >= 56.7) {
    report += `   ${epqRscScales.P.highDesc}\n`
    if (tScores.P >= 61.5) {
      report += '   ⚠️ 过高P分：需关注人际关系和共情能力。\n'
    }
  } else if (tScores.P <= 43.3) {
    report += `   ${epqRscScales.P.lowDesc}\n`
  } else {
    report += '   您具有适度的精神质倾向，能够与人保持良好关系，同时保持独立思考。\n'
  }
  report += '\n'
  
  // 人格综合描述（E和N组合气质类型）
  report += '三、人格综合描述\n\n'
  
  if (tScores.E >= 56.7 && tScores.N <= 43.3) {
    report += '• 您属于多血质类型：外向、稳定、乐观、善于社交，情绪稳定。\n'
  } else if (tScores.E >= 56.7 && tScores.N >= 56.7) {
    report += '• 您属于胆汁质类型：外向、不稳定、热情、易冲动，情绪波动较大。\n'
  } else if (tScores.E <= 43.3 && tScores.N <= 43.3) {
    report += '• 您属于粘液质类型：内向、稳定、安静、稳重，情绪平稳持久。\n'
  } else if (tScores.E <= 43.3 && tScores.N >= 56.7) {
    report += '• 您属于抑郁质类型：内向、不稳定、敏感、细腻，情绪体验深刻。\n'
  } else {
    report += '• 您属于混合型气质，在不同的情境下会表现出不同的人格特点。\n'
  }
  
  report += '\n四、应用建议\n\n'
  report += '• 了解自己的人格特点是自我成长的第一步\n'
  report += '• 发挥自己人格特质中的优势，接纳和完善不足\n'
  report += '• 在人际交往和工作学习中，找到适合自己性格的方式\n'
  
  if (tScores.N >= 56.7) {
    report += '• 建议学习情绪管理技巧，如正念冥想、深呼吸放松等\n'
  }
  if (tScores.P >= 56.7) {
    report += '• 建议多关注他人感受，培养共情能力和合作精神\n'
  }
  if (tScores.E <= 43.3) {
    report += '• 建议适当参与社交活动，逐步扩展人际关系\n'
  }
  
  report += '\n五、气质类型对应的典型特征\n\n'
  report += '┌─────────┬─────────────┬────────────────────────────┐\n'
  report += '│ 气质类型 │   E/N组合   │        主要特征           │\n'
  report += '├─────────┼─────────────┼────────────────────────────┤\n'
  report += '│ 多血质   │  外向+稳定  │ 活泼好动、善于交际、乐观  │\n'
  report += '├─────────┼─────────────┼────────────────────────────┤\n'
  report += '│ 胆汁质   │  外向+不稳  │ 热情直率、精力旺盛、易冲动│\n'
  report += '├─────────┼─────────────┼────────────────────────────┤\n'
  report += '│ 粘液质   │  内向+稳定  │ 安静稳重、耐心细致、自制力│\n'
  report += '├─────────┼─────────────┼────────────────────────────┤\n'
  report += '│ 抑郁质   │  内向+不稳  │ 敏感细腻、思考深入、情绪化│\n'
  report += '└─────────┴─────────────┴────────────────────────────┘\n'
  
  return report
}

// 情绪稳定性评分函数[citation:1]
function scoreEmotionalStability(answers: Record<number, number>): ScoringResult {
  // 计算总分（每道题得分相加）
  let totalScore = 0
  for (let i = 1; i <= 30; i++) {
    totalScore += answers[i] || 0
  }
  
  // 根据总分确定情绪稳定程度
  let level = ''
  let suggestion = ''
  let severity = 0
  
  if (totalScore <= 11) {
    level = '不稳定'
    suggestion = `您的情绪稳定性处于"不稳定"水平。

【主要特征】
• 情绪过敏，内心困扰较多
• 心情波动大，容易受外界影响
• 可能经常感到焦虑或不安

【成长建议】
• 建议学习情绪管理技巧，如深呼吸、正念冥想
• 培养规律的生活作息，保证充足睡眠
• 多与信任的朋友或家人倾诉
• 如有需要，可寻求专业心理咨询帮助
• 记录情绪日记，了解情绪触发因素`
    severity = 0.85
  } else if (totalScore <= 23) {
    level = '不太稳定'
    suggestion = `您的情绪稳定性处于"不太稳定"水平。

【主要特征】
• 情绪经常波动，内心有困扰
• 对压力的承受能力有待提高
• 可能有时会感到紧张或烦躁

【成长建议】
• 学习识别自己的情绪变化规律
• 建立健康的生活方式，适当运动
• 培养兴趣爱好，丰富生活内容
• 练习放松技巧，如渐进式肌肉放松
• 与积极乐观的人交往`
    severity = 0.65
  } else if (totalScore <= 36) {
    level = '中等'
    suggestion = `您的情绪稳定性处于"中等"水平。

【主要特征】
• 介于情绪敏感与情绪稳定之间
• 大部分时间能够保持情绪平稳
• 偶尔会有情绪波动，但能自我调节

【成长建议】
• 继续保持良好的情绪调节能力
• 注意积累积极情绪体验
• 建立有效的压力应对策略
• 培养乐观、积极的生活态度
• 适当参与社交活动，增强支持系统`
    severity = 0.4
  } else if (totalScore <= 48) {
    level = '较稳定'
    suggestion = `您的情绪稳定性处于"较稳定"水平。

【主要特征】
• 情绪很少波动，态度和行动稳定
• 具有良好的心理承受能力
• 能够理性应对生活中的挑战

【成长建议】
• 继续保持健康的生活方式
• 可以帮助身边情绪不稳定的人
• 在保持稳定的同时，适当体验丰富的情感
• 将积极的情绪调节经验分享给他人`
    severity = 0.2
  } else {
    level = '很稳定'
    suggestion = `您的情绪稳定性处于"很稳定"水平。

【主要特征】
• 稳重、成熟、自信、理智、镇定
• 具有良好的情绪调控能力
• 面对压力时能保持冷静

【成长建议】
• 继续保持良好的心理状态
• 可以作为他人的情绪支持者
• 在团队中发挥稳定作用
• 持续关注自我成长和提升`
    severity = 0.05
  }
  
  return {
    totalScore,
    maxScore: 60,
    level,
    suggestion,
    severity,
    dimensionScores: {
      totalScore,
      maxScore: 60,
      scorePercentage: (totalScore / 60) * 100
    }
  }
}