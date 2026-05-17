<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg);">
    <div class="container mx-auto px-4 max-w-3xl">
      <div v-if="result" class="rounded-2xl overflow-hidden" 
           style="background-color: var(--card-bg); box-shadow: var(--shadow-xl);">
        <!-- 结果头部 -->
        <div class="p-8 text-center" style="background-color: var(--primary); color: white;">
          <h2 class="text-3xl font-bold mb-2">测评结果</h2>
          <p style="color: rgba(255,255,255,0.9);">{{ result.testTitle }}</p>
          <p class="text-sm mt-2" style="color: rgba(255,255,255,0.7);">测评时间：{{ formattedTime }}</p>
        </div>
        
        <!-- 分数展示 -->
        <div class="p-8">
          <div class="text-center mb-8">
            <div class="inline-block relative">
              <svg class="w-48 h-48">
                <circle cx="96" cy="96" r="88" 
                        stroke="var(--primary-light)" stroke-width="12" fill="none"/>
                <circle cx="96" cy="96" r="88" 
                        :stroke="severityColor"
                        stroke-width="12" fill="none"
                        :stroke-dasharray="`${circumference} ${circumference}`"
                        :stroke-dashoffset="strokeDashoffset"
                        transform="rotate(-90 96 96)"
                        class="transition-all duration-1000"/>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-5xl font-bold" style="color: var(--text);">{{ result.totalScore }}</span>
                <span style="color: var(--text-muted);">/ {{ result.maxScore }}</span>
              </div>
            </div>
          </div>
          
          <!-- 等级标签 -->
          <div class="text-center mb-6">
            <div class="inline-block px-6 py-2 rounded-full text-lg font-semibold"
                 :class="levelColorClass">
              {{ result.level }}
            </div>
          </div>
          
          <!-- 建议内容 -->
          <div class="rounded-lg p-6 mb-6" style="background-color: var(--primary-light);">
            <h3 class="font-bold text-lg mb-3 flex items-center" style="color: var(--text);">
              <span class="text-2xl mr-2">💡</span>
              专业建议
            </h3>
            <p class="whitespace-pre-line" style="color: var(--text-secondary);">{{ result.suggestion }}</p>
          </div>
          
          <!-- 个性化建议 -->
          <div v-if="result.personalizedAdvice" 
               class="rounded-lg p-6 mb-6" style="background-color: var(--personality-bg);">
            <h3 class="font-bold text-lg mb-3 flex items-center" style="color: var(--text);">
              <span class="text-2xl mr-2">❤️</span>
              个性化关怀
            </h3>
            <p style="color: var(--text-secondary);">{{ result.personalizedAdvice }}</p>
          </div>
          
          <!-- 严重程度指示器 -->
          <div class="mb-8">
            <div class="flex justify-between text-sm mb-2" style="color: var(--text-secondary);">
              <span>严重程度</span>
              <span>{{ Math.round(severityPercent) }}%</span>
            </div>
            <div class="w-full rounded-full h-3" style="background-color: var(--primary-light);">
              <div class="rounded-full h-3 transition-all duration-1000"
                   :class="severityBarClass"
                   :style="{ width: `${severityPercent}%` }"></div>
            </div>
          </div>
          
          <!-- 资源链接 -->
          <div class="rounded-lg p-4 mb-6"
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
            <button @click="retakeTest" 
                    class="flex-1 py-3 rounded-lg font-semibold transition-colors"
                    style="background-color: var(--primary); color: white;"
                    @mouseenter="e => e.target.style.backgroundColor = 'var(--primary-dark)'"
                    @mouseleave="e => e.target.style.backgroundColor = 'var(--primary)'">
              重新测评
            </button>
            <button @click="goHome" 
                    class="flex-1 py-3 rounded-lg font-semibold transition-colors"
                    style="background-color: var(--card-bg); color: var(--text-secondary); box-shadow: var(--shadow-sm);">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnswerStore } from '~/stores/answer'

const router = useRouter()
const answerStore = useAnswerStore()

// 获取结果
const result = ref(answerStore.getResult())

// 计算属性
const circumference = 2 * Math.PI * 88 // 约 553
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

const severityColor = computed(() => {
  const severity = result.value?.severity || 0
  if (severity < 0.3) return '#10b981' // green
  if (severity < 0.6) return '#eab308' // yellow
  return '#ef4444' // red
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

// 如果没有结果，重定向到首页
onMounted(() => {
  if (typeof window !== 'undefined') {
    // 清空所有 sessionStorage 中的测评数据
    const keys = Object.keys(sessionStorage)
    keys.forEach(key => {
      if (key.startsWith('test_') && key.endsWith('_answers')) {
        sessionStorage.removeItem(key)
      }
    })
    answerStore.clearAnswers()
  }
  if (!result.value) {
    router.push('/')
  }
})

function retakeTest() {
  const testId = result.value?.testId
  answerStore.clearAnswers()
  if (testId) {
    router.push(`/test/${testId}`)
  } else {
    router.push('/')
  }
}

function goHome() {
  answerStore.clearAnswers()
  router.push('/')
}
</script>