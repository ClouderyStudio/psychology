import { calculateScore, generatePersonalizedAdvice } from "../utils/score";

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const { testId, answers, userInfo } = body;

  // 验证数据
  if (!testId) {
    throw createError({
      statusCode: 400,
      message: "缺少测评ID",
    });
  }

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    throw createError({
      statusCode: 400,
      message: "请先完成所有题目",
    });
  }

  // 拉取测评完整数据（标题 + 题目），用于标题展示与完整性/值域校验
  let testData: any = null;
  try {
    testData = await $fetch(`/api/tests/${testId}`);
  } catch {
    throw createError({
      statusCode: 400,
      message: "测评不存在",
    });
  }

  const testTitle =
    (typeof testData?.data?.title === "string" && testData.data.title) || "心理测评";

  // 完整性校验：所有题目必须作答
  const questions: Array<{ id: number; options?: Array<{ value: number }> }> =
    Array.isArray(testData?.data?.questions) ? testData.data.questions : [];

  if (questions.length > 0) {
    // number 题（如生理年龄）为可选，不参与必答校验
    const missing = questions.filter((q) => (q as any).type !== "number" && !(q.id in answers));
    if (missing.length > 0) {
      throw createError({
        statusCode: 400,
        message: `还有 ${missing.length} 道题未作答，请先完成所有题目`,
      });
    }

    // 值域校验：答案必须是数字且在选项分值范围内（number 题为可选自由输入，跳过）
    for (const q of questions) {
      if ((q as any).type === "number") continue;
      const val = answers[q.id];
      if (typeof val !== "number" || Number.isNaN(val)) {
        throw createError({
          statusCode: 400,
          message: `第 ${q.id} 题的答案格式不正确`,
        });
      }
      if (Array.isArray(q.options) && q.options.length > 0) {
        const values = q.options.map((o) => o.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        if (val < min || val > max) {
          throw createError({
            statusCode: 400,
            message: `第 ${q.id} 题的选项无效`,
          });
        }
      }
    }
  }

  // 计算分数
  const scoreResult = calculateScore({ testId, answers });

  // 生成个性化建议
  const personalizedAdvice = generatePersonalizedAdvice(scoreResult, testTitle);

  // 返回结果
  return {
    success: true,
    data: {
      testId,
      testTitle,
      ...scoreResult,
      personalizedAdvice,
      timestamp: new Date().toISOString(),
      answers,
    },
  };
});
