<template>
  <div>
    <ExamPaper v-if="paper" :paper="paper" />
    <div v-else-if="pending" class="min-h-screen py-24 text-center" style="background-color: var(--bg)">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-lg mb-4" style="color: var(--text-secondary)">加载中…</p>
    </div>
    <div v-else class="min-h-screen py-24 text-center" style="background-color: var(--bg)">
      <div class="text-4xl mb-4">📭</div>
      <p class="text-lg mb-4" style="color: var(--text-secondary)">未找到该试卷</p>
      <NuxtLink to="/exam" class="text-sm font-medium" style="color: var(--primary)">← 返回试卷列表</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExamPaper } from '~/types/exam'

// 试卷数据由服务端受保护接口下发（不在前端 bundle 中）
const route = useRoute()
const paperId = (route.params.id as string) || ''
const { data: paper, pending } = await useAsyncData<ExamPaper | null>(
  'internal-exam-' + paperId,
  () =>
    $fetch('/api/internal/papers/' + paperId, {
      // SSR 时转发 cookie，确保服务端渲染也能通过鉴权
      headers: useRequestHeaders(['cookie']),
    }).catch(() => null),
)
</script>
