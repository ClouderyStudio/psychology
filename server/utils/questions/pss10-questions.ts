import type { Option } from "~/types/test";

// PSS-10 选项（0-4分，5点计分）
export const pss10Options: Option[] = [
  { value: 0, label: "从不" },
  { value: 1, label: "几乎不" },
  { value: 2, label: "有时" },
  { value: 3, label: "经常" },
  { value: 4, label: "非常频繁" },
];

// PSS-10 压力知觉量表 — 10题
export const pss10Questions = [
  { id: 1, text: "因为发生意外的事情而感到心烦", reverse: false },
  { id: 2, text: "感觉无法控制生活中重要的事情", reverse: false },
  { id: 3, text: "感到紧张和压力", reverse: false },
  { id: 4, text: "对自己处理个人问题的能力感到有信心（反向计分）", reverse: true },
  { id: 5, text: "觉得事情都按照你的意愿发展（反向计分）", reverse: true },
  { id: 6, text: "发现自己无法应对所有必须做的事情", reverse: false },
  { id: 7, text: "能够控制生活中的恼人事情（反向计分）", reverse: true },
  { id: 8, text: "觉得自己一切都很顺利（反向计分）", reverse: true },
  { id: 9, text: "因为无法控制的事情而感到愤怒", reverse: false },
  { id: 10, text: "感到困难堆积如山，无法克服", reverse: false },
];
