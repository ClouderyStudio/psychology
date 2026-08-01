import type { Option } from "~/types/test";

// RSES 选项（1-4分，4点计分）
export const rsesOptions: Option[] = [
  { value: 1, label: "非常不同意" },
  { value: 2, label: "不同意" },
  { value: 3, label: "同意" },
  { value: 4, label: "非常同意" },
];

// RSES Rosenberg自尊量表 — 10题
export const rsesQuestions = [
  { id: 1, text: "我觉得我是一个有价值的人，至少与其他人在同一水平上", reverse: false },
  { id: 2, text: "我觉得我有许多好的品质", reverse: false },
  { id: 3, text: "总的来说，我倾向于认为自己是一个失败者", reverse: true },
  { id: 4, text: "我能像大多数人一样把事情做好", reverse: false },
  { id: 5, text: "我觉得自己没有什么可自豪的", reverse: true },
  { id: 6, text: "我对自己持肯定态度", reverse: false },
  { id: 7, text: "总的来说，我对自己是满意的", reverse: false },
  { id: 8, text: "我希望我能更看得起自己", reverse: true },
  { id: 9, text: "有时我确实感到自己毫无用处", reverse: true },
  { id: 10, text: "有时我认为自己一无是处", reverse: true },
];
