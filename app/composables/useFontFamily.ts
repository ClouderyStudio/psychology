/**
 * 自选字体 composable — 提供 fontFamily ref、setFontFamily 和 init。
 *
 * 实现方式：在 <html> 上写 data-font-family 属性，由 CSS 切换到对应的字体栈
 * （字体栈集中定义在 tailwind.css 的 --font-stack-* 变量里）。
 *
 * 与主题的关系：该属性的选择器带 :root，优先级高于主题自带的字体设置
 * （如 [data-accent="retro"] 的宋体、[data-accent="google"] 的思源黑体），
 * 所以用户显式选字体时以用户为准；而 default 档不定义任何规则，
 * 保留主题原本的字体意图（「怀旧」用宋体、「蓝白 · Google」用思源黑体）。
 *
 * 选择项持久化到 localStorage，初始时从存储恢复。
 */
const FONT_FAMILY_KEY = 'psychology-font-family'

export type FontFamilyId = 'default' | 'sans' | 'serif' | 'kai'

/**
 * 可选字体档位。
 * previewClass 用于面板里的字体预览，对应 tailwind.css 中的 --font-stack-* 变量，
 * 避免字体栈在两处各写一遍。
 */
export const fontFamilyOptions: {
  id: FontFamilyId
  label: string
  desc: string
  stackVar: string
}[] = [
  { id: 'default', label: '默认', desc: '跟随主题', stackVar: '--font-stack-default' },
  { id: 'sans', label: '黑体', desc: '无衬线，屏幕最清晰', stackVar: '--font-stack-sans' },
  { id: 'serif', label: '宋体', desc: '衬线，适合长文阅读', stackVar: '--font-stack-serif' },
  { id: 'kai', label: '楷体', desc: '手写感，笔画圆润', stackVar: '--font-stack-kai' },
]

export const FONT_PREVIEW_TEXT = '心灵驿站 Aa'

const fontFamily = ref<FontFamilyId>('default')

const isValidFamily = (v: unknown): v is FontFamilyId =>
  fontFamilyOptions.some((o) => o.id === v)

function applyFontFamily(id: FontFamilyId) {
  if (import.meta.server) return
  document.documentElement.setAttribute('data-font-family', id)
}

function setFontFamily(id: FontFamilyId) {
  fontFamily.value = isValidFamily(id) ? id : 'default'
  applyFontFamily(fontFamily.value)
  try {
    localStorage.setItem(FONT_FAMILY_KEY, fontFamily.value)
  } catch {
    // localStorage 不可用时静默忽略
  }
}

function init() {
  if (import.meta.server) return
  let stored: string | null = null
  try {
    stored = localStorage.getItem(FONT_FAMILY_KEY)
  } catch {}
  fontFamily.value = isValidFamily(stored) ? stored : 'default'
  applyFontFamily(fontFamily.value)
}

export function useFontFamily() {
  return { fontFamily, setFontFamily, init, fontFamilyOptions }
}
