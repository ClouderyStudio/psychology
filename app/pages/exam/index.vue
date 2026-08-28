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
          <div class="grid gap-4 sm:grid-cols-2">
            <NuxtLink v-for="paper in examPapers" :key="paper.id" :to="`/exam/${paper.id.toLowerCase()}`"
              class="p-6 rounded-xl transition-all block"
              style="background-color: var(--bg);"
              @mouseenter="e => { e.target.style.backgroundColor = 'var(--primary-light)'; e.target.style.transform = 'translateY(-2px)' }"
              @mouseleave="e => { e.target.style.backgroundColor = 'var(--bg)'; e.target.style.transform = 'translateY(0)' }">
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
import { examPapers, type ExamPaper } from '~/data/exam'

useHead({
  title: '内部试卷 - 心灵驿站'
})

const paperCount = (paper: ExamPaper) =>
  paper.sections.reduce((sum, section) => sum + section.questions.length, 0)
</script>
