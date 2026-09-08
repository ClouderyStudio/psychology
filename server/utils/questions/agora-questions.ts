// 广场恐怖严重度（DSM-5 成人严重度量表）· 题库，0-4，共 10 题（0-40）
export interface AgoraQuestion {
  id: number;
  text: string;
}

export const agoraOptions = [
  { value: 0, label: "从未" },
  { value: 1, label: "偶尔" },
  { value: 2, label: "一半时间" },
  { value: 3, label: "大部分时间" },
  { value: 4, label: "几乎所有时间" },
];

export const agoraQuestions: AgoraQuestion[] = [
  { id: 1, text: "在这些情境（人群、公共场所、乘坐交通工具、独自出行或离家）中感到突然、莫名的恐惧、害怕或惊吓" },
  { id: 2, text: "对这些情境感到焦虑、担心或紧张" },
  { id: 3, text: "有在这些情境中发生惊恐发作、不舒服的身体感觉、迷路或被恐惧压倒的念头" },
  { id: 4, text: "在这些情境中感到心跳加速、出汗、呼吸困难、头晕或颤抖" },
  { id: 5, text: "在这些情境中肌肉紧张、坐立不安、难以放松" },
  { id: 6, text: "回避、不敢靠近或不敢进入这些情境" },
  { id: 7, text: "从这些情境中离开、提早逃离，或始终待在靠近出口的地方" },
  { id: 8, text: "花大量时间为这些情境做准备，或一再拖延去面对" },
  { id: 9, text: "用转移注意力的方式避免去想这些情境" },
  { id: 10, text: "需要借助帮助来应对这些情境（如酒精或药物、迷信物品、他人陪同）" },
];
