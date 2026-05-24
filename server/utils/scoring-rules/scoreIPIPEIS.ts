import { ipipEisDimensionKeys, ipipEisQuestions, ipipEisDimensions } from "../questions/ipip-eis-questions";

// IPIP-EIS 评分函数
export function scoreIPIPEIS(answers: Record<number, number>): ScoringResult {
  const dimensions = ipipEisDimensionKeys
  const dimScores: Record<string, { total: number; count: number; raw: number }> = {}
  
  // 初始化
  for (const dim of dimensions) {
    dimScores[dim] = { total: 0, count: 0, raw: 0 }
  }
  
  let lieScore = 0  // 测谎题得分（不计入总分，用于检测）
  let lieCount = 0
  
  // 计算各维度得分
  Object.entries(answers).forEach(([qid, value]) => {
    const id = parseInt(qid)
    const question = ipipEisQuestions.find(q => q.id === id)
    if (!question) return
    
    // 测谎题单独处理
    if (id === 12 || id === 24 || id === 62) {
      lieScore += value
      lieCount++
      return
    }
    
    if (question.dimension && dimScores[question.dimension]) {
      let score = value
      if (question.reverse) {
        // 反向计分：1→5, 2→4, 3→3, 4→2, 5→1
        score = 6 - value
      }
      dimScores[question.dimension].total += score
      dimScores[question.dimension].count++
      dimScores[question.dimension].raw += value
    }
  })
  
  // 计算各维度平均分
  const dimAverages: Record<string, number> = {}
  const dimRawAverages: Record<string, number> = {}
  
  for (const dim of dimensions) {
    const avg = dimScores[dim].total / dimScores[dim].count
    dimAverages[dim] = Math.round(avg * 100) / 100
    dimRawAverages[dim] = Math.round((dimScores[dim].raw / dimScores[dim].count) * 100) / 100
  }
  
  // 总分（各维度平均分的平均值，转换为百分制）
  const totalAvg = dimensions.reduce((sum, dim) => sum + dimAverages[dim], 0) / dimensions.length
  const totalScore = Math.round(totalAvg / 5 * 100)
  
  // 测谎分析
  const lieAvg = lieCount > 0 ? lieScore / lieCount : 3
  const isValid = lieAvg <= 4  // 测谎题平均分低于4视为有效
  
  // 生成报告
  const suggestion = generateIPIPEISReport(dimAverages, dimRawAverages, isValid, lieAvg)
  
  // 确定主要特征
  const sortedDims = [...dimensions].sort((a, b) => dimAverages[b] - dimAverages[a])
  const primaryDim = sortedDims[0]
  
  return {
    totalScore,
    maxScore: 100,
    level: getIPIPEISLevel(totalAvg),
    suggestion,
    severity: 1 - totalAvg / 5,
    dimensionScores: {
      isValid,
      lieScore: lieAvg,
      dimensions: {
        positive_express: { score: dimAverages.positive_express, raw: dimRawAverages.positive_express, 
          name: ipipEisDimensions.positive_express.name, desc: ipipEisDimensions.positive_express.desc },
        negative_express: { score: dimAverages.negative_express, raw: dimRawAverages.negative_express,
          name: ipipEisDimensions.negative_express.name, desc: ipipEisDimensions.negative_express.desc },
        attention: { score: dimAverages.attention, raw: dimRawAverages.attention,
          name: ipipEisDimensions.attention.name, desc: ipipEisDimensions.attention.desc },
        emotional_decision: { score: dimAverages.emotional_decision, raw: dimRawAverages.emotional_decision,
          name: ipipEisDimensions.emotional_decision.name, desc: ipipEisDimensions.emotional_decision.desc },
        reactive_joy: { score: dimAverages.reactive_joy, raw: dimRawAverages.reactive_joy,
          name: ipipEisDimensions.reactive_joy.name, desc: ipipEisDimensions.reactive_joy.desc },
        reactive_sadness: { score: dimAverages.reactive_sadness, raw: dimRawAverages.reactive_sadness,
          name: ipipEisDimensions.reactive_sadness.name, desc: ipipEisDimensions.reactive_sadness.desc },
        empathy: { score: dimAverages.empathy, raw: dimRawAverages.empathy,
          name: ipipEisDimensions.empathy.name, desc: ipipEisDimensions.empathy.desc }
      }
    }
  }
}

function getIPIPEISLevel(avg: number): string {
  if (avg >= 4.2) return '情绪智力水平优秀'
  if (avg >= 3.8) return '情绪智力水平良好'
  if (avg >= 3.2) return '情绪智力水平中等'
  if (avg >= 2.5) return '情绪智力水平偏低'
  return '情绪智力水平待提升'
}

