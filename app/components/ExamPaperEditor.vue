<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ExamQuestion, ExamSection } from '~/types/exam'
import type { ExamQuestionType } from '~/utils/exam-editor'
import {
  JUDGE_OPTIONS,
  QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
  addQuestionOption,
  blankSections,
  createQuestion,
  createSection,
  duplicateQuestion,
  formatPoints,
  isMultipleSelected,
  needOptions,
  normalizeSections,
  paperStats,
  removeQuestionOption,
  resolveType,
  setQuestionType,
  toggleMultipleLabel,
  validateSections,
} from '~/utils/exam-editor'

const props = defineProps<{
  open: boolean
  mode: 'create' | 'edit'
  name: string
  sections: ExamSection[]
  saving: boolean
  serverError: string
}>()

const emit = defineEmits<{
  (e: 'save', payload: { name: string; sections: ExamSection[] }): void
  (e: 'close'): void
}>()

const draftName = ref('')
const draft = ref<ExamSection[]>([])
const showIssues = ref(false)
/** 打开时的快照，用来判断「有未保存修改」 */
const snapshot = ref('')

watch(
  () => props.open,
  (open) => {
    if (!open) return
    draftName.value = props.name
    // 归一化后再进编辑器：历史 JSON 缺字段、答案写成数字等都由这一层收敛
    draft.value = props.sections?.length ? normalizeSections(props.sections) : blankSections()
    showIssues.value = false
    snapshot.value = JSON.stringify({ name: draftName.value, sections: draft.value })
  },
  { immediate: true },
)

const dirty = computed(
  () => JSON.stringify({ name: draftName.value, sections: draft.value }) !== snapshot.value,
)

const stats = computed(() => paperStats(draft.value))
const issues = computed(() => validateSections(draft.value))
const errors = computed(() => issues.value.filter((i) => i.level === 'error'))
const warnings = computed(() => issues.value.filter((i) => i.level === 'warning'))
const canSave = computed(() => !props.saving && !!draftName.value.trim() && errors.value.length === 0)

function requestClose() {
  if (props.saving) return
  if (!dirty.value) {
    emit('close')
    return
  }
  const { confirm } = useAlert()
  confirm({
    title: '放弃修改',
    message: '试卷还有未保存的修改，确定关闭吗？',
    confirmText: '放弃修改',
    cancelText: '继续编辑',
    onConfirm: () => emit('close'),
  })
}

function submit() {
  if (!canSave.value) {
    showIssues.value = true
    return
  }
  emit('save', { name: draftName.value.trim(), sections: normalizeSections(draft.value) })
}

function addSection() {
  draft.value.push(createSection())
}

function removeSection(sIndex: number) {
  const section = draft.value[sIndex]
  if (!section) return
  const { confirm } = useAlert()
  const run = () => { draft.value.splice(sIndex, 1) }
  if (!section.questions.length) {
    run()
    return
  }
  confirm({
    title: '删除章节',
    message: '将删除「' + (section.title || '未命名章节') + '」及其 ' + section.questions.length + ' 道题目，确定吗？',
    confirmText: '删除',
    onConfirm: run,
  })
}

function moveSection(sIndex: number, delta: number) {
  const target = sIndex + delta
  if (target < 0 || target >= draft.value.length) return
  const [section] = draft.value.splice(sIndex, 1)
  draft.value.splice(target, 0, section!)
}

function addQuestion(sIndex: number, type: ExamQuestionType) {
  draft.value[sIndex]?.questions.push(createQuestion(type))
}

function removeQuestion(sIndex: number, qIndex: number) {
  const section = draft.value[sIndex]
  const question = section?.questions[qIndex]
  if (!section || !question) return
  const run = () => { section.questions.splice(qIndex, 1) }
  if (!question.text.trim() && !question.answer) {
    run()
    return
  }
  const { confirm } = useAlert()
  confirm({
    title: '删除题目',
    message: '确定删除第 ' + (qIndex + 1) + ' 题吗？',
    confirmText: '删除',
    onConfirm: run,
  })
}

function moveQuestion(sIndex: number, qIndex: number, delta: number) {
  const questions = draft.value[sIndex]?.questions
  if (!questions) return
  const target = qIndex + delta
  if (target < 0 || target >= questions.length) return
  const [question] = questions.splice(qIndex, 1)
  questions.splice(target, 0, question!)
}

