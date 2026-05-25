<template>
  <div class="min-h-screen" style="background-color: var(--bg);">
    <div class="container mx-auto px-4 py-8">

      <!-- Hero 区域 -->
      <section class="hero mb-12 text-center">
        <div class="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style="background-color: var(--primary-light); color: var(--primary);">
          <span>🧭</span>
          <span class="text-sm font-medium">心理健康自评工具集</span>
        </div>
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style="color: var(--text);">
          选择一份<span class="accent" style="color: var(--primary);">量表</span>，开启自我探索
        </h1>
        <p class="hero-subtitle text-base md:text-lg max-w-2xl mx-auto" style="color: var(--text-secondary);">
          我们收录了多种经过验证的心理测评工具，帮助你了解自己的情绪状态、性格特点和心理倾向。
        </p>
      </section>

      <!-- 统计条 -->
      <div class="stats-row grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
        <div class="stat-item text-center p-4 rounded-xl"
          style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
          <div class="stat-num text-3xl md:text-4xl font-bold mb-1" style="color: var(--primary);">
            {{ tests.length }}
          </div>
          <div class="stat-label text-sm" style="color: var(--text-secondary);">专业量表</div>
        </div>
        <div class="stat-item text-center p-4 rounded-xl"
          style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
          <div class="stat-num text-3xl md:text-4xl font-bold mb-1" style="color: var(--primary);">
            {{ uniqueCategories }}
          </div>
          <div class="stat-label text-sm" style="color: var(--text-secondary);">分类维度</div>
        </div>
        <div class="stat-item text-center p-4 rounded-xl"
          style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
          <div class="stat-num text-3xl md:text-4xl font-bold mb-1" style="color: var(--primary);">
            2-20
          </div>
          <div class="stat-label text-sm" style="color: var(--text-secondary);">分钟完成</div>
        </div>
      </div>

      <!-- 最后一次结果卡片 -->
      <div v-if="lastResult" class="last-result-card max-w-2xl mx-auto mb-8">
        <div
          class="relative rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1"
          style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); box-shadow: var(--shadow-lg);">
          <div class="absolute top-2 right-2">
            <button @click="clearLastResult"
              class="w-6 h-6 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
              title="关闭">
              ✕
            </button>
          </div>
          <div class="p-5 text-white">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">📊</span>
              <span class="text-sm font-medium text-white/80">最近一次测评结果</span>
            </div>
            <div class="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 class="text-xl font-bold">{{ lastResult.testTitle }}</h3>
                <p class="text-sm text-white/80 mt-1">完成时间：{{ formatLastResultTime }}</p>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold">{{ lastResultDisplayScore }}</div>
                <div class="text-sm text-white/80">{{ lastResult.level }}</div>
              </div>
            </div>
            <button @click="viewLastResult"
              class="mt-3 w-full py-2 rounded-lg font-medium transition-all bg-white/20 hover:bg-white/30">
              查看详细报告 →
            </button>
          </div>
        </div>
      </div>

      <!-- 温馨提示 -->
      <div class="notice-banner rounded-lg p-4 mb-8 max-w-4xl mx-auto"
        style="background-color: var(--warning-bg); border-left: 4px solid var(--warning-border);">
        <div class="flex gap-3">
          <span class="notice-icon text-xl">⚠️</span>
          <div class="text-sm" style="color: var(--warning-text);">
            <strong>重要提示：</strong>本站所有量表均为<strong>自我筛查工具</strong>，结果仅供参考和自我了解，
            <strong>不能替代专业心理医生的诊断</strong>。如果你感到明显的心理困扰，请及时寻求专业帮助。
            部分量表题目较多，请在安静、不受打扰的环境下完成，以确保结果的有效性。
          </div>
        </div>
      </div>

      <!-- 分类筛选按钮 -->
      <div class="filter-section flex flex-wrap justify-center gap-3 mb-8">
        <button v-for="category in categories" :key="category.id" @click="activeFilter = category.id"
          class="filter-btn px-5 py-2 rounded-full transition-all duration-200 text-sm font-medium"
          :class="{ 'active': activeFilter === category.id }" :style="getFilterButtonStyle(category.id)">
          <span class="filter-dot inline-block w-2 h-2 rounded-full mr-2"
            :style="{ backgroundColor: category.color }"></span>
          {{ category.name }}
        </button>
      </div>

      <!-- 量表卡片网格 -->
      <div class="cards-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div v-for="test in filteredTests" :key="test.id"
          class="card rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden flex flex-col"
          :style="{ boxShadow: 'var(--shadow-md)' }">

          <!-- 卡片顶部色带 -->
          <div class="h-2" :style="{ backgroundColor: getCategoryColor(test.category) }"></div>

          <!-- 卡片内容 -->
          <div class="p-6 flex flex-col flex-grow" :style="{ backgroundColor: 'var(--card-bg)' }">
            <!-- 分类标签 -->
            <div class="flex items-start justify-between mb-3">
              <span class="category-tag px-3 py-1 rounded-full text-xs font-medium"
                :style="{ backgroundColor: getCategoryTagColor(test.category), color: '#ffffff' }">
                {{ getCategoryName(test.category) }}
              </span>
              <span class="duration-badge px-2 py-1 rounded text-xs"
                :style="{ backgroundColor: 'var(--' + test.category + '-light)', color: 'var(--' + test.category + ')' }">
                {{ test.duration }}
              </span>
            </div>

            <h3 class="text-xl font-bold mb-1" style="color: var(--text);">{{ test.title }}</h3>

            <p class="text-xs mb-3" style="color: var(--text-muted);">
              {{ test.englishName }}
            </p>

            <p class="text-sm mb-4 leading-relaxed min-h-[60px]" style="color: var(--text-secondary);">
              {{ test.description }}
            </p>

            <div v-if="unfinishedTests[test.id]" class="min-h-[42px] pb-2">
              <div class="mb-3 p-2 rounded-lg text-xs text-center"
                style="background-color: var(--warning-bg); color: var(--warning-text);">
                📌 已完成 {{ unfinishedCounts[test.id] }}/{{ test.questionsCount }} 题
              </div>
            </div>

            <div class="flex items-center mt-auto justify-between mb-4 text-xs" style="color: var(--text-muted);">
              <span>📝 {{ test.questionsCount }} 题</span>
              <div>
                <span v-for="tag in test.tags" :key="tag" class="tag px-2 py-1 rounded-full text-xs mr-2"
                  :style="{ backgroundColor: 'var(--' + test.category + '-light)', color: 'var(--' + test.category + ')' }">
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- 按钮区域 -->
            <div class="flex gap-2 pt-2 min-h-[44px]">
              <button @click="startTest(test.id, false)"
                class="flex-1 py-2.5 rounded-lg font-semibold transition-all text-sm"
                :style="{ backgroundColor: getButtonColor(test.category), color: 'white' }"
                @mouseenter="e => e.target.style.backgroundColor = getButtonHoverColor(test.category)"
                @mouseleave="e => e.target.style.backgroundColor = getButtonColor(test.category)">
                {{ unfinishedTests[test.id] ? '继续测评' : '开始测评' }}
              </button>

              <button v-if="unfinishedTests[test.id]" @click="startTest(test.id, true)"
                class="px-4 py-2.5 rounded-lg font-semibold transition-all text-sm"
                style="background-color: var(--card-bg); color: var(--text-secondary); box-shadow: var(--shadow-sm);"
                @mouseenter="e => e.target.style.backgroundColor = 'var(--bg)'"
                @mouseleave="e => e.target.style.backgroundColor = 'var(--card-bg)'">
                重置
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 无结果提示 -->
      <div v-if="filteredTests.length === 0" class="no-results text-center py-12">
        <div class="no-results-emoji text-6xl mb-4">🔍</div>
        <p style="color: var(--text-secondary);">该分类下暂无量表，请切换筛选条件查看</p>
      </div>

      <!-- 清空所有进度按钮 -->
      <div v-if="hasAnyUnfinished" class="text-center mt-8">
        <button @click="clearAllProgress" class="px-4 py-2 rounded-lg text-sm transition-colors"
          style="background-color: var(--card-bg); color: var(--text-muted); box-shadow: var(--shadow-sm);"
          @mouseenter="e => e.target.style.backgroundColor = 'var(--bg)'"
          @mouseleave="e => e.target.style.backgroundColor = 'var(--card-bg)'">
          🗑️ 清空所有测评进度
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TestListItem } from '~/types/test'

