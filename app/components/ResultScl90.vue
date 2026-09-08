<template>
  <div class="mt-6 p-4 rounded-lg" style="background-color: var(--bg);">
    <h3 class="font-bold text-lg mb-4 flex items-center" style="color: var(--text);">
      <span class="text-2xl mr-2">📊</span>
      SCL-90 各维度评分详情
    </h3>
    <div class="space-y-3">
      <div v-for="dim in dimensionList" :key="dim.key" class="p-3 rounded-lg"
        :style="{ backgroundColor: 'var(--card-bg)' }">
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-2">
            <span>{{ dim.icon }}</span>
            <span class="font-medium" style="color: var(--text);">{{ dim.name }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm" style="color: var(--text-secondary);">均分: {{ getDimAverage(dim.key) }}</span>
            <span class="text-xs px-2 py-1 rounded-full" :class="getLevelClass(getDimLevel(dim.key))">
              {{ getDimLevel(dim.key) }}
            </span>
          </div>
        </div>
        <div class="w-full rounded-full h-2" style="background-color: var(--primary-light);">
          <div class="rounded-full h-2 transition-all duration-500"
            :style="{ width: getDimPercentage(dim.key) + '%', backgroundColor: getLevelColor(getDimLevel(dim.key)) }">
          </div>
        </div>
        <p class="text-xs mt-2" style="color: var(--text-muted);">{{ getDimDescription(dim.key) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ scores: any }>()

const dimensionList = [
  { key: 'somatization', name: '躯体化', icon: '💪' },
  { key: 'obsessive', name: '强迫症状', icon: '🔄' },
  { key: 'interpersonal', name: '人际关系敏感', icon: '👥' },
  { key: 'depression', name: '抑郁', icon: '😔' },
  { key: 'anxiety', name: '焦虑', icon: '😰' },
  { key: 'hostility', name: '敌对', icon: '😠' },
  { key: 'phobic', name: '恐怖', icon: '😨' },
  { key: 'paranoid', name: '偏执', icon: '🔍' },
  { key: 'psychotic', name: '精神病性', icon: '🧠' },
  { key: 'additional', name: '其他', icon: '📋' },
]

const getDim = (key: string) => (props.scores || {})[key]

const getDimAverage = (key: string) => {
  const d = getDim(key)
  return d && typeof d.average === 'number' ? d.average.toFixed(2) : '0.00'
}

const getDimLevel = (key: string) => (getDim(key)?.level as string) || '未知'

const getDimDescription = (key: string) => (getDim(key)?.description as string) || ''

const getDimPercentage = (key: string) => {
  const d = getDim(key)
  return d && typeof d.average === 'number' ? (d.average / 5) * 100 : 0
}

const getLevelClass = (level: string) => {
  const classes: Record<string, string> = {
    '很低': 'bg-green-100 text-green-700',
    '较低': 'bg-blue-100 text-blue-700',
    '中等': 'bg-yellow-100 text-yellow-700',
    '较高': 'bg-orange-100 text-orange-700',
    '很高': 'bg-red-100 text-red-700',
  }
  return classes[level] || 'bg-gray-100 text-gray-700'
}

const getLevelColor = (level: string) => {
  const colors: Record<string, string> = {
    '很低': '#10b981',
    '较低': '#3b82f6',
    '中等': '#eab308',
    '较高': '#f97316',
    '很高': '#ef4444',
  }
  return colors[level] || '#9ca3af'
}
</script>

<style scoped>
</style>