function copyQuestion(sIndex: number, qIndex: number) {
  const questions = draft.value[sIndex]?.questions
  const question = questions?.[qIndex]
  if (!questions || !question) return
  questions.splice(qIndex + 1, 0, duplicateQuestion(question))
}

function onTypeChange(question: ExamQuestion, event: Event) {
  setQuestionType(question, (event.target as HTMLSelectElement).value as ExamQuestionType)
}

function toggleMultiple(question: ExamQuestion, label: string) {
  question.answer = toggleMultipleLabel(question.answer, label)
}

/**
 * 章节每题分值的展示值。
 * 清空数字输入框时 v-model.number 会写回空字符串，而 "" ?? 1 仍是 ""，
 * 直接交给 formatPoints 会在 toFixed 上抛错；这里统一兜底成后端判分用的 1 分。
 */
function sectionPoints(section: ExamSection): number {
  const points = section.pointsPerQuestion
  return typeof points === 'number' && Number.isFinite(points) && points > 0 ? points : 1
}

const typeOptions = QUESTION_TYPES.map((type) => ({ value: type, label: QUESTION_TYPE_LABELS[type] }))

const inputStyle = 'background-color: var(--card-bg); border: 1px solid var(--border); color: var(--text);'
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 overflow-y-auto"
      style="background-color: rgba(0, 0, 0, 0.5);"
      @click.self="requestClose"
    >
      <div class="mx-auto max-w-4xl min-h-full flex flex-col" style="background-color: var(--bg);">
        <!-- 顶部：试卷名 + 统计 -->
        <div class="sticky top-0 z-10 px-4 sm:px-6 py-4 border-b" style="background-color: var(--card-bg); border-color: var(--border);">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs px-2 py-0.5 rounded-full" style="background-color: var(--primary-light); color: var(--primary);">
                  {{ mode === 'create' ? '新增试卷' : '编辑试卷' }}
                </span>
                <span v-if="stats.questionCount" class="text-xs" style="color: var(--text-muted);">
                  {{ stats.sectionCount }} 章 · {{ stats.questionCount }} 题 · 满分 {{ formatPoints(stats.totalPoints) }} 分
                  <template v-if="stats.essayCount">（含 {{ stats.essayCount }} 道简答题不计分）</template>
                </span>
              </div>
              <input
                v-model="draftName"
                type="text"
                placeholder="试卷名称，例如：2025 年度心理测评内部测试"
                class="w-full px-3 py-2 rounded-lg text-base font-semibold outline-none"
                :style="inputStyle"
              />
            </div>
            <button
              type="button"
              class="shrink-0 w-8 h-8 rounded-lg text-lg leading-none"
              style="color: var(--text-muted);"
              title="关闭"
              @click="requestClose"
            >✕</button>
          </div>
        </div>

        <!-- 校验问题 -->
        <div v-if="showIssues && (errors.length || warnings.length)" class="px-4 sm:px-6 pt-4">
          <div class="p-3 rounded-lg text-sm space-y-1" style="background-color: var(--warning-bg); color: var(--warning-text);">
            <div v-if="errors.length" class="font-medium">请先修正以下 {{ errors.length }} 个问题：</div>
            <div v-else class="font-medium">以下 {{ warnings.length }} 项建议检查（不阻断保存）：</div>
            <ul class="list-disc pl-5 space-y-0.5">
              <li v-for="issue in errors.concat(warnings).slice(0, 12)" :key="issue.path + issue.message">{{ issue.message }}</li>
            </ul>
            <div v-if="errors.length + warnings.length > 12" class="pl-1">……共 {{ errors.length + warnings.length }} 项</div>
          </div>
        </div>

        <!-- 章节列表 -->
        <div class="flex-1 px-4 sm:px-6 py-4 space-y-4">
          <div
            v-for="(section, sIndex) in draft"
            :key="sIndex"
            class="rounded-xl border overflow-hidden"
            style="background-color: var(--card-bg); border-color: var(--border);"
          >
            <!-- 章节头 -->
            <div class="flex items-center gap-2 px-3 py-2 border-b flex-wrap" style="background-color: var(--primary-light); border-color: var(--border);">
              <span class="text-sm font-bold shrink-0" style="color: var(--primary-dark);">第 {{ sIndex + 1 }} 章</span>
              <input
                v-model="section.title"
                type="text"
                placeholder="章节标题，例如：一、单项选择题"
                class="flex-1 min-w-[12rem] px-2 py-1 rounded text-sm outline-none"
                :style="inputStyle"
              />
              <label class="flex items-center gap-1 text-xs shrink-0" style="color: var(--text-secondary);">
                每题
                <input
                  v-model.number="section.pointsPerQuestion"
                  type="number"
                  min="0.5"
                  step="0.5"
                  class="w-16 px-2 py-1 rounded text-sm outline-none text-center"
                  :style="inputStyle"
                />
                分
              </label>
              <div class="flex items-center gap-1 shrink-0">
                <button type="button" class="w-7 h-7 rounded text-sm" :style="inputStyle" title="上移章节" :disabled="sIndex === 0" @click="moveSection(sIndex, -1)">↑</button>
                <button type="button" class="w-7 h-7 rounded text-sm" :style="inputStyle" title="下移章节" :disabled="sIndex === draft.length - 1" @click="moveSection(sIndex, 1)">↓</button>
                <button type="button" class="w-7 h-7 rounded text-sm" style="color: var(--symptom);" title="删除章节" @click="removeSection(sIndex)">🗑</button>
              </div>
            </div>

            <!-- 题目列表 -->
            <div v-if="section.questions.length" class="p-3 space-y-3">
              <div
                v-for="(question, qIndex) in section.questions"
                :key="qIndex"
                class="rounded-lg border p-3 space-y-2"
                style="border-color: var(--border);"
              >
                <!-- 题目工具条 -->
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs font-semibold px-2 py-0.5 rounded" style="background-color: var(--bg); color: var(--text-secondary);">
                    {{ sIndex + 1 }}-{{ qIndex + 1 }}
                  </span>
                  <select
                    :value="resolveType(question)"
                    class="px-2 py-1 rounded text-xs outline-none"
                    :style="inputStyle"
                    @change="onTypeChange(question, $event)"
                  >
                    <option v-for="option in typeOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                  </select>
                  <span class="text-xs" style="color: var(--text-muted);">
                    {{ resolveType(question) === 'essay' ? '不计分' : formatPoints(sectionPoints(section)) + ' 分' }}
                  </span>
                  <div class="flex-1"></div>
                  <button type="button" class="text-xs px-2 py-1 rounded" :style="inputStyle" title="复制此题" @click="copyQuestion(sIndex, qIndex)">复制</button>
                  <button type="button" class="text-xs px-2 py-1 rounded" :style="inputStyle" title="上移" :disabled="qIndex === 0" @click="moveQuestion(sIndex, qIndex, -1)">↑</button>
                  <button type="button" class="text-xs px-2 py-1 rounded" :style="inputStyle" title="下移" :disabled="qIndex === section.questions.length - 1" @click="moveQuestion(sIndex, qIndex, 1)">↓</button>
                  <button type="button" class="text-xs px-2 py-1 rounded" style="color: var(--symptom);" title="删除此题" @click="removeQuestion(sIndex, qIndex)">删除</button>
                </div>

                <!-- 题干 -->
                <textarea
                  v-model="question.text"
                  rows="2"
                  placeholder="请输入题干"
                  class="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y"
                  :style="inputStyle"
                ></textarea>

                <!-- 选项 + 答案（单选 / 多选） -->
                <div v-if="needOptions(resolveType(question))" class="space-y-1.5">
                  <div class="flex items-center gap-3 text-xs" style="color: var(--text-muted);">
                    <span>{{ resolveType(question) === 'multiple' ? '勾选所有正确选项' : '点选唯一正确选项' }}</span>
                  </div>
                  <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-center gap-2">
                    <input
                      v-if="resolveType(question) === 'multiple'"
                      type="checkbox"
                      class="shrink-0"
                      :checked="isMultipleSelected(question.answer, option.label)"
                      @change="toggleMultiple(question, option.label)"
                    />
                    <input
                      v-else
                      type="radio"
                      class="shrink-0"
                      :name="'answer-' + sIndex + '-' + qIndex"
                      :value="option.label"
                      :checked="question.answer === option.label"
                      @change="question.answer = option.label"
                    />
                    <span
                      class="shrink-0 w-6 h-6 rounded text-xs font-semibold flex items-center justify-center"
                      :style="question.answer.includes(option.label)
                        ? 'background-color: var(--special); color: white;'
                        : 'background-color: var(--bg); color: var(--text-secondary);'"
                    >{{ option.label }}</span>
                    <input
                      v-model="option.text"
                      type="text"
                      :placeholder="'选项 ' + option.label + ' 的内容'"
                      class="flex-1 min-w-0 px-2 py-1 rounded text-sm outline-none"
                      :style="inputStyle"
                    />
                    <button
                      type="button"
                      class="shrink-0 w-7 h-7 rounded text-sm"
                      style="color: var(--text-muted);"
                      title="删除此选项"
                      :disabled="(question.options?.length ?? 0) <= 2"
                      @click="removeQuestionOption(question, oIndex)"
                    >✕</button>
                  </div>
                  <button
                    type="button"
                    class="text-xs px-2 py-1 rounded mt-1"
                    style="background-color: var(--primary-light); color: var(--primary);"
                    @click="addQuestionOption(question)"
                  >＋ 添加选项</button>
                </div>

                <!-- 答案（判断题） -->
                <div v-else-if="resolveType(question) === 'judge'" class="flex items-center gap-3">
                  <span class="text-xs" style="color: var(--text-muted);">正确答案</span>
                  <label
                    v-for="option in JUDGE_OPTIONS"
                    :key="option.label"
                    class="px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer"
                    :style="question.answer === option.label
                      ? 'background-color: var(--special); color: white;'
                      : 'background-color: var(--bg); color: var(--text-secondary); border: 1px solid var(--border);'"
                  >
                    <input
                      type="radio"
                      class="hidden"
                      :name="'judge-' + sIndex + '-' + qIndex"
                      :value="option.label"
                      :checked="question.answer === option.label"
                      @change="question.answer = option.label"
                    />
                    {{ option.text }}
                  </label>
                </div>

                <!-- 参考答案（简答题） -->
                <div v-else class="space-y-1">
                  <div class="text-xs" style="color: var(--text-muted);">参考答案（简答题由人工核对，不计入自动判分）</div>
                  <textarea
                    v-model="question.answer"
                    rows="2"
                    placeholder="请输入参考答案要点"
                    class="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y"
                    :style="inputStyle"
                  ></textarea>
                </div>

                <!-- 解析 -->
                <textarea
                  v-model="question.note"
                  rows="2"
                  placeholder="答案解析（可选），用户解锁答案后可见"
                  class="w-full px-3 py-2 rounded-lg text-xs outline-none resize-y"
                  :style="inputStyle"
                ></textarea>
              </div>
            </div>

            <div v-else class="px-3 py-6 text-center text-sm" style="color: var(--text-muted);">
              该章节还没有题目，用下面的按钮添加。
            </div>

            <!-- 添加题目 -->
            <div class="px-3 pb-3 flex items-center gap-2 flex-wrap">
              <span class="text-xs" style="color: var(--text-muted);">添加题目：</span>
              <button
                v-for="type in QUESTION_TYPES"
                :key="type"
                type="button"
                class="text-xs px-2.5 py-1 rounded"
                style="background-color: var(--primary-light); color: var(--primary);"
                @click="addQuestion(sIndex, type)"
              >＋ {{ QUESTION_TYPE_LABELS[type] }}</button>
            </div>
          </div>

          <button
            type="button"
            class="w-full py-3 rounded-xl border border-dashed text-sm font-medium"
            style="border-color: var(--primary); color: var(--primary);"
            @click="addSection"
          >＋ 添加章节</button>
        </div>

        <!-- 底部操作 -->
        <div class="sticky bottom-0 px-4 sm:px-6 py-3 border-t flex items-center gap-3 flex-wrap" style="background-color: var(--card-bg); border-color: var(--border);">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm"
            style="background-color: var(--bg); color: var(--text-secondary);"
            :disabled="saving"
            @click="requestClose"
          >取消</button>
          <button
            type="button"
            class="px-3 py-2 rounded-lg text-sm"
            style="background-color: var(--bg); color: var(--text-secondary);"
            @click="showIssues = !showIssues"
          >校验（{{ errors.length }} 错误 / {{ warnings.length }} 提示）</button>
          <div class="flex-1"></div>
          <div v-if="serverError" class="text-xs" style="color: var(--danger);">{{ serverError }}</div>
          <button
            type="button"
            class="px-5 py-2 rounded-lg text-sm font-medium"
            :style="canSave ? 'background-color: var(--primary); color: white;' : 'background-color: var(--border); color: var(--text-muted); cursor: not-allowed;'"
            :disabled="!canSave"
            @click="submit"
          >{{ saving ? '保存中…' : (mode === 'create' ? '创建试卷' : '保存修改') }}</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
