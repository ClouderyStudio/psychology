// 成人 ADHD 自评量表（ASRS-v1.1）· 题库
//
// 编制：世界卫生组织（WHO）与成人 ADHD 工作组（Lenard Adler、Ronald Kessler、
// Thomas Spencer 等），2003 年，© World Health Organization。与 DSM-IV-TR 的
// ADHD 症状条目一致，回忆期为「过去 6 个月」，仅适用于年满 18 岁者。
// 官方原件：https://www.hcp.med.harvard.edu/ncs/ftpdir/adhd/18Q_ASRS_English.pdf
// 引用：Kessler RC, et al. Psychological Medicine. 2005;35(2):245-256.
//
// 结构：18 题，Part A = 第 1-6 题，Part B = 第 7-18 题。全部正向计分。
//
// 两套计分同时成立，不能混用（这是最容易写错的地方）：
//   · 官方筛查计分（WHO，唯一原始规则）：每题二分类为 0/1，Part A 六题的
//     计数 0-6，≥4 提示症状可能与成人 ADHD 相符；
//   · Likert 计分（常见做法，非 WHO 原始）：每題 0-4，Part A 0-24、
//     Part B 0-48、总分 0-72。
// 二分类的阈值分两组：第 1、2、3、9、12、16、18 题以「有时（2）」及以上记 1，
// 第 4、5、6、7、8、10、11、13、14、15、17 题以「常常（3）」及以上记 1。
//
// 分量表划分以 APA 转载的原件为准（网络上流传的 1-4,7-11 / 5-6,12-18 与原件
// 冲突）：注意力缺陷 = 第 1-4、7-12 题；多动/冲动 = 第 5、6、13-18 题。

import type { Option } from "~/types/test";

export const asrsOptions: Option[] = [
  { value: 0, label: "从不" },
  { value: 1, label: "很少" },
  { value: 2, label: "有时" },
  { value: 3, label: "常常" },
  { value: 4, label: "非常频繁" },
];

export interface ASRSQuestion {
  id: number;
  text: string;
}

export const asrsQuestions: ASRSQuestion[] = [
  { id: 1, text: "在完成一个项目中最艰难的部分之后，你在处理最后的细节时是否常常有困难？" },
  { id: 2, text: "在需要条理的任务中，你是否时常有困难把事情整理安排好？" },
  { id: 3, text: "你是否时常有困难记住约会或应做的事？" },
  { id: 4, text: "如果一件事需要多动脑筋，你是否常常躲避或推延开始做它？" },
  { id: 5, text: "如果你不得不长时间坐着，你是否常常扭动不安或手脚动个不停？" },
  { id: 6, text: "你是否时常感到过度活跃，强迫自己做事，就像上了发条的机器？" },
  { id: 7, text: "当做枯燥或困难的工作时，你是否常常犯粗心的错误？" },
  { id: 8, text: "当做枯燥或重复性的工作时，你是否常常难以持续专注？" },
  { id: 9, text: "即使别人直接对你说话，你是否常常难以专注听清对方讲的内容？" },
  { id: 10, text: "你是否常常把东西放错地方，或在家里、工作中找不到东西？" },
  { id: 11, text: "你是否常常被周围的活动或声音分心？" },
  { id: 12, text: "在需要坐着的场合（如开会），你是否常常离开座位？" },
  { id: 13, text: "你是否常常感到坐立不安或烦躁？" },
  { id: 14, text: "自己有空闲的时候，你是否常常难以放松下来？" },
  { id: 15, text: "在社交场合，你是否常常发现自己说得太多？" },
  { id: 16, text: "与人交谈时，你是否常常在对方还没说完就替他把话说完？" },
  { id: 17, text: "在需要排队轮流的场合，你是否常常难以等待轮到自己？" },
  { id: 18, text: "当别人正忙的时候，你是否常常打断他们？" },
];
