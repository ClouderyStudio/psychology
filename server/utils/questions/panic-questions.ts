// 惊恐障碍严重度（DSM-5 成人严重度量表）· 题库，0-4，共 10 题（0-40）
export interface PanicQuestion {
  id: number;
  text: string;
}

export const panicOptions = [
  { value: 0, label: "从未" },
  { value: 1, label: "偶尔" },
  { value: 2, label: "一半时间" },
  { value: 3, label: "大部分时间" },
  { value: 4, label: "几乎所有时间" },
];

export const panicQuestions: PanicQuestion[] = [
  { id: 1, text: "突然、莫名地感到一阵突如其来的恐惧、害怕或惊吓（即惊恐发作）" },
  { id: 2, text: "担心或忧虑还会出现更多惊恐发作" },
  { id: 3, text: "因惊恐发作而产生失控、濒死、发疯或其它坏事会发生的念头" },
  { id: 4, text: "感到心跳加速、出汗、呼吸困难、头晕或颤抖" },
  { id: 5, text: "肌肉紧张、坐立不安、难以放松或难以入睡" },
  { id: 6, text: "回避、不敢靠近或不敢进入可能发生惊恐发作的场所" },
  { id: 7, text: "因为惊恐发作而提早离开某些场合，或仅最低限度地参与" },
  { id: 8, text: "花大量时间为可能发生惊恐发作的场合做准备，或一再拖延去面对" },
  { id: 9, text: "用转移注意力的方式避免去想惊恐发作" },
  { id: 10, text: "需要借助帮助来应对惊恐发作（如酒精或药物、迷信物品、他人陪同）" },
];
