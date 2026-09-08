// 社交焦虑障碍严重度（DSM-5 成人严重度量表）· 题库，0-4，共 10 题（0-40）
export interface SocialQuestion {
  id: number;
  text: string;
}

export const socialOptions = [
  { value: 0, label: "从未" },
  { value: 1, label: "偶尔" },
  { value: 2, label: "一半时间" },
  { value: 3, label: "大部分时间" },
  { value: 4, label: "几乎所有时间" },
];

export const socialQuestions: SocialQuestion[] = [
  { id: 1, text: "在社交场合（如公开讲话、开会、聚会、自我介绍、交谈、被表扬、向人求助、当众吃饭写字等）感到突然、莫名的恐惧、害怕或惊吓" },
  { id: 2, text: "对社交场合感到焦虑、担心或紧张" },
  { id: 3, text: "有被拒绝、被羞辱、难堪、被嘲笑或冒犯到他人的念头" },
  { id: 4, text: "在社交场合感到心跳加速、出汗、呼吸困难、头晕或颤抖" },
  { id: 5, text: "在社交场合肌肉紧张、坐立不安、难以放松" },
  { id: 6, text: "回避、不敢靠近或不敢进入社交场合" },
  { id: 7, text: "提早离开社交场合，或仅最低限度参与（如少说话、回避眼神接触）" },
  { id: 8, text: "花大量时间准备在社交场合该说什么、怎么表现" },
  { id: 9, text: "用转移注意力的方式避免去想社交场合" },
  { id: 10, text: "需要借助帮助来应对社交场合（如酒精或药物、迷信物品）" },
];
