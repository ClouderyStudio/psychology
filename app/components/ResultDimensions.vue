<template>
  <div class="rounded-lg p-5" style="background-color: var(--bg);">
    <h3 class="font-bold text-lg mb-1 flex items-center" style="color: var(--text);">
      <span class="text-2xl mr-2">{{ config.icon }}</span>
      {{ config.title }}
    </h3>
    <p v-if="config.subtitle" class="text-sm mb-4" style="color: var(--warning-text);">{{ config.subtitle }}</p>
    <p v-else class="text-sm mb-4" style="color: var(--text-muted);">{{ config.hint }}</p>
    <div class="grid gap-3" :style="{ gridTemplateColumns: config.columns }">
      <div v-for="item in config.items" :key="item.key" class="p-3 rounded-lg" style="background-color: var(--card-bg);">
        <div class="flex items-center justify-between mb-2 gap-2">
          <span class="flex items-center gap-2 font-semibold" style="color: var(--text);">
            <span v-if="item.icon">{{ item.icon }}</span>{{ item.name }}
          </span>
          <span class="text-sm" style="color: var(--text-secondary);">{{ item.display }}</span>
        </div>
        <div class="w-full rounded-full h-2" style="background-color: var(--primary-light);">
          <div class="rounded-full h-2 transition-all duration-500" :style="{ width: item.value + '%', backgroundColor: config.color }"></div>
        </div>
        <div v-if="item.level" class="mt-2 flex items-center gap-2">
          <span class="text-xs px-2 py-0.5 rounded-full" :style="{ backgroundColor: 'var(--primary-light)', color: config.color }">{{ item.level }}</span>
        </div>
        <p v-if="item.desc" class="text-xs mt-2" style="color: var(--text-muted);">{{ item.desc }}</p>
      </div>
    </div>
    <div v-if="config.highlightCard" class="mt-4 p-4 rounded-lg" style="background-color: var(--primary-light);">
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <div class="text-xs" style="color: var(--text-muted);">最明显的症状 / 表现</div>
          <div class="font-semibold mt-1" style="color: var(--text);">🔴 {{ config.highlightCard.label }}</div>
          <div class="text-sm mt-1" style="color: var(--primary);">出现频次：{{ config.highlightCard.freq }}</div>
        </div>
        <div>
          <div class="text-xs" style="color: var(--text-muted);">达到“几天以上”的症状数</div>
          <div class="font-semibold mt-1" style="color: var(--text);">{{ config.highlightCard.endorsedCount }} 项</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ scores: any; testId: string }>()

const clamp = (v: any) => Math.max(0, Math.min(100, Number(v) || 0))

const n16: Record<string, string> = {
  A: '乐群性', B: '聪慧性', C: '稳定性', E: '恃强性', F: '兴奋性',
  G: '有恒性', H: '敢为性', I: '敏感性', L: '怀疑性', M: '幻想性',
  N: '世故性', O: '忧虑性', Q1: '实验性', Q2: '独立性', Q3: '自律性', Q4: '紧张性',
}
const sixteenOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4']

const tempMeta: Record<string, { name: string; icon: string }> = {
  choleric: { name: '胆汁质', icon: '🔥' },
  sanguine: { name: '多血质', icon: '💧' },
  phlegmatic: { name: '粘液质', icon: '🌱' },
  melancholic: { name: '抑郁质', icon: '🌙' },
}

const bpnsMeta: Record<string, string> = {
  autonomy: '自主需求', competence: '胜任需求', relatedness: '归属需求',
}

