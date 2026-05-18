// server/utils/bdc-questions.ts
export interface BDCQuestion {
  id: number
  text: string
}

// BDC 选项（0-3分，4点计分）
export const bdcOptions = [
  { value: 0, label: '没有' },
  { value: 1, label: '轻度' },
  { value: 2, label: '中度' },
  { value: 3, label: '严重' }
]

// BDC 15道题目
export const bdcQuestions: BDCQuestion[] = [
  { id: 1, text: '悲伤：你是否一直感到伤心或悲哀？' },
  { id: 2, text: '泄气：你是否感到前景渺茫？' },
  { id: 3, text: '缺乏自尊：你是否觉得自己没有价值或自以为是一个失败者？' },
  { id: 4, text: '自卑：你是否觉得力不从心或自叹比不上别人？' },
  { id: 5, text: '内疚：你是否对任何事都自责？' },
  { id: 6, text: '犹豫：你是否在做决定时犹豫不决？' },
  { id: 7, text: '焦躁不安：这段时间你是否一直处于愤怒和不满状态？' },
  { id: 8, text: '对生活丧失兴趣：你对事业、家庭、爱好或朋友是否丧失了兴趣？' },
  { id: 9, text: '丧失动机：你是否感到一蹶不振做事情毫无动力？' },
  { id: 10, text: '自我印象可怜：你是否以为自己已衰老或失去魅力？' },
  { id: 11, text: '食欲变化：你是否感到食欲不振或情不自禁地暴饮暴食？' },
  { id: 12, text: '睡眠变化：你是否患有失眠症或整天感到体力不支、昏昏欲睡？' },
  { id: 13, text: '丧失性欲：你是否丧失了对性的兴趣？' },
  { id: 14, text: '臆想症：你是否经常担心自己的健康？' },
  { id: 15, text: '自杀冲动：你是否认为生存没有价值，或生不如死？' }
]

// 分数范围与抑郁程度对应
export const bdcLevels = [
  { min: 0, max: 4, level: '没有抑郁症', suggestion: '您的心理状态良好，请继续保持健康的生活方式。' },
  { min: 5, max: 10, level: '偶尔有抑郁情绪', suggestion: '您偶尔会有抑郁情绪，这是正常的。建议：\n• 保持规律作息\n• 多与朋友家人交流\n• 适当运动放松' },
  { min: 11, max: 20, level: '轻度抑郁', suggestion: '您可能存在轻度抑郁倾向。建议：\n• 关注自己的情绪变化\n• 增加社交活动\n• 尝试心理咨询\n• 学习压力管理技巧' },
  { min: 21, max: 30, level: '中度抑郁', suggestion: '您存在中度抑郁倾向，建议：\n• 尽快寻求专业心理咨询帮助\n• 评估是否需要药物治疗\n• 建立支持系统\n• 不要独自承受' },
  { min: 31, max: 45, level: '严重抑郁', suggestion: '您存在严重抑郁倾向，强烈建议：\n• 立即寻求精神科医生帮助\n• 告知家人您的状况\n• 如有自伤念头，立即拨打心理援助热线\n• 请记住，寻求帮助是勇敢的表现' }
]