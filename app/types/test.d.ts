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
  /** 重要提示（如缺乏文献/实证支持），在量表介绍中醒目展示 */
  notice?: string;
  /**
   * 覆盖边界：本量表测什么、明确不测什么。
   * 用于避免「20 个维度 / 90 道题」被读成「查得全」——未覆盖的方向应明确写出，
   * 并指向平台上已有的对应量表。
   */
  coverage?: string;
  /** 与本量表互补的其它量表，供用户直接跳转 */
  related?: { id: string; title: string; reason: string }[];
}

export interface Test {
  id: string;
  title: string;
  description: string;
  instructions: string;
  /**
   * 本次评估的时间范围（如「最近两周」「过去 7 天」）。
   * 各量表窗口并不一致（PHQ-9 两周 / SDS 一周 / YMRS 48 小时 / SDQ-20 一年），
   * 单靠题面看不出用的是哪个窗口，因此显式下发并在作答页与结果页固定展示。
   */
  timeFrame?: string;
  /**
   * 作答前提（如严重度量表的「惊恐发作」「社交情境」具体指什么）。
   * 这类量表的题面统一写「这些情境」，前提只出现在量表说明里，
   * 翻页后就看不到了，容易误答，因此单独下发并在题目上方常驻展示。
   */
  contextHint?: string;
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
  multidimReport?: Record<string, any>;
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
  /** 评估时间范围（如「最近两周」），随 /api/tests/list 下发 */
  timeFrame?: string;
}