const router = useRouter()
const answerStore = useAnswerStore()
const { $toast, $confirm } = useNuxtApp()

// 获取测评列表
const { data: response, error } = await useFetch('/api/tests/list')
const tests = ref<TestListItem[]>((response.value?.data as TestListItem[]) || [])

// 分类定义
const categories = [
  { id: 'all', name: '全部量表', color: 'var(--primary)' },
  { id: 'symptom', name: '症状筛查', color: 'var(--symptom)' },
  { id: 'personality', name: '人格性格', color: 'var(--personality)' },
  { id: 'special', name: '专项量表', color: 'var(--special)' }
]

// 当前筛选
const activeFilter = ref('all')

// 筛选后的测评列表
const filteredTests = computed(() => {
  if (activeFilter.value === 'all') {
    return tests.value
  }
  return tests.value.filter(test => test.category === activeFilter.value)
})

// 获取唯一分类数量
const uniqueCategories = computed(() => {
  const cats = new Set(tests.value.map(test => test.category))
  return cats.size
})

// 存储未完成的测评
const unfinishedTests = ref<Record<string, boolean>>({})
const unfinishedCounts = ref<Record<string, number>>({})
const hasAnyUnfinished = computed(() => Object.keys(unfinishedTests.value).length > 0)

// 获取分类名称
const getCategoryName = (categoryId: string) => {
  const category = categories.find(c => c.id === categoryId)
  return category ? category.name : '专项量表'
}

