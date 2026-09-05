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
  type?: "likert" | "number" | "single" | "judge" | "essay";
  min?: number;
  max?: number;
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
  personalizedAdvice?: string;
  timestamp: string;
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
