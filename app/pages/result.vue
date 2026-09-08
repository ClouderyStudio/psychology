<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg);">
    <div class="container mx-auto px-4" :class="isMBTI || isSeven || isPsyAge ? 'max-w-5xl' : 'max-w-3xl'">
      <ClientOnly>
        <div v-if="isLoading" class="text-center py-12">
          <div class="text-2xl" style="color: var(--text-secondary);">加载中...</div>
        </div>

        <div v-else-if="result" class="rounded-2xl overflow-hidden"
          style="background-color: var(--card-bg); box-shadow: var(--shadow-xl);">

          <!-- 结果头部 -->
          <div class="p-8 text-center" :style="{ backgroundColor: getHeaderColor() }">
            <h2 class="text-3xl font-bold mb-2 text-white">测评结果</h2>
            <p class="text-white/90">{{ result.testTitle }}</p>
            <p class="text-sm mt-2 text-white/70">测评时间：{{ formattedTime }}</p>
          </div>

          <!-- SIOSS 正式模式：风险等级横幅 -->
          <div v-if="isFormalTest && siossRisk" class="px-8 pt-6"
            :class="siossRisk.kind === 'danger' ? 'formal-risk-banner formal-risk-banner--danger'
              : siossRisk.kind === 'warn' ? 'formal-risk-banner formal-risk-banner--warn'
              : 'formal-risk-banner formal-risk-banner--ok'">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom: 6px;">
              <span :class="siossRisk.kind === 'danger' ? 'formal-seal formal-seal--danger'
                : siossRisk.kind === 'warn' ? 'formal-seal formal-seal--accent'
                : 'formal-seal formal-seal--ok'">
                {{ siossRisk.kind === 'danger' ? '■ 高风险 ■' : siossRisk.kind === 'warn' ? '■ 警惕 ■' : '■ 提示 ■' }}
              </span>
              <span style="font-size: 13px; letter-spacing: 0.2em; color: var(--formal-muted);">RISK ASSESSMENT · 风险等级</span>
            </div>
            <div class="formal-risk-banner-title">{{ siossRisk.title }}</div>
            <div class="formal-risk-banner-desc">{{ siossRisk.desc }}</div>
            <div class="formal-risk-banner-footer">
              请将这份结果带给专业人员进行评估；如有持续痛苦或出现结束生命的念头，请立即拨打下方危机援助热线。
            </div>
          </div>

          <!-- 分数展示 -->
          <div class="p-8">
            <ResultMbti v-if="isMBTI" :report="mbtiReport" :level="result.level" />
            <ResultPsyAge v-if="isPsyAge" :report="psyAgeReport" />

            <!-- 分数指示器 -->
            <div v-if="canScore" class="text-center mb-8">
              <div class="inline-block relative">
                <svg class="w-48 h-48">
                  <circle cx="96" cy="96" r="88" stroke="var(--primary-light)" stroke-width="12" fill="none" />
                  <circle cx="96" cy="96" r="88" :stroke="severityColor" stroke-width="12" fill="none"
                    :stroke-dasharray="`${circumference} ${circumference}`" :stroke-dashoffset="strokeDashoffset"
                    transform="rotate(-90 96 96)" class="transition-all duration-1000" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-5xl font-bold" style="color: var(--text);">{{ displayScore }}</span>
                  <span style="color: var(--text-muted);">/ {{ result.maxScore }}</span>
                </div>
              </div>
            </div>

            <!-- 等级标签 -->
            <div v-if="!isMBTI && !isSeven && !isPsyAge" class="text-center mb-6">
              <div v-if="!canScore" class="text-2xl font-semibold mb-2" style="color: var(--text);">你的测评结果是:</div>

              <div class="inline-block px-6 py-2 rounded-full text-lg font-semibold" :class="levelColorClass">
                {{ result.level }}
              </div>
            </div>
            <ResultDimensions v-if="enrichedScale" :scores="result.dimensionScores" :test-id="result.testId" />
            <ResultPersonality v-if="isPersonality" :report="result" :test-id="result.testId" />

            <ResultSeven v-if="isSeven" :report="sevenReport" />

            <ResultScl90 v-if="isSCL90 && hasDimensionScores" :scores="result.dimensionScores" />
            <ResultMid60 v-if="isMid60" :result="result" />

            <!-- 建议内容 -->
            <div v-if="!isMBTI && !isSeven && !isPsyAge" class="rounded-lg p-6 mb-6" style="background-color: var(--primary-light);">
              <h3 class="font-bold text-lg mb-3 flex items-center" style="color: var(--text);">
                <span class="text-2xl mr-2">💡</span>
                专业建议
              </h3>
              <p class="whitespace-pre-line" style="color: var(--text-secondary);">{{ result.suggestion }}</p>
            </div>

            <!-- 严重程度指示器 -->
            <div class="mb-8" v-if="canScore">
              <div class="flex justify-between text-sm mb-2" style="color: var(--text-secondary);">
                <span>严重程度</span>
                <span>{{ Math.round(severityPercent) }}%</span>
              </div>
              <div class="w-full rounded-full h-3" style="background-color: var(--primary-light);">
                <div class="rounded-full h-3 transition-all duration-1000" :class="severityBarClass"
                  :style="{ width: `${severityPercent}%` }"></div>
              </div>
            </div>

            <!-- 资源链接 -->
            <div v-if="!isMBTI" class="rounded-lg p-4 mb-6"
              :style="isFormalTest ? '' : 'background-color: var(--warning-bg); border-left: 4px solid var(--warning-border);'">
              <template v-if="isFormalTest">
                <div class="formal-resource-card-title">
                  <span style="font-size: 18px;">📞</span>
                  <span>危机援助资源（24 小时）</span>
                </div>
                <ul class="formal-resource-list">
                  <li><b>全国心理援助热线</b> · <a href="tel:12356">12356</a>（24 小时，免费，由国家卫健委统一管理）</li>
                  <li><b>希望 24 热线</b> · <a href="tel:400-161-9995">400-161-9995</a>（24 小时）</li>
                  <li><b>北京心理危机研究与干预中心</b> · <a href="tel:010-82951332">010-82951332</a></li>
                  <li><b>紧急医疗救援</b> · <a href="tel:120">120</a>（或前往就近医院急诊）</li>
                  <li><b>青少年台</b> · <a href="tel:12355">12355</a></li>
                </ul>
              </template>
              <template v-else>
                <h4 class="font-semibold mb-2" style="color: var(--text);">📞 需要帮助？</h4>
                <p class="text-sm" style="color: var(--warning-text);">
                  如果您感到困扰，可以联系以下专业资源：<br>
                  • 希望24热线：400-161-9995（全国心理援助）<br>
                  • 北京心理危机研究与干预中心：010-82951332<br>
                  • 简单心理、壹心理等平台寻求专业咨询
                </p>
              </template>
            </div>

            <!-- 操作按钮 -->
            <div class="flex gap-4">
              <button @click="retakeTest" class="flex-1 py-3 rounded-lg font-semibold transition-all"
                :style="{ backgroundColor: 'var(--primary)', color: 'white', boxShadow: 'var(--shadow-sm)' }"
                @mouseenter="setButtonBg($event, 'var(--primary-dark)')"
                @mouseleave="setButtonBg($event, 'var(--primary)')">
                重新测评
              </button>
              <button @click="goHome" class="flex-1 py-3 rounded-lg font-semibold transition-all"
                style="background-color: var(--card-bg); color: var(--text-secondary); box-shadow: var(--shadow-sm);"
                @mouseenter="setButtonBg($event, 'var(--bg)')" @mouseleave="setButtonBg($event, 'var(--card-bg)')">
                返回首页
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12">
          <div class="text-2xl" style="color: var(--text-secondary);">未找到测评结果</div>
          <button @click="goHome" class="mt-4 px-6 py-2 rounded-lg"
            style="background-color: var(--primary); color: white;">
            返回首页
          </button>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnswerStore } from '~/stores/answer'

