/**
 * 趋势分组：把本机存档按量表理成「同一量表的整条序列」。
 *
 * 抽成纯函数的理由有两条：
 *   1) 页面里做分组没法单测，而这里的分支（有没有总分、维度够不够两个点）正是出过 bug 的地方；
 *   2) 类型型量表（MBTI / 多维自评 / ECR-R 等）的 totalScore 不是程度分，
 *      把它画成折线会误导，所以「能不能画总分」必须是显式判定，而不是「有数字就画」。
 */
import { comparableDimensions } from './result-store'

export interface TrendPoint { ts: string; value: number }
export interface DimSeries { key: string; label: string; points: TrendPoint[]; delta: number }
export interface TrendRecord {
  key: string
  timestamp: string
  level: string
  displayScore: string
  totalScore: number
  maxScore: number
  raw: any
}
export interface TrendGroup {
  testId: string
  testTitle: string
  records: TrendRecord[]
  /** 是否有可累加的真实总分（类型型量表与无总分量表为 false） */
  scored: boolean
  maxScore: number
  totalSeries: TrendPoint[]
  totalDelta: number
  dimSeries: DimSeries[]
}

export interface BuildTrendOptions {
  /** app/utils/test-display.ts 的 isTypeOnlyTest：类型型量表不画总分折线 */
  isTypeOnly: (testId: string) => boolean
  /** app/utils/test-display.ts 的 formatResultScore：类型型量表显示 level */
  formatScore: (result: any) => string
}

const round2 = (v: number) => Math.round(v * 100) / 100

// 模板里取首尾点：数组可能因数据异常为空，这里统一兜底
export const firstTs = (list: TrendRecord[]) => list[0]?.timestamp || ''
export const lastTs = (list: TrendRecord[]) => list[list.length - 1]?.timestamp || ''
export const firstValue = (points: TrendPoint[]) => points[0]?.value ?? 0
export const lastValue = (points: TrendPoint[]) => points[points.length - 1]?.value ?? 0

/**
 * 按量表分组。只有两次以上记录的量表才会出现在结果里 —— 一次谈不上趋势；
 * 同一量表内按时间正序，「第 N 次」才有意义。
 */
export function buildTrendGroups(
  records: { key: string; result: any }[],
  options: BuildTrendOptions,
): TrendGroup[] {
  const byTest = new Map<string, TrendRecord[]>()
  for (const { key, result } of records) {
    const testId = result?.testId
    if (!testId) continue
    const list = byTest.get(testId) || []
    list.push({
      key,
      timestamp: result.timestamp || '',
      level: result.level || '',
      displayScore: options.formatScore(result),
      totalScore: Number(result.totalScore),
      maxScore: Number(result.maxScore),
      raw: result,
    })
    byTest.set(testId, list)
  }

  const out: TrendGroup[] = []
  for (const [testId, list] of byTest) {
    if (list.length < 2) continue
    list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    const latest = list[list.length - 1]!
    // 类型型量表的 totalScore 不是程度分；maxScore 为 0 时同样没有可比区间
    const scored = !options.isTypeOnly(testId) && Number.isFinite(latest.maxScore) && latest.maxScore > 0
    const totalSeries: TrendPoint[] = scored
      ? list.map((r) => ({ ts: r.timestamp, value: r.totalScore }))
      : []

    // 维度序列：只收真正可比较的维度，展示卡（PHQ-9 关键症状卡）与汇总桶不参与
    const dimMap = new Map<string, { label: string; points: TrendPoint[] }>()
    for (const r of list) {
      for (const [key, dim] of comparableDimensions(r.raw)) {
        const entry = dimMap.get(key) || { label: dim.label, points: [] }
        entry.points.push({ ts: r.timestamp, value: dim.value })
        dimMap.set(key, entry)
      }
    }
    const dimSeries: DimSeries[] = [...dimMap.entries()]
      // 少于两个点连不成线
      .filter(([, entry]) => entry.points.length >= 2)
      .map(([key, entry]) => {
        const first = entry.points[0]!
        const last = entry.points[entry.points.length - 1]!
        return { key, label: entry.label, points: entry.points, delta: round2(last.value - first.value) }
      })

    out.push({
      testId,
      testTitle: latest.raw?.testTitle || testId,
      records: list,
      scored,
      maxScore: latest.maxScore,
      totalSeries,
      totalDelta: scored ? round2(lastValue(totalSeries) - firstValue(totalSeries)) : 0,
      dimSeries,
    })
  }

  // 有分数折线的排前面，其次按记录条数多的在前
  out.sort((a, b) => Number(b.scored) - Number(a.scored) || b.records.length - a.records.length)
  return out
}

/** 归一化到 0-100 × 30 的坐标系；全部同值时画一条水平中线 */
export function chartPoints(values: number[]): string {
  if (values.length < 2) return ''
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100
      const y = span === 0 ? 15 : 28 - ((v - min) / span) * 26
      return x.toFixed(2) + ',' + y.toFixed(2)
    })
    .join(' ')
}

/**
 * 展示用数值：最多两位小数。
 *
 * 必要性：多维自评量表这类量表的维度值是归一化后的浮点（如 0.10638297872340426），
 * 直接插值会把整条对比行撑爆；而 0.10638297872340426 - (-0.21999999999999997)
 * 这类差值本身也带浮点尾巴，所以差值同样走这里格式化。
 */
export function formatTrendValue(v: number): string {
  if (!Number.isFinite(v)) return '0'
  const r = Math.round(v * 100) / 100
  // 避免 -0 与 -0.00 这类显示
  return String(Object.is(r, -0) ? 0 : r)
}

/** 「变好」不总是数值下降（睡眠质量类越高越好），因此只标方向、不下好坏结论 */
export const deltaColor = (v: number) =>
  v > 0 ? 'var(--primary)' : v < 0 ? 'var(--text-secondary)' : 'var(--text-muted)'

export const formatDelta = (v: number) => (v > 0 ? '+' + formatTrendValue(v) : formatTrendValue(v))
export const formatTrendTime = (ts: string) =>
  ts ? new Date(ts).toLocaleString('zh-CN') : '未知时间'
