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

useHead({
  title: '心理测评中心',
  meta: [
    { name: 'description', content: '专业的心理健康测评工具，提供抑郁、焦虑、压力等专业量表评估' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})

// 尽早初始化主题，避免闪烁
init()
</script>