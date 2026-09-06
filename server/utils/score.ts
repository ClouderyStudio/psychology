import { scoreTemperament } from "./scoring-rules/scoreTemperament";
import { scoreMBTI } from "./scoring-rules/scoreMBTI";
import { scoreSCL90 } from "./scoring-rules/scoreSCL90";
import { scoreEPQ } from "./scoring-rules/scoreEPQ";
import { scoreEPQRSC } from "./scoring-rules/scoreEPQRSC";
import { scoreSixteenPF } from "./scoring-rules/scoreSixteenPF";
import { scoreBPNS } from "./scoring-rules/scoreBPNS";
import { scoreIPIPEIS } from "./scoring-rules/scoreIPIPEIS";
import { scoreSeven } from "./scoring-rules/scoreSeven";
import { scorePsyAge } from "./scoring-rules/scorePsyAge";
interface ScoringInput {
  testId: string;
  answers: Record<number, number>;
}

export interface ScoringResult {
  totalScore: number;
  maxScore: number;
  level: string;
  suggestion: string;
  severity: number;
  dimensionScores?: Record<string, any>;
  mbtiReport?: Record<string, any>;
  sevenReport?: Record<string, any>;
  psyAgeReport?: Record<string, any>;
  rawScore?: number;
  standardizedScore?: number;
}

function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 0,
): number {
  return answers[id] ?? fallback;
}

// 求和工具：把各题答案直接相加
function sumAnswers(answers: Record<number, number>): number {
  return Object.values(answers).reduce((sum, val) => sum + val, 0);
}

// 求和工具：处理含反向计分的量表
// reverseComplement = 正向最小分值 + 最大分值（PSS 为 4，SDS/SAS 为 5）
function sumWithReverse(
  answers: Record<number, number>,
  questionCount: number,
  reverseItems: number[],
  reverseComplement: number,
): number {
  let total = 0;
  for (let i = 1; i <= questionCount; i++) {
    const answer = getAnswerValue(answers, i);
    total += reverseItems.includes(i) ? reverseComplement - answer : answer;
  }
  return total;
}

// RSES Rosenberg 自尊量表
function scoreRSES(answers: Record<number, number>): ScoringResult {
  // RSES 反向计分题：3,5,8,9,10（选项 1-4，反向补值 5）
  const totalScore = sumWithReverse(answers, 10, [3, 5, 8, 9, 10], 5);

  let level = "";
  let suggestion = "";

  if (totalScore <= 20) {
    level = "低自尊";
    suggestion =
      "您目前的自我评价偏低。建议：\n• 试着记录并认可自己的小成就\n• 减少与他人的过度比较\n• 练习自我肯定与积极自我对话\n• 如有需要可寻求心理咨询支持";
  } else if (totalScore <= 30) {
    level = "中等自尊";
    suggestion =
      "您的自尊水平处于中等区间。建议：\n• 继续保持客观的自我评价\n• 发展能带来成就感的目标\n• 与尊重您的人建立联系";
  } else {
    level = "高自尊";
    suggestion =
      "您拥有较高的自尊水平。请保持这份自信，同时避免过度自尊带来的固执，保持真诚倾听与自我成长。";
  }

  // RSES 双因子：自我胜任感(正向 1,2,4,6,7) / 自我接纳(反向 3,5,8,9,10，反向补值 5)
  const competenceItems = [1, 2, 4, 6, 7];
  const likingItems = [3, 5, 8, 9, 10];
  let competenceSum = 0;
  for (const i of competenceItems) competenceSum += getAnswerValue(answers, i, 0);
  let likingSum = 0;
  for (const i of likingItems) likingSum += 5 - getAnswerValue(answers, i, 0);
  const competenceAvg = competenceSum / competenceItems.length;
  const likingAvg = likingSum / likingItems.length;

  const competenceDesc =
    competenceAvg >= 3
      ? "对自己有能力和价值的肯定较充分，敢于尝试新事物。"
      : competenceAvg >= 2.5
        ? "自我胜任感处于一般水平，可多积累成就感。"
        : "自我胜任感偏弱，建议多记录并认可自己的小成就。";
  const likingDesc =
    likingAvg >= 3
      ? "总体能接纳与喜欢自己，较少自我贬低。"
      : likingAvg >= 2.5
        ? "自我接纳程度一般，有时会自我怀疑。"
        : "自我接纳度偏低，易自我批评，建议练习积极自我对话。";

  return {
    totalScore,
    maxScore: 40,
    level,
    suggestion,
    severity: totalScore / 40,
    dimensionScores: {
      type: 'rses',
      competence: {
        name: '自我胜任感',
        score: competenceSum,
        max: 16,
        avg: competenceAvg,
        desc: competenceDesc,
      },
      liking: {
        name: '自我接纳 / 喜欢',
        score: likingSum,
        max: 16,
        avg: likingAvg,
        desc: likingDesc,
      },
    },
  };
}

