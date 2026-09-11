import { calculateScore } from "../utils/score";
import { isMultidimMode } from "../utils/questions/multidim-questions";
import {
  validateAnswers,
  type QuestionLike,
} from "../utils/validate-answers";

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const { testId, answers, userInfo, mode, seed } = body;

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

  // 多维自评量表按模式出题：提交时必须带回评估模式（与种子），
  // 以便用同一套题目复现并校验作答完整性。
  if (testId === "multidim" && !isMultidimMode(mode)) {
    throw createError({
      statusCode: 400,
      message: "缺少评估模式，请返回重新选择模式后再提交",
    });
  }

  // 拉取测评完整数据（标题 + 题目），用于标题展示与完整性/值域校验
  let testData: any = null;
  try {
    let url = `/api/tests/${testId}`;
    if (testId === "multidim") {
      url += `?mode=${encodeURIComponent(mode)}`;
      if (typeof seed === "string" && seed) url += `&seed=${encodeURIComponent(seed)}`;
    }
    testData = await $fetch(url);
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
  const scoreResult = calculateScore({
    testId,
    answers,
    mode: typeof mode === "string" ? mode : undefined,
  });

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
