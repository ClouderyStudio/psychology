import type { Option } from "~/types/test";

// PSS-10 选项（0-4分，5点计分）
export const pss10Options: Option[] = [
  { value: 0, label: "从不" },
  { value: 1, label: "偶尔" },
  { value: 2, label: "有时" },
  { value: 3, label: "经常" },
  { value: 4, label: "总是" },
];

// PSS-10 压力知觉量表 — 10题
export const pss10Questions = [
  { id: 1, text: "在过去一个月中，您有多频繁地因为发生了意想不到的事情而感到心烦？", reverse: false },
  { id: 2, text: "在过去一个月中，您有多频繁地感到无法控制自己生活中重要的事情？", reverse: false },
  { id: 3, text: "在过去一个月中，您有多频繁地感到紧张和压力？", reverse: false },
  { id: 4, text: "在过去一个月中，您有多频繁地自信地处理个人问题？", reverse: true },
  { id: 5, text: "在过去一个月中，您有多频繁地感到事情正朝着您希望的方向发展？", reverse: true },
  { id: 6, text: "在过去一个月中，您有多频繁地发现自己无法应付所有必须做的事情？", reverse: false },
  { id: 7, text: "在过去一个月中，您有多频繁地能够控制生活中的烦心事？", reverse: true },
  { id: 8, text: "在过去一个月中，您有多频繁地感到事情都在自己的掌控之中？", reverse: true },
  { id: 9, text: "在过去一个月中，您有多频繁地因为事情失控而生气？", reverse: false },
  { id: 10, text: "在过去一个月中，您有多频繁地感到困难堆积如山，无法克服？", reverse: false },
];