const router = useRouter()
const answerStore = useAnswerStore()

// 获取结果
const result = ref<any>(null)
const isLoading = ref(true)

// 高敏感量表（自杀 / 自伤类）使用正式模式，与测试页共用 FORMAL_TESTS
const FORMAL_TESTS = ['sioss']
const isFormalTest = computed(() => FORMAL_TESTS.includes(result.value?.testId))

// 挂载/卸载时挂/卸 data-formal（衬线 / 墨色 / 警示红主题）
onMounted(() => {
  if (import.meta.client && result.value?.testId && FORMAL_TESTS.includes(result.value.testId)) {
    document.documentElement.setAttribute('data-formal', result.value.testId)
  }
})
onUnmounted(() => {
  if (import.meta.client) {
    document.documentElement.removeAttribute('data-formal')
  }
})

// 判断应该计分
const canScore = ref(false)

// 加载结果的方法
const loadResult = async () => {
  isLoading.value = true

  let resultData = answerStore.getResult()

  if (!resultData && typeof window !== 'undefined') {
    try {
      const saved = sessionStorage.getItem('last_test_result')
      if (saved) {
        resultData = JSON.parse(saved)
        if (resultData) {
          answerStore.setResult(resultData)
        }
      }
    } catch (e) {
      console.error('从 sessionStorage 加载结果失败:', e)
    }
  }

  result.value = resultData

  try {
    const testId = result.value?.testId
    if (!testId) return
    await nextTick()
    const { data } = await useFetch('/api/tests/list')
    const testList = (data.value as any)?.data || []
    const found = testList.find((el: any) => el.id === testId)
    // 人格性格类量表通常无总分，不展示分数环；BIS/BPAQ 虽属人格特质类但有总分
    const scoredPersonality = ['bis', 'bpaq'].includes(testId)
    canScore.value = found ? found.category === 'symptom' || found.category === 'special' || scoredPersonality : false
  } catch (e) {
    canScore.value = false
  }

  isLoading.value = false
}

