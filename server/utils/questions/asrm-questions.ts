import type { Option } from "~/types/test";

// ASRM 选项（0-4分，5点计分）
export const asrmOptions: Option[] = [
  { value: 0, label: "完全没有" },
  { value: 1, label: "轻微" },
  { value: 2, label: "中等" },
  { value: 3, label: "明显" },
  { value: 4, label: "非常明显" },
];

// ASRM Altman躁狂自评量表 — 5题
export const asrmQuestions = [
  { id: 1, text: "在过去一周中，您感到比平时更开心、更兴奋、更精力充沛或更乐观吗？" },
  { id: 2, text: "在过去一周中，您是否感到比平时更自信？" },
  { id: 3, text: "在过去一周中，您需要比平时更少的睡眠（例如只睡几个小时，但仍感到精力充沛）吗？" },
  { id: 4, text: "在过去一周中，您是否比平时说话更多，或者感到必须要不停地说？" },
  { id: 5, text: "在过去一周中，您的思维是否比平时更快、更活跃，或者想法一个接一个地涌现？" },
];
