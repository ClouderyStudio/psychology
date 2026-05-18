export interface EPQQuestion {
  id: number
  text: string
  scale: 'E' | 'N' | 'P' | 'L'  // E:内外向, N:神经质, P:精神质, L:掩饰性
  reverse: boolean  // true表示反向计分（答"否"计分）
}

// EPQ 选项（是/否）
export const epqOptions = [
  { value: 1, label: '是' },
  { value: 0, label: '否' }
]

// EPQ 88道题目（按顺序1-88）
export const epqQuestions: EPQQuestion[] = [
  // 1-10
  { id: 1, text: '你是否有许多不同的业余爱好？', scale: 'E', reverse: false },
  { id: 2, text: '你是否在做任何事情以前都要停下来仔细思考？', scale: 'P', reverse: true },
  { id: 3, text: '你的心境是否常有起伏？', scale: 'N', reverse: false },
  { id: 4, text: '你曾有过明知是别人的功劳而你去接受奖励的事情吗？', scale: 'L', reverse: true },
  { id: 5, text: '你是否健谈？', scale: 'E', reverse: false },
  { id: 6, text: '欠债会使你不安吗？', scale: 'P', reverse: true },
  { id: 7, text: '你曾无缘无故觉得"真是难受"吗？', scale: 'N', reverse: false },
  { id: 8, text: '你曾经贪图过份外之物吗？', scale: 'L', reverse: true },
  { id: 9, text: '你是否在晚上小心翼翼地关好门窗？', scale: 'P', reverse: true },
  { id: 10, text: '你是否比较活跃？', scale: 'E', reverse: false },
  
  // 11-20
  { id: 11, text: '你在见到一小孩或一动物受折磨时是否会感受到非常难过？', scale: 'P', reverse: true },
  { id: 12, text: '你是否常常为自己不该做而做了的事，不该说而说了的话而紧张吗？', scale: 'N', reverse: false },
  { id: 13, text: '你喜欢跳降落伞吗？', scale: 'E', reverse: false },
  { id: 14, text: '通常你能在热闹联欢会中尽情地玩吗？', scale: 'E', reverse: false },
  { id: 15, text: '你容易激动吗？', scale: 'N', reverse: false },
  { id: 16, text: '你曾经将自己的过错推给别人吗？', scale: 'L', reverse: true },
  { id: 17, text: '你喜欢会见陌生人吗？', scale: 'E', reverse: false },
  { id: 18, text: '你是否相信保险制度是一种好办法？', scale: 'P', reverse: true },
  { id: 19, text: '你是一个容易伤感情的人吗？', scale: 'N', reverse: false },
  { id: 20, text: '你所有的习惯都是好的吗？', scale: 'L', reverse: false },
  
  // 21-30
  { id: 21, text: '在社交场合你是否总不愿露头角？', scale: 'E', reverse: true },
  { id: 22, text: '你会服用有奇异或危险作用的药物吗？', scale: 'P', reverse: false },
  { id: 23, text: '你常有"厌倦"之感吗？', scale: 'N', reverse: false },
  { id: 24, text: '你曾拿过别人的东西（哪怕一针一线）吗？', scale: 'L', reverse: true },
  { id: 25, text: '你是否常爱外出？', scale: 'E', reverse: false },
  { id: 26, text: '你是否从伤害你所爱的人中而感到乐趣？', scale: 'P', reverse: false },
  { id: 27, text: '你常为有罪恶之感所苦恼吗？', scale: 'N', reverse: false },
  { id: 28, text: '你在谈论中是否有时不懂装懂？', scale: 'L', reverse: true },
  { id: 29, text: '你是否宁愿去看些书而不愿去多见人？', scale: 'E', reverse: true },
  { id: 30, text: '你有要伤害你的仇人吗？', scale: 'P', reverse: false },
  
  // 31-40
  { id: 31, text: '你觉得自己是一个神经过敏的人吗？', scale: 'N', reverse: false },
  { id: 32, text: '对人有所失礼时，你是否经常要表示歉意？', scale: 'L', reverse: false },
  { id: 33, text: '你有许多朋友吗？', scale: 'E', reverse: false },
  { id: 34, text: '你是否喜欢讲些有时确能伤害人的笑话？', scale: 'P', reverse: false },
  { id: 35, text: '你是一个多忧多虑的人吗？', scale: 'N', reverse: false },
  { id: 36, text: '你在童年时是否按照吩咐要做什么便做什么，毫无怨言？', scale: 'L', reverse: false },
  { id: 37, text: '你认为你是一个乐天派吗？', scale: 'E', reverse: false },
  { id: 38, text: '你很讲究礼貌和整洁吗？', scale: 'P', reverse: true },
  { id: 39, text: '你是否总在担心会发生可怕的事情？', scale: 'N', reverse: false },
  { id: 40, text: '你曾损坏或遗失过别人的东西吗？', scale: 'L', reverse: true },
  
  // 41-50
  { id: 41, text: '交新朋友时一般是你采取主动吗？', scale: 'E', reverse: false },
  { id: 42, text: '当别人向你诉苦时，你是否容易理解他们的苦衷？', scale: 'P', reverse: true },
  { id: 43, text: '你认为自己很紧张，如同"拉紧的弦"一样吗？', scale: 'N', reverse: false },
  { id: 44, text: '在没有废纸篓时，你是否将废纸扔在地板上？', scale: 'L', reverse: true },
  { id: 45, text: '当你与别人在一起时，你是否言语很少？', scale: 'E', reverse: true },
  { id: 46, text: '你是否认为结婚制度是过时了，应该废止？', scale: 'P', reverse: false },
  { id: 47, text: '你是否有时感到自己可怜？', scale: 'N', reverse: false },
  { id: 48, text: '你是否有时有点自夸？', scale: 'L', reverse: true },
  { id: 49, text: '你是否很容易将一个沉寂的集会搞得活跃起来？', scale: 'E', reverse: false },
  { id: 50, text: '你是否讨厌那种小心翼翼地开车的人？', scale: 'P', reverse: false },
  
  // 51-60
  { id: 51, text: '你为你的健康担忧吗？', scale: 'N', reverse: false },
  { id: 52, text: '你曾讲过什么人的坏话吗？', scale: 'L', reverse: true },
  { id: 53, text: '你是否喜欢对朋友讲笑话和有趣的故事？', scale: 'E', reverse: false },
  { id: 54, text: '你小时候曾对父母粗暴无礼吗？', scale: 'L', reverse: true },
  { id: 55, text: '你是否喜欢与人混在一起？', scale: 'E', reverse: false },
  { id: 56, text: '你如知道自己工作有错误，这会使你感到难过吗？', scale: 'P', reverse: true },
  { id: 57, text: '你患失眠吗？', scale: 'N', reverse: false },
  { id: 58, text: '你吃饭前必定洗手吗？', scale: 'L', reverse: false },
  { id: 59, text: '你常无缘无故感到无精打采和倦怠吗？', scale: 'N', reverse: false },
  { id: 60, text: '和别人玩游戏时，你有过欺骗行为吗？', scale: 'L', reverse: true },
  
  // 61-70
  { id: 61, text: '你是否喜欢从事一些动作迅速的工作？', scale: 'E', reverse: false },
  { id: 62, text: '你的母亲是一位善良的妇人吗？', scale: 'P', reverse: true },
  { id: 63, text: '你是否常常觉得人生非常无味？', scale: 'N', reverse: false },
  { id: 64, text: '你曾利用过某人为自己取得好处吗？', scale: 'L', reverse: true },
  { id: 65, text: '你是否常常参加许多活动，超过你的时间所允许？', scale: 'E', reverse: false },
  { id: 66, text: '是否有几个人总在躲避你？', scale: 'P', reverse: false },
  { id: 67, text: '你是否为你的容貌而非常烦恼？', scale: 'N', reverse: false },
  { id: 68, text: '你是否觉得人们为了未来有保障而办理储蓄和保险所花的时间太多？', scale: 'P', reverse: false },
  { id: 69, text: '你曾有过不如死了为好的愿望吗？', scale: 'N', reverse: false },
  { id: 70, text: '如果有把握永远不会被人发现，你会逃税吗？', scale: 'L', reverse: true },
  
  // 71-80
  { id: 71, text: '你能使一个集会顺利进行吗？', scale: 'E', reverse: false },
  { id: 72, text: '你能克制自己不对人无礼吗？', scale: 'P', reverse: true },
  { id: 73, text: '遇到一次难堪的经历后，你是否在一段长时间内还感到难受？', scale: 'N', reverse: false },
  { id: 74, text: '你患有"神经过敏"吗？', scale: 'N', reverse: false },
  { id: 75, text: '你曾经故意说些什么来伤害别人的感情吗？', scale: 'P', reverse: false },
  { id: 76, text: '你是否与别人的友谊容易破裂，虽然不是你的过错？', scale: 'P', reverse: false },
  { id: 77, text: '你常感到孤单吗？', scale: 'N', reverse: false },
  { id: 78, text: '当人家寻你的差错，找你工作中的缺点时，你是否容易在精神上受挫伤？', scale: 'N', reverse: false },
  { id: 79, text: '你赴约会或上班曾迟到过吗？', scale: 'L', reverse: true },
  { id: 80, text: '你喜欢忙忙碌碌和热热闹闹地过日子吗？', scale: 'E', reverse: false },
  
  // 81-88
  { id: 81, text: '你愿意别人怕你吗？', scale: 'P', reverse: false },
  { id: 82, text: '你是否觉得有时浑身是劲，而有时又是懒懒洋洋的吗？', scale: 'N', reverse: false },
  { id: 83, text: '你有时把今天应做的事拖到明天去做吗？', scale: 'L', reverse: true },
  { id: 84, text: '别人认为你生气勃勃的吗？', scale: 'E', reverse: false },
  { id: 85, text: '别人是否对你说了许多谎话？', scale: 'P', reverse: false },
  { id: 86, text: '你是否对某些事物容易冒火？', scale: 'N', reverse: false },
  { id: 87, text: '当你犯了错误时，你是否常常愿意承认它？', scale: 'L', reverse: false },
  { id: 88, text: '你会为一动物落入圈套被捉拿而感到很难过吗？', scale: 'P', reverse: true }
]

