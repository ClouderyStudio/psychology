<template>
  <div class="space-y-4">
    <!-- 16PF：当前人格画像 + 全因子特征/有利/不利/建议 -->
    <template v-if="testId === 'sixteenPF'">
      <div class="rounded-lg p-5" style="background-color: var(--bg);">
        <h3 class="font-bold text-lg mb-1 flex items-center" style="color: var(--text);">
          <span class="text-2xl mr-2">🧬</span> 你当前的 16PF 人格画像
        </h3>
        <p class="text-sm mb-4" style="color: var(--text-muted);">以 1-10 分为准：1-3 分偏向低分特征，4-7 分为中间，8-10 分偏向高分特征。分数偏高的因素已默认展开，点击任意一项可展开/收起细则。</p>
        <div v-if="topChips.length" class="mb-4 flex flex-wrap gap-2">
          <span v-for="c in topChips" :key="c.key" class="text-xs px-3 py-1 rounded-full font-semibold"
            style="background-color: var(--primary-light); color: var(--primary);">{{ c.name }} {{ c.score }}分</span>
        </div>
        <div class="space-y-2">
          <details v-for="f in factorCards" :key="f.key" :open="f.open" class="rounded-lg overflow-hidden" style="background-color: var(--card-bg);">
            <summary class="px-4 py-3 cursor-pointer select-none flex items-center justify-between gap-2" style="color: var(--text);">
              <span class="flex items-center gap-2 font-semibold"><span class="w-6 text-center text-xs" style="color: var(--primary);">{{ f.key }}</span>{{ f.name }}</span>
              <span class="text-sm" style="color: var(--text-secondary);">
                <span class="px-2 py-0.5 rounded-full text-xs" :style="pillStyle(f)">{{ f.poleLabel }}</span>{{ f.score }}分
              </span>
            </summary>
            <div class="px-4 pb-4 text-sm space-y-3">
              <div>
                <div class="font-semibold mb-1" style="color: var(--primary);">特征</div>
                <p style="color: var(--text-secondary);">{{ f.poleData.t }}</p>
                <p v-if="f.pole === 'mid'" class="mt-1" style="color: var(--text-muted);">中间倾向：{{ f.unit.low.t }} / {{ f.unit.high.t }}</p>
              </div>
              <div class="grid sm:grid-cols-2 gap-3">
                <div class="p-3 rounded-lg" style="background-color: var(--bg);">
                  <div class="font-semibold mb-1" style="color: var(--special);">✅ 有利 / 适合</div>
                  <p style="color: var(--text-secondary);">{{ f.poleData.good }}</p>
                </div>
                <div class="p-3 rounded-lg" style="background-color: var(--bg);">
                  <div class="font-semibold mb-1" style="color: var(--symptom);">⚠️ 不利 / 需注意</div>
                  <p style="color: var(--text-secondary);">{{ f.poleData.bad }}</p>
                </div>
              </div>
              <div class="p-3 rounded-lg" style="background-color: var(--primary-light);">
                <div class="font-semibold mb-1" style="color: var(--text);">💡 建议</div>
                <p style="color: var(--text-secondary);">{{ f.poleData.tip }}</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </template>

    <!-- 气质类型：主型详情 + 四型概览 -->
    <template v-else-if="testId === 'temperament'">
      <div class="rounded-lg p-5" style="background-color: var(--bg);">
        <h3 class="font-bold text-lg mb-1 flex items-center" style="color: var(--text);">
          <span class="text-2xl mr-2">🎭</span> 你的气质类型
        </h3>
        <div v-if="domUnit" class="mt-3 p-4 rounded-xl" style="background-color: var(--card-bg);">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-3xl">{{ domUnit.icon }}</span>
            <div>
              <div class="text-xl font-bold" style="color: var(--text);">{{ domUnit.name }}</div>
              <div class="text-sm" style="color: var(--text-secondary);">气质是与生俱来的特征，没有好坏之分。</div>
            </div>
          </div>
          <p class="text-sm leading-relaxed mb-3" style="color: var(--text-secondary);">{{ domUnit.trait }}</p>
          <div class="grid sm:grid-cols-2 gap-3">
            <div class="p-3 rounded-lg" style="background-color: var(--bg);">
              <div class="font-semibold mb-1" style="color: var(--special);">✅ 优势</div>
              <ul class="text-sm space-y-1" style="color: var(--text-secondary);"><li v-for="a in domUnit.adv" :key="a">• {{ a }}</li></ul>
            </div>
            <div class="p-3 rounded-lg" style="background-color: var(--bg);">
              <div class="font-semibold mb-1" style="color: var(--symptom);">⚠️ 劣势</div>
              <ul class="text-sm space-y-1" style="color: var(--text-secondary);"><li v-for="d in domUnit.dis" :key="d">• {{ d }}</li></ul>
            </div>
          </div>
          <div class="mt-3 p-3 rounded-lg" style="background-color: var(--card-bg);">
            <div class="font-semibold mb-1" style="color: var(--text);">💼 适合的方向</div>
            <p class="text-sm" style="color: var(--text-secondary);">{{ domUnit.career }}</p>
          </div>
          <div class="mt-3 p-3 rounded-lg" style="background-color: var(--primary-light);">
            <div class="font-semibold mb-1" style="color: var(--text);">💡 发展建议</div>
            <p class="text-sm" style="color: var(--text-secondary);">{{ domUnit.tip }}</p>
          </div>
        </div>
        <div class="mt-4 grid sm:grid-cols-2 gap-3">
          <div v-for="t in typeList" :key="t.key" class="p-3 rounded-lg" :style="t.key === domKey ? { backgroundColor: 'var(--primary-light)', outline: '1px solid var(--primary)' } : { backgroundColor: 'var(--card-bg)' }">
            <div class="flex items-center gap-2 font-semibold" style="color: var(--text);"><span>{{ t.icon }}</span>{{ t.name }}<span v-if="t.key === domKey" class="text-xs px-2 py-0.5 rounded-full" style="background-color: var(--primary); color: white;">主要</span></div>
            <p class="text-xs mt-1" style="color: var(--text-secondary);">{{ t.trait }}</p>
          </div>
        </div>
      </div>
    </template>

    <!-- EPQ / EPQ-RSC：四维度 高分/低分 解读 -->
    <template v-else>
      <div class="rounded-lg p-5" style="background-color: var(--bg);">
        <h3 class="font-bold text-lg mb-1 flex items-center" style="color: var(--text);">
          <span class="text-2xl mr-2">🧠</span> {{ testId === 'epq-rsc' ? 'EPQ-RSC':'EPQ' }} 四维度解读
        </h3>
        <p class="text-sm mb-4" style="color: var(--text-muted);">四个维度以 T 标准分（常模中位 50）呈现，56 分以上偏高分特征、44 分以下偏低分特征。</p>
        <div class="space-y-2">
          <div v-for="d in epqDims" :key="d.key" class="p-4 rounded-lg" style="background-color: var(--card-bg);">
            <div class="flex items-center justify-between mb-2">
              <span class="font-semibold" style="color: var(--text);">{{ d.key }} · {{ d.name }}</span>
              <span class="text-sm" style="color: var(--text-secondary);">{{ d.tScore }} T</span>
            </div>
            <div class="w-full rounded-full h-2" style="background-color: var(--primary-light);">
              <div class="rounded-full h-2" :style="{ width: d.pct + '%', backgroundColor: 'var(--personality)' }"></div>
            </div>
            <p class="text-sm mt-3" style="color: var(--text-secondary);">{{ d.text }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { sixteenPFInterpret, temperamentInterpret, epqInterpret } from '~/utils/personality-interpret'

const props = defineProps<{ report: any; testId: string }>()

const s = computed(() => props.report?.dimensionScores || {})

const sixteenOrder = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'Q1', 'Q2', 'Q3', 'Q4']

