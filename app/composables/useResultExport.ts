/**
 * 结果页导出：把结果卡片渲染为 PNG / PDF 下载。
 *
 * - PNG：使用 html2canvas 遍历 DOM 绘制到 canvas。
 *   （最初用 html-to-image 的 SVG foreignObject 方案，但在内嵌浏览器里
 *    对生成的 SVG data URL 解码会长时间挂起，故改用 html2canvas。）
 * - PDF：把同一张 PNG 按 A4 纵向分页写入 jsPDF。
 *
 * 颜色兼容：Tailwind v4 会输出 oklab/oklch 颜色与 `in oklab` 渐变插值，
 * html2canvas 1.x 无法解析。这里在 onclone 阶段把克隆文档中的现代颜色
 * 统一转换为 rgba（用 1×1 canvas 绘制后读回真实像素），并去掉插值关键字。
 *
 * 说明：静态 import 只打进结果页的 chunk，避免 dev 下动态 import 触发
 * Vite 依赖预打包、页面重载而中断导出。
 */
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/** 过滤掉带有 export-ignore 的交互元素（备注编辑区、操作按钮等） */
const EXPORT_IGNORE_CLASS = 'export-ignore'

/** 现代颜色函数 / 渐变插值关键字 */
const MODERN_COLOR_RE = /(?:oklab|oklch|lab|lch|color)\([^()]*\)/g
const HAS_MODERN_COLOR_RE = /(?:oklab|oklch|lab|lch|color)\(/
const INTERPOLATION_RE = /\s+in\s+(?:oklab|oklch|srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020|xyz|xyz-d50|xyz-d65|hsl|hwb|lab|lch)\b/gi

/** 需要后处理的颜色相关属性（长写属性，避免 shorthand 解析问题） */
const COLOR_PROPS = [
  'color',
  'background-color',
  'background-image',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'text-shadow',
  'box-shadow',
  'fill',
  'stroke',
]

export function useResultExport() {
  const exporting = ref<null | 'png' | 'pdf'>(null)

  function timestamp(): string {
    const d = new Date()
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`
  }

  /** 去掉文件名里的非法字符 */
  function sanitize(name: string): string {
    return (name || '测评结果').replace(/[\\/:*?"<>|\n\r\t]/g, '_').trim().slice(0, 60) || '测评结果'
  }

  function download(href: string, filename: string) {
    const a = document.createElement('a')
    a.href = href
    a.download = filename
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  /** 用 1×1 canvas 把任意颜色值解析为 rgba()（可处理 oklab/oklch/color() 与透明度） */
  function makeColorResolver(doc: Document) {
    const canvas = doc.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const cache = new Map<string, string>()

    return (value: string): string => {
      const cached = cache.get(value)
      if (cached) return cached
      let out = value
      const c2d = ctx
      if (c2d) {
        // 绘制 1×1 像素后读回真实 RGBA，可处理 oklab/oklch 等任意颜色写法
        const readRgba = (): string => {
          const d = c2d.getImageData(0, 0, 1, 1).data
          const r = d[0] ?? 0
          const g = d[1] ?? 0
          const b = d[2] ?? 0
          const a = d[3] ?? 255
          return `rgba(${r}, ${g}, ${b}, ${+(a / 255).toFixed(3)})`
        }
        const single = value.match(MODERN_COLOR_RE)
        if (single && single.length === 1 && single[0] === value.trim()) {
          c2d.clearRect(0, 0, 1, 1)
          c2d.fillStyle = value
          c2d.fillRect(0, 0, 1, 1)
          out = readRgba()
        } else {
          // 渐变等复合值：逐个颜色函数替换
          out = value.replace(MODERN_COLOR_RE, (m) => {
            c2d.clearRect(0, 0, 1, 1)
            c2d.fillStyle = '#000'
            c2d.fillStyle = m
            c2d.fillRect(0, 0, 1, 1)
            return readRgba()
          })
        }
        out = out.replace(INTERPOLATION_RE, '')
      }
      cache.set(value, out)
      return out
    }
  }

  /** 在 html2canvas 的克隆文档里把现代颜色改写为 rgba，避免解析失败 */
  function patchCloneColors(doc: Document) {
    const resolve = makeColorResolver(doc)
    const win = doc.defaultView
    if (!win) return
    doc.querySelectorAll<HTMLElement | SVGElement>('*').forEach((el) => {
      const cs = win.getComputedStyle(el as Element)
      for (const prop of COLOR_PROPS) {
        const v = cs.getPropertyValue(prop)
        if (v && HAS_MODERN_COLOR_RE.test(v)) {
          el.style.setProperty(prop, resolve(v))
        }
      }
    })
  }

  /** 把 DOM 节点渲染为 PNG data URL */
  async function capture(node: HTMLElement): Promise<string> {
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      try {
        await document.fonts.ready
      } catch {
        // 字体就绪失败不阻塞导出
      }
    }
    const cardBg = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim()
    // 超长页面按比例降低倍率，避免 canvas 尺寸超限
    const maxSide = 16000
    const tall = Math.max(node.scrollHeight, node.scrollWidth)
    const scale = Math.max(1, Math.min(2, maxSide / Math.max(tall, 1)))
    const canvas = await html2canvas(node, {
      scale,
      backgroundColor: cardBg || '#ffffff',
      useCORS: true,
      logging: false,
      ignoreElements: (el: Element) => el?.classList?.contains(EXPORT_IGNORE_CLASS) ?? false,
      onclone: (doc: Document) => patchCloneColors(doc),
    })
    return canvas.toDataURL('image/png')
  }

  async function exportPng(node: HTMLElement | null | undefined, fileBase: string) {
    if (!node || exporting.value) return false
    exporting.value = 'png'
    const { $toast } = useNuxtApp()
    try {
      $toast.info('正在生成图片，请稍候…', '导出 PNG')
      const dataUrl = await capture(node)
      download(dataUrl, `${sanitize(fileBase)}-${timestamp()}.png`)
      $toast.success('图片已开始下载', '导出完成')
      return true
    } catch (e) {
      console.error('导出 PNG 失败', e)
      $toast.error('导出失败，请稍后重试', '提示')
      return false
    } finally {
      exporting.value = null
    }
  }

  async function exportPdf(node: HTMLElement | null | undefined, fileBase: string) {
    if (!node || exporting.value) return false
    exporting.value = 'pdf'
    const { $toast } = useNuxtApp()
    try {
      $toast.info('正在生成 PDF，请稍候…', '导出 PDF')
      const dataUrl = await capture(node)
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error('图片解码失败'))
        image.src = dataUrl
      })

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const margin = 8
      const contentW = pageW - margin * 2
      const contentH = pageH - margin * 2
      const imgH = (img.height / img.width) * contentW

      // 分页：每页放同一张长图，用负的 y 偏移裁出当前页应显示的片段
      let heightLeft = imgH
      pdf.addImage(dataUrl, 'PNG', margin, margin, contentW, imgH, undefined, 'FAST')
      heightLeft -= contentH
      while (heightLeft > 1) {
        pdf.addPage()
        pdf.addImage(dataUrl, 'PNG', margin, margin - (imgH - heightLeft), contentW, imgH, undefined, 'FAST')
        heightLeft -= contentH
      }

      pdf.save(`${sanitize(fileBase)}-${timestamp()}.pdf`)
      $toast.success('PDF 已开始下载', '导出完成')
      return true
    } catch (e) {
      console.error('导出 PDF 失败', e)
      $toast.error('导出失败，请稍后重试', '提示')
      return false
    } finally {
      exporting.value = null
    }
  }

  return { exporting, exportPng, exportPdf }
}
