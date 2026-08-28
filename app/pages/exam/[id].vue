<template>
  <div>
    <ExamPaper v-if="paper" :paper="paper" />
    <div v-else class="min-h-screen py-24 text-center" style="background-color: var(--bg)">
      <div class="text-4xl mb-4">📭</div>
      <p class="text-lg mb-4" style="color: var(--text-secondary)">未找到该试卷</p>
      <NuxtLink to="/exam" class="text-sm font-medium" style="color: var(--primary)">← 返回试卷列表</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { examPapers } from '~/data/exam'

const route = useRoute()
const paper = computed(() => {
  const id = (route.params.id as string || '').toLowerCase()
  return examPapers.find(p => p.id.toLowerCase() === id) || null
})
</script>
