import type { DimensionConfig, DimensionItem } from './index'
import { clamp } from './shared'

export function auditBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'AUDIT · 三个方向剖面'
  const icon = '🍷'
  const color = 'var(--symptom)'
  const hint = '总分 ≥8 提示危险或有害饮酒；三个方向分别对应饮酒量、依赖症状与有害后果。'
  const total = (s.total || {}) as any
  const sc = Number(total.score) || 0
  items.push({
    key: 'total',
    name: (total.name as string) || '总分',
    value: clamp((sc / (total.max || 40)) * 100),
    display: String(sc) + '/' + total.max,
    level: (total.level as string) || '',
    desc: (total.desc as string) || '',
  })
  ;['hazardous', 'dependence', 'harmful'].forEach((k) => {
    const d = (s[k] || {}) as any
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

export function igdsBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'IGDS9-SF · 网络游戏障碍筛查'
  const icon = '🎮'
  const color = 'var(--symptom)'
  const hint = '官方判定看「非常频繁」的条目数：9 条中 ≥5 条即达到筛查标准；总分只描述整体程度。'
  const total = (s.total || {}) as any
  const sc = Number(total.score) || 0
  items.push({
    key: 'total',
    name: (total.name as string) || '总分',
    value: clamp((sc / (total.max || 45)) * 100),
    display: String(sc) + '/' + total.max,
    desc: (total.desc as string) || '',
  })
  const en = (s.endorsed || {}) as any
  const ev = Number(en.score) || 0
  items.push({
    key: 'endorsed',
    name: (en.name as string) || '「非常频繁」条目数',
    value: clamp((ev / (en.max || 9)) * 100),
    display: String(ev) + '/' + en.max,
    level: (en.level as string) || '',
    desc: (en.desc as string) || '',
  })
  return { title, icon, color, hint, items }
}

export function eat26Builder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'EAT-26 · 分量表剖面'
  const icon = '🍽️'
  const color = 'var(--symptom)'
  const hint = '总分 ≥20 为官方筛查阳性线；三个分量表只说明得分来自哪些方面，官方未提供分量表常模与截断值。'
  const total = (s.total || {}) as any
  const sc = Number(total.score) || 0
  items.push({
    key: 'total',
    name: (total.name as string) || '总分',
    value: clamp((sc / (total.max || 78)) * 100),
    display: String(sc) + '/' + total.max,
    level: (total.level as string) || '',
    desc: (total.desc as string) || '',
  })
  ;['dieting', 'bulimia', 'oral'].forEach((k) => {
    const d = (s[k] || {}) as any
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

export function scoffBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'SCOFF 进食障碍筛查'
  const icon = '🥄'
  const color = 'var(--symptom)'
  const hint = '5 道是/否题，≥2 项为阳性，提示值得请专业人员进一步评估。'
  const total = (s.total || {}) as any
  const sc = Number(total.score) || 0
  items.push({
    key: 'total',
    name: (total.name as string) || '阳性题数',
    value: clamp((sc / (total.max || 5)) * 100),
    display: String(sc) + '/' + total.max,
    level: (total.level as string) || '',
    desc: (total.desc as string) || '',
  })
  return { title, icon, color, hint, items }
}

export function asrsBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'ASRS-v1.1 · 筛查计数与症状维度'
  const icon = '🎯'
  const color = 'var(--symptom)'
  const hint = '官方判定看 Part A（第 1-6 题）中达到各自频率阈值的题数：≥4 提示症状可能与成人 ADHD 相符；Likert 总分只描述整体程度。'
  const shadow = (s.shadow || {}) as any
  const sv = Number(shadow.score) || 0
  items.push({
    key: 'shadow',
    name: (shadow.name as string) || 'Part A 阴影计数',
    value: clamp((sv / (shadow.max || 6)) * 100),
    display: String(sv) + '/' + shadow.max,
    level: (shadow.level as string) || '',
    desc: (shadow.desc as string) || '',
  })
  const total = (s.total || {}) as any
  const tv = Number(total.score) || 0
  items.push({
    key: 'total',
    name: (total.name as string) || 'Likert 总分',
    value: clamp((tv / (total.max || 72)) * 100),
    display: String(tv) + '/' + total.max,
    desc: (total.desc as string) || '',
  })
  ;['inattention', 'hyperactive'].forEach((k) => {
    const d = (s[k] || {}) as any
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

export function psqiBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'PSQI · 睡眠质量七成分'
  const icon = '😴'
  const color = 'var(--symptom)'
  const hint = '总分 >5 提示睡眠质量差（Buysse 等 1989），国内研究常用 >7；七个成分各 0-3 分，分越高越差。'
  const total = (s.total || {}) as any
  const tv = Number(total.score) || 0
  items.push({
    key: 'total',
    name: (total.name as string) || '总分',
    value: clamp((tv / (total.max || 21)) * 100),
    display: String(tv) + '/' + total.max,
    level: (total.level as string) || '',
    desc: (total.desc as string) || '',
  })
  ;['quality', 'latency', 'duration', 'efficiency', 'disturbance', 'medication', 'daytime'].forEach((k) => {
    const d = (s[k] || {}) as any
    const v = Number(d.score) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp((v / 3) * 100),
      display: String(v) + '/3',
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}
