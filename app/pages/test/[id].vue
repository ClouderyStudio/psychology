<template>
  <div class="min-h-screen py-8" style="background-color: var(--bg);">
    <div class="container mx-auto px-4 max-w-3xl">
      <!-- 加载状态 -->
      <div v-if="!test" class="text-center py-12">
        <div class="text-2xl" style="color: var(--text-secondary);">加载中...</div>
      </div>

      <!-- 测评内容 -->
      <div v-else>
        <!-- 开发模式调试菜单 -->
        <DevOnly>
          <div class="fixed bottom-4 right-4 z-50">
            <button @click="showDebugMenu = !showDebugMenu"
              class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style="background-color: var(--special); color: white;">
              🐛
            </button>

            <div v-if="showDebugMenu" class="absolute bottom-12 right-0 mb-2 w-48 rounded-lg shadow-lg overflow-hidden"
              style="background-color: var(--card-bg);">
              <div class="py-1">
                <button @click="quickCompleteAll"
                  class="w-full px-4 py-2 text-left text-sm transition-colors"
                  style="color: var(--text);"
                  @mouseenter="elStyle($event, { backgroundColor: 'var(--bg)' })"
                  @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
                  🚀 随机完成所有题目
                </button>
                <button @click="quickCompleteCurrentPage"
                  class="w-full px-4 py-2 text-left text-sm transition-colors"
                  style="color: var(--text);"
                  @mouseenter="elStyle($event, { backgroundColor: 'var(--bg)' })"
                  @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
                  📄 随机完成当前页
                </button>
                <button @click="completeCurrentPageWithFirstOption"
                  class="w-full px-4 py-2 text-left text-sm transition-colors"
                  style="color: var(--text);"
                  @mouseenter="elStyle($event, { backgroundColor: 'var(--bg)' })"
                  @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
                  🛜 当前页全选第一个
                </button>
                <button @click="completeCurrentPageWithLastOption"
                  class="w-full px-4 py-2 text-left text-sm transition-colors"
                  style="color: var(--text);"
                  @mouseenter="elStyle($event, { backgroundColor: 'var(--bg)' })"
                  @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
                  🔚 当前页全选最后一个
                </button>
                <hr class="my-1" style="border-color: var(--primary-light);">
                <button @click="clearAllAnswers"
                  class="w-full px-4 py-2 text-left text-sm transition-colors"
                  style="color: var(--warning-text);"
                  @mouseenter="elStyle($event, { backgroundColor: 'var(--bg)' })"
                  @mouseleave="elStyle($event, { backgroundColor: 'transparent' })">
                  🗑️ 清除所有答案
                </button>
              </div>
            </div>
          </div>
        </DevOnly>

        <!-- 开始页：答题前确认是否打乱顺序 -->
        <template v-if="!started">
          <div class="rounded-xl overflow-hidden mb-6" style="background-color: var(--card-bg); box-shadow: var(--shadow-lg);">
            <div class="p-6" style="background-color: var(--primary); color: white;">
              <h1 class="text-2xl font-bold mb-2">{{ test.title }}</h1>
              <p style="color: rgba(255,255,255,0.9);">{{ test.instructions }}</p>
              <p class="text-sm mt-2" style="color: rgba(255,255,255,0.7);">⚠️ 请根据您的真实感受作答，共 {{ totalQuestions }} 题</p>
            </div>

            <!-- 量表介绍（由来 / 作用 / 适配人群）默认全部展示 -->
            <div v-if="test.intro" class="border-b px-6 pt-4 pb-5 text-sm" style="border-color: var(--primary-light);">
              <div class="font-semibold text-base mb-3" style="color: var(--text);">📖 量表介绍</div>
              <div class="space-y-4">
                <div v-if="test.intro?.origin">
                  <div class="font-semibold mb-1" style="color: var(--primary);">📜 由来</div>
                  <p class="leading-relaxed" style="color: var(--text-secondary);">{{ test.intro?.origin }}</p>
                </div>
                <div v-if="test.intro?.purpose">
                  <div class="font-semibold mb-1" style="color: var(--primary);">🎯 作用</div>
                  <p class="leading-relaxed" style="color: var(--text-secondary);">{{ test.intro?.purpose }}</p>
                </div>
                <div v-if="test.intro?.audience">
                  <div class="font-semibold mb-1" style="color: var(--primary);">👥 适配人群</div>
                  <p class="leading-relaxed" style="color: var(--text-secondary);">{{ test.intro?.audience }}</p>
                </div>
              </div>
            </div>

            <!-- SIOSS 专属：测评前告知书与安全提醒 -->
            <div v-if="isFormalTest" class="p-6">
              <div class="formal-decree">
                <div class="formal-decree-seal">郑重声明</div>
                <div class="formal-decree-title">自杀意念自评量表 · 测评前告知书</div>
                <div class="formal-decree-sub">SIOSS · Self-rating Idea of Suicide Scale</div>
                <div class="formal-decree-body">