await loadResult()

// 判断是否为 SCL90
const isSCL90 = computed(() => result.value?.testId === 'scl90')

// 判断是否为 MBTI
const isMBTI = computed(() => result.value?.testId === 'mbti')

// 判断是否为 七宗罪与七美德
const isSeven = computed(() => result.value?.testId === 'seven')
const isPsyAge = computed(() => result.value?.testId === 'psy-age')
const isMid60 = computed(() => result.value?.testId === 'mid60')
const psyAgeReport = computed(() => result.value?.psyAgeReport)

const mbtiReport = computed(() => result.value?.mbtiReport || null)

const sevenReport = computed(() => result.value?.sevenReport || null)

// SIOSS 风险等级（与 scoreSIOSS.level 同步）：阳性 / 危险信号 / 作答无效 / 阴性
const siossRisk = computed(() => {
  if (result.value?.testId !== 'sioss') return null
  const level = String(result.value?.level || '')
  const ds = result.value?.dimensionScores || {}
  if (level.includes('筛查阳性') || level.includes('自杀意念（')) {
    return { kind: 'danger', badge: '筛查阳性', title: '高风险 · 请尽快寻求专业评估', desc: '本结果提示您近期可能存在较明显的自杀意念。SIOSS 为筛查工具，不能替代临床诊断，但请您尽快将这份结果带给专业人员进行评估，并告知一位您信任的人。' }
  }
  if (level.includes('危险信号')) {
    return { kind: 'warn', badge: '危险信号', title: '存在需要关注的自杀相关危险信号', desc: '即便总分未达阳性标准，您对部分关键条目（"想结束自己的生命""我曾经自杀过""有时我想一死了之"等）作出了肯定回答——这是必须严肃对待的危险信号，请尽快寻求专业评估，而不是"再等等看"。' }
  }
  if ((ds.concealment || {}).valid === false || level.includes('参考价值有限')) {
    return { kind: 'warn', badge: '结果参考有限', title: '本次结果参考价值有限', desc: '您的掩饰（测谎）维度得分偏高，说明作答时可能没有完全如实回答。请在安心、私密的环境下重新如实作答一次——这本身也是对您自己的保护。' }
  }
  return { kind: 'ok', badge: '本次未检出明显自杀意念', title: '本次未检出明显自杀意念', desc: '自杀意念可能随情绪、压力和生活处境而波动。如果某一天您感到痛苦难以承受，或脑海中出现死亡相关念头，请不要忽视，可向信任的人倾诉，或拨打 12356 心理援助热线。' }
})

