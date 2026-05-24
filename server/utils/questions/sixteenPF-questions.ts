// 16PF 选项类型1：一般态度题
export const sixteenPFOptionsNormal = [
  { value: 0, label: 'A. 是' },
  { value: 1, label: 'B. 不一定' },
  { value: 2, label: 'C. 否' }
]

// 16PF 选项类型2：智力/逻辑判断题（因素B使用，每个题目有自定义选项）
export const sixteenPFOptionsLogic = [
  { value: 0, label: 'A. 第一个' },
  { value: 1, label: 'B. 第二个' },
  { value: 2, label: 'C. 第三个' }
]

// 16PF 选项类型3：选择题（两个相反选项）
export const sixteenPFOptionsChoice = [
  { value: 0, label: 'A. 更接近前者' },
  { value: 1, label: 'B. 介于之间' },
  { value: 2, label: 'C. 更接近后者' }
]

// 16PF 选项类型4：频率题
export const sixteenPFOptionsFrequency = [
  { value: 0, label: 'A. 经常' },
  { value: 1, label: 'B. 有时' },
  { value: 2, label: 'C. 从不' }
]

// 16个因素的符号和名称
export const sixteenPFFactors = {
  A: { name: '乐群性', nameEn: 'Warmth', highDesc: '外向、热情、乐群', lowDesc: '缄默、孤独、冷淡' },
  B: { name: '聪慧性', nameEn: 'Reasoning', highDesc: '聪明、富有才识、善于抽象思维', lowDesc: '思想迟钝、学识浅薄' },
  C: { name: '稳定性', nameEn: 'Emotional Stability', highDesc: '情绪稳定而成熟，能面对现实', lowDesc: '情绪激动，易生烦恼' },
  E: { name: '恃强性', nameEn: 'Dominance', highDesc: '好强固执、独立积极', lowDesc: '谦逊、顺从、通融' },
  F: { name: '兴奋性', nameEn: 'Liveliness', highDesc: '轻松兴奋、随遇而安', lowDesc: '严肃、审慎、冷静、寡言' },
  G: { name: '有恒性', nameEn: 'Rule-Consciousness', highDesc: '有恒负责，做事尽职', lowDesc: '苟且敷衍，缺乏奉公守法精神' },
  H: { name: '敢为性', nameEn: 'Social Boldness', highDesc: '冒险敢为，少有顾虑', lowDesc: '畏怯退缩，缺乏自信' },
  I: { name: '敏感性', nameEn: 'Sensitivity', highDesc: '敏感、感情用事', lowDesc: '理智、着重现实' },
  L: { name: '怀疑性', nameEn: 'Vigilance', highDesc: '怀疑、刚愎、固执己见', lowDesc: '信赖随和、易与人相处' },
  M: { name: '幻想性', nameEn: 'Abstractedness', highDesc: '幻想、狂放任性', lowDesc: '现实、合乎成规' },
  N: { name: '世故性', nameEn: 'Privateness', highDesc: '精明能干、世故', lowDesc: '坦白、直率、天真' },
  O: { name: '忧虑性', nameEn: 'Apprehension', highDesc: '忧虑抑郁、烦恼自扰', lowDesc: '安详、沉着、有自信心' },
  Q1: { name: '实验性', nameEn: 'Openness to Change', highDesc: '自由、激进，不拘泥于现实', lowDesc: '保守，尊重传统观念' },
  Q2: { name: '独立性', nameEn: 'Self-Reliance', highDesc: '自立自强、当机立断', lowDesc: '依赖、随群附和' },
  Q3: { name: '自律性', nameEn: 'Perfectionism', highDesc: '知己知彼、自律谨严', lowDesc: '矛盾冲突、不顾大体' },
  Q4: { name: '紧张性', nameEn: 'Tension', highDesc: '紧张困扰、激动挣扎', lowDesc: '心平气和、闲散宁静' }
}

