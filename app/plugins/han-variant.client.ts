import { syncHanVariant } from '~/utils/hanVariantDom'
import { findHanVariant } from '~/composables/useHanVariant'
import type { HanVariantId } from '~/composables/useHanVariant'

/**
 * 繁简切换的接线：状态变化时把整页文本转过去（或转到另一套繁体、或转回简体）。
 *
 * 时机的关键约束：**必须在 hydration 之后才能动 DOM**。
 * SSR 已经把简体 HTML 发到浏览器并用它做 hydration，如果在挂载前就把文本改成繁体，
 * Vue 的 hydration 会认为文本对不上（开发环境刷一堆 warning，生产环境直接回退成
 * 整棵客户端重渲染，把繁体又冲掉）。所以这里用 app:mounted 作为开关。
 *
 * 代价是「繁体用户首次加载」会有一瞬间的简体（浏览器已绘制 SSR 内容、还没挂载完），
 * 但字典是按需下载且被浏览器缓存的：用户是在本页点击切换到繁体的，等下次再打开时
 * 字典已在缓存里，这一瞬间基本看不见。
 */
export default defineNuxtPlugin((nuxtApp) => {
  const { hanVariant } = useHanVariant()

  let mounted = false

  const apply = (id: HanVariantId) => syncHanVariant(findHanVariant(id).to)

  nuxtApp.hook('app:mounted', () => {
    mounted = true
    // app.vue 的 init() 已在此之前从 localStorage 恢复过状态
    apply(hanVariant.value)
  })

  // 用户在会话中切换时立即生效（此时早已挂载）
  watch(hanVariant, (value) => {
    if (mounted) apply(value)
  })
})
