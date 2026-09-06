/**
 * 主题管理 composable — 提供 isDark ref、accent ref、toggle、setAccent 和 init。
 * 亮/暗模式与主题配色均持久化到 localStorage，初始时从存储恢复。
 */
const THEME_KEY = 'psychology-theme'
const THEME_ACCENT_KEY = 'psychology-theme-accent'

// 可选主题配色（default 为默认蓝色系；每色均适配暗色/亮色模式）
export const accentOptions: { id: string; label: string; color: string }[] = [
  { id: 'default', label: '天青 · 默认', color: '#5b8c9e' },
  { id: 'emerald', label: '晨翠', color: '#2f8f6b' },
  { id: 'violet', label: '暮紫', color: '#7b6b9e' },
  { id: 'sunset', label: '暖橙', color: '#c97b3f' },
  { id: 'rose', label: '樱粉', color: '#c45a7a' },
  { id: 'teal', label: '黛青', color: '#2f8f8f' },
]

const isDark = ref(false)
const accent = ref('default')

function applyTheme(dark: boolean, acc: string = accent.value) {
  if (import.meta.server) return
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  document.documentElement.setAttribute('data-accent', acc || 'default')
}

function toggle() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
  try {
    localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
  } catch {
    // localStorage 不可用时静默忽略
  }
}

function setAccent(a: string) {
  accent.value = a || 'default'
  applyTheme(isDark.value, accent.value)
  try {
    localStorage.setItem(THEME_ACCENT_KEY, accent.value)
  } catch {
    // 忽略
  }
}

function init() {
  if (import.meta.server) return
  // 亮/暗模式
  let stored: string | null = null
  try { stored = localStorage.getItem(THEME_KEY) } catch {}
  if (stored === 'dark') {
    isDark.value = true
  } else if (stored === 'light') {
    isDark.value = false
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  // 主题配色
  let storedAcc: string | null = null
  try { storedAcc = localStorage.getItem(THEME_ACCENT_KEY) } catch {}
  accent.value = storedAcc || 'default'
  applyTheme(isDark.value, accent.value)
}

export function useTheme() {
  return { isDark, toggle, init, accent, setAccent, accentOptions }
}