本量表将询问您近期与自杀相关的想法、感受与睡眠情况，含若干<b>强烈危险信号条目</b>。
请您在<b>私密、安全</b>的环境下凭<b>真实感受</b>作答；掩饰会让结果失真，也可能让您错失及时的帮助。
本量表仅为<b>筛查工具</b>，<b>不能替代专业诊断</b>。无论结果如何，如果您当下正经历难以承受的痛苦，或反复出现结束生命的念头，请<b>立即</b>联系下方专业援助。
                </div>
                <div class="formal-decree-hotline">
                  <strong>全国心理援助热线：12356</strong>（24 小时，免费，由国家卫健委统一管理）<br>
                  <strong>希望 24 热线：400-161-9995</strong>（24 小时）<br>
                  <strong>北京心理危机研究与干预中心：010-82951332</strong><br>
                  紧急情况请拨打 <strong>120</strong>，或前往就近医院急诊。
                </div>
              </div>
            </div>

            <div v-else class="p-6">
              <label class="flex items-start p-4 rounded-lg cursor-pointer transition-all" style="background-color: var(--bg);">
                <input type="checkbox" v-model="shuffleOrder" class="w-4 h-4 mr-3 mt-0.5" :style="{ accentColor: 'var(--primary)' }">
                <div>
                  <div class="font-semibold" style="color: var(--text);">🔀 打乱题目顺序</div>
                  <p class="text-sm mt-1" style="color: var(--text-secondary);">勾选后随机排列题目顺序，降低惯性作答的干扰；不勾选则按原顺序作答。</p>
                </div>
              </label>
              <button @click="startTest" class="w-full mt-4 py-3 rounded-lg font-semibold text-white transition-all"
                style="background-color: var(--primary); box-shadow: var(--shadow-sm);">
                开始答题
              </button>
            </div>

            <!-- SIOSS 正式模式：阅读声明后方可答题 -->
            <div v-if="isFormalTest" class="px-6 pb-6">
              <label class="flex items-start p-4 rounded-lg cursor-pointer transition-all mb-4"
                style="background-color: var(--bg); border: 1px solid var(--border);">
                <input type="checkbox" v-model="shuffleOrder" class="w-4 h-4 mr-3 mt-0.5" :style="{ accentColor: 'var(--primary)' }">
                <div>
                  <div class="font-semibold" style="color: var(--text);">🔀 打乱题目顺序</div>
                  <p class="text-sm mt-1" style="color: var(--text-secondary);">勾选后随机排列题目顺序，降低惯性作答的干扰；不勾选则按原顺序作答。</p>
                </div>
              </label>
              <label class="flex items-start p-3 rounded-lg cursor-pointer transition-all"
                style="background-color: var(--bg); border: 1px solid var(--border);">
                <input type="checkbox" v-model="formalAcknowledged" class="w-4 h-4 mr-3 mt-1"
                  :style="{ accentColor: 'var(--danger)' }">
                <div style="color: var(--text);">
                  <span class="font-semibold">我已阅读并理解上述声明。</span>
                  <span class="text-sm block mt-1" style="color: var(--text-secondary);">勾选后即可进入正式答题。如感到情绪激动或缺乏安全私密环境，建议先拨打上方热线或暂缓作答。</span>
                </div>
              </label>
              <button @click="startTest" :disabled="!formalAcknowledged"
                class="w-full mt-4 py-3 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                :style="{
                  backgroundColor: formalAcknowledged ? 'var(--primary)' : 'var(--text-muted)',
                  color: 'white',
                  boxShadow: 'var(--shadow-sm)',
                }">
                {{ formalAcknowledged ? '进入正式测评' : '请先确认已阅读声明' }}
              </button>
            </div>
          </div>
        </template>

        <template v-else>
        <!-- 进度条 -->
        <div class="mb-6">
          <div class="flex justify-between text-sm mb-2" style="color: var(--text-secondary);">
            <span>答题进度</span>
            <span>{{ answeredCount }} / {{ requiredCount }}</span>
          </div>
          <div class="w-full rounded-full h-2" style="background-color: var(--primary-light);">
            <div class="rounded-full h-2 transition-all duration-300"
              :style="{ width: `${progress}%`, backgroundColor: 'var(--primary)' }"></div>
          </div>
        </div>

        <!-- 分页信息和操作按钮 -->
        <div class="flex justify-between items-center mb-4">
          <div class="text-sm" style="color: var(--text-muted);">
            第 {{ currentPage }} / {{ totalPages }} 页
          </div>
          <div class="flex gap-2">
            <div class="text-sm" style="color: var(--text-muted);">
              本页 {{ currentPageQuestions.length }} 题
            </div>
            <!-- 清除本页答案按钮 -->
            <button v-if="hasCurrentPageAnswers" @click="clearCurrentPageAnswers"
              class="text-xs px-2 py-1 rounded transition-colors"
              style="background-color: var(--warning-bg); color: var(--warning-text);" title="清除当前页所有答案">
              🗑️ 清除本页
            </button>
            <!-- 清除所有答案按钮 -->
            <button v-if="answeredCount > 0" @click="clearAllAnswers"
              class="text-xs px-2 py-1 rounded transition-colors"
              style="background-color: var(--warning-bg); color: var(--warning-text);" title="清除所有答案">
              🗑️ 清除全部
            </button>
          </div>
        </div>

        <!-- 快速跳转区域 -->
        <div v-if="totalPages > 5" class="flex flex-wrap items-center justify-center gap-3 mb-6 p-3 rounded-lg"
          style="background-color: var(--card-bg); box-shadow: var(--shadow-sm);">
          <span class="text-sm" style="color: var(--text-secondary);">快速跳转：</span>

          <!-- 页码按钮 -->
          <div class="flex flex-wrap gap-1">
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
              class="min-w-[32px] h-8 rounded-md text-sm transition-all" :style="{
                'background-color': currentPage === page ? 'var(--primary)' : 'var(--card-bg)',
                'color': currentPage === page ? 'white' : 'var(--text-secondary)',
                'box-shadow': 'var(--shadow-sm)'
              }">
              <template v-if="page === -1">...</template>
              <template v-else>{{ page }}</template>
            </button>
          </div>

          <!-- 输入框跳转 -->
          <div class="flex items-center gap-2 ml-2">
            <span class="text-xs" style="color: var(--text-muted);">前往</span>
            <input type="number" v-model.number="jumpPage" :min="1" :max="totalPages"
              class="w-16 px-2 py-1 text-center rounded border text-sm"
              style="background-color: var(--bg); border-color: var(--primary-light); color: var(--text);"
              @keyup.enter="jumpToPage" />
            <span class="text-xs" style="color: var(--text-muted);">页</span>
            <button @click="jumpToPage" class="px-3 py-1 rounded text-xs transition-colors"
              style="background-color: var(--primary); color: white;"
              @mouseenter="elStyle($event, { backgroundColor: 'var(--primary-dark)' })"
              @mouseleave="elStyle($event, { backgroundColor: 'var(--primary)' })">
              GO
            </button>
          </div>
        </div>

        <!-- 页码导航 -->
        <div v-else class="flex justify-center gap-2 mb-6">
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
            class="w-8 h-8 rounded-md text-sm transition-all" :style="{
              backgroundColor: currentPage === page ? 'var(--primary)' : 'var(--card-bg)',
              color: currentPage === page ? 'white' : 'var(--text-secondary)',
              boxShadow: currentPage === page ? 'var(--shadow-sm)' : 'none'
            }">
            {{ page }}
          </button>
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

          <!-- SIOSS 正式模式：答题中持续提示 -->
          <div v-if="isFormalTest" class="formal-top-warning" style="border-radius: 0;">
            <div class="formal-top-warning-icon">⚠️</div>
            <div class="formal-top-warning-body">
              <b>专业量表 · 请如实作答</b><br>
              量表含若干与自杀相关的题目，请凭真实感受作答。<b>掩饰会让结果失真</b>，更可能让您错失及时帮助。<br>
              如感到情绪激动或需要倾诉，请拨 <b>12356</b>（全国心理援助热线，24 小时，免费）。
            </div>
          </div>

          <!-- 题目列表（当前页） -->
          <div class="p-6 space-y-8">
            <div v-for="(question, index) in currentPageQuestions" :key="question.id"
              :class="[isFormalTest && SIOSS_DANGER_ITEMS.has(question.id) ? 'formal-question formal-question-danger' : '']"
              class="border-b last:border-0 pb-6 last:pb-0" style="border-color: var(--primary-light);">
              <p class="text-lg font-semibold mb-4" style="color: var(--text);">
                {{ getGlobalQuestionNumber(question.id) }}. {{ question.text }}
                <span v-if="isFormalTest && SIOSS_DANGER_ITEMS.has(question.id)"
                  class="formal-question-danger-tag">
                  危险信号条目
                </span>
              </p>

              <div class="space-y-3">
                <!-- number 题（数字输入，如生理年龄）：可不填 -->
                <template v-if="isNumberQuestion(question)">
                  <div class="p-3 rounded-lg" style="background-color: var(--bg);">
                    <input type="number" v-model.number="answers[question.id]" :min="question.min ?? 0"
                      :max="question.max ?? 99" inputmode="numeric" placeholder="请输入数字"
                      class="w-full px-3 py-2 rounded-lg border text-base"
                      :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--primary)', color: 'var(--text)' }">
                    <p class="text-xs mt-2" style="color: var(--text-muted);">可不填；若填写，报告将对比「心理年龄 vs 生理年龄」。</p>
                  </div>
                </template>
                <!-- range 题（滑块，如 MID-60 的 0-10 频率）：必答 -->
                <template v-else-if="isRangeQuestion(question)">
                  <div class="p-3 rounded-lg" style="background-color: var(--bg);">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs" style="color: var(--text-muted);">{{ question.min ?? 0 }}{{ question.minLabel ? ' · ' + question.minLabel : '' }}</span>
                      <span class="font-semibold text-lg tabular-nums" style="color: var(--primary);">{{ answers[question.id] === undefined ? '未选择' : answers[question.id] }}</span>
                      <span class="text-xs" style="color: var(--text-muted);">{{ question.max ?? 10 }}{{ question.maxLabel ? ' · ' + question.maxLabel : '' }}</span>
                    </div>
                    <input type="range" :min="question.min ?? 0" :max="question.max ?? 100" :step="question.step ?? 1"
                      :value="answers[question.id] ?? rangeMid(question)"
                      @pointerdown="ensureRange(question.id, question.min, question.max)"
                      @input="onRangeInput(question.id, $event)"
                      class="w-full h-2" :style="{ accentColor: 'var(--primary)' }">
                  </div>
                </template>
                <template v-else>
                <label v-for="option in question.options" :key="option.value"
                  class="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200"
                  :class="{ 'border-2': answers[question.id] === option.value }" :style="{
                    backgroundColor: answers[question.id] === option.value ? 'var(--primary-light)' : 'var(--bg)',
                    borderColor: answers[question.id] === option.value ? 'var(--primary)' : 'transparent'
                  }">
                  <input type="radio" :name="`q${question.id}`" :value="option.value" v-model="answers[question.id]"
                    class="w-4 h-4 mr-3" :style="{ accentColor: 'var(--primary)' }">
                  <span style="color: var(--text);">{{ option.label }}</span>
                </label>
                </template>
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
              {{ currentPage === 1 ? '返回主页' : '← 上一页' }}
            </button>

            <button v-if="!isLastPage" @click="nextPage"
              class="px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              :style="{
                backgroundColor: 'var(--primary)',
                color: 'white',
                boxShadow: 'var(--shadow-sm)'
              }">
              下一页 →
            </button>

            <button v-else @click="submitTest" :disabled="!isComplete || isSubmitting"
              class="flex-1 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :style="{
                backgroundColor: isComplete && !isSubmitting ? 'var(--primary)' : 'var(--text-muted)',
                color: 'white',
                boxShadow: 'var(--shadow-sm)'
              }">
              {{ isSubmitting ? '提交中…' : (isComplete ? '提交测评' : `还需完成 ${remainingCount} 题`) }}
            </button>
          </div>
        </div>

        <!-- 快速跳转提示（仅当页数较多时显示） -->
        <div v-if="totalPages > 5" class="text-center">
          <div class="inline-flex gap-2 flex-wrap justify-center">
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
              class="w-10 h-10 rounded-lg transition-all" :style="{
                backgroundColor: currentPage === page ? 'var(--primary)' : 'var(--card-bg)',
                color: currentPage === page ? 'white' : 'var(--text-secondary)',
                boxShadow: 'var(--shadow-sm)'
              }">
              {{ page === -1 ? '...' : page }}
            </button>
          </div>
        </div>
        </template>
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
const { $toast, $confirm } = useNuxtApp()

