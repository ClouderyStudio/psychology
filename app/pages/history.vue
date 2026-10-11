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
            {{ subtitle }}
          </p>
        </div>

        <!-- 云端同步状态：未登录引导登录，已登录显示同步入口 -->
        <div class="mb-6 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3"
          style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
          <div class="text-sm" style="color: var(--text-secondary);">
            <template v-if="!auth.isAuthed.value">
              ☁️ 记录目前只保存在本设备。
              <NuxtLink to="/login?return=%2Fhistory" style="color: var(--primary);">
                登录后可在手机、电脑等多平台共享
              </NuxtLink>
            </template>
            <template v-else>
              ☁️ 已开启云端同步（{{ auth.user.value?.username || '已登录' }} · 云端 {{ cloud.total.value }} 条）
              <NuxtLink to="/account" class="ml-1" style="color: var(--primary);">管理账号</NuxtLink>
            </template>
          </div>
          <button v-if="auth.isAuthed.value" class="text-xs px-3 py-1.5 rounded-lg transition-colors"
            :disabled="cloud.syncing.value"
            :style="{
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              cursor: cloud.syncing.value ? 'wait' : 'pointer',
            }"
            @click="syncCloud">
            {{ cloud.syncing.value ? '同步中…' : '立即同步' }}
          </button>
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
          <div class="flex justify-between items-center mb-2 flex-wrap gap-2">
            <span class="text-sm" style="color: var(--text-muted);">
              共 {{ visibleHistory.length }} 条记录<template v-if="filterTestId">（全部 {{ historyList.length }} 条）</template>
            </span>
            <button @click="clearAllHistory" class="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style="background-color: var(--warning-bg); color: var(--warning-text);">
              清空全部
            </button>
          </div>

          <!-- 筛选 / 排序 / 导出：记录多起来以后，只靠时间倒序列表找一条很费劲 -->
          <div class="flex flex-wrap items-center gap-2 text-sm mb-2">
            <label class="sr-only" for="history-filter">按量表筛选</label>
            <select id="history-filter" v-model="filterTestId"
              class="px-3 py-1.5 rounded-lg text-sm"
              style="background-color: var(--card-bg); color: var(--text); box-shadow: var(--shadow-sm);">
              <option value="">全部量表</option>
              <option v-for="opt in testOptions" :key="opt.id" :value="opt.id">{{ opt.title }}</option>
            </select>
            <button @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'"
              class="px-3 py-1.5 rounded-lg text-sm"
              style="background-color: var(--card-bg); color: var(--text-secondary); box-shadow: var(--shadow-sm);">
              {{ sortOrder === 'desc' ? '↓ 最新在前' : '↑ 最早在前' }}
            </button>
            <span class="flex-1"></span>
            <button @click="exportCsv" class="px-3 py-1.5 rounded-lg text-sm"
              style="background-color: var(--card-bg); color: var(--text-secondary); box-shadow: var(--shadow-sm);">
              ⬇️ 导出 CSV
            </button>
            <button @click="exportJson" class="px-3 py-1.5 rounded-lg text-sm"
              style="background-color: var(--card-bg); color: var(--text-secondary); box-shadow: var(--shadow-sm);">
              ⬇️ 导出 JSON
            </button>
            <!-- 趋势入口：完整折线在 /trends 页面，这里只做跳转并把当前筛选的量表带过去 -->
            <NuxtLink v-if="hasTrends" :to="trendTarget"
              class="px-3 py-1.5 rounded-lg text-sm"
              style="background-color: var(--primary-light); color: var(--primary);">
              📈 分数趋势
            </NuxtLink>
          </div>

          <div v-for="item in visibleHistory" :key="item.key"
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

                <!-- 有总分的量表先给出总分：PHQ-9 / GAD-7 等只有展示卡、没有可比较维度，
                     若只渲染维度差值，面板会只剩一行甚至空白，看不出真实变化 -->
                <div v-if="hasTotalRow(compareRows)" class="flex items-center gap-3 text-sm font-medium">
                  <span class="flex-1 truncate" style="color: var(--text-secondary);">总分</span>
                  <span class="tabular-nums text-xs" style="color: var(--text-muted);">
                    {{ formatValue(Number(compareRows.prev.raw?.totalScore ?? 0)) }} → {{ formatValue(Number(compareRows.cur.raw?.totalScore ?? 0)) }}
                  </span>
                  <span class="tabular-nums w-16 text-right font-medium"
                    :style="{ color: deltaColor(totalDelta) }">
                    {{ formatDelta(totalDelta) }}
                  </span>
                </div>

                <div v-if="compareRows.deltas.length" class="space-y-2 mt-2">
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
                <p v-else-if="hasTotalRow(compareRows)" class="text-xs mt-2" style="color: var(--text-muted);">
                  本量表没有可逐项比较的维度，只对比总分。
                </p>
                <p v-else class="text-sm" style="color: var(--text-secondary);">
                  这份量表按类型 / 等级展示，两次结果之间没有可比较的数值。
                </p>

                <p class="text-xs mt-3 leading-relaxed" style="color: var(--text-muted);">
                  数值差异来自两次自评的作答，不等于真实变化：情绪、睡眠与近期压力都会影响自评，
                  同一份量表在短期内出现 0.2 以内的波动属于常见范围。请结合时间跨度与生活事件理解。
                </p>
              </div>
            </div>
          </div>

          <p class="text-xs text-center mt-6" style="color: var(--text-muted);">
            <template v-if="auth.isAuthed.value">
              记录同时保存在本机浏览器与你的云端账号（按登录用户隔离，别人读不到），可随时删除；
              清除浏览器数据只会清掉本机这一份
            </template>
            <template v-else>
              记录保存在本机浏览器中（不上传服务器），可随时删除；清除浏览器数据会一并清除这些记录
            </template>
          </p>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnswerStore } from '~/stores/answer'
