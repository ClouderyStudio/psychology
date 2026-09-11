/**
 * 繁简转换的 DOM 层实现。
 *
 * 为什么不用 opencc-js 自带的 HTMLConverter：它把原文缓存在节点的 originalString 上，
 * 只在第一次 convert() 时记录。本站是 SPA（答题翻页、结果页都由 Vue 动态改写文本节点），
 * Vue 写入新内容后那份缓存就过期了，再调 convert() 会把旧文案盖回来。
 *
 * 所以自己实现一套，核心是 decideSync()：每个节点同时记住「原文 base」和
 * 「我们上次写进去的值 written」，据此区分三种情形 ——
 *   1. 首次遇到            → 当前值就是原文；
 *   2. DOM 里还是 written  → 是我们写的，用 base 重算目标值（来回切换幂等、不叠加转换）；
 *   3. 既不是 base 也不是 written → 被 Vue 改写了，当前值成为新的原文（动态内容不丢）。
 * 只记 base 是不够的：切回简体时 written 是繁体、base 是简体，两者都不等于当前值，
 * 会把我们自己写的繁体误判成「外部改写」，于是原文被覆盖成繁体，再也还原不回来。
 *
 * 依赖 opencc-js 的字典（约 1 MB），用动态 import 懒加载：默认简体用户一个字节都不下。
 */
import type { ConverterFunction } from 'opencc-js/core'

export type HanConverter = ConverterFunction

/** 转换目标：tw = 台湾正体，hk = 香港繁体（不用 OpenCC 的通用档 t，它会产出喫麪/牀鋪这类陈旧字形） */
export type HanTarget = 'tw' | 'hk'

const converterCache = new Map<HanTarget, Promise<HanConverter>>()

/** 懒加载指定目标的转换器；同一目标只加载一次 */
export function loadHanConverter(to: HanTarget): Promise<HanConverter> {
  let pending = converterCache.get(to)
  if (!pending) {
    pending = import('opencc-js/cn2t').then(({ Converter }) => {
      const convert = Converter({ from: 'cn', to })
      return (text: string) => convert(text)
    })
    converterCache.set(to, pending)
  }
  return pending
}

/** 一个节点的转换状态：base 是原文，written 是我们上次写进 DOM 的值 */
export interface HanOrigin {
  base: string
  written: string
}

/**
 * 纯逻辑：给定当前值、已记录的状态与转换器，算出新的状态与应写入的值。
 * 抽成纯函数是为了能脱离 DOM 单测 —— 这段判断最容易出错，且出错很隐蔽（静默改坏文案）。
 */
export function decideSync(
  cur: string,
  origin: HanOrigin | undefined,
  convert: HanConverter | null,
): { origin: HanOrigin; want: string } {
  // 1) 首次遇到：把当前值当作原文
  if (!origin) {
    const want = convert ? convert(cur) : cur
    return { origin: { base: cur, written: want }, want }
  }
  // 2) DOM 里还是我们写的值：说明内容没被外部动过，用原文重算
  if (cur === origin.written) {
    const want = convert ? convert(origin.base) : origin.base
    return { origin: { base: origin.base, written: want }, want }
  }
  // 3) 被外部改写了：当前值成为新的原文
  const want = convert ? convert(cur) : cur
  return { origin: { base: cur, written: want }, want }
}

/** 这些容器里的文字不参与转换（代码、样式、以及用户自己的输入） */
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE'])

/** 需要一并转换的属性（注意不含 value：用户填的内容不该被改写） */
const CONVERT_ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'content']

/** title 用于浏览器标签页，content 只用在 META 上（描述、og 标签等） */
function attrsFor(el: Element): string[] {
  return el.tagName === 'META'
    ? ['title', 'aria-label', 'content']
    : ['placeholder', 'title', 'aria-label', 'alt']
}

