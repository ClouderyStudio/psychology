import type { Option } from "~/types/test";

// GAD-7 选项（0-3分，4点计分）
export const gad7Options: Option[] = [
  { value: 0, label: "完全不会" },
  { value: 1, label: "好几天" },
  { value: 2, label: "一半以上天数" },
  { value: 3, label: "几乎每天" },
];

// GAD-7 广泛性焦虑障碍量表 — 7题
export const gad7Questions = [
  { id: 1, text: "感到紧张、焦虑或烦躁" },
  { id: 2, text: "无法停止或控制担忧" },
  { id: 3, text: "对各种事情过度担忧" },
  { id: 4, text: "难以放松" },
  { id: 5, text: "坐立不安，以至于难以安静地坐着" },
  { id: 6, text: "容易烦躁或急躁" },
  { id: 7, text: "感到害怕，好像有什么可怕的事情会发生" },
];
