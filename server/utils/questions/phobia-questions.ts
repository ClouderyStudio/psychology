// 特定恐怖症严重度（DSM-5 成人严重度量表）· 题库，0-4，共 10 题（0-40）
export interface PhobiaQuestion {
  id: number;
  text: string;
}

export const phobiaOptions = [
  { value: 0, label: "从未" },
  { value: 1, label: "偶尔" },
  { value: 2, label: "一半时间" },
  { value: 3, label: "大部分时间" },
  { value: 4, label: "几乎所有时间" },
];

export const phobiaQuestions: PhobiaQuestion[] = [
  { id: 1, text: "在这些情境中感到突然、莫名的恐惧、害怕或惊吓" },
  { id: 2, text: "对这些情境感到焦虑、担心或紧张" },
  { id: 3, text: "有在这些情境中受伤、被恐惧压倒或发生其它坏事的念头" },
  { id: 4, text: "在这些情境中感到心跳加速、出汗、呼吸困难、头晕或颤抖" },
  { id: 5, text: "在这些情境中肌肉紧张、坐立不安、难以放松" },
  { id: 6, text: "回避、不敢靠近或不敢进入这些情境" },
  { id: 7, text: "从这些情境中离开或提早逃离" },
  { id: 8, text: "花大量时间为这些情境做准备，或一再拖延去面对" },
  { id: 9, text: "用转移注意力的方式避免去想这些情境" },
  { id: 10, text: "需要借助帮助来应对这些情境（如酒精或药物、迷信物品、他人陪同）" },
];