// SIOSS（自杀意念）属于高敏感量表，使用专门的「正式模式」：衬线字体 / 墨色 + 警示红 / 强化危机警告。
const FORMAL_TESTS = ['sioss']
const isFormalTest = computed(() => FORMAL_TESTS.includes(testId))

// SIOSS 强烈危险信号条目（与 scoreSIOSS.dangerItems 一致）：答"是"需严肃对待
const SIOSS_DANGER_ITEMS = new Set<number>([11, 17, 22, 26])


// 客户端标志
const isClient = ref(false)

// 每页显示题目数
const QUESTIONS_PER_PAGE = 10

// 获取题库数据
const { data: response, error } = await useFetch(`/api/tests/${testId}`)
const test = computed(() => {
  const data = response.value?.data
  return Array.isArray(data) ? null : data
})

// 使用 Pinia 存储答案
const answers = ref<Record<number, number>>({})

// 分页相关
const currentPage = ref(1)

// 所有题目
// 当前题序（初始为题库顺序，可被「打乱」重排）
const allQuestions = ref<any[]>([])
const started = ref(false)        // 是否已进入答题（每次进入都先显示开始页询问是否打乱）
const shuffleOrder = ref(false)   // 开始页勾选：是否打乱题目顺序
const isSubmitting = ref(false)   // 提交中锁：防止重复提交

