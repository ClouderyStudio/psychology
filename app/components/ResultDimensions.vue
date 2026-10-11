<template>
  <div class="rounded-lg p-5" style="background-color: var(--bg);">
    <h3 class="font-bold text-lg mb-1 flex items-center" style="color: var(--text);">
      <span class="text-2xl mr-2">{{ config.icon }}</span>
      {{ config.title }}
    </h3>
    <p v-if="config.subtitle" class="text-sm mb-4" style="color: var(--warning-text);">{{ config.subtitle }}</p>
    <p v-else class="text-sm mb-4" style="color: var(--text-muted);">{{ config.hint }}</p>
    <div class="grid gap-3" :style="{ gridTemplateColumns: config.columns }">
      <div v-for="item in config.items" :key="item.key" class="p-3 rounded-lg" style="background-color: var(--card-bg);">
        <div class="flex items-center justify-between mb-2 gap-2">
          <span class="flex items-center gap-2 font-semibold" style="color: var(--text);">
            <span v-if="item.icon">{{ item.icon }}</span>{{ item.name }}
          </span>
          <span class="text-sm" style="color: var(--text-secondary);">{{ item.display }}</span>
        </div>
        <div class="w-full rounded-full h-2" style="background-color: var(--primary-light);">
          <div class="rounded-full h-2 transition-all duration-500" :style="{ width: item.value + '%', backgroundColor: config.color }"></div>
        </div>
        <div v-if="item.level" class="mt-2 flex items-center gap-2">
          <span class="text-xs px-2 py-0.5 rounded-full" :style="{ backgroundColor: 'var(--primary-light)', color: config.color }">{{ item.level }}</span>
        </div>
        <p v-if="item.desc" class="text-xs mt-2" style="color: var(--text-muted);">{{ item.desc }}</p>
      </div>
    </div>
    <div v-if="config.highlightCard" class="mt-4 p-4 rounded-lg" style="background-color: var(--primary-light);">
      <div class="grid sm:grid-cols-2 gap-3">
        <div>
          <div class="text-xs" style="color: var(--text-muted);">最明显的症状 / 表现</div>
          <div class="font-semibold mt-1" style="color: var(--text);">🔴 {{ config.highlightCard.label }}</div>
          <div class="text-sm mt-1" style="color: var(--primary);">出现频次：{{ config.highlightCard.freq }}</div>
        </div>
        <div>
          <div class="text-xs" style="color: var(--text-muted);">达到“几天以上”的症状数</div>
          <div class="font-semibold mt-1" style="color: var(--text);">{{ config.highlightCard.endorsedCount }} 项</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { buildDimensionConfig } from '~/utils/dimension-configs'

const props = defineProps<{ scores: any; testId: string }>()

const config = computed(() => buildDimensionConfig(props.testId, props.scores || {}))
</script>

<style scoped>
</style>
