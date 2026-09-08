import type { Option } from "~/types/test";

// ISI 选项（5 级评分；第 4 题为反向计分——满意度，分数越高失眠越严重）
export const isiOptions: Option[] = [
  { value: 0, label: "无" },
  { value: 1, label: "轻度" },
  { value: 2, label: "中度" },
  { value: 3, label: "重度" },
  { value: 4, label: "极重度" },
];

export type ISIDimension = "onset" | "maintenance" | "early" | "satisfaction" | "daytime" | "qol" | "worry";

export interface ISIQuestion {
  id: number;
  text: string;
  dimension: ISIDimension;
  reverse: boolean; // 第 4 题为反向计分（题目本身是满意度描述，分数越高=越不满意=失眠越严重）
}

// ISI 失眠严重程度指数（Insomnia Severity Index）— 7 题
// 编制：Morin CM, Belleville G, Bélanger L, Ivers H (1993)。
//      中文版常用修订：余红梅、李栋等。
//
// 量表用途：评估过去 2 周失眠问题的性质、症状和日间影响。
//
// 量表结构（7 题）：
//   题 1 入睡困难 (onset)
//   题 2 维持睡眠困难 (maintenance)
//   题 3 早醒问题 (early)
//   题 4 当前睡眠模式满意度 (satisfaction) — 反向计分（题干是满意度的描述）
//   题 5 睡眠问题对日间功能影响 (daytime)
//   题 6 睡眠问题对生活质量的影响 (qol)
//   题 7 睡眠问题引起的苦恼程度 (worry)
//
// 计分要点：
//   每题 0-4 分；总分 0-28。
//   临床截断（标准）：
//     0-7   无临床失眠
//     8-14  亚临床失眠（轻度）
//     15-21 中度临床失眠
//     22-28 严重临床失眠
//
//   第 4 题本身为"满意度"维度，反向计分：在本实现中直接将原始分作为失眠严重度
//   （越不满意=越严重），无需额外反向转换。
export const isiQuestions: ISIQuestion[] = [
  { id: 1, text: "请评估您过去 2 周入睡困难的严重程度。", dimension: "onset", reverse: false },
  { id: 2, text: "请评估您过去 2 周维持睡眠的困难程度（夜间易醒、醒来后难以再入睡）。", dimension: "maintenance", reverse: false },
  { id: 3, text: "请评估您过去 2 周早醒问题的严重程度（比预期更早醒来且无法再入睡）。", dimension: "early", reverse: false },
  { id: 4, text: "请评估您过去 2 周对当前睡眠模式的满意程度。", dimension: "satisfaction", reverse: false },
  { id: 5, text: "请评估过去 2 周睡眠问题对您日间功能（如精力、注意力、情绪等）的影响程度。", dimension: "daytime", reverse: false },
  { id: 6, text: "请评估过去 2 周睡眠问题对您生活质量的影响程度。", dimension: "qol", reverse: false },
  { id: 7, text: "请评估过去 2 周您因睡眠问题而感到苦恼或担忧的程度。", dimension: "worry", reverse: false },
];