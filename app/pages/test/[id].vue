<!-- pages/test/[id].vue -->
<template>
  <div class="min-h-screen py-8" style="background-color: var(--bg);">
    <div class="container mx-auto px-4 max-w-3xl">
      <!-- 加载状态 -->
      <div v-if="!test" class="text-center py-12">
        <div class="text-2xl" style="color: var(--text-secondary);">加载中...</div>
      </div>
      
      <!-- 测评内容 -->
      <div v-else>
        <!-- 进度条 -->
        <div class="mb-6">
          <div class="flex justify-between text-sm mb-2" style="color: var(--text-secondary);">
            <span>答题进度</span>
            <span>{{ answeredCount }} / {{ totalQuestions }}</span>
          </div>
          <div class="w-full rounded-full h-2" style="background-color: var(--primary-light);">
            <div class="rounded-full h-2 transition-all duration-300"
                 :style="{ width: `${progress}%`, backgroundColor: 'var(--primary)' }"></div>
          </div>
        </div>
        
        <!-- 分页信息 -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-sm" style="color: var(--text-muted);">
            第 {{ currentPage }} / {{ totalPages }} 页
          </div>
          <div class="text-sm" style="color: var(--text-muted);">
            本页 {{ currentPageQuestions.length }} 题
          </div>
        </div>
        
        <!-- 测评信息 -->
        <div class="rounded-xl overflow-hidden mb-6" 
             style="background-color: var(--card-bg); box-shadow: var(--shadow-lg);">
          <div class="p-6" style="background-color: var(--primary); color: white;">
            <h1 class="text-2xl font-bold mb-2">{{ test.title }}</h1>
            <p style="color: rgba(255,255,255,0.9);">{{ test.instructions }}</p>
            <p class="text-sm mt-2" style="color: rgba(255,255,255,0.7);">
              ⚠️ 请根据您的真实感受作答，共 {{ totalQuestions }} 题
            </p>
          </div>
          
          <!-- 题目列表（当前页） -->
          <div class="p-6 space-y-8">
            <div v-for="(question, index) in currentPageQuestions" :key="question.id"
                 class="border-b last:border-0 pb-6 last:pb-0"
                 style="border-color: var(--primary-light);">
              <p class="text-lg font-semibold mb-4" style="color: var(--text);">
                {{ getGlobalQuestionNumber(question.id) }}. {{ question.text }}
              </p>
              
              <div class="space-y-3">
                <label v-for="option in question.options" :key="option.value"
                       class="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200"
                       :class="{ 'border-2': answers[question.id] === option.value }"
                       :style="{
                         backgroundColor: answers[question.id] === option.value ? 'var(--primary-light)' : 'var(--bg)',
                         borderColor: answers[question.id] === option.value ? 'var(--primary)' : 'transparent'
                       }">
                  <input type="radio"
                         :name="`q${question.id}`"
                         :value="option.value"
                         v-model="answers[question.id]"
                         class="w-4 h-4 mr-3"
                         :style="{ accentColor: 'var(--primary)' }">
                  <span style="color: var(--text);">{{ option.label }}</span>
                </label>
              </div>
            </div>
          </div>
          
          <!-- 分页导航按钮 -->
          <div class="p-6 flex justify-between gap-4" style="background-color: var(--bg);">
            <button @click="prevPage" 
                    class="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    :style="{
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-secondary)',
                      boxShadow: 'var(--shadow-sm)'
                    }">
                {{ currentPage === 1 ? '返回首页' : '上一页 ←' }}
            </button>
            
            <button v-if="!isLastPage" 
                    @click="nextPage" 
                    :disabled="!canGoToNextPage"
                    class="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    :style="{
                      backgroundColor: canGoToNextPage ? 'var(--primary)' : 'var(--text-muted)',
                      color: 'white',
                      boxShadow: 'var(--shadow-sm)'
                    }">
              下一页 →
            </button>
            
            <button v-else 
                    @click="submitTest"
                    :disabled="!isComplete"
                    class="flex-1 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    :style="{
                      backgroundColor: isComplete ? 'var(--primary)' : 'var(--text-muted)',
                      color: 'white',
                      boxShadow: 'var(--shadow-sm)'
                    }">
              {{ isComplete ? '提交测评' : `还需完成 ${remainingCount} 题` }}
            </button>
          </div>
        </div>
        
        <!-- 快速跳转提示（仅当页数较多时显示） -->
        <div v-if="totalPages > 5" class="text-center">
          <div class="inline-flex gap-2 flex-wrap justify-center">
            <button v-for="page in visiblePages" 
                    :key="page"
                    @click="goToPage(page)"
                    class="w-10 h-10 rounded-lg transition-all"
                    :style="{
                      backgroundColor: currentPage === page ? 'var(--primary)' : 'var(--card-bg)',
                      color: currentPage === page ? 'white' : 'var(--text-secondary)',
                      boxShadow: 'var(--shadow-sm)'
                    }">
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnswerStore } from '~/stores/answer'

const route = useRoute()
const router = useRouter()
const testId = route.params.id as string
const answerStore = useAnswerStore()
const { $confirm, $toast } = useNuxtApp()

// 每页显示题目数
const QUESTIONS_PER_PAGE = 10

// 获取题库数据
const { data: response, error } = await useFetch(`/api/tests/${testId}`)
const test = computed(() => response.value?.data)

// 使用 pinia 存储答案
const answers = ref<Record<number, number>>({})

// 分页相关
const currentPage = ref(1)

