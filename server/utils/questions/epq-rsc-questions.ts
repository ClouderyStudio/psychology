export interface EPQRSCQuestion {
  id: number;
  text: string;
  scale: "E" | "N" | "P" | "L";
  reverse: boolean; // true表示反向计分（答"否"计分）
}

// EPQ-RSC 选项（是/否）
export const epqRscOptions = [
  { value: 1, label: "是" },
  { value: 0, label: "否" },
];

// EPQ-RSC 48道题目（中国版，按顺序1-48）
export const epqRscQuestions: EPQRSCQuestion[] = [
  // 1-10
  { id: 1, text: "你的情绪是否时起时落？", scale: "N", reverse: false },
  {
    id: 2,
    text: "当你看到小孩（或动物）受折磨时是否感到难受？",
    scale: "P",
    reverse: true,
  },
  { id: 3, text: "你是个健谈的人吗？", scale: "E", reverse: false },
  {
    id: 4,
    text: "如果你说了要做什么事，是否不论此事可能如果不顺利你都总能遵守诺言？",
    scale: "L",
    reverse: false,
  },
  { id: 5, text: '你是否会无原无故地感到"很惨"？', scale: "N", reverse: false },
  { id: 6, text: "欠债会使你感到忧虑吗？", scale: "P", reverse: true },
  { id: 7, text: "你是个生气勃勃的人吗？", scale: "E", reverse: false },
  {
    id: 8,
    text: "你是否曾贪图过超过你应得的分外之物？",
    scale: "L",
    reverse: true,
  },
  { id: 9, text: "你是个容易被激怒的人吗？", scale: "N", reverse: false },
  {
    id: 10,
    text: "你会服用能产生奇异或危险效果的药物吗？",
    scale: "P",
    reverse: false,
  },

  // 11-20
  { id: 11, text: "你愿意认识陌生人吗？", scale: "E", reverse: false },
  {
    id: 12,
    text: "你是否曾经有过明知自己做错了事却责备别人的情况？",
    scale: "L",
    reverse: true,
  },
  { id: 13, text: "你的感情容易受伤害吗？", scale: "N", reverse: false },
  {
    id: 14,
    text: "你是否愿意按照自己的方式行事，而不愿意按照规则办事？",
    scale: "P",
    reverse: false,
  },
  {
    id: 15,
    text: "在热闹的聚会中你能使自己放得开，使自己玩得开心吗？",
    scale: "E",
    reverse: false,
  },
  { id: 16, text: "你所有的习惯是否都是好的？", scale: "L", reverse: false },
  { id: 17, text: '你是否时常感到"极其厌倦"？', scale: "N", reverse: false },
  {
    id: 18,
    text: "良好的举止和整洁对你来说很重要吗？",
    scale: "P",
    reverse: true,
  },
  {
    id: 19,
    text: "在结交新朋友时，你经常是积极主动的吗？",
    scale: "E",
    reverse: false,
  },
  { id: 20, text: "你是否有过随口骂人的时候？", scale: "L", reverse: true },

  // 21-30
  {
    id: 21,
    text: "你认为自己是一个胆怯不安的人吗？",
    scale: "N",
    reverse: false,
  },
  {
    id: 22,
    text: "你是否认为婚姻是不合时宜的，应该废除？",
    scale: "P",
    reverse: false,
  },
  {
    id: 23,
    text: "你能否很容易地给一个沉闷的聚会注入活力？",
    scale: "E",
    reverse: false,
  },
  { id: 24, text: "你曾毁坏或丢失过别人的东西吗？", scale: "L", reverse: true },
  { id: 25, text: "你是个忧心忡忡的人吗？", scale: "N", reverse: false },
  { id: 26, text: "你爱和别人合作吗？", scale: "P", reverse: true },
  {
    id: 27,
    text: "在社交场合你是否倾向于呆在不显眼的地方？",
    scale: "E",
    reverse: true,
  },
  {
    id: 28,
    text: "如果在你的工作中出现了错误，你知道后会感到忧虑吗？",
    scale: "P",
    reverse: true,
  },
  { id: 29, text: "你讲过别人的坏话或脏话吗？", scale: "L", reverse: true },
  {
    id: 30,
    text: '你认为自己是个神经紧张或"弦绷得过紧"的人吗？',
    scale: "N",
    reverse: false,
  },

  // 31-40
  {
    id: 31,
    text: "你是否觉得人们为了未来有保障，而在储蓄和保险方面花费的时间太多了？",
    scale: "P",
    reverse: false,
  },
  { id: 32, text: "你是否喜欢和人们相处在一起？", scale: "E", reverse: false },
  {
    id: 33,
    text: "当你还是个小孩子的时候，你是否曾有过对父母耍赖或不听话的行为？",
    scale: "L",
    reverse: true,
  },
  {
    id: 34,
    text: "在经历了一次令人难堪的事之后，你是否会为此烦恼很长时间？",
    scale: "N",
    reverse: false,
  },
  { id: 35, text: "你是否努力使自己对人不粗鲁？", scale: "P", reverse: true },
  {
    id: 36,
    text: "你是否喜欢在自己周围有许多热闹和令人兴奋的事情？",
    scale: "E",
    reverse: false,
  },
  { id: 37, text: "你曾在玩游戏时作过弊吗？", scale: "L", reverse: true },
  {
    id: 38,
    text: '你是否因自己的"神经过敏"而感到痛苦？',
    scale: "N",
    reverse: false,
  },
  { id: 39, text: "你愿意别人怕你吗？", scale: "P", reverse: false },
  { id: 40, text: "你曾利用过别人吗？", scale: "L", reverse: true },

  // 41-48
  {
    id: 41,
    text: "你是否喜欢说笑话和谈论有趣的事？",
    scale: "E",
    reverse: false,
  },
  { id: 42, text: "你是否时常感到孤独？", scale: "N", reverse: false },
  {
    id: 43,
    text: "你是否认为遵循社会规范比按照个人方式行事更好一些？",
    scale: "P",
    reverse: true,
  },
  {
    id: 44,
    text: "在别人眼里你总是充满活力的吗？",
    scale: "E",
    reverse: false,
  },
  { id: 45, text: "你总能做到言行一致吗？", scale: "L", reverse: false },
  { id: 46, text: "你是否时常被负疚感所困扰？", scale: "N", reverse: false },
  {
    id: 47,
    text: "你有时将今天该做的事情拖到明天去做吗？",
    scale: "L",
    reverse: true,
  },
  {
    id: 48,
    text: "你能使一个聚会顺利进行下去吗？",
    scale: "E",
    reverse: false,
  },
];

// EPQ-RSC 维度名称
export const epqRscScales = {
  E: {
    name: "内外向",
    nameEn: "Extraversion",
    highDesc: "外向、好交际、渴望刺激和冒险、情感易于冲动",
    lowDesc: "内向、好静、富于内省、不喜欢刺激、情绪稳定",
  },
  N: {
    name: "神经质",
    nameEn: "Neuroticism",
    highDesc: "焦虑、紧张、易怒、情绪不稳定、反应强烈",
    lowDesc: "情绪稳定、平和、反应缓慢、自控力强",
  },
  P: {
    name: "精神质",
    nameEn: "Psychoticism",
    highDesc: "孤独、不关心他人、感觉迟钝、常有敌意",
    lowDesc: "有同情心、关心他人、适应环境能力强",
  },
  L: {
    name: "掩饰性",
    nameEn: "Lie",
    highDesc: "回答有掩饰倾向，结果可信度较低",
    lowDesc: "回答真实可信",
  },
};

// 常模参考值
export const epqRscNorms = {
  E: 15,
  N: 14,
  P: 8,
  L: 18,
};
