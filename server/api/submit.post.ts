import { calculateScore, generatePersonalizedAdvice } from '../utils/score'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { testId, answers, userInfo } = body
  
  // 验证数据
  if (!testId) {
    throw createError({
      statusCode: 400,
      message: '缺少测评ID'
    })
  }
  
  if (!answers || Object.keys(answers).length === 0) {
    throw createError({
      statusCode: 400,
      message: '请先完成所有题目'
    })
  }
  
  // 获取测评信息以获取标题
  let testTitle = ''
  try {
    const testData = await $fetch(`/api/tests/${testId}`)

    if (Array.isArray(testData)) {
      testTitle = typeof testData[0]?.title === 'string' ? testData[0]?.title : '心理测评'
    } else if ('data' in testData && typeof testData.data?.title === 'string') {
      testTitle = testData.data.title
    } else if ('title' in testData && typeof testData.title === 'string') {
      testTitle = testData.title
    }
  } catch (error) {
    testTitle = '心理测评'
  }
  
  // 计算分数
  const scoreResult = calculateScore({ testId, answers })
  
  // 生成个性化建议
  const personalizedAdvice = generatePersonalizedAdvice(scoreResult, testTitle)
  
  // 返回结果
  return {
    success: true,
    data: {
      testId,
      testTitle,
      ...scoreResult,
      personalizedAdvice,
      timestamp: new Date().toISOString(),
      answers
    }
  }
})