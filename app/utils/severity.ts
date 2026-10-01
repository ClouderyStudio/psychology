/**
 * 严重度配色 —— 全站唯一来源。
 *
 * 等级序号 1..5 与 tailwind.css 里的三组令牌一一对应：
 *   --sev-N        实心色（进度条、圆环等大面积色块）
 *   --sev-N-soft   标签底色
 *   --sev-N-text   标签文字色
 * 序号 0 表示「未知」，落到中性灰。
 *
 * 组件不要再写死 `#10b981` / `bg-green-100` 一类的颜色：
 * 亮暗两套取值都在 tailwind.css 的 :root / [data-theme="dark"] 里维护。
 */

/** 5 级严重度名称，由低到高；序号 = 下标 + 1。 */
export const SEVERITY_LEVELS = ['很低', '较低', '中等', '较高', '很高'] as const

export type SeverityLevel = (typeof SEVERITY_LEVELS)[number]

/** 等级名称 → 序号（未收录的等级返回 0）。 */
export function sevRank(level?: string | null): number {
  const i = SEVERITY_LEVELS.indexOf((level ?? '') as SeverityLevel)
  return i < 0 ? 0 : i + 1
}

/** 0–1 的综合严重度分值 → 序号（< 0.3 低、< 0.6 中，其余高 → 1 / 3 / 5）。 */
export function sevRankFromScore(score: number): number {
  if (!Number.isFinite(score) || score < 0.3) return 1
  if (score < 0.6) return 3
  return 5
}

/** 序号 → 实心色，用于进度条 / 圆环。 */
export function sevColor(rank: number): string {
  return `var(--sev-${rank})`
}

/** 序号 → 标签配色，可直接绑定到 :style。 */
export function sevTone(rank: number): { backgroundColor: string; color: string } {
  return { backgroundColor: `var(--sev-${rank}-soft)`, color: `var(--sev-${rank}-text)` }
}
