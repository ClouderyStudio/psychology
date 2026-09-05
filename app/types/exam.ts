/**
 * 内部测试试卷类型（仅类型定义，数据由服务端 API 下发，不随前端 bundle 打包）
 */
export interface ExamOption {
  label: string;
  text: string;
}

export interface ExamQuestion {
  text: string;
  options?: ExamOption[];
  answer: string;
  /** 题目解析/备注 */
  note?: string;
  /** 题型：judge 判断 / single 单选 / multiple 多选 / essay 简答（缺省时按有无 options 推断） */
  type?: "judge" | "single" | "multiple" | "essay";
}

export interface ExamSection {
  title: string;
  /** 每题分值，未指定时默认 1 分 */
  pointsPerQuestion?: number;
  questions: ExamQuestion[];
}

export interface ExamPaper {
  id: string;
  name: string;
  sections: ExamSection[];
}