function shouldSkipElement(el: Element): boolean {
  if (SKIP_TAGS.has(el.tagName)) return true
  // ignore-opencc 是 OpenCC 生态的约定；translate="no" 是 HTML 标准约定
  if (el.classList.contains('ignore-opencc')) return true
  if (el.getAttribute('translate') === 'no') return true
  return false
}

const textOrigins = new WeakMap<Text, HanOrigin>()
const attrOrigins = new WeakMap<Element, Map<string, HanOrigin>>()

function syncTextNode(node: Text, convert: HanConverter | null) {
  const cur = node.data
  if (cur === '') return
  const { origin, want } = decideSync(cur, textOrigins.get(node), convert)
  textOrigins.set(node, origin)
  if (cur !== want) node.data = want
}

/** 同步元素上我们关心的那几个属性；只处理本来就存在的属性，不凭空加 */
function syncElementAttrs(el: Element, convert: HanConverter | null) {
  let map = attrOrigins.get(el)
  for (const name of attrsFor(el)) {
    if (!el.hasAttribute(name)) continue
    const cur = el.getAttribute(name) ?? ''
    if (cur === '') continue

    if (!map) {
      map = new Map<string, HanOrigin>()
      attrOrigins.set(el, map)
    }
    const { origin, want } = decideSync(cur, map.get(name), convert)
    map.set(name, origin)
    if (cur !== want) el.setAttribute(name, want)
  }
}

/** 遍历并同步一棵子树（可传文本节点、元素或 document.body） */
export function walkAndSyncHanVariant(root: Node, convert: HanConverter | null) {
  if (root.nodeType === Node.TEXT_NODE) {
    syncTextNode(root as Text, convert)
    return
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return
  const el = root as Element
  if (shouldSkipElement(el)) return
  syncElementAttrs(el, convert)
  for (const child of Array.from(el.childNodes)) {
    walkAndSyncHanVariant(child, convert)
  }
}

let observer: MutationObserver | null = null
let activeConverter: HanConverter | null = null

function handleMutations(records: MutationRecord[]) {
  for (const r of records) {
    if (r.type === 'characterData') {
      syncTextNode(r.target as Text, activeConverter)
    } else if (r.type === 'childList') {
      for (const n of Array.from(r.addedNodes)) {
        walkAndSyncHanVariant(n, activeConverter)
      }
    } else if (r.type === 'attributes') {
      const el = r.target as Element
      if (el.nodeType === Node.ELEMENT_NODE && !shouldSkipElement(el)) {
        syncElementAttrs(el, activeConverter)
      }
    }
  }
}

/**
 * 观察后续动态内容。只在繁体档开启 —— 简体档没有东西需要转换。
 * 我们自己的写入也会触发回调，但此时 cur === written，不会写第二次，循环自然终止。
 */
function startObserver(convert: HanConverter) {
  activeConverter = convert
  if (observer) {
    observer.takeRecords()
    return
  }
  observer = new MutationObserver(handleMutations)
  // 观察整个 documentElement：<head> 里的 <title> 与 meta 描述也要跟着换字形
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: CONVERT_ATTRS,
  })
}

function stopObserver() {
  observer?.disconnect()
  observer = null
  activeConverter = null
}

/**
 * 切换到指定繁体：加载转换器 → 全量转一遍 → 开始观察动态内容。
 * 切回简体（target 为 null）：先停止观察，再用原文把整页还原。
 *
 * 注意调用时机：**必须在 hydration 之后**（见 plugins/han-variant.client.ts 的说明）。
 */
export async function syncHanVariant(target: HanTarget | null) {
  if (import.meta.server) return
  // 走 documentElement 而不是 body：<head> 里的 <title> 与 meta 描述同样需要换字形
  const root = document.documentElement
  if (!target) {
    stopObserver()
    walkAndSyncHanVariant(root, null)
    return
  }
  const convert = await loadHanConverter(target)
  walkAndSyncHanVariant(root, convert)
  startObserver(convert)
}
