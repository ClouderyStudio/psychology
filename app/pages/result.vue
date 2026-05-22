<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg);">
    <div class="container mx-auto px-4 max-w-3xl">
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
            <div v-if="isMBTI" class="space-y-6">
              <section class="text-center">
                <p class="text-sm mb-3" style="color: var(--text-secondary);">以下是基于差异化算法为你生成的人格九宫格</p>
                <h1 class="text-5xl font-bold mb-2" style="color: var(--text);">{{ result.level }}</h1>
                <p style="color: var(--text-secondary);">{{ mbtiReport?.typeName }}</p>
              </section>

              <section class="grid grid-cols-3 gap-2 max-w-sm mx-auto">
                <div v-for="(type, index) in mbtiReport?.nineGrid || []"
                    :key="`${type}-${index}`"
                    class="text-center rounded-lg py-4 font-bold"
                    :class="type === result.level ? 'text-white' : ''"
                    :style="{ backgroundColor: type === result.level ? 'var(--personality)' : 'var(--bg)', color: type === result.level ? 'white' : 'var(--text)' }">
                  {{ type }}
                </div>
              </section>

              <section class="rounded-lg p-5" style="background-color: var(--bg);">
                <h3 class="font-bold text-lg mb-4" style="color: var(--text);">实验数据</h3>
                <div class="grid md:grid-cols-2 gap-5">
                  <div>
                    <h4 class="font-semibold mb-3" style="color: var(--text);">自然状态的心理倾向</h4>
                    <div class="space-y-3">
                      <div v-for="item in mbtiReport?.functionScores?.natural || []" :key="item.code">
                        <div class="flex justify-between text-sm mb-1">
                          <span style="color: var(--text);">{{ item.label }}</span>
                          <span style="color: var(--text-secondary);">{{ item.percent }}%</span>
                        </div>
                        <div class="h-2 rounded-full" style="background-color: var(--primary-light);">
                          <div class="h-2 rounded-full" :style="{ width: `${item.percent * 4}%`, backgroundColor: 'var(--personality)' }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 class="font-semibold mb-3" style="color: var(--text);">代偿状态的心理倾向</h4>
                    <div class="space-y-3">
                      <div v-for="item in mbtiReport?.functionScores?.compensatory || []" :key="item.code">
                        <div class="flex justify-between text-sm mb-1">
                          <span style="color: var(--text);">{{ item.label }}</span>
                          <span style="color: var(--text-secondary);">{{ item.percent }}%</span>
                        </div>
                        <div class="h-2 rounded-full" style="background-color: var(--primary-light);">
                          <div class="h-2 rounded-full" :style="{ width: `${item.percent * 4}%`, backgroundColor: 'var(--special)' }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="text-sm mt-4" style="color: var(--text-muted);">{{ mbtiReport?.note }}</p>
              </section>

              <section class="rounded-lg p-5" style="background-color: var(--primary-light);">
                <h3 class="font-bold text-lg mb-4" style="color: var(--text);">基础偏好</h3>
                <div class="space-y-4">
                  <div v-for="item in mbtiReport?.preferences || []" :key="item.title" class="rounded-lg p-4" style="background-color: var(--card-bg);">
                    <div class="font-semibold mb-3" style="color: var(--text);">{{ item.title }}</div>
                    <div class="grid md:grid-cols-2 gap-3">
                      <div class="rounded-lg p-3" :style="{ border: isPreferenceSelected(item, 'left') ? '2px solid var(--personality)' : '1px solid var(--border)', backgroundColor: isPreferenceSelected(item, 'left') ? 'var(--primary-light)' : 'transparent' }">
                        <div class="font-medium" style="color: var(--text);">{{ item.left }}</div>
                        <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ item.leftDesc }}</p>
                      </div>
                      <div class="rounded-lg p-3" :style="{ border: isPreferenceSelected(item, 'right') ? '2px solid var(--personality)' : '1px solid var(--border)', backgroundColor: isPreferenceSelected(item, 'right') ? 'var(--primary-light)' : 'transparent' }">
                        <div class="font-medium" style="color: var(--text);">{{ item.right }}</div>
                        <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ item.rightDesc }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="rounded-lg p-5" style="background-color: var(--bg);">
                <h3 class="font-bold text-lg mb-3" style="color: var(--text);">人格面具</h3>
                <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <div>
                    <div class="text-2xl font-bold" style="color: var(--text);">{{ mbtiReport?.mask?.name }}</div>
                    <p class="mt-2" style="color: var(--text-secondary);">你理想中的自我</p>
                  </div>
                  <div class="grid grid-cols-2 gap-3 text-center">
                    <div class="rounded-lg p-3" style="background-color: var(--card-bg);">
                      <div class="text-xl font-bold" style="color: var(--text);">{{ mbtiReport?.mask?.rarity }}</div>
                      <div class="text-xs" style="color: var(--text-muted);">{{ result.level }}占比</div>
                    </div>
                    <div class="rounded-lg p-3" style="background-color: var(--card-bg);">
                      <div class="text-xl font-bold" style="color: var(--text);">{{ mbtiReport?.mask?.maskRatio }}</div>
                      <div class="text-xs" style="color: var(--text-muted);">面具占比</div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="rounded-lg p-5" style="background-color: var(--card-bg); border: 1px solid var(--border);">
                <h3 class="font-bold text-lg mb-4" style="color: var(--text);">结果说明</h3>
                <div class="space-y-4">
                  <div v-for="section in mbtiProfileSections" :key="section.title">
                    <h4 class="font-semibold mb-1" style="color: var(--text);">{{ section.title }}</h4>
                    <p style="color: var(--text-secondary);">{{ section.text }}</p>
                  </div>
                </div>
              </section>

              <section class="rounded-lg p-5" style="background-color: var(--primary-light);">
                <h3 class="font-bold text-lg mb-4" style="color: var(--text);">你的人格构成</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div v-for="role in mbtiReport?.functionStack?.roles || []" :key="role.title" class="rounded-lg p-4" style="background-color: var(--card-bg);">
                    <p class="text-sm" style="color: var(--text-muted);">{{ role.title }} | {{ role.subtitle }}</p>
                    <div class="text-2xl font-bold my-2" style="color: var(--text);">{{ role.label }}{{ role.function }}</div>
                    <p class="text-sm mb-2" style="color: var(--text-secondary);">{{ role.description }}</p>
                    <p class="text-sm font-medium" style="color: var(--personality);">它关心的是：{{ role.question }}</p>
                  </div>
                </div>
              </section>

              <section class="rounded-lg p-5" style="background-color: var(--bg);">
                <h3 class="font-bold text-lg mb-3" style="color: var(--text);">如何理解实验数据？</h3>
                <p class="whitespace-pre-line" style="color: var(--text-secondary);">{{ mbtiUnderstanding }}</p>
              </section>
            </div>

            <!-- 分数指示器 -->
            <div v-if="isSymptom" class="text-center mb-8">
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
                  <span class="text-5xl font-bold" style="color: var(--text);">{{ displayScore }}</span>
                  <span style="color: var(--text-muted);">/ {{ result.maxScore }}</span>
                </div>
              </div>
            </div>
            
            <!-- 等级标签 -->
            <div v-if="!isMBTI" class="text-center mb-6">
              <div v-if="!isSymptom" class="text-2xl font-semibold mb-2" style="color: var(--text);">你的测评结果是:</div>

              <div class="inline-block px-6 py-2 rounded-full text-lg font-semibold"
                  :class="levelColorClass">
                {{ result.level }}
              </div>
            </div>
            
            <!-- SCL-90 维度详情 -->
            <div v-if="isSCL90 && hasDimensionScores" 
                class="mt-6 p-4 rounded-lg"
                style="background-color: var(--bg);">
              <h3 class="font-bold text-lg mb-4 flex items-center" style="color: var(--text);">
                <span class="text-2xl mr-2">📊</span>
                SCL-90 各维度评分详情
              </h3>
              <div class="space-y-3">
                <div v-for="dim in scl90DimensionList" :key="dim.key"
                    class="p-3 rounded-lg"
                    :style="{ backgroundColor: 'var(--card-bg)' }">
                  <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center gap-2">
                      <span>{{ dim.icon }}</span>
                      <span class="font-medium" style="color: var(--text);">{{ dim.name }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm" style="color: var(--text-secondary);">均分: {{ getDimAverage(dim.key) }}</span>
                      <span class="text-xs px-2 py-1 rounded-full" :class="getLevelClass(getDimLevel(dim.key))">
                        {{ getDimLevel(dim.key) }}
                      </span>
                    </div>
                  </div>
                  <div class="w-full rounded-full h-2" style="background-color: var(--primary-light);">
                    <div class="rounded-full h-2 transition-all duration-500"
                        :style="{ width: getDimPercentage(dim.key) + '%', backgroundColor: getLevelColor(getDimLevel(dim.key)) }">
                    </div>
                  </div>
                  <p class="text-xs mt-2" style="color: var(--text-muted);">{{ getDimDescription(dim.key) }}</p>
                </div>
              </div>
            </div>
            
            <!-- 建议内容 -->
            <div v-if="!isMBTI" class="rounded-lg p-6 mb-6" style="background-color: var(--primary-light);">
              <h3 class="font-bold text-lg mb-3 flex items-center" style="color: var(--text);">
                <span class="text-2xl mr-2">💡</span>
                专业建议
              </h3>
              <p class="whitespace-pre-line" style="color: var(--text-secondary);">{{ result.suggestion }}</p>
            </div>
            
            <!-- 严重程度指示器 -->
            <div class="mb-8" v-if="isSymptom">
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
              <button @click="retakeTest" 
                      class="flex-1 py-3 rounded-lg font-semibold transition-all"
                      :style="{ backgroundColor: 'var(--primary)', color: 'white', boxShadow: 'var(--shadow-sm)' }"
                      @mouseenter="setButtonBg($event, 'var(--primary-dark)')"
                      @mouseleave="setButtonBg($event, 'var(--primary)')">
                重新测评
              </button>
              <button @click="goHome" 
                      class="flex-1 py-3 rounded-lg font-semibold transition-all"
                      style="background-color: var(--card-bg); color: var(--text-secondary); box-shadow: var(--shadow-sm);"
                      @mouseenter="setButtonBg($event, 'var(--bg)')"
                      @mouseleave="setButtonBg($event, 'var(--card-bg)')">
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
import type { SCL90DimensionScores } from '~/types/test'

const router = useRouter()
const answerStore = useAnswerStore()

// 获取结果
const result = ref<any>(null)
const isLoading = ref(true)

// 判断是否为 症状筛查 测试
const isSymptom = ref(false)

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
    isSymptom.value = found ? found.category === 'symptom' : false
  } catch (e) {
    isSymptom.value = false
  }

  isLoading.value = false
}