// 完整的187道题目（根据标准量表）
export const sixteenPFQuestions = [
  // 第1-2题：效度量表题（不计分）- 使用普通选项
  { id: 1, text: '我很明了本测验的说明', factor: null, reverse: false, optionType: 'normal' },
  { id: 2, text: '我对本测验的每一个问题，都能做到诚实地回答', factor: null, reverse: false, optionType: 'normal' },

  // 因素A: 乐群性 (10题) - 使用普通选项
  { id: 3, text: '如果我有机会的话，我愿意到一个繁华的城市去旅行', factor: 'A', reverse: false, optionType: 'normal' },
  { id: 4, text: '在社交场合中，我谈吐自然', factor: 'A', reverse: false, optionType: 'normal' },
  { id: 5, text: '我愿做一个社会科学研究者', factor: 'A', reverse: false, optionType: 'normal' },
  { id: 6, text: '我喜欢参加规模庞大的集会', factor: 'A', reverse: false, optionType: 'normal' },
  { id: 7, text: '对于头脑简单和不讲理的人，我仍能待之以礼', factor: 'A', reverse: false, optionType: 'normal' },
  { id: 8, text: '我宁可做一个社团的工作者', factor: 'A', reverse: false, optionType: 'normal' },
  { id: 9, text: '在集会中，我谈吐自如', factor: 'A', reverse: false, optionType: 'normal' },
  { id: 10, text: '我愿意负责人事组的工作', factor: 'A', reverse: false, optionType: 'normal' },
  { id: 11, text: '我喜欢和很多人一起聊天说笑', factor: 'A', reverse: false, optionType: 'normal' },
  { id: 12, text: '我乐于结交新朋友', factor: 'A', reverse: false, optionType: 'normal' },

  // 因素B: 聪慧性 (13题) - 使用 logic 类型，每题自定义选项
  { id: 13, text: '下列三个字中哪个字与其他两个字属于不同类别：狗、石、牛',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 狗' },
      { value: 1, label: 'B. 石' },
      { value: 2, label: 'C. 牛' }
    ],
    correctAnswer: 1 },
  { id: 14, text: '下列数字中哪个与其他不同类：2、6、9',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 2' },
      { value: 1, label: 'B. 6' },
      { value: 2, label: 'C. 9' }
    ],
    correctAnswer: 2 },
  { id: 15, text: '下列数字中哪个与其他不同类：4、8、11',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 4' },
      { value: 1, label: 'B. 8' },
      { value: 2, label: 'C. 11' }
    ],
    correctAnswer: 2 },
  { id: 16, text: '医生对病人如同教师对：',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 学校' },
      { value: 1, label: 'B. 学生' },
      { value: 2, label: 'C. 书本' }
    ],
    correctAnswer: 1 },
  { id: 17, text: '下列数列中缺失的数字是什么：2、4、8、16、?',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 24' },
      { value: 1, label: 'B. 30' },
      { value: 2, label: 'C. 32' }
    ],
    correctAnswer: 2 },
  { id: 18, text: '下列图形中哪个与其他不同类：三角形、正方形、圆形',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 三角形' },
      { value: 1, label: 'B. 正方形' },
      { value: 2, label: 'C. 圆形' }
    ],
    correctAnswer: 2 },
  { id: 19, text: '下列数列中空缺的数字是什么：1、1、2、3、5、8、?',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 10' },
      { value: 1, label: 'B. 12' },
      { value: 2, label: 'C. 13' }
    ],
    correctAnswer: 2 },
  { id: 20, text: '鸟对天空如同鱼对：',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 河流' },
      { value: 1, label: 'B. 大海' },
      { value: 2, label: 'C. 水' }
    ],
    correctAnswer: 2 },
  { id: 21, text: '甲比乙高，乙比丙高，那么：',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 甲比丙矮' },
      { value: 1, label: 'B. 甲和丙一样高' },
      { value: 2, label: 'C. 甲比丙高' }
    ],
    correctAnswer: 2 },
  { id: 22, text: '下列词语中，哪组是反义词关系：',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 前进—前进' },
      { value: 1, label: 'B. 前进—停止' },
      { value: 2, label: 'C. 前进—快跑' }
    ],
    correctAnswer: 1 },
  { id: 23, text: '下列词语中哪个与其他不同类：高兴、悲伤、桌子、愤怒',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 高兴' },
      { value: 1, label: 'B. 悲伤' },
      { value: 2, label: 'C. 桌子' }
    ],
    correctAnswer: 2 },
  { id: 24, text: '下列数字中哪个与其他不同类：9、16、25、36、40',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 9' },
      { value: 1, label: 'B. 16' },
      { value: 2, label: 'C. 40' }
    ],
    correctAnswer: 2 },
  { id: 25, text: '苹果、香蕉、橘子属于同一类，下列哪项与它们同类：',
    factor: 'B', reverse: false, optionType: 'logic',
    options: [
      { value: 0, label: 'A. 桌子' },
      { value: 1, label: 'B. 葡萄' },
      { value: 2, label: 'C. 书本' }
    ],
    correctAnswer: 1 },

  // 因素C: 稳定性 (13题) - 使用普通选项
  { id: 26, text: '我时常会无缘无故地感到情绪低落', factor: 'C', reverse: true, optionType: 'normal' },
  { id: 27, text: '我能很好地控制自己的情绪', factor: 'C', reverse: false, optionType: 'normal' },
  { id: 28, text: '我很少因为情绪波动而影响工作', factor: 'C', reverse: false, optionType: 'normal' },
  { id: 29, text: '我容易因为小事而感到烦恼', factor: 'C', reverse: true, optionType: 'normal' },
  { id: 30, text: '面对困难时我能够保持冷静', factor: 'C', reverse: false, optionType: 'normal' },
  { id: 31, text: '我经常感到紧张不安', factor: 'C', reverse: true, optionType: 'normal' },
  { id: 32, text: '我能从容应对突发情况', factor: 'C', reverse: false, optionType: 'normal' },
  { id: 33, text: '我常常因为一些事而失眠', factor: 'C', reverse: true, optionType: 'normal' },
  { id: 34, text: '我的情绪起伏很大', factor: 'C', reverse: true, optionType: 'normal' },
  { id: 35, text: '我能够长时间集中注意力', factor: 'C', reverse: false, optionType: 'normal' },
  { id: 36, text: '我很容易受到惊吓', factor: 'C', reverse: true, optionType: 'normal' },
  { id: 37, text: '我在压力下能正常工作', factor: 'C', reverse: false, optionType: 'normal' },
  { id: 38, text: '我时常感到精疲力竭', factor: 'C', reverse: true, optionType: 'normal' },

  // 因素E: 恃强性 (13题) - 使用选择/普通选项
  { id: 39, text: '在争论中，我更喜欢坚持自己的观点还是妥协', factor: 'E', reverse: false, optionType: 'choice' },
  { id: 40, text: '我习惯于听从他人的指挥', factor: 'E', reverse: true, optionType: 'normal' },
  { id: 41, text: '在小组讨论中我常担任领导角色', factor: 'E', reverse: false, optionType: 'normal' },
  { id: 42, text: '我不喜欢别人干涉我的决定', factor: 'E', reverse: false, optionType: 'normal' },
  { id: 43, text: '我容易接受他人的意见', factor: 'E', reverse: true, optionType: 'normal' },
  { id: 44, text: '我敢于坚持自己的观点', factor: 'E', reverse: false, optionType: 'normal' },
  { id: 45, text: '我宁愿服从权威', factor: 'E', reverse: true, optionType: 'normal' },
  { id: 46, text: '我喜欢指挥别人做事', factor: 'E', reverse: false, optionType: 'normal' },
  { id: 47, text: '在团队中我更喜欢做跟随者', factor: 'E', reverse: true, optionType: 'normal' },
  { id: 48, text: '我做事很有主见', factor: 'E', reverse: false, optionType: 'normal' },
  { id: 49, text: '我不喜欢与人竞争', factor: 'E', reverse: true, optionType: 'normal' },
  { id: 50, text: '我喜欢挑战权威', factor: 'E', reverse: false, optionType: 'normal' },
  { id: 51, text: '我会为了达到目的而坚持到底', factor: 'E', reverse: false, optionType: 'normal' },

  // 因素F: 兴奋性 (13题) - 使用普通/频率选项
  { id: 52, text: '我喜欢热闹的聚会', factor: 'F', reverse: false, optionType: 'normal' },
  { id: 53, text: '我通常很严肃', factor: 'F', reverse: true, optionType: 'normal' },
  { id: 54, text: '我喜欢幽默和笑话', factor: 'F', reverse: false, optionType: 'normal' },
  { id: 55, text: '我很少表现得很兴奋', factor: 'F', reverse: true, optionType: 'normal' },
  { id: 56, text: '我喜欢成为众人的焦点', factor: 'F', reverse: false, optionType: 'normal' },
  { id: 57, text: '我常常感到精力充沛', factor: 'F', reverse: false, optionType: 'frequency' },
  { id: 58, text: '我很少开玩笑', factor: 'F', reverse: true, optionType: 'normal' },
  { id: 59, text: '我喜欢轻松愉快的氛围', factor: 'F', reverse: false, optionType: 'normal' },
  { id: 60, text: '我做事比较谨慎', factor: 'F', reverse: true, optionType: 'normal' },
  { id: 61, text: '我喜欢刺激和冒险', factor: 'F', reverse: false, optionType: 'normal' },
  { id: 62, text: '我很少主动与人交谈', factor: 'F', reverse: true, optionType: 'normal' },
  { id: 63, text: '我喜欢即兴发挥', factor: 'F', reverse: false, optionType: 'normal' },
  { id: 64, text: '我说话时声音较大', factor: 'F', reverse: false, optionType: 'normal' },

  // 因素G: 有恒性 (13题)
  { id: 65, text: '我会坚持完成已经开始的计划', factor: 'G', reverse: false, optionType: 'normal' },
  { id: 66, text: '我有时会半途而废', factor: 'G', reverse: true, optionType: 'normal' },
  { id: 67, text: '我做事很有条理', factor: 'G', reverse: false, optionType: 'normal' },
  { id: 68, text: '我常常拖延该做的事', factor: 'G', reverse: true, optionType: 'normal' },
  { id: 69, text: '我很注重时间管理', factor: 'G', reverse: false, optionType: 'normal' },
  { id: 70, text: '我容易分心', factor: 'G', reverse: true, optionType: 'normal' },
  { id: 71, text: '我有很强的责任心', factor: 'G', reverse: false, optionType: 'normal' },
  { id: 72, text: '我有时会逃避责任', factor: 'G', reverse: true, optionType: 'normal' },
  { id: 73, text: '我能坚持原则', factor: 'G', reverse: false, optionType: 'normal' },
  { id: 74, text: '我容易改变主意', factor: 'G', reverse: true, optionType: 'normal' },
  { id: 75, text: '我做事很踏实', factor: 'G', reverse: false, optionType: 'normal' },
  { id: 76, text: '我有时会马虎应付', factor: 'G', reverse: true, optionType: 'normal' },
  { id: 77, text: '我喜欢把事情做完', factor: 'G', reverse: false, optionType: 'normal' },

  // 因素H: 敢为性 (11题)
  { id: 78, text: '我敢于在公众场合发言', factor: 'H', reverse: false, optionType: 'normal' },
  { id: 79, text: '我容易害羞', factor: 'H', reverse: true, optionType: 'normal' },
  { id: 80, text: '我喜欢尝试新事物', factor: 'H', reverse: false, optionType: 'normal' },
  { id: 81, text: '我害怕冒险', factor: 'H', reverse: true, optionType: 'normal' },
  { id: 82, text: '我敢于表达不同意见', factor: 'H', reverse: false, optionType: 'normal' },
  { id: 83, text: '我容易紧张', factor: 'H', reverse: true, optionType: 'normal' },
  { id: 84, text: '我主动与人交往', factor: 'H', reverse: false, optionType: 'normal' },
  { id: 85, text: '我害怕失败', factor: 'H', reverse: true, optionType: 'normal' },
  { id: 86, text: '我喜欢挑战', factor: 'H', reverse: false, optionType: 'normal' },
  { id: 87, text: '我容易脸红', factor: 'H', reverse: true, optionType: 'normal' },
  { id: 88, text: '我愿意承担风险', factor: 'H', reverse: false, optionType: 'normal' },

  // 因素I: 敏感性 (12题)
  { id: 89, text: '我容易被他人的故事感动', factor: 'I', reverse: false, optionType: 'normal' },
  { id: 90, text: '我很理性', factor: 'I', reverse: true, optionType: 'normal' },
  { id: 91, text: '我喜欢艺术和文学', factor: 'I', reverse: false, optionType: 'normal' },
  { id: 92, text: '我注重事实胜于感觉', factor: 'I', reverse: true, optionType: 'normal' },
  { id: 93, text: '我很敏感', factor: 'I', reverse: false, optionType: 'normal' },
  { id: 94, text: '我很少感情用事', factor: 'I', reverse: true, optionType: 'normal' },
  { id: 95, text: '我喜欢优美的环境', factor: 'I', reverse: false, optionType: 'normal' },
  { id: 96, text: '我很实际', factor: 'I', reverse: true, optionType: 'normal' },
  { id: 97, text: '我能体察他人的情绪', factor: 'I', reverse: false, optionType: 'normal' },
  { id: 98, text: '我倾向于用逻辑思考', factor: 'I', reverse: true, optionType: 'normal' },
  { id: 99, text: '我容易被美好的事物打动', factor: 'I', reverse: false, optionType: 'normal' },
  { id: 100, text: '我很客观', factor: 'I', reverse: true, optionType: 'normal' },

  // 因素L: 怀疑性 (10题)
  { id: 101, text: '我容易相信别人', factor: 'L', reverse: true, optionType: 'normal' },
  { id: 102, text: '我怀疑别人的动机', factor: 'L', reverse: false, optionType: 'normal' },
  { id: 103, text: '我待人真诚', factor: 'L', reverse: true, optionType: 'normal' },
  { id: 104, text: '我认为别人不可信', factor: 'L', reverse: false, optionType: 'normal' },
  { id: 105, text: '我容易吃醋', factor: 'L', reverse: false, optionType: 'normal' },
  { id: 106, text: '我觉得大多数人都是诚实的', factor: 'L', reverse: true, optionType: 'normal' },
  { id: 107, text: '我经常觉得别人在针对我', factor: 'L', reverse: false, optionType: 'normal' },
  { id: 108, text: '我善于合作', factor: 'L', reverse: true, optionType: 'normal' },
  { id: 109, text: '我觉得有竞争对手', factor: 'L', reverse: false, optionType: 'normal' },
  { id: 110, text: '我愿意与人分享', factor: 'L', reverse: true, optionType: 'normal' },

  // 因素M: 幻想性 (11题)
  { id: 111, text: '我喜欢幻想', factor: 'M', reverse: false, optionType: 'normal' },
  { id: 112, text: '我很现实', factor: 'M', reverse: true, optionType: 'normal' },
  { id: 113, text: '我经常做白日梦', factor: 'M', reverse: false, optionType: 'normal' },
  { id: 114, text: '我注重实际问题', factor: 'M', reverse: true, optionType: 'normal' },
  { id: 115, text: '我有丰富的想象力', factor: 'M', reverse: false, optionType: 'normal' },
  { id: 116, text: '我脚踏实地', factor: 'M', reverse: true, optionType: 'normal' },
  { id: 117, text: '我喜欢创作', factor: 'M', reverse: false, optionType: 'normal' },
  { id: 118, text: '我循规蹈矩', factor: 'M', reverse: true, optionType: 'normal' },
  { id: 119, text: '我容易被新奇的事物吸引', factor: 'M', reverse: false, optionType: 'normal' },
  { id: 120, text: '我按常规办事', factor: 'M', reverse: true, optionType: 'normal' },
  { id: 121, text: '我喜欢思考抽象问题', factor: 'M', reverse: false, optionType: 'normal' },

  // 因素N: 世故性 (10题)
  { id: 122, text: '我善于察言观色', factor: 'N', reverse: false, optionType: 'normal' },
  { id: 123, text: '我很直率', factor: 'N', reverse: true, optionType: 'normal' },
  { id: 124, text: '我知道如何与人打交道', factor: 'N', reverse: false, optionType: 'normal' },
  { id: 125, text: '我容易被人利用', factor: 'N', reverse: true, optionType: 'normal' },
  { id: 126, text: '我善于处理人际关系', factor: 'N', reverse: false, optionType: 'normal' },
  { id: 127, text: '我说话直截了当', factor: 'N', reverse: true, optionType: 'normal' },
  { id: 128, text: '我会适当保留自己的看法', factor: 'N', reverse: false, optionType: 'normal' },
  { id: 129, text: '我容易轻信他人', factor: 'N', reverse: true, optionType: 'normal' },
  { id: 130, text: '我懂得人情世故', factor: 'N', reverse: false, optionType: 'normal' },
  { id: 131, text: '我不擅长交际', factor: 'N', reverse: true, optionType: 'normal' },

  // 因素O: 忧虑性 (12题)
  { id: 132, text: '我经常担心未来', factor: 'O', reverse: false, optionType: 'frequency' },
  { id: 133, text: '我很少感到忧虑', factor: 'O', reverse: true, optionType: 'normal' },
  { id: 134, text: '我容易自责', factor: 'O', reverse: false, optionType: 'normal' },
  { id: 135, text: '我对自己有信心', factor: 'O', reverse: true, optionType: 'normal' },
  { id: 136, text: '我经常感到不安', factor: 'O', reverse: false, optionType: 'frequency' },
  { id: 137, text: '我很少后悔', factor: 'O', reverse: true, optionType: 'normal' },
  { id: 138, text: '我害怕失败', factor: 'O', reverse: false, optionType: 'normal' },
  { id: 139, text: '我能接受批评', factor: 'O', reverse: true, optionType: 'normal' },
  { id: 140, text: '我容易感到内疚', factor: 'O', reverse: false, optionType: 'normal' },
  { id: 141, text: '我很自信', factor: 'O', reverse: true, optionType: 'normal' },
  { id: 142, text: '我担心别人的看法', factor: 'O', reverse: false, optionType: 'normal' },
  { id: 143, text: '我坦然面对错误', factor: 'O', reverse: true, optionType: 'normal' },

  // 因素Q1: 实验性 (12题)
  { id: 144, text: '我喜欢尝试新方法', factor: 'Q1', reverse: false, optionType: 'normal' },
  { id: 145, text: '我尊重传统', factor: 'Q1', reverse: true, optionType: 'normal' },
  { id: 146, text: '我愿意接受新观念', factor: 'Q1', reverse: false, optionType: 'normal' },
  { id: 147, text: '我崇尚传统价值观', factor: 'Q1', reverse: true, optionType: 'normal' },
  { id: 148, text: '我喜欢改革', factor: 'Q1', reverse: false, optionType: 'normal' },
  { id: 149, text: '我保守', factor: 'Q1', reverse: true, optionType: 'normal' },
  { id: 150, text: '我敢于创新', factor: 'Q1', reverse: false, optionType: 'normal' },
  { id: 151, text: '我遵循既定规则', factor: 'Q1', reverse: true, optionType: 'normal' },
  { id: 152, text: '我喜欢自由思考', factor: 'Q1', reverse: false, optionType: 'normal' },
  { id: 153, text: '我尊重权威', factor: 'Q1', reverse: true, optionType: 'normal' },
  { id: 154, text: '我乐于学习新事物', factor: 'Q1', reverse: false, optionType: 'normal' },
  { id: 155, text: '我安于现状', factor: 'Q1', reverse: true, optionType: 'normal' },

  // 因素Q2: 独立性 (11题)
  { id: 156, text: '我喜欢自己做决定', factor: 'Q2', reverse: false, optionType: 'normal' },
  { id: 157, text: '我喜欢团队合作', factor: 'Q2', reverse: true, optionType: 'normal' },
  { id: 158, text: '我独立性强', factor: 'Q2', reverse: false, optionType: 'normal' },
  { id: 159, text: '我依赖他人', factor: 'Q2', reverse: true, optionType: 'normal' },
  { id: 160, text: '我能独立完成任务', factor: 'Q2', reverse: false, optionType: 'normal' },
  { id: 161, text: '我需要别人的支持', factor: 'Q2', reverse: true, optionType: 'normal' },
  { id: 162, text: '我喜欢独处', factor: 'Q2', reverse: false, optionType: 'normal' },
  { id: 163, text: '我喜欢集体活动', factor: 'Q2', reverse: true, optionType: 'normal' },
  { id: 164, text: '我能承担个人责任', factor: 'Q2', reverse: false, optionType: 'normal' },
  { id: 165, text: '我随大流', factor: 'Q2', reverse: true, optionType: 'normal' },
  { id: 166, text: '我有主见', factor: 'Q2', reverse: false, optionType: 'normal' },

  // 因素Q3: 自律性 (11题)
  { id: 167, text: '我能约束自己', factor: 'Q3', reverse: false, optionType: 'normal' },
  { id: 168, text: '我容易放纵自己', factor: 'Q3', reverse: true, optionType: 'normal' },
  { id: 169, text: '我有自控力', factor: 'Q3', reverse: false, optionType: 'normal' },
  { id: 170, text: '我随心所欲', factor: 'Q3', reverse: true, optionType: 'normal' },
  { id: 171, text: '我做事有计划', factor: 'Q3', reverse: false, optionType: 'normal' },
  { id: 172, text: '我随性而为', factor: 'Q3', reverse: true, optionType: 'normal' },
  { id: 173, text: '我能克制冲动', factor: 'Q3', reverse: false, optionType: 'normal' },
  { id: 174, text: '我容易冲动', factor: 'Q3', reverse: true, optionType: 'normal' },
  { id: 175, text: '我注重形象', factor: 'Q3', reverse: false, optionType: 'normal' },
  { id: 176, text: '我不拘小节', factor: 'Q3', reverse: true, optionType: 'normal' },
  { id: 177, text: '我自律性强', factor: 'Q3', reverse: false, optionType: 'normal' },

  // 因素Q4: 紧张性 (10题)
  { id: 178, text: '我经常感到紧张', factor: 'Q4', reverse: false, optionType: 'frequency' },
  { id: 179, text: '我很放松', factor: 'Q4', reverse: true, optionType: 'normal' },
  { id: 180, text: '我容易感到疲劳', factor: 'Q4', reverse: false, optionType: 'normal' },
  { id: 181, text: '我精力充沛', factor: 'Q4', reverse: true, optionType: 'normal' },
  { id: 182, text: '我经常失眠', factor: 'Q4', reverse: false, optionType: 'frequency' },
  { id: 183, text: '我睡眠质量好', factor: 'Q4', reverse: true, optionType: 'normal' },
  { id: 184, text: '我容易烦躁', factor: 'Q4', reverse: false, optionType: 'normal' },
  { id: 185, text: '我心平气和', factor: 'Q4', reverse: true, optionType: 'normal' },
  { id: 186, text: '我经常感到压力', factor: 'Q4', reverse: false, optionType: 'frequency' },
  { id: 187, text: '我能轻松应对压力', factor: 'Q4', reverse: true, optionType: 'normal' }
]

// 获取题目对应的选项类型（支持自定义选项）
export function getOptionsForQuestion(question: typeof sixteenPFQuestions[0]) {
  // 如果题目定义了自定义选项，优先使用
  if ('options' in question && question.options) {
    return question.options
  }
  if (question.optionType === 'choice') {
    return sixteenPFOptionsChoice
  } else if (question.optionType === 'frequency') {
    return sixteenPFOptionsFrequency
  } else if (question.optionType === 'logic') {
    return sixteenPFOptionsLogic
  } else {
    return sixteenPFOptionsNormal
  }
}

// 获取题目所属因素
export function getQuestionFactor(id: number): string | null {
  const question = sixteenPFQuestions.find(q => q.id === id)
  return question?.factor || null
}

// 判断是否为反向计分题
export function isReverseQuestion(id: number): boolean {
  const question = sixteenPFQuestions.find(q => q.id === id)
  return question?.reverse || false
}

// 获取推理题（因素B）的正确答案
export function getCorrectAnswer(id: number): number | null {
  const question = sixteenPFQuestions.find(q => q.id === id)
  const q = question as typeof sixteenPFQuestions[0] & { correctAnswer?: number }
  return q?.correctAnswer ?? null
}
