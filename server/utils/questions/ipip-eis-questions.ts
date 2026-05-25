// IPIP-EIS 选项（5点Likert量表）
export const ipipEisOptions = [
  { value: 1, label: "非常不符合" },
  { value: 2, label: "比较不符合" },
  { value: 3, label: "拿捏不准" },
  { value: 4, label: "比较符合" },
  { value: 5, label: "非常符合" },
];

// 维度定义
export const ipipEisDimensions = {
  positive_express: {
    name: "积极表达",
    nameEn: "Positive Expressivity",
    desc: "能够自如地表达积极情绪，如快乐、兴奋等。",
    highDesc: "您善于表达积极情绪，能够自然地分享快乐。",
    lowDesc: "您较少表达积极情绪，可能倾向于内敛。",
  },
  negative_express: {
    name: "消极表达",
    nameEn: "Negative Expressivity",
    desc: "能够适度地表达消极情绪，如愤怒、悲伤等。",
    highDesc: "您倾向于表达消极情绪，可能容易外显愤怒或悲伤。",
    lowDesc: "您较少表达消极情绪，能够较好地控制情绪外露。",
  },
  attention: {
    name: "注意情绪",
    nameEn: "Attention to Emotion",
    desc: "关注并思考自己的情绪状态及其原因。",
    highDesc: "您善于觉察和分析自己的情绪变化。",
    lowDesc: "您较少关注自己的情绪状态。",
  },
  emotional_decision: {
    name: "情绪性决策",
    nameEn: "Emotional Decision Making",
    desc: "在决策时会考虑和倾听自己的感受。",
    highDesc: "您在做决定时会重视自己的感受。",
    lowDesc: "您倾向于依据理性而非感受做决定。",
  },
  reactive_joy: {
    name: "反应性快乐",
    nameEn: "Reactive Joy",
    desc: "能够被他人的快乐所感染，产生共情性快乐。",
    highDesc: "您容易被他人的快乐情绪感染。",
    lowDesc: "您较少被他人的快乐情绪影响。",
  },
  reactive_sadness: {
    name: "反应性抑郁",
    nameEn: "Reactive Sadness",
    desc: "能够被他人的悲伤所触动，产生共情性悲伤。",
    highDesc: "您容易被他人的不幸触动，感同身受。",
    lowDesc: "您较少被他人的悲伤情绪影响。",
  },
  empathy: {
    name: "同理心关注",
    nameEn: "Empathic Concern",
    desc: "关心他人，对他人的处境表示同情和理解。",
    highDesc: "您善于理解和关心他人的感受。",
    lowDesc: "您较少关注他人的情感需求。",
  },
};

