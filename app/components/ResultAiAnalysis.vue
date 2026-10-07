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
      <button v-if="showButton" class="export-ignore px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="loading"
        :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
        @mouseenter="setButtonBg($event, 'var(--primary-dark)')"
        @mouseleave="setButtonBg($event, 'var(--primary)')"
        @click="generate()">
        {{ loading ? '分析中…' : loaded ? '重新生成' : '生成分析' }}
      </button>
    </div>

    <!-- 首次使用：先说清楚会把什么发出去，再由用户自己决定是否开始 -->
    <div v-if="showGate" class="export-ignore rounded-lg p-4" style="background-color: var(--primary-light);">
      <p class="text-sm font-semibold mb-2" style="color: var(--text);">
        这段解读需要你主动开启
      </p>
      <ul class="text-sm space-y-1 leading-relaxed mb-3" style="color: var(--text-secondary);">
        <li>
          • 点「我已了解，开始分析」后，会把本次的<b>分数、等级、维度与画像</b>信息发送到
          ClouderyApi，再由服务端调用大模型生成解读。
        </li>
        <li>• 这个确认是<b>按量表分别记的</b>：换一个量表会再问一次，同一个量表内不会反复问。</li>
        <li>• <b>你写的备注默认不发送</b>，只有你主动勾选「把备注也交给 AI」时才会一起发送。</li>
        <li>• 不点这个按钮，相关数据不会离开这台设备；分数、等级与建议在页面上照常可看。</li>
        <li>• 解读由 AI 生成，仅供自我参考，不能替代专业诊断。</li>
      </ul>
      <div class="flex flex-wrap gap-3">
        <button class="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loading"
          :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
          @mouseenter="setButtonBg($event, 'var(--primary-dark)')"
          @mouseleave="setButtonBg($event, 'var(--primary)')"
          @click="generate()">
          {{ loading ? '分析中…' : '我已了解，开始分析' }}
        </button>
        <button class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style="color: var(--text-secondary); border: 1px solid var(--border);"
          @click="gateDismissed = true">
          暂不需要
        </button>
      </div>
    </div>

    <!-- 选择「暂不需要」后留一句提醒，不把提示彻底拿走 -->
    <p v-else-if="gateDismissed && !consentGiven && !loading"
      class="export-ignore text-xs leading-relaxed" style="color: var(--text-muted);">
      已跳过 AI 分析。需要时可以点右上角「生成分析」，届时会把本次的分数、等级与维度发送给大模型。
    </p>

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
    <div v-if="showButton" class="export-ignore mt-4 pt-4" style="border-top: 1px solid var(--border);">
      <label class="flex items-start gap-2 text-xs cursor-pointer" style="color: var(--text-secondary);">
        <input v-model="shareNote" type="checkbox" class="mt-0.5" :disabled="loading" />
        <span>把本页的备注也交给 AI 一起分析（默认不发送；勾选后需点「重新生成」才会生效）</span>
      </label>
      <p v-if="shareNote && notePreview" class="text-xs mt-2" style="color: var(--text-muted);">
        将发送：{{ notePreview }}
      </p>
      <p v-else-if="shareNote" class="text-xs mt-2" style="color: var(--text-muted);">当前还没有备注内容。</p>
    </div>

    <p class="text-xs mt-3 leading-relaxed" style="color: var(--text-muted);">
      分析由 AI 依据本次的量表分数、等级与维度信息生成{{ shareNote ? '（含你的备注）' : '' }}，
      仅供自我参考，不能替代专业诊断。{{ engineHint }}{{ cacheStaleHint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { AiAnalysisPayload } from '~/utils/ai-analysis'
import {
  analysisEngineLabel,
  buildAnalysisRequest,
  hasAiAnalysisConsent,
  rememberAiAnalysisConsent,
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
// 是否已就「把这个量表的分数发给模型」点头过。在 onMounted 里读，避免 SSR 与水合不一致
const consentGiven = ref(false)
// 这次访问里选了「暂不需要」：只影响本次展示，不写进本机存储
const gateDismissed = ref(false)

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

// 当前看的是哪一份结果：同一个组件实例可能被复用来展示另一个量表 / 另一条历史记录，
// 所以 testId 与时间戳一起当身份，变了就把上一个量表的解读和提示状态清干净。
const resultKey = computed(() => {
  const testId = String(props.result?.testId || '').trim()
  const at = props.result?.timestamp ?? ''
  return testId ? testId + '|' + at : ''
})

// 同意是按量表记的：在 PHQ-9 上点过「我已了解」，不代表 MBTI 也同意，换个量表要重新问。
const consentKey = computed(() => String(props.result?.testId || '').trim())
watch(resultKey, () => {
  gateDismissed.value = false
  consentGiven.value = consentKey.value ? hasAiAnalysisConsent(consentKey.value) : false
  // 本机已有解读就直接展示：内容已经在设备上了，不存在新的发送
  const cached = props.result?.aiAnalysis
  payload.value = cached?.analysis ? (cached as AiAnalysisPayload) : null
  error.value = ''
})

// 首次使用必须先看到提示：没同意、没跳过、也没现成解读时，连「生成」按钮都不给
const showGate = computed(() => !consentGiven.value && !gateDismissed.value && !loaded.value && !loading.value)
const showButton = computed(() => loaded.value || consentGiven.value || gateDismissed.value)

// 本机已存的兜底文本过期了：只提示，不自动重试（重试同样要花模型额度）
const cacheStale = computed(() => {
  const cached = props.result?.aiAnalysis
  return !!cached?.analysis && shouldRefreshAnalysis(cached)
})
const cacheStaleHint = computed(() => (cacheStale.value ? '本机存的这段是较早的本地兜底内容，可点「重新生成」再试一次模型。' : ''))

const notePreview = computed(() => {
  const note = String(props.result?.note || '').trim()
  if (!note) return ''
  return note.length > 60 ? note.slice(0, 60) + '…' : note
})

async function generate() {
  if (loading.value) return
  // 只有用户主动点按钮才会走到这里：这一步即视为对「这个量表分数上云」的同意
  rememberAiAnalysisConsent(consentKey.value)
  consentGiven.value = true

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

// 进入结果页只做一件事：把本机存档里已有的解读显示出来。
// 不再自动请求模型 —— 凡是会离开设备的请求，都由用户点按钮触发。
onMounted(() => {
  // 同意按量表读：没同意过或换了量表，就重新走一次提示
  consentGiven.value = consentKey.value ? hasAiAnalysisConsent(consentKey.value) : false
  const cached = props.result?.aiAnalysis
  if (cached?.analysis) payload.value = cached as AiAnalysisPayload
})
</script>

<style scoped>
</style>
