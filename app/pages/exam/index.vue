<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg)">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="rounded-2xl overflow-hidden" style="background-color: var(--card-bg); box-shadow: var(--shadow-lg)">

        <!-- 头部 -->
        <div class="p-8 text-center" style="background-color: var(--primary); color: white">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style="background-color: rgba(255, 255, 255, 0.2)">
            <span class="text-4xl">📝</span>
          </div>
          <h1 class="text-3xl font-bold mb-2">内部试卷</h1>
          <p style="color: rgba(255, 255, 255, 0.9)">请选择试卷开始作答</p>
        </div>

        <!-- 试卷列表 -->
        <div class="p-8">
          <div v-if="pending" class="py-16 text-center text-sm" style="color: var(--text-secondary)">加载中…</div>
          <div v-else-if="!examPapers.length" class="py-16 text-center text-sm" style="color: var(--text-secondary)">
            暂无试卷，或访问未授权。
          </div>
          <div v-else class="grid gap-4 sm:grid-cols-2">
            <NuxtLink v-for="paper in examPapers" :key="paper.id" :to="'/exam/' + paper.id.toLowerCase()"
              class="p-6 rounded-xl transition-all block"
              style="background-color: var(--bg);"
              @mouseenter="elStyle($event, { backgroundColor: 'var(--primary-light)', transform: 'translateY(-2px)' })"
              @mouseleave="elStyle($event, { backgroundColor: 'var(--bg)', transform: 'translateY(0)' })">
              <div class="flex items-center justify-between mb-3">
                <span class="text-2xl font-bold" style="color: var(--primary)">{{ paper.name }}</span>
                <span class="text-xs px-2.5 py-1 rounded-full font-medium"
                  style="background-color: var(--card-bg); color: var(--text-secondary)">
                  {{ paperCount(paper) }} 题
                </span>
              </div>
              <p class="text-sm leading-relaxed" style="color: var(--text-secondary)">
                {{ paper.sections.map(s => s.title.replace(/^[一二三四五六七八九十]+、/, '')).join(' · ') }}
              </p>
              <p class="text-sm mt-3 font-medium" style="color: var(--primary)">
                进入作答 →
              </p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExamPaper } from '~/types/exam'

useHead({
  title: '内部试卷 - 心灵驿站'
})

// 试卷数据由服务端受保护接口下发（不在前端 bundle 中）
const { data: papersData, pending } = await useAsyncData('internal-exam-papers', () =>
  $fetch('/api/internal/papers', {
    // SSR 时转发 cookie，确保服务端渲染也能通过鉴权
    headers: useRequestHeaders(['cookie']),
  }).catch(() => [])
)
const examPapers = computed<ExamPaper[]>(() => (papersData.value as ExamPaper[]) || [])

const paperCount = (paper: ExamPaper) =>
  paper.sections.reduce((sum, section) => sum + section.questions.length, 0)
</script>
