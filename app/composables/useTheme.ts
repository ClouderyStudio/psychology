/**
 * 主题管理 composable — 提供 isDark ref、toggle 和 init。
 * 主题持久化到 localStorage，初始时从存储恢复。
 */
const THEME_KEY = 'psychology-theme'

const isDark = ref(false)

function applyTheme(dark: boolean) {
  if (import.meta.server) return
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
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

function init() {
  if (import.meta.server) return
  let stored: string | null = null
  try {
    stored = localStorage.getItem(THEME_KEY)
  } catch {
    // 忽略
  }

  if (stored === 'dark') {
    isDark.value = true
    applyTheme(true)
  } else if (stored === 'light') {
    isDark.value = false
    applyTheme(false)
  } else {
    // 无显式偏好，跟随系统
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = prefersDark
    applyTheme(prefersDark)
  }
}

export function useTheme() {
  return { isDark, toggle, init }
}