export function calculateScore(input: ScoringInput): ScoringResult {
  const { testId, answers } = input;

  switch (testId) {
    case "phq9":
      return scorePHQ9(answers);
    case "gad7":
      return scoreGAD7(answers);
    case "pss":
      return scorePSS(answers);
    case "scl90":
      return scoreSCL90(answers);
    case "sds":
      return scoreSDS(answers);
    case "sas":
      return scoreSAS(answers);
    case "mbti":
      return scoreMBTI(answers);
    case "sccs":
      return scoreSCCS(answers);
    case "temperament":
      return scoreTemperament(answers);
    case "bdc":
      return scoreBDC(answers);
    case "epq":
      return scoreEPQ(answers);
    case "epq-rsc":
      return scoreEPQRSC(answers);
    case "emotional-stability":
      return scoreEmotionalStability(answers);
    case "sixteenPF":
      return scoreSixteenPF(answers);
    case "bpns":
      return scoreBPNS(answers);
    case "ipip-eis":
      return scoreIPIPEIS(answers);
    case "mdq":
      return scoreMDQ(answers);
    case "asrm":
      return scoreASRM(answers);
    case "rses":
      return scoreRSES(answers);
    case "seven":
      return scoreSeven(answers);
    case "psy-age":
      return scorePsyAge(answers);
    default:
      return {
        totalScore: 0,
        maxScore: 0,
        level: "未知",
        suggestion: "评分规则未定义",
        severity: 0,
      };
  }
}

// PHQ-9 抑郁筛查量表
function scorePHQ9(answers: Record<number, number>): ScoringResult {
  const totalScore = sumAnswers(answers);

  let level = "";
  let suggestion = "";

  if (totalScore <= 4) {
    level = "无显著抑郁症状";
    suggestion =
      "您的情绪状态良好，请继续保持健康的生活方式，规律作息，适当运动。";
  } else if (totalScore <= 9) {
    level = "轻度抑郁";
    suggestion =
      "您可能存在轻度情绪困扰。建议：\n• 增加社交活动和户外运动\n• 保持规律作息\n• 尝试冥想或深呼吸放松\n• 与信任的朋友家人倾诉";
  } else if (totalScore <= 14) {
    level = "中度抑郁";
    suggestion =
      "您的情绪状态需要关注。建议：\n• 寻求专业心理咨询支持\n• 记录情绪变化，识别触发因素\n• 建立健康的生活习惯\n• 考虑参加支持小组";
  } else if (totalScore <= 19) {
    level = "中重度抑郁";
    suggestion =
      "您的情绪困扰较明显。强烈建议：\n• 尽快咨询心理医生或精神科医生\n• 不要独自承受，寻求家人支持\n• 避免重大决定\n• 如出现自伤念头，立即寻求紧急帮助";
  } else {
    level = "重度抑郁";
    suggestion =
      "您的症状较为严重，请立即寻求专业医疗帮助！\n• 尽快预约精神科医生\n• 告知家人或信任的朋友\n• 24小时心理援助热线：希望24热线（400-161-9995）\n• 如情况紧急，请前往医院急诊";
  }

  // PHQ-9 关键症状亮点：最明显的症状及其出现频次
  const phqLabels = ['兴趣减退', '情绪低落', '睡眠问题', '精力不足', '食欲改变', '自我评价低', '注意力下降', '动作迟缓或烦躁', '自伤念头'];
  const phqFreq = ['没有', '几天', '超过一半天数', '几乎每天'];
  let phqTop = 1, phqTopVal = -1, phqEndorsed = 0;
  for (let i = 1; i <= 9; i++) {
    const v = getAnswerValue(answers, i, 0);
    if (v > phqTopVal) { phqTopVal = v; phqTop = i; }
    if (v >= 2) phqEndorsed++;
  }

  return {
    totalScore,
    maxScore: 27,
    level,
    suggestion,
    severity: totalScore / 27,
    dimensionScores: {
      type: 'phq9',
      highlight: {
        label: phqLabels[phqTop - 1] as string,
        freq: phqFreq[Math.min(phqTopVal, 3)] as string,
        value: phqTopVal,
        endorsedCount: phqEndorsed,
      },
    },
  };
}

