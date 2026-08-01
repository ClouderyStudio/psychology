<template>
  <footer class="mt-auto" style="background-color: var(--card-bg); border-top: 1px solid var(--primary-light);">
    <div class="container mx-auto px-4 py-12">

      <!-- 主要 Footer 内容 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

        <!-- 关于我们 -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
              style="background-color: var(--primary-light);">
              <span class="text-xl">🧠</span>
            </div>
            <span class="font-bold text-lg" style="color: var(--text);">心灵驿站</span>
          </div>
          <p class="text-sm leading-relaxed" style="color: var(--text-secondary);">
            专业的心理健康测评工具，帮助您更好地了解自己的心理状态，提供科学的自我评估参考。
          </p>
        </div>

        <!-- 快速链接 -->
        <div>
          <h3 class="font-semibold text-lg mb-4" style="color: var(--text);">快速链接</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/" class="footer-link" style="color: var(--text-secondary);">首页</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="footer-link" style="color: var(--text-secondary);">关于我们</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/resources" class="footer-link" style="color: var(--text-secondary);">心理资源</NuxtLink>
            </li>
            <!-- <li><a href="#" class="footer-link" style="color: var(--text-secondary);">隐私政策</a></li>
            <li><a href="#" class="footer-link" style="color: var(--text-secondary);">使用条款</a></li> -->
          </ul>
        </div>

        <!-- 测评量表 -->
        <div>
          <h3 class="font-semibold text-lg mb-4" style="color: var(--text);">热门测评</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink to="/test/phq9" class="footer-link" style="color: var(--text-secondary);">PHQ-9 抑郁筛查</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/test/gad7" class="footer-link" style="color: var(--text-secondary);">GAD-7 焦虑筛查</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/test/scl90" class="footer-link" style="color: var(--text-secondary);">SCL-90 症状自评
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/test/mbti" class="footer-link" style="color: var(--text-secondary);">MBTI 人格测试</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 联系方式 -->
        <div>
          <h3 class="font-semibold text-lg mb-4" style="color: var(--text);">联系我们</h3>
          <ul class="space-y-2">
            <li class="flex items-start space-x-2">
              <span class="text-sm" style="color: var(--text-muted);">📧</span>
              <a href="mailto:admin@cldery.com" class="footer-link text-sm" style="color: var(--text-secondary);">
                admin@cldery.com
              </a>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-sm" style="color: var(--text-muted);">⏰</span>
              <span class="text-sm" style="color: var(--text-secondary);">周一至周日 9:00-23:00</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部版权 -->
      <div class="border-t pt-8 text-center" style="border-color: var(--primary-light);">
        <p class="text-sm" style="color: var(--text-muted);">
          &copy; 2026 云术工作室 | 本网站提供的测评结果仅供参考，不能替代专业医疗诊断
        </p>
        <p class="text-xs mt-2" style="color: var(--text-muted);">
          如果您有严重心理困扰，请及时寻求专业心理医生帮助
        </p>
        <p class="text-xs mt-2" style="color: var(--text-muted);">
          本网站由 AnonUsAl、柒屹 在 云竹 和 Olivia 的帮助下开发和维护，数据由公开资源整理而来
        </p>
        <!-- 构建时间 -->
        <ClientOnly>
          <p class="text-xs mt-3" style="color: var(--text-muted);">
            构建时间：{{ buildTime }}
          </p>
        </ClientOnly>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const buildTime = ref('加载中...')

try {
  const { buildInfo } = await import('~/plugins/build-info.client')
  buildTime.value = buildInfo.formattedTime
} catch (e) {
  const now = new Date()
  buildTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}
</script>

<style scoped>
.footer-link {
  transition: color 0.2s ease;
  display: inline-block;
}

.footer-link:hover {
  color: var(--primary);
  transform: translateX(4px);
}

.social-link {
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.social-link:hover {
  color: var(--primary);
  background-color: var(--primary-light);
  transform: translateY(-2px);
}
</style>