// SIOSS 等高敏感量表：勾选"已阅读声明"才可进入
const formalAcknowledged = ref(false)

// 打乱算法（Fisher-Yates）
function shuffleArr<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i] as T
    a[i] = a[j] as T
    a[j] = tmp
  }
  return a
}

// 数字输入题（如生理年龄）固定到最后，不参与打乱
function pinNumberLast(list: any[]): any[] {
  const nums = list.filter((q) => q?.type === 'number')
  const rest = list.filter((q) => q?.type !== 'number')
  return rest.concat(nums)
}

// 题目顺序的持久化 / 恢复（保证刷新后顺序一致）
const orderKey = "test_" + testId + "_order"
function saveOrder(ids: number[]) {
  if (typeof window === "undefined") return
  try { sessionStorage.setItem(orderKey, JSON.stringify(ids)) } catch (e) { console.error("保存题目顺序失败", e) }
}
function loadOrder(): number[] | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(orderKey)
    if (!raw) return null
    const ids = JSON.parse(raw)
    return Array.isArray(ids) ? (ids as number[]) : null
  } catch { return null }
}
function clearOrder() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(orderKey)
}

// 题库加载后填充题目顺序；若存在已保存顺序（之前打乱过）则恢复。
// 注意：不据此自动跳过开始页——每次进入都先询问「是否打乱」。
watch(
  () => test.value,
  (t) => {
    if (!t || !t.questions) return
    const savedOrder = loadOrder()
    if (savedOrder && savedOrder.length === t.questions.length) {
      const byId = new Map<number, any>()
      t.questions.forEach((q) => byId.set(q.id, q))
      allQuestions.value = pinNumberLast(savedOrder.map((id) => byId.get(id)).filter(Boolean) as any[])
    } else {
      allQuestions.value = t.questions.slice()
    }
  },
  { immediate: true }
)