await loadResult()

// 判断是否为 SCL90
const isSCL90 = computed(() => result.value?.testId === 'scl90')

// 判断是否为 MBTI
const isMBTI = computed(() => result.value?.testId === 'mbti')

const mbtiReport = computed(() => result.value?.mbtiReport || null)

const mbtiProfileSections = computed(() => {
  const profile = mbtiReport.value?.profile
  if (!profile) return []
  return [
    { title: '关于你', text: profile.about },
    { title: '构想与执行', text: profile.execution },
    { title: '让远见贴近内心', text: profile.inner },
    { title: '隐藏的另一面', text: profile.hidden },
    { title: '面具与人格', text: profile.mask }
  ]
})

const mbtiUnderstanding = `一、实验背景
我们聚焦的是心理能量层面的动力与阻力，会允许每个人的阴影功能呈现“投射后的形状”。因此，部分非阶梯状的八维分布是预期内的可能性。

二、八维得分可以如何解读？
重要：所有分数的高低都与认知能力以及发展水平无关。自然状态更接近人格底色，代偿状态更接近外界需要、自我保护、训练经历或情境代入。

三、可能的误测原因
1. 因为明显不认同一边，而强烈选择了另一边并不完全认同的选项。
2. 近期状态较为特殊，很难区分自己的内在需求和环境的需求。
3. 基于“我是否可以这样”作答，而没有基于“这是否完全是我”来考虑。

四、九宫格是什么
九宫格采用九种不同的人格算法进行综合比对，得出最可能的人格类型。

五、人格面具与人格的关系
人格面具代表现阶段想成为的样子，它与真我人格以及八维分布之间没有必然联系，也可能随着心境与环境发生变化。`

