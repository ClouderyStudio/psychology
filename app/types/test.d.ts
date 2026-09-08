export interface Option {
  value: number;
  label: string;
}

export interface Question {
  id: number;
  text: string;
  options?: Option[];
  reversed?: boolean;
  dimension?: string | null;
  /** number 题：数字输入（用于生理年龄等），min/max 为允许区间 */
  /** range 题：滑块，min/max/step 决定刻度，值必需 */
  type?: "likert" | "number" | "single" | "judge" | "essay" | "range";
  min?: number;
  max?: number;
  /** 滑块步长（range 题），默认 1 */
  step?: number;
  /** 滑块两端标签（range 题），如 MID-60 的 0=从不 / 10=总是 */
  minLabel?: string;
  maxLabel?: string;
}

export interface ScaleIntro {
  /** 由来：量表的编制依据 / 理论来源 */
  origin: string;
  /** 作用：量表测量什么、结果如何解读 */
  purpose: string;
  /** 适配人群：适合哪些人使用及注意事项 */
  audience: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  instructions: string;
  questions: Question[];
  scoringRules: {
    type: string;
  };
  /** 量表介绍（由来 / 作用 / 适配人群），可选 */
  intro?: ScaleIntro;
}

// SCL-90 维度分数类型
export interface SCL90DimensionScore {
  total: number;
  average: number;
  level: string;
  description: string;
}

// SCL-90 维度分数映射类型
export interface SCL90DimensionScores {
  somatization: SCL90DimensionScore;
  obsessive: SCL90DimensionScore;
  interpersonal: SCL90DimensionScore;
  depression: SCL90DimensionScore;
  anxiety: SCL90DimensionScore;
  hostility: SCL90DimensionScore;
  phobic: SCL90DimensionScore;
  paranoid: SCL90DimensionScore;
  psychotic: SCL90DimensionScore;
  additional: SCL90DimensionScore;
}

// 扩展 TestResult 类型
export interface TestResult {
  testId: string;
  testTitle?: string;
  totalScore: number;
  maxScore: number;
  level: string;
  suggestion: string;
  severity: number;
  timestamp: string;
  note?: string;
  noteUpdatedAt?: string;
  rawScore?: number;
  standardizedScore?: number;
  dimensionScores?: SCL90DimensionScores | Record<string, any>;
  mbtiReport?: Record<string, any>;
  sevenReport?: Record<string, any>;
  psyAgeReport?: Record<string, any>;
}
export interface TestListItem {
  id: string;
  title: string;
  englishName: string;
  description: string;
  duration: string;
  questionsCount: number;
  tags: string[];
  category: "symptom" | "personality" | "special";
}
