<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-grow">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>
    <Footer />
  </div>
</template>

<script setup>
const { init } = useTheme()
const { init: initFontScale } = useFontScale()
const { init: initFontFamily } = useFontFamily()
const { init: initFontWeight } = useFontWeight()

useHead({
  title: '心灵驿站 | 心理测评中心',
  meta: [
    { name: 'description', content: '专业的心理健康测评工具，提供抑郁、焦虑、压力等专业量表评估' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})

// 尽早初始化主题、字号、字体与字重，避免闪烁
// （首屏更早的一次由 nuxt.config.ts 的内联脚本完成，这里负责同步响应式状态）
init()
initFontScale()
initFontFamily()
initFontWeight()
</script>