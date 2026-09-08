// PTSD 严重度（NSESSS 创伤后应激短量表）· 题库，0-4，共 9 题（0-36）
export interface PTSDQuestion {
  id: number;
  text: string;
}

export const ptsdOptions = [
  { value: 0, label: "完全没有" },
  { value: 1, label: "有一点" },
  { value: 2, label: "中等程度" },
  { value: 3, label: "相当多" },
  { value: 4, label: "极其" },
];

export const ptsdQuestions: PTSDQuestion[] = [
  { id: 1, text: "出现\"闪回\"：突然表现得或感觉到仿佛过去的应激经历正在重演（例如通过看、听、闻到或身体感受再次经历那件事的片段）" },
  { id: 2, text: "当某些东西让你想起那次应激经历时，感到十分情绪波动/难过" },
  { id: 3, text: "试图回避让你想起那次应激经历的念头、感受或身体感觉" },
  { id: 4, text: "认为那次应激事件的发生，是自己或别人（并非直接伤害你的人）做错了事、没尽力去阻止，或与自身某些因素有关" },
  { id: 5, text: "经历过那件事之后，处于非常消极的情绪状态（例如充满恐惧、愤怒、内疚、羞耻或惊骇）" },
  { id: 6, text: "对以前喜欢参与的活动失去了兴趣" },
  { id: 7, text: "处于\"高度警觉\"状态，时刻警惕、留意危险" },
  { id: 8, text: "听到意料之外的声响时，很容易被吓到或受惊" },
  { id: 9, text: "极度烦躁或愤怒，甚至对他人吼叫、与人起冲突或破坏东西" },
];
