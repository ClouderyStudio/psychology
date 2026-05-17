export interface TemperamentQuestion {
  id: number
  text: string
  dimension: 'choleric' | 'sanguine' | 'phlegmatic' | 'melancholic'
}

// 气质类型选项（-2 到 +2 的5点计分）
export const temperamentOptions = [
  { value: -2, label: '很不符合' },
  { value: -1, label: '较不符合' },
  { value: 0, label: '一般' },
  { value: 1, label: '较符合' },
  { value: 2, label: '很符合' }
]

// 60道气质类型测试题目
export const temperamentQuestions: TemperamentQuestion[] = [
  { id: 1, text: '做事力求稳妥，一般不做无把握的事', dimension: 'phlegmatic' },
  { id: 2, text: '遇到可气的事就怒不可遏，想把心里话全说出来才痛快', dimension: 'choleric' },
  { id: 3, text: '宁可一个人干事，不愿很多人在一起', dimension: 'melancholic' },
  { id: 4, text: '到一个新环境很快就能适应', dimension: 'sanguine' },
  { id: 5, text: '厌恶那些强烈的刺激，如尖叫、噪音、危险镜头等', dimension: 'melancholic' },
  { id: 6, text: '和人争吵时，总是先发制人，喜欢挑衅', dimension: 'choleric' },
  { id: 7, text: '喜欢安静的环境', dimension: 'phlegmatic' },
  { id: 8, text: '善于和人交往', dimension: 'sanguine' },
  { id: 9, text: '羡慕那种善于克制自己感情的人', dimension: 'choleric' },
  { id: 10, text: '生活有规律，很少违反作息制度', dimension: 'phlegmatic' },
  { id: 11, text: '在多数情况下情绪是乐观的', dimension: 'sanguine' },
  { id: 12, text: '碰到陌生人觉得很拘束', dimension: 'melancholic' },
  { id: 13, text: '遇到令人气愤的事，能很好地自我克制', dimension: 'phlegmatic' },
  { id: 14, text: '做事总是有旺盛的精力', dimension: 'choleric' },
  { id: 15, text: '遇到问题总是举棋不定、优柔寡断', dimension: 'melancholic' },
  { id: 16, text: '在人群中从不觉得过分拘束', dimension: 'sanguine' },
  { id: 17, text: '情绪高昂时，觉得干什么都有趣；情绪低落时，又觉得什么都没有意思', dimension: 'choleric' },
  { id: 18, text: '当注意力集中于一事物时，别的事很难使我分心', dimension: 'phlegmatic' },
  { id: 19, text: '理解问题总比别人快', dimension: 'sanguine' },
  { id: 20, text: '碰到危险情景，常有一种极度恐怖感', dimension: 'melancholic' },
  { id: 21, text: '对学习、工作怀有很高的热情', dimension: 'choleric' },
  { id: 22, text: '能够长时间做枯燥、单调的工作', dimension: 'phlegmatic' },
  { id: 23, text: '符合兴趣的事情，干起来劲头十足，否则就不想干', dimension: 'sanguine' },
  { id: 24, text: '一点小事就能引起情绪波动', dimension: 'melancholic' },
  { id: 25, text: '讨厌做那种需要耐心、细致的工作', dimension: 'choleric' },
  { id: 26, text: '与人交往不卑不亢', dimension: 'sanguine' },
  { id: 27, text: '喜欢参加热烈的活动', dimension: 'choleric' },
  { id: 28, text: '爱看感情细腻、描写人物内心活动的文艺作品', dimension: 'melancholic' },
  { id: 29, text: '工作学习时间长了，常感到厌倦', dimension: 'sanguine' },
  { id: 30, text: '不喜欢长时间谈论一个问题，愿意实际动手干', dimension: 'choleric' },
  { id: 31, text: '宁愿侃侃而谈，不愿窃窃私语', dimension: 'sanguine' },
  { id: 32, text: '别人总是说我闷闷不乐', dimension: 'melancholic' },
  { id: 33, text: '理解问题常比别人慢些', dimension: 'phlegmatic' },
  { id: 34, text: '疲倦时只要短暂的休息就能精神抖擞，重新投入工作', dimension: 'sanguine' },
  { id: 35, text: '心里有话宁愿自己想，不愿说出来', dimension: 'melancholic' },
  { id: 36, text: '认准一个目标就希望尽快实现，不达目的，誓不罢休', dimension: 'choleric' },
  { id: 37, text: '学习、工作同样一段时间后，常比别人更疲倦', dimension: 'melancholic' },
  { id: 38, text: '做事有些莽撞，常常不考虑后果', dimension: 'choleric' },
  { id: 39, text: '老师或他人讲授新知识、技术时，总希望他讲得慢些，多重复几遍', dimension: 'phlegmatic' },
  { id: 40, text: '能够很快地忘记那些不愉快的事情', dimension: 'sanguine' },
  { id: 41, text: '做作业或完成一件工作总比别人花的时间多', dimension: 'phlegmatic' },
  { id: 42, text: '喜欢运动量大的剧烈体育运动，或者参加各种文艺活动', dimension: 'choleric' },
  { id: 43, text: '不能很快地把注意力从一件事转移到另一件事上去', dimension: 'phlegmatic' },
  { id: 44, text: '接受一个任务后，就希望把它迅速解决', dimension: 'choleric' },
  { id: 45, text: '认为墨守成规比冒风险强些', dimension: 'phlegmatic' },
  { id: 46, text: '能够同时注意几件事物', dimension: 'sanguine' },
  { id: 47, text: '当我烦闷的时候，别人很难使我高兴起来', dimension: 'melancholic' },
  { id: 48, text: '爱看情节起伏跌宕、激动人心的小说', dimension: 'choleric' },
  { id: 49, text: '对工作抱认真严谨、始终一贯的态度', dimension: 'phlegmatic' },
  { id: 50, text: '和周围人的关系总是相处不好', dimension: 'melancholic' },
  { id: 51, text: '喜欢复习学过的知识，重复做能熟练做的工作', dimension: 'phlegmatic' },
  { id: 52, text: '希望做变化大、花样多的工作', dimension: 'sanguine' },
  { id: 53, text: '小时候会背的诗歌，我似乎比别人记得清楚', dimension: 'melancholic' },
  { id: 54, text: '别人说我"出语伤人"，可我并不觉得这样', dimension: 'choleric' },
  { id: 55, text: '在体育活动中，常因反应慢而落后', dimension: 'phlegmatic' },
  { id: 56, text: '反应敏捷，头脑机智', dimension: 'sanguine' },
  { id: 57, text: '喜欢有条理而不甚麻烦的工作', dimension: 'phlegmatic' },
  { id: 58, text: '兴奋的事常使我失眠', dimension: 'choleric' },
  { id: 59, text: '老师讲新概念，常常听不懂，但是弄懂了以后很难忘记', dimension: 'phlegmatic' },
  { id: 60, text: '假如工作枯燥无味，马上就会情绪低落', dimension: 'sanguine' }
]

// 气质类型维度信息
export const temperamentDimensions = {
  choleric: {
    name: '胆汁质',
    nameEn: 'Choleric',
    icon: '🔥',
    color: 'var(--choleric)',
    lightColor: 'var(--choleric-light)',
    darkColor: 'var(--choleric-dark)'
  },
  sanguine: {
    name: '多血质',
    nameEn: 'Sanguine',
    icon: '💧',
    color: 'var(--sanguine)',
    lightColor: 'var(--sanguine-light)',
    darkColor: 'var(--sanguine-dark)'
  },
  phlegmatic: {
    name: '粘液质',
    nameEn: 'Phlegmatic',
    icon: '🌱',
    color: 'var(--phlegmatic)',
    lightColor: 'var(--phlegmatic-light)',
    darkColor: 'var(--phlegmatic-dark)'
  },
  melancholic: {
    name: '抑郁质',
    nameEn: 'Melancholic',
    icon: '🌙',
    color: 'var(--melancholic)',
    lightColor: 'var(--melancholic-light)',
    darkColor: 'var(--melancholic-dark)'
  }
}