const config = computed(() => {
  const s = props.scores || {}
  const items: any[] = []
  let title = '', icon = '📊', color = 'var(--primary)', hint = '', subtitle = '', columns = 'repeat(auto-fill, minmax(240px, 1fr))'
  let highlightCard: any = null

  if (props.testId === 'epq' || props.testId === 'epq-rsc') {
    title = props.testId === 'epq' ? '艾森克人格 (EPQ) · 维度剖面' : '艾森克人格 (EPQ-RSC) · 维度剖面'
    icon = '🧠'
    color = 'var(--personality)'
    hint = '四个维度以 T 标准分（常模中位 50）呈现，分数越高该特质越突出。'
    ;['E', 'N', 'P', 'L'].forEach((k) => {
      const d = (s[k] || {}) as any
      items.push({
        key: k,
        name: (d.name as string) || k,
        value: clamp(d.tScore),
        display: Math.round(Number(d.tScore) || 0) + ' T',
        desc: (d.highDesc || d.desc || d.validity || '') as string,
      })
    })
  } else if (props.testId === 'temperament') {
    title = '气质类型 · 四维倾向'
    icon = '🎭'
    color = 'var(--special)'
    hint = '四条倾向的浓度对比，浓度最高者即你的主要气质类型。'
    ;['choleric', 'sanguine', 'phlegmatic', 'melancholic'].forEach((k) => {
      const d = (s[k] || {}) as any
      const meta = tempMeta[k] || { name: k, icon: '' }
      items.push({
        key: k,
        name: (d.name as string) || meta.name,
        icon: (d.icon as string) || meta.icon,
        value: clamp(((Number(d.score) || 0) + 30) / 60 * 100),
        display: String(d.score ?? 0),
        desc: (d.desc as string) || '',
      })
    })
  } else if (props.testId === 'bpns') {
    title = '基本心理需求满足度'
    icon = '🤝'
    color = 'var(--primary)'
    hint = '三项基本心理需求（自主、胜任、归属）的满足程度，满分 7 分。'
    ;['autonomy', 'competence', 'relatedness'].forEach((k) => {
      const d = (s[k] || {}) as any
      items.push({
        key: k,
        name: (bpnsMeta[k] as string) || k,
        value: clamp((Number(d.score) || 0) / 7 * 100),
        display: String(d.score ?? 0) + '/7',
        level: (d.level as string) || '',
        desc: (d.desc as string) || '',
      })
    })
  } else if (props.testId === 'ipip-eis') {
    title = '情绪智力 (IPIP-EIS) · 维度剖面'
    icon = '💡'
    color = 'var(--personality)'
    hint = '七个情绪智力维度的自评平均分（满分 5 分）。'
    const dims = (s.dimensions as any) || {}
    Object.keys(dims).forEach((k) => {
      const d = (dims[k] || {}) as any
      items.push({
        key: k,
        name: (d.name as string) || k,
        value: clamp((Number(d.score) || 0) / 5 * 100),
        display: String(d.score ?? 0) + '/5',
        desc: (d.desc as string) || '',
      })
    })
    if (s.isValid === false) subtitle = '⚠️ 测谎题均分 ' + s.lieScore + '，本次结果可能受答题态度影响，建议重新认真作答。'
  } else if (props.testId === 'sixteenPF') {
    title = '16PF 人格因素剖面'
    icon = '🧬'
    color = 'var(--personality)'
    hint = '十六项人格因素以 1–10 标准分呈现，其中 4–7 为常见区间。'
    columns = 'repeat(auto-fill, minmax(200px, 1fr))'
    const f = (s.factors as any) || {}
    sixteenOrder.forEach((k) => {
      const d = Number(f[k]) || 5
      items.push({
        key: k,
        name: (n16[k] as string) || k,
        value: clamp(((d - 1) / 9) * 100),
        display: Math.round(d) + '分',
      })
    })
  } else if (props.testId === 'sccs') {
    title = '自我和谐 · 维度剖面'
    icon = '🪞'
    color = 'var(--special)'
    hint = '不和谐越低、灵活性越高、刻板性越低，自我越和谐。'
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
  } else if (props.testId === 'sioss') {
    title = 'SIOSS · 因子剖面'
    icon = '🆘'
    color = 'var(--symptom)'
    hint = '绝望感与乐观感缺乏得分越高风险越高；题 11/17/22/26 中的任一条目被肯定回答都将视为危险信号。'
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
  } else if (props.testId === 'bis') {
    title = 'BIS-11 · 三维冲动剖面'
    icon = '⚡'
    color = 'var(--personality)'
    hint = '注意力冲动 / 运动冲动 / 无计划冲动，每维 10 题。含反向计分题，各维度实际可达区间不同（已逐项标注），条形长度按该区间内的相对位置绘制。'
    const bisNames: Record<string, string> = {
      attention: '注意力冲动',
      motor: '运动冲动',
      nonplanning: '无计划冲动',
    }
    ;['attention', 'motor', 'nonplanning'].forEach((k) => {
      const d = (s[k] || {}) as any
      const sc = Number(d.score) || 0
      const lo = Number(d.min) || 0
      const hi = Number(d.max) || 50
      const pos = hi > lo ? (sc - lo) / (hi - lo) : 0
      items.push({
        key: k,
        name: bisNames[k] || k,
        value: clamp(pos * 100),
        display: String(sc) + ' / ' + hi,
        level: pos >= 0.75 ? '较高' : pos >= 0.5 ? '中等偏高' : pos >= 0.25 ? '中等偏低' : '较低',
        desc: '该维度可达区间 ' + lo + '–' + hi + '（含反向计分题）',
      })
    })
  } else if (props.testId === 'bpaq') {
    title = 'BPAQ · 四维攻击剖面'
    icon = '💢'
    color = 'var(--symptom)'
    hint = '身体 / 言语攻击、愤怒、敌意四维（各维分数与满分并列展示）。'
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
  } else if (props.testId === 'pss') {
    title = '压力维度 · 不可控感 / 掌控感'
    icon = '🧘'
    color = 'var(--symptom)'
    hint = '每项 0-4 均值。两个维度方向相反：不可控感越高越易累积压力，掌控感越高则抗压越强，不能横向比大小。'
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
  } else if (props.testId === 'sds') {
    title = '抑郁症状 · 四类症状群'
    icon = '🌧️'
    color = 'var(--symptom)'
    hint = '按情绪、生理、精神运动与心理四类分组查看症状侧重。'
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
  } else if (props.testId === 'sas') {
    title = '焦虑 · 生理 / 心理两维'
    icon = '💆'
    color = 'var(--symptom)'
    hint = '拆分躯体紧张与精神忧虑两个侧面，了解焦虑主要表现。'
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
  } else if (props.testId === 'rses') {
    title = '自尊 · 双因子剖面'
    icon = '✨'
    color = 'var(--special)'
    hint = '自我胜任感与自我接纳（喜欢）两个因子，各 1-4 均值。'
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
  } else if (props.testId === 'asrm') {
    title = '躁狂症状 · 五项剖面'
    icon = '⚡'
    color = 'var(--symptom)'
    hint = '过去一周五项躁狂相关表现，各 0-4 分。'
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
  } else if (props.testId === 'des2') {
    title = 'DES-II · 解离子量表'
    icon = '🌀'
    color = 'var(--symptom)'
    hint = '三子量表（各 6 题均值，0-100）；记忆缺失与人格/现实解体偏高更提示病理性解离，吸收沉浸单独偏高常属正常沉浸。'
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
  }
  else if (props.testId === 'sdq20') {
    title = 'SDQ-20 · 总分与 SDQ-5 简版'
    icon = '🧩'
    color = 'var(--symptom)'
    hint = '单维度量表测量躯体解离整体严重程度；SDQ-5 简版（4/8/13/15/18 题）用于快速筛查。'
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
  }
  else if (props.testId === 'ybocs') {
    title = 'Y-BOCS · 强迫思维与强迫行为'
    icon = '🔁'
    color = 'var(--symptom)'
    hint = '两子量表各 5 题（0-20）：强迫思维为侵入性反复想法，强迫行为为反复检查/洗涤/计数等仪式。总分 0-40。'
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
  }

  else if (props.testId === 'ocir') {
    title = 'OCI-R · 强迫症状六维度'
    icon = '🧩'
    color = 'var(--symptom)'
    hint = '六个 3 题子量表（各 0-12，0-4 分/题）。按 DSM-5，囤积与其余 5 个 OCD 维度分开解读。'
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
  }

  else if (props.testId === 'ptsd') {
    title = '创伤后应激严重度（PTSD）'
    icon = '🫀'
    color = 'var(--symptom)'
    hint = '总分 0-36（9 题，0-4 分/题），按平均分 0-4 定档：<0.5 无/亚临床、<1.5 轻度、<2.5 中度、<3.5 重度、≥3.5 极重度。'
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
  }

  else if (props.testId === 'panic') {
    title = '惊恐障碍严重度'
    icon = '💥'
    color = 'var(--symptom)'
    hint = '总分 0-40（10 题，0-4 分/题），按平均分 0-4 定档严重度。'
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
  }

  else if (props.testId === 'social') {
    title = '社交焦虑障碍严重度'
    icon = '🗣️'
    color = 'var(--symptom)'
    hint = '总分 0-40（10 题，0-4 分/题），按平均分 0-4 定档严重度。'
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
  }

  else if (props.testId === 'phobia') {
    title = '特定恐怖症严重度'
    icon = '😨'
    color = 'var(--symptom)'
    hint = '总分 0-40（10 题，0-4 分/题），按平均分 0-4 定档严重度。'
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
  }

  else if (props.testId === 'agora') {
    title = '广场恐怖严重度'
    icon = '🚇'
    color = 'var(--symptom)'
    hint = '总分 0-40（10 题，0-4 分/题），按平均分 0-4 定档严重度。'
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
  }

  else if (props.testId === 'sepanx') {
    title = '分离焦虑障碍严重度'
    icon = '🔗'
    color = 'var(--symptom)'
    hint = '总分 0-40（10 题，0-4 分/题），按平均分 0-4 定档严重度。'
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
  }

  else if (props.testId === 'mid60') {
    title = 'MID-60 · 解离子量表剖面'
    icon = '🌀'
    color = 'var(--symptom)'
    hint = '12 个相关子量表（均值×10，0-100%），各自与参考临界值（%）对照；超线提示值得进一步留意。'
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
  }
  else if (props.testId === 'phq9' || props.testId === 'gad7') {
    const h = (s.highlight || {}) as any
    title = props.testId === 'phq9' ? '关键症状' : '主要担忧 / 紧张表现'
    icon = '🔍'
    color = 'var(--primary)'
    hint = '你最明显的症状 / 表现及其出现频次。'
    highlightCard = {
      label: (h.label as string) || '—',
      freq: (h.freq as string) || '—',
      endorsedCount: Number(h.endorsedCount) || 0,
    }
  }
  return { title, icon, color, hint, subtitle, items, columns, highlightCard }
})
</script>

<style scoped>
</style>
