// SIOSS 自杀意念自评量表（26 题，是/否）· 计分
import type { ScoringResult } from "../score";


function getAnswerValue(
  answers: Record<number, number>,
  id: number,
  fallback = 0,
): number {
  return answers[id] ?? fallback;
}

export function scoreSIOSS(answers: Record<number, number>): ScoringResult {
  // 反向计分题（答"否"计1分）：含乐观/睡眠的积极表述条目 + 全部掩饰条目
  const reverseItems = new Set([1, 5, 6, 7, 9, 10, 13, 15, 21, 25]);
  const concealmentItems = [6, 9, 13, 15, 25]; // 掩饰因子（不计入总分）
  const hopelessItems = [2, 3, 4, 8, 11, 14, 16, 17, 19, 20, 23, 26]; // 绝望
  const optimismItems = [1, 7, 10, 21]; // 乐观（反向：得分越高乐观感越缺乏）
  const sleepItems = [5, 12, 18, 24]; // 睡眠
  const historyItems = [22]; // 既往自杀行为
  const dangerItems = [11, 17, 22, 26]; // 强烈危险信号条目

  let totalScore = 0;
  let hopeless = 0;
  let optimism = 0;
  let sleep = 0;
  let history = 0;
  let concealment = 0;

  for (let i = 1; i <= 26; i++) {
    const answer = getAnswerValue(answers, i); // 0 / 1
    const scored = reverseItems.has(i) ? (answer === 0 ? 1 : 0) : answer;

    if (concealmentItems.includes(i)) {
      concealment += scored;
      continue; // 掩饰条目不计入总分
    }
    totalScore += scored;
    if (hopelessItems.includes(i)) hopeless += scored;
    else if (optimismItems.includes(i)) optimism += scored;
    else if (sleepItems.includes(i)) sleep += scored;
    else if (historyItems.includes(i)) history += scored;
  }

  const maxScore = 21;
  const unreliable = concealment >= 4; // 掩饰分≥4 → 作答可能不真实
  const dangerEndorsed = dangerItems.some((id) => getAnswerValue(answers, id) === 1);

  const concealmentNote = unreliable
    ? `\n\n⚠️ 测谎提示：您的掩饰维度得分为 ${concealment}/5（≥4 分），说明作答时可能存在较强的掩饰倾向，结果未必真实，您的实际风险可能高于所显示的分数。`
    : "";

  const crisisContact = `\n\n【需要帮助时请立即联系】
• 全国统一心理援助热线：12356（24小时，免费，由国家卫健委统一管理）
• 希望24热线：400-161-9995（24小时）
• 紧急情况请拨打 120，或前往就近医院急诊`;

  let level = "";
  let suggestion = "";
  let severity = 0;

  if (totalScore >= 12) {
    // 筛查阳性
    level = "存在自杀意念（筛查阳性）";
    severity = Math.min(0.95, 0.75 + (totalScore - 12) * 0.02);
    suggestion = `您的SIOSS总分为 ${totalScore}/${maxScore} 分，达到自杀意念筛查阳性标准（≥12 分）。${concealmentNote}

【分数构成】
• 绝望感：${hopeless}/12 | 乐观感缺乏（反向）：${optimism}/4 | 睡眠困扰：${sleep}/4 | 既往自杀行为：${history === 1 ? "有" : "无"}

【结果解读】
• 本结果提示您近期可能存在较明显的自杀意念
• SIOSS为筛查工具，不能替代临床诊断，但这份结果意味着您需要尽快获得专业评估与支持

【请立即行动】
• 请告诉一位您信任的人（家人、朋友、老师、辅导员），不要独自承受
• 尽快前往医院精神心理科或当地精神卫生中心就诊，请专业人员为您评估
• 在获得帮助之前，请远离可能伤害自己的工具和环境
• 如果您此刻就有伤害自己的念头或具体计划，请立即拨打下方热线或前往急诊${crisisContact}

请记住：此刻的痛苦是可以被帮助的，自杀意念是一种可以被治疗的状态。您并不孤单，求助是勇敢的表现。`;
  } else if (dangerEndorsed) {
    // 总分未达标准，但关键条目（想结束生命/曾经自杀过/一死了之等）被肯定
    level = "存在需要关注的自杀相关危险信号";
    severity = 0.62;
    suggestion = `您的SIOSS总分为 ${totalScore}/${maxScore} 分，未达到阳性标准（≥12 分），但您对部分关键条目（如"我想结束自己的生命""我曾经自杀过""有时我想一死了之"等）作出了肯定回答，这是必须严肃对待的危险信号。${concealmentNote}

【为什么需要重视】
• 既往有过自杀行为、或明确出现过结束生命的念头，是后续风险最重要的预测因素之一
• 即便总分不高，只要有这类信号，就值得立刻寻求专业帮助，而不是"再等等看"

【请立即行动】
• 请把您的真实情况告诉一位信任的人，不要独自承担
• 尽快前往医院精神心理科或精神卫生中心做一次专业评估
• 若此刻情绪激烈或已有计划，请立即拨打下方热线或前往急诊${crisisContact}`;
  } else if (unreliable) {
    // 掩饰分过高且总分不高、无危险信号：结果无效
    level = "结果参考价值有限（掩饰倾向明显）";
    severity = 0.15;
    suggestion = `您的掩饰（测谎）维度得分为 ${concealment}/5，达到无效标准（≥4 分），说明您在作答时可能没有完全如实回答，本次结果的参考价值有限。

【说明】
• 掩饰条目大多是一些"几乎人人都会有的小缺点"，绝大多数人都会如实承认其中的数条；几乎全部选择"否"往往意味着回答不真实
• 因此上面的自杀意念分数（${totalScore}/${maxScore} 分）只能作为参考，不能据此判断您一定安全，也不能据此排除风险

【建议】
• 如果您刚才有所顾虑，可以在安心、私密的环境下重新如实作答一次
• 如果您实际上正经历痛苦、或出现过结束生命的念头，请不必因顾虑而隐瞒——求助是勇敢的表现，专业人员会尊重并帮助您
• 需要倾诉时，可随时拨打全国统一心理援助热线 12356（24小时，免费）`;
  } else {
    // 有效作答且总分不高、无危险信号
    level = "未检出明显自杀意念";
    severity = Math.min(0.4, (totalScore / maxScore) * 0.6);
    suggestion = `您的SIOSS总分为 ${totalScore}/${maxScore} 分，低于筛查阳性标准（≥12 分），本次评估未提示明显的自杀意念。

【分数构成】
• 绝望感：${hopeless}/12 | 乐观感缺乏（反向）：${optimism}/4 | 睡眠困扰：${sleep}/4 | 既往自杀行为：${history === 1 ? "有" : "无"}
（题22"我曾经自杀过"答"是"计1分并计入总分）

【说明】
• 本量表反映的是您作答时的心理状态；自杀意念可能随情绪、压力和生活处境而波动
• 如果某一天您感到痛苦难以承受，或脑海中出现死亡相关念头，请不要忽视，可向信任的人倾诉，或拨打 12356 心理援助热线
• 保持规律作息、适度运动与社交联结，都是保护心理健康的有效方式`;
  }

  return {
    totalScore,
    maxScore,
    level,
    suggestion,
    severity,
    dimensionScores: {
      hopeless: { score: hopeless, max: 12 },
      optimism: { score: optimism, max: 4, note: "反向计分：得分越高提示乐观感越缺乏" },
      sleep: { score: sleep, max: 4 },
      suicideHistory: history === 1,
      concealment: { score: concealment, max: 5, valid: !unreliable },
      reliability: unreliable ? "unreliable" : "reliable",
    },
  };
}