// 开始答题：按勾选决定是否打乱顺序
function startTest() {
  const t = test.value
  if (!t) return
  if (shuffleOrder.value) {
    // 数字输入题（如生理年龄）固定到最后，不参与打乱
    allQuestions.value = pinNumberLast(shuffleArr(t.questions))
    saveOrder(allQuestions.value.map((q) => q.id))
  } else {
    allQuestions.value = t.questions.slice()
    clearOrder()
  }
  started.value = true
  // 若已在恢复的进度中（onMounted 已定位到对应页码），保留该页；否则回到第一页
  const saved = answerStore.getAnswers()
  const hasSaved = saved && Object.keys(saved).length > 0
  if (!hasSaved) currentPage.value = 1
  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
}
const totalQuestions = computed(() => allQuestions.value.length)
const totalPages = computed(() => Math.ceil(totalQuestions.value / QUESTIONS_PER_PAGE))

// 当前页显示的题目
const currentPageQuestions = computed(() => {
  const start = (currentPage.value - 1) * QUESTIONS_PER_PAGE
  const end = start + QUESTIONS_PER_PAGE
  return allQuestions.value.slice(start, end)
})

// 当前页题目ID列表
const currentPageQuestionIds = computed(() => currentPageQuestions.value.map(q => q.id))

