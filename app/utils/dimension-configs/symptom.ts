import type { DimensionConfig, DimensionItem } from './index'
import { clamp } from './shared'

export function siossBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'SIOSS · 因子剖面'
  const icon = '🆘'
  const color = 'var(--symptom)'
  const hint = '绝望感与乐观感缺乏得分越高风险越高；题 11/17/22/26 中的任一条目被肯定回答都将视为危险信号。'
  let subtitle = ''
  const siossDefs = [
    ['hopeless', '绝望感', 12],
    ['optimism', '乐观感缺乏（反向）', 5],
    ['sleep', '睡眠困扰', 4],
  ] as const
  siossDefs.forEach(([k, name, max]) => {
    const d = (s[k] || {}) as any
    const sc = Number(d.score) || 0
    items.push({
      key: k as string,
      name: name as string,
      value: clamp(sc / max * 100),
      display: String(sc) + '/' + max,
      level: max === 12 ? (sc >= 8 ? '偏高' : sc >= 4 ? '中等' : '偏低') : (sc >= 3 ? '偏高' : sc >= 2 ? '中等' : '偏低'),
    })
  })
  if (s.dangerEndorsed) {
    subtitle = '⚠️ 您对强烈危险信号条目（"想结束自己的生命""我曾经自杀过"等）作出了肯定回答——请务必认真对待，尽快寻求专业评估与支持（全国心理援助热线 12356）。'
  } else if ((s.concealment || {}).valid === false) {
    subtitle = '⚠️ 掩饰维度得分 ' + (s.concealment?.score ?? 0) + '/5（≥4 判定无效），本次结果参考价值有限，建议如实重测。'
  } else if ((s.concealment || {}).valid === true) {
    subtitle = '掩饰维度得分 ' + (s.concealment?.score ?? 0) + '/5，作答有效。'
  }
  return { title, icon, color, hint, subtitle, items }
}

export function bpaqBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'BPAQ · 四维攻击剖面'
  const icon = '💢'
  const color = 'var(--symptom)'
  const hint = '身体 / 言语攻击、愤怒、敌意四维（各维分数与满分并列展示）。'
  const bpaqDefs: [string, string, number][] = [
    ['physical', '身体攻击', 40],
    ['verbal', '言语攻击', 35],
    ['anger', '愤怒', 35],
    ['hostility', '敌意', 35],
  ]
  bpaqDefs.forEach(([k, name, max]) => {
    const d = (s[k] || {}) as any
    const sc = Number(d.score) || 0
    const pct = sc / max * 100
    items.push({
      key: k,
      name,
      value: clamp(pct),
      display: String(sc) + '/' + max,
      level: pct >= 62 ? '偏高' : pct >= 45 ? '中等' : '较低',
    })
  })
  return { title, icon, color, hint, items }
}

