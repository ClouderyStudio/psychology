export interface Option {
  value: number
  label: string
}

export interface Question {
  id: number
  text: string
  options: Option[]
  reversed?: boolean
  dimension?: string
}

export interface Test {
  id: string
  title: string
  description: string
  instructions: string
  questions: Question[]
  scoringRules: {
    type: string
    thresholds?: Array<{ min: number; max: number; level: string; suggestion: string }>
    dimensions?: Record<string, number[]>
  }
}

export interface TestResult {
  testId: string
  testTitle?: string
  totalScore: number
  maxScore: number
  level: string
  suggestion: string
  severity: number
  personalizedAdvice?: string
  timestamp: string
  rawScore?: number
  standardizedScore?: number
}

export interface TestListItem {
  id: string
  title: string
  englishName: string
  description: string
  duration: string
  questionsCount: number
  category: 'symptom' | 'personality' | 'special'  // 添加分类字段
}