// 计算显示题号（按当前题序的位置，打乱后也为连续编号）
const getGlobalQuestionNumber = (questionId: number) => {
  const idx = allQuestions.value.findIndex((q) => q.id === questionId)
  return idx >= 0 ? idx + 1 : questionId
}

// number 题（数字输入，如生理年龄）——不计入必答完成度，可留空
const isNumberQuestion = (q: any) => q?.type === 'number'
const isRangeQuestion = (q: any) => q?.type === 'range'

// 滑块输入：把滑块的值写入作答对象
function onRangeInput(id: number, e: Event) {
  const v = Number((e.target as HTMLInputElement).value)
  answers.value[id] = v
}

// 滑块未作答时的默认停留位置（中间值，避免停在边界以致“选边界要先移开再移回”）
function rangeMid(q: any): number {
  const min = typeof q?.min === 'number' ? q.min : 0
  const max = typeof q?.max === 'number' ? q.max : 10
  return Math.round((min + max) / 2)
}

// 用户在滑块上按下开始拖动时，若尚未作答先用中间值占位；此后拖动即可选任意数值（含两端）
function ensureRange(id: number, min?: number, max?: number) {
  if (answers.value[id] === undefined) {
    answers.value[id] = Math.round(((min ?? 0) + (max ?? 10)) / 2)
  }
}

// 必答题目（排除 number 题）
const requiredQuestions = computed(() => allQuestions.value.filter(q => !isNumberQuestion(q)))
const requiredIds = computed(() => requiredQuestions.value.map(q => q.id))
const requiredCount = computed(() => requiredIds.value.length)

// 计算已答题数（仅计必答题）
const answeredCount = computed(() => requiredIds.value.filter(id => answers.value[id] !== undefined).length)
const remainingCount = computed(() => requiredCount.value - answeredCount.value)
const isComplete = computed(() => answeredCount.value === requiredCount.value && requiredCount.value > 0)

// 当前页是否有答案
const hasCurrentPageAnswers = computed(() => {
  return currentPageQuestionIds.value.some(id => answers.value[id] !== undefined)
})

// 当前页是否已全部作答
const isCurrentPageComplete = computed(() => {
  return currentPageQuestionIds.value.every(id => answers.value[id] !== undefined)
})

// 是否是最后一页
const isLastPage = computed(() => currentPage.value === totalPages.value)

// 总进度
const progress = computed(() => (answeredCount.value / requiredCount.value) * 100 || 0)

// 可见页码（用于快速跳转）
const visiblePages = computed(() => {
  const range: number[] = []
  for (let i = 1; i <= totalPages.value; i++) {
    range.push(i)
  }
  return range
})

// 清除当前页的所有答案
const clearCurrentPageAnswers = () => {
  const toClearCount = currentPageQuestionIds.value.filter(id => answers.value[id] !== undefined).length
  if (toClearCount === 0) {
    $toast.info('当前页没有需要清除的答案', '提示')
    return
  }

  $confirm({
    title: '确认清除',
    message: `确定要清除当前页（第 ${currentPage.value} 页）的 ${toClearCount} 个答案吗？此操作不可恢复。`,
    onConfirm: () => {
      // 删除当前页答案后重建对象触发响应式；由 watch(answers) 整体同步 store 与 sessionStorage
      currentPageQuestionIds.value.forEach(id => {
        if (answers.value[id] !== undefined) {
          delete answers.value[id]
        }
      })
      answers.value = { ...answers.value }

      $toast.success(`已清除第 ${currentPage.value} 页的 ${toClearCount} 个答案`, '完成')
    }
  })
}