export function pssBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = '压力维度 · 不可控感 / 掌控感'
  const icon = '🧘'
  const color = 'var(--symptom)'
  const hint = '每项 0-4 均值。两个维度方向相反：不可控感越高越易累积压力，掌控感越高则抗压越强，不能横向比大小。'
  ;['helplessness', 'selfEfficacy'].forEach((k) => {
    const d = (s[k] || {}) as any
    const avg = Number(d.avg) || 0
    // 标签跟随各自的方向：不可控感越高越糟，掌控感越高越好
    const level =
      k === 'selfEfficacy'
        ? avg >= 2.5 ? '较强' : avg >= 1.5 ? '中等' : '偏弱'
        : avg >= 2.5 ? '偏高' : avg >= 1.5 ? '中等' : '偏低'
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp(avg / 4 * 100),
      display: String(Math.round(avg * 10) / 10) + '/4',
      level,
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}

export function sdsBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = '抑郁症状 · 四类症状群'
  const icon = '🌧️'
  const color = 'var(--symptom)'
  const hint = '按情绪、生理、精神运动与心理四类分组查看症状侧重。'
  ;['affective', 'somatic', 'psychomotor', 'psychological'].forEach((k) => {
    const d = (s[k] || {}) as any
    const avg = Number(d.avg) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp(avg / 4 * 100),
      display: String(Math.round(avg * 100) / 100) + '/4',
      level: avg >= 2.5 ? '较明显' : '正常范围',
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}

export function sasBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = '焦虑 · 生理 / 心理两维'
  const icon = '💆'
  const color = 'var(--symptom)'
  const hint = '拆分躯体紧张与精神忧虑两个侧面，了解焦虑主要表现。'
  ;['somatic', 'psychic'].forEach((k) => {
    const d = (s[k] || {}) as any
    const avg = Number(d.avg) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp(avg / 4 * 100),
      display: String(Math.round(avg * 100) / 100) + '/4',
      level: avg >= 2.5 ? '较明显' : '正常范围',
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}

export function asrmBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = '躁狂症状 · 五项剖面'
  const icon = '⚡'
  const color = 'var(--symptom)'
  const hint = '过去一周五项躁狂相关表现，各 0-4 分。'
  ;['happy', 'confidence', 'sleep', 'talk', 'activity'].forEach((k) => {
    const d = (s[k] || {}) as any
    const sc = Number(d.score) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp(sc / 4 * 100),
      display: String(sc) + '/4',
      level: sc >= 3 ? '明显' : sc >= 2 ? '中等' : '轻微',
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}

export function des2Builder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'DES-II · 解离子量表'
  const icon = '🌀'
  const color = 'var(--symptom)'
  const hint = '三子量表（各自题目均值 0-100，覆盖全部 28 题）；记忆缺失与人格/现实解体偏高更提示病理性解离，吸收沉浸单独偏高常属正常沉浸。分量表没有独立常模，只宜作本次作答内部的相对比较。'
  const des2Order = ['amnesia', 'dpdr', 'absorption']
  des2Order.forEach((k) => {
    const d = (s[k] || {}) as any
    const sc = Number(d.score) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp(sc),
      display: sc.toFixed(1) + '%',
      level: (d.level as string) || '',
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}

export function sdq20Builder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'SDQ-20 · 总分与 SDQ-5 简版'
  const icon = '🧩'
  const color = 'var(--symptom)'
  const hint = '单维度量表测量躯体解离整体严重程度；SDQ-5 简版（4/8/13/15/18 题）用于快速筛查。'
  const sOrder = ['total', 'sdq5']
  sOrder.forEach((k) => {
    const d = (s[k] || {}) as any
    const sc = Number(d.score) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp((sc / (d.max || 100)) * 100),
      display: d.max ? String(sc) + '/' + d.max : String(sc),
      level: (d.level as string) || '',
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}

export function ybocsBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'Y-BOCS · 强迫思维与强迫行为'
  const icon = '🔁'
  const color = 'var(--symptom)'
  const hint = '两子量表各 5 题（0-20）：强迫思维为侵入性反复想法，强迫行为为反复检查/洗涤/计数等仪式。总分 0-40。'
  const yOrder = ['obsessions', 'compulsions']
  yOrder.forEach((k) => {
    const d = (s[k] || {}) as any
    const sc = Number(d.score) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp((sc / (d.max || 20)) * 100),
      display: String(sc) + '/' + d.max,
      level: (d.level as string) || '',
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}

export function ocirBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'OCI-R · 强迫症状六维度'
  const icon = '🧩'
  const color = 'var(--symptom)'
  const hint = '六个 3 题子量表（各 0-12，0-4 分/题）。按 DSM-5，囤积与其余 5 个 OCD 维度分开解读。'
  const oOrder = ['washing', 'checking', 'ordering', 'obsessing', 'neutralizing', 'hoarding']
  oOrder.forEach((k) => {
    const d = (s[k] || {}) as any
    const sc = Number(d.score) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp((sc / (d.max || 12)) * 100),
      display: String(sc) + '/' + d.max,
      level: (d.level as string) || '',
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}

export function ptsdBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = '创伤后应激严重度（PTSD）'
  const icon = '🫀'
  const color = 'var(--symptom)'
  const hint = '总分 0-36（9 题，0-4 分/题），按平均分 0-4 定档：<0.5 无/亚临床、<1.5 轻度、<2.5 中度、<3.5 重度、≥3.5 极重度。'
  const total = (s.total || {}) as any
  const sc = Number(total.score) || 0
  items.push({
    key: 'total',
    name: (total.name as string) || '总分',
    value: clamp((sc / (total.max || 36)) * 100),
    display: String(sc) + '/' + total.max,
    level: (total.level as string) || '',
    desc: (total.desc as string) || '',
  })
  return { title, icon, color, hint, items }
}

export function panicBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = '惊恐障碍严重度'
  const icon = '💥'
  const color = 'var(--symptom)'
  const hint = '总分 0-40（10 题，0-4 分/题），按平均分 0-4 定档严重度。'
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
  return { title, icon, color, hint, items }
}

export function socialBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = '社交焦虑障碍严重度'
  const icon = '🗣️'
  const color = 'var(--symptom)'
  const hint = '总分 0-40（10 题，0-4 分/题），按平均分 0-4 定档严重度。'
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
  return { title, icon, color, hint, items }
}

export function phobiaBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = '特定恐怖症严重度'
  const icon = '😨'
  const color = 'var(--symptom)'
  const hint = '总分 0-40（10 题，0-4 分/题），按平均分 0-4 定档严重度。'
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
  return { title, icon, color, hint, items }
}

export function agoraBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = '广场恐怖严重度'
  const icon = '🚇'
  const color = 'var(--symptom)'
  const hint = '总分 0-40（10 题，0-4 分/题），按平均分 0-4 定档严重度。'
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
  return { title, icon, color, hint, items }
}

export function sepanxBuilder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = '分离焦虑障碍严重度'
  const icon = '🔗'
  const color = 'var(--symptom)'
  const hint = '总分 0-40（10 题，0-4 分/题），按平均分 0-4 定档严重度。'
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
  return { title, icon, color, hint, items }
}

export function mid60Builder(s: any): Partial<DimensionConfig> {
  const items: DimensionItem[] = []
  const title = 'MID-60 · 解离子量表剖面'
  const icon = '🌀'
  const color = 'var(--symptom)'
  const hint = '12 个相关子量表（均值×10，0-100%），各自与参考临界值（%）对照；超线提示值得进一步留意。'
  const order = ['amnesia', 'alter', 'angry', 'persec', 'dpdr', 'memory-distress', 'autobio', 'flashback', 'fns', 'pnes', 'trance', 'identity']
  order.forEach((k) => {
    const d = (s[k] || {}) as any
    const sc = Number(d.score) || 0
    items.push({
      key: k,
      name: (d.name as string) || k,
      value: clamp(sc),
      display: sc.toFixed(1) + '%',
      level: d.above ? '超参考线' : '',
      desc: (d.desc as string) || '',
    })
  })
  return { title, icon, color, hint, items }
}

export function phq9Builder(s: any): Partial<DimensionConfig> {
  const title = '关键症状'
  const icon = '🔍'
  const color = 'var(--primary)'
  const hint = '你最明显的症状 / 表现及其出现频次。'
  const h = (s.highlight || {}) as any
  const highlightCard = {
    label: (h.label as string) || '—',
    freq: (h.freq as string) || '—',
    endorsedCount: Number(h.endorsedCount) || 0,
  }
  return { title, icon, color, hint, highlightCard }
}

export function gad7Builder(s: any): Partial<DimensionConfig> {
  const title = '主要担忧 / 紧张表现'
  const icon = '🔍'
  const color = 'var(--primary)'
  const hint = '你最明显的症状 / 表现及其出现频次。'
  const h = (s.highlight || {}) as any
  const highlightCard = {
    label: (h.label as string) || '—',
    freq: (h.freq as string) || '—',
    endorsedCount: Number(h.endorsedCount) || 0,
  }
  return { title, icon, color, hint, highlightCard }
}
