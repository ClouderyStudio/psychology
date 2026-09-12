<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg);">
    <div class="container mx-auto px-4 max-w-3xl">
      <ClientOnly>
        <!-- 页面标题 -->
        <div class="text-center mb-10">
          <h1 class="text-3xl md:text-4xl font-bold mb-3" style="color: var(--text);">
            测试<span class="accent" style="color: var(--primary);">历史</span>
          </h1>
          <p class="text-base" style="color: var(--text-secondary);">
            这里记录了你在本设备上完成过的所有测评结果
          </p>
        </div>

        <!-- 加载中 -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="text-lg" style="color: var(--text-secondary);">加载中...</div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="historyList.length === 0" class="text-center py-16">
          <div class="text-5xl mb-4">🗒️</div>
          <div class="text-xl font-medium mb-2" style="color: var(--text);">暂无测试记录</div>
          <p class="text-sm mb-6" style="color: var(--text-secondary);">
            完成任意一份量表后，结果会自动保存在这里
          </p>
          <button @click="goHome" class="px-6 py-2.5 rounded-lg font-medium transition-all"
            :style="{ backgroundColor: 'var(--primary)', color: 'white', boxShadow: 'var(--shadow-sm)' }">
            去挑选一份量表
          </button>
        </div>

        <!-- 历史列表 -->
        <div v-else class="space-y-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm" style="color: var(--text-muted);">共 {{ historyList.length }} 条记录</span>
            <button @click="clearAllHistory" class="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style="background-color: var(--warning-bg); color: var(--warning-text);">
              清空全部
            </button>
          </div>

          <div v-for="item in historyList" :key="item.testId"
            class="rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-0.5"
            style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
            <div class="p-5">
              <div class="flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style="background-color: var(--primary-light);">
                    📊
                  </div>
                  <div>
                    <h3 class="font-semibold" style="color: var(--text);">{{ item.testTitle }}</h3>
                    <p class="text-xs mt-0.5" style="color: var(--text-muted);">
                      完成时间：{{ formatTime(item.timestamp) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold" style="color: var(--primary);">{{ item.displayScore }}</div>
                  <div class="text-xs mt-0.5" style="color: var(--text-secondary);">{{ item.level }}</div>
                </div>
              </div>
              <p v-if="item.note" class="mt-3 text-sm leading-relaxed"
                style="color: var(--text-secondary); border-left: 3px solid var(--primary-light); padding-left: 10px;">
                {{ item.note }}
              </p>
              <div class="flex gap-3 mt-4">
                <button @click="viewResult(item)"
                  class="flex-1 py-2 rounded-lg font-medium transition-all"
                  :style="{ backgroundColor: 'var(--primary)', color: 'white' }"
                  @mouseenter="setButtonBg($event, 'var(--primary-dark)')"
                  @mouseleave="setButtonBg($event, 'var(--primary)')">
                  查看详细报告 →
                </button>
                <button @click="removeHistory(item)"
                  class="px-4 py-2 rounded-lg text-sm transition-colors"
                  style="background-color: var(--bg); color: var(--text-secondary);">
                  删除
                </button>
              </div>
            </div>
          </div>

          <p class="text-xs text-center mt-6" style="color: var(--text-muted);">
            记录仅保存在当前浏览器的会话中，关闭浏览器后会自动清除
          </p>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnswerStore } from '~/stores/answer'

const router = useRouter()
const { $toast, $confirm } = useNuxtApp()
const answerStore = useAnswerStore()

interface HistoryItem {
  testId: string
  testTitle: string
  totalScore: number
  maxScore: number
  level: string
  severity: number
  timestamp: string
  note: string
  displayScore: string
  raw: any
}

const historyList = ref<HistoryItem[]>([])
const isLoading = ref(true)

// 无总分的量表（如 MBTI、多维自评）展示类型 / 等级而非数字分；
// 清单统一来自 app/utils/test-display.ts，避免与结果页、首页卡片漂移
const buildDisplayScore = (r: any) => formatResultScore(r)

const loadHistory = () => {
  isLoading.value = true
  const list: HistoryItem[] = []
  if (typeof window !== 'undefined') {
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        const match = key?.match(/^test_(.+)_result$/)
        if (!match || !key) continue
        try {
          const raw = JSON.parse(sessionStorage.getItem(key)!)
          if (!raw?.testId) continue
          list.push({
            testId: raw.testId,
            testTitle: raw.testTitle || raw.testId,
            totalScore: raw.totalScore,
            maxScore: raw.maxScore,
            level: raw.level || '',
            severity: raw.severity,
            timestamp: raw.timestamp || 0,
            note: raw.note || '',
            displayScore: buildDisplayScore(raw),
            raw
          })
        } catch (e) {
          console.error(`解析测评记录 ${key} 失败`, e)
        }
      }
    } catch (e) {
      console.error('加载测评记录失败', e)
    }
  }
  list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  historyList.value = list
  isLoading.value = false
}

const formatTime = (ts: string) => {
  if (!ts) return '未知时间'
  return new Date(ts).toLocaleString('zh-CN')
}

const viewResult = (item: HistoryItem) => {
  answerStore.setResult(item.raw)
  router.push('/result')
}

const removeHistory = (item: HistoryItem) => {
  $confirm({
    title: '删除记录',
    message: `确定要删除「${item.testTitle}」的测评记录吗？此操作不可恢复。`,
    onConfirm: () => {
      sessionStorage.removeItem(`test_${item.testId}_result`)
      // 若该记录正被"最近一次结果"引用，则一并清除，避免首页卡片与历史不一致
      const last = answerStore.getLastResult()
      if (last?.testId === item.testId) answerStore.clearLastResult()
      loadHistory()
      $toast.success('已删除该条记录', '完成')
    }
  })
}

const clearAllHistory = () => {
  $confirm({
    title: '清空历史',
    message: '确定要清空所有测评记录吗？此操作不可恢复。',
    onConfirm: () => {
      const keys: string[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key?.match(/^test_.+_result$/)) keys.push(key)
      }
      keys.forEach(key => sessionStorage.removeItem(key))
      answerStore.clearLastResult()
      loadHistory()
      $toast.success(`已清空 ${keys.length} 条测评记录`, '完成')
    }
  })
}

const setButtonBg = (event: Event, color: string) => {
  const target = event.currentTarget
  if (target instanceof HTMLElement) {
    target.style.backgroundColor = color
  }
}

const goHome = () => {
  router.push('/')
}

onMounted(() => {
  loadHistory()
})
</script>
