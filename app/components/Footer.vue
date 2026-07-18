<template>
  <footer
    class="mt-auto"
    style="
      background-color: var(--card-bg);
      border-top: 1px solid var(--primary-light);
    "
  >
    <div class="container mx-auto px-4 py-12">
      <!-- 主要 Footer 内容 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- 关于我们 -->
        <div>
          <div class="flex items-center space-x-2 mb-4">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center"
              style="background-color: var(--primary-light)"
            >
              <span class="text-xl">🧠</span>
            </div>
            <span class="font-bold text-lg" style="color: var(--text)"
              >心灵驿站</span
            >
          </div>
          <p
            class="text-sm leading-relaxed"
            style="color: var(--text-secondary)"
          >
            专业的心理健康测评工具，帮助您更好地了解自己的心理状态，提供科学的自我评估参考。
          </p>
          <div class="flex space-x-4 mt-4">
            <a href="#" class="social-link" style="color: var(--text-muted)">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                />
              </svg>
            </a>
            <a href="#" class="social-link" style="color: var(--text-muted)">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.193-12.1c0-.21-.005-.423-.015-.634A10.012 10.012 0 0024 4.59z"
                />
              </svg>
            </a>
            <a href="#" class="social-link" style="color: var(--text-muted)">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- 快速链接 -->
        <div>
          <h3 class="font-semibold text-lg mb-4" style="color: var(--text)">
            快速链接
          </h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/"
                class="footer-link"
                style="color: var(--text-secondary)"
                >首页</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/about"
                class="footer-link"
                style="color: var(--text-secondary)"
                >关于我们</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/resources"
                class="footer-link"
                style="color: var(--text-secondary)"
                >心理资源</NuxtLink
              >
            </li>
            <!-- <li><a href="#" class="footer-link" style="color: var(--text-secondary);">隐私政策</a></li>
            <li><a href="#" class="footer-link" style="color: var(--text-secondary);">使用条款</a></li> -->
          </ul>
        </div>

        <!-- 测评量表 -->
        <div>
          <h3 class="font-semibold text-lg mb-4" style="color: var(--text)">
            热门测评
          </h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/test/phq9"
                class="footer-link"
                style="color: var(--text-secondary)"
                >PHQ-9 抑郁筛查</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/test/gad7"
                class="footer-link"
                style="color: var(--text-secondary)"
                >GAD-7 焦虑筛查</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/test/scl90"
                class="footer-link"
                style="color: var(--text-secondary)"
                >SCL-90 症状自评
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/test/mbti"
                class="footer-link"
                style="color: var(--text-secondary)"
                >MBTI 人格测试</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- 联系方式 -->
        <div>
          <h3 class="font-semibold text-lg mb-4" style="color: var(--text)">
            联系我们
          </h3>
          <ul class="space-y-2">
            <li class="flex items-start space-x-2">
              <span class="text-sm" style="color: var(--text-muted)">📧</span>
              <a
                href="mailto:admin@cldery.com"
                class="footer-link text-sm"
                style="color: var(--text-secondary)"
              >
                admin@cldery.com
              </a>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-sm" style="color: var(--text-muted)">⏰</span>
              <span class="text-sm" style="color: var(--text-secondary)"
                >周一至周日 9:00-23:00</span
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- 底部版权 -->
      <div
        class="border-t pt-8 text-center"
        style="border-color: var(--primary-light)"
      >
        <p class="text-sm" style="color: var(--text-muted)">
          &copy; 2026 云术工作室 |
          本网站提供的测评结果仅供参考，不能替代专业医疗诊断
        </p>
        <p class="text-xs mt-2" style="color: var(--text-muted)">
          如果您有严重心理困扰，请及时寻求专业心理医生帮助
        </p>
        <p class="text-xs mt-2" style="color: var(--text-muted)">
          本网站由柒屹在云竹的帮助下开发和维护，数据由公开资源整理而来
        </p>
        <!-- 构建时间 -->
        <ClientOnly>
          <p class="text-xs mt-3" style="color: var(--text-muted)">
            构建时间：{{ buildTime }}
          </p>
        </ClientOnly>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const buildTime = ref("加载中...");

try {
  const { buildInfo } = await import("~/plugins/build-info.client");
  buildTime.value = buildInfo.formattedTime;
} catch (e) {
  const now = new Date();
  buildTime.value = now.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
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
