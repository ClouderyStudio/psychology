// server/utils/bpns-questions.ts

// BPNS 选项（7点Likert量表）
export const bpnsOptions = [
  { value: 1, label: "完全不符合" },
  { value: 2, label: "比较不符合" },
  { value: 3, label: "有点不符合" },
  { value: 4, label: "不确定" },
  { value: 5, label: "有点符合" },
  { value: 6, label: "比较符合" },
  { value: 7, label: "完全符合" },
];

// 维度定义
export const bpnsDimensions = {
  autonomy: {
    name: "自主需求",
    nameEn: "Autonomy",
    desc: "个体感知行为出于自身意志和选择的程度，能够自由表达想法和做决定。",
    highDesc: "您能够自由地表达自己，按照自己的意愿做决定。",
    lowDesc: "您常感到受他人控制，缺乏自主选择的机会。",
  },
  competence: {
    name: "胜任需求",
    nameEn: "Competence",
    desc: "个体在与环境互动中感到有能力和有效率，能展示和运用自身能力。",
    highDesc: "您觉得自己有能力完成各项任务，能够应对挑战。",
    lowDesc: "您常感到能力不足，难以完成期望的任务。",
  },
  relatedness: {
    name: "归属需求",
    nameEn: "Relatedness",
    desc: "个体感到被他人关心，与他人和群体有归属感和安全感。",
    highDesc: "您与他人关系良好，感受到关心和支持。",
    lowDesc: "您常感到孤独，缺乏亲密的人际关系。",
  },
};

// 21道题目（基于Gagné的BPNS量表）
export const bpnsQuestions = [
  // 归属需求 (Relatedness) - 8题
  {
    id: 1,
    text: "我非常喜欢和我打交道的人",
    dimension: "relatedness",
    reverse: false,
  },
  {
    id: 5,
    text: "我与接触过的人都会相处得很融洽",
    dimension: "relatedness",
    reverse: false,
  },
  {
    id: 6,
    text: "我常常一个人独处，没有太多的社交活动",
    dimension: "relatedness",
    reverse: true,
  },
  {
    id: 10,
    text: "我身边的人很关心我",
    dimension: "relatedness",
    reverse: false,
  },
  {
    id: 12,
    text: "在日常生活中与我交往的人常常会考虑我的感受",
    dimension: "relatedness",
    reverse: false,
  },
  {
    id: 14,
    text: "我没有太多亲近的人",
    dimension: "relatedness",
    reverse: true,
  },
  {
    id: 16,
    text: "我周围的人一般不太喜欢我",
    dimension: "relatedness",
    reverse: true,
  },
  {
    id: 19,
    text: "人们对我都很友好",
    dimension: "relatedness",
    reverse: false,
  },

  // 胜任需求 (Competence) - 7题
  {
    id: 2,
    text: "我经常觉得自己没有能力",
    dimension: "competence",
    reverse: true,
  },
  {
    id: 4,
    text: "了解我的人说我会把事情完成得很好",
    dimension: "competence",
    reverse: false,
  },
  {
    id: 8,
    text: "最近我有能力去学习有趣的新技能",
    dimension: "competence",
    reverse: false,
  },
  {
    id: 11,
    text: "很多时候，我能从自己所做的事情中感受到成就感",
    dimension: "competence",
    reverse: false,
  },
  {
    id: 13,
    text: "在日常生活中我没有太多展示自己能力的机会",
    dimension: "competence",
    reverse: true,
  },
  {
    id: 17,
    text: "我经常感到自己能力不足",
    dimension: "competence",
    reverse: true,
  },
  {
    id: 20,
    text: "我觉得自己能够很好地完成各项任务",
    dimension: "competence",
    reverse: false,
  },

  // 自主需求 (Autonomy) - 6题
  {
    id: 3,
    text: "在生活中我感觉到有压力",
    dimension: "autonomy",
    reverse: true,
  },
  {
    id: 7,
    text: "通常我很乐意表达出自己的想法和观点",
    dimension: "autonomy",
    reverse: false,
  },
  {
    id: 9,
    text: "在日常生活中，我经常不得不做一些别人让我做的事情",
    dimension: "autonomy",
    reverse: true,
  },
  {
    id: 15,
    text: "在日常生活中我经常感到我可以做我自己",
    dimension: "autonomy",
    reverse: false,
  },
  {
    id: 18,
    text: "在生活中，我没有太多机会去决定自己的事情",
    dimension: "autonomy",
    reverse: true,
  },
  {
    id: 21,
    text: "我的选择能够反映真实的自我",
    dimension: "autonomy",
    reverse: false,
  },
];
