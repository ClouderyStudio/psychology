// 进食态度测验（EAT-26）· 题库
//
// 编制：Garner DM, Olmsted MP, Bohr Y, Garfinkel PE. The Eating Attitudes Test:
// psychometric features and clinical correlates. Psychological Medicine.
// 1982;12(4):871-878.（26 题版；原始 40 题版见 Garner & Garfinkel, 1979）
//
// 中文版信效度：王冰莹, 陈健芷, 刘勇, 刘杰, 郭婷. 进食态度问卷中文版测评大学生
// 样本的效度和信度. 中国心理卫生杂志. 2015;29(2):150-155.
//
// 结构：26 题自评，6 点作答。第 1-25 题只有「总是 / 经常 / 常常」三档计分
// （依次 3 / 2 / 1 分），「有时 / 很少 / 从不」一律 0 分；第 26 题反向计分
// （从不 = 3、很少 = 2、有时 = 1，其余 0 分）。总分 0-78，≥20 为官方筛查阳性线。
//
// 选项 value 是「档位序号」而不是量表分值：总是 5 / 经常 4 / 常常 3 / 有时 2 /
// 很少 1 / 从不 0。原因是作答页按 option.value 判断哪一项被选中，value 必须逐题
// 唯一；而「有时 / 很少 / 从不」三档都是 0 分，若直接把分值当 value，这三个选项会
// 同时显示为选中，也无法区分用户实际选了哪一档。因此 26 题共用同一套 value 唯一的
// 档位选项，「档位 → 分值」的换算（含第 26 题反向）统一放在 scoreEAT26 里。

import type { Option } from "~/types/test";

// 档位序号 → 计分：0 从不 / 1 很少 / 2 有时 均为 0 分，3 常常 1 分，4 经常 2 分，5 总是 3 分
export const eat26Options: Option[] = [
  { value: 5, label: "总是" },
  { value: 4, label: "经常" },
  { value: 3, label: "常常" },
  { value: 2, label: "有时" },
  { value: 1, label: "很少" },
  { value: 0, label: "从不" },
];

export interface EAT26Question {
  id: number;
  text: string;
}

export const eat26Questions: EAT26Question[] = [
  { id: 1, text: "我很害怕自己变胖。" },
  { id: 2, text: "我即使饿了也会避免吃东西。" },
  { id: 3, text: "我发现自己满脑子都在想食物。" },
  { id: 4, text: "我曾暴食，并且感觉自己停不下来。" },
  { id: 5, text: "我会把食物切成很小的块。" },
  { id: 6, text: "我会留意自己所吃食物的热量。" },
  { id: 7, text: "我特别避免吃高碳水化合物的食物（如面包、米饭、土豆等）。" },
  { id: 8, text: "我觉得别人希望我多吃一点。" },
  { id: 9, text: "我吃完东西后会呕吐。" },
  { id: 10, text: "吃完东西后我感到极度内疚。" },
  { id: 11, text: "我一心想着要变得更瘦。" },
  { id: 12, text: "我运动时会想着要消耗多少热量。" },
  { id: 13, text: "别人觉得我太瘦了。" },
  { id: 14, text: "我满脑子都在想自己身上有脂肪这件事。" },
  { id: 15, text: "我吃饭比其他人花更长时间。" },
  { id: 16, text: "我会避免吃含糖的食物。" },
  { id: 17, text: "我会吃减肥食品（低热量、代餐类）。" },
  { id: 18, text: "我觉得食物控制了我的生活。" },
  { id: 19, text: "我在吃的东西上表现出很强的自我控制。" },
  { id: 20, text: "我觉得别人在逼我多吃。" },
  { id: 21, text: "我在食物上花了太多时间和心思。" },
  { id: 22, text: "我吃了甜食后会感到不自在。" },
  { id: 23, text: "我有节食的行为。" },
  { id: 24, text: "我喜欢肚子空空的感觉。" },
  { id: 25, text: "吃完饭后我有想吐的冲动。" },
  { id: 26, text: "我喜欢尝试新的、丰盛油腻的食物。" },
];