// 判断是否有维度分数
const hasDimensionScores = computed(() => {
  return result.value?.dimensionScores && Object.keys(result.value.dimensionScores).length > 0
})

// 人格性格类：是否展示详细解读（16PF / 气质 / EPQ・EPQ-RSC）
const isPersonality = computed(() => {
  const id = result.value?.testId
  return !!id && ['sixteenPF', 'temperament', 'epq', 'epq-rsc'].includes(id)
})

// 需要展示维度剖面的量表（除文字外还有维度数据）
const enrichedScale = computed(() => {
  const id = result.value?.testId
  return !!id && ['epq', 'epq-rsc', 'temperament', 'bpns', 'ipip-eis', 'sixteenPF', 'sccs', 'pss', 'sds', 'sas', 'rses', 'asrm', 'phq9', 'gad7', 'sioss', 'bis', 'bpaq', 'mid60'].includes(id) && hasDimensionScores.value
})

// 显示分数（处理 MBTI 等特殊量表）
const displayScore = computed(() => {
  if (result.value?.testId === 'mbti') {
    return result.value?.level || '--'
  }
  return result.value?.totalScore || 0
})

// 计算属性
const circumference = 2 * Math.PI * 88
const strokeDashoffset = computed(() => {
  const percent = 1 - (result.value?.severity || 0)
  return circumference * percent
})

const severityPercent = computed(() => {
  return (result.value?.severity || 0) * 100
})

const formattedTime = computed(() => {
  if (!result.value?.timestamp) return ''
  return new Date(result.value.timestamp).toLocaleString('zh-CN')
})

// 根据测试类型获取头部颜色
const getHeaderColor = () => {
  const testId = result.value?.testId
  if (testId === 'scl90') return 'var(--primary)'
  if (testId === 'mbti') return 'var(--personality)'
  return 'var(--primary)'
}

const severityColor = computed(() => {
  const severity = result.value?.severity || 0
  if (severity < 0.3) return 'var(--special)'
  if (severity < 0.6) return 'var(--personality)'
  return 'var(--primary)'
})

const levelColorClass = computed(() => {
  const severity = result.value?.severity || 0
  if (severity < 0.3) return 'bg-green-100 text-green-700'
  if (severity < 0.6) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
})

const severityBarClass = computed(() => {
  const severity = result.value?.severity || 0
  if (severity < 0.3) return 'bg-green-500'
  if (severity < 0.6) return 'bg-yellow-500'
  return 'bg-red-500'
})

const getLevelClass = (level: string) => {
  const classes: Record<string, string> = {
    '很低': 'bg-green-100 text-green-700',
    '较低': 'bg-blue-100 text-blue-700',
    '中等': 'bg-yellow-100 text-yellow-700',
    '较高': 'bg-orange-100 text-orange-700',
    '很高': 'bg-red-100 text-red-700'
  }
  return classes[level] || 'bg-gray-100 text-gray-700'
}

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    '很低': '#10b981',
    '较低': '#3b82f6',
    '中等': '#eab308',
    '较高': '#f97316',
    '很高': '#ef4444'
  }
  return colors[level] || '#9ca3af'
}
const setButtonBg = (event: Event, color: string) => {
  const target = event.currentTarget
  if (target instanceof HTMLElement) {
    target.style.backgroundColor = color
  }
}

// 如果没有结果，重定向到首页
onMounted(async () => {
  if (!result.value) {
    router.push('/')
  }


})

function retakeTest() {
  const testId = result.value?.testId
  if (testId) {
    router.push(`/test/${testId}`)
  } else {
    router.push('/')
  }
}

function goHome() {
  router.push('/')
}
</script>