// GAD-7 焦虑筛查量表
function scoreGAD7(answers: Record<number, number>): ScoringResult {
  const totalScore = sumAnswers(answers);

  let level = "";
  let suggestion = "";

  if (totalScore <= 4) {
    level = "轻度焦虑";
    suggestion =
      "您的焦虑水平在正常范围内。保持健康的生活方式，学会放松技巧可以帮助维持良好状态。";
  } else if (totalScore <= 9) {
    level = "中度焦虑";
    suggestion =
      "您存在中等程度的焦虑症状。建议：\n• 学习深呼吸、渐进式肌肉放松\n• 减少咖啡因摄入\n• 保证充足睡眠\n• 考虑正念冥想练习";
  } else if (totalScore <= 14) {
    level = "中重度焦虑";
    suggestion =
      "您的焦虑水平较高。建议：\n• 寻求心理咨询帮助\n• 学习认知行为疗法技巧\n• 规律运动（尤其是有氧运动）\n• 避免饮酒和咖啡因";
  } else {
    level = "重度焦虑";
    suggestion =
      "您的焦虑症状较严重，请及时寻求专业帮助！\n• 建议尽快咨询精神科医生\n• 可能需要药物治疗配合心理治疗\n• 建立紧急应对计划\n• 告知亲友您的情况";
  }

  // GAD-7 关键症状亮点：最明显的担忧 / 紧张表现及其频次
  const gadLabels = ['紧张焦虑', '难以控制担忧', '担忧过多', '难以放松', '坐立不安', '易怒急躁', '预感不详'];
  const gadFreq = ['完全没有', '几天', '超过一半天数', '几乎每天'];
  let gadTop = 1, gadTopVal = -1, gadEndorsed = 0;
  for (let i = 1; i <= 7; i++) {
    const v = getAnswerValue(answers, i, 0);
    if (v > gadTopVal) { gadTopVal = v; gadTop = i; }
    if (v >= 2) gadEndorsed++;
  }

  return {
    totalScore,
    maxScore: 21,
    level,
    suggestion,
    severity: totalScore / 21,
    dimensionScores: {
      type: 'gad7',
      highlight: {
        label: gadLabels[gadTop - 1] as string,
        freq: gadFreq[Math.min(gadTopVal, 3)] as string,
        value: gadTopVal,
        endorsedCount: gadEndorsed,
      },
    },
  };
}

// PSS 压力感知量表（含反向计分）
function scorePSS(answers: Record<number, number>): ScoringResult {
  // PSS-10 反向计分题：4,5,7,8
  const totalScore = sumWithReverse(answers, 10, [4, 5, 7, 8], 4);

  let level = "";
  let suggestion = "";

  if (totalScore <= 13) {
    level = "压力水平较低";
    suggestion =
      "您目前压力管理得很好。继续保持：\n• 现有的应对策略\n• 定期自我关照\n• 预防性压力管理";
  } else if (totalScore <= 26) {
    level = "压力水平适中";
    suggestion =
      "您的压力水平在可控范围内。建议：\n• 学习时间管理技巧\n• 建立工作生活边界\n• 定期放松和休息\n• 保持社交支持网络";
  } else {
    level = "压力水平较高";
    suggestion =
      "您的压力水平较高，需要积极干预。建议：\n• 评估压力来源并制定应对计划\n• 学习压力管理技巧（正念、运动）\n• 寻求心理咨询支持\n• 考虑减少不必要承诺";
  }

  // PSS-10 两因子：不可控感/无助 vs 掌控感/自我效能（因子结构为文献公认）
  const helplessItems = [1, 2, 3, 6, 9, 10];
  const efficacyItems = [4, 5, 7, 8];
  let helplessSum = 0;
  for (const i of helplessItems) helplessSum += getAnswerValue(answers, i, 0);
  let efficacySum = 0;
  for (const i of efficacyItems) efficacySum += 4 - getAnswerValue(answers, i, 0);
  const helplessAvg = helplessSum / helplessItems.length;
  const efficacyAvg = efficacySum / efficacyItems.length;

  const helplessDesc =
    helplessAvg >= 2.5
      ? "对生活中不可控、难以预料的事感到困扰较多，易累积压力。"
      : helplessAvg >= 1.5
        ? "尚能应对生活中的不确定性，偶有失控感。"
        : "对生活掌控感较强，较少因不可控事件感到压力。";
  const efficacyDesc =
    efficacyAvg >= 3
      ? "面对困难时较有信心，善于自我调节，抗压能力强。"
      : efficacyAvg >= 2
        ? "有一定应对技巧，情绪调节能力中等。"
        : "面对压力时掌控感偏弱，可从学习放松与时间管理中获益。";

  return {
    totalScore,
    maxScore: 40,
    level,
    suggestion,
    severity: totalScore / 40,
    dimensionScores: {
      type: 'pss',
      helplessness: {
        name: '不可控感 / 无助',
        score: helplessSum,
        max: 24,
        avg: helplessAvg,
        desc: helplessDesc,
      },
      selfEfficacy: {
        name: '掌控感 / 自我效能',
        score: efficacySum,
        max: 16,
        avg: efficacyAvg,
        desc: efficacyDesc,
      },
    },
  };
}

