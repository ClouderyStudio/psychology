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
    ;['disharmony', 'flexibility', 'rigidity'].forEach((k) => {
      const d = (s[k] || {}) as any
      items.push({
        key: k,
        name: (d.name as string) || k,
        value: clamp((Number(d.avg) || 0) / 5 * 100),
        display: String(Math.round((Number(d.avg) || 0) * 100) / 100) + '/5',
        level: (Number(d.avg) || 0) >= 4 ? '偏高' : (Number(d.avg) || 0) >= 2.5 ? '中等' : '偏低',
        desc: (d.desc as string) || '',
      })
    })
    if (s.harmonyIndex != null) subtitle = '综合自我和谐指数 ' + Number(s.harmonyIndex).toFixed(2) + ' / 5.00 → ' + (s.harmonyLevel || '')
  } else if (props.testId === 'pss') {
    title = '压力维度 · 不可控感 / 掌控感'
    icon = '🧘'
    color = 'var(--symptom)'
    hint = '每项 0-4 均值：不可控感越高越易累积压力，掌控感越高则抗压越强。'
    ;['helplessness', 'selfEfficacy'].forEach((k) => {
      const d = (s[k] || {}) as any
      const avg = Number(d.avg) || 0
      items.push({
        key: k,
        name: (d.name as string) || k,
        value: clamp(avg / 4 * 100),
        display: String(Math.round(avg * 10) / 10) + '/4',
        level: avg >= 2.5 ? '偏高' : avg >= 1.5 ? '中等' : '偏低',
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
  } else if (props.testId === 'phq9' || props.testId === 'gad7') {
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
