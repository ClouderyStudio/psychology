// server/utils/emotional-stability-questions.ts
export interface EmotionalStabilityQuestion {
  id: number
  text: string
}

// 情绪稳定性测试选项（是？否）
export const emotionalStabilityOptions = [
  { value: 2, label: '是' },
  { value: 1, label: '?' },
  { value: 0, label: '否' }
]

// 30道情绪稳定性测试题目[citation:1]
export const emotionalStabilityQuestions: EmotionalStabilityQuestion[] = [
  { id: 1, text: '我从未患过梦游症（即睡着时起来走路）' },
  { id: 2, text: '我从未因病而休假半年以上时间' },
  { id: 3, text: '如果在工作时有人来打扰我，我就会很恼火' },
  { id: 4, text: '我几乎每天都会遇到一些难以处理的事情' },
  { id: 5, text: '在最近一次学习新知识或技巧时，我感到很有信心' },
  { id: 6, text: '我时常会被一些事情所激怒' },
  { id: 7, text: '若是遭到别人的侮辱，我的心情将久久不能平息，过了好多天仍不能忘记' },
  { id: 8, text: '我感到自己的生活是丰富的，并不单调' },
  { id: 9, text: '通常我很容易入睡，并且睡得很好' },
  { id: 10, text: '我是个容易害羞的人' },
  { id: 11, text: '若是知道有人恨我，我也不放在心上' },
  { id: 12, text: '我有时会莫名其妙地感到欢乐或悲哀' },
  { id: 13, text: '我常常在应当着手做书面工作时，沉浸在幻想之中' },
  { id: 14, text: '最近五年来我从未做过噩梦' },
  { id: 15, text: '我在搭电梯、穿马路或站在高处时会感到恐惧' },
  { id: 16, text: '遇到紧急事情时，我总能冷静地处理好' },
  { id: 17, text: '在日常生活中我是个感情用事的人' },
  { id: 18, text: '我很少担心自己的健康问题' },
  { id: 19, text: '我清楚地记得去年有哪些人经常给我造成麻烦' },
  { id: 20, text: '读书阶段，如果没有家庭作业和考试，我就不会主动去学习' },
  { id: 21, text: '最近五年内，我在工作和学习时，从来没有感到空虚茫然' },
  { id: 22, text: '在过去一年中我遇到三个以上对我不友好的人' },
  { id: 23, text: '在我的一生中，我能够达到我所希望的目标' },
  { id: 24, text: '看到别人做出怪异的行为，我总是难以忍受' },
  { id: 25, text: '自杀是荒唐的，我从未动过自杀的念头' },
  { id: 26, text: '我常常感到不快乐' },
  { id: 27, text: '这两年我从未泄过肚子' },
  { id: 28, text: '通常情况下，我很有自信心' },
  { id: 29, text: '我相信自己有办法像多数人一样轻松地处理生活中的事情' },
  { id: 30, text: '最近一个月里，我几次服用镇静剂或安眠药' }
]

// 情绪稳定性评分标准[citation:1]
export const stabilityLevels = [
  { min: 0, max: 11, level: '不稳定', description: '情绪过敏，内心困扰，心情波动大' },
  { min: 12, max: 23, level: '不太稳定', description: '情绪经常波动，内心有困扰' },
  { min: 24, max: 36, level: '中等', description: '介于情绪敏感与情绪稳定之间' },
  { min: 37, max: 48, level: '较稳定', description: '情绪很少波动，有较稳定的态度和行动' },
  { min: 49, max: 60, level: '很稳定', description: '稳重、成熟、自信、理智、镇定' }
]