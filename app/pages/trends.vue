<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg);">
    <div class="container mx-auto px-4 max-w-3xl">
      <ClientOnly>
        <!-- 页面标题 -->
        <div class="text-center mb-10">
          <h1 class="text-3xl md:text-4xl font-bold mb-3" style="color: var(--text);">
            分数<span class="accent" style="color: var(--primary);">趋势</span>
          </h1>
          <p class="text-base" style="color: var(--text-secondary);">
            把同一份量表的历次结果连起来看走向；只有真正有分数的量表才画折线
          </p>
        </div>

        <!-- 加载中 -->
        <div v-if="isLoading" class="text-center py-12">
          <div class="text-lg" style="color: var(--text-secondary);">加载中...</div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="groups.length === 0" class="text-center py-16">
          <div class="text-5xl mb-4">📈</div>
          <div class="text-xl font-medium mb-2" style="color: var(--text);">暂无可对比的记录</div>
          <p class="text-sm mb-6" style="color: var(--text-secondary);">
            同一份量表完成两次以上，这里才会出现趋势
          </p>
          <button @click="router.push('/')" class="px-6 py-2.5 rounded-lg font-medium transition-all"
            :style="{ backgroundColor: 'var(--primary)', color: 'white', boxShadow: 'var(--shadow-sm)' }">
            去挑选一份量表
          </button>
        </div>

        <template v-else>
          <!-- 量表筛选 -->
          <div class="flex flex-wrap items-center gap-2 text-sm mb-6">
            <label class="sr-only" for="trend-filter">按量表筛选</label>
            <select id="trend-filter" v-model="filterTestId" class="px-3 py-1.5 rounded-lg text-sm"
              style="background-color: var(--card-bg); color: var(--text); box-shadow: var(--shadow-sm);">
              <option value="">全部量表</option>
              <option v-for="g in groups" :key="g.testId" :value="g.testId">{{ g.testTitle }}</option>
            </select>
            <span class="text-xs" style="color: var(--text-muted);">
              共 {{ visibleGroups.length }} 张量表有两次以上记录
            </span>
            <span class="flex-1"></span>
            <NuxtLink to="/history" class="px-3 py-1.5 rounded-lg text-sm"
              style="background-color: var(--card-bg); color: var(--text-secondary); box-shadow: var(--shadow-sm);">
              🕘 测试历史
            </NuxtLink>
          </div>

          <!-- 每张量表一张卡 -->
          <div v-for="group in visibleGroups" :key="group.testId" class="rounded-xl p-5 mb-5"
            style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
            <div class="flex items-baseline justify-between flex-wrap gap-2">
              <h2 class="text-lg font-semibold" style="color: var(--text);">{{ group.testTitle }}</h2>
              <span class="text-xs" style="color: var(--text-muted);">
                {{ group.records.length }} 次记录 · {{ formatTime(firstTs(group.records)) }}
                <span class="mx-1">→</span>{{ formatTime(lastTs(group.records)) }}
              </span>
            </div>

            <!-- 有真实总分的量表：总分折线 -->
            <div v-if="group.scored" class="mt-4">
              <div class="flex items-center justify-between text-xs mb-1" style="color: var(--text-muted);">
                <span>总分（满分 {{ group.maxScore }}）</span>
                <span>
                  {{ formatValue(firstValue(group.totalSeries)) }} → {{ formatValue(lastValue(group.totalSeries)) }}
                  <span class="ml-1 font-medium" :style="{ color: deltaColor(group.totalDelta) }">
                    {{ formatDelta(group.totalDelta) }}
                  </span>
                </span>
              </div>
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" class="w-full h-16" role="img"
                :aria-label="group.testTitle + ' 各次测评总分变化'">
                <polyline :points="chartPoints(group.totalSeries.map((p) => p.value))" fill="none"
                  stroke="var(--primary)" stroke-width="1.5" vector-effect="non-scaling-stroke" />
              </svg>
            </div>

            <!-- 各维度折线：多维量表与分维度量表在这里看走向 -->
            <div v-if="group.dimSeries.length" class="mt-4 space-y-3">
              <div v-for="dim in group.dimSeries" :key="dim.key">
                <div class="flex items-center justify-between text-xs mb-1" style="color: var(--text-muted);">
                  <span>{{ dim.label }}</span>
                  <span>
                    {{ formatValue(firstValue(dim.points)) }} → {{ formatValue(lastValue(dim.points)) }}
                    <span class="ml-1 font-medium" :style="{ color: deltaColor(dim.delta) }">
                      {{ formatDelta(dim.delta) }}
                    </span>
                  </span>
                </div>
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" class="w-full h-10" role="img"
                  :aria-label="group.testTitle + ' ' + dim.label + ' 变化'">
                  <polyline :points="chartPoints(dim.points.map((p) => p.value))" fill="none"
                    stroke="var(--primary)" stroke-width="1.5" vector-effect="non-scaling-stroke" />
                </svg>
              </div>
            </div>

            <!-- 类型 / 等级量表：总分没有意义，改用历次结论对照 -->
            <p v-if="!group.scored" class="text-xs mt-3 leading-relaxed" style="color: var(--text-muted);">
              本量表按类型 / 等级呈现，总分不代表程度高低，因此不画分数折线；下面是历次结论。
            </p>

            <ol class="mt-4 space-y-1.5">
              <li v-for="(r, i) in group.records" :key="r.key" class="flex items-center gap-3 text-sm">
                <span class="text-xs w-12 flex-shrink-0" style="color: var(--text-muted);">第 {{ i + 1 }} 次</span>
                <span class="text-xs flex-shrink-0" style="color: var(--text-muted);">{{ formatTime(r.timestamp) }}</span>
                <span class="flex-1 truncate text-right font-medium" style="color: var(--text-secondary);">
                  {{ r.displayScore }}
                </span>
              </li>
            </ol>
          </div>

          <!-- 说明 -->
          <div class="p-5 rounded-xl text-xs leading-relaxed mt-6"
            style="background-color: var(--card-bg); color: var(--text-muted); box-shadow: var(--shadow-sm);">
            纵轴按每条序列的最小值到最大值拉伸，只表示相对高低，不表示绝对幅度；
            自评分数受情绪、睡眠与近期压力影响，小幅波动不一定反映真实变化。
            这些记录保存在你自己的浏览器里，本页不上传任何数据。
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
// 趋势页：把本机存档按量表分组，能画折线的才画折线。
// 独立成页的原因：历史页是「一条条记录」的列表，而趋势需要「同一量表的整条序列」，
// 两者信息结构不同；更重要的是类型型量表（MBTI / 多维自评 / ECR-R 等）的
// totalScore 不是程度分，画成折线会误导，本页据此分两条展示路径。
// 分组与折线计算放在 app/utils/trends.ts，便于直接单测（那里出过 bug）。
import { useAnswerStore } from '~/stores/answer'
import {
  buildTrendGroups,
  chartPoints,
  deltaColor,
  firstTs,
  firstValue,
  formatDelta,
  formatTrendTime,
  formatTrendValue,
  lastTs,
  lastValue,
  type TrendGroup,
} from '~/utils/trends'

const router = useRouter()
const route = useRoute()
const answerStore = useAnswerStore()
const auth = useAuth()
const cloud = useCloudSync()

const isLoading = ref(true)
const groups = ref<TrendGroup[]>([])
const filterTestId = ref('')

const visibleGroups = computed(() =>
  filterTestId.value ? groups.value.filter((g) => g.testId === filterTestId.value) : groups.value,
)

const buildGroups = () => {
  answerStore.migrateLegacyResults()
  groups.value = buildTrendGroups(listResultRecords(), {
    isTypeOnly: isTypeOnlyTest,
    formatScore: formatResultScore,
  })
  isLoading.value = false
}

const formatTime = formatTrendTime
// 维度值是归一化浮点（多维自评量表可达 17 位小数），展示前统一收敛到两位
const formatValue = formatTrendValue

onMounted(async () => {
  cloud.init()
  const q = route.query.test
  if (typeof q === 'string' && q) filterTestId.value = q
  buildGroups()

  // 登录且开启自动同步时，先把云端记录补齐再重算趋势
  if (auth.status.value === 'unknown') await auth.refresh()
  if (auth.isAuthed.value && cloud.autoSync.value) {
    await cloud.syncNow()
    buildGroups()
  }
})
</script>
