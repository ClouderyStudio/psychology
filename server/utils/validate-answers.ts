/**
 * 测评作答校验（纯函数，可在服务端 API 与单测中复用）。
 * 返回 null 表示校验通过；否则返回对应用户可读的错误文案。
 */

export interface QuestionLike {
  id: number;
  type?: string;
  options?: Array<{ value: number }>;
}

export function validateAnswers(
  questions: QuestionLike[],
  answers: Record<number, number>,
): string | null {
  // 无题目列表时无从校验（调用方通常只在有题目时才调用），视为通过
  if (questions.length === 0) return null;

  // 必答题完整性：number 题（如生理年龄）为可选，不参与必答校验
  const missing = questions.filter(
    (q) => q.type !== "number" && !(q.id in answers),
  );
  if (missing.length > 0) {
    return `还有 ${missing.length} 道题未作答，请先完成所有题目`;
  }

  // 拒绝不属于该量表题号的额外作答（防止多余键被计入总分，如 SCL-90 求和）
  const knownIds = new Set(questions.map((q) => q.id));
  const extra = Object.keys(answers)
    .map(Number)
    .filter((id) => !knownIds.has(id));
  if (extra.length > 0) {
    return `包含无效的作答（题号：${extra.join("、")}）`;
  }

  // 值域校验：答案必须是数字且在选项分值范围内（number 题为可选自由输入，跳过）
  for (const q of questions) {
    if (q.type === "number") continue;
    const val = answers[q.id];
    if (typeof val !== "number" || !Number.isFinite(val)) {
      return `第 ${q.id} 题的答案格式不正确`;
    }
    if (Array.isArray(q.options) && q.options.length > 0) {
      const values = q.options.map((o) => o.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      if (val < min || val > max) {
        return `第 ${q.id} 题的选项无效`;
      }
    }
  }

  return null;
}
