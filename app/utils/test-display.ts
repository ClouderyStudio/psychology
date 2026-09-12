/**
 * 量表展示口径。
 *
 * 结果页、历史页与首页卡片原先各自维护一份「无总分量表」清单，三份内容互相漂移，
 * 导致同一个量表在某处按类型展示、在另一处被当成分数展示（多维自评量表即如此：
 * 结果页已不显示分数，首页卡片与历史页却仍把参考方向吻合度渲染成「78/100」总分）。
 * 这里统一为唯一数据源，展示层只引用本文件。
 */

/**
 * 无总分 / 总分不具意义的量表：以类型或等级作为主要展示内容。
 * - 人格与类型量表：结果本身就是类型，分数无意义
 * - multidim：维度强度是相对值，参考方向已不再计分，因此也不展示分数
 */
export const TYPE_ONLY_TESTS: readonly string[] = [
  "mbti",
  "sixteenPF",
  "epq",
  "epq-rsc",
  "temperament",
  "seven",
  "psy-age",
  "multidim",
];

export function isTypeOnlyTest(testId: string | null | undefined): boolean {
  return !!testId && TYPE_ONLY_TESTS.includes(testId);
}

/** 历史列表 / 首页卡片共用的「分数」展示文案 */
export function formatResultScore(result: any): string {
  if (!result) return "--";
  if (isTypeOnlyTest(result.testId)) return result.level || "--";
  return `${result.totalScore ?? 0}/${result.maxScore ?? "--"}`;
}