import { buildTrendGroups, formatDelta, formatTrendValue } from '~/utils/trends'
import { formatResultScore, isTypeOnlyTest } from '~/utils/test-display'

const router = useRouter()
const route = useRoute()
const { $toast, $confirm } = useNuxtApp()
const answerStore = useAnswerStore()
// 云端存档状态：未登录时下面是引导，登录后是同步入口（见 plugins/cloud-sync.client.ts）
const auth = useAuth()
const cloud = useCloudSync()

const subtitle = computed(() =>
  auth.isAuthed.value
    ? '这里记录了你在这台设备与云端账号里的所有测评结果'
    : '这里记录了你在本设备上完成过的所有测评结果',
)

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

/* ===== 筛选 / 排序 ===== */

const filterTestId = ref('')
const sortOrder = ref<'desc' | 'asc'>('desc')

// 每个量表的第 N 次编号（attempt）始终按时间正序算好，不随筛选/排序变化
const testOptions = computed(() => {
  const map = new Map<string, string>()
  for (const item of historyList.value) {
    if (!map.has(item.testId)) map.set(item.testId, item.testTitle || item.testId)
  }
  return [...map.entries()]
    .map(([id, title]) => ({ id, title }))
    .sort((a, b) => a.title.localeCompare(b.title, 'zh'))
})

const visibleHistory = computed(() => {
  const list = filterTestId.value
    ? historyList.value.filter((i) => i.testId === filterTestId.value)
    : historyList.value
  if (sortOrder.value === 'asc') return [...list].reverse()
  return list
})

/* ===== 分数趋势入口 ===== */

// 只判断「有没有值得看趋势的量表」，折线本身在 /trends 页面。
// 分组逻辑放在 app/utils/trends.ts（纯函数，可直接单测）。
const hasTrends = computed(
  () =>
    buildTrendGroups(listResultRecords(), {
      isTypeOnly: isTypeOnlyTest,
      formatScore: formatResultScore,
    }).length > 0,
)

// 带当前筛选过去：从历史页点进去时不该又看到全部量表
const trendTarget = computed(() =>
  filterTestId.value ? { path: '/trends', query: { test: filterTestId.value } } : '/trends',
)

/* ===== 导出 ===== */

