/**
 * 主题管理 composable — 提供 themeMode / isDark ref、accent ref、setThemeMode、toggle、setAccent 和 init。
 * 亮/暗模式与主题配色均持久化到 localStorage，初始时从存储恢复。
 * 「跟随系统」档不写 localStorage（清除已有键），init 时按 prefers-color-scheme 取值。
 */
const THEME_KEY = 'psychology-theme'
const THEME_ACCENT_KEY = 'psychology-theme-accent'

// 可选主题配色（default 为默认蓝色系；每色均适配暗色/亮色模式）
// color 是选择器色点的填充色，应与 tailwind.css 中对应 [data-accent] 块的
// --primary 保持一致（唯一例外：「怀旧」色点取该主题整体暖色基调，
// 与其亮色 --primary #3f5b76 不同）。
export const accentOptions: { id: string; label: string; color: string }[] = [
  { id: 'default', label: '天青 · 默认', color: '#5b8c9e' },
  { id: 'emerald', label: '晨翠', color: '#2f8f6b' },
  { id: 'violet', label: '暮紫', color: '#7b6b9e' },
  { id: 'sunset', label: '暖橙', color: '#c97b3f' },
  { id: 'rose', label: '樱粉', color: '#c45a7a' },
  { id: 'teal', label: '黛青', color: '#2f8f8f' },
  { id: 'mint', label: '薄荷', color: '#2f9e83' },
  { id: 'retro', label: '怀旧', color: '#8a6a45' },
  { id: 'google', label: '蓝白 · Google', color: '#1a73e8' },
  { id: 'win11', label: '流畅 · Win11', color: '#0078d4' },
  { id: 'win98', label: '经典 · Win98', color: '#000080' },
]

// 亮/暗模式三档：浅色 / 深色 / 跟随系统
export type ThemeMode = 'light' | 'dark' | 'auto'

export const themeModeOptions: { id: ThemeMode; label: string; desc: string }[] = [
  { id: 'light', label: '浅色', desc: '始终使用亮色界面' },
  { id: 'dark', label: '深色', desc: '始终使用暗色界面' },
  { id: 'auto', label: '跟随系统', desc: '跟随系统的深浅色设置' },
]

const themeMode = ref<ThemeMode>('auto')
const isDark = ref(false)
const accent = ref('default')

function systemPrefersDark(): boolean {
  if (import.meta.server) return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyTheme(dark: boolean, acc: string = accent.value) {
  if (import.meta.server) return
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  document.documentElement.setAttribute('data-accent', acc || 'default')
}

function setThemeMode(mode: ThemeMode) {
  themeMode.value = mode === 'light' || mode === 'dark' ? mode : 'auto'
  isDark.value = themeMode.value === 'auto' ? systemPrefersDark() : themeMode.value === 'dark'
  applyTheme(isDark.value)
  try {
    if (themeMode.value === 'auto') localStorage.removeItem(THEME_KEY)
    else localStorage.setItem(THEME_KEY, themeMode.value)
  } catch {
    // localStorage 不可用时静默忽略
  }
}

// 保留旧接口：在浅色与深色之间来回切换（不进入「跟随系统」）
function toggle() {
  setThemeMode(isDark.value ? 'light' : 'dark')
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
    themeMode.value = 'dark'
    isDark.value = true
  } else if (stored === 'light') {
    themeMode.value = 'light'
    isDark.value = false
  } else {
    themeMode.value = 'auto'
    isDark.value = systemPrefersDark()
  }
  // 主题配色
  let storedAcc: string | null = null
  try { storedAcc = localStorage.getItem(THEME_ACCENT_KEY) } catch {}
  accent.value = storedAcc || 'default'
  applyTheme(isDark.value, accent.value)
}

export function useTheme() {
  return {
    themeMode,
    setThemeMode,
    themeModeOptions,
    isDark,
    toggle,
    init,
    accent,
    setAccent,
    accentOptions,
  }
}
