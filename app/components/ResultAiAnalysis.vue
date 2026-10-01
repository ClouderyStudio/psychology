<template>
  <div class="rounded-lg p-6 mb-6" :style="{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }">
    <!-- 标题与操作按钮：导出图片时只保留分析正文，交互控件都标了 export-ignore -->
    <div class="flex items-center justify-between gap-3 flex-wrap mb-3">
      <h3 class="font-bold text-lg flex items-center flex-wrap gap-2" style="color: var(--text);">
        <span class="text-2xl">🤖</span>
        <span>AI 结果分析</span>
        <span v-if="engineLabel" class="text-xs px-2 py-0.5 rounded-full font-medium" :style="engineTone">
          {{ engineLabel }}
        </span>
      </h3>
      <button class="export-ignore px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="loading"
        :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
        @mouseenter="setButtonBg($event, 'var(--primary-dark)')"
        @mouseleave="setButtonBg($event, 'var(--primary)')"
        @click="generate()">
        {{ loading ? '分析中…' : loaded ? '重新生成' : '生成分析' }}
      </button>
    </div>

    <p v-if="loading && !sections.length" class="text-sm py-1" style="color: var(--text-secondary);">
      正在结合你的量表结果生成分析，请稍候…
    </p>

    <p v-else-if="error" class="text-sm py-1" style="color: var(--warning-text);">{{ error }}</p>

    <ol v-else-if="sections.length" class="space-y-3">
      <li v-for="(section, i) in sections" :key="i" class="flex gap-3">
        <span class="flex-shrink-0 w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center"
          :style="{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }">{{ i + 1 }}</span>
        <p class="text-sm leading-relaxed whitespace-pre-line" style="color: var(--text-secondary);">{{ section }}</p>
      </li>
    </ol>

    <p v-else class="text-sm" style="color: var(--text-muted);">
      暂时还没有分析结果，可以点右上角「生成分析」重试。
    </p>

    <!-- 隐私选择：备注默认不发送，勾选后要重新生成才会生效 -->
    <div class="export-ignore mt-4 pt-4" style="border-top: 1px solid var(--border);">
      <label class="flex items-start gap-2 text-xs cursor-pointer" style="color: var(--text-secondary);">
        <input v-model="shareNote" type="checkbox" class="mt-0.5" :disabled="loading" />
        <span>把这则备注也交给 AI 一起分析（默认不发送；勾选后需点「重新生成」才会生效）</span>
      </label>
      <p v-if="shareNote && notePreview" class="text-xs mt-2" style="color: var(--text-muted);">
        将发送：{{ notePreview }}
      </p>
      <p v-else-if="shareNote" class="text-xs mt-2" style="color: var(--text-muted);">当前还没有备注内容。</p>
    </div>

    <p class="text-xs mt-3 leading-relaxed" style="color: var(--text-muted);">
      分析由 AI 依据本次的量表分数、等级与维度信息自动生成{{ shareNote ? '（含你的备注）' : '' }}，
      仅供自我参考，不能替代专业诊断。{{ engineHint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { AiAnalysisPayload } from '~/utils/ai-analysis'
import {
  analysisEngineLabel,
  buildAnalysisRequest,
  shouldRefreshAnalysis,
  splitAnalysisSections,
} from '~/utils/ai-analysis'

const props = defineProps<{
  result: any
  /** SIOSS 等正式量表判定的高风险标记，由结果页传入 */
  risk?: boolean
  /** 量表分类（symptom / special / personality …），来自 /api/tests/list */
  category?: string
  /** 评估时间范围，来自 /api/tests/list */
  timeFrame?: string
}>()

const emit = defineEmits<{
  saved: [payload: AiAnalysisPayload]
}>()

const config = useRuntimeConfig()
const apiBase = (config.public.clouderyApiBase as string) || 'https://localhost:7288'

const payload = ref<AiAnalysisPayload | null>(null)
const loading = ref(false)
const error = ref('')
// 备注是否随分析一起发送：默认不勾，用户的隐私选择不能靠默认值替它做
const shareNote = ref(false)

const sections = computed(() => splitAnalysisSections(payload.value?.analysis || ''))
const loaded = computed(() => !!payload.value?.analysis)
const engineLabel = computed(() => (loaded.value ? analysisEngineLabel(payload.value?.engine) : ''))
const engineTone = computed(() =>
  payload.value?.engine === 'llm'
    ? { backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }
    : { backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)' },
)
const engineHint = computed(() =>
  payload.value && payload.value.engine !== 'llm' ? '（AI 模型当前不可用，本次内容由服务端按规则生成。）' : '',
)

const notePreview = computed(() => {
  const note = String(props.result?.note || '').trim()
  if (!note) return ''
  return note.length > 60 ? note.slice(0, 60) + '…' : note
})

async function generate() {
  if (loading.value) return
  const body = buildAnalysisRequest(props.result, {
    includeNote: shareNote.value,
    risk: props.risk === true,
    category: props.category,
    timeFrame: props.timeFrame,
  })
  if (!body) {
    error.value = '缺少量表信息，暂时无法生成分析。'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<AiAnalysisPayload>(apiBase + '/exam/result-analysis', { method: 'POST', body })
    if (!res?.analysis) throw new Error('分析结果为空')
    payload.value = res
    emit('saved', res)
  } catch (e: any) {
    const status = e?.response?.status ?? e?.statusCode ?? e?.status
    error.value = status === 429 ? '生成得太频繁了，请过几分钟再试。' : '分析生成失败，请检查网络后重试。'
    console.error('AI 结果分析失败', e)
  } finally {
    loading.value = false
  }
}

const setButtonBg = (event: Event, color: string) => {
  const target = event.currentTarget
  if (target instanceof HTMLElement) target.style.backgroundColor = color
}

// 结果记录里缓存过就直接展示，必要时才请求模型：
// engine 为 llm 的一直复用，本地兜底文本超过 TTL 才自动重试一次。
onMounted(() => {
  const cached = props.result?.aiAnalysis
  if (cached?.analysis) payload.value = cached as AiAnalysisPayload
  if (shouldRefreshAnalysis(cached)) generate()
})
</script>

<style scoped>
</style>