// 判断是否有维度分数
const hasDimensionScores = computed(() => {
  return result.value?.dimensionScores && Object.keys(result.value.dimensionScores).length > 0
})

// SCL-90 维度列表
const scl90DimensionList = [
  { key: 'somatization', name: '躯体化', icon: '💪' },
  { key: 'obsessive', name: '强迫症状', icon: '🔄' },
  { key: 'interpersonal', name: '人际关系敏感', icon: '👥' },
  { key: 'depression', name: '抑郁', icon: '😔' },
  { key: 'anxiety', name: '焦虑', icon: '😰' },
  { key: 'hostility', name: '敌对', icon: '😠' },
  { key: 'phobic', name: '恐怖', icon: '😨' },
  { key: 'paranoid', name: '偏执', icon: '🔍' },
  { key: 'psychotic', name: '精神病性', icon: '🧠' },
  { key: 'additional', name: '其他', icon: '📋' }
]

// 获取维度分数对象
const getDimensionScores = (): SCL90DimensionScores | null => {
  return result.value?.dimensionScores as SCL90DimensionScores || null
}

// 获取维度均分
const getDimAverage = (dimKey: string): string => {
  const scores = getDimensionScores()
  if (scores && scores[dimKey as keyof SCL90DimensionScores]) {
    return scores[dimKey as keyof SCL90DimensionScores].average.toFixed(2)
  }
  return '0.00'
}

// 获取维度等级
const getDimLevel = (dimKey: string): string => {
  const scores = getDimensionScores()
  if (scores && scores[dimKey as keyof SCL90DimensionScores]) {
    return scores[dimKey as keyof SCL90DimensionScores].level
  }
  return '未知'
}

// 获取维度描述
const getDimDescription = (dimKey: string): string => {
  const scores = getDimensionScores()
  if (scores && scores[dimKey as keyof SCL90DimensionScores]) {
    return scores[dimKey as keyof SCL90DimensionScores].description
  }
  return ''
}

// 获取维度百分比
const getDimPercentage = (dimKey: string): number => {
  const scores = getDimensionScores()
  if (scores && scores[dimKey as keyof SCL90DimensionScores]) {
    return (scores[dimKey as keyof SCL90DimensionScores].average / 5) * 100
  }
  return 0
}

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

const isPreferenceSelected = (item: any, side: 'left' | 'right') => {
  const firstLetters: Record<'left' | 'right', string[]> = {
    left: ['E', 'S', 'T', 'J'],
    right: ['I', 'N', 'F', 'P']
  }
  return firstLetters[side].includes(item.selected)
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
