<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg)">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="rounded-2xl overflow-hidden" style="background-color: var(--card-bg); box-shadow: var(--shadow-lg)">

        <!-- 头部 -->
        <div class="p-8 text-center" style="background-color: var(--primary); color: white">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style="background-color: rgba(255, 255, 255, 0.2)">
            <span class="text-4xl">📄</span>
          </div>
          <h1 class="text-3xl font-bold mb-2">{{ paper.name }}</h1>
          <p style="color: rgba(255, 255, 255, 0.9)">内部试卷 · 共 {{ totalCount }} 题</p>
        </div>

        <!-- 内容 -->
        <div class="p-8 space-y-8">
          <!-- 顶部标识与返回 -->
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full text-sm font-medium"
                style="background-color: var(--warning-bg); color: var(--warning-text)">
                内部试卷
              </span>
            </div>
            <NuxtLink to="/exam" class="text-sm font-medium transition-colors"
              style="color: var(--text-secondary)"
              @mouseenter="e => e.target.style.color = 'var(--primary)'"
              @mouseleave="e => e.target.style.color = 'var(--text-secondary)'">
              ← 返回试卷列表
            </NuxtLink>
          </div>

          <!-- 各部分题目 -->
          <div v-for="(section, sIndex) in paper.sections" :key="section.title" class="space-y-3">
            <h2 class="text-lg font-bold pt-1" style="color: var(--text)">
              {{ section.title }}
            </h2>

            <div v-for="(question, qIndex) in section.questions" :key="qIndex" class="p-4 rounded-lg"
              style="background-color: var(--bg)">
              <p class="text-sm leading-relaxed" style="color: var(--text)">
                <span class="font-semibold">{{ qIndex + 1 }}.</span> {{ question.text }}
              </p>

              <!-- 判断题：A 正确 / B 错误 -->
              <div v-if="getType(question) === 'judge'" class="mt-3 grid gap-1.5 sm:grid-cols-2">
                <label v-for="opt in judgeOptions" :key="opt.label"
                  class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all"
                  :style="{ backgroundColor: answers[questionKey(sIndex, qIndex)] === opt.label ? 'var(--primary-light)' : 'transparent' }">
                  <input type="radio" :name="`${sIndex}-${qIndex}`" :value="opt.label"
                    v-model="answers[questionKey(sIndex, qIndex)]" :disabled="submitted"
                    class="w-4 h-4" style="accent-color: var(--primary)">
                  <span class="text-sm" style="color: var(--text)">{{ opt.label }}. {{ opt.text }}</span>
                </label>
              </div>

              <!-- 单选题 -->
              <div v-else-if="getType(question) === 'single'" class="mt-3 grid gap-1.5">
                <label v-for="option in question.options" :key="option.label"
                  class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all"
                  :style="{ backgroundColor: answers[questionKey(sIndex, qIndex)] === option.label ? 'var(--primary-light)' : 'transparent' }">
                  <input type="radio" :name="`${sIndex}-${qIndex}`" :value="option.label"
                    v-model="answers[questionKey(sIndex, qIndex)]" :disabled="submitted"
                    class="w-4 h-4" style="accent-color: var(--primary)">
                  <span class="text-sm" style="color: var(--text)">{{ option.label }}. {{ option.text }}</span>
                </label>
              </div>

              <!-- 多选题 -->
              <div v-else-if="getType(question) === 'multiple'" class="mt-3 grid gap-1.5">
                <label v-for="option in question.options" :key="option.label"
                  class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all"
                  :style="{ backgroundColor: isMultiSelected(sIndex, qIndex, option.label) ? 'var(--primary-light)' : 'transparent' }">
                  <input type="checkbox" :checked="isMultiSelected(sIndex, qIndex, option.label)"
                    :disabled="submitted" @change="toggleMulti(sIndex, qIndex, option.label)"
                    class="w-4 h-4" style="accent-color: var(--primary)">
                  <span class="text-sm" style="color: var(--text)">{{ option.label }}. {{ option.text }}</span>
                </label>
              </div>

              <!-- 简答题 -->
              <div v-else-if="getType(question) === 'essay'" class="mt-3">
                <textarea v-model="answers[questionKey(sIndex, qIndex)]" :disabled="submitted"
                  rows="4" placeholder="请在此输入你的答案…"
                  class="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-y"
                  style="background-color: var(--card-bg); border: 1px solid var(--primary-light); color: var(--text);"></textarea>
              </div>

              <!-- 答案解析（解锁后显示） -->
              <div v-if="unlocked" class="mt-3 p-3 rounded-lg" style="background-color: var(--card-bg)">
                <!-- 判断 / 单选 / 多选：显示标准答案与对错 -->
                <template v-if="getType(question) !== 'essay'">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="answer-badge"
                      style="background-color: var(--special-light); color: var(--special-dark)">
                      正确答案：{{ formatAnswer(question) }}
                    </span>
                    <span class="answer-badge"
                      :style="isCorrect(sIndex, qIndex, question)
                        ? 'background-color: var(--special-light); color: var(--special-dark)'
                        : 'background-color: #fdecea; color: #c0392b'">
                      {{ isCorrect(sIndex, qIndex, question) ? '✓' : '✗' }} 你的答案：{{ formatUserAnswer(sIndex, qIndex, question) }}
                    </span>
                  </div>
                </template>
                <!-- 简答：直接输出测试者答案 + 参考答案 -->
                <template v-else>
                  <div class="mb-2">
                    <span class="text-xs font-semibold" style="color: var(--text-muted)">你的答案</span>
                    <p class="mt-1 text-sm whitespace-pre-line leading-relaxed" style="color: var(--text)">
                      {{ answers[questionKey(sIndex, qIndex)] || '（未作答）' }}
                    </p>
                  </div>
                  <div>
                    <span class="text-xs font-semibold" style="color: var(--text-muted)">参考答案</span>
                    <p class="mt-1 text-sm whitespace-pre-line leading-relaxed" style="color: var(--text-secondary)">
                      {{ question.answer }}
                    </p>
                  </div>
                </template>

                <p v-if="question.note" class="mt-2 text-xs leading-relaxed" style="color: var(--text-muted)">
                  💡 {{ question.note }}
                </p>
              </div>
            </div>
          </div>

          <!-- 提交 / 结果区域 -->
          <div class="pt-2">
            <!-- 未提交：答题并提交 -->
            <div v-if="!submitted" class="text-center">
              <button @click="submitPaper" :disabled="!isComplete"
                class="px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :style="{
                  backgroundColor: isComplete ? 'var(--primary)' : 'var(--text-muted)',
                  color: 'white',
                  boxShadow: 'var(--shadow-sm)'
                }"
                @mouseenter="e => { if (isComplete) e.target.style.backgroundColor = 'var(--primary-dark)' }"
                @mouseleave="e => { if (isComplete) e.target.style.backgroundColor = 'var(--primary)' }">
                {{ isComplete ? '提交试卷' : `还需完成 ${remainingCount} 题` }}
              </button>
            </div>

            <!-- 已提交：锁定状态 -->
            <div v-else-if="!unlocked" class="text-center">
              <div class="max-w-md mx-auto p-6 rounded-xl"
                style="background-color: var(--bg); box-shadow: var(--shadow-sm)">
                <div class="text-3xl mb-3">🔒</div>
                <h3 class="text-lg font-bold mb-2" style="color: var(--text)">试卷已提交</h3>
                <p class="text-sm mb-4" style="color: var(--text-secondary)">成绩与答案已锁定，请输入密码查看</p>

                <div class="mb-4">
                  <p class="text-xs mb-1" style="color: var(--text-muted)">校验码</p>
                  <div class="font-mono text-2xl font-bold tracking-widest" style="color: var(--primary)">
                    {{ randomCode }}
                  </div>
                </div>

                <div class="flex gap-2">
                  <input v-model="passwordInput" type="text" placeholder="请输入密码" autocomplete="off"
                    class="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none"
                    style="background-color: var(--card-bg); border: 1px solid var(--primary-light); color: var(--text)"
                    @keyup.enter="unlockResult" />
                  <button @click="unlockResult"
                    class="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
                    style="background-color: var(--primary); color: white"
                    @mouseenter="e => e.target.style.backgroundColor = 'var(--primary-dark)'"
                    @mouseleave="e => e.target.style.backgroundColor = 'var(--primary)'">
                    解锁
                  </button>
                </div>
                <p v-if="passwordError" class="mt-3 text-xs font-medium" style="color: #c0392b">⚠️ 密码错误，请重试</p>
              </div>
            </div>

            <!-- 已解锁：成绩与答案解析 -->
            <div v-else>
              <div class="rounded-xl p-6 mb-6 text-center"
                style="background-color: var(--primary-light); box-shadow: var(--shadow-sm)">
                <h3 class="text-base font-bold mb-3" style="color: var(--text)">📊 成绩单</h3>
                <div class="flex justify-center gap-8 flex-wrap">
                  <div>
                    <div class="text-3xl font-bold" style="color: var(--primary)">
                      {{ formatPoints(scoreResult.earned) }}<span class="text-base" style="color: var(--text-muted)"> / {{ formatPoints(totalPoints) }} 分</span>
                    </div>
                    <div class="text-xs mt-1" style="color: var(--text-muted)">得分 / 满分</div>
                  </div>
                  <div>
                    <div class="text-3xl font-bold" style="color: var(--primary)">
                      {{ scoreResult.correct }}<span class="text-base" style="color: var(--text-muted)"> / {{ scorableCount }} 题</span>
                    </div>
                    <div class="text-xs mt-1" style="color: var(--text-muted)">答对题数</div>
                  </div>
                  <div>
                    <div class="text-3xl font-bold" style="color: var(--primary)">
                      {{ accuracy }}%
                    </div>
                    <div class="text-xs mt-1" style="color: var(--text-muted)">正确率</div>
                  </div>
                </div>
                <p v-if="essayCount > 0" class="mt-3 text-xs" style="color: var(--text-muted)">
                  简答题（{{ essayCount }} 题）不计分，答案见各题下方
                </p>
              </div>

              <div class="text-center">
                <button @click="retake"
                  class="px-6 py-2.5 rounded-lg font-medium transition-all text-sm"
                  style="background-color: var(--card-bg); color: var(--text-secondary); box-shadow: var(--shadow-sm)"
                  @mouseenter="e => e.target.style.backgroundColor = 'var(--bg)'"
                  @mouseleave="e => e.target.style.backgroundColor = 'var(--card-bg)'">
                  ↺ 重新作答
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExamPaper, ExamQuestion } from '~/data/exam'

