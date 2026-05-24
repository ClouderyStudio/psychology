<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg);">
    <div class="container mx-auto px-4" :class="isMBTI ? 'max-w-5xl' : 'max-w-3xl'">
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
            <div v-if="isMBTI" class="mbti-report space-y-6">
              <section class="mbti-hero">
                <div>
                  <p class="mbti-eyebrow">人格类型概览</p>
                  <h1 class="mbti-type">{{ result.level }}</h1>
                  <p class="mbti-type-name">{{ mbtiReport?.typeName }}</p>
                </div>
                <div class="mbti-hero-stats">
                  <div>
                    <span>内在</span>
                    <strong>{{ mbtiReport?.innerOuterProfile?.innerType || '--' }}</strong>
                  </div>
                  <div>
                    <span>外在</span>
                    <strong>{{ mbtiReport?.innerOuterProfile?.outerType || '--' }}</strong>
                  </div>
                  <div>
                    <span>一致度</span>
                    <strong>{{ mbtiReport?.innerOuterProfile?.consistency ?? '--' }}%</strong>
                  </div>
                </div>
              </section>

              <section class="mbti-section">
                <div class="mbti-section-head">
                  <div>
                    <h3>相近类型参考</h3>
                    <p>根据四个维度的临界变化生成，用来观察结果附近的可能类型。</p>
                  </div>
                </div>
                <div class="mbti-type-strip">
                  <div v-for="(type, index) in mbtiReport?.nineGrid || []"
                      :key="`${type}-${index}`"
                      class="mbti-type-pill"
                      :class="{ 'is-active': type === result.level }">
                    {{ type }}
                  </div>
                </div>
              </section>

              <section class="mbti-section">
                <div class="mbti-section-head">
                  <div>
                    <h3>心理功能分布</h3>
                    <p>自然倾向更接近自发偏好，代偿倾向更接近环境适应和应对策略。</p>
                  </div>
                </div>
                <div class="grid md:grid-cols-2 gap-5">
                  <div class="mbti-score-panel">
                    <h4>自然倾向</h4>
                    <div class="space-y-3">
                      <div v-for="item in mbtiReport?.functionScores?.natural || []" :key="item.code">
                        <div class="mbti-score-row">
                          <span>{{ item.label }}</span>
                          <strong>{{ item.percent }}%</strong>
                        </div>
                        <div class="mbti-meter">
                          <div :style="{ width: `${item.percent * 4}%`, backgroundColor: 'var(--personality)' }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mbti-score-panel">
                    <h4>适应倾向</h4>
                    <div class="space-y-3">
                      <div v-for="item in mbtiReport?.functionScores?.compensatory || []" :key="item.code">
                        <div class="mbti-score-row">
                          <span>{{ item.label }}</span>
                          <strong>{{ item.percent }}%</strong>
                        </div>
                        <div class="mbti-meter">
                          <div :style="{ width: `${item.percent * 4}%`, backgroundColor: 'var(--special)' }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="mbti-note">{{ mbtiReport?.note }}</p>
              </section>

              <section class="mbti-section">
                <div class="mbti-section-head">
                  <div>
                    <h3>四维偏好</h3>
                    <p>每一组都表示你更习惯使用的一侧，并不代表另一侧缺失。</p>
                  </div>
                </div>
                <div class="mbti-preference-list">
                  <div v-for="item in mbtiReport?.preferences || []" :key="item.title" class="mbti-preference-item">
                    <div class="font-semibold mb-3" style="color: var(--text);">{{ item.title }}</div>
                    <div class="grid md:grid-cols-2 gap-3">
                      <div class="mbti-choice" :class="{ 'is-selected': isPreferenceSelected(item, 'left') }">
                        <div class="font-medium" style="color: var(--text);">{{ item.left }}</div>
                        <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ item.leftDesc }}</p>
                      </div>
                      <div class="mbti-choice" :class="{ 'is-selected': isPreferenceSelected(item, 'right') }">
                        <div class="font-medium" style="color: var(--text);">{{ item.right }}</div>
                        <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ item.rightDesc }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="mbti-section">
                <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                  <div>
                    <h3 class="mbti-inline-title">内在与外在性格</h3>
                    <p class="mbti-soft-text">{{ mbtiReport?.innerOuterProfile?.summary }}</p>
                  </div>
                  <div class="mbti-consistency">
                    <strong>{{ mbtiReport?.innerOuterProfile?.consistency }}%</strong>
                    <span>{{ mbtiReport?.innerOuterProfile?.status }}</span>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-3 mb-5">
                  <div class="mbti-identity-box">
                    <p class="text-sm mb-1" style="color: var(--text-muted);">内在性格</p>
                    <div class="text-3xl font-bold" style="color: var(--text);">{{ mbtiReport?.innerOuterProfile?.innerType }}</div>
                    <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ mbtiReport?.innerOuterProfile?.innerTypeName }}</p>
                  </div>
                  <div class="mbti-identity-box">
                    <p class="text-sm mb-1" style="color: var(--text-muted);">外在表现</p>
                    <div class="text-3xl font-bold" style="color: var(--text);">{{ mbtiReport?.innerOuterProfile?.outerType }}</div>
                    <p class="text-sm mt-1" style="color: var(--text-secondary);">{{ mbtiReport?.innerOuterProfile?.outerTypeName }}</p>
                  </div>
                </div>

                <div class="space-y-3">
                  <div v-for="item in mbtiReport?.innerOuterProfile?.dimensions || []" :key="item.key" class="mbti-inner-row">
                    <div class="flex items-center justify-between gap-3 mb-3">
                      <div>
                        <div class="font-semibold" style="color: var(--text);">{{ item.title }}</div>
                        <p class="text-xs" style="color: var(--text-muted);">{{ item.left }} / {{ item.right }}</p>
                      </div>
                      <span class="text-xs px-2 py-1 rounded-full" :style="{ backgroundColor: item.aligned ? 'var(--primary-light)' : 'var(--warning-bg)', color: item.aligned ? 'var(--personality)' : 'var(--warning-text)' }">
                        {{ item.aligned ? '一致' : '有差异' }}
                      </span>
                    </div>
                    <div class="grid md:grid-cols-2 gap-3">
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span style="color: var(--text-secondary);">内在 {{ item.innerLetter }}</span>
                          <span style="color: var(--text-muted);">{{ item.innerPercent }}%</span>
                        </div>
                        <div class="mbti-meter">
                          <div :style="{ width: `${item.innerPercent}%`, backgroundColor: 'var(--personality)' }"></div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span style="color: var(--text-secondary);">外在 {{ item.outerLetter }}</span>
                          <span style="color: var(--text-muted);">{{ item.outerPercent }}%</span>
                        </div>
                        <div class="mbti-meter">
                          <div :style="{ width: `${item.outerPercent}%`, backgroundColor: 'var(--special)' }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="mbti-section">
                <h3 class="mbti-inline-title">环境适应方式</h3>
                <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                  <div>
                    <div class="text-2xl font-bold" style="color: var(--text);">{{ mbtiReport?.mask?.name }}</div>
                    <p class="mt-2" style="color: var(--text-secondary);">你在现阶段更容易调用的应对方式</p>
                  </div>
                  <div class="grid grid-cols-2 gap-3 text-center">
                    <div class="mbti-mini-stat">
                      <div class="text-xl font-bold" style="color: var(--text);">{{ mbtiReport?.mask?.rarity }}</div>
                      <div class="text-xs" style="color: var(--text-muted);">{{ result.level }}占比</div>
                    </div>
                    <div class="mbti-mini-stat">
                      <div class="text-xl font-bold" style="color: var(--text);">{{ mbtiReport?.mask?.maskRatio }}</div>
                      <div class="text-xs" style="color: var(--text-muted);">适应方式占比</div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="mbti-section">
                <h3 class="mbti-inline-title">结果说明</h3>
                <div class="space-y-4">
                  <div v-for="section in mbtiProfileSections" :key="section.title">
                    <h4 class="font-semibold mb-1" style="color: var(--text);">{{ section.title }}</h4>
                    <p style="color: var(--text-secondary);">{{ section.text }}</p>
                  </div>
                </div>
              </section>

              <section class="mbti-section">
                <h3 class="mbti-inline-title">人格构成</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div v-for="role in mbtiReport?.functionStack?.roles || []" :key="role.title" class="mbti-role-box">
                    <p class="text-sm" style="color: var(--text-muted);">{{ role.title }} | {{ role.subtitle }}</p>
                    <div class="text-2xl font-bold my-2" style="color: var(--text);">{{ role.label }}{{ role.function }}</div>
                    <p class="text-sm mb-2" style="color: var(--text-secondary);">{{ role.description }}</p>
                    <p class="text-sm font-medium" style="color: var(--personality);">它关心的是：{{ role.question }}</p>
                  </div>
                </div>
              </section>

              <section class="mbti-section">
                <h3 class="mbti-inline-title">阅读提示</h3>
                <p class="whitespace-pre-line" style="color: var(--text-secondary);">{{ mbtiUnderstanding }}</p>
              </section>
            </div>

            <!-- 分数指示器 -->
            <div v-if="canScore" class="text-center mb-8">
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
              <div v-if="!canScore" class="text-2xl font-semibold mb-2" style="color: var(--text);">你的测评结果是:</div>

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
            <div class="mb-8" v-if="canScore">
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

