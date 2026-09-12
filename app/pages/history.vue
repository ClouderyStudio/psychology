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

          <div v-for="item in historyList" :key="item.key"
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
                    <h3 class="font-semibold" style="color: var(--text);">
                      {{ item.testTitle }}
                      <span v-if="item.attempt > 1" class="text-xs font-normal px-2 py-0.5 rounded-full ml-1"
                        style="background-color: var(--primary-light); color: var(--primary);">
                        第 {{ item.attempt }} 次
                      </span>
                    </h3>
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
                <button v-if="hasPrevious(item)" @click="toggleCompare(item)"
                  class="px-4 py-2 rounded-lg text-sm transition-colors"
                  style="background-color: var(--primary-light); color: var(--primary);">
                  {{ compareKey === item.key ? '收起对比' : '与上一次对比' }}
                </button>
                <button @click="removeHistory(item)"
                  class="px-4 py-2 rounded-lg text-sm transition-colors"
                  style="background-color: var(--bg); color: var(--text-secondary);">
                  删除
                </button>
              </div>

              <!-- 两次测评对比：同一量表在本机留存的最近两条记录 -->
              <div v-if="compareKey === item.key && compareRows" class="mt-4 pt-4"
                style="border-top: 1px solid var(--border);">
                <p class="text-xs mb-3" style="color: var(--text-muted);">
                  {{ formatTime(compareRows.prev.timestamp) }}
                  <span class="mx-1">→</span>
                  {{ formatTime(compareRows.cur.timestamp) }}
                </p>

                <div v-if="compareRows.deltas.length" class="space-y-2">
                  <div v-for="row in compareRows.deltas" :key="row.trait"
                    class="flex items-center gap-3 text-sm">
                    <span class="flex-1 truncate" style="color: var(--text-secondary);">{{ row.label }}</span>
                    <span class="tabular-nums text-xs" style="color: var(--text-muted);">
                      {{ formatValue(row.from) }} → {{ formatValue(row.to) }}
                    </span>
                    <span class="tabular-nums w-16 text-right font-medium"
                      :style="{ color: deltaColor(row.delta) }">
                      {{ formatDelta(row.delta) }}
                    </span>
                  </div>
                </div>
                <p v-else class="text-sm" style="color: var(--text-secondary);">
                  两次总分：{{ item.raw?.totalScore ?? '—' }} → {{ compareRows.cur.raw?.totalScore ?? '—' }}
                  <span class="ml-2 font-medium" :style="{ color: deltaColor(totalDelta) }">
                    {{ formatDelta(totalDelta) }}
                  </span>
                </p>

                <p class="text-xs mt-3 leading-relaxed" style="color: var(--text-muted);">
                  数值差异来自两次自评的作答，不等于真实变化：情绪、睡眠与近期压力都会影响自评，
                  同一份量表在短期内出现 0.2 以内的波动属于常见范围。请结合时间跨度与生活事件理解。
                </p>
              </div>
            </div>
          </div>

          <p class="text-xs text-center mt-6" style="color: var(--text-muted);">
            记录保存在本机浏览器中（不上传服务器），可随时删除；清除浏览器数据会一并清除这些记录
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
  /** 本机存档键，一条测评一个键（同一量表可有多条） */
  key: string
  testId: string
  testTitle: string
  totalScore: number
  maxScore: number
  level: string
  severity: number
  timestamp: string
  note: string
  displayScore: string
  /** 该量表的第几次测评（按时间正序编号），用于「第 N 次」标记 */
  attempt: number
  raw: any
}

const historyList = ref<HistoryItem[]>([])
const isLoading = ref(true)

// 无总分的量表（如 MBTI、多维自评）展示类型 / 等级而非数字分；
// 清单统一来自 app/utils/test-display.ts，避免与结果页、首页卡片漂移
const buildDisplayScore = (r: any) => formatResultScore(r)

const loadHistory = () => {
  isLoading.value = true
  // 结果存在 localStorage（一次测评一条），sessionStorage 只放进行中的作答进度
  answerStore.migrateLegacyResults()

  const list: HistoryItem[] = listResultRecords().map(({ key, result }) => ({
    key,
    testId: result.testId,
    testTitle: result.testTitle || result.testId,
    totalScore: result.totalScore,
    maxScore: result.maxScore,
    level: result.level || '',
    severity: result.severity,
    timestamp: result.timestamp || 0,
    note: result.note || '',
    displayScore: buildDisplayScore(result),
    attempt: 0,
    raw: result
  }))

  // 编号按时间正序计算（列表本身是时间倒序展示）
  const seen = new Map<string, number>()
  for (const item of [...list].reverse()) {
    const n = (seen.get(item.testId) ?? 0) + 1
    seen.set(item.testId, n)
    item.attempt = n
  }

  historyList.value = list
  isLoading.value = false
}

/* ===== 两次测评对比 ===== */

const compareKey = ref<string | null>(null)

// 同量表的上一条记录：列表为时间倒序，取该条之后的第一条同量表记录
const previousOf = (item: HistoryItem): HistoryItem | null => {
  const idx = historyList.value.findIndex((i) => i.key === item.key)
  if (idx < 0) return null
  return historyList.value.slice(idx + 1).find((i) => i.testId === item.testId) || null
}

const hasPrevious = (item: HistoryItem) => previousOf(item) !== null

const toggleCompare = (item: HistoryItem) => {
  compareKey.value = compareKey.value === item.key ? null : item.key
}

const compareRows = computed(() => {
  if (!compareKey.value) return null
  const item = historyList.value.find((i) => i.key === compareKey.value)
  if (!item) return null
  const prev = previousOf(item)
  if (!prev) return null
  return { cur: item, prev, deltas: dimensionDeltas(prev.raw, item.raw) }
})

const totalDelta = computed(() => {
  const rows = compareRows.value
  if (!rows) return 0
  const a = Number(rows.prev.raw?.totalScore ?? 0)
  const b = Number(rows.cur.raw?.totalScore ?? 0)
  return Math.round((b - a) * 100) / 100
})

const formatValue = (v: number) => (v > 0 && v < 1 ? v.toFixed(2) : String(Math.round(v * 100) / 100))
const formatDelta = (v: number) => (v > 0 ? `+${formatValue(v)}` : formatValue(v))
// 「变好」不总是数值下降（自尊、睡眠质量类量表越高越好），因此只标方向、不下好坏结论
const deltaColor = (v: number) =>
  v > 0 ? 'var(--primary)' : v < 0 ? 'var(--text-secondary)' : 'var(--text-muted)'

const formatTime = (ts: string) => {
  if (!ts) return '未知时间'
  return new Date(ts).toLocaleString('zh-CN')
}

// 直接带记录键跳转：结果页按键装载该条记录，不会新建一条重复记录
const viewResult = (item: HistoryItem) => {
  router.push({ path: '/result', query: { key: item.key } })
}

const removeHistory = (item: HistoryItem) => {
  $confirm({
    title: '删除记录',
    message: `确定要删除「${item.testTitle}」${item.attempt > 1 ? `第 ${item.attempt} 次` : ''}的测评记录吗？此操作不可恢复。`,
    onConfirm: () => {
      removeResultRecord(item.key)
      // 若该记录正被「最近一次结果」引用，removeResultRecord 会自动回退到剩余最新一条
      answerStore.clearResultCache()
      if (compareKey.value === item.key) compareKey.value = null
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
      const count = clearResultRecords()
      answerStore.clearResultCache()
      compareKey.value = null
      loadHistory()
      $toast.success(`已清空 ${count} 条测评记录`, '完成')
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