// SDS 抑郁自评量表
function scoreSDS(answers: Record<number, number>): ScoringResult {
  // SDS 反向计分题：2,5,6,11,12,14,16,17,18,20
  const rawScore = sumWithReverse(answers, 20, [2, 5, 6, 11, 12, 14, 16, 17, 18, 20], 5);

  // 计算标准分（乘以1.25后取整）
  const standardizedScore = Math.round(rawScore * 1.25);

  // 判断抑郁程度
  let level = "";
  let suggestion = "";

  if (standardizedScore <= 53) {
    level = "无抑郁症状";
    suggestion = "您的情绪状态良好，请继续保持健康的生活方式。";
  } else if (standardizedScore <= 62) {
    level = "轻度抑郁";
    suggestion =
      "您存在轻度抑郁倾向，建议：\n• 增加户外活动和运动\n• 保持规律的作息时间\n• 与亲友保持联系\n• 培养兴趣爱好";
  } else if (standardizedScore <= 72) {
    level = "中度抑郁";
    suggestion =
      "您存在中度抑郁倾向，建议：\n• 寻求专业心理咨询\n• 评估是否需要药物治疗\n• 建立支持系统\n• 学习认知行为疗法技巧";
  } else {
    level = "重度抑郁";
    suggestion =
      "您存在重度抑郁倾向，强烈建议：\n• 立即寻求精神科医生帮助\n• 可能需要药物治疗\n• 告知家人您的状况\n• 如有自伤念头，立即拨打心理援助热线";
  }

  // SDS 四类症状群（文献常用分组，反向题已折算）
  const revSDS = [2, 5, 6, 11, 12, 14, 16, 17, 18, 20];
  const sdsGroupDefs = [
    { key: 'affective', name: '情绪低落', items: [1, 3], hint: '持续悲伤、想哭的情绪体验' },
    { key: 'somatic', name: '生理症状', items: [2, 4, 5, 7, 8, 9, 10, 13, 15, 19], hint: '睡眠、食欲、精力、便秘、心悸等躯体表现' },
    { key: 'psychomotor', name: '精神运动', items: [12, 14], hint: '行为迟缓或坐立不安的迟滞 / 激越' },
    { key: 'psychological', name: '心理症状', items: [6, 11, 16, 17, 18, 20], hint: '无望、易激惹、犹豫、空虚等内心困扰' },
  ];
  const sdsDims: Record<string, any> = {};
  for (const g of sdsGroupDefs) {
    let sum = 0;
    for (const i of g.items) sum += revSDS.includes(i) ? 5 - getAnswerValue(answers, i, 0) : getAnswerValue(answers, i, 0);
    const avg = sum / g.items.length;
    const desc = avg >= 3.5 ? '表现较明显' : avg >= 2.5 ? '存在一定困扰' : '尚在正常范围';
    sdsDims[g.key] = { name: g.name, score: Math.round(sum * 100) / 100, max: g.items.length * 4, avg, desc, hint: g.hint };
  }

  return {
    totalScore: standardizedScore,
    maxScore: 100,
    level,
    suggestion,
    severity: standardizedScore / 100,
    rawScore,
    standardizedScore,
    dimensionScores: { type: 'sds', ...sdsDims },
  };
}

// SAS 焦虑自评量表
function scoreSAS(answers: Record<number, number>): ScoringResult {
  // SAS 反向计分题：5,9,13,17,19
  const rawScore = sumWithReverse(answers, 20, [5, 9, 13, 17, 19], 5);

  // 计算标准分（乘以1.25后取整）
  const standardizedScore = Math.round(rawScore * 1.25);

  // 判断焦虑程度
  let level = "";
  let suggestion = "";

  if (standardizedScore <= 50) {
    level = "无焦虑症状";
    suggestion = "您的情绪状态良好，请继续保持健康的生活方式。";
  } else if (standardizedScore <= 59) {
    level = "轻度焦虑";
    suggestion =
      "您存在轻度焦虑倾向，建议：\n• 学习放松技巧（深呼吸、冥想）\n• 减少咖啡因摄入\n• 保证充足睡眠\n• 规律运动";
  } else if (standardizedScore <= 69) {
    level = "中度焦虑";
    suggestion =
      "您存在中度焦虑倾向，建议：\n• 寻求专业心理咨询\n• 学习认知行为疗法\n• 建立压力管理计划\n• 避免饮酒和咖啡因";
  } else {
    level = "重度焦虑";
    suggestion =
      "您存在重度焦虑倾向，强烈建议：\n• 尽快咨询精神科医生\n• 可能需要药物治疗\n• 学习急性焦虑应对技巧\n• 建立紧急支持系统";
  }

  // SAS 生理 / 心理两维参考拆分（反向题已折算）
  const revSAS = [5, 9, 13, 17, 19];
  const sasGroupDefs = [
    { key: 'somatic', name: '生理焦虑', items: [1, 2, 3, 4, 6, 7, 8, 10, 12, 14, 15, 18], hint: '心慌、颤抖、头晕、出汗等躯体紧张表现' },
    { key: 'psychic', name: '心理焦虑', items: [5, 9, 11, 13, 16, 17, 19, 20], hint: '担忧、害怕、预感不祥等精神层面的紧张' },
  ];
  const sasDims: Record<string, any> = {};
  for (const g of sasGroupDefs) {
    let sum = 0;
    for (const i of g.items) sum += revSAS.includes(i) ? 5 - getAnswerValue(answers, i, 0) : getAnswerValue(answers, i, 0);
    const avg = sum / g.items.length;
    const desc = avg >= 3.5 ? '表现较明显' : avg >= 2.5 ? '存在一定紧张' : '尚在正常范围';
    sasDims[g.key] = { name: g.name, score: Math.round(sum * 100) / 100, max: g.items.length * 4, avg, desc, hint: g.hint };
  }

  return {
    totalScore: standardizedScore,
    maxScore: 100,
    level,
    suggestion,
    severity: standardizedScore / 100,
    rawScore,
    standardizedScore,
    dimensionScores: { type: 'sas', ...sasDims },
  };
}

