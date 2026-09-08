// Y-BOCS 耶鲁-布朗强迫量表（10 题，0-4，每题带文字锚点）· 题库
// 每题 0-4 选项锚点参考中文版注解（xinlixue.cn）与 Y-BOCS 原始量表
export interface YBOCSQuestion {
  id: number;
  text: string;
  options: { value: number; label: string }[];
}

export const ybocsQuestions: YBOCSQuestion[] = [
  {
    id: 1,
    text: "您每天花多少时间在强迫思维上？强迫思维出现的频率有多高？",
    options: [
      { value: 0, label: "完全无强迫思维" },
      { value: 1, label: "轻微（少于一小时），或偶尔有（一天不超8次）" },
      { value: 2, label: "中度（一至三小时），或常常有" },
      { value: 3, label: "重度（三至八小时），或频率非常高" },
      { value: 4, label: "极重（多于八小时），或几乎无时无刻都有" },
    ],
  },
  {
    id: 2,
    text: "强迫思维对您的社交、工作（或完成事情）有多大妨碍？",
    options: [
      { value: 0, label: "不受妨碍" },
      { value: 1, label: "轻微：稍微妨碍社交或工作，但整体表现无大碍" },
      { value: 2, label: "中度：确实妨碍社交或工作，但仍可应付" },
      { value: 3, label: "重度：导致社交或工作表现的障碍" },
      { value: 4, label: "极度：无能力应付社交或工作" },
    ],
  },
  {
    id: 3,
    text: "强迫思维给您带来多大的苦恼或困扰？",
    options: [
      { value: 0, label: "没有苦恼" },
      { value: 1, label: "轻微：不太烦人" },
      { value: 2, label: "中度：很烦，但尚可应付" },
      { value: 3, label: "重度：非常烦人" },
      { value: 4, label: "极重：几乎一直持续且令人丧志的苦恼" },
    ],
  },
  {
    id: 4,
    text: "您做过多少努力去对抗强迫思维（转移注意力或不去想它）？",
    options: [
      { value: 0, label: "一直不断努力对抗（或症状轻微无需对抗）" },
      { value: 1, label: "大部分时间都试图对抗" },
      { value: 2, label: "用些许努力去对抗" },
      { value: 3, label: "屈服于所有强迫思维，未试图控制，但仍有些不甘" },
      { value: 4, label: "完全愿意屈服于强迫思维" },
    ],
  },
  {
    id: 5,
    text: "您控制强迫思维的能力有多少（能否停止或转移它们）？",
    options: [
      { value: 0, label: "完全控制" },
      { value: 1, label: "大多能控制：稍花力气与注意力即能停止或转移" },
      { value: 2, label: "中等控制：有时能停止或转移" },
      { value: 3, label: "控制力弱：很少能成功停止或消除" },
      { value: 4, label: "无法控制：完全不能自主，连转移一下也不行" },
    ],
  },
  {
    id: 6,
    text: "您每天花多少时间在强迫行为上？强迫行为出现的频率有多高？",
    options: [
      { value: 0, label: "完全无强迫行为" },
      { value: 1, label: "轻微（少于一小时），或偶尔有（一天不超8次）" },
      { value: 2, label: "中度（一至三小时），或常常有" },
      { value: 3, label: "重度（三至八小时），或频率非常高" },
      { value: 4, label: "极重（多于八小时），或几乎无时无刻都有" },
    ],
  },
  {
    id: 7,
    text: "强迫行为对您的社交、工作（或完成事情）有多大妨碍？",
    options: [
      { value: 0, label: "不受妨碍" },
      { value: 1, label: "轻微：稍微妨碍社交或工作，但整体表现无大碍" },
      { value: 2, label: "中度：确实妨碍社交或工作，但仍可应付" },
      { value: 3, label: "重度：导致社交或工作表现的障碍" },
      { value: 4, label: "极度：无能力应付社交或工作" },
    ],
  },
  {
    id: 8,
    text: "假如被制止从事强迫行为，您会有什么感觉？会有多焦虑？",
    options: [
      { value: 0, label: "没有焦虑" },
      { value: 1, label: "轻微：若被阻止只是稍微焦虑" },
      { value: 2, label: "中度：若被阻止会有中等焦虑，但仍可应付" },
      { value: 3, label: "严重：若被阻止会明显且困扰地增加焦虑" },
      { value: 4, label: "极度：任何需改变强迫行为的处置都会导致极度焦虑" },
    ],
  },
  {
    id: 9,
    text: "您做过多少努力去对抗强迫行为（尝试停止的频率）？",
    options: [
      { value: 0, label: "一直不断努力对抗（或症状轻微无需对抗）" },
      { value: 1, label: "大部分时间都试图对抗" },
      { value: 2, label: "用些许努力去对抗" },
      { value: 3, label: "屈服于所有强迫行为，未试图控制，但仍有些不甘" },
      { value: 4, label: "完全愿意屈服于强迫行为" },
    ],
  },
  {
    id: 10,
    text: "您控制强迫行为的能力有多强（能否停止或延迟）？",
    options: [
      { value: 0, label: "完全控制" },
      { value: 1, label: "大多能控制：稍花力气即可停止" },
      { value: 2, label: "中等控制：有时能控制，有些困难" },
      { value: 3, label: "控制力弱：只能忍耐耽搁一下，但最终仍须完成" },
      { value: 4, label: "完全无法控制：连耽搁一下的能力都没有" },
    ],
  },
];