function generateIPIPEISReport(
  scores: Record<string, number>, 
  rawScores: Record<string, number>,
  isValid: boolean,
  lieAvg: number
): string {
  let report = '【情绪智力量表(IPIP-EIS)结果分析】\n\n'
  
  if (!isValid) {
    report += '⚠️ 注意：您的测谎题得分偏高，本次结果可能受到答题态度影响，建议重新认真作答。\n\n'
  }
  
  report += '一、各维度得分分析\n\n'
  
  // 积极表达
  report += `1. 积极表达：${scores.positive_express}分（满分5分）\n`
  report += `   ${scores.positive_express >= 4 ? '✓ 您善于表达积极情绪，能够自然地分享快乐。' : 
            scores.positive_express >= 3 ? '○ 您能够适度表达积极情绪，有时会保留自己的感受。' :
            '⚠️ 您较少表达积极情绪，可以尝试更多地与他人分享快乐。'}\n\n`
  
  // 消极表达
  report += `2. 消极表达：${scores.negative_express}分（满分5分）\n`
  report += `   ${scores.negative_express >= 4 ? '⚠️ 您倾向于外显地表达消极情绪，建议学习更适当的情绪表达方式。' :
            scores.negative_express >= 3 ? '○ 您能够适度表达消极情绪，在需要时能够控制情绪外露。' :
            '✓ 您能够较好地控制消极情绪的表达，情绪稳定。'}\n\n`
  
  // 注意情绪
  report += `3. 注意情绪：${scores.attention}分（满分5分）\n`
  report += `   ${scores.attention >= 4 ? '✓ 您善于觉察和分析自己的情绪变化，有良好的情绪洞察力。' :
            scores.attention >= 3 ? '○ 您能够关注自己的情绪状态，但有时会忽略细微的情绪变化。' :
            '⚠️ 您较少关注自己的情绪，建议增加情绪觉察练习。'}\n\n`
  
  // 情绪性决策
  report += `4. 情绪性决策：${scores.emotional_decision}分（满分5分）\n`
  report += `   ${scores.emotional_decision >= 4 ? '✓ 您在做决定时会倾听内心的感受，兼顾理性与情感。' :
            scores.emotional_decision >= 3 ? '○ 您决策时主要依赖理性，有时会忽略感受的指引。' :
            '⚠️ 您倾向于完全依据理性决策，可以尝试关注感受传递的信息。'}\n\n`
  
  // 反应性快乐
  report += `5. 反应性快乐：${scores.reactive_joy}分（满分5分）\n`
  report += `   ${scores.reactive_joy >= 4 ? '✓ 您很容易被他人的快乐感染，能够共享他人的喜悦。' :
            scores.reactive_joy >= 3 ? '○ 您能够感受到他人的快乐，但有时不太容易受影响。' :
            '⚠️ 您较少被他人的快乐情绪影响，可以尝试更多地开放自己。'}\n\n`
  
  // 反应性抑郁
  report += `6. 反应性抑郁：${scores.reactive_sadness}分（满分5分）\n`
  report += `   ${scores.reactive_sadness >= 4 ? '⚠️ 您容易被他人的不幸深深触动，需要注意保持情绪边界。' :
            scores.reactive_sadness >= 3 ? '○ 您能够感受他人的痛苦，同时也能够保持适当的情感距离。' :
            '✓ 您能够保持情感边界，不容易被负面情绪淹没。'}\n\n`
  
  // 同理心关注
  report += `7. 同理心关注：${scores.empathy}分（满分5分）\n`
  report += `   ${scores.empathy >= 4 ? '✓ 您善于理解和关心他人的感受，具有良好的共情能力。' :
            scores.empathy >= 3 ? '○ 您能够关心他人，但有时可能不够深入。' :
            '⚠️ 您较少关注他人的情感需求，可以尝试更多地换位思考。'}\n\n`
  
  // 总分评估
  const totalAvg = Object.values(scores).reduce((a, b) => a + b, 0) / 7
  const totalPercent = Math.round(totalAvg / 5 * 100)
  
  report += `二、综合评估\n\n`
  report += `总分：${totalPercent}分\n`
  report += `等级：${getIPIPEISLevel(totalAvg)}\n\n`
  
  report += `【成长建议】\n`
  report += `• 情绪智力是可以通过学习和练习提升的\n`
  report += `• 关注得分较低的维度，有针对性地进行改善\n`
  report += `• 积极表达：练习分享正面感受，记录三件好事\n`
  report += `• 情绪觉察：每天进行情绪日记练习，命名自己的感受\n`
  report += `• 共情能力：练习主动倾听，尝试站在对方角度思考\n`
  report += `• 情绪管理：学习深呼吸、正念冥想等情绪调节技巧\n\n`
  
  report += `【量表说明】\n`
  report += `本量表基于国际人格项目库(IPIP)开发，评估情绪智力的7个维度，`
  report += `包括情绪的表达、觉察、利用和共情等方面。`
  
  return report
}