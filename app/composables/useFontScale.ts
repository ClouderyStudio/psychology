/**
 * 大字号管理 composable — 提供 fontScale ref、setFontScale 和 init。
 *
 * 实现方式：在 <html> 上写 data-font-scale 属性，由 CSS 缩放根字号。
 * 由于 Tailwind 的文字与间距都以 rem 为单位，根字号一变，全站文字与
 * 留白会等比放大（等价于浏览器缩放，但只影响本站在 rem 上的部分）。
 * 字号用百分比写，可尊重用户在浏览器里自行设置的默认字号。
 *
 * 选择项持久化到 localStorage，初始时从存储恢复。
 */
const FONT_SCALE_KEY = 'psychology-font-scale'

export type FontScaleId = 'normal' | 'large' | 'xlarge'

/** 可选字号档位。percent 仅用于展示，实际缩放值在 tailwind.css 中定义 */
export const fontScaleOptions: { id: FontScaleId; label: string; desc: string; percent: number }[] = [
  { id: 'normal', label: '标准', desc: '默认字号', percent: 100 },
  { id: 'large', label: '大', desc: '放大 15%', percent: 115 },
  { id: 'xlarge', label: '特大', desc: '放大 30%', percent: 130 },
]

const fontScale = ref<FontScaleId>('normal')

const isValidScale = (v: unknown): v is FontScaleId =>
  fontScaleOptions.some((o) => o.id === v)

function applyFontScale(scale: FontScaleId) {
  if (import.meta.server) return
  document.documentElement.setAttribute('data-font-scale', scale)
}

function setFontScale(scale: FontScaleId) {
  fontScale.value = isValidScale(scale) ? scale : 'normal'
  applyFontScale(fontScale.value)
  try {
    localStorage.setItem(FONT_SCALE_KEY, fontScale.value)
  } catch {
    // localStorage 不可用时静默忽略
  }
}

function init() {
  if (import.meta.server) return
  let stored: string | null = null
  try {
    stored = localStorage.getItem(FONT_SCALE_KEY)
  } catch {}
  fontScale.value = isValidScale(stored) ? stored : 'normal'
  applyFontScale(fontScale.value)
}

export function useFontScale() {
  return { fontScale, setFontScale, init, fontScaleOptions }
}
