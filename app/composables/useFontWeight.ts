/**
 * 加粗（无障碍）composable — 提供 fontWeight ref、setFontWeight 和 init。
 *
 * 实现方式：在 <html> 上写 data-font-weight 属性，由 CSS 把全站字重整体上移一档。
 * 全站字重的单一来源是 tailwind.css 里的 --fw-* 变量（组件里写 var(--fw-*)，
 * 不写死数值），所以这里只要切属性，缩放由 CSS 完成。
 *
 * 与「大字号」「自选字体」并列，同属阅读偏好设置，三个属性互不影响。
 * 选择项持久化到 localStorage，初始时从存储恢复。
 */
const FONT_WEIGHT_KEY = 'psychology-font-weight'

export type FontWeightId = 'normal' | 'bold'

/** 可选字重档位。desc 里的数值仅用于展示，实际上移档位在 tailwind.css 中定义 */
export const fontWeightOptions: {
  id: FontWeightId
  label: string
  desc: string
}[] = [
  { id: 'normal', label: '标准', desc: '常规粗细' },
  { id: 'bold', label: '加粗', desc: '正文 400 → 600' },
]

const fontWeight = ref<FontWeightId>('normal')

const isValidWeight = (v: unknown): v is FontWeightId =>
  fontWeightOptions.some((o) => o.id === v)

function applyFontWeight(id: FontWeightId) {
  if (import.meta.server) return
  document.documentElement.setAttribute('data-font-weight', id)
}

function setFontWeight(id: FontWeightId) {
  fontWeight.value = isValidWeight(id) ? id : 'normal'
  applyFontWeight(fontWeight.value)
  try {
    localStorage.setItem(FONT_WEIGHT_KEY, fontWeight.value)
  } catch {
    // localStorage 不可用时静默忽略
  }
}

function init() {
  if (import.meta.server) return
  let stored: string | null = null
  try {
    stored = localStorage.getItem(FONT_WEIGHT_KEY)
  } catch {}
  fontWeight.value = isValidWeight(stored) ? stored : 'normal'
  applyFontWeight(fontWeight.value)
}

export function useFontWeight() {
  return { fontWeight, setFontWeight, init, fontWeightOptions }
}
