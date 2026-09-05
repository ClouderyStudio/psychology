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

            <ResultSeven v-if="isSeven" :report="sevenReport" />

            <ResultScl90 v-if="isSCL90 && hasDimensionScores" :scores="result.dimensionScores" />

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
              style="background-color: var(--warning-bg); border-left: 4px solid var(--warning-border);">
              <h4 class="font-semibold mb-2" style="color: var(--text);">📞 需要帮助？</h4>
              <p class="text-sm" style="color: var(--warning-text);">
                如果您感到困扰，可以联系以下专业资源：<br>
                • 希望24热线：400-161-9995（全国心理援助）<br>
                • 北京心理危机研究与干预中心：010-82951332<br>
                • 简单心理、壹心理等平台寻求专业咨询
              </p>
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
    canScore.value = found ? found.category === 'symptom' || found.category === 'special' : false
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
const psyAgeReport = computed(() => result.value?.psyAgeReport)

const mbtiReport = computed(() => result.value?.mbtiReport || null)

const sevenReport = computed(() => result.value?.sevenReport || null)

// 判断是否有维度分数
const hasDimensionScores = computed(() => {
  return result.value?.dimensionScores && Object.keys(result.value.dimensionScores).length > 0
})

// 需要展示维度剖面的量表（除文字外还有维度数据）
const enrichedScale = computed(() => {
  const id = result.value?.testId
  return !!id && ['epq', 'epq-rsc', 'temperament', 'bpns', 'ipip-eis', 'sixteenPF'].includes(id) && hasDimensionScores.value
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
