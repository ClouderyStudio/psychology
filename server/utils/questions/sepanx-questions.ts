// 分离焦虑障碍严重度（DSM-5 成人严重度量表）· 题库，0-4，共 10 题（0-40）
export interface SepanxQuestion {
  id: number;
  text: string;
}

export const sepanxOptions = [
  { value: 0, label: "从未" },
  { value: 1, label: "偶尔" },
  { value: 2, label: "一半时间" },
  { value: 3, label: "大部分时间" },
  { value: 4, label: "几乎所有时间" },
];

export const sepanxQuestions: SepanxQuestion[] = [
  { id: 1, text: "在与重要的人分离时感到突然、莫名的恐惧、害怕或惊吓" },
  { id: 2, text: "对“与重要的人分开”感到焦虑、担心或紧张" },
  { id: 3, text: "有“重要的人会发生不好的事”，或自己与重要的人分开时会发生不好的事（如迷路、出意外）的念头" },
  { id: 4, text: "与重要的人分离时感到心跳加速、出汗、呼吸困难、头晕或颤抖" },
  { id: 5, text: "分离时肌肉紧张、坐立不安、难以放松或难以入睡" },
  { id: 6, text: "回避去那些会导致与重要的人分离的地方" },
  { id: 7, text: "在与重要的人分离时提早离开某些场合，以便回家" },
  { id: 8, text: "花大量时间准备如何应对分离" },
  { id: 9, text: "用转移注意力的方式避免去想“被分离”" },
  { id: 10, text: "需要借助帮助来应对分离（如酒精或药物、迷信物品）" },
];
