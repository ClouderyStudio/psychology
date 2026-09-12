/**
 * 繁简体（字形）composable — 提供 hanVariant ref、setHanVariant 和 init。
 *
 * 与字号/字体/字重不同，繁简**无法用 CSS 完成**（同一个字在两种字形下是不同码位），
 * 所以这里只负责状态与 <html> 上的属性；真正的文本替换在 utils/hanVariantDom.ts 里做，
 * 由 plugins/han-variant.client.ts 在挂载后触发。
 *
 * 为什么给两档繁体（而不是笼统一个「繁體」）：OpenCC 的通用档 s2t 产出的是正统/陈旧字形
 * ——「吃面」→「喫麪」、「床铺」→「牀鋪」、「为什么」→「爲什麼」，现代繁体读者基本不这样写。
 * 实务上通行的是台湾正体与香港繁体两套，字形确有差别，所以照实给两档：
 *   話嗎 爲/為、着/著、裏/裡、污/汙、牀/床、麪/麵
 *
 * <html> 上的两个属性各有用途：
 *   - lang="zh-Hans|zh-Hant-TW|zh-Hant-HK" —— 无障碍与 SEO 用，也影响浏览器挑字形；
 *   - data-variant="hans|hant" —— 供 CSS 换上繁体优先的字体栈（PingFang TC / 新細明體…）。
 * 首屏内联脚本会在绘制前恢复这两个属性，避免繁体用户的字体先按简体字面渲染一下。
 *
 * 选择项持久化到 localStorage，初始时从存储恢复。
 */
const HAN_VARIANT_KEY = 'psychology-variant'

export type HanVariantId = 'hans' | 'hant-tw' | 'hant-hk'

export interface HanVariantOption {
  id: HanVariantId
  label: string
  desc: string
  /** <html lang> 取值 */
  lang: string
  /** data-variant 取值；两档繁体共用同一套 TC 字体栈 */
  script: 'hans' | 'hant'
  /** OpenCC 目标标准；简体档为 null，表示无需转换 */
  to: 'tw' | 'hk' | null
}

export const hanVariantOptions: HanVariantOption[] = [
  { id: 'hans', label: '简体', desc: '简体中文', lang: 'zh-Hans', script: 'hans', to: null },
  { id: 'hant-tw', label: '繁體', desc: '臺灣正體', lang: 'zh-Hant-TW', script: 'hant', to: 'tw' },
  { id: 'hant-hk', label: '繁體', desc: '香港繁體', lang: 'zh-Hant-HK', script: 'hant', to: 'hk' },
]

const DEFAULT_VARIANT: HanVariantId = 'hans'

const hanVariant = ref<HanVariantId>(DEFAULT_VARIANT)

export const findHanVariant = (id: unknown): HanVariantOption =>
  hanVariantOptions.find((o) => o.id === id) ?? hanVariantOptions[0]!

const isValidVariant = (v: unknown): v is HanVariantId =>
  hanVariantOptions.some((o) => o.id === v)

function applyHanVariant(option: HanVariantOption) {
  if (import.meta.server) return
  const el = document.documentElement
  el.setAttribute('data-variant', option.script)
  el.lang = option.lang
}

function setHanVariant(id: HanVariantId) {
  hanVariant.value = isValidVariant(id) ? id : DEFAULT_VARIANT
  applyHanVariant(findHanVariant(hanVariant.value))
  try {
    localStorage.setItem(HAN_VARIANT_KEY, hanVariant.value)
  } catch {
    // localStorage 不可用时静默忽略
  }
}

function init() {
  if (import.meta.server) return
  let stored: string | null = null
  try {
    stored = localStorage.getItem(HAN_VARIANT_KEY)
  } catch {}
  hanVariant.value = isValidVariant(stored) ? stored : DEFAULT_VARIANT
  applyHanVariant(findHanVariant(hanVariant.value))
}

export function useHanVariant() {
  return { hanVariant, setHanVariant, init, hanVariantOptions, findHanVariant }
}
