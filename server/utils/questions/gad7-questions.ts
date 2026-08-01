import type { Option } from "~/types/test";

// GAD-7 选项（0-3分，4点计分）
export const gad7Options: Option[] = [
  { value: 0, label: "完全不会" },
  { value: 1, label: "好几天" },
  { value: 2, label: "一半以上的天数" },
  { value: 3, label: "几乎每天" },
];

// GAD-7 广泛性焦虑障碍量表 — 7题
export const gad7Questions = [
  { id: 1, text: "感到紧张、焦虑或烦躁不安" },
  { id: 2, text: "无法停止或控制担心" },
  { id: 3, text: "对各种各样的事情担忧过多" },
  { id: 4, text: "很难放松下来" },
  { id: 5, text: "由于不安而无法静坐" },
  { id: 6, text: "变得容易烦恼或急躁" },
  { id: 7, text: "感到似乎将有可怕的事情发生而害怕" },
];