// IPIP-EIS 题目
export const ipipEisQuestions = [
  // 积极表达维度 (Positive Expressivity) - 8题
  {
    id: 1,
    text: "遇到有趣的事情，会大声笑出来",
    dimension: "positive_express",
    reverse: false,
  },
  {
    id: 2,
    text: "以孩子般的方式表达快乐",
    dimension: "positive_express",
    reverse: false,
  },
  {
    id: 3,
    text: "读书或者看电视会大声笑出来",
    dimension: "positive_express",
    reverse: false,
  },
  { id: 4, text: "拥抱好朋友", dimension: "positive_express", reverse: false },
  {
    id: 5,
    text: "快乐的时候，会表达自己的感受",
    dimension: "positive_express",
    reverse: false,
  },
  {
    id: 6,
    text: "能够深受别人好心情的影响",
    dimension: "positive_express",
    reverse: false,
  },
  {
    id: 7,
    text: "当别人在庆祝的时候，自己也会跟着兴奋",
    dimension: "positive_express",
    reverse: false,
  },
  {
    id: 8,
    text: "不把快乐的感受透露给别人",
    dimension: "positive_express",
    reverse: true,
  },

  // 消极表达维度 (Negative Expressivity) - 8题
  {
    id: 9,
    text: "生气的时候会大声叫喊",
    dimension: "negative_express",
    reverse: false,
  },
  {
    id: 10,
    text: "无论有多么的不高兴，都不会表露自己的感情",
    dimension: "negative_express",
    reverse: true,
  },
  {
    id: 11,
    text: "感到悲伤时，面部表情会出卖我",
    dimension: "negative_express",
    reverse: false,
  },
  {
    id: 12,
    text: "表露感情有困难",
    dimension: "negative_express",
    reverse: true,
  },
  {
    id: 13,
    text: "在对别人感到气愤的时候，很难表露出自己的气愤",
    dimension: "negative_express",
    reverse: true,
  },
  {
    id: 14,
    text: "无论有多么害怕，都不会表露自己的感情",
    dimension: "negative_express",
    reverse: true,
  },
  {
    id: 15,
    text: "很少表现出愤怒",
    dimension: "negative_express",
    reverse: true,
  },
  { id: 16, text: "表现出悲伤", dimension: "negative_express", reverse: false },

  // 注意情绪维度 (Attention to Emotion) - 9题
  {
    id: 17,
    text: "思考自己为什么会有当下的情绪",
    dimension: "attention",
    reverse: false,
  },
  {
    id: 18,
    text: "很少考虑自己为什么有那样的感受",
    dimension: "attention",
    reverse: true,
  },
  { id: 19, text: "很少分析自己的情绪", dimension: "attention", reverse: true },
  {
    id: 20,
    text: "通常能知道自己的感受",
    dimension: "attention",
    reverse: false,
  },
  { id: 21, text: "很少触及自己的感受", dimension: "attention", reverse: true },
  { id: 22, text: "注意自己的情绪", dimension: "attention", reverse: false },
  { id: 23, text: "经常忽略自己的感受", dimension: "attention", reverse: true },
  {
    id: 24,
    text: "经常停下来分析自己的感受如何",
    dimension: "attention",
    reverse: false,
  },
  { id: 25, text: "关注自己", dimension: "attention", reverse: false },

  // 情绪性决策维度 (Emotional Decision Making) - 9题
  {
    id: 26,
    text: "做重要决定的时候会倾听自己的感受",
    dimension: "emotional_decision",
    reverse: false,
  },
  {
    id: 27,
    text: "根据自己的感受计划生活",
    dimension: "emotional_decision",
    reverse: false,
  },
  {
    id: 28,
    text: "理性地计划自己的生活",
    dimension: "emotional_decision",
    reverse: true,
  },
  {
    id: 29,
    text: "情感能够引导生活的方向",
    dimension: "emotional_decision",
    reverse: false,
  },
  {
    id: 30,
    text: "重要的决定应该基于逻辑推理",
    dimension: "emotional_decision",
    reverse: true,
  },
  {
    id: 31,
    text: "倾听内心的感受而不是理性思维",
    dimension: "emotional_decision",
    reverse: false,
  },
  {
    id: 32,
    text: "听从自己的理性思维而不是内心感受",
    dimension: "emotional_decision",
    reverse: true,
  },
  {
    id: 33,
    text: "做决定是基于事实而不是直觉",
    dimension: "emotional_decision",
    reverse: true,
  },
  {
    id: 34,
    text: "很少注意到自己的情绪反应",
    dimension: "emotional_decision",
    reverse: true,
  },

  // 反应性快乐维度 (Reactive Joy) - 8题
  {
    id: 35,
    text: "喜欢看孩子打开礼物盒",
    dimension: "reactive_joy",
    reverse: false,
  },
  {
    id: 36,
    text: "如果周围的人都在笑，自己也会笑",
    dimension: "reactive_joy",
    reverse: false,
  },
  {
    id: 37,
    text: "能感受到别人的快乐",
    dimension: "reactive_joy",
    reverse: false,
  },
  {
    id: 38,
    text: "别人的快乐对自己没有影响",
    dimension: "reactive_joy",
    reverse: true,
  },
  {
    id: 39,
    text: "喜欢孩子的生日聚会",
    dimension: "reactive_joy",
    reverse: false,
  },
  {
    id: 40,
    text: "很少会沉浸在兴奋中",
    dimension: "reactive_joy",
    reverse: true,
  },
  {
    id: 41,
    text: "不喜欢涉足别人的问题",
    dimension: "reactive_joy",
    reverse: true,
  },
  {
    id: 42,
    text: "在紧急的情况下能够保持冷静",
    dimension: "reactive_joy",
    reverse: false,
  },

  // 反应性抑郁维度 (Reactive Sadness) - 8题
  {
    id: 43,
    text: "被别人的不幸深深的触动",
    dimension: "reactive_sadness",
    reverse: false,
  },
  {
    id: 44,
    text: "发生不好的事情时，会感到不安",
    dimension: "reactive_sadness",
    reverse: false,
  },
  {
    id: 45,
    text: "当自己感到悲伤的时候，不喜欢身边围着快乐的人",
    dimension: "reactive_sadness",
    reverse: false,
  },
  {
    id: 46,
    text: "很容易感动到流泪",
    dimension: "reactive_sadness",
    reverse: false,
  },
  {
    id: 47,
    text: "对别人的痛苦感同身受",
    dimension: "reactive_sadness",
    reverse: false,
  },
  {
    id: 48,
    text: "别人的痛苦对自己没有影响",
    dimension: "reactive_sadness",
    reverse: true,
  },
  {
    id: 49,
    text: "对陌生人的不幸感到难过",
    dimension: "reactive_sadness",
    reverse: false,
  },
  {
    id: 50,
    text: "即使观看悲伤的电影，也很少流泪",
    dimension: "reactive_sadness",
    reverse: true,
  },

  // 同理心关注维度 (Empathic Concern) - 10题
  { id: 51, text: "关心他人", dimension: "empathy", reverse: false },
  { id: 52, text: "不关心别人", dimension: "empathy", reverse: true },
  {
    id: 53,
    text: "自己很在乎朋友，却很难告诉他们",
    dimension: "empathy",
    reverse: true,
  },
  {
    id: 54,
    text: "同情那些境遇比自己更糟的人",
    dimension: "empathy",
    reverse: false,
  },
  { id: 55, text: "不同情罪犯", dimension: "empathy", reverse: true },
  { id: 56, text: "同情无家可归的人", dimension: "empathy", reverse: false },
  {
    id: 57,
    text: "犯罪分子应该得到帮助而不是惩罚",
    dimension: "empathy",
    reverse: false,
  },
  { id: 58, text: "看不起任何弱者", dimension: "empathy", reverse: true },
  { id: 59, text: "穷人值得我们同情", dimension: "empathy", reverse: false },
  {
    id: 60,
    text: "看到受伤的动物也会感到难过",
    dimension: "empathy",
    reverse: false,
  },

  // 测谎题（不计分，用于检测作答有效性）
  {
    id: 61,
    text: "在紧急的环境下，能够保持镇定",
    dimension: null,
    reverse: false,
  },
  { id: 62, text: "很少被周围的事件干扰", dimension: null, reverse: false },
  { id: 63, text: "我喜欢阅读书籍", dimension: null, reverse: false },
  { id: 64, text: "我是一个诚实的人", dimension: null, reverse: false },
];

// 维度列表（用于评分）
export const ipipEisDimensionKeys = [
  "positive_express",
  "negative_express",
  "attention",
  "emotional_decision",
  "reactive_joy",
  "reactive_sadness",
  "empathy",
];

// 测谎题ID列表
export const lieItems = [61, 62, 63, 64];

// 获取题目对应的维度
export function getQuestionDimension(id: number): string | null {
  const question = ipipEisQuestions.find((q) => q.id === id);
  return question?.dimension || null;
}

// 判断是否为反向计分题
export function isReverseQuestion(id: number): boolean {
  const question = ipipEisQuestions.find((q) => q.id === id);
  return question?.reverse || false;
}

// 判断是否为测谎题
export function isLieItem(id: number): boolean {
  return lieItems.includes(id);
}
