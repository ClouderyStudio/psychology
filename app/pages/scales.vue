<template>
  <div class="min-h-screen py-12" style="background-color: var(--bg)">
    <div class="container mx-auto px-4 max-w-5xl">
      <!-- 头部 -->
      <div class="rounded-2xl overflow-hidden mb-8" style="background-color: var(--card-bg); box-shadow: var(--shadow-lg)">
        <div class="p-8 text-center" style="background-color: var(--primary); color: white">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style="background-color: rgba(255, 255, 255, 0.2)">
            <span class="text-4xl">🧭</span>
          </div>
          <h1 class="text-3xl font-bold mb-2">量表目录</h1>
          <p style="color: rgba(255, 255, 255, 0.9)">
            全站收录 {{ testList.length }} 张心理测评量表，按类别列出，均可直接开始自评
          </p>
        </div>
      </div>

      <!-- 分类分组清单 -->
      <div v-for="group in groups" :key="group.id" class="rounded-2xl overflow-hidden mb-8"
        style="background-color: var(--card-bg); box-shadow: var(--shadow-md)">
        <div class="px-8 pt-6 pb-4" style="border-bottom: 1px solid var(--border)">
          <h2 class="text-2xl font-bold flex items-center gap-2" style="color: var(--text)">
            <span>{{ group.icon }}</span> {{ group.name }}
            <span class="text-sm font-normal" style="color: var(--text-muted)">{{ group.items.length }} 张</span>
          </h2>
          <p class="text-sm mt-2 leading-relaxed" style="color: var(--text-secondary)">{{ group.intro }}</p>
        </div>

        <ul class="p-8 space-y-4">
          <li v-for="test in group.items" :key="test.id" class="p-5 rounded-lg"
            style="background-color: var(--bg)">
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <NuxtLink :to="'/test/' + test.id" class="text-lg font-semibold scale-link"
                style="color: var(--primary)">{{ test.title }}</NuxtLink>
              <span class="text-xs" style="color: var(--text-muted)">{{ test.englishName }}</span>
            </div>
            <p class="text-sm mt-2 leading-relaxed" style="color: var(--text-secondary)">
              {{ test.description }}
            </p>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs" style="color: var(--text-muted)">
              <span>📝 {{ test.questionsCount }} 题</span>
              <span>⏱️ {{ test.duration }}</span>
              <span v-if="test.timeFrame">🕒 {{ test.timeFrame }}</span>
              <span v-for="tag in test.tags" :key="tag" class="px-2 py-0.5 rounded-full"
                :style="{ backgroundColor: 'var(--' + test.category + '-light)', color: 'var(--' + test.category + ')' }">
                {{ tag }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <!-- 说明 -->
      <div class="p-6 rounded-2xl text-sm leading-relaxed"
        style="background-color: var(--card-bg); color: var(--text-secondary); box-shadow: var(--shadow-sm)">
        <p>
          本页为量表目录，列出各量表的公开来源与用途；所有量表结果仅用于自我了解与筛查参考，
          不构成医学诊断。若结果提示需要关注，请及时联系精神科或心理专业人员。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 量表目录页：直接读取服务端的量表清单（与列表接口同一份数据源），
// 因此构建期预渲染即可产出完整 HTML，不依赖运行时接口。
import { testList } from '~~/server/utils/test-catalog'

const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl || 'https://pt.cldery.com').replace(/\/+$/, '')

useHead({
  title: '量表目录 - 心灵驿站',
  meta: [
    {
      name: 'description',
      content: '心灵驿站收录的全部心理测评量表目录，按症状筛查、人格性格与专项量表分类，均可直接开始自评。',
    },
  ],
  link: [{ rel: 'canonical', href: siteUrl + '/scales' }],
})

// 分类顺序与首页筛选一致；多出的 other 兜底未分类项，避免量表有数目却不上榜
const CATEGORY_META = [
  {
    id: 'symptom',
    name: '症状筛查',
    icon: '🩺',
    intro: '针对抑郁、焦虑、睡眠、成瘾等具体症状的自评筛查工具，多数有公开的界值与分级标准。',
  },
  {
    id: 'personality',
    name: '人格性格',
    icon: '🧩',
    intro: '描述相对稳定的人格特质与倾向，回答的是「更接近哪一类」，不做好坏判定。',
  },
  {
    id: 'special',
    name: '专项量表',
    icon: '🔎',
    intro: '面向特定领域或人群的专项评估工具，通常需要结合具体情境理解结果。',
  },
  {
    id: 'other',
    name: '其他量表',
    icon: '📋',
    intro: '未归入上述分类的量表。',
  },
]

const groups = CATEGORY_META.map((meta) => ({
  ...meta,
  items: testList.filter((test) =>
    meta.id === 'other'
      ? !['symptom', 'personality', 'special'].includes(test.category)
      : test.category === meta.id,
  ),
})).filter((group) => group.items.length > 0)
</script>

<style scoped>
.scale-link {
  text-decoration: none;
}
.scale-link:hover {
  text-decoration: underline;
}
</style>