// 生成个性化建议
export function generatePersonalizedAdvice(
  result: ScoringResult,
  testTitle: string,
): string {
  if (result.severity > 0.7) {
    return `根据${testTitle}的评估结果，您的得分较高。请重视这个信号，考虑寻求专业心理健康服务。记住，寻求帮助是勇气和智慧的表现。`;
  } else if (result.severity > 0.4) {
    return `您的得分处于中等水平。建议关注自我照顾，尝试一些压力管理技巧，如规律运动、正念练习。如果需要，可以寻求心理咨询师的支持。`;
  } else {
    return `您的评估结果良好。保持健康的生活方式，定期关注自己的心理状态，预防胜于治疗。`;
  }
}

// SCCS 评分函数
function scoreSCCS(answers: Record<number, number>): ScoringResult {
  // 初始化各维度分数
  let disharmonyScore = 0; // 自我与经验的不和谐
  let flexibilityScore = 0; // 自我的灵活性
  let rigidityScore = 0; // 自我的刻板性

  let disharmonyCount = 0;
  let flexibilityCount = 0;
  let rigidityCount = 0;

  // 遍历所有答案计算分数
  Object.entries(answers).forEach(([qid, value]) => {
    const id = parseInt(qid);

    if (id >= 1 && id <= 16) {
      // 维度1：自我与经验的不和谐（正向计分）
      disharmonyScore += value;
      disharmonyCount++;
    } else if (id >= 17 && id <= 28) {
      // 维度2：自我的灵活性（反向计分）
      // 反向计分：1→5, 2→4, 3→3, 4→2, 5→1
      flexibilityScore += 6 - value;
      flexibilityCount++;
    } else if (id >= 29 && id <= 35) {
      // 维度3：自我的刻板性（正向计分）
      rigidityScore += value;
      rigidityCount++;
    }
  });

  // 计算各维度总分和均分
  const disharmonyTotal = disharmonyScore;
  const flexibilityTotal = flexibilityScore;
  const rigidityTotal = rigidityScore;

  const disharmonyAvg =
    disharmonyCount > 0 ? disharmonyScore / disharmonyCount : 3;
  const flexibilityAvg =
    flexibilityCount > 0 ? flexibilityScore / flexibilityCount : 3;
  const rigidityAvg = rigidityCount > 0 ? rigidityScore / rigidityCount : 3;

  // 计算综合和谐指数
  // 公式：(6 - 不和谐均分) * 0.5 + 灵活性均分 * 0.3 + (6 - 刻板性均分) * 0.2
  const harmonyIndex =
    (6 - disharmonyAvg) * 0.5 + flexibilityAvg * 0.3 + (6 - rigidityAvg) * 0.2;

  // 确定和谐等级
  let harmonyLevel = "";
  let harmonyColor = "";
  let harmonyDesc = "";

  if (harmonyIndex >= 4.5) {
    harmonyLevel = "高度和谐";
    harmonyColor = "#3d6a4f";
    harmonyDesc =
      "你拥有良好的自我和谐度。你的内心世界与外在经验能够较好地整合，面对变化时灵活从容，同时保持开放的心态。这种状态有助于心理健康和个人成长。";
  } else if (harmonyIndex >= 3.5) {
    harmonyLevel = "比较和谐";
    harmonyColor = "#5e8c6f";
    harmonyDesc =
      "你的自我和谐度处于良好水平。大多数时候你能够接纳自己，适应环境。可能在特定情境下会感到一些内心冲突，但整体上能够保持平衡。";
  } else if (harmonyIndex >= 2.5) {
    harmonyLevel = "一般";
    harmonyColor = "#8b6919";
    harmonyDesc =
      "你的自我和谐度处于中等水平。你可能会在某些方面感到内心矛盾或难以适应变化。建议多关注自己的内心感受，尝试以更开放和灵活的态度面对自己和周围的世界。";
  } else if (harmonyIndex >= 1.5) {
    harmonyLevel = "不太和谐";
    harmonyColor = "#8b3d1f";
    harmonyDesc =
      "你的自我和谐度偏低，可能经常感到内心冲突、难以适应变化，或者固守着某些观念难以改变。建议你寻求心理咨询师的帮助，探索内心的矛盾，学习更灵活的应对方式。";
  } else {
    harmonyLevel = "严重不和谐";
    harmonyColor = "#8b1a1a";
    harmonyDesc =
      "你的自我和谐度较低，内心冲突可能较为严重。我们真诚地建议你考虑寻求专业心理咨询师的帮助，系统性地探索自我，学习接纳自己、调节情绪的方法。请记住，求助是勇敢和智慧的表现。";
  }

  // 生成各维度描述
  const getDimensionDesc = (dim: string, avg: number): string => {
    if (dim === "disharmony") {
      if (avg <= 2.0) return "自我与经验高度和谐，内心一致性强";
      if (avg <= 3.0) return "自我与经验基本和谐，偶尔感到矛盾";
      if (avg <= 4.0) return "自我与经验存在较明显的不一致";
      return "自我与经验严重不和谐，内心冲突较多";
    } else if (dim === "flexibility") {
      if (avg >= 4.0) return "自我灵活性很高，适应能力强";
      if (avg >= 3.0) return "自我灵活性较好，能够应对变化";
      if (avg >= 2.0) return "自我灵活性一般，有时难以适应变化";
      return "自我灵活性较低，面对变化时可能感到困难";
    } else {
      if (avg <= 2.0) return "自我概念开放灵活，不固守成规";
      if (avg <= 3.0) return "自我概念有一定弹性，偶尔表现得刻板";
      if (avg <= 4.0) return "自我概念偏刻板，习惯按固定方式行事";
      return "自我概念非常刻板，难以改变固有观念";
    }
  };

  // 构建建议文本
  const suggestion = `
【综合自我和谐指数】
和谐等级：${harmonyLevel}
综合指数：${harmonyIndex.toFixed(2)} / 5.00
${harmonyDesc}

【各维度详细分析】

🌊 自我与经验的不和谐
总分：${disharmonyTotal} 分 | 每题均分：${disharmonyAvg.toFixed(2)} / 5.00
${getDimensionDesc("disharmony", disharmonyAvg)}
${disharmonyAvg > 3 ? "建议：关注内心冲突，学习接纳自己的感受，尝试理解矛盾背后的需求。" : "建议：继续保持良好的自我认知，定期反思和调整。"}

🌿 自我的灵活性
总分：${flexibilityTotal} 分 | 每题均分：${flexibilityAvg.toFixed(2)} / 5.00
${getDimensionDesc("flexibility", flexibilityAvg)}
${flexibilityAvg < 3 ? "建议：尝试用不同方式解决问题，培养适应变化的能力，保持开放心态。" : "建议：继续保持灵活性，同时注意在变化中保持核心价值。"}

🪨 自我的刻板性
总分：${rigidityTotal} 分 | 每题均分：${rigidityAvg.toFixed(2)} / 5.00
${getDimensionDesc("rigidity", rigidityAvg)}
${rigidityAvg > 3 ? "建议：尝试接纳不同观点，培养灵活的思维方式，减少固有观念的限制。" : "建议：保持开放心态，继续探索新的可能性。"}

【成长建议】
• 自我和谐是一个动态发展的过程，需要持续的自我觉察和调整
• 接纳自己的不完美，允许自己在成长中犯错和学习
• 建立健康的支持系统，与他人分享内心感受
• 如果需要，可以寻求专业心理咨询师的帮助，进行更深入的自我探索
  `;

  return {
    totalScore: Math.round(harmonyIndex * 20), // 转换为百分制
    maxScore: 100,
    level: harmonyLevel,
    suggestion: suggestion,
    severity: 1 - harmonyIndex / 5, // 严重程度（越低越和谐）
    dimensionScores: {
      disharmony: {
        total: disharmonyTotal,
        avg: disharmonyAvg,
        desc: getDimensionDesc("disharmony", disharmonyAvg),
      },
      flexibility: {
        total: flexibilityTotal,
        avg: flexibilityAvg,
        desc: getDimensionDesc("flexibility", flexibilityAvg),
      },
      rigidity: {
        total: rigidityTotal,
        avg: rigidityAvg,
        desc: getDimensionDesc("rigidity", rigidityAvg),
      },
      harmonyIndex: harmonyIndex,
      harmonyLevel: harmonyLevel,
    },
  };
}