const props = defineProps<{
  paper: ExamPaper
}>()

const { $toast } = useNuxtApp()

// 判断题选项
const judgeOptions = [
  { label: 'A', text: '正确' },
  { label: 'B', text: '错误' },
]

// 单选/判断/简答答案：string；多选答案：string[]
const answers = ref<Record<string, string>>({})
const multiAnswers = ref<Record<string, string[]>>({})

const submitted = ref(false)
const unlocked = ref(false)

// 密码相关
const randomCode = ref('')
const expectedPassword = ref('')
const passwordInput = ref('')
const passwordError = ref(false)

// 题目键
const questionKey = (sIndex: number, qIndex: number) => `${sIndex}-${qIndex}`

// 判断题型：缺省时按有无 options 推断
const getType = (question: ExamQuestion) => {
  if (question.type) return question.type
  return question.options ? 'single' : 'judge'
}

// 展平所有题目
const questionItems = computed(() => {
  const items: Array<{ key: string; sIndex: number; qIndex: number; section: any; question: ExamQuestion }> = []
  props.paper.sections.forEach((section, sIndex) => {
    section.questions.forEach((question, qIndex) => {
      items.push({ key: questionKey(sIndex, qIndex), sIndex, qIndex, section, question })
    })
  })
  return items
})

const totalCount = computed(() => questionItems.value.length)

