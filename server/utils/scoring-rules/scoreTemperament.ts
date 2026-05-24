import { ScoringResult } from "../score";

// 气质类型评分函数
export function scoreTemperament(answers: Record<number, number>): ScoringResult {
  // 初始化各维度分数
  let cholericScore = 0; // 胆汁质
  let sanguineScore = 0; // 多血质
  let phlegmaticScore = 0; // 粘液质
  let melancholicScore = 0; // 抑郁质


  // 各维度题目数量
  let cholericCount = 0;
  let sanguineCount = 0;
  let phlegmaticCount = 0;
  let melancholicCount = 0;

  // 题目维度映射（基于题目ID和维度类型）
  // 胆汁质题号: 2,6,9,14,17,21,27,31,36,38,42,48,50,54,58
  const cholericItems = [2, 6, 9, 14, 17, 21, 27, 31, 36, 38, 42, 48, 50, 54, 58];
  // 多血质题号: 4,8,11,16,19,23,25,29,34,40,44,46,52,56,60
  const sanguineItems = [4, 8, 11, 16, 19, 23, 25, 29, 34, 40, 44, 46, 52, 56, 60];
  // 粘液质题号: 1,7,10,13,18,22,26,30,33,39,43,45,49,55,57
  const phlegmaticItems = [1, 7, 10, 13, 18, 22, 26, 30, 33, 39, 43, 45, 49, 55, 57];
  // 抑郁质题号: 3,5,12,15,20,24,28,32,35,37,41,47,51,53,59
  const melancholicItems = [3, 5, 12, 15, 20, 24, 28, 32, 35, 37, 41, 47, 51, 53, 59];

  // 遍历所有答案计算分数
  Object.entries(answers).forEach(([qid, value]) => {
    const id = parseInt(qid);

    if (cholericItems.includes(id)) {
      cholericScore += value;
      cholericCount++;
    } else if (sanguineItems.includes(id)) {
      sanguineScore += value;
      sanguineCount++;
    } else if (phlegmaticItems.includes(id)) {
      phlegmaticScore += value;
      phlegmaticCount++;
    } else if (melancholicItems.includes(id)) {
      melancholicScore += value;
      melancholicCount++;
    }
  });

  // 计算各维度得分（总分范围：-30 到 30）
  const scores = {
    choleric: cholericScore,
    sanguine: sanguineScore,
    phlegmatic: phlegmaticScore,
    melancholic: melancholicScore
  };

  // 确定主要气质类型
  const sortedTypes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [primaryType, primaryScore] = sortedTypes[0] ?? ['choleric', 0];
  const [secondaryType, secondaryScore] = sortedTypes[1] ?? ['sanguine', 0];
  const scoreDiff = primaryScore - secondaryScore;

  // 判断气质类型
  let temperamentType = '';
  let temperamentDesc = '';

  if (scoreDiff >= 4) {
    // 单一气质类型
    temperamentType = getTemperamentName(primaryType);
    temperamentDesc = getTemperamentDescription(primaryType, true);
  } else if (scoreDiff >= 0) {
    // 混合气质类型
    temperamentType = `${getTemperamentName(primaryType)}-${getTemperamentName(secondaryType)}混合型`;
    temperamentDesc = getMixedTemperamentDescription(primaryType, secondaryType);
  } else {
    temperamentType = getTemperamentName(primaryType);
    temperamentDesc = getTemperamentDescription(primaryType, false);
  }

  // 判断典型性
  let typicalLevel = '';
  if (primaryScore > 20) {
    typicalLevel = '典型';
  } else if (primaryScore >= 10) {
    typicalLevel = '一般';
  } else {
    typicalLevel = '倾向';
  }

  // 生成详细建议
  const suggestion = generateTemperamentSuggestion(scores, temperamentType, typicalLevel);

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
  };
}
// 获取气质类型名称
function getTemperamentName(type: string): string {
  const names: Record<string, string> = {
    choleric: '胆汁质',
    sanguine: '多血质',
    phlegmatic: '粘液质',
    melancholic: '抑郁质'
  };
  return names[type] || type;
}
// 获取气质类型简要描述
function getTemperamentShortDesc(type: string): string {
  const descs: Record<string, string> = {
    choleric: '精力旺盛、热情直率、易冲动',
    sanguine: '活泼好动、善于交际、反应快',
    phlegmatic: '安静稳重、耐心细致、有自制力',
    melancholic: '敏感细腻、思考深入、情绪体验深刻'
  };
  return descs[type] || '';
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
  };
  return descriptions[type] || '';
}
// 获取混合气质类型描述
function getMixedTemperamentDescription(type1: string, type2: string): string {
  const name1 = getTemperamentName(type1);
  const name2 = getTemperamentName(type2);

  return `您的气质类型为【${name1}-${name2}混合型】，兼具两种气质的特点。
  
您既有${name1}的${getTemperamentShortDesc(type1)}，
又带有${name2}的${getTemperamentShortDesc(type2)}。

这种混合型气质让您在不同情境下能够灵活调整，既有${name1}的行动力，又有${name2}的稳定性。

【成长建议】
• 了解自己的双重特质，在不同场合发挥相应优势
• 注意平衡两种气质的优缺点
• 培养自我觉察能力，找到最适合自己的发展路径`;
}
// 生成气质类型综合建议
function generateTemperamentSuggestion(
  scores: Record<string, number>,
  type: string,
  typicalLevel: string
): string {
  let suggestion = `【气质类型分析结果】

`;

  suggestion += `您的气质类型为：${type}（${typicalLevel}型）
`;

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

请记住：气质类型不是限制，而是认识自我的起点。`;

  return suggestion;
}