// 获取分类主色
const getCategoryColor = (categoryId: string) => {
  const colors: Record<string, string> = {
    symptom: 'var(--symptom)',
    personality: 'var(--personality)',
    special: 'var(--special)'
  }
  return colors[categoryId] || 'var(--primary)'
}

// 获取分类标签颜色
const getCategoryTagColor = (categoryId: string) => {
  const colors: Record<string, string> = {
    symptom: 'var(--symptom-dark)',
    personality: 'var(--personality-dark)',
    special: 'var(--special-dark)'
  }
  return colors[categoryId] || 'var(--primary-dark)'
}

// 获取按钮颜色
const getButtonColor = (categoryId: string) => {
  const colors: Record<string, string> = {
    symptom: 'var(--symptom-dark)',
    personality: 'var(--personality-dark)',
    special: 'var(--special-dark)'
  }
  return colors[categoryId] || 'var(--primary-dark)'
}

// 获取按钮悬停颜色
const getButtonHoverColor = (categoryId: string) => {
  const colors: Record<string, string> = {
    symptom: 'var(--symptom)',
    personality: 'var(--personality)',
    special: 'var(--special)'
  }
  return colors[categoryId] || 'var(--primary)'
}

// 获取筛选按钮样式
const getFilterButtonStyle = (categoryId: string) => {
  if (activeFilter.value === categoryId) {
    const colors: Record<string, string> = {
      all: 'var(--primary-dark)',
      symptom: 'var(--symptom-dark)',
      personality: 'var(--personality-dark)',
      special: 'var(--special-dark)'
    }
    return {
      backgroundColor: colors[categoryId] || 'var(--primary)',
      color: 'white'
    }
  }
  return {
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-secondary)',
    boxShadow: 'var(--shadow-sm)'
  }
}

// 在客户端检查未完成的测评
const refreshUnfinishedStatus = () => {
  if (typeof window === 'undefined') return

  tests.value.forEach((test: TestListItem) => {
    try {
      const saved = sessionStorage.getItem(`test_${test.id}_answers`)
      if (saved) {
        const answers = JSON.parse(saved)
        const count = Object.keys(answers).length
        if (count > 0 && count <= test.questionsCount) {
          unfinishedTests.value[test.id] = true
          unfinishedCounts.value[test.id] = count
        } else {
          delete unfinishedTests.value[test.id]
          delete unfinishedCounts.value[test.id]
        }
      } else {
        delete unfinishedTests.value[test.id]
        delete unfinishedCounts.value[test.id]
      }
    } catch (e) {
      console.error('检查进度失败', e)
    }
  })
}