// 可评分题（排除简答）
const scorableItems = computed(() =>
  questionItems.value.filter(it => getType(it.question) !== 'essay')
)
const scorableCount = computed(() => scorableItems.value.length)
const essayCount = computed(() => totalCount.value - scorableCount.value)

// 满分只算可评分题
const totalPoints = computed(() =>
  scorableItems.value.reduce((sum, it) => sum + (it.section.pointsPerQuestion ?? 1), 0)
)

// 已作答的可评分题数
const answeredCount = computed(() =>
  scorableItems.value.filter(it => {
    const type = getType(it.question)
    if (type === 'multiple') return (multiAnswers.value[it.key] || []).length > 0
    return !!answers.value[it.key]
  }).length
)

const remainingCount = computed(() => scorableCount.value - answeredCount.value)
const isComplete = computed(() => answeredCount.value === scorableCount.value && scorableCount.value > 0)

// 多选操作
const isMultiSelected = (sIndex: number, qIndex: number, label: string) =>
  (multiAnswers.value[questionKey(sIndex, qIndex)] || []).includes(label)

const toggleMulti = (sIndex: number, qIndex: number, label: string) => {
  const key = questionKey(sIndex, qIndex)
  const arr = [...(multiAnswers.value[key] || [])]
  const idx = arr.indexOf(label)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(label)
  multiAnswers.value = { ...multiAnswers.value, [key]: arr }
}