// 清除所有答案
const clearAllAnswers = () => {
  if (answeredCount.value === 0) {
    $toast.info('没有需要清除的答案', '提示')
    return
  }

  $confirm({
    title: '确认清除',
    message: `确定要清除所有 ${answeredCount.value} 个答案吗？此操作不可恢复。`,
    onConfirm: () => {
      // 清空答案对象触发响应式；由 watch(answers) 整体清空 store 与 sessionStorage
      answers.value = {}

      // 重置到第一页（回到开始页）
      currentPage.value = 1
      started.value = false
      clearOrder()

      $toast.success('已清除所有答案', '完成')
    }
  })
}

// 初始化时加载已保存的答案
onMounted(async () => {
  jumpPage.value = currentPage.value
  isClient.value = true

  if (answerStore.currentTestId !== testId) {
    answerStore.setCurrentTest(testId)
  }

  const savedAnswers = answerStore.getAnswers()

  if (savedAnswers && Object.keys(savedAnswers).length > 0) {
    const completedCount = Object.keys(savedAnswers).length
    const totalCount = totalQuestions.value

    answers.value = { ...savedAnswers }

    // 有进行中的作答：直接从已恢复（打乱）的顺序继续，跳过开始页
    started.value = true

    if (totalQuestions.value > 0) {
      const answeredIds = Object.keys(savedAnswers).map(Number)
      const lastAnsweredId = answeredIds.reduce((max, id) => (id > max ? id : max), 0)
      const questionIndex = allQuestions.value.findIndex(q => q.id === lastAnsweredId)
      if (questionIndex !== -1) {
        currentPage.value = Math.floor(questionIndex / QUESTIONS_PER_PAGE) + 1
      }
    }

    if (completedCount === totalCount && totalCount > 0) {
      $toast.info(`您已完成所有 ${completedCount} 题，请提交测评`, '温馨提示')
    } else {
      $toast.info(`检测到您上次答题进度：已完成 ${completedCount}/${totalCount} 题`, '继续答题')
    }
  } else {
    answers.value = {}
  }
})

// 监听答案变化，整体同步 store 与 sessionStorage 并刷新进度
watch(answers, (newAnswers) => {
  answerStore.setAnswers(newAnswers)
  // 实时刷新“未完成的测评”进度（NavBar 下拉与首页卡片）
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('refreshProgress'))
  }
}, { deep: true })

// 分页导航函数
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (!isCurrentPageComplete.value) {
    $toast.warning(`请先完成当前页的所有题目（第${currentPage.value}页）再继续`, '提示')
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    goBack()
  }
}

// 跳转页码输入框
const jumpPage = ref(1)

// 跳转到指定页面的函数
const jumpToPage = () => {
  let targetPage = jumpPage.value
  if (isNaN(targetPage)) targetPage = 1
  targetPage = Math.max(1, Math.min(totalPages.value, targetPage))

  if (targetPage === currentPage.value) {
    // 同一页，不做处理
    return
  }

  // 执行跳转
  currentPage.value = targetPage
  jumpPage.value = targetPage
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToPage = (page: number) => {
  if (page === -1) return
  if (page === currentPage.value) return

  currentPage.value = page
  jumpPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听当前页变化，同步 jumpPage
watch(currentPage, (newPage) => {
  jumpPage.value = newPage
})

// 退出确认
function goBack() {
  if (answeredCount.value > 0 && !isComplete.value) {
    $confirm({
      title: '确认退出',
      message: '您有未完成的测评，确定要退出吗？您的进度会自动保存，下次可以继续答题。',
      onConfirm: () => {
        router.push('/')
      }
    })
  } else {
    router.push('/')
  }
}

// 提交测评
async function submitTest() {
  if (isSubmitting.value) return
  if (!isComplete.value) {
    $toast.warning(`请完成所有题目后再提交（还剩 ${remainingCount.value} 题）`, '提示')
    return
  }

  // SIOSS 等高敏感量表：提交前正式确认，提示作答环境与如实作答
  if (isFormalTest.value) {
    $confirm({
      title: '郑重 · 确认提交测评',
      message:
        '请确认：\n\n· 您已在私密、安全的环境下凭真实感受作答；\n· 您理解掩饰（测谎）分偏高会让结果失真，并可能让您错失及时帮助；\n· 您已知悉下方全国心理援助热线：\n  —— 12356（24 小时，免费）\n  —— 希望 24 热线 400-161-9995\n  —— 北京心理危机研究与干预中心 010-82951332\n\n提交后系统将立即给出筛查结果。无论结果如何，如有持续痛苦或出现结束生命的念头，请立即寻求专业帮助。',
      confirmText: '确认提交',
      cancelText: '再检查一下',
      onConfirm: async () => {
        await doSubmit()
      }
    })
    return
  }

  $confirm({
    title: '确认提交',
    message: '确定要提交测评吗？提交后将无法修改答案。',
    onConfirm: async () => {
      await doSubmit()
    }
  })
}

// 实际执行提交
async function doSubmit() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    $toast.info('正在提交中，请稍候...', '提交中')

    const result = await $fetch('/api/submit', {
      method: 'POST',
      body: {
        testId,
        answers: answers.value
      }
    })

    if (result?.success) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`test_${testId}_answers`)
        window.dispatchEvent(new CustomEvent('refreshProgress'))
        window.dispatchEvent(new CustomEvent('newResult'))  // 触发新结果事件
      }

      answerStore.clearAnswers()

      answerStore.setResult(result.data)

      $toast.success('测评提交成功！', '完成')
      await router.push('/result')
    }
  } catch (error: any) {
    console.error('提交失败', error)
    $toast.error(
      error?.data?.statusMessage || error?.data?.message || '提交失败，请稍后重试',
      '错误',
    )
  } finally {
    isSubmitting.value = false
  }
}