// BDC 评分函数
function scoreBDC(answers: Record<number, number>): ScoringResult {
  // 计算总分（所有题目得分相加）
  let totalScore = 0;
  for (let i = 1; i <= 15; i++) {
    totalScore += getAnswerValue(answers, i);
  }

  // 根据总分确定抑郁程度
  let level = "";
  let suggestion = "";
  let severity = 0;

  if (totalScore <= 4) {
    level = "没有抑郁症";
    suggestion =
      "您的心理状态良好，请继续保持健康的生活方式。\n\n建议：\n• 保持规律作息\n• 适当运动\n• 与家人朋友保持良好沟通";
    severity = 0.1;
  } else if (totalScore <= 10) {
    level = "偶尔有抑郁情绪";
    suggestion =
      "您偶尔会有抑郁情绪，这是正常的，但值得关注。\n\n建议：\n• 保持规律作息，保证充足睡眠\n• 多与朋友家人交流，分享感受\n• 适当运动，如散步、瑜伽\n• 培养兴趣爱好，丰富生活";
    severity = 0.25;
  } else if (totalScore <= 20) {
    level = "轻度抑郁";
    suggestion =
      "您可能存在轻度抑郁倾向。\n\n建议：\n• 关注自己的情绪变化，记录心情日记\n• 增加社交活动，避免孤立\n• 尝试正念冥想或深呼吸放松\n• 考虑寻求心理咨询师的帮助\n• 学习压力管理和情绪调节技巧";
    severity = 0.5;
  } else if (totalScore <= 30) {
    level = "中度抑郁";
    suggestion =
      "您存在中度抑郁倾向。\n\n建议：\n• 尽快寻求专业心理咨询帮助\n• 建议前往医院心理科或精神科就诊\n• 评估是否需要药物治疗配合心理治疗\n• 建立支持系统，告知信任的人\n• 避免重大决定，给自己时间恢复\n• 学习认知行为疗法技巧";
    severity = 0.75;
  } else {
    level = "严重抑郁";
    suggestion =
      "您存在严重抑郁倾向，请立即采取行动！\n\n紧急建议：\n• 立即寻求精神科医生帮助\n• 告知家人或信任的朋友您的状况\n• 24小时心理援助热线：400-161-9995\n• 如有自伤念头，请立即前往医院急诊\n• 请记住：寻求帮助是勇敢和智慧的表现，您并不孤单";
    severity = 0.95;
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
      scorePercentage: (totalScore / 45) * 100,
    },
  };
}

