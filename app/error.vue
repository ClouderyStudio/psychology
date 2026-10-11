<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-16"
    style="background-color: var(--bg); color: var(--text);">
    <div class="w-full max-w-lg rounded-xl overflow-hidden text-center"
      style="background-color: var(--card-bg); box-shadow: var(--shadow-lg);">
      <div class="h-2" :style="{ backgroundColor: isNotFound ? 'var(--primary)' : 'var(--danger)' }"></div>
      <div class="p-8">
        <div class="text-6xl mb-4" aria-hidden="true">{{ isNotFound ? '🧭' : '😵' }}</div>
        <div class="text-5xl font-black mb-2" style="color: var(--text-muted);">{{ statusCode }}</div>
        <h1 class="text-xl font-bold mb-3">
          {{ isNotFound ? '没有找到这个页面' : '页面出错了' }}
        </h1>
        <p class="text-sm leading-relaxed mb-6" style="color: var(--text-secondary);">
          {{ friendlyMessage }}
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button @click="goHome"
            class="px-5 py-2.5 rounded-lg font-semibold transition-all"
            style="background-color: var(--primary); color: white;">
            回到首页
          </button>
          <button v-if="!isNotFound" @click="retry"
            class="px-5 py-2.5 rounded-lg font-semibold transition-all"
            style="background-color: var(--bg); color: var(--text); box-shadow: var(--shadow-sm);">
            重试
          </button>
        </div>

        <!-- 技术细节折叠收起：既能自助排查，又不把堆栈糊到普通用户脸上 -->
        <details v-if="technicalMessage" class="mt-6 text-left">
          <summary class="text-xs cursor-pointer" style="color: var(--text-muted);">技术细节</summary>
          <pre class="mt-2 p-3 rounded-lg text-xs overflow-auto max-h-48 whitespace-pre-wrap break-all"
            style="background-color: var(--bg); color: var(--text-secondary);">{{ technicalMessage }}</pre>
        </details>

        <p class="text-xs mt-6" style="color: var(--text-muted);">
          如果持续出现，请把上面的技术细节反馈给我们。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 全局错误页：接管 404 / 500 以及渲染期抛出的异常。
// 缺了它，Nuxt 会落到内置的英文错误页，与本站在字体、主题、文案上完全脱节。
const props = defineProps<{ error: { statusCode?: number, statusMessage?: string, message?: string } }>()

const statusCode = computed(() => props.error?.statusCode || 500)
const isNotFound = computed(() => statusCode.value === 404)

const friendlyMessage = computed(() => {
  if (isNotFound.value) {
    return '这个地址可能已经失效，或者链接输错了。你可以在首页重新选择一份量表开始测评。'
  }
  if (statusCode.value === 403) return '你没有访问这个页面的权限。'
  return '服务暂时出了点问题，稍后重试通常就能恢复。你的答题进度保存在本机，不会丢失。'
})

const technicalMessage = computed(() => {
  const e = props.error
  if (!e) return ''
  return [e.statusMessage, e.message].filter(Boolean).join(' — ')
})

// clearError 会清空当前错误状态，随后才允许跳转
async function goHome() {
  await clearError({ redirect: '/' })
}

async function retry() {
  const path = useRoute().fullPath
  await clearError({ redirect: path })
}
</script>