// EPQ 维度名称
export const epqScales = {
  E: { name: '内外向', nameEn: 'Extraversion', highDesc: '外向、好交际、渴望刺激和冒险', lowDesc: '内向、好静、富于内省' },
  N: { name: '神经质', nameEn: 'Neuroticism', highDesc: '焦虑、紧张、情绪不稳定', lowDesc: '情绪稳定、平和、自控力强' },
  P: { name: '精神质', nameEn: 'Psychoticism', highDesc: '孤独、不关心他人、感觉迟钝', lowDesc: '有同情心、关心他人' },
  L: { name: '掩饰性', nameEn: 'Lie', highDesc: '回答有掩饰倾向，结果可信度较低', lowDesc: '回答诚实可信' }
}

// 分数解释参考
export const epqInterpretation = {
  E: {
    high: '您属于外向型人格。心理活动倾向于外部，表现为活泼开朗，热情大方，善于交际，情感外露，渴望刺激和冒险。',
    low: '您属于内向型人格。心理活动倾向于内部，比较好静、稳重、内省、沉默少语，不喜欢刺激，情绪比较稳定。'
  },
  N: {
    high: '您情绪稳定性较低。可能表现为焦虑、紧张、易怒，敏感多疑，对各种刺激反应强烈，易冲动。',
    low: '您情绪稳定性较高。情绪反应缓慢，心境平和，自控能力通常比较好。'
  },
  P: {
    high: '您精神质倾向较明显。可能比较孤独、少关心他人、不近人情、感觉迟钝，难以适应环境变化。',
    low: '您能与人友好相处，关心他人，适应环境能力较好。'
  },
  L: {
    high: '您的回答可能存在掩饰倾向，结果可信度较低。这可能是因为作答时出于某种原因未能根据真实情况回答。',
    low: '您的回答较为真实可信。'
  }
}