import { calculateScore } from "../utils/score";
import {
  validateAnswers,
  type QuestionLike,
} from "../utils/validate-answers";

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

  // 作答校验（完整性 / 值域 / 多余题号）
  const questions: QuestionLike[] = Array.isArray(testData?.data?.questions)
    ? testData.data.questions
    : [];

  if (questions.length > 0) {
    const err = validateAnswers(questions, answers);
    if (err) {
      throw createError({
        statusCode: 400,
        message: err,
      });
    }
  }

  // 计算分数
  const scoreResult = calculateScore({ testId, answers });

  // 返回结果
  return {
    success: true,
    data: {
      testId,
      testTitle,
      ...scoreResult,
      timestamp: new Date().toISOString(),
      answers,
    },
  };
});