<style scoped>
.mbti-report {
  color: var(--text);
}

.mbti-hero,
.mbti-section {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card-bg);
}

.mbti-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 24px;
  align-items: end;
  padding: 28px;
  background:
    linear-gradient(135deg, rgba(123, 107, 142, 0.12), rgba(94, 140, 111, 0.08)),
    var(--card-bg);
}

.mbti-eyebrow {
  margin-bottom: 10px;
  color: var(--text-muted);
  font-size: 13px;
}

.mbti-type {
  color: var(--text);
  font-size: clamp(56px, 12vw, 104px);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: 0;
}

.mbti-type-name {
  margin-top: 14px;
  color: var(--text-secondary);
  font-size: 16px;
}

.mbti-hero-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(82px, 1fr));
  gap: 10px;
}

.mbti-hero-stats div,
.mbti-mini-stat,
.mbti-identity-box,
.mbti-score-panel,
.mbti-role-box,
.mbti-inner-row,
.mbti-preference-item {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.72);
}

.mbti-hero-stats div {
  padding: 12px;
  text-align: center;
}

.mbti-hero-stats span,
.mbti-consistency span {
  display: block;
  color: var(--text-muted);
  font-size: 12px;
}

.mbti-hero-stats strong {
  display: block;
  margin-top: 4px;
  color: var(--text);
  font-size: 20px;
}