// 所有题目
const allQuestions = computed(() => test.value?.questions || [])
const totalQuestions = computed(() => allQuestions.value.length)
const totalPages = computed(() => Math.ceil(totalQuestions.value / QUESTIONS_PER_PAGE))

// 当前页显示的题目
const currentPageQuestions = computed(() => {
  const start = (currentPage.value - 1) * QUESTIONS_PER_PAGE
  const end = start + QUESTIONS_PER_PAGE
  return allQuestions.value.slice(start, end)
})

// 计算全局题号
const getGlobalQuestionNumber = (questionId: number) => {
  return questionId
}

// 计算已答题数
const answeredCount = computed(() => Object.keys(answers.value).length)
const remainingCount = computed(() => totalQuestions.value - answeredCount.value)
const isComplete = computed(() => answeredCount.value === totalQuestions.value && totalQuestions.value > 0)

// 当前页是否已全部作答
const isCurrentPageComplete = computed(() => {
  const currentIds = currentPageQuestions.value.map(q => q.id)
  return currentIds.every(id => answers.value[id] !== undefined)
})

// 是否可以进入下一页
const canGoToNextPage = computed(() => {
  // 如果不是最后一页，必须答完当前页所有题目才能进入下一页
  return isCurrentPageComplete.value
})

// 是否是最后一页
const isLastPage = computed(() => currentPage.value === totalPages.value)

// 总进度
const progress = computed(() => (answeredCount.value / totalQuestions.value) * 100 || 0)

// 页码
const visiblePages = computed(() => {
  const range: number[] = []
  for (let i = 1; i <= totalPages.value; i++) {
      range.push(i)
  }
  return range
})

// 初始化时加载已保存的答案
onMounted(() => {
  const savedAnswers = answerStore.getAnswers()
  if (savedAnswers && Object.keys(savedAnswers).length > 0) {
    answers.value = { ...savedAnswers }
  }
})

// 监听答案变化，自动保存
watch(answers, (newAnswers) => {
  Object.entries(newAnswers).forEach(([id, value]) => {
    answerStore.setAnswer(parseInt(id), value)
  })
}, { deep: true })

// 分页导航函数
function nextPage() {
  if (canGoToNextPage.value && currentPage.value < totalPages.value) {
    currentPage.value++
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (!isCurrentPageComplete.value) {
    $toast.error(`请先完成当前页的所有题目（第${currentPage.value}页）再继续`)
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  else {
    // 如果在第一页返回首页
    goBack()
  }
}

function goToPage(page: number) {
  if (page === currentPage.value) return
  
  // 检查是否允许跳转
  if (page < currentPage.value) {
    // 向后跳转允许
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    // 向前检查当前页是否完成
    if (isCurrentPageComplete.value) {
      currentPage.value = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      $toast.error(`请先完成第${currentPage.value}页的所有题目再跳转`)
    }
  }
}

// 提交测评
async function submitTest() {
  if (!isComplete.value) {
    $toast.warning(`请完成所有题目后再提交（还剩 ${remainingCount.value} 题）`, '提示')
    return
  }
  
  $confirm({
    title: '确认提交',
    message: '确定要提交测评吗？提交后将无法修改答案。',
    onConfirm: async () => {
      try {
        $toast.info('正在提交中，请稍候...', '提交中')
        
        const { data } = await useFetch('/api/submit', {
          method: 'POST',
          body: {
            testId,
            answers: answers.value
          }
        })
        
        if (data.value?.success) {
          answerStore.setResult(data.value.data)
          
          sessionStorage.removeItem(`test_${testId}_answers`)
          answerStore.clearSession() // 清除当前测评的 session

          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('refreshProgress'))
          }
          
          $toast.success('测评提交成功！', '完成')
          await router.push('/result')
        }
      } catch (error) {
        console.error('提交失败', error)
        $toast.error('提交失败，请稍后重试', '错误')
      }
    }
  })
}

// 错误处理
if (error.value) {
  console.error('加载测评失败', error.value)
  router.push('/')
}

// 退出确认
function goBack() {
  if (answeredCount.value > 0 && !isComplete.value) {
    $confirm({
      title: '确认退出',
      message: '您有未完成的测评，确定要退出吗？您的进度会自动保存，下次可以继续答题。',
      onConfirm: () => {
        router.push('/')
      },
      onCancel: () => {
      }
    })
  } else {
    router.push('/')
  }
}

// 页面卸载时保存进度
onBeforeUnmount(() => {
  if (Object.keys(answers.value).length > 0 && !isComplete.value) {
    answerStore.saveToSession()
  }
})

// 组件挂载时恢复进度
onMounted(() => {
  const savedAnswers = answerStore.getAnswers()
  if (savedAnswers && Object.keys(savedAnswers).length > 0) {
    answers.value = { ...savedAnswers }
    // 如果有保存的答案，跳转到最后未完成的页面
    if (Object.keys(savedAnswers).length > 0 && totalQuestions.value > 0) {
      const lastAnsweredId = Math.max(...Object.keys(savedAnswers).map(Number))
      const questionIndex = allQuestions.value.findIndex((q: { id: number }) => q.id === lastAnsweredId)
      const completedCount = Object.keys(savedAnswers).length
      $toast.info(`已加载上次进度: ${completedCount}/${totalQuestions.value} 题`, '继续答题')
      if (questionIndex !== -1) {
        currentPage.value = Math.floor(questionIndex / QUESTIONS_PER_PAGE) + 1
      }
    }
  }
})
</script>