// 判断某题是否正确
const isCorrect = (sIndex: number, qIndex: number, question: ExamQuestion) => {
  const key = questionKey(sIndex, qIndex)
  if (getType(question) === 'multiple') {
    const user = (multiAnswers.value[key] || []).slice().sort().join('')
    const std = question.answer.split('').sort().join('')
    return user === std
  }
  return answers.value[key] === question.answer
}

// 展示标准答案
const formatAnswer = (question: ExamQuestion) => {
  if (getType(question) === 'multiple') return question.answer.split('').join('、')
  return question.answer
}

// 展示测试者答案
const formatUserAnswer = (sIndex: number, qIndex: number, question: ExamQuestion) => {
  const key = questionKey(sIndex, qIndex)
  if (getType(question) === 'multiple') {
    const arr = multiAnswers.value[key] || []
    return arr.length ? arr.slice().sort().join('、') : '未作答'
  }
  return answers.value[key] || '未作答'
}

// 计分
const scoreResult = computed(() => {
  let correct = 0
  let earned = 0
  scorableItems.value.forEach(it => {
    if (isCorrect(it.sIndex, it.qIndex, it.question)) {
      correct++
      earned += it.section.pointsPerQuestion ?? 1
    }
  })
  return { correct, earned }
})

const accuracy = computed(() => {
  if (scorableCount.value === 0) return 0
  return Math.round((scoreResult.value.correct / scorableCount.value) * 100)
})

const formatPoints = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))

// 生成随机校验码
function generateCode() {
  const charset = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += charset[Math.floor(Math.random() * charset.length)]
  }
  return code
}

// SHA-256 哈希（十六进制）
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function setupPassword() {
  randomCode.value = generateCode()
  try {
    expectedPassword.value = (await sha256Hex(randomCode.value)).slice(0, 5)
  } catch (e) {
    // 非安全上下文兜底：简单哈希
    let h = 5381
    for (let i = 0; i < randomCode.value.length; i++) {
      h = ((h << 5) + h + randomCode.value.charCodeAt(i)) >>> 0
    }
    expectedPassword.value = h.toString(16).padStart(8, '0').slice(0, 5)
  }
}

function submitPaper() {
  if (!isComplete.value) {
    $toast.warning(`请完成所有可评分题目后再提交（还剩 ${remainingCount.value} 题）`, '提示')
    return
  }
  submitted.value = true
}

function unlockResult() {
  if (passwordInput.value.trim().toLowerCase() === expectedPassword.value.toLowerCase()) {
    unlocked.value = true
    passwordError.value = false
  } else {
    passwordError.value = true
  }
}

function retake() {
  answers.value = {}
  multiAnswers.value = {}
  submitted.value = false
  unlocked.value = false
  passwordInput.value = ''
  passwordError.value = false
  setupPassword()
}

onMounted(() => {
  setupPassword()
})

useHead({
  title: `${props.paper.name} - 内部测试 - 心灵驿站`
})
</script>

<style scoped>
.answer-badge {
  flex-shrink: 0;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
