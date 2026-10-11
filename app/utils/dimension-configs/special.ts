import type { DimensionConfig, DimensionItem } from './index'
import { clamp } from './shared'

export function sccsBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = '自我和谐 · 维度剖面'
  const icon = '🪞'
  const color = 'var(--special)'
  const hint = '不和谐越低、灵活性越高、刻板性越低，自我越和谐。'
  let subtitle = ''
  // 键名 -> 中文（静态映射，兼容历史已存结果，不依赖计分是否下发 name）
  const sccsNames: Record<string, string> = {
    disharmony: '自我与经验的不和谐',
    flexibility: '自我的灵活性',
    rigidity: '自我的刻板性',
  }
  ;['disharmony', 'flexibility', 'rigidity'].forEach((k) => {
    const d = (s[k] || {}) as any
    items.push({
      key: k,
      name: sccsNames[k] || k,
      value: clamp((Number(d.avg) || 0) / 5 * 100),
      display: String(Math.round((Number(d.avg) || 0) * 100) / 100) + '/5',
      level: (Number(d.avg) || 0) >= 4 ? '偏高' : (Number(d.avg) || 0) >= 2.5 ? '中等' : '偏低',
      desc: (d.desc as string) || '',
    })
  })
  if (s.harmonyIndex != null) subtitle = '综合自我和谐指数 ' + Number(s.harmonyIndex).toFixed(2) + ' / 5.00 → ' + (s.harmonyLevel || '')
  return { title, icon, color, hint, subtitle, items }
}

export function rsesBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = '自尊 · 双因子剖面'
  const icon = '✨'
  const color = 'var(--special)'
  const hint = '两个因子各 5 题、均为 1-4 均值（合计 5-20 分）。它们按题目措辞方向划分，天然负相关，差距大通常反映作答风格而非两种自我评价。'
  let subtitle = ''
  if (s.note) subtitle = String(s.note)
  ;['competence', 'liking'].forEach((k) => {
    const d = (s[k] || {}) as any
    const avg = Number(d.avg) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp(avg / 4 * 100),
      display: String(Math.round(avg * 100) / 100) + '/4',
      level: avg >= 3 ? '较高' : avg >= 2.5 ? '中等' : '偏低',
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, subtitle, items }
}

export function ecrrBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'ECR-R · 依恋焦虑与回避'
  const icon = '💞'
  const color = 'var(--special)'
  const hint = '两个维度是各自 18 题的平均分（1-7），没有可以相加的总分；「依恋倾向」是按两维与中点 4 相比得到的描述性归类，非原作者认可的固定分类。'
  const pattern = (s.pattern || {}) as any
  items.push({
    key: 'pattern',
    name: '依恋倾向',
    value: 0,
    display: (pattern.level as string) || '',
    level: (pattern.level as string) || '',
    desc: (pattern.desc as string) || '',
  })
  ;['anxiety', 'avoidance'].forEach((k) => {
    const d = (s[k] || {}) as any
    const v = Number(d.score) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp((v / 7) * 100),
      display: Number.isInteger(v) ? String(v) : v.toFixed(2),
      level: (d.level as string) || '',
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}

export function swlsBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'SWLS · 生活满意度'
  const icon = '😊'
  const color = 'var(--primary)'
  const hint = '5 题 7 点相加，总分 5-35，分越高越满意（方向与症状量表相反）。'
  const total = (s.total || {}) as any
  const tv = Number(total.score) || 0
  items.push({
    key: 'total',
    name: (total.name as string) || '总分',
    value: clamp((tv / (total.max || 35)) * 100),
    display: String(tv) + '/' + total.max,
    level: (s.band && (s.band as any).level) ? String((s.band as any).level) : '',
    desc: (total.desc as string) || '',
  })
  const band = (s.band || {}) as any
  items.push({
    key: 'band',
    name: '满意度分档',
    value: 0,
    display: (band.level as string) || '',
    level: (band.level as string) || '',
    desc: (band.desc as string) || '',
  })
  return { title, icon, color, hint, items }
}

export function hsprBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'HSP-R · 高敏感特质'
  const icon = '🌱'
  const color = 'var(--personality)'
  const hint = '官方按 18 题的平均分判定：平均分 >5 提示高敏感倾向；敏感是中性的人格与气质特质，不是障碍，分数高不代表问题严重。'
  const total = (s.total || {}) as any
  const tv = Number(total.score) || 0
  items.push({
    key: 'total',
    name: (total.name as string) || '总体敏感度',
    value: clamp((tv / (total.max || 7)) * 100),
    display: Number(tv).toFixed(2) + '/7',
    level: (total.level as string) || '',
    desc: (total.desc as string) || '',
  })
  ;['overstimulation', 'positive', 'social', 'depth', 'reactivity', 'details'].forEach((k) => {
    const d = (s[k] || {}) as any
    if (!d || d.score === undefined) return
    const v = Number(d.score) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp((v / (d.max || 7)) * 100),
      display: Number(v).toFixed(2) + '/7',
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}

export function spnqBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'SpNQ-20 · 精神需求'
  const icon = '🕯️'
  const color = 'var(--personality)'
  const hint = 'Spiritual Needs Questionnaire（Büssing 编制，20 题 0-3）：只按四个因子分别求和，说明哪一类精神需求目前更强，官方没有总分切点，也不做高低判定。'
  const mean = (s.mean || {}) as any
  const mv = Number(mean.score) || 0
  items.push({
    key: 'mean',
    name: (mean.name as string) || '总均值',
    value: clamp((mv / (mean.max || 3)) * 100),
    display: Number(mv).toFixed(2) + '/3',
    desc: (mean.desc as string) || '',
  })
  const total = (s.total || {}) as any
  const tv = Number(total.score) || 0
  items.push({
    key: 'total',
    name: (total.name as string) || '需求合计',
    value: clamp((tv / (total.max || 60)) * 100),
    display: String(tv) + '/' + total.max,
    desc: (total.desc as string) || '',
  })
  ;['ipn', 'exn', 'ggn', 'rn'].forEach((k) => {
    const d = (s[k] || {}) as any
    if (!d || d.score === undefined) return
    const v = Number(d.score) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp((v / (d.max || 1)) * 100),
      display: String(v) + '/' + d.max,
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}