// 错误处理
if (error.value) {
  console.error('加载测评失败', error.value)
  router.push('/')
}

// 调试取值：单选/选项题取 options；range 滑块在 min..max 内取值（first/last/random）
function valueForQuestion(q: any, mode: "first" | "last" | "random"): number | undefined {
  if (q?.type === "range") {
    const min = typeof q.min === "number" ? q.min : 0
    const max = typeof q.max === "number" ? q.max : 10
    if (mode === "first") return min
    if (mode === "last") return max
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  const options = q?.options
  if (options && options.length > 0) {
    let idx = 0
    if (mode === "last") idx = options.length - 1
    else if (mode === "random") idx = Math.floor(Math.random() * options.length)
    return options[idx]!.value
  }
  return undefined
}

// 快速随机完成所有题目（调试用）
const quickCompleteAll = () => {
  // 确认对话框
  $confirm({
    title: '调试模式',
    message: `确定要随机完成所有 ${totalQuestions.value} 道题目吗？此操作将覆盖已有答案。`,
    confirmText: '确定',
    cancelText: '取消',
    onConfirm: () => {
      const newAnswers: Record<number, number> = {}

      // 遍历所有题目（单选取随机选项；range 滑块取随机值）
      for (const question of allQuestions.value) {
        const v = valueForQuestion(question, "random")
        if (v !== undefined) newAnswers[question.id] = v
      }

      // 应用答案（watch(answers) 会整体同步 store 与 sessionStorage）
      answers.value = newAnswers

      // 跳转到最后一页
      currentPage.value = totalPages.value

      // 显示成功提示
      $toast.success(`已完成 ${Object.keys(newAnswers).length} 道题目（随机答案）`, '调试完成')

      // 刷新导航栏进度
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('refreshProgress'))
      }
    }
  })
}

// 调试菜单状态
const showDebugMenu = ref(false)

// 快速完成当前页
const quickCompleteCurrentPage = () => {
  const newAnswers = { ...answers.value }

  for (const question of currentPageQuestions.value) {
    const v = valueForQuestion(question, "random")
    if (v !== undefined) newAnswers[question.id] = v
  }

  answers.value = newAnswers

  $toast.success(`已完成当前页 ${currentPageQuestions.value.length} 道题目`, '调试完成')
  window.dispatchEvent(new CustomEvent('refreshProgress'))
}

// 完成当前页为特定选项（如全部选第一个）
const completeCurrentPageWithFirstOption = () => {
  const newAnswers = { ...answers.value }

  for (const question of currentPageQuestions.value) {
    const v = valueForQuestion(question, "first")
    if (v !== undefined) newAnswers[question.id] = v
  }

  answers.value = newAnswers

  $toast.success(`当前页已全部选第一个选项`, '调试完成')
}

// 完成当前页为最后一个选项
const completeCurrentPageWithLastOption = () => {
  const newAnswers = { ...answers.value }

  for (const question of currentPageQuestions.value) {
    const v = valueForQuestion(question, "last")
    if (v !== undefined) newAnswers[question.id] = v
  }

  answers.value = newAnswers

  $toast.success(`当前页已全部选最后一个选项`, '调试完成')
}
</script>