import { calculateScore, isRespondentMode, type RespondentMode } from "../utils/score";
import { isMultidimMode } from "../utils/questions/multidim-questions";
import {
  validateAnswers,
  type QuestionLike,
} from "../utils/validate-answers";
import { verifyQuestionToken } from "../utils/question-token";
import { enforceRateLimit, clientKey } from "../utils/rate-limit";
import {
  idempotencyKey,
  readIdempotent,
  writeIdempotent,
} from "../utils/idempotency";

export default defineEventHandler(async (event) => {
  // 结算成本高（重建题库 + 校验 + 评分），先限流再解析请求体
  enforceRateLimit(event, { scope: "submit", limit: 30, windowMs: 10 * 60 * 1000 });

  const body = await readBody(event).catch(() => ({}));
  const {
    testId,
    answers,
    userInfo,
    mode,
    seed,
    questionToken,
    submissionId,
    respondent,
  } = body || {};

  // 作答来源：本人自评 / 他人代答。取值非法时按自评处理，但会记入结果供排查。
  const respondentMode: RespondentMode = isRespondentMode(respondent)
    ? respondent
    : "self";

  // 验证数据
  if (!testId || typeof testId !== "string") {
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

  // 幂等：同一份作答重复提交直接回放上一次的结果
  const idemKey = idempotencyKey(clientKey(event), testId, submissionId);
  const cached = readIdempotent(idemKey);
  if (cached) return cached;

  // 多维自评量表按模式出题：优先以服务端签发的出题凭证为准，
  // 避免客户端把「评分用的 mode / seed」换成与出题时不同的一套。
  let effectiveMode = mode;
  let effectiveSeed = seed;
  let questionSetVerified = false;
  if (testId === "multidim") {
    const token = verifyQuestionToken(questionToken, "multidim");
    if (token && isMultidimMode(token.mode)) {
      effectiveMode = token.mode;
      effectiveSeed = token.seed;
      questionSetVerified = true;
    }
    if (!isMultidimMode(effectiveMode)) {
      throw createError({
        statusCode: 400,
        message: "缺少评估模式，请返回重新选择模式后再提交",
      });
    }
  }

  // 拉取测评完整数据（标题 + 题目），用于标题展示与完整性/值域校验
  let testData: any = null;
  try {
    let url = `/api/tests/${encodeURIComponent(testId)}`;
    if (testId === "multidim") {
      url += `?mode=${encodeURIComponent(effectiveMode)}`;
      if (typeof effectiveSeed === "string" && effectiveSeed) {
        url += `&seed=${encodeURIComponent(effectiveSeed)}`;
      }
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
    mode: typeof effectiveMode === "string" ? effectiveMode : undefined,
    respondent: respondentMode,
  });

  // 返回结果。
  // 不再回显 answers：作答明细会随结果一起被写进本机存档（结果页备注、导出、
  // 复制分享都以该对象为准），把完整作答原样带回去等于把答题卡长期留在设备上。
  const payload = {
    success: true,
    data: {
      testId,
      testTitle,
      ...scoreResult,
      timestamp: new Date().toISOString(),
      // 本次评分所用题目集合是否由服务端凭证确认（供排查用，不影响展示）
      questionSetVerified,
    },
  };

  writeIdempotent(idemKey, payload);
  return payload;
});