.mbti-section {
  padding: 22px;
}

.mbti-section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.mbti-section-head h3,
.mbti-inline-title {
  margin: 0;
  color: var(--text);
  font-size: 18px;
  font-weight: 700;
}

.mbti-section-head p,
.mbti-soft-text,
.mbti-note {
  color: var(--text-secondary);
  font-size: 14px;
}

.mbti-type-strip {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 8px;
}

.mbti-type-pill {
  min-height: 44px;
  border: 1px solid var(--border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: var(--bg);
  font-weight: 700;
}

.mbti-type-pill.is-active {
  border-color: var(--personality);
  color: #fff;
  background: var(--personality);
}

.mbti-score-panel,
.mbti-preference-item,
.mbti-inner-row,
.mbti-role-box {
  padding: 16px;
}

.mbti-score-panel h4 {
  margin-bottom: 14px;
  color: var(--text);
  font-weight: 700;
}

.mbti-score-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 5px;
  color: var(--text-secondary);
  font-size: 14px;
}

.mbti-score-row strong {
  color: var(--text);
  font-weight: 700;
}

.mbti-meter {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--primary-light);
}

.mbti-meter div {
  height: 100%;
  border-radius: inherit;
}

.mbti-note {
  margin-top: 16px;
}

.mbti-preference-list {
  display: grid;
  gap: 14px;
}

.mbti-choice {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 13px;
  background: transparent;
}

.mbti-choice.is-selected {
  border-color: var(--personality);
  background: var(--personality-light);
}

.mbti-consistency {
  min-width: 132px;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
  background: var(--personality-light);
  text-align: center;
}

.mbti-consistency strong {
  display: block;
  color: var(--personality);
  font-size: 24px;
  line-height: 1;
}

.mbti-identity-box,
.mbti-mini-stat {
  padding: 14px;
}

@media (max-width: 768px) {
  .mbti-hero {
    grid-template-columns: 1fr;
    padding: 22px;
  }

  .mbti-hero-stats,
  .mbti-type-strip {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