// CSV 里的字段可能含逗号、引号或换行，统一按 RFC 4180 转义
const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`

const exportRows = () => visibleHistory.value.map((i) => ({
  testTitle: i.testTitle,
  testId: i.testId,
  attempt: i.attempt,
  time: i.timestamp ? new Date(i.timestamp).toLocaleString('zh-CN') : '',
  score: i.displayScore,
  totalScore: i.raw?.totalScore ?? '',
  maxScore: i.raw?.maxScore ?? '',
  level: i.level,
  severity: i.raw?.severity ?? ''
}))

const downloadFile = (filename: string, content: string, mime: string) => {
  const blob = new Blob(['﻿' + content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // 交给浏览器读完之后再撤销，立刻撤销在部分浏览器会取消下载
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const stamp = () => new Date().toISOString().slice(0, 10)

const exportCsv = () => {
  const rows = exportRows()
  if (!rows.length) {
    $toast.warning('当前筛选下没有可导出的记录', '提示')
    return
  }
  const head = ['量表', '量表标识', '第几次', '完成时间', '分数', '总分', '满分', '等级', '严重程度']
  const body = rows.map((r) => [r.testTitle, r.testId, r.attempt, r.time, r.score, r.totalScore, r.maxScore, r.level, r.severity].map(csvCell).join(','))
  downloadFile(`测评历史_${stamp()}.csv`, [head.join(','), ...body].join('\r\n'), 'text/csv')
  $toast.success(`已导出 ${rows.length} 条记录`, '完成')
}

// JSON 保留完整结果对象（含维度分与建议），便于长期归档或二次分析
const exportJson = () => {
  const items = visibleHistory.value
  if (!items.length) {
    $toast.warning('当前筛选下没有可导出的记录', '提示')
    return
  }
  const payload = {
    exportedAt: new Date().toISOString(),
    count: items.length,
    records: items.map((i) => ({
      resultKey: i.key,
      testId: i.testId,
      testTitle: i.testTitle,
      attempt: i.attempt,
      timestamp: i.timestamp,
      ...i.raw
    }))
  }
  downloadFile(`测评历史_${stamp()}.json`, JSON.stringify(payload, null, 2), 'application/json')
  $toast.success(`已导出 ${items.length} 条记录`, '完成')
}

/* ===== 两次测评对比 ===== */

// 类型型量表（MBTI / 多维自评 / ECR-R 等）的 totalScore 不是分数，对比总分是误导；
// maxScore 为 0 时同样没有可比区间，此时对比面板只列维度差异
const hasTotalRow = (rows: { prev: HistoryItem; cur: HistoryItem }) => {
  const cur = rows.cur
  if (isTypeOnlyTest(cur.testId)) return false
  const max = Number(cur.raw?.maxScore ?? 0)
  return Number.isFinite(max) && max > 0
}

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

// 与趋势页共用同一套收敛规则（最多两位小数）：多维自评量表的维度值是归一化浮点，
// 本地各写一份容易漂移，这里直接复用 formatTrendValue；formatDelta / deltaColor
// 同样来自 ~/utils/trends，两页行为一致。
const formatValue = formatTrendValue

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
    onConfirm: async () => {
      const cloudId = item.raw?.cloudId
      if (auth.isAuthed.value && typeof cloudId === 'string' && cloudId) {
        // 云端与本机一起删；只删本机的话，下一次同步会把它传回云端（看起来像删不掉）
        await cloud.removeEverywhere(cloudId, item.key)
      } else {
        removeResultRecord(item.key)
      }
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
    message: auth.isAuthed.value
      ? '确定要清空所有测评记录吗？本机与云端账号中的记录都会被删除，此操作不可恢复。'
      : '确定要清空所有测评记录吗？此操作不可恢复。',
    onConfirm: async () => {
      const count = clearResultRecords()
      if (auth.isAuthed.value) await cloud.clearCloud()
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

/** 手动同步：拉回云端记录后刷新列表 */
async function syncCloud(): Promise<void> {
  const summary = await cloud.syncNow()
  loadHistory()
  if (summary) $toast.success(`已同步：上传 ${summary.uploaded} 条，云端共 ${summary.total} 条`, '完成')
  else if (cloud.error.value) $toast.error(cloud.error.value, '同步失败')
}

onMounted(async () => {
  cloud.init()
  // 从结果页「历年趋势」跳来时，预先筛出该量表
  const q = route.query.test
  if (typeof q === 'string' && q) filterTestId.value = q
  loadHistory()

  // 登录状态下先把云端记录补齐（换设备后第一次打开就能看到全部历史），再重新渲染列表
  if (auth.status.value === 'unknown') await auth.refresh()
  if (auth.isAuthed.value && cloud.autoSync.value) {
    await cloud.syncNow()
    loadHistory()
  }
})
</script>