// ---- 16PF ----
const factorCards = computed(() => {
  const factors = (s.value.factors as any) || {}
  return sixteenOrder.map((k) => {
    const unit = (sixteenPFInterpret as any)[k]
    const score = Number(factors[k]) || 5
    const pole = score >= 7 ? 'high' : score <= 4 ? 'low' : 'mid'
    const poleData = (pole === 'high' ? unit.high : pole === 'low' ? unit.low : { t: '', good: '', bad: '', tip: '' }) as any
    return { key: k, name: unit.name, score, pole, poleData, unit, poleLabel: pole === 'high' ? '偏高' : pole === 'low' ? '偏低' : '中间', open: pole === 'high' }
  })
})
const topChips = computed(() => ((s.value.topFactors as any) || []).map((t: any) => ({ key: t.factor, name: t.name, score: t.score })))
const pillStyle = (f: any) => ({
  backgroundColor: f.pole === 'high' ? 'var(--symptom-dark)' : f.pole === 'low' ? 'var(--special)' : 'var(--primary-light)',
  color: f.pole === 'mid' ? 'var(--primary)' : 'white',
})

// ---- 气质 ----
const domKey = computed(() => (s.value.primaryType as string) || '')
const domUnit = computed(() => (temperamentInterpret as any)[domKey.value] || null)
const typeList = computed(() => ['choleric', 'sanguine', 'phlegmatic', 'melancholic'].map((key) => ({ key, ...(temperamentInterpret as any)[key], score: Number((s.value as any)[key]?.score) || 0 })))

// ---- EPQ / EPQ-RSC ----
const epqKeys = ['E', 'N', 'P', 'L']
const epqDims = computed(() => {
  return epqKeys.map((k) => {
    const d = (s.value[k] as any) || {}
    const unit = (epqInterpret as any)[k]
    const tScore = Number(d.tScore) || 50
    const pole = tScore >= 56 ? 'high' : tScore <= 44 ? 'low' : 'mid'
    const text = pole === 'high' ? unit.high : pole === 'low' ? unit.low : unit.high + ' ／ ' + unit.low
    return { key: k, name: unit.name, tScore: Math.round(tScore), pct: Math.round(((tScore - 30) / 40) * 100), text }
  })
})
</script>

<style scoped>
</style>