// 开始测评
let isNavigating = false

function startTest(testId: string, reset: boolean = false) {
  if (isNavigating) return
  isNavigating = true

  if (reset && typeof window !== 'undefined') {
    $confirm({
      title: '确认重置',
      message: '确定要重新开始吗？您的当前进度将被清除。',
      onConfirm: () => {
        sessionStorage.removeItem(`test_${testId}_answers`)
        answerStore.clearAnswers()
        delete unfinishedTests.value[testId]
        delete unfinishedCounts.value[testId]
        answerStore.setCurrentTest(testId)
        router.push(`/test/${testId}`)
        $toast.info('已重置，请重新作答', '提示')
        isNavigating = false
      },
      onCancel: () => {
        isNavigating = false
      }
    })
  } else {
    // 检查是否有保存的进度
    const saved = sessionStorage.getItem(`test_${testId}_answers`)
    if (saved) {
      answerStore.setCurrentTest(testId)
      router.push(`/test/${testId}`)
      setTimeout(() => {
        isNavigating = false
      }, 500)
    } else {
      answerStore.setCurrentTest(testId)
      router.push(`/test/${testId}`)
      setTimeout(() => {
        isNavigating = false
      }, 500)
    }
  }
}

// 清空所有进度
function clearAllProgress() {
  $confirm({
    title: '确认清空',
    message: '确定要清空所有测评的进度吗？此操作不可恢复。',
    onConfirm: () => {
      const keys = Object.keys(sessionStorage)
      let clearedCount = 0
      keys.forEach(key => {
        if (key.startsWith('test_') && key.endsWith('_answers')) {
          sessionStorage.removeItem(key)
          clearedCount++
        }
      })
      refreshUnfinishedStatus()
      answerStore.clearAnswers()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('clearAllProgress'))
        window.dispatchEvent(new CustomEvent('refreshProgress'))
      }
      $toast.success(`已清空 ${clearedCount} 个测评的进度`, '完成')
    }
  })
}

// 获取最后一次结果
const lastResult = ref<any>(null)

// 加载最后一次结果
const loadLastResult = () => {
  const result = answerStore.getLastResult()
  if (result) {
    lastResult.value = result
  }
}

// 格式化时间
const formatLastResultTime = computed(() => {
  if (!lastResult.value?.timestamp) return '未知'
  const date = new Date(lastResult.value.timestamp)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
})

// 显示分数
const lastResultDisplayScore = computed(() => {
  const result = lastResult.value
  if (!result) return '--'
  if (result.testId === 'mbti') {
    return result.level || '--'
  }
  return `${result.totalScore}/${result.maxScore}`
})

// 查看最后一次结果
const viewLastResult = () => {
  router.push('/result')
}

// 清除最后一次结果
const clearLastResult = () => {
  answerStore.clearLastResult()
  lastResult.value = null
  $toast.info('已清除历史记录', '提示')
}

// 监听存储事件，更新最后一次结果
const refreshLastResult = () => {
  loadLastResult()
}

onMounted(() => {
  refreshUnfinishedStatus()
  loadLastResult()

  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('test_') && e.key.endsWith('_answers')) {
      refreshUnfinishedStatus()
    }
    if (e.key === 'last_test_result') {
      refreshLastResult()
    }
  })

  window.addEventListener('clearAllProgress', () => {
    refreshUnfinishedStatus()
  })

  window.addEventListener('refreshProgress', () => {
    refreshUnfinishedStatus()
  })

  window.addEventListener('newResult', () => {
    refreshLastResult()
  })
})

onUnmounted(() => {
  window.removeEventListener('storage', () => { })
  window.removeEventListener('clearAllProgress', () => { })
  window.removeEventListener('refreshProgress', () => { })
  window.removeEventListener('newResult', () => { })
})
// 如果加载失败
if (error.value) {
  console.error('加载测评列表失败', error.value)
}
</script>