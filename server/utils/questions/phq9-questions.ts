import type { Option } from "~/types/test";

// PHQ-9 选项（0-3分，4点计分）
export const phq9Options: Option[] = [
  { value: 0, label: "完全不会" },
  { value: 1, label: "好几天" },
  { value: 2, label: "一半以上的天数" },
  { value: 3, label: "几乎每天" },
];

// PHQ-9 患者健康问卷 — 9题
export const phq9Questions = [
  { id: 1, text: "做事时提不起劲或没有兴趣" },
  { id: 2, text: "感到心情低落、沮丧或绝望" },
  { id: 3, text: "入睡困难、睡不安稳或睡眠过多" },
  { id: 4, text: "感觉疲倦或没有活力" },
  { id: 5, text: "食欲不振或吃太多" },
  { id: 6, text: "觉得自己很糟糕，或觉得自己很失败，或让自己或家人失望" },
  { id: 7, text: "对事物专注有困难，例如看报纸或看电视时" },
  { id: 8, text: "动作或说话速度缓慢到别人已经注意到？或正好相反，烦躁或坐立不安、动来动去的情况更胜于平常" },
  { id: 9, text: "有不如死掉或用某种方式伤害自己的念头" },
];
