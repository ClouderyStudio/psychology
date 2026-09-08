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

const config = useRuntimeConfig()
const examApiBase = (config.public.clouderyApiBase as string) || 'https://localhost:7288'
const route = useRoute()
const paperId = (route.params.id as string) || ''
const { data: paper, pending } = await useAsyncData<ExamPaper | null>(
  'internal-exam-' + paperId,
  () =>
    $fetch<ExamPaper | null>(examApiBase + '/exam/ExamPapers/' + paperId).catch(() => null),
  { server: false } // 只在浏览器直连 ClouderyApi，避免 SSR 服务端请求
)
</script>