// 情绪稳定性评分函数
function scoreEmotionalStability(
  answers: Record<number, number>,
): ScoringResult {
  // 计算总分（每道题得分相加）
  let totalScore = 0;
  for (let i = 1; i <= 30; i++) {
    totalScore += getAnswerValue(answers, i);
  }

  // 根据总分确定情绪稳定程度
  let level = "";
  let suggestion = "";
  let severity = 0;

  if (totalScore <= 11) {
    level = "不稳定";
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
• 记录情绪日记，了解情绪触发因素`;
    severity = 0.85;
  } else if (totalScore <= 23) {
    level = "不太稳定";
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
• 与积极乐观的人交往`;
    severity = 0.65;
  } else if (totalScore <= 36) {
    level = "中等";
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
• 适当参与社交活动，增强支持系统`;
    severity = 0.4;
  } else if (totalScore <= 48) {
    level = "较稳定";
    suggestion = `您的情绪稳定性处于"较稳定"水平。

【主要特征】
• 情绪很少波动，态度和行动稳定
• 具有良好的心理承受能力
• 能够理性应对生活中的挑战

【成长建议】
• 继续保持健康的生活方式
• 可以帮助身边情绪不稳定的人
• 在保持稳定的同时，适当体验丰富的情感
• 将积极的情绪调节经验分享给他人`;
    severity = 0.2;
  } else {
    level = "很稳定";
    suggestion = `您的情绪稳定性处于"很稳定"水平。

【主要特征】
• 稳重、成熟、自信、理智、镇定
• 具有良好的情绪调控能力
• 面对压力时能保持冷静

【成长建议】
• 继续保持良好的心理状态
• 可以作为他人的情绪支持者
• 在团队中发挥稳定作用
• 持续关注自我成长和提升`;
    severity = 0.05;
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
      scorePercentage: (totalScore / 60) * 100,
    },
  };
}

// MDQ 心境障碍问卷评分
function scoreMDQ(answers: Record<number, number>): ScoringResult {
  // 题1-13：躁狂症状计数（每道"是"=1分）
  let symptomCount = 0;
  for (let i = 1; i <= 13; i++) {
    symptomCount += getAnswerValue(answers, i);
  }

  // 题14：症状同时出现
  const coOccurrence = getAnswerValue(answers, 14) === 1;

  // 题15：功能损害
  const functionalImpairment = getAnswerValue(answers, 15) === 1;

  const isPositiveScreen = symptomCount >= 7 && coOccurrence && functionalImpairment;

  let level = "";
  let suggestion = "";
  let severity = 0;

  if (isPositiveScreen) {
    level = "阳性筛查（建议进一步评估）";
    severity = 0.8;
    suggestion = `您在MDQ筛查中结果呈阳性（症状数：${symptomCount}/13）。

【筛查说明】
• 您报告了${symptomCount}种躁狂/轻躁狂症状，且这些症状在同一时间段内同时出现
• 这些症状对您的社会功能造成了影响
• MDQ阳性筛查提示可能存在双相谱系障碍

【重要建议】
• 本筛查不能替代临床诊断，强烈建议咨询精神科医生进行专业评估
• 请向医生详细描述这些症状出现的时间、持续时长及对生活的影响
• 双相障碍是可以有效治疗的，早期干预有助于改善预后
• 如出现自伤或伤人念头，请立即拨打心理援助热线`;
  } else if (symptomCount >= 7) {
    level = "高症状（需关注）";
    severity = 0.55;
    suggestion = `您报告了${symptomCount}种躁狂/轻躁狂症状。

【分析】
• 症状数量达到阳性截断值，但可能未完全满足MDQ的辅助条件
• 部分人在应激状态、物质使用或某些躯体疾病下也可能出现类似症状

【建议】
• 建议关注自身情绪变化，记录情绪波动的时间规律
• 如症状持续或加重，建议咨询心理科或精神科医生
• 保持规律作息，避免熬夜（睡眠剥夺可能诱发情绪波动）`;
  } else if (symptomCount >= 4) {
    level = "中症状（需观察）";
    severity = 0.3;
    suggestion = `您报告了${symptomCount}种躁狂/轻躁狂症状。

【分析】
• 症状数量低于典型双相障碍筛查截断值
• 偶尔的精力旺盛或情绪波动在人群中较为常见

【建议】
• 继续观察自身情绪变化
• 如症状频繁出现或逐步加重，建议关注
• 保持健康的生活节律和情绪管理`;
  } else {
    level = "无明显躁狂症状";
    severity = 0.05;
    suggestion = `您报告的躁狂/轻躁狂症状较少（${symptomCount}/13）。

【解读】
• 目前未表现出明显的躁狂谱系症状
• 偶尔的情绪波动属于正常现象

【建议】
• 保持健康的生活方式，规律运动和作息
• 如仍有其他心理困扰，可尝试本平台其他相关量表`;
  }

  return {
    totalScore: symptomCount,
    maxScore: 13,
    level,
    suggestion,
    severity,
    dimensionScores: {
      symptomCount,
      coOccurrence,
      functionalImpairment,
      isPositiveScreen,
    },
  };
}

// ASRM Altman躁狂自评量表评分
function scoreASRM(answers: Record<number, number>): ScoringResult {
  let totalScore = 0;
  for (let i = 1; i <= 5; i++) {
    totalScore += getAnswerValue(answers, i);
  }

  const maxScore = 20;
  let level = "";
  let suggestion = "";
  let severity = 0;

  if (totalScore >= 10) {
    level = "高度提示躁狂发作可能";
    severity = 0.85;
    suggestion = `您的ASRM得分为${totalScore}分（满分20分），提示存在明显的躁狂/轻躁狂症状。

【结果解读】
• 分数≥10分提示当前可能存在躁狂或轻躁狂发作
• 可能表现为情绪异常高涨、精力过剩、睡眠需求减少、思维加速等

【重要建议】
• 强烈建议尽快咨询精神科医生进行专业评估
• 向医生详细描述近一周的症状变化
• 如伴有冲动行为、过度消费或冒险行为，请告知家人并寻求帮助
• 躁狂发作需要专业医疗干预，请不要忽视`;
  } else if (totalScore >= 6) {
    level = "轻中度躁狂症状";
    severity = 0.5;
    suggestion = `您的ASRM得分为${totalScore}分（满分20分），提示存在轻中度躁狂症状。

【结果解读】
• 分数在6-9分之间提示可能存在轻躁狂状态
• 可能比平时更加精力充沛、自信增强或睡眠减少

【建议】
• 建议关注情绪变化趋势，记录每日情绪和精力水平
• 避免过度劳累和睡眠剥夺
• 如症状持续超过4天或加重，建议咨询精神科医生
• 减少咖啡因、酒精等刺激性物质的摄入`;
  } else {
    level = "无明显躁狂症状";
    severity = 0.08;
    suggestion = `您的ASRM得分为${totalScore}分（满分20分），目前在躁狂症状方面未见明显异常。

【解读】
• 您的情绪状态和精力水平在正常范围内
• 偶尔的精力波动属于正常生理现象

【建议】
• 保持规律的生活作息和健康的情绪管理方式
• 如仍有其他心理困扰，可尝试本平台其他相关量表`;
  }

  // ASRM 五项症状剖面（每项 0-4 分）
  const asrmDims = [
    { key: 'happy', name: '开心 / 愉悦', desc: '情绪较平时更感快乐与高涨' },
    { key: 'confidence', name: '自信', desc: '自我感觉更好、更有把握' },
    { key: 'sleep', name: '睡眠需求减少', desc: '睡眠需求较平时明显减少仍精神' },
    { key: 'talk', name: '言语增多', desc: '话量增多、语速加快、表达欲强' },
    { key: 'activity', name: '活动 / 精力增多', desc: '活动与精力较平时明显旺盛' },
  ];
  const asymDims: Record<string, any> = {};
  asrmDims.forEach((d, i) => {
    asymDims[d.key] = {
      name: d.name,
      score: getAnswerValue(answers, i + 1, 0),
      max: 4,
      desc: d.desc,
    };
  });

  return {
    totalScore,
    maxScore,
    level,
    suggestion,
    severity,
    dimensionScores: { type: 'asrm', ...asymDims },
  };
}
